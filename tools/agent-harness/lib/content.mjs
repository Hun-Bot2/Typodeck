// Content-JSON schema: slide content + intent input for generate.mjs.
// Shape:
// {
//   "deck": { "title": str, "context": str, "date": str, "author": str },
//   "slides": [
//     {
//       "intent": "open the deck with title + lede",   // required, free text
//       "role": "cover",                              // optional explicit role
//       "kicker": "...", "title": "...", "lede": "...",
//       "orienting": "...", "statement": "...", "source": "...",
//       "message": "...",
//       "stats": [{ "value": "...", "label": "..." }],
//       "findings": [{ "head": "...", "body": "..." }],
//       "zones": { "a": { "label": "...", "rows": [{ "text": "...", "flag": bool }] },
//                  "b": { ... } },
//       "table": { "columns": [...], "rows": [[...]], "flags": [bool], "footnote": "..." },
//       "caption": "...", "recap": "...",
//       "meta": [{ "label": "...", "value": "..." }],  // rail meta rows
//       "fixture": false,                             // true => content is illustrative
//       "fixtureNote": "source line is illustrative"   // what the marker covers
//     }
//   ]
// }

const MAX_SLIDES = 24;

function isStr(v) {
  return typeof v === 'string' && v.length > 0;
}

function checkStr(obj, key, errors, where, { optional = true, max = 2000 } = {}) {
  const v = obj[key];
  if (v === undefined) {
    if (!optional) errors.push(`${where}.${key} is required`);
    return;
  }
  if (typeof v !== 'string') errors.push(`${where}.${key} must be a string`);
  else if (v.length > max) errors.push(`${where}.${key} exceeds ${max} chars`);
}

function checkListOfText(obj, key, errors, where) {
  const v = obj[key];
  if (v === undefined) return;
  if (!Array.isArray(v)) {
    errors.push(`${where}.${key} must be an array`);
    return;
  }
  v.forEach((item, i) => {
    if (typeof item === 'string') return;
    if (item && typeof item === 'object') {
      for (const k of ['value', 'label', 'head', 'body', 'text']) {
        if (item[k] !== undefined && typeof item[k] !== 'string') {
          errors.push(`${where}.${key}[${i}].${k} must be a string`);
        }
      }
      if (item.flag !== undefined && typeof item.flag !== 'boolean') {
        errors.push(`${where}.${key}[${i}].flag must be a boolean`);
      }
      return;
    }
    errors.push(`${where}.${key}[${i}] must be a string or object`);
  });
}

/** Validate raw parsed JSON. Returns { deck, slides } or throws ContentError. */
export function parseContent(input) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ContentError(['content root must be an object']);
  }
  const deck = input.deck && typeof input.deck === 'object' ? input.deck : {};
  for (const k of ['title', 'context', 'date', 'author']) {
    checkStr(deck, k, errors, 'deck', { optional: true, max: 300 });
  }
  if (!Array.isArray(input.slides) || input.slides.length === 0) {
    throw new ContentError(['slides must be a non-empty array']);
  }
  if (input.slides.length > MAX_SLIDES) {
    throw new ContentError([`slides exceeds max ${MAX_SLIDES}`]);
  }
  const slides = input.slides.map((s, i) => {
    const where = `slides[${i}]`;
    if (!s || typeof s !== 'object' || Array.isArray(s)) {
      errors.push(`${where} must be an object`);
      return null;
    }
    if (!isStr(s.intent)) errors.push(`${where}.intent is required (non-empty string)`);
    for (const k of ['role', 'kicker', 'title', 'lede', 'orienting', 'statement', 'source',
      'message', 'caption', 'recap', 'footnote', 'fixtureNote']) {
      checkStr(s, k, errors, where, { optional: true });
    }
    for (const k of ['stats', 'findings', 'meta']) checkListOfText(s, k, errors, where);
    if (s.zones !== undefined) {
      if (!s.zones || typeof s.zones !== 'object') errors.push(`${where}.zones must be an object`);
      else {
        for (const z of ['a', 'b']) {
          const zone = s.zones[z];
          if (!zone || typeof zone !== 'object') {
            errors.push(`${where}.zones.${z} is required`);
            continue;
          }
          checkStr(zone, 'label', errors, `${where}.zones.${z}`, { optional: false, max: 300 });
          checkListOfText(zone, 'rows', errors, `${where}.zones.${z}`);
        }
      }
    }
    if (s.table !== undefined) {
      const t = s.table;
      if (!t || typeof t !== 'object') errors.push(`${where}.table must be an object`);
      else {
        if (!Array.isArray(t.columns) || !t.columns.every(isStr)) {
          errors.push(`${where}.table.columns must be a string array`);
        }
        if (!Array.isArray(t.rows) || !t.rows.every((r) => Array.isArray(r))) {
          errors.push(`${where}.table.rows must be an array of arrays`);
        }
        if (t.flags !== undefined && !Array.isArray(t.flags)) {
          errors.push(`${where}.table.flags must be an array`);
        }
        checkStr(t, 'footnote', errors, `${where}.table`, { optional: true });
      }
    }
    if (s.fixture !== undefined && typeof s.fixture !== 'boolean') {
      errors.push(`${where}.fixture must be a boolean`);
    }
    return s;
  });
  if (errors.length > 0) throw new ContentError(errors);
  return { deck, slides };
}

export class ContentError extends Error {
  constructor(errors) {
    super(`invalid content JSON: ${errors.join('; ')}`);
    this.name = 'ContentError';
    this.errors = errors;
  }
}

/** Collect every user-visible content string on a slide (for verbatim checks). */
export function contentStrings(slide) {
  const out = [];
  const push = (v) => { if (typeof v === 'string' && v.length > 0) out.push(v); };
  for (const k of ['kicker', 'title', 'lede', 'orienting', 'statement', 'source',
    'message', 'caption', 'recap', 'footnote']) push(slide[k]);
  for (const item of slide.stats ?? []) {
    if (typeof item === 'string') push(item);
    else { push(item.value); push(item.label); }
  }
  for (const item of slide.findings ?? []) {
    if (typeof item === 'string') push(item);
    else { push(item.head); push(item.body); }
  }
  for (const z of ['a', 'b']) {
    const zone = slide.zones?.[z];
    if (!zone) continue;
    push(zone.label);
    for (const r of zone.rows ?? []) {
      if (typeof r === 'string') push(r);
      else push(r.text);
    }
  }
  if (slide.table) {
    for (const c of slide.table.columns ?? []) push(c);
    for (const row of slide.table.rows ?? []) for (const cell of row) push(String(cell));
    push(slide.table.footnote);
  }
  for (const m of slide.meta ?? []) {
    if (typeof m === 'string') push(m);
    else { push(m.label); push(m.value); }
  }
  return out;
}
