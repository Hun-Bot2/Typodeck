# Typodeck — Implementation Log

## Docs release pass — Agent E (2026-10-31)

Branch `agent/e-docs`, baseline `b09865c`. Docs only; no code touched.

- Audited every maintained doc (root README, `docs/`, read-only:
  `skills/`, `showcase/`, `gallery/`, `landing/`, `evals/`,
  `research/slide-reconstruction/report.md` via `git show`):
  classifications + evidence in `docs/DOCS_AUDIT.md`. No duplicates,
  no fully obsolete docs, no broken internal links (one regex false
  positive: `` `a[i](x)` `` inline code).
- Rewrote root README in 15 sections from verified runs only; fixed
  stale guarantees (S2 `144/180 80.0%`, S7 `p95 204ms/max 624ms` per
  committed `evals/summary.json`, not the Phase 4 values).
- Reconstructed 9 ADRs (`docs/engineering/decisions/ADR-0011..0019`),
  each marked RECONSTRUCTED with file-level evidence: prior ADRs exist
  only on `docs/launch-readme@aecb800`, not on this baseline
  (verified via `merge-base`; numbering differs — reconcile at merge).
- Added dated notes to Phase 0 specs (ARCHITECTURE/PRD/EVALUATION),
  DESIGN_SYSTEM (4th system), FAQ (build-status entry),
  LANDING_COPY (page now exists), GITHUB_JOURNEY (branch-local paths);
  created `packages/core/README.md`.
- Verified: `npm ci` OK, `tsc` clean, 270/270 tests, deck CLI receipt
  (21 claims, 10 slides/40 boxes, `validation: OK`), samples 4×7/24,
  `eval -- --fixture F4` 8/8, `EXAMPLES.sh` exit 0, web prod build
  (routes `/`, `/landing`, 5 APIs). All eval side effects reverted.

## Phase 5 — Narrative Intelligence (2026-10-30, W1)

**Status: COMPLETE and validated 2026-10-30 ~06:45 UTC — suite
182/182 green; final live matrix 24/24 OVERALL PASS (post-R4 code):
S1 24/24, S2 144/180 (80.0%), S3/S4/S5/S6 PASS, S7 p95 204 ms / max
624 ms (15/24 warm cache, documented), diversity 24/24, fabricated
refs 0, narrative quality 24/24 pass (mean 99.0, min 98).**

Started from the defect audit (`docs/NARRATIVE_AUDIT.md`), reproduced each
finding against the built core before fixing.

**`evidence.ts`** — boundary-safe number regex with verbatim unit capture
(`40 percent`, `90-second`, `50 million downloads`, `20분`, `3만원`); no
more fabricated units (`12 storage` → `12`, never `12 s`); digit prefixes
of hashes/identifiers yield nothing. Claim caps raised 12→24/file,
40→60 total so later paragraphs survive. License boilerplate (13 MIT/
Apache patterns) is dropped at extraction — it once headlined a live F1
slide. Korean counters attach directly; month names stay date fragments.

**`semantics.ts` (new)** — deterministic analysis, no LLM: 8-dimension
importance rank (problem/solution/results/differentiation/limitations/
future/capabilities/architecture) with phrase-weighted EN+KO lexicons and
a documented tie-break (pain must be predicated, not merely mentioned);
5-way lifecycle status (implemented/proposed/historical/deprecated/
unverified); hero validation rejecting versions (context-aware decimals:
`3.2 release` out, `0.31` recall in), years, dates, hashes; ranges hero
the target bound (`15 minutes`); Jaccard redundancy (0.55) and repeated-
thesis (0.6) thresholds; contextless/thin/pointer detection; audience
parsing (`hackathon`, `competition: Title`, `쇼케이스`, …) with per-
audience argument arcs.

**`narrative.ts` (rewrite of planning)** — cover (custom title or top
problem/solution claim + hook body) → ≤2 validated-hero number slides
(distinct metrics/dims) → one thesis per dimension in arc order with
support bodies (never duplicated title/body) → encore passes to ~10
slides before any proposal filler → sourced closing (restate + forward).
Deprecated claims never headline; cover/closing quote claims with no
caption machinery; captions compacted to status tags + refs
(`verified · src/pack.js:2`).

