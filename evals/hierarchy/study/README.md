# Human study — DATA side (study-v1)

Case dataset + eval runners for the hierarchy human study.
Frozen contracts: [`CONTRACTS.md`](./CONTRACTS.md) (§S0/S1/S2 shapes, §S5 ownership).

| File | Purpose |
|---|---|
| `cases.json` | 27 records, 25 active for humans (S23/S24 excluded: intent-only, render-identical) |
| `generate-cases.mjs` | Builds `cases.json` from fixtures + Stage-4 seeds (run once; deterministic) |
| `run-eval.mjs` | A/C vs human labels + repair eval + honest B/D NOT RUN (no build step) |
| `validate-study.mjs` | Self-check: every case shape + balance rules + annotation shapes |
| `annotations/` | Runtime data (UI-owned live maps, snapshots, results) — not implementation |

## Dataset

- Seed `20261103`, `datasetVersion: study-v1`, order `S01..S27`.
- S01–S17: all 17 Stage-4 clean BEFORE decks (`planCompositions` + `layoutDeck`
  seed 42), origin `original`.
- S18–S22: deck-seed known-defects — headline (F02 demote-primary),
  number-scale (F15/swiss), grouping-swap (F04), clip on dense-KO (F12),
  contrast (F08). Every seed self-verified its predicate; inapplicable seeds
  fail loudly instead of being forced.
- S23–S24: narrative-seed known-defects — grouping (F02 dangle-group),
  headline (F04 primary-on-caption). EXCLUDED from human annotation
  (`status: excluded`): intent-only mutations render byte-identical to the
  clean decks, so blind reviewers cannot distinguish them. Kept for
  model-side Arm A use; server, finalize gate, and run-eval skip them.
- S25: intentional-crop disputed (F13 clip seed on a `deliberateCrop` block).
- S26–S27: known-good minimal slides (F16 under swiss/document, arms silent).
- `expected` / `defectSeed` / `origin` are server-side only — never served to
  the client before finalize (client-safe projection strips them).

## Prereqs

Built dists (read-only reuse; this study adds no build step):

```sh
npm run build -w @typodeck/core
./node_modules/.bin/tsc -p evals/hierarchy/tsconfig.json
```

Requires the Stage-4 `../dist/*.js` builders and the core `dist` critic /
revise / export / validate modules.

## Regenerate

```sh
node evals/hierarchy/study/generate-cases.mjs [--out <cases.json>]
node evals/hierarchy/study/validate-study.mjs --cases evals/hierarchy/study/cases.json
```

Deterministic: same seed, same bytes (no wall-clock in case data).

## Run the eval

```sh
node evals/hierarchy/study/run-eval.mjs \
  --reviewer <id> \
  --cases evals/hierarchy/study/cases.json \
  --annotations <finalized-snapshot.json> \
  --out <results.json>
```

- Exit 0 + one-line JSON summary
  `{arms:{A:'RUN',B:'NOT RUN',C:'RUN',D:'NOT RUN'}, cases:n}`.
- Exit 2 on missing/unfinalized input with a reason on stderr.
- Per-case rows carry human labels, arm A/C findings + first-focus /
  rank-correlation / group-pair agreement, B/D NOT RUN + reason, and the
  repair eval on known-defect cases (critic detection, `reviseDeck` repair,
  re-render, re-evaluate, text parity, `validatePptx`, verdict).
- Aggregates only — no single combined score (Stage-4 rule).
- B/D are capability-probed and honestly NOT RUN: the core model provider
  is text-only (`complete(prompt)`), with no vision interface.

## Verify a snapshot

```sh
node evals/hierarchy/study/validate-study.mjs \
  --cases evals/hierarchy/study/cases.json \
  --annotations <snapshot.json>
```

`test-*` reviewer ids persist under `annotations/test/` and are excluded
from owner results (§S0). Synthetic verification snapshots are marked
`{"synthetic": true}` and are never human data.
