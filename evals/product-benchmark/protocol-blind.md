# Blind A/B protocol — product benchmark (subjective §6b)

Status: PENDING (no independent reviewers in this session; do not invent).

## Design

- Paired blind A/B per fixture: Arm A deck vs Arm B-swiss deck, labels
  "Option 1"/"Option 2" randomized per reviewer (seed recorded).
  Artifacts: `results/decks/<SHORT>-a.html`, `results/decks/<SHORT>-b-swiss.html`.
- Same viewport (1280x720+), same browser, full click-through of every
  slide in both decks before scoring. No filenames/metadata shown.

## Questions (7-point Likert: 1 strongly prefer Option 1 ... 4 tie ... 7 strongly prefer Option 2)

1. Narrative coherence — the deck tells one clear story in order.
2. Typography hierarchy — titles, key points, details are clearly ranked.
3. Readability — comfortable to read at presentation distance.
4. Professional quality — looks like work a studio would ship.

Plus forced choice ("Which deck would you present?") and a free-text
failure note (deck + slide + what fails).

## Reviewers

Target n>=3; at least one with design/typography experience. Record id
(anonymous), background, date, renderer + version. No discussion until all
ballots are in. Ballots: `ballot-template.csv` (one row per reviewer x
fixture).

## Analysis (pre-registered)

Mean forced-choice win rate with Wilson 95% CI; per-question mean Likert
with 95% CI; Fleiss' kappa. Report ALL pairs incl. baseline wins. No
AI-generated numerical ratings count as evidence.
