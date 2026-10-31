# Candidate Visual Systems — Research Synthesis Registry (full-field recompute)

Provenance: recomputed 2026-10-30 from `research/merged_registry.json`
(447 full-field records from agents A–E, schema-valid, 0 duplicates) +
`research/merge_provenance.json`. This supersedes the stub-era synthesis
(preserved at `research/history/stub-era/candidate_visual_systems.md`), whose
clusters rested on agent attestations. Every grammar claim below was read
directly from merged agent observations and cites record ids. Evidence legend:

- **[R]** — read directly from a merged-registry record (full agent observation)
- **[Ri]** — the cited record is `inspected-reproduction` (page/surrogate seen)
- **[Rs]** — the cited record is `secondary-description` (search-checked only)
- **[L1]** — read in this workspace (`packages/core/src/*.ts`, `research/schema.json`)

Corpus verification split: **235 inspected / 190 search-checked / 22
inaccessible** out of 447. Per-cluster figures below weight evidence
accordingly: search-checked records corroborate but never anchor a candidate.

Engine constraints assumed (from audit + [L1]): editable PPTX text boxes only;
5 roles (kicker/title/body/number/caption); family/size/weight/tracking/
leading/align/whitespace/solid-color only; FORBIDDEN shapes/cards/borders/
rules/arrows/icons/images/gradients/shadows; body contrast ≥ 4.5:1; 16:9
canvas; margins ≥ 0.5in. Existing systems: editorial (asymmetric-stack),
swiss (grid-columns), expressive (centered-hero); experimental: document
(hierarchy-stack). 13 semantic types, 13 primitives, ~31 composition candidates.

## 1. Visual-grammar clusters (recomputed)

### G1 — Swiss objective grid [R, 97/100 inspected]
Records: agent-A corpus (A-001..A-100; designers incl. Hofmann 13,
Müller-Brockmann 10, Gerstner 5 [R]).
Grammar (read, not attested): mathematical modular grids with asymmetric
placement inside them; flush-left ragged-right grotesque type blocks (cap
`flush-left type blocks` on 89/100 A records [R]); hierarchy by multi-size
scale contrast (77/100 [R]); whitespace as structure
(A-001 Musica Viva [Ri]: "small flush-left sans-serif type delivers concert
facts in a disciplined block"). 62/100 high slide-adaptability [R].
Counter-pattern inside G1: Hofmann's Giselle vertical title strips
(A-004/A-008/A-013/A-036 [Ri]) need rotated text — infeasible (see §5).
Engine fit: covered by `swiss` system + column-rhythm/alignment/
baseline-relations; expressive covers the bounded display subset.

### G2 — Editorial book/magazine measure + series-coding [R, 40 insp / 22 search / 8 inacc]
Records: agent-B corpus (B-101..B-170: books 23, magazines 17, posters 13,
publishing 10, newspapers 7).
Grammar: multi-column grids with controlled measure; headline/standfirst/body
in disciplined size steps (B-102 Bloomberg Businessweek redesign [Ri]);
section heads, captions, folios; cover systems with series color-coding —
Tschichold's Penguin tri-band template is now directly read (B-105/B-106
[Ri]: "reduced cover design to a fill-in-the-zones system"). Running
heads/folios recur (11 B records carry folio/running primitives or caps [R]).
Engine fit: largely covered by `editorial` (+ `swiss` for collated matter);
running heads/folios have NO current primitive (text-treatment gap, see §4 S2).

### G3 — Documentary evidence / margin annotation [R, inspected core]
Records: D-308 Envisioning Information [Ri], D-317 Visual Display of
Quantitative Information [Ri], D-320 Tables [Ri] (claim adjacent to
demonstration/table), D-382 Visual Explanations [Rs], plus cross-corpus
corroboration from E-444 Japanese Gap Analysis [Ri] (requirement → verdict
label → evidence link "checklist-slide pattern").
Grammar: claim adjacent to source/demonstration; dense information with
small-multiple-like repetition; sidenote-style marginalia.
Engine fit: claim+adjacent-caption exists (`evidence-anchored/focused/
collated`); true margin notes do NOT exist as a role — closest is 2-column +
caption reuse. S3 verdict stands (fold, no system).

