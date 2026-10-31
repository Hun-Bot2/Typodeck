// Typodeck demo-evidence preview builder (showcase-only).
// Renders each deck JSON to a static HTML filmstrip using the EXACT geometry
// mapping of apps/web/components/SlideView.tsx and the .slide/.slide-block
// rules from apps/web/app/globals.css. Arrangement is a grid (instead of the
// studio's horizontal strip) so a single screenshot captures every slide.
// Also runs a pairwise block-overlap audit on the deck geometry.
// Usage: node showcase/make-previews.js
'use strict';
const { promises: fs } = require('node:fs');
const path = require('node:path');

const SERIF = '"Noto Serif KR", "Source Serif 4", Georgia, serif';
const SANS = 'Pretendard, Inter, "Noto Sans KR", system-ui, sans-serif';
const DISPLAY = '"Archivo Black", Pretendard, Inter, "Noto Sans KR", system-ui, sans-serif';
const CANVAS_W_IN = 13.33;
const CANVAS_H_IN = 7.5;

function fontFor(system, role) {
  if (system === 'editorial') return role === 'body' || role === 'caption' ? SANS : SERIF;
  if (system === 'expressive') return role === 'body' || role === 'caption' ? SANS : DISPLAY;
  return SANS;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slideHtml(slide, system, label) {
  const blocks = slide.blocks.map((b) => {
    const style = [
      `left:${(b.x / CANVAS_W_IN) * 100}%`,
      `top:${(b.y / CANVAS_H_IN) * 100}%`,
      `width:${(b.w / CANVAS_W_IN) * 100}%`,
      `height:${(b.h / CANVAS_H_IN) * 100}%`,
      `font-size:${((b.fontSize / 72) / CANVAS_W_IN) * 100}cqw`,
      `font-weight:${b.fontWeight}`,
      `line-height:${b.lineHeight}`,
      `letter-spacing:${b.tracking}em`,
      `text-align:${b.align}`,
      `color:${b.color}`,
      `font-family:${fontFor(system, b.role)}`,
    ].join(';');
    return `<div class="slide-block" style="${esc(style)}">${esc(b.content)}</div>`;
  }).join('\n');
  return `<div class="slide" style="background-color:${esc(slide.background)}" role="img" aria-label="${esc(label)}">\n${blocks}\n</div>`;
}

const PAGE_CSS = `.slide{position:relative;aspect-ratio:1333/750;width:100%;overflow:hidden;container-type:inline-size;}
.slide-block{position:absolute;overflow:hidden;white-space:pre-wrap;overflow-wrap:break-word;}
body{margin:0;background:#e8e6e1;color:#111;font-family:system-ui,sans-serif;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px;max-width:1400px;margin:0 auto;}
figure.thumb{margin:0;border:1px solid #111;background:#f4f2ec;}
figure.thumb figcaption{font-family:ui-monospace,monospace;font-size:12px;color:#555;padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
header{padding:20px 24px 0;max-width:1400px;margin:0 auto;}
header h1{font-size:20px;margin:0 0 4px;}
header p{font-size:13px;color:#444;margin:0;}
.full{max-width:1280px;margin:0 auto;padding:0;}
.full .slide{border:none;}`;

async function build(name) {
  const dir = path.join(__dirname);
  const deck = JSON.parse(await fs.readFile(path.join(dir, 'decks', `${name}.json`), 'utf8'));
  const system = deck.meta.system;
  const figs = deck.slides.map((s, i) =>
    `<figure class="thumb"><figcaption>${i + 1}. ${esc(s.thesis)}</figcaption>\n${slideHtml(s, system, `${system} slide ${i + 1}: ${s.thesis}`)}</figure>`,
  ).join('\n');
  const film = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(name)} filmstrip</title><style>${PAGE_CSS}</style></head><body><header><h1>${esc(name)} — ${esc(system)} — ${deck.slides.length} slides</h1><p>Static render of the actual deck JSON with the studio SlideView mapping. Fonts fall back to system faces where the design faces are absent.</p></header><div class="grid">\n${figs}\n</div></body></html>`;
  await fs.writeFile(path.join(dir, 'previews', `${name}.filmstrip.html`), film);
  const s1 = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(name)} slide 1</title><style>${PAGE_CSS}</style></head><body><div class="full">${slideHtml(deck.slides[0], system, `${system} slide 1: ${deck.slides[0].thesis}`)}</div></body></html>`;
  await fs.writeFile(path.join(dir, 'previews', `${name}.slide1.html`), s1);

  // Geometry audit: out-of-bounds + pairwise overlaps (same inches as PPTX).
  const findings = [];
  deck.slides.forEach((s, si) => {
    for (const b of s.blocks) {
      const tol = 0.02;
      if (b.x < -tol || b.y < -tol || b.x + b.w > CANVAS_W_IN + tol || b.y + b.h > CANVAS_H_IN + tol) {
        findings.push(`slide ${si + 1} block ${b.id}: out of bounds [${b.x},${b.y},${b.w},${b.h}]`);
      }
    }
    for (let a = 0; a < s.blocks.length; a++) {
      for (let b = a + 1; b < s.blocks.length; b++) {
        const A = s.blocks[a]; const B = s.blocks[b];
        const ix = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
        const iy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
        if (ix > 0.01 && iy > 0.01) {
          findings.push(`slide ${si + 1}: overlap ${A.id}(${A.role}) x ${B.id}(${B.role}) ix=${ix.toFixed(2)}in iy=${iy.toFixed(2)}in`);
        }
      }
    }
  });
  console.log(`--- ${name} (${system}) ---`);
  console.log(`slides=${deck.slides.length} seed=${deck.meta.seed} title=${JSON.stringify(deck.meta.title)}`);
  if (findings.length === 0) console.log('geometry: no overlaps, no out-of-bounds blocks');
  else findings.forEach((f) => console.log(`geometry: ${f}`));
}

(async () => {
  for (const n of ['is-swiss', 'dayjs-editorial', 'handbook-expressive']) await build(n);
})();
