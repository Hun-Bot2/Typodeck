// Typodeck Typography Core — deterministic layout engine.
// Pure function: (narrative, system) -> positioned deck.
// Seeded/deterministic: identical input bytes -> byte-identical output.
// Overflow is estimated with an approximate char-width model that treats
// CJK wide glyphs as 1em; text shrinks/wraps to fit and blocks never overlap.

import {
  SLIDE_HEIGHT_IN,
  SLIDE_WIDTH_IN,
  validateNarrative,
  type BlockIntent,
  type Deck,
  type Narrative,
  type NarrativeSlide,
  type TextAlign,
  type TextBlock,
  type TextRole,
} from './schema';
import {
  backgroundFor,
  colorFor,
  fontFaceFor,
  getSystem,
  themedSystem,
  type SystemId,
  type ThemeOverride,
  type TypographySystem,
} from './systems';
import {
  COMPOSITION_CANDIDATES,
  type CompositionPlanItem,
} from './composition';
import { VISUAL_SYSTEMS } from './visual-systems';

// ---------------------------------------------------------------------------
// Deterministic hashing / PRNG
// ---------------------------------------------------------------------------

/** FNV-1a 32-bit hash — deterministic across runs and platforms. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32 seeded PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Text measurement (approximate char-width model, CJK-aware)
// ---------------------------------------------------------------------------

const NARROW = new Set('il.,:;!\'"|()[]·∙'.split(''));
// NOTE: '1' is deliberately NOT narrow: digits render tabular in most stacks
// (Georgia/serif '1' ≈ 0.6em, not 0.35em). Narrow-'1' underflowed R1 numeral
// boxes and wrapped "12" under honest font measurement.
const WIDE_LATIN = new Set('mwMW@$%&_~QO'.split(''));

function isWideCjk(code: number): boolean {
  return (
    (code >= 0x1100 && code <= 0x11ff) || // Hangul Jamo
    (code >= 0x2e80 && code <= 0x9fff) || // CJK radicals, kana, ideographs
    (code >= 0xac00 && code <= 0xd7a3) || // Hangul syllables
    (code >= 0xf900 && code <= 0xfaff) || // CJK compat ideographs
    (code >= 0xff00 && code <= 0xffef) // Fullwidth forms
  );
}

/** Approximate advance width of one character in em units. */
export function charWidthEm(ch: string, bold: boolean): number {
  if (ch === ' ' || ch === '\t') return 0.28;
  const code = ch.codePointAt(0) ?? 0;
  if (isWideCjk(code)) return 1.0;
  let w: number;
  if (NARROW.has(ch)) w = 0.35;
  else if (WIDE_LATIN.has(ch)) w = 0.85;
  else if (code >= 0x41 && code <= 0x5a) w = 0.7; // A-Z
  else if (code >= 0x30 && code <= 0x39) w = 0.58; // 0-9
  else w = 0.55;
  return bold ? w * 1.06 : w;
}

export interface WrapResult {
  lines: string[];
  /** Widest line width in inches. */
  maxWidthIn: number;
  /** Total text height in inches at the given size/leading. */
  heightIn: number;
}

/** Chars that must not open a line (KLREQ §7.1.2 line-head restrictions). */
const KINSOKU_HEAD = new Set(['.', ',', '?', '!', ':', ';', '%', ')', ']', '}', '’', '”', '·', '…', '—']);

/** Chars that must not close a line (KLREQ §7.1.3 line-end restrictions). */
const KINSOKU_TAIL = new Set(['(', '[', '{', '‘', '“']);

/**
 * Kinsoku-lite repair over one paragraph's lines (indices [from, ...)).
 * Moves a single offending char across the boundary: closing punctuation
 * hangs onto the previous line's end, opening punctuation pushes to the
 * next line's start. Slight hanging overflow is allowed — real renderers
 * hang/justify it, so the estimate must not predict a break they won't
 * make. Never moves across explicit newlines. Deterministic.
 */
function fixKinsoku(lines: string[], from: number): void {
  for (let i = from + 1; i < lines.length; i++) {
    // Pull leading closing punctuation up to the previous line's end.
    const chars = Array.from(lines[i]);
    let lead = 0;
    while (lead < chars.length && KINSOKU_HEAD.has(chars[lead])) lead++;
    if (lead > 0) {
      lines[i - 1] += chars.slice(0, lead).join('');
      lines[i] = chars.slice(lead).join('');
    }
    // Push trailing opening punctuation down to this line's start.
    // Never empties the previous line; skips lines with trailing spaces.
    const prev = lines[i - 1];
    const units = Array.from(prev);
    let trail = 0;
    while (trail < units.length - 1 && !prev.endsWith(' ') && KINSOKU_TAIL.has(units[units.length - 1 - trail])) {
      trail++;
    }
    if (trail > 0) {
      lines[i] = units.slice(units.length - trail).join('') + lines[i];
      lines[i - 1] = units.slice(0, units.length - trail).join('');
    }
  }
  for (let i = lines.length - 1; i >= from; i--) {
    if (lines[i] === '' && lines.length > from + 1) lines.splice(i, 1);
  }
}

/**
 * Greedy wrap: KO/CJK breaks at character level, EN at word level.
 * Explicit newlines in content force line breaks. Kinsoku-lite head/end
 * restrictions hold on every line. Deterministic.
 */
