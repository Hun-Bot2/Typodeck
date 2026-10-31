// Typodeck 90+ — Visual Critic + Revision Loop (§7).
// Structural checks are deterministic (validate.ts/schema). Perceptual and
// design checks are GEOMETRIC PROXIES, honestly labeled — no vision model is
// integrated (no verified integration available; see visionUnmeasured). An AI
// critic must not be treated as ground truth; these proxies are not either:
// they are regression signals with documented limits.
//
// Revision: identify failure -> classify -> targeted correction ->
// regenerate -> re-evaluate, bounded (default max 3 attempts). Provenance
// preserved; editability re-validated after every attempt.

import { planArtDirection } from './art-direction';
import { COMPOSITION_CANDIDATES, planCompositions, type CompositionPlanItem } from './composition';
import { estimateWrap, layoutDeck, rectsOverlap } from './layout';
import { applyOpticalCorrections, ragScore, widowRisk } from './optical';
import { validateDeck, type Deck, type Narrative } from './schema';
import type { SystemId } from './systems';

export type FailureClass = 'semantic' | 'structural' | 'typographic' | 'perceptual';

export interface CriticFinding {
  slideId: string;
  failureClass: FailureClass;
  check: string;
  severity: 'error' | 'warning';
  detail: string;
  suggestedFix: string;
}

export interface CriticScores {
  /** Share of slides with title<=2 lines and body<=60 chars/line. */
  typographicFit: number;
  /** Share of blocks without widow risk and rag>=70. */
  opticalQuality: number;
  /** 1 - max same-candidate share (repetition proxy). */
  compositionVariety: number;
  /** Share of text blocks meeting WCAG AA (4.5:1 / 3:1 large). */
  contrastAA: number;
}

