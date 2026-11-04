# Atelier Noir — Korean Typography Override

Parent: `../design.md` (owns noir/porcelain palette, gallery rules, wine
accent, runway geometry — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/components inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: high-fashion thin serif + Montserrat)

| Parent role | Parent face | Korean face |
|---|---|---|
| runway-hero / display / headline / subhead / hero-tagline / quote-body (Italiana 400) | Italiana | Noto Serif KR **600** — parent Thin/Light Latin explicitly NOT mapped to Korean Thin (research §7 floor: 500 display); 600 holds couture presence without clog |
| body / gallery-label / captions (Montserrat) | Montserrat | Pretendard 400/500/700 |

Serif chain: `'Noto Serif KR', 'Italiana', Georgia, 'Apple SD Gothic Neo', serif`.
Sans chain: `'Pretendard Variable', Pretendard, 'Montserrat', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`.

## Role overrides

- runway-hero/display: 1.14/1.16 → **1.22**; tracking 0 kept; keep-all + balance.
- headline/subhead: leading +0.08; keep-all.
- gallery-label: parent letterspaced caps → Korean: 0 tracking, no transform,
  Pretendard 700, size +1px.
- quote-body: Noto Serif KR 600 upright (no italic); 1.42 → **1.6**.

## Breaking, spacing, density

- Generous gallery whitespace unchanged; Korean leading growth absorbed by air.
- Quotes use `“…”` (U+201C/201D) per research §5.
- Body floor 1.6, keep-all.

## Identity preserved

Couture-gallery restraint: tall serif Korean headlines with gallery whitespace,
hairline rules, wine accent. Weight 600 (not 400) is the correct translation
of Italiana's elegance into Hangul.
