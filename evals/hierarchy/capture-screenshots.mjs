// Stage-4 B/D pilot: screenshot capture over the existing HTML mirror path ONLY.
//
// MIRROR-RISK (see core critic.renderMeasureHtml): these PNGs render the
// HTML *mirror* of slide geometry, NOT the exported PPTX rasterized in
// PowerPoint/LibreOffice. Font stacks, wrap decisions, and clipping may
// diverge from the real render. NEVER claim PPTX parity for these images;
// they exist only to stage human review (arms B/D), not to score it.
//
// What this script does:
//  1. Rebuilds every clean BEFORE deck (planCompositions + layoutDeck, seed 42)
//     from evals/hierarchy/fixtures.json.
//  2. Writes one mirror HTML per deck via core renderMeasureHtml.
//  3. Screenshots each with headless Chrome --screenshot.
//  4. Emits proposed-labels.csv: machine-PROPOSED ranks (Arm-C P order).
//     PROPOSED labels are NOT ground truth (see annotation-guide.md).
//
// Usage: node evals/hierarchy/capture-screenshots.mjs
// Env: TYPODECK_CHROME (optional override for the Chrome binary).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CORE = join(HERE, '..', '..', 'packages', 'core', 'dist', 'src');
const { layoutDeck, planCompositions, renderMeasureHtml } = await import(
  join(CORE, 'index.js')
);

const SHOT_DIR = join(HERE, 'results', 'screenshots');
const HTML_DIR = join(SHOT_DIR, 'html');
mkdirSync(HTML_DIR, { recursive: true });

const CHROME =
  process.env.TYPODECK_CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function chromeExists() {
  if (existsSync(CHROME)) return true;
  try {
    execFileSync('which', ['google-chrome'], { stdio: 'ignore' });
    return 'google-chrome';
  } catch {
    return false;
  }
}

const fixtures = JSON.parse(
  readFileSync(join(HERE, 'fixtures.json'), 'utf8'),
).fixtures;

// Frozen C4 prominence proxy, duplicated for the proposals file header trace.
const prom = (size, weight) => size * (1 + ((weight - 400) / 400) * 0.25);

const proposedRows = [
  'screenshot,block_id,role,proposed_rank_by_P,proposed_emphasis_guess,label_status,human_rank,human_emphasis,human_notes',
];
let shots = 0;
const t0 = Date.now();

for (const f of fixtures) {
  for (const system of f.systems) {
    const plan = planCompositions(f.narrative, system);
    const deck = layoutDeck(f.narrative, system, { seed: 42, compositionPlan: plan });
    const slide = deck.slides[0];
    const base = `${f.id}-${system}`;
    const htmlPath = join(HTML_DIR, `${base}.html`);
    writeFileSync(htmlPath, renderMeasureHtml(slide, system, { widthPx: 1280 }));
    const pngPath = join(SHOT_DIR, `${base}.png`);
    const bin = chromeExists();
    if (!bin) {
      console.error('Chrome not found; set TYPODECK_CHROME. HTML kept, no PNG.');
      process.exit(2);
    }
    execFileSync(
      bin === true ? CHROME : bin,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        '--window-size=1280,720',
        `--screenshot=${pngPath}`,
        `file://${htmlPath}`,
      ],
      { stdio: 'pipe', timeout: 60000 },
    );
    shots++;
    // Machine-PROPOSED labels from P order (NOT ground truth).
    const ranked = slide.blocks
      .map((b) => ({ b, p: prom(b.fontSize, b.fontWeight) }))
      .sort((a, b2) => b2.p - a.p);
    ranked.forEach(({ b }, i) => {
      proposedRows.push(
        [
          `${base}.png`,
          b.id,
          b.role,
          String(i + 1),
          i === 0 ? 'primary?' : 'secondary/supporting?',
          'PROPOSED-NOT-GROUND-TRUTH',
          '',
          '',
          '',
        ].join(','),
      );
    });
    console.log(`shot ${base}.png blocks=${slide.blocks.length}`);
  }
}

writeFileSync(join(SHOT_DIR, 'proposed-labels.csv'), proposedRows.join('\n') + '\n');
writeFileSync(
  join(SHOT_DIR, 'README-NOT-PPTX.txt'),
  [
    'MIRROR-RISK: these PNGs render the HTML mirror (core renderMeasureHtml),',
    'NOT the exported PPTX. Do not claim PPTX parity. Staging for human',
    'review (B/D pilot) only. See evals/hierarchy/annotation-guide.md.',
    '',
  ].join('\n'),
);
console.log(`captured ${shots} screenshots in ${Date.now() - t0}ms -> ${SHOT_DIR}`);
