# ADR-0001: Typography-only native editable PPTX

Status: Accepted. Evidence: `packages/core/src/export.ts`,
`packages/core/src/validate.ts`, `packages/core/tests/export.test.ts`,
PRD scope (commit `12338fb` lineage).

## Context

AI slide tools commonly emit rasterized or locked shapes that users cannot
edit, and decorate with stock imagery that fights the content.

## Decision

Every deck is text boxes plus flat background fills only. The exporter
calls `addText` and nothing else; the validator unzips each PPTX and fails
runs containing pictures, charts, tables, groups, gradients, locked runs,
or out-of-bounds shapes, and enforces an editable-character floor.

## Consequences

Output stays genuinely editable (`a:t` runs) and typography-led, at the
cost of no images, charts, tables, shapes, or animations — a permanent
scope boundary, not a backlog item.
