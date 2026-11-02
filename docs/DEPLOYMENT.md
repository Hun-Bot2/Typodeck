# Typodeck — Deployment Guide

Hosting audit, deploy instructions, and release checklist for the Typodeck
Web Studio (`apps/web`, Next.js 16 + `@typodeck/core`). Scope: **prepare
hosting only — no public publishing** until the blockers in §7 are cleared.
Nothing is deployed anywhere yet (greenfield; no migration needed).

## 1. What the app actually needs

Derived from `apps/web` source, `next.config.ts`, and the five API routes —
not from assumptions.

- **Runtime:** single Node.js server (`runtime = 'nodejs'`, `next start`).
  `engines: node >= 20.9.0`; CI pins Node 22. Not edge-compatible, not
  statically exportable: `/`, `/landing` prerender static, but
  `/api/generate|evidence|export|markdown|catalog` are `force-dynamic`.
- **Long requests:** `maxDuration = 120` on generate/evidence/export; the
  generate handler self-aborts at 115 s. The host must allow **≥120 s**
  request timeouts. This rules out Vercel Hobby (60 s cap) — see §2.
- **Streaming:** `POST /api/generate` serves `text/event-stream` (SSE) when
  the client asks. The host/proxy must not buffer SSE frames.
- **Outbound HTTPS:** `api.github.com` (repo ingestion; unauthenticated
  60 req/hour/IP, higher with `GITHUB_TOKEN`) and, only if configured, the
  user-supplied `TYPOdeck_MUSE_ENDPOINT`. No other egress.
- **State:** none. No database, no disk writes, no cron, no websockets.
  The GitHub GET cache is in-process memory (2 min TTL, 50 entries);
  multi-instance deployments just share less cache — safe, only costs quota.
- **Secrets:** server-side only, all optional (see `docs/ENV.md`). No
  `NEXT_PUBLIC_*` variables exist.
- **Footprint:** one small Next server; PPTX export shells no external
  binaries (pure-JS `pptxgenjs`/`jszip`). Size before committing to the
  smallest tier (cold-start budget); no load test has been run yet.

## 2. Hosting options and recommendation

| Target | How | Cost (list, Oct 2026) | Fits? |
|---|---|---|---|
| **Container host (Render / Railway / Fly.io)** — **recommended** | Deploy the root `Dockerfile` (multi-stage, non-root, `HEALTHCHECK` on `/api/catalog`) | Render starter ~$7/mo (free tier sleeps); Railway from ~$5 credit/mo; Fly free allowances then usage | **Yes.** No function timeout (120 s fine), SSE passthrough, `PORT` honored, secrets via platform UI. |
| Vercel (Pro) | Native Next deploy, `npm run build` | Pro required: Hobby caps `maxDuration` at 60 s < 120 s. Pro ≈ $20/user/mo | Yes, with Pro. Zero-ops alternative if the team already pays for it. |
| Vercel (Hobby/free) | Same | $0 | **No.** Requests over 60 s are killed; generate/evidence/export declare 120 s. |
| Plain VPS (Hetzner/DigitalOcean/...) + Docker | `docker build` + `docker run -p 80:3000` behind Caddy/nginx | Cheapest long-run (~$4–6/mo) | Yes, with most ops burden (TLS, restarts, patching). |
| Static/edge-only hosts (Pages, S3+CDN, Workers) | — | — | **No.** API routes need a Node server. |

**Recommendation:** ship the public demo on a container host with the
provided `Dockerfile` (Render or Fly for free/low-cost start; Railway as
backup). It needs no code changes, imposes no timeout caps, and keeps the
door open to Vercel Pro later without re-architecting. **Do not migrate or
publish anything yet** — §7 blockers first.

You do **not** need `output: 'standalone'` in `next.config.ts` for this
plan: the image carries the pruned workspace `node_modules` instead (fewer
moving parts, and `next.config.ts` stays untouched). If image size ever
matters, adopting standalone output is a later optimization owned by whoever
owns app config — not needed for launch.

