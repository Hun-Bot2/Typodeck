import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { SYSTEM_IDS } from '../src/systems';

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

describe('contrast', () => {
  it('every text block meets WCAG AA (4.5:1) against its slide background', () => {
    for (const system of SYSTEM_IDS) {
      const deck = layoutDeck(SAMPLE_NARRATIVE, system);
      for (const slide of deck.slides) {
        for (const b of slide.blocks) {
          const ratio = contrast(b.color, slide.background);
          assert.ok(
            ratio >= 4.5,
            `${system}/${slide.id}/${b.id} (${b.role} ${b.color} on ${slide.background}): ${ratio.toFixed(2)}:1 < 4.5:1`,
          );
        }
      }
    }
  });
});
