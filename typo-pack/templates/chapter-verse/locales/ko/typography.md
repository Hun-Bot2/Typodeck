# Chapter & Verse — Korean Typography Override

Parent: `../design.md` (owns cream/ink/oxblood palette, book-chapter devices,
drop caps, folios — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/chapter devices inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: editorial book serif + Inter apparatus)

| Parent role | Parent face | Korean face |
|---|---|---|
| chapter-title / section-title / lede / body / drop-cap (Newsreader) | Newsreader | Noto Serif KR 700/700/500/500/700 |
| kicker / running-head / folio / page-mark (Inter) | Inter | Pretendard 400–700 per parent weight, 0 tracking, no transform |

Serif chain: `'Noto Serif KR', 'Newsreader', Georgia, 'Apple SD Gothic Neo', serif`.
Sans chain: Pretendard-first per gridline-swiss locale.

## Role overrides

- chapter-title: 1.06 → **1.16**; keep-all + balance.
- section-title: 1.1 → **1.2**; keep-all.
- lede: 400 → **500**; floor leading 1.6; keep-all.
- body: 400 → **500** (30px-class serif floor); 1.55-class → **1.7**; keep-all.
- drop-cap: Korean drop-cap uses the FIRST SYLLABLE BLOCK at 700 (never split
  a syllable); size/raise per parent, verified in render.
- kicker/running-head/folio: caps+tracking → 0/no-transform for Korean;
  sizes +1px.

## Breaking, spacing, density

- Book margins unchanged; Korean leading growth shortens measure slightly —
  absorb with chapter whitespace, never narrower columns.
- Folio numerals stay Latin; `Chapter 3` devices keep Latin numerals.
- No justification on slides (research §9).

## Identity preserved

A printed book chapter: serif Korean titles, syllable drop-caps, oxblood
rules, quiet folios. The book feel survives because serif-ness, not
Latin-ness, carries it.
