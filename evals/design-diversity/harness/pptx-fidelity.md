# PPTX Fidelity Disclosure (design-diversity harness)

Web preview effects do not all survive export to PowerPoint. Every design
MUST ship a filled copy of the disclosure table below (in its `design.md`
Known Gaps section or as `pptx-notes.md` next to `preview.html`) so judges
know which preview effects are real export commitments and which are
preview-only.

## Fidelity levels

- **full** — exports 1:1 (native shape / text / solid fill equivalent).
- **partial** — exports with a documented fallback (see Fallback column).
- **none** — preview-only; dropped or flattened on export.

## Required disclosure rows

Copy this table and fill one row per effect the design actually uses.
Every row marked `partial`/`none` MUST name its fallback.

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | e.g. `backdrop-filter: blur(8px)` on cards | full/partial/none | e.g. solid fill at 90% opacity |
| 2 | Blend modes | e.g. `mix-blend-mode: multiply` overlay | full/partial/none | e.g. pre-composited flat layer |
| 3 | Animation / keyframes | e.g. twinkle / float / grow on entry | full/partial/none | e.g. static end-state frame |
| 4 | Pixel / hard offset shadows | e.g. stacked `4px` box/text shadows | full/partial/none | e.g. single solid offset shadow |
| 5 | Gradients | e.g. linear / radial surface washes | full/partial/none | e.g. nearest two-stop gradient |
| 6 | Grain / scanline / noise overlays | e.g. repeating-gradient / SVG noise | full/partial/none | e.g. flattened background image |
| 7 | Transparency layers | e.g. alpha fills, vignettes | full/partial/none | e.g. opaque approximations |
| 8 | Custom fonts | e.g. CDN display/body/mono faces | full/partial/none | e.g. embedded or substituted face |
| 9 | Absolute-positioned decor | e.g. corner brackets, floating chips | full/partial/none | e.g. grouped native shapes |

## Worked example (EXAMPLE — replace with the design's own rows)

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur | Frosted card via `backdrop-filter: blur(10px)` | partial | Solid card fill, opacity 92% |
| 2 | Blend modes | Vignette via `mix-blend-mode: multiply` | none | Flattened into background PNG |
| 3 | Animation | Badge pulse keyframes | none | Static badges (mid-pulse frame) |
| 4 | Pixel shadows | Two-layer hard text shadow | partial | Single 4px solid offset shadow |

Rules:

- Do not claim `full` for blur, blend modes, or animation: current PPTX
  export cannot reproduce them.
- If the design uses an effect not listed above, add a row for it.
- The disclosure is part of the design deliverable; a missing table is a
  review failure (manual check, not covered by `validate-design.mjs`).
