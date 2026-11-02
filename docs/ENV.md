# Typodeck — Environment Variables

Source of truth for every environment variable the app reads. The app runs
with **zero** variables set: the deterministic fallback builds decks offline
and labels them `generated_by=fallback`. Set variables only to enable the
live model provider or authenticated GitHub access.

Copy `.env.example` to `.env` (gitignored) for local development. Never
commit real values: `.env` and `.env*.local` are gitignored, and CI needs no
secrets at all.

## Variables

| Variable | Required | Default | Read by | Purpose |
|---|---|---|---|---|
| `TYPOdeck_MUSE_ENDPOINT` | Only with API key | _(unset → fallback)_ | `packages/core/src/provider.ts` via `resolveProvider()` | Base URL of the user-configured Meta Muse chat-completions endpoint. See `docs/MUSE_PROVIDER.md`. Never verified live; every run to date uses the fallback. |
| `TYPOdeck_MUSE_API_KEY` | Only with endpoint | _(unset → fallback)_ | `packages/core/src/provider.ts` | API key sent as bearer auth to the Muse endpoint. The live provider activates **only when both** endpoint and key are non-empty. |
| `TYPOdeck_MUSE_MODEL` | No | provider-defined | `packages/core/src/provider.ts` | Optional model override for the Muse provider. Ignored unless the live provider is active. |
| `GITHUB_TOKEN` | No | _(unset → unauthenticated)_ | `apps/web/lib/github-cache.ts` via `githubToken()` | GitHub personal access token (classic or fine-grained, public-repo read is enough) for repo ingestion. Without it, ingestion runs unauthenticated at 60 req/hour/IP. Also accepted as `GH_TOKEN` (same reader, `GITHUB_TOKEN` wins). |
| `PORT` | No | `3000` | `next start` / `Dockerfile` CMD | Port the production server listens on. Container hosts inject their own `PORT`; the image honors it. |
| `NODE_ENV` | No | `development` (`production` in image) | Next.js / Dockerfile | Set to `production` by the Docker image and by `next build`/`next start`. |

No `NEXT_PUBLIC_*` variables exist. That is deliberate: every secret above is
read **server-side only** (`route.ts` handlers and `@typodeck/core`, which the
client never imports for secrets) and is never sent to the browser, never
logged, and never echoed in error responses. Keep it that way: any new
`NEXT_PUBLIC_` variable is shipped to every visitor in plain JavaScript.

## Secrets handling

- **Local:** put values in `.env` (gitignored). Confirm with
  `git status --short` that `.env` never appears before committing.
- **Hosting:** enter secrets in the platform's environment/secret UI
  (Vercel Environment Variables, Render Secret Files/Environment, Railway
  Variables, Fly `fly secrets set`), never in the repo, Dockerfile, or CI
  workflow. All values in this repo's hosting config are non-secret
  (`NODE_ENV`, `PORT`).
- **CI:** the workflow (`.github/workflows/ci.yml`) sets no secrets and needs
  none — tests and builds run fully offline against the fallback provider.
- **Logs:** `GITHUB_TOKEN`/`TYPOdeck_MUSE_API_KEY` must never be printed.
  Today's code paths don't log them; preserve that invariant in reviews.
- **Rotation:** both credentials are single strings with no stored state —
  rotate by replacing the platform secret and redeploying/restarting. No
  migration step exists.

## Verifying your configuration

```sh
# 1. Fallback (no env): works offline, provenance.provider == "fallback"
curl -s -X POST http://localhost:3000/api/evidence \
  -H 'content-type: application/json' \
  -d '{"mode":"idea","input":"<100+ chars>"}' | head -c 200

# 2. GitHub auth (optional): higher rate limits for repo mode
GITHUB_TOKEN=<token> npm run dev --workspace @typodeck/web
```

If `TYPOdeck_MUSE_ENDPOINT`/`TYPOdeck_MUSE_API_KEY` are ever set in
production, verify with one `/api/generate` call that
`provenance.provider` reports the live provider id instead of `fallback`.
