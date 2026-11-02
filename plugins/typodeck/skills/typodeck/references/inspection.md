# Typodeck Skill — Render Inspection incl. Overflow Detection (read on demand)

Source: `packages/core/src/critic.ts` (`critiqueDeck`),
`packages/core/src/validate.ts` (`validatePptx*`),
`packages/core/src/layout.ts` (`estimateWrap`, `fitText`).

Assume the first render is wrong. Inspect in this order — structural
gates first, proxies second, eyes last — and fix at the source
(Markdown/narrative/composition), never by patching a PPTX.

## 1. Structural gates (deterministic, must pass)

`validatePptx(path, expectedChars)` / `validatePptxBytes(bytes,
expectedChars)` unzips the package and asserts: 16:9 slide size, zero
forbidden objects (shapes/pictures/borders — the typography-only
gate), all text in editable `a:t` nodes, every box in-bounds, and at
least `expectedChars` editable characters (guards against
empty/rasterized decks). Stats returned:
`{slides, textShapes, editableChars, slideSizeIn}`. Ship only on
`ok: true` (`validation: OK`).

## 2. Overflow detection (what "overflow" means here)

True PowerPoint wrapping is UNMEASURED — PowerPoint wraps its own way
(T11) and no rasterizer is integrated. What Core does measure:

- `estimateWrap`/`fitText`: per-box line-fit estimates at layout
  time; the renderer relaxes via a global `sizeScale` when content
  does not fit — but policy forbids shrinking type to fit
  (`references/density.md` readable floors): overflow must split
  the slide instead.
- `critiqueDeck(deck, narrative?, plan?)` → `{findings, scores,
  visionUnmeasured}`. Structural findings (bounds, overlap) plus
  honestly-labeled GEOMETRIC PROXIES: title ≤2 lines, body
  ≤~60 chars/line (derived heuristics), widow/rag scores,
  title > body hierarchy, WCAG AA contrast (projection transfer
  unvalidated, C06), `unsupported-metric` semantics.
- Eval's `over=` metric counts estimated-overflow boxes per deck;
  the suite gates on it (`references/evaluation.md`).

Name every `visionUnmeasured` item (real wrap, font substitution,
clipping, optical verdicts, vision-model scores) as unverified in
your report. Never present structural green as visual approval.

## 3. Eyes-on checklist (typography-only adversarial pass)

`references/revision.md` carries the canonical checklist (overlap,
cut-off text, kicker collisions, <0.3 in gaps, <0.5 in margins,
uneven whitespace, contrast, widows, mixed-script baselines,
monotonous repetition, empty-but-valid slides) plus the handoff
honesty block (HTML previews ≠ PPTX proof; substitution shifts
wraps). One full fix-and-verify cycle completes before any success
claim; one fix often moves another problem, so re-verify affected
slides and re-run the critic + validator after every repair
(`references/revision.md`, `references/export.md`).
