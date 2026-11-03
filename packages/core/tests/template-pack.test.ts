import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { exportToPptxBuffer } from '../src/export';
import { layoutDeck } from '../src/layout';
import { SAMPLE_NARRATIVE } from '../src/sample';
import { validatePptxBytes } from '../src/validate';
import {
  layoutDeckWithTemplate,
  parseDesignTokens,
  parseSelectionIndex,
  resolveTemplateDesign,
  systemIdForEntry,
  TemplatePackError,
  themeFromTokens,
} from '../src/template-pack';

const REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');
const INDEX_PATH = path.join(REPO_ROOT, 'bold-template-pack', 'selection-index.json');

const MINI_DESIGN = `---
name: Mini
colors:
  coal: "#101010"
  paper: "#FAFAF6"
  ember: "#FF4D00"
  ash: "#8A8578"
typography:
  mega:
    fontFamily: "'Anton', sans-serif"
    fontSize: 240px
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: 32px
---
# Mini
`;

describe('template-pack integration', () => {
  it('parses the real selection-index.json (all entries valid)', async () => {
    const raw = JSON.parse(await fs.readFile(INDEX_PATH, 'utf8'));
    const entries = parseSelectionIndex(raw);
    assert.ok(entries.length >= 20, `expected >=20 templates, got ${entries.length}`);
    const slugs = entries.map((e) => e.slug);
    assert.ok(slugs.includes('monolith'));
    assert.ok(slugs.includes('maison'));
    assert.ok(slugs.includes('new-wave-static'));
    assert.equal(new Set(slugs).size, slugs.length, 'duplicate slugs');
    for (const e of entries) {
      assert.ok(e.designPath.endsWith('design.md'));
      assert.ok(e.previewPath.endsWith('preview.md'));
    }
  });

  it('rejects malformed selection indexes', () => {
    assert.throws(() => parseSelectionIndex({}), TemplatePackError);
    assert.throws(() => parseSelectionIndex({ templates: [{ slug: 'Bad Slug!' }] }), TemplatePackError);
    assert.throws(
      () => parseSelectionIndex({
        templates: [{ slug: 'ok', scheme: 'neon', density: 'low', formality: 'low', designPath: 'd', previewPath: 'p' }],
      }),
      TemplatePackError,
    );
  });

  it('maps entries to base systems deterministically', async () => {
    const entries = parseSelectionIndex(JSON.parse(await fs.readFile(INDEX_PATH, 'utf8')));
    const bySlug = new Map(entries.map((e) => [e.slug, e]));
    assert.equal(systemIdForEntry(bySlug.get('monolith')!), 'expressive');
    assert.equal(systemIdForEntry(bySlug.get('maison')!), 'expressive');
    assert.equal(systemIdForEntry(bySlug.get('new-wave-static')!), 'swiss');
    assert.equal(systemIdForEntry(bySlug.get('gridline-swiss')!), 'swiss');
    assert.equal(systemIdForEntry(bySlug.get('chapter-verse')!), 'editorial');
    // Total coverage: every entry resolves to a renderable system.
    for (const e of entries) {
      assert.ok(['editorial', 'swiss', 'expressive', 'document'].includes(systemIdForEntry(e)), e.slug);
    }
  });

  it('parses design.md front-matter tokens', () => {
    const tokens = parseDesignTokens(MINI_DESIGN);
    assert.deepEqual(tokens.colors, { coal: '#101010', paper: '#FAFAF6', ember: '#FF4D00', ash: '#8A8578' });
    assert.deepEqual(tokens.heading, ['"Anton"', 'sans-serif']);
    assert.deepEqual(tokens.body, ['"Inter"', 'sans-serif']);
    assert.throws(() => parseDesignTokens('# no front matter'), TemplatePackError);
    assert.throws(() => parseDesignTokens('---\nname: x\n---\n'), TemplatePackError);
  });

  it('derives theme roles by colorimetry + KR-safe font stacks', () => {
    const tokens = parseDesignTokens(MINI_DESIGN);
    const dark = themeFromTokens('mini', 'dark', tokens);
    assert.equal(dark.colors!.background, '#101010');
    assert.equal(dark.colors!.backgroundAlt, '#101010');
    assert.equal(dark.colors!.ink, '#FAFAF6');
    assert.equal(dark.colors!.accent, '#FF4D00');
    const darkHeading = dark.fonts?.heading;
    assert.ok(darkHeading);
    assert.ok(darkHeading[0].includes('Anton'));
    assert.ok(darkHeading.some((f) => f.includes('Noto Sans KR')), 'KR fallback required');
    const light = themeFromTokens('mini', 'light', tokens);
    assert.equal(light.colors!.background, '#FAFAF6');
    assert.equal(light.colors!.ink, '#101010');
  });

  it('accent/muted fall back to ink below the 3:1 legibility floor', () => {
    const lowContrast = themeFromTokens('flat', 'dark', {
      colors: { bg: '#000000', fg: '#FFFFFF', nearblack: '#0E0E0E', dimcyan: '#00C2FF' },
      heading: ['"Archivo"'],
      body: ['"Archivo"'],
    });
    // Near-black #0E0E0E (1.09:1 on black) is skipped for both roles.
    assert.equal(lowContrast.colors!.accent, '#00C2FF');
    assert.equal(lowContrast.colors!.muted, '#00C2FF');
    const washed = themeFromTokens('washed', 'light', {
      colors: { bg: '#FFFFFF', fg: '#111111', pale: '#F2F2F2', faint: '#FAFAFA' },
      heading: ['"Inter"'],
      body: ['"Inter"'],
    });
    assert.equal(washed.colors!.accent, '#111111');
    assert.equal(washed.colors!.muted, '#111111');
  });

  it('font stacks order named faces, KR fallbacks, then generics (dedupe quote-insensitive)', () => {
    const t = themeFromTokens('stack', 'light', {
      colors: { bg: '#FFFFFF', fg: '#111111', red: '#E30613' },
      heading: ['"Newsreader"', 'Georgia', 'serif'],
      body: ['"Inter"', 'sans-serif'],
    });
    const h = t.fonts?.heading ?? [];
    assert.deepEqual(h, ['"Newsreader"', 'Georgia', '"Noto Serif KR"', 'serif']);
    const b = t.fonts?.body ?? [];
    assert.deepEqual(b, ['"Inter"', '"Noto Sans KR"', 'system-ui', 'sans-serif']);
  });

  it('every real template resolves to a valid theme (hex colors, non-empty fonts)', async () => {
    const entries = parseSelectionIndex(JSON.parse(await fs.readFile(INDEX_PATH, 'utf8')));
    for (const e of entries) {
      const md = await fs.readFile(path.join(REPO_ROOT, e.designPath), 'utf8');
      const { systemId, theme } = resolveTemplateDesign(e, md);
      assert.ok(systemId, e.slug);
      for (const [role, hex] of Object.entries(theme.colors!)) {
        assert.match(hex, /^#[0-9A-F]{6}$/, `${e.slug} ${role}`);
      }
      assert.ok((theme.fonts?.heading?.length ?? 0) >= 2, `${e.slug} heading stack`);
      assert.ok((theme.fonts?.body?.length ?? 0) >= 2, `${e.slug} body stack`);
    }
  });

  it('layoutDeck theme option stamps template identity via existing primitives', async () => {
    const entries = parseSelectionIndex(JSON.parse(await fs.readFile(INDEX_PATH, 'utf8')));
    const mono = entries.find((e) => e.slug === 'monolith')!;
    const md = await fs.readFile(path.join(REPO_ROOT, mono.designPath), 'utf8');
    const deck = layoutDeckWithTemplate(SAMPLE_NARRATIVE, mono, md, { seed: 7 });
    // Base system placement preserved; only fonts/colors come from the template.
    assert.equal(deck.meta.system, 'expressive');
    // Colorimetry picks the darkest swatch (slab-black); design ground is
    // #0E0E0E — visually identical (ΔL* ≈ 0.5), noted in pptx-export-tests.md.
    assert.equal(deck.slides[0].background, '#000000');
    const title = deck.slides[0].blocks.find((b) => b.role === 'title')!;
    assert.equal(title.color, '#F5F0E6');
    assert.equal(title.fontFace, 'Anton');
    const kicker = deck.slides[0].blocks.find((b) => b.role === 'kicker')!;
    assert.equal(kicker.color, '#FF4D00');
    // Baseline without theme is unchanged (no fontFace stamped).
    const plain = layoutDeck(SAMPLE_NARRATIVE, 'expressive', { seed: 7 });
    assert.equal(plain.slides[0].blocks[0].fontFace, undefined);
  });

  it('themed deck exports via the real exporter with 100% editable text', async () => {
    const entries = parseSelectionIndex(JSON.parse(await fs.readFile(INDEX_PATH, 'utf8')));
    const mono = entries.find((e) => e.slug === 'monolith')!;
    const md = await fs.readFile(path.join(REPO_ROOT, mono.designPath), 'utf8');
    const deck = layoutDeckWithTemplate(SAMPLE_NARRATIVE, mono, md, { seed: 7 });
    const expectedChars = SAMPLE_NARRATIVE.slides
      .flatMap((s) => s.blocks)
      .reduce((a, b) => a + b.content.length, 0);
    const { buffer, slideCount, textBoxCount } = await exportToPptxBuffer(deck);
    assert.equal(slideCount, 7);
    assert.ok(textBoxCount > 0);
    const check = await validatePptxBytes(buffer, expectedChars);
    assert.deepEqual(check.errors, check.errors);
    assert.equal(check.ok, true);
    assert.ok(check.stats.editableChars >= expectedChars);
  });
});
