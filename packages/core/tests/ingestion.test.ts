import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  acceptIdea,
  createMemoryCache,
  fetchRepo,
  githubBlobUrl,
  IngestionError,
  MAX_CODE_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  parseRepoInput,
  type FetchImpl,
} from '../src/ingestion';
import {
  abortAwareHungFetch,
  loadIdeaF4,
  loadRecordedRepo,
  recordedRepoFetch,
} from './fake-fetch';

const record = loadRecordedRepo();

describe('fetchRepo (offline, recorded fixture)', () => {
  it('skips license files and GitHub meta-templates before fetching', async () => {
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, {
        extraTree: [
          { path: 'LICENSE', size: 1000 },
          { path: '.github/ISSUE_TEMPLATE/bug.md', size: 500 },
          { path: 'CONTRIBUTING.md', size: 400 },
          { path: 'docs/notes.md', size: 100 },
        ],
        blobOverrides: {
          LICENSE: 'MIT license text '.repeat(60),
          '.github/ISSUE_TEMPLATE/bug.md': 'Bug report form '.repeat(30),
          'CONTRIBUTING.md': 'Contributor guide text '.repeat(30),
          'docs/notes.md': 'Release notes live here for the whole team today.',
        },
      }),
    });
    const paths = ing.files.map((f) => f.path);
    assert.ok(!paths.includes('LICENSE'), `LICENSE ingested: ${paths}`);
    assert.ok(!paths.some((p) => p.includes('ISSUE_TEMPLATE')), `template ingested: ${paths}`);
    assert.ok(!paths.includes('CONTRIBUTING.md'), `process doc ingested: ${paths}`);
    assert.ok(paths.includes('docs/notes.md'), `docs missing: ${paths}`);
  });

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

  it('reports repo-meta 403 with exhausted quota as rate-limited, not network', async () => {
    // The reported hackathon failure: unauthenticated quota 0 makes GitHub
    // answer the meta call with 403 + x-ratelimit-remaining: 0. That must
    // surface as typed rate-limited with the reset time, never "network".
    const reset = String(Math.floor(Date.now() / 1000) + 600);
    await assert.rejects(
      fetchRepo('acme', 'widgets', {
        fetchImpl: recordedRepoFetch(record, {
          metaStatus: 403,
          metaHeaders: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': reset },
        }),
        retryDelayMs: 1,
      }),
      (e: unknown) => {
        assert.ok(e instanceof IngestionError);
        assert.equal(e.code, 'rate-limited');
        assert.ok(e.message.includes('rate limit'), `message hid the cause: ${e.message}`);
        const info = (e as unknown as { rateLimit?: { resetAt?: string } }).rateLimit;
        assert.ok(info?.resetAt, 'reset time missing from rate-limit info');
        return true;
      },
    );
  });

  it('reports tree 403 as typed rate-limited', async () => {
    await assert.rejects(
      fetchRepo('acme', 'widgets', {
        fetchImpl: recordedRepoFetch(record, {
          treeStatus: 403,
          treeHeaders: { 'x-ratelimit-remaining': '0' },
        }),
        retryDelayMs: 1,
      }),
      (e: unknown) => e instanceof IngestionError && e.code === 'rate-limited',
    );
  });

  it('retries repo-meta once when retry-after is present, then succeeds', async () => {
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, {
        metaStatus: 429,
        metaHeaders: { 'retry-after': '0' },
        failFirstNMetaRequests: 1,
      }),
    });
    assert.ok(ing.files.length > 0);
    assert.equal(ing.degraded, false);
  });

  it('counts API and blob requests on the result', async () => {
    const ing = await fetchRepo('acme', 'widgets', { fetchImpl: recordedRepoFetch(record) });
    // Recorded repo: meta + tree API calls, 5 blob calls, no cache.
    assert.deepEqual(ing.requests, { api: 2, blobs: 5, cached: 0 });
  });

  it('serves repeat ingests from the shared cache without network', async () => {
    const cache = createMemoryCache();
    let calls = 0;
    const inner = recordedRepoFetch(record);
    const counting = (async (...args: Parameters<FetchImpl>) => {
      calls += 1;
      return inner(...args);
    }) as FetchImpl;
    const first = await fetchRepo('acme', 'widgets', { fetchImpl: counting, cache });
    assert.ok(calls > 0);
    assert.deepEqual(first.requests, { api: 2, blobs: 5, cached: 0 });
    calls = 0;
    const second = await fetchRepo('acme', 'widgets', { fetchImpl: counting, cache });
    assert.equal(calls, 0);
    assert.deepEqual(second.requests, { api: 0, blobs: 0, cached: 7 });
    assert.deepEqual(
      second.files.map((f) => f.path),
      first.files.map((f) => f.path),
    );
  });

  it('keeps authed and anonymous cache entries separate', async () => {
    const cache = createMemoryCache();
    let calls = 0;
    const inner = recordedRepoFetch(record);
    const counting = (async (...args: Parameters<FetchImpl>) => {
      calls += 1;
      return inner(...args);
    }) as FetchImpl;
    await fetchRepo('acme', 'widgets', { fetchImpl: counting, cache, authToken: 'secret' });
    assert.ok(calls > 0);
    calls = 0;
    // Same URLs, different auth mode: must hit the network again.
    await fetchRepo('acme', 'widgets', { fetchImpl: counting, cache });
    assert.ok(calls > 0);
  });

  it('warns when GitHub truncates the tree', async () => {
    const ing = await fetchRepo('acme', 'widgets', {
      fetchImpl: recordedRepoFetch(record, { treeTruncated: true }),
    });
    assert.ok(ing.warnings.some((w) => w.includes('truncated the file tree')), `warnings: ${ing.warnings}`);
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

describe('parseRepoInput', () => {
  it('accepts owner/repo shorthand and github.com URLs', () => {
    assert.deepEqual(parseRepoInput('acme/widgets'), { owner: 'acme', repo: 'widgets' });
    assert.deepEqual(parseRepoInput('https://github.com/acme/widgets'), { owner: 'acme', repo: 'widgets' });
    assert.deepEqual(parseRepoInput('https://github.com/acme/widgets.git'), { owner: 'acme', repo: 'widgets' });
    assert.deepEqual(parseRepoInput('https://github.com/acme/widgets/tree/main/docs'), { owner: 'acme', repo: 'widgets' });
    assert.deepEqual(parseRepoInput('  acme/widgets  '), { owner: 'acme', repo: 'widgets' });
  });

  it('rejects non-repo input without guessing', () => {
    for (const bad of ['', 'acme', 'https://example.com/acme/widgets', 'gitlab.com/acme/widgets', 'acme/widgets/extra/deep']) {
      assert.equal(parseRepoInput(bad), null, `accepted: ${bad}`);
    }
  });
});

describe('githubBlobUrl', () => {
  it('links exact line ranges and encodes path segments', () => {
    assert.equal(
      githubBlobUrl('acme', 'widgets', 'main', 'src/pack.js', [2, 2]),
      'https://github.com/acme/widgets/blob/main/src/pack.js#L2',
    );
    assert.equal(
      githubBlobUrl('acme', 'widgets', 'main', 'docs/my notes.md', [4, 9]),
      'https://github.com/acme/widgets/blob/main/docs/my%20notes.md#L4-L9',
    );
    assert.equal(
      githubBlobUrl('acme', 'widgets', 'main', 'README.md'),
      'https://github.com/acme/widgets/blob/main/README.md',
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
