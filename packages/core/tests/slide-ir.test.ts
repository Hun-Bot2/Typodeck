// Slide IR: provenance linking, validation, narrative round-trip, escaping.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import { planNarrative } from '../src/narrative';
import { planCompositions } from '../src/composition';
import { layoutDeck } from '../src/layout';
import { SYSTEM_IDS } from '../src/systems';
import {
  SLIDE_IR_VERSION,
  escapeHtml,
  narrativeToSlideIR,
  slideIRToNarrative,
  validateSlideIR,
} from '../src/slide-ir';
import { SEMANTIC_TYPES } from '../src/composition';
import { loadFixtureText } from './fake-fetch';

function f4Preset() {
  const claims = extractClaims(acceptIdea(loadFixtureText('idea-f4.txt')));
  const narrative = planNarrative(claims, { preset: 'P04', lang: 'en' });
  return { claims, narrative };
}

describe('narrativeToSlideIR', () => {
  it('types every slide and links thesis slides to evidence', () => {
    const { claims, narrative } = f4Preset();
    const ir = narrativeToSlideIR(narrative, claims, { preset: 'P04' });
    assert.equal(ir.version, SLIDE_IR_VERSION);
    assert.equal(ir.preset, 'P04');
    assert.equal(ir.slides.length, narrative.slides.length);
    for (const s of ir.slides) {
      assert.ok((SEMANTIC_TYPES as readonly string[]).includes(s.type));
    }
    const linked = ir.slides.filter((s) => s.refs.length > 0);
    assert.ok(linked.length >= 3, `only ${linked.length} slides linked`);
    assert.ok(linked.every((s) => s.refs.every((r) => r.startsWith('idea.txt:'))));
    assert.ok(linked.every((s) => s.statuses.length > 0));
  });
  it('reports empty refs for unlinked slides instead of fabricating', () => {
    const { claims } = f4Preset();
    const unrelated = {
      title: 'Unrelated',
      lang: 'en',
      slides: [
        { id: 'n1-cover', thesis: 'Lorem ipsum dolor sit amet', blocks: [{ role: 'title', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed' }] },
      ],
    } as unknown as import('../src/schema').Narrative;
    const ir = narrativeToSlideIR(unrelated, claims);
    assert.deepEqual(ir.slides[0].refs, []);
    assert.deepEqual(ir.slides[0].statuses, []);
  });
  it('is deterministic', () => {
    const { claims, narrative } = f4Preset();
    assert.deepEqual(narrativeToSlideIR(narrative, claims), narrativeToSlideIR(narrative, claims));
  });
});

describe('slideIRToNarrative', () => {
  it('round-trips narrative content exactly (emphasis dropped, notes preserved)', () => {
    const { claims, narrative } = f4Preset();
    const ir = narrativeToSlideIR(narrative, claims);
    ir.slides[0].emphasis = 'lead with the metric';
    ir.slides[0].notes = 'Pause for questions.';
    const back = slideIRToNarrative(ir);
    // Emphasis is renderer-only metadata (dropped); notes flow to PPTX notes.
    assert.equal(back.slides[0].notes, 'Pause for questions.');
    const { notes: _dropped, ...backFirst } = back.slides[0] as typeof back.slides[0] & { notes?: string };
    void _dropped;
    assert.deepEqual({ ...back, slides: [backFirst, ...back.slides.slice(1)] }, narrative);
  });
});

describe('validateSlideIR', () => {
  const good = () => {
    const { claims, narrative } = f4Preset();
    return JSON.parse(JSON.stringify(narrativeToSlideIR(narrative, claims))) as ReturnType<typeof narrativeToSlideIR>;
  };
  it('accepts well-formed IR', () => {
    validateSlideIR(good());
  });
  it('rejects structural violations', () => {
    const cases: Array<[string, (ir: ReturnType<typeof good>) => void]> = [
      ['version', (ir) => { (ir as unknown as Record<string, unknown>).version = '9.9.9'; }],
      ['empty slides', (ir) => { ir.slides = []; }],
      ['dup id', (ir) => { ir.slides[1].id = ir.slides[0].id; }],
      ['unknown type', (ir) => { (ir.slides[0] as unknown as Record<string, unknown>).type = 'meme'; }],
      ['empty blocks', (ir) => { ir.slides[0].blocks = []; }],
      ['unknown status', (ir) => { (ir.slides[0].statuses as unknown[]).push('vibes'); }],
      ['bad emphasis', (ir) => { (ir.slides[0] as unknown as Record<string, unknown>).emphasis = 42; }],
    ];
    for (const [name, mutate] of cases) {
      const ir = good();
      mutate(ir);
      assert.throws(() => validateSlideIR(ir), /invalid Slide IR/, name);
    }
  });
});

describe('renderer independence (phase 3)', () => {
  it('same IR renders identical text content in every system', () => {
    const { claims, narrative } = f4Preset();
    const ir = narrativeToSlideIR(narrative, claims, { preset: 'P04' });
    const texts = SYSTEM_IDS.map((system) => {
      const deck = layoutDeck(slideIRToNarrative(ir), system, { seed: 7 });
      return deck.slides.map((s) => s.blocks.map((b) => `${b.role}:${b.content}`));
    });
    for (const t of texts.slice(1)) assert.deepEqual(t, texts[0]);
  });
  it('layout never mutates or reorders the narrative (no feedback)', () => {
    const { narrative } = f4Preset();
    const before = JSON.parse(JSON.stringify(narrative)) as typeof narrative;
    for (const system of SYSTEM_IDS) {
      layoutDeck(narrative, system, { seed: 7 });
      assert.deepEqual(narrative, before, `layout mutated input for ${system}`);
    }
  });
  it('composition plans never change slide text, only geometry', () => {
    const { claims, narrative } = f4Preset();
    void claims;
    const plan = planCompositions(narrative, 'swiss');
    const a = layoutDeck(narrative, 'swiss', { seed: 7 });
    const b = layoutDeck(narrative, 'swiss', { seed: 7, compositionPlan: plan });
    const texts = (d: typeof a) => d.slides.map((s) => s.blocks.map((x) => `${x.role}:${x.content}`));
    assert.deepEqual(texts(a), texts(b));
  });
});

describe('escapeHtml', () => {
  it('escapes markup-significant characters', () => {
    assert.equal(escapeHtml('<script>alert("x") & \'y\'</script>'), '&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;');
  });
});

describe('densityPolicy', () => {
  it('round-trips as metadata and never alters slide content', () => {
    const { claims, narrative } = f4Preset();
    const a = narrativeToSlideIR(narrative, claims, { preset: 'P04', densityPolicy: 'speaker-led' });
    const b = narrativeToSlideIR(narrative, claims, { preset: 'P04', densityPolicy: 'reading-first' });
    assert.equal(a.densityPolicy, 'speaker-led');
    assert.equal(b.densityPolicy, 'reading-first');
    assert.deepEqual(
      a.slides.map((s) => s.blocks),
      b.slides.map((s) => s.blocks),
    );
    assert.deepEqual(validateSlideIR(a).densityPolicy, 'speaker-led');
  });
  it('rejects unknown policies', () => {
    const { claims, narrative } = f4Preset();
    const ir = narrativeToSlideIR(narrative, claims, {});
    assert.throws(() => validateSlideIR({ ...ir, densityPolicy: 'medium' }), /densityPolicy/);
  });
});

describe('notes passthrough', () => {
  it('carries notes from narrative to IR and back without touching blocks', () => {
    const { claims, narrative } = f4Preset();
    narrative.slides[0].notes = 'Pause for questions.';
    const ir = narrativeToSlideIR(narrative, claims, {});
    assert.equal(ir.slides[0].notes, 'Pause for questions.');
    const back = slideIRToNarrative(ir);
    assert.equal(back.slides[0].notes, 'Pause for questions.');
    assert.deepEqual(
      back.slides[0].blocks,
      narrative.slides[0].blocks,
    );
  });
});
