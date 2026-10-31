# 90+ Benchmark — Blind A/B Human Evaluation Protocol

Status: PENDING (no reviewers recruited; no results invented).
Artifacts: `evals/benchmark-90/fixtures.json` (8 held-out ideas B1-B8),
`output/benchmark-90/*.pptx` (48 paired files: 8 fixtures x 3 systems x 2 modes),
`output/benchmark-90/summary.json` (objective metrics).

## 1. Design

- Paired blind A/B: for each (fixture, system) pair, reviewers see baseline
  and improved decks side by side in RANDOMIZED order (labels "A"/"B" only).
  Randomization seed recorded per reviewer; order never reveals the mode.
- Same narrative bytes feed both modes (provenance in benchmark script).
- Reviewers MUST NOT know which system produced which deck. Do not show
  filenames, metadata (`generatedBy`), or the objective summary before scoring.

## 2. Reviewers

- Target: >=3 reviewers; at least one with substantial graphic-design or
  typography experience (record background + years).
- Record: reviewer id (anonymous), background, date, viewing setup
  (screen size, distance, projector vs monitor).

## 3. Questions (7-point Likert: 1 strongly prefer A ... 4 tie ... 7 strongly prefer B)

Per pair, rate which deck is better on:

1. Clarity — the main point of each slide is immediately graspable.
2. Hierarchy — titles, key points, and details are clearly ranked.
3. Professional quality — looks like work a studio would ship.
4. Readability — comfortable to read at presentation distance.
5. Balance — whitespace and text feel evenly distributed, nothing cramped.
6. Distinctiveness — the three systems feel like different designs (rate
   the SET of 3 improved vs 3 baseline per fixture, not per pair).
7. Narrative appropriateness — emphasis matches what the content argues.

Plus per-pair forced choice: "Which deck would you present?" (A / B / tie)
and a free-text failure note (slide number + what fails).

## 4. Procedure

1. Export each pair to PDF (or open PPTX in the same renderer) at the same
   zoom; view full-screen, advancing at own pace (~60-90 s/slide max).
2. Score all pairs for one fixture before moving to the next (fixture order
   randomized per reviewer).
3. No discussion between reviewers until all ballots are in.
4. Ballots: one row per (reviewer, fixture, system) with Q1-Q7 + choice +
   failure note. Template: `evals/benchmark-90/ballot-template.csv`.

## 5. Analysis (pre-registered)

- Primary: mean forced-choice win rate for improved vs baseline with
  Wilson 95% CI; per-question mean Likert with 95% CI.
- Agreement: Fleiss' kappa (forced choice) + Krippendorff's alpha (Likert).
- Report: sample sizes, all CIs, every failure note, and ALL pairs where
  the baseline wins (no cherry-picking). A 90+ claim requires the
  pre-registered pass criteria in `rubric.md`.
- No AI-generated numerical ratings count as evidence of improvement.

## 6. Rendering note

- Human scores judge RENDERED slides (PowerPoint/LibreOffice/Quick Look),
  not JSON geometry. Record renderer + version per reviewer.
- Known unmeasured factors: font substitution, real wrap vs estimateWrap
  (T11), clipping inside boxes. Reviewers flag visible instances as failures.
