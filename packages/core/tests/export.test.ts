import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { exportToPptx } from '../src/export';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { SYSTEM_IDS } from '../src/systems';
import { validatePptx } from '../src/validate';

let tmpDir: string;
const outFiles: string[] = [];

before(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'typodeck-test-'));
  for (const system of SYSTEM_IDS) {
    const deck = layoutDeck(SAMPLE_NARRATIVE, system);
    const outPath = path.join(tmpDir, `typodeck-${system}.pptx`);
    await exportToPptx(deck, outPath);
    outFiles.push(outPath);
  }
});

describe('export + structural validation', () => {
  it('exports all three systems to non-trivial files', async () => {
    assert.equal(outFiles.length, 3);
    for (const f of outFiles) {
      const stat = await fs.stat(f);
      assert.ok(stat.size > 10_000, `${f} suspiciously small (${stat.size} bytes)`);
    }
  });

  it('exported decks pass structural validation (typography-only)', async () => {
    const expectedChars = SAMPLE_NARRATIVE.slides
      .flatMap((s) => s.blocks)
      .reduce((a, b) => a + b.content.length, 0);
    for (const f of outFiles) {
      const res = await validatePptx(f, expectedChars);
      assert.deepEqual(res.errors, [], `${f} failed validation: ${res.errors.join('; ')}`);
      assert.equal(res.ok, true);
      assert.equal(res.stats.slides, 7);
      assert.ok(res.stats.textShapes > 0);
      assert.ok(res.stats.editableChars >= expectedChars, `${f}: editable chars ${res.stats.editableChars} < ${expectedChars}`);
      const sz = res.stats.slideSizeIn;
      assert.ok(sz !== null);
      assert.ok(Math.abs(sz.w / sz.h - 16 / 9) < 0.01, `${f}: not 16:9`);
    }
  });

  it('exporter source never calls forbidden drawing APIs', async () => {
    const src = await fs.readFile(path.join(__dirname, '..', '..', 'src', 'export.ts'), 'utf8');
    for (const api of ['Shape', 'Image', 'Table', 'Chart', 'Media'].map((k) => `add${k}`)) {
      // Allowed only inside comments mentioning the ban.
      const hits = src.split('\n').filter((l) => l.includes(api) && !l.trim().startsWith('//'));
      assert.equal(hits.length, 0, `export.ts calls forbidden API ${api}`);
    }
  });
});
