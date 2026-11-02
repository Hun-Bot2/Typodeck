// Stage-3 intent-aware selection tests (C6; C-owned, NEW file only).
// Baselines below were captured from the pre-change selection outputs:
// absent intent must reproduce them byte-identically (C0).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPOSITION_CANDIDATES,
  INTENT_GROUPING_BONUS,
  INTENT_PRIMARY_DISPLAY_BONUS,
  INTENT_RELATION_ADJACENCY_BONUS,
  classifySlide,
  planCompositions,
  scoreCandidate,
  selectComposition,
} from '../src/composition';
import type { NarrativeBlock, NarrativeSlide } from '../src/schema';
import type { SystemId } from '../src/systems';

type Role = 'kicker' | 'title' | 'body' | 'number' | 'caption';
// intent is C1-shaped; cast keeps this file compiling before/after B lands schema.ts.
interface BlockInput { role: Role; content: string; intent?: unknown }

function slide(id: string, blocks: BlockInput[]): NarrativeSlide {
  return { id, thesis: id, blocks: blocks as unknown as NarrativeBlock[] };
}

function ctxFor(s: NarrativeSlide, systemId: SystemId, index = 1, total = 5) {
  const classification = classifySlide(s, index, total);
  return {
    classification, slide: s, index, total, lang: 'en' as const, systemId,
    prevType: null, nextType: null, priorCandidates: [] as string[],
  };
}

const THESIS2: BlockInput[] = [
  { role: 'title', content: 'Keep every shelf visible with one ritual' },
  { role: 'body', content: 'First supporting point about planning dinners from stock on hand.' },
  { role: 'body', content: 'Second supporting point about nudges arriving before expiry dates.' },
];
const CMP2: BlockInput[] = [
  { role: 'title', content: 'Before vs After the weekly ritual' },
  { role: 'body', content: 'Before: silent expiry and duplicate purchases at home.' },
  { role: 'body', content: 'After: nudges plus planned dinners from existing stock.' },
];
const THESIS1: BlockInput[] = [
  { role: 'title', content: 'Keep every shelf visible with one ritual' },
  { role: 'body', content: 'One supporting point about planning dinners from stock on hand.' },
];

describe('intent absent = byte-identical baseline (C0)', () => {
  it('thesis 2-body editorial pins pre-change output', () => {
    const got = selectComposition(ctxFor(slide('n2-capabilities', THESIS2), 'editorial'));
    assert.deepEqual(got, {
      slideId: 'n2-capabilities',
      semanticType: 'thesis',
      candidateId: 'thesis-grouped',
      rationale: 'dimension stem "capabilities" -> thesis on "n2-capabilities"; chose thesis-grouped (typographic-grouping+column-rhythm+alignment) score=100.09',
      score: 100.093,
    });
  });
  it('comparison 2-body editorial pins pre-change output', () => {
    const got = selectComposition(ctxFor(slide('n2-differentiation', CMP2), 'editorial', 2));
    assert.deepEqual(got, {
      slideId: 'n2-differentiation',
      semanticType: 'comparison',
      candidateId: 'comparison-stacked',
      rationale: 'comparison signal (vs/before-after/비교) with >=2 bodies on "n2-differentiation"; chose comparison-stacked (controlled-asymmetry+textual-repetition+reading-flow) score=105.09',
      score: 105.089,
    });
  });
  it('thesis 1-body editorial pins pre-change output', () => {
    const got = selectComposition(ctxFor(slide('n2-capabilities', THESIS1), 'editorial'));
    assert.deepEqual(got, {
      slideId: 'n2-capabilities',
      semanticType: 'thesis',
      candidateId: 'thesis-sparse',
      rationale: 'dimension stem "capabilities" -> thesis on "n2-capabilities"; chose thesis-sparse (negative-space+editorial-headline+reading-flow) score=100.09',
      score: 100.089,
    });
  });
});

