# Stage-4 Hierarchy Evaluation Report

Suite: `evals/hierarchy/` (NEW files only; no existing `evals/`, `packages/`,
or `apps/` file modified). Design basis: `research/architecture-audit/
05-stage3-contracts.md` (C1/C3/C4/C7) and `research/paper-survey/
09-HCI-reinterpretation.md` §4 (A/B/C/D modality split).

Arms executed: **A** (text-only), **C** (layout-only), **BEFORE/AFTER**
(flags-off vs `--revise` equivalents). Arms **B/D** (screenshot/model) are
**staged only** — screenshots captured, labels proposed, nothing scored
(see `annotation-guide.md` and the NOT-PROVEN list).

Raw data: `results/stage4-results.json` (124 scored items, full findings).
No combined score is computed anywhere in this suite, by design.

## 1. Inputs

16 intent-annotated single-slide fixtures (`fixtures.json`): monumental
numeral (F01 EN + F07 KO), stats (F02/F08), editorial opening (F03/F09),
grouped explainer (F04/F10), 2-col comparison (F05/F11), dense (F06/F12),
intentional-crop expressive (F13 EN + F14 KO), diversity probe F15 (rendered
under **document AND swiss**), minimal F16. 17 clean decks (F15 × 2 systems).

Controlled seeds: 44 narrative-level (strip-emphasis ×17, primary-on-caption
×17, dangle-group ×10) + 63 deck-level verified mutations (demote-primary
×17, number-scale ×2, grouping-swap ×10, clip-support ×17, contrast-fail
×17). Every deck seed verifies its own predicate post-mutation; unverifiable
seeds are recorded as inapplicable, never forced.

BEFORE = `planCompositions` + `layoutDeck(seed 42)` (flags-off equivalent;
seed 42 matches `reviseDeck`'s internal seed so the comparison isolates the
revision loop; the one documented delta is attempt-0 art-direction
rebalancing). AFTER = `reviseDeck(narrative, system, {maxAttempts: 3})`
(the exact `--revise` path). 61 BEFORE/AFTER inputs (17 clean + 44
narrative-seeded). Deck mutations are detection-only: the revise loop
re-lays-out from narrative bytes and cannot see them (scope rule).

## 2. Gates (8/8 PASS)

