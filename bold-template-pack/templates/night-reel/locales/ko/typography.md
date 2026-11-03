# Night Reel — Korean Typography Override

Parent: `../design.md` (owns cinema-dark palette, credit-roll devices,
letterbox bars, scene counts — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/letterbox/credit devices inherit verbatim. Locale wins on
type roles + Korean-run tracking/transforms/leading only.

## Font map (identity: condensed cinema credits + light dialogue sans)

| Parent role | Parent face | Korean face |
|---|---|---|
| credit-title / section-title / kicker / bar-brand / context-line / scene-count (Bebas Neue caps) | Bebas Neue | Pretendard **800** (condensed caps → Black weight; letterspaced air → line air) |
| dialogue / body-light (Inter) | Inter | Pretendard 400/500 |

Credit numerals/clapper tokens (`SC 12`, `TK-3`) stay Bebas/Latin.

## Role overrides

- credit-title: leading +0.08; tracking → 0; transform → none; keep-all + balance.
- dialogue: floor 1.65, keep-all; dialogue dashes (`—`) per research §5.
- kicker/bar-brand/scene-count: 0 tracking, no transform, 700–800, +1px.
- body-light 400: allowed only ≥24px; below that 500 (research §7).

## Breaking, spacing, density

- Letterbox bars unchanged; credit rolls keep-all (no mid-어절 crawl splits).
- Scene-count devices: `SC-12` Latin + Korean scene name nowrap-adjacent.
- Dialogue blocks: centered/left per parent; no justification.

## Identity preserved

End-credits cinema: towering Black Korean titles in the letterbox, glowing
dialogue, coded scene marks. The silver screen speaks Korean at the same
scale and glow.
