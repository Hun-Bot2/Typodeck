# Skill integration assessment (Phase 8)

## How Typodeck exposes design choices today

Read in this worktree: `skills/typodeck/SKILL.md`, `composition.md`,
`density.md`, `visual-systems.md`, `revision.md` (+ ADRs 0002/0006/0007/0008/0010
in Phase 1). Selection is engine-side: `selectComposition(ctx)` scores
same-type, same-system candidates by density/language/surroundings; each
candidate lists `exceptions` (when NOT to use); failures record `fallback`
rationale. The Skill holds policy (density modes, readable floors, revision
loop: evaluate → reselect → regenerate, bounded). Engine implements geometry;
Skill instructs selection. That split is correct and this assessment preserves it.

## Reference: zarazhangrui/frontend-slides (MIT-licensed repo, inspected 2026-10-31 via raw files; architectural inspiration only, nothing copied)

- `bold-template-pack/selection-index.json` (34 templates): slug, mood, tone,
formality, density, scheme, best_for, avoid_for, preview_md, design_md.
- Progressive disclosure enforced by policy: read index → shortlist from
metadata → read only shortlisted preview.md → read exactly one design.md after
user picks. Never bulk-read.
- Fixed 1920×1080 stage, no reflow (parallels Typodeck's fixed 13.33×7.5in canvas).
- Render verification required: "Verify rendered output for both text overflow
and panel overlap. A card can pass scrollHeight checks while still being
covered" — independent corroboration of this study's Q1 (overflow-measure gate).

## What maps onto Typodeck, and where each piece lives

| New knowledge | Lives in | Not in |
|---|---|---|
| G1/G3 geometry (monumental numeral, grouped columns, responsive rules R1–R3) | Core: new composition candidates + planner paths | Skill (no geometry in prose) |
| Selection metadata (best_for/avoid_for/formality/density per candidate) | Core candidate records (extends existing `exceptions`) + compact candidate-index for agents | Full planner source |
| Density guidance for explainers (readable floors at G3 densities) | Skill `density.md` (+ IR `densityPolicy`) | Engine defaults |
| Overflow-measure gate (scrollHeight vs clientHeight per block) | Critic/benchmark tooling | Schema (render-time, not schema-time) |
| Substitution conventions (★/© glyphs, pattern→solid, logo→caption) | Skill reference doc (new short page) + per-candidate notes | Engine (content call, not geometry) |
| G2/G4 | Stay candidates; G2 needs probes, G4 needs cap review | Registry, until then |

## Concrete recommendation (no engine edits in this branch)

1. Add a compact `candidate-index` (JSON or md table: id, semantic types,
formality, density, best_for, avoid_for) generated from candidate records —
the direct analogue of selection-index.json, fitted to Typodeck's
type+system scoring instead of mood boards. Lets agents shortlist without
reading every planner.
2. Extend candidate records with `best_for` prose + `formality`/`density` tags
(`exceptions` already covers `avoid_for`).
3. Add critic rule OVERFLOW-VISIBLE (Q1): headless render-measure on preview
HTML; fail/warn when any block's scrollHeight exceeds clientHeight. Both this
study (3 silent clips) and frontend-slides' own policy demand it.
4. Skill doc updates only: density floors for explainer columns; substitution
conventions page; composition.md pointer to G1/G3 once implemented.

## What NOT to adopt

Template-pack HTML/CSS, decorative vocabulary, animation patterns, mood-first
browsing — frontend-slides optimizes for distinctive one-off web decks;
Typodeck's contract is typography-only, PPTX-native, validator-enforced
reusability. Adopt the selection architecture (index → shortlist → detail) and
the verify-by-rendering discipline, not the aesthetics.
