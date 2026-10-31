import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import JSZip from 'jszip';
import { exportToPptx, exportToPptxBuffer } from '../src/export';
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
  it('exports all systems to non-trivial files', async () => {
    assert.equal(outFiles.length, SYSTEM_IDS.length);
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

  it('writes speaker notes to native notes parts, never onto slides', async () => {
    const narrative = JSON.parse(JSON.stringify(SAMPLE_NARRATIVE)) as typeof SAMPLE_NARRATIVE;
    narrative.slides[0].notes = 'UNIQUE-NOTE-MARKER greet the judges warmly';
    const deck = layoutDeck(narrative, 'swiss', { seed: 7 });
    assert.equal(deck.slides[0].notes, narrative.slides[0].notes);
    assert.ok(deck.slides[0].blocks.every((b) => !b.content.includes('UNIQUE-NOTE-MARKER')));
    const { buffer } = await exportToPptxBuffer(deck);
    const zip = await JSZip.loadAsync(buffer);
    const noteNames = Object.keys(zip.files).filter((n) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n));
    assert.ok(noteNames.length >= 1, 'expected at least one notes part');
    const noteXml = await zip.file(noteNames[0])?.async('string');
    assert.ok(noteXml?.includes('UNIQUE-NOTE-MARKER'), 'notes text missing from notes part');
    const slideXml = await zip.file('ppt/slides/slide1.xml')?.async('string');
    assert.ok(!slideXml?.includes('UNIQUE-NOTE-MARKER'), 'notes text leaked onto slide');
  });

  it('writes provenance to core properties, never onto slides', async () => {
    const deck = layoutDeck(SAMPLE_NARRATIVE, 'swiss', { seed: 7 });
    deck.meta.generatedBy = 'typodeck:test';
    deck.meta.provenance = { repo: 'acme/widgets', branch: 'main', sha: 'abc123def456789' };
    const { buffer } = await exportToPptxBuffer(deck);
    const zip = await JSZip.loadAsync(buffer);
    const core = await zip.file('docProps/core.xml')?.async('string');
    assert.ok(core?.includes('typodeck:test'), 'author missing from core properties');
    assert.ok(core?.includes('Typodeck'), 'company missing from core properties');
    assert.ok(core?.includes('source: acme/widgets@abc123def456'), `subject missing: ${core}`);
    for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
      const slideXml = await zip.file(name)?.async('string');
      assert.ok(!slideXml?.includes('source: acme/widgets'), 'provenance leaked onto a slide');
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
