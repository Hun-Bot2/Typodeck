# Peer Review (peer-review) — Korean Typography Override

Parent: `typo-pack/templates/peer-review/design.md` (owns palette,
journal masthead, abstract inset, figure rail, double rules — ALL unchanged).
Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

- Geometry/palette/components inherit verbatim. Locale wins on type roles,
  tracking/transforms for Korean runs, and density deltas only.

## Font map (identity: scholarly serif + Inter apparatus → Noto Serif KR + Pretendard)

| Parent role | Parent face | Korean face |
|---|---|---|
| article-title / section-head / body-serif | STIX Two Text | Noto Serif KR 700 / 700 / 500 |
| abstract-text (STIX italic) | italic serif | Noto Serif KR 500, **upright** (no faux italic — Korean emphasis via abstract-tint box + weight) |
| kicker / runhead / figure-label / table-head | Inter caps, +0.12–0.24em | Pretendard 700, 0 tracking, no transform |
| figure-title / caption / table-cell / footnote / keywords | Inter | Pretendard 400–600 per parent weight |

Serif chain: `'Noto Serif KR', 'STIX Two Text', Georgia, 'Apple SD Gothic Neo', serif`.
Sans chain: `'Pretendard Variable', Pretendard, 'Inter', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`.
CDN: Google Fonts (Noto Serif KR) + jsDelivr (Pretendard Variable), all OFL-1.1.

## Role overrides

- article-title: lineHeight 1.06 → **1.16**; letterSpacing → 0; keep-all + balance.
- section-head: 1.12 → **1.22**; keep-all.
- body-serif: weight 400 → **500** (Hangul clog floor at 30px serif); lineHeight
  1.55 → **1.7**; keep-all. Rationale: research note §7.
- abstract-text: weight 400 → **500**; style italic → normal; lineHeight
  1.42 → **1.65**; keep-all. Emphasis now carried by tint box + 500 weight.
- kicker/runhead/figure-label/table-head: tracking → 0; transform → none;
  sizes +1px (22→23, 20→21, 18→19) to hold presence without caps.
- caption/footnote: lineHeight → ≥1.6; keep-all.
- Reference apparatus (`[1]`, `Fig. 3`, `p < 0.05`, bracket footnotes): Latin
  tokens keep Inter/Pretendard Latin, `white-space: nowrap`, no split.

## Breaking, spacing, density

- Abstract inset: allow +8% vertical growth for 1.65 leading; never shrink type.
- Keywords row: Korean keywords separated by ` · ` (U+00B7), keep-all; no wrap
  inside a keyword.
- Table heads at 19px Korean: weight 700, 0 tracking.
- No justification on slides; body-ink alignment inherits parent.

## What identity is preserved

The journal signal — serif titles, tinted abstract, bracket apparatus, hairline
rules — survives intact. Korean serif titles at 700 read as scholarly as STIX;
the apparatus stays Latin-typed so citations scan identically.