export function estimateWrap(
  content: string,
  fontSizePt: number,
  maxWidthIn: number,
  trackingEm: number,
  lineHeight: number,
  bold: boolean,
): WrapResult {
  const emIn = fontSizePt / 72;
  const perChar = (ch: string): number => (charWidthEm(ch, bold) + trackingEm) * emIn;
  const lines: string[] = [];

  for (const paragraph of content.split('\n')) {
    const from = lines.length;
    // Tokenize: each CJK char is its own token; latin runs stay word-glued.
    const tokens: string[] = [];
    let buf = '';
    const flush = (): void => {
      if (buf.length > 0) {
        tokens.push(buf);
        buf = '';
      }
    };
    for (const ch of paragraph) {
      if (ch === ' ') {
        flush();
        tokens.push(' ');
      } else if (isWideCjk(ch.codePointAt(0) ?? 0)) {
        flush();
        tokens.push(ch);
      } else {
        buf += ch;
      }
    }
    flush();

    let line = '';
    let lineW = 0;
    const pushLine = (): void => {
      lines.push(line);
      line = '';
      lineW = 0;
    };
    const tokenW = (t: string): number => [...t].reduce((a, c) => a + perChar(c), 0);

    for (const tok of tokens) {
      if (tok === ' ') {
        // Break opportunity; keep single space if line non-empty.
        if (line !== '' && !line.endsWith(' ')) {
          line += ' ';
          lineW += perChar(' ');
        }
        continue;
      }
      const w = tokenW(tok);
      if (lineW + w <= maxWidthIn || line === '') {
        // Fits — or the line is empty and a single token overflows,
        // in which case hard-break the token char by char.
        if (w <= maxWidthIn || line !== '') {
          line += tok;
          lineW += w;
          continue;
        }
        for (const ch of tok) {
          const cw = perChar(ch);
          if (lineW + cw > maxWidthIn && line !== '') pushLine();
          line += ch;
          lineW += cw;
        }
      } else {
        pushLine();
        // Re-check fit on the fresh line (may still need hard-break).
        if (w <= maxWidthIn) {
          line = tok;
          lineW = w;
        } else {
          for (const ch of tok) {
            const cw = perChar(ch);
            if (lineW + cw > maxWidthIn && line !== '') pushLine();
            line += ch;
            lineW += cw;
          }
        }
      }
    }
    pushLine();
    fixKinsoku(lines, from);
  }

  // Kinsoku repair moves chars across boundaries; re-measure the widest line.
  let maxW = 0;
  for (const ln of lines) {
    let w = 0;
    for (const ch of ln) w += perChar(ch);
    if (w > maxW) maxW = w;
  }

  return { lines, maxWidthIn: maxW, heightIn: lines.length * emIn * lineHeight };
}

export interface FitResult {
  fontSize: number;
  lines: string[];
  widthIn: number;
  heightIn: number;
}

/**
 * Ink height of a wrap: line-box total minus the last line's sub-cap excess
 * (~0.3 line box; cap ≈ 0.7em EST, research findings). Rendering clips ink,
 * not line boxes — a 231pt single line in a 2.5in div is clean (Tier-B G1),
 * and the static estimate must agree with the rendered gate on that.
 */
export function inkHeightIn(wrap: WrapResult, fontSizePt: number, lineHeight: number): number {
  if (wrap.lines.length === 0) return 0;
  return Math.max(0, wrap.heightIn - ((fontSizePt / 72) * lineHeight * 0.3));
}

/** Shrink font size until the text fits the box (or min size reached). */
export function fitText(
  content: string,
  boxW: number,
  boxH: number,
  startSize: number,
  minSize: number,
  trackingEm: number,
  lineHeight: number,
  bold: boolean,
): FitResult {
  let size = startSize;
  let r = estimateWrap(content, size, boxW, trackingEm, lineHeight, bold);
  while ((inkHeightIn(r, size, lineHeight) > boxH || r.maxWidthIn > boxW) && size > minSize) {
    size = Math.max(minSize, size - Math.max(1, Math.round(size * 0.08)));
    r = estimateWrap(content, size, boxW, trackingEm, lineHeight, bold);
  }
  return { fontSize: size, lines: r.lines, widthIn: Math.min(r.maxWidthIn, boxW), heightIn: Math.min(inkHeightIn(r, size, lineHeight), boxH) };
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const EPS = 1e-6;

/** True when two rects overlap with positive area (touching edges is fine). */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x + EPS < b.x + b.w - EPS &&
    b.x + EPS < a.x + a.w - EPS &&
    a.y + EPS < b.y + b.h - EPS &&
    b.y + EPS < a.y + a.h - EPS
  );
}

/**
 * First block whose char-model estimate exceeds its box (the silent-clip
 * class), or null. Same tolerance as the critic's overflow-risk check; the
 * layout loop retries smaller scales on a hit (R3 "shrink"), the critic
 * warns on residue, and the rendered gate measures the truth.
 */
export function estimatedOverflowBlock(blocks: TextBlock[]): string | null {
  for (const b of blocks) {
    const bold = b.fontWeight >= 700;
    const est = estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, bold);
    if (inkHeightIn(est, b.fontSize, b.lineHeight) > b.h + 0.005 || est.maxWidthIn > b.w + 0.005) return b.id;
  }
  return null;
}

