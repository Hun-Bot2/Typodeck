# Runtime

## Authoritative review server

Selected revision: `e610736` (`docs/launch-readme`), worktree
`/tmp/typodeck-launchdocs`, production build (`next start`).

> **URL: http://localhost:3222** — PID 304, started 2026-10-31 17:53 KST,
> mode production (`next start`, fresh build). Stop: `kill 304`.
> Restart: `cd /tmp/typodeck-launchdocs/apps/web && npx next start -p 3222`
> (rebuild first with `npm run build -w @typodeck/web` if code changed).

Verify what you are viewing (matches the engineering report revision):

```sh
curl -s http://localhost:3222/ -o /dev/null -w '%{http_code}\n'  # 200
lsof -iTCP:3222 -sTCP:LISTEN -n -P | tail -1                       # PID 304
lsof -a -p 304 -d cwd -n | tail -1                                # …/typodeck-launchdocs/apps/web
```

The server runs a production build of `apps/web` + `packages/core` from
this branch. Runtime code is unchanged since `e610736` — verify with
`git diff e610736..HEAD -- packages apps` (empty). Later docs-only commits
do not alter what is served; any code change requires rebuild + restart.

Inline slides and Studio previews are HTML renders, never PPTX proof —
open the exported `.pptx` to judge editable output. No private paths or
secrets are exposed by this server (no `.env` in the worktree).

## Other running servers (not authoritative, left untouched)

| Port | PID | Worktree | Revision | Owner | Note |
|------|-----|----------|----------|-------|------|
| 3210 | 16190 | `.muse/worktrees/github-journey` | `ff68b70` + uncommitted changes | peer agent (GitHub Journey) | Old base + active edits; not the release |
| 3221 | 46746 | `/private/tmp/typodeck-integration` | `b09865c` clean | peer agent (integration) | Same code as baseline, minus launch docs/research overlay |

Both are production `next-server` processes owned by concurrent work. They
were identified read-only and deliberately not signaled. Do not review the
release on `:3210` (stale base) or confuse `:3221` with the authoritative
instance (it lacks this branch's README, 447 overlay, and review app).

Free at inventory time: 3111, 3222 (taken by the authoritative server
above), 3000, 3102, 8080, 8123. A prior orphan on 3101 (leftover of this
session's earlier smoke probe, same worktree) was terminated by its owner
before starting the authoritative instance.
