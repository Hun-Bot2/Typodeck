// Human-study eval runner (DATA-owned, plain ESM, no build step).
//
// Compares arms A/C against finalized human labels with the Stage-4 metric
// shapes (no combined score), runs the repair eval on known-defect cases,
// and reports B/D as honest NOT RUN (text-only core provider; no vision
// interface).
//
// CLI (frozen contract; UI spawns exactly this):
//   node <studyDir>/run-eval.mjs --reviewer <id> --cases <cases.json> \
//     --annotations <snapshot.json> --out <results.json>
// Exit 0 on success with a one-line JSON summary on stdout:
//   {arms:{A:'RUN',B:'NOT RUN',C:'RUN',D:'NOT RUN'}, cases:n}
// Exit 2 on missing/unfinalized input with a reason on stderr.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HIER = join(HERE, '..');
const CORE = join(HERE, '..', '..', '..', 'packages', 'core', 'dist', 'src');

const core = await import(join(CORE, 'index.js'));
const arms = await import(join(HIER, 'dist', 'arms.js'));
const prominence = await import(join(HIER, 'dist', 'prominence.js'));
const metrics = await import(join(HIER, 'dist', 'metrics.js'));

const {
  critiqueDeck,
  exportToPptxBuffer,
  reviseDeck,
  validateDeck,
  validatePptxBytes,
} = core;
const { intentRank, prominenceProxy, spearman } = prominence;

const ARM_STATUS = { A: 'RUN', B: 'NOT RUN', C: 'RUN', D: 'NOT RUN' };
const BD_REASON =
  'core provider is text-only; no vision interface for screenshot/model arms (B/D staged only)';

const PROBLEM_TYPES = new Set([
  'none', 'clip', 'contrast', 'emphasis', 'grouping',
  'reading-order', 'spacing', 'other',
]);

// Planted-defect category -> core critic checks that would detect it.
// Empty mapping (number-scale) means the core critic has no such check:
// detection is honestly reported as not-covered, never forced.
const CRITIC_CHECKS_OF = {
  'headline-prominence': ['hierarchy/primary-subordinate', 'hierarchy'],
  'number-scale': [],
  grouping: ['grouping/related-isolated'],
  clip: ['overflow-risk'],
  contrast: ['contrast'],
};

function fail(reason) {
  console.error(`run-eval: ${reason}`);
  process.exit(2);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--')) fail(`missing value for --${k}`);
      out[k] = v;
      i++;
    }
  }
  for (const k of ['reviewer', 'cases', 'annotations', 'out']) {
    if (!out[k]) {
      fail(`usage: node run-eval.mjs --reviewer <id> --cases <cases.json> --annotations <snapshot.json> --out <results.json> (missing --${k})`);
    }
  }
  return out;
}

function loadJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    fail(`${label} unreadable at ${path}: ${e.message}`);
  }
}

function textsOf(deck) {
  return deck.slides.flatMap((s) => s.blocks.map((b) => b.content)).sort();
}

function expectedChars(deck) {
  return deck.slides.flatMap((s) => s.blocks).reduce((a, b) => a + b.content.length, 0);
}

function pOf(b) {
  return prominenceProxy(b.fontSize, b.fontWeight);
}

/** Unordered id-pair set from a list of groups (singletons add no pairs). */
function pairsOf(groups) {
  const pairs = new Set();
  for (const g of groups) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        const [a, b] = g[i] < g[j] ? [g[i], g[j]] : [g[j], g[i]];
        pairs.add(`${a}|${b}`);
      }
    }
  }
  return pairs;
}

function pairPR(humanPairs, predPairs) {
  let tp = 0;
  for (const p of predPairs) if (humanPairs.has(p)) tp++;
  const fp = predPairs.size - tp;
  const fn = humanPairs.size - tp;
  return {
    tp,
    fp,
    fn,
    precision: tp + fp === 0 ? null : tp / (tp + fp),
    recall: tp + fn === 0 ? null : tp / (tp + fn),
  };
}

/** Human rank value per block id from rank groups (group index; ties share). */
function humanRankValues(ranking) {
  const map = new Map();
  ranking.forEach((group, gi) => {
    for (const id of group) map.set(id, gi);
  });
  return map;
}

