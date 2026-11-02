// Example 05 — offline improved pipeline: compose -> art-direct -> layout ->
// optical -> critique -> bounded revise -> export bytes -> validate bytes.
// Real input: packages/core/fixtures/idea-devtool.txt. Every stage calls
// the real Core API; nothing is stubbed.
// Prerequisite: npm run build -w @typodeck/core (EXAMPLES.sh does this).
// Usage: node examples/05-improved-pipeline.mjs [OUT_DIR]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..', '..', '..', '..');
const distEntry = path.join(root, 'packages/core/dist/src/index.js');
if (!existsSync(distEntry)) {
  console.error('FAIL 05: core not built — run: npm run build -w @typodeck/core');
  process.exit(1);
}
const core = await import(distEntry);
const {
  planDeck,
  planCompositions,
  planArtDirection,
  layoutDeck,
  validateDeck,
  applyOpticalCorrections,
  critiqueDeck,
  reviseDeck,
  exportToPptxBuffer,
  validatePptxBytes,
} = core;

const fail = (msg) => {
  console.error(`FAIL 05: ${msg}`);
  process.exit(1);
};

const outDir = process.argv[2] ?? '/tmp/typodeck-skill';
mkdirSync(outDir, { recursive: true });
const system = 'editorial';

const fixture = path.join(root, 'packages/core/fixtures/idea-devtool.txt');
const text = readFileSync(fixture, 'utf8');
const planned = await planDeck({ type: 'idea', text }, { system });
const { narrative } = planned;

// Stage 1: composition plan + art direction (annotated, rhythm-balanced).
const plan = planCompositions(narrative, system);
const art = planArtDirection(narrative, system);
console.log(`plan: ${plan.length} slides classified+composed, art issues=${art.issues.length}`);
for (const p of plan) console.log(`  ${p.slideId} ${p.semanticType} -> ${p.candidateId} (score=${p.score})`);

// Stage 2: layout with plan -> optical (measurable default) -> validate.
const laid = layoutDeck(narrative, system, { compositionPlan: plan });
const { deck: corrected, log: opticalLog, proposals } = applyOpticalCorrections(laid);
validateDeck(corrected);
console.log(`optical: applied=${opticalLog.length} experimental-proposals=${proposals.length} (never applied)`);

// Stage 3: critique the corrected deck (proxies + unmeasured, honestly labeled).
const critique = critiqueDeck(corrected, narrative, plan);
const errCount = critique.findings.filter((f) => f.severity === 'error').length;
console.log(
  `critic: findings=${critique.findings.length} errors=${errCount} ` +
    `unmeasured=${critique.visionUnmeasured.length} ` +
    `scores=${JSON.stringify(critique.scores)}`,
);

// Stage 4: bounded revision loop (content never rewritten for looks).
const revised = reviseDeck(narrative, system, { maxAttempts: 3 });
console.log(`revise: attempts=${revised.attempts}`);
for (const line of revised.provenance) console.log(`  provenance: ${line}`);

// Stage 5: export bytes + validate bytes (ship gate).
const exported = await exportToPptxBuffer(revised.deck);
const expectedChars = revised.deck.slides
  .flatMap((s) => s.blocks)
  .reduce((a, b) => a + b.content.length, 0);
const check = await validatePptxBytes(exported.buffer, expectedChars);
if (!check.ok) fail(`export validation errors: ${check.errors.join('; ')}`);
const outPath = path.join(outDir, '05-improved-editorial.pptx');
writeFileSync(outPath, exported.buffer);
console.log(
  `deck: ${exported.slideCount} slides, ${exported.textBoxCount} text boxes -> ${outPath}`,
);
console.log(
  `validate: slides=${check.stats.slides} textShapes=${check.stats.textShapes} ` +
    `editableChars=${check.stats.editableChars}`,
);
console.log('validation: OK');
console.log('PASS 05: improved pipeline -> critic -> validated PPTX bytes');