/** Throw if any pair of blocks overlaps. Returns void on success. */
export function assertNoOverlaps(blocks: Rect[], slideId: string): void {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (rectsOverlap(blocks[i], blocks[j])) {
        throw new Error(`overlapping text blocks on slide "${slideId}" (blocks ${i} and ${j})`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Placement strategies (one per system — materially different composition)
// ---------------------------------------------------------------------------

interface Plan {
  role: TextRole;
  content: string;
  /** Author intent carried through untouched; never read by geometry (Stage 3, C1). */
  intent?: BlockIntent;
  x: number;
  y: number;
  w: number;
  /** Max allowed height; final h is fitted to content. */
  maxH: number;
  align: TextAlign;
  /** Display-size override for composition-driven planners (G1/G3). */
  size?: { fontSize: number; minFontSize: number };
}

interface Ctx {
  system: TypographySystem;
  slide: NarrativeSlide;
  slideIndex: number;
  rng: () => number;
  /** Global size scale for overflow relaxation (1 = full size). */
  sizeScale: number;
  /** Composition-plan overrides (1 / null = baseline behavior). */
  rhythmScale: number;
  bodyAlignOverride: TextAlign | null;
  /** Body measure cap in chars/line (derived heuristic; null = no cap). */
  bodyMeasureCap: number | null;
  /** True when a candidate theme overrode fonts/colors (stamp fontFace). */
  themed: boolean;
  /** Narrative locale (ko|en): themed fontFace resolution follows it. */
  lang: string;
}

/** Resolve per-slide composition overrides. Absent plan = baseline. */
function overridesFromPlan(planItem: CompositionPlanItem | undefined): Pick<Ctx, 'rhythmScale' | 'bodyAlignOverride' | 'bodyMeasureCap'> {
  if (!planItem) return { rhythmScale: 1, bodyAlignOverride: null, bodyMeasureCap: null };
  const c = COMPOSITION_CANDIDATES[planItem.candidateId];
  if (!c) return { rhythmScale: 1, bodyAlignOverride: null, bodyMeasureCap: null };
  return {
    rhythmScale: c.constraints.rhythmScale,
    bodyAlignOverride: c.constraints.bodyAlign ?? null,
    bodyMeasureCap: c.constraints.maxBodyCharsPerLine,
  };
}

/**
 * Narrow a body box to the measure cap. Avg latin advance ~0.5em is a
 * conservative derived heuristic (A01/A07); CJK chars are wider so capped
 * Korean lines stay shorter, which matches D01 extra-leading intent.
 */
function applyMeasureCap(ctx: Ctx, role: TextRole, baseW: number, fontSizePt: number): number {
  if (role !== 'body' || ctx.bodyMeasureCap === null) return baseW;
  const capW = (ctx.bodyMeasureCap * 0.5 * fontSizePt) / 72;
  return Math.min(baseW, Math.max(2.5, capW));
}

const BLOCK_PAD = 0.04; // breathing room inside fitted boxes

function styleFor(ctx: Ctx, role: TextRole) {
  const st = ctx.system.scale[role];
  if (ctx.sizeScale === 1) return st;
  return {
    ...st,
    fontSize: Math.max(5, st.fontSize * ctx.sizeScale),
    minFontSize: Math.max(4, st.minFontSize * ctx.sizeScale),
  };
}

/** Editorial: asymmetric single-column stack with alternating indent. */
function planEditorial(ctx: Ctx): Plan[] {
  const { system, slide, slideIndex } = ctx;
  const m = system.margin;
  const R = system.rhythm * ctx.rhythmScale;
  const indent = slideIndex % 2 === 1 ? 1.4 : 0; // asymmetry, deterministic
  const x = m + indent;
  const baseW = Math.min(8.6, SLIDE_WIDTH_IN - x - m);
  let y = 1.5;
  const plans: Plan[] = [];
  for (const b of slide.blocks) {
    const st = styleFor(ctx, b.role);
    const w = applyMeasureCap(ctx, b.role, baseW, st.fontSize);
    const maxH = SLIDE_HEIGHT_IN - m - y;
    plans.push({ role: b.role, content: b.content, intent: b.intent, x, y, w, maxH, align: st.align });
    // Advance cursor by fitted height (computed in materialize via same fit).
    const fit = fitText(b.content, w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    y += fit.heightIn + BLOCK_PAD * 2 + R + (b.role === 'title' ? 0.1 : 0);
  }
  return plans;
}

/** Swiss: rigorous 4-column grid; title left, bodies flow into right columns. */
function planSwiss(ctx: Ctx): Plan[] {
  const { system, slide } = ctx;
  const m = system.margin;
  const R = system.rhythm * ctx.rhythmScale;
  const gutter = 0.3;
  const gridW = SLIDE_WIDTH_IN - m * 2;
  const colW = (gridW - gutter * 3) / 4;
  const colX = (c: number): number => m + c * (colW + gutter);
  const span = (c: number, n: number): { x: number; w: number } => ({
    x: colX(c),
    w: colW * n + gutter * (n - 1),
  });

  const plans: Plan[] = [];
  const topY = 1.1;
  const bodyTopY = 2.35;
  let stackY = bodyTopY;
  let leftY = bodyTopY;
  let titleBottom = bodyTopY;
  let rightColUsed: Plan[] = [];

  for (const b of slide.blocks) {
    const st = styleFor(ctx, b.role);
    if (b.role === 'kicker') {
      const s = span(0, 2);
      plans.push({ role: b.role, content: b.content, intent: b.intent, x: s.x, y: topY, w: s.w, maxH: 0.8, align: st.align });
    } else if (b.role === 'title' || b.role === 'number') {
      const s = span(0, 2);
      const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - leftY);
      const fit = fitText(b.content, s.w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
      plans.push({ role: b.role, content: b.content, intent: b.intent, x: s.x, y: leftY, w: s.w, maxH, align: st.align });
      leftY += fit.heightIn + BLOCK_PAD * 2 + R;
      titleBottom = Math.max(titleBottom, leftY);
    } else if (b.role === 'caption') {
      const s = span(2, 2);
      plans.push({
        role: b.role, content: b.content, intent: b.intent, x: s.x, y: SLIDE_HEIGHT_IN - m - 0.6, w: s.w, maxH: 0.6, align: st.align,
      });
    } else {
      // Bodies: first body goes to right column block; extras stack below title.
      const idx = rightColUsed.length;
      if (idx === 0) {
        const s = span(2, 2);
        const w = applyMeasureCap(ctx, b.role, s.w, st.fontSize);
        const fit = fitText(b.content, w, SLIDE_HEIGHT_IN - m - bodyTopY - 0.8, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
        plans.push({ role: b.role, content: b.content, intent: b.intent, x: s.x, y: bodyTopY, w, maxH: SLIDE_HEIGHT_IN - m - bodyTopY - 0.8, align: st.align });
        stackY = bodyTopY + fit.heightIn + BLOCK_PAD * 2 + R;
        rightColUsed.push(plans[plans.length - 1]);
      } else if (idx === 1) {
        // Second body: right column continuation (comparison-style).
        const s = span(2, 2);
        const w = applyMeasureCap(ctx, b.role, s.w, st.fontSize);
        const y = stackY;
        const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - 0.8 - y);
        const fit2 = fitText(b.content, w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
        plans.push({ role: b.role, content: b.content, intent: b.intent, x: s.x, y, w, maxH, align: st.align });
        stackY = y + fit2.heightIn + BLOCK_PAD * 2 + R;
        rightColUsed.push(plans[plans.length - 1]);
      } else {
        const s = span(0, 4);
        const w = applyMeasureCap(ctx, b.role, s.w, st.fontSize);
        const y = Math.max(stackY, titleBottom);
        stackY = y;
        plans.push({ role: b.role, content: b.content, intent: b.intent, x: s.x, y, w, maxH: SLIDE_HEIGHT_IN - m - 0.8 - y, align: st.align });
        rightColUsed.push(plans[plans.length - 1]);
      }
    }
  }
  return plans;
}

/** Expressive: centered hero composition with dramatic scale contrast. */
function planExpressive(ctx: Ctx): Plan[] {
  const { system, slide, rng } = ctx;
  const m = system.margin;
  const R = system.rhythm * ctx.rhythmScale;
  const cx = SLIDE_WIDTH_IN / 2;
  const plans: Plan[] = [];

  const kickers = slide.blocks.filter((b) => b.role === 'kicker');
  const heroes = slide.blocks.filter((b) => b.role === 'title' || b.role === 'number');
  const bodies = slide.blocks.filter((b) => b.role === 'body');
  const captions = slide.blocks.filter((b) => b.role === 'caption');

  // Seeded hero width variant: full-bleed-ish vs inset (deterministic).
  const heroSpan = 11.2 - Math.floor(rng() * 3) * 0.9;
  const heroW = Math.min(heroSpan, SLIDE_WIDTH_IN - m * 2);
  const heroX = cx - heroW / 2;
  const bodyW = Math.min(7.4, SLIDE_WIDTH_IN - m * 2 - 2);
  const bodyX = cx - bodyW / 2;

  // Pre-fit heroes to vertically center the hero band.
  const heroFits = heroes.map((b) => {
    const st = styleFor(ctx, b.role);
    return fitText(b.content, heroW, 5.2, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
  });
  const heroBandH = heroFits.reduce((a, f) => a + f.heightIn + BLOCK_PAD * 2, 0) + R * Math.max(0, heroes.length - 1);
  const captionTop = SLIDE_HEIGHT_IN - m - 0.55;
  const centeredY = (SLIDE_HEIGHT_IN - heroBandH) / 2 - (kickers.length > 0 ? 0.25 : 0) - (bodies.length > 0 ? 0.35 : 0);
  // Top-anchor when centering would push bodies into the caption zone.
  const heroBandY = Math.max(0.6, Math.min(centeredY, captionTop - heroBandH - bodies.length * 0.6));

  for (const b of kickers) {
    const st = styleFor(ctx, b.role);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: bodyX, y: heroBandY - 0.75, w: bodyW, maxH: 0.65, align: st.align });
  }
  let hy = heroBandY;
  heroes.forEach((b, i) => {
    const st = styleFor(ctx, b.role);
    void heroFits[i];
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: heroX, y: hy, w: heroW, maxH: 5.2, align: st.align });
    hy += heroFits[i].heightIn + BLOCK_PAD * 2 + R;
  });
  let by = hy + 0.05;
  for (const b of bodies) {
    const st = styleFor(ctx, b.role);
    const w = applyMeasureCap(ctx, b.role, bodyW, st.fontSize);
    const x = cx - w / 2;
    const fit = fitText(b.content, w, SLIDE_HEIGHT_IN - m - 0.55 - by, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x, y: by, w, maxH: Math.max(0.4, SLIDE_HEIGHT_IN - m - 0.55 - by), align: st.align });
    by += fit.heightIn + BLOCK_PAD * 2 + R;
  }
  for (const b of captions) {
    const st = styleFor(ctx, b.role);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: bodyX, y: SLIDE_HEIGHT_IN - m - 0.45, w: bodyW, maxH: 0.45, align: st.align });
  }
  return plans;
}

