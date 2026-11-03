// design.md spec parser: YAML front-matter (tokens) + CJK section extraction.
// Dependency-free minimal YAML-subset parser for the flat token maps used
// by bold-template-pack design files. Resolves {colors.x} / {typography.y}
// / {components.z} references.

export class SpecError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SpecError';
  }
}

function stripQuotes(v) {
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function scalar(v) {
  const t = stripQuotes(v.trim());
  if (/^-?\d+\.\d+$/.test(t)) return Number(t);
  if (/^-?\d+$/.test(t)) return Number(t);
  return t;
}

/** Parse the front-matter block between --- lines. Returns { data, body }. */
export function splitFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new SpecError('design.md has no YAML front-matter (--- ... ---)');
  return { front: m[1], body: m[2] };
}

/**
 * Minimal indented-map parser. Supports nested maps keyed by 2-space indent
 * and scalar values. Throws SpecError on tabs or inconsistent indent.
 */
export function parseFrontMatter(front) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const raw of front.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^ */)[0].length;
    if (raw.startsWith('\t') || indent % 2 !== 0) {
      throw new SpecError(`bad indentation: ${JSON.stringify(raw)}`);
    }
    const line = raw.trim();
    const ci = line.indexOf(':');
    if (ci < 0) throw new SpecError(`expected key: value, got ${JSON.stringify(raw)}`);
    const key = line.slice(0, ci).trim();
    const rest = line.slice(ci + 1).trim();
    if (!key) throw new SpecError(`empty key in ${JSON.stringify(raw)}`);
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (rest === '') {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
    } else {
      parent[key] = scalar(rest);
    }
  }
  return root;
}

function lookup(data, path) {
  let cur = data;
  for (const part of path.split('.')) {
    if (!cur || typeof cur !== 'object' || !(part in cur)) return undefined;
    cur = cur[part];
  }
  return cur;
}

/** Resolve "{a.b}" references inside string token values (one pass, recursive). */
export function resolveRefs(data) {
  const seen = new Set();
  function walk(v) {
    if (typeof v === 'string') {
      return v.replace(/\{([a-zA-Z0-9_.-]+)\}/g, (m, p) => {
        if (seen.has(p)) return m;
        const r = lookup(data, p);
        if (r === undefined) return m;
        seen.add(p);
        const out = walk(r);
        seen.delete(p);
        return typeof out === 'string' ? out : String(out);
      });
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      for (const k of Object.keys(v)) v[k] = walk(v[k]);
      return v;
    }
    return v;
  }
  return walk(data);
}

const GRIDLINE_COLORS = ['white', 'ink', 'signal-red', 'rail-gray', 'muted', 'gridline'];
const GRIDLINE_TYPE = ['display-xl', 'display', 'headline', 'section-head', 'kicker',
  'index-numeral', 'body', 'body-compact', 'caption', 'footer-index', 'rail-meta'];

/** Parse a full design.md file. Lenient: any design with canvas+colors+typography. */
export function parseDesignFile(text, slug) {
  const { front, body } = splitFrontMatter(text);
  const data = resolveRefs(parseFrontMatter(front));
  const missing = [];
  if (!data.colors || typeof data.colors !== 'object') missing.push('colors');
  if (!data.typography || typeof data.typography !== 'object') missing.push('typography');
  if (typeof data.canvas?.width !== 'string' && typeof data.canvas?.width !== 'number') {
    missing.push('canvas.width');
  }
  if (typeof data.canvas?.height !== 'string' && typeof data.canvas?.height !== 'number') {
    missing.push('canvas.height');
  }
  if (missing.length > 0) {
    throw new SpecError(`${slug}: missing required tokens: ${missing.join(', ')}`);
  }
  return { tokens: data, cjk: parseCjkSection(body), body };
}

/** Strict gridline token assertion for the bespoke builder path. */
export function assertGridlineTokens(tokens, slug) {
  const missing = [];
  for (const c of GRIDLINE_COLORS) {
    if (typeof tokens.colors?.[c] !== 'string') missing.push(`colors.${c}`);
  }
  for (const t of GRIDLINE_TYPE) {
    const tok = tokens.typography?.[t];
    if (!tok || typeof tok !== 'object') missing.push(`typography.${t}`);
    else if (typeof tok.fontSize !== 'string' && typeof tok.fontSize !== 'number') {
      missing.push(`typography.${t}.fontSize`);
    }
  }
  if (missing.length > 0) {
    throw new SpecError(`${slug}: missing gridline tokens: ${missing.join(', ')}`);
  }
}

/**
 * Extract the CJK font-pairing table + adjustment rules from the design.md
 * body (the "## CJK & International Content" section). Returns null when the
 * design has no CJK section (caller falls back to generic CJK rules).
 */
export function parseCjkSection(body) {
  const start = body.indexOf('## CJK');
  if (start < 0) return null;
  const section = body.slice(start, body.indexOf('\n## ', start + 1) === -1
    ? undefined
    : body.indexOf('\n## ', start + 3));
  const pairing = {};
  // Table rows: | Display / index numeral | Archivo 800 | Noto Sans KR 900 |
  for (const line of section.split('\n')) {
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 3 || /^role$/i.test(cells[0]) || /^---/.test(cells[0])) continue;
    pairing[cells[0].toLowerCase()] = { latin: cells[1], cjk: cells[2] };
  }
  const rules = {
    lineHeightBoost: /line-height.*increase|increase.*line-height/i.test(section) ? 1.18 : 1.0,
    noTracking: /letter-spacing.*0|tracking.*removed/i.test(section),
    noUppercase: /never apply.*uppercase|uppercase.*CJK/i.test(section),
    mixedStrategy: /Strategy A/i.test(section) ? 'single-cjk-family' : 'per-role',
  };
  const fontHref = section.match(/https:\/\/fonts\.googleapis\.com\/css2[^"'\s)]*/)?.[0] ?? null;
  return { pairing, rules, fontHref };
}

export function px(v) {
  if (typeof v === 'number') return v;
  const m = String(v).trim().match(/^(-?\d+(?:\.\d+)?)px$/);
  if (!m) throw new SpecError(`expected px value, got ${JSON.stringify(v)}`);
  return Number(m[1]);
}
