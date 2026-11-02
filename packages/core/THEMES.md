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
- Records: A-002 Extra-Konzert (Müller-Brockmann; secondary-description),
  A-001 Musica Viva
- Candidates: opening-monumental-numeral, insight-punchline

## T2 paper-serif — publishing book voice

- Faces: Georgia (+ Noto Serif KR)
- bg #FAF7F2 · ink #1A1A1A · accent #7B2D26 (oxblood) · muted #6B6259
- Records: B-105 Penguin tri-band template (Tschichold)
- Candidates: opening-statement

## T3 mono-manual — documentation voice

- Faces: Arial/Helvetica headings, Courier New body
- bg #F7F7F5 · ink #1A1A1A · accent #0B4F9C · muted #5F6B6B
- Records: D-301 Butterick's Practical Typography, D-307 Diátaxis
- Candidates: manual-section

## T4 hangul-gothic — contemporary Korean gothic

- Faces: Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR
- bg #FFFFFF · ink #111111 · accent #003FD6 · muted #5A5A5A
- Records: E-405 Sandoll GothicNeo, E-403 Ahn Sang-soo
- Candidates: thesis-sparse

## T5 brutal-dark — inverted display voice

- Faces: Archivo Black / Arial Black headings, Arial body
- bg #111111 · ink #F5F2EA · accent #FFD400 · muted #B0B0B0
- Records: C-217 Ray Gun cover (Carson), C-201 Weingart Typographic Process
- Candidates: metric-hero

## T6 grid-blue — technical grid voice

- Faces: Inter / Helvetica Neue / Arial (+ Noto Sans KR)
- bg #F1F4F6 · ink #16232E · accent #0B4F9C · muted #54616E
- Records: A-001 Musica Viva (grid discipline), D-307 Diátaxis
- Candidates: opening-context

## T7 mincho-shu — Japanese editorial voice

- Faces: Hiragino Mincho / Yu Mincho / Noto Serif JP
- bg #FFFFFF · ink #1A1A1A · accent #8C1D18 (shu-iro) · muted #666666
- Records: E-418 Ikko Tanaka: Faces
- Candidates: quote-voice

## T8 evidence-slate — data-ink voice

- Faces: Palatino Linotype / Georgia headings, Georgia body
- bg #FFFFFF · ink #222222 · accent #2F5D62 · muted #5A6B6B
- Records: D-308 Envisioning Information, D-317 Visual Display (Tufte)
- Candidates: comparison-rows, evidence-anchored

## T9 oxblood-serif — high-fashion Didone voice

- Faces: Didot / Bodoni MT / Georgia (+ Noto Serif KR)
- bg #FFFFFF · ink #1A1A1A · accent #7F1D1D · muted #5A5A5A
- Records: B-110 Didot and fashion (ATypI)
- Candidates: thesis-statement

## T10 sage-editorial — quiet journal voice

- Faces: Palatino Linotype / Book Antiqua / Georgia
- bg #F5F2EA · ink #2B2B28 · accent #4D6A4F (sage) · muted #62625A
- Records: B-109 Typographica (Spencer)
- Candidates: comparison-stacked

## T11 gilt-garamond — prestige book voice

- Faces: Garamond / Georgia (+ Noto Serif KR)
- bg #FAF7F0 · ink #1F1B16 · accent #7A5C00 (dark gilt) · muted #6E665A
- Records: B-112 Fortune magazine (Cleland)
- Candidates: conclusion-restatement

## T12 lime-grotesk — new-wave grotesque voice

- Faces: Helvetica Neue / Helvetica / Arial (+ Noto Sans KR)
- bg #FFFFFF · ink #111111 · accent #4D7C0F (lime) · muted #5A5A5A
- Records: A-007 Auch Du bist Liberal (Gerstner)
- Candidates: metric-anchored

## T13 signal-orange — civic poster voice

- Faces: Helvetica Neue / Helvetica / Arial (+ Noto Sans KR)
- bg #FFFFFF · ink #111111 · accent #C2410C (signal orange) · muted #5A5A5A
- Records: A-005 Stadt Theater Basel 63/64 (Hofmann)
- Candidates: conclusion-charge

## T14 violet-grid — media-lab grid voice

- Faces: Inter / Helvetica Neue / Arial (+ Noto Sans KR)
- bg #F4F4F5 · ink #18181B · accent #6D28D9 (violet) · muted #52525B
- Records: B-104 Muriel Cooper's Lasting Imprint (MIT Media Lab)
- Candidates: series-opening

## T15 condensed-signal — news-stand condensed voice

- Faces: Arial Narrow headings, Arial body (+ Noto Sans KR)
- bg #FFFFFF · ink #111111 · accent #1D4ED8 · muted #5A5A5A
- Records: B-102 Bloomberg Businessweek redesign (Turley)
- Candidates: comparison-columns

## T16 friendly-round — legible humanist voice

- Faces: Arial Rounded MT Bold / Trebuchet MS / Verdana
- bg #FFFFFF · ink #1F2937 · accent #0F766E (teal) · muted #5B6470
- Records: D-306 Atkinson Hyperlegible
- Candidates: thesis-grouped

## T17 navy-ink — geometric night voice

- Faces: Futura / Century Gothic / Avenir Next headings
- bg #0F1B33 · ink #F5F2EA · accent #F59E0B (amber) · muted #B8BCD0
- Records: A-008 A Harmony of Contrasts (Hofmann Giselle analysis)
- Candidates: problem-tension

## T18 forest-night — dark editorial voice

