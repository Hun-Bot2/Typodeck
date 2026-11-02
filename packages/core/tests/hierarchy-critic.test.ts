// Stage-3 hierarchy/grouping/rendered critic + probe tests (owner D; C3-C6).
// Per-check fire/no-fire + evidence, absent-signal skips, all 3 opt-in
// channels, revise no-ping-pong, and legacy-path invariance.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  chooseRevisionAlternate,
  critiqueDeck,
  critiqueRenderedOverflow,
  critiqueRenderedText,
  critiqueSlideIntent,
  prominenceProxy,
  reviseDeck,
  revisionIntentOfBlocks,
  revisionRationale,
  type CriticFinding,
  type RenderedBlockMeasurement,
} from '../src/critic';
import type { CompositionCandidate } from '../src/composition';
import { estimateWrap, layoutDeck } from '../src/layout';
import { validateDeck, type Narrative, type Slide, type TextBlock } from '../src/schema';

let seq = 0;
function block(over: Record<string, unknown> = {}): TextBlock {
  const b = {
    id: `b${seq++}`,
    role: 'body',
    content: 'Sample copy for the hierarchy critic',
    x: 1, y: 1, w: 5, h: 1,
    fontSize: 18, fontWeight: 400, tracking: 0, lineHeight: 1.4,
    align: 'left', color: '#111111',
    ...over,
  };
  return b as unknown as TextBlock;
}

function slide(blocks: TextBlock[], id = 's1'): Slide {
  return { id, thesis: 't', background: '#FFFFFF', blocks };
}

function measurement(over: Partial<RenderedBlockMeasurement> = {}): RenderedBlockMeasurement {
  return {
    index: 0, blockId: 'b0',
    scrollWidth: 100, scrollHeight: 50, clientWidth: 100, clientHeight: 50,
    fontSizePx: 16, lineHeightPx: 22.4,
    ...over,
  };
}

function cand(id: string, primitives: string[]): CompositionCandidate {
  return { id, primitives } as unknown as CompositionCandidate;
}

const NEW_CHECKS = [
  'hierarchy/primary-subordinate',
  'grouping/related-isolated',
  'rendered/substitution',
  'rendered/unintended-wrap',
];

describe('prominenceProxy', () => {
  it('matches the frozen formula exactly', () => {
    assert.equal(prominenceProxy(100, 400), 100);
    assert.equal(prominenceProxy(100, 700), 118.75);
    assert.equal(prominenceProxy(50, 900), 65.625);
    assert.equal(prominenceProxy(18, 300), 16.875);
  });
});

describe('hierarchy/primary-subordinate', () => {
  it('fires when a non-primary block exceeds max primary P by >5%', () => {
    const s = slide([
      block({ id: 't1', role: 'title', fontSize: 20, fontWeight: 400, intent: { emphasis: 'primary' } }),
      block({ id: 'b1', role: 'body', fontSize: 24, fontWeight: 400 }),
    ]);
    const found = critiqueSlideIntent(s).filter((f) => f.check === 'hierarchy/primary-subordinate');
    assert.equal(found.length, 1);
    const f = found[0];
    assert.equal(f.severity, 'warning');
    assert.equal(f.confidence, 'medium');
    assert.equal(f.source, 'deterministic');
    assert.deepEqual(f.blockIds, ['b1', 't1']);
    assert.ok(f.evidence?.includes('b1 P=24.00'), f.evidence);
    assert.ok(f.evidence?.includes('t1 P=20.00'), f.evidence);
    assert.ok(f.evidence?.includes('20.0%'), f.evidence);
  });
  it('counts weight, not just size', () => {
    const s = slide([
      block({ id: 't1', fontSize: 20, fontWeight: 400, intent: { emphasis: 'primary' } }),
      block({ id: 'b1', fontSize: 18, fontWeight: 900 }),
    ]);
    const found = critiqueSlideIntent(s).filter((f) => f.check === 'hierarchy/primary-subordinate');
    assert.equal(found.length, 1);
  });
  it('stays silent without primary emphasis', () => {
    const s = slide([block({ id: 'a', fontSize: 30 }), block({ id: 'b', fontSize: 12 })]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'hierarchy/primary-subordinate').length, 0);
  });
  it('stays silent when the primary block is most prominent', () => {
    const s = slide([
      block({ id: 't1', fontSize: 30, intent: { emphasis: 'primary' } }),
      block({ id: 'b1', fontSize: 18 }),
    ]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'hierarchy/primary-subordinate').length, 0);
  });
  it('treats exactly +5% as no-fire (strictly greater)', () => {
    const edge = 20 * 1.05;
    const s = slide([
      block({ id: 't1', fontSize: 20, fontWeight: 400, intent: { emphasis: 'primary' } }),
      block({ id: 'b1', fontSize: edge, fontWeight: 400 }),
    ]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'hierarchy/primary-subordinate').length, 0);
  });
  it('stays silent when the primary block stands alone', () => {
    const s = slide([block({ id: 't1', fontSize: 20, intent: { emphasis: 'primary' } })]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'hierarchy/primary-subordinate').length, 0);
  });
  it('is deterministic', () => {
    const s = slide([
      block({ id: 't1', fontSize: 20, intent: { emphasis: 'primary' } }),
      block({ id: 'b1', fontSize: 24 }),
    ]);
    assert.deepEqual(critiqueSlideIntent(s), critiqueSlideIntent(s));
  });
});

