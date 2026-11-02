// Stage 3 C1/C2/C9-B: intent preservation round-trips, layout passthrough,
// and the legacy no-intent gate (planners emit nothing; absent intent adds
// no keys and changes no geometry).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import { layoutDeck } from '../src/layout';
import { planNarrative } from '../src/narrative';
import { narrativeToSlideIR, slideIRToNarrative } from '../src/slide-ir';
import { parseSlideMarkdown, serializeSlideMarkdown } from '../src/slide-markdown';
import type { Deck, Narrative, NarrativeBlock } from '../src/schema';
import { SYSTEM_IDS } from '../src/systems';
import { loadFixtureText } from './fake-fetch';

function intentNarrative(): Narrative {
  return {
    title: 'Intent deck',
    lang: 'en',
    slides: [
      {
        id: 's1',
        thesis: 'First thesis',
        blocks: [
          { role: 'kicker', content: 'Section one' },
          { role: 'title', content: '94% Accuracy', intent: { emphasis: 'primary', groupId: 'g1' } },
          { role: 'body', content: 'Supporting detail with enough words to lay out.', intent: { emphasis: 'secondary', groupId: 'g1', relation: 'evidence' } },
          { role: 'caption', content: 'Source note', intent: { deliberateCrop: true } },
        ],
      },
      {
        id: 's2',
        thesis: 'Second thesis',
        blocks: [
          { role: 'title', content: 'Plain title' },
          { role: 'body', content: 'Plain body.', intent: { relation: 'support' } },
        ],
      },
    ],
  };
}

/** Deep strip of `intent` keys for geometry comparison. */
function stripIntent(deck: Deck): unknown {
  return JSON.parse(JSON.stringify(deck, (k, v: unknown) => (k === 'intent' ? undefined : v)));
}

function intentsOf(blocks: NarrativeBlock[]): unknown[] {
  return blocks.map((b) => b.intent);
}

describe('Narrative -> IR -> Narrative preserves intent', () => {
  it('round-trips every intent verbatim', () => {
    const n = intentNarrative();
    const ir = narrativeToSlideIR(n, []);
    assert.deepEqual(intentsOf(ir.slides[0].blocks), intentsOf(n.slides[0].blocks));
    assert.deepEqual(intentsOf(ir.slides[1].blocks), intentsOf(n.slides[1].blocks));
    const back = slideIRToNarrative(ir);
    assert.deepEqual(back, n);
  });
});

describe('Markdown -> IR -> Markdown is byte-stable with intent', () => {
  it('round-trips bytes and structure', () => {
    const ir = narrativeToSlideIR(intentNarrative(), []);
    const once = serializeSlideMarkdown(ir);
    assert.ok(once.includes('\nintent: emphasis=primary group=g1\n'));
    assert.deepEqual(parseSlideMarkdown(once), ir);
    assert.equal(serializeSlideMarkdown(parseSlideMarkdown(once)), once);
  });
});

describe('layoutSlide copies intent verbatim with no geometry effect', () => {
  for (const system of SYSTEM_IDS) {
    it(`passes intent through on ${system}`, () => {
      const n = intentNarrative();
      const deck = layoutDeck(n, system, { seed: 42 });
      const want = new Map(n.slides.flatMap((s) => s.blocks.map((b) => [b.content, b.intent] as const)));
      for (const slide of deck.slides) {
        for (const b of slide.blocks) {
          assert.deepEqual(b.intent, want.get(b.content), `${system} ${b.id}`);
        }
      }
      // Blocks without intent gain no key at all.
      const plain = deck.slides[1].blocks.find((b) => b.content === 'Plain title');
      assert.ok(plain);
      assert.equal('intent' in plain, false);
    });
    it(`geometry is identical with and without intent on ${system}`, () => {
      const withIntent = intentNarrative();
      const without = JSON.parse(JSON.stringify(withIntent, (k, v: unknown) => (k === 'intent' ? undefined : v))) as Narrative;
      const a = layoutDeck(withIntent, system, { seed: 42 });
      const b = layoutDeck(without, system, { seed: 42 });
      assert.deepEqual(stripIntent(a), stripIntent(b));
      assert.equal(JSON.stringify(stripIntent(a)), JSON.stringify(stripIntent(b)));
    });
  }
});

describe('legacy fixtures untouched (no intent anywhere)', () => {
  const claims = extractClaims(acceptIdea(loadFixtureText('idea-f4.txt')));
  const narrative = planNarrative(claims, { preset: 'P04', lang: 'en' });
  it('planners emit no intent keys', () => {
    assert.equal(JSON.stringify(narrative).includes('"intent"'), false);
  });
  it('legacy IR serializes with no intent lines', () => {
    const ir = narrativeToSlideIR(narrative, claims, { preset: 'P04' });
    assert.equal(JSON.stringify(ir).includes('"intent"'), false);
    const md = serializeSlideMarkdown(ir);
    assert.equal(md.includes('\nintent:'), false);
    assert.deepEqual(parseSlideMarkdown(md), ir);
  });
  it('legacy layout emits no intent keys', () => {
    for (const system of SYSTEM_IDS) {
      const deck = layoutDeck(narrative, system);
      assert.equal(JSON.stringify(deck).includes('"intent"'), false, system);
    }
  });
});
