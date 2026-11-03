// Typodeck Typography Core — bold-template-pack integration.
//
// Maps selection-index.json entries + per-slug design.md front-matter tokens
// onto the EXISTING engine primitives: a base SystemId (placement/scale
// strategy) plus a ThemeOverride (fonts/colors). Design tokens feed
// themedSystem -> colorFor/fontFaceFor/backgroundFor -> materialize, the same
// path candidate themes use. No new renderer, no new composition primitive,
// no new PPTX construct: PRIMITIVES and export.ts are untouched.
//
// preview.md files are agent-facing selection cards; their machine-readable
// mirror is selection-index.json (slug/mood/tone/bestFor/avoidFor/scheme),
// which is what this resolver reads. design.md contributes only its YAML
// front-matter (colors + typography fontFamily stacks).

import { layoutDeck, type LayoutOptions } from './layout';
import type { Deck } from './schema';
import type { SystemId, ThemeOverride } from './systems';

export class TemplatePackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplatePackError';
  }
}

/** One row of bold-template-pack/selection-index.json. */
export interface TemplatePackEntry {
  slug: string;
  id?: string;
  name?: string;
  scheme: 'light' | 'dark';
  density: 'low' | 'medium' | 'high';
  formality: 'low' | 'medium' | 'high';
  designPath: string;
  previewPath: string;
  mood?: string[];
  tone?: string[];
  bestFor?: string;
  avoidFor?: string;
  contentTypes?: string[];
  status?: string;
  visualSignature?: string;
}

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function strArray(v: unknown): string[] | undefined {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || !v.every((e) => typeof e === 'string')) return null as never;
  return v as string[];
}

/**
 * Parse + validate selection-index.json bytes (already JSON-parsed).
 * Throws TemplatePackError on any structural violation.
 */
export function parseSelectionIndex(input: unknown): TemplatePackEntry[] {
  if (!isRecord(input) || !Array.isArray(input.templates)) {
    throw new TemplatePackError('selection index must be an object with a "templates" array');
  }
  return input.templates.map((t, i) => {
    const path = `templates[${i}]`;
    if (!isRecord(t)) throw new TemplatePackError(`${path} must be an object`);
    if (typeof t.slug !== 'string' || !SLUG_PATTERN.test(t.slug)) {
      throw new TemplatePackError(`${path}.slug must match [a-z0-9-]+`);
    }
    for (const k of ['designPath', 'previewPath'] as const) {
      if (typeof t[k] !== 'string' || (t[k] as string).length === 0) {
        throw new TemplatePackError(`${path}.${k} must be a non-empty string`);
      }
    }
    if (t.scheme !== 'light' && t.scheme !== 'dark') {
      throw new TemplatePackError(`${path}.scheme must be light|dark`);
    }
    if (t.density !== 'low' && t.density !== 'medium' && t.density !== 'high') {
      throw new TemplatePackError(`${path}.density must be low|medium|high`);
    }
    if (t.formality !== 'low' && t.formality !== 'medium' && t.formality !== 'high') {
      throw new TemplatePackError(`${path}.formality must be low|medium|high`);
    }
    const entry: TemplatePackEntry = {
      slug: t.slug,
      scheme: t.scheme,
      density: t.density,
      formality: t.formality,
      designPath: t.designPath as string,
      previewPath: t.previewPath as string,
    };
    for (const k of ['id', 'name', 'bestFor', 'avoidFor', 'status', 'visualSignature'] as const) {
      if (t[k] === undefined) continue;
      if (typeof t[k] !== 'string') throw new TemplatePackError(`${path}.${k} must be a string`);
      entry[k] = t[k] as string;
    }
    for (const k of ['mood', 'tone', 'contentTypes'] as const) {
      const arr = strArray(t[k]);
      if (arr === null) throw new TemplatePackError(`${path}.${k} must be a string array`);
      if (arr !== undefined) entry[k] = arr;
    }
    return entry;
  });
}

/**
 * Base engine system for a template entry. Placement strategies are the
 * only structural choice; visual identity travels in the theme.
 * Deterministic rules, first match wins:
 *  1. high density -> swiss (grid-columns carry dense content)
 *  2. low density + dark scheme -> expressive (centered monumental hero)
 *  3. high formality -> editorial (refined asymmetric stack)
 *  4. medium density -> swiss (general grid default)
 *  5. else editorial (sparse light designs)
 */