### G4 — Technical-manual / type-scale docs [R, 42 insp / 58 search]
Records: agent-D corpus (D-301..D-400). Directly read this round:
D-301 Butterick's Practical Typography [Ri], D-307 Diátaxis [Ri]
(four doc needs → four forms), D-304 Carbon [Ri] (token tables + code
usage), D-311 CSS Fonts L4 [Ri] (numbered property definitions),
D-313 Bootstrap docs [Ri].
Grammar: strict type scales and token tables; deep section hierarchy
(cap `hierarchical headings` on 58/100 D records [R]); monospace verbatim
voice for code/specs (cap `monospace code voice` on 27/100 — but only 8 of
those 27 are inspected [R/Rs split]); measure/leading discipline.
Engine fit: PARTIAL — hierarchy-stack density is genuinely uncovered (see S1
re-evaluation); verbatim-role need is real but mostly search-checked, so it
cannot by itself justify a schema change yet.

### G5 — Postmodern / deconstructed display [R, 12 insp / 83 search / 5 inacc]
Records: agent-C corpus (C-201..C-300). The 12 inspected records now ground
what was purely attested: C-201 Weingart Typographic Process [Ri] needs
`free-rotation` + `layered-overprint` ("overprint texture and tilt exceed
native engine"); C-217 Ray Gun cover [Ri] ("distress and rotation do not"
transfer); C-212 Fuse 2 [Ri] ("custom glyphs do not"); 16/100 C records
name rotation/layering/overlap/transparency/motion in caps or summaries [R].
Bounded transferable subset, also directly read: C-220 Emigre 1 [Ri, high
adapt] ("two-ink masthead-plus-blocks cover adapts directly to title
slides"); C-212 alphabet-as-hero ("adapts to display-type slides").
Corpus adaptability: 74 low / 18 medium / 8 high [R].
Engine fit: INFEASIBLE as a system (§5); the bounded subset (weight/scale
play, masthead-plus-blocks, alphabet-as-hero within one grid) belongs to
`expressive`. S4 verdict stands.

### G6 — Specimen / identity grids [R, mixed inspection]
Records: A-024 Helvetica prequel [Ri], D-302 Inter specimen [Ri],
C-229/C-259 Emigre specimens [Rs], D-323 IBM Plex, E-405 GothicNeo [Ri],
E-438 four-foundry sampler [Ri] ("one face, both writing directions").
Grammar: modular specimen grids; weight ladders (E-405 proof rows [Ri]);
template-driven identity (SBB manuals A-033/A-071 [R]).
Engine fit: covered by `swiss` columns (≤4) for the slide-shaped subset;
full specimen sheets out of scope for 16:9 narrative slides. S5 stands.

### G7 — East Asian typography [R, 44 insp / 24 search / 9 inacc] — NEW
Records: agent-E corpus (E-401..E-477: japanese-typography 39,
korean-typography 21, east-asian-contemporary 8, mixed-script 5,
multilingual-layout 4). 31 high-adaptability, of which 27 are inspected [R] —
the strongest transferable subset after G1. Compositional ideas (all [Ri]
unless noted):
- **Hangul-first multiscript alignment** (E-405 GothicNeo): "Latin and
  symbols are tuned to Hangul metrics rather than the reverse" — transferable
  as mixed-script styling guidance.
- **Per-script credit architecture** (E-413 Source Han Sans/Serif):
  "one family, per-script authorship" — attribution-slide model.
- **Syllable-block-as-composition** (E-403 Ahn Sang-soo specimens):
  "oversized syllable blocks as pure composition … adapts so well to
  text-only slides" — giant-character title slides.
- **Serial-grid experimentation** (E-404 LetterSeed, 27 issues): "one script,
  many grids" — alternating dense/air section pairs.
- **Index-as-portfolio** (E-408 Sulki & Min): "no hero images, just rigorous
  list typography" — faceted index slides via categorized lists.
- **Thesis-exhibition pattern** (E-418 Tanaka Faces): date badge + thesis
  headline + one-line mediator claim — retrospective-title slides.
- **Preface-as-architecture** (E-401 Hunminjeongeum): founding sentences as
  chapter kickers — section-divider slides.
- **Vertical composition** (E-445 JLReq kihon-hanmen + tate rules; E-444 gap
  analysis; E-438 vertical/horizontal sampler): core to Japanese typography
  but INFEASIBLE — needs rotated text (see §5). The 9 inaccessible E records
  (E-423..E-431 subset) are honestly "citation only" [R] and anchor nothing.
Engine fit: the transferable subset (bilingual index rows, credit rosters,
sampler rows, serial grids, thesis headlines, giant-character titles) fits
existing roles and is candidate-level, not system-level (see S6); vertical
composition, ruby/boten emphasis, and kinsoku line-breaking are infeasible.

## 2. Operational design principles (transferable, re-grounded)

1. **Grid first, asymmetry second.** Mathematical module, then asymmetric
   placement within it. [R: A-001, B-102; L1: swiss grid-columns]
2. **Content over decoration.** Hierarchy from
   scale/weight/position/grouping only. [R: D-301 Butterick manual; L1:
   typography-only schema]
3. **Measure 45–90 chars; leading 120–145%.** Body readability band.
   [R: D-301/D-356 Butterick rules; L1: grammar cap 60 chars/line inside band]
4. **Center sparingly; caps < 1 line with +5–12% tracking.** Display
   discipline. [R: D-301/D-356; L1: expressive bounds, kicker tokens]
5. **Series-code decks, not just slides.** Repeat one band/label signal
   across slides for deck identity. [R: B-105/B-106 tri-band [Ri]; transfer
   to kicker + background rhythm — needs art-direction support]
6. **Form follows doc need.** Tutorial/procedure vs reference/fact vs
   explanation/claim want different compositions. [R: D-307 Diátaxis [Ri];
   L1: semantic slide types already encode this]
7. **Claim adjacent to source.** Evidence captions next to the claim they
   ground. [R: D-308/D-317 [Ri], D-320 [Ri], E-444 checklist [Ri]; L1:
   evidence-anchored/focused, B07 contiguity]
8. **Dominant-script metrics first.** In mixed-script settings, fit
   secondary scripts to the dominant script's metrics, and credit each
   script's source. [R: E-405 Hangul-first alignment, E-413 per-script
   credits [Ri]; engine note: no per-script metric controls exist — this is
   font-choice + size/leading guidance, not automation]