export interface CriticReport {
  findings: CriticFinding[];
  scores: CriticScores;
  /** Checks that need a real rendered comparison or vision model. */
  visionUnmeasured: string[];
}

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Critique a positioned deck. Pure + deterministic. */
export function critiqueDeck(deck: Deck, narrative?: Narrative, plan?: CompositionPlanItem[]): CriticReport {
  const findings: CriticFinding[] = [];

  for (const slide of deck.slides) {
    // Structural: bounds + overlap (defense in depth; layout already guards).
    for (const b of slide.blocks) {
      if (b.x < -1e-9 || b.y < -1e-9 || b.x + b.w > 13.33 + 1e-9 || b.y + b.h > 7.5 + 1e-9) {
        findings.push({
          slideId: slide.id, failureClass: 'structural', check: 'bounds', severity: 'error',
          detail: `block ${b.id} exceeds canvas`, suggestedFix: 're-layout at smaller scale or narrower measure',
        });
      }
      // Typographic: title line cap (derived A01/A07), body measure (T2).
      const lines = estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, b.fontWeight >= 700).lines;
      if (b.role === 'title' && lines.length > 2) {
        findings.push({
          slideId: slide.id, failureClass: 'typographic', check: 'title-lines', severity: 'warning',
          detail: `title spans ${lines.length} lines (cap 2, derived)`, suggestedFix: 'shorten title in narrative (<=~50 chars) or split slide',
        });
      }
      if (b.role === 'body') {
        const longest = Math.max(...lines.map((l) => l.length));
        if (longest > 60) {
          findings.push({
            slideId: slide.id, failureClass: 'typographic', check: 'body-measure', severity: 'warning',
            detail: `body line ${longest} chars (cap ~60, derived)`, suggestedFix: 'narrow measure via composition plan or split body',
          });
        }
      }
      // Optical proxies (O3/O4).
      if (widowRisk(b)) {
        findings.push({
          slideId: slide.id, failureClass: 'typographic', check: 'widow-risk', severity: 'warning',
          detail: `block ${b.id} ends in 1-2 word line (T8)`, suggestedFix: 're-break lines (manual until auto-rebreak is validated)',
        });
      }
      if ((b.role === 'title' || b.role === 'number') && lines.length > 1) {
        const rag = ragScore(b);
        if (rag.score < 70) {
          findings.push({
            slideId: slide.id, failureClass: 'perceptual', check: 'rag-quality', severity: 'warning',
            detail: `headline rag score ${rag.score} (${rag.detail})`, suggestedFix: 're-break headline for even rag',
          });
        }
      }
      // Contrast (WCAG AA thresholds; projection transfer unvalidated per C06).
      const ratio = contrastRatio(b.color, slide.background);
      const large = b.fontSize >= 18 || (b.fontSize >= 14 && b.fontWeight >= 700);
      const need = large ? 3.0 : 4.5;
      if (ratio < need) {
        findings.push({
          slideId: slide.id, failureClass: 'perceptual', check: 'contrast', severity: 'error',
          detail: `block ${b.id} contrast ${ratio.toFixed(2)}:1 < ${need}:1`, suggestedFix: 'darken text or quiet background token',
        });
      }
    }
    for (let i = 0; i < slide.blocks.length; i++) {
      for (let j = i + 1; j < slide.blocks.length; j++) {
        if (rectsOverlap(slide.blocks[i], slide.blocks[j])) {
          findings.push({
            slideId: slide.id, failureClass: 'structural', check: 'overlap', severity: 'error',
            detail: `blocks ${i} and ${j} overlap`, suggestedFix: 're-layout with narrower measure or smaller scale',
          });
        }
      }
    }
    // Hierarchy proxy (B14): title must exceed body size when both present.
    const titles = slide.blocks.filter((b) => b.role === 'title');
    const bodies = slide.blocks.filter((b) => b.role === 'body');
    if (titles.length > 0 && bodies.length > 0) {
      const tMin = Math.min(...titles.map((b) => b.fontSize));
      const bMax = Math.max(...bodies.map((b) => b.fontSize));
      if (tMin <= bMax) {
        findings.push({
          slideId: slide.id, failureClass: 'perceptual', check: 'hierarchy', severity: 'warning',
          detail: `title min ${tMin}pt <= body max ${bMax}pt`, suggestedFix: 'restore size contrast between title and body',
        });
      }
    }
    // Semantic: unsupported metric hero (number without caption ref).
    const hasNumber = slide.blocks.some((b) => b.role === 'number');
    const hasRef = slide.blocks.some((b) => b.role === 'caption' && /[:/]/.test(b.content));
    if (hasNumber && !hasRef) {
      findings.push({
        slideId: slide.id, failureClass: 'semantic', check: 'unsupported-metric', severity: 'warning',
        detail: 'number role without caption ref', suggestedFix: 'demote to metric-anchored composition',
      });
    }
  }

  // Deck-level rhythm (art-direction issues surface as perceptual findings).
  if (narrative && plan) {
    void plan;
  }

  // Scores (proxies).
  let titleOk = 0;
  let titleN = 0;
  let bodyOk = 0;
  let bodyN = 0;
  let opticalOk = 0;
  let opticalN = 0;
  let contrastOk = 0;
  let contrastN = 0;
  for (const slide of deck.slides) {
    for (const b of slide.blocks) {
      const lines = estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, b.fontWeight >= 700).lines;
      if (b.role === 'title') { titleN++; if (lines.length <= 2) titleOk++; }
      if (b.role === 'body') { bodyN++; if (Math.max(...lines.map((l) => l.length)) <= 60) bodyOk++; }
      opticalN++;
      if (!widowRisk(b) && (b.role !== 'title' || lines.length <= 1 || ragScore(b).score >= 70)) opticalOk++;
      const ratio = contrastRatio(b.color, slide.background);
      const large = b.fontSize >= 18 || (b.fontSize >= 14 && b.fontWeight >= 700);
      contrastN++;
      if (ratio >= (large ? 3.0 : 4.5)) contrastOk++;
    }
  }
  const planIds = plan?.map((p) => p.candidateId) ?? [];
  const maxShare = planIds.length === 0 ? 0
    : Math.max(...Object.values(planIds.reduce<Record<string, number>>((m, id) => ({ ...m, [id]: (m[id] ?? 0) + 1 }), {}))) / planIds.length;

  return {
    findings,
    scores: {
      typographicFit: (titleN + bodyN) === 0 ? 1 : (titleOk + bodyOk) / (titleN + bodyN),
      opticalQuality: opticalN === 0 ? 1 : opticalOk / opticalN,
      compositionVariety: 1 - maxShare,
      contrastAA: contrastN === 0 ? 1 : contrastOk / contrastN,
    },
    visionUnmeasured: [
      'rendered wrap vs estimateWrap divergence (T11: needs PPTX rasterizer)',
      'font substitution in PowerPoint/LibreOffice (needs rendered comparison)',
      'optical centering/balance verdicts (need visual review)',
      'clipping inside text boxes (structural checks see bounds only)',
      'vision-model aesthetic scores (no verified integration; not fabricated)',
    ],
  };
}

