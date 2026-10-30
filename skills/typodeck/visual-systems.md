## Preview before export (optional but recommended)

When the visual system is NOT already selected:

1. Generate once — all systems render the SAME narrative
   (`POST /api/generate` returns every system; Studio gallery).
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
