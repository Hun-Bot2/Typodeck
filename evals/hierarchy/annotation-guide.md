# B/D Pilot Protocol — Screenshot/Model Arms (STAGED, NOT RUN)

This file stages arms B (image-only) and D (screenshot + structured layout +
intended importance) from `research/paper-survey/09-HCI-reinterpretation.md`
§4. The pilot CAPTURES screenshots and PROPOSES machine labels. It does NOT
score B/D, does NOT recruit reviewers, and invents NO human labels.

## Human-review gate (binding)

> No superiority claim for any arm (in particular D > B/C) may be made
> without human ground truth collected under this protocol. Machine-proposed
> labels are explicitly NOT ground truth. Same-model generation-and-judgment
> (a model scoring its own screenshots) is prohibited as validation evidence.

Pre-registered success criteria for a future full run (from 09 §4): D's
error-detection F1 significantly higher than B/C, with human agreement at
ρ 0.85+ or exceeding the 0.71 line — computed ONLY against human labels.

## What exists now

- `capture-screenshots.mjs` — headless-Chrome `--screenshot` over the
  existing HTML mirror path (`core renderMeasureHtml`) ONLY.
- `results/screenshots/*.png` — mirror screenshots (MIRROR-RISK: NOT PPTX
  renders; never claim PPTX parity).
- `results/screenshots/proposed-labels.csv` — machine-PROPOSED ranks from
  C4 prominence order. Every row carries `PROPOSED-NOT-GROUND-TRUTH`.
- `annotation-template.csv` — blank ballot for human reviewers.

## Reviewer procedure (future work)

1. View each PNG full-screen at fixed zoom (record screen size, distance).
2. Per screenshot, rank blocks by perceived importance (1 = first read).
   Fill `human_rank` / `human_emphasis`; ignore the proposed columns.
3. Flag hierarchy errors: deliberate shrinking, auxiliary enlargement,
   contrast inversion (the §4 error types).
4. No discussion between reviewers until all ballots are in (≥3 reviewers,
   ≥1 with typography/design background; cf. `evals/benchmark-90/protocol.md`).
5. Analysis: arm-vs-human agreement (Spearman ρ, top-1 hit), error-detection
   F1 per arm with 95% CIs, inter-reviewer κ. Report every B/D-vs-human
   disagreement; no cherry-picking.

## Model-judge separation (when D is eventually run)

- The judging model MUST differ from any model that produced the content
  under review (judge–generator separation, 09 §3.5).
- Report judge identity + version; re-running with a second judge family
  is required before any generality claim.
- UMSI-class perceptual models are unverified on slides: slide-transfer
  validation is a precondition, not a footnote.
