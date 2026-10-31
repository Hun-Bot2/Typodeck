# ADR-0005: Evidence grounding and provenance

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/evidence.ts` (`ClaimKind`,
`NUMBER_RE`, caps 24/file + 60 total), `packages/core/src/semantics.ts`
(lifecycle statuses), `packages/core/src/narrative.ts:113`
(`captionFor`), `POST /api/evidence`, PPTX core properties
(`source: owner/repo@sha`, `docs/GITHUB_JOURNEY.md`).

## Context

Generated decks that invent numbers destroy trust. Users need to see
at a glance what is proven, what is suggested, and what is
illustrative — on the slide, not in a hidden log.

## Decision

Claims are graded `verified` (code-confirmed) / `suggestion`
(README/docs, upgraded only on code confirmation of a distinctive
term) / `ungrounded` (idea text). Extraction is deliberately
model-free deterministic code, so grounding can never be a stochastic
accident. Numbers are copied verbatim with refs
(boundary-safe regex; versions/years/hashes never heroes); number
slides require refs; ungrounded text is printed on-slide as
`unverified`/`illustrative`/`proposal`. Every artifact carries
provenance: provider labels, per-claim refs, and repo SHA through to
PPTX core properties.

## Consequences

Fallback decks are honest about weak grounding (warnings, not
silence); idea mode measured 0 fabricated refs over its eval runs.
The cost: no LLM paraphrase in the default path (opt-in `rephraseClaims`
drops phrasings that alter numbers), and multi-metric claims surface
one hero.
