#!/usr/bin/env node
/**
 * validate-design.mjs — structural gate for one design-diversity template.
 *
 * Usage:
 *   node validate-design.mjs <slug> [--root=<repo-root>] [--json]
 *
 * Checks, for bold-template-pack/templates/<slug>/:
 *   1. preview.md      — 6 required sections present, in order; >=11 rule bullets.
 *   2. design.md       — YAML frontmatter carries the 9 required top-level keys;
 *                        body carries all 23 manual sections
 *                        (12 L2 sections in order + 11 L3 subsections scoped to
 *                        their parent L2). Titles are structural, taken from the
 *                        8-bit-orbit reference skeleton.
 *   3. preview.html    — present; 1920x1080 fixed stage + scaffold scaler
 *                        markers; standardized PRIMARY content verbatim;
 *                        visible text free of slug / display-name / option-label
 *                        / internal-note strings.
 *
 * Exit codes: 0 = all artifacts pass.
 *             1 = at least one content failure.
 *             2 = only failure is an absent preview.html (reported, not silent).
 * Node built-ins only (fs, path, process).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(HERE, '..', '..', '..');

// ---- Required structures (derived from the 8-bit-orbit reference) ----

const PREVIEW_MD_SECTIONS = [
  'Files',
  'Selection Metadata',
  'Visual Snapshot',
  'Preview Ingredients',
  'International / CJK Preview Note',
  'Preview Rules',
];
const PREVIEW_RULES_MIN_BULLETS = 11;

const FRONTMATTER_KEYS = [
  'version', 'name', 'description', 'colors', 'shadows',
  'typography', 'spacing', 'canvas', 'components',
];

// 12 required L2 sections, in order (generic structural titles).
const DESIGN_L2_SECTIONS = [
  'Frontend Slides Fixed-Stage Policy',
  'Overview',
  'Colors',
  'Typography',
  'Layout',
  'Depth and Elevation',
  'Shapes and Treatment',
  "Do's and Don'ts",
  'Responsive Behavior',
  'CJK & International Content',
  'Iteration Guide',
  'Known Gaps',
];

// 11 required L3 subsections, each scoped to its parent L2.
// 12 L2 + 11 L3 = the 23 manual sections.
const DESIGN_L3_SECTIONS = [
  { parent: 'Colors', title: 'Palette' },
  { parent: 'Typography', title: 'Font Family' },
  { parent: 'Typography', title: 'Typography Scale' },
  { parent: 'Typography', title: 'Signature Treatments' },
  { parent: 'Layout', title: 'Canvas System' },
  { parent: 'Layout', title: 'Persistent Chrome' },
  { parent: 'Shapes and Treatment', title: 'Border Radius' },
  { parent: 'Shapes and Treatment', title: 'Border Weights' },
  { parent: 'Shapes and Treatment', title: 'Decorative Element Types' },
  { parent: "Do's and Don'ts", title: 'Do' },
  { parent: "Do's and Don'ts", title: "Don't" },
];

// Standardized comparison content (Lead-fixed, verbatim). PRIMARY is required.
const PRIMARY = {
  title: 'The Hidden Cost of Rushing to Ship',
  subtitle: 'What 11 postmortems taught us about review discipline',
  context: 'Typodeck Research · November 2026',
};

// Fixed-stage conformance markers (see scaffold.html).
const STAGE_MARKERS = ['id="deck-stage"', "id='deck-stage'"];
const SCALER_MARKERS = ['__typodeckFitStage'];

// Visible-text strings that must NEVER appear (Preview Rules 5-7).
const FORBIDDEN_LITERAL = [
  'preview',
  'generated from',
  'preview.md',
  'design.md',
  'template.html',
  'template',
  'preset',
  'style option',
  'option a',
  'option b',
  'option c',
  'bold-template-pack',
  'templates/',
];

// ---- Small helpers ----

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function l2Index(lines, title) {
  return lines.findIndex((l) => l.trim() === `## ${title}`);
}

function orderedCheck(lines, titles, level) {
  const missing = [];
  const found = [];
  for (const t of titles) {
    const i = lines.findIndex((l) => l.trim() === `${'#'.repeat(level)} ${t}`);
    if (i === -1) missing.push(t);
    else found.push({ title: t, line: i + 1 });
  }
  let outOfOrder = false;
  for (let k = 1; k < found.length; k++) {
    if (found[k].line < found[k - 1].line) { outOfOrder = true; break; }
  }
  return { missing, outOfOrder, foundCount: found.length };
}

function parseFrontmatter(text) {
  // Returns { keys:Set, values:Map } for the top-level `---` block, or null.
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = text.slice(0, end);
  const keys = new Set();
  const values = new Map();
  for (const line of block.split('\n').slice(1)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      keys.add(m[1]);
      values.set(m[1], m[2].trim());
    }
  }
  return { keys, values };
}

function visibleText(html) {
  let t = html;
  t = t.replace(/<!--[\s\S]*?-->/g, ' ');                    // comments
  t = t.replace(/<head[\s\S]*?<\/head\s*>/gi, ' ');          // head (title/meta unseen)
  t = t.replace(/<script[\s\S]*?<\/script\s*>/gi, ' ');      // scripts
  t = t.replace(/<style[\s\S]*?<\/style\s*>/gi, ' ');        // styles
  const alts = [];
  t = t.replace(/<img\b[^>]*?\balt\s*=\s*("([^"]*)"|'([^']*)')[^>]*>/gi,
    (_m, _q, d, s) => { alts.push(d ?? s ?? ''); return ' '; });
  t = t.replace(/<[^>]+>/g, ' ');                            // tags
  t = t.replace(/&(nbsp|amp|lt|gt|quot|#39);/gi, ' ');
  t = t.replace(/\s+/g, ' ');
  return `${t} ${alts.join(' ')}`.trim();
}

// ---- Per-artifact checks ----

function checkPreviewMd(text) {
  const lines = text.split('\n');
  const sec = orderedCheck(lines, PREVIEW_MD_SECTIONS, 2);
  const rulesIdx = l2Index(lines, 'Preview Rules');
  let bullets = 0;
  if (rulesIdx !== -1) {
    for (let i = rulesIdx + 1; i < lines.length; i++) {
      if (/^##\s/.test(lines[i].trim())) break;
      if (/^\s*-\s+\S/.test(lines[i])) bullets++;
    }
  }
  const errors = [];
  if (sec.missing.length) errors.push(`missing sections: ${sec.missing.join('; ')}`);
  if (sec.outOfOrder) errors.push('sections out of order');
  if (rulesIdx !== -1 && bullets < PREVIEW_RULES_MIN_BULLETS) {
    errors.push(`Preview Rules has ${bullets} bullets, need >=${PREVIEW_RULES_MIN_BULLETS}`);
  }
  return {
    pass: errors.length === 0,
    detail: `${sec.foundCount}/${PREVIEW_MD_SECTIONS.length} sections in order; ${bullets} rule bullets`,
    errors,
  };
}

function checkDesignMd(text) {
  const errors = [];
  const fm = parseFrontmatter(text);
  let fmFound = 0;
  let displayName = '';
  if (!fm) {
    errors.push('missing YAML frontmatter block');
  } else {
    const missingKeys = FRONTMATTER_KEYS.filter((k) => !fm.keys.has(k));
    fmFound = FRONTMATTER_KEYS.length - missingKeys.length;
    if (missingKeys.length) errors.push(`missing frontmatter keys: ${missingKeys.join(', ')}`);
    displayName = fm.values.get('name') || '';
  }
  const lines = text.split('\n');
  const l2 = orderedCheck(lines, DESIGN_L2_SECTIONS, 2);
  if (l2.missing.length) errors.push(`missing L2 sections: ${l2.missing.join('; ')}`);
  if (l2.outOfOrder) errors.push('L2 sections out of order');
  // L3 subsections scoped to parent spans.
  const spans = new Map();
  for (const t of DESIGN_L2_SECTIONS) {
    const i = l2Index(lines, t);
    if (i !== -1) spans.set(t, i);
  }
  const ordered = [...spans.entries()].sort((a, b) => a[1] - b[1]);
  const missingL3 = [];
  let l3Found = 0;
  for (const { parent, title } of DESIGN_L3_SECTIONS) {
    const start = spans.get(parent);
    if (start === undefined) { missingL3.push(`${parent} › ${title} (no parent)`); continue; }
    const pos = ordered.findIndex(([t]) => t === parent);
    const end = pos + 1 < ordered.length ? ordered[pos + 1][1] : lines.length;
    const want = `### ${title}`;
    let hit = false;
    for (let i = start + 1; i < end; i++) {
      if (lines[i].trim() === want) { hit = true; break; }
    }
    if (hit) l3Found++;
    else missingL3.push(`${parent} › ${title}`);
  }
  if (missingL3.length) errors.push(`missing L3 subsections: ${missingL3.join('; ')}`);
  const total = l2.foundCount + l3Found;
  const want = DESIGN_L2_SECTIONS.length + DESIGN_L3_SECTIONS.length; // 23
  return {
    pass: errors.length === 0,
    detail: `${fmFound}/${FRONTMATTER_KEYS.length} frontmatter keys; ${total}/${want} manual sections`,
    errors,
    displayName,
  };
}

function checkPreviewHtml(html, slug, displayName) {
  const errors = [];
  const hasStageId = STAGE_MARKERS.some((m) => html.includes(m));
  const has1920 = html.includes('1920');
  const has1080 = html.includes('1080');
  const hasWidth = /width\s*:\s*1920px/.test(html);
  const hasHeight = /height\s*:\s*1080px/.test(html);
  const hasScaler = SCALER_MARKERS.some((m) => html.includes(m));
  const hasScaleTransform = /transform\s*:\s*['"]?scale\(/.test(html) || /scale\(['"]?\s*\+/.test(html);
  if (!hasStageId) errors.push('missing #deck-stage element');
  if (!(has1920 && has1080 && hasWidth && hasHeight)) {
    errors.push('stage is not provably 1920x1080 (need width:1920px + height:1080px)');
  }
  if (!hasScaler) errors.push('missing scaffold scaler (__typodeckFitStage)');
  if (!hasScaleTransform) errors.push('missing uniform scale() transform');
  const missingPrimary = Object.entries(PRIMARY)
    .filter(([, v]) => !html.includes(v))
    .map(([k]) => k);
  if (missingPrimary.length) errors.push(`missing PRIMARY content: ${missingPrimary.join(', ')}`);
  const vis = visibleText(html).toLowerCase();
  const forbidden = [...FORBIDDEN_LITERAL];
  if (slug) forbidden.push(slug.toLowerCase());
  if (displayName) forbidden.push(displayName.toLowerCase());
  const hits = [...new Set(forbidden.filter((s) => s && vis.includes(s)))];
  if (hits.length) errors.push(`forbidden visible text: ${hits.join('; ')}`);
  const stageBits = [
    hasStageId ? 'stage-id' : 'no-stage-id',
    (hasWidth && hasHeight) ? '1920x1080' : 'no-1920x1080',
    hasScaler ? 'scaler' : 'no-scaler',
  ].join(',');
  return {
    pass: errors.length === 0,
    detail: `stage[${stageBits}] primary[${3 - missingPrimary.length}/3] forbidden-hits[${hits.length}]`,
    errors,
  };
}

// ---- CLI ----

function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith('--'));
  const rootArg = args.find((a) => a.startsWith('--root='));
  const asJson = args.includes('--json');
  const root = rootArg ? path.resolve(rootArg.slice('--root='.length)) : DEFAULT_ROOT;
  if (!slug) {
    console.error('usage: node validate-design.mjs <slug> [--root=<repo-root>] [--json]');
    process.exitCode = 1;
    return;
  }
  const dir = path.join(root, 'bold-template-pack', 'templates', slug);
  const mdPreview = readFile(path.join(dir, 'preview.md'));
  const mdDesign = readFile(path.join(dir, 'design.md'));
  const html = readFile(path.join(dir, 'preview.html'));

  const report = { slug, dir, artifacts: {} };
  if (mdPreview === null) {
    report.artifacts['preview.md'] = { status: 'ABSENT', detail: 'file not found', errors: ['file not found'] };
  } else {
    const r = checkPreviewMd(mdPreview);
    report.artifacts['preview.md'] = { status: r.pass ? 'PASS' : 'FAIL', ...r };
  }
  if (mdDesign === null) {
    report.artifacts['design.md'] = { status: 'ABSENT', detail: 'file not found', errors: ['file not found'] };
  } else {
    const r = checkDesignMd(mdDesign);
    report.artifacts['design.md'] = { status: r.pass ? 'PASS' : 'FAIL', ...r };
    report.displayName = r.displayName || undefined;
  }
  if (html === null) {
    report.artifacts['preview.html'] = {
      status: 'ABSENT',
      detail: 'file not found (reported: this design ships no html)',
      errors: ['file not found'],
    };
  } else {
    const r = checkPreviewHtml(html, slug, report.displayName || '');
    report.artifacts['preview.html'] = { status: r.pass ? 'PASS' : 'FAIL', ...r };
  }

  const entries = Object.entries(report.artifacts);
  const fails = entries.filter(([, a]) => a.status === 'FAIL');
  const absents = entries.filter(([, a]) => a.status === 'ABSENT');
  report.result = fails.length === 0 && absents.length === 0 ? 'PASS' : 'FAIL';

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`[${slug}] design validation (${dir})`);
    for (const [name, a] of entries) {
      console.log(`${name}: ${a.status} (${a.detail})`);
      for (const e of a.errors || []) console.log(`  - ${e}`);
    }
    console.log(`RESULT: ${report.result}`);
  }
  if (report.result === 'PASS') process.exitCode = 0;
  else if (fails.length === 0 && absents.length === 1 && report.artifacts['preview.html']?.status === 'ABSENT') {
    process.exitCode = 2; // absent html only: reported, distinct from content failure
  } else process.exitCode = 1;
}

main();
