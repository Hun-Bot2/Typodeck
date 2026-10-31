# ADR-0006: Slide Markdown and versioned Slide IR

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/slide-markdown.ts`,
`packages/core/src/slide-ir.ts`, `packages/core/src/schema.ts`
(validation), `POST /api/markdown`, `packages/core/tests/slide-ir.test.ts`
+ `slide-markdown.test.ts`.

## Context

Users need to edit deck text without re-running generation, and the
planner (what to say) must stay separable from the renderer (how it
looks) so either can evolve without breaking the other.

## Decision

Slide Markdown v1 is the human-editable text format; Slide IR v1 is
the versioned machine interchange between narrative planning and
layout. The Studio's `/api/markdown` re-renders all systems from
edited Markdown server-side. Stored decks pin `{system,
systemVersion}`; a version bump means geometry may differ —
re-render, never silently substitute. Speaker notes flow
Markdown → IR → narrative → layout → native PPTX notes (an intentional
contract change, covered by a notes-part test); emphasis metadata is
still dropped at the IR boundary.

## Consequences

Edits are reviewable diffs over Markdown, and planner/renderer
changes stay decoupled behind a validated schema. The cost: every
edit round-trips through validation (invalid narratives fail loudly
as `invalid-narrative`), and the IR version must be bumped with
migration care, not silently extended.
