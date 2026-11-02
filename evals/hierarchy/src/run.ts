// Stage-4 hierarchy eval runner: arms A + C + BEFORE/AFTER.
//
// BEFORE (flags-off equivalent): planCompositions + layoutDeck(seed 42).
// Seed 42 matches reviseDeck's internal seed so BEFORE-vs-AFTER isolates the
// bounded-revision loop rather than seed choice; the one documented delta is
// reviseDeck's attempt-0 art-direction rhythm balancing (reported, not hidden).
// AFTER (--revise equivalent): reviseDeck(narrative, system, {maxAttempts: 3}).
//
// Scope rules (see STAGE4-REPORT.md for rationale):
// - Repair Effectiveness applies ONLY to narrative-space inputs (clean +
//   narrative seeds). Deck mutations are detection-only: the revise loop
//   re-lays-out from narrative bytes and cannot see them.
// - Primary P/R scores each arm on same-level seeds (A<->narrative,
//   C<->deck); cross-level recall is reported separately as a diagnostic.
// - Timings are measurements, never assertions. No combined score is computed.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import {
  critiqueDeck,
  critiqueSlideIntent,
  exportToPptx,
  layoutDeck,
  planCompositions,
  prominenceProxy as coreProminence,
  reviseDeck,
  validateDeck,
  validateNarrative,
  validatePptx,
  type Deck,
  type Narrative,
  type SystemId,
} from '../../../packages/core/dist/src/index.js';
import {
  hitsCategory,
  listGroupCuts,
  runArmA,
  runArmC,
  type SlideLike,
} from './arms';
import { deckSeeds, narrativeSeeds } from './defects';
import { intentRank, prominenceProxy, spearman } from './prominence';
import { CATEGORIES, fmt, precisionRecall, summarize } from './metrics';
import type {
  ArmFinding,
  DefectCategory,
  FixtureMeta,
  ScoredItem,
  SeedSpec,
} from './types';

const ROOT = join(__dirname, '..');
const RESULTS = join(ROOT, 'results');
const PPTX_DIR = join(RESULTS, 'pptx');

interface FixtureFile {
  version: number;
  fixtures: (FixtureMeta & { narrative: Narrative })[];
}

function loadFixtures(): FixtureFile {
  const raw = readFileSync(join(ROOT, 'fixtures.json'), 'utf8');
  return JSON.parse(raw) as FixtureFile;
}

function textsOf(deck: Deck): string[] {
  return deck.slides
    .flatMap((s) => s.blocks.map((b) => b.content))
    .sort();
}

function geometryHash(deck: Deck): string {
  const r3 = (v: number): number => Math.round(v * 1000) / 1000;
  return JSON.stringify(
    deck.slides.map((s) =>
      s.blocks.map((b) => [
        r3(b.x),
        r3(b.y),
        r3(b.w),
        r3(b.h),
        b.fontSize,
        b.fontWeight,
        b.color,
      ]),
    ),
  );
}

function expectedChars(deck: Deck): number {
  return deck.slides
    .flatMap((s) => s.blocks)
    .reduce((a, b) => a + b.content.length, 0);
}

interface BeforeAfterRow {
  inputId: string;
  fixtureId: string;
  system: string;
  seeded: string; // '' when clean, else seed mutation
  attempts: number;
  provenance: string[];
  beforeErrors: number;
  beforeWarnings: number;
  afterErrors: number;
  afterWarnings: number;
  errorsCleared: number;
  newErrors: number;
  textParity: boolean;
  beforePptxOk: boolean;
  afterPptxOk: boolean;
  beforeChars: number;
  afterChars: number;
  msBefore: number;
  msAfter: number;
  msExport: number;
}

