# Front Page — Korean Typography Override

Parent: `../design.md` (owns newsprint palette, nameplate, wood-headline
scale, keylines, column rules — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/nameplate/column system inherit verbatim. Locale wins on
type roles + Korean-run tracking/transforms/leading only.

## Font map (identity: broadsheet nameplate + wood type + column serif)

| Parent role | Parent face | Korean face |
|---|---|---|
| nameplate (Playfair 900 caps +0.14em) | Playfair Display | Noto Serif KR **900**, 0 tracking, no transform (masthead presence via Black serif) |
| wood-headline / section-head (Playfair 900) | Playfair Display | Noto Serif KR 900/700 |
| standfirst / body-column (Lora) | Lora | Noto Serif KR 500 |
| kicker / labels / folio (Libre Franklin) | Libre Franklin | Pretendard 500–700, 0 tracking, no transform |

Serif chain: `'Noto Serif KR', 'Playfair Display', 'Lora', Georgia, serif`.
Sans chain: Pretendard-first standard.

## Role overrides

- nameplate (60px): 1.0 → **1.12**; tracking → 0; keep-all.
- wood-headline (92px): 1.08 → **1.16**; keep-all + balance; authored breaks
  at phrase boundaries (headline breaks are the editor's voice).
- standfirst/body-column: 500 weight, floor 1.7 (column serif), keep-all.
- kicker: caps+tracking → 0/no-transform; +1px size.

## Breaking, spacing, density

- Column measure unchanged; Korean 1.7 leading shortens column capacity —
  absorb with one fewer paragraph, never narrower columns or smaller type.
- Keylines/column rules unchanged; datelines keep Latin numerals + Korean
  place names (nowrap on the dateline).
- No justification on slides (research §9) even though print broadsheets
  justify — slide lines are too short.

## Identity preserved

A broadsheet front page: Black serif masthead Korean nameplate, wood-type
headlines, ruled columns. The news authority is the serif weight + rules,
which translate fully.