- Faces: Georgia (+ Noto Serif KR)
- bg #12261D · ink #EAF4EC · accent #A3E635 (lime) · muted #A8BFAE
- Records: C-233 McCoys on Scratching the Surface (Cranbrook)
- Candidates: architecture-map

## T19 copper-charcoal — slab display night voice

- Faces: Rockwell / Courier Bold / Georgia headings, Georgia body
- bg #1C1917 · ink #E7E5E4 · accent #E8963C (copper) · muted #A8A29E
- Records: C-212 Fuse 2 (Brody)
- Candidates: tradeoff-decided

## T20 plum-noir — psychedelic night voice

- Faces: Didot / Bodoni MT / Georgia (+ Noto Serif KR)
- bg #231627 · ink #EDE9FE · accent #F472B6 (pink) · muted #B8AEC4
- Records: E-451 Tadanori Yokoo: Koshimaki-Osen (1966)
- Candidates: opening-breath

## T21 blueprint — drafting-table voice

- Faces: Courier New / Noto Sans Mono throughout
- bg #1E3A8A · ink #FFFFFF · accent #67E8F9 (cyan) · muted #C3D2F5
- Records: D-304 Carbon Design System typography
- Candidates: process-sequenced

## T22 manual-blue — spec-sheet voice

- Faces: Arial/Helvetica headings, Courier New body
- bg #F8FAFC · ink #1A1A1A · accent #1E40AF · muted #5B6470
- Records: D-305 JetBrains Mono
- Candidates: manual-metric

## T23 terminal-amber — console voice

- Faces: Menlo / Consolas / Courier New throughout
- bg #0A0A0A · ink #4ADE80 (phosphor) · accent #FBBF24 (amber) · muted #9CA3AF
- Records: D-324 Input: Fonts for Code (Ross)
- Candidates: process-compact

## T24 kraft-rust — letterpress craft voice

- Faces: American Typewriter / Courier New / Georgia headings
- bg #E8DCC8 · ink #3B2F2F · accent #9A3412 (rust) · muted #6B5F4E
- Records: B-106 Hand-Painted Penguin Tri-Band (craft covers)
- Candidates: evidence-collated

## T25 blush-rose — jacket-flap voice

- Faces: Georgia (+ Noto Serif KR)
- bg #FDF2F2 · ink #3F3F46 · accent #BE123C (rose) · muted #5F5F66
- Records: B-111 Born modern: Alvin Lustig (book jackets)
- Candidates: quote-attributed

## T26 sand-olive — quiet minimal voice

- Faces: Trebuchet MS / Verdana (+ Noto Sans KR)
- bg #EDE6D6 · ink #292524 · accent #5D6B1F (olive) · muted #656054
- Records: D-336 iA Writer
- Candidates: manual-opening

## T27 glacier-sky — civic clarity voice

- Faces: Helvetica Neue / Helvetica / Arial (+ Noto Sans KR)
- bg #F0F4F8 · ink #0F172A · accent #0369A1 (sky) · muted #5B6B7B
- Records: D-315 GOV.UK type scale
- Candidates: problem-narrative

## T28 mint-slate — grotesque system voice

- Faces: Inter / Helvetica Neue / Arial (+ Noto Sans KR)
- bg #F1F5F9 · ink #0F172A · accent #047857 (emerald) · muted #5B6B7B
- Records: D-323 IBM Plex
- Candidates: margin-evidence

## T29 mist-indigo — avant-poster voice

- Faces: Avenir Next / Futura / Trebuchet MS
- bg #F5F3FF · ink #1E1B4B · accent #4338CA (indigo) · muted #5E5A8A
- Records: E-419 Awazu Kiyoshi's Fantastical World
- Candidates: evidence-focused

## T30 kr-myeongjo — Korean serif voice

- Faces: Noto Serif KR / Batang / Georgia
- bg #FFFFFF · ink #1A1A1A · accent #A31621 (dancheong red) · muted #5A5A5A
- Records: E-465 Nanum Myeongjo in use (secondary-description)
- Candidates: insight-unpacked

## T31 kr-today — contemporary Korean sans voice

- Faces: Noto Sans KR / Apple SD Gothic Neo / Malgun Gothic
- bg #FAFAF9 · ink #1C1917 · accent #1D4ED8 (taegeuk blue) · muted #5F5B57
- Records: E-466 Pretendard (secondary-description)
- Candidates: evidence-explainer-columns

## T32 jp-shu — Tanaka retrospective voice

- Faces: Hiragino Mincho / Yu Mincho / Noto Serif JP
- bg #F7F3E8 (kinari) · ink #2B2B2B · accent #B23A1D (shu) · muted #6E675C
- Records: E-472 Ikko Tanaka Posters 1980–2002 (secondary-description)
- Candidates: manual-reference

## T33 jp-ai — Japanese gothic voice

- Faces: Hiragino Kaku Gothic / Hiragino Sans / Meiryo
- bg #FFFFFF · ink #222222 · accent #1F3A93 (ai indigo) · muted #5A5A5A
- Records: E-441 Morisawa BIZ UD Gothic
- Candidates: architecture-layered

## T34 cn-seal — Chinese serif voice

- Faces: Songti SC / SimSun / Noto Serif SC
- bg #F6F1E7 (rice) · ink #201A17 · accent #A31621 (seal red) · muted #6E6259
- Records: E-449 Typographics 21: CJK typography (session 6)
- Candidates: tradeoff-balanced

Coverage: 34/34 themes in use; 36/38 candidates themed
(signal-grotesk ×2, evidence-slate ×2); transition-breath and
transition-bridge stay system-native.
