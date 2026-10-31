# Experimental Implementation Notes — `document` system + candidates

Date: 2026-10-30. Renderer: current TypeScript engine only (`packages/core/src/*`).
No Rust rewrite, no new PPTX constructs, no schema roles added.

Synthesis input: `research/candidate_visual_systems.md` (S1–S5, G1–G6) over
`research/merged_registry.jsonl` (370 records, all stubs: composition withheld
as unknown). Evidence levels below reuse the synthesis legend ([L1] repo-read,
[L2] fetched, [L3] agent-attested, [L4] inference).

## 1. What was implemented

One experimental visual system + six experimental composition candidates:

| # | Candidate | Synthesis source | Status |
|---|---|---|---|
| X1 | `document` system (`hierarchy-stack`) | S1 conditional candidate, G4 grammar | experimental, `0.1.0`, renderable |
| X2 | `manual-opening` | S1 (opening) | experimental, document-only |
| X3 | `series-opening` | S2 fold (series-coding via kicker text, not bands) | experimental, document-only |
| X4 | `manual-section` | S1 (thesis/process) | experimental, document-only |
| X5 | `manual-reference` | S1 + G3 collation (evidence/comparison) | experimental, document-only |
| X6 | `margin-evidence` | S3 fold (tight measure + adjacent source) | experimental, document-only |
| X7 | `manual-metric` | S1 (metric) | experimental, document-only |

All six candidates are document-only (`systems: ['document']`), so production
selection pools for editorial/swiss/expressive are unchanged (verified, §5).
S2/S3 were prototyped as document candidates rather than widening production
pools; promotion path is to widen `systems` arrays after human review.

S4 (deconstructed) and S5 (specimen) were NOT implemented, per the synthesis
verdicts (infeasible under typography-only / out of scope).

## 2. Candidate → source references → engine capabilities

Record ids are merged-registry ids. Statuses are the merged honest values:
`secondary-description` = stub (no inspected visuals); `inspected-reproduction`
= agent-attested web-surrogate inspection (original analysis not visible here).

### X1 — `document` system (S1, G4 technical-manual)

Source grammar: strict type scales, deep section hierarchy, reference density,
four doc needs → four forms (Diátaxis), Butterick measure/leading bands [L2/L3].

| Record | Source URL | Status |
|---|---|---|
| D-356 | https://practicaltypography.com/summary-of-key-rules.html | secondary-description ([L2] key rules fetched at synthesis) |
| D-301 | https://practicaltypography.com/ | secondary-description |
| D-307 | https://diataxis.fr/ | secondary-description ([L2] quadrants fetched at synthesis) |
| D-308 | https://www.edwardtufte.com/book/envisioning-information/ | secondary-description [L3] |
| D-304 | https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview | secondary-description [L3] |
| D-315 | https://design-system.service.gov.uk/styles/type-scale/ | secondary-description [L3] |

Engine capabilities used (all in `ENGINE_CAPABILITIES`, [L1]):
`native-text`, `solid-background`, `left-align`, `right-align` (caption source
line), `tracking`, `leading`, `weight-contrast`, `scale-contrast`,
`multi-column` (fixed meta + content zones), `measure-cap`, `rhythm-scale`.
Geometry: `planDocument` in `layout.ts` — 2.0in meta column for kicker/number
section markers, wide content zone for title/body stacks, caption bottom-right.
Single pass over narrative blocks, so emission order matches content order
(required by the renderer-independence test).

Capabilities required but NOT implemented: `new:verbatim-role` (monospace
treatment; code/specs render in the body face), `new:section-marker` as a role
(approximated by section-number kicker text convention, e.g. `01 · PROBLEM`).

### X2 — `manual-opening` (S1)

Same G4 sources as X1. Knobs: `rhythmScale 1.1`; primitives
typographic-grouping + textual-repetition + negative-space. No new capability.

### X3 — `series-opening` (S2 fold, G2 series-coding)

| Record | Source URL | Status |
|---|---|---|
| B-105 | https://www.penguin.co.uk/discover/articles/a-history-of-penguin-in-objects | inspected-reproduction ([L2] tri-band fetched at synthesis) |
| B-106 | https://peoplesgdarchive.org/item/17125/hand-painted-penguin-tri-band-cover-design-template | inspected-reproduction |

Deck-series identity via repeated kicker label (`FIELD MANUAL · 001` on first
and last slides of the preview narrative) + `rhythmScale 1.2`. Physical bands
would need `new:rule` / background bands — NOT implemented (rejected by design).

