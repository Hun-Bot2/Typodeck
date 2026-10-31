# ADR-0003: Purpose-aware narrative architecture

Status: Accepted. Evidence: `packages/core/src/purposes.ts` (P01–P10,
versioned), `make-deck.ts --preset`, `skills/typodeck/purposes.md`,
`POST /api/generate` `purpose` field.

## Context

One narrative arc fits all decks poorly; hackathons, showcases, and
competitions need different arcs, but arcs must stay deterministic.

## Decision

Narrative planning takes versioned purpose presets (P01–P10) plus frozen
legacy arcs (`hackathon`, `competition`, `showcase` — `showcase` is not
P04). Presets select arcs; they never invent content.

## Consequences

Reproducible per-purpose decks; preset additions are additive and
reviewable. Legacy arcs are frozen to preserve historical outputs.
