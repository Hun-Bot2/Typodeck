# Whiplash — Korean Typography Override

Parent: `../design.md` (owns nouveau palette, fleuron/bloom ornaments,
asymmetric editorial grid — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/fleuron ornaments inherit verbatim. Locale wins on type
roles + Korean-run tracking/transforms/leading only. (Parent already stacks
Noto Serif KR / Noto Sans KR in several roles — this locale makes them
primary for `ko`.)

## Font map (identity: art-nouveau editorial serif → Noto Serif KR)

| Parent role | Parent face | Korean face |
|---|---|---|
| nouveau-display / nouveau-subtitle / nouveau-body (EB Garamond) | EB Garamond | Noto Serif KR **700/600/500** (primary; Garamond kept for Latin) |
| nouveau-context (Marcellus) | Marcellus | Noto Serif KR **600**, 0 tracking, no transform |
| nouveau-fleuron / nouveau-bloom | ornaments | Unchanged (script-agnostic devices) |

Chains: `'Noto Serif KR', 'EB Garamond', 'Marcellus', Georgia, serif`.

## Role overrides

- nouveau-display: leading +0.08; keep-all + balance; tracking → 0.
- nouveau-subtitle/context: 0 tracking, no transform; floor 1.6; keep-all.
- nouveau-body: 500, floor 1.7, keep-all.
- Fleurons recenter under Korean blocks; bloom frames widen symmetrically.

## Breaking, spacing, density

- Asymmetric grid unchanged; Korean leading growth absorbed by margin air.
- Drop ornament + first-syllable-block pairing allowed (never split syllable).
- Quotes `“…”`; em-dash runs unbroken.

## Identity preserved

Nouveau elegance: whiplash curves, fleurons, serif Korean headlines with
Garamond-spirited grace. Ornament does the era work; serif weight does the
voice work.
