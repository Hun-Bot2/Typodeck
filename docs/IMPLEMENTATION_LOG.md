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

## Phase 2 — Narrative + Ingestion (2026-10-30)
- Added `packages/core/src/provider.ts`: `ModelProvider` interface,
  `MetaMuseProvider` (OpenAI-compatible chat-completions POST, active ONLY
  when BOTH `TYPOdeck_MUSE_ENDPOINT` + `TYPOdeck_MUSE_API_KEY` are set; meta
  records host/model/latency, never the key) and `DeterministicFallback`
  (pure template planner, every output labeled `generated_by=fallback`).
- Added `packages/core/src/ingestion.ts`: `fetchRepo` (default branch, README
  first, bounded: ≤20 files / ≤200KB / ≤5 code files à 10KB / 30s timeout,
  403-429 back-off then README-only degrade or typed error, private rejected,
  injectable fetch) and `acceptIdea` (100–20,000 chars, typed errors).
- Added `packages/core/src/evidence.ts`: deterministic `extractClaims`
  (code=verified, README/docs=suggestion upgraded on code confirmation,
  idea=ungrounded; numbers copied verbatim from source with refs) plus
  opt-in `rephraseClaims` that preserves refs and drops phrasings that alter
  numbers. No LLM in the default extraction path.
- Added `packages/core/src/narrative.ts`: `planNarrative` (5–12 slides, one
  thesis each, number slides only from numeric claims with refs,
  ungrounded/proposal captions labeled) and `planDeck` (ingestion→evidence→
  narrative→layout→validate; fallback decks labeled `generatedBy=fallback`).
- Added `packages/core/scripts/make-deck.ts` CLI (`--repo/--idea/--idea-file`,
  `--system`, `--out`, `--purpose`, `--lang`); wired `npm run deck`. Prints
  provider + warnings; exit 1 on failure, 2 on usage error.
- Investigated the public Meta Muse endpoint (see `docs/MUSE_PROVIDER.md`):
  Meta Model API docs exist at dev.meta.ai and third parties report an
  OpenAI-compatible `api.meta.ai/v1`, but no live call was verifiable without
  a key — so the provider is env-gated and all runs use labeled fallback.
- Pinned `evals/fixtures.json`: F1 sindresorhus/is@main, F2 tj/commander@master
  (Ruby), F3 iamkun/dayjs@dev, F4 inline 477-word idea; SHAs/branches/READMEs
  verified live via the GitHub API on 2026-10-30 (deviations noted inline).
- Tests: 5 new offline suites (43 tests) with recorded blobs under
  `packages/core/fixtures/`; full suite 63/63 green. CLI demos: idea mode all
  3 systems (12 slides, validation OK) + live repo mode vs sindresorhus/is
  (38 claims, 29 verified, validation OK). Phase 1 samples still byte-identical.
- Fix from live testing: test/spec files excluded from the code sample.
- No commits (parent commits after review).
