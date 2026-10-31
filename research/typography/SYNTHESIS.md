# Typodeck 90+ — Research Synthesis (2026-10-30)

Human-readable companion to `evidence-registry.json` (46 principles: A01-A13, B01-B14, C01-C09, D01-D10).
Concise paraphrases only. No copyrighted reproduction.

## 1. What is source-supported vs derived

- FULL-read slide rules come ONLY from Butterick (A01-A05) + Rutter (A06) + Bringhurst-via-Rutter quotes (A07).
- Muller-Brockmann / Ruder / Lupton / Tschichold / Weingart / Elam contribute SUPPORTED lineage/grammar (Swiss asymmetric grid; expressive counter-tradition). Every numeric slide value derived from them is a DERIVED HEURISTIC needing rendered comparison, never an attributed rule.
- Perception: experimentally supported (B01-B10) vs observational (B11 F-pattern) vs folklore (B12 Z-pattern) vs doctrine with mixed-to-contrary evidence (B13 data-ink) vs convention (B14 hierarchy). Cite components, not slogans.
- Presentation: validated Mayer directional principles (C08 modality/redundancy + short labels; C03 segmenting; C07 signaling; B07 coherence/contiguity) vs practitioner lore (C01 distance test, C02 16:9, C03 pacing numbers, C04 word caps, C05 pt minima, C06 contrast borrowing, C07 3s glance, C09 reveal).
- Korean: normative spec (D02 breaking, D03 wrapping, D04 autospace-neutral, D05 metrics, D06 no-italic, D07 punctuation, D10 justification) vs LIMITED-EMPIRICAL (D01 optimal ratio, D08 opsz, D09 KR-vs-EN headlines, weight curves, baseline offsets).

## 2. Cross-cutting decisions for slides

1. Body-first (A01): decide body measure/leading before display. Bodies <=~60 chars/line (derived from A01/A07), titles <=2 lines.
2. Coarse grids (A03/A08): Swiss uses coarse columns, not 8-32 print fields. Baseline grids only for wide multi-column.
3. Center short only (A04/A12): asymmetry default; expressive centering bounded to hero-length lines (T6 open).
4. Stable sizes (A05): hold one base size deck-wide; wrap-first/shrink-second; 0.13x microtype tail must fail loudly instead.
5. Rhythm + scale discipline (A06/A07): measured rhythm intervals; modest related scale set; letterspace caps/digits only.
6. Grouping (B01/B02): proximity first; common-region/uniform-connectedness often beat proximity — shared bands + alignment threads.
7. Attention (B04/B05/B07): ~1 preattentive highlight; titles prime; decoration stays low-salience; coherence/signaling/contiguity.
8. Memory (B08): ~4 chunks, not 7. One message per slide; chunk bullets into 3-4 groups.
9. Clutter budget (B10/B09): each color/font/box raises congestion; thin/small/low-contrast dies first at distance.
10. Reading (B11/B12/B13/B14): F-pattern is failure-mode, not target; Z-pattern is folklore; data-ink is default-not-law; hierarchy ratios are taste.
11. Narration (C08): no verbatim duplication; narration+graphic over text+graphic; short 2-3 word labels help (d=0.47-0.70).
12. Korean (D01-D10): KLREQ/UAX14 breaking + kinsoku; keep-all + overflow-wrap; no autospace for Hangul; Pretendard-first; weight-not-italic; NIKL punctuation; even-space default. Optimal ratios, opsz, KR-vs-EN sizing, weight curves: LIMITED — flag experimental.

## 3. Known gaps (do not claim as validated)

- No slide-specific RCTs for any principle; all slide thresholds are principled extrapolation.
- No validated visual-angle min size, content contrast for projection, word-cap, pacing, glance threshold, or reveal effectiveness.
- No Hangul opsz axis, KR-vs-EN headline study, weight-perception curves, or numeric baseline offsets.
- Primary bodies uncited: 7/9 classical bodies secondary-only; paywalled perception/presentation originals; NIKL full PDF; foundry metrics rationale.

## 4. Implementation mapping (honest status)

- Implemented: coarse grids, no baseline grid, no justification, <=2 families, CJK/Latin wrap options, zero Hangul tracking, display leading gradient, no synthetic optical fiddling (policy), theme-token colors, WCAG AA tests, 16:9 canvas.
- Partial: kicker tracking exceeds A02 (T1); expressive centers bodies (T6); 0.13x tail vs A05 (T5); measure caps missing (T2/T3); single-highlight unenforced; chunk limiter missing; kinsoku/keep-all missing; Korean leading missing.
- Missing: composition/grid/per-type tokens; slide-type branching; deck rhythm model; congestion/hierarchy/density scoring; clipping detector; revision loop; human rubric; held-out split; in-repo rasterizer.

## 5. Tensions requiring rendered comparison (not fiat)

T1 kicker 0.12/0.20/0.28/0.34; T6 expressive bodies centered vs left; T10 pure ink/paper comfort; T11 estimateWrap vs PowerPoint wrap + safety margins; centered-body readability cost; CJK display-size/tracking/weight curves; KR-vs-EN headlines; Butterick no-autofit vs must-fit-arbitrary-text.
