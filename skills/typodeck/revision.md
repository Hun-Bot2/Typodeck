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
