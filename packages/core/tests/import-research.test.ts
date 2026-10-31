// Research import: validation, dedupe, clustering, capability honesty,
// spec-only output (never promotion).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCandidateSpecs,
  clusterRecords,
  dedupeRecords,
  importResearchRecords,
  mapTermToCapabilities,
  parseResearchJsonl,
  validateResearchRecord,
  type ResearchRecord,
} from '../src/research-import';
import { VISUAL_SYSTEMS } from '../src/visual-systems';

function rec(over: Partial<ResearchRecord> & { ref_id: string; source_url: string }): ResearchRecord {
  return {
    canonical_category: 'swiss-international',
    classification_confidence: 'high',
    layer: 'L1-practitioner',
    jurisdiction: 'GLOBAL',
    license: 'CC-BY',
    design_tokens: { composition: ['asymmetric-grid-left'] },
    claims_observed: ['Asymmetric grids align body text to shared columns.'],
    slide_transfer: 'adapted',
    reusable_primitives: ['column-rhythm'],
    evidence_grade: 'B',
    needs_render_proof: true,
    ...over,
  } as ResearchRecord;
}

const GOOD_A = rec({ ref_id: 'R001', source_url: 'https://example.com/a' });
const GOOD_B = rec({
  ref_id: 'R002',
  source_url: 'https://example.com/b',
  design_tokens: { composition: ['vertical-text'] },
  claims_observed: ['Vertical Japanese text stacks columns right to left.'],
  reusable_primitives: ['vertical-rhythm'],
  canonical_category: 'japanese-modern',
  evidence_grade: 'A',
  needs_render_proof: false,
});

describe('validation', () => {
  it('accepts well-formed records', () => {
    assert.deepEqual(validateResearchRecord(GOOD_A), []);
    assert.deepEqual(validateResearchRecord(GOOD_B), []);
  });
  it('rejects malformed records with specific messages', () => {
    assert.ok(validateResearchRecord({ ...GOOD_A, ref_id: 'X1' }).some((m) => m.includes('ref_id')));
    assert.ok(validateResearchRecord({ ...GOOD_A, source_url: 'ftp://x' }).some((m) => m.includes('source_url')));
    assert.ok(validateResearchRecord({ ...GOOD_A, canonical_category: 'nope' }).some((m) => m.includes('canonical_category')));
    assert.ok(validateResearchRecord({ ...GOOD_A, claims_observed: [] }).some((m) => m.includes('claims_observed')));
    assert.ok(validateResearchRecord({ ...GOOD_A, design_tokens: { composition: [] } }).some((m) => m.includes('composition')));
    assert.ok(validateResearchRecord({ ...GOOD_A, evidence_grade: 'F' }).some((m) => m.includes('evidence_grade')));
    assert.ok(validateResearchRecord('nope').some((m) => m.includes('object')));
  });
  it('reports per-line JSON errors with 1-based lines', () => {
    const { records, errors } = parseResearchJsonl(`${JSON.stringify(GOOD_A)}\n{broken\n`);
    assert.equal(records.length, 1);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].line, 2);
  });
});

describe('dedupe + clustering', () => {
  it('dedupes by source_url, first wins', () => {
    const dup = rec({ ref_id: 'R009', source_url: GOOD_A.source_url });
    const { kept, duplicates } = dedupeRecords([GOOD_A, dup]);
    assert.deepEqual(kept.map((r) => r.ref_id), ['R001']);
    assert.deepEqual(duplicates.map((r) => r.ref_id), ['R009']);
  });
  it('clusters by category + primary token and surfaces shared claims', () => {
    const sibling = rec({ ref_id: 'R003', source_url: 'https://example.com/c' });
    const clusters = clusterRecords([GOOD_A, GOOD_B, sibling]);
    assert.equal(clusters.length, 2);
    const swiss = clusters.find((c) => c.category === 'swiss-international') as (typeof clusters)[number];
    assert.equal(swiss.records.length, 2);
    assert.ok(swiss.sharedClaims.includes('Asymmetric grids align body text to shared columns.'));
  });
});

