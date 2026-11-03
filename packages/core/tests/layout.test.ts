import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SLIDE_HEIGHT_IN,
  SLIDE_WIDTH_IN,
  type Deck,
  type Narrative,
  type TextBlock,
} from '../src/schema';
import {
  RENDER_LINEBOX_NUMBER,
  charWidthEm,
  estimateWrap,
  fitNumberToRender,
  fitText,
  inkHeightIn,
  layoutDeck,
  rectsOverlap,
} from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { SYSTEM_IDS, type SystemId } from '../src/systems';

const decks: Record<SystemId, Deck> = {
  editorial: layoutDeck(SAMPLE_NARRATIVE, 'editorial'),
  swiss: layoutDeck(SAMPLE_NARRATIVE, 'swiss'),
  expressive: layoutDeck(SAMPLE_NARRATIVE, 'expressive'),
  document: layoutDeck(SAMPLE_NARRATIVE, 'document'),
};

function center(b: TextBlock): [number, number] {
  return [b.x + b.w / 2, b.y + b.h / 2];
}

describe('layout', () => {
  it('is deterministic: same input -> byte-identical JSON for every system', () => {
    for (const system of SYSTEM_IDS) {
      const a = JSON.stringify(layoutDeck(SAMPLE_NARRATIVE, system));
      const b = JSON.stringify(layoutDeck(JSON.parse(JSON.stringify(SAMPLE_NARRATIVE)), system));
      assert.equal(a, b, `system ${system} not deterministic`);
    }
  });

  it('emits no overlapping blocks for any system', () => {
    for (const system of SYSTEM_IDS) {
      for (const slide of decks[system].slides) {
        for (let i = 0; i < slide.blocks.length; i++) {
          for (let j = i + 1; j < slide.blocks.length; j++) {
            assert.equal(
              rectsOverlap(slide.blocks[i], slide.blocks[j]),
              false,
              `${system}/${slide.id}: blocks ${i} and ${j} overlap`,
            );
          }
        }
      }
    }
  });

  it('keeps every block inside the 16:9 slide bounds', () => {
    for (const system of SYSTEM_IDS) {
      for (const slide of decks[system].slides) {
        for (const b of slide.blocks) {
          assert.ok(b.x >= 0 && b.y >= 0, `${system}/${slide.id}: negative origin`);
          assert.ok(
            b.x + b.w <= SLIDE_WIDTH_IN + 1e-9 && b.y + b.h <= SLIDE_HEIGHT_IN + 1e-9,
            `${system}/${slide.id}: block exceeds bounds`,
          );
        }
      }
    }
  });

  it('treats CJK glyphs as wide in the measurement model', () => {
    assert.equal(charWidthEm('가', false), 1.0);
    assert.equal(charWidthEm('漢', false), 1.0);
    assert.ok(charWidthEm('a', false) < 1.0);
    assert.ok(charWidthEm('i', false) < charWidthEm('m', false));
  });

  it('overflow estimator fits long KO and EN strings inside the box', () => {
    const longKo = '한글 검증용 문장입니다. '.repeat(40); // ~480 chars
    const longEn =
      'This is a deliberately long English paragraph designed to stress the word-level wrapping path. '.repeat(12);
    for (const [label, text] of [['ko', longKo], ['en', longEn]] as const) {
      const fit = fitText(text, 8.0, 4.0, 15, 8, 0, 1.6, false);
      assert.ok(fit.heightIn <= 4.0 + 1e-9, `${label}: fitted height ${fit.heightIn} exceeds box`);
      assert.ok(fit.widthIn <= 8.0 + 1e-9, `${label}: fitted width ${fit.widthIn} exceeds box`);
      assert.ok(fit.lines.length > 1, `${label}: expected wrapping`);
    }
  });

  it('KO wraps at character level (no broken mid-syllable overflow)', () => {
    const r = estimateWrap('가나다라마바사아자차카타파하', 100, 3.0, 0, 1.2, false);
    assert.ok(r.lines.length >= 2);
    assert.ok(r.maxWidthIn <= 3.0 + 1e-9);
  });

  it('systems produce materially different layouts', () => {
    // Mean block-center distance between systems must clear a threshold.
    const pairs: Array<[SystemId, SystemId]> = [
      ['editorial', 'swiss'],
      ['editorial', 'expressive'],
      ['swiss', 'expressive'],
      ['document', 'editorial'],
      ['document', 'swiss'],
      ['document', 'expressive'],
    ];
    for (const [a, b] of pairs) {
      let sum = 0;
      let n = 0;
      for (let s = 0; s < decks[a].slides.length; s++) {
        const ba = decks[a].slides[s].blocks;
        const bb = decks[b].slides[s].blocks;
        assert.equal(ba.length, bb.length, 'same content must yield same block counts');
        for (let i = 0; i < ba.length; i++) {
          const [ax, ay] = center(ba[i]);
          const [bx, by] = center(bb[i]);
          sum += Math.hypot(ax - bx, ay - by);
          n += 1;
        }
      }
      const mean = sum / n;
      assert.ok(mean > 1.0, `${a} vs ${b}: mean block-center distance ${mean.toFixed(2)}in too small`);
    }
  });

  it('systems differ in headline scale (median title size)', () => {
    const medians = SYSTEM_IDS.map((s) => {
      const sizes = decks[s].slides
        .flatMap((sl) => sl.blocks)
        .filter((b) => b.role === 'title')
        .map((b) => b.fontSize)
        .sort((x, y) => x - y);
      return sizes[Math.floor(sizes.length / 2)];
    });
    // Expressive heroes must be dramatically larger than swiss grid titles.
    assert.ok(medians[2] >= medians[1] * 1.5, `title medians ${medians.join('/')} lack scale contrast`);
  });

  it('handles adversarial narratives without overlap or overflow', () => {
    const nasty: Narrative = {
      title: 'nasty',
      lang: 'en',
      slides: [
        {
          id: 'x1',
          thesis: 't',
          blocks: [
            { role: 'title', content: 'Supercalifragilisticexpialidocious '.repeat(10) },
            { role: 'body', content: 'word '.repeat(400) },
            { role: 'body', content: '다른 '.repeat(300) },
            { role: 'caption', content: 'cap' },
          ],
        },
      ],
    };
    for (const system of SYSTEM_IDS) {
      const deck = layoutDeck(nasty, system);
      const blocks = deck.slides[0].blocks;
      for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          assert.equal(rectsOverlap(blocks[i], blocks[j]), false, `${system}: overlap on nasty slide`);
        }
      }
    }
  });

  it('shrinks hero numerals until render-model ink fits the box (QuickLook probe case)', () => {
    // Editorial number geometry that rendered overlapping on all systems:
    // 84pt "1.9 million dollars" in an 8.6x2.06in box spilled ~0.6in.
    const size = fitNumberToRender('1.9 million dollars', 8.6, 2.06, 84, 60, -0.02, true);
    assert.ok(size < 84, `expected shrink below 84, got ${size}`);
    const r = estimateWrap('1.9 million dollars', size, 8.6, -0.02, RENDER_LINEBOX_NUMBER, true);
    assert.ok(
      inkHeightIn(r, size, RENDER_LINEBOX_NUMBER) <= 2.06,
      `render ink still exceeds 2.06in at ${size}pt`,
    );
  });

  it('leaves numerals that already fit untouched', () => {
    const size = fitNumberToRender('42%', 8.6, 2.06, 84, 60, -0.02, true);
    assert.equal(size, 84);
  });
});
