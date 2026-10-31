import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rectsOverlap } from '../src/layout';
import { planDeck } from '../src/narrative';
import { validateDeck } from '../src/schema';
import { SYSTEM_IDS } from '../src/systems';
import { loadIdeaF4, loadRecordedRepo, recordedRepoFetch } from './fake-fetch';

const record = loadRecordedRepo();
const idea = loadIdeaF4();

describe('pipeline (planDeck on recorded fixtures, all systems)', () => {
  for (const system of SYSTEM_IDS) {
    it(`repo mode produces a valid, overlap-free, labeled deck for ${system}`, async () => {
      const res = await planDeck(
        { type: 'repo', owner: 'acme', repo: 'widgets' },
        { system, purpose: 'Widgets', lang: 'en', fetchImpl: recordedRepoFetch(record) },
      );
      validateDeck(res.deck); // throws on any violation
      assert.ok(res.deck.slides.length >= 5 && res.deck.slides.length <= 12);
      for (const slide of res.deck.slides) {
        for (let i = 0; i < slide.blocks.length; i++) {
          for (let j = i + 1; j < slide.blocks.length; j++) {
            assert.equal(rectsOverlap(slide.blocks[i], slide.blocks[j]), false, `${slide.id}: overlap`);
          }
        }
      }
      // Fallback labeling end-to-end.
      assert.equal(res.provenance.provider, 'fallback');
      assert.equal(res.deck.meta.generatedBy, 'fallback');
      // No invented numbers: every numeric claim carries a ref into the source.
      for (const c of res.claims.filter((c) => c.numbers.length > 0)) {
        assert.ok(c.refs.length > 0, `${c.id} numeric but ref-less`);
      }
      // Every number slide traces to a numeric claim.
      const numbers = res.deck.slides.flatMap((s) => s.blocks).filter((b) => b.role === 'number');
      assert.ok(numbers.length > 0, 'repo fixture should yield a number slide');
      for (const num of numbers) {
        assert.ok(res.claims.some((c) => c.numbers.includes(num.content)));
      }
    });

    it(`idea mode produces a valid deck with ungrounded labeling for ${system}`, async () => {
      const res = await planDeck(
        { type: 'idea', text: idea },
        { system, purpose: 'Pantrylog', lang: 'en' },
      );
      validateDeck(res.deck);
      assert.ok(res.deck.slides.length >= 5 && res.deck.slides.length <= 12);
      assert.equal(res.provenance.generatedBy, 'fallback');
      assert.ok(res.claims.every((c) => c.kind === 'ungrounded'));
      const captions = res.deck.slides.flatMap((s) => s.blocks).filter((b) => b.role === 'caption');
      assert.ok(captions.length > 0);
      assert.ok(captions.every((c) => /unverified|illustrative|proposal/.test(c.content)));
    });
  }

  it('carries repo provenance on the deck meta', async () => {
    const res = await planDeck(
      { type: 'repo', owner: 'acme', repo: 'widgets' },
      { system: 'swiss', purpose: 'Widgets', lang: 'en', fetchImpl: recordedRepoFetch(record) },
    );
    assert.deepEqual(res.deck.meta.provenance, {
      repo: 'acme/widgets',
      branch: 'main',
      sha: record.treeSha,
    });
  });

  it('applies an evidence selection between extraction and planning', async () => {
    const base = await planDeck(
      { type: 'repo', owner: 'acme', repo: 'widgets' },
      { system: 'swiss', purpose: 'Widgets', lang: 'en', fetchImpl: recordedRepoFetch(record) },
    );
    const sha = base.ingested.kind === 'repo' ? base.ingested.sha : null;
    const drop = base.claims[0].id;
    const reviewed = await planDeck(
      { type: 'repo', owner: 'acme', repo: 'widgets' },
      {
        system: 'swiss',
        purpose: 'Widgets',
        lang: 'en',
        fetchImpl: recordedRepoFetch(record),
        selection: { sha, excluded: [drop] },
      },
    );
    assert.equal(reviewed.claims.length, base.claims.length - 1);
    assert.ok(!reviewed.claims.some((c) => c.id === drop));
    assert.ok(reviewed.provenance.warnings.some((w) => w.includes('excluded during evidence review')));
  });

  it('is deterministic end-to-end for a fixed seed', async () => {
    const opts = (system: (typeof SYSTEM_IDS)[number]) => ({
      system,
      purpose: 'Widgets',
      lang: 'en' as const,
      fetchImpl: recordedRepoFetch(record),
      seed: 42,
    });
    const a = await planDeck({ type: 'repo', owner: 'acme', repo: 'widgets' }, opts('swiss'));
    const b = await planDeck({ type: 'repo', owner: 'acme', repo: 'widgets' }, opts('swiss'));
    assert.equal(JSON.stringify(a.deck), JSON.stringify(b.deck));
  });
});
