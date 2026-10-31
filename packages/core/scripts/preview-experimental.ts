// Typodeck experimental previews: ONE fixed narrative rendered identically in
// every registry system (production + experimental) to PPTX + HTML.
// Run: `npm run previews:experimental` from the repo root.
// Output: previews/pptx/typodeck-<system>.pptx, previews/html/<system>.html,
// previews/html/index.html, previews/manifest.json
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { escapeHtml } from '../src/slide-ir';
import { exportToPptx } from '../src/export';
import { layoutDeck } from '../src/layout';
import { planCompositions } from '../src/composition';
import { resolveVisualSystem, listVisualSystems } from '../src/visual-systems';
import { validatePptx } from '../src/validate';
import type { Deck, Narrative } from '../src/schema';
import type { SystemId } from '../src/systems';

/** Fixed comparison narrative: identical bytes feed every system. */
export const EXPERIMENTAL_NARRATIVE: Narrative = {
  title: 'Typodeck Experimental — Comparable Preview',
  lang: 'en',
  slides: [
    {
      id: 'x0-cover',
      thesis: 'One narrative, every system.',
      blocks: [
        { role: 'kicker', content: 'FIELD MANUAL · 001' },
        { role: 'title', content: 'Type carries the whole deck' },
        {
          role: 'body',
          content:
            'A six-slide comparison narrative rendered identically in every system, production and experimental.',
        },
      ],
    },
    {
      id: 'x1-problem',
      thesis: 'Decoration buries the message.',
      blocks: [
        { role: 'kicker', content: '01 · PROBLEM' },
        { role: 'title', content: 'Decoration buries the message' },
        {
          role: 'body',
          content:
            'Shapes, stock photos, and icons pile up until the thesis disappears. Every decorative object is a tax the reader pays before reaching the point.',
        },
      ],
    },
    {
      id: 'x2-number',
      thesis: 'Editable text share.',
      blocks: [
        { role: 'kicker', content: '02 · MEASURE' },
        { role: 'number', content: '98%' },
        { role: 'title', content: 'Of characters stay editable' },
        { role: 'caption', content: 'Source: preview fixture (illustrative)' },
      ],
    },
    {
      id: 'x3-differentiation',
      thesis: 'Before vs after, in pure text.',
      blocks: [
        { role: 'kicker', content: '03 · COMPARE' },
        { role: 'title', content: 'Before vs After the cleanup' },
        {
          role: 'body',
          content:
            'Before: fourteen shapes, six icons, three stock photos. The thesis hides on line nine.',
        },
        {
          role: 'body',
          content:
            'After: three text blocks. Kicker, headline, one short paragraph. Nothing else on the slide.',
        },
      ],
    },
    {
      id: 'x4-results',
      thesis: 'Readers find the thesis faster.',
      blocks: [
        { role: 'kicker', content: '04 · EVIDENCE' },
        { role: 'title', content: 'Readers find the thesis faster' },
        {
          role: 'body',
          content:
            'In the preview fixture, the single-claim slide keeps one body and one adjacent source line.',
        },
        { role: 'caption', content: 'Ref: preview-fixture/evidence:1 (illustrative)' },
      ],
    },
    {
      id: 'x5-closing',
      thesis: 'Closing statement.',
      blocks: [
        { role: 'kicker', content: 'FIELD MANUAL · 001' },
        { role: 'title', content: 'Whitespace is structure' },
        { role: 'caption', content: 'Set in Inter with Noto Sans KR fallback · 16:9' },
      ],
    },
  ],
};

const CANVAS_W_IN = 13.33;
const CANVAS_H_IN = 7.5;
const SEED = 7;

function slideHtml(
  deck: Deck,
  slideIndex: number,
  fonts: { heading: string; body: string },
  candidateId: string,
): string {
  const s = deck.slides[slideIndex];
  const blocks = s.blocks
    .map((b) => {
      const family = b.role === 'body' || b.role === 'caption' ? fonts.body : fonts.heading;
      return `<div class="block" style="left:${((b.x / CANVAS_W_IN) * 100).toFixed(3)}%;top:${((b.y / CANVAS_H_IN) * 100).toFixed(3)}%;width:${((b.w / CANVAS_W_IN) * 100).toFixed(3)}%;height:${((b.h / CANVAS_H_IN) * 100).toFixed(3)}%;font-size:${(((b.fontSize / 72) / CANVAS_W_IN) * 100).toFixed(3)}cqw;font-weight:${b.fontWeight};line-height:${b.lineHeight};letter-spacing:${b.tracking}em;text-align:${b.align};color:${escapeHtml(b.color)};font-family:${escapeHtml(family)}">${escapeHtml(b.content)}</div>`;
    })
    .join('\n');
  return `<section class="slide-wrap"><div class="meta">${escapeHtml(s.id)} · ${escapeHtml(candidateId)}</div><div class="stage" style="background:${escapeHtml(s.background)}" role="img" aria-label="${escapeHtml(s.thesis)}">\n${blocks}\n</div></section>`;
}

