// O1/O2/O3/O4/O6/O7/O8/O9 per deck. Static + artifact checks (no Chrome).
// Run: node text-metrics.mjs <fxFull> <arm:a|b> <sys> <html> <fixtureDir> <numbersJson> <outJson>
//      [--pptx p] [--sidecar s] [--overflow o]   (TD_CORE_DIST needed for --pptx)
import { createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractNumbers, isStructural, normNum } from './numbers.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const need = createRequire(path.join(HERE, 'numbers.mjs'));
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const norm = (s) => s.replace(/\s+/g, ' ').trim();

function lum(hex) {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? [...h].map((c) => c + c) : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
  const f = (c) => { const x = parseInt(c, 16) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(v[0]) + 0.7152 * f(v[1]) + 0.0722 * f(v[2]);
}
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

async function pptxSlideTexts(buf) {
  const DIST = process.env.TD_CORE_DIST;
  const JSZip = need(path.join(DIST, '..', '..', '..', 'node_modules', 'jszip'));
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  const texts = [];
  let totalChars = 0;
  for (const n of names) {
    const xml = (await zip.file(n).async('string'));
    const runs = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => unesc(m[1].replace(/&apos;/g, "'")));
    totalChars += runs.join('').length;
    texts.push(norm(runs.join('')));
  }
  return { texts, totalChars };
}

