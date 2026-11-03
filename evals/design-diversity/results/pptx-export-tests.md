# PPTX Export Tests — Template-Pack Engine Integration

How 3 typographically demanding `bold-template-pack` designs travel through the
REAL engine path (`selection-index.json` + `design.md` → `template-pack.ts`
→ `layoutDeck({ theme })` → `exportToPptxBuffer` → `validatePptxBytes`),
with editable-text evidence and honest fidelity gaps.

## Wiring (what was built)

- `packages/core/src/template-pack.ts` (new): typed `parseSelectionIndex`,
  `parseDesignTokens` (design.md front-matter subset: `colors` + first
  `fontFamily` per role), `themeFromTokens` (colorimetric role assignment +
  3:1 legibility floor), `systemIdForEntry` (documented density/scheme/
  formality rules), `layoutDeckWithTemplate` (resolve → real `layoutDeck`).
- `packages/core/src/layout.ts` (minimal): `LayoutOptions.theme?: ThemeOverride`,
  threaded to `layoutSlide`; per-slide candidate theme still wins; absent
  theme = byte-identical baseline behavior.
- `packages/core/src/index.ts`: re-export. `composition.ts`, `export.ts`,
  `validate.ts` untouched.
- **No new primitive**: `PRIMITIVES` unchanged; design tokens feed the
  existing `themedSystem → colorFor/fontFaceFor/backgroundFor → materialize`
  path (the same path candidate themes use). `preview.md` files are
  agent-facing prose; their machine-readable mirror is `selection-index.json`,
  which is what the resolver parses — no engine-usable signal in `preview.md`
  exists outside the index + `design.md` front-matter, so it is deliberately
  not parsed.
- Tests: `packages/core/tests/template-pack.test.ts` (10 tests) — real-index
  parse, all-27 resolution, front-matter units, contrast-floor units,
  stack-ordering units, theme stamping, real-exporter round-trip.
  Full suite: **565/565 pass**, `tsc -p packages/core` clean.

## Method

- Narrative: `SAMPLE_NARRATIVE` (7 slides, mixed EN/KO, kicker/title/body/
  number/caption, long-Korean-paragraph slide) — **1168 chars** total.
- Seed 7, per design: `layoutDeckWithTemplate` → `exportToPptxBuffer` →
  `validatePptxBytes(buffer, 1168)` + independent XML audit (`<a:t>` runs
  vs `<p:pic>`/`<a:blip>`).
- Reproduce: build core, then `node /tmp/typodeck-pptx-check.cjs`
  (throwaway probe; outputs in `/tmp/typodeck-pptx-check/`).

## Editable-text evidence (all 3 designs)

| Design | Base system | Slides | Text boxes (engine) = shapes (xml) | `<a:t>` runs | Run chars | `<p:pic>` | `<a:blip>` | `validatePptxBytes` | Size |
|---|---|---|---|---|---|---|---|---|---|
| monolith | expressive | 7 | 24 = 24 | 24 | 1168/1168 | 0 | 0 | ok | 93605 B |
| maison | expressive | 7 | 24 = 24 | 24 | 1168/1168 | 0 | 0 | ok | 94190 B |
| new-wave-static | swiss | 7 | 24 = 24 | 24 | 1168/1168 | 0 | 0 | ok | 93673 B |

100% of narrative characters survive as native editable runs in all 3
exports; zero rasterized images; 16:9 slide size confirmed by the validator.

Resolved themes and contrast (WCAG ratios on the resolved ground):

| Design | Ground | Ink | Accent | Muted | Faces (display/body) |
|---|---|---|---|---|---|
| monolith | #000000 (18.49 ink) | #F5F0E6 | #FF4D00 (6.31) | #8A8578 (5.71) | Anton / Inter |
| maison | #0B0B0C (17.79 ink) | #F7F3EC | #9A7F45 (5.15) | #6E6E6E (3.86) | Cormorant Garamond / Inter |
| new-wave-static | #FFFFFF (21.00 ink) | #000000 | #FF00A8 (3.61) | #FF00A8 (3.61) | Archivo / Archivo |

`backgroundAlt` is pinned to `background` for all template themes (packs
define a single ground; this also disables expressive odd-slide alternation).

## Fidelity gaps (effects with no PPTX/core equivalent + fallback used)

### monolith (expressive base)

