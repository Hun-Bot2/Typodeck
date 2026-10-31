// Rendered overflow gate tests (Q1 OVERFLOW-MUST-BE-VISIBLE).
// Pure detection is fully unit-tested; headless-Chrome tests run when a
// Chrome binary is available and skip otherwise (reported, never faked).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  critiqueDeck,
  critiqueRenderedOverflow,
  detectRenderedOverflow,
  measureHtmlWithChrome,
  overflowTolerances,
  renderMeasureHtml,
  type RenderedBlockMeasurement,
} from '../src/critic';
import { layoutDeck } from '../src/layout';
import { validateDeck, type Narrative, type Slide } from '../src/schema';

function m(over: Partial<RenderedBlockMeasurement> = {}): RenderedBlockMeasurement {
  return {
    index: 0, blockId: 's1-b0',
    scrollWidth: 100, scrollHeight: 100, clientWidth: 100, clientHeight: 100,
    fontSizePx: 16, lineHeightPx: 19.2,
    ...over,
  };
}

describe('overflowTolerances', () => {
  it('derives vertical tolerance from cap-height line-box excess', () => {
    // G1 numeral case: 231pt in a 2.5in div — line box exceeds div but ink fits.
    const t = overflowTolerances({ fontSizePx: 308, lineHeightPx: 308 });
    assert.ok(t.vTolerancePx > 130 && t.vTolerancePx < 175, `vTol=${t.vTolerancePx}`);
    // Horizontal tolerance stays tight (numeral "12"->"1" must fire).
    assert.ok(t.hTolerancePx < 20, `hTol=${t.hTolerancePx}`);
  });
  it('passes measured Chrome line boxes (231pt numeral: scroll 331, client 223)', () => {
    const rows = detectRenderedOverflow(
      [m({ blockId: 'number', scrollHeight: 331, clientHeight: 223, fontSizePx: 308, lineHeightPx: 308 })],
      ['number'],
    );
    assert.equal(rows[0].overflowY, false);
  });
  it('still fires on a fully lost line (adds >=0.8em)', () => {
    // 13pt body, line 1.45em=18px: losing one line adds ~26px vs tol ~13px.
    const rows = detectRenderedOverflow(
      [m({ blockId: 'body1', scrollHeight: 126, clientHeight: 100, fontSizePx: 13, lineHeightPx: 18.9 })],
      ['body1'],
    );
    assert.equal(rows[0].overflowY, true);
  });
  it('never drops below 2px', () => {
    const t = overflowTolerances({ fontSizePx: 0, lineHeightPx: 0 });
    assert.equal(t.vTolerancePx >= 2 && t.hTolerancePx >= 2, true);
  });
});

describe('detectRenderedOverflow', () => {
  it('fires on vertical clips beyond tolerance', () => {
    const rows = detectRenderedOverflow(
      [m({ scrollHeight: 200, clientHeight: 100, fontSizePx: 16, lineHeightPx: 20 })],
      ['s1-b0'],
    );
    assert.equal(rows[0].overflowY, true);
    assert.equal(rows[0].overflowX, false);
    assert.equal(rows[0].blockId, 's1-b0');
  });
  it('fires on horizontal numeral-box clips', () => {
    const rows = detectRenderedOverflow(
      [m({ blockId: 'num', scrollWidth: 300, clientWidth: 150, fontSizePx: 200, lineHeightPx: 200 })],
      ['num'],
    );
    assert.equal(rows[0].overflowX, true);
  });
  it('stays clean within line-box tolerance (G1 numeral geometry)', () => {
    // 3.2in line box in a 2.5in div at 96dpi: 68px excess, tol ~108px.
    const rows = detectRenderedOverflow(
      [m({ blockId: 'number', scrollHeight: 308, clientHeight: 240, fontSizePx: 308, lineHeightPx: 308 })],
      ['number'],
    );
    assert.equal(rows[0].overflowY, false);
  });
  it('maps index-based measurements via fallback ids (real SlideView has no data-block-id)', () => {
    const rows = detectRenderedOverflow(
      [m({ blockId: null, index: 1, scrollHeight: 200, clientHeight: 100 })],
      ['a-b0', 'a-b1'],
    );
    assert.equal(rows[0].blockId, 'a-b1');
    assert.equal(rows[0].overflowY, true);
  });
  it('intentional allowlist marks but never hides rows', () => {
    const rows = detectRenderedOverflow(
      [m({ scrollHeight: 200, clientHeight: 100 })],
      ['s1-b0'],
      { intentional: ['s1-b0'] },
    );
    assert.equal(rows[0].overflowY, true);
    assert.equal(rows[0].intentional, true);
  });
});

