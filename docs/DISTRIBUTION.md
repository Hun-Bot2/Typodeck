# Typodeck Skill — Distribution

Owner: Agent H. Scope: this file only (`skills/` is owned by Agent B;
all other docs by Agent E). Nothing in this document constitutes
registration, listing, or publication — those are separate milestones
with separate evidence, tracked below.

Baselines examined (read-only):

- `b09865c` — release baseline; flat skill layout
  (`SKILL.md` + 8 topic files + `EXAMPLES.sh`).
- `agent/b-skill @ 76a9570` — Agent B's restructured skill
  (`SKILL.md` + `references/` + `examples/` + `scripts/` + `INSTALL.md`).
  All "B-branch" results below come from `git archive` / detached-temp
  copies; the B branch itself was never modified.

Machine (all live checks ran here, 2026-10-31):

- Muse Code 1.4.14 (`muse-bin-1.4.14-R7309.1`), macOS arm64
- Codex CLI 0.165.0 (node wrapper + vendored
  `codex-darwin-arm64` Mach-O binary)
- Claude Code 2.1.45 (node bundle)
- `skills` CLI via `npx -y skills` (vercel-labs/skills)

Evidence scale: **VERIFIED** (ran on this machine, output observed) >
**DOCUMENTED** (vendor docs and/or on-machine product strings, no live
run) > **ASSUMED** (nothing below is assumed without a label).

## 1. Compatibility matrix

| Agent | Local/project install | Personal install | Public-repo install | Directory / marketplace | Evidence |
|-------|----------------------|------------------|---------------------|-------------------------|----------|
| Muse Code | `.agents/skills/typodeck/` in a trusted workspace (copy or symlink) | `muse skills install <path>` → `$CONFIG_DIR/skills/typodeck/` | Git marketplace source → snapshot → `install <plugin>@<marketplace>` (Claude-format catalog) | Same marketplace flow; no central directory exists for Muse | VERIFIED end to end in sandbox (§2.1–§2.3) |
| Codex | `.agents/skills/typodeck/` (repo or user `~/.agents/skills`) | `$CODEX_HOME/skills/typodeck/` (`~/.codex/skills/`) | `install-skill-from-github.py --repo <owner>/<repo> --path skills/typodeck` (system skill-installer) | openai/skills curated list (upstream PR, not applicable) | DOCUMENTED (binary strings + shipped installer skill + existing `~/.codex/skills` layout); live session load NOT executed |
| Claude Code | `.claude/skills/typodeck/` | `~/.claude/skills/typodeck/` | Plugin marketplace: Git source + `.claude-plugin/marketplace.json` + per-plugin `.claude-plugin/plugin.json` | Same marketplace flow; also the `plugins`/marketplace ecosystem | DOCUMENTED (binary strings: skill paths, `plugin.json`, `marketplace.json`, `plugin@marketplace` IDs); live session load NOT executed |
| skills.sh (`npx skills`) | Repo layout `skills/typodeck/` auto-detected by `skills list` | `npx skills add <owner>/<repo>` (global scope) | Same `add` command (requires public GitHub repo) | skills.sh leaderboard via install telemetry (no submission step) | VERIFIED for local detection; DOCUMENTED for `add` (needs public repo — not attempted, publication forbidden); Muse Code is NOT in the skills.sh agent list |

What "registration" does and does not mean:

- `SKILL.md` existing in this repo registers nothing anywhere.
- Local/project/personal install = files on disk in a discovery path.
  Verified live for Muse Code only.
- Public-repo install = installable from a public Git URL without a
  local checkout. Verified live for Muse Code against a local `file://`
  git repo (same code path as GitHub minus network). Not yet possible
  for real: no public repo exists.
- Directory/marketplace listing = discoverable by strangers
  (skills.sh leaderboard, Codex curated list, a public marketplace
  repo). None achieved; skills.sh has no submission step (telemetry
  only), Codex curated needs an upstream PR to openai/skills.

## 2. Install verification transcripts

### 2.1 Muse Code — validate + project discovery (VERIFIED)

