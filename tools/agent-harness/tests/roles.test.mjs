import test from 'node:test';
import assert from 'node:assert/strict';
import { planRole, planDeckRoles, ROLES } from '../lib/roles.mjs';

test('explicit role wins when valid', () => {
  const r = planRole({ intent: 'compare A versus B', role: 'statement' }, 2, 7);
  assert.equal(r.role, 'statement');
  assert.match(r.reason, /explicit/);
});

test('unknown explicit role falls back with reason', () => {
  const r = planRole({ intent: 'x', role: 'nope' }, 2, 7);
  assert.equal(r.role, 'evidence');
  assert.match(r.reason, /unknown explicit role/);
});

test('intent keywords select roles', () => {
  assert.equal(planRole({ intent: 'open the deck with title and lede' }, 0, 7).role, 'cover');
  assert.equal(planRole({ intent: 'section divider into part two' }, 1, 7).role, 'divider');
  assert.equal(planRole({ intent: 'one big thesis statement' }, 2, 7).role, 'statement');
  assert.equal(planRole({ intent: 'evidence with stats and proof' }, 3, 7).role, 'evidence');
  assert.equal(planRole({ intent: 'compare before versus after' }, 4, 7).role, 'comparison');
  assert.equal(planRole({ intent: 'dense table breakdown of rows' }, 5, 7).role, 'dense');
  assert.equal(planRole({ intent: 'closing takeaways and next steps' }, 6, 7).role, 'closing');
});

test('content shape votes: zones force comparison, table forces dense', () => {
  const z = { a: { label: 'A', rows: [] }, b: { label: 'B', rows: [] } };
  assert.equal(planRole({ intent: 'misc notes', zones: z }, 3, 7).role, 'comparison');
  const t = { columns: ['A'], rows: [['1']] };
  assert.equal(planRole({ intent: 'misc notes', table: t }, 3, 7).role, 'dense');
});

test('no-signal defaults: first cover, last closing, middle evidence', () => {
  assert.equal(planRole({ intent: 'qqq zzz' }, 0, 7).role, 'cover');
  assert.equal(planRole({ intent: 'qqq zzz' }, 6, 7).role, 'closing');
  assert.equal(planRole({ intent: 'qqq zzz' }, 3, 7).role, 'evidence');
});

test('planDeckRoles plans every slide deterministically', () => {
  const slides = [{ intent: 'a' }, { intent: 'b' }, { intent: 'c' }];
  const a = planDeckRoles(slides);
  const b = planDeckRoles(slides);
  assert.deepEqual(a, b);
  assert.equal(a.length, 3);
  assert.ok(a.every((r) => ROLES.includes(r.role)));
});
