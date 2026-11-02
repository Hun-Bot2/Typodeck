# Agent C evidence — overflow gate + G1/G3 grammar

Branch: `agent/c-composition` (from `b09865c`). Inputs: Tier-B geometry + probe
contents copied read-only from `research/slide-reconstruction@088e510`
(see `inputs/SOURCES.txt`). Regenerate: `node output/agent-c/generate.mjs`
(requires built core + headless Chrome; writes `.html/.png/.pptx/.deck.json`
per case + `EVIDENCE.json` + `candidate-index.json`).

## 1. Rendered overflow gate (P0, Q1 OVERFLOW-MUST-BE-VISIBLE)

Design (`packages/core/src/critic.ts`): headless-Chrome `scrollHeight` vs
`clientHeight` (and width) per `.slide-block`, on SlideView HTML or the
core-local mirror (`renderMeasureHtml`, same geometry math + `.slide-block`
CSS + `data-block-id`). Real SlideView HTML has no block ids, so the probe
also matches by index with count verification. Vertical tolerance
`(lineHeight − 0.5)em` covers font-extent line boxes (measured 1.07em in
Chrome) against cap-height ink (~0.7em); a fully lost line adds ≥0.8em so
real clips still fire. Intentional cropping ONLY via explicit opt-in —
per-block `allowOverflow: true` (provisional until the schema carries the
flag — Agent A owns schema) or the `intentional` allowlist. The gate never
guesses: unmeasured blocks warn (`overflow-unmeasured`).

Static companion: ink-aware `overflow-risk` warning in `critiqueDeck`
(rendering clips ink, not line boxes), and the layout loop now retries
smaller scales on estimated overflow (R3 "shrink") instead of silently
clipping; the final scale emits so pathological input warns rather than
throws (only true overlap throws).

Before/after (all `before/*` validate OK — the clips are silent to the
validator, which is the finding):

| case | validation | static risk | rendered gate |
|---|---|---|---|
| before-g1-long-en (number "12", long title) | OK | number, title | ERROR number 639>240px, title 175>120px — "12"→"1" + 2nd-line clip, exactly the research failure |
| before-g1-metric (number "98%") | OK | number | ERROR number 308>288px wide + 947>240px high |
| before-g3-long-en (faithful probe) | OK | — | clean locally — the research body1 clip is font-sensitive (fits exactly, dY=0, under macOS fallback fonts; clipped under wider research fonts) |
| before-g3-deep (body1 +2 lines, synthetic) | OK | body1 | ERROR body1 170>130px — G3 clip class, deterministic |
| after-g1-long-en [G1, R1+R2] | OK | — | clean |
| after-g1-metric [G1] | OK | — | clean |
| after-g3-long-en [G3 forced, 11-body Tier-B shape] | OK | — | clean |
| after-g1-long-ko [G1, editorial] | OK | — | clean |
| after-g3-long-ko [G3 forced, editorial] | OK | — | clean |

## 2. Grammar integration (P1)

- `opening-monumental-numeral` (G1): kicker → numeral (~30% canvas height,
  Tier-B 231pt) → title (~1/4 numeral) → footer triad; R1 numeral width from
  measured advance + pad; R2 one step down (×0.72) + 2-line box past 1 line.
- `evidence-explainer-columns` (G3): runhead/headline/lede + grouped columns
  (single-col ≤2 middle bodies, 2-col above) + closing + triad; R3 shrink to
  min, spill into following whitespace, slide-level retry, residue flagged.
- Selection metadata on every record (`bestFor`, `avoidFor` defaulting to
  `exceptions`, `density`, `formality`) + `candidateIndex()` (derived live;
  `candidate-index.json` is a convenience snapshot). O1–O5 NOT promoted
  (asserted in tests). Grammar 0.1.0 → 0.2.0 (candidates added).
- Matrix (in `packages/core/tests/grammar-g1g3.test.ts`): short/med/long ×
  swiss/editorial × EN/KO per candidate — every cell validates, fits
  statically, renders clip-free in headless Chrome, and exports editable
  PPTX that passes `validatePptxBytes` with full char counts.

## 3. Honest limits

- PPTX parity is STRUCTURAL ONLY (byte-identical `<a:t>` runs, box counts,
  validator acceptance). PPTX rendering is unverified (no Office
  automation) — never claimed otherwise.
- Rendered measurements use locally available fonts (production faces may be
  absent); wrap is font-sensitive (see before-g3-long-en). CI should install
  the production stacks for stable gates.
- The core mirror duplicates SlideView geometry math; if SlideView changes,
  re-verify the mirror (prefer measuring real SlideView HTML when available).
- Star subheads as own-body blocks stack vertically (Tier-B inlines ★ left
  of subheads); engine narratives should inline ★ in subhead text.
- G4 (400pt cap) and G2 (unprobed) untouched per research verdicts.
