# Typodeck — Typography Audit (Phase A/C, 2026-10-30)

Observed against the committed baseline layout engine (`layout.ts`,
`systems.ts`) plus the research report (`docs/TYPOGRAPHY_RESEARCH.md`).
Findings are ordered by evidence strength: measured facts first, then
research tensions that need rendered comparison to resolve.

## Method

- Read `layout.ts` (placement strategies, wrap, fit, relaxation) and
  `systems.ts` (role scales, rhythm, margins, colors) in full.
- Measured wrap behavior with the built engine on a representative F4 body
  (see numbers below) — not inferred from constants alone.
- Compared each behavior against the research findings (F-references).

## Measured facts

### T1 — Kicker tracking far above guidance (needs visual verdict)

Role tracking today: editorial 0.28em, swiss 0.18em, expressive 0.34em.
Butterick (F3.5) and Bringhurst via Rutter (F3.6) put tracked caps at
5–12% — our expressive kicker runs at 34%, roughly 3× the top of the
range. Display microtype may justify wider tracking than text-size caps,
but 0.34em risks letterspacing-so-wide-it-reads-as-separate-letters
(Butterick's explicit failure mode). Resolve by rendered comparison,
not by fiat: test 0.12 / 0.20 / 0.28 / 0.34 on identical kickers.

### T2 — Body lines run 64–78 characters (too long for slides)

Measured on one representative F4 body at system body styles and typical
column widths: editorial 78 chars/line (8.6in @15pt), swiss 64 (5.5in
@12pt), expressive 70 (7.4in @14pt). Print ideals are 45–75 (F13.1/F13.2)
for documents; slides need shorter lines (our adaptation: ≤~60). Cause:
columns are wide relative to body size, and bodies are single paragraphs
with no width cap below the column width. Fix direction: per-system body
measure caps (F5.2: confine layout to less than full width).

### T3 — Titles wrap to 4–6 lines (too long for display type)

Same probe: a 72-char narrative title wraps to 4 lines (editorial/swiss)
and 6 lines (expressive, 64pt in 7.4in). Display titles should span ≤2
lines; 6-line "headlines" are paragraphs in costume. Boundary issue:
narrative shortens titles to 72 chars, typography wants ≤~50. Resolve by
testing title caps (50/60/72) against real narrative output.

### T4 — Blocks-per-slide identical across systems (known, Phase 4 log)

Layout preserves narrative block counts 1:1, so the diversity metric's
blocks feature never differs between systems. Composition differs only
in headline size + alignment mix. For genuinely different grammars,
systems need behavioral differences (body measure, rhythm, placement
variants per slide role) — the core of Phase E.

### T5 — Scale-down relaxation can reach 0.13× (illegible tail)

`layoutSlide` retries at scales down to 0.13 on overlap. A 15pt body at
0.13× is ~2pt: technically in-bounds, practically invisible. Butterick
(F11.2) says hold sizes stable instead of shrinking to fit. No observed
deck has needed deep scales yet, but the tail is unbounded. Fix
direction: floor role sizes at readability minima and fail loudly
(structured overflow) rather than emit microtype.

## Research tensions (resolve by rendered comparison)

### T6 — Expressive centers body copy (readability vs voice)

Butterick (F6.1): centered blocks are hard to read (both edges ragged)
and hard to align; center only short phrases/titles. Expressive centers
everything. Candidate resolutions: (a) keep full centering as the
system's voice, cap body length; (b) center heroes/kickers, left-align
bodies. Compare identical narratives both ways before deciding.

### T7 — Swiss caption is the only right-aligned role (fine, keep)

Right-aligned captions against left-aligned grid text create the Swiss
asymmetric counterpoint. Consistent with F7.1 lineage. No change;
regression-test the alignment mix instead.

### T8 — No widow/orphan or rag control in wrap

`estimateWrap` is greedy with no widow/orphan guard and no rag balancing.
Short last lines ("orphans") and ladders are likely on narrow columns.
Research is silent at this granularity for slides; fix direction is a
project heuristic (H): penalize 1–2 word final lines by re-breaking.

### T9 — Number slides: lining figures assumed, not verified

F9.1 wants lining numerals for star numbers. Our stack (Archivo Black,
Inter, Noto Serif KR, Pretendard) ships lining figures by default in
practice, but this is unverified per font. Fix direction: document the
assumption + a font-capability probe (research question 1/4).

### T10 — Pure-ink-on-paper pairs in two systems

Swiss uses #111111 on #FFFFFF (near-white field); expressive dark stage
uses #F5F2EA on #0E0E0E (near-black field). Butterick (F11.1/F10.2)
prefers off-white fields and gray type for projection comfort. Contrast
tests enforce AA minimums, but comfort (simultaneous contrast, dark-room
photon load) is unmeasured. Fix direction: paper-tone fields everywhere
Swiss stays white today, validated by rendered comparison.

## Visual confirmation (Quick Look renders, 2026-10-30)

Rendered `idea-editorial.pptx` cover via macOS Quick Look (qlmanage, first
slide) before and after installing the OFL stack fonts (Inter, Archivo
Black, Noto Sans/Serif KR variable; Pretendard ships web formats only and
falls back to Noto Sans KR in renders — documented substitution):

- T1 CONFIRMED: kicker reads "T Y P O D E C K" with gaps so wide the word
  barely holds together at 0.28em.
- T2 CONFIRMED: the cover body runs ~95 characters on a single line.
- T3 CONFIRMED: the 72-char cover title wraps to 3 display lines.
- NEW T11: real wrapping diverges from `estimateWrap` (Quick Look breaks
  the title at different words than the engine predicted). Box heights
  come from estimates; PowerPoint wraps its own way. Structural overflow
  checks cannot see this — rendered comparison must, and boxes need
  safety margins or measured (not estimated) wrap.

## Non-defects (consistent with research, preserved)

- Coarse per-system grids, no baseline grid (F4.1/F4.2). ✓
- No justification anywhere (F13.3). ✓
- ≤2 families per system with consistent heading/body roles (F2.1/F14.1). ✓
- CJK-char / Latin-word wrap matching klreq's options (F12.1). ✓
- Zero Hangul tracking (F12.2). ✓
- Tight display leading (≈1.0–1.12 heroes/titles) loosening toward body
  1.4–1.6 (F3.3). ✓
- No synthetic optical compensation; font metrics trusted (F10.1). ✓
- Theme-token colors, accent reserved for kickers (F15.2). ✓
- Caption role small + muted = background layer (F1.1). ✓
