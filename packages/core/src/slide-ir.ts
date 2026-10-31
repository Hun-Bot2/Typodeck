// Typodeck Slide IR v1 — validated, system-independent slide content.
// The shared contract between planners and renderers: HTML and PPTX consume
// the same Slide IR, so neither renderer can change factual content.
//
// Provenance (refs/statuses) is recovered by deterministic text-linking:
// slide titles are shorten()'d claim prefixes and bodies carry full claim
// text, so slides link back to the exact claims that fed them. Slides with
// no linked claim (custom titles, legacy filler) honestly report empty refs.

import { classifySlide, SEMANTIC_TYPES, type SemanticSlideType } from './composition';
import type { Claim } from './evidence';
import { formatRef } from './narrative';
import { classifyStatus, type ClaimStatus } from './semantics';
import {
  validateNarrative,
  type Narrative,
  type NarrativeBlock,
  type NarrativeSlide,
} from './schema';

export const SLIDE_IR_VERSION = '1.0.0' as const;

export interface SlideIRSlide {
  /** Stable slide id (e.g. n3-problem). */
  id: string;
  /** Semantic slide type (13-type composition vocabulary). */
  type: SemanticSlideType;
  /** Central thesis. */
  thesis: string;
  /** Supporting content blocks (kicker/title/body/number/caption). */
  blocks: NarrativeBlock[];
  /** Evidence references (path:line), deduped, in claim order. */
  refs: string[];
  /** Lifecycle statuses of the linked claims. */
  statuses: ClaimStatus[];
  /** Optional emphasis intent for the renderer (plain text, never executed). */
  emphasis?: string;
  /** Optional speaker notes (never rendered on slides). */
  notes?: string;
}

/** Content density policy: how much text a slide may carry. Metadata only. */
export type DensityPolicy = 'speaker-led' | 'reading-first';

export interface SlideIR {
  version: typeof SLIDE_IR_VERSION;
  title: string;
  lang: string;
  /** Purpose preset id when planned with one (P01–P10). */
  preset?: string;
  /** Density policy (see skills/typodeck/density.md). Metadata only: renderers must not change content for it. */
  densityPolicy?: DensityPolicy;
  slides: SlideIRSlide[];
}

const norm = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** True when a title/body block carries (part of) a claim's text. */
function linksBlockToClaim(blockText: string, claimText: string): boolean {
  const b = norm(blockText);
  const c = norm(claimText);
  if (b.length < 20 || c.length < 20) return false;
  if (b === c) return true;
  // Titles are shorten()'d prefixes ending in …; match the surviving prefix
  // only when it is long enough to be unambiguous.
  if (b.endsWith('…')) {
    const prefix = b.slice(0, -1).trimEnd();
    if (prefix.length >= 40 && c.startsWith(prefix)) return true;
  }
  return false;
}

function linkSlideToClaims(slide: NarrativeSlide, claims: Claim[]): Claim[] {
  const textBlocks = slide.blocks.filter((b) => b.role === 'title' || b.role === 'body');
  const linked: Claim[] = [];
  for (const claim of claims) {
    if (textBlocks.some((b) => linksBlockToClaim(b.content, claim.text))) {
      linked.push(claim);
    }
  }
  return linked;
}

/** Build validated Slide IR from a planned narrative plus its claims. */
export function narrativeToSlideIR(
  narrative: Narrative,
  claims: Claim[],
  opts: { preset?: string; densityPolicy?: DensityPolicy } = {},
): SlideIR {
  validateNarrative(narrative);
  const total = narrative.slides.length;
  const slides: SlideIRSlide[] = narrative.slides.map((slide, i) => {
    const linked = linkSlideToClaims(slide, claims);
    const refs: string[] = [];
    const statuses: ClaimStatus[] = [];
    for (const claim of linked) {
      for (const r of claim.refs) {
        const f = formatRef(r);
        if (!refs.includes(f)) refs.push(f);
      }
      const st = classifyStatus(claim.text, claim.kind);
      if (!statuses.includes(st)) statuses.push(st);
    }
    const { type } = classifySlide(slide, i, total);
    return {
      id: slide.id,
      type,
      thesis: slide.thesis,
      blocks: slide.blocks,
      refs,
      statuses,
      ...(slide.notes !== undefined ? { notes: slide.notes } : {}),
    };
  });
  return {
    version: SLIDE_IR_VERSION,
    title: narrative.title,
    lang: narrative.lang,
    ...(opts.preset ? { preset: opts.preset } : {}),
    ...(opts.densityPolicy ? { densityPolicy: opts.densityPolicy } : {}),
    slides,
  };
}

