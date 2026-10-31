# Candidate Visual Systems — Research Synthesis Registry

Provenance: merged from 4 agent handoffs (A–D; agent E failed, zero records) into
`research/merged_registry.jsonl` / `.json` (370 records, schema-valid, 0 duplicates).
The isolated per-agent composition analyses were NOT carried in the handoffs, so every
merged record is an honest stub (visuals/designer/year withheld as unknown). Clusters and
principles below are therefore **provisional** and evidence-leveled:

- **[L1 repo-read]** — read in this workspace (`packages/core/src/*.ts`, `research/schema.json`)
- **[L2 fetched]** — page fetched and inspected by this synthesis step
- **[L3 agent-attested]** — claimed in a handoff; original record not visible here
- **[L4 inference]** — synthesis inference; needs re-inspection before use as theme evidence

Engine constraints assumed (from audit + [L1]): editable PPTX text boxes only; 5 roles
(kicker/title/body/number/caption); family/size/weight/tracking/leading/align/whitespace/
solid-color only; FORBIDDEN shapes/cards/borders/rules/arrows/icons/images/gradients/
shadows; body contrast ≥ 4.5:1; 16:9 canvas; margins ≥ 0.5in. Existing systems:
editorial (asymmetric-stack), swiss (grid-columns), expressive (centered-hero);
13 semantic types, 13 primitives, ~31 composition candidates.

## 1. Visual-grammar clusters (provisional)

### G1 — Swiss objective grid [L3 + L2]
Records: A-001..A-100 (agent-A Swiss/ITS corpus: posters, books, exhibitions).
Grammar: mathematical modular grid; asymmetric layout; flush-left ragged-right;
sans-serif (Akzidenz/Helvetica/Univers lineage); whitespace as structure; content-first,
no decoration. [L2: PRINT Swiss-style principles — grid as "most legible means",
asymmetry, sans typefaces, stripping embellishments.]
Engine fit: already covered by `swiss` system + column-rhythm/alignment/baseline-relations.

### G2 — Editorial book/magazine measure [L3 + L2]
Records: B-101..B-170 (books 23, magazines 17, posters 13, publishing 10, newspapers 7).
Grammar: multi-column grids with controlled measure; section heads, running heads/folios;
pull quotes; cover systems with series color-coding (Tschichold tri-band grid, color by
language/series [L2: Penguin history-in-objects]). Hierarchy by scale + position + grouping.
Engine fit: largely covered by `editorial` (+ `swiss` for collated matter); running
heads/folios and series bands have NO current primitive (text-treatment gap, see §4).

### G3 — Documentary evidence / margin annotation [L3, L4]
Records: D-301..D-400 subset (Tufte books, data-typography, docs) + B evidence matter.
Grammar (agent-attested, analyses not visible): claim adjacent to source; dense
information with small-multiple-like repetition; sidenote-style marginalia.
Engine fit: claim+adjacent-caption exists (`evidence-anchored/focused/collated`);
true margin notes do NOT exist as a role — closest is 2-column + caption reuse.

### G4 — Technical-manual / type-scale docs [L3 + L2]
Records: D-301..D-400 subset (design systems, Butterick, Diátaxis, code typography).
Grammar [L2]: strict type scales; deep section hierarchy; measure 45–90 chars and
leading 120–145% (Butterick key rules); four doc needs → four forms — tutorial,
how-to, reference, explanation (Diátaxis quadrants); monospace for code/verbatim.
Engine fit: PARTIAL — hierarchy depth beyond 5 roles, monospace treatment, and
reference-table density exceed current grammar (see candidate S1).

### G5 — Postmodern / deconstructed display [L3]
Records: C-201..C-300 (Weingart/Basel, Greiman, Brody/Fuse, Carson, Emigre, Cranbrook,
Cooper/VLW, Scher, Saville, Barnbrook, MoMA Standard Deviations).
Grammar (agent-attested): broken/overlapping grids; layering; type as image;
vernacular appropriation; expressive letterspacing/scale distortion.
Engine fit: INFEASIBLE under typography-only editable text (see §5). Bounded subset
(weight/scale play within one grid) is already `expressive`.

### G6 — Specimen / identity grids [L3, L4]
Records: scattered (type specimens, SBB manual, Penguin templates, Emigre specimens).
Grammar: modular specimen grids; repeated glyph/scale rows; template-driven identity.
Engine fit: covered by `swiss` columns (≤4) for slide purposes; full specimen sheets
are out of scope for 16:9 narrative slides.

## 2. Operational design principles (transferable)

1. **Grid first, asymmetry second.** Begin with a mathematical module, then place
   content asymmetrically within it. [L2 PRINT; L1: swiss grid-columns, A03 coarse grids]
2. **Content over decoration.** Strip non-informative styling; hierarchy from
   scale/weight/position/grouping only. [L2 PRINT; L1: typography-only schema]
3. **Measure 45–90 chars; leading 120–145%.** Body readability band.
   [L2 Butterick rules 3–4; L1: grammar cap 60 chars/line sits inside the band]
4. **Center sparingly; caps < 1 line with +5–12% tracking.** Display discipline.
   [L2 Butterick rules 10–11, 15; L1: expressive bounds, kicker tracking tokens]