## 3. Deploy steps (when unblocked)

### Any container host (Render / Railway / Fly)

1. Point the service at the repo; it auto-detects the root `Dockerfile`.
2. Build command: (none — Docker). If the host asks for native Node
   instead: build `npm ci && npm run build`, start
   `npm run start -w @typodeck/web -- --port $PORT`.
3. Environment: `NODE_ENV=production` (image default); add `GITHUB_TOKEN`
   only if demo repo-ingestion needs the higher rate limit (see
   `docs/ENV.md`). Never commit these values.
4. Health check: `GET /api/catalog` → expect 200 + JSON (temporary probe
   until the app ships `GET /api/health` — §6.3).
5. Smoke test (§5), then wire the §6 mitigations (rate limiting!) before
   announcing the URL.

### Vercel Pro (alternative)

1. Import the repo; framework preset Next.js; root directory = repo root
   (build needs the `packages/core` workspace — do **not** set root to
   `apps/web`).
2. Build: `npm run build`; install: `npm ci`; Node 22.x.
3. Set `maxDuration` stays 120 (allowed on Pro); confirm Fluid/active-CPU
   billing expectations for 115 s generations.
4. Same env, health check, smoke test, and §6 mitigations as above.

## 4. Build verification (evidence, 2026-10-31)

Run from a clean checkout on branch `agent/f-hosting`, Node v26.8.1:

| Command | Result |
|---|---|
| `npm ci --no-audit --no-fund` | exit 0, 53 packages |
| `npm run build -w @typodeck/core` (`tsc -p`) | exit 0 |
| `npm test` (core build + `node --test`) | exit 0 — **270/270 pass**, 0 fail |
| `npx tsc --noEmit -p apps/web/tsconfig.json` | exit 0 |
| `npm run build -w @typodeck/web` (`next build`, Turbopack) | exit 0 — TypeScript clean; routes: `/`, `/landing`, `/icon.svg` static; all 5 `/api/*` dynamic |

Production runtime (`next start`, clean env, fallback provider):

| Probe | Result |
|---|---|
| `GET /api/catalog` | 200, 16 KB JSON (10 purposes + systems) |
| `GET /landing`, `GET /` | 200 (43 KB / 11 KB) |
| `POST /api/generate` (idea, SSE) | 200 — 7 `stage` events + 1 `result`; 4 decks |
| `POST /api/generate` → `POST /api/export` | 200 — valid 54 KB `.pptx` (zip) |
| `POST /api/markdown` | 200 — re-rendered 4 decks |
| Contract negatives | 413 on >64 KB body; 400 on bad JSON / bad system / short idea |

Dockerfile file-set simulation (no local Docker daemon, so the exact
runner-stage `COPY` set was replicated into a scratch dir, pruned with
`npm prune --omit=dev`, and booted): `next start` boots **without**
`typescript` installed (Next loads `next.config.ts` with its own toolchain),
catalog/generate/export all 200. Full `docker build` + `docker run` must
still be run once where a daemon exists before first deploy.

## 5. CI

`.github/workflows/ci.yml` runs on pushes to `main`/`agent/**`/`feat/**`/
`fix/**` and on PRs to `main`: `npm ci` → `npm test` (core build + tests) →
`tsc --noEmit` (web) → `next build` (web), on Node 22. It needs no secrets.
There is intentionally **no auto-deploy job**: publishing stays manual until
§7 is clear.

## 6. API security review (report only — no app code changed)

Reviewed: `apps/web/app/api/*/route.ts`, `apps/web/lib/github-cache.ts`,
provider/token readers. Ownership of fixes sits with app-code owners; Agent F
reports only.