describe('grouping/related-isolated', () => {
  it('fires when a non-member cuts the group bbox', () => {
    const s = slide([
      block({ id: 'm1', x: 1, y: 1, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'm2', x: 1, y: 4, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'x1', x: 2, y: 2, w: 1, h: 2 }),
    ]);
    const found = critiqueSlideIntent(s).filter((f) => f.check === 'grouping/related-isolated');
    assert.equal(found.length, 1);
    const f = found[0];
    assert.equal(f.severity, 'warning');
    assert.equal(f.confidence, 'medium');
    assert.equal(f.source, 'deterministic');
    assert.deepEqual(f.blockIds, ['m1', 'm2', 'x1']);
    assert.ok(f.evidence?.includes('group g1'), f.evidence);
    assert.ok(f.evidence?.includes('x1'), f.evidence);
  });
  it('stays silent without groups', () => {
    const s = slide([block({ id: 'a' }), block({ id: 'b' })]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'grouping/related-isolated').length, 0);
  });
  it('stays silent for singleton groups', () => {
    const s = slide([
      block({ id: 'm1', x: 1, y: 1, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'x1', x: 2, y: 1, w: 1, h: 1 }),
    ]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'grouping/related-isolated').length, 0);
  });
  it('stays silent when no intruder cuts the bbox', () => {
    const s = slide([
      block({ id: 'm1', x: 1, y: 1, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'm2', x: 1, y: 2, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'x1', x: 8, y: 6, w: 2, h: 1 }),
    ]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'grouping/related-isolated').length, 0);
  });
  it('does not count edge-touching as a cut', () => {
    const s = slide([
      block({ id: 'm1', x: 1, y: 1, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'm2', x: 1, y: 2, w: 4, h: 1, intent: { groupId: 'g1' } }),
      block({ id: 'x1', x: 1, y: 3, w: 4, h: 1 }),
    ]);
    assert.equal(critiqueSlideIntent(s).filter((f) => f.check === 'grouping/related-isolated').length, 0);
  });
});

describe('rendered/substitution', () => {
  it('fires when the rendered face differs from the requested face', () => {
    const s = slide([block({ id: 't1', fontFace: 'Noto Serif KR' })]);
    const found = critiqueRenderedText(s, [measurement({ blockId: 't1', fontUsed: 'Georgia' })])
      .filter((f) => f.check === 'rendered/substitution');
    assert.equal(found.length, 1);
    const f = found[0];
    assert.equal(f.severity, 'warning');
    assert.equal(f.confidence, 'high');
    assert.equal(f.source, 'deterministic');
    assert.deepEqual(f.blockIds, ['t1']);
    assert.ok(f.evidence?.includes('Noto Serif KR'), f.evidence);
    assert.ok(f.evidence?.includes('Georgia'), f.evidence);
  });
  it('ignores case and surrounding quotes', () => {
    const s = slide([block({ id: 't1', fontFace: '"Helvetica Neue"' })]);
    const found = critiqueRenderedText(s, [measurement({ blockId: 't1', fontUsed: 'helvetica neue' })]);
    assert.equal(found.filter((f) => f.check === 'rendered/substitution').length, 0);
  });
  it('skips silently when fontUsed is absent', () => {
    const s = slide([block({ id: 't1', fontFace: 'Noto Serif KR' })]);
    const found = critiqueRenderedText(s, [measurement({ blockId: 't1' })]);
    assert.equal(found.filter((f) => f.check === 'rendered/substitution').length, 0);
  });
  it('skips silently when no requested face is known', () => {
    const s = slide([block({ id: 't1' })]);
    const found = critiqueRenderedText(s, [measurement({ blockId: 't1', fontUsed: 'Georgia' })]);
    assert.equal(found.filter((f) => f.check === 'rendered/substitution').length, 0);
  });
  it('falls back to requestedFonts when block.fontFace is absent', () => {
    const s = slide([block({ id: 't1' })]);
    const found = critiqueRenderedText(
      s,
      [measurement({ blockId: 't1', fontUsed: 'FaceB' })],
      { requestedFonts: { t1: 'FaceA' } },
    ).filter((f) => f.check === 'rendered/substitution');
    assert.equal(found.length, 1);
    assert.ok(found[0].evidence?.includes('FaceA'), found[0].evidence);
  });
  it('prefers block.fontFace over requestedFonts', () => {
    const s = slide([block({ id: 't1', fontFace: 'FaceA' })]);
    const found = critiqueRenderedText(
      s,
      [measurement({ blockId: 't1', fontUsed: 'FaceB' })],
      { requestedFonts: { t1: 'FaceB' } },
    ).filter((f) => f.check === 'rendered/substitution');
    assert.equal(found.length, 1);
  });
  it('skips blocks with no measurement', () => {
    const s = slide([block({ id: 't1', fontFace: 'FaceA' })]);
    assert.deepEqual(critiqueRenderedText(s, []), []);
  });
});

