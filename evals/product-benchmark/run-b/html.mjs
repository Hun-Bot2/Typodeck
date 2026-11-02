// Arm B step 3 — HTML preview from the SAME baseline deck the CLI laid out
// (planDeck with identical inputs; the deck object is reused, never re-laid
// out), plus advisory critique + supplementary composition plan for O4.
// Run inside the throwaway: TD_CORE_DIST=/tmp/td-g/packages/core/dist
//   node run-b/html.mjs <ideaTxt> <fxId> <outDir>
// Writes: <fx>-b-<sys>.html + <fx>-b-<sys>.sidecar.json per production system.
import { createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

const DIST = process.env.TD_CORE_DIST;
if (!DIST) { console.error('TD_CORE_DIST is required'); process.exit(2); }
const need = createRequire(import.meta.url);
const {
  planDeck, planCompositions, critiqueDeck, reviseDeck,
  resolveVisualSystem,
} = need(path.join(DIST, 'src', 'index.js'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const CANVAS_W_IN = 13.33;
const CANVAS_H_IN = 7.5;

function slideHtml(deck, i, fonts, fxId, sys) {
  const s = deck.slides[i];
  const blocks = s.blocks.map((b) => {
    const family = b.role === 'body' || b.role === 'caption' ? fonts.body : fonts.heading;
    // Quote note: family chains contain double quotes; inside a style="..."
    // attribute they must become single quotes, else the declaration breaks
    // and the browser falls back to its default serif (found via screenshot).
    const cssFamily = esc(family).replace(/"/g, "'");
    return `<div class="slide-block" data-block-id="${esc(b.id)}" data-slide-id="${esc(s.id)}" data-role="${esc(b.role)}" data-pt="${b.fontSize}" style="left:${((b.x / CANVAS_W_IN) * 100).toFixed(3)}%;top:${((b.y / CANVAS_H_IN) * 100).toFixed(3)}%;width:${((b.w / CANVAS_W_IN) * 100).toFixed(3)}%;height:${((b.h / CANVAS_H_IN) * 100).toFixed(3)}%;font-size:${(((b.fontSize / 72) / CANVAS_W_IN) * 100).toFixed(3)}cqw;font-weight:${b.fontWeight};line-height:${b.lineHeight};letter-spacing:${b.tracking}em;text-align:${b.align};color:${esc(b.color)};font-family:${cssFamily};">${esc(b.content)}</div>`;
  }).join('\n');
  return `<div class="stage" data-slide-id="${esc(s.id)}" style="background:${esc(s.background)}">\n${blocks}\n</div>`;
}

function deckHtml(deck, sys, fonts, fxId) {
  const stages = deck.slides.map((_, i) => slideHtml(deck, i, fonts, fxId, sys)).join('\n');
  return `<!DOCTYPE html>
<html lang="${esc(deck.meta.lang)}">
<head><meta charset="utf-8"><title>${esc(deck.meta.title)} · ${esc(sys)}</title>
<style>html,body{margin:0;padding:0;background:#888}.stage{position:relative;width:1280px;max-width:100%;aspect-ratio:16/9;container-type:inline-size;margin:0 auto 24px auto}.slide-block{position:absolute;overflow:hidden;white-space:pre-wrap;overflow-wrap:break-word}</style>
</head><body>
${stages}
</body></html>
`;
}

async function main() {
  const [ideaTxt, fxId, outDir] = process.argv.slice(2);
  if (!ideaTxt || !fxId || !outDir) { console.error('usage: html.mjs <ideaTxt> <fxId> <outDir>'); process.exit(2); }
  const text = await fs.readFile(ideaTxt, 'utf8');
  await fs.mkdir(outDir, { recursive: true });

  for (const sys of ['swiss', 'editorial', 'expressive']) {
    const t0 = Date.now();
    const result = await planDeck({ type: 'idea', text }, { system: sys, lang: 'en' });
    const { typography } = resolveVisualSystem(sys);
    const fonts = { heading: typography.fonts.heading.join(', '), body: typography.fonts.body.join(', ') };
    const html = deckHtml(result.deck, sys, fonts, fxId);
    const htmlPath = path.join(outDir, `${fxId}-b-${sys}.html`);
    await fs.writeFile(htmlPath, html);

    // Advisory critique on the shipped baseline deck (Skill: gate is advisory).
    const critique = critiqueDeck(result.deck, result.narrative);
    const errors = critique.findings.filter((f) => f.severity === 'error');
    // Supplementary: what the improved pipeline would select (O4 input).
    const plan = planCompositions(result.narrative, sys);
    let revised = null;
    if (errors.length > 0) {
      const r = reviseDeck(result.narrative, sys, { maxAttempts: 3, seed: 42 });
      revised = { attempts: r.attempts, provenance: r.provenance };
    }
    // Diversity features (same formulas as scripts/eval.ts diversityFeatures).
    const dBlocks = result.deck.slides.map((s) => s.blocks.length);
    const dHead = result.deck.slides.flatMap((s) => s.blocks.filter((b) => b.role === 'title').map((b) => b.fontSize)).sort((a, b) => a - b);
    const dMid = dHead.length % 2 === 1 ? dHead[(dHead.length - 1) / 2] : (dHead[dHead.length / 2 - 1] + dHead[dHead.length / 2]) / 2;
    let dL = 0, dC = 0, dR = 0;
    for (const s of result.deck.slides) for (const b of s.blocks) { if (b.align === 'left') dL++; else if (b.align === 'center') dC++; else dR++; }
    const dTot = Math.max(1, dL + dC + dR);
    const sidecar = {
      fx: fxId, arm: 'B', system: sys,
      slides: result.deck.slides.length,
      textBoxes: result.deck.slides.reduce((a, s) => a + s.blocks.length, 0),
      diversityFeatures: {
        meanBlocksPerSlide: dBlocks.reduce((a, b) => a + b, 0) / Math.max(1, dBlocks.length),
        medianHeadlineSize: dHead.length ? dMid : 0,
        alignmentMix: { left: dL / dTot, center: dC / dTot, right: dR / dTot },
      },
      provider: result.provenance.provider,
      claims: result.provenance.claims,
      quality: result.provenance.quality,
      warnings: result.provenance.warnings,
      critiqueFindings: critique.findings,
      revisions: revised ? revised.attempts : 0,
      revisionProvenance: revised ? revised.provenance : [],
      candidateIds: plan.map((p) => p.candidateId),
      latencyMs: Date.now() - t0,
    };
    await fs.writeFile(path.join(outDir, `${fxId}-b-${sys}.sidecar.json`), `${JSON.stringify(sidecar, null, 2)}\n`);
    console.log(`arm-b html: ${fxId}/${sys} slides=${sidecar.slides} boxes=${sidecar.textBoxes} critique=${errors.length}E/${critique.findings.length - errors.length}W revisions=${sidecar.revisions}`);
  }
}

main().catch((e) => { console.error(`FAIL html: ${e.message}`); process.exit(1); });
