# ADR-0004: Evidence grounding and provenance

Status: Accepted. Evidence: `packages/core/src/evidence.ts`,
`packages/core/src/narrative.ts` (provenance), `tests/evidence.test.ts`,
`POST /api/evidence`.

## Context

Generated decks that invent numbers destroy trust; users need to see what
is proven, suggested, or fabricated-looking.

## Decision

Claims are graded `verified` (code) / `suggestion` (docs) / `ungrounded`
(idea). Numbers stay verbatim with references; ungrounded numbers are
labeled illustrative; number slides source verified claims first; every
artifact carries provider provenance.

## Consequences

Fallback decks are honest about weak grounding (warnings, not silence).
Idea mode can never produce `verified` claims — a documented limitation,
not a bug.
