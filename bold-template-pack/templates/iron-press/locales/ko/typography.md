# Iron Press — Korean Typography Override

Parent: `../design.md` (owns letterpress palette, rule system, page-mark
devices — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/rules inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: antique press serif + smallcaps apparatus)

| Parent role | Parent face | Korean face |
|---|---|---|
| hero / headline / subhead / dropcap / body-italic (IM Fell English) | IM Fell English | Noto Serif KR 700/700/600/700/500-upright (Fell irregularity has no Korean analogue; age carried by rules/ink, not glyphs) |
| body (EB Garamond) | EB Garamond | Noto Serif KR 500 |
| smallcaps / smallcaps-sm / caption / page-mark | IM Fell/EB Garamond | Noto Serif KR 600/600 + Pretendard 500 for page-marks; 0 tracking, no transform |

Serif chain: `'Noto Serif KR', 'IM Fell English', 'EB Garamond', Georgia, serif`.

## Role overrides

- hero/headline: leading +0.08; keep-all + balance; tracking → 0.
- dropcap: first SYLLABLE BLOCK, 700, parent raise.
- body-italic/body: upright 500, floor 1.7, keep-all.
- smallcaps(-sm): 0 tracking, no transform, 600; size +1px.

## Breaking, spacing, density

- Press rules/ink-bleed textures unchanged; Korean blocks sit on the same grid.
- Page-marks: Korean words in Pretendard 500 nowrap; numerals Latin.
- Quotes `“…”`; em-dash runs unbroken (research §5).

## Identity preserved

An iron-age press sheet: heavy serif Korean headlines, syllable drop-caps,
ruled apparatus. Antiquity reads through ink, rules, and weight — not
through Fell's Latin-only distress.
