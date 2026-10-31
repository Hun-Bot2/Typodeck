# ADR-0007: Versioned visual-system registry

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/visual-systems.ts` (statuses + entries),
`packages/core/src/systems.ts` (shipped typography),
`packages/core/src/research-import.ts` (experimental-only import),
`GET /api/catalog`, `packages/core/tests/registry.test.ts`.

## Context

New visual systems arrive from research, but production decks must
never shift under a pinned name, and experimental grammars must never
leak into production renders by accident.

## Decision

Systems live in a versioned registry with lifecycle statuses
`production` | `experimental` | `deprecated`
(`visual-systems.ts:14`). Baseline: editorial / swiss / expressive at
1.0.0 production with unchanged geometry; document experimental. The
research importer emits experimental-only candidate specs — no
registry write, no promotion path. Requesting an unknown or
unrenderable system fails loudly; there is no silent fallback to a
different system. Geometry ships in `systems.ts`; the registry
carries identity, philosophy, hierarchy, and typeface roles.

## Consequences

Research can land candidates without touching production output, and
stored decks reproduce exactly via pinned versions. The cost: adding
a production system requires an explicit versioned entry plus
typography in `systems.ts` — there is no per-deck invented theme.
