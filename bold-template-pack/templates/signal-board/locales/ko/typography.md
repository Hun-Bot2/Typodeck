# Signal Board (signal-board) — Korean Typography Override

Parent: `bold-template-pack/templates/signal-board/design.md` (owns slate
command bar, mist ground, KPI cards, case-log panel, semantic signal colors —
ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

- All dashboard geometry/palette/semantics inherit verbatim. Locale wins on
  type roles and Korean-run tracking/leading only. Semantic colors NEVER
  repurposed for script contrast.

## Font map (identity: ops dashboard Inter + Plex Mono → Pretendard + Plex Mono w/ KR fallback)

| Parent role | Parent face | Korean face |
|---|---|---|
| dashboard-hero / deck-subtitle / kpi-numeral(latin) | Inter 800/400 | Pretendard 800/400; KPI numerals stay Inter tabular |
| topbar-mono / pill-label / context-mono / data-row / data-key / case-row / status-pill / footer-mono | IBM Plex Mono | IBM Plex Mono (Latin preserved) + Korean fallback: `'IBM Plex Mono', 'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Apple SD Gothic Neo', monospace` |

No Korean monospace is committed (none of the four candidates ships Hangul
mono): Hangul in mono roles renders in Pretendard/Noto Sans KR at the role's
size/weight. Latin tokens (`PM-01`, `v2.3.1`, `OK`, `WARN`) keep true Plex Mono
metrics — token scannability is the identity.

## Role overrides

- dashboard-hero: lineHeight 1.04 → **1.12**; letterSpacing → 0; keep-all + balance.
- deck-subtitle: lineHeight 1.45 → **1.6**; keep-all.
- kpi-numeral: unchanged (tabular Latin numerals + CJK-safe suffix: `%`, `건`,
  `명` wrapped nowrap with the numeral).
- topbar-mono/pill-label/status-pill/footer-mono: letterSpacing → 0 for Korean
  runs; Latin runs keep parent tracking via `:lang(en)` spans. `white-space:
  nowrap` on pills; Korean pill text at 600 weight (parent 600 kept).
- context-mono/data-row/case-row: lineHeight 1.4 → **1.55**; keep-all;
  Korean status words (완료/주의/오류) at 500–600, never letterspaced.
- data-key: tracking → 0 for Korean; 400 → **500** at 18px (floor).

## Breaking, spacing, density

- Case-log rows: `PM-01 … PM-11` sample stays Latin-mono; adjacent Korean
  descriptions keep-all, wrap independently.
- Mixed tokens (`Shipgate는`, `main 브랜치`): Latin run in Plex Mono, particle
  in Korean fallback, shared baseline, zero inter-run space (research §3).
- KPI cards: suffix unit (`%`, `건`) never wraps from its numeral (nowrap span).
- Status pills: fixed-height pills may widen for Korean; never shrink type.

## What identity is preserved

A live ops readout: mono token grid, tabular KPIs, semantic pills. Korean
operators read the same board — only the human-language words change face,
while every machine token stays byte-identical in Plex Mono.
