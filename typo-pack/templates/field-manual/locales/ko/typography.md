# Field Manual (field-manual) — Korean Typography Override

Parent: `typo-pack/templates/field-manual/design.md` (owns dotted-grid
paper, 60/40 text/figure split, dashed leaders, callout boxes, caution chips —
ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

- Document geometry/paper/boxes/chips inherit verbatim. Locale wins on type
  roles and Korean-run tracking/transforms/leading only.

## Font map (identity: controlled-document caps + Plex body/mono → Pretendard + Plex w/ KR fallback)

| Parent role | Parent face | Korean face |
|---|---|---|
| manual-title / section-head / subhead (Archivo 700 caps) | Archivo | Pretendard **800** (caps n/a — authority carried by +1 weight step), no transform, 0 tracking |
| step-label (Plex Sans 500 caps) | IBM Plex Sans | Pretendard 700, no transform, 0 tracking |
| body / body-compact | IBM Plex Sans 400 | Pretendard 400 |
| doc-header / callout / figure-tag / warn-chip / section-tag | IBM Plex Mono | IBM Plex Mono + KR fallback (`'IBM Plex Mono', 'Pretendard Variable', Pretendard, 'Noto Sans KR', monospace`) |

Sans chain: `'Pretendard Variable', Pretendard, 'Archivo', 'IBM Plex Sans', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`.
CDN: jsDelivr Pretendard Variable (OFL-1.1); Plex faces from parent stack.

## Role overrides

- manual-title: weight 700 → **800**; lineHeight 1.05 → **1.14**; tracking →
  0; transform → none; keep-all + balance.
- section-head: 700 → **800**; 1.1 → **1.2**; transform → none; keep-all.
- subhead: 700 → **700** (kept); 1.2 → **1.3**; transform → none; keep-all.
- step-label: 500 → **700**; 1.3 → **1.4**; transform → none. Step codes
  (`STEP-04`) stay Latin caps mono.
- body: 1.5 → **1.65**; keep-all. body-compact: 1.55 → **1.65**; keep-all.
- doc-header/figure-tag/warn-chip: tracking → 0, transform → none for Korean;
  Latin doc codes keep parent caps+tracking. warn-chip Korean (주의/경고) at
  600 weight for hazard presence.
- callout: 1.5 → **1.6**; keep-all; reference codes inside stay Latin mono nowrap.

## Breaking, spacing, density

- 60/40 split unchanged; Korean body at 1.65 leading may add ≤1 line per
  paragraph — absorb with figure-side whitespace, never by shrinking type.
- Dashed leader lines anchor to Latin figure codes; Korean captions wrap
  keep-all beneath.
- Procedure sequences (`1→2→3`, `A-04`) never split (nowrap).
- Caution chips: fixed-height, widen for Korean; black-on-amber contrast kept.

## What identity is preserved

A controlled document page: issue headers, visible reference codes, bordered
callouts, amber warnings. Korean procedures read with the same stamped
authority — caps become weight, codes stay codes.
