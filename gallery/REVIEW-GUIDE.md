# Typodeck Visual Review Guide (review-assets checkpoint)

Scope: branch `research/review-assets-2026-10-31`, child of the accepted
research checkpoint `dd76f69` (447 records, untouched). This package adds the
generated preview bytes + gallery evidence integration so a human can judge
each implemented candidate against its references. `document` stays
experimental; nothing here promotes, merges, or rejects anything.

## Open it

- Double-click `gallery/index.html` (every view works from `file://`), or
- `python3 -m http.server 8080` from the repo root, then open
  `http://localhost:8080/gallery/`.

Narrative under review (all systems, all slides): "Typodeck Experimental —
Comparable Preview", sha `eacc5037…`, seed 7. English only, 6 slides,
21 text boxes, 892 editable chars per system. Every system passes
`validatePptx` and HTML text parity (badges in the gallery).

## Comparisons available (24 rendered + 2 unrendered)

Each row is one slide index; open Compare, pick the slide, and judge the same
content across systems. Candidate ids are per system.

- x0-cover: document `series-opening` vs editorial/swiss/expressive `opening-statement`
- x1-problem: document `problem-tension` (fallback, no doc candidate) vs editorial/expressive `problem-tension` vs swiss `problem-narrative`
- x2-number: document `manual-metric` vs editorial/swiss `metric-anchored` vs expressive `metric-hero`
- x3-differentiation: document `manual-reference` vs editorial/expressive `comparison-stacked` vs swiss `comparison-columns`
- x4-results: document `margin-evidence` vs all production `evidence-focused`
- x5-closing: document `conclusion-restatement` (fallback) vs editorial/expressive `conclusion-charge` vs swiss `conclusion-restatement`

Not rendered (shown as NO PREVIEW, still reviewable): `document:manual-opening`,
`document:manual-section` — the narrative did not select them.

Per-slide outputs: HTML `previews/html/{document,editorial,swiss,expressive}.html`,
editable PPTX `previews/pptx/typodeck-{document,editorial,swiss,expressive}.pptx`
(PPTX sizes match the manifest bytes exactly). Inline gallery slides are HTML
renders, never PPTX proof — always open the linked PPTX before judging
editable output.

## Implemented candidates (evidence in the gallery)

Each item below is also an expandable panel in the gallery (Interpretations,
Compare, Decisions → Refs). Statuses are live from the 447-record registry.

### X1 — `document` system, `hierarchy-stack` (experimental 0.1.0)

- Refs: D-301, D-307, D-308, D-304, D-315 (all inspected) + D-356 (search-checked).
- Rules: 2.0in meta column (kicker/number section markers), wide content zone
  (title/body stacks), caption bottom-right; left-aligned dense stacks; single
  emission pass. Existing engine caps only.
- Gaps: no verbatim/monospace role (code renders in body face); section
  markers are kicker-text approximations; no doc problem/conclusion candidate.

### X2 — `document:manual-opening` (no rendered slide)

- Refs: same G4 set as X1 (5 inspected + D-356 search-checked).
- Rules: rhythmScale 1.1; grouping + repetition + negative-space.
- Gaps: X1 gaps; unrendered in this package.

### X3 — `document:series-opening` (x0)

- Refs: B-105, B-106 (both inspected — Penguin tri-band).
- Rules: series identity via repeated kicker label + rhythmScale 1.2.
- Gaps: physical bands rejected by design (would need `new:rule`).

### X4 — `document:manual-section` (no rendered slide)

- Refs: same G4 set as X1.
- Rules: dense rhythmScale 0.9, 70-char measure (Butterick band), 2 columns.
- Gaps: X1 gaps; unrendered in this package.

### X5 — `document:manual-reference` (x3)

- Refs: G4 set + D-317 Tufte (inspected).
- Rules: rhythmScale 0.9, 64-char measure, 2 columns; column-rhythm +
  repetition + baseline-relations.
- Gaps: X1 gaps.

### X6 — `document:margin-evidence` (x4)

- Refs: D-317 Tufte (inspected, G3 lineage).
- Rules: 48-char tight measure + adjacent source caption.
- Gaps: true sidenotes need `new:margin-note-role` (not implemented); X1 gaps.

### X7 — `document:manual-metric` (x2)

- Refs: G4 set.
- Rules: number-led figure in meta column at section scale; hero integrity
  gates (number + caption ref required).
- Gaps: X1 gaps.

## Unsupported / not comparable (honest gaps)

- Korean narrative: no KO preview artifacts exist and the frozen generator
  hardcodes one English narrative — engine-level KO support (benchmark B8-ko)
  has no visual-review renders. This package is English-only.
- `manual-opening` / `manual-section`: no rendered slides (narrative selection).
- Document problem/conclusion: fallbacks only, no doc-specific candidates.
- PPTX visual fidelity: no pixel proof exists; evidence is structural
  validation + HTML text parity + the editable files themselves.
- Postmodern (G5) and East Asian (G7) transferable subsets: deliberately
  unimplemented per the S4/S6 verdicts — nothing to compare yet.

## Decision backup procedure

Verdicts live in the reviewer's browser (`localStorage` keys
`typodeck-gallery-decisions-v1` + reviewer key) until exported. Back up with:
Decisions tab → enter reviewer name → Export JSON (full record incl.
narrative sha + seed) and Export CSV (spreadsheet). Keep the exported files;
Import JSON resumes a session on any machine. This checkpoint changes no
decision code paths, keys, or export formats.

## Reproducibility

Preview bytes are pinned in this commit with `previews/manifest.json`
(narrative sha, seed, per-system bytes/validation). Generator provenance:
`npm run previews:experimental` per `research/implementation_notes.md`; the
generator script lives outside this branch's scope, so bytes are reviewed
as-is, never regenerated here. Gallery bundle: `node gallery/build-data.js`
(rebuilds `gallery/data.js` from registry + provenance + evidence + previews;
must report 0 missing / 0 warnings).
