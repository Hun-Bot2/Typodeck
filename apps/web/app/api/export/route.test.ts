// Colocated tests for POST /api/export's optional `template` slug.
//
// slug present  -> export is themed via the engine template-pack API
//                 (content-identical to the direct layoutDeckWithTemplate
//                 pipeline, and distinct from baseline).
// slug absent   -> baseline layoutDeck behavior, byte-compatible with the
//                 direct pipeline (zip entry contents compared instead of
//                 raw bytes: zip timestamps tick with wall-clock time).
//
// Run: compile this folder with tsc, then `node --test` the emitted file
// (see the route's test notes). Not a Next route: only route.ts is served.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import JSZip from 'jszip';
import {
  exportToPptxBuffer,
  layoutDeck,
  layoutDeckWithTemplate,
  parseSelectionIndex,
  SAMPLE_NARRATIVE,
  validatePptxBytes,
} from '@typodeck/core';
import { POST } from './route.js';

type PostRequest = Parameters<typeof POST>[0];

const SYSTEM = 'swiss';
const SLUG = 'maison'; // dark scheme, distinctive background #0B0B0C
const THEMED_BG_HEX = '0B0B0C';

function postJson(body: unknown): PostRequest {
  const raw = JSON.stringify(body);
  return {
    headers: new Headers({ 'content-length': String(Buffer.byteLength(raw, 'utf8')) }),
    text: async () => raw,
  } as unknown as PostRequest;
}

/** Same upward search as the route: works from the repo root or apps/web. */
function findPackRoot(): string {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(join(dir, 'bold-template-pack', 'selection-index.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) throw new Error('template pack not found from cwd ' + process.cwd());
    dir = parent;
  }
}

function loadExpectedTemplate(): { designMarkdown: string } {
  const root = findPackRoot();
  const entries = parseSelectionIndex(
    JSON.parse(readFileSync(join(root, 'bold-template-pack', 'selection-index.json'), 'utf8')),
  );
  const entry = entries.find((e) => e.slug === SLUG);
  assert.ok(entry, `expected template "${SLUG}" in selection-index.json`);
  return { designMarkdown: readFileSync(join(root, entry.designPath), 'utf8') };
}

/** Zip entry names + uncompressed contents; ignores volatile zip metadata. */
async function zipContent(buf: Buffer): Promise<Map<string, string>> {
  const zip = await JSZip.loadAsync(buf);
  const out = new Map<string, string>();
  for (const name of Object.keys(zip.files).sort()) {
    const file = zip.files[name];
    out.set(name, file.dir ? '<dir>' : (await file.async('nodebuffer')).toString('base64'));
  }
  return out;
}

// docProps/core.xml carries created/modified timestamps (1 s resolution),
// so it is compared separately (creator stamp) rather than deep-compared.
const VOLATILE_ENTRIES = ['docProps/core.xml'];
const CREATOR_STAMP = '<dc:creator>typodeck-studio/phase3</dc:creator>';

function stableContent(all: Map<string, string>): Map<string, string> {
  return new Map([...all].filter(([name]) => !VOLATILE_ENTRIES.includes(name)));
}

/** Entry-by-entry equality so a mismatch names the entry, not a 60-entry dump. */
function assertZipEqual(actual: Map<string, string>, expected: Map<string, string>): void {
  const a = stableContent(actual);
  const e = stableContent(expected);
  assert.deepEqual([...a.keys()], [...e.keys()]);
  for (const [name, content] of a) {
    assert.equal(content, e.get(name), `zip entry differs: ${name}`);
  }
}

async function coreXml(buf: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buf);
  const file = zip.files['docProps/core.xml'];
  assert.ok(file, 'expected docProps/core.xml in export');
  return file.async('string');
}

async function bodyBytes(res: Response): Promise<Buffer> {
  return Buffer.from(await res.arrayBuffer());
}

