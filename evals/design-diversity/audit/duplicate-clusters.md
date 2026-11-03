# Duplicate Clusters (Agent A, read-only audit)

Source: `evals/hierarchy/study/cases.json` (study-v1) + 17 viewed PNGs in
`evals/hierarchy/results/screenshots/`. Identity = layout-geometry family x theme
(bg, faces, roles, accents); language and text content ignored. A seeded defect that
mutates type scale, color, or one box does NOT create a new identity.

## C1 — hero-number swiss (S01, S07, S16, S19)

- S01 vs S07: same geometry (all boxes equal), same theme (Helvetica/red-on-white),
  texts differ only by language (EN/KO). Language twin; both PNGs show the same
  giant-number bottom-clip artifact. DUPLICATE.
- S01 vs S16: same geometry, same theme, different fixture content (F01 vs F15
  restyled swiss). Third strike of one identity. DUPLICATE.
- S16 vs S19: same boxes/theme; S19 demotes number 231/700 -> 87/900 (VISIBLE scale
  change, deck-level defect). Same identity, visibly mutated, unrendered. DUPLICATE.

## C2 — split-stats swiss (S02, S08, S18, S22, S23)

- S02 vs S23: every box/face/color equal; S23's mutation is narrative-level only
  (group membership) and its exclusionReason confirms identical render. EXACT. DUPLICATE.
- S02 vs S08: same geometry, but bg #F1F4F6->#FFFFFF, faces Inter->Arial Narrow/Arial,
  kicker #0B4F9C->#1D4ED8 (KO translation changed theme tokens). Same layout family,
  distinct rendered theme. SIBLING (both DISTINCT identities).
- S02 vs S18: same geometry/theme; S18 demotes title 30/700 -> 10/400, below body
  size (VISIBLE prominence defect), unrendered. DUPLICATE.
- S08 vs S22: same geometry/theme; S22 fades kicker 50pct toward bg (SUBTLE but
  visible tint change), unrendered. DUPLICATE.

## C3 — editorial chapter (S03, S09)

- Same geometry (caption y follows shorter KO body), same Georgia/rust-on-cream
  theme; EN/KO texts. Note: S03's PNG shows a serif mid-glyph slice artifact that
  S09's Korean title does not. Language twin. DUPLICATE.

## C4 — dark mono steps (S04, S20, S24)

- S04 vs S24: every box/face/color equal; S24's mutation is narrative-level only
  (primary moved to caption in intent) with identical-render exclusion. EXACT. DUPLICATE.
- S04 vs S20: same theme/faces; b0<->b1 rects SWAPPED (title squeezed into right
  5in x 0.25in box, step-1 in title box) — VISIBLE layout break, unrendered. DUPLICATE.

## C5 — document before/after (S05, S11)

- Identical geometry, identical Hiragino/parchment theme; EN/KO texts. DUPLICATE.

## C8 — editorial findings (S12, S21)

- Same geometry/theme; S21 shrinks finding-1 box h x0.35 (clip-support defect,
  flagged ESTIMATE-ONLY: HTML mirror likely overflows instead of clipping, so the
  renders may be pixel-identical). Near/exact twin, unrendered. DUPLICATE.

## C9 — expressive poster (S13, S14, S25)

- S13 vs S14: identical geometry (body 13pt vs 14pt), same Georgia-on-cream centered
  poster; EN/KO. Language twin. DUPLICATE.
- S13 vs S25: same geometry/theme; S25 shrinks body box h x0.35 (disputed
  clip-support, ESTIMATE-ONLY, likely invisible in mirror). Near/exact twin. DUPLICATE.

## Non-clusters (no duplicate of their identity)

- S06 (doc findings tan/Trebuchet), S10 (doc steps gray/Arial+Courier), S15
  (doc hero-rail olive), S17/S26/S27 (same words, three different designs:
  minimal-editorial serif-left / swiss-slots hybrid / doc-theme Trebuchet).

## Counts

- 27 cases = 25 active + 2 excluded (S23, S24 exact re-renders).
- 17 rendered PNGs collapse to 12 rendered design identities (5 twin strikes:
  F07, F09, F11, F14, F15-swiss).
- +2 unrendered restyle identities (S26, S27) = 14 genuinely distinct design
  identities across the 27.
- 8 cases have NO dedicated render: 6 defect variants (S18, S19, S20, S21, S22,
  S25) + 2 restyles (S26, S27).
- Invisible/near-invisible variants: S23, S24 (exact); S21, S25 (estimate-only
  clips, likely invisible); S22 (subtle tint). Visible mutations, same identity:
  S18, S19, S20.
