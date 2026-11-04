# Monolith — Korean Typography Override

Parent: `../design.md` (owns monolith palette, mega-scale bands, strip labels,
case-count devices — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/bands inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: monumental condensed colossus → Pretendard Black)

| Parent role | Parent face | Korean face |
|---|---|---|
| mega / display / headline (Anton) | Anton | Pretendard **900** (condensed n/a — monumentality via Black weight at full parent size; never faux-condense with transform) |
| strip-label / band-context (caps) | Anton/Inter | Pretendard 700/600, 0 tracking, no transform |
| body / body-compact / case-count | Inter | Pretendard 400/500; case counts stay Latin tabular numerals |

## Role overrides

- mega: leading +0.08 (tight mega leading + dense blocks = touching rows
  without the bump); keep-all + balance; authored breaks only.
- strip-label/band-context: 0 tracking, no transform, +1px.
- body: floor 1.6, keep-all.

## Breaking, spacing, density

- Mega lines: max 2 lines, balanced ±15%; single-어절 orphans forbidden.
- Full-bleed bands: Korean mega blocks centered/left per parent; band height
  absorbs +0.08 leading.
- Case counts (`014 / 120`) stay Latin mono-spaced figures.

## Identity preserved

A towering black slab of type. Pretendard 900 Hangul at Anton scale is the
same monument — mass, not narrowness, makes the monolith.
