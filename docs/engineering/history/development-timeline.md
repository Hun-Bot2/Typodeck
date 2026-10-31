# Development timeline (from Git history)

All SHAs verified via `git log`. Dates are committer dates (KST project).
Motivations below come from commit subjects and in-repo reports only.

## 2026-10-30 — foundation on `main`

- `f7fc6e8` Initial commit
- `12338fb` Phase 0: product specs (PRD, architecture, design system,
  evaluation)
- `643fdda` Phase 1: typography core (schema, systems, layout, export,
  validation)
- `4302780` Review: expressive alt-slide kicker contrast, harder validator
- `899439b` Phase 2: narrative + ingestion (idea/repo modes, evidence,
  provider)
- `428c430` Phase 3: web studio (Next.js generate/preview/select/export)
- `a0f3b4b` Phase 4 + Skill: eval harness 24/24 PASS, Typodeck Skill
- `ad4c3db` Ignore local env files (keys never committed)
- `ff68b70` Checkpoint: Skill benchmark vs 3 external skills + R1–R8
  refinements (**`main` tip, `origin/main` tip**)

## 2026-10-31 — integration branch

Linear history on `integrate/release-readiness` (base `ff68b70`):

- `fdf6c3c`, `be22250` Phase 1: restore pre-journey context (tracked,
  code/tests/skills)
- `3436300` Phase 1: preserve research and evidence artifacts as-is
  (**foundation checkpoint**)
- `334c144` Phase 3: integrate GitHub Journey layer
- `b88e43d` Phase 3: port Studio accessibility fixes (F1–F6)
- `5333c1c` Phase 3: integrate landing page
- `07edbd7` Phase 3: integrate docs rewrite + DX setup fixes (reconciled)
- `2e24b4f` Phase 3: integrate demo evidence package (`showcase/`)
- `5d4e4a0` Phase 5: safe Studio fixes from triage
- `b09865c` Phase 4: verification evidence (**integration tip**)

## 2026-10-31 — research snapshots (side branches, immutable)

- `dd76f69` Research checkpoint: 447-reference full-field recovery baseline
  (`research/checkpoint-447-2026-10-30`)
- `20cbcd2` Review assets: preview bytes + gallery evidence integration
  (`research/review-assets-2026-10-31`)

## 2026-10-31 — launch docs (this branch)

- `e610736` Launch docs: grounded README, 447 overlay, readiness reports
  (`docs/launch-readme`, **authoritative revision**)

## Unmerged work (zero unique commits; live work uncommitted in worktrees)

`docs/comms-audit`, `dx/setup-audit`, `landing/page`,
`showcase/demo-evidence`, `studio/a11y-audit`,
`feat/github-presentation-journey` — all at `ff68b70`. Their reconciled
output already landed via `b09865c`; remaining worktree diffs belong to
their owners. `stash@{0}` (`wip-before-github-journey`) is superseded by
`b09865c`; kept for provenance, never to be applied.