**`quality.ts` (new)** — Narrative Quality Gate: meaningfulness,
coherence, fidelity, information value + overall, errors (fabricated
metric, invalid hero, repeated/redundant, weak conclusion, identical
title/body, deprecated-as-fact) vs warnings (contextless, thin, pads,
coverage, arc disorder, missing caption). Advisory: reported in
`planDeck` warnings, `provenance.quality`, eval reports (report-only
aggregate), and the CLI receipt — never fails a build.

**Fixtures** — new recommendation-engine recorded repo (versions, dates,
hash, deprecated/historical/proposed claims, redundancy pair,
contextless + pointer sentences), devtool idea (outage history,
deprecated format, roadmap), KO consumer idea; F4 kept and now yields
21 claims (was 12).

**Tests** — 75 → 182/182 green (152 baseline+W1; 30 peer W2
composition/critic/optical/art-direction tests coexist untouched),
incl. new `semantics` (38), `quality` (13), evidence verbatim/KO/
license/cap tests, encore + dedupe + audience-divergence tests, v2
caption parser tests. Every fixture deck passes the gate; audiences
produce provably different arc orders.

**Eval/CLI** — `parseCaptionRefs` accepts v2 + legacy captions; reports
carry the quality block; `make-deck` prints the quality line; SKILL.md
§2/§4 rewritten for the new behavior.

**Observed reading results** (not just tests): F4 reads as a coherent
10–11 slide argument in all audiences × EN/KO; recsys heroes `40ms` /
`15 minutes`, never `2.1`/`2026`/`9f3c1ab`; devtool excludes its
deprecated format; KO decks use native templates with unit heroes
(`70%`, `20분`). Live F1/F2/F3 narratives read in three rounds:
R1 killed badge alt-texts, issue templates, language tables, HTML
wrappers, process docs, `vision` false-positives, and version heroes;
R2 killed wrapped MIT lines, dotted-version fragments (`4.2.1`→`4.2`),
and process-doc ingestion; R3 (tests-first, this entry) kills wrapped
legalese via marker-dense code-header regions (first 30 lines, ≥2
markers), boolean/comparison operator lines (`&&`, `==`), relocation
follow-ups (`please file issues`), and strips `**bold**` residue.
R4 (tests-first, final round) killed blockquote prefixes in theses
(F3 cover `> Day.js…`), linter directives (`eslint-disable`) and URL
attributions (`Extracted from <url>`) in code comments, and raw
TSDoc markup in kept code lines (conservative URL-only link unwrap
so `a[i](x)` code is never mangled) — F1 n7/n8/n9 now genuine
content theses, F1 qual 100, F3/F2 qual 98 (honest coverage
warnings), zero number slides on F2/F3 (honest hero absence), F1
hero `754` (genuine IEEE-754 content, not a version).

**Known limitations** — multi-metric claims surface one hero; step
sequences (First/Second/Third) aren't grouped; lexicon ties are
heuristic (documented per case); moved-repo stubs (F2-class) yield
changelog-led decks and API-reference repos (F3-class) thin API-
surface arcs with honest coverage warnings — both are the content
ceiling, not planner failure; no number slides appear when no hero
validates (honest absence, e.g. post-fix F2/F3).

## Phase 0 — Specifications (2026-10-30)
- Authored `docs/PRD.md`: two input modes, 7 measurable success criteria (S1–S7),
  explicit out-of-scope (no DB/auth/cloud/microservices).
- Authored `docs/ARCHITECTURE.md`: Next.js monolith, 8-module pipeline, shared
  presentation schema, deterministic layout engine, Meta Muse provider + labeled
  deterministic fallback, bounded GitHub retrieval (≤20 files/200 KB).
- Authored `docs/DESIGN_SYSTEM.md`: typography-only constraint with allow/forbid
  lists, three direction systems, 16:9, KO/EN overflow + font fallback rules.
- Authored `docs/EVALUATION.md`: 4 fixtures, 7 metrics with pass thresholds,
  reproducible eval commands.
- No code written; no commits (parent commits after review).

## Phase 1 — Typography Core (2026-10-30)
- Scaffolded `packages/core` (TypeScript, pptxgenjs, jszip; `npm run build/test/samples` from root).
- Implemented restricted text-only schema (`schema.ts`), three typography systems
  (`systems.ts`), deterministic seeded layout engine (`layout.ts`), addText-only
  PPTX exporter (`export.ts`), structural PPTX validator (`validate.ts`).
