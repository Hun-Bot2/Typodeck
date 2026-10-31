# Architecture (implemented)

Revision: `e610736`. Verified against `packages/core/src/*.ts` bodies and
the 270-test suite. Deterministic unless marked otherwise.

## Pipeline

```text
Input → Ingestion → Evidence → Narrative → Slide IR → Composition/Layout → Validate → Export
 idea | repo    bounded    graded     5–12 slides   v1.0.0    3 planners   struct   PPTX/HTML
```

Entry points: `planDeck` / `planDecksAll` (`narrative.ts`), CLI
(`scripts/make-deck.ts`), Studio API (`POST /api/generate` → `/api/export`),
Skill (`skills/typodeck/EXAMPLES.sh`).

## Stages

1. **Ingestion** (`ingestion.ts`) — idea text (100–20,000 chars) or public
   GitHub repo. Bounds: ≤20 files, ≤200 KB total, ≤5 code files × 10 KB,
   30 s timeout, default branch only, README > docs > code priority.
   Private repos rejected (`private-repo`). Rate limits: one retry when
   GitHub sends `retry-after`; README-only degrade explicitly flagged
   `degraded:true` with warning; exhaustion raises typed `rate-limited`
   with `resetAt`. Fetch is **unauthenticated** (no caller passes
   `authToken`). External service: api.github.com (network).
2. **Evidence** (`evidence.ts`) — deterministic sentence claims (cap 40),
   graded `verified` (code) / `suggestion` (docs) / `ungrounded` (idea).
   Numbers stay verbatim with references; code terms upgrade grades;
   rephrase guard. No model inference in this stage.
3. **Narrative** (`narrative.ts`) — 5–12 slides: cover, ≤2 number slides
   (verified-first), claim slides, proposals, closing. Purpose presets
   P01–P10 (`purposes.ts`, versioned) or legacy arcs. Provenance records
   provider + `generatedBy`. Does **not** author speaker notes.
4. **Slide IR** (`slide-ir.ts`, `SLIDE_IR_VERSION = '1.0.0'`) — validated,
   system-independent slide content contract. Optional `notes` field is
   metadata only, never rendered. Renderer-independent: HTML and PPTX
   consume the same IR.
5. **Composition + layout** (`composition.ts`, `layout.ts`) — pure
   `(narrative, system) → deck`, seeded FNV + mulberry32, 10 shrinking
   size-scales to overlap-free. Three planners: editorial
   (asymmetric-stack), swiss (4-column grid), expressive (centered-hero);
   `document` (technical-manual) experimental. 5 text roles
   (kicker/title/body/number/caption), flat backgrounds, CJK-aware fit,
   WCAG AA contrast. Optical corrections (`optical.ts`) are bounded
   deterministic adjustments, not a model.
6. **Validate** (`validate.ts`) — unzips PPTX, asserts 16:9, zero
   pic/chart/table/gradient/group, rect-only in-bounds shapes, editable
   `a:t` chars with `expectedMinChars` floor, rejects `noTxEdt` locks.
7. **Export** (`export.ts`) — `addText` + background fill only; `notes`
   passthrough to native notes part; file + buffer variants with
   slide/text-box counts. HTML preview (`SlideView.tsx`) is a separate
   renderer — **not** proof of PPTX fidelity (see ADR-0007).

## Providers

`provider.ts`: `DeterministicFallback` unless **both**
`TYPOdeck_MUSE_ENDPOINT` and `TYPOdeck_MUSE_API_KEY` are set (optional
`TYPOdeck_MUSE_MODEL`, default `muse-spark`). Fallback output is labeled
`generated_by=fallback`. Keys travel env-only, never in logs/meta.

## Data contracts

- `Deck`: `meta{title,lang,system,seed,generatedBy}` + slides on a
  13.33×7.5 in canvas, blocks + flat background only (`schema.ts`).
- CLI receipt: `provider / claims / quality / deck / validation` lines,
  exit 2 usage, 1 failure.
- Eval matrix: `evals/fixtures.json` → `evals/reports/<F>-<lang>-<system>.{json,pptx}`
  → `evals/summary.json` (S1–S7 + diversity).
