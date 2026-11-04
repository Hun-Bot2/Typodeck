# Gilded Line — Korean Typography Override

Parent: `../design.md` (owns lacquer/champagne/gold palette, gold keylines,
deco dividers — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/keylines/dividers inherit verbatim. Locale wins on type
roles + Korean-run tracking/transforms/leading only.

## Font map (identity: engraved roman caps + deco sans → Korean serif + Pretendard)

| Parent role | Parent face | Korean face |
|---|---|---|
| deco-display / deco-kicker / colophon (Cinzel caps) | Cinzel | Noto Serif KR **600** (engraved-caps presence → semibold serif + gold; tracking n/a) |
| deco-subtitle / deco-context (Jost) | Jost | Pretendard 400/500 |
| divider-glyph | — | Unchanged (ornament glyph, script-agnostic) |

Serif chain: `'Noto Serif KR', 'Cinzel', Georgia, 'Apple SD Gothic Neo', serif`.

## Role overrides

- deco-display: leading +0.08; tracking → 0; transform → none; keep-all + balance.
- deco-kicker: 0 tracking, no transform, 700 weight, +1px.
- deco-subtitle/context: floor 1.6, keep-all.
- Gold-on-lacquer contrast kept; Korean 600 at display sizes holds engraved
  legibility on dark.

## Breaking, spacing, density

- Keyline frames widen for Korean; deco dividers recenter under the block.
- Colophon lines: keep-all, centered per parent; no orphan particles.
- Numerals/dates stay Latin with gold treatment.

## Identity preserved

Deco luxury: gold keylines, champagne serif on lacquer. Korean titles engrave
at semibold serif — the gold does the luxury work in any script.