async function main() {
  const a = process.argv.slice(2);
  const [fxFull, arm, sys, htmlPath, fixtureDir, numbersJson, outJson] = a;
  const flag = (f) => { const i = a.indexOf(f); return i >= 0 ? a[i + 1] : null; };
  if (!fxFull || !arm || !sys || !htmlPath || !fixtureDir || !numbersJson || !outJson) {
    console.error('usage: text-metrics.mjs <fxFull> <arm> <sys> <html> <fixtureDir> <numbersJson> <outJson> [--pptx p] [--sidecar s] [--overflow o]');
    process.exit(2);
  }
  const html = await fs.readFile(htmlPath, 'utf8');
  const oracle = new Set(JSON.parse(await fs.readFile(numbersJson, 'utf8')).fixtures[fxFull].tokens);

  // --- blocks & slides ---
  const blocks = [...html.matchAll(/<(?:div|h2) class="([^"]*slide-block[^"]*)" data-block-id="([^"]+)"([^>]*)>([\s\S]*?)<\/(?:div|h2)>/g)]
    .map((m) => {
      const attrs = m[3];
      const get = (re) => (attrs.match(re) ?? [])[1] ?? null;
      return {
        cls: m[1], id: m[2],
        slide: get(/data-slide-id="([^"]+)"/) ?? '?',
        role: get(/data-role="([^"]+)"/),
        pt: get(/data-pt="([^"]+)"/) ? +get(/data-pt="([^"]+)"/) : null,
        style: get(/style="([^"]*)"/) ?? '',
        text: norm(unesc(m[4])),
      };
    });
  if (!blocks.length) throw new Error('no slide blocks parsed');
  const roleOf = (b) => b.role ?? (b.cls.includes('slide-title') ? 'title' : b.cls.includes('slide-body') ? 'body' : b.cls.includes('kicker') ? 'kicker' : 'caption');
  const slides = [...new Set(blocks.map((b) => b.slide))];
  const slideBlocks = new Map(slides.map((s) => [s, blocks.filter((b) => b.slide === s)]));

  // --- O1/O3 claim numbers ---
  const tokens = [];
  for (const b of blocks) {
    // Strip slide counters ("1 / 9") before extraction: they are chrome,
    // and per-token exclusion cannot see the pair (protocol §6a).
    const clean = b.text.replace(/\d{1,2}\s*\/\s*\d{1,2}/g, ' ');
    for (const t of extractNumbers(clean)) {
      if (isStructural(t, b.text)) continue;
      tokens.push({ token: t, blockId: b.id, slide: b.slide, matched: oracle.has(t) || oracle.has(normNum(t)), context: b.text.slice(0, 90) });
    }
  }
  const matched = tokens.filter((t) => t.matched).length;
  const misses = tokens.filter((t) => !t.matched);

  // --- O2 traceability ---
  const LINE_RE = /[A-Za-z0-9_./-]+\.(md|js|json|txt|ya?ml)\s*:\s*\d/;
  const FILE_RE = /Source:\s*\S+|README\.md|package\.json|idea\.txt|import\.js|rules\.js/;
  const refBlocks = blocks.filter((b) => LINE_RE.test(b.text) || FILE_RE.test(b.text));
  const o2 = {
    blocksWithRefs: refBlocks.length,
    slidesWithRefs: new Set(refBlocks.map((b) => b.slide)).size,
    lineLevel: blocks.filter((b) => LINE_RE.test(b.text)).length,
    fileLevel: refBlocks.length - blocks.filter((b) => LINE_RE.test(b.text)).length,
    labeledUnverified: blocks.filter((b) => /unverified|illustrative/i.test(b.text)).length,
  };

  // --- O4 within-deck diversity ---
  let kinds = [];
  if (arm === 'a') {
    const kindBySlide = new Map([...html.matchAll(/data-slide-id="([^"]+)" data-kind="([^"]+)"/g)].map((m) => [m[1], m[2]]));
    kinds = slides.map((s) => kindBySlide.get(s) ?? '?');
  } else {
    const sc = JSON.parse(await fs.readFile(flag('--sidecar'), 'utf8'));
    kinds = sc.candidateIds;
  }
  let triple = false;
  for (let i = 2; i < kinds.length; i++) if (kinds[i] === kinds[i - 1] && kinds[i] === kinds[i - 2]) triple = true;
  const sigs = new Set(slides.map((s) => `${slideBlocks.get(s).length}:${slideBlocks.get(s).map(roleOf).sort().join(',')}`));
  const counts = new Map();
  for (const k of kinds) counts.set(k, (counts.get(k) ?? 0) + 1);
  const o4 = {
    sequence: kinds, distinct: new Set(kinds).size, maxSameShare: kinds.length ? Math.max(...counts.values()) / kinds.length : null,
    tripleRepeat: triple, slideSignaturesDistinct: sigs.size, slideSignaturesTotal: slides.length,
  };

  // --- O6 floors + contrast (merge --overflow fonts) ---
  const fonts = new Map();
  try {
    const ov = JSON.parse(await fs.readFile(flag('--overflow'), 'utf8'));
    for (const f of ov.fonts) fonts.set(f.blockId, f.fontSizePx);
  } catch { /* overflow missing -> px floors unmeasured */ }
  const pxByRole = {};
  for (const b of blocks) {
    const px = fonts.get(b.id);
    if (px === undefined) continue;
    const r = roleOf(b);
    (pxByRole[r] ??= []).push(px);
  }
  const minOf = (r) => (pxByRole[r]?.length ? +Math.min(...pxByRole[r]).toFixed(1) : null);
  // contrast: B stage bg per slide; A single bg from CSS
  const stageBg = new Map([...html.matchAll(/<div class="stage" data-slide-id="([^"]+)" style="background:([^";}]+)/g)].map((m) => [m[1], m[2]]));
  const cssBg = (html.match(/\.slide\{[^}]*background:([^;}]+)/) ?? [])[1]?.trim() ?? '#f7f5f0';
  const cssColor = (cls) => (html.match(new RegExp(`\\.${cls}\\{[^}]*color:([^;}]+)`)) ?? [])[1]?.trim();
  let fails = 0;
  const ratios = [];
  for (const b of blocks) {
    const bg = arm === 'b' ? (stageBg.get(b.slide) ?? '#ffffff') : cssBg;
    const fg = arm === 'b'
      ? ((b.style.match(/color:([^;]+)/) ?? [])[1] ?? '#000000')
      : (cssColor(b.cls.includes('slide-title') ? 'slide-title' : b.cls.includes('slide-body') ? 'slide-body' : b.cls.includes('kicker') ? 'kicker' : 'slide-src') ?? '#000000');
    if (!/^#[0-9a-fA-F]{3,6}$/.test(fg.trim()) || !/^#[0-9a-fA-F]{3,6}$/.test(bg.trim())) continue;
    const r = ratio(fg.trim(), bg.trim());
    ratios.push({ blockId: b.id, role: roleOf(b), ratio: +r.toFixed(2) });
    if (r < 4.5) fails++;
  }
  const o6 = { minTitlePx: minOf('title'), minBodyPx: minOf('body'), minNumberPx: minOf('number'), minCaptionPx: minOf('caption') ?? minOf('kicker'), contrastFails45: fails, contrastRows: ratios };

  // --- O7/O8 PPTX (B only) ---
  let o7 = { na: arm === 'a' ? 'single-artifact arm (no PPTX by design)' : null };
  let o8;
  if (arm === 'b') {
    const buf = await fs.readFile(flag('--pptx'));
    const { texts: pptxTexts, totalChars } = await pptxSlideTexts(buf);
    const htmlTexts = slides.map((s) => norm(slideBlocks.get(s).map((b) => b.text).join('')));
    const mism = [];
    if (pptxTexts.length !== htmlTexts.length) mism.push(`slide-count ${pptxTexts.length} vs ${htmlTexts.length}`);
    else pptxTexts.forEach((t, i) => { if (t !== htmlTexts[i]) mism.push(`slide ${i}: pptx[${t.slice(0, 60)}] vs html[${htmlTexts[i].slice(0, 60)}]`); });
    o7 = { slideCountMatch: pptxTexts.length === htmlTexts.length, mismatches: mism.length, detail: mism.slice(0, 5) };
    const { validatePptxBytes } = need(path.join(process.env.TD_CORE_DIST, 'src', 'validate.js'));
    const v = await validatePptxBytes(buf);
    o8 = { editableChars: v.stats.editableChars, totalChars, ratio: totalChars ? +(v.stats.editableChars / totalChars).toFixed(4) : null, forbiddenOk: v.ok };
  } else {
    const empty = slides.filter((s) => slideBlocks.get(s).every((b) => !b.text));
    o8 = { ratio: 1.0, note: 'DOM text extraction (by construction)', emptySlides: empty.length };
  }

  const o9 = { slides: slides.length, inRange: slides.length >= 5 && slides.length <= 12, blocks: blocks.length };

  const out = {
    deck: path.basename(htmlPath), fx: fxFull, arm, sys,
    o1: { numbers: tokens.length, matched, accuracy: tokens.length ? +(matched / tokens.length).toFixed(4) : null },
    o2, o3misses: misses,
    o4, o6, o7, o8, o9,
    blockCount: blocks.length,
  };
  await fs.mkdir(path.dirname(outJson), { recursive: true });
  await fs.writeFile(outJson, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`metrics: ${out.deck} slides=${o9.slides} nums=${tokens.length} acc=${out.o1.accuracy} refs=${o2.slidesWithRefs}/${slides.length}slides contrastFails=${o6.contrastFails45}`);
}

main().catch((e) => { console.error(`FAIL text-metrics: ${e.message}`); process.exit(1); });