/**
 * Document (experimental): hierarchy-stack. A narrow left meta column holds
 * section markers (kicker/number); titles and bodies stack densely in the
 * wide right content zone; captions sit bottom-right as source lines.
 * Single pass over narrative blocks, so emission order matches content order.
 */
function planDocument(ctx: Ctx): Plan[] {
  const { system, slide } = ctx;
  const m = system.margin;
  const R = system.rhythm * ctx.rhythmScale;
  const metaW = 2.0;
  const gutter = 0.5;
  const contentX = m + metaW + gutter;
  const contentW = SLIDE_WIDTH_IN - contentX - m;
  const topY = 1.0;
  const captionH = 0.6;
  const captionY = SLIDE_HEIGHT_IN - m - captionH;

  const plans: Plan[] = [];
  let metaY = topY;
  let contentY = topY;
  for (const b of slide.blocks) {
    const st = styleFor(ctx, b.role);
    const bold = st.fontWeight >= 700;
    if (b.role === 'kicker' || b.role === 'number') {
      const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - metaY);
      const fit = fitText(b.content, metaW, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, bold);
      plans.push({ role: b.role, content: b.content, intent: b.intent, x: m, y: metaY, w: metaW, maxH, align: st.align });
      metaY += fit.heightIn + BLOCK_PAD * 2 + R;
    } else if (b.role === 'caption') {
      plans.push({
        role: b.role, content: b.content, intent: b.intent, x: contentX, y: captionY, w: contentW, maxH: captionH, align: st.align,
      });
    } else {
      const w = applyMeasureCap(ctx, b.role, contentW, st.fontSize);
      const maxH = Math.max(0.4, captionY - R - contentY);
      const fit = fitText(b.content, w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, bold);
      plans.push({ role: b.role, content: b.content, intent: b.intent, x: contentX, y: contentY, w, maxH, align: st.align });
      contentY += fit.heightIn + BLOCK_PAD * 2 + R;
    }
  }
  return plans;
}

