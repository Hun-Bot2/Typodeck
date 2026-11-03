// Study data self-check (DATA-owned, plain ESM, no build step).
//
// Validates every case in cases.json (frozen §S1 shape, balance rules,
// element/id consistency) and, optionally, annotation rows (§S2 shape).
//
//   node evals/hierarchy/study/validate-study.mjs --cases <cases.json> [--annotations <snapshot.json>]
// Exit 0 with a one-line summary when green; exit 2 with reasons on stderr.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const ORIGINS = new Set(['original', 'modified', 'known-good', 'known-defect', 'disputed']);
const CATEGORIES = new Set(['headline-prominence', 'number-scale', 'grouping', 'clip', 'contrast']);
const LEVELS = new Set(['narrative', 'deck']);
const PROBLEM_TYPES = new Set([
  'none', 'clip', 'contrast', 'emphasis', 'grouping',
  'reading-order', 'spacing', 'other',
]);

const errors = [];
const err = (m) => errors.push(m);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      out[argv[i].slice(2)] = argv[i + 1];
      i++;
    }
  }
  if (!out.cases) {
    console.error('validate-study: usage: node validate-study.mjs --cases <cases.json> [--annotations <snapshot.json>]');
    process.exit(2);
  }
  return out;
}

function loadJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.error(`validate-study: ${label} unreadable at ${path}: ${e.message}`);
    process.exit(2);
  }
}

function checkCases(dataset, fixtures) {
  if (dataset.datasetVersion !== 'study-v1') err(`datasetVersion is ${JSON.stringify(dataset.datasetVersion)}`);
  if (dataset.seed !== 20261103) err(`seed is ${JSON.stringify(dataset.seed)}, need 20261103`);
  if (!Array.isArray(dataset.order) || !Array.isArray(dataset.cases)) {
    err('missing order/cases arrays');
    return new Map();
  }
  if (dataset.cases.length < 25 || dataset.cases.length > 28) {
    err(`need 25-28 cases, got ${dataset.cases.length}`);
  }
  const orderIds = new Set(dataset.order);
  if (orderIds.size !== dataset.order.length) err('order contains duplicates');
  const byId = new Map();
  for (const c of dataset.cases) {
    if (!c || typeof c.caseId !== 'string') {
      err('case without string caseId');
      continue;
    }
    if (byId.has(c.caseId)) err(`${c.caseId}: duplicate caseId`);
    byId.set(c.caseId, c);
    if (!orderIds.has(c.caseId)) err(`${c.caseId}: missing from order`);
  }
  for (const id of dataset.order) {
    if (!byId.has(id)) err(`order id ${id} has no case`);
  }

  for (const c of dataset.cases) {
    if (!c || typeof c.caseId !== 'string') continue;
    const tag = c.caseId;
    if (typeof c.fixtureId !== 'string') err(`${tag}: fixtureId missing`);
    if (typeof c.system !== 'string') err(`${tag}: system missing`);
    if (!ORIGINS.has(c.origin)) err(`${tag}: bad origin ${JSON.stringify(c.origin)}`);
    if (c.defectSeed !== null) {
      const s = c.defectSeed ?? {};
      if (!CATEGORIES.has(s.category)) err(`${tag}: bad defectSeed.category ${JSON.stringify(s.category)}`);
      if (!LEVELS.has(s.level)) err(`${tag}: bad defectSeed.level ${JSON.stringify(s.level)}`);
      if (typeof s.mutation !== 'string' || s.mutation.length === 0) err(`${tag}: bad defectSeed.mutation`);
    }
    if (!c.expected || typeof c.expected.note !== 'string') err(`${tag}: expected.note missing`);
    const slide = c.slide;
    if (!slide || typeof slide.id !== 'string' || !Array.isArray(slide.blocks) || slide.blocks.length === 0) {
      err(`${tag}: slide missing id/blocks`);
      continue;
    }
    if (typeof slide.background !== 'string') err(`${tag}: slide.background missing`);
    for (const b of slide.blocks) {
      for (const k of ['id', 'role', 'content']) {
        if (typeof b[k] !== 'string') err(`${tag}: block missing ${k}`);
      }
      for (const k of ['x', 'y', 'w', 'h', 'fontSize', 'fontWeight']) {
        if (typeof b[k] !== 'number' || !Number.isFinite(b[k])) err(`${tag}: block ${b.id} bad ${k}`);
      }
    }
    // Elements mirror slide blocks exactly (id set + order), labels `N · role`.
    if (!Array.isArray(c.elements) || c.elements.length !== slide.blocks.length) {
      err(`${tag}: elements length ${c.elements?.length} != blocks ${slide.blocks.length}`);
      continue;
    }
    c.elements.forEach((el, i) => {
      const b = slide.blocks[i];
      if (el.id !== b.id) err(`${tag}: elements[${i}].id ${JSON.stringify(el.id)} != ${b.id}`);
      if (el.role !== b.role) err(`${tag}: elements[${i}].role mismatch`);
      if (el.label !== `${i + 1} · ${b.role}`) err(`${tag}: elements[${i}].label ${JSON.stringify(el.label)} bad`);
      if (typeof el.preview !== 'string' || el.preview.length > 60 || !b.content.startsWith(el.preview)) {
        err(`${tag}: elements[${i}].preview is not a <=60-char prefix`);
      }
    });
    // Known-defect problems must name the planted category's problem type.
    if (c.origin === 'known-defect') {
      const probs = c.expected?.problems;
      if (!Array.isArray(probs) || probs.length === 0) err(`${tag}: known-defect needs expected.problems`);
    }
  }

  // Balance rules (§S1).
  const goods = dataset.cases.filter((c) => c?.origin === 'known-good');
  if (goods.length < 2) err(`need >=2 known-good, got ${goods.length}`);
  for (const cat of CATEGORIES) {
    const hit = dataset.cases.filter(
      (c) => c?.origin === 'known-defect' && c.defectSeed?.category === cat,
    );
    if (hit.length < 1) err(`need >=1 known-defect for ${cat}`);
  }
  // All Stage-4 (fixture, system) decks present as originals.
  for (const f of fixtures) {
    for (const system of f.systems) {
      const hit = dataset.cases.find(
        (c) => c?.fixtureId === f.id && c?.system === system && c?.origin === 'original',
      );
      if (!hit) err(`missing original for Stage-4 deck ${f.id}/${system}`);
    }
  }
  return byId;
}

