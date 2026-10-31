# Product Benchmark Report — Baseline A vs Typodeck B (run 4, headline)

Date: 2026-10-31. Protocol: `../protocol.md` (frozen pre-run). Operator: Agent G.
Raw data: `../results/results.json` (+ `metrics/`, `decks/`, `logs/`, `sidecars/`).

## 1. Verdict: superiority NOT established — MIXED

Per the pre-registered conjunctive rule (protocol §7), "B beats A" requires
ALL of (a)-(e). Result: **3 of 5 hold; (a), (b), (c) FAIL**. No superiority
claim is supported. Each arm wins cleanly on different dimensions:

- B wins: contrast (0 vs 18 fails), composition diversity (7-9 distinct
  layouts vs 3; A triple-repeats 7 in a row), traceability precision
  (line-level `idea.txt:N` refs vs bare filenames), PPTX artifacts
  (O7 0 mismatches, O8 1.0), structural validity signals.
- A wins: raw claim accuracy (1.0 vs 0.889/0.931 — B's gap is one leaked
  assembly marker, heroed as a number slide), zero-overflow uniformity
  (A 0 blocks; B family 4 blocks over 2 expressive decks).
- Tie: rendered overflow on the PRIMARY pair (A vs B-swiss: 0 vs 0).

## 2. Setup

| Item | Value |
|---|---|
| Baseline | `b09865c701944ecbf475dbd58e524b9a7e4bd75b` |
| Skill (Arm B) | `76a9570` `agent/b-skill` |
| Engine (Arm B) | `d0c5166` `agent/c-composition` (src+tests overlaid, uncommitted) |
| Throwaway | `/tmp/td-g` (never committed); branch keeps harness+artifacts only |
| Fixtures | FX1-ledgerly, FX2-pipecheck (3 files each, ~3.9/3.4 KB — local, offline) |
| Provider | fallback (deterministic; no model inference either arm) |
| Seed / viewport | 42 / 1280x720 (A stage 1229px by its own 96vw CSS; B 1280px) |
| Chrome | 156.0.8078.74 (headless, `--virtual-time-budget=3000`) |
| Node / OS | v26.8.1 / darwin arm64 |
| GitHub quota | 0 consuming calls by the benchmark (local fixtures); probe-only check showed core 34/60 remaining (shared env) |
| Blind study | PENDING (n=0; §6) |

Runs: 1-2 aborted on harness bugs (no metrics consumed), 3 complete but
superseded (B font-quoting bug masked real overflows), **4 headline**.
JOURNAL.md logs every run; run-3 raw JSON is summarized there (not
cherry-picked — run 4 re-measures everything independently).

## 3. Objective metrics (raw numbers)

Slides/blocks: A 9/53 (FX1), 9/51 (FX2). B 10/36 every system/fixture.

### O1 claim accuracy / O3 fabricated (oracle: `fixtures/numbers.json`)

| Deck | Numbers | Matched | Accuracy | Fabricated (post-audit) |
|---|---|---|---|---|
| FX1-a | 62 | 62 | 1.0000 | 0 |
| FX1-b-swiss | 18 | 16 | 0.8889 | "8000" x2 blocks (1 distinct claim) |
| FX1-b-editorial | 18 | 16 | 0.8889 | same |
| FX1-b-expressive | 18 | 16 | 0.8889 | same |
| FX2-a | 78 | 78 | 1.0000 | 0 |
| FX2-b-swiss | 29 | 27 | 0.9310 | "8000" x2 blocks (1 distinct claim) |
| FX2-b-editorial | 29 | 27 | 0.9310 | same |
| FX2-b-expressive | 29 | 27 | 0.9310 | same |

"8000" is ABSENT from fixture sources (grep-verified) and comes from the
idea-assembly header `--- README.md (first 8000 bytes) ---` (idea.txt:4):
the fallback planner heroed it as a number slide. The slide IS labeled
`unverified · illustrative · idea.txt:4` and the ref resolves — the chain
is intact but points at polluted analysis. Root cause: the Skill's
MECHANICAL-excerpt variant (02-style) leaks boundary markers into claim
extraction. The conversational DISTILL variant would not. Counterfactual
(not a result): without the leak, B accuracy would be 1.0.

### O2 evidence traceability (visible refs)

| Deck | Slides w/ refs | Line-level | File-level | Labeled unverified |
|---|---|---|---|---|
| A (both fx) | 9/9 | 0 | 9 (`Source: README.md`) | 0 (nothing to disclaim; all accurate) |
| B (all 6) | 8/10 | 8 (`idea.txt:N`) | 1 | 8 |

Neither arm cites fixture files at line precision. B's refs are precise
but one hop removed (idea.txt); A's are direct but imprecise (bare file).

