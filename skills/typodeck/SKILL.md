---
name: typodeck
description: Build typography-only pitch decks from a product idea or a public GitHub repo by orchestrating Typodeck Core (CLI, Studio API, validator) — never hand-drawn slides. Use when the user asks for a pitch deck, slide deck, PPTX, Demo Day or investor materials, or names Typodeck.
---

# Typodeck Skill

You build typography-only pitch decks by ORCHESTRATING Typodeck Core.
You never lay out slides yourself, never emit PPTX XML, never invent numbers.

Announce first: "Following the Typodeck Skill: <idea|repo> mode, <systems>, provider <muse|fallback>."
- `density.md` — speaker-led vs reading-first policies, readable floors.

## 1. Inputs

- Idea mode: 100–20,000 chars of product description (else `idea-length`).
- Repo mode: public `owner/repo` (private → `private-repo`). Fetch bounds: ≤20 files, ≤200 KB, ≤5 code files, 30 s.
- System: `editorial` | `swiss` | `expressive`. Studio purpose: `hackathon` | `competition` | `showcase`. Lang: `en` | `ko`.

## 2. Workflow (CLI-first; the Studio API is the same pipeline over HTTP)

1. Build once: `npm run build -w @typodeck/core`
2. Idea: `npm run --silent deck -- --idea-file idea.txt --system <id> --out <file>.pptx`
   Repo: same with `--repo owner/repo` instead of `--idea-file` (`--idea "..."` also works).
3. Read the CLI receipt: `provider:`, `claims: total/verified/suggestion/ungrounded`,
   `deck: N slides, M text boxes`, `warning:` lines, `validation: OK`.
4. Ship only on `validation: OK` (exit 0). Exit 1 = failure/validation error; exit 2 = usage error.

### Studio API (generate → select → export; HTTP-level proof in IMPLEMENTATION_LOG Phase 3)
   Driving conversationally? Batch ALL missing inputs in ONE message
   (≤3 questions: purpose, length/content, density); otherwise proceed
   on stated assumptions — never interrogate step by step.

- `POST /api/generate` `{mode, input, purpose?, lang?}` → `{narrative, decks, provenance}`
  (all 3 systems over the SAME narrative; or SSE stage events with `Accept: text/event-stream`).
  Caps: 64 KB body, 115 s request race, 60 s repo fetch.
- `POST /api/export` `{narrative, system, generatedBy?}` → `.pptx` attachment
  (`Content-Disposition`, `X-Typodeck-Slides`). The server re-lays-out from the narrative;
  client geometry is never trusted. Cap: 512 KB body.
- Programmatic equivalents (`@typodeck/core`): `planDecksAll`, `layoutDeck`,
  `exportToPptxBuffer`, `validatePptxBytes` / `validatePptx`.

## 3. Absolute constraints — typography only (DESIGN_SYSTEM.md)

Allow: editable text/numbers; family/size/weight; tracking; leading; left/center/right
alignment; whitespace; solid text + slide colors; editorial text-box composition.
Forbid: rectangles/cards/panels, borders, rules/arrows, icons/emoji, images,
rasterized/outlined text, gradients/shadows/textures. Theme tokens only (no ad-hoc
colors), body contrast ≥ 4.5:1, 16:9 canvas, margins ≥ 0.5 in.
If asked for a forbidden element: refuse that element, offer the typographic equivalent.

## 4. Evidence grounding (evidence.ts + narrative.ts)

- `verified` = code-confirmed; `suggestion` = README/docs (upgraded only on code
  confirmation); `ungrounded` = idea text.
- Numbers verbatim from source with refs; number slides ONLY from numeric claims with refs.
- Ungrounded/proposal captions stay labeled (`unverified` / `illustrative` / `proposal`).
  Zero fabricated refs, zero unlabeled captions.

## 5. Provider and fallback labeling (provider.ts)

- `muse` iff BOTH `TYPOdeck_MUSE_ENDPOINT` and `TYPOdeck_MUSE_API_KEY` are set
  (key sent as Bearer [REDACTED] never logged). Otherwise the deterministic `fallback`
  plans every deck, labeled `generated_by=fallback` / `generatedBy=fallback`.
- Always report provider + claim counts + warnings. Never present fallback output as model inference.

## 6. Errors — surface the typed code plus the fix, never retry blindly

- CLI exit 2: usage (exactly one of `--repo|--idea|--idea-file`, valid `--system`, `--out`).
- `idea-length` (fix length) · `private-repo` / `not-found` (fix repo) · `rate-limited`
  (wait/retry once; else README-only degrade) · `timeout` / `network` · `too-large` ·
  `invalid-input` · `invalid-system` · `invalid-narrative` · `body-too-large` ·
  `layout-failed` · `export-validation-failed` (do not ship; report the errors).
- API status map: `not-found`→404, `private-repo`→403, `rate-limited`→429,
  `too-large`/`body-too-large`→413, `network`→502, `timeout`→504, `invalid-*`→400,
  `internal`/`layout-failed`/`export-validation-failed`→500.

## 7. Worked examples (verified 2026-10-30; rerun: `skills/typodeck/EXAMPLES.sh [OUT]`)

Setup: the tool-library idea (390 chars, `idea.txt`) satisfies the 100–20,000 bound.

### Ex1 — idea → 3 systems → export

```sh
npm run --silent deck -- --idea-file idea.txt --system swiss --out $OUT/idea-swiss.pptx
# provider: fallback (generated_by=fallback)
# claims: total=4 verified=0 suggestion=0 ungrounded=4
# deck: 6 slides, 22 text boxes -> $OUT/idea-swiss.pptx
# warning: idea mode: all claims ungrounded; number slides labeled unverified/illustrative
# warning: built with the deterministic fallback (not model inference)
# validation: OK
```

Repeat for `editorial` and `expressive`: same 6 slides / 22 boxes each,
~87 KB per file (87177 / 86744 / 87258 B). Reruns reproduce identical slide XML;
only the `docProps/core.xml` created/modified timestamps differ (pptxgenjs behavior).

### Ex2 — repo → grounded deck

```sh
npm run --silent deck -- --repo sindresorhus/is --system editorial --out $OUT/repo-editorial.pptx
# provider: fallback (generated_by=fallback)
# claims: total=38 verified=29 suggestion=9 ungrounded=0
# deck: 12 slides, 46 text boxes -> $OUT/repo-editorial.pptx (135592 B)
# validation: OK
```

### Ex3 — eval re-run (needs the Phase 4 scripts; spec: EVALUATION.md §4)

```sh
npm run --silent eval -- --fixture F4   # offline idea fixture: 6/6 runs OK, seed 42
npm run --silent eval:report            # → evals/summary.json, OVERALL: PASS
# S1 24/24 (100%) · S2 180/216 (83.3%) · S3 max 0 · S4 max 0 · S5 min 100% · S6 max 0 · S7 p95 1814ms
```

## 8. Health checks

- `npm run --silent test` — whole core suite green (248 at writing, incl.
  preset/markdown/registry/import/review/density/notes tests).
- Honest-skip rule: any QA layer that cannot run must report
  `SKIPPED: <layer> (<reason>)` — never silent green, never a
  guessed pass.
- Every `.pptx` ships only with `validation: OK`: 0 forbidden objects, all boxes in-bounds, 16:9.

## 9. Portability

Single `SKILL.md` + `EXAMPLES.sh`; shell + HTTP only, no harness-specific calls.
The same files load as project skills in Muse Code, Codex, and Claude Code
(`skills/typodeck/`). No Athos dependency: the Athos README was used only as a
reference for portable know-how and own-benchmark practices.
