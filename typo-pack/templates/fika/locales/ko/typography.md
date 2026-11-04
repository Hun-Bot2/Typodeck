# Fika (fika) — Korean Typography Override

Parent: `typo-pack/templates/fika/design.md` (owns warm off-white
ground, pastel panels, 16–24px radii, airy two-column rhythm — ALL unchanged).
Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

- Geometry/palette/radii inherit verbatim. Locale wins on type roles and
  Korean-run tracking/transforms/density only.

## Font map (identity: soft lowercase serif + rounded sans → Noto Serif KR + SUIT)

| Parent role | Parent face | Korean face |
|---|---|---|
| hero / headline / subhead (Fraunces 500, lowercase) | Fraunces | Noto Serif KR **600** (lowercase n/a — softness carried by 600 weight + loose leading, NOT by shrinking) |
| data-numeral | Fraunces | Fraunces (Latin numerals unchanged) |
| body / body-sm / caption | Nunito Sans 400 | SUIT 400/400/500 |
| label (caps +0.15em) / chip / page-mark | Nunito Sans 700 | SUIT 700, 0 tracking, no transform |

Why SUIT for body: SUIT's humanist-round construction is the closest OFL
Korean match to Nunito Sans warmth; Pretendard would read too engineered here.
Serif chain: `'Noto Serif KR', 'Fraunces', Georgia, 'Apple SD Gothic Neo', serif`.
Sans chain: `'SUIT Variable', SUIT, 'Nunito Sans', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`.
CDN: Google Fonts (Noto Serif KR) + jsDelivr `sun-typeface/SUIT@2` variable, OFL-1.1.

## Role overrides

- hero/headline: weight 500 → **600** (research §7 floor for Korean display);
  lineHeight 1.12 → **1.2**; textTransform → none; keep-all + balance.
- subhead: 500 → **600**; 1.2 → **1.3**; keep-all.
- body/body-sm: lineHeight 1.6 kept (already meets Korean floor); keep-all.
- label: tracking → 0; transform → none; size 22 → **23px**; SUIT 700.
- chip: tracking 0.04em → 0; pill geometry unchanged; Korean chip labels at
  SUIT 700 22px in fjord (`#182B49`) per parent — never slate on dusty-blue
  (4.17:1, fails AA).
- caption: weight 400 → **500** (20px floor); lineHeight 1.5 → **1.6**.
- page-mark: tracking → 0 for Korean; Latin page marks keep parent style.

## Breaking, spacing, density

- Fika's huge gutters stay; Korean body needs no column narrowing (keep-all
  handles short lines).
- Chips must not wrap mid-어절: keep-all; allow pill to grow horizontally.
- No lowercase illusion: do not fake "softness" with smaller size — presence
  comes from weight 600 + whitespace.

## What identity is preserved

Quiet kitchen-table warmth: soft serif Korean headlines (upright, generous),
round-humanist SUIT body, pastel panels and radii untouched. The lowercase
whisper becomes a calm, unhurried Korean voice at the same scale.
