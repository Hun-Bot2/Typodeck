#!/usr/bin/env node
// Build review/candidate-data.js: render all 38 composition candidates on
// fixed sample content (candidate exhibition gallery).
// Each candidate is FORCED via layoutDeck compositionPlan (no scorer involves
// ment); failures are recorded honestly, never faked.
// Usage: node review/build-candidates.js  (requires built packages/core/dist)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const dist = (m) => require(path.join(ROOT, 'packages/core/dist/src', m));
const { COMPOSITION_CANDIDATES } = dist('composition.js');
const { layoutDeck } = dist('layout.js');
const { getSystem, fontFaceFor } = dist('systems.js');

// Fixed sample content (same for every candidate; trimmed only to satisfy
// the candidate's own maxTitleChars precondition — recorded per card).
const SAMPLE = {
  kicker: 'FIELD NOTE · 042',
  title: 'Type carries the whole deck',
  titleQuoted: '"Type carries the whole deck," the editor said plainly',
  number: '98%',
  body1: 'A six-slide comparison narrative rendered identically in every system, production and experimental.',
  body2: 'Before: fourteen shapes and six icons. After: three text blocks and nothing else on the slide.',
  caption: 'Source: candidate exhibition fixture (illustrative)',
};
const TWO_BODY_TYPES = new Set(['comparison', 'tradeoff', 'process', 'evidence', 'architecture']);

function slideFor(cand) {
  const req = new Set(cand.preconditions?.requiresRoles || []);
  req.add('title');
  const types = cand.semanticTypes || [];
  const wantTwoBodies = types.some((t) => TWO_BODY_TYPES.has(t));
  const maxBodies = cand.preconditions?.maxBodyBlocks;
  const blocks = [];
  if (req.has('kicker')) blocks.push({ role: 'kicker', content: SAMPLE.kicker });
  let title = types.includes('quote') ? SAMPLE.titleQuoted : SAMPLE.title;
  let trimmed = false;
  const maxChars = cand.preconditions?.maxTitleChars;
  if (maxChars && title.length > maxChars) { title = title.slice(0, maxChars); trimmed = true; }
  blocks.push({ role: 'title', content: title });
  if (req.has('number')) blocks.push({ role: 'number', content: SAMPLE.number });
  const nBodies = maxBodies === 0 ? 0 : (wantTwoBodies ? 2 : 1);
  if (nBodies >= 1) blocks.push({ role: 'body', content: SAMPLE.body1 });
  if (nBodies >= 2) blocks.push({ role: 'body', content: SAMPLE.body2 });
  if (req.has('caption')) blocks.push({ role: 'caption', content: SAMPLE.caption });
  return { blocks, trimmed, maxChars: maxChars || null };
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function stageHtml(deck, system) {
  const slide = deck.slides[0];
  const fam = (b) => {
    if (b.fontFace) return /\s/.test(b.fontFace) ? `"${b.fontFace}"` : b.fontFace;
    return fontFaceFor(system, b.role).split(',').map((f) => f.trim()).map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  };
  const blocks = slide.blocks.map((b) => {
    const l = (b.x / 13.33 * 100).toFixed(3), t = (b.y / 7.5 * 100).toFixed(3);
    const w = (b.w / 13.33 * 100).toFixed(3), h = (b.h / 7.5 * 100).toFixed(3);
    const fs = (b.fontSize / 72 / 13.33 * 100).toFixed(3);
    return `<div class="block" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%;font-size:${fs}cqw;font-weight:${b.fontWeight};line-height:${b.lineHeight};letter-spacing:${b.tracking}em;text-align:${b.align};color:${b.color};font-family:${fam(b)}">${esc(b.content)}</div>`;
  }).join('\n');
  return `<div class="stage" style="background:${slide.background}" role="img" aria-label="${esc(slide.thesis)}">\n${blocks}\n</div>`;
}

const ids = Object.keys(COMPOSITION_CANDIDATES).sort();
const out = {
  generatedAt: new Date().toISOString(),
  seed: 7,
  sampleNote: 'Fixed English fixture; title trimmed only when the candidate declares maxTitleChars.',
  candidates: [],
  warnings: [],
};

for (const id of ids) {
  const c = COMPOSITION_CANDIDATES[id];
  const systemId = (c.systems && c.systems[0]) || 'swiss';
  const { blocks, trimmed, maxChars } = slideFor(c);
  const narrative = { title: 'Candidate exhibition', lang: 'en', slides: [{ id: 'x0-exhibit', thesis: c.id, blocks }] };
  const entry = {
    id, systems: c.systems || [], renderedSystem: systemId, themeId: (c.theme && c.theme.id) || null,
    semanticTypes: c.semanticTypes || [], primitives: c.primitives || [],
    rationale: c.rationale || '', exceptions: c.exceptions || [],
    constraints: c.constraints || {}, preconditions: c.preconditions || {},
    bestFor: c.bestFor || null, avoidFor: c.avoidFor || null,
    density: c.density || null, formality: c.formality || null,
    titleTrimmed: trimmed, maxTitleChars: maxChars,
    slideHtml: null, error: null,
  };
  try {
    const deck = layoutDeck(narrative, systemId, {
      seed: 7,
      compositionPlan: [{ slideId: 'x0-exhibit', semanticType: (c.semanticTypes || ['thesis'])[0], candidateId: id, rationale: 'candidate exhibition (forced)', score: 0 }],
    });
    entry.slideHtml = stageHtml(deck, getSystem(systemId));
  } catch (e) {
    entry.error = e.message;
    out.warnings.push(id + ': ' + e.message);
  }
  out.candidates.push(entry);
}

const js = 'window.CANDIDATE_DATA = ' + JSON.stringify(out) + ';\n';
fs.writeFileSync(path.join(__dirname, 'candidate-data.js'), js);
const ok = out.candidates.filter((c) => !c.error).length;
console.log(`wrote review/candidate-data.js: ${ok}/${out.candidates.length} rendered, ${out.warnings.length} warnings`);
for (const w of out.warnings) console.log('WARN: ' + w);
