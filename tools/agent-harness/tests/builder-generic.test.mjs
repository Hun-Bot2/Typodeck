// Generic builder smoke: all 7 roles render with the marker contract,
// typography-only (no boxes, rules, rails, or table grids).
import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDesignFile } from '../lib/spec.mjs';
import { toTheme } from '../lib/theme.mjs';
import { buildSlideGeneric, snapDown } from '../lib/builder-generic.mjs';
import { parseContent } from '../lib/content.mjs';
import { planDeckRoles } from '../lib/roles.mjs';
import { assertTypoOnly } from './typo-only.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');

async function fixture() {
  const text = await fs.readFile(
    path.join(REPO, 'bold-template-pack', 'templates', 'fika', 'design.md'), 'utf8');
  const { tokens } = parseDesignFile(text, 'fika');
  const theme = toTheme(tokens, 'fika');
  const content = parseContent(JSON.parse(await fs.readFile(
    path.join(HERE, 'fixtures', 'content-en.json'), 'utf8')));
  return { theme, content };
}

test('generic builder renders 7 roles with markers (en + ko)', async () => {
  const { theme, content } = await fixture();
  const roles = planDeckRoles(content.slides);
  assert.equal(roles.length, 7);
  for (const lang of ['en', 'ko']) {
    roles.forEach(({ role }, i) => {
      const { html, notes } = buildSlideGeneric({
        theme, slide: content.slides[i], role, index: i, total: 7,
        deck: content.deck, lang,
      });
      assertTypoOnly(html, `${role}/${lang}`);
      assert.ok(notes.length > 0, `${role}/${lang} notes`);
      if (lang === 'ko') assert.ok(html.includes('keep-all'), `${role}/ko breaking`);
    });
  }
});

test('generic dense role preserves every table string without a table', async () => {
  const { theme, content } = await fixture();
  const i = content.slides.findIndex((s) => s.table);
  assert.ok(i >= 0, 'fixture needs a dense slide');
  for (const lang of ['en', 'ko']) {
    const { html } = buildSlideGeneric({
      theme, slide: content.slides[i], role: 'dense', index: i, total: 7,
      deck: content.deck, lang,
    });
    const t = content.slides[i].table;
    for (const c of t.columns) assert.ok(html.includes(c), `dense/${lang} column ${c}`);
    for (const row of t.rows) {
      for (const cell of row) assert.ok(html.includes(String(cell)), `dense/${lang} cell ${cell}`);
    }
    assert.ok(html.includes(t.footnote), `dense/${lang} footnote`);
    assert.ok(html.includes('data-t="table"'), `dense/${lang} table marker`);
  }
});

test('generic comparison marks flags with type, not squares', async () => {
  const { theme, content } = await fixture();
  const i = content.slides.findIndex((s) => s.zones);
  assert.ok(i >= 0, 'fixture needs a comparison slide');
  const { html } = buildSlideGeneric({
    theme, slide: content.slides[i], role: 'comparison', index: i, total: 7,
    deck: content.deck, lang: 'en',
  });
  assert.ok(html.includes('class="bad"'), 'flagged rows keep the bad class');
  assert.ok(html.includes('Rushed') && html.includes('Reviewed'), 'zone labels verbatim');
});

test('snapDown stays on repair rungs', () => {
  assert.equal(snapDown(196), 118);
  assert.equal(snapDown(88), 72);
  assert.equal(snapDown(48), 48);
  assert.equal(snapDown(20), 40);
});