- Fixed 7-slide EN/KO sample narrative; `npm run samples` emits three editable
  PPTX decks (editorial 93975 B, swiss 93508 B, expressive 94078 B), all passing
  structural validation (0 forbidden objects, 24/24 text boxes in-bounds, 16:9).
- Tests: 20/20 pass across 4 suites (schema, layout, export+validation, contrast).
- Review fixes by parent: expressive kicker on light alt slides was 1.28:1
  (yellow on paper) → now uses dark ink token; validator forbidden-tag scan
  extended (grpSp, chart, tbl, blipFill, pattFill, VML); added WCAG AA 4.5:1
  contrast regression test for every block.
- Known gaps carried forward: font-embedding licenses unverified; Meta Muse
  provider API shape unverified; eval fixtures unpinned (Phase 2).

## Phase 2 — Narrative + Ingestion (2026-10-30)
- Added `packages/core/src/provider.ts`: `ModelProvider` interface,
  `MetaMuseProvider` (OpenAI-compatible chat-completions POST, active ONLY
  when BOTH `TYPOdeck_MUSE_ENDPOINT` + `TYPOdeck_MUSE_API_KEY` are set; meta
  records host/model/latency, never the key) and `DeterministicFallback`
  (pure template planner, every output labeled `generated_by=fallback`).
- Added `packages/core/src/ingestion.ts`: `fetchRepo` (default branch, README
  first, bounded: ≤20 files / ≤200KB / ≤5 code files à 10KB / 30s timeout,
  403-429 back-off then README-only degrade or typed error, private rejected,
  injectable fetch) and `acceptIdea` (100–20,000 chars, typed errors).
- Added `packages/core/src/evidence.ts`: deterministic `extractClaims`
  (code=verified, README/docs=suggestion upgraded on code confirmation,
  idea=ungrounded; numbers copied verbatim from source with refs) plus
  opt-in `rephraseClaims` that preserves refs and drops phrasings that alter
  numbers. No LLM in the default extraction path.
- Added `packages/core/src/narrative.ts`: `planNarrative` (5–12 slides, one
  thesis each, number slides only from numeric claims with refs,
  ungrounded/proposal captions labeled) and `planDeck` (ingestion→evidence→
  narrative→layout→validate; fallback decks labeled `generatedBy=fallback`).
- Added `packages/core/scripts/make-deck.ts` CLI (`--repo/--idea/--idea-file`,
  `--system`, `--out`, `--purpose`, `--lang`); wired `npm run deck`. Prints
  provider + warnings; exit 1 on failure, 2 on usage error.
- Investigated the public Meta Muse endpoint (see `docs/MUSE_PROVIDER.md`):
  Meta Model API docs exist at dev.meta.ai and third parties report an
  OpenAI-compatible `api.meta.ai/v1`, but no live call was verifiable without
  a key — so the provider is env-gated and all runs use labeled fallback.
- Pinned `evals/fixtures.json`: F1 sindresorhus/is@main, F2 tj/commander@master
  (Ruby), F3 iamkun/dayjs@dev, F4 inline 477-word idea; SHAs/branches/READMEs
  verified live via the GitHub API on 2026-10-30 (deviations noted inline).
- Tests: 5 new offline suites (43 tests) with recorded blobs under
  `packages/core/fixtures/`; full suite 63/63 green. CLI demos: idea mode all
  3 systems (12 slides, validation OK) + live repo mode vs sindresorhus/is
  (38 claims, 29 verified, validation OK). Phase 1 samples still byte-identical.
- Fix from live testing: test/spec files excluded from the code sample.
- No commits (parent commits after review).

## Phase 3 — Web Studio (2026-10-30)
- Core additions (all covered by tests): `planDecksAll` in `narrative.ts`
  (one ingestion→evidence→narrative run, then `layoutDeck` x3 over the SAME
  narrative for comparable previews; optional `StageCallback` reports
  ingest→evidence→narrative→layout for SSE progress; `planDeck` refactored
  onto the same shared run, behavior unchanged), `exportToPptxBuffer` in
  `export.ts` (in-memory bytes via `write({outputType:'nodebuffer'})`, same
  builder as the file exporter), `validatePptxBytes` in `validate.ts`
  (`validatePptx` now delegates to it).
- Scaffolded `apps/web` (`@typodeck/web`, Next.js 16 App Router + React 19 +
  TypeScript, npm workspaces; no DB/auth/cloud/component library; one global
  stylesheet, hand-set type). Root `package.json`: `workspaces` +=
  `apps/web`, new `dev` script forwarding to the web workspace, `build` now
  builds core then web. `.gitignore` += `.next/`.
