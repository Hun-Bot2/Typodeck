# Fieldnote — Korean Typography Override

Parent: `../design.md` (owns kraft/moss/clay palette, dashed rules, stamp
devices, tally numerals — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/stamp devices inherit verbatim. Locale wins on type roles +
Korean-run tracking/leading only.

## Font map (identity: slab field journal + grotesque notes + handwritten margin)

| Parent role | Parent face | Korean face |
|---|---|---|
| field-title / section-title (Zilla Slab 600) | Zilla Slab | Noto Serif KR **700** (no Korean slab exists in candidates; sturdy serif carries the stamped-journal voice) |
| tally-numeral | Zilla Slab | Latin numerals unchanged |
| body-grotesque / body-small (Karla) | Karla | Pretendard 400/500 |
| margin-hand (Caveat) | Caveat | SUIT **700**, parent rotation kept (handwriting gap — see cut-paste locale) |

## Role overrides

- field-title (108px): 1.04 → **1.14**; tracking → 0; keep-all + balance.
- section-title: 1.08 → **1.18**; keep-all.
- body: floor 1.65, keep-all; body-small 500 floor.
- Stamps (`검수완료`, `승인`): Pretendard 700–800, 0 tracking, stamp-ink
  inset shadow unchanged; stamp boxes widen for Korean.

## Breaking, spacing, density

- Dashed rules/leaders unchanged; Korean captions wrap keep-all.
- Tally counts stay Latin numerals; Korean unit nowrap with numeral.
- Stamp devices: fixed height, horizontal growth only.

## Identity preserved

A naturalist's field journal: kraft paper, stamped approvals, dashed
specimen rules. Korean titles stamp in with serif authority; notes stay
practical and warm.
