// Composition Grammar tests: coverage, classification, selection, determinism.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CANDIDATE_IDS,
  COMPOSITION_CANDIDATES,
  COMPOSITION_GRAMMAR,
  classifySlide,
  planCompositions,
  selectComposition,
  validateCompositionPlan,
  SEMANTIC_TYPES,
} from '../src/composition';
import type { NarrativeSlide } from '../src/schema';
import { layoutDeck } from '../src/layout';
import { validateDeck } from '../src/schema';

function slide(id: string, blocks: Array<{ role: 'kicker' | 'title' | 'body' | 'number' | 'caption'; content: string }>): NarrativeSlide {
  return { id, thesis: id, blocks };
}

describe('grammar coverage', () => {
  it('every semantic type has >=2 candidates', () => {
    for (const t of SEMANTIC_TYPES) {
      const n = CANDIDATE_IDS.filter((id) => COMPOSITION_CANDIDATES[id].semanticTypes.includes(t)).length;
      assert.ok(n >= 2, `${t} has ${n}`);
    }
  });
  it('every candidate declares systems, primitives, constraints, rationale, exceptions', () => {
    for (const id of CANDIDATE_IDS) {
      const c = COMPOSITION_CANDIDATES[id];
      assert.ok(c.systems.length >= 1, `${id} systems`);
      assert.ok(c.primitives.length >= 2, `${id} primitives`);
      assert.ok(c.constraints.maxTitleLines >= 1, `${id} title lines`);
      assert.ok(c.constraints.columns >= 1 && c.constraints.columns <= 4, `${id} columns`);
      assert.ok(c.rationale.length > 10, `${id} rationale`);
      assert.ok(c.exceptions.length >= 1, `${id} exceptions`);
    }
  });
  it('grammar bundle exposes version + scoring + fallback + validation', () => {
    assert.equal(COMPOSITION_GRAMMAR.version, '0.1.0');
    assert.ok(COMPOSITION_GRAMMAR.scoring.repetitionRule.includes('40%'));
    assert.ok(COMPOSITION_GRAMMAR.fallback.includes('thesis-statement'));
  });
});

describe('classifySlide', () => {
  it('maps cover/closing/number/proposal/point/dim stems', () => {
    const mk = (id: string) => slide(id, [{ role: 'title', content: 'A substantive title for testing purposes' }]);
    assert.equal(classifySlide(mk('n0-cover'), 0, 5).type, 'opening');
    assert.equal(classifySlide(mk('n4-closing'), 4, 5).type, 'conclusion');
    assert.equal(classifySlide(mk('n2-problem'), 2, 5).type, 'problem');
    assert.equal(classifySlide(mk('n2-architecture'), 2, 5).type, 'architecture');
    assert.equal(classifySlide(mk('n2-differentiation'), 2, 5).type, 'comparison');
    assert.equal(classifySlide(mk('n3-proposal'), 3, 5).type, 'tradeoff');
    assert.equal(classifySlide(mk('n3-point'), 3, 5).type, 'evidence');
  });
  it('requires number role + ref for high-confidence metric', () => {
    const good = slide('n1-number', [
      { role: 'number', content: '32%' },
      { role: 'title', content: 'Drop in expired items' },
      { role: 'caption', content: 'verified · pilot.csv:3' },
    ]);
    const c = classifySlide(good, 1, 5);
    assert.equal(c.type, 'metric');
    assert.equal(c.confidence, 'high');
    const unsupported = slide('n1-number', [
      { role: 'number', content: '32%' },
      { role: 'title', content: 'Drop in expired items' },
    ]);
    assert.equal(classifySlide(unsupported, 1, 5).confidence, 'medium');
  });
  it('detects comparison/quote/process overrides from content', () => {
    const cmp = slide('n2-solution', [
      { role: 'title', content: 'Before vs After the weekly ritual' },
      { role: 'body', content: 'Before: food expires silently at the back of the shelf.' },
      { role: 'body', content: 'After: nudges arrive two days before predicted expiry.' },
    ]);
    assert.equal(classifySlide(cmp, 2, 5).type, 'comparison');
    const quote = slide('n2-capabilities', [
      { role: 'title', content: '"We stopped throwing food away," said the pilot household lead' },
    ]);
    assert.equal(classifySlide(quote, 2, 5).type, 'quote');
    const proc = slide('n2-solution', [
      { role: 'title', content: 'The weekly ritual' },
      { role: 'body', content: 'Step 1 capture: scan groceries as they come home.' },
      { role: 'body', content: 'Step 2 plan: Sunday ideas from stock. Step 3 shop the gaps.' },
    ]);
    assert.equal(classifySlide(proc, 2, 5).type, 'process');
  });
});

