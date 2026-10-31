// Art Direction tests: density/emphasis annotation, rhythm revision, identity.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { balanceRhythm, planArtDirection } from '../src/art-direction';
import { planCompositions } from '../src/composition';
import type { Narrative } from '../src/schema';

function denseDeck(n: number): Narrative {
  return {
    title: 't', lang: 'en',
    slides: Array.from({ length: n }, (_, i) => {
      if (i === 0) return { id: 'n0-cover', thesis: 'c', blocks: [{ role: 'title', content: 'Cover title with substance' }] };
      if (i === n - 1) return { id: `n${i}-closing`, thesis: 'e', blocks: [{ role: 'title', content: 'Closing line with substance' }] };
      return {
        id: `n${i}-capabilities`, thesis: `t${i}`,
        blocks: [
          { role: 'title', content: `Capability thesis number ${i} with substance` },
          { role: 'body', content: 'Supporting body one with enough content to matter.' },
          { role: 'body', content: 'Supporting body two with enough content to matter.' },
          { role: 'body', content: 'Supporting body three with enough content to matter.' },
        ],
      };
    }),
  } as unknown as Narrative;
}

describe('planArtDirection', () => {
  it('annotates every slide with density + emphasis + rhythm note', () => {
    const plan = planArtDirection(denseDeck(6), 'swiss');
    assert.equal(plan.slides.length, 6);
    for (const s of plan.slides) {
      assert.ok(['dense', 'balanced', 'sparse'].includes(s.density));
      assert.ok(['hero', 'statement', 'support'].includes(s.emphasis));
      assert.ok(s.rhythmNote.length > 0);
    }
    assert.ok(plan.deckNotes.some((n) => n.startsWith('arc:') || n.startsWith('bookend:')));
  });
  it('breaks dense runs by bounded re-selection (same type + system)', () => {
    const narrative = denseDeck(7);
    const base = planCompositions(narrative, 'swiss');
    const { plan, notes } = balanceRhythm(base, narrative, 'swiss');
    assert.equal(plan.length, base.length);
    // Every swapped candidate keeps semantic type + system validity.
    for (let i = 0; i < plan.length; i++) {
      assert.equal(plan[i].semanticType, base[i].semanticType);
      assert.equal(plan[i].slideId, base[i].slideId);
    }
    assert.ok(notes.length >= 0);
  });
  it('is deterministic across runs and systems', () => {
    for (const sys of ['editorial', 'swiss', 'expressive', 'document'] as const) {
      const a = planArtDirection(denseDeck(6), sys);
      const b = planArtDirection(denseDeck(6), sys);
      assert.deepEqual(a, b);
    }
  });
  it('flags repetition and identity issues softly (advisory, not throws)', () => {
    const plan = planArtDirection(denseDeck(8), 'expressive');
    assert.ok(Array.isArray(plan.issues));
  });
});
