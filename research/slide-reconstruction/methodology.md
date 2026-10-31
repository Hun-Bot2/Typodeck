# Methodology

## Source selection (Phase 2)

1. Survey the 447 corpus first; classify each candidate as slide deck
   vs poster/website/other. Expect ~0 usable decks (record the count).
2. Supplement with legitimate public sources only: open-licensed
   (CC-BY/SA/NC, KOGL, US federal public domain) or explicitly
   reusable decks with lawful download. No paywall/auth bypass.
3. Record every source in `sources.json`:
   `{id, creator, title, url, year, format, license, downloadable,
   verified, rationale}`. `verified` is true only after the file was
   fetched and its license statement read in full.
4. Captures: store source slide images in-repo ONLY when the license
   permits redistribution (CC-BY/SA/NC allow it with attribution;
   record the exact license). Otherwise link + analyze without
   storing pixels.

## Capture (Phase 3)

- `pdfinfo` for page size; `pdftoppm -png -r 150` for consistent
  captures, original aspect preserved, filenames `<source>-p<NN>.png`.
- Analysis template per slide: canvas, hierarchy, typeface category
  (never invent exact font names), relative sizes/weights, spacing,
  alignment, grid, margins, baselines, proportions, contrast,
  cropping/overflow, density, semantic roles, neighbors.
- Estimates marked `EST`. Rendering defects vs intent distinguished.

## Reconstruction (Phase 4)

- Pilot: 3–5 slides from one source before scaling to 12–20.
- Tier A (planner-driven): author Slide Markdown v1 →
  `parseSlideMarkdown` → `slideIRToNarrative` → `planCompositions` →
  `layoutDeck({compositionPlan})`. Record candidate ids + fallbacks.
- Tier B (schema-direct): hand-place TextBlocks (any x/y/w/h the
  schema allows) → `validateDeck` → HTML + `exportToPptxBuffer` →
  `validatePptxBytes`. Still native editable text only; still no
  raster backgrounds, no screenshot fills, no decorative objects.
- Fonts: use legally available fonts (system + open-licensed);
  document substitutions and their fidelity cost.
- Every case keeps reconstructions OUT of production templates
  (`cases/`, never `packages/` presets).

## Comparison (Phase 5)

- Same-dimensions render: source PNG + reconstruction HTML screenshot
  (Playwright/Chromium) + PPTX opened... (no PowerPoint automation;
  PPTX checked structurally + via Google-Slides-impossible — see
  honesty note: HTML-to-PPTX consistency is checked by text-parity
  extraction + validator, and labeled as such per ADR-0007).
- Side-by-side images + difference images (PIL).
- 10-axis rubric scored per case with measurements where reliable;
  every reconstruction visually inspected; failures recorded.

## Generalization (Phase 6–7)

- A grammar candidate must reproduce the reference AND survive new
  content: short/medium/long text × 2 purposes × en/ko where
  applicable, readable + intentional, editable PPTX inspected.
- One-trick layouts are rejected, not templated.

## Skill assessment (Phase 8)

- Map each finding to exactly one home: core grammar, system config,
  selection metadata, skill reference doc, or QC rule. No duplicated
  rendering logic in the skill (ADR-0008).
- Compare against `zarazhangrui/frontend-slides` selection-index
  approach (read-only inspiration; check its license first).