describe('planCompositions + selectComposition', () => {
  const narrative = {
    title: 'Test deck',
    lang: 'en',
    slides: [
      slide('n0-cover', [{ role: 'title', content: 'Pantrylog keeps every shelf visible' }]),
      slide('n1-number', [
        { role: 'number', content: '32%' },
        { role: 'title', content: 'Fewer expired items in the pilot' },
        { role: 'caption', content: 'verified · pilot.csv:3' },
      ]),
      slide('n2-problem', [
        { role: 'title', content: 'Food expires silently at the back of the shelf' },
        { role: 'body', content: 'Households waste about 40 percent of fresh food.' },
      ]),
      slide('n3-differentiation', [
        { role: 'title', content: 'Before vs After the weekly ritual' },
        { role: 'body', content: 'Before: silent expiry and duplicate purchases.' },
        { role: 'body', content: 'After: nudges plus planned dinners from stock.' },
      ]),
      slide('n4-closing', [{ role: 'title', content: 'One ritual, zero silent waste' }]),
    ],
  };
  it('plans every slide with rationale + valid candidate (all systems)', () => {
    for (const sys of ['editorial', 'swiss', 'expressive', 'document'] as const) {
      const plan = planCompositions(narrative, sys);
      assert.equal(plan.length, 5);
      assert.deepEqual(validateCompositionPlan(plan, narrative), []);
      for (const p of plan) {
        assert.ok(CANDIDATE_IDS.includes(p.candidateId), p.candidateId);
        assert.ok(p.rationale.length > 20, p.slideId);
      }
      assert.equal(plan[0].semanticType, 'opening');
      assert.equal(plan[1].semanticType, 'metric');
      assert.equal(plan[4].semanticType, 'conclusion');
    }
  });
  it('metric-hero requires ref; unsupported numbers fall back to anchored', () => {
    const noRef = {
      title: 't', lang: 'en',
      slides: [slide('n0-cover', [{ role: 'title', content: 'Cover title here' }]),
        slide('n1-number', [{ role: 'number', content: 'v3.2' }, { role: 'title', content: 'Version number is not a hero' }]),
        slide('n2-closing', [{ role: 'title', content: 'Closing line here' }])],
    };
    const plan = planCompositions(noRef, 'editorial');
    assert.equal(plan[1].candidateId, 'metric-anchored');
  });
  it('is deterministic across runs', () => {
    const a = planCompositions(narrative, 'swiss');
    const b = planCompositions(narrative, 'swiss');
    assert.deepEqual(a, b);
  });
  it('avoids triple-repeat on long same-type decks', () => {
    const many = {
      title: 't', lang: 'en',
      slides: Array.from({ length: 8 }, (_, i) =>
        i === 0 ? slide('n0-cover', [{ role: 'title', content: 'Cover title here' }])
        : i === 7 ? slide('n7-closing', [{ role: 'title', content: 'Closing line' }])
        : slide(`n${i}-capabilities`, [
          { role: 'title', content: `Capability thesis number ${i} with substance` },
          { role: 'body', content: 'Supporting body one with enough content.' },
          { role: 'body', content: 'Supporting body two with enough content.' },
        ])),
    };
    const plan = planCompositions(many, 'swiss');
    assert.deepEqual(validateCompositionPlan(plan, many), []);
  });
  it('layoutDeck with plan stays valid and narrows long body lines', () => {
    const long = {
      title: 't', lang: 'en',
      slides: [
        { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'A cover title with enough substance' }] },
        { id: 'n1-problem', thesis: 'p', blocks: [
          { role: 'title', content: 'Food expires silently at the back of the shelf' },
          { role: 'body', content: 'Households waste about forty percent of the fresh food they buy every single month, mostly from silent expiry.' },
        ] },
        { id: 'n2-closing', thesis: 'e', blocks: [{ role: 'title', content: 'Closing line with substance' }] },
      ],
    } as unknown as import('../src/schema').Narrative;
    const base = layoutDeck(long, 'editorial', { seed: 7 });
    const plan = planCompositions(long, 'editorial');
    const improved = layoutDeck(long, 'editorial', { seed: 7, compositionPlan: plan });
    validateDeck(base);
    validateDeck(improved);
    const baseBody = base.slides[1].blocks.find((b) => b.role === 'body');
    const impBody = improved.slides[1].blocks.find((b) => b.role === 'body');
    assert.ok(baseBody && impBody);
    assert.ok(impBody.w <= baseBody.w, `measure cap narrows: ${impBody.w} <= ${baseBody.w}`);
  });
  it('never repeats a 3rd time in a row when an alternate qualifies', () => {
    const thesis = {
      title: 't', lang: 'en',
      slides: Array.from({ length: 6 }, (_, i) =>
        i === 0 ? slide('n0-cover', [{ role: 'title', content: 'Cover title with substance here' }])
        : i === 5 ? slide('n5-closing', [{ role: 'title', content: 'Closing line with substance' }])
        : slide(`n${i}-capabilities`, [
          { role: 'title', content: `Capability thesis number ${i} with substance` },
          { role: 'body', content: 'One supporting body with enough content.' },
        ])),
    };
    const plan = planCompositions(thesis, 'editorial');
    for (let i = 2; i < plan.length; i++) {
      assert.ok(!(plan[i].candidateId === plan[i - 1].candidateId && plan[i].candidateId === plan[i - 2].candidateId),
        `triple repeat of ${plan[i].candidateId} at ${i}`);
    }
  });
  it('falls back gracefully when nothing meets preconditions', () => {
    const odd = slide('n9-zzz', [{ role: 'title', content: 'x'.repeat(500) }]);
    const item = selectComposition({
      classification: { type: 'transition', rationale: 'forced', confidence: 'low' },
      slide: odd, index: 1, total: 3, lang: 'en', systemId: 'swiss',
      prevType: null, nextType: null, priorCandidates: [],
    });
    assert.ok(item.candidateId.startsWith('transition-'));
    assert.ok(item.rationale.includes('fallback') || item.score >= 0);
  });
});
