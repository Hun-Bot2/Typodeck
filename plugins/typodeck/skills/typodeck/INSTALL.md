# Typodeck Skill — Install Notes

Source of truth: this directory (`plugins/typodeck/skills/typodeck/`).
It is the authoring location, packaged as a Claude plugin
(`plugins/typodeck/`) and installable as a plain skill everywhere
else. Each harness links or copies it into its own discovery path.
The Skill is shell + HTTP only — no harness-specific calls — so the
same files serve all three agents below.

Layout (progressive disclosure): `SKILL.md` (orchestrator, always
loaded) → `references/` (one file per workflow step, on demand) →
`examples/` + `scripts/` (runnable). Verify after any install with
`plugins/typodeck/skills/typodeck/EXAMPLES.sh [OUT]` (exit 0, 8 examples).

## Muse Code (verified live on this machine)

- Validate: `muse skills validate plugins/typodeck/skills/typodeck`
  → `valid typodeck`.
- Project install: copy or symlink this directory to
  `.agents/skills/typodeck/` in a TRUSTED workspace; verify with
  `muse skills list --source project --workspace <ws> --trust-workspace`
  (lists `typodeck project on`). Untrusted workspaces skip project
  skills with a `project-skills-untrusted` diagnostic.
- Personal install (user-run): `muse skills install
  plugins/typodeck/skills/typodeck` from the repo root → managed
  `$CONFIG_DIR/skills/typodeck`
  (`$XDG_CONFIG_HOME/muse`, else `$HOME/.config/muse`).
- Note: the repo-root plugin directory is NOT auto-discovered;
  it must be installed into one of the paths above.

## Codex (binary + docs evidence, session load not executed)

- Repo install: place this directory at `.agents/skills/typodeck/`
  (Codex scans `.agents/skills` from `$CWD` up to the repo root;
  symlinked skill folders are followed). Also recognized:
  `$HOME/.agents/skills` (user), `/etc/codex/skills` (admin).
- Personal install: copy to `$CODEX_HOME/skills/typodeck/`
  (default `~/.codex/skills/typodeck/`), the same
  `<name>/SKILL.md` layout as the installer's target.
- Disable without deleting via `[[skills.config]]` in
  `~/.codex/config.toml`. Restart Codex if an update does not appear.

## Claude Code (official-docs evidence, session load not executed)

- Preferred: install as a plugin from this repo's marketplace
  (`.claude-plugin/marketplace.json` → `./plugins/typodeck`,
  manifest `plugins/typodeck/.claude-plugin/plugin.json`).
- Fallback: plain skill install per the Agent Skills open standard
  (`SKILL.md` + supporting files; directory name or frontmatter
  `name` becomes `/typodeck`). Project: copy or symlink to
  `.claude/skills/typodeck/` (committed to version control).
  Personal: `~/.claude/skills/typodeck/`. Symlinks at either
  location are read from their target.
- Do not name the folder `synced` (reserved).

## Compatibility matrix

| Agent | Project path | Personal path | Evidence level |
|-------|--------------|---------------|----------------|
| Muse Code | `.agents/skills/typodeck/` (trusted ws) | `muse skills install` → `$CONFIG_DIR/skills/` | VERIFIED: `validate` → valid; probe skill listed `project/on`; untrusted negative confirmed; repo-root `skills/` confirmed NOT discovered |
| Codex | `.agents/skills/typodeck/` | `$CODEX_HOME/skills/typodeck/` (`~/.codex/skills/`) | DOCUMENTED: install-target strings in on-machine `codex` binary (v0.165.0) + existing `~/.codex/skills/compose-expert/` layout + official local-skills docs; live session load NOT executed (needs API session) |
| Claude Code | `.claude/skills/typodeck/` | `~/.claude/skills/typodeck/` | DOCUMENTED: official skills docs (Agent Skills standard, symlink support); `~/.claude/skills` confirmed absent on this machine; live session load NOT executed (needs API session) |

Evidence scale used here: VERIFIED (ran the check on this machine,
output observed) > DOCUMENTED (vendor docs and/or on-machine product
strings, no live run) > ASSUMED (nothing below is assumed — every
cell above has at least DOCUMENTED support).