### O5 rendered overflow (identical Chrome instrument both arms)

| Deck | Measured | Overflow blocks |
|---|---|---|
| FX1-a / FX2-a | 53/53, 51/51 | 0, 0 |
| B-swiss (FX1, FX2) | 36/36 | 0, 0 |
| B-editorial (FX1, FX2) | 36/36 | 0, 0 |
| B-expressive FX1 | 36/36 | **1** (`n7-point-b1`, body 78.7px: h 332>231, tol 43.3) |
| B-expressive FX2 | 36/36 | **3** (`n2-number-b1` "2 seconds" 192.7px: h 379>136, tol 86.7; `n2-number-b2` 72.6px: h 229>137; `n5-architecture-b1` 85.4px: h 449>339) |

All 4 are far above tolerance (real clips, not slivers): expressive display
type overflows its boxes while `validation: OK` + 0 critic errors hold —
the recon report's gap #1 (silent `overflow:hidden` clips) reproduced on
the product path. Static gates missed all 4; only the render gate caught
them. (Run 3 measured 0 everywhere because a font-quoting bug rendered B
in fallback Times — superseded; see §5.)

### O6 readability floors + contrast (px at 1280/1229-wide stage)

| Deck | min title px | min body px | min number px | min caption px | contrast <4.5 |
|---|---|---|---|---|---|
| FX1-a | 44.0 | 21.0 | — | 14.0 | **18** (9 kicker + 9 src, all 2.81:1 muted `#8a94a6` on paper) |
| FX2-a | 44.0 | 21.0 | — | 14.0 | **18** (same) |
| B-swiss | 37.3 / 40.0 | 16.0 / 16.0 | 96.0 / 96.0 | 12.0 / 12.0 | 0 / 0 |
| B-editorial | 61.4 / 56.0 | 20.0 / 20.0 | 160.0 / 160.0 | 13.3 / 13.3 | 0 / 0 |
| B-expressive | 72.0 / 72.5 | 18.7 / 18.7 | 226.7 / 192.7 | 13.3 / 11.3 | 0 / 0 |

A's titles/bodies pass; its chrome gray fails everywhere. B's smallest
text (11.3px expressive caption) still passes contrast.

### O4 composition diversity

| Deck | Distinct | max same share | Triple-repeat | Slide signatures |
|---|---|---|---|---|
| A (both) | 3 (`cover,stat×7,closing`) | 0.78 | **true** (7 stat in a row) | 3 / 2 of 9 |
| B-swiss | 8 | 0.20 | false | 4 of 10 |
| B-editorial | 9 | 0.20 | false | 4 of 10 |
| B-expressive | 7 | 0.30 | **true** (`evidence-focused` x3; raw `planCompositions` w/o art-direction balancing — supplementary) | 4 of 10 |

Cross-system B diversity (eval thresholds): 6/6 pairs PASS (differCount 2).

### O7 HTML/PPTX consistency / O8 editability / O9 structure

- O7 (B): slide-count match + 0 text mismatches all 6 decks. A: N/A
  (single artifact by design).
- O8 (B): 1185/1185 (FX1), 1371/1371 (FX2) editable chars, ratio 1.0,
  `forbiddenOk: true`. A: DOM text 1.0 by construction, 0 empty slides.
- O9: all decks 5-12 slides; B ships `validation: OK` (exit 0) x6.

### O10 generation time / O11 revisions / O12 correction effort

- O10 (wall, build excluded): A 38ms (FX1), 33ms (FX2); B 87/79/78ms
  (FX1 swiss/editorial/expressive), 76/77/75ms (FX2). Same order of
  magnitude; no latency claim either way. Engine-only `planDeck` latency
  (sidecars): 6-20ms.
- O11: B `reviseDeck` iterations 0 (critique 0 errors; 9-17 advisory
  warnings: `title-lines`, `widow-risk`, `body-measure`). A manual
  passes 0 (deterministic replay; generator fixes during dev are harness
  work, logged in JOURNAL, not per-run correction).
- O12: post-generation fixes to reach shippable: 0 both arms (no run was
  repaired after measurement; superseded runs were re-executed, not
  patched). Known shippability caveats are reported as findings, not
  fixed (§5).

## 4. Superiority rule, clause by clause

| Clause | Bar | Result |
|---|---|---|
| (a) O5 B-swiss strictly fewer overflow than A | < 0 | 0 vs 0 — FAIL (tie) |
| (b) O3 B zero fabricated | 0 | "8000" x2 blocks/deck — FAIL |
| (c) O1 B >= A | >= 1.0 | 0.889 / 0.931 — FAIL |
| (d) B `validation: OK` | exit 0 | 6/6 — PASS |
| (e) B no unfixed contrast failure | 0 | 0 — PASS |

