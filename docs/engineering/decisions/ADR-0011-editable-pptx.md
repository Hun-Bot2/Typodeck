# ADR-0011: Native editable PPTX as the only artifact

Status: Accepted. **RECONSTRUCTED 2026-10-31 by Agent E from baseline
`b09865c` evidence** (no ADR files exist on this baseline; each claim
below names the file that proves it).

Evidence: `packages/core/src/export.ts` (whole file, 108 lines),
`packages/core/src/validate.ts:50-66`,
`packages/core/tests/export.test.ts`, `showcase/spot-check.py`
(independent `<a:t>` check, 3/3 OK per `showcase/manifest.md` §5.2).

## Context

AI slide tools commonly emit rasterized or locked shapes that users
cannot edit, and decorate with stock imagery that fights the content.
Typodeck's thesis is that a deck must remain editable and checkable
after export.

## Decision

Every deck is native text boxes plus flat background fills only. The
exporter calls `slide.addText` (`export.ts:74`) and nothing else — the
file header states it "must never call addShape / addImage / addTable
/ addChart / addMedia". There is no Markdown/HTML export path:
`export.ts` exposes only `exportToPptx`/`exportToPptxBuffer`, and the
Studio export route serves PPTX only.

## Consequences

Output stays genuinely editable (measured S5: 100% of visible
characters in editable `<a:t>` nodes across the 24-run matrix) at the
cost of no images, charts, tables, shapes, or animations — a
permanent scope boundary recorded in `docs/PRD.md` §7, not a backlog
item. HTML previews in the Studio and showcase are geometry renders,
never the artifact of record.
