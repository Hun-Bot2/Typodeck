// Generic builder smoke: all 7 roles render with the marker contract.
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

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');

async function fixture() {
  const text = await fs.readFile(
    path.join(REPO, 'typo-pack', 'templates', 'fika', 'design.md'), 'utf8');
  const { tokens } = parseDesignFile(text, 'fika');
  const theme = toTheme(tokens, 'fika');
  const content = parseContent(JSON.parse(await fs.readFile(
    path.join(REPO, 'evals', 'hackathon', 'harness-proof', 'proof-content.en.json'), 'utf8')));
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
      assert.ok(html.includes('1920px') && html.includes('1080px'), `${role}/${lang} stage`);
      assert.ok(html.includes('data-t="footer"'), `${role}/${lang} footer marker`);
      assert.ok(html.includes('data-t="numeral"'), `${role}/${lang} numeral marker`);
      assert.ok(html.includes('data-headline'), `${role}/${lang} headline marker`);
      assert.ok(notes.length > 0, `${role}/${lang} notes`);
      if (lang === 'ko') assert.ok(html.includes('keep-all'), `${role}/ko breaking`);
    });
  }
});

test('snapDown stays on repair rungs', () => {
  assert.equal(snapDown(196), 118);
  assert.equal(snapDown(88), 72);
  assert.equal(snapDown(48), 48);
  assert.equal(snapDown(20), 40);
});
