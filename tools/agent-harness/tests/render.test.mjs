// Chrome launch retry: bounded attempts on ascending ports (stubbed launcher,
// no real Chrome needed). Guards the sweep against a previous Chrome still
// releasing the base debug port.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { launchChromeWithRetry, CHROME_LAUNCH_ATTEMPTS, waitForDebugPort } from '../lib/render.mjs';

const chrome = { stop: async () => {} };

test('launch retry uses the base port when it works', async () => {
  const seen = [];
  const r = await launchChromeWithRetry(9333, {
    backoffMs: 0,
    launch: async (port) => { seen.push(port); return chrome; },
  });
  assert.equal(r.port, 9333);
  assert.equal(r.chrome, chrome);
  assert.deepEqual(seen, [9333]);
});

test('launch retry steps to +1 per failed attempt', async () => {
  const seen = [];
  let n = 0;
  const r = await launchChromeWithRetry(9333, {
    backoffMs: 0,
    launch: async (port) => {
      seen.push(port);
      n += 1;
      if (n < 3) throw new Error('chrome did not start a debug endpoint in 25s');
      return chrome;
    },
  });
  assert.equal(r.port, 9335);
  assert.deepEqual(seen, [9333, 9334, 9335]);
});

test('launch retry throws the last error when attempts are exhausted', async () => {
  const seen = [];
  await assert.rejects(
    () => launchChromeWithRetry(9333, {
      backoffMs: 0,
      launch: async (port) => { seen.push(port); throw new Error(`busy ${port}`); },
    }),
    /busy 9335/,
  );
  assert.equal(seen.length, CHROME_LAUNCH_ATTEMPTS);
  assert.deepEqual(seen, [9333, 9334, 9335]);
});

test('launch retry honors a custom attempts count', async () => {
  const seen = [];
  await assert.rejects(
    () => launchChromeWithRetry(9400, {
      attempts: 1,
      backoffMs: 0,
      launch: async (port) => { seen.push(port); throw new Error('nope'); },
    }),
    /nope/,
  );
  assert.deepEqual(seen, [9400]);
});

function fakeEndpoint() {
  const server = http.createServer((req, res) => {
    if (req.url === '/json/version') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"Browser":"Fake/1.0"}');
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({
      port: server.address().port,
      close: () => new Promise((r) => server.close(r)),
    }));
  });
}

const liveChild = () => ({ exitCode: null, signalCode: null });
const deadChild = () => ({ exitCode: 1, signalCode: null });

test('debug port claim succeeds when endpoint answers and child is alive', async (t) => {
  const ep = await fakeEndpoint();
  t.after(() => ep.close());
  await waitForDebugPort(ep.port, liveChild(), { graceMs: 5 });
});

test('debug port claim rejects a foreign endpoint (our child exited)', async (t) => {
  const ep = await fakeEndpoint();
  t.after(() => ep.close());
  await assert.rejects(
    () => waitForDebugPort(ep.port, deadChild(), { graceMs: 5 }),
    /held by another process/,
  );
});

test('debug port claim fails fast when the child exits before serving', async () => {
  await assert.rejects(
    () => waitForDebugPort(1, deadChild(), { timeoutMs: 5000, graceMs: 1 }),
    /exited during startup/,
  );
});

test('debug port claim times out when nothing serves', async () => {
  await assert.rejects(
    () => waitForDebugPort(1, liveChild(), { timeoutMs: 300, graceMs: 1 }),
    /did not start a debug endpoint/,
  );
});
