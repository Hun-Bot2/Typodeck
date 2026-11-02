# A1 — Baseline + Repo Inventory (Stage-2 architecture audit)

- Audit date (UTC): 2026-11-02. Workspace: `/Users/jeonghun/Typodeck`.
- HEAD: `c2fe1bb` on `integrate/research-visual-hierarchy` (clean except `?? research/paper-survey-tmp/`).
- Method: every claim below was read from the cited file body; counts were recomputed, tests were executed.

## (1) Branches, worktrees, release-candidate relationship

All local branches (`git branch -a`): `agent/a-core-clean`, `agent/b-skill`,
`agent/c-composition`, `agent/d-studio`, `agent/e-docs`, `agent/f-hosting`,
`agent/g-benchmark`, `agent/h-distribution`, `audit/reference-gap`,
`docs/comms-audit`, `docs/launch-readme`, `dx/setup-audit`,
`feat/github-presentation-journey`, `feat/studio-workspace`,
`integrate/release-candidate`, `integrate/release-readiness`,
`* integrate/research-visual-hierarchy` (HEAD), `landing/page`, `main`,
`research/checkpoint-447-2026-10-30`, `research/review-assets-2026-10-31`,
`research/slide-reconstruction`, `showcase/demo-evidence`, `studio/a11y-audit`;
remotes: only `origin/main` (+ `origin/HEAD`).

- `integrate/release-candidate` EXISTS at exactly `0811e90`
  ("integrate(report): release engineering report + research NOTICE", 2026-10-31).
  `git rev-parse integrate/release-candidate` = `0811e90…`; it is the branch tip (latest on that branch).
- HEAD relationship: `git merge-base HEAD integrate/release-candidate` = `0811e90`
  (RC is a strict ancestor of HEAD); `rev-list --left-right --count RC...HEAD` = `0 / 11`
  (HEAD is 11 commits ahead, RC contributes nothing newer). RC is also contained in
  `main` (via `a28d0a8` "consolidate: merge release candidate into main"), `audit/reference-gap`,
  and HEAD's branch.
- Worktrees (29): main checkout at `/Users/jeonghun/Typodeck` (`c2fe1bb`);
  RC pinned at `.muse/worktrees/rc` (`0811e90`); plus `/private/tmp/typodeck-*`
  audit/verify checkouts and `.muse/worktrees/subagent-*` / agent checkouts
  (see `git worktree list` output in evidence).

## (2) How to run tests + exact passing count

- Command: `npm test` = `npm run build -w @typodeck/core && node --test packages/core/dist/tests/`
  (`package.json:12`). CI runs the same plus `tsc --noEmit -p apps/web` and a web production
  build (`.github/workflows/ci.yml`).
- **Observed on this branch just now: 355 tests / 86 suites, 355 pass, 0 fail, 0 skipped**
  (`duration_ms ~33124`). Test files: 27 in `packages/core/tests/` (incl. `grammar-g1g3.test.ts`,
  `overflow-gate.test.ts`).
- Last recorded counts elsewhere: 270/270 on `integrate/release-readiness` (`docs/RELEASE_READINESS.md`);
  per-agent counts (272/272 … 347/347) in `docs/RELEASE_REPORT.md` §B.

## (3) 447 typography references

- Location + format: `research/merged_registry.json` (JSON array, 447 full-field objects)
  and line-identical JSONL twin `research/merged_registry.jsonl` (447 lines).
  Schema: `research/schema.json` (TypodeckResearchRecord, JSON-Schema draft 2020-12).
  Per-agent sources: `research/agent-A/B/C/D/E.full.jsonl`; merge tooling:
  `research/merge_full.py`, `research/merge_provenance.json`, `research/merge_report.md`,
  `research/reconciliation-2026-10-30.md`.
- Count verification (recomputed): `len(json.load(merged_registry.json))` = **447**;
  `wc -l merged_registry.jsonl` = **447**. Corpus split per `research/candidate_visual_systems.md:15-17`:
  235 inspected / 190 search-checked / 22 inaccessible.
- Note: `research/typography/evidence-registry.json` is a DIFFERENT artifact (46 principles
  A01–D10 + access/confidence legends, `generated 2026-10-30`), not the 447 corpus.

## (4) 38 Composition Candidates

- Registry: `COMPOSITION_CANDIDATES` in `packages/core/src/composition.ts:140-361`
  (constructor `C(...)` at `:123-136`); `CANDIDATE_IDS = Object.keys(...)` at `:363`;
  selection metadata backfill at `:372+`; `candidateIndex()` at `:648`; planner entry
  `planCompositions()` at `:954`.
- Count verification (recomputed from source): **38** records —
  opening×4, problem×2, insight×2, thesis×3, comparison×3, process×2, architecture×2,
  evidence×4, metric×2, quote×2, tradeoff×2, transition×2, conclusion×2, document×6.
- Schema: `CompositionCandidate` (`composition.ts:87-108`): `id`, `semanticTypes[]`
  (13-type enum `:20-29`), `systems[]`, `primitives[]` (13-type enum `:36-47`),
  `preconditions` (`:54-67`), `constraints` (`:69-80`, incl. `columns`, `rhythmScale`),
  `rationale`, `exceptions[]`, optional `bestFor[]/avoidFor[]/density/formality/theme`.
  Machine-readable export `COMPOSITION_GRAMMAR` at `:~1002`. Human doc: `docs/COMPOSITION_GRAMMAR.md`.
  Review surfaces: `review/candidates.html` + `review/candidate-data.js`, `gallery/candidate-evidence.json`.