```console
$ muse skills validate skills/typodeck
valid   typodeck
$ muse skills validate /tmp/td-bskill/skills/typodeck   # Agent B tree
valid   typodeck
$ mkdir -p /tmp/td-probe/.agents/skills
$ cp -r skills/typodeck /tmp/td-probe/.agents/skills/typodeck
$ muse skills list --source project --workspace /tmp/td-probe --trust-workspace
NAME      SCOPE   ACTIVATION  DESCRIPTION            PATH
typodeck  project on         Build typography-only… .agents/skills/typodeck/SKILL.md
```

Negatives (both VERIFIED):

- Untrusted workspace (no `--trust-workspace`): `No skills found` +
  diagnostic `project-skills-untrusted: project skills skipped
  because workspace is untrusted (.agents/skills)`.
- Repo-root `skills/typodeck/` (no `.agents/` parent): `No skills
  found`. The authoring location is NOT a discovery path.
- A symlinked `.agents/skills/typodeck/` → repo dir IS discovered
  (lists `typodeck project on`), matching Agent B's INSTALL.md claim.

### 2.2 Muse Code — personal install in sandbox HOME (VERIFIED)

```console
$ HOME=/tmp/td-fakehome muse skills install skills/typodeck --scope user
typodeck  $CONFIG_DIR/skills/typodeck
$ find /tmp/td-fakehome -maxdepth 4
/tmp/td-fakehome/.config/muse/skills/typodeck   # full copy landed here
$ HOME=/tmp/td-fakehome muse skills list --source user
typodeck  user  on  Build typography-only…  $CONFIG_DIR/skills/typodeck/SKILL.md
```

Real-HOME equivalent: `~/.config/muse/skills/typodeck/`
(`$XDG_CONFIG_HOME/muse` when set). The real HOME was not touched.

### 2.3 Muse Code — plugin + marketplace (VERIFIED in sandbox)

Muse's publication-shaped path is its native plugin system
(`muse plugins …`). A throwaway wrapper was built in /tmp (NOT in
this repo): a copy of the B-branch skill plus a manifest. Two
findings:

1. Native manifest (`.muse-plugin/plugin.json`, `schemaVersion: 1`,
   `capabilities.skills[{id, path}]`) validates (`"valid": true`,
   `"summary": "full"`) and installs locally, BUT the skill `path`
   must point at the **file** (`…/SKILL.md`), not the directory
   (directory yields `missing-capability-path: plugin path must be
   a file`).
2. A muse-native `marketplace.json` requires per-plugin
   `/install/transport`, and every value probed (`local-dir`,
   `local-file`, `git`, `file`, `path`, `bundle`, `snapshot`,
   `http(s)`, `inline`, `vendored`, `remote`, `registry`) is
   rejected as unsupported. The **Claude-format catalog works
   instead**: the binary probes `marketplace.json`,
   `.agents/plugins/marketplace.json`, and
   `.claude-plugin/marketplace.json`, and imports Claude-format
   plugins (`manifest_family: "claude-compatible"`).

Working chain (all under `HOME=/tmp/td-fakehome2`):

```console
# marketplace source layout in /tmp/td-cmkt:
#   .claude-plugin/marketplace.json
#   typodeck-plugin/.claude-plugin/plugin.json  (skills: ["./skills/typodeck"])
#   typodeck-plugin/skills/typodeck/            (skill copy)
$ muse plugins marketplace add cmkt /tmp/td-cmkt --json
{"marketplace": {"name": "cmkt", "source": {"kind": "local-dir", …},
  "plugin_count": 1, "skipped": [], "fetched": true}}
$ muse plugins remove typodeck-probe   # drop the earlier local-install probe
$ muse plugins install 'typodeck-probe@cmkt' --json
{"installed": {"id": "typodeck-probe", "manifest_family": "claude-compatible",
  "source": {"provenance": "marketplace-user-added", …}, "enabled": true, …}}
$ muse skills list --source plugin | grep typodeck
plugin:typodeck-probe:typodeck  plugin  on  Build typography-only…
```

Git-source milestone (same code path as a future public repo):

```console
$ git init /tmp/td-gitmkt && commit the marketplace above
$ muse plugins marketplace add gitmkt 'file:///tmp/td-gitmkt' --json
{"marketplace": {"name": "gitmkt", "source": {"kind": "git", …},
  "plugin_count": 1, "fetched": true}}
```

A GitHub-hosted marketplace repo would exercise the identical flow
over the network; that step is intentionally untested (no public
repo, no publication).

