#!/usr/bin/env node
// Build per-candidate PPTX proofs: one editable .pptx per composition
// candidate on the same fixed fixture as build-candidates.js.
// Output: review/assets/candidates/<id>.pptx + `pptx` field patched into
// review/candidate-data.js (run build-candidates.js first).
// Each file is structurally validated (validatePptx); failures are
// recorded honestly, never faked. These prove engine packaging and
// font stamping — NOT pixel parity with the HTML render.
// Usage: node review/build-candidate-pptx.js  (requires built dist)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const dist = (m) => require(path.join(ROOT, 'packages/core/dist/src', m));
const { COMPOSITION_CANDIDATES } = dist('composition.js');
const { layoutDeck } = dist('layout.js');
const { exportToPptx } = dist('export.js');
const { validatePptx } = dist('validate.js');

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
  const maxChars = cand.preconditions?.maxTitleChars;
  if (maxChars && title.length > maxChars) title = title.slice(0, maxChars);
  blocks.push({ role: 'title', content: title });
  if (req.has('number')) blocks.push({ role: 'number', content: SAMPLE.number });
  const nBodies = maxBodies === 0 ? 0 : (wantTwoBodies ? 2 : 1);
  if (nBodies >= 1) blocks.push({ role: 'body', content: SAMPLE.body1 });
  if (nBodies >= 2) blocks.push({ role: 'body', content: SAMPLE.body2 });
  if (req.has('caption')) blocks.push({ role: 'caption', content: SAMPLE.caption });
  return blocks;
}

async function main() {
  const outDir = path.join(__dirname, 'assets', 'candidates');
  fs.mkdirSync(outDir, { recursive: true });
  const dataPath = path.join(__dirname, 'candidate-data.js');
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw.replace('window.CANDIDATE_DATA = ', '').replace(/;\s*$/, ''));
  const byId = new Map(data.candidates.map((c) => [c.id, c]));

  const ids = Object.keys(COMPOSITION_CANDIDATES).sort();
  let ok = 0;
  const warnings = [];
  for (const id of ids) {
    const c = COMPOSITION_CANDIDATES[id];
    const systemId = (c.systems && c.systems[0]) || 'swiss';
    const narrative = { title: 'Candidate exhibition', lang: 'en', slides: [{ id: 'x0-exhibit', thesis: c.id, blocks: slideFor(c) }] };
    const outPath = path.join(outDir, `${id}.pptx`);
    try {
      const deck = layoutDeck(narrative, systemId, {
        seed: 7,
        compositionPlan: [{ slideId: 'x0-exhibit', semanticType: (c.semanticTypes || ['thesis'])[0], candidateId: id, rationale: 'candidate PPTX proof (forced)', score: 0 }],
      });
      await exportToPptx(deck, outPath);
      const v = await validatePptx(outPath);
      if (!v.ok) throw new Error('validatePptx: ' + JSON.stringify(v).slice(0, 200));
      const entry = byId.get(id);
      if (entry) entry.pptx = `assets/candidates/${id}.pptx`;
      ok++;
    } catch (e) {
      warnings.push(`${id}: ${e.message}`);
      const entry = byId.get(id);
      if (entry) entry.pptx = null;
    }
  }
  fs.writeFileSync(dataPath, 'window.CANDIDATE_DATA = ' + JSON.stringify(data) + ';\n');
  console.log(`wrote ${ok}/${ids.length} candidate PPTX proofs, ${warnings.length} warnings`);
  for (const w of warnings) console.log('WARN: ' + w);
  if (warnings.length) process.exitCode = 1;
}

main().catch((e) => { console.error('FATAL: ' + e.message); process.exit(1); });
