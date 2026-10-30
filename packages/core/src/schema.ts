// Typodeck Typography Core — restricted slide schema.
// Slides contain ONLY text blocks + a flat slide background color.
// There are deliberately no shape/line/image/icon/card/table/chart/media
// types, fields, or helpers anywhere in this schema.

/** Canvas: 16:9 slide, inches. All block geometry uses these units. */
export const SLIDE_WIDTH_IN = 13.33;
export const SLIDE_HEIGHT_IN = 7.5;
export const SAFE_MARGIN_IN = 0.5;

/** The only content roles that exist. Nothing else may appear on a slide. */
export type TextRole = 'kicker' | 'title' | 'body' | 'number' | 'caption';

export const TEXT_ROLES: readonly TextRole[] = [
  'kicker',
  'title',
  'body',
  'number',
  'caption',
];

export type TextAlign = 'left' | 'center' | 'right';

/** A single editable text box. Geometry in inches on the 16:9 canvas. */
export interface TextBlock {
  id: string;
  role: TextRole;
  /** Raw text content (plain string, may contain newlines). */
  content: string;
  /** Position/size in inches. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Font size in points. */
  fontSize: number;
  /** CSS-style weight: 300 | 400 | 500 | 700 | 900. */
  fontWeight: 300 | 400 | 500 | 700 | 900;
  /** Letter-spacing in em units (e.g. 0.2 = wide tracking). */
  tracking: number;
  /** Line-height as a multiple of font size (e.g. 1.4). */
  lineHeight: number;
  align: TextAlign;
  /** Solid text color, #rrggbb. */
  color: string;
}

export interface Slide {
  id: string;
  thesis: string;
  /** Optional speaker notes (native PPTX notes, never rendered on slides). */
  notes?: string;
  /** Solid slide background color, #rrggbb. The only background primitive. */
  background: string;
  blocks: TextBlock[];
}

export interface DeckMeta {
  title: string;
  lang: string;
  system: string;
  seed: number;
  generatedBy: string;
}

export interface Deck {
  meta: DeckMeta;
  slides: Slide[];
}

/** Unpositioned author input consumed by the layout engine. Text only. */
export interface NarrativeBlock {
  role: TextRole;
  content: string;
}

export interface NarrativeSlide {
  id: string;
  thesis: string;
  blocks: NarrativeBlock[];
  /** Optional speaker notes (metadata, never laid out as blocks). */
  notes?: string;
}

export interface Narrative {
  title: string;
  lang: string;
  slides: NarrativeSlide[];
}

/** Construct names that must never appear in a deck payload. */
const FORBIDDEN_KEYS = new Set([
  'shape',
  'shapes',
  'line',
  'lines',
  'image',
  'images',
  'icon',
  'icons',
  'card',
  'cards',
  'table',
  'tables',
  'chart',
  'charts',
  'media',
  'picture',
  'pictures',
  'photo',
  'photos',
  'sticker',
  'stickers',
  'emoji',
  'border',
  'shadow',
  'gradient',
  'connector',
  'arrow',
  'panel',
  'stroke',
  'fill',
  'geometry',
]);

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export class DeckValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeckValidationError';
  }
}

function fail(message: string): never {
  throw new DeckValidationError(message);
}

