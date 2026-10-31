# ADR-0006: Four visual systems, three production

Status: Accepted. Evidence: `packages/core/src/systems.ts`
(`SYSTEM_IDS`, per-system tokens), `packages/core/src/visual-systems.ts`
(`SystemStatus`, `status: 'experimental'` for `document`),
`research/implementation_notes.md`, `gallery/REVIEW-GUIDE.md`.

## Context

Distinct typographic voices (serif asymmetric, dense grid, display
centered, technical manual) need independent evolution without breaking
existing decks.

## Decision

`editorial`, `swiss`, `expressive` are production with pinned tokens;
`document` is experimental in the status registry, preview-only, with
unrendered candidates (`manual-opening`, `manual-section`) openly marked
NO PREVIEW. Promotion requires human review, documented in the gallery.

## Consequences

Production output is stable while manual-voice work iterates. Nothing may
treat `document` as stable (see known issues P1-2).