- UI (taste-governed chrome: serif display + system sans, one brick accent,
  no gradients/glass/icons/emoji): source form (idea textarea with char
  count, repo field, purpose + language selectors, auto-detected mode line),
  live server-driven stage list over SSE, provider badge + `generated_by`
  label + claim counts + warnings, three stacked system previews (no card
  grid) each with an HTML/CSS text filmstrip (absolutely-positioned text
  divs scaled from inch geometry via container-query units — no canvas, no
  decorative shapes), selectable system with large keyboard-navigable viewer
  (prev/next, counter, thesis + caption refs), `.pptx` download button.
  Labels, focus states, aria-live regions, and `prefers-reduced-motion`
  included; single-column responsive layout.
- API: `POST /api/generate {mode,input,purpose,lang}` → `{narrative, decks,
  provenance}` as JSON, or `text/event-stream` (stage events + result/error)
  when requested; `POST /api/export {narrative, system, generatedBy?}` →
  `.pptx` attachment, re-laying-out server-side from the posted narrative
  (client geometry never trusted; unknown systems and invalid narratives
  rejected with typed 400s; export fails loudly on validation failure).
  Bounds: 64 KB body cap on generate, 512 KB on export, 60 s repo-fetch
  timeout inside a 115 s request race, `maxDuration = 120`.
- Verification (all observed, dev server on 127.0.0.1:3000): `next build`
  passes (routes `/`, `/api/generate`, `/api/export`); `POST /api/generate`
  with the F4 fixture idea → 200, 3 decks x 12 slides x 46 boxes, identical
  slide ids, provenance fallback/12 ungrounded/2 warnings; SSE variant emits
  ingest→evidence→narrative→layout x3 then a 45,846-char result;
  `POST /api/export` (swiss) → 135,803 bytes, `Content-Disposition:
  attachment`, `validatePptx` OK (12 slides, 46 text shapes, 2431 editable
  chars, 13.33x7.5); error paths return typed codes (`idea-length`,
  `invalid-input`, `invalid-system`, `invalid-narrative`, live `not-found`).
  Full suite 65/65 (63 baseline + 2 new `decks-all` tests).
- Environment note: the sandbox blocks `listen()`, so the dev server was
  run unsandboxed for probes only; macOS has no `setsid`, so no detached
  server was left running. `npm` needed `NPM_CONFIG_CACHE=/tmp/...` (the
  default cache dir is unwritable).
- No commits (parent commits after review).

## Phase 4 — Evaluation (2026-10-30)
- Re-pinned `evals/fixtures.json` live via the GitHub API (`npm run
  eval:fixtures`): F1 sindresorhus/is@main, F2 tj/commander@master, F3
  iamkun/dayjs@dev all resolve with default branches unchanged, READMEs
  present (2974/12/530 words), and HEAD SHAs identical to the Phase 2 pins
  (no drift; `pinned_at=2026-10-30`). F4 kept as the inline/recorded 477-word
  idea text. One transient `fetch failed` on F1 needed a single retry.
- Implemented `packages/core/scripts/eval.ts` (single CLI, `require.main`
  guard so tests can import its pure helpers) and wired the EVALUATION.md
  §4 interface at root: `eval:fixtures` (re-verify + refresh SHAs, optional
  `--token-env` for authed quota), `eval` → `eval.js run [--lang ko|en|all]
  [--direction <id>|all] [--fixture F1] [--seed 42]`, `eval:report` →
  `evals/summary.json`. Per run: `planDeck` (pinned branch, live GitHub for
  F1–F3 with core bounds; recorded text for F4) → `exportToPptxBuffer` →
  `validatePptxBytes` → metrics. Per-run JSON + `.pptx` under `evals/reports/`
  record fixture, pinned/observed SHA, direction, lang, provider, seed, and
  all metric values.
