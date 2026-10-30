// Typodeck Phase 4 — evaluation harness (EVALUATION.md §4 target interface).
//
//   node dist/scripts/eval.js fixtures [--token-env GITHUB_TOKEN]
//     Re-verify F1/F2/F3 (repo + branch + README live via the GitHub API),
//     refresh HEAD SHAs in evals/fixtures.json, record the pin date. F4 is
//     untouched (inline/recorded idea text).
//
//   node dist/scripts/eval.js run [--lang ko|en|all] [--direction <id>|all]
//       [--fixture F1] [--seed 42]
//     Full matrix (default 4 fixtures x 2 langs x 3 systems = 24 runs).
//     Per run: planDeck (live GitHub for repos, recorded text for F4),
//     export PPTX bytes, structural-validate, compute metrics. Writes one
//     JSON + one .pptx per run under evals/reports/.
//     Exit 0 iff every attempted run succeeded end-to-end.
//
//   node dist/scripts/eval.js report
//     Aggregate evals/reports/*.json -> evals/summary.json with pass/fail
//     per PRD S1-S7 plus P95 latency. Exit 0 iff all criteria pass.
//
// Metric definitions (thresholds documented here because EVALUATION.md
// names none for diversity):
//   forbiddenCount  validator "forbidden element" hits (non-textbox
//                   shapes/lines/images in PPTX XML). Pass: 0.
//   editability     editable a:t chars / all a:t chars (shapes carrying
//                   noTxEdt="1" count as non-editable). Pass: 1.0.
//   overflowCount   validator "exceeds slide bounds" hits. The layout engine
//                   fits every box, so bounds violations are the observable
//                   overflow signal; no separate clipping detector exists.
//                   Pass: 0.
//   evidenceCoverage (repo) factual claims (verified+suggestion) with >=1
//                   valid ref / all factual claims. A ref is valid when its
//                   path was ingested and its line range is in bounds.
//                   Vacuous (no factual claims) scores 1.0 with n=0 noted.
//   unsupportedClaims (repo) factual claims with no valid ref. Pass: <=1/deck.
//                   (idea) fabricated refs = caption refs not pointing at
//                   idea.txt (in-bounds). Pass: 0, plus every caption must
//                   carry an "unverified" label.
//   diversity       per (fixture, lang) system pair: differ in >=2 of
//                   {mean blocks/slide differs by >=0.5; median title size
//                   differs relatively by >=15%; L1 distance of the
//                   (left,center,right) alignment-fraction vectors >=0.2}.
//   latencyMs       planDeck wall time (submit -> deck). S7: P95 <= 120 s.
//   success         run completed without exception, >=5 slides, PPTX bytes
//                   exported, structural validation ok.
import JSZip from 'jszip';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import type { ClaimRef } from '../src/evidence';
import { exportToPptxBuffer } from '../src/export';
import { planDeck, type PlanDeckInput } from '../src/narrative';
import type { Deck } from '../src/schema';
import { SYSTEM_IDS, type SystemId } from '../src/systems';
import { validatePptxBytes } from '../src/validate';

const LANGS = ['ko', 'en'] as const;
type Lang = (typeof LANGS)[number];

const DEFAULT_SEED = 42;
const SLIDES_MIN = 5;
const LATENCY_P95_BUDGET_MS = 120_000;

// Diversity thresholds (see header comment).
const DIVERGE_BLOCKS_MEAN = 0.5;
const DIVERGE_HEADLINE_REL = 0.15;
const DIVERGE_ALIGN_L1 = 0.2;

