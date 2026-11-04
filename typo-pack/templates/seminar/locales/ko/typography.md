# Seminar — Korean Typography Override

Parent: `../design.md` (owns seminar palette, argument grid, sidenote rail,
marker/footnote apparatus — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/rails/markers inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: academic argument serif + Inter sidenotes)

| Parent role | Parent face | Korean face |
|---|---|---|
| argument-title / section-title / lede / body (Source Serif 4) | Source Serif 4 | Noto Serif KR 700/700/500/500 |
| sidenote / sidenote-strong / footnote / marker / date-note / page-number (Inter) | Inter | Pretendard 400–700 per parent weight |

Serif chain: `'Noto Serif KR', 'Source Serif 4', Georgia, serif`.

## Role overrides

- argument-title: leading +0.08; keep-all + balance; tracking → 0.
- lede/body: 500, floor 1.7 (serif argument measure), keep-all.
- sidenote: 400→**500** at small sizes; floor 1.6; keep-all; rail width unchanged.
- marker: Latin markers (`§3`, `†`, `[2]`) unchanged, nowrap with Korean headword.
- date-note/page-number: Latin numerals kept; Korean words 500, 0 tracking.

## Breaking, spacing, density

- Sidenote rail: Korean sidenotes wrap keep-all within the fixed rail; rail
  never widens — shorten notes instead.
- Footnote rules unchanged; footnote markers unbroken from refs (research §2).
- No justification on slides.

## Identity preserved

A graduate seminar handout: serif theses, railed sidenotes, precise markers.
Korean arguments hold the same scholarly posture — serif weight + apparatus,
not Latin glyphs, signal rigor.
