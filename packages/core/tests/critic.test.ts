// Critic + revision tests: findings, scores, bounded loop, provenance.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { critiqueDeck, reviseDeck } from '../src/critic';
import { layoutDeck } from '../src/layout';
import { validateDeck, type Narrative } from '../src/schema';

const NARRATIVE = {
  title: 't', lang: 'en',
  slides: [
    { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Cover title with substance' }] },
    { id: 'n1-number', thesis: 'm', blocks: [
      { role: 'number', content: 'v3.2' },
      { role: 'title', content: 'A version token is not a meaningful hero metric' },
    ] },
    { id: 'n2-problem', thesis: 'p', blocks: [
      { role: 'title', content: 'Food expires silently at the back of the shelf' },
      { role: 'body', content: 'Households waste about forty percent of the fresh food they buy.' },
    ] },
    { id: 'n3-closing', thesis: 'e', blocks: [{ role: 'title', content: 'Closing line with substance' }] },
  ],
} as unknown as Narrative;

describe('critiqueDeck', () => {
  it('flags unsupported metric heroes (semantic) and scores proxies 0-1', () => {
    const deck = layoutDeck(NARRATIVE, 'editorial', { seed: 5 });
    const report = critiqueDeck(deck, NARRATIVE);
    assert.ok(report.findings.some((f) => f.check === 'unsupported-metric' && f.failureClass === 'semantic'));
    for (const v of Object.values(report.scores)) assert.ok(v >= 0 && v <= 1, String(v));
    assert.ok(report.visionUnmeasured.length >= 5);
    assert.ok(report.visionUnmeasured.some((s) => s.includes('no verified integration') || s.includes('T11')));
  });
  it('clean decks score high with zero errors', () => {
    const clean = {
      title: 't', lang: 'en',
      slides: [
        { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Short cover' }] },
        { id: 'n1-closing', thesis: 'e', blocks: [{ role: 'title', content: 'Short close' }] },
      ],
    } as unknown as Narrative;
    const deck = layoutDeck(clean, 'swiss', { seed: 5 });
    const report = critiqueDeck(deck, clean);
    assert.equal(report.findings.filter((f) => f.severity === 'error').length, 0);
    assert.equal(report.scores.contrastAA, 1);
  });
});

describe('reviseDeck', () => {
  it('runs bounded loop with provenance and valid output', () => {
    const r = reviseDeck(NARRATIVE, 'editorial', { seed: 5, maxAttempts: 3 });
    assert.ok(r.attempts >= 1 && r.attempts <= 3);
    assert.equal(r.provenance.length, r.attempts);
    assert.equal(r.reports.length, r.attempts);
    validateDeck(r.deck);
    assert.equal(r.plan.length, NARRATIVE.slides.length);
  });
  it('is deterministic', () => {
    const a = reviseDeck(NARRATIVE, 'swiss', { seed: 9 });
    const b = reviseDeck(NARRATIVE, 'swiss', { seed: 9 });
    assert.deepEqual(a.provenance, b.provenance);
    assert.deepEqual(a.deck, b.deck);
  });
});
