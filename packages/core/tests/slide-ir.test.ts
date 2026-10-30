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
