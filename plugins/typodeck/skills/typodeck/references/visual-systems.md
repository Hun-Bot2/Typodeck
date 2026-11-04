# Visual Systems Registry

Visual system defines HOW the narrative is expressed. It never changes
narrative order or factual content.

Source of truth: `packages/core/src/visual-systems.ts`.

## Registry systems (pinned, versioned)

| ID | Version | Status | Notes |
|----|---------|--------|-------|
| editorial | 1.0.0 | production | Serif-led hierarchy; unchanged geometry |
| swiss | 1.0.0 | production | Asymmetric grid, disciplined alignment |
| expressive | 1.0.0 | production | Expressive placement; unchanged geometry |
| document | 0.1.0 | experimental | Technical-manual voice: dense hierarchy-stack with meta column; provisional grammar (merged G4 stubs), no verbatim/monospace role, fixed two-zone geometry. Renderable via CLI/API but NOT production — say so when selected, and never default to it. |

Stored decks pin `{system, systemVersion}` (`layout.ts` stamps
`systemVersion`; `schema.ts` validates it). A version bump means geometry
may differ — re-render, never silently substitute another system.

Rules:

- Requesting an unknown or unrenderable system FAILS LOUDLY. No silent
  fallback to a different system.
- Registry entries carry: id, version, status, philosophy, hierarchy,
  typeface roles + fallback, scale, grid logic, alignment/whitespace,
  headline/body/metric treatment, per-slide-type variants, deck rhythm,
  KO/EN behavior, support limits, accessibility constraints.
- A name + palette is NOT an implemented system. Composition differences
  must exist in the renderer.

## Experimental candidates (not production)

New systems arrive ONLY via the research-import pipeline as
`CandidateSpec` objects with `status: 'experimental'`:

`node packages/core/dist/scripts/import-research.js --in <records.jsonl>
--out candidates.json`

- The importer validates + deduplicates records and extracts candidate
  specs. It NEVER writes to the registry and NEVER promotes a system.
- Human review (KEEP / REVISE / MERGE / REJECT) and real composition
  implementation are separate, later stages.
- The 500-reference research workstream is separate: do not touch
  `research/*` agent files or `.muse/worktrees/*`.

## Typo Pack: experimental themes, not systems

Typo Pack holds 27 design candidates that re-theme a base system's
geometry with template fonts/colors. Source of truth:
`typo-pack/selection-index.json`, ranked by `selectTypoPack`
(`packages/core/src/template-pack.ts`). A candidate never adds geometry,
never changes the export pipeline, and never promises specimen fidelity.

Use the smallest context that answers the design question:

1. Shortlist from metadata only: `npm run --silent deck -- --suggest
   --preset P05 --top 3`, plus explicit `--density`, `--formality`,
   `--content-types`, or `--mood` when the user states them.
2. Read only the shortlisted `preview.md` files — never all 27 design
   documents.
3. Apply one candidate: `--template slug`, then validate the export.
   The receipt labels the base system and warns that themed output is
   base-system geometry.

Selector contract: explicit filters override purpose hints; every pick
shows score + reasons; ties break by slug; unknown presets/filters fail
loudly. Scores rank metadata fit, not visual quality. `--preset` inside
`--suggest` is retrieval guidance; `--preset` on a generation command
chooses the narrative arc (`references/purposes.md`).

## Preview before export (optional but recommended)

When the visual system is NOT already selected:

1. Generate once — all systems render the SAME narrative
   (`POST /api/generate` returns every system; Studio gallery;
   programmatic `planDecksAll` — see `engine.md`).
2. Compare side by side; judge by evidence fit and hierarchy,
   not decoration.
3. Export only the chosen system.

Skip this flow when a system is already selected — exploration is
available, never mandatory. The approved Slide Markdown is never
re-planned after approval (edits rebuild from the same source;
no drift). Speaker notes live in Markdown `notes:` and travel to
native PPTX notes — they never render on slides.

## Preview authenticity (NON-NEGOTIABLE)

Every preview must read as a real slide from the user's deck:

- No process labels on slides: no `preview`, `Option A/B/C`,
  template names, file paths, or requirement notes rendered as
  slide content. System names belong in chat/UI chrome only.
- Enforced by the `findWorkflowTokens` benchmark gate
  (`visual-review.ts`) + regression test. Real deck chrome only:
  title, kicker, date, author, page number, genuine content.

## Editing ladder

1. Edit Slide Markdown, rebuild. Never patch a generated PPTX.
2. Edits NEVER change the pinned `{system, systemVersion}`.
3. Every edit re-runs validation + critic before delivery
   (Studio export re-validates server-side; assert it in tests).

## Slide Markdown / Slide IR pipeline

```
Source → Evidence → Purpose-Aware Narrative → Slide Markdown
→ Validated Slide IR → HTML / editable PPTX
```

- Slide Markdown v1 (`#!slide-markdown 1`) is a STRICT fenced format, not
  CommonMark. All content is inert literal text; renderers escape it.
- API: `POST /api/markdown` (render request), `GET /api/catalog`
  (presets + systems). Studio edits Markdown and re-renders without
  re-planning the narrative.
- Planner separation is tested: same Slide IR → every system renders
  identical text content (`slide-ir.test.ts`).

## Visual benchmark + human review

```
node packages/core/dist/scripts/visual-benchmark.js
  --fixtures evals/visual-benchmark/fixtures
  --out evals/visual-benchmark/output --seed 7
```

- Fixed fixtures: cover, problem, comparison, metric, conclusion × EN/KO.
- Every fixture × every renderable system → `.pptx` + `.html` +
  `index.html` gallery + `summary.json` + `decisions.json`.
- Structural gates per output: native editable text, 0 forbidden objects,
  in-bounds geometry, HTML↔PPTX text parity, font policy. Aesthetics are
  NOT scored — `decisions.json` scaffolds one PENDING entry per system
  for human KEEP/REVISE/MERGE/REJECT; re-runs preserve human edits
  (verified by test + live re-run check).
- Regression uses semantic/structural equivalence (content, coordinates,
  typography, editability), NOT byte-identical PPTX comparison.
