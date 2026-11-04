# Maison — Korean Typography Override

Parent: `../design.md` (owns maison palette, editorial grid, quote devices,
counters — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/quote devices inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: fashion-editorial high-contrast serif + Inter)

| Parent role | Parent face | Korean face |
|---|---|---|
| maison-hero / display / headline / accent-word (Cormorant Garamond) | Cormorant | Noto Serif KR **600** (floor — Cormorant's hairlines would vanish in Hangul; 600 keeps editorial light while surviving print/projector) |
| body / body-small / labels / quote-body / counter (Inter) | Inter | Pretendard 400/500/700 per parent weight |

Serif chain: `'Noto Serif KR', 'Cormorant Garamond', Georgia, serif`.

## Role overrides

- maison-hero/display: leading +0.08; keep-all + balance; tracking → 0.
- accent-word (italic accent): Korean accent via Noto Serif KR 700 upright
  (no faux italic) or Pretendard 700 — emphasis by weight, not slant.
- labels/counter: 0 tracking, no transform, +1px.
- body: floor 1.6, keep-all.

## Breaking, spacing, density

- Editorial whitespace unchanged; pull-quotes use `“…”` with keep-all.
- Accent words never orphaned mid-phrase — keep with following particle.
- Counters stay Latin numerals; Korean labels nowrap-adjacent.

## Identity preserved

Fashion-house editorial: light serif Korean headlines with air, sharp rules,
italic-energy accents translated to weight contrast. Elegance without
hairlines that Hangul cannot hold.