function repoRoot(): string {
  // dist/scripts/eval.js -> packages/core/dist/scripts -> repo root.
  return path.resolve(__dirname, '..', '..', '..', '..');
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

interface RepoFixture {
  id: string;
  type: string;
  repo: string;
  url: string;
  branch: string;
  commit_sha: string;
  readme?: { path: string; words: number };
  notes?: string;
}

interface IdeaFixture {
  id: string;
  type: string;
  text: string;
  notes?: string;
}

type Fixture = RepoFixture | IdeaFixture;

function isRepoFixture(f: Fixture): f is RepoFixture {
  return 'repo' in f;
}

interface FixturesFile {
  pinned_at?: string;
  verification?: string;
  fixtures: Fixture[];
}

async function loadFixtures(root: string): Promise<{ doc: FixturesFile; path: string }> {
  const p = path.join(root, 'evals', 'fixtures.json');
  const doc = JSON.parse(await fs.readFile(p, 'utf8')) as FixturesFile;
  return { doc, path: p };
}

// ---------------------------------------------------------------------------
// Pure metric helpers (exported for tests)
// ---------------------------------------------------------------------------

export interface AlignmentMix {
  left: number;
  center: number;
  right: number;
}

export interface DiversityFeatures {
  blocksPerSlide: number[];
  meanBlocksPerSlide: number;
  medianHeadlineSize: number;
  alignmentMix: AlignmentMix;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Nearest-rank percentile (p in (0,1]). Returns 0 for empty input. */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const rank = Math.min(s.length, Math.max(1, Math.ceil(p * s.length)));
  return s[rank - 1];
}

export function diversityFeatures(deck: Deck): DiversityFeatures {
  const blocksPerSlide = deck.slides.map((s) => s.blocks.length);
  const meanBlocksPerSlide =
    blocksPerSlide.reduce((a, b) => a + b, 0) / Math.max(1, blocksPerSlide.length);
  const headlineSizes = deck.slides.flatMap((s) =>
    s.blocks.filter((b) => b.role === 'title').map((b) => b.fontSize),
  );
  let left = 0;
  let center = 0;
  let right = 0;
  for (const s of deck.slides) {
    for (const b of s.blocks) {
      if (b.align === 'left') left += 1;
      else if (b.align === 'center') center += 1;
      else right += 1;
    }
  }
  const total = Math.max(1, left + center + right);
  return {
    blocksPerSlide,
    meanBlocksPerSlide,
    medianHeadlineSize: median(headlineSizes),
    alignmentMix: { left: left / total, center: center / total, right: right / total },
  };
}

export interface PairwiseDiversity {
  blocksDiffer: boolean;
  headlineDiffer: boolean;
  alignDiffer: boolean;
  differCount: number;
  pass: boolean;
}

export function pairwiseDiversity(a: DiversityFeatures, b: DiversityFeatures): PairwiseDiversity {
  const blocksDiffer = Math.abs(a.meanBlocksPerSlide - b.meanBlocksPerSlide) >= DIVERGE_BLOCKS_MEAN;
  const denom = Math.max(a.medianHeadlineSize, b.medianHeadlineSize);
  const headlineDiffer =
    denom > 0 && Math.abs(a.medianHeadlineSize - b.medianHeadlineSize) / denom >= DIVERGE_HEADLINE_REL;
  const alignDiffer =
    Math.abs(a.alignmentMix.left - b.alignmentMix.left) +
      Math.abs(a.alignmentMix.center - b.alignmentMix.center) +
      Math.abs(a.alignmentMix.right - b.alignmentMix.right) >=
    DIVERGE_ALIGN_L1;
  const differCount = [blocksDiffer, headlineDiffer, alignDiffer].filter(Boolean).length;
  return { blocksDiffer, headlineDiffer, alignDiffer, differCount, pass: differCount >= 2 };
}

/** A parsed caption ref segment: path + optional 1-based line range. */
export interface ParsedRef {
  path: string;
  lines?: [number, number];
}

/**
 * Parse "Source:"/"출처:" caption segments into refs. Non-source captions
 * (proposal/unverified bare labels) yield []. Trailing honesty tags
 * ("· unverified ...") are stripped before parsing.
 */
export function parseCaptionRefs(caption: string): ParsedRef[] {
  const m = caption.match(/^(?:Source|출처):\s*(.+)$/s);
  if (!m) return [];
  const out: ParsedRef[] = [];
  for (const seg of m[1].split(';')) {
    const head = seg.split('·')[0].trim();
    if (head === '') continue;
    const lm = head.match(/^(.*?)(?::(\d+)(?:–(\d+))?)?$/);
    if (!lm || lm[1].trim() === '') continue;
    const p: ParsedRef = { path: lm[1].trim() };
    if (lm[2] !== undefined) {
      const a = Number(lm[2]);
      const b = lm[3] !== undefined ? Number(lm[3]) : a;
      p.lines = [a, b];
    }
    out.push(p);
  }
  return out;
}

/** Valid when the path was ingested and the line range is in bounds. */
export function refIsValid(ref: ClaimRef | ParsedRef, fileLines: Map<string, number>): boolean {
  const total = fileLines.get(ref.path);
  if (total === undefined) return false;
  if (!ref.lines) return true;
  const [a, b] = ref.lines;
  return Number.isInteger(a) && Number.isInteger(b) && a >= 1 && b >= a && b <= total;
}

/** Count a:t chars, splitting shapes locked with noTxEdt="1" (non-editable). */
export function editabilityOfSlideXml(xml: string): { editable: number; locked: number } {
  const countT = (s: string): number =>
    [...s.matchAll(/<a:t>([^<]*)<\/a:t>/g)].reduce((a, mm) => a + mm[1].length, 0);
  let editable = 0;
  let locked = 0;
  for (const shape of xml.match(/<p:sp[\s>][\s\S]*?<\/p:sp>/g) ?? []) {
    const chars = countT(shape);
    if (/<a:spLocks[^>]*noTxEdt="1"/.test(shape)) locked += chars;
    else editable += chars;
  }
  return { editable, locked };
}

// ---------------------------------------------------------------------------
// Per-run evaluation
// ---------------------------------------------------------------------------

export interface RunMetrics {
  forbiddenCount: number;
  otherErrorCount: number;
  validatorOk: boolean;
  validatorErrors: string[];
  editableChars: number;
  totalChars: number;
  editability: number;
  overflowCount: number;
  factualClaims: number;
  factualWithValidRef: number;
  evidenceCoverage: number;
  unsupportedClaims: number;
  fabricatedRefs: number;
  unlabeledCaptions: number;
  slidesWithValidRef: number;
  slideEvidenceCoverage: number;
  contentSlidesWithValidRef: number;
  contentSlideEvidenceCoverage: number;
}

export interface RunReport {
  fixture: string;
  fixtureType: string;
  pinnedSha: string | null;
  observedSha: string | null;
  branch: string | null;
  direction: string;
  lang: string;
  provider: string;
  generatedBy: string;
  seed: number;
  slideCount: number;
  textBoxCount: number;
  pptxBytes: number;
  claimCounts: { total: number; verified: number; suggestion: number; ungrounded: number };
  metrics: RunMetrics;
  features: DiversityFeatures;
  warnings: string[];
  latencyMs: number;
  exportMs: number;
  success: boolean;
  error: string | null;
  timestamp: string;
}

function deckContentChars(deck: Deck): number {
  return deck.slides.flatMap((s) => s.blocks).reduce((a, b) => a + b.content.length, 0);
}

async function evaluatePptxBytes(
  buffer: Buffer,
  expectedChars: number,
): Promise<{
  forbiddenCount: number;
  otherErrorCount: number;
  validatorOk: boolean;
  validatorErrors: string[];
  overflowCount: number;
  editableChars: number;
  totalChars: number;
  editability: number;
}> {
  const check = await validatePptxBytes(buffer, expectedChars);
  const isForbidden = (e: string): boolean => e.includes('forbidden element');
  const isOverflow = (e: string): boolean => e.includes('exceeds slide bounds');
  const forbiddenCount = check.errors.filter(isForbidden).length;
  const overflowCount = check.errors.filter(isOverflow).length;
  const otherErrorCount = check.errors.filter((e) => !isForbidden(e) && !isOverflow(e)).length;

  const zip = await JSZip.loadAsync(buffer);
  let editableChars = 0;
  let lockedChars = 0;
  const names = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort();
  for (const name of names) {
    const xml = (await zip.file(name)?.async('string')) ?? '';
    const { editable, locked } = editabilityOfSlideXml(xml);
    editableChars += editable;
    lockedChars += locked;
  }
  const totalChars = editableChars + lockedChars;
  return {
    forbiddenCount,
    otherErrorCount,
    validatorOk: check.ok,
    validatorErrors: check.errors,
    overflowCount,
    editableChars,
    totalChars,
    editability: totalChars === 0 ? 0 : editableChars / totalChars,
  };
}

export async function runOne(
  fixture: Fixture,
  lang: Lang,
  system: SystemId,
  seed: number,
): Promise<{ report: RunReport; pptx: Buffer | null }> {
  const timestamp = new Date().toISOString();
  const base: Omit<RunReport, 'metrics'> = {
    fixture: fixture.id,
    fixtureType: fixture.type,
    pinnedSha: isRepoFixture(fixture) ? fixture.commit_sha : null,
    observedSha: null,
    branch: isRepoFixture(fixture) ? fixture.branch : null,
    direction: system,
    lang,
    provider: 'unknown',
    generatedBy: 'unknown',
    seed,
    slideCount: 0,
    textBoxCount: 0,
    pptxBytes: 0,
    claimCounts: { total: 0, verified: 0, suggestion: 0, ungrounded: 0 },
    features: {
      blocksPerSlide: [],
      meanBlocksPerSlide: 0,
      medianHeadlineSize: 0,
      alignmentMix: { left: 0, center: 0, right: 0 },
    },
    warnings: [],
    latencyMs: 0,
    exportMs: 0,
    success: false,
    error: null,
    timestamp,
  };
  const fail = (error: string): { report: RunReport; pptx: Buffer | null } => ({
    report: {
      ...base,
      metrics: {
        forbiddenCount: 0,
        otherErrorCount: 0,
        validatorOk: false,
        validatorErrors: [],
        editableChars: 0,
        totalChars: 0,
        editability: 0,
        overflowCount: 0,
        factualClaims: 0,
        factualWithValidRef: 0,
        evidenceCoverage: 0,
        unsupportedClaims: 0,
        fabricatedRefs: 0,
        unlabeledCaptions: 0,
        slidesWithValidRef: 0,
        slideEvidenceCoverage: 0,
        contentSlidesWithValidRef: 0,
        contentSlideEvidenceCoverage: 0,
      },
      error,
    },
    pptx: null,
  });

  try {
    const input: PlanDeckInput = isRepoFixture(fixture)
      ? (() => {
          const [owner, repo] = fixture.repo.split('/');
          return { type: 'repo' as const, owner, repo };
        })()
      : { type: 'idea' as const, text: (fixture as IdeaFixture).text };
    const branch = isRepoFixture(fixture) ? fixture.branch : undefined;

    const t0 = Date.now();
    const result = await planDeck(input, { system, lang, seed, ...(branch ? { branch } : {}) });
    const latencyMs = Date.now() - t0;

    const t1 = Date.now();
    const { buffer } = await exportToPptxBuffer(result.deck);
    const exportMs = Date.now() - t1;

    const pptx = evaluatePptxBytes(buffer, deckContentChars(result.deck));
    const e = await pptx;

    // Evidence: claim level.
    const fileLines = new Map<string, number>(result.ingested.files.map((f) => [f.path, f.lines]));
    const factual = result.claims.filter((c) => c.kind === 'verified' || c.kind === 'suggestion');
    const factualWithValidRef = factual.filter((c) => c.refs.some((r) => refIsValid(r, fileLines))).length;
    const evidenceCoverage = factual.length === 0 ? 1 : factualWithValidRef / factual.length;
    const unsupportedClaims = factual.length - factualWithValidRef;

    // Evidence: slide level (parse caption "Source:" refs from the narrative).
    const captions = result.narrative.slides.map(
      (s) => s.blocks.find((b) => b.role === 'caption')?.content ?? '',
    );
    const slideValid = captions.map((cap) => {
      const refs = parseCaptionRefs(cap);
      return refs.length > 0 && refs.some((r) => refIsValid(r, fileLines));
    });
    const slidesWithValidRef = slideValid.filter(Boolean).length;
    const contentIdx = result.narrative.slides.map((_, i) => i).slice(1, -1);
    const contentValid = contentIdx.filter((i) => slideValid[i]).length;

    // Idea-mode honesty: no fabricated refs, every caption labeled.
    let fabricatedRefs = 0;
    let unlabeledCaptions = 0;
    if (result.ingested.kind === 'idea') {
      for (const cap of captions) {
        if (cap === '') continue; // cover/closing carry no caption by design
        for (const r of parseCaptionRefs(cap)) {
          if (!refIsValid(r, fileLines)) fabricatedRefs += 1;
        }
        if (!/unverified/i.test(cap)) unlabeledCaptions += 1;
      }
      // Claim-level refs must also stay inside idea.txt.
      for (const c of result.claims) {
        for (const r of c.refs) {
          if (!refIsValid(r, fileLines)) fabricatedRefs += 1;
        }
      }
    }

    const slideCount = result.deck.slides.length;
    const textBoxCount = result.deck.slides.reduce((a, s) => a + s.blocks.length, 0);
    const success = slideCount >= SLIDES_MIN && e.validatorOk;
    return {
      report: {
        ...base,
        observedSha: result.ingested.kind === 'repo' ? result.ingested.sha : null,
        provider: result.provenance.provider,
        generatedBy: result.provenance.generatedBy,
        slideCount,
        textBoxCount,
        pptxBytes: buffer.length,
        claimCounts: { ...result.provenance.claims },
        metrics: {
          forbiddenCount: e.forbiddenCount,
          otherErrorCount: e.otherErrorCount,
          validatorOk: e.validatorOk,
          validatorErrors: e.validatorErrors,
          editableChars: e.editableChars,
          totalChars: e.totalChars,
          editability: e.editability,
          overflowCount: e.overflowCount,
          factualClaims: factual.length,
          factualWithValidRef,
          evidenceCoverage,
          unsupportedClaims,
          fabricatedRefs,
          unlabeledCaptions,
          slidesWithValidRef,
          slideEvidenceCoverage: slideCount === 0 ? 0 : slidesWithValidRef / slideCount,
          contentSlidesWithValidRef: contentValid,
          contentSlideEvidenceCoverage:
            contentIdx.length === 0 ? 1 : contentValid / contentIdx.length,
        },
        features: diversityFeatures(result.deck),
        warnings: [...result.provenance.warnings],
        latencyMs,
        exportMs,
        success,
        error: success ? null : `end-to-end gate failed (slides=${slideCount}, validatorOk=${e.validatorOk})`,
      },
      pptx: buffer,
    };
  } catch (err) {
    return fail(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
  }
}

// ---------------------------------------------------------------------------
// `run` subcommand: full matrix
// ---------------------------------------------------------------------------

function flagValue(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i < 0 || i + 1 >= args.length) return undefined;
  return args[i + 1];
}

function parseRunArgs(args: string[]): { langs: Lang[]; systems: SystemId[]; fixtureId?: string; seed: number } {
  const langArg = flagValue(args, '--lang') ?? 'all';
  const dirArg = flagValue(args, '--direction') ?? 'all';
  const fixtureId = flagValue(args, '--fixture');
  const seed = Number(flagValue(args, '--seed') ?? String(DEFAULT_SEED));
  if (!Number.isInteger(seed)) throw new Error(`--seed must be an integer, got "${flagValue(args, '--seed')}"`);
  const langs: Lang[] =
    langArg === 'all' ? [...LANGS] : langArg === 'ko' || langArg === 'en' ? [langArg] : [];
  if (langs.length === 0) throw new Error(`--lang must be ko|en|all, got "${langArg}"`);
  const systems: SystemId[] =
    dirArg === 'all'
      ? [...SYSTEM_IDS]
      : (SYSTEM_IDS as readonly string[]).includes(dirArg)
        ? [dirArg as SystemId]
        : [];
  if (systems.length === 0) {
    throw new Error(`--direction must be ${SYSTEM_IDS.join('|')}|all, got "${dirArg}"`);
  }
  return { langs, systems, fixtureId, seed };
}

async function cmdRun(args: string[]): Promise<number> {
  const root = repoRoot();
  const { doc } = await loadFixtures(root);
  const { langs, systems, fixtureId, seed } = parseRunArgs(args);
  const fixtures = fixtureId ? doc.fixtures.filter((f) => f.id === fixtureId) : doc.fixtures;
  if (fixtures.length === 0) throw new Error(`no fixture matches "${fixtureId}"`);

  const reportsDir = path.join(root, 'evals', 'reports');
  await fs.mkdir(reportsDir, { recursive: true });

  let attempted = 0;
  let succeeded = 0;
  const t0 = Date.now();
  for (const fixture of fixtures) {
    for (const lang of langs) {
      for (const system of systems) {
        attempted += 1;
        const name = `${fixture.id}-${lang}-${system}`;
        process.stdout.write(`[${attempted}] ${name} ... `);
        const { report, pptx } = await runOne(fixture, lang, system, seed);
        await fs.writeFile(path.join(reportsDir, `${name}.json`), `${JSON.stringify(report, null, 2)}\n`);
        if (pptx) await fs.writeFile(path.join(reportsDir, `${name}.pptx`), pptx);
        if (report.success) succeeded += 1;
        const m = report.metrics;
        console.log(
          `${report.success ? 'OK' : 'FAIL'} slides=${report.slideCount} ` +
            `forbid=${m.forbiddenCount} edit=${m.editability.toFixed(3)} over=${m.overflowCount} ` +
            `cov=${m.evidenceCoverage.toFixed(3)} unsup=${m.unsupportedClaims} ` +
            `lat=${report.latencyMs}ms prov=${report.provider}` +
            (report.error ? ` error=${report.error}` : ''),
        );
      }
    }
  }
  console.log(`\nmatrix: ${succeeded}/${attempted} runs succeeded in ${Date.now() - t0}ms (seed=${seed})`);
  return succeeded === attempted ? 0 : 1;
}

// ---------------------------------------------------------------------------
// `report` subcommand: aggregate -> evals/summary.json
// ---------------------------------------------------------------------------

interface CriterionVerdict {
  pass: boolean;
  value: string;
  target: string;
  detail: string;
}

interface PairVerdict {
  fixture: string;
  lang: string;
  a: string;
  b: string;
  blocksDiffer: boolean;
  headlineDiffer: boolean;
  alignDiffer: boolean;
  differCount: number;
  pass: boolean;
}

interface EvalSummary {
  generatedAt: string;
  seed: number | null;
  provider: string | null;
  runs: { file: string; fixture: string; lang: string; direction: string; success: boolean }[];
  p95LatencyMs: number;
  maxLatencyMs: number;
  diversityPairs: PairVerdict[];
  s1: CriterionVerdict;
  s2: CriterionVerdict;
  s3: CriterionVerdict;
  s4: CriterionVerdict;
  s5: CriterionVerdict;
  s6: CriterionVerdict;
  s7: CriterionVerdict;
  allPass: boolean;
  notes: string[];
}

export async function buildSummary(reportsDir: string): Promise<EvalSummary> {
  const files = (await fs.readdir(reportsDir)).filter((f) => f.endsWith('.json')).sort();
  const reports: Array<{ file: string; report: RunReport }> = [];
  for (const file of files) {
    try {
      const report = JSON.parse(await fs.readFile(path.join(reportsDir, file), 'utf8')) as RunReport;
      if (report && typeof report.fixture === 'string') reports.push({ file, report });
    } catch {
      // Skip unreadable files; noted below.
    }
  }
  const notes: string[] = [];
  if (reports.length < files.length) {
    notes.push(`${files.length - reports.length} unreadable report file(s) skipped`);
  }

  const ok = reports.filter((r) => r.report.success);
  const repoRuns = reports.filter((r) => r.report.fixtureType !== 'raw idea');
  const repoOk = repoRuns.filter((r) => r.report.success);
  const ideaRuns = reports.filter((r) => r.report.fixtureType === 'raw idea');

  // S1: end-to-end success rate >= 90%.
  const s1Rate = reports.length === 0 ? 0 : ok.length / reports.length;
  const s1: CriterionVerdict = {
    pass: reports.length > 0 && s1Rate >= 0.9,
    value: `${ok.length}/${reports.length} (${(s1Rate * 100).toFixed(1)}%)`,
    target: '>= 90%',
    detail: 'success = completed + >=5 slides + PPTX exported + structural validation ok',
  };

  // S2: slides with >=1 valid evidence ref (Repo) >= 80% (micro-average).
  const repoSlides = repoOk.reduce((a, r) => a + r.report.slideCount, 0);
  const repoSlidesRef = repoOk.reduce((a, r) => a + r.report.metrics.slidesWithValidRef, 0);
  const s2Rate = repoSlides === 0 ? 0 : repoSlidesRef / repoSlides;
  const contentSlides = repoOk.reduce(
    (a, r) => a + (r.report.slideCount >= 2 ? r.report.slideCount - 2 : 0),
    0,
  );
  const contentRef = repoOk.reduce((a, r) => a + r.report.metrics.contentSlidesWithValidRef, 0);
  const s2: CriterionVerdict = {
    pass: repoSlides > 0 && s2Rate >= 0.8,
    value: `${repoSlidesRef}/${repoSlides} (${(s2Rate * 100).toFixed(1)}%)`,
    target: '>= 80%',
    detail:
      `micro-average over ${repoOk.length} successful repo run(s); ` +
      `content slides (excl. cover/closing): ${contentRef}/${contentSlides}` +
      (contentSlides > 0 ? ` (${((contentRef / contentSlides) * 100).toFixed(1)}%)` : ''),
  };

  // S3: unsupported factual claims per repo deck <= 1.
  const maxUnsup = repoOk.reduce((a, r) => Math.max(a, r.report.metrics.unsupportedClaims), 0);
  const meanUnsup =
    repoOk.length === 0 ? 0 : repoOk.reduce((a, r) => a + r.report.metrics.unsupportedClaims, 0) / repoOk.length;
  const s3: CriterionVerdict = {
    pass: repoOk.length > 0 && maxUnsup <= 1,
    value: `max ${maxUnsup}/deck, mean ${meanUnsup.toFixed(2)}`,
    target: '<= 1/deck',
    detail: `factual (verified+suggestion) claims with no valid ref, over ${repoOk.length} repo run(s)`,
  };

  // S4/S5/S6 over successful runs (failed runs already fail S1).
  const maxForbid = ok.reduce((a, r) => Math.max(a, r.report.metrics.forbiddenCount), 0);
  const s4: CriterionVerdict = {
    pass: ok.length > 0 && maxForbid === 0,
    value: `max ${maxForbid}/deck`,
    target: '0',
    detail: 'non-textbox shapes/lines/images in PPTX XML',
  };
  const minEdit = ok.reduce((a, r) => Math.min(a, r.report.metrics.editability), 1);
  const s5: CriterionVerdict = {
    pass: ok.length > 0 && minEdit === 1,
    value: `min ${(minEdit * 100).toFixed(2)}%`,
    target: '100%',
    detail: 'editable chars / total visible chars',
  };
  const maxOverflow = ok.reduce((a, r) => Math.max(a, r.report.metrics.overflowCount), 0);
  const s6: CriterionVerdict = {
    pass: ok.length > 0 && maxOverflow === 0,
    value: `max ${maxOverflow}/deck`,
    target: '0',
    detail: 'text boxes exceeding slide bounds (layout engine fits every box; no separate clip detector)',
  };

  // S7: P95 latency <= 120 s.
  const latencies = ok.map((r) => r.report.latencyMs);
  const p95 = percentile(latencies, 0.95);
  const maxLat = latencies.length === 0 ? 0 : Math.max(...latencies);
  const s7: CriterionVerdict = {
    pass: ok.length > 0 && p95 <= LATENCY_P95_BUDGET_MS,
    value: `p95 ${p95}ms, max ${maxLat}ms (n=${latencies.length})`,
    target: '<= 120000ms',
    detail: 'planDeck wall time (submit -> deck), successful runs only',
  };

  // Diversity: pairwise per (fixture, lang) group over successful runs.
  const groups = new Map<string, Array<{ direction: string; features: DiversityFeatures }>>();
  for (const { report } of ok) {
    const key = `${report.fixture}|${report.lang}`;
    const list = groups.get(key) ?? [];
    list.push({ direction: report.direction, features: report.features });
    groups.set(key, list);
  }
  const diversityPairs: PairVerdict[] = [];
  for (const [key, list] of [...groups.entries()].sort()) {
    const [fixture, lang] = key.split('|');
    const sorted = [...list].sort((a, b) => a.direction.localeCompare(b.direction));
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const d = pairwiseDiversity(sorted[i].features, sorted[j].features);
        diversityPairs.push({
          fixture,
          lang,
          a: sorted[i].direction,
          b: sorted[j].direction,
          blocksDiffer: d.blocksDiffer,
          headlineDiffer: d.headlineDiffer,
          alignDiffer: d.alignDiffer,
          differCount: d.differCount,
          pass: d.pass,
        });
      }
    }
  }
  const failedPairs = diversityPairs.filter((p) => !p.pass);
  if (failedPairs.length > 0) {
    notes.push(
      `design-diversity FAIL on ${failedPairs.length}/${diversityPairs.length} pair(s): ` +
        failedPairs.map((p) => `${p.fixture}/${p.lang} ${p.a}~${p.b}`).join(', '),
    );
  } else if (diversityPairs.length > 0) {
    notes.push(
      `design-diversity PASS on all ${diversityPairs.length} pair(s) ` +
        `(>=2 of blocks-mean>=${DIVERGE_BLOCKS_MEAN}, headline-rel>=${DIVERGE_HEADLINE_REL}, align-L1>=${DIVERGE_ALIGN_L1})`,
    );
  }

  // Idea-mode honesty is a PRD gate (not numbered S1-S7): record it.
  const maxFab = ideaRuns.reduce((a, r) => Math.max(a, r.report.metrics.fabricatedRefs), 0);
  const maxUnlabeled = ideaRuns.reduce((a, r) => Math.max(a, r.report.metrics.unlabeledCaptions), 0);
  notes.push(
    `idea mode: max fabricated refs ${maxFab} (target 0), max unlabeled captions ${maxUnlabeled} (target 0), over ${ideaRuns.length} run(s)`,
  );
  const shaDrift = repoRuns.filter(
    (r) => r.report.pinnedSha && r.report.observedSha && r.report.pinnedSha !== r.report.observedSha,
  );
  if (shaDrift.length > 0) {
    notes.push(
      `SHA drift (branch moved since pinning) on ${shaDrift.length} run(s): ` +
        [...new Set(shaDrift.map((r) => r.report.fixture))].join(', '),
    );
  }

  const seeds = new Set(ok.map((r) => r.report.seed));
  const providers = new Set(ok.map((r) => r.report.provider));
  const allPass =
    s1.pass && s2.pass && s3.pass && s4.pass && s5.pass && s6.pass && s7.pass && failedPairs.length === 0;
  return {
    generatedAt: new Date().toISOString(),
    seed: seeds.size === 1 ? [...seeds][0] : null,
    provider: providers.size === 1 ? [...providers][0] : null,
    runs: reports.map((r) => ({
      file: r.file,
      fixture: r.report.fixture,
      lang: r.report.lang,
      direction: r.report.direction,
      success: r.report.success,
    })),
    p95LatencyMs: p95,
    maxLatencyMs: maxLat,
    diversityPairs,
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    s7,
    allPass,
    notes,
  };
}

