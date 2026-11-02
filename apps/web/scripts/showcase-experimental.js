// Typodeck showcase generator: (re)builds the EXPERIMENTAL idea-mode deck
// for the /showcase page (document system, original idea text archived in
// harborlight-document.idea.txt). Same pipeline as showcase/run-deck.js:
// planDeck -> exportToPptx -> validatePptx. Deterministic: the seed is a
// content hash, so the same core version reproduces the same bytes
// (modulo PPTX timestamps).
// Usage (from the repo root, after `npm run build -w @typodeck/core`):
//   node apps/web/scripts/showcase-experimental.js
'use strict';
const { promises: fs } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..', '..');
const CORE = path.join(ROOT, 'packages', 'core', 'dist', 'src');
const OUT = path.join(ROOT, 'apps', 'web', 'public', 'showcase');
const { planDeck } = require(path.join(CORE, 'narrative'));
const { exportToPptx } = require(path.join(CORE, 'export'));
const { validatePptx } = require(path.join(CORE, 'validate'));

async function main() {
  const ideaPath = path.join(OUT, 'harborlight-document.idea.txt');
  const IDEA = (await fs.readFile(ideaPath, 'utf8')).trim();
  if (IDEA.length < 100 || IDEA.length > 20000) {
    throw new Error(`idea text must be 100-20000 chars, got ${IDEA.length}`);
  }
  const result = await planDeck({ type: 'idea', text: IDEA }, { system: 'document', purpose: 'P01', lang: 'en' });
  const outPptx = path.join(OUT, 'harborlight-document.pptx');
  const res = await exportToPptx(result.deck, outPptx);
  const expectedChars = result.deck.slides
    .flatMap((s) => s.blocks)
    .reduce((a, b) => a + b.content.length, 0);
  const check = await validatePptx(outPptx, expectedChars);
  await fs.writeFile(path.join(OUT, 'harborlight-document.json'), JSON.stringify(result.deck, null, 2) + '\n');
  const report = {
    source: 'original idea text (harborlight-document.idea.txt)',
    purpose: 'P01',
    lang: 'en',
    system: 'document',
    status: 'experimental',
    seed: result.deck.meta.seed,
    provider: result.provenance.provider,
    generatedBy: result.provenance.generatedBy,
    claims: result.provenance.claims,
    warnings: result.provenance.warnings,
    slides: result.deck.slides.length,
    pptx: { slideCount: res.slideCount, textBoxCount: res.textBoxCount },
    validation: { ok: check.ok, errors: check.errors, stats: check.stats },
  };
  await fs.writeFile(
    path.join(OUT, 'harborlight-document.provenance.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report, null, 2));
  if (!check.ok) process.exit(1);
}

main().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
