// Typodeck Typography Core — deterministic layout engine.
// Pure function: (narrative, system) -> positioned deck.
// Seeded/deterministic: identical input bytes -> byte-identical output.
// Overflow is estimated with an approximate char-width model that treats
// CJK wide glyphs as 1em; text shrinks/wraps to fit and blocks never overlap.

import {
  SLIDE_HEIGHT_IN,
  SLIDE_WIDTH_IN,
  validateNarrative,
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
  getSystem,
  type SystemId,
  type TypographySystem,
} from './systems';

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

const NARROW = new Set('il.,:;!\'"|()[]1·∙'.split(''));
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

/**
 * Greedy wrap: KO/CJK breaks at character level, EN at word level.
 * Explicit newlines in content force line breaks. Deterministic.
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
  let widest = 0;

  for (const paragraph of content.split('\n')) {
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
      if (lineW > widest) widest = lineW;
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
  }

  return { lines, maxWidthIn: widest, heightIn: lines.length * emIn * lineHeight };
}

export interface FitResult {
  fontSize: number;
  lines: string[];
  widthIn: number;
  heightIn: number;
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
  while ((r.heightIn > boxH || r.maxWidthIn > boxW) && size > minSize) {
    size = Math.max(minSize, size - Math.max(1, Math.round(size * 0.08)));
    r = estimateWrap(content, size, boxW, trackingEm, lineHeight, bold);
  }
  return { fontSize: size, lines: r.lines, widthIn: Math.min(r.maxWidthIn, boxW), heightIn: Math.min(r.heightIn, boxH) };
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
  x: number;
  y: number;
  w: number;
  /** Max allowed height; final h is fitted to content. */
  maxH: number;
  align: TextAlign;
}

