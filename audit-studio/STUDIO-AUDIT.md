# Typodeck Studio — Usability, Accessibility & Responsive Audit

- Date: 2026-10-30 · Auditor: studio-auditor (subagent) · Branch: `studio/a11y-audit` (uncommitted)
- App: Next.js Studio, single route `/` (+ `POST /api/generate`, `POST /api/export`)
- Method: Playwright (system Chrome, headless) against `next dev` on 127.0.0.1:3111,
  viewports 1440×900 and 390×844. 25 automated checks + manual screenshot review.
- Screenshots: `audit/screenshots/` · Raw check log: `audit/checks.json`
- Note: the dark "N" disc in screenshots is the Next.js dev-tools button (dev only, not shipped UI).

## Verdict

Studio is a clean, single-purpose flow (Source → Generation → Directions → Viewer → Export)
with solid fundamentals: valid labels, visible focus, AA-passing contrast, no horizontal
overflow at either viewport, working keyboard slide navigation, and a verified
102 KB PPTX download. The failures are concentrated in **error handling and keyboard
reachability of the filmstrip** — all fixed in this worktree (see §5).

## Findings (severity × impact)

### F1 — HIGH · Errors appear below the fold with no focus/scroll move
Route `/`, repro: click "Generate decks" with empty input (or any invalid input).
The error box renders in section 02, off-screen; the viewport looks identical to idle
(`03-desktop-error-empty.png` vs `01-desktop-idle-top.png` are pixel-near-identical).
Keyboard/screen-reader users get `role=alert` announcement but no focus path
(`error-box` had `tabIndex=-1`, unreachable). **Fixed (§5):** error box takes focus
on failure (scrolls into view), verified `error focused=error-box inViewport=true`
(`30-fixed-error-focus.png`).

### F2 — HIGH · Stale "working…" stage after a failed run
Repro: submit a 5-char idea. The SSE error arrives mid-`ingest`, leaving stage 01
stuck on "working…" in accent color next to the error (`03b-desktop-error-closeup.png`).
Implies the pipeline is still running. **Fixed (§5):** catch path resets `active`
stages to `pending`; verified all four stages read "waiting" after error.

### F3 — MEDIUM · Filmstrips unreachable by keyboard; ~55% of thumbnails hidden
Each `.filmstrip` had `tabIndex=-1` (measured `scrollW=2455 clientW=1112` at 1440px),
so keyboard users could never reach slides 5–8. Thumbnails are also click-inert
(verified: thumb click leaves counter at `1 / 8`), inviting dead clicks.
**Partially fixed (§5):** filmstrip is now tab-focusable with explicit ArrowLeft/Right
scroll (verified `scrollLeft 0→1320`); thumb-click-to-jump proposed, not implemented.

### F4 — MEDIUM · No h1; wordmark is a `<p>`
Zero `h1` on the page (2× `h2` idle, outline otherwise sound). Weakens screen-reader
page identification and document outline. **Fixed (§5):** wordmark is now `<h1>`
(same class, zero visual change), verified `h1 count=1`.

### F5 — LOW · Empty submit round-trips to a 400
"Generate decks" was enabled with both fields blank, producing
`invalid-input: input must be a non-empty string`. **Fixed (§5):** button disabled
until either field is non-empty (verified both directions). Short-idea and malformed
repo inputs still validate server-side with clear messages (`idea-length`,
`invalid-input … owner/repo …`), which is correct.

### F6 — LOW · Missing favicon (404 in console)
`GET /favicon.ico → 404`. **Fixed (§5):** new `app/icon.svg` (type-led "T" mark);
verified `/icon.svg → 200` + `<link rel="icon">` emitted.

### F7 — LOW (proposal, not implemented) · Results appear far down-page
After Generate, sections 03/04 mount below the fold with no scroll cue; first-time
users may not notice output. Suggest scrolling `#designs-title` into view on `done`
(same one-effect pattern as the F1 fix). Left out: auto-scroll is a UX judgment call.

### F8 — INFO · No modals anywhere
`dialog`/`role=dialog` count = 0 in code and DOM. Modal behavior N/A by construction.