async function main(): Promise<void> {
  const t0 = performance.now();
  mkdirSync(PPTX_DIR, { recursive: true });
  const file = loadFixtures();

  // ---- Gate 1: fixtures validate + knownGood matches recomputed intent ----
  let validCount = 0;
  const drift: string[] = [];
  for (const f of file.fixtures) {
    validateNarrative(f.narrative);
    validCount++;
    const blocks = f.narrative.slides[0].blocks;
    const primIdx = blocks.findIndex((b) => b.intent?.emphasis === 'primary');
    if (primIdx !== f.knownGood.primaryBlock) {
      drift.push(
        `${f.id}: knownGood.primaryBlock=${f.knownGood.primaryBlock} recomputed=${primIdx}`,
      );
    }
  }
  const gateFixturesValid = validCount === file.fixtures.length;
  const gateFixtureDrift = drift.length === 0;

  // ---- BEFORE decks (clean) + hierarchy metrics + prominence parity ----
  interface CleanDeck {
    fixtureId: string;
    system: string;
    narrative: Narrative;
    deck: Deck;
    candidates: string[];
    ms: number;
  }
  const cleanDecks: CleanDeck[] = [];
  let prominenceChecked = 0;
  let prominenceMismatched = 0;
  const rhoRows: {
    deckId: string;
    rho: number | null;
    n: number;
    note: string;
  }[] = [];
  let primaryHits = 0;
  let primaryTotal = 0;
  let primaryExcluded = 0;
  let primaryTies = 0;
  let groupsTotal = 0;
  let groupsUncut = 0;

  for (const f of file.fixtures) {
    for (const system of f.systems) {
      const tA = performance.now();
      const sys = system as SystemId;
      const plan = planCompositions(f.narrative, sys);
      const deck = layoutDeck(f.narrative, sys, {
        seed: 42,
        compositionPlan: plan,
      });
      validateDeck(deck);
      const ms = performance.now() - tA;
      cleanDecks.push({
        fixtureId: f.id,
        system,
        narrative: f.narrative,
        deck,
        candidates: plan.map((p) => p.candidateId),
        ms,
      });
      const slide = deck.slides[0];
      for (const b of slide.blocks) {
        prominenceChecked++;
        if (prominenceProxy(b.fontSize, b.fontWeight) !== coreProminence(b.fontSize, b.fontWeight)) {
          prominenceMismatched++;
        }
      }
      // Hierarchy Agreement: rho(intentRank, -P); positive = agreement.
      const xs = slide.blocks.map((b) => intentRank(b.intent?.emphasis));
      const ys = slide.blocks.map(
        (b) => -prominenceProxy(b.fontSize, b.fontWeight),
      );
      const rho = spearman(xs, ys);
      const allSameIntent = new Set(xs).size <= 1;
      rhoRows.push({
        deckId: `${f.id}/${system}`,
        rho,
        n: slide.blocks.length,
        note:
          rho === null
            ? allSameIntent
              ? 'excluded: zero intent variance'
              : 'excluded: zero prominence variance'
            : '',
      });
      // Primary Emphasis Accuracy.
      const primaries = slide.blocks.filter(
        (b) => b.intent?.emphasis === 'primary',
      );
      if (primaries.length === 0) {
        primaryExcluded++;
      } else {
        primaryTotal++;
        const ps = slide.blocks.map((b) =>
          prominenceProxy(b.fontSize, b.fontWeight),
        );
        const maxP = Math.max(...ps);
        const tied = ps.filter((p) => p === maxP).length;
        if (tied > 1) primaryTies++;
        const argmax = slide.blocks[ps.indexOf(maxP)];
        if (argmax.intent?.emphasis === 'primary') primaryHits++;
      }
      // Grouping Consistency.
      for (const g of listGroupCuts(slide as unknown as SlideLike)) {
        groupsTotal++;
        if (!g.cut) groupsUncut++;
      }
    }
  }
  const gateProminenceParity = prominenceMismatched === 0;

  // ---- Scored items: clean + narrative seeds + deck seeds ----
  const items: ScoredItem[] = [];
  // Cross-check diagnostics: eval c/* vs frozen core checks.
  let agreePrimary = 0;
  let totalPrimary = 0;
  let agreeContrast = 0;
  let totalContrast = 0;
  let agreeGrouping = 0;
  let totalGrouping = 0;
  const checkFrozenAgreement = (deck: Deck, findingsC: ArmFinding[]): void => {
    const slide = deck.slides[0];
    const frozen = critiqueSlideIntent(slide);
    const frozenH = frozen.some(
      (f) => f.check === 'hierarchy/primary-subordinate',
    );
    // headline-prominence category maps 1:1 to c/primary-subordinate here
    // (no other eval check uses that category), so compare directly.
    const evalH = hitsCategory(findingsC, 'headline-prominence');
    totalPrimary++;
    if (frozenH === evalH) agreePrimary++;
    const coreContrast = critiqueDeck(deck).findings.some(
      (f) => f.check === 'contrast',
    );
    const evalContrast = findingsC.some((f) => f.check === 'c/contrast');
    totalContrast++;
    if (coreContrast === evalContrast) agreeContrast++;
    // Grouping: frozen emits one finding per cut group, eval one per slide;
    // compare slide-level booleans (c/grouping-split only; c/dangling-group
    // is a deliberate eval extension with no frozen counterpart).
    const frozenG = frozen.some((f) => f.check === 'grouping/related-isolated');
    const evalG = findingsC.some((f) => f.check === 'c/grouping-split');
    totalGrouping++;
    if (frozenG === evalG) agreeGrouping++;
  };

  let seedCounter = 0;
  const mkId = (s: Omit<SeedSpec, 'id'>): SeedSpec => ({
    ...s,
    id: `S${String(++seedCounter).padStart(3, '0')}`,
  });

  for (const cd of cleanDecks) {
    const slideLike = cd.deck.slides[0] as unknown as SlideLike;
    const findingsC = runArmC(slideLike);
    checkFrozenAgreement(cd.deck, findingsC);
    items.push({
      itemId: `${cd.fixtureId}/${cd.system}:clean`,
      fixtureId: cd.fixtureId,
      system: cd.system,
      seeds: [],
      findingsA: runArmA(cd.narrative.slides[0]),
      findingsC,
    });
    // Narrative seeds -> Arm A directly + laid-out decks for Arm C cross-run.
    for (const ns of narrativeSeeds(cd.fixtureId, cd.narrative)) {
      const spec = mkId({ ...ns.spec, fixtureId: cd.fixtureId });
      const sys = cd.system as SystemId;
      const plan = planCompositions(ns.narrative, sys);
      const deck = layoutDeck(ns.narrative, sys, {
        seed: 42,
        compositionPlan: plan,
      });
      validateDeck(deck);
      const fc = runArmC(deck.slides[0] as unknown as SlideLike);
      checkFrozenAgreement(deck, fc);
      items.push({
        itemId: `${cd.fixtureId}/${cd.system}:narr:${spec.id}`,
        fixtureId: cd.fixtureId,
        system: cd.system,
        seeds: [spec],
        findingsA: runArmA(ns.narrative.slides[0]),
        findingsC: fc,
      });
    }
    // Deck seeds -> Arm C (detection-only).
    for (const ds of deckSeeds(cd.fixtureId, cd.deck)) {
      const spec = mkId({ ...ds.spec, fixtureId: cd.fixtureId });
      validateDeck(ds.deck);
      const fc = runArmC(ds.deck.slides[0] as unknown as SlideLike);
      checkFrozenAgreement(ds.deck, fc);
      items.push({
        itemId: `${cd.fixtureId}/${cd.system}:deck:${spec.id}`,
        fixtureId: cd.fixtureId,
        system: cd.system,
        seeds: [spec],
        findingsA: [], // Arm A cannot see deck mutations (text-only input).
        findingsC: fc,
      });
    }
  }
  // Arm A on deck-seeded items is structurally empty; record the blindness
  // explicitly rather than scoring phantom findings.

  // ---- Primary P/R (same-level) + cross-level recall diagnostics ----
  interface PRTable {
    arm: 'A' | 'C';
    scope: string;
    rows: Record<
      DefectCategory,
      { tp: number; fp: number; fn: number; precision: number | null; recall: number | null; positives: number; negatives: number }
    >;
  }
  const scopeItems = (
    arm: 'A' | 'C',
    level: 'narrative' | 'deck' | 'cross-A' | 'cross-C',
  ): ScoredItem[] => {
    if (level === 'narrative') {
      // A-primary: narrative seeds + clean; deck-seeded items excluded.
      return items.filter(
        (it) =>
          it.seeds.length === 0 || it.seeds.every((s) => s.level === 'narrative'),
      );
    }
    if (level === 'deck') {
      // C-primary: deck seeds + clean; narrative-seeded items excluded.
      return items.filter(
        (it) =>
          it.seeds.length === 0 || it.seeds.every((s) => s.level === 'deck'),
      );
    }
    if (level === 'cross-A') {
      // A on deck-level seeds (+ clean for FP reference).
      return items.filter(
        (it) =>
          it.seeds.length === 0 || it.seeds.every((s) => s.level === 'deck'),
      );
    }
    // C on narrative-level seeds (+ clean for FP reference).
    return items.filter(
      (it) =>
        it.seeds.length === 0 || it.seeds.every((s) => s.level === 'narrative'),
    );
  };
  const prTables: PRTable[] = [];
  const scopes: { arm: 'A' | 'C'; scope: string; level: 'narrative' | 'deck' | 'cross-A' | 'cross-C' }[] = [
    { arm: 'A', scope: 'primary(narrative-seeds)', level: 'narrative' },
    { arm: 'C', scope: 'primary(deck-seeds)', level: 'deck' },
    { arm: 'A', scope: 'cross(deck-seeds, blind-by-design)', level: 'cross-A' },
    { arm: 'C', scope: 'cross(narrative-seeds)', level: 'cross-C' },
  ];
  for (const s of scopes) {
    const subset = scopeItems(s.arm, s.level);
    const rows = {} as PRTable['rows'];
    for (const c of CATEGORIES) {
      rows[c] = precisionRecall(subset, c, s.arm);
    }
    prTables.push({ arm: s.arm, scope: s.scope, rows });
  }

  // ---- BEFORE/AFTER: clean narratives + narrative seeds ----
  const baRows: BeforeAfterRow[] = [];
  interface BAInput {
    inputId: string;
    fixtureId: string;
    system: string;
    narrative: Narrative;
    seeded: string;
  }
  const baInputs: BAInput[] = [];
  for (const cd of cleanDecks) {
    baInputs.push({
      inputId: `${cd.fixtureId}/${cd.system}:clean`,
      fixtureId: cd.fixtureId,
      system: cd.system,
      narrative: cd.narrative,
      seeded: '',
    });
    for (const ns of narrativeSeeds(cd.fixtureId, cd.narrative)) {
      baInputs.push({
        inputId: `${cd.fixtureId}/${cd.system}:narr:${ns.spec.mutation.slice(0, 24)}`,
        fixtureId: cd.fixtureId,
        system: cd.system,
        narrative: ns.narrative,
        seeded: ns.spec.mutation,
      });
    }
  }
  // Diversity probe inputs are the F15 clean inputs under both systems
  // (already included via cleanDecks since F15 lists two systems).
  for (const inp of baInputs) {
    const tA = performance.now();
    const sys = inp.system as SystemId;
    const plan = planCompositions(inp.narrative, sys);
    const before = layoutDeck(inp.narrative, sys, {
      seed: 42,
      compositionPlan: plan,
    });
    const msBefore = performance.now() - tA;
    const tB = performance.now();
    const revised = reviseDeck(inp.narrative, sys, {
      maxAttempts: 3,
    });
    const after = revised.deck;
    const msAfter = performance.now() - tB;
    const repB = critiqueDeck(before);
    const repA = critiqueDeck(after);
    const bErr = repB.findings.filter((f) => f.severity === 'error');
    const aErr = repA.findings.filter((f) => f.severity === 'error');
    const bWarn = repB.findings.filter((f) => f.severity === 'warning').length;
    const aWarn = repA.findings.filter((f) => f.severity === 'warning').length;
    const bKeys = new Set(bErr.map((f) => `${f.slideId}|${f.check}`));
    const aKeys = new Set(aErr.map((f) => `${f.slideId}|${f.check}`));
    let cleared = 0;
    for (const k of bKeys) if (!aKeys.has(k)) cleared++;
    let fresh = 0;
    for (const k of aKeys) if (!bKeys.has(k)) fresh++;
    const safeId = inp.inputId.replace(/[^A-Za-z0-9]+/g, '-');
    const tC = performance.now();
    const beforePath = join(PPTX_DIR, `${safeId}-before.pptx`);
    const afterPath = join(PPTX_DIR, `${safeId}-after.pptx`);
    await exportToPptx(before, beforePath);
    await exportToPptx(after, afterPath);
    const chkB = await validatePptx(beforePath, expectedChars(before));
    const chkA = await validatePptx(afterPath, expectedChars(after));
    const msExport = performance.now() - tC;
    baRows.push({
      inputId: inp.inputId,
      fixtureId: inp.fixtureId,
      system: inp.system,
      seeded: inp.seeded,
      attempts: revised.attempts,
      provenance: revised.provenance,
      beforeErrors: bErr.length,
      beforeWarnings: bWarn,
      afterErrors: aErr.length,
      afterWarnings: aWarn,
      errorsCleared: cleared,
      newErrors: fresh,
      textParity:
        JSON.stringify(textsOf(before)) === JSON.stringify(textsOf(after)),
      beforePptxOk: chkB.ok,
      afterPptxOk: chkA.ok,
      beforeChars: chkB.stats.editableChars,
      afterChars: chkA.stats.editableChars,
      msBefore,
      msAfter,
      msExport,
    });
  }

  // ---- Diversity: F15 document vs swiss, before + after ----
  interface DiversityRow {
    stage: 'before' | 'after';
    docCandidates: string[];
    swissCandidates: string[];
    sameCandidates: boolean;
    sameGeometry: boolean;
  }
  const diversity: DiversityRow[] = [];
  {
    const f15 = file.fixtures.find((f) => f.id === 'F15')!;
    for (const stage of ['before', 'after'] as const) {
      const decks: Record<string, Deck> = {};
      const cands: Record<string, string[]> = {};
      for (const system of ['document', 'swiss'] as const) {
        if (stage === 'before') {
          const plan = planCompositions(f15.narrative, system);
          cands[system] = plan.map((p) => p.candidateId);
          decks[system] = layoutDeck(f15.narrative, system, {
            seed: 42,
            compositionPlan: plan,
          });
        } else {
          const r = reviseDeck(f15.narrative, system, { maxAttempts: 3 });
          cands[system] = r.plan.map((p) => p.candidateId);
          decks[system] = r.deck;
        }
      }
      diversity.push({
        stage,
        docCandidates: cands['document'],
        swissCandidates: cands['swiss'],
        sameCandidates:
          JSON.stringify(cands['document']) === JSON.stringify(cands['swiss']),
        sameGeometry:
          geometryHash(decks['document']) === geometryHash(decks['swiss']),
      });
    }
  }

  // ---- Gates ----
  const gateC4Agreement =
    agreePrimary === totalPrimary &&
    agreeContrast === totalContrast &&
    agreeGrouping === totalGrouping;
  const gatePptx = baRows.every((r) => r.beforePptxOk && r.afterPptxOk);
  const gateTextParity = baRows.every((r) => r.textParity);
  const gateCleanStaysClean = baRows
    .filter((r) => r.seeded === '')
    .every((r) => r.newErrors === 0);
  const gateNoPingPong = baRows.every((r) => {
    const picks = r.provenance
      .map((l) => /-> (\S+)/.exec(l)?.[1])
      .filter(Boolean) as string[];
    return new Set(picks).size === picks.length && r.attempts <= 3;
  });

  const rhoSummary = summarize(rhoRows.map((r) => r.rho));
  const msTotal = performance.now() - t0;

  const results = {
    generatedBy: 'evals/hierarchy stage-4 runner (deterministic; timings are measurements)',
    counts: {
      fixtures: file.fixtures.length,
      cleanDecks: cleanDecks.length,
      scoredItems: items.length,
      narrativeSeeds: items.filter((i) => i.seeds.some((s) => s.level === 'narrative')).length,
      deckSeeds: items.filter((i) => i.seeds.some((s) => s.level === 'deck')).length,
      beforeAfterInputs: baRows.length,
    },
    gates: {
      'fixtures-valid': gateFixturesValid,
      'fixture-drift': gateFixtureDrift,
      'prominence-parity': gateProminenceParity,
      'c4-agreement': gateC4Agreement,
      'pptx-editability': gatePptx,
      'text-parity': gateTextParity,
      'clean-stays-clean': gateCleanStaysClean,
      'no-ping-pong': gateNoPingPong,
    },
    gateDetail: {
      drift,
      prominenceChecked,
      prominenceMismatched,
      c4Primary: { agree: agreePrimary, total: totalPrimary },
      c4Contrast: { agree: agreeContrast, total: totalContrast },
      c4Grouping: { agree: agreeGrouping, total: totalGrouping },
    },
    hierarchyAgreement: { summary: rhoSummary, perSlide: rhoRows },
    primaryEmphasisAccuracy: {
      hits: primaryHits,
      total: primaryTotal,
      excluded: primaryExcluded,
      tiesForMax: primaryTies,
      accuracy: primaryTotal === 0 ? null : primaryHits / primaryTotal,
    },
    groupingConsistency: {
      uncut: groupsUncut,
      total: groupsTotal,
      consistency: groupsTotal === 0 ? null : groupsUncut / groupsTotal,
    },
    prTables,
    repair: {
      inputsWithBeforeErrors: baRows.filter((r) => r.beforeErrors > 0).length,
      totalBeforeErrors: baRows.reduce((a, r) => a + r.beforeErrors, 0),
      totalCleared: baRows.reduce((a, r) => a + r.errorsCleared, 0),
      totalNewErrors: baRows.reduce((a, r) => a + r.newErrors, 0),
      warnDelta: baRows.reduce((a, r) => a + (r.afterWarnings - r.beforeWarnings), 0),
      attempts: baRows.map((r) => r.attempts),
      rows: baRows,
    },
    diversity,
    timingsMs: {
      total: msTotal,
      beforeAfter: baRows.map((r) => ({
        input: r.inputId,
        before: r.msBefore,
        after: r.msAfter,
        export: r.msExport,
      })),
    },
    // Full scored items for audit (findings + seeds per item).
    items: items.map((it) => ({
      itemId: it.itemId,
      seeds: it.seeds,
      findingsA: it.findingsA,
      findingsC: it.findingsC,
    })),
  };

  const outPath = join(RESULTS, 'stage4-results.json');
  writeFileSync(outPath, JSON.stringify(results, null, 2));

  // ---- Console summary (per-arm tables; NO combined score) ----
  console.log(`fixtures=${file.fixtures.length} cleanDecks=${cleanDecks.length} items=${items.length} baInputs=${baRows.length}`);
  console.log('GATES ' + Object.entries(results.gates).map(([k, v]) => `${k}=${v ? 'PASS' : 'FAIL'}`).join(' '));
  console.log(`hierarchy-agreement rho: n=${rhoSummary.n} mean=${fmt(rhoSummary.mean)} median=${fmt(rhoSummary.median)} min=${fmt(rhoSummary.min)} max=${fmt(rhoSummary.max)} sd=${fmt(rhoSummary.sd)} excluded=${rhoSummary.excluded}`);
  for (const r of rhoRows) {
    console.log(`  rho ${r.deckId}: ${fmt(r.rho)} (n=${r.n})${r.note ? ` ${r.note}` : ''}`);
  }
  console.log(`primary-emphasis-accuracy: ${primaryHits}/${primaryTotal} excluded=${primaryExcluded} ties=${primaryTies}`);
  console.log(`grouping-consistency: ${groupsUncut}/${groupsTotal}`);
  for (const t of prTables) {
    console.log(`P/R arm=${t.arm} scope=${t.scope}`);
    for (const c of CATEGORIES) {
      const p = t.rows[c];
      console.log(`  ${c}: P=${fmt(p.precision)} R=${fmt(p.recall)} tp=${p.tp} fp=${p.fp} fn=${p.fn} pos=${p.positives} neg=${p.negatives}`);
    }
  }
  const rep = results.repair;
  console.log(`repair: inputsWithErrors=${rep.inputsWithBeforeErrors} before=${rep.totalBeforeErrors} cleared=${rep.totalCleared} new=${rep.totalNewErrors} warnDelta=${rep.warnDelta}`);
  for (const d of diversity) {
    console.log(`diversity F15/${d.stage}: doc=[${d.docCandidates}] swiss=[${d.swissCandidates}] sameCandidates=${d.sameCandidates} sameGeometry=${d.sameGeometry}`);
  }
  const pptxOk = baRows.filter((r) => r.beforePptxOk && r.afterPptxOk).length;
  console.log(`pptx: ${pptxOk}/${baRows.length} inputs fully editable; textParity=${baRows.filter((r) => r.textParity).length}/${baRows.length}`);
  console.log(`timings: total=${msTotal.toFixed(0)}ms results=${outPath}`);
}

void main();