async function cmdReport(): Promise<number> {
  const root = repoRoot();
  const summary = await buildSummary(path.join(root, 'evals', 'reports'));
  const outPath = path.join(root, 'evals', 'summary.json');
  await fs.writeFile(outPath, `${JSON.stringify(summary, null, 2)}\n`);
  const line = (id: string, v: CriterionVerdict): string =>
    `${id}: ${v.pass ? 'PASS' : 'FAIL'} value=${v.value} target=${v.target}`;
  console.log(`wrote ${outPath} (${summary.runs.length} runs)`);
  for (const [id, v] of [
    ['S1', summary.s1],
    ['S2', summary.s2],
    ['S3', summary.s3],
    ['S4', summary.s4],
    ['S5', summary.s5],
    ['S6', summary.s6],
    ['S7', summary.s7],
  ] as const) {
    console.log(line(id, v));
  }
  for (const n of summary.notes) console.log(`note: ${n}`);
  const failedPairs = summary.diversityPairs.filter((p) => !p.pass).length;
  console.log(
    `diversity: ${summary.diversityPairs.length - failedPairs}/${summary.diversityPairs.length} pairs pass`,
  );
  console.log(summary.allPass ? 'OVERALL: PASS' : 'OVERALL: FAIL');
  return summary.allPass ? 0 : 1;
}

