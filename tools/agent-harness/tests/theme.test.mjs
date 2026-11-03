// Theme normalization: every design maps to a complete canonical theme.
import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDesignFile } from '../lib/spec.mjs';
import { toTheme, latinFontsHref, koStacks } from '../lib/theme.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const HEX = /^#[0-9a-fA-F]{3,8}$/;

async function slugs() {
  const idx = JSON.parse(await fs.readFile(
    path.join(REPO, 'bold-template-pack', 'selection-index.json'), 'utf8'));
  return idx.templates.map((t) => t.slug);
}

test('all 27 designs normalize to a complete theme', async () => {
  for (const slug of await slugs()) {
    const text = await fs.readFile(
      path.join(REPO, 'bold-template-pack', 'templates', slug, 'design.md'), 'utf8');
    const { tokens } = parseDesignFile(text, slug);
    const theme = toTheme(tokens, slug);
    for (const [slot, v] of Object.entries(theme.colors)) {
      assert.match(v, HEX, `${slug}.colors.${slot} must be hex`);
    }
    for (const [slot, t] of Object.entries(theme.type)) {
      assert.ok(t.family && t.family.length > 2, `${slug}.type.${slot}.family`);
      assert.ok(t.size >= 8 && t.size <= 400, `${slug}.type.${slot}.size=${t.size}`);
      assert.ok(t.weight >= 100 && t.weight <= 1000, `${slug}.type.${slot}.weight`);
    }
  }
});

test('unknown slug raises a mappable error', () => {
  assert.throws(() => toTheme({ colors: {}, typography: {} }, 'nope'), /no theme map/);
});

test('latinFontsHref builds a css2 URL or null', async () => {
  const text = await fs.readFile(
    path.join(REPO, 'bold-template-pack', 'templates', 'fika', 'design.md'), 'utf8');
  const { tokens } = parseDesignFile(text, 'fika');
  const href = latinFontsHref(toTheme(tokens, 'fika'));
  assert.ok(href === null || href.startsWith('https://fonts.googleapis.com/css2?'), href);
});

test('koStacks are Pretendard-led with Latin numeral face', async () => {
  const text = await fs.readFile(
    path.join(REPO, 'bold-template-pack', 'templates', 'peer-review', 'design.md'), 'utf8');
  const { tokens } = parseDesignFile(text, 'peer-review');
  const stacks = koStacks(toTheme(tokens, 'peer-review'));
  assert.ok(stacks.display.family.includes('Pretendard'));
  assert.ok(stacks.numeral.family.includes('STIX Two Text'));
});
