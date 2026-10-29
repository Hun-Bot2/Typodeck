# Typodeck — Implementation Log

## Phase 0 — Specifications (2026-10-30)
- Authored `docs/PRD.md`: two input modes, 7 measurable success criteria (S1–S7),
  explicit out-of-scope (no DB/auth/cloud/microservices).
- Authored `docs/ARCHITECTURE.md`: Next.js monolith, 8-module pipeline, shared
  presentation schema, deterministic layout engine, Meta Muse provider + labeled
  deterministic fallback, bounded GitHub retrieval (≤20 files/200 KB).
- Authored `docs/DESIGN_SYSTEM.md`: typography-only constraint with allow/forbid
  lists, three direction systems, 16:9, KO/EN overflow + font fallback rules.
- Authored `docs/EVALUATION.md`: 4 fixtures, 7 metrics with pass thresholds,
  reproducible eval commands.
- No code written; no commits (parent commits after review).

## Phase 1 — Typography Core (2026-10-30)
- Scaffolded `packages/core` (TypeScript, pptxgenjs, jszip; `npm run build/test/samples` from root).
- Implemented restricted text-only schema (`schema.ts`), three typography systems
  (`systems.ts`), deterministic seeded layout engine (`layout.ts`), addText-only
  PPTX exporter (`export.ts`), structural PPTX validator (`validate.ts`).
- Fixed 7-slide EN/KO sample narrative; `npm run samples` emits three editable
  PPTX decks (editorial 93975 B, swiss 93508 B, expressive 94078 B), all passing
  structural validation (0 forbidden objects, 24/24 text boxes in-bounds, 16:9).
- Tests: 20/20 pass across 4 suites (schema, layout, export+validation, contrast).
- Review fixes by parent: expressive kicker on light alt slides was 1.28:1
  (yellow on paper) → now uses dark ink token; validator forbidden-tag scan
  extended (grpSp, chart, tbl, blipFill, pattFill, VML); added WCAG AA 4.5:1
  contrast regression test for every block.
- Known gaps carried forward: font-embedding licenses unverified; Meta Muse
  provider API shape unverified; eval fixtures unpinned (Phase 2).
