# @typodeck/core

Typodeck's shared pipeline engine: ingestion, evidence, narrative,
layout, PPTX export, validation, plus the CLI and eval scripts. The
root CLI (`npm run deck`), the Web Studio API, and the agent Skill all
drive these modules — see `docs/engineering/decisions/ADR-0003-shared-engine.md`.

## Modules (`src/`)

| Module | Responsibility |
|---|---|
| `ingestion.ts` | Bounded repo fetch (≤20 files / ≤200 KB / ≤5 code files / 30 s) or pasted-text accept (100–20,000 chars); typed errors |
| `evidence.ts` | Atomic claims: `verified` / `suggestion` / `ungrounded`; verbatim numbers; caps 24/file, 60 total |
| `semantics.ts` | Deterministic analysis: 8-dimension rank, 5-way lifecycle, hero validation, redundancy, audience parsing |
| `narrative.ts` | 5–12 slide outline, audience arcs, purpose presets, compact captions; `planDeck` / `planDecksAll` |
| `purposes.ts` | Purpose presets P01–P10 (v1.0.0) + frozen legacy arcs |
| `layout.ts` | Seeded deterministic geometry per system (content-hash seed; pure function) |
| `systems.ts` | Shipped typography: role scales, rhythm, margins, palettes |
| `visual-systems.ts` | Versioned registry: 3 production + `document` experimental; fail-loud unknown systems |
| `composition.ts` | 31-candidate composition grammar + deck-aware deterministic selection |
| `optical.ts` | Bounded optical corrections (O1/O2) + scorers; every fix has rationale + bound + test |
| `art-direction.ts` | Density/emphasis annotation + bounded re-selection |
| `critic.ts` | Structural checks + labeled proxies + bounded (≤3) revision loop; content never rewritten |
| `quality.ts` | Advisory Narrative Quality Gate (`pass|review` + warnings; never fails a build) |
| `slide-markdown.ts` / `slide-ir.ts` | Editable Slide Markdown v1 + versioned Slide IR v1; notes flow to native PPTX notes |
| `export.ts` | `addText`-only PPTX (+ background fill); file and buffer variants |
| `validate.ts` | Structural gates: forbidden objects, bounds, editability floor, 16:9 |
| `provider.ts` | Env-gated model provider + labeled deterministic fallback |
| `research-import.ts` | Experimental-only candidate import (no registry write) |
| `visual-review.ts` | Structural equivalence helpers for review tooling |
| `sample.ts` / `schema.ts` | Fixed sample narrative / restricted text-only schema + validation |

## Scripts

| Command | Purpose |
|---|---|
| `npm run build -w @typodeck/core` | `tsc -p tsconfig.json` (strict) |
| `npm test` | Build, then `node --test` over `dist/tests/` — 270/270 green on this baseline |
| `npm run deck -- --idea-file F --system swiss --out d.pptx` | End-to-end CLI (`--idea`, `--repo`, `--preset P01..P10`, `--lang` also supported) |
| `npm run samples` | Fixed 7-slide decks per system (all four) |
| `npm run eval -- --fixture F4` | Offline eval subset; full matrix needs GitHub quota |
| `npm run eval:report` | Aggregate `evals/reports/` into `evals/summary.json` |
| `npm run journey` | Live repo→deck→export end-to-end (exits 2 without quota/network) |

Receipts print `provider:`, `claims:`, `quality:`, `deck:`,
`warning:` lines and `validation: OK`. Ship only on `validation: OK`
(exit 0). Dependencies: `pptxgenjs`, `jszip` (+ `@types/node`,
`typescript` dev).
