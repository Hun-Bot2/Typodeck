# Slide Reconstruction Research

Branch: `research/slide-reconstruction`. Mission: prove Typodeck can
reproduce sophisticated real-world typography with native editable
elements, then generalize reusable composition principles.

Rule: the `research/` corpus siblings are READ-ONLY (see ADR-0010).
All new work lives under `research/slide-reconstruction/`.

## Contents

- `README.md` (this file) + `methodology.md` — how the study runs.
- `sources.json` — selected presentations with attribution, license,
  verification status (schema documented in methodology).
- `cases/<id>/` — per-slide benchmark cases (analysis, source capture
  only when redistribution is permitted, reconstruction, comparison).
- `analysis/` — cross-slide structural analyses.
- `comparisons/` — side-by-side + difference images.
- `findings.md` — fidelity results (successes AND failures).
- `grammar-candidates.md` — proposed reusable rules with
  generalization evidence.
- `implementation-gaps.md` — missing engine capabilities.
- `skill-assessment.md` — Skill integration + reference-repo comparison.
- `report.md` — final report (counts, verdicts, priorities, SHA).
- `tools/` — recon Tier A/B tool + generalization probe generator.
- Tier-A twins (`cases/*-tierA/`), probes (`cases/gen-*/`) alongside
  the 5 Tier-B benchmark cases.

## Phase 1 findings (existing project, read-only survey)

Implemented and reused (not duplicated):

- 447-reference corpus (`research/checkpoint-447:dd76f69`): posters,
  editorial, web-type, museum pieces. ~0 actual slide decks; no
  license metadata; 190 secondary-description + 22 not-inspected.
  The integrated copy in this branch is a stale 370-line version.
- Composition grammar (`composition.ts`): 13 primitives, ~35
  candidates, deterministic classifier + selection + validation.
- Visual systems (`visual-systems.ts` + `systems.ts`): 3 production
  + `document` experimental; honest capability inventory.
- Slide IR/Markdown v1, HTML renderer, native-text PPTX exporter,
  structural validators, critic (geometric proxies, no vision),
  visual-benchmark (structural gates + human decisions).
- Skill (`skills/typodeck/`): orchestrates Core, never hand-draws.

Fidelity ceiling (matters for reconstruction honesty):

- Candidates influence layout ONLY via rhythmScale, bodyAlignOverride,
  bodyMeasureCap; geometry itself is per-system hardcoded planners.
- Reconstruction therefore runs at two tiers: (A) planner-driven
  (Narrative → planCompositions → layoutDeck) tests what the engine
  selects automatically; (B) schema-direct (hand-placed TextBlocks
  through the same validators/exporter) tests the renderer ceiling.
  Both ship only on `validation: OK`. Tier-A gaps become grammar
  candidates; Tier-B gaps become implementation gaps.