5. **Series-code decks, not just slides.** Repeat one band/label/color signal across
   slides (tri-band lineage) for deck identity. [L2 Penguin; L4 transfer to kicker +
   background rhythm — needs art-direction support]
6. **Form follows doc need.** Tutorial/procedure vs reference/fact vs explanation/claim
   want different compositions. [L2 Diátaxis quadrants; L1: semantic slide types already
   encode this — process vs evidence vs thesis]
7. **Claim adjacent to source.** Evidence captions must sit next to the claim they ground.
   [L3 D-corpus Tufte lineage; L1: evidence-anchored/focused, B07 contiguity]

## 3. Repeated composition patterns (seen across corpora)

- Hero statement + subordinate grounding line (G1 posters, G2 covers, G4 doc leads)
- Parallel columns with shared baseline for comparison/trade-off (G1 grids, G2 tables)
- Number-led metric with one-line gloss (G2 magazine stats, G3/G4 data matter)
- Stacked Before/After with repeated parallel labels (G2 editorial, G4 docs)
- Sparse section marker, title-only (G1 exhibition titles, G2 part openers)
- Small repeated citation/source shape down a column (G3 evidence collation)

## 4. Candidate systems registry (selective — not every cluster deserves a theme)

### S1 — `document` (technical-manual) — CONDITIONAL CANDIDATE
- Source grammar: G4 (type scales, deep hierarchy, reference density, verbatim voice).
- Distinct placement strategy: `hierarchy-stack` — left-aligned, high-density,
  section-numbered stacks with verbatim lines; distinct from editorial (one idea/slide),
  swiss (columns), expressive (hero).
- New engine capabilities required: `new:verbatim-role` (monospace treatment for
  code/paths/specs), `new:section-marker` (typographic section numbering via
  textual-repetition — likely feasible inside kicker), denser body floor (min 8pt exists).
- Condition: verify against re-inspected G4 records; if hierarchy depth collapses to
  existing primitives, fold into `swiss` instead of adding a system.
- Verdict: **candidate — the only cluster with a genuinely uncovered placement strategy.**

### S2 — series/cover band system — REJECTED as system
- Source grammar: G2 tri-band/series-coding. Deck-level identity signal is real, but a
  system in this architecture is a per-slide placement strategy, and bands are a
  deck-level repetition device. Implement as composition candidates
  (opening-statement variants) + `planArtDirection` rhythm instead. No new system.

### S3 — evidence-margin (sidenote) system — REJECTED as system
- Source grammar: G3. Claim+adjacent-source already exists in three candidates;
  true sidenotes need `new:margin-note-role`, which buys little over 2-column +
  caption for 16:9 slides. Fold margin patterns into `swiss`/`editorial` candidates.

### S4 — deconstructed/expressive-voice system — REJECTED (infeasible)
- Source grammar: G5. Requires rotation, layering, transparency, type-as-image —
  all forbidden (see §5). Bounded subset already served by `expressive`.

### S5 — specimen-sheet system — REJECTED (out of scope)
- Source grammar: G6. Specimen grids serve type showcases, not narrative slides;
  `swiss` columns suffice for the slide-shaped subset.

## 5. Unsupported / infeasible strategies + required engine capabilities

These recur in the corpora (esp. G5) but violate typography-only editable-text constraints:

| Strategy (corpus evidence) | Why infeasible | Capability if ever pursued |
|---|---|---|
| Layered/overlapping type (G5, L3) | z-order/transparency unavailable; PPTX text boxes are opaque flats | `new:layering`, `new:transparency` |
| Rotated/angled type (G5, L3) | rotation not in schema; breaks wrap/fit math | `new:rotation` |
| Type as image / custom letterforms (G5, L3) | editable font text only; no outlines/paths | `new:custom-path` (out of scope) |
| Rules/borders/dividers as structure (G1/G2, L2+L3) | FORBIDDEN_KEYS in schema | `new:rule` (rejected by design) |
| Running heads / folios (G2, L3) | no per-slide auto-text primitive | `new:running-head` (possible future) |
| True margin/sidenotes (G3, L4) | only 5 roles; no margin geometry | `new:margin-note-role` |
| Photo/type integration (G1, L2 PRINT) | images forbidden entirely | none (will not pursue) |
| Kinetic/motion type (scattered, L3) | static PPTX export | none (will not pursue) |

## 6. Gaps and limitations (honest)

- All 370 merged records are stubs: composition/hierarchy/grid/whitespace withheld as
  unknown; only source_url + remapped inspection status + provenance are real.
- Agent D's 42 fetch-verified records are unattributable from the handoff (all D records
  conservatively `secondary-description`); true visual-verified total is 191 (agent-
  attested), merged-registry inspected total is 149.
- Agent E failed (runtime error): its 100-record topic slice is entirely missing.
- G3/G5 grammar descriptions rest on agent attestations, not visible analyses; S1's
  condition and §5's G5 rows need re-inspection before implementation.
- Upgrade path: collect the isolated `research/agent-{A,B,C,D}.jsonl` files into this
  workspace and re-run the merge with full-field carry-forward (dedup map is stable:
  normalized source_url, zero dupes found).