// ---------------------------------------------------------------------------
// Composition-driven planners: G1/G3 (research/slide-reconstruction).
// Geometry is evidence-derived (Tier-B gapminder-tq2-p1/tle-p5 heuristics);
// every size scales with ctx.sizeScale so the overflow-relaxation loop
// converges. Palette/faces stay system-driven (materialize/colorFor):
// the grammar is geometry, not paint.
// ---------------------------------------------------------------------------

/** G-series display size: Tier-B base points × sizeScale, system min. */
function gSize(ctx: Ctx, role: TextRole, basePt: number): { fontSize: number; minFontSize: number } {
  const st = styleFor(ctx, role);
  return { fontSize: Math.min(400, Math.max(5, basePt * ctx.sizeScale)), minFontSize: st.minFontSize };
}

/** Footer triad (Tier-B: thirds at the footer line) + stacked overflow captions. */
function planCaptions(
  ctx: Ctx,
  captions: Array<{ role: TextRole; content: string; intent?: BlockIntent }>,
  x0: number,
  fullW: number,
  contentEndY: number,
): Plan[] {
  const m = ctx.system.margin;
  const R = ctx.system.rhythm * ctx.rhythmScale;
  const footerH = 0.3;
  const footerY = SLIDE_HEIGHT_IN - m - footerH;
  const plans: Plan[] = [];
  const triad = captions.length >= 3 ? captions.slice(-3) : [];
  const rest = captions.length >= 3 ? captions.slice(0, -3) : captions;
  let y = contentEndY;
  for (const b of rest) {
    const st = styleFor(ctx, b.role);
    const maxH = Math.max(0.25, footerY - R - y);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: x0, y, w: fullW, maxH, align: st.align });
    const fit = fitText(b.content, fullW, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  if (triad.length === 3) {
    const tw = fullW / 3;
    const aligns: TextAlign[] = ['left', 'center', 'right'];
    triad.forEach((b, i) => {
      const st = styleFor(ctx, b.role);
      plans.push({ role: b.role, content: b.content, intent: b.intent, x: x0 + tw * i, y: footerY, w: tw, maxH: footerH, align: aligns[i] });
    });
  }
  return plans;
}

/**
 * G1 monumental-numeral cover: kicker → giant numeral (~30% canvas height)
 * → title (~1/4 numeral) → footer triad, left-edge anchored.
 * R1: numeral box width grows with digit count (measured advance + pad).
 * R2: titles wrapping past 1 line step down ×0.72 and grow to 2 lines.
 */
