# Typodeck Skill — Remote GitHub Analysis (read on demand)

Source: `packages/core/src/ingestion.ts` (`fetchRepo`), CLI
`packages/core/scripts/make-deck.ts`, journey
`packages/core/scripts/journey.ts`.

## Bounds (enforced by Core, not advisory)

- ≤20 files, ≤200 KB total, ≤5 code files at ≤10 KB each
  (`MAX_FILES`, `MAX_TOTAL_BYTES`, `MAX_CODE_FILES`,
  `MAX_CODE_FILE_BYTES`).
- 30 s timeout, default branch only (`DEFAULT_TIMEOUT_MS`).
- Public repos only: private → typed `private-repo`, never fetched.
- Malformed `owner/repo` → CLI exit 2 (usage), no network call.

## Rate limits (quota-aware by contract)

- GitHub signals exhaustion with HTTP 403 (not 429). Core inspects
  `x-ratelimit-remaining` / `x-ratelimit-reset` / `retry-after` on
  every response and surfaces typed `rate-limited` with `resetAt` —
  never a bare `network` error.
- Exactly one retry, only when `retry-after` is present; otherwise
  fail fast so the caller can show the reset time.
- Before a live run, check quota without spending it:
  `scripts/check-quota.sh` (reads `api.github.com/rate_limit`).
  At zero, SKIP honestly — do not burn the last calls.
- Share one `createMemoryCache()` across repeated ingests to keep
  repeat work off the quota (200s only, TTL-bounded, default 120 s).

## Authentication (know where tokens work)

- `make-deck` CLI takes NO token flag: it always runs on the
  unauthenticated quota (~60 core requests/hour, shared per IP).
- Authenticated paths: the Studio server (`GITHUB_TOKEN`/`GH_TOKEN`
  env, `apps/web/lib/github-cache.ts`, never logged), programmatic
  `fetchRepo(..., { authToken })`, or
  `journey.js --repo o/r --token-env GITHUB_TOKEN`.
- Never log or paste a token. The skill announces the path it used
  ("CLI, unauthenticated" vs "token via …") in every delivery.

## Degrade paths (typed, never silent)

`rate-limited` → wait for `resetAt`, retry once, else README-only
degrade (`IngestedRepo.degraded`, warning recorded). `not-found` →
404/verify the name. `timeout`/`network` → report, no blind retry
storm. Every degrade lands in `provenance.warnings` and the evidence
report (`references/export.md`).

Executable example: `examples/03-remote-repo.sh`.