export function systemIdForEntry(entry: TemplatePackEntry): SystemId {
  if (entry.density === 'high') return 'swiss';
  if (entry.density === 'low' && entry.scheme === 'dark') return 'expressive';
  if (entry.formality === 'high') return 'editorial';
  if (entry.density === 'medium') return 'swiss';
  return 'editorial';
}

/** Design tokens extracted from a design.md YAML front-matter block. */
export interface DesignTokens {
  /** Named palette: token name -> #rrggbb (lowercased keys). */
  colors: Record<string, string>;
  /** Display/label font stacks in first-seen order (CSS family names). */
  heading: string[];
  /** Body/copy font stacks in first-seen order. */
  body: string[];
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const BODY_TOKEN = /body|whisper|copy|paragraph/i;

function normalizeFamily(raw: string): string | null {
  const name = raw.trim().replace(/^['"]+|['"]+$/g, '').trim();
  if (name === '') return null;
  if (/^(serif|sans-serif|monospace|cursive|fantasy|system-ui)$/i.test(name)) return name.toLowerCase();
  return `"${name}"`;
}

function pushUnique(list: string[], raw: string): void {
  const fam = normalizeFamily(raw);
  if (fam === null) return;
  const key = fam.replace(/"/g, '').toLowerCase();
  if (!list.some((e) => e.replace(/"/g, '').toLowerCase() === key)) list.push(fam);
}

/**
 * Minimal YAML-subset parse of the design.md front-matter: `colors:` map
 * (key -> #rrggbb) and `typography:` token fontFamily stacks. Throws
 * TemplatePackError when the front-matter or palette is missing.
 */
export function parseDesignTokens(markdown: string): DesignTokens {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new TemplatePackError('design.md has no YAML front-matter block');
  const colors: Record<string, string> = {};
  const heading: string[] = [];
  const body: string[] = [];
  let section: 'none' | 'colors' | 'typography' | 'other' = 'none';
  let token = '';
  for (const line of match[1].split('\n')) {
    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (top && !line.startsWith(' ') && !line.startsWith('\t')) {
      const key = top[1].toLowerCase();
      section = key === 'colors' ? 'colors' : key === 'typography' ? 'typography' : 'other';
      token = '';
      continue;
    }
    if (section === 'colors') {
      const m = line.match(/^\s{2,}([A-Za-z0-9_.-]+):\s*["']?(#[0-9a-fA-F]{6})["']?\s*$/);
      if (m) colors[m[1].toLowerCase()] = m[2].toUpperCase();
    } else if (section === 'typography') {
      const tok = line.match(/^\s{2}([A-Za-z0-9_.-]+):\s*$/);
      if (tok) {
        token = tok[1];
        continue;
      }
      const fam = line.match(/^\s{4,}fontFamily:\s*(.+)$/);
      if (fam && token !== '') {
        // First token per role defines that role's voice; later tokens
        // (labels, chips, intruders) are word-level variants the
        // whole-block engine cannot address, so they must not pollute
        // the primary stack.
        const target = BODY_TOKEN.test(token) ? body : heading;
        if (target.length > 0) continue;
        for (const part of fam[1].split(',')) pushUnique(target, part);
      }
    }
  }
  if (Object.keys(colors).length === 0) {
    throw new TemplatePackError('design.md front-matter defines no colors');
  }
  return { colors, heading, body };
}

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i + 1, i + 3), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function saturation(hex: string): number {
  const ch = [0, 2, 4].map((i) => parseInt(hex.slice(i + 1, i + 3), 16) / 255);
  const mx = Math.max(...ch);
  const mn = Math.min(...ch);
  return mx === 0 ? 0 : (mx - mn) / mx;
}

const SERIF_STACK = /serif|garamond|georgia|newsreader|cormorant|song|playfair|merriweather/i;
const GENERIC_FAMILY = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui)$/i;

/** Named faces first, then KR-capable fallbacks, then CSS generics last. */
function withFallbacks(stack: string[], serif: boolean): string[] {
  const named = stack.filter((f) => !GENERIC_FAMILY.test(f));
  const generics = stack.filter((f) => GENERIC_FAMILY.test(f));
  const fallbacks = serif
    ? ['"Noto Serif KR"', 'Georgia', 'serif']
    : ['"Noto Sans KR"', 'system-ui', 'sans-serif'];
  const out = [...named];
  for (const f of [...fallbacks, ...generics]) {
    const key = f.replace(/"/g, '').toLowerCase();
    if (!out.some((e) => e.replace(/"/g, '').toLowerCase() === key)) out.push(f);
  }
  return out;
}

function contrastRatio(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Derive a ThemeOverride from design tokens. Roles are assigned by
 * colorimetry, not key names (palettes use free-form names like
 * "slab-black" or "signal-orange"): background is the luminance extreme
 * matching the scheme, ink the opposite extreme, accent the most
 * saturated remainder, muted the grayest remainder. Accent/muted must
 * each reach 3:1 on the background (large-text legibility floor) or
 * they fall back to ink — designer intent is preserved, but invisible
 * text is never emitted. backgroundAlt is pinned to background:
 * template packs define a single ground, which also disables expressive
 * odd-slide alternation for themed decks.
 */
export function themeFromTokens(slug: string, scheme: 'light' | 'dark', tokens: DesignTokens): ThemeOverride & { id: string } {
  const entries = Object.entries(tokens.colors).filter(([, v]) => HEX_COLOR.test(v));
  if (entries.length === 0) throw new TemplatePackError(`template "${slug}" has no valid hex colors`);
  const byLum = [...entries].sort((a, b) => luminance(a[1]) - luminance(b[1]));
  const background = (scheme === 'dark' ? byLum[0] : byLum[byLum.length - 1])[1];
  const ink = (scheme === 'dark' ? byLum[byLum.length - 1] : byLum[0])[1];
  const rest = entries.filter(([, v]) => v !== background && v !== ink);
  const bySatDesc = [...rest].sort((a, b) => saturation(b[1]) - saturation(a[1]) || luminance(a[1]) - luminance(b[1]));
  const bySatAsc = [...rest].sort((a, b) => saturation(a[1]) - saturation(b[1]) || luminance(b[1]) - luminance(a[1]));
  const accentPick = bySatDesc.find(([, v]) => contrastRatio(v, background) >= 3);
  const mutedPick = bySatAsc.find(([, v]) => contrastRatio(v, background) >= 3);
  const accent = accentPick ? accentPick[1] : ink;
  const muted = mutedPick ? mutedPick[1] : ink;
  const headingSerif = tokens.heading
    .filter((f) => !GENERIC_FAMILY.test(f))
    .some((f) => SERIF_STACK.test(f));
  const headingStack = tokens.heading.length > 0 ? tokens.heading : tokens.body;
  const bodyStack = tokens.body.length > 0 ? tokens.body : tokens.heading;
  return {
    id: `template:${slug}`,
    fonts: {
      heading: withFallbacks(headingStack, headingSerif),
      body: withFallbacks(bodyStack, false),
    },
    colors: { background, backgroundAlt: background, ink, accent, muted },
  };
}

/** Resolved template: base engine system + derived visual-identity theme. */
export interface TemplateResolution {
  slug: string;
  systemId: SystemId;
  theme: ThemeOverride & { id: string };
}

/** Resolve one selection-index entry + its design.md text to engine inputs. */
export function resolveTemplateDesign(entry: TemplatePackEntry, designMarkdown: string): TemplateResolution {
  const tokens = parseDesignTokens(designMarkdown);
  return {
    slug: entry.slug,
    systemId: systemIdForEntry(entry),
    theme: themeFromTokens(entry.slug, entry.scheme, tokens),
  };
}

/**
 * Lay out a narrative through the REAL engine path with a template's
 * visual identity: resolveTemplateDesign -> layoutDeck({ theme }).
 * Geometry/placement come from the base system; only fonts/colors
 * come from the template. Pass-through opts (seed, compositionPlan)
 * behave exactly as in layoutDeck.
 */
export function layoutDeckWithTemplate(
  narrativeInput: unknown,
  entry: TemplatePackEntry,
  designMarkdown: string,
  opts: Omit<LayoutOptions, 'theme'> = {},
): Deck {
  const { systemId, theme } = resolveTemplateDesign(entry, designMarkdown);
  return layoutDeck(narrativeInput, systemId, { ...opts, theme });
}
