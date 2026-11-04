# Modulo (modulo-grid) — Korean Typography Override

Parent: `typo-pack/templates/modulo-grid/design.md` (owns 4×4 tile
grid, 16px gutters, navy/amber/silver blocks, tile-strip headers — ALL
unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

- Tile geometry/gutters/color-blocks inherit verbatim. Locale wins on type
  roles and Korean-run tracking/transforms/leading only. Tiles never resize
  for text — type adapts within the module.

## Font map (identity: modular-geometric Sora → SUIT)

| Parent role | Parent face | Korean face |
|---|---|---|
| module-hero / display / headline / card-title / stat-number(latin) | Sora 800/700 | SUIT **800**/800/800/700; stat numerals stay Sora tabular |
| body / body-small / caption | Inter 400/500 | SUIT 400/400/500 |
| label-band / label-kicker / counter (Sora 600 caps +0.12em) | Sora | SUIT 700, 0 tracking, no transform |

Why SUIT: Sora's geometric-humanist construction maps to SUIT better than to
Pretendard (which reads more neo-grotesk). SUIT ExtraBold holds the tile-block
presence at the same sizes.
Sans chain: `'SUIT Variable', SUIT, 'Sora', 'Inter', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`.
CDN: jsDelivr `sun-typeface/SUIT@2` variable (OFL-1.1).

## Role overrides (clamp() sizes inherit; only leading/tracking/weight change)

- module-hero: lineHeight 1.04 → **1.12**; letterSpacing → 0; keep-all + balance.
- display: 1.08 → **1.16**; tracking → 0; keep-all + balance.
- headline: 1.12 → **1.2**; keep-all.
- card-title: 1.25 → **1.35**; keep-all. Card titles ≤2 lines; tile padding
  absorbs the +0.1 leading.
- stat-number: unchanged (Latin tabular numerals); Korean unit suffix nowrap.
- body/body-small: leading 1.65/1.6 kept; keep-all. body-small at 14–17px:
  weight 400 → **500** (micro floor, research §7).
- label-band/label-kicker/counter: tracking → 0; transform → none; weight
  600 → **700**; Korean labels verified to fit tile strips at 14–15px (see
  dense specimen).
- caption: 13px Korean floor — weight 500 kept, lineHeight 1.5 → **1.6**;
  Korean captions avoid 13px where possible (prefer body-small).

## Breaking, spacing, density

- Tile-strip headers: Korean labels nowrap + ellipsis-safe (keep-all, no mid-
  어절 break); widen strip only within the 4×4 module, never across gutters.
- 16px gutters unchanged; Korean leading growth stays inside tiles.
- No justification; tile text aligns per parent (left/center per component).

## What identity is preserved

Architectural tile-blocks with geometric display type. SUIT ExtraBold Hangul
sits in the modules with the same engineered rhythm as Sora — the grid, not
the glyphs, carries the brand.
