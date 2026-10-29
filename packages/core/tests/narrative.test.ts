import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractClaims, type Claim } from '../src/evidence';
import { acceptIdea } from '../src/ingestion';
import { captionFor, planDeck, planNarrative } from '../src/narrative';
import { loadIdeaF4, loadRecordedRepo, recordedRepoFetch } from './fake-fetch';

const record = loadRecordedRepo();

function mkClaim(id: string, text: string, kind: Claim['kind'], path: string): Claim {
  return {
    id,
    text,
    kind,
    refs: [{ path, lines: [1, 2] }],
    numbers: text.match(/\bv?\d[\d,]*(?:\.\d+)?(?:\s?(?:%|kB|KB|MB|ms|s|x))?/g) ?? [],
  };
}

describe('planNarrative', () => {
  it('plans 5–12 slides with one thesis per slide', () => {
    const claims = [
      mkClaim('c1', 'Widgets renders dashboards in under 120ms on modest hardware.', 'verified', 'src/index.js'),
      mkClaim('c2', 'More than 40 teams use widgets in production today worldwide.', 'suggestion', 'README.md'),
      mkClaim('c3', 'The layout engine packs panels without any overlap at all.', 'verified', 'src/pack.js'),
    ];
    const n = planNarrative(claims, { purpose: 'Widgets', lang: 'en' });
    assert.ok(n.slides.length >= 5 && n.slides.length <= 12, `got ${n.slides.length} slides`);
    for (const s of n.slides) {
      assert.ok(s.thesis.length > 0, `${s.id} has no thesis`);
      assert.ok(s.blocks.length > 0);
    }
  });

  it('emits number slides only from claims with numbers and refs', () => {
    const claims = [
      mkClaim('c1', 'Renders dashboards in under 120ms on modest hardware today.', 'verified', 'src/index.js'),
      mkClaim('c2', 'A calm claim with no numeric tokens anywhere inside it here.', 'verified', 'src/pack.js'),
    ];
    const n = planNarrative(claims, { purpose: 'Widgets', lang: 'en' });
    const numbers = n.slides.flatMap((s) => s.blocks).filter((b) => b.role === 'number');
    assert.ok(numbers.length >= 1, 'expected a number slide');
    for (const num of numbers) {
      const hit = claims.some((c) => c.numbers.includes(num.content) && c.refs.length > 0);
      assert.ok(hit, `number slide "${num.content}" has no numeric claim with refs`);
    }
  });

  it('labels ungrounded and proposal material in captions', () => {
    const claims = [mkClaim('c1', 'Pantrylog could save households 45 dollars every single month.', 'ungrounded', 'idea.txt')];
    const n = planNarrative(claims, { purpose: 'Pantrylog', lang: 'en' });
    const captions = n.slides.flatMap((s) => s.blocks).filter((b) => b.role === 'caption');
    assert.ok(captions.length > 0);
    for (const cap of captions) {
      assert.match(cap.content, /unverified|illustrative|proposal/);
    }
    assert.equal(captionFor(claims[0], 'en'), 'Source: idea.txt:1–2 · unverified · illustrative');
  });

  it('pads short input with labeled proposal slides and caps long input at 12', () => {
    const empty = planNarrative([], { purpose: 'Empty', lang: 'en' });
    assert.equal(empty.slides.length, 5);
    assert.ok(
      empty.slides.flatMap((s) => s.blocks).some((b) => b.role === 'caption' && b.content.includes('proposal')),
    );
    const many = Array.from({ length: 30 }, (_, i) =>
      mkClaim(`c${i}`, `Calm distinct claim number ${i} with enough words to be atomic here.`, 'verified', 'src/pack.js'),
    );
    const n = planNarrative(many, { purpose: 'Many', lang: 'ko' });
    assert.equal(n.slides.length, 12);
    assert.equal(n.lang, 'ko');
  });

  it('is deterministic', () => {
    const claims = extractClaims(acceptIdea(loadIdeaF4()));
    const a = planNarrative(claims, { purpose: 'Pantrylog', lang: 'en' });
    const b = planNarrative(extractClaims(acceptIdea(loadIdeaF4())), { purpose: 'Pantrylog', lang: 'en' });
    assert.deepEqual(a, b);
  });
});

describe('planDeck', () => {
  it('runs idea mode end-to-end with fallback provenance', async () => {
    const res = await planDeck(
      { type: 'idea', text: loadIdeaF4() },
      { system: 'swiss', purpose: 'Pantrylog', lang: 'en' },
    );
    assert.ok(res.deck.slides.length >= 5 && res.deck.slides.length <= 12);
    assert.equal(res.provenance.provider, 'fallback');
    assert.equal(res.provenance.generatedBy, 'fallback');
    assert.equal(res.deck.meta.generatedBy, 'fallback');
    assert.ok(res.provenance.claims.ungrounded > 0);
    assert.ok(res.provenance.warnings.length > 0);
  });

  it('runs repo mode end-to-end on the recorded fixture', async () => {
    const res = await planDeck(
      { type: 'repo', owner: 'acme', repo: 'widgets' },
      { system: 'editorial', purpose: 'Widgets', lang: 'en', fetchImpl: recordedRepoFetch(record) },
    );
    assert.ok(res.deck.slides.length >= 5 && res.deck.slides.length <= 12);
    assert.ok(res.provenance.claims.verified > 0);
    assert.equal(res.deck.meta.system, 'editorial');
  });
});