3/5 → verdict MIXED/INCONCLUSIVE. No superiority claim. No subjective
claim (study pending).

## 5. Failure analysis (kept, not hidden)

1. **B "8000" marker leak (O1/O3).** Mechanical excerpt headers become
   claims. Fix direction (not applied — product behavior): strip assembly
   chrome before `extractClaims`, or prefer the DISTILL variant; add a
   "no header/footer tokens in claims" test.
2. **B cover title "Fixture: FX1-ledgerly."** Second chrome leak (idea
   line 2 used as cover title). Same fix family as (1).
3. **B-expressive render clips (O5).** 4 blocks clip 90-240px over box
   height with validation OK + 0 critic errors. Fix direction: numeral-box
   sizing + title wrap/orphan rules (recon gaps #2/#3); wire the rendered
   overflow gate into the ship path (it currently exists only as a critic
   API, and see (5)).
4. **A muted-gray contrast (O6).** Kicker/src 2.81:1. Generic-template
   failure class; fixable with a darker gray (not applied — frozen replay).
5. **Engine font-quoting bug (found via screenshot, OUT OF SCOPE).**
   `escapeHtml` never escapes `"`, so `preview-experimental.ts:117` and
   Agent C `renderMeasureHtml` (`critic.ts:527`) emit broken
   `font-family` declarations — the engine's own overflow mirror measures
   in fallback serif. One-line fix engine-side; this harness fixed its own
   renderer locally and re-measured (run 4).
6. **A repetition (O4).** 7 identical `stat` slides in a row; B-swiss/
   editorial show 8-9 distinct compositions over 10 slides.
7. **B-expressive plan triple-repeat.** `evidence-focused` x3 at the tail
   (raw plan; art-direction balancing not applied in the baseline path).

## 6. Subjective (human) — PENDING

Blind protocol + ballot: `../protocol-blind.md`,
`../ballot-template.csv`. No independent reviewers this session (n=0);
no scores invented. NON-EVIDENCE author observations (not results): B
decks read as designed systems (red kicker, serif/sans contrast,
alternating expressive fields); A reads as a clean but monotonous
document with a visible 7-slide `stat` run; B's "8000" slide and
"Fixture:" cover title are the visible tells of the marker leak.

## 7. Known-issue carryover (as-is, verbatim)

Agent B reports fresh `eval:report` gives OVERALL FAIL on F4
design-diversity (`document~swiss`, 2/30 pairs). Reproduced in the
throwaway (matrix 8/8 OK, S1-S7 all PASS, exit 1):

> `note: design-diversity FAIL on 2/30 pair(s): F4/en document~swiss,
> F4/ko document~swiss` · `diversity: 28/30 pairs pass` · `OVERALL: FAIL`

Both pairs fail with differCount 0 (same blocks/slide, headlines within
15%, same alignment mix) — the experimental 4th system is metrically
indistinguishable from swiss on F4. Full log: `eval-f4-diversity.log`.
Unrelated to the head-to-head (experimental system, different gate).

## 8. Remaining gaps

1. Blind A/B unexecuted (n=0) — blocks any subjective or "better deck"
   claim. Artifacts ready in `results/decks/`.
2. n=2 fixtures, both synthetic EN — no KO, no live repos, no numbers-heavy
   or hostile inputs; marker-leak rate (1/1 idea texts) needs a wider sample.
3. Fallback provider only — no `muse` run (no endpoint configured).
4. PPTX rendering unverified (no Office automation) — O7 is text parity,
   not visual parity; font substitution on real machines unmeasured.
5. Mirror risk: B HTML is a harness renderer (same geometry math as the
   engine mirror, quote fix applied), not apps/web SlideView output.
6. A is a frozen deterministic replay, not a live agent turn — realistic
   only insofar as the committed prompt + generator are a fair reading
   (both committed for inspection).

## 9. Reproduction

```sh
rm -rf /tmp/td-g && git clone <repo> /tmp/td-g && cd /tmp/td-g \
  && git checkout b09865c \
  && git checkout origin/agent/c-composition -- packages/core/src packages/core/tests \
  && git checkout origin/agent/b-skill -- skills/typodeck \
  && npm install && npm run build -w @typodeck/core
git checkout agent/g-benchmark   # this branch (harness + fixtures)
TD_CORE_DIST=/tmp/td-g/packages/core/dist OUT=/tmp/td-g-out \
  bash evals/product-benchmark/run.sh   # ~1 min, offline, 0 quota
# headline inputs: $OUT/results.json vs evals/product-benchmark/results/results.json
```