## What passed (verified, with evidence)

| Check | Evidence |
|---|---|
| Labels on all 4 form controls | `label[for]` × 4 present |
| Contrast AA (7 pairs) | ink 17.40, muted 6.69, accent 6.94, btn white-on-accent 6.94, good 6.55, bad 7.78, accent-dark 9.20 |
| Focus visible | `:focus-visible` 2px outline, verified computed + `14-desktop-focus-textarea.png` |
| Sensible tab order | textarea → input → select → select → button |
| Viewer arrows + counter live region | `2/8 → 3/8 → 2/8` via Arrow keys, `aria-live` counter |
| `aria-pressed` select buttons | present; switch editorial→swiss verified (`12-desktop-swiss.png`) |
| All 25 slide previews labelled | `role=img` + `aria-label`, 0 missing |
| Export downloads real file | `typodeck-swiss.pptx`, 102,912 bytes + "Download started." (`13-desktop-export-done.png`) |
| Export API validates | `{"code":"invalid-system",…}` on bad post; `GET /api/generate → 405` |
| No h-overflow 1440 or 390, idle or done | scrollWidth == innerWidth in all 3 states |
| Mobile tap targets ≥ 44px | smallest 92×44 (select), button 167×48 |
| KO generation works | lede `hackathon · 8 slides · ko` |
| Generating state honest | button disabled + "Generating…" + elapsed + live stages (`06b-desktop-generating-true.png`) |
| Reduced-motion + single mobile breakpoint | present in `globals.css` (`prefers-reduced-motion`, `@media 40rem`) |

## Routes visited

`GET /` (idle, error ×3, generating, done, viewer, export, focus) at 1440 and 390;
`POST /api/generate` (idea valid/short/empty, repo malformed) and `POST /api/export`
(valid + invalid) via UI and curl. No other routes exist.

## Fixes implemented (all in `apps/web`, uncommitted)

1. `apps/web/app/layout.tsx` — wordmark `<p>` → `<h1>`. Safe: styling is class-based
   (`.wordmark` sets its own margin/font), zero visual or layout change.
2. `apps/web/app/page.tsx` — error box `ref` + `tabIndex={-1}` + `useEffect` focus on
   `phase==='error'`. Safe: additive focus call on an already-mounted node; no state shape change.
3. `apps/web/app/page.tsx` — reset `active`→`pending` stages in `generate()` catch.
   Safe: touches only the error branch; success path untouched.
4. `apps/web/app/page.tsx` — `canSubmit` gating for the Generate button. Safe: strictly
   narrows the enabled state (previously-always-enabled-during-idle); no API contract change.
5. `apps/web/app/page.tsx` — filmstrip `tabIndex={0}` + ArrowLeft/Right `scrollBy`
   handler + extended `aria-label`. Safe: mirrors the existing viewer-frame key pattern;
   no layout change (global `:focus-visible` already styles it).
6. `apps/web/app/icon.svg` (new) — favicon via App Router convention. Safe: new static
   asset only; removes console 404.

Verification after fixes: `tsc --noEmit` clean; re-probe confirmed h1=1,
empty-disable, error focus+viewport, stage reset, filmstrip scroll, icon 200, zero page errors.

## Blockers / out-of-scope notes

- `npm run build` (repo root) **fails on committed `main`**: `packages/core/src/slide-ir.ts`
  is syntactically broken at HEAD `ff68b70` (verified via `git show HEAD:…`), plus an
  error in `scripts/visual-benchmark.ts`. `packages/core/src` was off-limits, so this is
  **not fixed**. Impact contained: `tsc` still emits, core runtime loads
  (`planDecksAll`/`layoutDeck`/`exportToPptxBuffer` all functions), and Studio
  generate/export verified end-to-end — but the pipeline owner should repair `slide-ir.ts`
  before any production build. No `setsid` on macOS: dev server ran as a managed session
  (fine for in-session probes; dies with the session).
- Repo-mode generation (GitHub fetch) untested — offline idea-mode only, per constraints.
