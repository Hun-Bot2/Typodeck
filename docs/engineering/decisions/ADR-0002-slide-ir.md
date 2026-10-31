# ADR-0002: Slide Markdown and versioned Slide IR

Status: Accepted. Evidence: `packages/core/src/slide-ir.ts`
(`SLIDE_IR_VERSION = '1.0.0'`), `packages/core/src/slide-markdown.ts`,
`POST /api/markdown`.

## Context

HTML preview and PPTX export must never disagree about factual content,
and slide content needs a stable contract across planners and renderers.

## Decision

Slide IR is the validated, system-independent content contract both
renderers consume. Slide Markdown is its authoring surface. Optional
`notes` travel as metadata and are never rendered on slides.

## Consequences

Renderer bugs cannot silently change facts; IR version bumps gate
breaking changes. (Note: `main@ff68b70` carries only a truncated
`slide-ir.ts` fragment; the real contract exists from `b09865c`.)