describe('capability mapping honesty', () => {
  it('maps supported strategies and flags missing ones', () => {
    assert.deepEqual(mapTermToCapabilities('asymmetric-grid-left').supported, ['asymmetric-offset']);
    assert.deepEqual(mapTermToCapabilities('vertical-text').missing, ['vertical-text']);
    assert.deepEqual(mapTermToCapabilities('rotation').missing, ['rotation']);
    assert.ok(mapTermToCapabilities('minimal').supported.length === 0);
  });
  it('reports unknown terms for human review instead of guessing', () => {
    const m = mapTermToCapabilities('quux-layout-3000');
    assert.deepEqual(m.unmapped, ['quux-layout-3000']);
    assert.deepEqual(m.supported, []);
    assert.deepEqual(m.missing, []);
  });
});

describe('candidate specs (correction 4)', () => {
  it('emits experimental-only specs with provenance and honesty fields', () => {
    const { result, errors } = importResearchRecords(
      [GOOD_A, GOOD_B].map((r) => JSON.stringify(r)).join('\n'),
    );
    assert.deepEqual(errors, []);
    assert.equal(result.specs.length, 2);
    for (const s of result.specs) {
      assert.equal(s.status, 'experimental');
      assert.ok(s.candidateId.startsWith('candidate-'));
      assert.ok(s.philosophy.startsWith('Derived (extractive)'));
      assert.ok(s.researchRefs.length > 0 && s.provenance.length === s.researchRefs.length);
      assert.ok(s.grammarRef.startsWith('composition-grammar@'));
    }
    const jp = result.specs.find((s) => s.candidateId.includes('japanese-modern')) as (typeof result.specs)[number];
    assert.ok(jp.missingCapabilities.includes('vertical-text'));
    assert.ok(jp.unmappedTerms.includes('vertical-rhythm'));
    const swiss = result.specs.find((s) => s.candidateId.includes('swiss-international')) as (typeof result.specs)[number];
    assert.ok(swiss.supportedCapabilities.includes('asymmetric-offset'));
    assert.ok(swiss.warnings.some((w) => w.includes('single-source')));
  });
  it('filters by grade and skips not-transferable records (counted, not silent)', () => {
    const weak = rec({ ref_id: 'R010', source_url: 'https://example.com/weak', evidence_grade: 'D' });
    const nt = rec({ ref_id: 'R011', source_url: 'https://example.com/nt', slide_transfer: 'not-transferable' });
    const { result } = importResearchRecords(
      [GOOD_A, GOOD_B, weak, nt].map((r) => JSON.stringify(r)).join('\n'),
      { minGrade: 'C' },
    );
    assert.equal(result.stats.belowGrade, 1);
    assert.equal(result.stats.notTransferable, 1);
    assert.equal(result.specs.length, 2);
  });
  it('fails the whole import on any invalid line (writes nothing)', () => {
    const { result, errors } = importResearchRecords(
      [GOOD_A, { ...GOOD_B, ref_id: 'bad' }].map((r) => JSON.stringify(r)).join('\n'),
    );
    assert.equal(errors.length, 1);
    assert.equal(result.specs.length, 0);
  });
  it('never touches the production registry', () => {
    const before = JSON.stringify(VISUAL_SYSTEMS);
    importResearchRecords([GOOD_A].map((r) => JSON.stringify(r)).join('\n'));
    assert.equal(JSON.stringify(VISUAL_SYSTEMS), before);
    // Production entries stay production; experimental candidates may coexist
    // (the registry's designed lifecycle: listVisualSystems defaults to both).
    assert.ok(['editorial', 'swiss', 'expressive'].every((id) => VISUAL_SYSTEMS[id]?.status === 'production'));
  });
});