### 2.4 Codex paths (DOCUMENTED, not live-loaded)

- Binary strings (codex-darwin-arm64, v0.165.0):
  `os.environ.get("CODEX_HOME", os.path.expanduser("~/.codex"))` +
  `os.path.join(_codex_home(), "skills")`; skill-source enum
  `codex-home-skills` / `.agents/skills` / `user-agent-skills` /
  `system-skills`; GitHub-install errors
  (`Skills path not found: https://github.com/{repo}/tree/{ref}/{path}`).
- Shipped system skill `~/.codex/skills/.system/skill-installer`
  documents the public-repo flow:
  `install-skill-from-github.py --repo <owner>/<repo>
  --path <path/to/skill>` → `$CODEX_HOME/skills/<skill-name>`
  (default ref `main`, `--dest` override, aborts if destination
  exists). Curated default: `openai/skills` `skills/.curated`.
- Existing on-disk layout matches: `~/.codex/skills/compose-expert/
  {SKILL.md, agents, references}` and
  `~/.codex/skills/.system/{imagegen, openai-docs, review-agent,
  skill-creator, skill-installer}/`.
- The GitHub installer refuses symlinks inside downloaded skills
  (`Symbolic links are not allowed in skills`); our skill tree
  contains no symlinks (§5), so this is compatible.
- NOT verified: an actual Codex session listing/loading the skill
  (needs an API session), and the `--repo` install against a real
  public repo (none exists).
- `~/.codex/config.toml` on this machine has no `[skills]` section;
  per-skill disable via config is documented in Agent B's INSTALL.md
  but not independently confirmed here.

### 2.5 Claude Code paths (DOCUMENTED, not live-loaded)

- Binary strings (cli.js, v2.1.45): `Create skills by adding .md
  files to .claude/skills/ in your project or ~/.claude/skills/`.
  No `.agents/skills` support found in the bundle.
- Plugin/marketplace strings: `.claude-plugin/plugin.json`,
  `marketplace.json`, `plugin@marketplace` IDs, marketplace
  add/update flows. Same catalog shape as §2.3, so one
  `.claude-plugin/` tree can serve both Claude Code and Muse Code
  marketplaces (dual-harness value, single maintenance point).
- `~/.claude/skills` does not exist on this machine; no live
  session load was executed (needs an API session).

### 2.6 skills.sh (local VERIFIED, remote DOCUMENTED)

```console
$ npx -y skills list        # run at repo root
Project Skills
typodeck  …/skills/typodeck  Agents: OpenClaw  Source: local
$ npx -y skills find typodeck
meta-quest/agentic-tools@hz-xr-simulator-control  79 installs …
aeyeops/aeo-skill-marketplace@python-data-engineering  1 install …
```

