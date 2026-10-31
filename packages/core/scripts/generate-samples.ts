// Emits output/typodeck-<system>.pptx for all systems from the fixed
// sample narrative. Run: `npm run samples` from the repo root.
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { exportToPptx } from '../src/export';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { SYSTEM_IDS } from '../src/systems';
import { validatePptx } from '../src/validate';

async function main(): Promise<void> {
  // dist/scripts/generate-samples.js -> repo root is ../../../..
  const root = path.resolve(__dirname, '..', '..', '..', '..');
  const outDir = path.join(root, 'output');
  await fs.mkdir(outDir, { recursive: true });

  for (const system of SYSTEM_IDS) {
    const deck = layoutDeck(SAMPLE_NARRATIVE, system);
    const outPath = path.join(outDir, `typodeck-${system}.pptx`);
    const res = await exportToPptx(deck, outPath);
    const expectedChars = deck.slides.flatMap((s) => s.blocks).reduce((a, b) => a + b.content.length, 0);
    const check = await validatePptx(outPath, expectedChars);
    const stat = await fs.stat(outPath);
    console.log(
      `${system}: ${res.slideCount} slides, ${res.textBoxCount} text boxes, ` +
        `${stat.size} bytes, validation ${check.ok ? 'OK' : 'FAILED'}`,
    );
    if (!check.ok) {
      for (const e of check.errors) console.error(`  - ${e}`);
      process.exitCode = 1;
    }
  }
}

void main();
