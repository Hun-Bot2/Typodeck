import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractClaims, rephraseClaims, type Claim } from '../src/evidence';
import { acceptIdea, fetchRepo, type Ingested } from '../src/ingestion';
import type { ModelProvider } from '../src/provider';
import { loadIdeaF4, loadRecordedRepo, recordedRepoFetch } from './fake-fetch';

const record = loadRecordedRepo();

async function recordedIngestion(): Promise<Ingested> {
  return fetchRepo('acme', 'widgets', { fetchImpl: recordedRepoFetch(record) });
}

describe('extractClaims', () => {
  it('marks code claims verified and plain README claims suggestion', async () => {
    const claims = extractClaims(await recordedIngestion());
    assert.ok(claims.length >= 5, `expected >=5 claims, got ${claims.length}`);
    const codeClaims = claims.filter((c) => c.refs[0]?.path.startsWith('src/'));
    assert.ok(codeClaims.length > 0, 'expected claims from code files');
    assert.ok(codeClaims.every((c) => c.kind === 'verified'));
    // A README claim with no code confirmation stays a suggestion.
    const unconfirmed = claims.find((c) => c.text.includes('40 teams use widgets'));
    assert.ok(unconfirmed, 'expected the 40-teams README claim');
    assert.equal(unconfirmed.kind, 'suggestion');
  });

  it('upgrades README claims confirmed by code files to verified', async () => {
    const claims = extractClaims(await recordedIngestion());
    const confirmed = claims.find((c) => c.text.includes('widgetizer renders dashboards'));
    assert.ok(confirmed, 'expected the widgetizer README claim');
    assert.equal(confirmed.kind, 'verified');
    assert.ok(confirmed.refs.length > 0);
  });

  it('never invents numbers: every numeric token comes from source text with refs', async () => {
    const ingested = await recordedIngestion();
    const sourceByPath = new Map(ingested.files.map((f) => [f.path, f.text]));
    const claims = extractClaims(ingested);
    const numeric = claims.filter((c) => c.numbers.length > 0);
    assert.ok(numeric.length >= 2, 'fixture should yield numeric claims');
    for (const claim of numeric) {
      assert.ok(claim.refs.length > 0, `numeric claim ${claim.id} must have a ref`);
      for (const n of claim.numbers) {
        const hit = claim.refs.some((r) => (sourceByPath.get(r.path) ?? '').includes(n));
        assert.ok(hit, `number "${n}" in ${claim.id} not found in its cited source`);
        assert.ok(claim.text.includes(n), `number "${n}" not in claim text`);
      }
    }
  });

  it('marks every idea claim ungrounded with honest idea.txt refs', () => {
    const claims = extractClaims(acceptIdea(loadIdeaF4()));
    assert.ok(claims.length >= 5);
    assert.ok(claims.every((c) => c.kind === 'ungrounded'));
    for (const c of claims) {
      assert.ok(c.refs.length > 0);
      assert.ok(c.refs.every((r) => r.path === 'idea.txt'));
    }
    // Idea numbers are user-supplied, still copied verbatim from the text.
    const idea = loadIdeaF4();
    for (const c of claims) {
      for (const n of c.numbers) assert.ok(idea.includes(n), `number "${n}" not in idea text`);
    }
  });

  it('is deterministic: same bytes -> same claims', async () => {
    const a = extractClaims(await recordedIngestion());
    const b = extractClaims(await recordedIngestion());
    assert.deepEqual(a, b);
  });

  it('copies numbers verbatim without fabricating units', () => {
    const text =
      'The app tracks all 12 storage zones with a 90-second ritual for 40 percent of users after 50 million downloads worldwide. ' +
      'See commit 436bde0cded3 and version v2.1 for the release details and notes.';
    const ingested: Ingested = {
      kind: 'idea',
      files: [{ path: 'idea.txt', bytes: text.length, truncated: false, text, lines: 1 }],
      warnings: [],
      evidence: [{ source: 'idea', path: 'idea.txt' }],
    };
    const claims = extractClaims(ingested);
    assert.equal(claims.length, 2);
    assert.deepEqual(claims[0].numbers, ['12', '90-second', '40 percent', '50 million downloads']);
    // The commit hash contributes no numeric token; the version is copied but never a hero metric.
    assert.deepEqual(claims[1].numbers, ['v2.1']);
    for (const c of claims) {
      for (const n of c.numbers) assert.ok(c.text.includes(n), `number "${n}" not verbatim in ${c.id}`);
    }
  });

  it('captures directly-attached Korean counters verbatim', () => {
    const text =
      '매일 점심 메뉴를 정하는 데 평균 20분을 낭비하고, 한 달에 약 3만원을 충동적으로 쓴다. 식당 5000개 중에서 30초 만에 고른다.';
    const ingested: Ingested = {
      kind: 'idea',
      files: [{ path: 'idea.txt', bytes: text.length, truncated: false, text, lines: 1 }],
      warnings: [],
      evidence: [{ source: 'idea', path: 'idea.txt' }],
    };
    const claims = extractClaims(ingested);
    assert.equal(claims.length, 2);
    assert.deepEqual(claims[0].numbers, ['20분', '3만원']);
    assert.deepEqual(claims[1].numbers, ['5000개', '30초']);
  });

  it('keeps claims from later paragraphs instead of truncating at twelve', () => {
    const claims = extractClaims(acceptIdea(loadIdeaF4()));
    assert.ok(claims.length > 12, `expected >12 claims, got ${claims.length}`);
    const texts = claims.map((c) => c.text).join('\n');
    assert.ok(texts.includes('roadmap'), 'roadmap paragraph dropped');
    assert.ok(texts.includes('grocery chains') || texts.includes('Competition'), 'competition paragraph dropped');
    assert.ok(texts.includes('risks') || texts.includes('risk'), 'risks paragraph dropped');
  });

  it('strips blockquote prefixes from markdown claims', () => {
    // R4: F3 cover quoted '> Day.js ...' with the '>' intact.
    const text = '> Day.js is a minimalist JavaScript library that parses dates fast.\n';
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'README.md', bytes: text.length, truncated: false, text, lines: 2 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'README.md' }],
    };
    assert.deepEqual(
      extractClaims(ingested).map((c) => c.text),
      ['Day.js is a minimalist JavaScript library that parses dates fast.'],
    );
  });
  it('drops linter directives and URL attributions from code comments', () => {
    // R4: F1 theses quoted eslint-disable lines and 'Extracted from <url>'.
    const code = [
      '// eslint-disable-next-line @typescript-eslint/no-restricted-types',
      '// Extracted from https://github.com/acme/type-fest/blob/abc123/index.d.ts',
      '// Tool infers precise types from runtime values.',
    ].join('\n') + '\n';
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'src/tool.ts', bytes: code.length, truncated: false, text: code, lines: 4 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'src/tool.ts' }],
    };
    assert.deepEqual(
      extractClaims(ingested).map((c) => c.text),
      ['Tool infers precise types from runtime values.'],
    );
  });
  it('strips doc-comment markup from kept code lines', () => {
    // R4: F1 thesis kept '[typed array](url)' + backticks from a TSDoc line.
    const code = 'Matches any [typed array](https://developer.mozilla.org/docs/Types), like `Uint8Array` or similar.\n';
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'src/tool.ts', bytes: code.length, truncated: false, text: code, lines: 2 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'src/tool.ts' }],
    };
    assert.deepEqual(
      extractClaims(ingested).map((c) => c.text),
      ['Matches any typed array, like Uint8Array or similar.'],
    );
  });
  it('drops badges, table rows, HTML residue, and relocation notices', () => {
    const files = [
      '[![Build Status](https://img.shields.io/badge/build-passing-green)](https://example.com/builds)',
      '| English | 简体中文 | 日本語 | 한국어 |',
      'src="https://img.shields.io/bundlephobia/minzip/dayjs?style=flat-square"',
      'This repo has moved to https://github.com/other/commander permanently.',
      '**Please file issues/PRs there.**',
    ].join('\n');
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'README.md', bytes: files.length, truncated: false, text: files, lines: 4 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'README.md' }],
    };
    assert.deepEqual(extractClaims(ingested), []);
  });

  it('ends numeric tokens at digits, never at commas', () => {
    const text = 'Schedule dayjs().startOf(\'month\').add(1, \'day\').set(\'year\', 2026) for 1,000 users total.';
    const ingested: Ingested = {
      kind: 'idea',
      files: [{ path: 'idea.txt', bytes: text.length, truncated: false, text, lines: 1 }],
      warnings: [],
      evidence: [{ source: 'idea', path: 'idea.txt' }],
    };
    const claims = extractClaims(ingested);
    assert.equal(claims.length, 1);
    assert.deepEqual(claims[0].numbers, ['1', '2026', '1,000 users']);
  });

  it('drops license boilerplate instead of claiming it', () => {
    const text =
      'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, ' +
      'INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PURPOSE.\n' +
      'Copyright (c) 2008-2013 TJ Holowaychuk.\n' +
      'without limitation the rights to use, copy, modify, merge, publish, and distribute.';
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'README.md', bytes: text.length, truncated: false, text, lines: 3 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'README.md' }],
    };
    assert.deepEqual(extractClaims(ingested), []);
  });

  it('drops wrapped legalese lines from a marker-dense code header', () => {
    // F2 residual: wrapped MIT header lines carry no license keyword each.
    const header = [
      '# Copyright (c) 2008 TJ Holowaychuk',
      '# Permission is hereby granted, free of charge, to any person',
      '# The above copyright notice and this permission notice shall be',
      '# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,',
      '# distribute, sublicense, and/or sell copies of the Software, and to',
      '# the following conditions:',
    ].join('\n');
    const code = `${header}\n${'# filler comment\n'.repeat(24)}# Commander helps you build ruby command line tools.\n`;
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [
        { path: 'lib/tool.rb', bytes: code.length, truncated: false, text: code, lines: code.split('\n').length },
        { path: 'README.md', bytes: 40, truncated: false, text: 'The widget engine renders slides fast.\n', lines: 2 },
      ],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'lib/tool.rb' }],
    };
    const texts = extractClaims(ingested).map((c) => c.text);
    assert.ok(!texts.some((t) => /sublicense|copies of the software|following conditions/i.test(t)), `header leaked: ${texts}`);
    assert.ok(texts.includes('Commander helps you build ruby command line tools.'), `post-header comment lost: ${texts}`);
  });
  it('drops code operator lines that survive comment stripping', () => {
    // F2 residual: boolean/comparison logic is code, never narrative.
    const code = 'module Tool\n  VERSION = "1.0"\n  defined?(RUBY_ENGINE) && (RUBY_ENGINE == \'jruby\')\n  # Tool renders slides fast.\nend\n';
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'lib/tool.rb', bytes: code.length, truncated: false, text: code, lines: 5 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'lib/tool.rb' }],
    };
    const texts = extractClaims(ingested).map((c) => c.text);
    assert.ok(!texts.some((t) => /defined\?|RUBY_ENGINE/.test(t)), `operator line leaked: ${texts}`);
    assert.ok(texts.includes('Tool renders slides fast.'), `comment lost: ${texts}`);
  });
  it('drops license headers in code comments too', () => {
    const text = '# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES.\n# The packer arranges panels without overlap every time.';
    const ingested: Ingested = {
      kind: 'repo',
      owner: 'acme', repo: 'widgets', branch: 'main', sha: null,
      files: [{ path: 'lib/pack.rb', bytes: text.length, truncated: false, text, lines: 2 }],
      degraded: false, warnings: [],
      evidence: [{ source: 'repo', owner: 'acme', repo: 'widgets', branch: 'main', sha: null, path: 'lib/pack.rb' }],
    };
    const claims = extractClaims(ingested);
    assert.equal(claims.length, 1);
    assert.ok(claims[0].text.includes('packer'));
  });

  it('assigns unique ids and atomic (bounded-length) texts', async () => {
    const claims = extractClaims(await recordedIngestion());
    const ids = new Set(claims.map((c) => c.id));
    assert.equal(ids.size, claims.length);
    for (const c of claims) {
      assert.ok(c.text.length >= 20 && c.text.length <= 280, `claim ${c.id} length ${c.text.length}`);
    }
  });
});

describe('rephraseClaims', () => {
  const claims: Claim[] = [
    { id: 'c1', text: 'Renders panels in under 120ms on modest hardware.', kind: 'verified', refs: [{ path: 'src/index.js', lines: [3, 3] }], numbers: ['120ms'] },
  ];

  it('preserves refs and numbers when the provider paraphrases cleanly', async () => {
    const provider: ModelProvider = {
      id: 'test',
      complete: async () => ({ text: 'Panel rendering stays under 120ms on modest hardware.', meta: { provider: 'test' } }),
    };
    const out = await rephraseClaims(claims, provider);
    assert.equal(out[0].text, 'Panel rendering stays under 120ms on modest hardware.');
    assert.deepEqual(out[0].refs, claims[0].refs);
    assert.deepEqual(out[0].numbers, ['120ms']);
  });

  it('keeps the original when the provider drops or alters numbers', async () => {
    const provider: ModelProvider = {
      id: 'test',
      complete: async () => ({ text: 'Panel rendering is very fast on modest hardware.', meta: { provider: 'test' } }),
    };
    const out = await rephraseClaims(claims, provider);
    assert.equal(out[0].text, claims[0].text);
  });
});
