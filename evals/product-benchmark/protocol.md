# Product Benchmark — Baseline A vs Typodeck B (protocol, frozen)

Status: FROZEN 2026-10-31. Runs after this commit must follow this file
verbatim; any deviation goes in `JOURNAL.md` and invalidates the affected run.

## 1. Question

Does a coding agent equipped with the Typodeck Skill (Arm B) produce a
better repo-pitch HTML presentation than the same-class agent with a generic
instruction and no Typodeck (Arm A)?

## 2. Arms

- **Arm A (generic baseline).** Frozen prompt (`prompts/arm-a.md`): analyze
  the repo fixture, then create a self-contained HTML presentation.
  Replay is deterministic: `arms/baseline-a.mjs` (mechanical heading/number
  extraction + generic styled template). No Typodeck code, Skill, tokens,
  or fonts. Single artifact: HTML (no PPTX by design).
- **Arm B (Typodeck Skill).** Follows `skills/typodeck` (Agent B) on the
  Agent C engine: bounded local analysis distilled to idea text
  (mechanical excerpts, mirroring `examples/02-local-analysis.sh`), then
  CLI idea mode per production system (`swiss`, `editorial`, `expressive`;
  `document` is experimental and excluded from the head-to-head), then
  HTML preview rendered from the laid-out deck with the engine's own
  geometry. Primary head-to-head: A vs B-swiss (Skill default). B-editorial
  and B-expressive are measured identically as additional columns.

## 3. Tree layout (ownership: Agent G touches ONLY `evals/**`)

- Branch `agent/g-benchmark` (from `b09865c`): harness + fixtures +
  measurements + reports. No engine/skill/app/docs changes.
- Throwaway tree `/tmp/td-g` (NOT the branch): `b09865c` +
  `agent/c-composition -- packages/core/src packages/core/tests` +
  `agent/b-skill -- skills/typodeck`, built once. All Arm B generation
  and all core-powered measurement run there; artifacts + logs are copied
  back under `results/`. The throwaway is never committed or pushed.

## 4. Fixtures (offline, quota-free)

`fixtures/repos/FX1-ledgerly/` and `fixtures/repos/FX2-pipecheck/`:
synthetic local repos (README + manifest + 1-2 code files, each inside the
Skill's remote-mirroring budget: <=20 files, <=200 KB, <=5 code files).
`fixtures/sources.json` pins file bytes/lines; `fixtures/numbers.json`
lists every number-like token in the sources (script-generated, committed).
No live GitHub in the head-to-head (quota table records 0 used / check only).

## 5. Controls

- Same fixtures, same task prompt shape, same operator effort class
  (mechanical deterministic replay; authoring effort logged in JOURNAL.md).
- Same output contract: 5-12 slides, 16:9, self-contained HTML file.
- No cross-run contamination: separate out dirs per arm/fixture, fresh
  Chrome profile per measurement (`--dump-dom` is stateless anyway).
- No cherry-picking: every run (pass or fail) is logged in JOURNAL.md with
  timestamps; `results.json` keeps failures in the denominator.
- Seeds: Typodeck layout seed 42 everywhere; Chrome
  `--virtual-time-budget=3000`, viewport 1280x720.

## 6. Metrics

### 6a. Objective (script-measured, in `results/results.json`)

| # | Metric | Instrument | Pass bar (pre-registered) |
|---|---|---|---|
| O1 | Claim accuracy: slide numbers found verbatim in sources | `measure/text-metrics.mjs` + manual audit of each miss | report % + miss list, no bar |
| O2 | Evidence traceability: slides/claims carrying a visible source ref | same script (caption `path:line` / `Source:` patterns) | report %, no bar |
| O3 | Fabricated claims: slide numbers absent from sources | O1 misses after manual audit | 0 for B; report A as-is |
| O4 | Composition diversity: distinct layouts, triple-repeat | B: composition plan candidateIds; A: section-kind sequence | report, no bar |
| O5 | Overflow/clipping (rendered truth) | headless Chrome + engine probe `OVERFLOW_PROBE_JS` + `detectRenderedOverflow` (IDENTICAL instrument both arms) | 0 overflow blocks |
| O6 | Readability floors: min title/body px at 1280 wide, contrast >= 4.5 body | probe `fontSizePx` + offline WCAG contrast from used colors | report mins; contrast 0 fails |
| O7 | HTML/PPTX consistency (B only; A = N/A single artifact) | journey-style per-slide text parity + slide-count match | 0 mismatches |
| O8 | Editability: editable chars / visible chars | B: `validatePptxBytes`; A: DOM text extractability (trivially 1.0, labeled) | B = 1.0 |
| O9 | Structural validity | B: `validation: OK` + slide count 5-12; A: slide count 5-12 + no empty slides | all pass |
| O10 | Generation time (wall, per arm/fixture) | `run.sh` timestamps (excludes harness dev) | report ms, no bar |
| O11 | Revisions: engine `reviseDeck` iterations (B) / manual passes (A) | run log | report counts |
| O12 | Correction effort: post-generation fixes to reach shippable | JOURNAL.md operator log | report honestly |

O1/O3 number-token regex: `\d[\d,]*(?:\.\d+)?%?` plus `$`-prefixed and
`v`-prefixed forms. EXCLUSIONS (structural, not claims): slide counters,
`16:9`/`16/9` aspect tokens, caption line refs that ARE the traceability
mechanism (counted under O2 instead), and CSS/geometry numerals (only slide
visible text is audited). Every exclusion is listed in the report.

### 6b. Subjective (human, blind)

`protocol-blind.md` + `ballot-template.csv`: randomized A/B per fixture,
7-point Likert (narrative coherence, typography hierarchy, readability,
professional quality) + forced choice + failure notes. Status: PENDING
(no independent reviewers in this session). The author's own non-blind
observations appear in the report labeled NON-EVIDENCE and never as scores.

## 7. Superiority rule (conjunctive, pre-registered)

"B beats A" may be claimed ONLY if ALL hold: (a) O5: B has strictly fewer
overflowing blocks than A; (b) O3: B has 0 fabricated claims; (c) O1: B
accuracy >= A accuracy; (d) O8/O9: B ships `validation: OK`; (e) no
unfixed O6 contrast failure in B. Subjective claims require the blind study
(§6b) with n>=3 reviewers. Otherwise the verdict is MIXED/INCONCLUSIVE
with the exact failing clause named.

## 8. Known-issue carryover (not part of the head-to-head)

Agent B reports fresh `eval:report` gives OVERALL FAIL on F4
design-diversity (`document~swiss`, 2/30 pairs). Agent G reproduces this
verbatim in the throwaway (`reports/eval-f4-diversity.log`) and carries it
as-is. It does not affect §7 (different gate, experimental system).

## 9. Reproduction

```sh
# 1. throwaway engine (NOT this branch)
rm -rf /tmp/td-g && git clone <repo> /tmp/td-g && cd /tmp/td-g \
  && git checkout b09865c \
  && git checkout origin/agent/c-composition -- packages/core/src packages/core/tests \
  && git checkout origin/agent/b-skill -- skills/typodeck \
  && npm install && npm run build -w @typodeck/core
# 2. harness (this branch, agent/g-benchmark)
git checkout agent/g-benchmark
TD_CORE_DIST=/tmp/td-g/packages/core/dist OUT=/tmp/td-g-out \
  bash evals/product-benchmark/run.sh
# 3. report inputs: evals/product-benchmark/results/results.json + JOURNAL.md
```

Environment pinned for this report: node v26.8.1, Chrome 156.0.8078.74,
darwin arm64, baseline `b09865c`, skill `76a9570`, engine `d0c5166`.