### X4 — `manual-section` (S1, G4)

Same G4 sources as X1. Knobs: `rhythmScale 0.9` (dense), `maxBodyCharsPerLine
70` (inside the Butterick 45–90 band [L2]), columns 2. No new capability.

### X5 — `manual-reference` (S1 + G3 evidence collation)

G4 sources as X1, plus G3 claim-adjacent-to-source lineage [L3/L4]:

| Record | Source URL | Status |
|---|---|---|
| D-317 | https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/ | secondary-description [L3] |

Knobs: `rhythmScale 0.9`, `maxBodyCharsPerLine 64`, columns 2; primitives
column-rhythm + textual-repetition + baseline-relations. No new capability.

### X6 — `margin-evidence` (S3 fold, G3)

Same G3 lineage as X5. Knobs: `maxBodyCharsPerLine 48` (tight measure evokes a
margin note) with the source caption adjacent (contiguity). True sidenotes need
`new:margin-note-role` — NOT implemented.

### X7 — `manual-metric` (S1, G4 data matter)

G4 sources as X1. Number-led figure in the meta column at section scale
(`scale-contrast`); same hero integrity gates as production metric candidates
(number role + caption ref required). No new capability.

## 3. Constraints preserved (typography-only, editable text)

- No schema change: 5 roles, `FORBIDDEN_KEYS` intact; no shapes/cards/borders/
  rules/arrows/icons/images/gradients/shadows in code or output.
- Exporter unchanged (`addText` + background fill only); structural validator
  unchanged. All preview PPTXs pass `validatePptx` with full editable-char
  expectation; all preview HTML contains every narrative string (parity check).
- Contrast: every block in every system meets WCAG AA 4.5:1 (suite-enforced;
  document ink `#16232E` / accent `#0F4CAA` / muted `#52606E` on `#F1F4F6`).
- Determinism: same narrative bytes + seed → byte-identical decks (suite-enforced).

## 4. Comparable previews (identical narrative, no finals selected)

Generator: `packages/core/scripts/preview-experimental.ts`
(`npm run previews:experimental`). Narrative: `EXPERIMENTAL_NARRATIVE`
(6 slides: opening/problem/metric/comparison/evidence/conclusion),
sha256 `eacc503739f5c1e16ae8ea74cd4aa9759985bb31ca3df0347d7d935c29846785`,
seed 7, composition-planned per system. Every system: 6 slides, 21 text boxes,
892 editable chars, validation OK, HTML parity OK.

| File | Content |
|---|---|
| `previews/pptx/typodeck-document.pptx` | experimental PPTX |
| `previews/pptx/typodeck-editorial.pptx` | production baseline PPTX |
| `previews/pptx/typodeck-swiss.pptx` | production baseline PPTX |
| `previews/pptx/typodeck-expressive.pptx` | production baseline PPTX |
| `previews/html/{document,editorial,swiss,expressive}.html` | rendered HTML (one stage per slide, candidate id per slide) |
| `previews/html/index.html` | preview index |
| `previews/manifest.json` | narrative hash, seed, per-system files/stats/candidates |

Document preview selections: `series-opening`, `problem-tension` (fallback —
no document problem candidate), `manual-metric`, `manual-reference`,
`margin-evidence`, `conclusion-restatement` (fallback). Four of six new
candidates are exercised; problem/conclusion fall back to cross-system
candidates by design (fallback chain documented in `composition.ts`).

No finals selected. Promotion requires: re-inspection of the G4 sources (all
currently stubs), human review of these previews, and a decision on
`verbatim-role` (schema addition) vs folding into `swiss`.

## 5. Verification

- `npm test`: 250/250 pass (includes extended layout/composition/registry/
  art-direction/decks-all/export coverage for `document`).
- Production invariance: new candidates are document-only; production pools,
  placements, and version pins verified unchanged over the sample narrative
  plus a 12-slide all-semantic-types narrative (throwaway `/tmp/check-invariance.js`).
- `npm run samples`: all 4 systems export validated PPTXs.
- Web build (`@typodeck/web`) passes; Web Studio picks up the 4th system via
  `planDecksAll` → `SYSTEM_IDS` with no web-code change.
- One pre-existing test expectation was updated with cause: `import-research`
  "never touches the production registry" asserted the registry holds ONLY
  production entries, contradicting the registry's designed
  production+experimental lifecycle (`listVisualSystems` default) and this
  task. The importer-purity assertion is intact; the status assertion now
  covers the 3 production entries.
