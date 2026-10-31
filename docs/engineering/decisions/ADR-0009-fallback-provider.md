# ADR-0009: Deterministic fallback provider by default

Status: Accepted. Evidence: `packages/core/src/provider.ts`
(`DeterministicFallback` unless endpoint+key), `.env.example`,
`docs/MUSE_PROVIDER.md`, `generated_by=fallback` labels in receipts.

## Context

The product must work with zero configuration while supporting an
optional model provider without leaking keys.

## Decision

Without **both** `TYPOdeck_MUSE_ENDPOINT` and `TYPOdeck_MUSE_API_KEY`,
everything runs on the deterministic fallback, and every artifact says
so. Keys travel env-only and are excluded from logs, meta, and errors
(tested in `provider.test.ts`).

## Consequences

Cold-start usability with honest capability labeling; model-backed
quality is untested in CI (no key in CI — and there is no CI yet).
