# Cut & Paste — Korean Typography Override

Parent: `../design.md` (owns paper/red/teal/yellow palette, offset shadows,
tape, scrap geometry — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/scrap/tape system inherit verbatim. Locale wins on type roles
+ Korean-run tracking/leading only.

## Font map (identity: protest-poster shout + handwritten margin notes)

| Parent role | Parent face | Korean face |
|---|---|---|
| shout / shout-first-line (Archivo Black) | Archivo Black | Pretendard **900** (Black holds the shout at 92px) |
| scrap-text / body (Libre Franklin) | Libre Franklin | Pretendard 400/500 |
| margin-note (Caveat cursive) | Caveat | SUIT **700** — no verified OFL Korean handwriting face; rotation/tape carry the handmade signal, weight carries emphasis (flagged font risk) |

Chain: `'Pretendard Variable', Pretendard, 'Archivo Black', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`.
Note chain: `'SUIT Variable', SUIT, 'Caveat', 'Noto Sans KR', sans-serif`.

## Role overrides

- shout: 1.04 → **1.12**; keep-all + balance; first-line red treatment unchanged.
- scrap-text: 1.45-class → **1.65**; keep-all.
- margin notes: keep parent rotation/tape; 0 tracking; never faux-italic.

## Breaking, spacing, density

- Shout posters: authored `<br>` at phrase boundaries; no orphan particles.
- Scraps may grow for Korean leading; tape/offset shadows follow the box.
- Ransom-cut Latin letters (if any) stay Latin-only devices.

## Identity preserved

Scissors-and-glue protest energy: Black-weight Korean shouts, taped scraps,
red/teal offsets. Handwriting becomes bold marker-weight SUIT — same margin
voice, different pen.
