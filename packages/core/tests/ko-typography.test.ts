import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import JSZip from 'jszip';
import { exportToPptxBuffer } from '../src/export';
import { estimateWrap } from '../src/layout';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { EXPRESSIVE, EDITORIAL, SWISS, fontFaceFor } from '../src/systems';
import { layoutDeckWithTemplate, parseSelectionIndex } from '../src/template-pack';

const REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');
const INDEX_PATH = path.join(REPO_ROOT, 'bold-template-pack', 'selection-index.json');

describe('lang-aware export faces (R1)', () => {
  it('resolves Korean decks to KR-capable faces', () => {
    assert.equal(fontFaceFor(SWISS, 'body', 'ko'), 'Noto Sans KR');
    assert.equal(fontFaceFor(SWISS, 'title', 'ko'), 'Noto Sans KR');
    assert.equal(fontFaceFor(EXPRESSIVE, 'title', 'ko'), 'Noto Sans KR');
    assert.equal(fontFaceFor(EDITORIAL, 'title', 'ko'), 'Noto Serif KR');
    assert.equal(fontFaceFor(EDITORIAL, 'body', 'ko'), 'Pretendard');
  });

  it('keeps Latin heads for English decks (default unchanged)', () => {
    assert.equal(fontFaceFor(SWISS, 'body', 'en'), 'Inter');
    assert.equal(fontFaceFor(SWISS, 'body'), 'Inter');
    assert.equal(fontFaceFor(EXPRESSIVE, 'title', 'en'), 'Archivo Black');
    assert.equal(fontFaceFor(EDITORIAL, 'title'), 'Noto Serif KR');
  });

  it('resolves template stacks to the KR entry for Korean narratives', async () => {
    const entries = parseSelectionIndex(JSON.parse(await fs.readFile(INDEX_PATH, 'utf8')));
    const mono = entries.find((e) => e.slug === 'monolith')!;
    const md = await fs.readFile(path.join(REPO_ROOT, mono.designPath), 'utf8');
    const deck = layoutDeckWithTemplate(SAMPLE_NARRATIVE, mono, md, { seed: 7 });
    const title = deck.slides[0].blocks.find((b) => b.role === 'title')!;
    // Monolith stack head is Anton (no Hangul); KO resolves past it.
    assert.equal(title.fontFace, 'Noto Sans KR');
  });
});

describe('run locale (R2)', () => {
  it('stamps ko-KR runs for Korean decks', async () => {
    assert.equal(SAMPLE_NARRATIVE.lang, 'ko');
    const deck = layoutDeck(SAMPLE_NARRATIVE, 'swiss', { seed: 7 });
    const { buffer } = await exportToPptxBuffer(deck);
    const zip = await JSZip.loadAsync(buffer);
    const slide1 = await zip.file('ppt/slides/slide1.xml')!.async('string');
    assert.ok(slide1.includes('lang="ko-KR"'), 'expected ko-KR run locale');
    assert.ok(slide1.includes('Noto Sans KR'), 'expected KR export face');
  });

  it('stamps en-US runs for English decks', async () => {
    const en = { ...SAMPLE_NARRATIVE, lang: 'en' };
    const deck = layoutDeck(en, 'swiss', { seed: 7 });
    const { buffer } = await exportToPptxBuffer(deck);
    const zip = await JSZip.loadAsync(buffer);
    const slide1 = await zip.file('ppt/slides/slide1.xml')!.async('string');
    assert.ok(slide1.includes('lang="en-US"'), 'expected en-US run locale');
  });
});

describe('kinsoku-lite wrap (R3)', () => {
  it('never starts a line with closing punctuation', () => {
    // 4 CJK chars fill 4.0in at 72pt; the '.' must hang on line 1, not open line 2.
    const r = estimateWrap('가나다라.아자차카', 72, 4.05, 0, 1.2, false);
    assert.ok(r.lines.length >= 2);
    assert.ok(r.lines[0].endsWith('.'), JSON.stringify(r.lines));
    for (const ln of r.lines.slice(1)) {
      assert.ok(!'. ,?!:;%)]}’”·'.replace(/ /g, '').includes(ln[0] ?? ''), JSON.stringify(r.lines));
    }
  });

  it('never ends a line with opening punctuation', () => {
    const r = estimateWrap('가나(다라마바사', 72, 2.4, 0, 1.2, false);
    assert.ok(!r.lines[0].endsWith('('), JSON.stringify(r.lines));
    assert.ok(r.lines[1].startsWith('('), JSON.stringify(r.lines));
  });

  it('leaves clean breaks untouched', () => {
    const r = estimateWrap('hello world foo bar', 36, 3.0, 0, 1.2, false);
    assert.deepEqual(r.lines.map((l) => l.trim()), ['hello world', 'foo bar']);
  });
});
