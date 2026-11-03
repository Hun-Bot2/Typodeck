// Human-study case generator (DATA-owned).
//
// Builds study/cases.json deterministically from Stage-4 fixtures + seeds:
//   - all 17 Stage-4 clean BEFORE decks (planCompositions + layoutDeck seed 42)
//   - controlled variants reusing Stage-4 defects.ts seeds (verified, never forced)
//   - intentional-crop (disputed) + dense-KO + known-good minimal cases
//
// Run once; the committed cases.json is the artifact:
//   node evals/hierarchy/study/generate-cases.mjs [--out <cases.json>]
//
// Prereqs (built dists, read-only reuse):
//   npm run build -w @typodeck/core
//   ./node_modules/.bin/tsc -p evals/hierarchy/tsconfig.json

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HIER = join(HERE, '..');
const CORE = join(HERE, '..', '..', '..', 'packages', 'core', 'dist', 'src');

const core = await import(join(CORE, 'index.js'));
const defects = await import(join(HIER, 'dist', 'defects.js'));
const arms = await import(join(HIER, 'dist', 'arms.js'));

const { layoutDeck, planCompositions, validateDeck, validateNarrative } = core;

const SEED = 20261103;
const DATASET_VERSION = 'study-v1';

// All 17 Stage-4 decks (F15 x 2 systems). Order here is the study case order.
const ORIGINALS = [
  ['F01', 'swiss'], ['F02', 'swiss'], ['F03', 'editorial'], ['F04', 'swiss'],
  ['F05', 'document'], ['F06', 'document'], ['F07', 'swiss'], ['F08', 'swiss'],
  ['F09', 'editorial'], ['F10', 'document'], ['F11', 'document'], ['F12', 'editorial'],
  ['F13', 'expressive'], ['F14', 'expressive'], ['F15', 'document'], ['F15', 'swiss'],
  ['F16', 'editorial'],
];

const PROBLEM_OF = {
  'headline-prominence': 'emphasis',
  'number-scale': 'emphasis',
  grouping: 'grouping',
  clip: 'clip',
  contrast: 'contrast',
};

function fail(msg) {
  console.error(`generate-cases: ${msg}`);
  process.exit(2);
}

function loadFixtures() {
  const raw = readFileSync(join(HIER, 'fixtures.json'), 'utf8');
  return JSON.parse(raw).fixtures;
}

function fixtureById(fixtures, id) {
  const f = fixtures.find((x) => x.id === id);
  if (!f) fail(`fixture ${id} missing from fixtures.json`);
  return f;
}

/** Clean BEFORE deck, exactly as the Stage-4 runner builds it. */
function beforeDeck(narrative, system) {
  const plan = planCompositions(narrative, system);
  const deck = layoutDeck(narrative, system, { seed: 42, compositionPlan: plan });
  validateDeck(deck);
  return deck;
}

function elementsOf(slide) {
  return slide.blocks.map((b, i) => ({
    id: b.id,
    role: b.role,
    label: `${i + 1} · ${b.role}`,
    preview: b.content.slice(0, 60),
  }));
}

function baseCase(caseId, fixtureId, system, slide) {
  return {
    caseId,
    fixtureId,
    system,
    slide,
    elements: elementsOf(slide),
  };
}

function expectedNote(note) {
  return { firstFocus: null, ranking: null, groups: null, problems: null, note };
}

/** Resolve `#idx` arm-A targets to positioned slide block ids (order-guarded). */
function resolveNarrTargets(slide, targets) {
  return targets.map((t) => {
    const m = /^#(\d+)$/.exec(t);
    if (!m) fail(`unexpected narrative target ${t}`);
    const i = Number(m[1]);
    const b = slide.blocks[i];
    if (!b) fail(`narrative target ${t} out of range`);
    return b.id;
  });
}