## 3. Repeated composition patterns (seen across corpora)

- Hero statement + subordinate grounding line (G1 posters, G2 covers, G4 doc leads)
- Parallel columns with shared baseline for comparison/trade-off (G1 grids, G2 tables)
- Number-led metric with one-line gloss (G2 magazine stats, G3/G4 data matter)
- Stacked Before/After with repeated parallel labels (G2 editorial, G4 docs)
- Sparse section marker, title-only (G1 exhibition titles, G2 part openers, G7 E-401 preface-kickers)
- Small repeated citation/source shape down a column (G3 evidence collation, G7 E-444 checklists)
- Type-ladder / sampler rows: one family across weights or scripts (G6, G7 E-405/E-438)
- Faceted index: categorized list columns replacing hero graphics (G7 E-408)
- Credit roster: one family/work name + per-part attribution lines (G7 E-413)
- Thesis-headline + mediator claim for retrospectives (G7 E-418)

## 4. Candidate systems registry (selective — not every cluster deserves a theme)

### S1 — `document` (technical-manual) — CONDITIONAL CANDIDATE (evidence upgraded, still conditional)
- Source grammar: G4, now directly read (D-301/D-307/D-304/D-311/D-313 [Ri]).
- Distinct placement strategy: `hierarchy-stack` — left-aligned,
  high-density, section-numbered stacks with verbatim lines; distinct from
  editorial (one idea/slide), swiss (columns), expressive (hero).
- Re-evaluation against re-inspected G4 records: distinctness CONFIRMED
  (58/100 hierarchical-headings, token tables, caption voice recur [R]); the
  `new:verbatim-role` need is real (27/100 monospace) but only 8/27
  inspected [R/Rs] — suggestive, not yet schema-change-grade.
- Verdict: **candidate — stays experimental (`0.1.0`). No promotion to
  production without human review of the comparable previews and a decision
  on `verbatim-role` (schema addition) vs folding into `swiss`.**

### S2 — series/cover band system — REJECTED as system (stands, evidence upgraded)
- Source grammar: G2 tri-band/series-coding, now [Ri] (B-105/B-106).
- A system is a per-slide placement strategy; bands are a deck-level
  repetition device. Implement as composition candidates + `planArtDirection`
  rhythm. Running heads/folios (11 B records [R]) remain a `new:running-head`
  gap for future candidates, not a system. No new system.

### S3 — evidence-margin (sidenote) system — REJECTED as system (stands)
- Source grammar: G3, now [Ri]-cored (D-308/D-317/D-320) with G7
  corroboration (E-444). Claim+adjacent-source exists in three candidates;
  true sidenotes need `new:margin-note-role`, which buys little over
  2-column + caption for 16:9 slides. Fold into `swiss`/`editorial`.

