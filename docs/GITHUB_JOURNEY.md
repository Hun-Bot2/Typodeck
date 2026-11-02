# GitHub-to-Presentation Journey

> Historical record (2026-10-30): validation log for branch
> `feat/github-presentation-journey`. Worktree paths and ports below
> are branch-local; behavior claims re-verified on baseline `b09865c`
> where noted. See `docs/DOCS_AUDIT.md`.

Branch: `feat/github-presentation-journey` (worktree `.muse/worktrees/github-journey`).
Stash backup of the pre-work tree: `wip-before-github-journey (audit baseline 2026-10-30)`.

## User journey

1. Paste a public GitHub URL (or pick a sample chip) → **Inspect evidence**.
2. Review files + claims: grounding (`verified` / `suggestion` / `ungrounded`),
   lifecycle (`implemented` / `proposed` / `historical` / `unverified` / `deprecated`),
   numbers, and a deep link to the exact source lines.
3. Exclude or reframe claims, then **Generate from N claims** (or generate directly).
4. Pick a purpose preset + language, preview all systems, edit Slide Markdown, export editable PPTX.

## Demo scenario (2 minutes, live)

Prereqs: network, GitHub quota ≥ 3 core calls (check: `curl https://api.github.com/rate_limit`).

```sh
cd .muse/worktrees/github-journey/apps/web
npm run dev -- -p 3210
# open http://localhost:3210 in a browser
```

1. Click **Try sindresorhus/is** → **Inspect evidence** (~1–2 s).
   Expect: 5 files, ~56 claims, mostly `verified`, deep links into the repo.
2. Uncheck one claim, reframe another → **Generate from 55 claims** (~1 s, cached).
3. Keep purpose `P01`, flip through the 4 system previews, open slide 2.
4. Edit one Slide Markdown line → **Apply edits & re-render**.
5. Select `swiss` → **Download swiss.pptx**. Open in PowerPoint/Keynote:
   all text editable, provenance under File > Info (`source: sindresorhus/is@…`).

No-token fallback when quota is 0: the UI shows the reset time and offers
**Continue with pasted text instead** (idea mode, fully offline).

## Before / after

| Area | Before | After |
|---|---|---|
| Meta/tree HTTP 403 (quota 0) | Generic `network` error, no cause | Typed `rate-limited` + quota reset time, fail-fast |
| Auth | `authToken` existed but no caller passed one | `GITHUB_TOKEN`/`GH_TOKEN` wired in `/api/evidence` + `/api/generate` |
| Repeat ingests | Full quota cost every time | Shared TTL cache (200s only, auth-separated); generate-after-inspect costs 0 API calls |
| Request visibility | None | `requests: {api, blobs, cached}` on ingests + Studio provenance |
| Evidence | Server-side only (counts) | `/api/evidence` + inspector: claims, statuses, numbers, GitHub line links |
| Claim review | Impossible | Exclude / reframe before generation; sha guard resets stale reviews |
| First use | Repo field secondary, raw error codes | Repo-first + sample chips, guided errors, idea-mode fallback |
| Export provenance | `generatedBy` only | `author`/`company`/`subject` core properties (`source: owner/repo@sha`) |

## End-to-end results (`npm run journey`)

`packages/core/scripts/journey.ts` runs evidence → generate → export against live
GitHub and asserts grounding, parity, and editability. Exit 0 = pass,
1 = failed check, 2 = honest skip (no quota / no network).

| Repo | Size | Evidence (time to first preview) | Generate | Export (4 systems) | Claims | Result |
|---|---|---|---|---|---|---|
| sindresorhus/is | tiny (5 files) | 0.1–1.7 s | ~40 ms | ~40 ms | 56 (47 verified) | 9/9 PASS |
| psf/requests | medium (20 files, cap) | 5.9 s | 40 ms | 42 ms | 60 (27 verified) | 9/9 PASS |
| facebook/react | large (20 files, cap) | 6.7 s | 175 ms | 40 ms | 60 (0 verified, docs-filled) | 9/9 PASS |
| missing/repo | — | typed `not-found` | — | — | — | honest failure, no invented data |

Checks per run: source-extraction, evidence-grounded (refs in-bounds),
no-unsupported-numbers, narrative-planned (5–12 slides), selection-pool-honest,
export-valid (typography-only), html-pptx-parity (0 mismatched slides),
editable-text, number-traceability (verbatim claim numbers).

Bottleneck: evidence-phase GitHub fetching dominates (sequential raw blob
fetches, ~250–350 ms each; 20-file repos ≈ 6 s). Generation and export are
negligible (< 200 ms). Follow-up, not done here: bounded-parallel blob fetch.

## HTTP Studio verification

Against `next dev --webpack` on :3210 (dev-only flag: Turbopack cannot resolve
this worktree's symlinked `node_modules`; a normal checkout is unaffected):

- `POST /api/evidence` (sindresorhus/is): 200 in ~1.3 s cold / ~0.2 s warm —
  5 files, 56 claims (47 verified), deep link `…/readme.md#L5`, `requests`
  `{api:2, blobs:5, cached:0}`.
- `POST /api/generate` SSE with `selection.excluded=[c1]`: stages
  `ingest>evidence>narrative>layout×4` stream, 55 claims in play,
  `requests` `{api:0, blobs:0, cached:7}` — generate-after-inspect costs zero
  quota via the shared process cache; warning `1 claim(s) excluded during
  evidence review`.
- `POST /api/markdown` title edit: 200, all 4 systems re-rendered
  (also fixed: the route's allowlist predated the `document` system).
- `POST /api/export` with provenance: 200, 119 KB / 10 slides, core property
  `subject: source: sindresorhus/is@e9c026c611c1`.
- Error paths: missing repo → `{"code":"not-found",…}`; malformed input →
  `{"code":"invalid-input",…}`; quota exhaustion → `rate-limited` + `resetAt`
  (offline-tested; live quota was healthy during validation).

## Unresolved limitations

1. **20-file cap fills with docs on large repos** (react: 0 code files, 0
   `verified` claims). Selection prefers README/docs; nothing reserves code
   slots. Captions stay honest (`unverified`), but grounding is weaker.
2. **Sequential blob fetching** (~6 s evidence on capped repos). Bounded
   parallelism would cut this to ~1–2 s; warning order + determinism need care.
3. **Unauthenticated quota is 60 core calls/hour** with no user-supplied token
   field in the UI (env-only). Review-before-generate + cache stretch it, but a
   busy demo can still hit the wall; the failure is honest with a reset time.
4. **No local-file ingest**: the supported offline fallback is pasted idea
   text. Multi-file paste/upload would help air-gapped demos; not implemented.
5. **Claim ids are positional** (`c1…cN`); a repo change between inspect and
   generate resets the review (by design) rather than re-matching claims.
6. Narrative pick quality is unchanged (e.g. code fragments can headline
   covers); the inspector lets users exclude them, but the planner itself was
   intentionally not retuned here.
