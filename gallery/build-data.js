#!/usr/bin/env node
// Build gallery/data.js from real repo artifacts.
// Missing artifacts are recorded as explicitly missing, never faked.
// Usage: node gallery/build-data.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const out = { generatedAt: new Date().toISOString(), files: [], warnings: [] };
function expect(rel) {
  const abs = path.join(ROOT, rel);
  const exists = fs.existsSync(abs);
  const entry = { path: rel, exists, bytes: exists && fs.statSync(abs).isFile() ? fs.statSync(abs).size : null };
  out.files.push(entry);
  return exists ? abs : null;
}
function read(abs) { return fs.readFileSync(abs, 'utf8'); }

// --- Previews manifest ---
out.manifest = null;
const manifestPath = expect('previews/manifest.json');
if (manifestPath) {
  try { out.manifest = JSON.parse(read(manifestPath)); }
  catch (e) { out.warnings.push('previews/manifest.json unparseable: ' + e.message); }
}

// --- Per-system preview HTML: extract <style> + per-slide (meta, stage HTML) ---
out.previewCss = null;
out.systems = [];
const systems = (out.manifest && out.manifest.systems) || [];
for (const s of systems) {
  const sys = {
    system: s.system, version: s.version, status: s.status,
    pptx: s.pptx, pptxExists: false, html: s.html, htmlExists: false,
    slides: s.slides, textBoxes: s.textBoxes, bytes: s.bytes,
    editableChars: s.editableChars, validationOk: s.validationOk,
    validationErrors: s.validationErrors, htmlParityOk: s.htmlParityOk,
    candidates: s.candidates, renderedSlides: [],
  };
  const htmlPath = expect(sys.html);
  if (htmlPath) {
    sys.htmlExists = true;
    const html = read(htmlPath);
    const css = html.match(/<style>([\s\S]*?)<\/style>/);
    if (css && !out.previewCss) out.previewCss = css[1];
    const re = /<section class="slide-wrap"><div class="meta">(.*?)<\/div>([\s\S]*?)<\/section>/g;
    let m;
    while ((m = re.exec(html))) {
      sys.renderedSlides.push({ meta: m[1], stageHtml: m[2].trim() });
    }
    if (sys.renderedSlides.length === 0) out.warnings.push(sys.html + ': no slide sections parsed');
  } else {
    out.warnings.push(sys.html + ': MISSING (referenced by manifest)');
  }
  const pptxPath = path.join(ROOT, sys.pptx);
  sys.pptxExists = fs.existsSync(pptxPath);
  out.files.push({ path: sys.pptx, exists: sys.pptxExists, bytes: sys.pptxExists ? fs.statSync(pptxPath).size : null });
  if (!sys.pptxExists) out.warnings.push(sys.pptx + ': MISSING (referenced by manifest)');
  out.systems.push(sys);
}
// Slide labels from first system that rendered
out.slideLabels = [];
const first = out.systems.find(s => s.renderedSlides.length);
if (first) out.slideLabels = first.renderedSlides.map(s => s.meta);

// --- Research registry + provenance sidecar ---
out.registry = null;
out.registryStats = null;
const regPath = expect('research/merged_registry.json');
const provPath = expect('research/merge_provenance.json');
let prov = {};
if (provPath) {
  try { prov = JSON.parse(read(provPath)); }
  catch (e) { out.warnings.push('research/merge_provenance.json unparseable: ' + e.message); }
}
if (regPath) {
  try {
    const records = JSON.parse(read(regPath));
    out.registry = records.map(r => {
      const p = prov[r.id] || {};
      const cv = p.composition_verbatim || {};
      return {
        id: r.id, agent: r.agent, category: r.category, title: r.title,
        designer: r.designer, year: r.year, source_url: r.source_url,
        source_type: r.source_type, status: r.visual_inspection_status,
        summary: r.composition_analysis && r.composition_analysis.summary,
        primitives: (r.composition_analysis && r.composition_analysis.primitives) || [],
        reading_order: r.composition_analysis && r.composition_analysis.reading_order,
        hierarchy: r.hierarchy, grid: r.grid_strategy, whitespace: r.whitespace_strategy,
        techniques: r.typographic_techniques, adaptability: r.slide_adaptability,
        capabilities: r.required_engine_capabilities, confidence: r.evidence_confidence,
        originality: r.originality_notes, limitations: r.limitations,
        // provenance (original agent values; null when the sidecar lacks them)
        origCategory: p.original_category || null,
        origSourceType: p.original_source_type || null,
        agentStatus: p.agent_status || null,
        method: p.check_method || p.verification_method || null,
        visualNotes: p.visual_notes || p.notes || null,
        context: p.context || null,
        publication: p.publication || null,
        align: cv.alignment || null, rhythm: cv.rhythm || null,
        scale: cv.scale || null, textTreatment: cv.text_treatment || null,
        confClaimed: p.confidence_claimed || null,
        confCapped: !!p.confidence_capped,
        summaryRecon: !!p.summary_reconstructed,
      };
    });
    const byCat = {}, byStatus = {}, byAgent = {};
    for (const r of out.registry) {
      byCat[r.category] = (byCat[r.category] || 0) + 1;
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byAgent[r.agent] = (byAgent[r.agent] || 0) + 1;
      if (!prov[r.id]) out.warnings.push('no provenance for ' + r.id);
    }
    out.registryStats = { total: out.registry.length, byCategory: byCat, byStatus: byStatus, byAgent: byAgent };
  } catch (e) { out.warnings.push('research/merged_registry.json unparseable: ' + e.message); }
}

