// Optical Correction Engine tests: bounds, tiers, scorers, validity.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyOpticalCorrections,
  experimentalProposals,
  hangPunctuation,
  opticalCenter,
  ragScore,
  widowRisk,
} from '../src/optical';
import { layoutDeck } from '../src/layout';
import { validateDeck, type Deck } from '../src/schema';

function deckOf(blocks: Array<{ role: 'kicker' | 'title' | 'body' | 'number' | 'caption'; content: string }>, system: 'editorial' | 'swiss' | 'expressive' = 'editorial'): Deck {
  const narrative = {
    title: 't', lang: 'en',
    slides: [
      { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Cover title with substance' }] },
      { id: 'n1-problem', thesis: 'p', blocks },
      { id: 'n2-closing', thesis: 'e', blocks: [{ role: 'title', content: 'Closing line here' }] },
    ],
  } as unknown as import('../src/schema').Narrative;
  return layoutDeck(narrative, system, { seed: 11 });
}

describe('O1 hangPunctuation (measurable)', () => {
  it('hangs leading quotes on left-aligned blocks within 0.12in', () => {
    const d = deckOf([{ role: 'title', content: '"Quoted opening line with enough words to wrap"' }]);
    const before = d.slides[1].blocks[0];
    const { deck, log } = hangPunctuation(d);
    assert.equal(log.length, 1);
    assert.equal(log[0].tier, 'measurable');
    assert.ok(Math.abs(log[0].deltaIn) <= 0.12 + 1e-9);
    const after = deck.slides[1].blocks[0];
    assert.ok(after.x <= before.x && after.x >= 0);
    validateDeck(deck);
  });
  it('leaves unquoted blocks untouched', () => {
    const d = deckOf([{ role: 'title', content: 'Plain opening line without quotes' }]);
    const { log } = hangPunctuation(d);
    assert.equal(log.length, 0);
  });
});

describe('O2 opticalCenter (heuristic)', () => {
  it('nudges centered heroes with trailing punctuation within 0.06in', () => {
    const d = deckOf([{ role: 'title', content: 'A centered hero statement here.' }], 'expressive');
    const { deck, log } = opticalCenter(d);
    assert.equal(log.length, 1);
    assert.equal(log[0].tier, 'heuristic');
    assert.ok(Math.abs(log[0].deltaIn) <= 0.06 + 1e-9);
    validateDeck(deck);
  });
  it('leaves heroes without trailing punctuation untouched', () => {
    const d = deckOf([{ role: 'title', content: 'A centered hero without punct' }], 'expressive');
    assert.equal(opticalCenter(d).log.length, 0);
  });
});

describe('scorers (no auto-fix)', () => {
  it('ragScore penalizes orphans and single lines score 100', () => {
    const d = deckOf([{ role: 'body', content: 'Short body.' }]);
    assert.equal(ragScore(d.slides[1].blocks[0]).score, 100);
  });
  it('widowRisk flags 1-2 word final lines only', () => {
    const d = deckOf([{ role: 'body', content: 'Short body.' }]);
    assert.equal(widowRisk(d.slides[1].blocks[0]), false);
  });
});

describe('applyOpticalCorrections', () => {
  it('measurable-only by default; experimental never applied', () => {
    const d = deckOf([
      { role: 'number', content: '123456789' },
      { role: 'title', content: '"Big quoted hero with trailing words to wrap around.' },
    ], 'expressive');
    const r = applyOpticalCorrections(d);
    assert.ok(r.log.every((e) => e.tier === 'measurable'));
    assert.ok(r.log.every((e) => Math.abs(e.deltaIn) <= e.maxDeltaIn + 1e-9));
    validateDeck(r.deck);
    // Experimental proposals recorded, deltas zero (never applied).
    for (const p of r.proposals) assert.equal(p.proposedDeltaIn, 0);
    assert.ok(experimentalProposals(d).every((p) => p.id.startsWith('O5-')));
  });
  it('heuristic tier is opt-in and stays bounded', () => {
    const d = deckOf([{ role: 'title', content: 'Centered hero with punct.' }], 'expressive');
    const r = applyOpticalCorrections(d, { tiers: ['measurable', 'heuristic'] });
    assert.ok(r.log.every((e) => Math.abs(e.deltaIn) <= e.maxDeltaIn + 1e-9));
    validateDeck(r.deck);
  });
  it('is deterministic', () => {
    const d = deckOf([{ role: 'title', content: '"Deterministic hang check for quotes."' }]);
    const a = applyOpticalCorrections(d, { tiers: ['measurable', 'heuristic'] });
    const b = applyOpticalCorrections(d, { tiers: ['measurable', 'heuristic'] });
    assert.deepEqual(a.log, b.log);
  });
});
