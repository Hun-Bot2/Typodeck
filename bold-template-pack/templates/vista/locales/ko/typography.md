# Vista — Korean Typography Override

Parent: `../design.md` (owns vista palette, badge numerals, ticket-stub
devices, label bands — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/stub devices inherit verbatim. Locale wins on type roles +
Korean-run tracking/transforms/leading only.

## Font map (identity: scenic display serif + Outfit grotesk → Noto Serif KR + SUIT)

| Parent role | Parent face | Korean face |
|---|---|---|
| hero / headline / subhead / badge-numeral (DM Serif Display) | DM Serif Display | Noto Serif KR **600** (badge numerals stay Latin) |
| body / body-sm / label / ticket-stub / caption / page-mark (Outfit) | Outfit | SUIT 400/500/700 per parent weight |

Why SUIT for Outfit: Outfit's geometric warmth maps to SUIT better than to
Pretendard's neo-grotesk cool.

## Role overrides

- hero/headline: leading +0.08; keep-all + balance; tracking → 0.
- label/ticket-stub: 0 tracking, no transform, 700, +1px.
- body: floor 1.6, keep-all; caption 500 floor at small sizes.
- Ticket perforations/stub frames widen for Korean; never shrink type.

## Breaking, spacing, density

- Badges: Latin numerals centered; Korean ribbon words keep-all, no orphans.
- Stub rows: code (`VST-24`) Latin nowrap + Korean stub text keep-all.
- No justification; vista panoramas/gradients unchanged.

## Identity preserved

A scenic overlook ticket: serif Korean vistas, punched stubs, badge numerals.
The journey-device system is fully script-agnostic.