// --- Synthesis docs (existence only; gallery links to the real files) ---
for (const f of ['research/candidate_visual_systems.md', 'research/implementation_notes.md',
  'research/merge_report.md', 'research/schema.json', 'previews/html/index.html']) {
  expect(f);
}

// --- Composition candidates: expected document-only set, provenance-checked ---
// Expected ids come from research/implementation_notes.md section 1 (X2..X7).
const EXPECTED_DOC_CANDIDATES = ['manual-opening', 'series-opening', 'manual-section',
  'manual-reference', 'margin-evidence', 'manual-metric'];
const notesPath = path.join(ROOT, 'research/implementation_notes.md');
const notesText = fs.existsSync(notesPath) ? read(notesPath) : '';
const exercised = new Set();
for (const s of out.systems) for (const c of (s.candidates || [])) exercised.add(s.system + ':' + c);
out.compositionCandidates = EXPECTED_DOC_CANDIDATES.map(id => ({
  system: 'document', candidate: id,
  provenanceVerified: notesText.includes('`' + id + '`'),
  exercisedInPreview: exercised.has('document:' + id),
}));

// --- Reviewable candidate keys: manifest (system,candidate) pairs + unexercised doc candidates ---
const seen = new Set();
out.reviewItems = [];
function addReview(system, candidate, opts) {
  const key = system + ':' + candidate;
  if (seen.has(key)) return;
  seen.add(key);
  out.reviewItems.push(Object.assign({ key, system, candidate }, opts));
}
for (const s of out.systems) {
  (s.candidates || []).forEach((c, i) => {
    const rendered = s.renderedSlides[i] ? true : false;
    addReview(s.system, c, {
      previewRendered: rendered,
      slideMeta: s.renderedSlides[i] ? s.renderedSlides[i].meta : null,
      slideIndex: rendered ? i : null,
      docOnly: false,
    });
  });
}
for (const d of out.compositionCandidates) {
  if (!d.exercisedInPreview) {
    addReview(d.system, d.candidate, {
      previewRendered: false, slideMeta: null, slideIndex: null, docOnly: true,
    });
  } else {
    const it = out.reviewItems.find(r => r.key === 'document:' + d.candidate);
    if (it) it.docOnly = true;
  }
}
// Attach slide indexes per review item (a candidate may appear on several slides/systems separately keyed)
for (const r of out.reviewItems) {
  const sys = out.systems.find(s => s.system === r.system);
  r.slideIndexes = [];
  if (sys) (sys.candidates || []).forEach((c, i) => { if (c === r.candidate) r.slideIndexes.push(i); });
}

// --- Candidate evidence: refs joined to LIVE registry statuses (never stored) ---
let evidence = null;
const evPath = expect('gallery/candidate-evidence.json');
if (evPath) {
  try { evidence = JSON.parse(read(evPath)); }
  catch (e) { out.warnings.push('gallery/candidate-evidence.json unparseable: ' + e.message); }
}
const regById = {};
if (out.registry) for (const r of out.registry) regById[r.id] = r;
function resolveEvidence(entry) {
  if (!entry) return null;
  const refs = (entry.refs || []).map(id => {
    const r = regById[id];
    if (!r) {
      out.warnings.push('candidate-evidence.json references unknown record ' + id);
      return { id: id, missing: true };
    }
    return { id: r.id, title: r.title, source_url: r.source_url, status: r.status, confidence: r.confidence };
  });
  return { refs: refs, rules: entry.rules || [], gaps: entry.gaps || [] };
}
for (const s of out.systems) {
  s.evidence = (evidence && evidence.systems && evidence.systems[s.system])
    ? resolveEvidence(evidence.systems[s.system]) : null;
}
for (const r of out.reviewItems) {
  r.evidence = (evidence && evidence.candidates && evidence.candidates[r.key])
    ? resolveEvidence(evidence.candidates[r.key]) : null;
}

const js = 'window.TYPODECK_DATA = ' + JSON.stringify(out) + ';\n';
fs.writeFileSync(path.join(__dirname, 'data.js'), js);
const nMissing = out.files.filter(f => !f.exists).length;
console.log('wrote gallery/data.js: ' + out.reviewItems.length + ' review items, ' +
  (out.registry ? out.registry.length : 0) + ' registry records, ' +
  nMissing + ' missing files, ' + out.warnings.length + ' warnings');
for (const w of out.warnings) console.log('WARN: ' + w);
