# Dessau — Korean Typography Override

Parent: `../design.md` (owns Bauhaus primaries, bar-top/bar-bottom bands,
48px column gap — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/bands inherit verbatim. Locale wins on type roles + Korean-run
transforms/leading only. (Parent already lists Noto Sans KR in its stacks —
this locale makes the Korean face primary instead of fallback.)

## Font map (identity: Bauhaus geometric lowercase → SUIT)

| Parent role | Parent face | Korean face |
|---|---|---|
| bauhaus-display / subtitle / context / body / label (Jost) | Jost | SUIT **700/400/400/400/700** (geometric-humanist match; lowercase n/a — geometry carries identity) |
| bauhaus-numeral | Jost | Jost/Latin numerals unchanged |

Chain: `'SUIT Variable', SUIT, 'Jost', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`.

## Role overrides

- bauhaus-display (96px): 1.08 → **1.16**; textTransform → none; keep-all + balance.
- bauhaus-subtitle/context: 1.45-class → **1.6**; transform → none; keep-all.
- bauhaus-label: caps/tracking → 0/no-transform for Korean; 700 kept.
- bauhaus-body: floor 1.6, keep-all.

## Breaking, spacing, density

- Bar bands unchanged; display block may grow ≤1 line — absorb in column gap.
- Primary-color type treatments (red/blue/yellow words) apply to Korean runs
  identically (color is script-agnostic).
- No justification; left/center per parent component.

## Identity preserved

Weimar geometry: primary bars, circular type energy, strict grid. SUIT's
geometric construction is the honest Korean Bauhaus voice — same shapes,
same discipline.