/**
 * Convert Slide IR back to a Narrative for layout/export. Provenance,
 * emphasis, and notes are metadata: they never alter rendered slide content.
 */
export function slideIRToNarrative(ir: SlideIR): Narrative {
  const narrative: Narrative = {
    title: ir.title,
    lang: ir.lang,
    slides: ir.slides.map((s) => ({
      id: s.id,
      thesis: s.thesis,
      blocks: s.blocks,
      ...(s.notes !== undefined ? { notes: s.notes } : {}),
    })),
  };
  return validateNarrative(narrative);
}

function fail(message: string): never {
  throw new Error(`invalid Slide IR: ${message}`);
}

/** Structural validation for Slide IR (mirrors validateNarrative strictness). */
export function validateSlideIR(ir: unknown): SlideIR {
  if (typeof ir !== 'object' || ir === null) fail('must be an object');
  const v = ir as Record<string, unknown>;
  if (v.version !== SLIDE_IR_VERSION) fail(`version must be "${SLIDE_IR_VERSION}"`);
  if (typeof v.title !== 'string' || v.title.length === 0) fail('title must be a non-empty string');
  if (typeof v.lang !== 'string' || v.lang.length === 0) fail('lang must be a non-empty string');
  if (v.preset !== undefined && typeof v.preset !== 'string') fail('preset must be a string');
  if (v.densityPolicy !== undefined && v.densityPolicy !== 'speaker-led' && v.densityPolicy !== 'reading-first') {
    fail('densityPolicy must be "speaker-led" or "reading-first"');
  }
  if (!Array.isArray(v.slides) || v.slides.length === 0) fail('slides must be a non-empty array');
  const ids = new Set<string>();
  for (const s of v.slides as Array<Record<string, unknown>>) {
    if (typeof s !== 'object' || s === null) fail('each slide must be an object');
    if (typeof s.id !== 'string' || s.id.length === 0) fail('slide id must be a non-empty string');
    if (ids.has(s.id)) fail(`duplicate slide id "${s.id}"`);
    ids.add(s.id);
    if (!(SEMANTIC_TYPES as readonly string[]).includes(s.type as string)) {
      fail(`slide "${s.id}" has unknown type "${String(s.type)}"`);
    }
    if (typeof s.thesis !== 'string') fail(`slide "${s.id}" thesis must be a string`);
    if (!Array.isArray(s.blocks) || s.blocks.length === 0) fail(`slide "${s.id}" needs a non-empty blocks array`);
    if (!Array.isArray(s.refs) || !s.refs.every((r) => typeof r === 'string')) {
      fail(`slide "${s.id}" refs must be a string array`);
    }
    if (!Array.isArray(s.statuses)) fail(`slide "${s.id}" statuses must be an array`);
    for (const st of s.statuses as unknown[]) {
      if (!['proposed', 'implemented', 'historical', 'unverified', 'deprecated'].includes(st as string)) {
        fail(`slide "${s.id}" has unknown status "${String(st)}"`);
      }
    }
    if (s.emphasis !== undefined && typeof s.emphasis !== 'string') fail(`slide "${s.id}" emphasis must be a string`);
    if (s.notes !== undefined && typeof s.notes !== 'string') fail(`slide "${s.id}" notes must be a string`);
  }
  // Blocks must satisfy the same contract renderers enforce.
  slideIRToNarrative(v as unknown as SlideIR);
  return v as unknown as SlideIR;
}

/**
 * Escape text for HTML embedding. Contract: Slide IR content is ALWAYS
 * plain text; renderers must escape (React's SlideView escapes by
 * construction; string-built HTML such as galleries must call this).
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
