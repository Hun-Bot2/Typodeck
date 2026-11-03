# Drafting Table — Korean Typography Override

Parent: `../design.md` (owns blueprint palette, title-block frames, drawing
tags, amber accents — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/title-blocks inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: condensed technical caps + Plex body/mono)

| Parent role | Parent face | Korean face |
|---|---|---|
| title-block / display / headline / subhead (Barlow Condensed 600 caps) | Barlow Condensed | Pretendard **800** (condensed n/a in Hangul — presence via +2 weight steps; no horizontal squeezing, which distorts syllable blocks) |
| body / hero-tagline / quote-body (IBM Plex Sans) | IBM Plex Sans | Pretendard 400/500 |
| drawing-tag / labels / data (IBM Plex Mono) | IBM Plex Mono | Plex Mono + KR fallback |

## Role overrides

- title-block (146px): 1.02 → **1.12**; transform → none; tracking → 0;
  keep-all + balance.
- display/headline: +0.08 leading; transform → none; keep-all.
- drawing-tag: Korean at 500–600, 0 tracking, no transform; Latin drawing
  codes (`A-101`, `SEC-B`) keep parent caps+tracking, nowrap.
- body: floor 1.6, keep-all.

## Breaking, spacing, density

- Title-block frames may widen for Korean; line-work follows the frame.
- Dimension strings and codes never split (nowrap).
- Amber accent words apply to Korean runs identically.

## Identity preserved

A blueprint sheet: white line-work on deep blue, stamped title blocks, coded
drawing tags. Korean headers read as stamped approvals at Black-adjacent
weight — same drafting authority.