function validateAnnotation(caseId, ann, slideIds) {
  const problems = [];
  if (!ann || typeof ann !== 'object') return [`${caseId}: annotation missing`];
  if (ann.status !== 'done') problems.push(`${caseId}: status is ${JSON.stringify(ann.status)}, need "done"`);
  if (typeof ann.firstFocus !== 'string' || !slideIds.has(ann.firstFocus)) {
    problems.push(`${caseId}: firstFocus is not a valid block id`);
  }
  if (!Array.isArray(ann.ranking) || ann.ranking.length === 0) {
    problems.push(`${caseId}: ranking is empty`);
  } else {
    for (const g of ann.ranking) {
      if (!Array.isArray(g)) {
        problems.push(`${caseId}: ranking group is not an array`);
        continue;
      }
      for (const id of g) {
        if (!slideIds.has(id)) problems.push(`${caseId}: ranking references unknown block ${JSON.stringify(id)}`);
      }
    }
  }
  if (!Array.isArray(ann.groups)) {
    problems.push(`${caseId}: groups is not an array`);
  } else {
    for (const g of ann.groups) {
      if (!Array.isArray(g)) {
        problems.push(`${caseId}: group is not an array`);
        continue;
      }
      for (const id of g) {
        if (!slideIds.has(id)) problems.push(`${caseId}: group references unknown block ${JSON.stringify(id)}`);
      }
    }
  }
  if (!Array.isArray(ann.problems)) {
    problems.push(`${caseId}: problems is not an array`);
  } else {
    for (const p of ann.problems) {
      if (!p || !PROBLEM_TYPES.has(p.type)) {
        problems.push(`${caseId}: problem has invalid type ${JSON.stringify(p?.type)}`);
      }
      for (const id of p.blockIds ?? []) {
        if (!slideIds.has(id)) problems.push(`${caseId}: problem references unknown block ${JSON.stringify(id)}`);
      }
    }
  }
  if (!Number.isInteger(ann.confidence) || ann.confidence < 1 || ann.confidence > 5) {
    problems.push(`${caseId}: confidence must be an integer 1..5`);
  }
  return problems;
}

