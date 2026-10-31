// Visual review helpers: decision merge-safety, signatures, text parity.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { layoutDeck } from '../src/layout';
import { planNarrative } from '../src/narrative';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import {
  findWorkflowTokens,
  geometrySignature,
  scaffoldDecisions,
  textParityOk,
  type ReviewFile,
} from '../src/visual-review';
import { loadFixtureText } from './fake-fetch';

describe('scaffoldDecisions', () => {
  const systems = [
    { id: 'editorial', version: '1.0.0' },
    { id: 'swiss', version: '1.0.0' },
  ];
  it('scaffolds PENDING entries for new systems', () => {
    const f = scaffoldDecisions(null, systems);
    assert.equal(f.version, '1.0.0');
    assert.deepEqual(f.systems.map((s) => s.system), ['editorial', 'swiss']);
    assert.ok(f.systems.every((s) => s.decision === 'PENDING' && s.comments === ''));
  });
  it('preserves human decisions across re-runs (never clobbers)', () => {
    const first = scaffoldDecisions(null, systems);
    first.systems[0].decision = 'KEEP';
    first.systems[0].comments = 'Ships it.';
    first.systems[0].scores.readability = 5;
    const second = scaffoldDecisions(first, [...systems, { id: 'vapor', version: '0.1.0' }]);
    const kept = second.systems.find((s) => s.system === 'editorial') as (typeof second.systems)[number];
    assert.equal(kept.decision, 'KEEP');
    assert.equal(kept.comments, 'Ships it.');
    assert.equal(kept.scores.readability, 5);
    assert.equal(second.systems.find((s) => s.system === 'vapor')?.decision, 'PENDING');
  });
  it('resets decisions when the system version changed', () => {
    const first = scaffoldDecisions(null, systems);
    first.systems[0].decision = 'KEEP';
    const second = scaffoldDecisions(first, [{ id: 'editorial', version: '2.0.0' }, systems[1]]);
    const reset = second.systems.find((s) => s.system === 'editorial') as (typeof second.systems)[number];
    assert.equal(reset.decision, 'PENDING');
    assert.ok(reset.comments.includes('2.0.0') || reset.comments.includes('1.0.0'));
  });
  it('keeps removed systems for audit history', () => {
    const first: ReviewFile = {
      version: '1.0.0',
      systems: [{ system: 'oldie', systemVersion: '0.9.0', decision: 'REJECT', scores: { readability: 1, hierarchy: 1, composition: 1, distinctiveness: 1, consistency: 1, koEnQuality: 1, suitability: 1 }, comments: 'No.', reviewedBy: 'r1', reviewedAt: '2026-01-01' }],
    };
    const second = scaffoldDecisions(first, systems);
    assert.ok(second.systems.some((s) => s.system === 'oldie' && s.decision === 'REJECT'));
  });
});

describe('geometrySignature', () => {
  it('is stable across runs and sensitive to geometry', () => {
    const claims = extractClaims(acceptIdea(loadFixtureText('idea-f4.txt')));
    const narrative = planNarrative(claims, { purpose: 'showcase', lang: 'en' });
    const a = geometrySignature(layoutDeck(narrative, 'swiss', { seed: 7 }));
    const b = geometrySignature(layoutDeck(narrative, 'swiss', { seed: 7 }));
    const c = geometrySignature(layoutDeck(narrative, 'editorial', { seed: 7 }));
    assert.deepEqual(a, b);
    assert.notDeepEqual(a, c);
  });
});

describe('textParityOk', () => {
  it('tolerates run-splitting but not content changes', () => {
    assert.ok(textParityOk(['Hello world'], ['Hello ', 'world']));
    assert.ok(textParityOk(['a  b'], ['a b']));
    assert.ok(!textParityOk(['Hello world'], ['Hello mars']));
    assert.ok(!textParityOk(['a', 'b'], ['a']));
  });
});

describe('findWorkflowTokens', () => {
  it('finds leaked process labels case-insensitively', () => {
    assert.deepEqual(findWorkflowTokens('<div>Shipgate keeps main green</div>'), []);
    assert.deepEqual(findWorkflowTokens('<div>Style Option A: Swiss</div>').sort(), ['option a', 'style option']);
    assert.deepEqual(findWorkflowTokens('<p>see preview.md for details</p>'), ['preview.md']);
  });
});
