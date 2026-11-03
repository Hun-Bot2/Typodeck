// Typodeck design-quality PPTX verification — REAL engine path check.
//
// resolve (selection-index.json + design.md) -> layoutDeckWithTemplate ->
// exportToPptxBuffer -> validatePptxBytes + independent XML audit.
//
// Usage: node evals/design-quality/pptx/check-pptx.mjs
// Outputs: one .pptx per design + check-output.json in this directory.
// Engine is READ-ONLY here (uses packages/core/dist, no rebuild, no edits).
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = '/Users/jeonghun/Typodeck';
const OUT = path.join(ROOT, 'evals/design-quality/pptx');
const core = require(path.join(ROOT, 'packages/core/dist/src/index.js'));
const JSZip = require(path.join(ROOT, 'node_modules/jszip'));

const SLUGS = ['field-manual', 'fika', 'gridline-swiss', 'modulo-grid', 'peer-review', 'signal-board'];
const SEED = 7;

// --- Fixture-equivalent narrative (verbatim strings from fixtures.json) ---
function buildNarrative(fx) {
  const B = fx.slide_b_evidence;
  const C = fx.slide_c_explanation;
  const D = fx.slide_dense;
  const O = Object.fromEntries(fx.deck_outline.map((s) => [s.id, s]));
  void O;
  const denseHeader = D.columns.join('  |  ');
  const denseRows = D.rows.map((r) => r.join('  |  '));
  const denseBody = [denseHeader, ...denseRows].join('\n');
  const left = C.sides[0];
  const right = C.sides[1];
  return {
    title: 'The Hidden Cost of Rushing to Ship',
    lang: 'en',
    slides: [
      {
        id: 'cover', thesis: 'Cover: title, subtitle, context.',
        blocks: [
          { role: 'kicker', content: 'Typodeck Research · November 2026' },
          { role: 'title', content: 'The Hidden Cost of Rushing to Ship' },
          { role: 'body', content: 'What 11 postmortems taught us about review discipline' },
        ],
      },
      {
        id: 'divider', thesis: 'Section divider, no data.',
        blocks: [
          { role: 'kicker', content: 'Part I — Evidence' },
          { role: 'title', content: 'What the reviews actually caught' },
          { role: 'body', content: 'Three patterns, one discipline.' },
        ],
      },
      {
        id: 'statement', thesis: 'One idea, full stage.',
        blocks: [
          { role: 'title', content: 'Rushing to ship moves failure downstream, where it costs more.' },
          { role: 'caption', content: 'Typodeck Research · November 2026' },
        ],
      },
      {
        id: 'evidence', thesis: 'Slide-B evidence block.',
        blocks: [
          { role: 'kicker', content: 'Finding 01' },
          { role: 'title', content: B.key_message },
          { role: 'number', content: B.stat.value },
          { role: 'body', content: B.supporting_line },
          { role: 'caption', content: `${B.stat.label} · ${B.source_line}` },
        ],
      },
      {
        id: 'comparison', thesis: 'Slide-C comparison block.',
        blocks: [
          { role: 'kicker', content: 'The choice' },
          { role: 'title', content: C.title },
          { role: 'body', content: `${left.heading}\n• ${left.bullets.join('\n• ')}` },
          { role: 'body', content: `${right.heading}\n• ${right.bullets.join('\n• ')}` },
          { role: 'caption', content: C.caption },
        ],
      },
      {
        id: 'dense', thesis: 'Appendix 11x4 table as text.',
        blocks: [
          { role: 'kicker', content: 'Appendix — all eleven cases' },
          { role: 'title', content: D.title },
          { role: 'body', content: denseBody },
          { role: 'caption', content: D.footnote },
        ],
      },
      {
        id: 'closing', thesis: 'Closing line and recap.',
        blocks: [
          { role: 'title', content: 'Slow the review. Ship once.' },
          { role: 'body', content: 'Discipline upstream beats heroics downstream.' },
          { role: 'caption', content: 'Typodeck Research · November 2026' },
        ],
      },
    ],
  };
}

function contentChars(narrative) {
  // Newlines become paragraph breaks, not <a:t> chars.
  let t = 0;
  for (const s of narrative.slides) for (const b of s.blocks) t += b.content.replace(/\n/g, '').length;
  return t;
}

async function auditXml(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort();
  let runs = 0, runChars = 0, pics = 0, blips = 0, shapes = 0;
  const faces = new Set(), bgs = [];
  const slidesXml = [];
  for (const n of names) {
    const xml = await zip.file(n).async('string');
    slidesXml.push(xml);
    shapes += (xml.match(/<p:sp[\s>]/g) || []).length;
    pics += (xml.match(/<p:pic[\s>]/g) || []).length;
    blips += (xml.match(/<a:blip[\s>]/g) || []).length;
    for (const m of xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)) { runs += 1; runChars += m[1].length; }
    for (const m of xml.matchAll(/<a:latin[^>]*typeface="([^"]*)"/g)) faces.add(m[1]);
    for (const m of xml.matchAll(/<a:ea[^>]*typeface="([^"]*)"/g)) faces.add(m[1]);
    const bg = xml.match(/<p:bg>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/);
    bgs.push(bg ? `#${bg[1].toUpperCase()}` : null);
  }
  const presXml = await zip.file('ppt/presentation.xml').async('string');
  const sldSz = presXml.match(/<p:sldSz[^>]*\/>/)[0];
  return { slideCount: names.length, shapes, runs, runChars, pics, blips, faces: [...faces].sort(), bgs, slidesXml, sldSz };
}

