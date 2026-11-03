# PPTX Export Verification — 6 Full-Deck Designs (Design-Quality)

REAL engine path per design: `selection-index.json` + `design.md`
→ `resolveTemplateDesign` → `layoutDeckWithTemplate` (real `layoutDeck`)
→ `exportToPptxBuffer` → `validatePptxBytes` + independent XML audit.
Engine read-only (used `packages/core/dist` as built; no rebuild, no edits).

- Narrative: fixture-equivalent 7-slide deck built verbatim from
  `evals/design-quality/fixtures.json` (cover/divider/statement/evidence/
  comparison/dense/closing; dense slide = header + 11 rows as `|`-separated
  lines in one body block — the engine has no table primitive).
- Total fixture chars (minus newlines, which become paragraph breaks): **1923**.
- Seed 7, identical narrative for all 6 designs.
- Reproduce: `node evals/design-quality/pptx/check-pptx.cjs`
  (writes 6 `.pptx` + `check-output.json` in that directory).
- Render comparison: **structural validation only**. Keynote.app and
  Microsoft PowerPoint.app are installed on this machine, but there is no
  scriptable headless render-compare harness in the repo or environment, and
  driving GUI apps for pixel export is unavailable in the eval sandbox.
  No parity claims are made against the HTML renders below — gaps are honest.

## Editable-text evidence (all 6 designs)

| Design | Base system | Slides | Engine boxes = XML shapes | `<a:t>` runs | Run chars | `<p:pic>` | `<a:blip>` | `validatePptxBytes` | Size |
|---|---|---|---|---|---|---|---|---|---|
| field-manual | swiss | 7 | 25 = 25 | 42 | 1923/1923 | 0 | 0 | ok | 103041 B |
| fika | editorial | 7 | 25 = 25 | 42 | 1923/1923 | 0 | 0 | ok | 102885 B |
| gridline-swiss | swiss | 7 | 25 = 25 | 42 | 1923/1923 | 0 | 0 | ok | 102345 B |
| modulo-grid | swiss | 7 | 25 = 25 | 42 | 1923/1923 | 0 | 0 | ok | 102228 B |
| peer-review | swiss | 7 | 25 = 25 | 42 | 1923/1923 | 0 | 0 | ok | 103275 B |
| signal-board | swiss | 7 | 25 = 25 | 42 | 1923/1923 | 0 | 0 | ok | 102267 B |

100% of fixture characters survive as native editable runs in all 6 exports;
zero rasterized images; 16:9 slide size (`12188952x6858000` EMU = 13.33x7.5in)
confirmed by the validator. 42 runs > 25 boxes because multi-paragraph boxes
(comparison bullets, dense rows) emit one `<a:t>` per paragraph — chars match
exactly, so nothing is dropped or duplicated.

Resolved themes (colorimetry + 3:1 legibility floor; `backgroundAlt` pinned):

| Design | Ground | Ink | Accent | Muted | Faces (display/body → in XML) |
|---|---|---|---|---|---|
| field-manual | #FFFFFF | #1A1A1A | #0B5FFF blue | #6E6A5E | Archivo / IBM Plex Sans |
| fika | #FFFFFF | #3D4A54 | = ink (pastel fallback) | = ink | Fraunces / Nunito Sans |
| gridline-swiss | #FFFFFF | #111111 | #E30613 red | #6B6B6B | Archivo / Inter |
| modulo-grid | #FFFFFF | #14213D | #3D4C6D deep-soft | #3D4C6D | Sora / Inter |
| peer-review | #FFFFFF | #1A1A1A | #0B5394 blue | #5A6470 | STIX Two Text (both roles) |
| signal-board | #FFFFFF | #0F172A | #B45309 amber | #64748B | Inter (both roles) |

Shared spot-checks (all 6): every text box within 13.33x7.5in bounds
(validator); largest slide-1 XML box matches deck JSON geometry exactly
(delta 0.00in); dense body wraps 12 paragraphs → 12 lines with no overflow
wrap at its fitted size; all 7 slide backgrounds flat fills, no forbidden
elements, no locked text.

## field-manual (D02, swiss)

- Fonts: kicker/title/number in Archivo, body/caption in IBM Plex Sans
  (verified `Archivo`, `IBM Plex Sans` in `<a:latin>`). Sizes: kicker 10,
  title 30, body 12, number 72, caption 9; dense body holds 12pt.
- Geometry/wrap: bounds PASS; dense 12 lines fit without shrink below 12pt.
- Fidelity gaps vs `full-decks/field-manual` HTML render:
  1. Dotted-grid paper → flat #FFFFFF (paper tint #FAF8F3 lost; colorimetry
     picks the brightest swatch, box-fill white).
  2. 2px doc frame, doc header, double rule, revision footer, dashed leaders —
     omitted (no shapes/rules/chrome in the typography-only path).
  3. Caution-amber chips/warnings — lost: #FFB000 fails 3:1 on white, accent
     falls to procedural blue; amber survives nowhere in the PPTX.
  4. IBM Plex Mono ref codes (FIG/NOTE/TAB, §-refs) — lost: whole-block
     engine keeps only the first token per role; mono is a later token.
  5. 60/40 exhibits, bordered TAB.01 — flattened to stacked text boxes;
     dense rows are `|`-separated lines with no column alignment.
  6. Archivo/Plex Sans named, not embedded — needs installed fonts.

## fika (D19, editorial)

- Fonts: Fraunces display / Nunito Sans body in XML. Editorial scale is
  larger (title 42–46, number 102) so dense-slide chrome shrinks to fit:
  dense caption 7pt, kicker 7.7pt — smallest type in the batch, readable
  but the floor. Dense body 10.5pt, 12 lines, no overflow.
