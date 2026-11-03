# README assets — inventory and conventions

Three asset families with a hard separation rule. Never mix captions
across families: identity art is not engine output, and video stills
are not the proof table.

| Family | Directory | Contents | Captioned as |
|---|---|---|---|
| Identity | `brand/typoppt/` (+ legacy `brand/typodeck-*`) | Hand-made SVG wordmarks, hero, social card, direction boards | Brand / identity illustration |
| Engine output | `docs/showcase/` | Real CLI-produced PPTX + PNG renders + deck JSON + provenance | Generated output (reproduce commands in [showcase README](../showcase/README.md)) |
| Video | `docs/media/` | Owner-recorded demo MP4s, `.srt`, thumbnail from footage | Demo recording (integration in [VIDEO-INTEGRATION.md](VIDEO-INTEGRATION.md)) |

## Naming and placement

- `docs/media/demo-1080p.mp4`, `demo-720p.mp4`, `demo.srt`,
  `thumbnail-demo.png` (+ release-asset or YouTube mirror).
- Brand: `brand/typoppt/*.svg` (see [brand README](../../brand/typoppt/README.md)).
- Showcase: `docs/showcase/readme-<name>.{pptx,png,json,provenance.json}`.

## Size budget

- Each MP4 ≤25MB; PNG thumbnails ≤500KB; total `docs/media/` ≤60MB in-repo.
- Showcase PNGs are QuickLook renders of real PPTX bytes (see the
  showcase README for the method); keep each ≤500KB.
- Brand SVGs stay text-only (no embedded fonts/images); each ≤10KB.

## README snippet library

Light/dark-aware brand mark:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/typoppt/typoppt-wordmark-dark.svg" />
  <img src="brand/typoppt/typoppt-wordmark-light.svg" alt="TypoPPT — typography-first presentation engine" width="640" />
</picture>
```

Video-link thumbnail block (after footage exists — see
[VIDEO-INTEGRATION.md](VIDEO-INTEGRATION.md) §4):

```html
<a href="<video-url>">
  <img src="docs/media/thumbnail-demo.png" alt="TypoPPT demo: <what it proves> (<runtime>)" width="880" />
</a>
```

Showcase table cells: `![<deck>, slide N](docs/showcase/<file>.png)`
with the `.pptx` + slide/box counts on the row below. Alt text names
the deck and slide; counts come from the validator receipt.

## Verification routine

1. Every image/link resolves from a fresh clone (no absolute local paths).
2. README renders at desktop (~1280px) and mobile (~375px) widths.
3. Light + dark theme: brand mark swaps, screenshots stay legible.
4. Video (when present): desktop + mobile playback matrix per
   VIDEO-INTEGRATION.md §7 with a PASS/FAIL row each.

## Update policy

Re-record or re-render when: CLI flags or receipts change, the Studio
flow changes, a new production system ships, or the visual identity
changes. Every video carries a provenance note (commit SHA + provider +
fixture inputs); every showcase PNG tracks its `.pptx` bytes (same
commit or newer, never older).