### S4 — deconstructed/expressive-voice system — REJECTED (infeasible, stands)
- Source grammar: G5, now [Ri]-grounded (C-201/C-217 rotation/layering;
  16/100 name infeasible strategies). Requires rotation, layering,
  transparency, type-as-image — all forbidden (see §5). Transferable subset
  (masthead-plus-blocks C-220 [Ri], alphabet-as-hero C-212 [Ri],
  weight/scale play) already served by `expressive`.

### S5 — specimen-sheet system — REJECTED (out of scope, stands)
- Source grammar: G6 [Ri/Rs]. Specimen grids serve type showcases, not
  narrative slides; `swiss` columns suffice for the slide-shaped subset
  (sampler rows E-438 [Ri] fit as candidates).

### S6 — mixed-script / vertical East Asian system — REJECTED as system (new)
- Source grammar: G7 (E corpus). Two halves with opposite fates: (a) the
  transferable patterns (bilingual index rows, credit rosters, sampler rows,
  serial grids, thesis headlines, giant-character titles — 27 inspected +
  high-adapt records [R]) are candidate-level compositions inside existing
  roles, already expressible via `editorial`/`swiss`/`document` pools; a
  system must be a distinct per-slide placement strategy, and none here is
  one. (b) The genuinely distinctive strategies (vertical tate composition,
  ruby/boten emphasis, kinsoku breaking [Ri: E-445/E-444]) are infeasible
  under typography-only editable text (see §5). No new system; fold (a) into
  future candidates after human review.

## 5. Unsupported / infeasible strategies + required engine capabilities

Directly read from agent capability asks and adaptability notes (record ids are
merged-registry ids; statuses are the merged honest values):

| Strategy (corpus evidence) | Why infeasible | Capability if ever pursued |
|---|---|---|
| Layered/overlapping type (G5 [Ri: C-201, C-217]; G1 overlap ask A, 3 records [R]) | z-order/transparency unavailable; PPTX text boxes are opaque flats | `new:layering`, `new:transparency` |
| Rotated/angled type (G5 [Ri: C-201, C-217]; G1 vertical strips A-004/A-008/A-013/A-036 [Ri]) | rotation not in schema; breaks wrap/fit math | `new:rotation` |
| Vertical CJK composition (G7 [Ri: E-445 JLReq, E-444, E-438]) | same as rotation: no vertical writing mode in roles/geometry | `new:rotation` (shared row with above) |
| Ruby / boten emphasis marks (G7 [Ri: E-444/E-445]) | no interlinear annotation role; sub-line positioning unavailable | `new:ruby` |
| Kinsoku line-breaking rules (G7 [Ri: E-445]) | wrap math is Latinrag-based; no CJK break rules | engine gap (no name proposed) |
| Type as image / custom letterforms (G5 [Ri: C-201, C-212]) | editable font text only; no outlines/paths | `new:custom-path` (out of scope) |
| Rules/borders/dividers as structure (G1/G2 [R]) | FORBIDDEN_KEYS in schema | `new:rule` (rejected by design) |
| Running heads / folios (G2, 11 B records [R]) | no per-slide auto-text primitive | `new:running-head` (possible future) |
| True margin/sidenotes (G3 [Ri]) | only 5 roles; no margin geometry | `new:margin-note-role` |
| Photo/type integration (G1 [Ri: A-004]; G5 [Ri: C-217]) | images forbidden entirely | none (will not pursue) |
| Kinetic/motion type (G5 kinetic-motion 7 [R]) | static PPTX export | none (will not pursue) |
| Distressed/texture type (G5 [Ri: C-217]) | texture needs imagery/effects | none (will not pursue) |

## 6. Gaps and limitations (honest)

- 447 of 500 target references recovered (B −30, E −23); the missing 53 are
  left missing, not fabricated.
- Only 235 of 447 are visually inspected (C: 12/100, D: 42/100 — mostly
  bot-protection/JS-gating per agent notes); G5/G4 claims carry explicit
  [Ri]/[Rs] splits and search-checked records anchor no candidate.
- E's 9 inaccessible records are citation-only by the agent's own note and
  anchor nothing; E verification hedges ("not pixel-inspected") are preserved
  in the sidecar and gallery.
- `originality_notes` is `unknown` on all 447 records (never recorded
  upstream); novelty-vs-grammar judgments above are synthesis readings, not
  agent claims.
- S1's `verbatim-role` need is 27/100 in D but only 8/27 inspected — the
  promotion decision needs either human review of the previews or targeted
  re-inspection of the 19 search-checked monospace records.
- No schema category fits experimental or East Asian typography (149 `other`
  in the merged registry); the gallery exposes original agent categories +
  agent filter so G5/G7 stay browsable.