- Geometry/wrap: bounds PASS; delta 0.00in.
- Fidelity gaps vs `full-decks/fika` HTML render:
  1. Monochrome slate: no pastel reaches 3:1 on white, so accent = muted =
     ink (known resolver fallback, same as the diversity all-27 survey).
     Sage/blush/blue washes, panels, and chips are entirely lost.
  2. 24px radii, twin panels, wash rotation, page-mark chrome — omitted
     (no shapes/panels/chrome).
  3. Lowercase Fraunces display voice survives in the face name, but
     `textTransform: lowercase` is not applied by the exporter — caps
     rendering depends on the typed fixture copy (verbatim, so mixed case).
  4. Dense table: wash-panel grid → 12 `|`-separated lines, no alignment.
  5. Fraunces/Nunito named, not embedded.

## gridline-swiss (D01, swiss)

- Fonts: Archivo / Inter in XML — both design voices preserved. Sizes:
  kicker 10, title 30, body 12, number 72, caption 9; dense body 12pt.
- Geometry/wrap: bounds PASS; delta 0.00in; dense 12→12 lines.
- Fidelity gaps vs `full-decks/gridline-swiss` HTML render:
  1. Exposed 12-column hairline grid, 6px red rule, black hairlines —
     omitted (no line primitives).
  2. Right gray rail + giant issue numeral — omitted (no panels); the 72pt
     number block is the only numeral survivor, at engine placement.
  3. Red sev-flagged dense rows — lost: whole-block coloring only, dense
     body is a single ink block; red survives only in kicker blocks.
  4. Two-zone comparison split with positional identity — flattened to
     stacked body boxes; rushed-side red squares lost.
  5. Archivo/Inter named, not embedded.

## modulo-grid (D07, swiss)

- Fonts: Sora / Inter in XML. Sizes same swiss ladder as above
  (10/30/12/72/9; dense body 12pt). Bounds PASS, delta 0.00in.
- Fidelity gaps vs `full-decks/modulo-grid` HTML render:
  1. Signal amber (#FCA311, #D98A0B) fails 3:1 on white and is gated out —
     accent = muted = deep-soft #3D4C6D. The design's signature amber
     (underlines, squares, KPI module, closing band) is entirely lost;
     the PPTX reads navy/monochrome where the render reads amber-led.
  2. Tile strips, module cells, full-bleed deep/amber bands, geometric
     bullets — omitted (no shapes/panels).
  3. White-vs-deep comparison cards — flattened to two stacked body boxes
     with no card contrast.
  4. Sora/Inter named, not embedded.

## peer-review (D22, swiss)

- Fonts: STIX Two Text for BOTH roles (body-serif token wins the body
  role; the Inter kicker/runhead tokens are later and skipped). Single
  typeface in XML. Sizes 10/30/12/72/9; dense body 12pt. Bounds PASS.
- Fidelity gaps vs `full-decks/peer-review` HTML render:
  1. STIX-prose vs Inter-apparatus split — lost: kickers, captions, and
     table text all render in STIX, so the journal's serif/sans rigor
     contrast collapses.
  2. Double-rule masthead, foot band, hairlines, keyword rules — omitted.
  3. Abstract inset box, Figure 1 corpus strip, Figure 2 stat rail,
     bracket footnotes — omitted/flattened (no insets/strips; notes are
     plain caption boxes).
  4. Ruled Tables 3/4 with R-/D- refs — dense slide is 12 `|`-separated
     STIX lines with no rules, refs, or tabular numerals.
  5. Italic abstract voice — exporter hardcodes `italic: false`.
  6. STIX Two Text named, not embedded.

## signal-board (D10, swiss)

- Fonts: Inter for both roles — design.md has no body/whisper/copy token,
  so body inherits the Inter display stack; IBM Plex Mono (topbar, pills,
  log rows) is lost. Single typeface in XML. Accent #B45309 (dark amber
  passes 3:1), muted slate #64748B. Sizes 10/30/12/72/9; dense 12pt.
- Geometry/wrap: bounds PASS; delta 0.00in.
- Fidelity gaps vs `full-decks/signal-board` HTML render:
  1. Slate command bar + live dot, dark case-log panel, KPI cards, ticker
     rows — omitted (no bars/panels/cards); ground is white where the
     render is mist + slate-anchored.
  2. Mono data voice (P-XX log rows, pills, labels) — all Inter; tabular
     log read lost.
  3. Semantic signal colors (green complete, red attention, blue identity)
     — collapsed to one amber accent + slate muted; red/green side valence
     on the comparison slide lost.
  4. Dense slide: dark log with amber sev flags → 12 plain `|`-separated
     lines on white.
  5. Inter named, not embedded.

## Unresolved / next steps

- No native-render (PowerPoint/Keynote pixel) comparison: structural
  validation + XML audit only. A scripted export-to-image harness would be
  needed for visual fidelity scoring.
- Fonts named, never embedded (matches each design's disclosure; licensed
  embedding is outside the core exporter).
- Word-level styling (sev flags, strike words, italic intruders) needs
  run-level (`a:r`) export; TextBlock is whole-block by schema design.
- Shape/chrome/table designs (bands, rails, rules, panels, grids, dotted
  paper) cannot be represented in the typography-only core path.
- Resolver colorimetry notes for follow-up: fika pastel fallback
  (monochrome), modulo amber gated out (signature color lost), peer-review
  and signal-board single-typeface collapse (second voice dropped by the
  first-token-per-role rule).
