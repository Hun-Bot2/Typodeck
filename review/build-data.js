#!/usr/bin/env node
// Build review/data.js: PPT review manifest (115 files) + real metadata.
// Slide counts come from unzipping each .pptx (no guessing).
// Usage: node review/build-data.js
const fs = require('fs');
const path = require('path');
const JSZip = require('../node_modules/jszip');

const ROOT = path.resolve(__dirname, '..');
const out = { generatedAt: new Date().toISOString(), groups: [], files: [], warnings: [] };

const GROUPS = [
  { id: 'previews', label: '핵심 비교 (4)', desc: '같은 6장 내러티브 × 4개 시스템', dir: 'previews/pptx' },
  { id: 'showcase', label: '대표작 (3)', desc: '실제 깃헙 리포로 생성 + provenance', dir: 'review/assets', only: ['is-swiss.pptx', 'dayjs-editorial.pptx', 'handbook-expressive.pptx'] },
  { id: 'verify', label: 'Studio/API 검증 (2)', desc: 'Studio·API 경로 산출물', dir: 'review/assets', only: ['api-repo-swiss.pptx', 'studio-export.pptx'] },
  { id: 'samples', label: '샘플 (4)', desc: 'npm run samples 산출물', dir: 'output', topOnly: true },
  { id: 'evals', label: 'Phase-4 평가 (24)', desc: 'F1~F4 × 한영 × 3시스템', dir: 'evals/reports' },
  { id: 'visual', label: '비주얼 벤치마크 (30)', desc: '10 픽스처 × 3시스템 (한영 쌍)', dir: 'evals/visual-benchmark/output' },
  { id: 'bench90', label: 'Benchmark-90 (48)', desc: 'baseline/improved A/B 블라인드 평가 전', dir: 'output/benchmark-90' },
];

function pairedHtml(pptRel) {
  const cands = [
    pptRel.replace(/\.pptx$/, '.html'),
    pptRel.replace('/pptx/', '/html/'),
    pptRel.replace('previews/pptx/typodeck-', 'previews/html/').replace(/\.pptx$/, '.html'),
  ];
  for (const c of cands) {
    if (c !== pptRel && fs.existsSync(path.join(ROOT, c))) return c;
  }
  return null;
}

async function slidesOf(abs) {
  const zip = await JSZip.loadAsync(fs.readFileSync(abs));
  let n = 0;
  zip.forEach((p) => { if (/^ppt\/slides\/slide\d+\.xml$/.test(p)) n++; });
  return n;
}

(async () => {
  for (const g of GROUPS) {
    const dir = path.join(ROOT, g.dir);
    if (!fs.existsSync(dir)) { out.warnings.push(g.dir + ': MISSING directory'); continue; }
    let names = fs.readdirSync(dir).filter((f) => f.endsWith('.pptx')).sort();
    if (g.only) names = names.filter((f) => g.only.includes(f));
    const items = [];
    for (const name of names) {
      const rel = g.dir + '/' + name;
      const abs = path.join(dir, name);
      const bytes = fs.statSync(abs).size;
      let slides = null;
      try { slides = await slidesOf(abs); }
      catch (e) { out.warnings.push(rel + ': cannot unzip (' + e.message + ')'); }
      items.push({ id: g.id + '/' + name.replace(/\.pptx$/, ''), group: g.id, name, path: rel, bytes, slides, html: pairedHtml(rel) });
    }
    out.groups.push({ id: g.id, label: g.label, desc: g.desc, count: items.length });
    out.files.push(...items);
  }
  const js = 'window.PPT_REVIEW_DATA = ' + JSON.stringify(out) + ';\n';
  fs.writeFileSync(path.join(__dirname, 'data.js'), js);
  console.log('wrote review/data.js: ' + out.files.length + ' files, ' + out.warnings.length + ' warnings');
  for (const w of out.warnings) console.log('WARN: ' + w);
})().catch((e) => { console.error('FATAL: ' + e.message); process.exit(1); });
