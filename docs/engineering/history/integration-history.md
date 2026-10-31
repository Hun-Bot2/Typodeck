# Integration history

How the authoritative revision was assembled. No merges were used;
each step is a linear commit or an explicit file overlay.

1. **`ff68b70` (`main`)** — last stable base: 3-system engine, Studio,
   Skill, Phase-4 eval 24/24. Ships broken `slide-ir.ts` /
   `visual-benchmark.ts` fragments (tsc fails) and a 1-line README.
2. **`fdf6c3c` → `be22250` → `3436300`** — restore pre-journey context,
   then preserve research/evidence artifacts as-is (foundation
   checkpoint). Nothing deleted.
3. **`334c144` → `b88e43d` → `5333c1c`** — journey layer, Studio a11y
   fixes F1–F6, landing page integrated from workstream worktrees.
4. **`07edbd7`** — docs rewrite + DX setup reconciled from the
   comms-audit and setup-audit workstreams (conflicts resolved in favor
   of verified commands).
5. **`2e24b4f`** — demo evidence package (`showcase/`: 3 pinned decks +
   manifest + previews).
6. **`5d4e4a0` → `b09865c`** — safe Studio fixes, then verification
   evidence (screenshots + exported decks). Full code baseline; 270/270
   tests green. Ships stub-era 370-record research snapshot.
7. **`dd76f69` (side branch)** — 447 full-field registry rebuild with
   provenance sidecar; stub-era reports snapshotted, not overwritten.
8. **`20cbcd2` (side branch)** — preview bytes (10 files) + gallery
   evidence integration (per-candidate refs/rules/gaps).
9. **`e610736` (this branch)** — `b09865c` + file-copy overlay of the
   447 research/gallery/previews set + grounded README + readiness and
   traceability reports. Code identical to `b09865c`.

## What was deliberately not merged

- Peer workstream branches (all at `ff68b70` + uncommitted work): owned
  by other agents; their reconciled output is already in `b09865c`.
- `stash@{0}`: superseded WIP; applying it would clobber the integration.
- `review/` scoring app: new in the consolidation commit on this branch
  (previously untracked review tooling from the main worktree).
