# Typodeck Skill — Evaluation (read on demand)

## Benchmark (reproducible, paired)

- Fixtures: `evals/benchmark-90/fixtures.json` — 8 HELD-OUT ideas (B1-B8:
  Korean hackathon, EN technical showcase, AI research, comparison, data-heavy,
  text-heavy, short idea, mixed KO-EN). Never used for tuning.
- Run: `node packages/core/dist/scripts/benchmark-90.js --out output/benchmark-90`
  → 48 PPTX (8 × 3 systems × baseline/improved) + `summary.json`.
- SAME narrative bytes feed both modes. Objective metrics: forbidden,
  editability, overflow, unsupported metrics, title/body violations, widows,
  rag, contrast, repetition, triple-repeat. Deltas are reported BOTH ways —
  list every pair where the baseline wins. Font substitution and clipping are
  UNMEASURED (no rasterizer); say so every time.

## Blind A/B (pending until real reviewers participate)

- Protocol: `evals/benchmark-90/protocol.md`. Randomized A/B per
  (fixture, system); 7 Likert questions + forced choice + failure notes.
- Rubric: `evals/benchmark-90/rubric.md` — 100 points across 6 dimensions
  with pre-registered pass criteria. 90+ is a target, never a claim without
  evidence. Ballots: `ballot-template.csv`.
- Never invent participants, ballots, or scores. If no reviewers are
  available, write "study PENDING" and stop.

## Honest reporting

Current report: `evals/90-program-report.md` (provisional score + missing
validation). Always include: sample sizes, failures, baseline-better cases,
uncertainty, and what remains unverified. Do not optimize for the rubric —
optimize for demonstrably better presentations.