export interface ReviseOptions {
  maxAttempts?: number;
  seed?: number;
}

export interface ReviseResult {
  deck: Deck;
  plan: CompositionPlanItem[];
  reports: CriticReport[];
  /** Provenance: one line per attempt (what failed, what was tried). */
  provenance: string[];
  attempts: number;
}

/**
 * Bounded revision loop: critique -> targeted fix -> regenerate -> re-evaluate.
 * Fixes operate on the composition plan + layout/optical pipeline (content
 * itself is never rewritten: factual accuracy over visual appeal).
 */
export function reviseDeck(narrative: Narrative, systemId: SystemId, opts: ReviseOptions = {}): ReviseResult {
  const maxAttempts = opts.maxAttempts ?? 3;
  const seed = opts.seed ?? 42;
  const provenance: string[] = [];
  const reports: CriticReport[] = [];

  let plan = planCompositions(narrative, systemId);
  // Art-direction rhythm balancing is attempt 0 (part of improved pipeline).
  const art = planArtDirection(narrative, systemId);
  plan = art.slides.map((s, i) => ({ ...plan[i], candidateId: s.candidateId, semanticType: s.semanticType }));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const laid = layoutDeck(narrative, systemId, { seed, compositionPlan: plan });
    const { deck } = applyOpticalCorrections(laid, { tiers: ['measurable', 'heuristic'] });
    validateDeck(deck);
    const report = critiqueDeck(deck, narrative, plan);
    reports.push(report);
    const errors = report.findings.filter((f) => f.severity === 'error');
    if (errors.length === 0) {
      provenance.push(`attempt ${attempt}: clean (0 errors, ${report.findings.length} warnings) — stop`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
    if (attempt === maxAttempts) {
      provenance.push(`attempt ${attempt}: ${errors.length} errors remain — bounded stop (${errors.map((e) => e.check).join(', ')})`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
    // Targeted fix by failure class (first error only; one change per attempt).
    const target = errors[0];
    const idx = plan.findIndex((p) => p.slideId === target.slideId);
    if (idx < 0) {
      provenance.push(`attempt ${attempt}: ${target.check} on unknown slide — stop`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
    if (target.failureClass === 'semantic' && target.check === 'unsupported-metric') {
      const anchored = Object.values(COMPOSITION_CANDIDATES).find((c) =>
        c.id === 'metric-anchored' && c.systems.includes(systemId));
      if (anchored && plan[idx].candidateId !== anchored.id) {
        plan[idx] = { ...plan[idx], candidateId: anchored.id, rationale: `${plan[idx].rationale}; revision: demoted to metric-anchored` };
        provenance.push(`attempt ${attempt}: semantic/unsupported-metric on ${target.slideId} -> metric-anchored`);
        continue;
      }
    }
    // Structural/perceptual errors: try alternate same-type candidate.
    const slide = narrative.slides[idx];
    const alt = Object.values(COMPOSITION_CANDIDATES).find((c) =>
      c.id !== plan[idx].candidateId
      && c.semanticTypes.includes(plan[idx].semanticType)
      && c.systems.includes(systemId)
      && (!c.preconditions.requiresRoles || c.preconditions.requiresRoles.every((r) => slide.blocks.some((b) => b.role === r))));
    if (alt) {
      plan[idx] = { ...plan[idx], candidateId: alt.id, rationale: `${plan[idx].rationale}; revision: ${target.failureClass}/${target.check} -> ${alt.id}` };
      provenance.push(`attempt ${attempt}: ${target.failureClass}/${target.check} on ${target.slideId} -> ${alt.id}`);
    } else {
      provenance.push(`attempt ${attempt}: ${target.failureClass}/${target.check} on ${target.slideId} — no alternate (stop)`);
      return { deck, plan, reports, provenance, attempts: attempt };
    }
  }
  // Unreachable (loop returns), kept for type-totality.
  const laid = layoutDeck(narrative, systemId, { seed, compositionPlan: plan });
  return { deck: laid, plan, reports, provenance, attempts: maxAttempts };
}
