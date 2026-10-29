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