describe('scoreCandidate intent adjustments (IMPL-OWNED weights)', () => {
  it('primary display bonus applies exactly the named constant', () => {
    const plain = ctxFor(slide('n2-capabilities', THESIS2), 'editorial');
    const primed = ctxFor(slide('n2-capabilities', [
      { ...THESIS2[0], intent: { emphasis: 'primary' } }, THESIS2[1], THESIS2[2],
    ]), 'editorial');
    const st = COMPOSITION_CANDIDATES['thesis-statement']; // has scale-contrast
    const gr = COMPOSITION_CANDIDATES['thesis-grouped']; // no display primitive
    assert.ok(Math.abs((scoreCandidate(st, primed) - scoreCandidate(st, plain)) - INTENT_PRIMARY_DISPLAY_BONUS) < 1e-9);
    assert.equal(scoreCandidate(gr, primed) - scoreCandidate(gr, plain), 0);
  });
  it('grouping bonus needs >=2 blocks sharing one groupId', () => {
    const one = ctxFor(slide('n2-differentiation', [
      CMP2[0], { ...CMP2[1], intent: { groupId: 'g1' } }, CMP2[2],
    ]), 'editorial', 2);
    const two = ctxFor(slide('n2-differentiation', [
      CMP2[0], { ...CMP2[1], intent: { groupId: 'g1' } }, { ...CMP2[2], intent: { groupId: 'g1' } },
    ]), 'editorial', 2);
    const rows = COMPOSITION_CANDIDATES['comparison-rows']; // has typographic-grouping
    assert.equal(scoreCandidate(rows, one) - scoreCandidate(rows, ctxFor(slide('n2-differentiation', CMP2), 'editorial', 2)), 0);
    assert.ok(Math.abs((scoreCandidate(rows, two) - scoreCandidate(rows, ctxFor(slide('n2-differentiation', CMP2), 'editorial', 2))) - INTENT_GROUPING_BONUS) < 1e-9);
  });
  it('relation bonus applies exactly the named constant', () => {
    const plain = ctxFor(slide('n2-differentiation', CMP2), 'expressive', 2);
    const related = ctxFor(slide('n2-differentiation', [
      CMP2[0], { ...CMP2[1], intent: { relation: 'evidence' } }, CMP2[2],
    ]), 'expressive', 2);
    const rows = COMPOSITION_CANDIDATES['comparison-rows']; // has alignment
    const stacked = COMPOSITION_CANDIDATES['comparison-stacked']; // no grouping/alignment
    assert.ok(Math.abs((scoreCandidate(rows, related) - scoreCandidate(rows, plain)) - INTENT_RELATION_ADJACENCY_BONUS) < 1e-9);
    assert.equal(scoreCandidate(stacked, related) - scoreCandidate(stacked, plain), 0);
  });
  it('deliberateCrop alone changes nothing (C5 critic opt-in, not composition)', () => {
    const plain = selectComposition(ctxFor(slide('n2-capabilities', THESIS2), 'editorial'));
    const crop = selectComposition(ctxFor(slide('n2-capabilities', [
      { ...THESIS2[0], intent: { deliberateCrop: true } }, THESIS2[1], THESIS2[2],
    ]), 'editorial'));
    assert.deepEqual(crop, plain);
  });
});

describe('intent flips outcome + rationale citation (C6)', () => {
  it('primary emphasis flips thesis-grouped -> thesis-statement', () => {
    const got = selectComposition(ctxFor(slide('n2-capabilities', [
      { ...THESIS2[0], intent: { emphasis: 'primary' } }, THESIS2[1], THESIS2[2],
    ]), 'editorial'));
    assert.equal(got.candidateId, 'thesis-statement');
    assert.ok(got.rationale.includes('; intent: primary emphasis favoring display treatment'), got.rationale);
    assert.ok(got.rationale.includes('score=107.07'), got.rationale);
  });
  it('shared groupId flips comparison-stacked -> comparison-rows', () => {
    const got = selectComposition(ctxFor(slide('n2-differentiation', [
      CMP2[0], { ...CMP2[1], intent: { groupId: 'g1' } }, { ...CMP2[2], intent: { groupId: 'g1' } },
    ]), 'editorial', 2));
    assert.equal(got.candidateId, 'comparison-rows');
    assert.ok(got.rationale.includes('; intent: group g1 favoring proximity treatment'), got.rationale);
  });
  it('evidence relation flips comparison-stacked -> comparison-rows (expressive)', () => {
    const got = selectComposition(ctxFor(slide('n2-differentiation', [
      CMP2[0], { ...CMP2[1], intent: { relation: 'evidence' } }, CMP2[2],
    ]), 'expressive', 2));
    assert.equal(got.candidateId, 'comparison-rows');
    assert.ok(got.rationale.includes('; intent: relation evidence favoring adjacent treatment'), got.rationale);
  });
  it('present-but-not-decisive intent adds no citation', () => {
    const got = selectComposition(ctxFor(slide('n2-capabilities', [
      { ...THESIS1[0], intent: { emphasis: 'primary' } }, THESIS1[1],
    ]), 'editorial'));
    assert.equal(got.candidateId, 'thesis-sparse');
    assert.ok(!got.rationale.includes('; intent:'), got.rationale);
  });
});

describe('determinism (C0)', () => {
  it('same bytes -> same plan twice (with intent)', () => {
    const narrative = {
      title: 'Intent deck', lang: 'en',
      slides: [
        slide('n0-cover', [{ role: 'title', content: 'Pantrylog keeps every shelf visible' } as BlockInput]),
        slide('n2-capabilities', [
          { ...THESIS2[0], intent: { emphasis: 'primary' } }, THESIS2[1], THESIS2[2],
        ]),
        slide('n2-differentiation', [
          CMP2[0], { ...CMP2[1], intent: { groupId: 'g1' } }, { ...CMP2[2], intent: { groupId: 'g1' } },
        ]),
      ],
    };
    const a = planCompositions(narrative, 'editorial');
    const b = planCompositions(narrative, 'editorial');
    assert.deepEqual(a, b);
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    assert.ok(a[1].rationale.includes('; intent:'), a[1].rationale);
  });
});
