import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitFrontMatter, parseFrontMatter, resolveRefs, parseDesignFile, parseCjkSection, px } from '../lib/spec.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DESIGN = path.resolve(HERE, '..', '..', '..', 'typo-pack', 'templates', 'gridline-swiss', 'design.md');

test('splitFrontMatter rejects files without front-matter', () => {
  assert.throws(() => splitFrontMatter('# no front matter\n'), /front-matter/);
});

test('parseFrontMatter parses nested token maps', () => {
  const data = parseFrontMatter('colors:\n  ink: "#111111"\n  n: 800\n  f: 1.05\n');
  assert.equal(data.colors.ink, '#111111');
  assert.equal(data.colors.n, 800);
  assert.equal(data.colors.f, 1.05);
});

test('parseFrontMatter rejects tabs and odd indent', () => {
  assert.throws(() => parseFrontMatter('a:\n\tb: 1\n'), /indentation/);
  assert.throws(() => parseFrontMatter('a:\n   b: 1\n'), /indentation/);
});

test('resolveRefs expands {path} references', () => {
  const data = resolveRefs({ colors: { ink: '#111' }, c: { fg: '{colors.ink}' } });
  assert.equal(data.c.fg, '#111');
});

test('resolveRefs leaves unknown refs intact', () => {
  const data = resolveRefs({ c: { fg: '{nope.x}' } });
  assert.equal(data.c.fg, '{nope.x}');
});

test('parseDesignFile accepts the real gridline-swiss design.md', async () => {
  const text = await fs.readFile(DESIGN, 'utf8');
  const { tokens, cjk } = parseDesignFile(text, 'gridline-swiss');
  assert.equal(tokens.colors['signal-red'], '#E30613');
  assert.equal(tokens.typography['display-xl'].fontSize, '118px');
  assert.equal(tokens.canvas.width, '1920px');
  assert.equal(tokens.components['red-rule'].background, '#E30613'); // ref resolved
  assert.ok(cjk, 'expected a CJK section');
  assert.ok(cjk.fontHref?.includes('Noto+Sans+KR'));
  assert.equal(cjk.rules.noTracking, true);
  assert.equal(cjk.rules.noUppercase, true);
});

test('parseDesignFile rejects incomplete token sets', () => {
  const text = '---\ncolors:\n  ink: "#111111"\n---\nbody\n';
  assert.throws(() => parseDesignFile(text, 't'), /missing required tokens/);
});

test('parseCjkSection returns null without a CJK section', () => {
  assert.equal(parseCjkSection('## Overview\nno cjk here\n'), null);
});

test('px parses pixel values only', () => {
  assert.equal(px('72px'), 72);
  assert.equal(px(8), 8);
  assert.throws(() => px('2em'), /px value/);
});
