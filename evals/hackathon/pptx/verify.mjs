// Hackathon PPTX verification: engine path (template-pack -> layout -> export)
// for showcase designs x {en, ko} proof content. Audits editable text,
// raster images, and font faces straight from the pptx XML.
// Usage: node verify.mjs   (run after: npm run build -w @typodeck/core)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const OUT = path.join(REPO, 'evals', 'hackathon', 'pptx');
fs.mkdirSync(OUT, { recursive: true });

const core = await import(path.join(REPO, 'packages', 'core', 'dist', 'src', 'index.js'));
const { layoutDeckWithTemplate, exportToPptxBuffer, validatePptxBytes, parseSelectionIndex } = core;

const index = parseSelectionIndex(JSON.parse(fs.readFileSync(
  path.join(REPO, 'bold-template-pack', 'selection-index.json'), 'utf8')));

function narrativeFromProof(lang) {
  const proof = JSON.parse(fs.readFileSync(path.join(
    REPO, 'evals', 'hackathon', 'harness-proof', `proof-content.${lang}.json`), 'utf8'));
  return {
    title: proof.deck.title,
    lang,
    slides: proof.slides.map((s, i) => {
      const blocks = [];
      if (s.kicker) blocks.push({ role: 'kicker', content: s.kicker });
      const head = s.title ?? s.statement ?? s.message;
      if (head) blocks.push({ role: 'title', content: head });
      if (s.statement && s.title) blocks.push({ role: 'body', content: s.statement });
      const bodies = [];
      if (s.lede) bodies.push(s.lede);
      if (s.recap) bodies.push(s.recap);
      if (s.orienting) bodies.push(s.orienting);
      const stats = s.stats ?? [];
      if (stats.length > 0) {
        const first = stats[0];
        blocks.push({ role: 'number', content: typeof first === 'string' ? first : first.value });
        const labels = stats.map((st) => (typeof st === 'string' ? '' : st.label)).filter(Boolean);
        if (labels.length > 0) bodies.push(labels.join(' / '));
      }
      for (const f of s.findings ?? []) {
        bodies.push(typeof f === 'string' ? f : `${f.head} — ${f.body ?? ''}`);
      }
      for (const z of [s.zones?.a, s.zones?.b].filter(Boolean)) {
        bodies.push(`${z.label}: ${(z.rows ?? []).map((r) => (typeof r === 'string' ? r : r.text)).join(' / ')}`);
      }
      if (s.caption) bodies.push(s.caption);
      if (s.table) {
        bodies.push(`${s.table.columns.join(' | ')} — ${s.table.rows.length}행`);
        const rows = s.table.rows.map((row) => row.join(' | '));
        bodies.push(rows.slice(0, 6).join(' / '));
        if (rows.length > 6) bodies.push(rows.slice(6).join(' / '));
      }
      // Engine candidates support a small body budget; merge overflow.
      for (const b of bodies.slice(0, 3)) blocks.push({ role: 'body', content: b });
      if (bodies.length > 3) {
        blocks.push({ role: 'body', content: bodies.slice(3).join(' / ') });
      }
      const caps = [];
      if (s.source) caps.push(s.source);
      if (s.fixture) caps.push(lang === 'ko' ? 'Fixture data · 가상 데이터' : 'Fixture data · illustrative');
      if (caps.length > 0) blocks.push({ role: 'caption', content: caps.join(' · ') });
      return { id: `s${i + 1}`, thesis: s.intent ?? head ?? `slide ${i + 1}`, blocks };
    }),
  };
}

async function auditPptx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  let editableChars = 0;
  const faces = new Set();
  let pics = 0, blips = 0;
  for (const [name, file] of Object.entries(zip.files)) {
    if (!name.startsWith('ppt/slides/slide')) continue;
    const xml = await file.async('string');
    for (const m of xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)) editableChars += m[1].length;
    for (const m of xml.matchAll(/<a:latin[^>]*typeface="([^"]+)"/g)) faces.add(m[1]);
    for (const m of xml.matchAll(/<a:ea[^>]*typeface="([^"]+)"/g)) faces.add(`ea:${m[1]}`);
    pics += (xml.match(/<p:pic\b/g) ?? []).length;
    blips += (xml.match(/<a:blip\b/g) ?? []).length;
  }
  return { editableChars, faces: [...faces].sort(), pics, blips };
}

const DESIGNS = ['gridline-swiss', 'peer-review', 'fika'];
const results = [];
for (const slug of DESIGNS) {
  const entry = index.find((e) => e.slug === slug);
  const md = fs.readFileSync(path.join(REPO, 'bold-template-pack', 'templates', slug, 'design.md'), 'utf8');
  for (const lang of ['en', 'ko']) {
    const narrative = narrativeFromProof(lang);
    const expected = narrative.slides.flatMap((s) => s.blocks).reduce((a, b) => a + b.content.length, 0);
    const deck = layoutDeckWithTemplate(narrative, entry, md, { seed: 7 });
    const { buffer, slideCount, textBoxCount } = await exportToPptxBuffer(deck);
    const check = await validatePptxBytes(buffer, expected);
    const audit = await auditPptx(buffer);
    fs.writeFileSync(path.join(OUT, `${slug}-${lang}.pptx`), Buffer.from(buffer));
    results.push({
      design: slug, lang, slideCount, textBoxCount, expectedChars: expected,
      validateOk: check.ok, validateErrors: check.errors,
      editableChars: audit.editableChars, rasterPics: audit.pics, rasterBlips: audit.blips,
      faces: audit.faces, bytes: buffer.byteLength,
    });
    console.log(`${slug}-${lang}: slides=${slideCount} boxes=${textBoxCount} editable=${audit.editableChars}/${expected} raster=${audit.pics}/${audit.blips} faces=${audit.faces.join(',')} ok=${check.ok}`);
  }
}
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
const bad = results.filter((r) => !r.validateOk || r.rasterPics > 0 || r.editableChars < r.expectedChars);
console.log(bad.length === 0 ? 'PPTX-VERIFY: ALL-OK' : `PPTX-VERIFY: ${bad.length} FLAG(S)`);
process.exitCode = bad.length === 0 ? 0 : 1;
