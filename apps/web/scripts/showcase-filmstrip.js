// Typodeck showcase preview builder: renders the experimental deck JSON to
// a SlideView-faithful filmstrip HTML (exact geometry mapping of
// apps/web/components/SlideView.tsx). Rasterize with headless Chrome:
//   CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
//   node apps/web/scripts/showcase-filmstrip.js   # writes /tmp/*.filmstrip.html
//   "$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
//     --screenshot=apps/web/public/showcase/harborlight-document.filmstrip.png \
//     --window-size=1440,1400 "file:///tmp/harborlight-document.filmstrip.html"
// Usage (from the repo root): node apps/web/scripts/showcase-filmstrip.js
'use strict';
const { promises: fs } = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..', '..');
const OUT = path.join(ROOT, 'apps', 'web', 'public', 'showcase');
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
  const blocks = slide.blocks
    .map((b) => {
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
    })
    .join('\n');
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
header p{font-size:13px;color:#444;margin:0;}`;

async function main() {
  const name = 'harborlight-document';
  const deck = JSON.parse(await fs.readFile(path.join(OUT, `${name}.json`), 'utf8'));
  const system = deck.meta.system;
  const figs = deck.slides
    .map(
      (s, i) =>
        `<figure class="thumb"><figcaption>${i + 1}. ${esc(s.thesis)}</figcaption>\n${slideHtml(s, system, `${system} slide ${i + 1}: ${s.thesis}`)}</figure>`,
    )
    .join('\n');
  const film = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(name)} filmstrip</title><style>${PAGE_CSS}</style></head><body><header><h1>${esc(name)} — ${esc(system)} — ${deck.slides.length} slides</h1><p>Static render of the actual deck JSON with the studio SlideView mapping. Fonts fall back to system faces where the design faces are absent.</p></header><div class="grid">\n${figs}\n</div></body></html>`;
  await fs.writeFile(`/tmp/${name}.filmstrip.html`, film);
  console.log(`wrote /tmp/${name}.filmstrip.html slides=${deck.slides.length} seed=${deck.meta.seed}`);
}

main().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