async function repairEval(c, fixtures) {
  const fixture0 = fixtures.find((f) => f.id === c.fixtureId);
  const beforeDeck = {
    meta: {
      title: fixture0?.narrative.title ?? c.caseId,
      lang: fixture0?.narrative.lang ?? 'en',
      system: c.system,
      seed: 20261103,
      generatedBy: 'study/run-eval repair (single-slide case deck)',
    },
    slides: [c.slide],
  };
  try {
    validateDeck(beforeDeck);
  } catch (e) {
    return { status: 'SKIPPED', reason: `case slide fails validateDeck: ${e.message}` };
  }
  const beforeReport = critiqueDeck(beforeDeck);
  const beforeErr = beforeReport.findings.filter((f) => f.severity === 'error');
  const beforeWarn = beforeReport.findings.filter((f) => f.severity === 'warning').length;

  // Critic detection of the planted defect (mapped checks only; no forcing).
  const checks = CRITIC_CHECKS_OF[c.defectSeed.category] ?? null;
  if (checks === null || checks === undefined) {
    return { status: 'SKIPPED', reason: `no critic mapping for ${c.defectSeed.category}` };
  }
  const detected = beforeReport.findings.some((f) => checks.includes(f.check));
  const criticDetection = {
    checks,
    detected,
    note: checks.length === 0
      ? 'no core critic check covers number-scale; detection not applicable'
      : undefined,
    findings: beforeReport.findings.map((f) => ({
      check: f.check,
      severity: f.severity,
      blockIds: f.blockIds ?? [],
    })),
  };

  // Reconstruct the narrative-space input: fixture thesis/lang/title +
  // case slide texts/intent in slide order (deck mutations preserve order).
  const fixture = fixtures.find((f) => f.id === c.fixtureId);
  if (!fixture) return { status: 'SKIPPED', reason: `fixture ${c.fixtureId} missing` };
  const narrative = {
    lang: fixture.narrative.lang,
    title: fixture.narrative.title,
    slides: [{
      id: fixture.narrative.slides[0].id,
      thesis: fixture.narrative.slides[0].thesis,
      blocks: c.slide.blocks.map((b) => ({
        role: b.role,
        content: b.content,
        intent: b.intent,
      })),
    }],
  };
  const fixtureTexts = fixture.narrative.slides[0].blocks.map((b) => b.content).sort();
  const caseTexts = textsOf(beforeDeck);
  if (JSON.stringify(fixtureTexts) !== JSON.stringify(caseTexts)) {
    return { status: 'SKIPPED', reason: 'slide texts diverge from fixture narrative; refusing to guess input' };
  }

  // Repair: the exact --revise path, then re-render + re-evaluate.
  const revised = reviseDeck(narrative, c.system, { maxAttempts: 3 });
  const after = revised.deck;
  const afterReport = critiqueDeck(after);
  const afterErr = afterReport.findings.filter((f) => f.severity === 'error');
  const afterWarn = afterReport.findings.filter((f) => f.severity === 'warning').length;
  const bKeys = new Set(beforeErr.map((f) => `${f.slideId}|${f.check}`));
  const aKeys = new Set(afterErr.map((f) => `${f.slideId}|${f.check}`));
  let cleared = 0;
  for (const k of bKeys) if (!aKeys.has(k)) cleared++;
  let fresh = 0;
  for (const k of aKeys) if (!bKeys.has(k)) fresh++;

  const textParity = JSON.stringify(caseTexts) === JSON.stringify(textsOf(after));

  const beforeBuf = await exportToPptxBuffer(beforeDeck);
  const afterBuf = await exportToPptxBuffer(after);
  const chkB = await validatePptxBytes(beforeBuf.buffer, expectedChars(beforeDeck));
  const chkA = await validatePptxBytes(afterBuf.buffer, expectedChars(after));

  // Does the planted defect category still fire on AFTER? (arm-level recheck)
  const afterNarrSlide = {
    id: after.slides[0].id,
    blocks: after.slides[0].blocks.map((b) => ({
      role: b.role,
      content: b.content,
      intent: b.intent,
    })),
  };
  const afterFindings = [
    ...arms.runArmA(afterNarrSlide),
    ...arms.runArmC(after.slides[0]),
  ].filter((f) => f.category === c.defectSeed.category);

  const verdict = fresh > 0 ? 'regression' : cleared > 0 ? 'improvement' : 'no-change';
  return {
    defect: c.defectSeed,
    criticDetection,
    attempts: revised.attempts,
    provenance: revised.provenance,
    beforeErrors: beforeErr.length,
    afterErrors: afterErr.length,
    errorsCleared: cleared,
    newErrors: fresh,
    warnDelta: afterWarn - beforeWarn,
    defectPersistsAfter: afterFindings.length > 0,
    defectFindingsAfter: afterFindings,
    scopeNote: c.defectSeed.level === 'deck'
      ? 'deck-level mutation is outside the revise input space (re-layout from narrative bytes); absence in AFTER is regeneration, not repair'
      : 'narrative-level input; revise re-lays-out but preserves intent annotations',
    textParity,
    beforePptxOk: chkB.ok,
    afterPptxOk: chkA.ok,
    beforeChars: chkB.stats.editableChars,
    afterChars: chkA.stats.editableChars,
    verdict,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dataset = loadJson(args.cases, 'cases');
  const snapshot = loadJson(args.annotations, 'annotations');
  const fixturesFile = loadJson(join(HIER, 'fixtures.json'), 'fixtures');
  const fixtures = fixturesFile.fixtures;

  // Snapshot shape: {annotations:{caseId:ann}} wrapper or a bare map.
  const annMap = snapshot.annotations ?? snapshot;
  if (!annMap || typeof annMap !== 'object') fail('annotations snapshot has no annotation map');

  if (dataset.datasetVersion !== 'study-v1') fail(`cases datasetVersion is ${JSON.stringify(dataset.datasetVersion)}, need "study-v1"`);
  if (!Array.isArray(dataset.order) || !Array.isArray(dataset.cases)) fail('cases file missing order/cases arrays');
  const byId = new Map(dataset.cases.map((c) => [c.caseId, c]));

  // Finalization gate: every ordered case present, done, and block-valid.
  const unfinalized = [];
  for (const caseId of dataset.order) {
    const c = byId.get(caseId);
    if (!c) {
      unfinalized.push(`${caseId}: missing from cases`);
      continue;
    }
    const slideIds = new Set(c.slide.blocks.map((b) => b.id));
    unfinalized.push(...validateAnnotation(caseId, annMap[caseId], slideIds));
  }
  if (unfinalized.length > 0) {
    fail(`missing/unfinalized input (${unfinalized.length}): ${unfinalized.slice(0, 8).join('; ')}${unfinalized.length > 8 ? '…' : ''}`);
  }

  const bd = { status: 'NOT RUN', reason: BD_REASON };
  const rows = [];
  const rhos = { A: [], C: [] };
  const ff = { A: { hits: 0, total: 0 }, C: { hits: 0, total: 0 } };
  const gp = {
    A: { tp: 0, fp: 0, fn: 0 },
    C: { tp: 0, fp: 0, fn: 0 },
  };
  const problemHist = {};
  const repairTally = { cases: 0, improved: 0, regressed: 0, unchanged: 0, textParityOk: 0, pptxOk: 0 };

  for (const caseId of dataset.order) {
    const c = byId.get(caseId);
    const ann = annMap[caseId];
    const slide = c.slide;

    const narrSlide = {
      id: slide.id,
      blocks: slide.blocks.map((b) => ({ role: b.role, content: b.content, intent: b.intent })),
    };
    const findingsA = arms.runArmA(narrSlide);
    const findingsC = arms.runArmC(slide);

    // Predicted groups from intent (both arms are intent-based here).
    const byGroup = new Map();
    for (const b of slide.blocks) {
      const gid = b.intent?.groupId;
      if (typeof gid === 'string' && gid.length > 0) {
        const list = byGroup.get(gid) ?? [];
        list.push(b.id);
        byGroup.set(gid, list);
      }
    }
    const predGroups = [...byGroup.values()].filter((g) => g.length >= 2);
    const humanPairs = pairsOf(ann.groups);
    const predPairs = pairsOf(predGroups);
    const gpr = pairPR(humanPairs, predPairs);

    // Rank correlation over human-ranked blocks (Stage-4 Spearman shape).
    const humanVals = humanRankValues(ann.ranking);
    const rankedBlocks = slide.blocks.filter((b) => humanVals.has(b.id));
    const hx = rankedBlocks.map((b) => humanVals.get(b.id));
    const rhoA = spearman(hx, rankedBlocks.map((b) => intentRank(b.intent?.emphasis)));
    const rhoC = spearman(hx, rankedBlocks.map((b) => -pOf(b)));

    // Predicted first focus: primary-intent block (A), max-P block (C).
    const prim = slide.blocks.find((b) => b.intent?.emphasis === 'primary') ?? null;
    let maxP = slide.blocks[0];
    for (const b of slide.blocks) if (pOf(b) > pOf(maxP)) maxP = b;

    const armA = {
      findings: findingsA,
      predictedFirstFocus: prim ? prim.id : null,
      firstFocusHit: prim ? ann.firstFocus === prim.id : null,
      rankCorrelation: rhoA,
      groupPairs: gpr,
    };
    const armC = {
      findings: findingsC,
      predictedFirstFocus: maxP.id,
      firstFocusHit: ann.firstFocus === maxP.id,
      rankCorrelation: rhoC,
      groupPairs: gpr,
    };

    rhos.A.push(rhoA);
    rhos.C.push(rhoC);
    for (const [arm, res] of [['A', armA], ['C', armC]]) {
      if (res.firstFocusHit !== null) {
        ff[arm].total++;
        if (res.firstFocusHit) ff[arm].hits++;
      }
      gp[arm].tp += gpr.tp;
      gp[arm].fp += gpr.fp;
      gp[arm].fn += gpr.fn;
    }
    for (const p of ann.problems) {
      problemHist[p.type] = (problemHist[p.type] ?? 0) + 1;
    }

    let repair = null;
    if (c.origin === 'known-defect') {
      repair = await repairEval(c, fixtures);
      repairTally.cases++;
      if (repair.status !== 'SKIPPED') {
        if (repair.verdict === 'improvement') repairTally.improved++;
        else if (repair.verdict === 'regression') repairTally.regressed++;
        else repairTally.unchanged++;
        if (repair.textParity) repairTally.textParityOk++;
        if (repair.beforePptxOk && repair.afterPptxOk) repairTally.pptxOk++;
      }
    }

    rows.push({
      caseId,
      human: {
        firstFocus: ann.firstFocus,
        ranking: ann.ranking,
        groups: ann.groups,
        problems: ann.problems,
        confidence: ann.confidence,
      },
      arms: { A: armA, C: armC },
      B: bd,
      D: bd,
      repair,
    });
  }

  const aggArm = (arm) => {
    const g = gp[arm];
    return {
      cases: dataset.order.length,
      rankCorrelation: metrics.summarize(rhos[arm]),
      firstFocus: {
        hits: ff[arm].hits,
        total: ff[arm].total,
        accuracy: ff[arm].total === 0 ? null : ff[arm].hits / ff[arm].total,
      },
      groupPairs: {
        tp: g.tp,
        fp: g.fp,
        fn: g.fn,
        precision: g.tp + g.fp === 0 ? null : g.tp / (g.tp + g.fp),
        recall: g.tp + g.fn === 0 ? null : g.tp / (g.tp + g.fn),
      },
    };
  };

  // Aggregate metrics only; no single combined score (Stage-4 rule).
  const results = {
    reviewerId: args.reviewer,
    datasetVersion: dataset.datasetVersion,
    seed: dataset.seed,
    arms: { ...ARM_STATUS },
    cases: rows,
    aggregate: {
      A: aggArm('A'),
      C: aggArm('C'),
      humanProblems: problemHist,
      repair: repairTally.cases > 0 ? repairTally : null,
    },
  };

  writeFileSync(args.out, JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({ arms: { ...ARM_STATUS }, cases: rows.length }));
}

await main();
