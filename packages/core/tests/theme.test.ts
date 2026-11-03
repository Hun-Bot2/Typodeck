import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { COMPOSITION_CANDIDATES } from '../src/composition';

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i + 1, i + 3), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

function forcedDeck(candidateId: string, system: 'swiss' | 'editorial' | 'expressive' | 'document' = 'swiss') {
  const slide = SAMPLE_NARRATIVE.slides[0];
  // English narrative: themed faces resolve to the stack head.
  // (Korean narratives resolve to the KR entry — see ko-typography.test.ts.)
  return layoutDeck({ ...SAMPLE_NARRATIVE, lang: 'en' }, system, {
    seed: 7,
    compositionPlan: [{
      slideId: slide.id,
      semanticType: 'opening',
      candidateId,
      rationale: 'theme test (forced)',
      score: 0,
    }],
  });
}

describe('candidate themes', () => {
  it('themed candidate overrides background, ink, and faces', () => {
    const cand = COMPOSITION_CANDIDATES['opening-monumental-numeral']!;
    assert.ok(cand.theme, 'opening-monumental-numeral must carry a theme');
    const deck = forcedDeck('opening-monumental-numeral', 'swiss');
    const slide = deck.slides[0];
    assert.equal(slide.background, cand.theme.colors!.background);
    const title = slide.blocks.find((b) => b.role === 'title');
    assert.ok(title, 'expected a title block');
    assert.equal(title.color, cand.theme.colors!.ink);
    const theme = cand.theme;
    assert.ok(theme);
    const heading = theme.fonts?.heading;
    assert.ok(heading);
    const first = heading[0];
    assert.ok(first);
    assert.equal(title.fontFace, first.replace(/"/g, ''));
  });

  it('unthemed candidates keep baseline behavior (no fontFace stamped)', () => {
    const cand = COMPOSITION_CANDIDATES['transition-breath'];
    assert.equal(cand.theme, undefined);
    const deck = forcedDeck('transition-breath', 'swiss');
    for (const b of deck.slides[0].blocks) {
      assert.equal(b.fontFace, undefined);
    }
    assert.equal(deck.slides[0].background, '#FFFFFF');
  });

  it('every seeded theme passes WCAG AA on its own background', () => {
    for (const [id, c] of Object.entries(COMPOSITION_CANDIDATES)) {
      if (!c.theme?.colors) continue;
      const bg = c.theme.colors.background!;
      for (const [role, fg] of Object.entries({
        ink: c.theme.colors.ink!,
        accent: c.theme.colors.accent!,
        muted: c.theme.colors.muted!,
      })) {
        const ratio = contrast(fg, bg);
        assert.ok(ratio >= 4.5, `${id} ${role} ${fg} on ${bg}: ${ratio.toFixed(2)}:1 < 4.5:1`);
      }
    }
  });
});
