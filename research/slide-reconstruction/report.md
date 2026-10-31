# Slide Reconstruction — Final Report (pilot)

Branch: `research/slide-reconstruction`. Evidence commit: `5452aa6`
(this report committed separately on top, per Phase 10 separation rule).

## 1. Sources examined: 9 (`sources.json`)

Selected 2 (Gapminder TQ set, CC-BY 4.0; Whose Knowledge? Wikidatacon 2021,
CC BY-SA 4.0). Link-only 1 (FOSDEM 2017 opendesign, license UNVERIFIED —
paraphrase only, no stored pixels). Rejected 6 (447-corpus has 0 slide decks;
Lessig 2002 .ppt unrenderable; UBC/stat221 default templates; WMF keynotes
photo-led; OSP2014 A4 report).

## 2. Slides reconstructed: 5 benchmark + 2 Tier-A twins + 8 probes

Tier B (hand-placed, renderer ceiling): gapminder-tq2-p1, wk-p1, fosdem-p4,
fosdem-p14, gapminder-tle-p5. Tier A (engine unassisted): tq2 + wk twins.
Generalization probes (fixed geometry, swapped content): 4× G1, 4× G3.

## 3. Verdicts

- Tier B: 4 PASS (tq2, wk, fosdem-p4, tle-p5), 1 PARTIAL (fosdem-p14: 400pt cap
+ weight mismatch). All validation OK + export OK.
- Tier A: 2 STRUCTURE-OK/DRAMA-ABSENT (correct roles, `opening-statement`;
no monumental scale, orphans, default palettes).
- Probes: 5 PASS, 2 PARTIAL (g3-long body1 clip; g1-metric "98%"→"9"),
1 FAIL (g1-long title wrap clip + "12"→"1"). All 15 cases validate OK —
the 3 probe failures are silent `overflow: hidden` clips, which is itself
the top finding (gap #1).

## 4. Visual fidelity findings (`findings.md`, `comparisons/`)

Licensed SBS ×3 + diff ×1 (wk-p1, native 16:9 both sides); recon-only ×2
(link-only policy). Sampled palette (PIL region-dominant), cap-height-derived
sizes (EST), byte-identical PPTX text parity 7/7 (box counts match). PPTX
*rendering* unverified (no Office automation) — stated, not hidden.
Substitutions documented with costs: pattern→solid, logo→caption,
serif-italic→sans, ornament→★/© glyphs, 4:3→16:9 right-field extension.

## 5. Missing rendering capabilities (`implementation-gaps.md`, 10 items)

Silent overflow, numeral-box sizing, title wrap rule, 400pt cap, no
italic/per-block serif, no rules (sanctioned: gap-as-separator), no condensed
grotesque, Tier-A repertoire, PPTX rendering unverified, FOSDEM license.

## 6. Proposed Composition Grammars (`grammar-candidates.md`)

G1 MONUMENTAL-NUMERAL-COVER (conditional: needs R1 digit-width + R2 wrap rule);
G2 CENTERED-KEYNOTE-STACK (untested, probes deferred); G3
STARRED-EXPLAINER-COLUMNS (conditional: needs R3 reflow rule; KO + FAQ
purpose-swap passed); G4 MONUMENTAL-GLYPH (blocked by 400pt cap).
Cross-cutting: Q1 overflow-must-be-visible, Q2 script-aware wrap rules,
Q3 substitutions-are-part-of-the-grammar.

## 7. Proposed changes to the design registry

New candidates G1/G3 (+planner paths, incl. responsive rules R1–R3); extend
candidate records with `best_for` prose + `formality`/`density` tags
(`exceptions` already covers `avoid_for`); generate a compact
`candidate-index` for agent shortlisting. None implemented in this branch
(research isolation respected).

## 8. Recommended changes to the Agent Skill (`skill-assessment.md`)

Critic rule OVERFLOW-VISIBLE (headless scrollHeight vs clientHeight gate —
corroborated by frontend-slides' own render-verification policy); density
floors for explainer columns; substitution-conventions reference page;
composition.md pointers to G1/G3 after implementation. Geometry stays in the
engine; the Skill only instructs selection.

## 9. Evidence-backed implementation priorities

1. Overflow-measure gate (catches all 3 observed silent failures; tooling-only).
2. Numeral-box width rule (2 observed clips). 3. Title wrap/orphan rule
(2 observed). 4. G1/G3 candidates + planner paths. 5. 400pt cap review.
6. Office/LibreOffice PPTX render step for benchmark tooling.

## 10. Reproduction

Worktree: `.muse/worktrees/slide-recon`, branch
`research/slide-reconstruction`, evidence `5452aa6`. Rebuild: `npx tsc -p
research/slide-reconstruction/tools/tsconfig.json`; run any case: `node
research/slide-reconstruction/tools/dist/.../recon.js
research/slide-reconstruction/cases/<id>`; screenshot `recon.html` at
1280×720. Probes regenerate via `tools/gen-probe.py`.
