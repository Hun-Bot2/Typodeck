# ADR-0003: One shared engine for CLI, Studio, and Skill

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/index.ts` (shared exports),
`packages/core/src/narrative.ts` (`planDeck`, `planDecksAll`),
`packages/core/scripts/make-deck.ts` (CLI),
`apps/web/app/api/generate/route.ts` + `export/route.ts` (Studio),
`skills/typodeck/SKILL.md` §2 (Skill orchestrates Core).

## Context

Three surfaces need decks: a CLI for scripts/evals, a web Studio for
interactive use, and an agent Skill for agentic use. Three
implementations would triple grounding bugs and let outputs diverge
silently.

## Decision

All surfaces drive `packages/core`. The CLI wraps `planDeck` →
`exportToPptx` → `validatePptx`; the Studio's `/api/generate` calls
`planDecksAll` (one narrative, laid out per system) and `/api/export`
re-lays-out server-side from the posted narrative — client geometry
is never trusted; the Skill orchestrates the same CLI/API functions
and never lays out slides itself. Layout is a pure function
(`layout.ts:603`: no I/O, no wall-clock, no unseeded randomness),
seeded by content hash (`layoutSeed`, `layout.ts:597-598`).

## Consequences

One grounding implementation to test (270/270 core tests cover all
surfaces' mechanics); interface bugs stay cosmetic. The cost:
`apps/web` cannot build its API without core `dist/` (documented
troubleshooting step), and engine changes must keep all three
surfaces' contracts green.
