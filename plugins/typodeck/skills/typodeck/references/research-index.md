# Typodeck Skill — Research Index (read on demand)

Full registry: `research/typography/evidence-registry.json` (46 principles).
Synthesis: `research/typography/SYNTHESIS.md`. Prior study:
`docs/TYPOGRAPHY_RESEARCH.md` (S1-S14, F-findings) + `docs/TYPOGRAPHY_AUDIT.md`
(T1-T11). Never paste the corpus into context — cite IDs.

- Classical/modern (A01-A13): Butterick FULL (body-first, tracking, grids,
  centering, presentations) + Rutter FULL (rhythm, scale) are the only
  source-supported slide rules. Bringhurst secondary; Müller-Brockmann, Ruder,
  Lupton, Tschichold, Weingart, Elam are LINEAGE (grammar supported, every
  numeric slide value derived).
- Perception (B01-B14): experimentally supported B01-B10 (Gestalt, common
  region, figure-ground, preattentive ~1 highlight, guided search, graphical
  perception, CLT/Mayer, ~4 chunks, CSF, clutter); B11 F-pattern
  observational; B12 Z-pattern folklore; B13 data-ink doctrine
  (mixed-to-contrary); B14 hierarchy convention.
- Presentation (C01-C09): validated Mayer directional (modality, redundancy +
  short-label revision, signaling, segmenting, coherence); lore (distance test,
  16:9, pacing numbers, word caps, pt minima, WCAG borrowing, 3s glance,
  reveal). No slide RCTs — all thresholds are extrapolation.
- Korean (D01-D10): normative KLREQ/UAX14/CSS (breaking, wrapping keep-all,
  autospace-neutral, metrics, no-italic, punctuation, justification) vs
  LIMITED (optimal ratio, opsz, KR-vs-EN headlines, weight curves, baselines).

Rule: source-supported findings vs derived heuristics must stay labeled in
code comments, tests, and reports. When unsure, mark it derived.
