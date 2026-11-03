# Bubble OS — Korean Typography Override

Parent: `../design.md` (owns ice-blue/indigo/bubblegum palette, bubble cards,
pill shines, glossy depth — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/bubble-card system inherit verbatim. Locale wins on type
roles + Korean-run tracking/leading only.

## Font map (identity: chubby rounded display + airy rounded sans → SUIT)

| Parent role | Parent face | Korean face |
|---|---|---|
| hero / display / headline / subhead (Baloo 2 700) | Baloo 2 | SUIT **800** (closest OFL rounded-humanist Korean match to Baloo's chub) |
| body / labels / chips / captions (Quicksand) | Quicksand | SUIT 400/500/700 per parent weight |

Chain: `'SUIT Variable', SUIT, 'Baloo 2', 'Quicksand', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`.
CDN: jsDelivr `sun-typeface/SUIT@2` variable (OFL-1.1).

## Role overrides

- Display sizes inherit; hero 1.1 → **1.18**, headline 1.12 → **1.2**;
  tracking 0 kept; keep-all + balance on display.
- Labels/chips: parent tracking → 0 for Korean; weights kept (700).
- Body floor 1.6, keep-all; sub-24px labels floor 500.

## Breaking, spacing, density

- Bubble cards/pills may widen for Korean; never shrink type or radii.
- Pills: keep-all, nowrap where single-phrase; pill-drop shadow unchanged.
- Glossy highlight-insets apply to Korean display unchanged.

## Identity preserved

Glossy toy-OS cheer: plump SUIT ExtraBold Korean headlines in the same
bubblegum/indigo bubbles. Roundness translates; only the alphabet changes.
