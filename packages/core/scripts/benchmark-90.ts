// Typodeck 90+ — reproducible benchmark (§8).
// SAME narratives feed baseline and improved modes (paired comparison).
// Held-out fixtures: evals/benchmark-90/fixtures.json (never used for tuning).
//
//   node dist/scripts/benchmark-90.js [--out output/benchmark-90] [--seed 42]
//
// Exit 0 iff every run succeeds end-to-end structurally. Exit code says
// NOTHING about improved-vs-baseline winning; deltas are reported honestly
// in summary.json (including baseline-better cases and failures).

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { planArtDirection } from '../src/art-direction';
import { critiqueDeck } from '../src/critic';
import { estimateWrap, layoutDeck } from '../src/layout';
import { planNarrative } from '../src/narrative';
import { acceptIdea } from '../src/ingestion';
import { extractClaims } from '../src/evidence';
import { applyOpticalCorrections } from '../src/optical';
import { exportToPptxBuffer } from '../src/export';
import { validateDeck, type Deck, type Narrative } from '../src/schema';
import { SYSTEM_IDS, type SystemId } from '../src/systems';
import { validatePptxBytes } from '../src/validate';

interface BenchmarkFixture {
  id: string;
  lang: string;
  purpose?: string;
  notes?: string;
  text: string;
}

interface RunMetrics {
  fixture: string;
  lang: string;
  system: SystemId;
  mode: 'baseline' | 'improved';
  success: boolean;
  error?: string;
  slides: number;
  textBoxes: number;
  forbidden: number;
  editableChars: number;
  overflow: number;
  unsupportedMetrics: number;
  titleLineViolations: number;
  bodyMeasureViolations: number;
  widowCount: number;
  ragFlags: number;
  contrastErrors: number;
  criticErrors: number;
  criticWarnings: number;
  maxSameCandidateShare: number | null;
  tripleRepeat: boolean;
  latencyMs: number;
  pptx: string | null;
}

function countForbidden(errors: string[]): number {
  return errors.filter((e) => /p:pic|p:cxnSp|graphicFrame|p:grpSp|a:blip|contentPart|p:oleObj|c:chart|a:tbl|v:shape|gradFill|pattFill|forbidden|locked/i.test(e)).length;
}

function countOverflow(errors: string[]): number {
  return errors.filter((e) => /exceeds slide bounds/i.test(e)).length;
}

function deckTextMetrics(deck: Deck): Pick<RunMetrics, 'titleLineViolations' | 'bodyMeasureViolations' | 'widowCount' | 'ragFlags' | 'unsupportedMetrics'> {
  let titleLineViolations = 0;
  let bodyMeasureViolations = 0;
  let widowCount = 0;
  let ragFlags = 0;
  let unsupportedMetrics = 0;
  for (const s of deck.slides) {
    for (const b of s.blocks) {
      const lines = estimateWrap(b.content, b.fontSize, b.w, b.tracking, b.lineHeight, b.fontWeight >= 700).lines;
      if (b.role === 'title' && lines.length > 2) titleLineViolations++;
      if (b.role === 'body' && Math.max(...lines.map((l) => l.length)) > 60) bodyMeasureViolations++;
      const trimmed = lines.map((l) => l.trim()).filter((l) => l.length > 0);
      if (trimmed.length > 1 && trimmed[trimmed.length - 1].split(/\s+/).filter(Boolean).length <= 2) widowCount++;
      if ((b.role === 'title' || b.role === 'number') && lines.length > 1) {
        const widths = lines.map((l) => l.trim().length);
        let ladder = false;
        for (let i = 0; i + 2 < widths.length; i++) {
          if (widths[i] > widths[i + 1] && widths[i + 1] > widths[i + 2]) ladder = true;
        }
        if (ladder) ragFlags++;
      }
    }
    const hasNumber = s.blocks.some((b) => b.role === 'number');
    const hasRef = s.blocks.some((b) => b.role === 'caption' && /[:/]/.test(b.content));
    if (hasNumber && !hasRef) unsupportedMetrics++;
  }
  return { titleLineViolations, bodyMeasureViolations, widowCount, ragFlags, unsupportedMetrics };
}