**Strengths (verified by reading + probes):** strict input validation on
every route (mode/variant allowlists, preset-id check, claim-id regexes,
`durationMin` clamped, emphasis against dimension ids); body caps enforced
twice (64 KB generate/evidence, 512 KB export/markdown — 413 observed);
server-side layout recompute (client geometry never trusted); no
`NEXT_PUBLIC_` secrets; `GITHUB_TOKEN`/`TYPOdeck_MUSE_API_KEY` server-side
only, never logged or echoed; GitHub cache TTL-bounded and auth-mode
separated.

**Findings (by severity):**

1. **No inbound rate limiting (public-deploy blocker).** Any visitor can
   loop `POST /api/generate|evidence` (up to 115 s each, SSE) or
   `/api/export|markdown`, causing CPU/DoS abuse and burning the server's
   shared GitHub quota. Mitigate before publishing: per-IP token bucket
   (middleware or reverse proxy), plus platform WAF/edge limits as
   defense-in-depth. Suggested starting point: 10 generate/min/IP,
   30 evidence/min/IP, 60 catalog/min/IP — tune after the first load test.
2. **Request-timeout plan must match the host (ops blocker).**
   `maxDuration = 120` is incompatible with Vercel Hobby (60 s). Either
   deploy Pro/container (§2) or budget an app change to shorten the pipeline.
3. **No `GET /api/health` endpoint.** Today's health probe is
   `GET /api/catalog` (200 + JSON, 16 KB — heavier than ideal and exercises
   the registry). App-code follow-up: add a cheap `{ ok: true }` health
   route; then repoint the Dockerfile `HEALTHCHECK` and host probes.
4. **No security headers.** `next.config.ts` sets none (no HSTS,
   `frame-ancestors`, `content-type-options`, referrer policy). Set them at
   the platform/CDN or in `next.config.ts` (app-code change) before launch.
5. **`500` responses echo `err.message`.** Low risk (no secrets flow
   through), but prefer a generic `internal` message with server-side
   logging to avoid leaking paths/stack fragments.
6. **`markdown` route skips the `content-length` pre-check** the other
   POST routes do (it still enforces the 512 KB cap after reading). Trivial
   inconsistency; align when nearby code is touched.
7. **No CSRF tokens.** Acceptable for launch: JSON POSTs, no cookies, no
   auth — same-origin fetch from our own pages. Revisit if cookie auth is
   ever added.

## 7. Release checklist + public-deploy blockers

**Blockers (must clear before any public URL):**

- [ ] B1 — Inbound rate limiting on all POST `/api/*` routes (§6.1).
- [ ] B2 — Host chosen and 120 s timeout confirmed (§2; or pipeline
      shortened with `maxDuration` lowered to match).
- [ ] B3 — Full `docker build` + `docker run` + smoke test where a Docker
      daemon exists (§4 caveat).
- [ ] B4 — Security headers set (platform or `next.config.ts`, §6.4).

**Checklist (day of release):**

- [ ] CI green on the release commit (test + tsc + build).
- [ ] Deploy from a tagged commit; record image digest / deployment id.
- [ ] Env set via platform secrets UI only (`docs/ENV.md`); `GITHUB_TOKEN`
      present iff the demo needs authenticated ingestion; Muse vars unset
      (fallback) until a live endpoint is verified.
- [ ] Health probe wired (`/api/catalog` for now) and alerting on 5xx.
- [ ] Smoke: `GET /`, `/landing`, `/api/catalog` → 200; one idea-mode
      `generate` → `export` round-trip returns a valid `.pptx`; one SSE
      generate streams `stage` + `result`.
- [ ] No secrets in the image, logs, or repo (`git status` clean of `.env`).
- [ ] Rollback ready: previous image/commit identified; rollback = redeploy
      it (no migrations, no state).
- [ ] Announce only after B1–B4 + all boxes above are checked.

**Known non-blockers:** Muse provider never verified live (fallback is the
supported path — label demos accordingly); no load test run yet (run one
before any launch traffic); `/api/health` still to be added (§6.3).