function main() {
  const fixtures = loadFixtures();
  const cases = [];
  let n = 0;
  const nextId = () => `S${String(++n).padStart(2, '0')}`;

  // ---- S01..S17: the 17 Stage-4 clean decks, origin "original" ----
  for (const [fid, system] of ORIGINALS) {
    const f = fixtureById(fixtures, fid);
    validateNarrative(f.narrative);
    const deck = beforeDeck(f.narrative, system);
    const slide = deck.slides[0];
    let note = `Stage-4 clean BEFORE deck (${fid}/${system}); no asserted human label.`;
    if (fid === 'F15') {
      note +=
        ' Designed tension: title carries primary but monumental layouts glorify the number' +
        ' (frozen C4 hierarchy/primary-subordinate fires clean; STAGE4-REPORT §6.1).';
    }
    cases.push({
      ...baseCase(nextId(), fid, system, slide),
      origin: 'original',
      defectSeed: null,
      expected: expectedNote(note),
    });
  }

  // ---- Deck-seed known-defect variants (detection-verified by construction) ----
  const deckVariant = (caseId, fid, system, seedFn, seedName) => {
    const f = fixtureById(fixtures, fid);
    const clean = beforeDeck(f.narrative, system);
    const seeded = seedFn(fid, clean);
    if (!seeded) fail(`${seedName} inapplicable on ${fid}/${system}`);
    validateDeck(seeded.deck);
    const slide = seeded.deck.slides[0];
    const hits = arms
      .runArmC(slide)
      .filter((x) => x.category === seeded.spec.category)
      .flatMap((x) => x.targets);
    const targets = [...new Set(hits)];
    if (targets.length === 0) fail(`${seedName} produced no ${seeded.spec.category} finding`);
    return {
      ...baseCase(caseId, fid, system, slide),
      origin: 'known-defect',
      defectSeed: {
        category: seeded.spec.category,
        level: seeded.spec.level,
        mutation: seeded.spec.mutation,
      },
      expected: {
        firstFocus: null,
        ranking: null,
        groups: null,
        problems: [{
          type: PROBLEM_OF[seeded.spec.category],
          blockIds: targets,
          comment: `Planted ${seeded.spec.category} seed: ${seeded.spec.mutation}`,
        }],
        note: `Known-defect (${seeded.spec.category}/${seeded.spec.level}): ${seeded.spec.mutation}.`,
      },
    };
  };

  cases.push(deckVariant(nextId(), 'F02', 'swiss', defects.seedDemotePrimary, 'demote-primary'));
  const numCase = deckVariant(nextId(), 'F15', 'swiss', defects.seedNumberScale, 'number-scale');
  numCase.expected.note +=
    ' Caveat: c/number-scale already fires on the clean F15/swiss deck; the seed amplifies a present tension (STAGE4-REPORT §6.1).';
  cases.push(numCase);
  cases.push(deckVariant(nextId(), 'F04', 'swiss', defects.seedGroupingSwap, 'grouping-swap'));
  const clipKO = deckVariant(nextId(), 'F12', 'editorial', defects.seedClipSupport, 'clip-support');
  clipKO.expected.note += ' Dense-KO coverage: 7-block Korean audit slide.';
  cases.push(clipKO);
  cases.push(deckVariant(nextId(), 'F08', 'swiss', defects.seedContrastFail, 'contrast-fail'));

  // ---- Narrative-seed known-defect variants (intent-level; geometry may equal clean) ----
  const narrVariant = (caseId, fid, system, seedFn, seedName) => {
    const f = fixtureById(fixtures, fid);
    const seeded = seedFn(fid, f.narrative);
    if (!seeded) fail(`${seedName} inapplicable on ${fid}`);
    const deck = beforeDeck(seeded.narrative, system);
    const slide = deck.slides[0];
    // Guard: deck block order must match narrative order for `#idx` resolution.
    seeded.narrative.slides[0].blocks.forEach((nb, i) => {
      if (slide.blocks[i].content !== nb.content) {
        fail(`${seedName}: block order diverged at index ${i}`);
      }
    });
    const hits = arms
      .runArmA(seeded.narrative.slides[0])
      .filter((x) => x.category === seeded.spec.category)
      .flatMap((x) => x.targets);
    const targets = [...new Set(resolveNarrTargets(slide, hits))];
    if (targets.length === 0) fail(`${seedName} produced no ${seeded.spec.category} finding`);
    return {
      ...baseCase(caseId, fid, system, slide),
      origin: 'known-defect',
      // Excluded from human annotation: intent-only mutations render
      // byte-identical to their clean source decks (S02/S04), so a blind
      // reviewer cannot distinguish them. Kept for model-side Arm A use.
      status: 'excluded',
      exclusionReason: 'Renders identical to the clean source deck; invalid as a blind human case.',
      defectSeed: {
        category: seeded.spec.category,
        level: seeded.spec.level,
        mutation: seeded.spec.mutation,
      },
      expected: {
        firstFocus: null,
        ranking: null,
        groups: null,
        problems: [{
          type: PROBLEM_OF[seeded.spec.category],
          blockIds: targets,
          comment: `Planted ${seeded.spec.category} seed: ${seeded.spec.mutation}`,
        }],
        note: `Known-defect (${seeded.spec.category}/${seeded.spec.level}): ${seeded.spec.mutation}.` +
          ' Intent-only mutation; layout is intent-agnostic so geometry equals the clean deck.',
      },
    };
  };

  cases.push(narrVariant(nextId(), 'F02', 'swiss', defects.seedDangleGroup, 'dangle-group'));
  cases.push(narrVariant(nextId(), 'F04', 'swiss', defects.seedPrimaryOnCaption, 'primary-on-caption'));

  // ---- Intentional-crop disputed case: clip seed on a deliberateCrop block ----
  {
    const f = fixtureById(fixtures, 'F13');
    const clean = beforeDeck(f.narrative, 'expressive');
    const seeded = defects.seedClipSupport('F13', clean);
    if (!seeded) fail('clip-support inapplicable on F13/expressive');
    validateDeck(seeded.deck);
    const slide = seeded.deck.slides[0];
    const target = slide.blocks.find((b) => b.id === 'F13-s1-b1');
    if (!target || target.intent?.deliberateCrop !== true) {
      fail('F13 disputed case: mutated block is not the deliberateCrop block');
    }
    cases.push({
      ...baseCase(nextId(), 'F13', 'expressive', slide),
      origin: 'disputed',
      defectSeed: {
        category: seeded.spec.category,
        level: seeded.spec.level,
        mutation: seeded.spec.mutation,
      },
      expected: expectedNote(
        'Disputed: the clip estimate fires on a deliberateCrop:true block.' +
          ' Expressive crop and genuine clip are visually confounded here; no asserted label.',
      ),
    });
  }

  // ---- Known-good minimal cases: F16 under two extra systems, arms silent ----
  for (const system of ['swiss', 'document']) {
    const f = fixtureById(fixtures, 'F16');
    const deck = beforeDeck(f.narrative, system);
    const slide = deck.slides[0];
    const fa = arms.runArmA(f.narrative.slides[0]);
    const fc = arms.runArmC(slide);
    if (fa.length !== 0 || fc.length !== 0) {
      fail(`F16/${system} not clean: A=${fa.length} C=${fc.length}`);
    }
    cases.push({
      ...baseCase(nextId(), 'F16', system, slide),
      origin: 'known-good',
      defectSeed: null,
      expected: {
        firstFocus: null,
        ranking: null,
        groups: null,
        problems: [{ type: 'none', blockIds: [], comment: 'Verified: arms A/C silent on clean minimal slide.' }],
        note: `Known-good minimal slide (F16/${system}); arms A/C silent.`,
      },
    });
  }

  // ---- Balance assertions ----
  if (cases.length < 25 || cases.length > 28) fail(`expected 25-28 cases, got ${cases.length}`);
  const goods = cases.filter((c) => c.origin === 'known-good');
  if (goods.length < 2) fail('need >=2 known-good cases');
  for (const cat of ['headline-prominence', 'number-scale', 'grouping', 'clip', 'contrast']) {
    const hit = cases.filter(
      (c) => c.origin === 'known-defect' && c.defectSeed?.category === cat,
    );
    if (hit.length < 1) fail(`need >=1 known-defect for ${cat}`);
  }

  const dataset = {
    datasetVersion: DATASET_VERSION,
    seed: SEED,
    order: cases.map((c) => c.caseId),
    cases,
  };

  let out = join(HERE, 'cases.json');
  const outIdx = process.argv.indexOf('--out');
  if (outIdx >= 0) {
    if (!process.argv[outIdx + 1]) fail('--out requires a path');
    out = process.argv[outIdx + 1];
  }
  writeFileSync(out, JSON.stringify(dataset, null, 2) + '\n');
  console.log(`cases=${cases.length} knownGood=${goods.length} out=${out}`);
  for (const c of cases) {
    const seed = c.defectSeed ? `${c.defectSeed.category}/${c.defectSeed.level}` : '-';
    console.log(`  ${c.caseId} ${c.fixtureId}/${c.system} ${c.origin} ${seed}`);
  }
}

main();