describe('rendered/unintended-wrap', () => {
  it('fires when the render wraps beyond the estimate', () => {
    const content = 'Hi';
    const b = block({ id: 'w1', content, fontSize: 18, w: 10, tracking: 0, lineHeight: 1.4, fontWeight: 400 });
    const est = estimateWrap(content, 18, 10, 0, 1.4, false).lines.length;
    const found = critiqueRenderedText(slide([b]), [measurement({ blockId: 'w1', wrappedLines: est + 2 })])
      .filter((f) => f.check === 'rendered/unintended-wrap');
    assert.equal(found.length, 1);
    const f = found[0];
    assert.equal(f.severity, 'warning');
    assert.equal(f.confidence, 'high');
    assert.equal(f.source, 'deterministic');
    assert.deepEqual(f.blockIds, ['w1']);
    assert.equal(f.evidence, `block w1: rendered ${est + 2} lines vs ${est} estimated`);
  });
  it('stays silent when rendered lines match the estimate', () => {
    const content = 'Hi';
    const b = block({ id: 'w1', content, fontSize: 18, w: 10, tracking: 0, lineHeight: 1.4, fontWeight: 400 });
    const est = estimateWrap(content, 18, 10, 0, 1.4, false).lines.length;
    const found = critiqueRenderedText(slide([b]), [measurement({ blockId: 'w1', wrappedLines: est })]);
    assert.equal(found.filter((f) => f.check === 'rendered/unintended-wrap').length, 0);
  });
  it('stays silent when the render wraps less than the estimate', () => {
    const content = 'word '.repeat(120);
    const b = block({ id: 'w1', content, fontSize: 18, w: 1, tracking: 0, lineHeight: 1.4, fontWeight: 400 });
    const est = estimateWrap(content, 18, 1, 0, 1.4, false).lines.length;
    assert.ok(est >= 2, `est=${est}`);
    const found = critiqueRenderedText(slide([b]), [measurement({ blockId: 'w1', wrappedLines: est - 1 })]);
    assert.equal(found.filter((f) => f.check === 'rendered/unintended-wrap').length, 0);
  });
  it('skips silently when wrappedLines is absent or zero', () => {
    const s = slide([block({ id: 'w1', fontSize: 18, w: 1 })]);
    assert.equal(critiqueRenderedText(s, [measurement({ blockId: 'w1' })])
      .filter((f) => f.check === 'rendered/unintended-wrap').length, 0);
    assert.equal(critiqueRenderedText(s, [measurement({ blockId: 'w1', wrappedLines: 0 })])
      .filter((f) => f.check === 'rendered/unintended-wrap').length, 0);
  });
});

