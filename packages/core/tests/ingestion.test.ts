import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  acceptIdea,
  fetchRepo,
  IngestionError,
  MAX_CODE_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
} from '../src/ingestion';
import {
  abortAwareHungFetch,
  loadIdeaF4,
  loadRecordedRepo,
  recordedRepoFetch,
} from './fake-fetch';

const record = loadRecordedRepo();

describe('fetchRepo (offline, recorded fixture)', () => {
  it('fetches README + docs + code sample with evidence pointers', async () => {
    const ing = await fetchRepo('acme', 'widgets', { fetchImpl: recordedRepoFetch(record) });
    assert.equal(ing.kind, 'repo');
    assert.equal(ing.branch, 'main');
    assert.equal(ing.sha, record.treeSha);
    assert.equal(ing.degraded, false);
    // README first, then docs (sorted), then code (shallow/small first).
    assert.deepEqual(
      ing.files.map((f) => f.path),
      ['README.md', 'docs/api.md', 'docs/guide.md', 'src/pack.js', 'src/index.js'],
    );
    assert.equal(ing.evidence.length, ing.files.length);
    assert.ok(ing.evidence.every((e) => e.source === 'repo' && e.sha === record.treeSha));
    for (const f of ing.files) {
      assert.equal(f.bytes, Buffer.byteLength(f.text, 'utf8'));
      assert.equal(f.truncated, false);
      assert.ok(f.lines > 0);
    }
  });

  it('enforces the 20-file cap with a warning', async () => {
    const extra = Array.from({ length: 30 }, (_, i) => ({ path: `docs/extra-${i}.md`, size: 500 }));
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { extraTree: extra }),
    });
    assert.equal(ing.files.length, MAX_FILES);
    assert.ok(ing.warnings.some((w) => w.includes('file cap')));
  });

  it('caps the code sample at 5 files', async () => {
    const tree = [
      { path: 'README.md', size: 500 },
      ...Array.from({ length: 10 }, (_, i) => ({ path: `src/mod${i}.js`, size: 500 })),
    ];
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { treeOverride: tree }),
    });
    const codeFiles = ing.files.filter((f) => f.path.startsWith('src/'));
    assert.ok(codeFiles.length <= 5, `got ${codeFiles.length} code files`);
    assert.ok(ing.files.some((f) => f.path === 'README.md'));
  });

  it('excludes test/spec files from the code sample', async () => {
    const tree = [
      { path: 'README.md', size: 500 },
      { path: 'src/index.js', size: 500 },
      { path: 'test/type-tests.ts', size: 500 },
      { path: 'src/index.test.ts', size: 500 },
      { path: 'spec/runner_spec.rb', size: 500 },
    ];
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { treeOverride: tree }),
    });
    assert.deepEqual(ing.files.map((f) => f.path).sort(), ['README.md', 'src/index.js']);
  });

  it('truncates code files larger than 10KB and flags them', async () => {
    const big = `// big module\n${'const x = 1;\n'.repeat(2000)}`; // ~26KB
    assert.ok(big.length > MAX_CODE_FILE_BYTES);
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { blobOverrides: { 'src/index.js': big } }),
    });
    const file = ing.files.find((f) => f.path === 'src/index.js');
    assert.ok(file);
    assert.equal(file.truncated, true);
    assert.ok(file.bytes <= MAX_CODE_FILE_BYTES + 64);
    assert.ok(ing.warnings.some((w) => w.includes('src/index.js')));
  });

  it('enforces the 200KB total budget', async () => {
    const tree = [
      { path: 'README.md', size: 100 },
      ...Array.from({ length: 6 }, (_, i) => ({ path: `docs/big-${i}.md`, size: 50 * 1024 })),
    ];
    const overrides: Record<string, string> = {
      'README.md': '# Title\n\nA calm README sentence with enough words to be readable here.\n',
    };
    for (let i = 0; i < 6; i++) {
      overrides[`docs/big-${i}.md`] = `# Doc ${i}\n\n${'A calm filler sentence with enough words to count as text. '.repeat(900)}\n`;
    }
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { treeOverride: tree, blobOverrides: overrides }),
    });
    const total = ing.files.reduce((a, f) => a + f.bytes, 0);
    assert.ok(total <= MAX_TOTAL_BYTES, `total ${total} exceeds budget`);
    assert.ok(ing.files.some((f) => f.truncated) || ing.warnings.length > 0);
  });

  it('retries once after 403 and then succeeds', async () => {
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { blobStatus: 403, failFirstNBlobRequests: 1 }),
      retryDelayMs: 1,
    });
    assert.equal(ing.degraded, false);
    assert.ok(ing.files.length > 0);
  });

  it('degrades to README-only on persistent 403 after README', async () => {
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, {
        blobStatus: 403,
        blobStatusWhen: (p) => p !== 'README.md',
      }),
      retryDelayMs: 1,
    });
    assert.equal(ing.degraded, true);
    assert.deepEqual(ing.files.map((f) => f.path), ['README.md']);
    assert.ok(ing.warnings.some((w) => w.includes('README-only')));
  });

  it('throws a typed error when rate-limited before README', async () => {
    await assert.rejects(
      fetchRepo('acme', 'widgets', {
        fetchImpl: recordedRepoFetch(record, { blobStatus: 429 }),
        retryDelayMs: 1,
      }),
      (e: unknown) => e instanceof IngestionError && e.code === 'rate-limited',
    );
  });

  it('rejects private repos explicitly', async () => {
    await assert.rejects(
      fetchRepo('acme', 'widgets', {
        fetchImpl: recordedRepoFetch(record, { metaOverride: { default_branch: 'main', private: true } }),
      }),
      (e: unknown) => e instanceof IngestionError && e.code === 'private-repo',
    );
  });

  it('rejects invalid owner/repo and missing repos with typed errors', async () => {
    await assert.rejects(
      fetchRepo('acme/../x', 'widgets', { fetchImpl: recordedRepoFetch(record) }),
      (e: unknown) => e instanceof IngestionError && e.code === 'invalid-input',
    );
    await assert.rejects(
      fetchRepo('acme', 'widgets', {
        fetchImpl: recordedRepoFetch(record, { metaStatus: 404 }),
      }),
      (e: unknown) => e instanceof IngestionError && e.code === 'not-found',
    );
  });

  it('times out hung requests with a typed error', async () => {
    await assert.rejects(
      fetchRepo('acme', 'widgets', { fetchImpl: abortAwareHungFetch(), timeoutMs: 30 }),
      (e: unknown) => e instanceof IngestionError && e.code === 'timeout',
    );
  });
});

describe('acceptIdea', () => {
  it('accepts text within 100–20000 chars as idea.txt', () => {
    const text = loadIdeaF4();
    assert.ok(text.length >= 100 && text.length <= 20000);
    const ing = acceptIdea(text);
    assert.equal(ing.kind, 'idea');
    assert.deepEqual(ing.files.map((f) => f.path), ['idea.txt']);
    assert.deepEqual(ing.evidence, [{ source: 'idea', path: 'idea.txt' }]);
  });

  it('rejects too-short and too-long text with typed errors', () => {
    assert.throws(
      () => acceptIdea('too short'),
      (e: unknown) => e instanceof IngestionError && e.code === 'idea-length',
    );
    assert.throws(
      () => acceptIdea('x'.repeat(99)),
      (e: unknown) => e instanceof IngestionError && e.code === 'idea-length',
    );
    assert.throws(
      () => acceptIdea('x'.repeat(20001)),
      (e: unknown) => e instanceof IngestionError && e.code === 'idea-length',
    );
  });
});