function checkAnnotations(snapshot, byId) {
  const annMap = snapshot.annotations ?? snapshot;
  if (!annMap || typeof annMap !== 'object') {
    err('snapshot has no annotation map');
    return;
  }
  let done = 0;
  for (const [caseId, ann] of Object.entries(annMap)) {
    if (caseId === 'reviewerId' || caseId === 'datasetVersion' || caseId === 'seed') continue;
    const c = byId.get(caseId);
    if (!c) {
      err(`annotation for unknown case ${caseId}`);
      continue;
    }
    const ids = new Set(c.slide.blocks.map((b) => b.id));
    if (!ann || typeof ann !== 'object') {
      err(`${caseId}: annotation not an object`);
      continue;
    }
    if (ann.firstFocus !== null && !ids.has(ann.firstFocus)) err(`${caseId}: bad firstFocus`);
    if (!Array.isArray(ann.ranking)) err(`${caseId}: ranking not an array`);
    else {
      for (const g of ann.ranking) {
        if (!Array.isArray(g)) {
          err(`${caseId}: ranking group not an array`);
          continue;
        }
        for (const id of g) if (!ids.has(id)) err(`${caseId}: ranking bad id ${JSON.stringify(id)}`);
      }
    }
    if (!Array.isArray(ann.groups)) err(`${caseId}: groups not an array`);
    else {
      for (const g of ann.groups) {
        if (!Array.isArray(g)) {
          err(`${caseId}: group not an array`);
          continue;
        }
        for (const id of g) if (!ids.has(id)) err(`${caseId}: group bad id ${JSON.stringify(id)}`);
      }
    }
    if (!Array.isArray(ann.problems)) err(`${caseId}: problems not an array`);
    else {
      for (const p of ann.problems) {
        if (!p || !PROBLEM_TYPES.has(p.type)) err(`${caseId}: bad problem type ${JSON.stringify(p?.type)}`);
        for (const id of p.blockIds ?? []) {
          if (!ids.has(id)) err(`${caseId}: problem bad id ${JSON.stringify(id)}`);
        }
      }
    }
    if (ann.confidence !== null && (!Number.isInteger(ann.confidence) || ann.confidence < 1 || ann.confidence > 5)) {
      err(`${caseId}: bad confidence`);
    }
    if (ann.status !== 'in-progress' && ann.status !== 'done') err(`${caseId}: bad status`);
    if (ann.status === 'done') done++;
  }
  return done;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dataset = loadJson(args.cases, 'cases');
  const fixtures = loadJson(join(HERE, '..', 'fixtures.json'), 'fixtures').fixtures;
  const byId = checkCases(dataset, fixtures);
  let annMsg = '';
  if (args.annotations) {
    const snapshot = loadJson(args.annotations, 'annotations');
    const done = checkAnnotations(snapshot, byId);
    annMsg = ` annotationsDone=${done}`;
  }
  if (errors.length > 0) {
    for (const e of errors.slice(0, 20)) console.error(`validate-study: ${e}`);
    if (errors.length > 20) console.error(`validate-study: … +${errors.length - 20} more`);
    process.exit(2);
  }
  console.log(`study-valid cases=${dataset.cases.length} seed=${dataset.seed}${annMsg}`);
}

main();