// ---------------------------------------------------------------------------
// `fixtures` subcommand: re-verify + re-pin F1/F2/F3
// ---------------------------------------------------------------------------

interface GitHubJson {
  status: number;
  json: unknown;
  text: string;
}

async function ghGet(url: string, token?: string): Promise<GitHubJson> {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'typodeck-eval',
  };
  if (token) headers['authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  const text = await res.text().catch(() => '');
  let json: unknown = null;
  try {
    json = JSON.parse(text) as unknown;
  } catch {
    /* leave null */
  }
  return { status: res.status, json, text };
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

async function cmdFixtures(args: string[]): Promise<number> {
  const root = repoRoot();
  const { doc, path: fixturesPath } = await loadFixtures(root);
  const tokenEnv = flagValue(args, '--token-env');
  const token = tokenEnv ? (process.env[tokenEnv] ?? '').trim() || undefined : undefined;
  if (tokenEnv && !token) console.log(`note: ${tokenEnv} is empty; continuing unauthenticated`);

  let failed = 0;
  for (const fixture of doc.fixtures) {
    if (!isRepoFixture(fixture)) {
      console.log(`${fixture.id}: raw idea, inline text kept as-is`);
      continue;
    }
    const f = fixture;
    const [owner, repo] = f.repo.split('/');
    try {
      const meta = await ghGet(`https://api.github.com/repos/${owner}/${repo}`, token);
      if (meta.status !== 200 || !isRecord(meta.json)) {
        throw new Error(`repo metadata HTTP ${meta.status}`);
      }
      if (meta.json['private'] === true) throw new Error('repo is private');
      const defaultBranch = String(meta.json['default_branch'] ?? 'main');

      let branch = f.branch;
      let head = await ghGet(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, token);
      if (head.status === 404) {
        console.log(`${f.id}: pinned branch "${branch}" gone; falling back to default "${defaultBranch}"`);
        branch = defaultBranch;
        head = await ghGet(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, token);
      }
      if (head.status !== 200 || !isRecord(head.json) || !isRecord(head.json['commit'])) {
        throw new Error(`branch lookup HTTP ${head.status}`);
      }
      const sha = String(head.json['commit']['sha'] ?? '');
      if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error('branch HEAD has no valid sha');

      const tree = await ghGet(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        token,
      );
      if (tree.status !== 200 || !isRecord(tree.json) || !Array.isArray(tree.json['tree'])) {
        throw new Error(`tree HTTP ${tree.status}`);
      }
      const entries = (tree.json['tree'] as Array<{ path?: string; type?: string }>)
        .filter((e) => e.type === 'blob' && typeof e.path === 'string')
        .map((e) => e.path as string);
      const readmePath =
        entries.find((p) => p.toLowerCase() === (f.readme?.path ?? '').toLowerCase()) ??
        entries.find((p) => /^readme(\..*)?$/i.test(p.split('/').pop() ?? ''));
      if (!readmePath) throw new Error('no README found in tree');
      const raw = await ghGet(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${readmePath}`, token);
      if (raw.status !== 200) throw new Error(`README fetch HTTP ${raw.status}`);
      const words = countWords(raw.text);

      const moved = sha !== f.commit_sha;
      f.branch = branch;
      f.commit_sha = sha;
      f.readme = { path: readmePath, words };
      console.log(
        `${f.id}: ${f.repo}@${branch} sha=${sha.slice(0, 12)}${moved ? ' (MOVED, refreshed)' : ' (unchanged)'} ` +
          `readme=${readmePath} words=${words} default_branch=${defaultBranch}`,
      );
    } catch (err) {
      failed += 1;
      console.log(`${f.id}: FAILED to re-pin (${err instanceof Error ? err.message : String(err)}); pin kept`);
    }
  }

  if (failed === 0) {
    doc.pinned_at = new Date().toISOString().slice(0, 10);
    doc.verification =
      `Repo URLs, branches, README paths/word counts, and HEAD commit SHAs re-verified live ` +
      `via the GitHub API on ${doc.pinned_at}. SHAs are HEAD-at-pinning-time (branches move); re-pin before eval runs.`;
    await fs.writeFile(fixturesPath, `${JSON.stringify(doc, null, 2)}\n`);
    console.log(`wrote ${fixturesPath} (pinned_at=${doc.pinned_at})`);
  } else {
    console.log(`kept ${fixturesPath} unchanged (${failed} fixture(s) failed to re-pin)`);
  }
  return failed === 0 ? 0 : 1;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function usage(): string {
  return [
    'Usage: eval <fixtures|run|report> [flags]',
    '  fixtures [--token-env VAR]                 re-verify + re-pin repo fixtures',
    '  run [--lang ko|en|all] [--direction <id>|all] [--fixture F1] [--seed 42]',
    '  report                                     aggregate reports -> evals/summary.json',
  ].join('\n');
}

export async function main(argv: string[]): Promise<number> {
  const [sub, ...rest] = argv;
  try {
    if (sub === 'fixtures') return await cmdFixtures(rest);
    if (sub === 'run') return await cmdRun(rest);
    if (sub === 'report') return await cmdReport();
    console.error(usage());
    return 2;
  } catch (err) {
    console.error(`eval failed: ${err instanceof Error ? err.message : String(err)}`);
    return 1;
  }
}

if (require.main === module) {
  void main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
