# Typodeck — Design System (Phase 0)

> Note (2026-10-31): §3 "Three Systems" predates the versioned
> registry — the baseline ships editorial / swiss / expressive as
> production plus `document` as experimental
> (`packages/core/src/visual-systems.ts`). Constraint text (§1/§2/§4/§5)
> verified current.

## 1. Typography-Only Constraint
Every slide is composed exclusively of editable text, numbers, whitespace, and flat
color/background. No other visual primitives exist in the renderer or exporter.

## 2. Allowed vs Forbidden
**Allowed:** editable text runs; numerals/stats; font family/size/weight; letter-spacing
(tracking); line-height (leading); left/center/right alignment; whitespace (margins,
gutters, vertical rhythm); solid text color; solid slide background color; editorial
composition (asymmetry, scale contrast, grid alignment of text boxes).
**Forbidden:** decorative rectangles/cards/panels/boxes; borders/strokes; connector
lines, rules, arrows; icons, emoji, stickers; stock/generated/raster imagery; rasterized
or outlined (uneditable) text; gradients, shadows, textures.

## 3. Three Systems (same factual content, materially different composition)
| System | Composition | Density | Type treatment |
|--------|-------------|---------|----------------|
| Editorial | Refined asymmetric whitespace; single large idea per slide, generous margins | Low (≤ 3 blocks/slide typical) | Serif/display headline + light body, wide tracking kickers |
| Swiss | Rigorous grid; multi-column text alignment, high information density | High (≤ 6 blocks/slide) | Neo-grotesque, tight leading, strict baseline rhythm |
| Expressive | Dramatic scale contrast; oversized numerals/keywords, kinetic-type-inspired static | Medium (≤ 4 blocks/slide) | Bold condensed headlines, extreme size ratios (≥ 4:1 hero:body) |

Diversity check: same outline rendered in all three must differ in ≥ 2 of
(blocks-per-slide distribution, median headline size, alignment mix) beyond thresholds
in EVALUATION.md.

## 4. Canvas & Type
- 16:9 (13.33 × 7.5 in). Safe margins ≥ 0.5 in all sides.
- KO: Pretendard / Noto Sans KR fallback; EN: Inter / system sans. Serif (Editorial):
  Noto Serif KR / Source Serif fallback. All fonts must permit embedding; fallback chain
  resolved at export, recorded in deck metadata.
- Overflow: KO uses character-level break rules, EN word-level; layout engine verifies
  every box; zero overflow is a release gate.

## 5. Color
Per-direction fixed palettes (background + ink + ≤ 2 accents), contrast ≥ 4.5:1 for body
text. No per-slide ad-hoc colors; theme tokens only.
