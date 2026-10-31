# Evidence traceability

Every externally visible Typodeck claim, mapped to its source and
verification. Status legend: **verified** (observed on this branch),
**code-read** (implementation inspected, behavior not executed here),
**frozen** (pinned bytes, generator outside this branch),
**unsupported** (must not be claimed).

## Pipeline and product

- Idea/repo inputs with stated bounds → `packages/core/src/ingestion.ts`
  (L9-371 bounds; `parseRepoInput`), `make-deck.ts` usage. **Verified**
  (idea + repo runs executed; repo run live 2026-10-31).
- Claim grading verified/suggestion/ungrounded, verbatim numbers, illustrative
  labeling → `packages/core/src/evidence.ts`,
  `packages/core/tests/evidence.test.ts`. **Verified** (270/270 suite).
- 5–12 slide narratives, fallback-labeled → `packages/core/src/narrative.ts`,
  `tests/narrative.test.ts`, `tests/pipeline.test.ts`. **Verified**.
- Seeded overlap-free layout, 3 planners, CJK-aware fit →
  `packages/core/src/layout.ts`, `tests/layout.test.ts`. **Verified**.
- 3 production systems + experimental `document` →
  `packages/core/src/systems.ts` (`SYSTEM_IDS`, `status: 'experimental'`),
  `packages/core/src/visual-systems.ts`. **Verified** (registry read; eval
  Ex3 exercised `document`).

## Output guarantees

- addText-only PPTX, native editable runs, 16:9, zero forbidden shapes →
  `packages/core/src/export.ts`, `packages/core/src/validate.ts`,
  `tests/export.test.ts`. **Verified** (fresh deck: 5 slides, 17 shapes,
  845 editable chars, `ok:true`; `a:t` runs + empty media dirs inspected).
- WCAG AA contrast → `packages/core/tests/contrast.test.ts`. **Verified**
  (in-suite).
- Speaker notes pass through to native notes part; nothing authors note
  content → `export.ts` L77-79 writes `slide.notes`; `narrative.ts` contains
  no notes generation; PRD scope line. **Code-read** (no live notes run).
- Rate limits: single retry on `retry-after`, README-only degrade flagged
  `degraded:true` with warning, exhaustion as typed `rate-limited` + resetAt
  → `packages/core/src/ingestion.ts` L4-11, L92-93, L473-497.
  **Code-read** (quota paths not triggered live).

## Surfaces

- CLI `deck` (idea/repo/idea-file, system, out, purpose, preset, lang) →
  `packages/core/scripts/make-deck.ts`. **Verified** (both modes executed).
- Studio `/` + `/api/generate` + `/api/export` (+ catalog, evidence,
  markdown) → `apps/web/`. **Verified** (`/` 200, generate 200 + 5-slide
  narrative on production build; export route code-read, same tested core).
- Skill as portable project skill; EXAMPLES.sh passes; not
  marketplace-listed → `skills/typodeck/`. **Verified** (transcript exit 0;
  no marketplace manifest found anywhere in tree).

## Evaluation and research

- 270/270 tests, 72 suites → observed `node --test` on this branch.
  **Verified** 2026-10-31. (Other counts in older docs are superseded.)
- Phase-4 eval 24/24, S2 144/180 (80.0%), S7 p95 204 ms →
  `evals/summary.json` on this branch. **Verified** (file read; run
  reproducible via `npm run eval`).
- 447-reference registry, 0 dupes, gallery 26 items →
  `research/`, `gallery/`. **Verified** (`validate.py` exit 0 in the
  review-assets checkpoint; bytes overlaid unchanged).
- Showcase decks + previews → `showcase/decks/`, `previews/`, manifests.
  **Frozen** (genuine outputs; claim counts re-observed live for is@ only).
- Benchmark-90 human protocol, ballots, A/B wins, 90+ score, pixel proof →
  `evals/benchmark-90/`. **Unsupported** (protocol pending, zero ballots;
  must not be claimed).

## Known stale figures (do not cite)

- Showcase manifest Deck 1 receipt (7 files / 38 claims / 29 verified):
  superseded by two live runs (56/47) on current code.
- Comms-eval figures S2 180/216, S7 p95 1.8 s: from a different run;
  this branch's summary reads 144/180 and p95 204 ms.
- Any test count other than 270/270 for this branch.
