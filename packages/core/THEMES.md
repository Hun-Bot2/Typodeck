# Candidate Themes (B: per-candidate visual identity)

Each composition candidate carries a `theme` (fonts + palette) that overrides
the rendering system for that slide only. Transitions stay system-native.
All pairs verified WCAG AA by `tests/theme.test.ts`.

Mechanism: `composition.ts` (`CandidateTheme`, `CANDIDATE_THEME_IDS`) →
`systems.ts` (`themedSystem`) → `layout.ts` (effective system + `fontFace`
stamp) → `export.ts` (prefers `block.fontFace`). Unthemed candidates emit
byte-identical decks to before (no `fontFace` stamped).

Record IDs refer to `research/merged_registry.jsonl` (inspected unless noted).

## T1 signal-grotesk — Swiss concert poster

- Faces: Helvetica Neue / Helvetica / Arial (+ Noto Sans KR)
- bg #FFFFFF · ink #111111 · accent #B00020 · muted #5A5A5A
- Records: A-002 Extra-Konzert (Müller-Brockmann), A-001 Musica Viva
- Candidates: opening-monumental-numeral, insight-punchline,
  comparison-columns, metric-anchored, conclusion-charge, series-opening,
  manual-metric

## T2 paper-serif — publishing book voice

- Faces: Georgia (+ Noto Serif KR)
- bg #FAF7F2 · ink #1A1A1A · accent #7B2D26 (oxblood) · muted #6B6259
- Records: B-105 Penguin tri-band template (Tschichold)
- Candidates: opening-statement, thesis-statement, comparison-stacked,
  evidence-focused, quote-attributed, conclusion-restatement

## T3 mono-manual — documentation voice

- Faces: Arial/Helvetica headings, Courier New body
- bg #F7F7F5 · ink #1A1A1A · accent #0B4F9C · muted #5F6B6B
- Records: D-301 Butterick's Practical Typography, D-307 Diátaxis
- Candidates: process-sequenced, architecture-map, evidence-collated,
  manual-opening, manual-section, margin-evidence

## T4 hangul-gothic — contemporary Korean gothic

- Faces: Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR
- bg #FFFFFF · ink #111111 · accent #003FD6 · muted #5A5A5A
- Records: E-405 Sandoll GothicNeo, E-403 Ahn Sang-soo
- Candidates: thesis-sparse (seed; expandable)

## T5 brutal-dark — inverted display voice

- Faces: Archivo Black / Arial Black headings, Arial body
- bg #111111 · ink #F5F2EA · accent #FFD400 · muted #B0B0B0
- Records: C-217 Ray Gun cover (Carson), C-201 Weingart Typographic Process
- Candidates: opening-breath, problem-tension, metric-hero, tradeoff-decided

## T6 grid-blue — technical grid voice

- Faces: Inter / Helvetica Neue / Arial (+ Noto Sans KR)
- bg #F1F4F6 · ink #16232E · accent #0B4F9C · muted #54616E
- Records: A-001 Musica Viva (grid discipline), D-307 Diátaxis
- Candidates: opening-context, problem-narrative, thesis-grouped,
  process-compact, evidence-explainer-columns

## T7 mincho-shu — Japanese editorial voice

- Faces: Hiragino Mincho / Yu Mincho / Noto Serif JP
- bg #FFFFFF · ink #1A1A1A · accent #8C1D18 (shu-iro) · muted #666666
- Records: E-418 Ikko Tanaka: Faces
- Candidates: quote-voice (seed; expandable)

## T8 evidence-slate — data-ink voice

- Faces: Palatino Linotype / Georgia headings, Georgia body
- bg #FFFFFF · ink #222222 · accent #2F5D62 · muted #5A6B6B
- Records: D-308 Envisioning Information, D-317 Visual Display (Tufte)
- Candidates: insight-unpacked, comparison-rows, architecture-layered,
  evidence-anchored, manual-reference, tradeoff-balanced