| # | Effect (design.md) | Fallback in core PPTX export |
|---|---|---|
| 1 | 240px caps wall, hard-cropped by zone | Engine guarantees fit (shrinks/wraps); no crop. Wall mass reduced to fitted boxes. (`deliberateCrop` is a per-block author opt-in, not a wall treatment.) |
| 2 | Single orange strike WORD inside the title | Whole-block coloring only: accent carried by kicker blocks, title stays bone. Strike-word lost. |
| 3 | Footer band: slab-black panel + 8px orange rule | Omitted — no panels/rules/shapes in the typography-only engine. NOTE: design.md's own disclosure says "grouped native rectangles"; that applies to a shape-capable (frontend-slides) exporter, not the core path, which structurally forbids them. |
| 4 | Top strip chrome (orange square + labels) | Omitted — no persistent chrome in the engine. |
| 5 | Ground #0E0E0E vs resolved #000000 | Colorimetry picks darkest swatch (slab-black); Δ invisible. |
| 6 | Anton/Inter via CDN | Named in `a:latin` (verified in XML) but not embedded — needs installed fonts; else Arial Black/Calibri substitution per the design disclosure. |
| 7 | CJK condensed wall (no KR Anton exists) | Engine appends Noto Sans KR fallback automatically, matching the design's CJK guidance (weight capped by system scale). |

### maison (expressive base)

| # | Effect (design.md) | Fallback in core PPTX export |
|---|---|---|
| 1 | Hairline gold rules (signature) | Omitted — no line primitives. Design disclosure claims "native 1pt line shapes"; unavailable in the core path (same divergence as M3). |
| 2 | Italic gold accent WORD per headline | Exporter hardcodes `italic: false` + whole-block color: kicker accent color, no italics, no word-level. |
| 3 | Transparency (ivory 78% body, rule 55%) | Opaque ink/muted directly (design-suggested tints #C9C2B2/#D8C48F not applied; engine roles are opaque). |
| 4 | 600ms gallery fade | Static slides. |
| 5 | Centered column, 20vh top margin, vast gutters | Approximated by expressive centered-hero placement; exact proportions not reproduced (engine geometry). |
| 6 | Gold #C6A664 vs resolved gold-deep #9A7F45 | Most-saturated rule picks gold-deep; same hue family, AA 5.15:1. |
| 7 | Muted #6E6E6E at 3.86:1 | Below AA 4.5 for small captions; kept (designer intent) above the 3:1 floor. |
| 8 | Cormorant/Inter via CDN | Named, not embedded (verified `Cormorant Garamond`, `Inter` in XML). |

### new-wave-static (swiss base)

| # | Effect (design.md) | Fallback in core PPTX export |
|---|---|---|
| 1 | Neon slash bars (rotated divs, 24°) | Omitted — no shapes, no rotation. |
| 2 | 45° rotated kicker chip | Rendered as an unrotated accent kicker block. |
| 3 | Ghost outline numeral (560px, 65% opacity, text-stroke) | Rendered as a standard number block at engine scale, opaque, no stroke. |
| 4 | Newsreader italic intruder word | No word-level faces/italics: whole-block Archivo; high/low clash lost. |
| 5 | Masthead/footer bands | Omitted — no panels. |
| 6 | Accent/muted magenta #FF00A8 at 3.61:1 | Passes the large-text floor only (kickers are bold display caps — acceptable). Cyan #00C2FF (2.07:1) was gated out, so muted = accent: captions loud but readable. |
| 7 | No body token in design.md | Body inherits the Archivo display stack (documented fallback; verified in XML — single typeface). |
| 8 | Archivo/Newsreader via CDN | Archivo named, not embedded. |

## All-27 survey (resolver health)

Every index entry resolves to a renderable system + valid theme; the only
ink-fallback trigger is `fika` (pastel palette: no remainder reaches 3:1,
so accent/muted = ink — readable, less colorful). `muted == accent` occurs
for 3 sparse palettes (new-wave-static, ma, memphis-squiggle) where only one
remainder passes the floor. No crashes, no invalid hex, all stacks carry KR
fallbacks before CSS generics. Full per-template table is printed by the
probe script.

## Unresolved / next steps

- Fonts are named, never embedded — licensed-embed or substitution pipeline
  is outside the core exporter (matches each design's disclosure).
- Word-level styling (strike words, italic intruders) needs run-level
  (`a:r`) export; the engine's TextBlock is whole-block by schema design.
- Shape/chrome designs (bands, slashes, hairlines, strips) cannot be
  represented in the typography-only core path; a shape-capable exporter
  would be a separate surface with its own validator contract.
- `apps/web` `/api/export` does not yet accept a `template` slug (engine
  API ready: `layoutDeck(narrative, system, { theme })`; route wiring left
  out per minimal-scope instruction).