- Metric semantics (documented in the script header; EVALUATION.md names no
  diversity thresholds): forbidden = validator "forbidden element" hits (0);
  editability = editable/total `a:t` chars with `noTxEdt` shapes counted
  non-editable (1.0); overflow = "exceeds slide bounds" hits (0 — the layout
  engine fits every box, so no separate clip detector exists); evidence
  coverage = factual (verified+suggestion) claims with ≥1 valid ref
  (ingested path + in-bounds lines) / all factual claims; unsupported =
  factual claims with no valid ref (repo) / fabricated (non-idea.txt) refs +
  unlabeled captions (idea, both 0); diversity per (fixture, lang) pair =
  ≥2 of {blocks-mean Δ≥0.5, headline-median rel-Δ≥15%, alignment-mix L1≥0.2};
  latency = `planDeck` wall ms; success = completed + ≥5 slides + PPTX bytes
  + structural validation ok.
- Ran the full live matrix 4×2×3 = 24 runs, seed 42, provider fallback
  (no `TYPOdeck_MUSE_*` env set): first pass 19/24 in 9.5 s, then GitHub
  unauthenticated quota hit 0 and 5 F3 runs failed honestly with
  `IngestionError: repo metadata HTTP 403` (typed, recorded in per-run
  JSON); after the quota reset the 6 F3 runs re-ran green in 6.0 s.
  `npm run eval:report` → OVERALL PASS: S1 24/24 (100.0%) ≥90%;
  S2 180/216 repo slides (83.3%) ≥80% (cover+closing carry no refs by
  design: 10/12 per deck; content slides 180/180 = 100%); S3 max 0/deck ≤1;
  S4 max 0; S5 min 100.00%; S6 max 0; S7 p95 1814 ms, max 4679 ms ≤120 s.
  Diversity 24/24 pairs pass, every pair differing in exactly headline size
  + alignment mix (blocks-per-slide is identical across systems because
  layout preserves narrative block counts 1:1 — recorded, not tuned).
  Idea mode: 0 fabricated refs, 0 unlabeled captions over 6 runs. No SHA
  drift (observed == pinned on all 18 repo runs). F3 hit the 20-file ingest
  cap (warning recorded); F1/F2 stayed within bounds.
- Tests: new offline `tests/eval.test.ts` (10 tests: percentile/median,
  caption parsing incl. KO, ref validation, diversity math, editability
  split); full suite 75/75 green (65 baseline + 10). Arg passthrough
  `npm run eval -- --lang ...` verified (invalid value reaches the parser
  and fails before any network).
- Commands run: `npm run eval:fixtures`, `npm run eval` (full matrix),
  `npm run eval -- --fixture F3` (post-reset rerun), `npm run eval:report`.
  Seed/provider notes: fixed seed 42 passed to `planDeck` for layout
  determinism; provider resolved to `fallback` on every run (labeled in
  each report); live-network latencies are honest per-run measurements.
- No commits (parent commits after review).

## Skill — Typodeck Agent Skill (2026-10-30)
- Verified Skill conventions without touching other agents' stores: read one
  bundled Muse skill body via the skill catalog (`SKILL.md` + YAML frontmatter
  `name`/`description`, one directory per skill under `skills/`) and confirmed
  the `skills/<slug>/SKILL.md` layout. Read the Athos repo README only, as an
  architectural reference for portable know-how + own-benchmark practices; no
  code copied, no dependency added.
- Authored `skills/typodeck/SKILL.md` (~125 lines): trigger, announce line,
  CLI-first workflow orchestrating Core (`npm run deck`, `/api/generate` +
  `/api/export` contracts, `planDecksAll`/`layoutDeck`/`exportToPptxBuffer`/
  `validatePptx`), typography-only allow/forbid lists, evidence-grounding
  rules, provider/fallback labeling, typed error codes + API status map, and
  three worked examples with observed outputs. Portable: shell + HTTP only.
- Authored `skills/typodeck/EXAMPLES.sh` (executable transcript) and ran it
  end-to-end: PASS examples=5 skipped=0. Ex1 idea→3 systems (6 slides/22
  boxes each, ~87 KB, byte-identical reruns, `validation: OK`); Ex2 live repo
  sindresorhus/is (38 claims: 29 verified/9 suggestion, 12 slides/46 boxes,
  135592 B, `validation: OK`); Ex3 `eval -- --fixture F4` 6/6 OK (offline,
  seed 42) + `eval:report` OVERALL PASS (S1–S7 match the Phase 4 pins).
  Ex2 skips honestly on GitHub quota 0; Ex3 skips when the Phase 4 scripts
  are absent, so the transcript also passes on the committed baseline.