describe('rendered overflow opt-in channels', () => {
  function overflowing(extra: Record<string, unknown> = {}): Slide {
    return slide([block({ id: 'crop', ...extra })]);
  }
  function overflowed(): RenderedBlockMeasurement {
    return measurement({ blockId: 'crop', scrollHeight: 200, clientHeight: 50, fontSizePx: 16, lineHeightPx: 19.2 });
  }
  it('honors the intentional allowlist', () => {
    const r = critiqueRenderedOverflow(overflowing(), [overflowed()], { intentional: ['crop'] });
    assert.deepEqual(r.intentional, ['crop']);
    assert.deepEqual(r.findings, []);
  });
  it('honors the allowOverflow flag', () => {
    const r = critiqueRenderedOverflow(overflowing({ allowOverflow: true }), [overflowed()]);
    assert.deepEqual(r.intentional, ['crop']);
    assert.deepEqual(r.findings, []);
  });
  it('honors intent.deliberateCrop', () => {
    const r = critiqueRenderedOverflow(overflowing({ intent: { deliberateCrop: true } }), [overflowed()]);
    assert.deepEqual(r.intentional, ['crop']);
    assert.deepEqual(r.findings, []);
  });
  it('still errors without any opt-in', () => {
    const r = critiqueRenderedOverflow(overflowing(), [overflowed()]);
    assert.equal(r.findings.length, 1);
    assert.equal(r.findings[0].check, 'overflow-visible');
    assert.equal(r.findings[0].severity, 'error');
    assert.deepEqual(r.intentional, []);
  });
  it('treats deliberateCrop:false as no opt-in', () => {
    const r = critiqueRenderedOverflow(overflowing({ intent: { deliberateCrop: false } }), [overflowed()]);
    assert.equal(r.findings.length, 1);
    assert.equal(r.findings[0].check, 'overflow-visible');
  });
  it('lists only overflowing blocks as intentional', () => {
    const r = critiqueRenderedOverflow(
      overflowing({ intent: { deliberateCrop: true } }),
      [measurement({ blockId: 'crop' })],
    );
    assert.deepEqual(r.findings, []);
    assert.deepEqual(r.intentional, []);
  });
});

describe('CriticFinding extension (C3)', () => {
  it('keeps legacy finding literals valid', () => {
    const legacy: CriticFinding = {
      slideId: 's', failureClass: 'structural', check: 'x',
      severity: 'error', detail: 'd', suggestedFix: 'f',
    };
    assert.equal(legacy.blockIds, undefined);
    assert.equal(legacy.evidence, undefined);
    assert.equal(legacy.confidence, undefined);
    assert.equal(legacy.source, undefined);
  });
  it('emits deterministic findings only', () => {
    const intentSlide = slide([
      block({ id: 't1', fontSize: 20, intent: { emphasis: 'primary' } }),
      block({ id: 'b1', fontSize: 24 }),
    ]);
    const renderedSlide = slide([block({ id: 't1', fontFace: 'FaceA' })]);
    const findings = [
      ...critiqueSlideIntent(intentSlide),
      ...critiqueRenderedText(renderedSlide, [measurement({ blockId: 't1', fontUsed: 'FaceB' })]),
    ];
    assert.ok(findings.length >= 2);
    for (const f of findings) assert.equal(f.source, 'deterministic');
  });
});