async function runOne(
  narrative: Narrative, fixture: BenchmarkFixture, system: SystemId,
  mode: 'baseline' | 'improved', seed: number, outDir: string,
): Promise<RunMetrics> {
  const t0 = Date.now();
  const fail = (error: string): RunMetrics => ({
    fixture: fixture.id, lang: fixture.lang, system, mode, success: false, error,
    slides: 0, textBoxes: 0, forbidden: 0, editableChars: 0, overflow: 0,
    unsupportedMetrics: 0, titleLineViolations: 0, bodyMeasureViolations: 0,
    widowCount: 0, ragFlags: 0, contrastErrors: 0, criticErrors: 0, criticWarnings: 0,
    maxSameCandidateShare: null, tripleRepeat: false, latencyMs: Date.now() - t0, pptx: null,
  });
  try {
    let deck: Deck;
    let candidateIds: string[] | null = null;
    let criticErrors = 0;
    let criticWarnings = 0;
    let contrastErrors = 0;
    if (mode === 'baseline') {
      deck = layoutDeck(narrative, system, { seed });
      validateDeck(deck);
    } else {
      const art = planArtDirection(narrative, system, { audience: fixture.purpose });
      const plan = art.slides.map((s) => ({
        slideId: s.slideId, semanticType: s.semanticType, candidateId: s.candidateId,
        rationale: `benchmark improved: ${s.candidateId} (${s.rhythmNote})`, score: 0,
      }));
      candidateIds = plan.map((p) => p.candidateId);
      const laid = layoutDeck(narrative, system, { seed, compositionPlan: plan });
      const corrected = applyOpticalCorrections(laid, { tiers: ['measurable', 'heuristic'] });
      deck = corrected.deck;
      validateDeck(deck);
      const report = critiqueDeck(deck, narrative, plan);
      criticErrors = report.findings.filter((f) => f.severity === 'error').length;
      criticWarnings = report.findings.filter((f) => f.severity === 'warning').length;
      contrastErrors = report.findings.filter((f) => f.check === 'contrast').length;
    }
    const exp = await exportToPptxBuffer(deck);
    const v = await validatePptxBytes(exp.buffer);
    const file = `${fixture.id}-${fixture.lang}-${system}-${mode}.pptx`;
    await fs.writeFile(path.join(outDir, file), exp.buffer);
    const tm = deckTextMetrics(deck);
    let maxSameCandidateShare: number | null = null;
    let tripleRepeat = false;
    if (candidateIds) {
      const counts = new Map<string, number>();
      for (const id of candidateIds) counts.set(id, (counts.get(id) ?? 0) + 1);
      maxSameCandidateShare = Math.max(...counts.values()) / candidateIds.length;
      for (let i = 2; i < candidateIds.length; i++) {
        if (candidateIds[i] === candidateIds[i - 1] && candidateIds[i] === candidateIds[i - 2]) tripleRepeat = true;
      }
    }
    return {
      fixture: fixture.id, lang: fixture.lang, system, mode, success: v.ok && v.errors.filter((e) => !/expected/i.test(e)).length === 0,
      error: v.ok ? undefined : v.errors.join(' | '),
      slides: deck.slides.length, textBoxes: deck.slides.reduce((a, s) => a + s.blocks.length, 0),
      forbidden: countForbidden(v.errors), editableChars: v.stats.editableChars,
      overflow: countOverflow(v.errors),
      unsupportedMetrics: tm.unsupportedMetrics,
      titleLineViolations: tm.titleLineViolations, bodyMeasureViolations: tm.bodyMeasureViolations,
      widowCount: tm.widowCount, ragFlags: tm.ragFlags, contrastErrors,
      criticErrors, criticWarnings, maxSameCandidateShare, tripleRepeat,
      latencyMs: Date.now() - t0, pptx: file,
    };
  } catch (e) {
    return fail(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf('--out');
  const seedFlag = args.indexOf('--seed');
  const seed = seedFlag >= 0 ? Number(args[seedFlag + 1]) : 42;
  const root = path.resolve(__dirname, '..', '..', '..', '..');
  const outDir = outFlag >= 0 ? path.resolve(args[outFlag + 1]) : path.join(root, 'output', 'benchmark-90');
  await fs.mkdir(outDir, { recursive: true });
  const fixturesDoc = JSON.parse(await fs.readFile(path.join(root, 'evals', 'benchmark-90', 'fixtures.json'), 'utf8')) as {
    fixtures: BenchmarkFixture[];
  };

  const runs: RunMetrics[] = [];
  for (const fixture of fixturesDoc.fixtures) {
    // SAME narrative bytes feed both modes (paired comparison).
    const ingested = acceptIdea(fixture.text);
    const claims = extractClaims(ingested);
    const narrative = planNarrative(claims, { purpose: fixture.purpose, lang: fixture.lang });
    for (const system of SYSTEM_IDS) {
      for (const mode of ['baseline', 'improved'] as const) {
        const r = await runOne(narrative, fixture, system, mode, seed, outDir);
        runs.push(r);
        console.log(`[${runs.length}] ${r.fixture}-${r.lang}-${r.system}-${r.mode} ... ${r.success ? 'OK' : 'FAIL'} slides=${r.slides} forbid=${r.forbidden} over=${r.overflow} unsupMetric=${r.unsupportedMetrics} title>2=${r.titleLineViolations} body>60=${r.bodyMeasureViolations} widow=${r.widowCount} critic=${r.criticErrors}E/${r.criticWarnings}W`);
      }
    }
  }

  // Paired deltas (improved minus baseline; negative = fewer violations).
  const pairs = [];
  for (let i = 0; i < runs.length; i += 2) {
    const b = runs[i];
    const m = runs[i + 1];
    pairs.push({
      fixture: b.fixture, lang: b.lang, system: b.system,
      baselineOk: b.success, improvedOk: m.success,
      deltaTitleLines: m.titleLineViolations - b.titleLineViolations,
      deltaBodyMeasure: m.bodyMeasureViolations - b.bodyMeasureViolations,
      deltaWidow: m.widowCount - b.widowCount,
      deltaRag: m.ragFlags - b.ragFlags,
      deltaOverflow: m.overflow - b.overflow,
      deltaForbidden: m.forbidden - b.forbidden,
      improvedRepetitionShare: m.maxSameCandidateShare,
      improvedTripleRepeat: m.tripleRepeat,
      baselineBetterOn: [
        ...(m.titleLineViolations > b.titleLineViolations ? ['title-lines'] : []),
        ...(m.bodyMeasureViolations > b.bodyMeasureViolations ? ['body-measure'] : []),
        ...(m.widowCount > b.widowCount ? ['widow'] : []),
        ...(m.ragFlags > b.ragFlags ? ['rag'] : []),
        ...(m.overflow > b.overflow ? ['overflow'] : []),
      ],
    });
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    seed,
    modes: ['baseline', 'improved'],
    runs: runs.length,
    successBaseline: runs.filter((r) => r.mode === 'baseline' && r.success).length,
    successImproved: runs.filter((r) => r.mode === 'improved' && r.success).length,
    totals: {
      baseline: {
        forbidden: runs.filter((r) => r.mode === 'baseline').reduce((a, r) => a + r.forbidden, 0),
        overflow: runs.filter((r) => r.mode === 'baseline').reduce((a, r) => a + r.overflow, 0),
        titleLines: runs.filter((r) => r.mode === 'baseline').reduce((a, r) => a + r.titleLineViolations, 0),
        bodyMeasure: runs.filter((r) => r.mode === 'baseline').reduce((a, r) => a + r.bodyMeasureViolations, 0),
        widow: runs.filter((r) => r.mode === 'baseline').reduce((a, r) => a + r.widowCount, 0),
      },
      improved: {
        forbidden: runs.filter((r) => r.mode === 'improved').reduce((a, r) => a + r.forbidden, 0),
        overflow: runs.filter((r) => r.mode === 'improved').reduce((a, r) => a + r.overflow, 0),
        titleLines: runs.filter((r) => r.mode === 'improved').reduce((a, r) => a + r.titleLineViolations, 0),
        bodyMeasure: runs.filter((r) => r.mode === 'improved').reduce((a, r) => a + r.bodyMeasureViolations, 0),
        widow: runs.filter((r) => r.mode === 'improved').reduce((a, r) => a + r.widowCount, 0),
        criticErrors: runs.filter((r) => r.mode === 'improved').reduce((a, r) => a + r.criticErrors, 0),
        tripleRepeats: runs.filter((r) => r.mode === 'improved' && r.tripleRepeat).length,
      },
    },
    pairs,
    runDetails: runs,
    notes: [
      'Paired design: identical narrative bytes per fixture feed both modes.',
      'Font substitution is UNMEASURED (no in-repo rasterizer; needs rendered comparison).',
      'Clipping inside boxes is UNMEASURED (bounds-only overflow signal).',
      'Human evaluation: protocol + rubric in evals/benchmark-90/; study PENDING (no reviewers yet).',
    ],
  };
  await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
  const failures = runs.filter((r) => !r.success);
  console.log(`\nmatrix: ${runs.length - failures.length}/${runs.length} runs succeeded (seed=${seed})`);
  if (failures.length > 0) {
    for (const f of failures) console.log(`FAIL ${f.fixture}-${f.lang}-${f.system}-${f.mode}: ${f.error}`);
    process.exitCode = 1;
  }
}

void main();