- Verification notes: every cited command was run in this session. The
  `/api/*` path was verified at the function level (`planDecksAll` →
  `layoutDeck` → `exportToPptxBuffer` → `validatePptxBytes`, 86641 B, valid);
  HTTP framing relies on the Phase 3 observed probes (dev-server `listen()`
  is sandbox-blocked and the unsandboxed start produced no output). `npm run
  --silent test` 75/75 green. Artifacts under `/tmp/typodeck-skill/`.
- No commits (parent commits after review).

## 90+ Program — Research & Composition System (2026-10-30)

- Audit first: 10-agent workflow sweep (repo audit, 4 research tracks,
  grammar/optical audit, critic/eval/skill audit, critic, synthesis) with
  inspected-evidence contract. Baseline adjudicated by fresh runs: 149/149
  pre-existing tests green (not the stale 75/75 or 131 claims), F4 offline
  eval 6/6 OK, full matrix quota-blocked (7/24 at audit time).
- Evidence registry: `research/typography/evidence-registry.json` (46
  principles A/B/C/D with author/source/year/URL/type/access/summary/
  derived/applicability/limitations/confidence/implementation/evaluation) +
  `research/typography/SYNTHESIS.md`. Only Butterick FULL + Rutter FULL +
  Bringhurst-via-Rutter secondary count as source-supported slide rules;
  all other classical numeric values are DERIVED HEURISTICS.
- Composition Grammar (`src/composition.ts`, 31 candidates): 13 semantic
  types x >=2 strategies, 13 typography-only primitives, deck-aware
  deterministic selection (10 factors), hard no-triple-repeat,
  repetition-aware fallback, `COMPOSITION_GRAMMAR` machine bundle.
  Classification: content signals beat id stems; metric-hero requires
  meaningful+supported+relevant. Doc: `docs/COMPOSITION_GRAMMAR.md`.
- Renderer integration: `layoutDeck(..., {compositionPlan})` applies rhythm
  scale + body measure cap (~60 chars) + body-align overrides; absent plan
  = byte-identical baseline (all prior tests untouched-green).
- Optical engine (`src/optical.ts`): O1 measurable hang (<=0.12in), O2
  heuristic center nudge (<=0.06in), O3/O4 scorers without auto-fix, O5
  experimental proposals never applied. Every correction has rationale +
  bound + regression test.
- Art direction (`src/art-direction.ts`): density/emphasis annotation +
  bounded dense-run re-selection + advisory repetition/identity checks.
- Critic + revision (`src/critic.ts`): deterministic structural checks +
  labeled geometric proxies + `visionUnmeasured` list + bounded (<=3)
  revision loop with provenance; content never rewritten.
- Benchmark (`evals/benchmark-90/`, 8 held-out ideas B1-B8, never tuned
  on): 48/48 runs OK (seed 42), 0 forbidden, 0 overflow, 0 critic errors,
  0 triple-repeats. Paired deltas: body>60 lines 118->31, title>2 137->136
  (narrative issue, by design unfixed), widow 119->128 (REGRESSION from
  narrower columns; T8 guard deferred). Baseline-better pairs 14/24.
- Rendered inspection (Quick Look covers, 3 pairs): B2 swiss clean with
  truncated title both modes; B1 Korean expressive renders well, improved
  avoids a mid-eojeol split by line-width luck (keep-all still missing);
  B4 editorial shows the widow regression ("was." orphan). Inner slides
  UNINSPECTED (qlmanage covers only); font substitution, T11 wrap
  divergence, clipping UNMEASURED (no rasterizer).
- Skill upgrade: `SKILL.md` concise + composition/optical/revision/
  evaluation/research-index supporting files (progressive disclosure);
  counts corrected (164), benchmark + improved pipeline documented.
- Human package: `protocol.md` + `rubric.md` (100-pt, pre-registered pass
  criteria) + `ballot-template.csv`. Study PENDING — no reviewers, no
  invented results.
- Report: `evals/90-program-report.md` — PROVISIONAL 73/100 with missing
  validation. No 90+ claim.
- Tests: 179/179 green (149 working-tree baseline + 30 new), verified by
  clean rebuild (`rm -rf dist`, tsc, `node --test`). New suites:
  composition (13), optical (9), art-direction (4), critic (4). Note: an
  early in-session reading of 134/164 was a stale-dist artifact (build
  output piped through `tail` masked the rebuild state); the clean rebuild
  supersedes it.