describe('POST /api/export template slug', () => {
  it('exports baseline bytes when template is absent', async () => {
    const res = await POST(postJson({ narrative: SAMPLE_NARRATIVE, system: SYSTEM }));
    assert.equal(res.status, 200);
    assert.equal(
      res.headers.get('content-type'),
      'application/vnd.openxmlformats-officedocument.presentationml+xml',
    );
    assert.equal(res.headers.get('content-disposition'), `attachment; filename="typodeck-${SYSTEM}.pptx"`);
    const buf = await bodyBytes(res);
    assert.equal(res.headers.get('content-length'), String(buf.length));
    const check = await validatePptxBytes(buf, 100);
    assert.ok(check.ok, `baseline pptx invalid: ${check.errors.join('; ')}`);

    const expectedDeck = layoutDeck(SAMPLE_NARRATIVE, SYSTEM);
    assert.equal(res.headers.get('x-typodeck-slides'), String(expectedDeck.slides.length));
    // Mirror the route's generatedBy default before exporting the oracle.
    expectedDeck.meta.generatedBy = 'typodeck-studio/phase3';
    const expected = (await exportToPptxBuffer(expectedDeck)).buffer;
    assertZipEqual(await zipContent(buf), await zipContent(expected));
    assert.ok((await coreXml(buf)).includes(CREATOR_STAMP), 'baseline carries the route creator stamp');
  });

  it('themes the export from the template slug', async () => {
    const { designMarkdown } = loadExpectedTemplate();
    const res = await POST(postJson({ narrative: SAMPLE_NARRATIVE, system: SYSTEM, template: SLUG }));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-disposition'), `attachment; filename="typodeck-${SLUG}.pptx"`);
    const buf = await bodyBytes(res);
    const check = await validatePptxBytes(buf, 100);
    assert.ok(check.ok, `themed pptx invalid: ${check.errors.join('; ')}`);

    const entries = parseSelectionIndex(
      JSON.parse(
        readFileSync(join(findPackRoot(), 'bold-template-pack', 'selection-index.json'), 'utf8'),
      ),
    );
    const entry = entries.find((e) => e.slug === SLUG);
    assert.ok(entry);
    const expectedDeck = layoutDeckWithTemplate(SAMPLE_NARRATIVE, entry, designMarkdown);
    assert.equal(res.headers.get('x-typodeck-slides'), String(expectedDeck.slides.length));
    // Mirror the route's generatedBy default before exporting the oracle.
    expectedDeck.meta.generatedBy = 'typodeck-studio/phase3';
    const expected = (await exportToPptxBuffer(expectedDeck)).buffer;
    assertZipEqual(await zipContent(buf), await zipContent(expected));
    assert.ok((await coreXml(buf)).includes(CREATOR_STAMP), 'themed export carries the route creator stamp');

    // Themed output is visibly the template's ground, not the baseline's.
    const baseline = await bodyBytes(
      await POST(postJson({ narrative: SAMPLE_NARRATIVE, system: SYSTEM })),
    );
    const themedSlides = await zipContent(buf);
    const baselineSlides = await zipContent(baseline);
    assert.notEqual(
      themedSlides.get('ppt/slides/slide1.xml'),
      baselineSlides.get('ppt/slides/slide1.xml'),
      'themed slide XML differs from baseline slide XML',
    );
    assert.ok(buf.toString('latin1').includes(THEMED_BG_HEX), 'themed bytes carry the template background');
    assert.ok(
      !baseline.toString('latin1').includes(THEMED_BG_HEX),
      'baseline bytes lack the template background',
    );
  });

  it('rejects an unknown template slug', async () => {
    const res = await POST(
      postJson({ narrative: SAMPLE_NARRATIVE, system: SYSTEM, template: 'no-such-template' }),
    );
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, 'invalid-template');
  });

  it('rejects a non-string template', async () => {
    const res = await POST(postJson({ narrative: SAMPLE_NARRATIVE, system: SYSTEM, template: 42 }));
    assert.equal(res.status, 400);
    const body = (await res.json()) as { error: { code: string } };
    assert.equal(body.error.code, 'invalid-template');
  });
});
