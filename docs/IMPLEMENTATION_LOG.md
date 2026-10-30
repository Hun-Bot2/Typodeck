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

## Phase 3 — Web Studio (2026-10-30)
- Core additions (all covered by tests): `planDecksAll` in `narrative.ts`
  (one ingestion→evidence→narrative run, then `layoutDeck` x3 over the SAME
  narrative for comparable previews; optional `StageCallback` reports
  ingest→evidence→narrative→layout for SSE progress; `planDeck` refactored
  onto the same shared run, behavior unchanged), `exportToPptxBuffer` in
  `export.ts` (in-memory bytes via `write({outputType:'nodebuffer'})`, same
  builder as the file exporter), `validatePptxBytes` in `validate.ts`
  (`validatePptx` now delegates to it).
- Scaffolded `apps/web` (`@typodeck/web`, Next.js 16 App Router + React 19 +
  TypeScript, npm workspaces; no DB/auth/cloud/component library; one global
  stylesheet, hand-set type). Root `package.json`: `workspaces` +=
  `apps/web`, new `dev` script forwarding to the web workspace, `build` now
  builds core then web. `.gitignore` += `.next/`.
- UI (taste-governed chrome: serif display + system sans, one brick accent,
  no gradients/glass/icons/emoji): source form (idea textarea with char
  count, repo field, purpose + language selectors, auto-detected mode line),
  live server-driven stage list over SSE, provider badge + `generated_by`
  label + claim counts + warnings, three stacked system previews (no card
  grid) each with an HTML/CSS text filmstrip (absolutely-positioned text
  divs scaled from inch geometry via container-query units — no canvas, no
  decorative shapes), selectable system with large keyboard-navigable viewer
  (prev/next, counter, thesis + caption refs), `.pptx` download button.
  Labels, focus states, aria-live regions, and `prefers-reduced-motion`
  included; single-column responsive layout.
- API: `POST /api/generate {mode,input,purpose,lang}` → `{narrative, decks,
  provenance}` as JSON, or `text/event-stream` (stage events + result/error)
  when requested; `POST /api/export {narrative, system, generatedBy?}` →
  `.pptx` attachment, re-laying-out server-side from the posted narrative
  (client geometry never trusted; unknown systems and invalid narratives
  rejected with typed 400s; export fails loudly on validation failure).
  Bounds: 64 KB body cap on generate, 512 KB on export, 60 s repo-fetch
  timeout inside a 115 s request race, `maxDuration = 120`.
- Verification (all observed, dev server on 127.0.0.1:3000): `next build`
  passes (routes `/`, `/api/generate`, `/api/export`); `POST /api/generate`
  with the F4 fixture idea → 200, 3 decks x 12 slides x 46 boxes, identical
  slide ids, provenance fallback/12 ungrounded/2 warnings; SSE variant emits
  ingest→evidence→narrative→layout x3 then a 45,846-char result;
  `POST /api/export` (swiss) → 135,803 bytes, `Content-Disposition:
  attachment`, `validatePptx` OK (12 slides, 46 text shapes, 2431 editable
  chars, 13.33x7.5); error paths return typed codes (`idea-length`,
  `invalid-input`, `invalid-system`, `invalid-narrative`, live `not-found`).
  Full suite 65/65 (63 baseline + 2 new `decks-all` tests).
- Environment note: the sandbox blocks `listen()`, so the dev server was
  run unsandboxed for probes only; macOS has no `setsid`, so no detached
  server was left running. `npm` needed `NPM_CONFIG_CACHE=/tmp/...` (the
  default cache dir is unwritable).
- No commits (parent commits after review).