describe('untouched paths unaffected', () => {
  const NARR = {
    title: 't', lang: 'en',
    slides: [
      { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Cover title with substance' }] },
      { id: 'n1-number', thesis: 'm', blocks: [
        { role: 'number', content: 'v3.2' },
        { role: 'title', content: 'A version token is not a meaningful hero metric' },
      ] },
    ],
  } as unknown as Narrative;
  it('keeps existing checks and adds none without intent', () => {
    const deck = layoutDeck(NARR, 'editorial', { seed: 5 });
    validateDeck(deck);
    const report = critiqueDeck(deck, NARR);
    assert.ok(report.findings.some((f) => f.check === 'unsupported-metric'));
    assert.ok(report.findings.every((f) => !NEW_CHECKS.includes(f.check)));
  });
});

describe('revisionIntentOfBlocks', () => {
  it('derives group and emphasis presence', () => {
    assert.deepEqual(
      revisionIntentOfBlocks([{ intent: { emphasis: 'primary' } }, { intent: { groupId: 'g' } }, { role: 'body' }]),
      { hasGroup: false, hasEmphasis: true },
    );
    assert.deepEqual(
      revisionIntentOfBlocks([{ intent: { groupId: 'g' } }, { intent: { groupId: 'g' } }]),
      { hasGroup: true, hasEmphasis: false },
    );
    assert.deepEqual(
      revisionIntentOfBlocks([{ intent: { groupId: 'a' } }, { intent: { groupId: 'b' } }]),
      { hasGroup: false, hasEmphasis: false },
    );
    assert.deepEqual(revisionIntentOfBlocks([]), { hasGroup: false, hasEmphasis: false });
    assert.deepEqual(revisionIntentOfBlocks([null, 'x', {}]), { hasGroup: false, hasEmphasis: false });
  });
});

describe('revisionRationale', () => {
  it('pins the exact format with and without the intent suffix', () => {
    assert.equal(
      revisionRationale('base', 'structural', 'overlap', 'alt-x', false),
      'base; revision: structural/overlap -> alt-x',
    );
    assert.equal(
      revisionRationale('base', 'structural', 'overlap', 'alt-x', true),
      'base; revision: structural/overlap -> alt-x; intent-aware',
    );
  });
});

describe('chooseRevisionAlternate', () => {
  it('returns undefined when nothing qualifies', () => {
    assert.equal(chooseRevisionAlternate([], new Set(), { hasGroup: false, hasEmphasis: false }), undefined);
  });
  it('keeps registry order without intent', () => {
    const alts = [cand('a', ['reading-flow']), cand('b', ['typographic-grouping'])];
    const choice = chooseRevisionAlternate(alts, new Set(), { hasGroup: false, hasEmphasis: false });
    assert.equal(choice?.candidate.id, 'a');
    assert.equal(choice?.intentAware, false);
  });
  it('prefers the grouping primitive when group intent changes the pick', () => {
    const alts = [cand('a', ['reading-flow']), cand('b', ['typographic-grouping'])];
    const choice = chooseRevisionAlternate(alts, new Set(), { hasGroup: true, hasEmphasis: false });
    assert.equal(choice?.candidate.id, 'b');
    assert.equal(choice?.intentAware, true);
  });
  it('reports no influence when the first pick already supports intent', () => {
    const alts = [cand('b', ['typographic-grouping']), cand('a', ['reading-flow'])];
    const choice = chooseRevisionAlternate(alts, new Set(), { hasGroup: true, hasEmphasis: false });
    assert.equal(choice?.candidate.id, 'b');
    assert.equal(choice?.intentAware, false);
  });
  it('prefers scale-contrast for emphasis intent', () => {
    const alts = [cand('a', ['reading-flow']), cand('c', ['scale-contrast'])];
    const choice = chooseRevisionAlternate(alts, new Set(), { hasGroup: false, hasEmphasis: true });
    assert.equal(choice?.candidate.id, 'c');
    assert.equal(choice?.intentAware, true);
  });
  it('skips ledger ids and exhausts to undefined', () => {
    const alts = [cand('a', ['reading-flow']), cand('b', ['typographic-grouping'])];
    const choice = chooseRevisionAlternate(alts, new Set(['a']), { hasGroup: false, hasEmphasis: false });
    assert.equal(choice?.candidate.id, 'b');
    assert.equal(chooseRevisionAlternate(alts, new Set(['a', 'b']), { hasGroup: false, hasEmphasis: false }), undefined);
  });
  it('falls back without the suffix when the preferred pick already failed', () => {
    const alts = [cand('a', ['reading-flow']), cand('b', ['typographic-grouping'])];
    const choice = chooseRevisionAlternate(alts, new Set(['b']), { hasGroup: true, hasEmphasis: false });
    assert.equal(choice?.candidate.id, 'a');
    assert.equal(choice?.intentAware, false);
  });
});

describe('reviseDeck no-ping-pong', () => {
  const NARR = {
    title: 't', lang: 'en',
    slides: [
      { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Cover title with substance' }] },
      { id: 'n1-number', thesis: 'm', blocks: [
        { role: 'number', content: 'v3.2' },
        { role: 'title', content: 'A version token is not a meaningful hero metric' },
      ] },
    ],
  } as unknown as Narrative;
  it('never retries the same alternate for the same check on the same slide', () => {
    const r = reviseDeck(NARR, 'editorial', { seed: 5, maxAttempts: 3 });
    assert.ok(r.attempts >= 1 && r.attempts <= 3);
    assert.equal(r.provenance.length, r.attempts);
    assert.equal(r.reports.length, r.attempts);
    assert.equal(r.plan.length, NARR.slides.length);
    validateDeck(r.deck);
    const seen = new Set<string>();
    for (const line of r.provenance) {
      const m = /^attempt \d+: (\S+) on (\S+) -> (\S+)$/.exec(line);
      if (!m) continue;
      const key = `${m[1]} ${m[2]} ${m[3]}`;
      assert.ok(!seen.has(key), `ping-pong: retried ${key} (${line})`);
      seen.add(key);
    }
    for (const p of r.plan) assert.ok(!p.rationale.includes('; intent-aware'));
  });
});
