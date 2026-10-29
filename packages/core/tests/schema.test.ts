import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DeckValidationError, validateDeck, validateNarrative } from '../src/schema';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';

function goodDeck(): unknown {
  return JSON.parse(JSON.stringify(layoutDeck(SAMPLE_NARRATIVE, 'swiss')));
}

describe('schema', () => {
  it('accepts a laid-out deck', () => {
    const deck = validateDeck(goodDeck());
    assert.equal(deck.slides.length, 7);
  });

  it('rejects forbidden constructs (shape/image/icon/card/...) anywhere', () => {
    for (const key of ['shape', 'shapes', 'image', 'images', 'icon', 'icons', 'card', 'line', 'table', 'chart', 'media']) {
      const deck = goodDeck() as Record<string, unknown>;
      (deck.slides as Record<string, unknown>[])[0][key] = [{ type: key }];
      assert.throws(() => validateDeck(deck), DeckValidationError, `key "${key}" should be rejected`);
    }
  });

  it('rejects non-text block type discriminators', () => {
    const deck = goodDeck() as Record<string, unknown>;
    const block = (deck.slides as Record<string, unknown>[])[1].blocks as Record<string, unknown>[];
    (block[0] as Record<string, unknown>).type = 'shape';
    assert.throws(() => validateDeck(deck), DeckValidationError);
  });

  it('rejects unknown roles', () => {
    const deck = goodDeck() as Record<string, unknown>;
    const blocks = (deck.slides as Record<string, unknown>[])[0].blocks as Record<string, unknown>[];
    blocks[0].role = 'headline2';
    assert.throws(() => validateDeck(deck), DeckValidationError);
  });

  it('rejects out-of-bounds and malformed blocks', () => {
    const deck = goodDeck() as Record<string, unknown>;
    const blocks = (deck.slides as Record<string, unknown>[])[0].blocks as Record<string, unknown>[];
    blocks[0].w = 99;
    assert.throws(() => validateDeck(deck), DeckValidationError);
  });

  it('rejects bad colors', () => {
    const deck = goodDeck() as Record<string, unknown>;
    (deck.slides as Record<string, unknown>[])[0].background = 'red';
    assert.throws(() => validateDeck(deck), DeckValidationError);
  });

  it('validates narrative input and rejects forbidden narrative constructs', () => {
    assert.doesNotThrow(() => validateNarrative(SAMPLE_NARRATIVE));
    const bad = JSON.parse(JSON.stringify(SAMPLE_NARRATIVE)) as Record<string, unknown>;
    ((bad.slides as Record<string, unknown>[])[0].blocks as Record<string, unknown>[]).push({
      role: 'body',
      content: 'x',
      image: 'evil.png',
    });
    assert.throws(() => validateNarrative(bad), DeckValidationError);
  });
});