function planMonumentalNumeral(ctx: Ctx): Plan[] {
  const { system, slide } = ctx;
  const m = system.margin;
  const R = system.rhythm * ctx.rhythmScale;
  const x0 = Math.max(m, 0.6);
  const fullW = SLIDE_WIDTH_IN - x0 - m;
  const plans: Plan[] = [];

  const kickers = slide.blocks.filter((b) => b.role === 'kicker');
  const numbers = slide.blocks.filter((b) => b.role === 'number');
  const titles = slide.blocks.filter((b) => b.role === 'title');
  const bodies = slide.blocks.filter((b) => b.role === 'body');
  const captions = slide.blocks.filter((b) => b.role === 'caption');

  let y = 0.72;
  for (const b of kickers) {
    const st = styleFor(ctx, b.role);
    const size = gSize(ctx, b.role, 35);
    const maxH = 0.7;
    const fit = fitText(b.content, fullW, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: x0, y, w: fullW, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  const hero = numbers[0];
  if (hero) {
    const st = styleFor(ctx, 'number');
    const bold = st.fontWeight >= 700;
    const size = gSize(ctx, 'number', 231);
    // R1: width from measured advance (chars × width + tracking) + pad.
    const emIn = size.fontSize / 72;
    const measured = [...hero.content].reduce((a, ch) => a + charWidthEm(ch, bold) + st.tracking, 0) * emIn;
    const w = Math.min(fullW, Math.max(2.0, measured + 0.3));
    const maxH = 2.5;
    const fit = fitText(hero.content, w, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, bold);
    plans.push({ role: hero.role, content: hero.content, intent: hero.intent, x: x0, y, w, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  const head = titles[0];
  if (head) {
    const st = styleFor(ctx, 'title');
    const bold = st.fontWeight >= 700;
    // R2: single-line display size, else one step down + 2-line box.
    const base = gSize(ctx, 'title', 57);
    const lines0 = estimateWrap(head.content, base.fontSize, fullW, st.tracking, st.lineHeight, bold).lines.length;
    const size = lines0 > 1
      ? { fontSize: Math.max(base.minFontSize, base.fontSize * 0.72), minFontSize: base.minFontSize }
      : base;
    const est = estimateWrap(head.content, size.fontSize, fullW, st.tracking, st.lineHeight, bold);
    const maxH = Math.max(0.4, est.heightIn + BLOCK_PAD * 2 + 0.1);
    const fit = fitText(head.content, fullW, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, bold);
    plans.push({ role: head.role, content: head.content, intent: head.intent, x: x0, y, w: fullW, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  // Degenerate extras (further numbers/titles) stack at title scale; bodies
  // stack at system body scale. Roles preserved, never dropped.
  for (const b of [...numbers.slice(1), ...titles.slice(1)]) {
    const st = styleFor(ctx, b.role);
    const size = gSize(ctx, b.role, 57);
    const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - 0.7 - y);
    const fit = fitText(b.content, fullW, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: x0, y, w: fullW, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  for (const b of bodies) {
    const st = styleFor(ctx, b.role);
    const w = applyMeasureCap(ctx, b.role, fullW, st.fontSize);
    const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - 0.7 - y);
    const fit = fitText(b.content, w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: x0, y, w, maxH, align: st.align });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  plans.push(...planCaptions(ctx, captions, x0, fullW, y));
  return plans;
}

/**
 * G3 explainer columns: runhead/headline/lede full-width, then grouped
 * columns (single-column variant at <=2 middle bodies, 2-column above),
 * optional closing, footer triad.
 * R3: bodies shrink to min, spill into following whitespace (each box may
 * extend to the footer line), residue is flagged overflow-risk by the critic.
 */
function planExplainerColumns(ctx: Ctx): Plan[] {
  const { system, slide } = ctx;
  const m = system.margin;
  const R = system.rhythm * ctx.rhythmScale;
  const x0 = Math.max(m, 0.6);
  const fullW = SLIDE_WIDTH_IN - x0 - m;
  const gutter = 0.4;
  const colW = (fullW - gutter) / 2;
  const plans: Plan[] = [];

  const kickers = slide.blocks.filter((b) => b.role === 'kicker');
  const titles = slide.blocks.filter((b) => b.role === 'title');
  const bodies = slide.blocks.filter((b) => b.role === 'body');
  const captions = slide.blocks.filter((b) => b.role === 'caption');
  const footerTop = SLIDE_HEIGHT_IN - m - 0.35;

  let y = 0.25;
  const run = kickers[0];
  if (run) {
    const st = styleFor(ctx, run.role);
    const size = gSize(ctx, run.role, 12);
    const maxH = 0.4;
    const fit = fitText(run.content, fullW, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: run.role, content: run.content, intent: run.intent, x: x0, y, w: fullW, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  const head = titles[0];
  if (head) {
    const st = styleFor(ctx, head.role);
    const size = gSize(ctx, head.role, 30);
    const maxH = 1.2;
    const fit = fitText(head.content, fullW, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: head.role, content: head.content, intent: head.intent, x: x0, y, w: fullW, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  const lede = bodies[0];
  if (lede) {
    const st = styleFor(ctx, lede.role);
    const size = gSize(ctx, lede.role, 13.5);
    const w = applyMeasureCap(ctx, lede.role, fullW, size.fontSize);
    const maxH = Math.max(0.4, footerTop - R - y);
    const fit = fitText(lede.content, w, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: lede.role, content: lede.content, intent: lede.intent, x: x0, y, w, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  // Middle queue: degenerate extra kickers/titles join the column flow.
  let middle: Array<{ role: TextRole; content: string; intent?: BlockIntent }> = [...kickers.slice(1), ...titles.slice(1), ...bodies.slice(1)];
  let closing: { role: TextRole; content: string; intent?: BlockIntent } | null = null;
  if (middle.length >= 3 && bodies.length >= 3) {
    closing = middle[middle.length - 1];
    middle = middle.slice(0, -1);
  }
  const placeBody = (b: { role: TextRole; content: string; intent?: BlockIntent }, bx: number, by: number, bw: number): number => {
    const st = styleFor(ctx, b.role);
    const size = gSize(ctx, b.role, 13);
    const w = applyMeasureCap(ctx, b.role, bw, size.fontSize);
    const maxH = Math.max(0.25, footerTop - R - by);
    const fit = fitText(b.content, w, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: b.role, content: b.content, intent: b.intent, x: bx, y: by, w, maxH, align: st.align, size });
    return by + Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  };
  if (middle.length <= 2) {
    for (const b of middle) y = placeBody(b, x0, y, fullW);
  } else {
    const left = middle.slice(0, Math.ceil(middle.length / 2));
    const right = middle.slice(Math.ceil(middle.length / 2));
    let ly = y;
    let ry = y;
    for (const b of left) ly = placeBody(b, x0, ly, colW);
    for (const b of right) ry = placeBody(b, x0 + colW + gutter, ry, colW);
    y = Math.max(ly, ry);
  }
  if (closing) {
    const st = styleFor(ctx, closing.role);
    const size = gSize(ctx, closing.role, 12.5);
    const w = applyMeasureCap(ctx, closing.role, fullW, size.fontSize);
    const maxH = Math.max(0.25, footerTop - R - y);
    const fit = fitText(closing.content, w, maxH, size.fontSize, size.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: closing.role, content: closing.content, intent: closing.intent, x: x0, y, w, maxH, align: st.align, size });
    y += Math.min(fit.heightIn, maxH) + BLOCK_PAD * 2 + R;
  }
  plans.push(...planCaptions(ctx, captions, x0, fullW, y));
  return plans;
}

// ---------------------------------------------------------------------------
// Materialize: fit text into planned boxes, enforce bounds + no-overlap
// ---------------------------------------------------------------------------

/**
 * Measured single-spacing line box. QuickLook probe 2026-11-04: two-line
 * 84pt text in a 2.06in box spills ~0.6in past the box bottom, identically
 * for a native face (Helvetica) and a substituted serif — so the
 * estimator's 1.0em line box, not substitution, is at fault. PowerPoint
 * single spacing is likewise ~1.15–1.2em, but no PowerPoint render
 * compare exists: 1.25 is QuickLook-measured with margin. Applied to
 * display roles (number, title) only, where 0.2em/line errors reach whole
 * inches: numeral/title collisions on all three systems, plus title/body
 * and title/caption collisions on expressive interiors (dogfood deck).
 * Body/caption/kicker stay on the 1.0 model — their error is sub-gap.
 */
export const RENDER_LINEBOX_DISPLAY = 1.25;

/**
 * Shrink a display-role size until its render-model ink fits the box.
 * Geometry (x/y/w/h) is untouched — only the emitted fontSize shrinks —
 * so no-overlap and in-bounds guarantees hold by construction.
 */
export function fitDisplayToRender(
  content: string,
  boxW: number,
  boxH: number,
  startSize: number,
  minSize: number,
  trackingEm: number,
  bold: boolean,
): number {
  let size = startSize;
  while (size > minSize) {
    const r = estimateWrap(content, size, boxW, trackingEm, RENDER_LINEBOX_DISPLAY, bold);
    if (inkHeightIn(r, size, RENDER_LINEBOX_DISPLAY) <= boxH) break;
    size = Math.max(minSize, size - Math.max(1, Math.round(size * 0.08)));
  }
  return size;
}

function materialize(ctx: Ctx, plans: Plan[], background: string): TextBlock[] {
  const { system, slide } = ctx;
  return plans.map((p, i) => {
    const base = styleFor(ctx, p.role);
    const st = p.size ? { ...base, fontSize: p.size.fontSize, minFontSize: p.size.minFontSize } : base;
    const maxH = Math.max(0.25, p.maxH);
    const fit = fitText(p.content, p.w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    const h = Math.min(maxH, fit.heightIn + BLOCK_PAD * 2);
    const y = Math.min(p.y, SLIDE_HEIGHT_IN - system.margin - h);
    const fontSize =
      p.role === 'number' || p.role === 'title'
        ? fitDisplayToRender(p.content, p.w, h, fit.fontSize, st.minFontSize, st.tracking, st.fontWeight >= 700)
        : fit.fontSize;
    return {
      id: `${slide.id}-b${i}`,
      role: p.role,
      content: p.content,
      // C1 passthrough: intent copied verbatim; absent intent adds no key.
      ...(p.intent !== undefined ? { intent: { ...p.intent } } : {}),
      x: Math.min(p.x, SLIDE_WIDTH_IN - system.margin - p.w),
      y: Math.max(0, y),
      w: p.w,
      h,
      fontSize,
      fontWeight: st.fontWeight,
      tracking: st.tracking,
      lineHeight: st.lineHeight,
      align: p.role === 'body' && ctx.bodyAlignOverride ? ctx.bodyAlignOverride : p.align,
      color: colorFor(system, p.role, background),
      ...(ctx.themed ? { fontFace: fontFaceFor(ctx.system, p.role, ctx.lang) } : {}),
    };
  });
}

function layoutSlide(narrative: Narrative, slide: NarrativeSlide, slideIndex: number, system: TypographySystem, seed: number, planItem?: CompositionPlanItem, deckTheme?: ThemeOverride): import('./schema').Slide {
  const candTheme = (planItem ? COMPOSITION_CANDIDATES[planItem.candidateId]?.theme : undefined) ?? deckTheme;
  const eff = themedSystem(system, candTheme);
  const background = backgroundFor(eff, slideIndex);
  const overrides = overridesFromPlan(planItem);
  // Overflow relaxation: if a scale produces overlapping blocks or
  // estimated text overflow (silent-clip class), retry the whole slide
  // deterministically at a smaller size. First clean scale wins; the final
  // scale emits regardless so pathological input warns (critic) instead of
  // throwing — only true overlap throws.
  const scales = [1, 0.85, 0.7, 0.55, 0.45, 0.35, 0.28, 0.22, 0.17, 0.13];
  let lastError: unknown = null;
  for (let si = 0; si < scales.length; si++) {
    const sizeScale = scales[si];
    const rng = mulberry32(hashString(`${seed}:${system.id}:${slide.id}`));
    const ctx: Ctx = { system: eff, slide, slideIndex, rng, sizeScale, ...overrides, themed: candTheme !== undefined, lang: narrative.lang };
    let plans: Plan[];
    // Composition-driven planners (G1/G3) win over system placement when the
    // plan selects them; all other candidates keep system placement.
    if (planItem?.candidateId === 'opening-monumental-numeral') {
      plans = planMonumentalNumeral(ctx);
    } else if (planItem?.candidateId === 'evidence-explainer-columns') {
      plans = planExplainerColumns(ctx);
    } else switch (system.placement) {
      case 'asymmetric-stack':
        plans = planEditorial(ctx);
        break;
      case 'grid-columns':
        plans = planSwiss(ctx);
        break;
      case 'centered-hero':
        plans = planExpressive(ctx);
        break;
      case 'hierarchy-stack':
        plans = planDocument(ctx);
        break;
    }
    const blocks = materialize(ctx, plans, background);
    try {
      assertNoOverlaps(blocks, slide.id);
    } catch (e) {
      lastError = e;
      continue;
    }
    const clipped = estimatedOverflowBlock(blocks);
    if (clipped !== null && si < scales.length - 1) {
      lastError = new Error(`estimated text overflow in block "${clipped}" on slide "${slide.id}"`);
      continue;
    }
    return {
      id: slide.id,
      thesis: slide.thesis,
      background,
      blocks,
      ...(slide.notes !== undefined ? { notes: slide.notes } : {}),
    };
  }
  throw lastError instanceof Error ? lastError : new Error(`could not lay out slide "${slide.id}" without overlap`);
}

export interface LayoutOptions {
  /** Optional explicit seed; defaults to a hash of the narrative bytes. */
  seed?: number;
  /**
   * Optional per-slide composition plan (see planCompositions). Absent plan
   * preserves baseline behavior exactly; present plan applies rhythm, body
   * measure-cap, and body-align overrides within the typography-only schema.
   */
  compositionPlan?: CompositionPlanItem[];
  /**
   * Optional deck-level visual identity (see template-pack resolver).
   * Merged via themedSystem exactly like a candidate theme; a
   * per-slide candidate theme wins over this deck theme when both exist.
   * Absent theme preserves baseline behavior exactly.
   */
  theme?: ThemeOverride;
}

export function layoutSeed(narrative: Narrative, systemId: SystemId): number {
  return hashString(`${systemId}:${JSON.stringify(narrative)}`);
}

/**
 * Deterministic layout: (narrative, system) -> positioned deck.
 * Pure function — no I/O, no wall-clock, no unseeded randomness.
 */
export function layoutDeck(input: unknown, systemId: SystemId, opts: LayoutOptions = {}): Deck {
  const narrative = validateNarrative(input);
  const system = getSystem(systemId);
  const seed = opts.seed ?? layoutSeed(narrative, systemId);
  const planBySlide = new Map((opts.compositionPlan ?? []).map((p) => [p.slideId, p]));
  const slides = narrative.slides.map((s, i) => layoutSlide(narrative, s, i, system, seed, planBySlide.get(s.id), opts.theme));
  return {
    meta: {
      title: narrative.title,
      lang: narrative.lang,
      system: system.id,
      systemVersion: VISUAL_SYSTEMS[system.id]?.version,
      seed,
      generatedBy: 'typodeck-core/phase1',
    },
    slides,
  };
}
