// Typodeck 90+ — Deck-Level Art Direction (§6).
// A professional deck is not a set of individually attractive slides.
// This planner annotates density/emphasis/rhythm deck-wide and performs ONE
// bounded revision: re-select among same-type candidates to break dense runs.
// No rigid quotas: soft budgets, never forced unnatural layouts.
//
// Systems stay genuinely distinct: signature primitives per system
// (editorial: controlled-asymmetry, swiss: column-rhythm,
// expressive: scale-contrast) are preserved by re-selection, which only
// swaps within the same semantic type + system pool.

import {
  COMPOSITION_CANDIDATES,
  planCompositions,
  type CompositionPlanItem,
  type SemanticSlideType,
} from './composition';
import type { Narrative } from './schema';
import type { SystemId } from './systems';

export type Density = 'dense' | 'balanced' | 'sparse';
export type Emphasis = 'hero' | 'statement' | 'support';

export interface ArtDirectionSlide {
  slideId: string;
  semanticType: SemanticSlideType;
  candidateId: string;
  density: Density;
  emphasis: Emphasis;
  rhythmNote: string;
}

export interface ArtDirectionPlan {
  systemId: SystemId;
  slides: ArtDirectionSlide[];
  deckNotes: string[];
  issues: string[];
}

function densityOf(candidateId: string, bodyCount: number): Density {
  const c = COMPOSITION_CANDIDATES[candidateId];
  if (!c) return 'balanced';
  if (c.constraints.columns >= 2 || bodyCount >= 3) return 'dense';
  if (c.primitives.includes('negative-space') && bodyCount <= 1) return 'sparse';
  return 'balanced';
}

function emphasisOf(type: SemanticSlideType, candidateId: string): Emphasis {
  const c = COMPOSITION_CANDIDATES[candidateId];
  const heroTypes: SemanticSlideType[] = ['opening', 'metric', 'conclusion', 'quote'];
  if (heroTypes.includes(type) && c?.primitives.includes('scale-contrast')) return 'hero';
  if (type === 'transition' || type === 'evidence') return 'support';
  return 'statement';
}

/**
 * Bounded rhythm revision: break runs of 3+ dense slides by re-selecting an
 * alternate same-type, same-system candidate with columns<2 (when one meets
 * preconditions). At most one swap per run; original plan otherwise kept.
 */
export function balanceRhythm(
  plan: CompositionPlanItem[],
  narrative: Narrative,
  systemId: SystemId,
): { plan: CompositionPlanItem[]; notes: string[] } {
  const notes: string[] = [];
  const next = [...plan];
  const densities = plan.map((p, i) => {
    const slide = narrative.slides[i];
    const bodies = slide ? slide.blocks.filter((b) => b.role === 'body').length : 0;
    return densityOf(p.candidateId, bodies);
  });
  for (let i = 0; i + 2 < next.length; i++) {
    if (densities[i] === 'dense' && densities[i + 1] === 'dense' && densities[i + 2] === 'dense') {
      const mid = i + 1;
      const current = COMPOSITION_CANDIDATES[next[mid].candidateId];
      const slide = narrative.slides[mid];
      const bodies = slide.blocks.filter((b) => b.role === 'body').length;
      const alt = Object.values(COMPOSITION_CANDIDATES).find((c) =>
        c.id !== next[mid].candidateId
        && c.semanticTypes.includes(next[mid].semanticType)
        && c.systems.includes(systemId)
        && c.constraints.columns < 2
        && (!c.preconditions.requiresRoles || c.preconditions.requiresRoles.every((r) => slide.blocks.some((b) => b.role === r)))
        && (c.preconditions.maxBodyBlocks === undefined || bodies <= c.preconditions.maxBodyBlocks)
        && (c.preconditions.minBodyBlocks === undefined || bodies >= c.preconditions.minBodyBlocks));
      if (alt) {
        next[mid] = {
          ...next[mid],
          candidateId: alt.id,
          rationale: `${next[mid].rationale}; art-direction: broke dense run at position ${mid} by swapping ${current?.id ?? '?'} -> ${alt.id}`,
          score: next[mid].score - 0.5,
        };
        densities[mid] = densityOf(alt.id, bodies);
        notes.push(`broke dense run at slide ${next[mid].slideId} (${current?.id ?? '?'} -> ${alt.id})`);
      } else {
        notes.push(`dense run at slides ${i}-${i + 2}: no sparse alternate available (kept)`);
      }
    }
  }
  return { plan: next, notes };
}

/** Deck-level planning: composition plan + rhythm revision + annotations. */
export function planArtDirection(
  narrative: Narrative,
  systemId: SystemId,
  opts: { audience?: string } = {},
): ArtDirectionPlan {
  const base = planCompositions(narrative, systemId, opts);
  const { plan, notes } = balanceRhythm(base, narrative, systemId);
  const issues: string[] = [];
  const deckNotes: string[] = [...notes];

  const slides: ArtDirectionSlide[] = plan.map((p, i) => {
    const slide = narrative.slides[i];
    const bodies = slide.blocks.filter((b) => b.role === 'body').length;
    const density = densityOf(p.candidateId, bodies);
    const emphasis = emphasisOf(p.semanticType, p.candidateId);
    let rhythmNote = `${density}/${emphasis}`;
    if (i > 0 && plan[i - 1].candidateId === p.candidateId) {
      rhythmNote += '; repeats previous candidate';
    }
    return { slideId: p.slideId, semanticType: p.semanticType, candidateId: p.candidateId, density, emphasis, rhythmNote };
  });

  // Measurable checks (soft; advisory, never forced quotas).
  const counts = new Map<string, number>();
  for (const p of plan) counts.set(p.candidateId, (counts.get(p.candidateId) ?? 0) + 1);
  for (const [id, n] of counts) {
    if (plan.length >= 5 && n / plan.length > 0.5) {
      issues.push(`repetition: ${id} covers ${n}/${plan.length} slides (>50% soft budget)`);
    }
  }
  let denseRun = 0;
  for (const s of slides) {
    denseRun = s.density === 'dense' ? denseRun + 1 : 0;
    if (denseRun >= 4) {
      issues.push(`rhythm: ${denseRun} dense slides in a row ending at ${s.slideId}`);
      break;
    }
  }
  // Opening/closing relationship: they should differ in family (statement vs
  // restatement) unless the deck is a deliberate bookend (same candidate).
  if (slides.length >= 2) {
    const first = slides[0];
    const last = slides[slides.length - 1];
    if (first.candidateId === last.candidateId) {
      deckNotes.push(`bookend: opening and closing share ${first.candidateId} (deliberate echo)`);
    } else {
      deckNotes.push(`arc: ${first.candidateId} opens, ${last.candidateId} closes`);
    }
  }
  // System identity: signature primitive should appear across the deck.
  const signature: Record<SystemId, string> = {
    editorial: 'controlled-asymmetry', swiss: 'column-rhythm', expressive: 'scale-contrast',
    document: 'textual-repetition',
  };
  const sigUse = plan.filter((p) => COMPOSITION_CANDIDATES[p.candidateId]?.primitives.includes(signature[systemId] as never)).length;
  if (plan.length >= 3 && sigUse / plan.length < 0.3) {
    issues.push(`identity: ${systemId} signature ${signature[systemId]} on ${sigUse}/${plan.length} slides (<30%)`);
  }
  return { systemId, slides, deckNotes, issues };
}