describe('critiqueRenderedOverflow', () => {
  const slide = {
    id: 's1', thesis: 't', background: '#FFFFFF',
    blocks: [
      { id: 's1-b0', role: 'title', content: 'Title', x: 1, y: 1, w: 5, h: 1, fontSize: 30, fontWeight: 700, tracking: 0, lineHeight: 1.1, align: 'left', color: '#111111' },
      { id: 's1-b1', role: 'body', content: 'Body', x: 1, y: 2.2, w: 5, h: 1, fontSize: 12, fontWeight: 400, tracking: 0, lineHeight: 1.4, align: 'left', color: '#111111' },
    ],
  } as unknown as Slide;
  it('errors on real overflow with the overflow-visible check', () => {
    const r = critiqueRenderedOverflow(slide, [
      m({ blockId: 's1-b0' }),
      m({ blockId: 's1-b1', index: 1, scrollHeight: 300, clientHeight: 100 }),
    ]);
    assert.equal(r.measured.length, 2);
    assert.deepEqual(r.unmeasured, []);
    const errs = r.findings.filter((f) => f.check === 'overflow-visible');
    assert.equal(errs.length, 1);
    assert.equal(errs[0].severity, 'error');
    assert.ok(errs[0].detail.includes('s1-b1'));
  });
  it('explicit allowlist opt-in suppresses the finding and records intent', () => {
    const r = critiqueRenderedOverflow(slide, [
      m({ blockId: 's1-b0' }),
      m({ blockId: 's1-b1', index: 1, scrollHeight: 300, clientHeight: 100 }),
    ], { intentional: ['s1-b1'] });
    assert.ok(!r.findings.some((f) => f.check === 'overflow-visible'));
    assert.deepEqual(r.intentional, ['s1-b1']);
  });
  it('block-level allowOverflow flag is honored (provisional channel)', () => {
    const flagged = {
      ...slide,
      blocks: [{ ...slide.blocks[0] }, { ...slide.blocks[1], allowOverflow: true }],
    } as unknown as Slide;
    const r = critiqueRenderedOverflow(flagged, [
      m({ blockId: 's1-b0' }),
      m({ blockId: 's1-b1', index: 1, scrollHeight: 300, clientHeight: 100 }),
    ]);
    assert.ok(!r.findings.some((f) => f.check === 'overflow-visible'));
    assert.deepEqual(r.intentional, ['s1-b1']);
  });
  it('never guesses: unmeasured blocks warn, they do not pass silently', () => {
    const r = critiqueRenderedOverflow(slide, [m({ blockId: 's1-b0' })]);
    assert.deepEqual(r.unmeasured, ['s1-b1']);
    assert.ok(r.findings.some((f) => f.check === 'overflow-unmeasured' && f.severity === 'warning'));
  });
});