- Failed/iterated experiments (kept in history): triple-repeat hard rule
  needed 3 grammar gaps fixed (comparison-rows, evidence-focused,
  repetition-aware fallback after finding a body-less evidence slide);
  benchmark script had a duplicate-key type error (fixed, re-ran clean).
- No commits (parent commits after review).

## Foundation-first: purpose presets + Slide IR + registry + import + Studio + visual benchmark (2026-10-30)

- Scope: 10 purpose presets (P01-P10), Slide Markdown v1 + Slide IR v1,
  planner/visual separation, versioned registry (3 production systems,
  geometry UNCHANGED), research-import (candidate specs only), Studio UX
  (purpose selector, Markdown edit, gallery, compare), 10x3 visual
  benchmark + merge-preserving decisions.json, Skill docs. NO mass
  20-system creation (foundation-first; new systems come from research).
- Correction 1 (legacy showcase): NOT auto-mapped to P04. `resolvePurpose`
  + `LEGACY_PURPOSE_MAP` keep frozen arcs; bit-identical replay over 36
  cases (`fixtures/legacy-narrative-baselines.json`).
- Correction 2 (semantic model): `DIMENSIONS` frozen 8; `NEW_DIMENSIONS`
  8 preset-only dims (decisions, methodology, market, model, experience,
  objectives, context, lessons); `EXTENDED_DIMENSIONS` = 16. Classifiers
  default to legacy 8.
- Correction 3 (regression): byte-identical PPTX comparison REPLACED by
  semantic/structural equivalence — `geometrySignature()`, `textParityOk`,
  `validatePptxBytes`, editable-char counts (`src/visual-review.ts`).
- Correction 4 (importer): emits experimental-only `CandidateSpec`
  (status always `experimental`); no registry write, no promotion path.
- New modules: purposes, slide-markdown, slide-ir, visual-systems,
  research-import, visual-review. Extended: semantics, narrative
  (preset dispatcher), quality (arc override), composition (new dims),
  layout (systemVersion stamp), schema, index exports.
- Scripts: `import-research.ts`, `visual-benchmark.ts`; `make-deck.ts`
  gained `--preset P01..P10`. Web: `/api/catalog`, `/api/markdown` new;
  generate (preset/audience/duration/emphasis + slideMarkdown), export
  (registry validation), page.tsx (presets, Markdown editor, gallery,
  compare), SlideView (registry fonts).
- Visual benchmark: 10 fixed fixtures (cover/problem/comparison/metric/
  conclusion x EN/KO) x 3 systems = 30 PPTX + 30 HTML + index.html +
  summary.json + decisions.json; 30/30 PASS structural gates on first
  run. Human KEEP survived a live re-run (merge-preserving scaffold
  verified; scaffold restored to PENDING after the check).
- Tests: 243/243 green (`npm run --silent test`, full rebuild). New:
  purposes (19), slide-ir, slide-markdown, registry (7),
  import-research (11), visual-review (6).
- Studio smoke (live `next start -p 3101`): catalog 200, generate P04
  200 (3 decks + Slide Markdown), markdown re-render 200, export 200
  (63,393 bytes, `validatePptx ok=true`). One export probe failed with
  http=000 under sandbox proxy — sandbox artifact, direct retry OK.
- Skill: new `purposes.md` + `visual-systems.md`; SKILL.md updated
  (preset flag, 16 dims, 243 tests, legacy-mapping note).
- Ownership held: `research/*`, `.muse/worktrees/*` untouched (this
  session used the main checkout; no worktree needed — no writes near
  research paths). No commits (parent commits after review).
- UNRESOLVED (carried): human blind A/B still pending (protocol ready);
  inner slides never raster-inspected (no in-repo rasterizer); font
  substitution / T11 wrap / clipping unmeasured; widowed-line +9
  regression from measure caps (T8 guard deferred); live GitHub eval
  matrix quota-blocked (offline F4 6/6 OK).

## Skill benchmark & refinement vs 3 external Skills (2026-10-30)

- Audited from fresh /tmp clones (SHAs recorded, MIT each):
  zarazhangrui/frontend-slides `9906a34`, arifszn/slide-wright
  `a751585`, siril9/presentation-skill `efd899c` (+ forks noted).
  Deliverables: `evals/skill-benchmark/SOURCE_AUDIT.md`,
  `SKILL_GAP_ANALYSIS.md` (32 practices classified), and
  `SKILL_REFINEMENT_PLAN.md` (R1–R14 + benchmark proposal).
