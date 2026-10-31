// Typodeck visual review — machine-readable human decisions + structural
// equivalence helpers (correction 3). Aesthetic judgment stays human:
// this module scaffolds PENDING decisions and compares geometry/text
// signatures. It never invents visual QA scores.

import type { Deck } from './schema';

export type ReviewDecisionValue = 'PENDING' | 'KEEP' | 'REVISE' | 'MERGE' | 'REJECT';

export interface ReviewScores {
  readability: number | null;
  hierarchy: number | null;
  composition: number | null;
  distinctiveness: number | null;
  consistency: number | null;
  koEnQuality: number | null;
  suitability: number | null;
}

export interface ReviewDecision {
  system: string;
  systemVersion: string;
  decision: ReviewDecisionValue;
  scores: ReviewScores;
  comments: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface ReviewFile {
  version: '1.0.0';
  systems: ReviewDecision[];
}

const EMPTY_SCORES: ReviewScores = {
  readability: null,
  hierarchy: null,
  composition: null,
  distinctiveness: null,
  consistency: null,
  koEnQuality: null,
  suitability: null,
};

function blankDecision(system: string, systemVersion: string): ReviewDecision {
  return {
    system,
    systemVersion,
    decision: 'PENDING',
    scores: { ...EMPTY_SCORES },
    comments: '',
    reviewedBy: null,
    reviewedAt: null,
  };
}

/**
 * Merge-scaffold a review file: existing human decisions/comments are
 * PRESERVED by system id (never clobbered by re-runs); new systems are
 * added as PENDING; removed systems are kept as-is for audit history.
 * When a system's version changed, its decision resets to PENDING with a
 * note — prior judgment targeted different geometry.
 */
export function scaffoldDecisions(
  existing: ReviewFile | null,
  systems: Array<{ id: string; version: string }>,
): ReviewFile {
  const prior = new Map((existing?.systems ?? []).map((d) => [d.system, d]));
  const next: ReviewDecision[] = [];
  for (const s of systems) {
    const old = prior.get(s.id);
    if (!old) {
      next.push(blankDecision(s.id, s.version));
      continue;
    }
    if (old.systemVersion !== s.version) {
      next.push({
        ...blankDecision(s.id, s.version),
        comments: `Prior ${old.decision} targeted v${old.systemVersion}; re-review required. Prior comments: ${old.comments}`,
      });
      continue;
    }
    next.push(old);
  }
  // Keep entries for systems no longer present (audit history).
  for (const [id, d] of prior) {
    if (!systems.some((s) => s.id === id)) next.push(d);
  }
  next.sort((a, b) => (a.system < b.system ? -1 : 1));
  return { version: '1.0.0', systems: next };
}

export interface GeometrySignature {
  slides: Array<{
    id: string;
    blocks: Array<{
      role: string;
      x: number;
      y: number;
      w: number;
      h: number;
      fontSize: number;
      fontWeight: number;
      align: string;
      color: string;
    }>;
  }>;
}

const round4 = (n: number): number => Math.round(n * 10000) / 10000;

/** Structural signature for equivalence checks (correction 3). */
export function geometrySignature(deck: Deck): GeometrySignature {
  return {
    slides: deck.slides.map((s) => ({
      id: s.id,
      blocks: s.blocks.map((b) => ({
        role: b.role,
        x: round4(b.x),
        y: round4(b.y),
        w: round4(b.w),
        h: round4(b.h),
        fontSize: b.fontSize,
        fontWeight: b.fontWeight,
        align: b.align,
        color: b.color,
      })),
    })),
  };
}

/**
 * Workflow tokens that must never appear in rendered slide content.
 * Previews must read as real slides, never as diagnostic cards
 * (frontend-slides "preview authenticity rules"; slide-wright Step 2).
 * Matching is case-insensitive substring over the full HTML document.
 */
export const WORKFLOW_TOKENS: readonly string[] = [
  'preview.md',
  'design.md',
  'selection-index',
  'option a',
  'option b',
  'option c',
  'style option',
  'safe option',
  'bold option',
  'wildcard',
  'generated from',
  'template slug',
];

/** Return the workflow tokens found in rendered HTML (empty = authentic). */
export function findWorkflowTokens(html: string): string[] {
  const lower = html.toLowerCase();
  return WORKFLOW_TOKENS.filter((t) => lower.includes(t));
}

const normText = (s: string): string => s.replace(/\s+/g, ' ').trim();

/**
 * Semantic text parity: joined normalized text must match exactly.
 * Joining (rather than per-run matching) tolerates PPTX run-splitting
 * while remaining strict on content.
 */
export function textParityOk(expected: string[], actual: string[]): boolean {
  return normText(expected.join('\n')) === normText(actual.join('\n'));
}
