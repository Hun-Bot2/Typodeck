# Run journal (append-only; every run logged, pass or fail)

## 2026-10-31 ~19:30 +0900 — setup (harness dev, not a benchmark run)

- Created branch `agent/g-benchmark` at `b09865c` (worktree).
- Read evals/**, skills/typodeck/SKILL.md, slide-reconstruction report
  (`git show 088e510:research/slide-reconstruction/report.md`).
- Throwaway `/tmp/td-g`: clone of main repo + `origin/agent/c-composition
  -- packages/core/src packages/core/tests` + `origin/agent/b-skill --
  skills/typodeck` (SHAs verified identical to local heads). `npm install`
  + core build green.
- Froze `protocol.md` BEFORE any benchmark run (pre-registration).

## 2026-10-31 ~19:45 — known-issue reproduction (throwaway only)

- `npm run eval -- --fixture F4` → 8/8 OK (seed 42, fallback).
- `npm run eval:report` → S1-S7 all PASS, but
  `design-diversity FAIL on 2/30 pair(s): F4/en document~swiss,
  F4/ko document~swiss`, `diversity: 28/30 pairs pass`, `OVERALL: FAIL`.
- Matches agent/b-skill's report exactly (differCount 0 on both pairs).
  Verbatim log saved for `reports/eval-f4-diversity.log`.

## 2026-10-31 ~19:50 — harness dev fixes (not benchmark runs)

1. `idea.sh` secrets tripwire false-positive on FX2 prose
   ("secret-name typos" is legitimate linter vocabulary) → narrowed to
   secret VALUE patterns (assignments, sk-/ghp-/xox-/Bearer prefixes).
2. `deck.sh` timing excluded the per-run tsc rebuild (build once outside
   timing; per-system wall time invokes the built CLI directly).
3. `run-b/html.mjs` used CJS `require` under `.mjs` → `createRequire`.
4. `deck.sh` receipts file made per-fixture (`receipts-<FX>.log`) so the
   second fixture no longer truncates the first.
5. Chrome probe: verified `--headless --dump-dom --virtual-time-budget`
   executes injected JS (Chrome 156.0.8078.74).

## 2026-10-31 ~20:00 — benchmark run 1 (ABORTED, harness bug)

- Arm A + Arm B generation green (FX1: A 9 slides, B 10 slides x3, all
  `validation: OK`); O5 measured (FX1 all 0 overflow).
- `text-metrics.mjs` failed: block regex required `style=` (Arm A has
  none) and `<div` only (Arm A titles are `<h2>`). No metrics consumed.
- Fixes: order-free attribute parsing, div|h2 matcher, `blocksInHtml`
  counts `data-block-id` (was matching the CSS class definition too).

## 2026-10-31 ~20:10 — benchmark run 2 (ABORTED, harness bugs)

- Generation green both arms; O5 green (0 overflow everywhere on FX1).
- `text-metrics`: Arm A blocks lacked `data-slide-id` (all grouped as 1
  slide) → added to generator; slide counters stripped pre-extraction
  (per-token exclusion can't see "1 / 9" pairs); jszip path off by one
  level (`packages/node_modules` → root `node_modules`).
- No metrics consumed.

## 2026-10-31 ~20:20 — benchmark run 3 (COMPLETE, SUPERSEDED)

- All 8 decks green. O5 0 overflow everywhere; O1 A=1.0/1.0, B=0.889/0.931
  (sole misses: "8000" x2/deck from the idea-assembly header
  `--- README.md (first 8000 bytes) ---`, heroed as a number slide yet
  correctly labeled `unverified · illustrative · idea.txt:4`); O2 A 9/9
  file-level, B 8/10 line-level; O6 A 18 contrast fails (kicker/src
  2.81:1), B 0; O7 0 mismatches; O8 1.0; O4 A distinct=3 triple=true,
  B-swiss distinct=8 triple=false; diversity 6/6 pass; gen A 30-41ms,
  B 69-88ms/system. Raw JSON preserved at /tmp/run3-results.json (scratch,
  not committed; run-4 rerun is independent, not a cherry-pick).
- SUPERSEDED because screenshot review found the B HTML renderer's
  `font-family` quoting bug: double quotes inside `style="..."` broke the
  declaration, so Chrome fell back to Times (proven: USEDFONT=Times).
  O5/O6 re-measured in run 4 with the fix (single quotes).
- Same quoting bug exists engine-side (OUT OF SCOPE, reported only):
  `preview-experimental.ts:117` and Agent C `renderMeasureHtml`
  (`critic.ts:527` + `:459-461` quote-less `escapeHtml`) emit raw quoted
  chains into `style="..."` — the engine's own overflow mirror also
  measures in fallback serif until fixed.
- Fairness rule adopted: MY generator/renderer bugs get fixed (Arm A
  intro duplication + mid-word cut; B renderer quoting); PRODUCT
  behavior under test stays as-is (B "8000"/"Fixture:" marker leaks).

## 2026-10-31 ~20:40 — benchmark run 4 (HEADLINE RUN, COMPLETE)

- 8/8 decks green. O5: A 0/0, B-swiss 0/0, B-editorial 0/0,
  B-expressive 1 (FX1) + 3 (FX2) blocks — correct fonts unmasked real
  expressive clips (validation OK + 0 critic errors on all of them).
- O1 A 1.0/1.0, B 0.889/0.931 (sole cause: "8000" marker leak, labeled
  unverified, ref resolves to idea.txt:4). O2 A 9/9 file-level, B 8/10
  line-level. O6 A 18 contrast fails (2.81:1 chrome), B 0. O7 0
  mismatches, O8 1.0, O4 A distinct=3/triple, B-swiss 8/clean.
- Superiority rule: (a) FAIL (0 vs 0 tie), (b) FAIL ("8000"),
  (c) FAIL (0.889/0.931 < 1.0), (d)(e) PASS → MIXED, no superiority claim.
- Screenshots eyeballed: fixed A cover clean; B-swiss font chain verified
  (USEDFONT=Inter stack; Times fallback gone). PNGs kept in /tmp only.
- Artifacts copied to results/ + reports/; PPTX binaries recorded by
  sha256 (`results/pptx-hashes.json`), not committed.