## (5) G1 monumental numeral and G3 explainer columns

- G1 record: `'opening-monumental-numeral'` in `composition.ts:160-168`
  (opening/semantic, swiss+editorial, requires number+title, sparse/formal).
  Geometry: `planMonumentalNumeral` in `layout.ts:602`, dispatched at `layout.ts:820-821`.
- G3 record: `'evidence-explainer-columns'` in `composition.ts:265-273`
  (evidence+insight, 2 columns, 3–8 bodies, dense/neutral).
  Geometry: `planExplainerColumns` in `layout.ts:684`, dispatched at `layout.ts:822-823`.
- Integration tests: `packages/core/tests/grammar-g1g3.test.ts`
  (records/selection/R1–R3 rules/full short/med/long × swiss/editorial × EN/KO matrix;
  O1–O5 asserted NOT promoted at `:177-182`).
- Do not confuse with `research/candidate_visual_systems.md` §1 clusters G1 (Swiss grid)
  and G3 (documentary evidence) — those are research grammar clusters, not these engine candidates.

## (6) Rendered overflow gate

- Implementation: `packages/core/src/critic.ts`.
  - `critiqueRenderedOverflow(slide, measurements, opts)` at `:408-444`:
    emits `overflow-visible` **ERROR** per block whose `scrollW/H > clientW/H` beyond tolerance;
    `overflow-unmeasured` WARNING for probe gaps; explicit opt-in via `allowOverflow` / `intentional`.
  - `OVERFLOW_PROBE_JS` at `:469-495` (collects `.slide-block` scroll/client + font metrics into
    `#typodeck-overflow`); `renderMeasureHtml` mirror at `:512+` (mirrors `SlideView` geometry;
    MIRROR RISK noted `:508-510`); `measureSlideRender` (headless-Chrome convenience) at `:604-608`.
  - Static pre-gate: estimate-based `overflow-risk` WARNING at `:83-91`; layout-time overflow
    relaxation ladder (scales 1→0.13) in `layout.ts:806-849`.
- Trigger: any rendered block clipping in headless Chrome measurement (used per-cell in
  `grammar-g1g3.test.ts:325-340`, Chrome-gated `describe` at `:342`); tests: `overflow-gate.test.ts`.

## (7) Evals / CI

- Suites present:
  - Core eval CLI: `packages/core/scripts/eval.ts` — `eval fixtures|run|report`
    (invoked via root `eval`, `eval:fixtures`, `eval:report` npm scripts; fixtures
    `evals/fixtures.json`; full matrix 4 fixtures × 2 langs × 3 systems = 24 runs).
  - Program benchmark: `packages/core/scripts/benchmark-90.ts` (`npm run benchmark-90`),
    fixtures `evals/benchmark-90/fixtures.json` (B1–B8), protocol/rubric/ballot alongside.
  - Product A/B benchmark: `evals/product-benchmark/` (`protocol.md`, `protocol-blind.md`,
    `run.sh` — writes ONLY to `$OUT`, zero GitHub calls; arms/measure/prompts/run-b).
  - Skill benchmark: `evals/skill-benchmark/` (`SKILL_GAP_ANALYSIS.md`, `SKILL_REFINEMENT_PLAN.md`,
    `SOURCE_AUDIT.md`); visual benchmark: `evals/visual-benchmark/` (fixtures/output).
  - CI: `.github/workflows/ci.yml` (push on main/agent/feat/fix + PRs to main:
    `npm ci` → `npm test` → web `tsc` → web build; no deploy job).
- Last results locations: `evals/summary.json` (generated 2026-10-30T06:39:38Z, seed 42,
  provider fallback); per-run JSON+PPTX in `evals/reports/` (F1–F4 × lang × system);
  `evals/90-program-report.md` (provisional 73/100, human study PENDING);
  `evals/product-benchmark/results/` (`results.json` w/ pins `b09865c/76a9570/d0c5166`,
  `pptx-hashes.json` sha256, `metrics/`, `sidecars/`, `decks/`, `logs/`) and
  `evals/product-benchmark/reports/` (`ab-report.md`, `eval-f4-diversity.log`).

## (8) Release-candidate reproducibility notes

- No git tags exist (`git tag --list` empty). Reproducibility is by branch+SHA:
  RC = `integrate/release-candidate @ 0811e90`; baseline `integrate/release-readiness @ b09865c`;
  agent SHAs tabulated in `docs/RELEASE_REPORT.md` §B; product-benchmark pins recorded in
  `evals/product-benchmark/results/results.json` (`pins`); showcase pins (repo SHAs, seed 7,
  provider fallback) in `showcase/manifest.md` §1–2 with per-deck `.provenance.json`
  in `showcase/decks/`; preview manifest `previews/manifest.json` (narrative sha256, seed,
  per-system bytes/validation/parity); research merge provenance in `research/merge_provenance.json`.
- Canonical RC report: `docs/RELEASE_REPORT.md` (product status, agent results, quality,
  limitations incl. PPTX-rendering unverified, G4 blocked, docker build unverified);
  readiness overlay: `docs/RELEASE_READINESS.md`; licensing boundary: `research/NOTICE.md`
  (447 corpus has NO license metadata — research notes, not redistributable as licensed).
- Release-engineering fixes on RC are IN the RC commit itself (font-stack quote escaping,
  tabular digit width, NOTICE) per `docs/RELEASE_REPORT.md` §B.
