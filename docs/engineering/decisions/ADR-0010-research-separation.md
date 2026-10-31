# ADR-0010: Research overlay stays separate from production

Status: Accepted (process). Evidence: `research/checkpoint-447:dd76f69`,
`research/review-assets:20cbcd2` (accepted baselines, immutable),
`research/reconciliation-2026-10-30.md`, this branch's overlay method
(file copy, no merge).

## Context

The 447-reference design corpus, gallery, and review app are large,
human-review artifacts. Merging them into `main` or production code
paths would bloat the runtime and blur review state.

## Decision

Research snapshots live on dedicated branches and are overlaid onto
docs/release branches by explicit file copy with provenance recorded.
They are never imported by `packages/core` or `apps/web`, never merged
silently, and their originals are never edited in place.

## Consequences

`main` stays lean; review tooling versions independently. Merge
direction into `main` (if ever) requires explicit owner approval —
proposed, not decided.
