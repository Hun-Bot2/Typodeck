# ADR-0021: Typed spatial and semantic relationships (scoped)

Status: Proposed (Stage 2, 2026-11-02). Requires Stage 3 implementation and
Stage 4 measurement before acceptance.

## Context

No element carries explicit relationships (`research/architecture-audit/
01-slide-ir-audit.md` §2). Blocks have no ids and no link fields
(`packages/core/src/schema.ts:82-85`); order = array order (implicit sequence
only). What exists is implicit or recovered:

- Support = positional convention: support text appended as body after title
  (`packages/core/src/narrative.ts:179-195,197-215`). Downstream cannot
  distinguish support-body from claim-body.
- Evidence linkage = fuzzy text match (`linksBlockToClaim`,
  `packages/core/src/slide-ir.ts:59-71`); blocks/claims < 20 chars never link.
- Citation detection = caption text re-parse (`captionHasRef` regex,
  `packages/core/src/composition.ts:715-717`; `CAPTION_STATUS_TAGS`,
  `packages/core/src/semantics.ts:77-80`).
- Slide `type` = classifier output (`classifySlide`,
  `packages/core/src/composition.ts:720-790`), not planner intent; foreign
  id-stems fall back to shape inference (`:782-789`).

## Research evidence (all Verified in `research/paper-survey/`)

- LecSlides/SlideParser (`05-lecslides-slideparser.md`): relation modeling
  R-1 +5.9 / METEOR +4.4 (Table 5); spatial removal −3.9 vs semantic
  removal −0.8 (Table 7) — layout dominates. RAL hard mask (−∞) is
  understanding-only. Relations shipped are untyped binary.
- SlideCoder (`03-slidecoder.md`): versioned operation specs (OF-KB) prevent
  version-skew errors — precedent for versioned relation semantics.
- PPTAgent (`04-pptagent-ppteval.md`): schema extraction ablation (success
  95.0% → 78.8% without it) — structured roles matter causally.

## Interpretation (ours, not the papers')

Ship a minimal typed pair first: stable block identity + a small relation
vocabulary (group association, label-value, evidence/support). Defer the full
8-type set (sequence, comparison, containment, citation pointers) until the
minimal pair is measured. Planner/Skill-authored relations carry provenance;
classifier-derived ones are marked as such and stay fallback.

## Assumptions

- Block identity must be solved first (stable ids preferred; index-based
  only with documented fragility).
- Hard masks are forbidden in generation: use soft constraints/penalties so
  layout search is guided, never fenced.
- Untyped-binary relations (LecSlides raw output) are an input signal, not
  the stored representation.

## Alternatives considered

1. Keep implicit conventions — rejected: untestable; support vs claim
   bodies indistinguishable downstream.
2. Full relation graph now — rejected: scope; even the source paper ships
   untyped binary relations.
3. Minimal pair (group-id + relation-type) — chosen direction.

## Existing code that could satisfy the requirement

Keep as fallback, mark provenance: `linksBlockToClaim` fuzzy matcher,
`captionHasRef` regex, `DIM_TO_TYPE` stem map. None is replaced until typed
relations cover their cases with tests.

## Compatibility implications

- Same optional-field strategy as ADR-0020 (no version bump; explicit
  validation + unknown-field policy tests — `schema.test.ts:32-34` rejects
  unknown roles today and needs a fields policy).
- Legacy bit-identical gate: no new planner output on the legacy path.
- `layoutSeed` re-seeding caveat applies (see ADR-0020).

## Acceptance criteria

- A relation-consistency critic check exists (e.g. related-but-visually-
  isolated elements flagged with element ids + evidence).
- Grouping Consistency metric defined and reported in Stage 4.
- Fuzzy-matcher fallback preserved and marked; no legacy breakage.

## Decision

Proposed (scoped to the minimal pair; full vocabulary deferred).
