# ADR-0009: Zero-config distribution via fallback provider

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/provider.ts`
(`MetaMuseProvider` env-gating, `DeterministicFallback`),
`packages/core/tests/provider.test.ts` (key never logged),
`docs/MUSE_PROVIDER.md` (endpoint investigation),
`generated_by=fallback` labels in CLI receipts and deck metadata.

## Context

The product must work seconds after `npm ci` with no keys, no
network, and no account — while supporting an optional model provider
without leaking credentials, and without ever presenting template
output as model inference.

## Decision

Without **both** `TYPOdeck_MUSE_ENDPOINT` and `TYPOdeck_MUSE_API_KEY`,
everything runs on the deterministic fallback, and every artifact
says so (`generated_by=fallback` in receipts, metadata, and Studio
badges). The key travels env-only as a Bearer [REDACTED] excluded from
logs, metadata, and errors (tested). No endpoint URL is pinned or
claimed as working: the provider investigation
(`docs/MUSE_PROVIDER.md`) found official docs and third-party reports
of an OpenAI-compatible surface but verified no live call, so the
provider is user-configured or absent.

## Consequences

Cold-start usability (`npm ci` → deck in one command, offline-capable
via idea mode) with honest capability labeling. The cost: until a
live endpoint is verified with a real key, all quality claims cover
the fallback's grounding mechanics, never model-backed prose —
and "AI-powered" language stays on the never-claim list
(`docs/LANDING_COPY.md`).