function deckHtml(deck: Deck, system: string, fonts: { heading: string; body: string }, candidates: string[]): string {
  const stages = deck.slides.map((_, i) => slideHtml(deck, i, fonts, candidates[i] ?? '?')).join('\n');
  return `<!DOCTYPE html>
<html lang="${escapeHtml(deck.meta.lang)}">
<head><meta charset="utf-8"><title>${escapeHtml(deck.meta.title)} · ${escapeHtml(system)}</title>
<style>html,body{margin:0;padding:24px;background:#888;font-family:system-ui,sans-serif}h1{color:#fff;font-size:20px}.slide-wrap{margin:0 0 32px 0}.meta{color:#eee;font-size:12px;margin:0 0 6px 2px}.stage{position:relative;width:100%;aspect-ratio:16/9;container-type:inline-size}.block{position:absolute;overflow:hidden;white-space:pre-wrap}</style>
</head><body><h1>${escapeHtml(deck.meta.title)} · ${escapeHtml(system)}</h1>
${stages}
</body></html>
`;
}

async function main(): Promise<void> {
  const root = path.resolve(__dirname, '..', '..', '..', '..');
  const pptxDir = path.join(root, 'previews', 'pptx');
  const htmlDir = path.join(root, 'previews', 'html');
  await fs.mkdir(pptxDir, { recursive: true });
  await fs.mkdir(htmlDir, { recursive: true });

  const narrativeBytes = JSON.stringify(EXPERIMENTAL_NARRATIVE);
  const narrativeSha = createHash('sha256').update(narrativeBytes).digest('hex');
  const expectedChars = EXPERIMENTAL_NARRATIVE.slides
    .flatMap((s) => s.blocks)
    .reduce((a, b) => a + b.content.length, 0);

  const systems = listVisualSystems()
    .map((e) => e.id as SystemId)
    .filter((id) => {
      try {
        resolveVisualSystem(id);
        return true;
      } catch {
        console.log(`skip unrenderable system ${id}`);
        return false;
      }
    });

  const manifest: Record<string, unknown> = {
    narrativeTitle: EXPERIMENTAL_NARRATIVE.title,
    narrativeSha256: narrativeSha,
    seed: SEED,
    slideCount: EXPERIMENTAL_NARRATIVE.slides.length,
    systems: [] as unknown[],
  };

  for (const system of systems) {
    const { typography, entry } = resolveVisualSystem(system);
    const fonts = { heading: typography.fonts.heading.join(', '), body: typography.fonts.body.join(', ') };
    const plan = planCompositions(EXPERIMENTAL_NARRATIVE, system);
    const deck = layoutDeck(EXPERIMENTAL_NARRATIVE, system, { seed: SEED, compositionPlan: plan });
    const candidates = plan.map((p) => p.candidateId);

    const pptxPath = path.join(pptxDir, `typodeck-${system}.pptx`);
    const res = await exportToPptx(deck, pptxPath);
    const check = await validatePptx(pptxPath, expectedChars);
    const stat = await fs.stat(pptxPath);

    const htmlDoc = deckHtml(deck, system, fonts, candidates);
    const htmlPath = path.join(htmlDir, `${system}.html`);
    await fs.writeFile(htmlPath, htmlDoc);

    // Text parity: every narrative string must appear in the HTML preview.
    const missing = EXPERIMENTAL_NARRATIVE.slides
      .flatMap((s) => s.blocks.map((b) => b.content))
      .filter((t) => !htmlDoc.includes(escapeHtml(t)));

    console.log(
      `${system}@${entry.version} (${entry.status}): ${res.slideCount} slides, ` +
        `${res.textBoxCount} boxes, ${stat.size} bytes, ` +
        `validation ${check.ok ? 'OK' : 'FAILED'}, html parity ${missing.length === 0 ? 'OK' : 'FAILED'}`,
    );
    for (const e of check.errors) console.error(`  - ${e}`);
    for (const t of missing) console.error(`  - missing from html: ${t.slice(0, 60)}`);

    (manifest.systems as unknown[]).push({
      system,
      version: entry.version,
      status: entry.status,
      pptx: `previews/pptx/typodeck-${system}.pptx`,
      html: `previews/html/${system}.html`,
      slides: res.slideCount,
      textBoxes: res.textBoxCount,
      bytes: stat.size,
      editableChars: check.stats.editableChars,
      validationOk: check.ok,
      validationErrors: check.errors,
      htmlParityOk: missing.length === 0,
      candidates,
    });
    if (!check.ok || missing.length > 0) process.exitCode = 1;
  }

  const index = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Typodeck experimental previews</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px}li{margin:8px 0}</style>
</head><body><h1>Typodeck experimental previews</h1>
<p>Identical narrative (<code>${narrativeSha.slice(0, 12)}…</code>, seed ${SEED}) across ${systems.length} systems. No finals selected.</p>
<ul>
${systems.map((s) => `<li><a href="${s}.html">${s}</a> · <a href="../pptx/typodeck-${s}.pptx">pptx</a></li>`).join('\n')}
</ul></body></html>
`;
  await fs.writeFile(path.join(htmlDir, 'index.html'), index);
  await fs.writeFile(path.join(root, 'previews', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`manifest: previews/manifest.json (narrative sha256 ${narrativeSha.slice(0, 12)}…)`);
}

void main();
