# Gridline (gridline-swiss) — Korean Typography Override

Parent: `bold-template-pack/templates/gridline-swiss/design.md` (owns palette,
12-column grid, red rule, rail, spacing, components — ALL unchanged).
Research: `evals/hackathon/ko-typography.md` (Hangul rules; this file only
instantiates them for Gridline).

## Inheritance contract

- Geometry/palette/components: inherit from parent `design.md` verbatim. This
  locale MUST NOT move the rail, resize the red rule, or recolor anything.
- Type roles: this file wins. Every `fontFamily` below replaces the parent's
  for `lang="ko"` runs; Latin runs keep parent faces via the fallback chain.
- Tracking/transforms: parent `letter-spacing`/`text-transform` apply to
  Latin-only runs; Korean runs use the values below (0 tracking, no transform).
- Density deltas (§5) are additive to parent spacing tokens.

## Font map (identity: engineered Swiss grotesk → Pretendard)

| Parent role | Parent face | Korean face (primary) | Fallback chain |
|---|---|---|---|
| display-xl / display / headline / section-head | Archivo 800 | Pretendard 800 | `'Pretendard Variable', Pretendard, 'Archivo', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` |
| kicker / footer-index | Archivo 600, +0.18em caps | Pretendard 700, 0 tracking, no transform | same chain |
| index-numeral | Archivo 800 | Archivo 800 (numerals stay Latin) | parent chain |
| body / body-compact / caption / rail-meta | Inter 400/500 | Pretendard 400/500 | `'Pretendard Variable', Pretendard, 'Inter', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` |

CDN: Pretendard Variable dynamic-subset (jsDelivr, OFL-1.1) — see research note
§10. No font files committed.

## Role overrides (deltas only; unlisted props inherit)

- display-xl: lineHeight 1.02 → **1.10**; letterSpacing → 0;
  `word-break: keep-all; text-wrap: balance`.
- display: lineHeight 1.05 → **1.12**; letterSpacing → 0; keep-all + balance.
- headline: lineHeight 1.08 → **1.15**; keep-all.
- section-head: lineHeight 1.15 → **1.25**; keep-all.
- kicker: size 20px → **21px**; weight 600 → **700**; letterSpacing → 0;
  textTransform → none; red square bullet unchanged; Latin kicker words keep
  parent caps+tracking via `:lang(en)` span rule.
- body: lineHeight 1.45 → **1.65**; `word-break: keep-all`.
- body-compact: lineHeight 1.5 → **1.65**; keep-all.
- caption / rail-meta: letterSpacing → 0; textTransform → none; weight 500
  kept; lineHeight ≥1.5.
- index-numeral / footer-index numerals: unchanged (Latin glyphs).

## Breaking, spacing, density

- Titles: keep-all + balance + authored `<br>` at phrase boundaries (break AFTER
  particles, never before). Flush-left ragged-right preserved — centering still
  forbidden.
- Rail meta at 19px: floor weight 500 already met; verify glyph clog at render.
- footer-index `01 / 24` pattern unchanged (Latin numerals).
- No justification: keep parent left alignment; `ko-typography.md` §9.

## What identity is preserved

Archivo's grotesk authority becomes Pretendard Black-weight Hangul blocks with
the same flush-left discipline, red rule, and gray index rail. A Korean reader
sees the same engineered poster; only the voice speaks Korean.
