import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DeterministicFallback,
  MetaMuseProvider,
  planOutline,
  resolveProvider,
} from '../src/provider';
import { fakeFetch } from './fake-fetch';

describe('provider selection', () => {
  it('defaults to the deterministic fallback when env is empty', () => {
    const p = resolveProvider({});
    assert.equal(p.id, 'fallback');
    assert.ok(p instanceof DeterministicFallback);
  });

  it('stays on fallback when only one Muse env var is set', () => {
    assert.equal(resolveProvider({ TYPOdeck_MUSE_ENDPOINT: 'https://x.example/v1' }).id, 'fallback');
    assert.equal(resolveProvider({ TYPOdeck_MUSE_API_KEY: 'secret' }).id, 'fallback');
    assert.equal(
      resolveProvider({ TYPOdeck_MUSE_ENDPOINT: 'https://x.example/v1', TYPOdeck_MUSE_API_KEY: '  ' }).id,
      'fallback',
    );
  });

  it('activates MetaMuseProvider only when BOTH env vars are set', () => {
    const p = resolveProvider({
      TYPOdeck_MUSE_ENDPOINT: 'https://muse.example/v1/chat',
      TYPOdeck_MUSE_API_KEY: 'secret',
    });
    assert.equal(p.id, 'muse');
    assert.ok(p instanceof MetaMuseProvider);
  });
});

describe('DeterministicFallback', () => {
  it('is deterministic and labels every output as fallback', async () => {
    const p = new DeterministicFallback();
    const a = await p.complete('Brains for rent');
    const b = await p.complete('Brains for rent');
    assert.equal(a.text, b.text);
    assert.equal(a.text, planOutline('Brains for rent'));
    assert.deepEqual(a.meta, { provider: 'fallback', generated_by: 'fallback' });
    assert.match(a.text, /FALLBACK OUTLINE/);
  });
});

describe('MetaMuseProvider', () => {
  const ENDPOINT = 'https://muse.example.net/v1/chat/completions';

  it('POSTs chat-completions JSON and records host/model/latency (never the key)', async () => {
    let seenUrl = '';
    let seenInit: Record<string, unknown> = {};
    const fetchImpl = fakeFetch((url, init) => {
      seenUrl = url;
      seenInit = init as Record<string, unknown>;
      return {
        status: 200,
        body: JSON.stringify({ choices: [{ message: { content: 'hello from muse' } }] }),
      };
    });
    const p = new MetaMuseProvider({ endpoint: ENDPOINT, apiKey: 'sk-SUPERSECRET', model: 'muse-spark', fetchImpl });
    const res = await p.complete('Say hi', 'hint');
    assert.equal(res.text, 'hello from muse');
    assert.equal(seenUrl, ENDPOINT);
    assert.equal((seenInit['method'] as string), 'POST');
    const sentBody = JSON.parse(seenInit['body'] as string) as Record<string, unknown>;
    assert.equal(sentBody['model'], 'muse-spark');
    assert.match(JSON.stringify(sentBody), /Say hi/);
    assert.equal((seenInit['headers'] as Record<string, string>)['authorization'], 'Bearer sk-SUPERSECRET');
    assert.equal(res.meta.provider, 'muse');
    assert.equal(res.meta.endpoint, 'muse.example.net');
    assert.equal(res.meta.model, 'muse-spark');
    assert.ok(typeof res.meta.latencyMs === 'number');
    assert.ok(!JSON.stringify(res.meta).includes('SUPERSECRET'), 'meta must never contain the key');
  });

  it('throws a key-free error on HTTP failure', async () => {
    const fetchImpl = fakeFetch(() => ({ status: 401, body: 'nope' }));
    const p = new MetaMuseProvider({ endpoint: ENDPOINT, apiKey: 'sk-SUPERSECRET', fetchImpl });
    await assert.rejects(() => p.complete('hi'), /HTTP 401/);
    await assert.rejects(() => p.complete('hi')).catch((e: Error) => {
      assert.ok(!e.message.includes('SUPERSECRET'));
    });
  });

  it('throws on timeout without leaking the key', async () => {
    const fetchImpl = fakeFetch((_url, init) => {
      const signal = (init as { signal?: AbortSignal } | undefined)?.signal;
      return new Promise<never>((_resolve, reject) => {
        signal?.addEventListener('abort', () => {
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        });
      });
    });
    const p = new MetaMuseProvider({ endpoint: ENDPOINT, apiKey: 'sk-SUPERSECRET', timeoutMs: 20, fetchImpl });
    await assert.rejects(() => p.complete('hi'), /timed out/);
  });
});
