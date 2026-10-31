# ADR-0005: Bounded unauthenticated GitHub fetch

Status: Accepted. Evidence: `packages/core/src/ingestion.ts` (bounds,
`degraded` flag, typed `rate-limited`), `tests/ingestion.test.ts`.

## Context

Repo mode needs real content without unbounded crawl cost, secret
handling, or silent partial results.

## Decision

Fetch is bounded (≤20 files / ≤200 KB / ≤5 code files / 30 s, README
first, public repos only) and unauthenticated. One retry on
`retry-after`; README-only degrade sets `degraded:true` plus a warning;
exhaustion raises typed `rate-limited` with `resetAt`. Nothing degrades
silently.

## Consequences

Predictable cost and no token plumbing, at the cost of quota ceilings
(60/hr unauthenticated) and no private-repo access.