/** Reject any forbidden construct key anywhere in the payload tree. */
function rejectForbiddenKeys(value: unknown, path: string): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => rejectForbiddenKeys(v, `${path}[${i}]`));
    return;
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
        fail(`forbidden construct "${key}" at ${path}.${key}: decks are typography-only`);
      }
      // A "type"/"kind" discriminator may only ever claim to be text.
      if ((key === 'type' || key === 'kind') && typeof v === 'string') {
        const lv = v.toLowerCase();
        if (lv !== 'text' && lv !== 'textbox' && lv !== 'textblock') {
          fail(`forbidden block type "${v}" at ${path}.${key}: only text blocks exist`);
        }
      }
      rejectForbiddenKeys(v, `${path}.${key}`);
    }
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function checkBlock(b: unknown, path: string): asserts b is TextBlock {
  if (!isRecord(b)) fail(`${path} must be an object`);
  if (typeof b.id !== 'string' || b.id.length === 0) fail(`${path}.id must be a non-empty string`);
  if (!TEXT_ROLES.includes(b.role as TextRole)) {
    fail(`${path}.role must be one of ${TEXT_ROLES.join('|')}, got ${JSON.stringify(b.role)}`);
  }
  if (typeof b.content !== 'string' || b.content.length === 0) {
    fail(`${path}.content must be a non-empty string`);
  }
  for (const k of ['x', 'y', 'w', 'h', 'fontSize', 'tracking', 'lineHeight'] as const) {
    if (typeof b[k] !== 'number' || !Number.isFinite(b[k] as number)) {
      fail(`${path}.${k} must be a finite number`);
    }
  }
  const { x, y, w, h } = b as unknown as TextBlock;
  if (w <= 0 || h <= 0) fail(`${path} must have positive w/h`);
  if (x < 0 || y < 0 || x + w > SLIDE_WIDTH_IN + 1e-9 || y + h > SLIDE_HEIGHT_IN + 1e-9) {
    fail(`${path} rect [${x},${y},${w},${h}] exceeds 16:9 canvas ${SLIDE_WIDTH_IN}x${SLIDE_HEIGHT_IN}`);
  }
  if (![300, 400, 500, 700, 900].includes(b.fontWeight as number)) {
    fail(`${path}.fontWeight must be one of 300|400|500|700|900`);
  }
  if ((b.fontSize as number) <= 0 || (b.fontSize as number) > 400) {
    fail(`${path}.fontSize ${b.fontSize} out of range (0, 400]`);
  }
  if ((b.tracking as number) < -0.1 || (b.tracking as number) > 1) {
    fail(`${path}.tracking ${b.tracking} out of range [-0.1, 1]`);
  }
  if ((b.lineHeight as number) < 0.8 || (b.lineHeight as number) > 3) {
    fail(`${path}.lineHeight ${b.lineHeight} out of range [0.8, 3]`);
  }
  if (!['left', 'center', 'right'].includes(b.align as string)) {
    fail(`${path}.align must be left|center|right`);
  }
  if (typeof b.color !== 'string' || !HEX_COLOR.test(b.color)) {
    fail(`${path}.color must be #rrggbb, got ${JSON.stringify(b.color)}`);
  }
}

/**
 * Validate a positioned deck. Throws DeckValidationError on any violation,
 * including any forbidden (non-typographic) construct. Returns the deck typed.
 */
export function validateDeck(deck: unknown): Deck {
  rejectForbiddenKeys(deck, '$');
  if (!isRecord(deck)) fail('deck must be an object');
  if (!isRecord(deck.meta)) fail('deck.meta must be an object');
  if (!Array.isArray(deck.slides) || deck.slides.length === 0) {
    fail('deck.slides must be a non-empty array');
  }
  deck.slides.forEach((s, i) => {
    const path = `slides[${i}]`;
    if (!isRecord(s)) fail(`${path} must be an object`);
    if (typeof s.id !== 'string' || s.id.length === 0) fail(`${path}.id must be a non-empty string`);
    if (typeof s.thesis !== 'string') fail(`${path}.thesis must be a string`);
    if (s.notes !== undefined && typeof s.notes !== 'string') fail(`${path}.notes must be a string`);
    if (typeof s.background !== 'string' || !HEX_COLOR.test(s.background)) {
      fail(`${path}.background must be #rrggbb, got ${JSON.stringify(s.background)}`);
    }
    if (!Array.isArray(s.blocks) || s.blocks.length === 0) {
      fail(`${path}.blocks must be a non-empty array`);
    }
    s.blocks.forEach((b, j) => checkBlock(b, `${path}.blocks[${j}]`));
  });
  return deck as unknown as Deck;
}

/** Validate unpositioned narrative input (text roles + content only). */
export function validateNarrative(n: unknown): Narrative {
  rejectForbiddenKeys(n, '$');
  if (!isRecord(n)) fail('narrative must be an object');
  if (typeof n.title !== 'string') fail('narrative.title must be a string');
  if (typeof n.lang !== 'string') fail('narrative.lang must be a string');
  if (!Array.isArray(n.slides) || n.slides.length === 0) {
    fail('narrative.slides must be a non-empty array');
  }
  n.slides.forEach((s, i) => {
    const path = `slides[${i}]`;
    if (!isRecord(s)) fail(`${path} must be an object`);
    if (typeof s.id !== 'string' || s.id.length === 0) fail(`${path}.id must be a non-empty string`);
    if (typeof s.thesis !== 'string') fail(`${path}.thesis must be a string`);
    if (s.notes !== undefined && typeof s.notes !== 'string') fail(`${path}.notes must be a string`);
    if (!Array.isArray(s.blocks) || s.blocks.length === 0) {
      fail(`${path}.blocks must be a non-empty array`);
    }
    s.blocks.forEach((b, j) => {
      if (!isRecord(b)) fail(`${path}.blocks[${j}] must be an object`);
      if (!TEXT_ROLES.includes(b.role as TextRole)) {
        fail(`${path}.blocks[${j}].role must be one of ${TEXT_ROLES.join('|')}`);
      }
      if (typeof b.content !== 'string' || b.content.length === 0) {
        fail(`${path}.blocks[${j}].content must be a non-empty string`);
      }
    });
  });
  return n as unknown as Narrative;
}