describe('static overflow-risk (critiqueDeck)', () => {
  it('warns when the estimate exceeds the box (silent-clip class)', () => {
    const deck = {
      meta: { title: 't', lang: 'en', system: 'swiss', seed: 1, generatedBy: 'test' },
      slides: [{
        id: 's1', thesis: 't', background: '#FFFFFF',
        blocks: [{
          id: 's1-b0', role: 'body', content: 'A very long sentence that cannot possibly fit inside a tiny box at this size. '.repeat(6),
          x: 1, y: 1, w: 2, h: 0.4, fontSize: 12, fontWeight: 400, tracking: 0, lineHeight: 1.4, align: 'left', color: '#111111',
        }],
      }],
    };
    validateDeck(deck);
    const report = critiqueDeck(deck as unknown as Parameters<typeof critiqueDeck>[0]);
    assert.ok(report.findings.some((f) => f.check === 'overflow-risk' && f.severity === 'warning'));
  });
  it('stays silent on fitted engine output', () => {
    const narrative = {
      title: 't', lang: 'en',
      slides: [{ id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Short cover' }] }],
    } as unknown as Narrative;
    const deck = layoutDeck(narrative, 'swiss', { seed: 5 });
    const report = critiqueDeck(deck);
    assert.ok(!report.findings.some((f) => f.check === 'overflow-risk'));
  });
});

describe('renderMeasureHtml', () => {
  it('mirrors SlideView geometry with per-block ids and the probe', () => {
    const narrative = {
      title: 't', lang: 'en',
      slides: [{ id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Hi <there>' }] }],
    } as unknown as Narrative;
    const deck = layoutDeck(narrative, 'swiss', { seed: 5 });
    const html = renderMeasureHtml(deck.slides[0], 'swiss');
    assert.ok(html.includes('data-block-id="n0-cover-b0"'));
    assert.ok(html.includes('overflow:hidden'));
    assert.ok(html.includes('white-space:pre-wrap'));
    assert.ok(html.includes('cqw'));
    assert.ok(html.includes('typodeck-overflow'));
    assert.ok(html.includes('Hi &lt;there&gt;'));
  });
});

const HAS_CHROME = (() => {
  for (const bin of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome', 'chromium']) {
    const r = spawnSync(bin, ['--version'], { encoding: 'utf8', timeout: 10000 });
    if (!r.error && r.status === 0) return true;
  }
  return process.env.TYPODECK_CHROME !== undefined && process.env.TYPODECK_CHROME !== '';
})();

describe('headless Chrome measurement', { skip: !HAS_CHROME }, () => {
  it('measures a clean slide with zero overflow-visible errors', () => {
    const narrative = {
      title: 't', lang: 'en',
      slides: [{ id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Short cover' }] }],
    } as unknown as Narrative;
    const deck = layoutDeck(narrative, 'swiss', { seed: 5 });
    const slide = deck.slides[0];
    const ms = measureHtmlWithChrome(renderMeasureHtml(slide, 'swiss'));
    assert.equal(ms.length, slide.blocks.length);
    const r = critiqueRenderedOverflow(slide, ms);
    assert.deepEqual(r.unmeasured, []);
    assert.ok(!r.findings.some((f) => f.check === 'overflow-visible'), JSON.stringify(r.findings));
  });
  it('catches a real rendered clip (before/after pair for the gate)', () => {
    const clipped = {
      id: 's1', thesis: 't', background: '#FFFFFF',
      blocks: [{
        id: 's1-b0', role: 'body', content: 'First line of a paragraph that keeps going well past the box. '.repeat(8),
        x: 1, y: 1, w: 4, h: 0.5, fontSize: 14, fontWeight: 400, tracking: 0, lineHeight: 1.4, align: 'left', color: '#111111',
      }],
    } as unknown as Slide;
    const ms = measureHtmlWithChrome(renderMeasureHtml(clipped, 'swiss'));
    assert.equal(ms.length, 1);
    const r = critiqueRenderedOverflow(clipped, ms);
    const errs = r.findings.filter((f) => f.check === 'overflow-visible');
    assert.equal(errs.length, 1, JSON.stringify(r));
    assert.equal(errs[0].severity, 'error');
  });
});
