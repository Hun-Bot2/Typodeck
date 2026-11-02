// Stage-4 hierarchy eval: arms A (text-only) and C (layout-only).
//
// Arm A sees Narrative + intent ONLY (roles/content/intent). It MUST NOT read
// geometry, sizes, weights, or colors: every a/* rule takes a NarrativeSlide.
// Blind-by-design on visual-only defects (number-scale, clip, contrast) — the
// modality gap of 09-HCI §4 is the hypothesis, and A-recall ~ 0 there is the
// predicted result, not an arm failure.
//
// Arm C sees Deck geometry + intent ONLY (no pixels, no model). Every c/*
// check is NEW eval-owned code on positioned slides; the runner cross-checks
// agreement with the frozen C4 checks as a diagnostic (never as a metric).

import { intentRank, prominenceProxy } from './prominence';
import type { ArmFinding, DefectCategory } from './types';

// Structural mirrors of core C1/schema shapes (eval-owned; no core import).
export interface IntentLike {
  emphasis?: string;
  groupId?: string;
  relation?: string;
  deliberateCrop?: boolean;
}
export interface NarrativeBlockLike {
  role: string;
  content: string;
  intent?: IntentLike;
}
export interface NarrativeSlideLike {
  id: string;
  blocks: NarrativeBlockLike[];
}
export interface TextBlockLike extends NarrativeBlockLike {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  fontWeight: number;
  tracking: number;
  lineHeight: number;
  align: string;
  color: string;
}
export interface SlideLike {
  id: string;
  background: string;
  blocks: TextBlockLike[];
}

// ---------------------------------------------------------------------------
// Arm A: text-only rules (NarrativeSlide -> findings).
// ---------------------------------------------------------------------------

/** a/no-primary: a multi-block slide with no primary emphasis. */
export function checkANoPrimary(slide: NarrativeSlideLike): ArmFinding | null {
  if (slide.blocks.length < 2) return null;
  const hasPrimary = slide.blocks.some((b) => b.intent?.emphasis === 'primary');
  if (hasPrimary) return null;
  return {
    arm: 'A',
    check: 'a/no-primary',
    category: 'headline-prominence',
    targets: [slide.id],
    evidence: `${slide.blocks.length} blocks, 0 with primary emphasis`,
  };
}

/** a/primary-on-caption: primary emphasis sits on a caption role. */
export function checkAPrimaryOnCaption(
  slide: NarrativeSlideLike,
): ArmFinding | null {
  const idx = slide.blocks.findIndex(
    (b) => b.role === 'caption' && b.intent?.emphasis === 'primary',
  );
  if (idx < 0) return null;
  return {
    arm: 'A',
    check: 'a/primary-on-caption',
    category: 'headline-prominence',
    targets: [`#${idx}`],
    evidence: `block #${idx} (caption) carries primary emphasis`,
  };
}

/** a/dangling-group: a groupId with exactly one member on the slide. */
export function checkADanglingGroup(
  slide: NarrativeSlideLike,
): ArmFinding | null {
  const counts = new Map<string, number[]>();
  slide.blocks.forEach((b, i) => {
    const gid = b.intent?.groupId;
    if (typeof gid === 'string' && gid.length > 0) {
      const list = counts.get(gid) ?? [];
      list.push(i);
      counts.set(gid, list);
    }
  });
  for (const [gid, members] of counts) {
    if (members.length === 1) {
      return {
        arm: 'A',
        check: 'a/dangling-group',
        category: 'grouping',
        targets: [`#${members[0]}`],
        evidence: `group ${gid} has 1 member (block #${members[0]})`,
      };
    }
  }
  return null;
}

