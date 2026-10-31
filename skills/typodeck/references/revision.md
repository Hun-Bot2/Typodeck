# Typodeck Skill — Revision (read on demand)

Source: `packages/core/src/critic.ts`.

## Critic checks

Structural (deterministic): bounds, overlap, plus the `validate.ts` PPTX gate
(forbidden objects, editable text, 16:9, overflow). Perceptual/design
(GEOMETRIC PROXIES, honestly labeled): title≤2 lines, body≤~60 chars/line
(both derived heuristics), widow/rag scores, hierarchy (title > body size),
WCAG AA contrast (projection transfer unvalidated, C06), unsupported-metric
semantics. `visionUnmeasured` always lists what proxies cannot see: real wrap
(T11), font substitution, clipping, optical verdicts, vision-model scores
(no verified integration — never fabricate them).

## Failure classes and fixes

`critiqueDeck(deck, narrative?, plan?)` → findings with
`semantic|structural|typographic|perceptual` class + `suggestedFix`.
`reviseDeck(narrative, systemId, {maxAttempts=3})` loops: critique → fix the
first error by class (semantic demotion to `metric-anchored`, or alternate
same-type candidate) → regenerate → re-evaluate. Bounded: stops on clean,
on no-alternate, or at max attempts. Content is NEVER rewritten for looks.

## Provenance and uncertainty

Every attempt appends a provenance line (what failed, what was tried).
Report: attempts used, residual errors/warnings, and all `visionUnmeasured`
items as unverified. An AI critic — or these proxies — is not ground truth.

## Adversarial inspection checklist (typography-only)

Adapted from presentation-skill's "assume problems" visual-QA pass.
First render is almost never correct: hunt defects, don't confirm.
For each slide (rendered preview or contact sheet), check:

- Text overlapping other text; text cut off at box/slide edges.
- Title wrapped to 2 lines with rag/spacing tuned for one.
- Kicker/caption colliding with content above or below.
- Gaps < 0.3 in between blocks; margins < 0.5 in from slide edges.
- Uneven whitespace (large void + cramped corner on one slide).
- Low-contrast text (body < 4.5:1; captions weaker still).
- Widows/orphans; mid-word splits (especially mid-eojeol in KO).
- Mixed-script baseline mismatch (KO/Latin runs visually offset).
- Monotonous repetition: same skeleton 3+ slides in a row.
- Slide technically valid but reading as empty or pointless.

Fix at the source (Markdown/narrative/composition), re-render,
re-verify affected slides — one fix often moves another problem.
No success declared before one full fix-and-verify cycle completes.

## Handoff honesty block

Tell the user, every delivery:

- HTML previews are NOT proof of PPTX fidelity (different text
  engines; line breaks can move; verify in PowerPoint once).
- Fonts: stacks are system fonts; substitution on other machines
  can shift wraps — tightly tracked headings are most at risk.
- Name every `SKIPPED` QA layer and `visionUnmeasured` item.
  Never present structural green as visual approval.
