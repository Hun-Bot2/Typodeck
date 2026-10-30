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

## Phase 4 — Evaluation (2026-10-30)
- Re-pinned `evals/fixtures.json` live via the GitHub API (`npm run
  eval:fixtures`): F1 sindresorhus/is@main, F2 tj/commander@master, F3
  iamkun/dayjs@dev all resolve with default branches unchanged, READMEs
  present (2974/12/530 words), and HEAD SHAs identical to the Phase 2 pins
  (no drift; `pinned_at=2026-10-30`). F4 kept as the inline/recorded 477-word
  idea text. One transient `fetch failed` on F1 needed a single retry.
- Implemented `packages/core/scripts/eval.ts` (single CLI, `require.main`
  guard so tests can import its pure helpers) and wired the EVALUATION.md
  §4 interface at root: `eval:fixtures` (re-verify + refresh SHAs, optional
  `--token-env` for authed quota), `eval` → `eval.js run [--lang ko|en|all]
  [--direction <id>|all] [--fixture F1] [--seed 42]`, `eval:report` →
  `evals/summary.json`. Per run: `planDeck` (pinned branch, live GitHub for
  F1–F3 with core bounds; recorded text for F4) → `exportToPptxBuffer` →
  `validatePptxBytes` → metrics. Per-run JSON + `.pptx` under `evals/reports/`
  record fixture, pinned/observed SHA, direction, lang, provider, seed, and
  all metric values.
- Metric semantics (documented in the script header; EVALUATION.md names no
  diversity thresholds): forbidden = validator "forbidden element" hits (0);
  editability = editable/total `a:t` chars with `noTxEdt` shapes counted
  non-editable (1.0); overflow = "exceeds slide bounds" hits (0 — the layout
  engine fits every box, so no separate clip detector exists); evidence
  coverage = factual (verified+suggestion) claims with ≥1 valid ref
  (ingested path + in-bounds lines) / all factual claims; unsupported =
  factual claims with no valid ref (repo) / fabricated (non-idea.txt) refs +
  unlabeled captions (idea, both 0); diversity per (fixture, lang) pair =
  ≥2 of {blocks-mean Δ≥0.5, headline-median rel-Δ≥15%, alignment-mix L1≥0.2};
  latency = `planDeck` wall ms; success = completed + ≥5 slides + PPTX bytes
  + structural validation ok.
- Ran the full live matrix 4×2×3 = 24 runs, seed 42, provider fallback
  (no `TYPOdeck_MUSE_*` env set): first pass 19/24 in 9.5 s, then GitHub
  unauthenticated quota hit 0 and 5 F3 runs failed honestly with
  `IngestionError: repo metadata HTTP 403` (typed, recorded in per-run
  JSON); after the quota reset the 6 F3 runs re-ran green in 6.0 s.
  `npm run eval:report` → OVERALL PASS: S1 24/24 (100.0%) ≥90%;
  S2 180/216 repo slides (83.3%) ≥80% (cover+closing carry no refs by
  design: 10/12 per deck; content slides 180/180 = 100%); S3 max 0/deck ≤1;
  S4 max 0; S5 min 100.00%; S6 max 0; S7 p95 1814 ms, max 4679 ms ≤120 s.
  Diversity 24/24 pairs pass, every pair differing in exactly headline size
  + alignment mix (blocks-per-slide is identical across systems because
  layout preserves narrative block counts 1:1 — recorded, not tuned).
  Idea mode: 0 fabricated refs, 0 unlabeled captions over 6 runs. No SHA
  drift (observed == pinned on all 18 repo runs). F3 hit the 20-file ingest
  cap (warning recorded); F1/F2 stayed within bounds.
- Tests: new offline `tests/eval.test.ts` (10 tests: percentile/median,
  caption parsing incl. KO, ref validation, diversity math, editability
  split); full suite 75/75 green (65 baseline + 10). Arg passthrough
  `npm run eval -- --lang ...` verified (invalid value reaches the parser
  and fails before any network).
- Commands run: `npm run eval:fixtures`, `npm run eval` (full matrix),
  `npm run eval -- --fixture F3` (post-reset rerun), `npm run eval:report`.
  Seed/provider notes: fixed seed 42 passed to `planDeck` for layout
  determinism; provider resolved to `fallback` on every run (labeled in
  each report); live-network latencies are honest per-run measurements.
- No commits (parent commits after review).

## Skill — Typodeck Agent Skill (2026-10-30)
- Verified Skill conventions without touching other agents' stores: read one
  bundled Muse skill body via the skill catalog (`SKILL.md` + YAML frontmatter
  `name`/`description`, one directory per skill under `skills/`) and confirmed
  the `skills/<slug>/SKILL.md` layout. Read the Athos repo README only, as an
  architectural reference for portable know-how + own-benchmark practices; no
  code copied, no dependency added.
- Authored `skills/typodeck/SKILL.md` (~125 lines): trigger, announce line,
  CLI-first workflow orchestrating Core (`npm run deck`, `/api/generate` +
  `/api/export` contracts, `planDecksAll`/`layoutDeck`/`exportToPptxBuffer`/
  `validatePptx`), typography-only allow/forbid lists, evidence-grounding
  rules, provider/fallback labeling, typed error codes + API status map, and
  three worked examples with observed outputs. Portable: shell + HTTP only.
- Authored `skills/typodeck/EXAMPLES.sh` (executable transcript) and ran it
  end-to-end: PASS examples=5 skipped=0. Ex1 idea→3 systems (6 slides/22
  boxes each, ~87 KB, byte-identical reruns, `validation: OK`); Ex2 live repo
  sindresorhus/is (38 claims: 29 verified/9 suggestion, 12 slides/46 boxes,
  135592 B, `validation: OK`); Ex3 `eval -- --fixture F4` 6/6 OK (offline,
  seed 42) + `eval:report` OVERALL PASS (S1–S7 match the Phase 4 pins).
  Ex2 skips honestly on GitHub quota 0; Ex3 skips when the Phase 4 scripts
  are absent, so the transcript also passes on the committed baseline.
- Verification notes: every cited command was run in this session. The
  `/api/*` path was verified at the function level (`planDecksAll` →
  `layoutDeck` → `exportToPptxBuffer` → `validatePptxBytes`, 86641 B, valid);
  HTTP framing relies on the Phase 3 observed probes (dev-server `listen()`
  is sandbox-blocked and the unsandboxed start produced no output). `npm run
  --silent test` 75/75 green. Artifacts under `/tmp/typodeck-skill/`.
- No commits (parent commits after review).
