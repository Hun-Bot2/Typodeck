# ADR-0004: Two input modes, one product

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/ingestion.ts` (`fetchRepo`, `acceptIdea`,
bounds `MAX_FILES=20` / `MAX_TOTAL_BYTES=200KB` / `MAX_CODE_FILES=5` /
`DEFAULT_TIMEOUT_MS=30000`, `MIN/MAX_IDEA_CHARS=100/20000`),
`docs/PRD.md` §2, `docs/GITHUB_JOURNEY.md` (journey validation).

## Context

Users arrive with either a repository to present or an idea to pitch.
A repo-only tool fails offline and under quota; an idea-only tool
cannot ground anything. Both must produce the same artifact shape so
downstream stages stay mode-agnostic.

## Decision

Repository mode fetches a bounded sample (README/docs first, code
capped, default branch, typed errors for private/not-found/
rate-limited) and idea mode accepts 100–20,000 pasted characters.
Mode is auto-detected (URL → repo, text → idea). Both feed the same
evidence → narrative → layout → export → validation pipeline; they
differ only in claim provenance (`verified`/`suggestion` vs
`ungrounded`) and caption labeling. Quota exhaustion fails honestly
as typed `rate-limited` with a reset time, and the Studio offers idea
mode as the offline fallback.

## Consequences

The product works with zero configuration and zero network (idea
mode), while repo mode adds grounding when quota allows. The cost:
idea mode can never produce `verified` claims (documented
limitation), and the 20-file cap can fill with docs on large repos,
weakening grounding while captions stay honest.
