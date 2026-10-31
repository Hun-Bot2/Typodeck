// Typodeck Slide Markdown v1 — canonical, versioned, human-editable text
// form of Slide IR. Strict parser: unknown keys, bad versions, duplicate
// ids, and malformed lines are ERRORS, never silently skipped.
//
// All content is inert literal text (single-line values, any characters).
// Nothing here executes: no HTML parsing, no links, no directives beyond
// the fixed `key: value` vocabulary.

import { SEMANTIC_TYPES, type SemanticSlideType } from './composition';
import { SLIDE_IR_VERSION, validateSlideIR, type SlideIR, type SlideIRSlide } from './slide-ir';

export const SLIDE_MARKDOWN_VERSION = 1 as const;
const HEADER = '#!slide-markdown 1';

const BLOCK_KEYS = new Set(['kicker', 'title', 'body', 'number', 'caption']);
const SINGLETON_KEYS = new Set(['thesis', 'refs', 'statuses', 'emphasis', 'notes']);
const STATUSES = new Set(['proposed', 'implemented', 'historical', 'unverified', 'deprecated']);

function fail(message: string): never {
  throw new Error(`invalid Slide Markdown: ${message}`);
}

/** Serialize Slide IR to canonical Slide Markdown (byte-stable). */
export function serializeSlideMarkdown(ir: SlideIR): string {
  validateSlideIR(ir);
  const lines: string[] = [HEADER, `# ${ir.title}`, `> lang: ${ir.lang}`];
  if (ir.preset) lines.push(`> preset: ${ir.preset}`);
  for (const s of ir.slides) {
    lines.push('', `## [${s.id}] ${s.type}`, `thesis: ${s.thesis}`);
    for (const b of s.blocks) lines.push(`${b.role}: ${b.content}`);
    lines.push(`refs: ${s.refs.join(', ')}`);
    lines.push(`statuses: ${s.statuses.join(', ')}`);
    if (s.emphasis !== undefined) lines.push(`emphasis: ${s.emphasis}`);
    if (s.notes !== undefined) lines.push(`notes: ${s.notes}`);
  }
  return lines.join('\n') + '\n';
}

interface PendingSlide {
  id: string;
  type: SemanticSlideType;
  thesis?: string;
  blocks: Array<{ role: 'kicker' | 'title' | 'body' | 'number' | 'caption'; content: string }>;
  refs?: string[];
  statuses?: SlideIRSlide['statuses'];
  emphasis?: string;
  notes?: string;
  seen: Set<string>;
}

function finishSlide(p: PendingSlide, lineNo: number): SlideIRSlide {
  if (p.thesis === undefined) fail(`line ${lineNo}: slide "${p.id}" is missing thesis`);
  if (p.blocks.length === 0) fail(`line ${lineNo}: slide "${p.id}" needs at least one block`);
  return {
    id: p.id,
    type: p.type,
    thesis: p.thesis,
    blocks: p.blocks,
    refs: p.refs ?? [],
    statuses: p.statuses ?? [],
    ...(p.emphasis !== undefined ? { emphasis: p.emphasis } : {}),
    ...(p.notes !== undefined ? { notes: p.notes } : {}),
  };
}

/** Parse Slide Markdown into validated Slide IR (throws on any violation). */
export function parseSlideMarkdown(text: string): SlideIR {
  const rawLines = text.split('\n');
  // Allow exactly one trailing newline.
  const lines = rawLines.length > 0 && rawLines[rawLines.length - 1] === '' ? rawLines.slice(0, -1) : rawLines;
  if (lines.length === 0 || lines[0] !== HEADER) {
    fail(`first line must be exactly "${HEADER}"`);
  }
  if (lines.length < 2 || !lines[1].startsWith('# ')) fail('line 2 must be "# <title>"');
  const title = lines[1].slice(2).trim();
  if (title === '') fail('deck title must be non-empty');

  let lang: string | undefined;
  let preset: string | undefined;
  const slides: SlideIRSlide[] = [];
  const ids = new Set<string>();
  let current: PendingSlide | null = null;
  let i = 2;
  const pushCurrent = (): void => {
    if (current) {
      if (ids.has(current.id)) fail(`duplicate slide id "${current.id}"`);
      ids.add(current.id);
      slides.push(finishSlide(current, i + 1));
      current = null;
    }
  };

  for (; i < lines.length; i++) {
    const lineNo = i + 1;
    const line = lines[i].trimEnd();
    if (line.trim() === '') continue; // blank separators allowed
    if (line.startsWith('> ')) {
      if (current) fail(`line ${lineNo}: meta lines must precede the first slide`);
      const m = line.slice(2).match(/^([A-Za-z]+):\s?(.*)$/);
      if (!m) fail(`line ${lineNo}: malformed meta line`);
      const [, key, value] = m;
      if (key === 'lang') {
        if (lang !== undefined) fail(`line ${lineNo}: duplicate lang`);
        lang = value.trim();
        if (lang === '') fail(`line ${lineNo}: lang must be non-empty`);
      } else if (key === 'preset') {
        if (preset !== undefined) fail(`line ${lineNo}: duplicate preset`);
        preset = value.trim();
        if (preset === '') fail(`line ${lineNo}: preset must be non-empty`);
      } else {
        fail(`line ${lineNo}: unknown meta key "${key}"`);
      }
      continue;
    }
    const head = line.match(/^## \[([^\]]+)\] ([A-Za-z-]+)\s*$/);
    if (head) {
      pushCurrent();
      const [, id, type] = head;
      if (!(SEMANTIC_TYPES as readonly string[]).includes(type)) {
        fail(`line ${lineNo}: unknown slide type "${type}"`);
      }
      current = { id, type: type as SemanticSlideType, blocks: [], seen: new Set() };
      continue;
    }
    if (!current) fail(`line ${lineNo}: content outside any slide (want "## [id] type")`);
    const field = line.match(/^([A-Za-z]+):\s?(.*)$/);
    if (!field) fail(`line ${lineNo}: malformed line (want "key: value")`);
    const [, key, value] = field;
    if (BLOCK_KEYS.has(key)) {
      if (value === '') fail(`line ${lineNo}: block content must be non-empty`);
      current.blocks.push({ role: key as PendingSlide['blocks'][number]['role'], content: value });
      continue;
    }
    if (!SINGLETON_KEYS.has(key)) fail(`line ${lineNo}: unknown field "${key}"`);
    if (current.seen.has(key)) fail(`line ${lineNo}: duplicate field "${key}"`);
    current.seen.add(key);
    if (key === 'thesis') {
      if (value === '') fail(`line ${lineNo}: thesis must be non-empty`);
      current.thesis = value;
    } else if (key === 'refs') {
      current.refs = value === '' ? [] : value.split(',').map((r) => r.trim()).filter((r) => r !== '');
    } else if (key === 'statuses') {
      const list = value === '' ? [] : value.split(',').map((r) => r.trim()).filter((r) => r !== '');
      for (const st of list) {
        if (!STATUSES.has(st)) fail(`line ${lineNo}: unknown status "${st}"`);
      }
      current.statuses = list as SlideIRSlide['statuses'];
    } else if (key === 'emphasis') {
      current.emphasis = value;
    } else {
      current.notes = value;
    }
  }
  pushCurrent();
  if (lang === undefined) fail('missing required "> lang: ..." meta line');
  if (slides.length === 0) fail('deck needs at least one slide');
  return validateSlideIR({
    version: SLIDE_IR_VERSION,
    title,
    lang,
    ...(preset ? { preset } : {}),
    slides,
  });
}
