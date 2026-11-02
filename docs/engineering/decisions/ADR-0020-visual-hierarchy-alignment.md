# ADR-0020: Visual Hierarchy Alignment (intended importance vs perceived prominence)

Status: Proposed (Stage 2, 2026-11-02). Requires Stage 3 implementation and
Stage 4 measurement before acceptance.

## Context

The critic sees geometry but not intent. Three different mechanisms share the
name "emphasis" and none is per-block content importance (`research/
architecture-audit/01-slide-ir-audit.md` §1):

- `SlideIRSlide.emphasis?: string` (`packages/core/src/slide-ir.ts:36-37`):
  free-text renderer hint, slide-level only, never executed.
- `PlanNarrativeOptions.emphasis?: Dimension[]`
  (`packages/core/src/narrative.ts:61`): planner input, never persisted.
- `ArtDirectionSlide.emphasis: 'hero' | 'statement' | 'support'`
  (`packages/core/src/art-direction.ts:22,48-54`): derived post-hoc, advisory.

`slideIRToNarrative` drops `type`/`refs`/`statuses`/`emphasis`/`preset`/
`densityPolicy` (`packages/core/src/slide-ir.ts:129-141`), pinned by test
(`packages/core/tests/slide-ir.test.ts:61-72`). The main pipeline bypasses IR
entirely: `planDeck` = ingestion → evidence → narrative → layout
(`packages/core/src/narrative.ts:903-931`); IR metadata never reaches layout
(`packages/core/src/layout.ts:880-881` re-validates Narrative only).
`NarrativeBlock` is exactly `{role, content}` with no importance field
(`packages/core/src/schema.ts:82-85`).

## Research evidence (all Verified in `research/paper-survey/`)

- UMSI (`02-umsi-visual-importance.md`): element importance as the average
  predicted importance inside the element mask/extent (§6.1–6.2); relative
  importance preservation = designer intent (§6.2); 87% target-increase
  success (90 variants, mean CC 0.928). PPT slides NOT in training
  distribution (full-text grep: zero slide mentions) — transfer unverified.
- PPTBench 2025 (`01-pptbench-2025.md`): semantic understanding vs
  visual-layout reasoning gap; modality split (JSON aids
  Detection/Modification, vision aids Understanding).
- PPTAgent/PPTEval (`04-pptagent-ppteval.md`): Content/Design/Coherence split;
  intended-vs-perceived hierarchy is a proposed 4th dimension (Typodeck-new,
  not in the paper). Human agreement Pearson 0.71 / Fleiss κ 0.59 as target
  line. Same-model judge and execution-only self-correction as counter-
  examples (see ADR-0023).
- LecSlides (`05-lecslides-slideparser.md`): global (summary) + detail (QA)
  dual evaluation as the shape for global-vs-detail hierarchy checks.

## Interpretation (ours, not the papers')

Represent intended message importance (IR/planner side: typed, optional,
per-block) separately from measured or predicted visual prominence
(critic side: deterministic geometry now, perception model later). Never
collapse semantic importance, attention, reading order, comprehension, and
design quality into one unvalidated score.

## Assumptions

- Per-block optional fields; absence = unknown, never a default rank.
- Slide IR stays the versioned content contract; new fields are optional.
- Perception-side prediction (UMSI-class model) is hypothetical until a
  slide-transfer check passes; deterministic prominence proxies ship first.

## Alternatives considered

1. Status quo free-text `emphasis` — rejected: untyped, dropped at the IR
   boundary, untestable.
2. Full 8-relation model now (primary/secondary, label-value, evidence,
   sequence, comparison, grouping, containment, citation) — rejected as one
   step: LecSlides itself ships untyped binary relations. Emphasis first
   (this ADR); relations next (ADR-0021).
3. IR version bump 1.0.0 → 1.1.0 with migration harness — deferred: there is
   zero migration machinery (`SLIDE_IR_VERSION` exact-match gate,
   `slide-ir.ts:151`; no `migrate*` anywhere). Optional-and-ignored fields
   need no bump (validators ignore unknown keys today).

## Existing code that could satisfy the requirement

None fully. Closest: `art-direction.ts` post-hoc derivation (advisory only),
`PlanNarrativeOptions.emphasis` (input only), `parsePurpose`
(`packages/core/src/semantics.ts:594`, intent source the planner never
scores — audit 02).

## Compatibility implications

- Optional fields: old payloads read fine; old writers omit them.
- `layoutSeed` hashes full narrative JSON (`layout.ts:872-874`): a new
  Narrative field re-seeds every deck — deterministic but snapshot-breaking.
  Regenerate snapshots deliberately.
- Bit-identical legacy gate (`purposes.test.ts:108-112` +
  `legacy-narrative-baselines.json`): the planner MUST NOT emit new fields on
  the legacy path. Scope to preset path or user-driven input.
- Markdown vocabulary decision required: Markdown-visible (like `emphasis`)
  vs IR-only (like `densityPolicy`, currently lossy — audit 01 §1 gap).
  Strict parser rejects unknown keys (`slide-markdown.ts:97-153`).

## Acceptance criteria

- Schema + validation + tests in `schema/slide-ir/slide-markdown/narrative/
  pipeline` suites; unknown-field policy tests added.
- Round-trip preservation test (inverse of the current drop test).
- Zero legacy-baseline changes.
- At least one critic check consumes intent (e.g. primary-subordinate
  inversion finding).
- Stage 4 reports Hierarchy Agreement (rank correlation) and Primary
  Emphasis Accuracy against human ground truth before any superiority claim.

## Decision

Proposed.