const EMU = 914400;
function firstTitleBoxGeom(slideXml) {
  // Geometry of the largest text box on the slide (by area) as a spot check.
  const boxes = [];
  for (const m of slideXml.matchAll(/<p:sp[\s>]([\s\S]*?)<\/p:sp>/g)) {
    const xfrm = m[1].match(/<a:xfrm[\s>]([\s\S]*?)<\/a:xfrm>/);
    if (!xfrm) continue;
    const off = xfrm[1].match(/<a:off x="(\d+)" y="(\d+)"/);
    const ext = xfrm[1].match(/<a:ext cx="(\d+)" cy="(\d+)"/);
    if (!off || !ext) continue;
    const t = [...m[1].matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((x) => x[1]).join('');
    boxes.push({
      x: Number(off[1]) / EMU, y: Number(off[2]) / EMU,
      w: Number(ext[1]) / EMU, h: Number(ext[2]) / EMU,
      text: t.slice(0, 60),
    });
  }
  boxes.sort((a, b) => b.w * b.h - a.w * a.h);
  return boxes[0] || null;
}

async function main() {
  const fx = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals/design-quality/fixtures.json'), 'utf8'));
  const narrative = buildNarrative(fx);
  const expectedChars = contentChars(narrative);
  const index = core.parseSelectionIndex(
    JSON.parse(fs.readFileSync(path.join(ROOT, 'bold-template-pack/selection-index.json'), 'utf8')),
  );
  const bySlug = Object.fromEntries(index.map((e) => [e.slug, e]));

  const report = { seed: SEED, expectedChars, slides: narrative.slides.length, designs: [] };
  for (const slug of SLUGS) {
    const entry = bySlug[slug];
    if (!entry) throw new Error(`missing index entry for ${slug}`);
    const designMd = fs.readFileSync(path.join(ROOT, entry.designPath), 'utf8');
    const res = core.resolveTemplateDesign(entry, designMd);
    const deck = core.layoutDeckWithTemplate(narrative, entry, designMd, { seed: SEED });
    const exp = await core.exportToPptxBuffer(deck);
    const val = await core.validatePptxBytes(exp.buffer, expectedChars);
    const audit = await auditXml(exp.buffer);

    // Per-slide block stats from the deck (geometry/font spot checks).
    const slideStats = deck.slides.map((s) => ({
      id: s.id,
      background: s.background,
      blocks: s.blocks.map((b) => ({
        role: b.role, fontSize: b.fontSize, weight: b.fontWeight,
        geom: [b.x, b.y, b.w, b.h].map((v) => Math.round(v * 1000) / 1000),
        face: b.fontFace || null, chars: b.content.replace(/\n/g, '').length,
        lines: b.content.split('\n').length,
      })),
    }));
    const allBlocks = deck.slides.flatMap((s) => s.blocks);
    const minFont = Math.min(...allBlocks.map((b) => b.fontSize));
    const denseBody = deck.slides.find((s) => s.id === 'dense').blocks.find((b) => b.role === 'body');
    // Honest wrap probe at the dense body's own geometry.
    const wrap = core.estimateWrap(denseBody.content, denseBody.fontSize, denseBody.w, denseBody.tracking, denseBody.lineHeight, denseBody.fontWeight >= 700);

    // Geometry cross-check: largest XML box on slide 1 vs deck JSON nearest box.
    const xmlBox = firstTitleBoxGeom(audit.slidesXml[0]);
    let geomMatch = null;
    if (xmlBox) {
      let best = null;
      for (const b of deck.slides[0].blocks) {
        const d = Math.abs(b.x - xmlBox.x) + Math.abs(b.y - xmlBox.y) + Math.abs(b.w - xmlBox.w) + Math.abs(b.h - xmlBox.h);
        if (best === null || d < best) best = d;
      }
      geomMatch = Math.round(best * 1000) / 1000;
    }

    const fileName = `${slug}.pptx`;
    fs.writeFileSync(path.join(OUT, fileName), exp.buffer);

    report.designs.push({
      slug, file: fileName, bytes: exp.buffer.length,
      system: res.systemId,
      theme: { id: res.theme.id, colors: res.theme.colors, fonts: res.theme.fonts },
      engine: { slides: exp.slideCount, textBoxes: exp.textBoxCount },
      xml: {
        slides: audit.slideCount, shapes: audit.shapes, runs: audit.runs,
        runChars: audit.runChars, pics: audit.pics, blips: audit.blips,
        faces: audit.faces, bgs: audit.bgs, sldSz: audit.sldSz,
      },
      editableExact: audit.runChars === expectedChars,
      validator: { ok: val.ok, errors: val.errors, stats: val.stats },
      minFont, denseBodyPt: denseBody.fontSize,
      denseWrapLines: wrap.lines.length, denseParaCount: denseBody.content.split('\n').length,
      geomSpotDeltaIn: geomMatch, geomSpotXml: xmlBox,
      slides: slideStats,
    });
    console.log(`${slug}: system=${res.systemId} boxes=${exp.textBoxCount} xmlShapes=${audit.shapes} runs=${audit.runs} chars=${audit.runChars}/${expectedChars} pics=${audit.pics} blips=${audit.blips} valid=${val.ok ? 'ok' : 'FAIL ' + val.errors.join(';')} minFont=${minFont} densePt=${denseBody.fontSize} size=${exp.buffer.length}`);
  }
  fs.writeFileSync(path.join(OUT, 'check-output.json'), JSON.stringify(report, null, 2));
  console.log(`wrote ${path.join(OUT, 'check-output.json')}`);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
