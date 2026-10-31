---
name: typodeck
description: Build typography-only pitch decks from a product idea or a public GitHub repo by orchestrating Typodeck Core (CLI, Studio API, validator) — never hand-drawn slides. Use when the user asks for a pitch deck, slide deck, PPTX, Demo Day or investor materials, or names Typodeck.
---

# Typodeck Skill

You build typography-only pitch decks by ORCHESTRATING Typodeck Core.
You never lay out slides yourself, never emit PPTX XML, never invent numbers.

Announce first: "Following the Typodeck Skill: <idea|repo> mode, <systems>, provider <muse|fallback>, pipeline <baseline|improved>."

Supporting files (read on demand, not all at once):

- `composition.md` — classify content, choose compositions, justify emphasis.
- `optical.md` — bounded optical corrections and visual-review rules.
- `revision.md` — critic checks, failure classes, bounded revision, uncertainty.
- `evaluation.md` — benchmark, blind A/B protocol, rubric, honest reporting.
- `research-index.md` — where each research principle lives (never paste the corpus).
- `purposes.md` — 10 purpose presets, 16-dim semantic model, legacy mapping.
- `visual-systems.md` — registry, Slide Markdown/IR, research import, benchmark.
- `density.md` — speaker-led vs reading-first policies, readable floors.

## 1. Inputs

- Idea mode: 100–20,000 chars of product description (else `idea-length`).
- Repo mode: public `owner/repo` (private → `private-repo`). Fetch bounds: ≤20 files, ≤200 KB, ≤5 code files, 30 s.
- System: `editorial` | `swiss` | `expressive`. Purpose: `--preset P01..P10`
  (or legacy `hackathon` | `competition` | `showcase`, frozen arcs —
  `showcase` is NOT P04). Lang: `en` | `ko`.

## 2. Workflow (CLI-first; the Studio API is the same pipeline over HTTP)

1. Build once: `npm run build -w @typodeck/core`
2. Idea: `npm run --silent deck -- --idea-file idea.txt --system <id> --out <file>.pptx`
   Repo: same with `--repo owner/repo` instead of `--idea-file` (`--idea "..."` also works).
   Add `--preset P01..P10` for purpose-aware narrative (default: legacy frozen arc).
   Driving conversationally? Batch ALL missing inputs in ONE message
   (≤3 questions: purpose, length/content, density); otherwise proceed
   on stated assumptions — never interrogate step by step.
3. Improved pipeline (composition + art direction + optical + critic): use the
   programmatic API — `planCompositions`/`planArtDirection` → `layoutDeck`
   with `compositionPlan` → `applyOpticalCorrections` → `critiqueDeck` /
   `reviseDeck` (see `composition.md`, `optical.md`, `revision.md`).
4. Benchmark (paired baseline vs improved on held-out ideas):
   `node packages/core/dist/scripts/benchmark-90.js --out output/benchmark-90`
5. Read receipts: `provider:`, `claims:`, `quality:`, `deck:`, `warning:` lines,
   `validation: OK`. Ship only on `validation: OK` (exit 0).

### Studio API (generate → select → export)

- `POST /api/generate` `{mode, input, purpose?, lang?}` → `{narrative, decks, provenance}`
  (all 3 systems over the SAME narrative; or SSE stage events).
- `POST /api/export` `{narrative, system, generatedBy?}` → `.pptx` attachment.
  The server re-lays-out from the narrative; client geometry is never trusted.
- Programmatic equivalents: `planDeck(s)`, `layoutDeck`, `exportToPptxBuffer`,
  `validatePptxBytes`, plus the improved-pipeline functions in §2.3.

## 3. Absolute constraints — typography only (DESIGN_SYSTEM.md)

Allow: editable text/numbers; family/size/weight; tracking; leading; left/center/right
alignment; whitespace; solid text + slide colors; editorial text-box composition.
Forbid: rectangles/cards/panels, borders, rules/arrows, icons/emoji, images,
rasterized/outlined text, gradients/shadows/textures. Theme tokens only (no ad-hoc
colors), body contrast ≥ 4.5:1, 16:9 canvas, margins ≥ 0.5 in.
If asked for a forbidden element: refuse that element, offer the typographic equivalent.

## 4. Narrative intelligence (semantics.ts + narrative.ts + quality.ts)

- Evidence kinds: `verified` = code-confirmed; `suggestion` = README/docs
  (upgraded only on code confirmation); `ungrounded` = idea text.
- 8 frozen dimensions (legacy) + 8 preset-only dims = 16 (`purposes.md`);
  5 lifecycle states; deprecated claims never headline.
- Numbers verbatim with refs; versions/years/hashes never heroes.
- Audience arcs + compact status captions; zero fabricated refs.
- Quality Gate is advisory (`pass|review` + warnings). Never sacrifice factual
  accuracy for visual appeal.

## 5. Provider and fallback labeling (provider.ts)

- `muse` iff BOTH `TYPOdeck_MUSE_ENDPOINT` and `TYPOdeck_MUSE_API_KEY` are set
  (key sent as Bearer [REDACTED] never logged). Otherwise deterministic `fallback`.
- Always report provider + claim counts + warnings. Never present fallback output as model inference.

## 6. Errors — surface the typed code plus the fix, never retry blindly

- CLI exit 2: usage. `idea-length` · `private-repo` / `not-found` ·
  `rate-limited` (wait/retry once; else README-only degrade) · `timeout` /
  `network` · `too-large` · `invalid-input` · `invalid-system` ·
  `invalid-narrative` · `body-too-large` · `layout-failed` ·
  `export-validation-failed` (do not ship; report the errors).
- API status map: `not-found`→404, `private-repo`→403, `rate-limited`→429,
  `too-large`/`body-too-large`→413, `network`→502, `timeout`→504, `invalid-*`→400,
  `internal`/`layout-failed`/`export-validation-failed`→500.

## 7. Worked examples (rerun: `skills/typodeck/EXAMPLES.sh [OUT]`)

- Ex1 idea → 3 systems → export (6 slides / 22 boxes each, `validation: OK`).
- Ex2 repo → grounded deck (38 claims, 12 slides, `validation: OK`).
- Ex3 eval re-run: `eval -- --fixture F4` (offline 6/6 OK) + `eval:report`.
- Ex4 benchmark: 8 held-out ideas × 3 systems × 2 modes = 48 PPTX + `summary.json`
  with paired deltas (see `evaluation.md`).

## 8. Health checks

- `npm run --silent test` — whole core suite green (248 at writing, incl.
  preset/markdown/registry/import/review/density/notes tests).
- Honest-skip rule: any QA layer that cannot run must report
  `SKIPPED: <layer> (<reason>)` — never silent green, never a
  guessed pass.
- Every `.pptx` ships only with `validation: OK`: 0 forbidden objects, all boxes in-bounds, 16:9.
- Report uncertainty: unmeasured items (font substitution, real wrap, clipping,
  vision scores) are named in critic output — never claim them as verified.

## 9. Portability

`SKILL.md` + supporting `.md` files + `EXAMPLES.sh`; shell + HTTP only, no
harness-specific calls. Loads as project skills in Muse Code, Codex, and
Claude Code (`skills/typodeck/`).
