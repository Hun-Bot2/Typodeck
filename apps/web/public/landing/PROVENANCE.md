# Preview asset provenance (landing page)

All PNGs in this directory are COPIES of pipeline-generated evidence from the
showcase package at `/tmp/typodeck-showcase/showcase/previews/` (branch
`showcase/demo-evidence`, base `ff68b70`). Copied 2026-10-30/31 for the
landing page at `apps/web/app/landing/`. Nothing here is hand-made or mocked.

Source of each image:

- `is-swiss.*.png` — deck for `sindresorhus/is` @ `e9c026c` (branch `main`),
  system `swiss`, seed `1143001754`, purpose `Tool showcase: is`.
- `dayjs-editorial.*.png` — deck for `iamkun/dayjs` @ `436bde0` (branch `dev`),
  system `editorial`, seed `1713200736`, purpose `Adoption case for Day.js`.
- `handbook-expressive.*.png` — deck for `microsoft/TypeScript-Handbook`
  @ `543d2df` (branch `master`), system `expressive`, seed `33113867`,
  purpose `Docs guide: TypeScript Handbook`.

How they were produced (see `showcase/manifest.md` §6 in the showcase
worktree): static HTML rendered from the actual deck JSON with the exact
`SlideView.tsx` geometry mapping, rasterized with headless Chrome.
They are HTML-geometry previews, NOT direct PPTX rasterizations
(no LibreOffice in that environment).

PPTX correctness for the same decks rests on two independent checks,
both recorded in the showcase manifest §5:

1. the repo validator (`validatePptx`): 12 slides / 46 text boxes each, OK;
2. an independent `<a:t>` spot check: 46 text nodes per deck, every deck-JSON
   block present in its slide's text runs, zero forbidden elements.

The landing page captions repeat the "HTML-geometry preview" caveat next to
the images so visitors are never misled.

Note: the `*.slide1.png` cover files are archived here for provenance but are
not currently rendered — the `*.filmstrip.png` images (all 12 slides each)
proved denser and more legible in page context, so the deck cards show the
filmstrips full-width instead of a cover + strip split.