interface Ctx {
  system: TypographySystem;
  slide: NarrativeSlide;
  slideIndex: number;
  rng: () => number;
  /** Global size scale for overflow relaxation (1 = full size). */
  sizeScale: number;
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
  const indent = slideIndex % 2 === 1 ? 1.4 : 0; // asymmetry, deterministic
  const x = m + indent;
  const w = Math.min(8.6, SLIDE_WIDTH_IN - x - m);
  let y = 1.5;
  const plans: Plan[] = [];
  for (const b of slide.blocks) {
    const st = styleFor(ctx, b.role);
    const maxH = SLIDE_HEIGHT_IN - m - y;
    plans.push({ role: b.role, content: b.content, x, y, w, maxH, align: st.align });
    // Advance cursor by fitted height (computed in materialize via same fit).
    const fit = fitText(b.content, w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    y += fit.heightIn + BLOCK_PAD * 2 + system.rhythm + (b.role === 'title' ? 0.1 : 0);
  }
  return plans;
}

/** Swiss: rigorous 4-column grid; title left, bodies flow into right columns. */
function planSwiss(ctx: Ctx): Plan[] {
  const { system, slide } = ctx;
  const m = system.margin;
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
      plans.push({ role: b.role, content: b.content, x: s.x, y: topY, w: s.w, maxH: 0.8, align: st.align });
    } else if (b.role === 'title' || b.role === 'number') {
      const s = span(0, 2);
      const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - leftY);
      const fit = fitText(b.content, s.w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
      plans.push({ role: b.role, content: b.content, x: s.x, y: leftY, w: s.w, maxH, align: st.align });
      leftY += fit.heightIn + BLOCK_PAD * 2 + system.rhythm;
      titleBottom = Math.max(titleBottom, leftY);
    } else if (b.role === 'caption') {
      const s = span(2, 2);
      plans.push({
        role: b.role, content: b.content, x: s.x, y: SLIDE_HEIGHT_IN - m - 0.6, w: s.w, maxH: 0.6, align: st.align,
      });
    } else {
      // Bodies: first body goes to right column block; extras stack below title.
      const idx = rightColUsed.length;
      if (idx === 0) {
        const s = span(2, 2);
        const fit = fitText(b.content, s.w, SLIDE_HEIGHT_IN - m - bodyTopY - 0.8, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
        plans.push({ role: b.role, content: b.content, x: s.x, y: bodyTopY, w: s.w, maxH: SLIDE_HEIGHT_IN - m - bodyTopY - 0.8, align: st.align });
        stackY = bodyTopY + fit.heightIn + BLOCK_PAD * 2 + system.rhythm;
        rightColUsed.push(plans[plans.length - 1]);
      } else if (idx === 1) {
        // Second body: right column continuation (comparison-style).
        const s = span(2, 2);
        const y = stackY;
        const maxH = Math.max(0.4, SLIDE_HEIGHT_IN - m - 0.8 - y);
        const fit2 = fitText(b.content, s.w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
        plans.push({ role: b.role, content: b.content, x: s.x, y, w: s.w, maxH, align: st.align });
        stackY = y + fit2.heightIn + BLOCK_PAD * 2 + system.rhythm;
        rightColUsed.push(plans[plans.length - 1]);
      } else {
        const s = span(0, 4);
        const y = Math.max(stackY, titleBottom);
        stackY = y;
        plans.push({ role: b.role, content: b.content, x: s.x, y, w: s.w, maxH: SLIDE_HEIGHT_IN - m - 0.8 - y, align: st.align });
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
  const heroBandH = heroFits.reduce((a, f) => a + f.heightIn + BLOCK_PAD * 2, 0) + system.rhythm * Math.max(0, heroes.length - 1);
  const captionTop = SLIDE_HEIGHT_IN - m - 0.55;
  const centeredY = (SLIDE_HEIGHT_IN - heroBandH) / 2 - (kickers.length > 0 ? 0.25 : 0) - (bodies.length > 0 ? 0.35 : 0);
  // Top-anchor when centering would push bodies into the caption zone.
  const heroBandY = Math.max(0.6, Math.min(centeredY, captionTop - heroBandH - bodies.length * 0.6));

  for (const b of kickers) {
    const st = styleFor(ctx, b.role);
    plans.push({ role: b.role, content: b.content, x: bodyX, y: heroBandY - 0.75, w: bodyW, maxH: 0.65, align: st.align });
  }
  let hy = heroBandY;
  heroes.forEach((b, i) => {
    const st = styleFor(ctx, b.role);
    void heroFits[i];
    plans.push({ role: b.role, content: b.content, x: heroX, y: hy, w: heroW, maxH: 5.2, align: st.align });
    hy += heroFits[i].heightIn + BLOCK_PAD * 2 + system.rhythm;
  });
  let by = hy + 0.05;
  for (const b of bodies) {
    const st = styleFor(ctx, b.role);
    const fit = fitText(b.content, bodyW, SLIDE_HEIGHT_IN - m - 0.55 - by, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    plans.push({ role: b.role, content: b.content, x: bodyX, y: by, w: bodyW, maxH: Math.max(0.4, SLIDE_HEIGHT_IN - m - 0.55 - by), align: st.align });
    by += fit.heightIn + BLOCK_PAD * 2 + system.rhythm;
  }
  for (const b of captions) {
    const st = styleFor(ctx, b.role);
    plans.push({ role: b.role, content: b.content, x: bodyX, y: SLIDE_HEIGHT_IN - m - 0.45, w: bodyW, maxH: 0.45, align: st.align });
  }
  return plans;
}

// ---------------------------------------------------------------------------
// Materialize: fit text into planned boxes, enforce bounds + no-overlap
// ---------------------------------------------------------------------------

function materialize(ctx: Ctx, plans: Plan[], background: string): TextBlock[] {
  const { system, slide } = ctx;
  return plans.map((p, i) => {
    const st = styleFor(ctx, p.role);
    const maxH = Math.max(0.25, p.maxH);
    const fit = fitText(p.content, p.w, maxH, st.fontSize, st.minFontSize, st.tracking, st.lineHeight, st.fontWeight >= 700);
    const h = Math.min(maxH, fit.heightIn + BLOCK_PAD * 2);
    const y = Math.min(p.y, SLIDE_HEIGHT_IN - system.margin - h);
    return {
      id: `${slide.id}-b${i}`,
      role: p.role,
      content: p.content,
      x: Math.min(p.x, SLIDE_WIDTH_IN - system.margin - p.w),
      y: Math.max(0, y),
      w: p.w,
      h,
      fontSize: fit.fontSize,
      fontWeight: st.fontWeight,
      tracking: st.tracking,
      lineHeight: st.lineHeight,
      align: p.align,
      color: colorFor(system, p.role, background),
    };
  });
}

function layoutSlide(narrative: Narrative, slide: NarrativeSlide, slideIndex: number, system: TypographySystem, seed: number): import('./schema').Slide {
  const background = backgroundFor(system, slideIndex);
  // Overflow relaxation: if a scale produces overlapping blocks, retry the
  // whole slide deterministically at a smaller size. First clean scale wins.
  const scales = [1, 0.85, 0.7, 0.55, 0.45, 0.35, 0.28, 0.22, 0.17, 0.13];
  let lastError: unknown = null;
  for (const sizeScale of scales) {
    const rng = mulberry32(hashString(`${seed}:${system.id}:${slide.id}`));
    const ctx: Ctx = { system, slide, slideIndex, rng, sizeScale };
    let plans: Plan[];
    switch (system.placement) {
      case 'asymmetric-stack':
        plans = planEditorial(ctx);
        break;
      case 'grid-columns':
        plans = planSwiss(ctx);
        break;
      case 'centered-hero':
        plans = planExpressive(ctx);
        break;
    }
    const blocks = materialize(ctx, plans, background);
    try {
      assertNoOverlaps(blocks, slide.id);
    } catch (e) {
      lastError = e;
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
  const slides = narrative.slides.map((s, i) => layoutSlide(narrative, s, i, system, seed));
  return {
    meta: {
      title: narrative.title,
      lang: narrative.lang,
      system: system.id,
      seed,
      generatedBy: 'typodeck-core/phase1',
    },
    slides,
  };
}