| Gate | Result | Detail |
|---|---|---|
| fixtures-valid | PASS | 16/16 narratives validate (strict C1) |
| fixture-drift | PASS | knownGood primary matches recomputed intent |
| prominence-parity | PASS | eval C4 formula == core on all blocks, exact |
| c4-agreement | PASS | eval c/* == frozen checks on all 80 decks |
| pptx-editability | PASS | 122/122 exports `validatePptx` OK |
| text-parity | PASS | BEFORE/AFTER texts identical, 61/61 |
| clean-stays-clean | PASS | 0 new errors AFTER on clean inputs |
| no-ping-pong | PASS | attempts ≤ 3, no repeated alternate, 61/61 |

## 3. Hierarchy metrics (clean BEFORE decks, n = 17)

Hierarchy Agreement = Spearman ρ(intent rank, −P) per slide (positive =
agreement; averaged-tie ranks; null on zero variance, none occurred):

| Deck | ρ | Deck | ρ | Deck | ρ |
|---|---|---|---|---|---|
| F01/swiss | 0.949 | F07/swiss | 0.949 | F13/expressive | 1.000 |
| F02/swiss | 0.984 | F08/swiss | 0.984 | F14/expressive | 1.000 |
| F03/editorial | 0.949 | F09/editorial | 0.949 | F15/document | 0.791 |
| F04/swiss | 1.000 | F10/document | 1.000 | F15/swiss | 0.580 |
| F05/document | 1.000 | F11/document | 1.000 | F16/editorial | 1.000 |
| F06/document | 1.000 | F12/editorial | 1.000 | | |

Summary: mean 0.949, median 1.000, min 0.580, max 1.000, sd 0.105.

- Primary Emphasis Accuracy: **15/17** (misses: F15/document, F15/swiss —
  number is max-P while title carries primary; 0 ties, 0 excluded).
- Grouping Consistency: **5/12** groups uncut (F05 left/right, F11
  left/right, F10 steps survive; hero/stats/steps groups split on swiss
  opening-* candidates and both F15 layouts).

Uncertainty: n = 17 slides; per-slide n = 2–7 blocks (rank granularity is
coarse; ρ = 1.000 on F16 is a 2-block triviality). No human ground truth:
ρ measures intent-vs-proxy alignment, NOT perceived hierarchy.

## 4. Defect detection P/R per seeded category

Primary scope (each arm on same-level seeds; negatives = 17 clean decks):

| Arm | Category | P | R | tp | fp | fn | pos |
|---|---|---|---|---|---|---|---|
| A | headline-prominence | 1.000 | 1.000 | 34 | 0 | 0 | 34 |
| A | grouping | 1.000 | 1.000 | 10 | 0 | 0 | 10 |
| A | number-scale/clip/contrast | n/a | n/a | 0 | 0 | 0 | 0 |
| C | headline-prominence | 0.895 | 1.000 | 17 | 2 | 0 | 17 |
| C | number-scale | 0.500 | 1.000 | 2 | 2 | 0 | 2 |
| C | grouping | 0.588 | 1.000 | 10 | 7 | 0 | 10 |
| C | clip | 0.850 | 1.000 | 17 | 3 | 0 | 17 |
| C | contrast | 1.000 | 1.000 | 17 | 0 | 0 | 17 |

Cross scope (diagnostic): A on deck-level seeds: R = 0.000 in all five
categories (blind by design — the predicted §4 modality gap). C on
narrative-level seeds: headline R = 0.500 (strip-emphasis 0/17 — correct
silence, missing annotation ≠ visual defect; primary-on-caption 17/17),
grouping R = 1.000 (10/10 dangle-group via c/dangling-group).

Caveats: A-primary 1.000/1.000 measures rule/seed co-consistency, not
generalization (rules and narrative seeds were co-designed). C clip seeds
are verified against the eval's own estimate-only model (circularity —
§6.3). C number-scale positives = 2 (only F15 has a non-primary number),
both on decks where the predicate already fires clean (§6.1).

## 5. BEFORE/AFTER (flags-off vs --revise, 61 inputs)

| Measure | BEFORE | AFTER | Δ |
|---|---|---|---|
| Error findings (total) | 0 | 0 | 0 |
| Warning findings (total) | 66 | 66 | 0 |
| Inputs with ≥1 error | 0/61 | 0/61 | 0 |
| Repair Effectiveness (errors cleared / before) | — | — | N/A (0/0) |
| New errors introduced | — | 0 | 0 |
| Text parity (identical texts) | — | 61/61 | — |
| PPTX editable (validatePptx OK) | 61/61 | 61/61 | 0 |
| Revise attempts (all inputs) | — | 1 | loop idle |

The bounded loop behaved correctly and did nothing: all 61 AFTER runs stop
at attempt 1 ("clean — stop"). Repair Effectiveness is unmeasurable in
narrative space — layout guards structural errors, colors are systemic
(contrast cannot fail from narrative bytes), and hierarchy findings are
advisory warnings that do not trigger the first-error-fix loop (C6/C7).
The regression half holds: no new errors, no warning delta, byte-stable
texts, no ping-pong.

Diversity (F15 document vs swiss): candidates differ
(manual-opening vs opening-monumental-numeral) and geometry differs, BOTH
before and after revise. The F4 full-deck `document~swiss` diversity FAIL
does NOT reproduce on this single-slide probe — different input (1 slide
vs 10-slide deck), so this is NOT a refutation, only a non-reproduction
on a narrower probe.

## 6. Failure analysis

1. **F15 designed tension (headline + number-scale "FP").** The clean F15
   intent (title primary, number secondary) conflicts with monumental
   layouts that glorify the number (swiss: number P exceeds primary by
   305%). The frozen C4 check fires identically (c4-agreement 100%), so
   these are annotation-vs-layout conflicts, not detector errors. Open
   question for human review: is the layout right and the annotation
   wrong, or vice versa.
2. **Grouping 5/12 is system-dependent.** Document `manual-*` candidates
   keep groups together (5/5 uncut on F05/F10/F11); swiss `opening-*`
   candidates interleave the title inside group bboxes (0/5 on
   F01/F02/F04/F07/F08). Expected under Stage 3 (C1 passthrough; layout
   is intent-agnostic) — this number quantifies how far intent-aware
   selection alone (C6) falls short of proximity grouping.
3. **Clip FP = estimate-vs-estimate disagreement.** `c/support-clip`
   (eval estimate) fires on 3 clean decks where core `estimateWrap`
   stays silent (borderline F01/F07 titles; F15-swiss number). Mirror
   pixels agree with the eval estimate on the F15-swiss number — but
   that is MIRROR-ONLY corroboration (see §8), never PPTX evidence.
4. **F12 × swiss overflows the engine.** Dense KO content on swiss scale
   throws `overlapping text blocks` at every probed seed/plan; the
   fixture moved to editorial (verified OK). Engine limitation, out of
   Stage-4 scope (no engine files touched).
5. **A-primary perfection is circular by construction** (§4 caveats);
   treat as a consistency check, not a capability claim.

## 7. Cost and runtime

$0 (no models; local headless Chrome). Deterministic run: 322 ms total
(~0.08 ms layout + ~0.16 ms revise + ~4.46 ms PPTX export/validate per
input; export dominates). Screenshots: 14.5 s for 17 PNGs (~0.85 s/shot).
Artifacts: 122 PPTX + 17 PNG + 17 mirror HTML + results JSON (~170 KB).

## 8. Known limits

- Single-slide narratives only; deck-level rhythm/coherence unevaluated.
- n = 16 fixtures / 17 decks: small; CIs would be wide — none are
  claimed beyond per-slide tables and sd.
- `rendered/substitution` and `rendered/unintended-wrap` (C4) need probe
  signals; unmeasured here, staged for B/D.
- Number-scale 1.5× threshold is eval-chosen, not frozen; sensitivity
  untested.
- Intentional-crop opt-in (F13/F14) verified only as absence-of-findings
  on clean decks (no overflow seeded there); rendered-clip suppression
  needs the headless gate (B/D).
- Mirror screenshots ≠ PPTX renders (MIRROR-RISK): the F01/F15 mirrors
  show numeral descenders touching box edges while char models disagree
  — mirror CSS artifact vs real clip is undecidable without PPTX
  rasterization. Never cite these PNGs as render evidence.

## 9. NOT-PROVEN list (explicit)

1. B/D pilot + human review pending: NO arm-superiority claim (esp. D >
   B/C) is supported; the §4 hypothesis remains untested.
2. No human-agreement number (ρ/κ) exists for any metric here.
3. UMSI-class perceptual transfer to slides: unverified (precondition).
4. Repair Effectiveness on genuine errors: unmeasured (0 errors seen).
5. Clip/contrast findings: proxy-only; no rendered ground truth.
6. Generalization beyond these 16 fixtures / 5 systems-covered pairs.
7. The F4 `document~swiss` diversity FAIL is neither confirmed nor
   refuted (single-slide non-reproduction only).
8. Same-model self-validation: prohibited and not attempted.

## 10. Reproduce

```
./node_modules/.bin/tsc -p evals/hierarchy/tsconfig.json
node evals/hierarchy/dist/run.js
node evals/hierarchy/capture-screenshots.mjs
```

Outputs: `results/stage4-results.json`, `results/pptx/*.pptx`,
`results/screenshots/*.png` + `proposed-labels.csv`.
