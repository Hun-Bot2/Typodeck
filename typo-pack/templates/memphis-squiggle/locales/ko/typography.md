# Squiggle Club (memphis-squiggle) — Korean Typography Override

Parent: `../design.md` (owns memphis palette, squiggle/confetti devices,
outline numerals, chip system — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/squiggles/chips inherit verbatim. Locale wins on type roles +
Korean-run tracking/leading only.

## Font map (identity: postmodern party display + round sans)

| Parent role | Parent face | Korean face |
|---|---|---|
| party-title / section-head / subhead / outline-numeral / stat-number (Archivo Black) | Archivo Black | Pretendard **900** (outline-numeral treatment applies to Korean display identically — stroke offsets align to em box) |
| body / body-bold / caption (Nunito) | Nunito | SUIT 400/700/500 |
| chip-label / counter (Archivo) | Archivo | SUIT 700/Pretendard 600, 0 tracking |

## Role overrides

- party-title: leading +0.08; keep-all + balance; rotation/tilt devices kept.
- outline-numeral on Korean: paint-order stroke + transparent fill works on
  Hangul blocks — verify counter legibility at render (dense blocks + outline
  can clog; prefer solid 900 with outline reserved for Latin numerals).
- chips: keep-all, widen for Korean, 0 tracking.
- body: floor 1.6, keep-all.

## Breaking, spacing, density

- Confetti/squiggles never overlap Korean display descender zones — Hangul
  blocks fill the em, so keep device clearspace at 0.15em below baseline.
- Stat numerals stay Latin; Korean units nowrap.
- Tilted type blocks: rotation angles unchanged.

## Identity preserved

Memphis party chaos: Black-weight Korean titles colliding with squiggles and
confetti. Loudness is weight + color + tilt — all script-agnostic.
