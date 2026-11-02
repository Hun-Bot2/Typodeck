# Typodeck Skill — Editable PPTX Export + Evidence Report (read on demand)

Source: `packages/core/src/export.ts`, `packages/core/src/validate.ts`.

## Export (Core-owned, always re-validated)

- `exportToPptx(deck, outPath)` → `{slideCount, textBoxCount, path}`;
  `exportToPptxBuffer(deck)` for the API path. Every export is
  immediately followed by `validatePptx`/`validatePptxBytes` —
  Studio re-validates server-side on every export; the CLI exits 1
  on `export-validation-failed` (do not ship; report the errors).
- Guarantees on `validation: OK`: native editable text (no
  rasterized/outlined runs), 0 forbidden objects, in-bounds
  geometry, 16:9 canvas, margins ≥ 0.5 in.
- Speaker notes live in Slide Markdown `notes:` / IR `notes` and
  travel to native PPTX notes — they never render on slides.
- Editing ladder (`references/visual-systems.md`): edit Slide
  Markdown, rebuild, re-validate + critic. Never patch a generated
  PPTX; edits never change the pinned `{system, systemVersion}`.

## Evidence report (every delivery ends with one)

Assemble from the pipeline's own receipts — never from memory:

1. `provider:` line + fallback/model labeling
   (`references/engine.md` receipts; provider.ts contract).
2. `claims:` counts by kind (`verified`/`suggestion`/`ungrounded`)
   plus the per-claim table (id, kind, lifecycle tag, text,
   numbers, refs — `references/evidence.md`).
3. `quality:` gate verdict (`pass`|`review`, advisory only).
4. `deck:` slide/box counts, system + pinned version.
5. `warning:` lines verbatim (degrades, fallbacks, composition
   fallbacks from `references/composition.md`).
6. `validation: OK` (or the typed errors), critic attempts used,
   residual findings, and ALL `visionUnmeasured` items as
   unverified (`references/inspection.md`, `references/revision.md`).
7. Honest-skip block: every QA layer that could not run as
   `SKIPPED: <layer> (<reason>)` — never silent green.

Offline generator: `examples/04-evidence-report.mjs` (offline, real
fixture, real Core APIs). Live variant adds quota + request-budget
lines (`requests: api=N blobs=M cached=K`).
