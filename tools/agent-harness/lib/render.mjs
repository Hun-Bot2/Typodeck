// Zero-dependency Chrome renderer over CDP (Node built-in fetch + WebSocket).
// Launches headless Chrome, navigates to a file:// URL, waits for fonts,
// captures a 1920x1080 PNG, and evaluates deterministic layout metrics.

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  `${os.homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
  `${os.homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux/chrome`,
].filter(Boolean);

export async function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    try {
      await fs.access(p);
      return p;
    } catch { /* next */ }
  }
  throw new Error('no Chrome/Chromium binary found (set CHROME_PATH)');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class Cdp {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.addEventListener('message', (ev) => {
        let msg;
        try { msg = JSON.parse(String(ev.data)); } catch { return; }
        if (msg.id !== undefined && this.pending.has(msg.id)) {
          const { resolve: res, reject: rej } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new Error(`CDP: ${msg.error.message}`));
          else res(msg.result);
        } else if (msg.method) {
          this.events.push(msg);
        }
      });
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', (e) => reject(new Error(`CDP ws error: ${e.message ?? 'unknown'}`)));
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 15000).unref?.();
    });
  }

  async waitForEvent(method, timeoutMs = 20000) {
    const t0 = Date.now();
    for (;;) {
      const i = this.events.findIndex((e) => e.method === method);
      if (i >= 0) return this.events.splice(i, 1)[0];
      if (Date.now() - t0 > timeoutMs) throw new Error(`CDP wait timeout: ${method}`);
      await sleep(50);
    }
  }

  close() {
    try { this.ws.close(); } catch { /* closed */ }
  }
}

export const CHROME_LAUNCH_ATTEMPTS = 3;

/**
 * Launch Chrome with bounded retries on ascending ports.
 * Sequential sweep runs reuse one base port while the previous Chrome may
 * still be releasing it (stop() only waits 300ms after SIGTERM), so a
 * first-attempt bind/start failure is retried on base+1, base+2, ... with a
 * short backoff. `launch` is injectable for unit tests.
 * Returns { chrome, port } for the winning port; throws the last error when
 * every attempt fails.
 */
export async function launchChromeWithRetry(basePort, { attempts = CHROME_LAUNCH_ATTEMPTS, launch = launchChrome, backoffMs = 1500 } = {}) {
  let last;
  for (let i = 0; i < attempts; i++) {
    const port = basePort + i;
    try {
      const chrome = await launch(port);
      return { chrome, port };
    } catch (e) {
      last = e;
      if (i + 1 < attempts) await sleep(backoffMs);
    }
  }
  throw last;
}

/**
 * Wait for a debug endpoint on `port`, then verify it belongs to OUR spawned
 * child. A bare "endpoint answers" check can attach to a foreign browser
 * when another sweep holds the port (concurrent runs share the default
 * 9333): our Chrome exits when it cannot bind, so after a grace window we
 * claim the port only if our child is still alive. Throws on timeout,
 * early child exit, or foreign ownership (caller retries on port+1).
 */
export async function waitForDebugPort(port, child, { timeoutMs = 25000, graceMs = 2000 } = {}) {
  const t0 = Date.now();
  for (;;) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch { /* not up yet */ }
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`chrome exited during startup on port ${port}`);
    }
    if (Date.now() - t0 > timeoutMs) {
      throw new Error('chrome did not start a debug endpoint in 25s');
    }
    await sleep(150);
  }
  await sleep(graceMs);
  if (child.exitCode !== null || child.signalCode !== null) {
    throw new Error(`debug port ${port} is held by another process (our Chrome exited)`);
  }
}

export async function launchChrome(port) {
  const exe = await findChrome();
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'td-harness-'));
  const child = spawn(exe, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1920,1080',
    '--allow-file-access-from-files',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
  try {
    await waitForDebugPort(port, child);
  } catch (e) {
    try { child.kill(); } catch { /* already exited */ }
    try { await fs.rm(profile, { recursive: true, force: true }); } catch { /* tmp */ }
    throw e;
  }
  return {
    child,
    profile,
    async stop() {
      child.kill();
      await sleep(300);
      try { await fs.rm(profile, { recursive: true, force: true }); } catch { /* tmp */ }
    },
  };
}

async function pageTarget(port) {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await res.json();
  const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!page) throw new Error('no CDP page target found');
  return page.webSocketDebuggerUrl;
}

/** Metrics expression evaluated in-page. Pure DOM reads, no side effects. */
export const METRICS_JS = `(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const texts = q('[data-t]').map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { key: el.getAttribute('data-t'),
      sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight,
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      oy: cs.overflowY };
  });
  const heads = q('[data-headline]').map((el) => ({
    key: el.getAttribute('data-t') || el.className,
    align: getComputedStyle(el).textAlign }));
  const rounded = q('.slide *').filter((el) => {
    const cs = getComputedStyle(el);
    return cs.borderTopLeftRadius !== '0px' && cs.borderTopLeftRadius !== '0px 0px';
  }).length;
  const rail = document.querySelector('.rail')?.getBoundingClientRect();
  const numeral = document.querySelector('.numeral')?.getBoundingClientRect();
  return {
    doc: { sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight,
      iw: window.innerWidth, ih: window.innerHeight },
    texts, heads, rounded,
    rail: rail ? { x: rail.x, y: rail.y, w: rail.width, h: rail.height } : null,
    numeral: numeral ? { x: numeral.x, y: numeral.y, w: numeral.width, h: numeral.height } : null,
    spec: {
      redrules: q('.content .redrule').length,
      grids: q('.colgrid').length,
      rails: q('.rail').length,
      footers: q('.footer').length,
      fixtures: q('[data-fixture]').length,
    },
    text: document.body.innerText ?? '',
  };
})()`;

/**
 * Render one HTML file: screenshot PNG + in-page metrics.
 * Returns { png: Buffer, metrics }.
 */
export async function renderSlide(port, fileUrl, { settleMs = 1200 } = {}) {
  const wsUrl = await pageTarget(port);
  const cdp = new Cdp(wsUrl);
  await cdp.connect();
  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false,
    });
    await cdp.send('Page.enable');
    await cdp.send('Page.navigate', { url: fileUrl });
    await cdp.waitForEvent('Page.loadEventFired');
    // Wait for webfonts (CDN) with a bounded settle; offline falls back.
    const t0 = Date.now();
    for (;;) {
      const r = await cdp.send('Runtime.evaluate', {
        expression: 'document.fonts ? document.fonts.status : "loaded"',
        returnByValue: true,
      });
      if (r.result?.value === 'loaded' || Date.now() - t0 > 8000) break;
      await sleep(200);
    }
    await sleep(settleMs);
    const m = await cdp.send('Runtime.evaluate', { expression: METRICS_JS, returnByValue: true });
    if (!m.result?.value) throw new Error('metrics evaluation returned nothing');
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    return { png: Buffer.from(shot.data, 'base64'), metrics: m.result.value };
  } finally {
    cdp.close();
  }
}

/** Read PNG width/height from the IHDR chunk (no image deps). */
export function pngDims(buf) {
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) {
    throw new Error('not a PNG buffer');
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
