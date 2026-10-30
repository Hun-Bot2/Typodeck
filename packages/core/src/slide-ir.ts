/** Content density policy: how much text a slide may carry. Metadata only. */
export type DensityPolicy = 'speaker-led' | 'reading-first';

  /** Density policy (see skills/typodeck/density.md). Metadata only: renderers must not change content for it. */
  densityPolicy?: DensityPolicy;
export function narrativeToSlideIR(
  narrative: Narrative,
  claims: Claim[],
  opts: { preset?: string; densityPolicy?: DensityPolicy } = {},
): SlideIR {
    return {
      id: slide.id,
      type,
      thesis: slide.thesis,
      blocks: slide.blocks,
      refs,
      statuses,
      ...(slide.notes !== undefined ? { notes: slide.notes } : {}),
    };
    ...(opts.densityPolicy ? { densityPolicy: opts.densityPolicy } : {}),
    slides: ir.slides.map((s) => ({
      id: s.id,
      thesis: s.thesis,
      blocks: s.blocks,
      ...(s.notes !== undefined ? { notes: s.notes } : {}),
    })),
  if (v.densityPolicy !== undefined && v.densityPolicy !== 'speaker-led' && v.densityPolicy !== 'reading-first') {
    fail('densityPolicy must be "speaker-led" or "reading-first"');
  }