- Implemented R1–R8: `density.md` (speaker-led/reading-first +
  floors) + `densityPolicy` IR metadata w/ validation test;
  optional 3-system preview flow docs; `findWorkflowTokens`
  authenticity gate wired into visual-benchmark (30/30 PASS);
  adversarial inspection checklist + handoff honesty block in
  revision.md; Skill-wide honest-skip rule; edit ladder;
  speaker-notes chain (Markdown→IR→Narrative→layout→native PPTX
  notes) with notes-part test; batched-intake rule.
- CONTRACT CHANGE (intentional, requested): Slide IR `notes` are
  no longer dropped by `slideIRToNarrative` — they flow to PPTX
  notes. Existing round-trip test updated (emphasis still dropped;
  notes preserved + blocks untouched). Validator ignores notes
  parts (walks ppt/slides only) — no gate impact.
- Tests: 248/248 green (243 + 5 new). Benchmark re-run: 30/30
  PASS, decisions.json untouched (all PENDING).
- Planned, not started: R9 rendered-HTML QA script (M, closes the
  font/wrap/clipping measurement gap), R10 critic repair packets
  (M), R11 hash-bound review receipts (S), R12 registry growth
  contract at research arrival, R13 `--preview-all` (S), R14 full
  benchmark harness (M; minimal first run needs only a ~40-line
  bootstrap script + frozen manifest).
- Rejected with reasons: mandatory approval gates, per-deck
  invented themes, raster-background PPTX, reveal.js/SVG engines,
  deploy/PDF sharing, entropy diversity gates (premature).
- No quality improvement claimed: gated on the proposed blind
  before/after benchmark (frozen manifest, failures in
  denominator, conjunctive superiority rule). Ownership held:
  research/* and worktrees untouched.

## GitHub-to-Presentation Journey (2026-10-30)

Branch `feat/github-presentation-journey`, worktree
`.muse/worktrees/github-journey` (state moved via stash, byte-verified;
stash `wip-before-github-journey` retained as backup). Ownership held:
research/, gallery/, composition.ts, visual-systems.ts, and all
subagent worktrees untouched.

- 403 root cause: meta/tree 403 (quota 0 answers 403, not 429) surfaced
  as generic 'network', no header inspection, and no route ever passed
  `authToken`. Fix: fail-fast typed 'rate-limited' with `resetAt` on
  API calls (single retry only with retry-after), reset-enriched blob
  messages, `GITHUB_TOKEN`/`GH_TOKEN` wiring, user-agent `typodeck`,
  truncated-tree warning, per-call `requests` budget, TTL response
  cache (200s only, auth-separated), shared across /api/evidence +
  /api/generate via globalThis (Next bundles routes separately).
- Evidence Inspector: new `POST /api/evidence` (files + claims with
  kind/status/numbers/deep links); `displayStatus` single source of
  truth (captionFor refactored onto it, byte-identical captions);
  `EvidenceSelection` (exclude/reframe, sha guard) applied between
  extraction and planning; Studio section 02 with checkboxes, reframe
  editing, staleness gating.
- Provenance: `DeckMeta.provenance` (repo/branch/sha) set by the
  pipeline, echoed through /api/export, written to PPTX core
  properties (`author`/`company`/`subject`); slide content untouched.
- First use: repo-first input + sample chips, guided per-code errors
  with idea-mode fallback, section renumber 01–06.
- Fixes on the way: markdown route allowlist predated the `document`
  system (edits dropped it); now renders all 4.
- Tests: 270/270 green (250 baseline + 20 new: 403/cache/budget,
  parseRepoInput/githubBlobUrl, displayStatus, selection incl.
  pipeline wiring, provenance incl. core.xml). Web `tsc --noEmit`
  clean. New `npm run journey` live e2e: 9/9 PASS on
  sindresorhus/is, psf/requests, facebook/react (evidence 0.1–6.7 s,
  generate <200 ms, export <50 ms; bottleneck = sequential blob
  fetch); missing repo fails honestly as typed not-found. HTTP
  Studio probe: evidence/generate-SSE/markdown/export all 200 with
  review + provenance verified in artifacts.
- Not production-ready: see docs/GITHUB_JOURNEY.md limitations
  (docs-filled 20-file cap, sequential fetch, env-only token, no
  local-file ingest, positional claim ids, untuned pick quality).
