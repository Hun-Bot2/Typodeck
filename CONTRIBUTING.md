# Contributing to Typodeck

## Read first

- [`docs/PRD.md`](docs/PRD.md) — what the product must and must not do (§7 out-of-scope is binding)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — pipeline, schema, layout engine, provider rules
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — typography-only allow/forbid lists
- [`docs/EVALUATION.md`](docs/EVALUATION.md) + [`evals/summary.json`](evals/summary.json) — how quality is measured

## Setup

```sh
git clone https://github.com/Hun-Bot2/Typodeck.git
cd Typodeck
npm ci            # Node.js 20+
```

## Commands

| Command | Purpose |
|---|---|
| `npm run build -w @typodeck/core` | Compile core (`tsc`, strict) |
| `npm test` | Build core, then `node --test` over `dist/tests/` — must be all green |
| `npm run deck -- --idea-file F --system swiss --out d.pptx` | End-to-end CLI check (also `--idea "..."`, `--repo owner/repo`) |
| `npm run samples` | Fixed 7-slide decks per system; byte counts must not drift silently |
| `npm run dev` | Web Studio on `http://localhost:3000` |
| `npm run eval -- --fixture F4` | Offline eval subset; full matrix needs GitHub quota |

## Non-negotiable gates

Every change to deck output must keep these green:

1. **Typography only.** The exporter calls `addText` (plus slide background fill) and nothing else — no `addShape`/`addImage`/`addTable`/`addChart`/`addMedia`. The validator scans PPTX XML for 13 forbidden element classes; any hit fails the deck.
2. **Evidence honesty.** No LLM in the default extraction path; numbers copied verbatim; number slides only from numeric claims with refs. Fallback output is always labeled `generated_by=fallback` — never present it as model inference.
3. **Geometry.** All text boxes in-bounds on the 16:9 canvas, 100% of characters editable, body contrast ≥ 4.5:1.
4. **Determinism.** Same input + seed → same geometry. Byte drift in `npm run samples` output needs an explanation, not a shrug.

## Conventions

- TypeScript `strict`; no new runtime dependencies without discussion (current core deps: `pptxgenjs`, `jszip`).
- Tests live in `packages/core/tests/`, run offline via injectable `fetch` (see `fake-fetch.ts`), and execute from `dist/` after build.
- Network code takes an injectable fetch implementation so tests never touch the network.
- Typed errors with stable codes (`idea-length`, `private-repo`, `rate-limited`, …); API routes map codes to HTTP statuses — keep the map in sync.
- Never log secrets: endpoint hosts and latencies go in metadata, API keys never do.

## What not to commit

`node_modules/`, `dist/`, `.next/`, `output/`, `evals/reports/*.pptx`, `.env*` (all gitignored). Eval `.pptx` artifacts stay local; per-run JSON reports are the reviewable record.

## Pull requests

- One concern per PR; describe behavior change, not just files.
- Include: test results (`npm test`), a CLI receipt (`provider/claims/deck/validation` lines) when output changes, and updated docs when behavior or bounds change.
- If eval numbers move, say so with before/after from `npm run eval:report`.