- The repo layout (`skills/typodeck/SKILL.md`) is recognized without
  any config. (The CLI labels the matched agent family OpenClaw for
  this layout; that is the CLI's mapping, not a Typodeck claim.)
- `find typodeck` returns only unrelated fuzzy matches: no name
  conflict, and Typodeck is not registered.
- [Docs](https://www.skills.sh/docs): install is
  `npx skills add <owner>/<repo>`; leaderboard rank comes from
  anonymous install telemetry — there is NO submission step
  (`/submit` does not exist). Requirements distilled from the CLI
  repo and directory conventions: one folder per skill under
  `skills/`, folder name == frontmatter `name`, no `SKILL.md` at
  repo root, no absolute/home paths in text. Our tree satisfies all
  four statically (see §5); the `add` half needs a public repo and
  is untested.
- Gap: Muse Code is not in the skills.sh agent list, so `skills
  add` will not wire Muse paths. Claude Code and Codex are listed.

## 3. Skill validation

### 3.1 Metadata (both trees)

| Check | Baseline `b09865c` | B-branch `76a9570` |
|-------|-------------------|-------------------|
| `name` == directory name, lowercase, hyphen-safe | `typodeck` ✅ | `typodeck` ✅ |
| `description` states WHAT + WHEN | ✅ (274 chars) | ✅ (289 chars) |
| `description` ≤ 1024 chars (directory limit) | ✅ | ✅ |
| `muse skills validate` | `valid typodeck` | `valid typodeck` |
| No `SKILL.md` at repo root (shadowing rule) | ✅ none | ✅ none |

Neither tree sets a `version`/`metadata` frontmatter block. That is
conformant (Agent Skills has no version field), but it means the
skill cannot self-report its release — versioning must live in git
tags / INSTALL.md (§4).

### 3.2 EXAMPLES.sh end-to-end

Clean-room runs (fresh `git worktree`, `npm install`, core build,
real exit codes — piped `tail` masks failures, so all codes below
are from unpiped runs):

- **Baseline**: EXIT 1 — **pre-existing failure, deterministic.**
  Ex1 (3 systems) and Ex2 (repo; quota 40+) pass with
  `validation: OK`; Ex3 `eval -- --fixture F4` goes 8/8 green, but
  the gate `eval:report` prints `OVERALL: FAIL` and exits 1:
  `design-diversity FAIL on 2/30 pair(s): F4/en document~swiss,
  F4/ko document~swiss` (`diversity: 28/30`). The report aggregates
  committed reports + fresh runs, so this fails on a pristine
  checkout, not from dirty state. → skill-side fix required (§7.1).
- **B-branch**: EXIT 0, `PASS examples=6 skipped=0`. Ex6 gates on
  the F4 matrix (8/8) and records the verdict instead of gating on
  it, so the same underlying `OVERALL: FAIL` appears honestly in
  the transcript without failing the run. B's runner also restores
  `evals/` (worktree shows only `package-lock.json` churn from
  `npm install`, a tool side effect).
- Side-effect hygiene: baseline `EXAMPLES.sh` rewrites tracked
  `evals/reports/*.json` + `evals/summary.json` (reverted after
  probing; release runners should copy the pattern from B's Ex6).

### 3.3 Bundled-asset audit (both trees)

- No hardcoded local paths: `grep -r '/Users/|/home/|C:\\…
  |jeonghun'` over both trees → clean.
- No secrets: scan for `api[_-]?key`, `secret = "…"`, `Bearer
  <token>`, `sk-…`, `ghp_…` → clean. (SKILL.md names the
  `TYPOdeck_MUSE_API_KEY` env var but never a value.)
- No symlinks in either tree (`find -type l` → empty) → compatible
  with Codex's no-symlink GitHub installer.
- Executable bits: all `.sh` (`EXAMPLES.sh`, `examples/*.sh`,
  `scripts/*.sh`) are `+x` with `#!/usr/bin/env bash`, `bash -n`
  clean. `.mjs` are non-executable, `node --check` clean (run via
  `node`, correct as-is).
- Portability: `ROOT` derived from `$0`, OUT defaults to
  `/tmp/typodeck-skill` (overridable argv); `scripts/check-quota.sh`
  runs standalone (exit 0, prints quota line).
- The skill does NOT bundle the research corpus:
  `research-index.md` is a 24-line / 1655-byte pointer file, and
  `research/` ships nothing into the installed copy.

## 4. Versioning, naming, licensing

### 4.1 Versioning strategy (proposed, unaudited)

- `package.json`: `typodeck@0.1.0`, `private: true`, MIT. For any
  npm publication: drop `private`, add `repository`/`homepage`/
  `files`; cut `1.0.0` at release (0.x signals unstable API).
- The skill has no version field by design (Agent Skills standard).
  Version it out-of-band: `skill-vX.Y.Z` git tags + a version line
  in `INSTALL.md` (skill-side fix, §7.4). Plugin wrappers carry
  their own `version` (`plugin.json`), which is what marketplace
  `install`/`update` compare.
- `muse skills update <skill-id>` exists but was not exercised
  (nothing to update from); treat update semantics as DOCUMENTED.

### 4.2 Naming conflicts (method: live registry/CLI queries + web)

| Namespace | Result for `typodeck` | Method |
|-----------|----------------------|--------|
| npm package | AVAILABLE (`404 Not Found` from registry) | `npm view typodeck version`, 2026-10-31 |
| GitHub `typodeck/*` org namespace | TAKEN by unrelated account (stale 2022 tutorial repos) — publish under a different owner | web search |
| skills.sh directory | No conflict; not registered | `npx skills find typodeck` |
| Muse built-in/user skill IDs | No collision (`skills list` shows no `typodeck`) | `muse skills list --source all` |
| Codex system skills | No collision (`imagegen, openai-docs, review-agent, skill-creator, skill-installer`) | `~/.codex/skills/.system` listing |

Consequence: `npx skills add <owner>/typodeck`-style installs and a
marketplace repo must use an owner other than `typodeck`; the bare
skill name itself is clear everywhere checked.

### 4.3 License adequacy — FLAG: dual-asset situation

- Code+docs: MIT (`LICENSE`, © 2026 Nam Jeong Hun), README points
  at it. Adequate for code distribution.
- `research/` has **no license file and no license statement**, yet
  it aggregates sources with incompatible terms: CC BY-SA
  (Tschichold Archive scans), CC BY-NC (webtypography.net,
  recorded as "FULL (guidelines listed)"), SIL OFL 1.1 (Pretendard).
  Open questions for the integrator/legal: (a) under what license
  is `research/` itself offered? (b) does "FULL guidelines listed"
  redistribute CC BY-NC text (NC bars commercial reuse and cannot
  ride along with MIT)? (c) README already disclaims unverified
  font-embedding licenses — same class of risk.
- Installed skill copies leave the repo behind: `skills/typodeck/`
  contains no license text or license pointer (verified: no
  license mention in `SKILL.md`/`INSTALL.md`), so a user with only
  `~/.codex/skills/typodeck/` cannot see the terms. → skill-side
  fix: add `LICENSE` (or a license line in frontmatter), §7.3.
- Recommendation: add a `research/NOTICE` (or LICENSE) scoping
  research terms separately from MIT, keep the installable skill
  free of research corpus (already true, §3.3), and resolve the
  BY-NC redistribution question before any public push.

## 5. Registration readiness checklist

- [x] `SKILL.md` name/description conform (both trees, §3.1)
- [x] `muse skills validate` → valid (both trees)
- [x] Directory-layout rules (folder == name, no root SKILL.md,
  no absolute paths, no symlinks)
- [x] Scripts portable + executable, syntax-checked
  (`bash -n`, `node --check`)
- [x] Secrets/path scan clean
- [x] Muse local install paths verified (project, user, plugin,
  marketplace incl. git source)
- [x] No registry/marketplace name collisions (§4.2)
- [ ] Baseline `EXAMPLES.sh` exits 0 (BLOCKED: Ex3 gate fails, §3.2)
- [ ] Skill carries its license (§4.3)
- [ ] Skill versioning (tags + INSTALL.md line, §4.1)
- [ ] `research/` license scoping (§4.3)
- [ ] Public repo exists (required for: Codex `--repo` install,
  `npx skills add`, skills.sh telemetry, GitHub marketplace
  sources). Forbidden to this agent; owner decision.
- [ ] Live session-load confirmation on Codex + Claude Code
  (needs API sessions with the skill installed)
- [ ] npm publication (optional; needs `private` removal + metadata)

## 6. Publication instructions (DRAFT — partly unaudited)

Do NOT execute without owner sign-off; several steps need a public
repo that does not exist yet.

1. **Prereqs**: public repo `<owner>/typodeck` (owner ≠
   `typodeck`, §4.2) at the release tag; §7 fixes merged;
   `research/` licensing resolved.
2. **Muse Code (audited path)**: add a marketplace repo (or reuse
   the product repo) containing `.claude-plugin/marketplace.json`
   + plugin dir with `.claude-plugin/plugin.json`
   (`skills: ["./skills/typodeck"]`, skill files vendored or
   referenced per §2.3). Users run
   `muse plugins marketplace add typodeck <git-url>` then
   `muse plugins install 'typodeck@typodeck'`. The muse-native
   `marketplace.json` `install.transport` enum is UNKNOWN —
   ship the Claude-format catalog (verified) until vendor docs
   say otherwise.
3. **Codex (unaudited command, documented flags)**: users run the
   system skill-installer path —
   `install-skill-from-github.py --repo <owner>/typodeck
   --path skills/typodeck [--ref <tag>]`. No PR or listing needed
   for user installs. Curated-list membership (openai/skills PR)
   is optional and out of scope.
4. **Claude Code (unaudited live, strings-confirmed)**: same
   `.claude-plugin/` tree as step 2 doubles as a Claude
   marketplace; project users can alternatively copy
   `skills/typodeck/` to `.claude/skills/typodeck/`.
5. **skills.sh (no action available)**: nothing to submit.
   After the repo is public, `npx skills add <owner>/typodeck`
   works and installs generate leaderboard telemetry. Note the
   repo SHOULD keep the `skills/typodeck/` layout (moving it
   breaks `skills list` detection). Muse users are NOT served by
   this channel (§2.6 gap) — point them at step 2.
6. **npm (optional)**: only if a runnable package (not just the
   skill) is wanted. `typodeck` is free on npm, but `private: true`
   must go and `files`/`repository` metadata must be added.
   Unaudited: no publish attempted (forbidden).

## 7. Skill-side fixes needed (for the integrator — Agent H may not edit `skills/`)

1. **Baseline `EXAMPLES.sh` Ex3 gate fails (HIGH).** On pristine
   `b09865c`, `eval:report` → `OVERALL: FAIL` (`diversity: 28/30`,
   `document~swiss` pairs) → script exits 1. Adopt B's Ex6 pattern
   (gate on matrix, record verdict) or fix the underlying
   diversity check. B-branch `EXAMPLES.sh` already passes 6/6, so
   integrating B's runner resolves the exit code — but the
   `OVERALL: FAIL` line will still appear in transcripts until the
   eval itself passes.
2. **Baseline `EXAMPLES.sh` dirties tracked `evals/` (MEDIUM).**
   It rewrites `evals/reports/*.json` + `evals/summary.json`;
   adopt B's restore step.
3. **Skill ships no license (MEDIUM).** Installed copies (personal
   / marketplace / `skills add`) detach from root `LICENSE`. Add
   `skills/typodeck/LICENSE` (or a frontmatter license pointer).
4. **Skill has no self-reported version (LOW).** Add release tags
   (`skill-vX.Y.Z`) and a version line in `INSTALL.md` so
   installers can confirm what they got.
5. **`research/` license scoping (HIGH, repo-level not skill).**
   Add `research/NOTICE` or LICENSE separating research terms
   from MIT, and clear the CC BY-NC redistribution question (§4.3)
   before publication.
6. **INSTALL.md nit (LOW, verify with Agent B):** `~/.codex/
   config.toml` on this machine has no `[skills]`/`[[skills.
   config]]` section, so the disable-via-config snippet is
   unconfirmed here. Also `muse skills update` semantics are
   untested. Mark both unaudited or verify live.

## 8. Outstanding blockers (Agent H scope)

1. No public repo → Codex `--repo` install, `npx skills add`,
   skills.sh telemetry, and GitHub marketplace sources are all
   untestable until it exists. (Out of my hands by design.)
2. No live Codex/Claude Code session load (needs API sessions).
3. Muse-native `marketplace.json` `install.transport` enum
   unknown — worked around via Claude-format catalog (verified),
   but the native path stays DOCUMENTED-only.
4. `eval:report OVERALL: FAIL` on the release baseline (eval
   quality, not distribution) — visible in every honest
   verification transcript until fixed.

## 9. What was verified live vs documented vs assumed

- VERIFIED live: `muse skills validate` (both trees); project
  discovery incl. symlink-positive, untrusted-negative,
  repo-root-negative; personal install to sandbox HOME; native
  plugin validate + local install + skill surfacing;
  Claude-format marketplace add (local-dir AND git `file://`
  sources) + `install <plugin>@<marketplace>` + skill surfacing;
  `npx skills list` detection + `find` no-conflict; `npm view`
  404; all script syntax checks + `check-quota.sh` run; secrets/
  path/symlink scans; baseline `EXAMPLES.sh` exit 1 + B-branch
  exit 0 in clean worktrees.
- DOCUMENTED (binary strings / shipped files / vendor docs, no
  live run): Codex `$CODEX_HOME/skills` + `.agents/skills` +
  GitHub installer flow; Claude `.claude/skills` + project paths
  + plugin/marketplace shapes; `npx skills add` + telemetry-only
  listing; skills.sh layout rules; `muse skills update`.
- ASSUMED: nothing. Every matrix cell has at least DOCUMENTED
  support. Items that could not be run (public-repo network
  paths, API sessions, npm publish) are labeled as blockers, not
  assumed good.
