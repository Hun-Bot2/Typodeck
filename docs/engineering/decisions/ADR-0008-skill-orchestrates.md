# ADR-0008: Agent Skill orchestrates Core, never hand-draws

Status: Accepted. Evidence: `skills/typodeck/SKILL.md`
("never lay out slides yourself, never emit PPTX XML, never invent
numbers"), `skills/typodeck/EXAMPLES.sh` (exit 0 transcript).

## Context

Agents asked for decks tend to hand-craft slides, bypassing validation
and inventing content.

## Decision

The skill is CLI/API-first: build once, run `deck`/`eval`, read the
receipt, ship only on `validation: OK`. Supporting guides
(composition, optical, revision, evaluation, purposes, density,
visual-systems, research-index) are read on demand.

## Consequences

Agent-produced decks inherit all engine guarantees. The skill ships as a
portable project directory (checkout-and-point); no marketplace listing
exists or is claimed.
