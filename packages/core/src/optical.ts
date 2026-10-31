// Typodeck 90+ — Bounded Optical Correction Engine (§5).
// Three tiers, each correction with rationale + bounded range + regression test:
//  1. measurable — derived from the engine's own wrap/geometry (auto-applied).
//  2. heuristic  — professional-practice adjustments, tightly bounded (opt-in).
//  3. experimental — proposals only; NEVER auto-applied without visual review.
//
// Policy: F10.1 (trust font metrics; no synthetic re-spacing) still holds —
// these corrections adjust box placement/line breaks, never glyph advances.

import { estimateWrap } from './layout';
import type { Deck, TextBlock } from './schema';

export type OpticalTier = 'measurable' | 'heuristic' | 'experimental';

export interface OpticalLogEntry {
  id: string;
  tier: OpticalTier;
  slideId: string;
  blockId: string;
  rationale: string;
  /** Applied delta in inches (0 for scorers/proposals). */
  deltaIn: number;
  /** Hard bound for this correction in inches. */
  maxDeltaIn: number;
  applied: boolean;
  detail: string;
}

// Line-initial chars eligible for hanging (quotes/parens). Bounded protrusion
// into the margin restores the perceived left edge (optical alignment).
const HANGABLE = new Set(['"', "'", '“', '‘', '«', '(', '[', '「', '『']);
const TRAILING_PUNCT = new Set(['.', ',', ':', ';', '!', '?', '”', '’', '」', '』', ')']);

/** Recompute wrapped lines for a block using the engine's own wrap model. */
function blockLines(b: TextBlock): string[] {
  const bold = b.fontWeight >= 700;
  return estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, bold).lines;
}

/**
 * O1 (measurable): hang leading punctuation on left-aligned blocks.
 * Bound: protrusion <= min(0.35em, 0.12in). Rationale: A06 optical alignment;
 * B03 figure-ground edge crispness. Only the first wrapped line is examined.
 */
export function hangPunctuation(deck: Deck): { deck: Deck; log: OpticalLogEntry[] } {
  const log: OpticalLogEntry[] = [];
  const slides = deck.slides.map((s) => ({
    ...s,
    blocks: s.blocks.map((b) => {
      if (b.align !== 'left') return b;
      const first = (blockLines(b)[0] ?? '').trimStart();
      const ch = first.charAt(0);
      if (!HANGABLE.has(ch)) return b;
      const emIn = b.fontSize / 72;
      const dx = Math.min(0.35 * emIn, 0.12);
      log.push({
        id: 'O1-hang-punctuation', tier: 'measurable', slideId: s.id, blockId: b.id,
        rationale: 'Hanging leading quote/paren restores perceived left edge (A06/B03).',
        deltaIn: -dx, maxDeltaIn: 0.12, applied: true,
        detail: `leading ${JSON.stringify(ch)} protrudes ${dx.toFixed(3)}in into margin`,
      });
      return { ...b, x: Math.max(0, b.x - dx), w: b.w + dx };
    }),
  }));
  return { deck: { ...deck, slides }, log };
}

/**
 * O2 (heuristic): optical centering for center-aligned heroes with trailing
 * punctuation. Bound: |dx| <= min(0.25em, 0.06in). Rationale: perceived vs
 * geometric balance (professional practice; subjective without visual review).
 */
export function opticalCenter(deck: Deck): { deck: Deck; log: OpticalLogEntry[] } {
  const log: OpticalLogEntry[] = [];
  const slides = deck.slides.map((s) => ({
    ...s,
    blocks: s.blocks.map((b) => {
      if (b.align !== 'center' || (b.role !== 'title' && b.role !== 'number')) return b;
      const lines = blockLines(b);
      const last = (lines[lines.length - 1] ?? '').trimEnd();
      const ch = last.charAt(last.length - 1);
      if (!TRAILING_PUNCT.has(ch)) return b;
      const emIn = b.fontSize / 72;
      const dx = Math.min(0.25 * emIn, 0.06);
      log.push({
        id: 'O2-optical-center', tier: 'heuristic', slideId: s.id, blockId: b.id,
        rationale: 'Trailing punctuation adds visual weight right; nudge left for perceived balance.',
        deltaIn: -dx, maxDeltaIn: 0.06, applied: true,
        detail: `trailing ${JSON.stringify(ch)} nudged left ${dx.toFixed(3)}in`,
      });
      return { ...b, x: Math.max(0, b.x - dx) };
    }),
  }));
  return { deck: { ...deck, slides }, log };
}

