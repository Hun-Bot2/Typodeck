import {
  PRESET_IDS,
  PRESETS,
  VISUAL_SYSTEMS,
  listVisualSystems,
  resolveVisualSystem,
} from '@typodeck/core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Studio catalog: purpose presets + visual systems for selectors, galleries,
 * and descriptions. Systems report `renderable` (registry entry with shipped
 * typography); experimental candidates without tokens are listed honestly
 * as not yet renderable.
 */
export async function GET(): Promise<Response> {
  const purposes = PRESET_IDS.map((id) => {
    const p = PRESETS[id];
    return {
      id: p.id,
      version: p.version,
      name: p.name,
      audience: p.audience,
      goal: p.goal,
      steps: p.steps.map((s) => ({ id: s.id, dim: s.dim, label: s.label, optional: s.optional ?? false })),
      langNotes: p.langNotes,
    };
  });
  const systems = listVisualSystems(VISUAL_SYSTEMS, ['production', 'experimental', 'deprecated']).map((e) => {
    let renderable = false;
    let fonts: { heading: string; body: string } | null = null;
    try {
      const r = resolveVisualSystem(e.id);
      renderable = true;
      fonts = { heading: r.typography.fonts.heading.join(', '), body: r.typography.fonts.body.join(', ') };
    } catch {
      renderable = false;
    }
    return {
      id: e.id,
      version: e.version,
      status: e.status,
      philosophy: e.philosophy,
      supports: e.supports,
      limitations: e.limitations,
      renderable,
      fonts,
    };
  });
  return Response.json({ purposes, systems });
}