/** Run all Arm A rules on one narrative slide. */
export function runArmA(slide: NarrativeSlideLike): ArmFinding[] {
  const out: ArmFinding[] = [];
  for (const f of [
    checkANoPrimary(slide),
    checkAPrimaryOnCaption(slide),
    checkADanglingGroup(slide),
  ]) {
    if (f) out.push(f);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Arm C: layout-only checks (Slide geometry + intent -> findings).
// ---------------------------------------------------------------------------

function pOf(b: TextBlockLike): number {
  return prominenceProxy(b.fontSize, b.fontWeight);
}

/**
 * c/primary-subordinate: primary-emphasis blocks exist AND the max-P block is
 * non-primary AND exceeds the max primary P by > 5%. (Frozen C4 predicate,
 * independently re-implemented; runner asserts agreement with core.)
 */
export function checkCPrimarySubordinate(slide: SlideLike): ArmFinding | null {
  const primaries = slide.blocks.filter(
    (b) => b.intent?.emphasis === 'primary',
  );
  if (primaries.length === 0) return null;
  let maxPrimary = primaries[0];
  for (const b of primaries) if (pOf(b) > pOf(maxPrimary)) maxPrimary = b;
  const others = slide.blocks.filter((b) => b.intent?.emphasis !== 'primary');
  if (others.length === 0) return null;
  let maxOther = others[0];
  for (const b of others) if (pOf(b) > pOf(maxOther)) maxOther = b;
  const pP = pOf(maxPrimary);
  const pO = pOf(maxOther);
  if (pO <= pP * 1.05) return null;
  const pct = ((pO / pP - 1) * 100).toFixed(1);
  return {
    arm: 'C',
    check: 'c/primary-subordinate',
    category: 'headline-prominence',
    targets: [maxOther.id, maxPrimary.id],
    evidence: `${maxOther.id} P=${pO.toFixed(2)} exceeds primary ${maxPrimary.id} P=${pP.toFixed(2)} by ${pct}% (>5%)`,
  };
}

/** Strict area overlap (edge-touching is not a cut). */
function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return (
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
  );
}

/**
 * c/grouping-split: a multi-member group's bbox is cut by a non-member.
 * One finding per slide (first cut group in first-seen order).
 */
export function checkCGroupingSplit(slide: SlideLike): ArmFinding | null {
  const groups = new Map<string, TextBlockLike[]>();
  for (const b of slide.blocks) {
    const gid = b.intent?.groupId;
    if (typeof gid !== 'string' || gid.length === 0) continue;
    const list = groups.get(gid);
    if (list) list.push(b);
    else groups.set(gid, [b]);
  }
  for (const [gid, members] of groups) {
    if (members.length < 2) continue;
    const minX = Math.min(...members.map((b) => b.x));
    const minY = Math.min(...members.map((b) => b.y));
    const maxX = Math.max(...members.map((b) => b.x + b.w));
    const maxY = Math.max(...members.map((b) => b.y + b.h));
    const memberIds = new Set(members.map((b) => b.id));
    const intruder = slide.blocks.find(
      (b) =>
        !memberIds.has(b.id) &&
        rectsOverlap(b, { x: minX, y: minY, w: maxX - minX, h: maxY - minY }),
    );
    if (intruder) {
      return {
        arm: 'C',
        check: 'c/grouping-split',
        category: 'grouping',
        targets: [...memberIds, intruder.id],
        evidence: `group ${gid} bbox x[${minX.toFixed(2)},${maxX.toFixed(2)}] y[${minY.toFixed(2)},${maxY.toFixed(2)}] cut by ${intruder.id}`,
      };
    }
  }
  return null;
}

/** c/dangling-group: a groupId with exactly one member on the slide. */
export function checkCDanglingGroup(slide: SlideLike): ArmFinding | null {
  const counts = new Map<string, string[]>();
  for (const b of slide.blocks) {
    const gid = b.intent?.groupId;
    if (typeof gid !== 'string' || gid.length === 0) continue;
    const list = counts.get(gid) ?? [];
    list.push(b.id);
    counts.set(gid, list);
  }
  for (const [gid, members] of counts) {
    if (members.length === 1) {
      return {
        arm: 'C',
        check: 'c/dangling-group',
        category: 'grouping',
        targets: members,
        evidence: `group ${gid} has 1 member (${members[0]})`,
      };
    }
  }
  return null;
}

/**
 * c/number-scale: a number-role block exceeds the max primary P by > 50%.
 * Skips silently when no primary or no number exists.
 */
export function checkCNumberScale(slide: SlideLike): ArmFinding | null {
  const primaries = slide.blocks.filter(
    (b) => b.intent?.emphasis === 'primary',
  );
  const numbers = slide.blocks.filter((b) => b.role === 'number');
  if (primaries.length === 0 || numbers.length === 0) return null;
  const maxPP = Math.max(...primaries.map(pOf));
  let maxN = numbers[0];
  for (const b of numbers) if (pOf(b) > pOf(maxN)) maxN = b;
  if (maxN.intent?.emphasis === 'primary') return null;
  const pN = pOf(maxN);
  if (pN <= maxPP * 1.5) return null;
  const pct = ((pN / maxPP - 1) * 100).toFixed(1);
  return {
    arm: 'C',
    check: 'c/number-scale',
    category: 'number-scale',
    targets: [maxN.id],
    evidence: `number ${maxN.id} P=${pN.toFixed(2)} exceeds max primary P=${maxPP.toFixed(2)} by ${pct}% (>50%)`,
  };
}

// -- Estimate-only wrap model (mirrors the role of estimateWrap; labeled) --

function estimateLines(
  content: string,
  fontSize: number,
  boxWIn: number,
  tracking: number,
  bold: boolean,
): string[] {
  // Char-width estimate in the spirit of the core char model: mean advance
  // ~0.5em (0.55em when bold), plus tracking. ESTIMATE-ONLY: the headless
  // rendered gate is authoritative for real clipping.
  const meanAdvIn = (fontSize / 72) * (bold ? 0.55 : 0.5) * (1 + tracking);
  const perLine = Math.max(1, Math.floor(boxWIn / Math.max(meanAdvIn, 1e-6)));
  const words = content.split(/\s+/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const trial = cur.length === 0 ? w : `${cur} ${w}`;
    if (trial.length <= perLine || cur.length === 0) {
      cur = trial;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur.length > 0) lines.push(cur);
  return lines.length > 0 ? lines : [''];
}

/**
 * c/support-clip: a secondary/supporting block whose estimated ink height
 * exceeds its box (or estimated width exceeds box width). ESTIMATE-ONLY.
 */
export function checkCSupportClip(slide: SlideLike): ArmFinding | null {
  for (const b of slide.blocks) {
    const r = intentRank(b.intent?.emphasis);
    if (r < 1 || r > 2) continue; // secondary/supporting only
    const lines = estimateLines(
      b.content,
      b.fontSize,
      b.w,
      b.tracking,
      b.fontWeight >= 700,
    );
    const inkH = lines.length * (b.fontSize / 72) * b.lineHeight * 0.8;
    const maxChars = Math.max(...lines.map((l) => l.length));
    const estW =
      maxChars * (b.fontSize / 72) * (b.fontWeight >= 700 ? 0.55 : 0.5) * (1 + b.tracking);
    if (inkH > b.h + 0.005 || estW > b.w + 0.005) {
      return {
        arm: 'C',
        check: 'c/support-clip',
        category: 'clip',
        targets: [b.id],
        evidence: `block ${b.id} estimate ${estW.toFixed(2)}x${inkH.toFixed(2)}in exceeds box ${b.w.toFixed(2)}x${b.h.toFixed(2)}in (ESTIMATE-ONLY)`,
      };
    }
  }
  return null;
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

/** c/contrast: WCAG AA fail (4.5:1, 3:1 large). First failing block. */
export function checkCContrast(slide: SlideLike): ArmFinding | null {
  for (const b of slide.blocks) {
    const ratio = contrastRatio(b.color, slide.background);
    const large = b.fontSize >= 18 || (b.fontSize >= 14 && b.fontWeight >= 700);
    const need = large ? 3.0 : 4.5;
    if (ratio < need) {
      return {
        arm: 'C',
        check: 'c/contrast',
        category: 'contrast',
        targets: [b.id],
        evidence: `block ${b.id} contrast ${ratio.toFixed(2)}:1 < ${need}:1`,
      };
    }
  }
  return null;
}

/**
 * All multi-member groups on the slide and whether each bbox is cut by a
 * non-member. Powers the Grouping Consistency metric (all groups counted,
 * not just the first cut).
 */
export function listGroupCuts(
  slide: SlideLike,
): { groupId: string; members: number; cut: boolean }[] {
  const groups = new Map<string, TextBlockLike[]>();
  for (const b of slide.blocks) {
    const gid = b.intent?.groupId;
    if (typeof gid !== 'string' || gid.length === 0) continue;
    const list = groups.get(gid);
    if (list) list.push(b);
    else groups.set(gid, [b]);
  }
  const out: { groupId: string; members: number; cut: boolean }[] = [];
  for (const [gid, members] of groups) {
    if (members.length < 2) continue;
    const minX = Math.min(...members.map((b) => b.x));
    const minY = Math.min(...members.map((b) => b.y));
    const maxX = Math.max(...members.map((b) => b.x + b.w));
    const maxY = Math.max(...members.map((b) => b.y + b.h));
    const memberIds = new Set(members.map((b) => b.id));
    const cut = slide.blocks.some(
      (b) =>
        !memberIds.has(b.id) &&
        rectsOverlap(b, { x: minX, y: minY, w: maxX - minX, h: maxY - minY }),
    );
    out.push({ groupId: gid, members: members.length, cut });
  }
  return out;
}

/** Run all Arm C checks on one positioned slide. */
export function runArmC(slide: SlideLike): ArmFinding[] {
  const out: ArmFinding[] = [];
  for (const f of [
    checkCPrimarySubordinate(slide),
    checkCGroupingSplit(slide),
    checkCDanglingGroup(slide),
    checkCNumberScale(slide),
    checkCSupportClip(slide),
    checkCContrast(slide),
  ]) {
    if (f) out.push(f);
  }
  return out;
}

/** Category hit test: does any finding cover this category? */
export function hitsCategory(
  findings: ArmFinding[],
  category: DefectCategory,
): boolean {
  return findings.some((f) => f.category === category);
}
