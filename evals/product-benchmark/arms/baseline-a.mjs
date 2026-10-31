// Arm A: generic-baseline deck generator (frozen replay of prompts/arm-a.md).
// Mechanical README extraction + generic styled template. No Typodeck code.
// Run: node arms/baseline-a.mjs <fixtureDir> <outHtml>
// Text blocks carry class="slide-block" + data-block-id SOLELY as a
// measurement hook (the overflow probe queries that class); the probe
// itself is injected at MEASURE time, never baked into the artifact.
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const stripMd = (s) => s.replace(/```[\s\S]*?```/g, ' ').replace(/`([^`]*)`/g, '$1')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_#>-]/g, '').replace(/\s+/g, ' ').trim();

function parseReadme(text) {
  const lines = text.split('\n');
  let title = 'Untitled';
  const sections = [];
  let cur = null;
  for (const ln of lines) {
    const h1 = ln.match(/^#\s+(.+)/);
    const h2 = ln.match(/^##\s+(.+)/);
    if (h1 && title === 'Untitled') { title = norm(h1[1]); continue; }
    if (h2) { cur = { head: norm(h2[1]), lines: [] }; sections.push(cur); continue; }
    if (cur) cur.lines.push(ln);
  }
  const h1Idx = lines.findIndex((l) => /^#\s+/.test(l));
  const h2Idx = lines.findIndex((l) => /^##\s/.test(l));
  const introSrc = norm(stripMd(lines.slice(h1Idx + 1, h2Idx > 0 ? h2Idx : h1Idx + 9).join(' ')));
  const intro = introSrc.length > 220 ? `${introSrc.slice(0, 220).replace(/\s+\S*$/, '')}…` : introSrc;
  return { title, intro, sections };
}

function bulletsFor(sec) {
  const items = sec.lines.filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => norm(stripMd(l)).slice(0, 140));
  if (items.length > 0) return items.slice(0, 4);
  const prose = norm(stripMd(sec.lines.join(' ')));
  const sents = prose.match(/[^.!?]+[.!?]/g) ?? [prose];
  return sents.slice(0, 3).map((s) => norm(s).slice(0, 160)).filter(Boolean);
}

function shBlock(text) {
  const m = text.match(/```sh\n([\s\S]*?)```/);
  return m ? norm(m[1]).split('\n')[0].slice(0, 80) : '';
}

async function main() {
  const [fxDir, outHtml] = process.argv.slice(2);
  if (!fxDir || !outHtml) { console.error('usage: baseline-a.mjs <fixtureDir> <outHtml>'); process.exit(2); }
  const fxId = path.basename(fxDir);
  const readme = await fs.readFile(path.join(fxDir, 'README.md'), 'utf8');
  const pkg = JSON.parse(await fs.readFile(path.join(fxDir, 'package.json'), 'utf8'));
  const { title, intro, sections } = parseReadme(readme);
  const install = shBlock(readme);

  const slides = [];
  slides.push({ kind: 'cover', head: title, body: [intro, `Version ${pkg.version} · ${pkg.description}`.slice(0, 140)], src: 'README.md + package.json' });
  for (const sec of sections.slice(0, 7)) {
    const hasNum = /\d/.test(sec.lines.join(' '));
    slides.push({ kind: hasNum ? 'stat' : 'bullets', head: sec.head, body: bulletsFor(sec), src: hasNum ? 'README.md' : '' });
  }
  if (install) slides.push({ kind: 'closing', head: 'Get started in a minute', body: [install, `${title} ${pkg.version} — ${pkg.engines?.node ?? ''} required`.trim()], src: 'README.md' });

  const slideHtml = slides.map((s, i) => {
    const sid = `${fxId}-a-s${i}`;
    const blocks = [
      `<div class="kicker slide-block" data-block-id="${sid}-kicker" data-slide-id="${sid}">${esc(fxId)} · ${i + 1} / ${slides.length}</div>`,
      `<h2 class="slide-title slide-block" data-block-id="${sid}-title" data-slide-id="${sid}">${esc(s.head)}</h2>`,
      ...s.body.map((b, j) => `<div class="slide-body slide-block" data-block-id="${sid}-b${j}" data-slide-id="${sid}">${esc(b)}</div>`),
    ];
    if (s.src) blocks.push(`<div class="slide-src slide-block" data-block-id="${sid}-src" data-slide-id="${sid}">Source: ${esc(s.src)}</div>`);
    return `<section class="slide" data-slide-id="${fxId}-a-s${i}" data-kind="${s.kind}" style="display:${i === 0 ? 'flex' : 'none'}">${blocks.join('\n')}</section>`;
  }).join('\n');

  const doc = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)} — pitch</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#1b2430;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;display:flex;flex-direction:column;align-items:center;min-height:100vh;color:#fff}
.stage{width:min(1280px,96vw);aspect-ratio:16/9;margin:24px 0 12px}
.slide{width:100%;height:100%;background:#f7f5f0;color:#17202b;border-radius:12px;padding:56px 72px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.kicker{font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:#8a94a6;margin-bottom:12px}
.slide-title{font-size:44px;line-height:1.15;margin:0 0 20px;color:#0f1722}
.slide-body{font-size:21px;line-height:1.5;margin:0 0 12px;color:#2b3648}
.slide[data-kind="cover"] .slide-title{font-size:72px}.slide[data-kind="cover"] .slide-body{font-size:24px}
.slide-src{font-size:14px;color:#8a94a6;margin-top:16px}
.nav{display:flex;gap:12px;margin-bottom:24px}.nav button{font-size:16px;padding:8px 20px;border-radius:8px;border:1px solid #3b4a63;background:#24314a;color:#fff;cursor:pointer}
.count{font-size:14px;color:#8a94a6;margin-bottom:24px}
</style></head><body>
<div class="stage">${slideHtml}</div>
<div class="nav"><button id="prev">← Prev</button><button id="next">Next →</button></div>
<div class="count">${slides.length} slides · ${esc(fxId)} · generic baseline (Arm A)</div>
<script>
let i=0;const S=[...document.querySelectorAll('.slide')];
function show(n){i=(n+S.length)%S.length;S.forEach((s,k)=>s.style.display=k===i?'flex':'none')}
document.getElementById('prev').onclick=()=>show(i-1);document.getElementById('next').onclick=()=>show(i+1);
addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(i+1);if(e.key==='ArrowLeft')show(i-1)});
</script></body></html>
`;
  await fs.mkdir(path.dirname(outHtml), { recursive: true });
  await fs.writeFile(outHtml, doc);
  console.log(`arm-a: ${fxId} -> ${outHtml} (${slides.length} slides)`);
}

void main();
