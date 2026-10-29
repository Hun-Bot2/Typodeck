# Typodeck — Meta Muse Provider Investigation (Phase 2)

## What was checked (2026-10-30)

1. Web search for a public, callable Meta Muse API endpoint and documentation.
2. Fetched `https://dev.meta.ai/docs/cookbook/quickstart-chat-completions`
   (HTTP 200): Meta publishes "Meta Model API" docs covering chat completions,
   models, authentication, pricing/rate limits, and SDKs.
3. Third-party reports (community projects, blogs — unverified by us) describe
   an OpenAI-compatible chat-completions surface at `https://api.meta.ai/v1`
   serving `muse-spark-*` models with API-key or OAuth credentials.

## Verdict

A public Meta API surface **appears to exist** (official docs site responds;
third parties report an OpenAI-compatible base URL), but Typodeck **could not
verify a live callable endpoint**: no API key was available and no test call
was made. No endpoint URL is pinned or claimed as working.

## Consequences for the code

- `MetaMuseProvider` (`packages/core/src/provider.ts`) sends an
  OpenAI-compatible chat-completions POST to a **user-configured** endpoint.
  It is active ONLY when BOTH `TYPOdeck_MUSE_ENDPOINT` and
  `TYPOdeck_MUSE_API_KEY` are set; otherwise `resolveProvider()` returns the
  deterministic fallback.
- `DeterministicFallback` output is template-generated and always labeled
  `generated_by=fallback` in metadata. It is never presented as model
  inference — the CLI and pipeline warnings say so explicitly.
- Until a live call is verified with a real key, every demo/CLI run in this
  repo uses the fallback, and reports must label it as such.
