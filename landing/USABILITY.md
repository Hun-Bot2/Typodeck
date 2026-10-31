# Landing page usability report

Page: `apps/web/app/landing/` (route `/landing`), verified 2026-10-31 against
`next dev` on port 3123 with Playwright (system Chrome) at 1440px and 390px.
Four screenshot-review iterations; all observations below were seen in the
rendered page, not assumed.

## Observed friction → fixes applied

1. **Triple branding.** The root layout already renders the "Typodeck Studio"
   header, and the landing masthead repeated the wordmark — three "Typodeck"s
   stacked. → Replaced the landing masthead with a slim anchor-nav row
   ("on this page ↓" + section links + Studio/GitHub).
2. **Hero band looked broken, then clipped.** First the black hero sat inset in
   a way that read as a bug; the `100vw` full-bleed fix then shifted content
   and clipped the headline's left edge. → Abandoned viewport-bleed math:
   hero and closing CTA are now inset rounded panels, coherent with the
   layout's framed content width. Verified no clipping at both widths.
3. **Dead void under the demo console.** The console card is short in its idle
   state, leaving a large empty black corner on desktop. → Moved the three
   hero notes into a full-width 3-column strip along the panel's bottom edge
   (stacked on mobile).
4. **Cover previews too weak to show.** The `slide1.png` covers render mostly
   whitespace at card size — small text in a white field. → Deck cards show
   the full 12-slide filmstrip full-width in a capped scroll frame instead;
   covers stay in `public/landing/` with a provenance note (unused, archived).
5. **Missing favicon 404.** First runs logged a console 404 for `/favicon.ico`.
   → Added `apps/web/app/icon.svg` (auto-served, no layout change). Console
   is clean since.
6. **Mobile CTA tap targets.** Two inline buttons sat left-aligned and narrow.
   → Full-width stacked buttons under 56rem.
7. **Mobile console-title wrap.** "live demo · POST /api/generate → /api/export
   · idle" wraps to two lines at 390px. Observed, left as-is: it stays legible
   and keeps the honest "this calls the real API" label.

## What was verified working (not just rendered)

- **Live repo → deck console (real wiring, no mocks).** Playwright E2E:
  invalid input shows the typed `invalid-input` error; `sindresorhus/is`
  generates `12 slides · 38 claims (29 verified / 9 suggestion / 0 ungrounded)`
  — reproducing the showcase evidence numbers — with live SSE stage progress;
  `Download swiss.pptx` returns a 134,626-byte valid zip. Screenshots:
  `landing/shots/e2e-error.png`, `landing/shots/e2e-result.png`.
- **Honesty touchpoints render:** provider badge (`fallback`, dashed),
  run warnings, typed error box, per-system downloads, preview-method caveat,
  five-item limitations section.
- **No console errors** on load at either width (after the favicon fix);
  `tsc --noEmit` reports zero errors in landing files.
- **Motion:** the only animation is the working-dot pulse, disabled under
  `prefers-reduced-motion`. No scroll reveals.

## Known non-issues

- Screenshots contain a small "N" badge bottom-left: the Next.js **dev**
  tools indicator (renders inside `NEXTJS-PORTAL`). Absent from production
  builds; not page content.
- The dayjs filmstrip visibly contains claim-quality defects (a `17680888`
  number slide from a badge URL, i18n nav cruft on the cover). Kept
  deliberately as real evidence; the limitations section discloses them.
- Live generation titles the deck from the purpose select (e.g. "showcase")
  — real pipeline output, left unedited.
