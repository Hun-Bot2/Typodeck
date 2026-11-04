// Bespoke gridline builder smoke: all 7 roles render typography-only
// (no rail panel, rules, grid, or table) with the marker contract intact.
import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDesignFile } from '../lib/spec.mjs';
import { buildSlide, titleLadder } from '../lib/builder.mjs';
import { parseContent } from '../lib/content.mjs';
import { planDeckRoles } from '../lib/roles.mjs';
import { assertTypoOnly } from './typo-only.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');

async function fixture() {
  const text = await fs.readFile(
    path.join(REPO, 'bold-template-pack', 'templates', 'gridline-swiss', 'design.md'), 'utf8');
  const { tokens, cjk } = parseDesignFile(text, 'gridline-swiss');
  const content = parseContent(JSON.parse(await fs.readFile(
    path.join(HERE, 'fixtures', 'content-en.json'), 'utf8')));
  return { spec: { tokens, cjk }, content };
}

test('bespoke builder renders 7 roles typography-only (en + ko)', async () => {
  const { spec, content } = await fixture();
  const roles = planDeckRoles(content.slides);
  assert.deepEqual(roles.map((r) => r.role),
    ['cover', 'divider', 'statement', 'evidence', 'comparison', 'dense', 'closing']);
  for (const lang of ['en', 'ko']) {
    roles.forEach(({ role }, i) => {
      const { html, notes } = buildSlide({
        spec, slide: content.slides[i], role, index: i, total: 7,
        deck: content.deck, lang,
      });
      assertTypoOnly(html, `${role}/${lang}`);
      assert.ok(notes.length > 0, `${role}/${lang} notes`);
    });
  }
});

test('bespoke dense ledger preserves every table string', async () => {
  const { spec, content } = await fixture();
  const i = content.slides.findIndex((s) => s.table);
  const { html } = buildSlide({
    spec, slide: content.slides[i], role: 'dense', index: i, total: 7,
    deck: content.deck, lang: 'en',
  });
  const t = content.slides[i].table;
  for (const c of t.columns) assert.ok(html.includes(c), `column ${c}`);
  for (const row of t.rows) {
    for (const cell of row) assert.ok(html.includes(String(cell)), `cell ${cell}`);
  }
  assert.ok(html.includes(t.footnote), 'footnote');
  assert.ok(html.includes('data-t="table"'), 'table marker');
  assert.ok(html.includes('lrow flag'), 'flagged rows keep the flag class');
});

test('bespoke folio keeps numeral + meta markers without a rail panel', async () => {
  const { spec, content } = await fixture();
  const { html } = buildSlide({
    spec, slide: content.slides[0], role: 'cover', index: 0, total: 7,
    deck: content.deck, lang: 'en',
  });
  assert.ok(html.includes('data-t="numeral"'), 'numeral marker');
  assert.ok(html.includes('data-t="meta"'), 'meta marker');
  assert.ok(html.includes('07 / 2026'), 'meta value verbatim');
});

test('titleLadder follows the design iteration rule', () => {
  assert.equal(titleLadder('cover', 10), 118);
  assert.equal(titleLadder('cover', 60), 72);
  assert.equal(titleLadder('cover', 100), 48);
  assert.equal(titleLadder('statement', 10), 104);
  assert.equal(titleLadder('evidence', 10), 48);
});