/**
 * O3 (measurable scorer, no auto-fix): headline rag quality 0-100.
 * Penalizes ladders (monotonic width runs) and deep final-line indents.
 * Uneven line shapes (T8) need rendered comparison before auto-rebreaking.
 */
export function ragScore(block: TextBlock): { score: number; detail: string } {
  const lines = blockLines(block).map((l) => l.trim());
  if (lines.length <= 1) return { score: 100, detail: 'single line' };
  const widths = lines.map((l) => l.length);
  let penalty = 0;
  // Ladder: 3+ consecutive lines each shorter than the last by >=1 char.
  for (let i = 0; i + 2 < widths.length; i++) {
    if (widths[i] > widths[i + 1] && widths[i + 1] > widths[i + 2]) penalty += 15;
  }
  // Orphan: final line <=2 words.
  const lastWords = lines[lines.length - 1].split(/\s+/).filter(Boolean).length;
  if (lastWords <= 2) penalty += 20;
  // Deep indent: final line <40% of widest.
  const widest = Math.max(...widths, 1);
  if (widths[widths.length - 1] / widest < 0.4) penalty += 10;
  return { score: Math.max(0, 100 - penalty), detail: `lines=${lines.length} lastWords=${lastWords}` };
}

/**
 * O4 (measurable scorer, no auto-fix): widow/orphan risk per block.
 * Returns true when the final wrapped line is a 1-2 word orphan (T8).
 * Auto-rebreaking is deferred: it changes line count and needs rendered proof.
 */
export function widowRisk(block: TextBlock): boolean {
  const lines = blockLines(block).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length <= 1) return false;
  return lines[lines.length - 1].split(/\s+/).filter(Boolean).length <= 2;
}

export interface ExperimentalProposal {
  id: string;
  slideId: string;
  blockId: string;
  rationale: string;
  proposedDeltaIn: number;
  maxDeltaIn: number;
  detail: string;
}

/**
 * O5 (experimental proposals ONLY): large-numeral positioning + overshoot.
 * Never auto-applied. F10.1 policy: glyph-level compensation lives in font
 * metrics. These proposals require visual review + measured glyph metrics
 * (ARCHITECTURE promise, unimplemented) before any application.
 */
export function experimentalProposals(deck: Deck): ExperimentalProposal[] {
  const out: ExperimentalProposal[] = [];
  for (const s of deck.slides) {
    for (const b of s.blocks) {
      if (b.role === 'number' && b.fontSize >= 72) {
        out.push({
          id: 'O5-numeral-baseline', slideId: s.id, blockId: b.id,
          rationale: 'Large numerals may sit heavy; baseline/position nudge needs measured metrics + visual review.',
          proposedDeltaIn: 0, maxDeltaIn: 0.08,
          detail: `numeral at ${b.fontSize}pt: proposal recorded, NOT applied (experimental)`,
        });
      }
    }
  }
  return out;
}

export interface ApplyOpticalOptions {
  /** Tiers to apply. Default: measurable only. Experimental is never applied. */
  tiers?: OpticalTier[];
}

/**
 * Apply bounded optical corrections to a positioned deck.
 * Measurable tier by default; heuristic opt-in; experimental proposals are
 * returned separately and never applied. Deterministic; preserves validity
 * (deltas are margin-safe: x clamped >=0, w grows only for hangs).
 */
export function applyOpticalCorrections(deck: Deck, opts: ApplyOpticalOptions = {}): {
  deck: Deck; log: OpticalLogEntry[]; proposals: ExperimentalProposal[];
} {
  const tiers = opts.tiers ?? ['measurable'];
  let current = deck;
  const log: OpticalLogEntry[] = [];
  if (tiers.includes('measurable')) {
    const r = hangPunctuation(current);
    current = r.deck;
    log.push(...r.log);
  }
  if (tiers.includes('heuristic')) {
    const r = opticalCenter(current);
    current = r.deck;
    log.push(...r.log);
  }
  // Experimental tier: proposals recorded, never applied.
  const proposals = experimentalProposals(deck);
  return { deck: current, log, proposals };
}
