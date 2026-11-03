---
version: alpha
name: Fieldnote
description: An eco kraft presentation system that sets sturdy Zilla Slab titles loose and left-aligned on fibrous kraft, with Karla body text and Caveat handwriting annotating dashed margins. Rotated stamp badges, a hand-drawn clay underscore, CSS leaf-glyph bullets, tally-card margin modules, and curved annotation arrows make every slide feel gathered by hand in the field.

colors:
  kraft: "#E9DCC8"
  kraft-deep: "#DCCDAF"
  moss-ink: "#2E3B2E"
  leaf: "#5A7A4E"
  clay: "#B4552D"
  wash-white: "#FFFFFF"
  dash-ink: "rgba(46, 59, 46, 0.45)"

shadows:
  none-flat: "none"
  stamp-ink: "inset 0 0 2px rgba(180, 85, 45, 0.25)"
  card-paper: "0 2px 0 rgba(46, 59, 46, 0.12)"

typography:
  field-title:
    fontFamily: "'Zilla Slab', Georgia, serif"
    fontSize: 108px
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.005em
  section-title:
    fontFamily: "'Zilla Slab', Georgia, serif"
    fontSize: 68px
    fontWeight: 600
    lineHeight: 1.08
  tally-numeral:
    fontFamily: "'Zilla Slab', Georgia, serif"
    fontSize: 120px
    fontWeight: 700
    lineHeight: 1
  body-grotesque:
    fontFamily: "'Karla', system-ui, sans-serif"
    fontSize: 42px
    fontWeight: 500
    lineHeight: 1.4
  body-small:
    fontFamily: "'Karla', system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.55
  stamp-label:
    fontFamily: "'Karla', system-ui, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.3em
    textTransform: uppercase
  context-caps:
    fontFamily: "'Karla', system-ui, sans-serif"
    fontSize: 27px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.24em
    textTransform: uppercase
  leaf-item:
    fontFamily: "'Karla', system-ui, sans-serif"
    fontSize: 27px
    fontWeight: 700
    lineHeight: 1.3
  tally-label:
    fontFamily: "'Karla', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.26em
    textTransform: uppercase
  hand-note:
    fontFamily: "'Caveat', cursive"
    fontSize: 52px
    fontWeight: 600
    lineHeight: 1.25
  hand-small:
    fontFamily: "'Caveat', cursive"
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.3
  hand-caption:
    fontFamily: "'Caveat', cursive"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.25

spacing:
  slide-pad: "88px 110px 80px"
  col-gap: 80px
  rail-pad-left: 64px
  stamp-gap: 28px
  title-underscore-gap: 30px
  subtitle-gap: 34px
  leaves-gap: 40px
  tally-pad: "26px 30px"

canvas:
  width: 1920px
  height: 1080px

components:
  stamp-badge:
    border: "3px solid {colors.clay}"
    outline: "1px solid {colors.clay}"
    outlineOffset: 5px
    borderRadius: 4px
    rotation: -3deg
    color: "{colors.clay}"
    fontSize: 26px
    fontWeight: 700
    letterSpacing: 0.3em
    textTransform: uppercase
    fontFamily: "'Karla', system-ui, sans-serif"
    description: "Double-rule clay stamp marking study numbers and verdicts, tilted -3deg like a fresh impression."
  hand-underscore:
    width: 340px
    height: 10px
    background: "{colors.clay}"
    borderRadius: 6px
    rotation: -0.6deg
    description: "Thick rounded clay stroke beneath the title, tilted half a degree off level."
  leaf-bullet:
    size: 26px
    background: "{colors.leaf}"
    borderRadius: "0 60% 0 60%"
    rotation: -12deg
    description: "Two-corner rounded square reading as a leaf; dots keyword and finding rows."
  tally-card:
    border: "2px solid {colors.leaf}"
    borderRadius: 4px
    background: "rgba(255, 255, 255, 0.3)"
    rotation: -1deg
    description: "Bordered leaf card with tracked label, oversized slab numeral, and handwritten caption."
  margin-note:
    color: "{colors.clay}"
    fontSize: 52px
    fontFamily: "'Caveat', cursive"
    description: "Large rotated clay handwriting reacting to the main column from the dashed margin."
  curve-arrow:
    stroke: "{colors.clay}"
    strokeWidth: 6px
    description: "Hand-drawn curved SVG arrow linking margin notes to the tally card."
  dashed-separator:
    border: "2px dashed rgba(46, 59, 46, 0.45)"
    description: "Dashed moss separators: vertical margin rule and the context-line top rule."
  kraft-ground:
    fiberLines: "repeating-linear-gradient hairlines at 4.5% moss"
    wash: "soft top-light white radial at 28%"
    description: "Fibrous kraft: hairline fiber striping plus a top-light wash over the kraft base."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Fieldnote is an **eco kraft presentation system**. Its foundational premise is the **gathered page**: every slide behaves like a journal spread where printed structure (slab title, grotesque body, stamped badges) meets handwritten response (margin notes, arrows, tallies) on fibrous kraft.

The type stack is three voices in field-journal roles. **Zilla Slab** is the display face — a sturdy humanist slab with typewriter roots that carries titles and tally numerals, loose and left-aligned. **Karla** is the structure face — a slightly quirky grotesque for body text, stamp labels, leaf rows, and the context line. **Caveat** is the hand — a quick casual handwriting face used only for margin annotations, reactions, and tally captions. The hand never carries primary content; it responds to it.

The palette is foraged: **kraft ground, moss ink, leaf green, clay red**. Kraft is the only surface; moss sets all primary text; leaf voices growth-adjacent structure (bullets, tally cards, secondary notes); clay marks the human hand (stamps, underscore, annotations, arrows). Rotation is measured in single degrees — badges at -3deg, notes at ±1–2deg — enough to feel placed by hand, never enough to feel scattered.

**Density philosophy: medium, asymmetric, breathing.** A wide main column (≈60%) carries the stamp, title, underscore, subtitle, and leaf row; a dashed margin column (≈40%) holds one hand note, one tally card, and one takeaway. The margin never competes with the column — it comments on it. Whitespace is the unfilled journal page: comfortable, irregular, and never gridded to symmetry.

**Key Characteristics:**
- Rotated stamp-style bordered badges — double-rule clay outlines at -3deg marking study numbers and verdicts.
- Caveat hand-annotation margins — clay observations, curved SVG arrows, checkmarked takeaways in a dashed margin column.
- CSS leaf-glyph bullets — two-corner rounded squares in leaf green dotting keyword and finding rows.
- Hand-drawn clay underscore beneath the title — a thick rounded rule tilted half a degree off level.
- Tally-card margin modules — bordered leaf cards with oversized slab numerals counting corpus items.
- Fibrous kraft ground — hairline fiber striping plus a soft top-light wash, with dashed moss separators instead of solid rules.

## Colors

### Palette

- **Kraft** (`{colors.kraft}` — `#E9DCC8`): The only slide ground — warm recycled-paper mid-tone.
- **Kraft Deep** (`{colors.kraft-deep}` — `#DCCDAF`): Shading tone for inset wells and card backs where a step darker than ground is needed.
- **Moss Ink** (`{colors.moss-ink}` — `#2E3B2E`): All primary text — titles, body, context, numerals — plus dashed separators.
- **Leaf** (`{colors.leaf}` — `#5A7A4E`): Growth voice — leaf bullets, tally cards and labels, secondary hand notes.
- **Clay** (`{colors.clay}` — `#B4552D`): Hand voice — stamps, underscore, annotations, arrows. The human mark on the page.
- **Dash Ink** (`{colors.dash-ink}` — `rgba(46, 59, 46, 0.45)`): Dashed separator color — margin rule and context top rule.

### Defaults

- **Default surface background**: `{colors.kraft}` with fiber striping and the top-light wash.
- **Default headline color**: `{colors.moss-ink}` in Zilla Slab 600.
- **Default body color**: `{colors.moss-ink}` in Karla; hand notes in clay or leaf Caveat.
- **Default accent pairing**: clay for human marks, leaf for growth structure — never swapped (stamps are clay, bullets are leaf).
- **Default separator**: 2px dashed moss at 45%, never solid — solid rules read as office, not field.

## Typography

### Font Family

The system runs three faces, each locked to its journal role.

**Zilla Slab** is the display face — a sturdy slab with open apertures and a typewriter-adjacent rhythm, used for titles, section heads, and tally numerals. Always left-aligned, always moss ink, never tracked.

**Karla** is the structure face — a warm grotesque with offbeat italics, used for body text, stamp and tally labels (tracked uppercase), leaf rows, and the context line. Karla organizes; it never decorates.

**Caveat** is the hand — a fast, legible handwriting face used only for margin notes, reactions, tally captions, and takeaways. Caveat never carries the title, subtitle, or any primary content — the moment the hand becomes the message, the journal illusion breaks.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.field-title}` | 108px | Zilla Slab | 600 | Cover title, left-aligned |
| `{typography.section-title}` | 68px | Zilla Slab | 600 | Inner-section title |
| `{typography.tally-numeral}` | 120px | Zilla Slab | 700 | Tally-card corpus count |
| `{typography.body-grotesque}` | 42px | Karla | 500 | Cover subtitle / lead body |
| `{typography.body-small}` | 30px | Karla | 400 | Supporting body copy |
| `{typography.stamp-label}` | 26px | Karla | 700 | Stamp badge text, 0.3em tracked |
| `{typography.context-caps}` | 27px | Karla | 700 | Context line, 0.24em tracked |
| `{typography.leaf-item}` | 27px | Karla | 700 | Leaf-bullet row items |
| `{typography.tally-label}` | 22px | Karla | 700 | Tally-card label, 0.26em tracked |
| `{typography.hand-note}` | 52px | Caveat | 600 | Primary margin annotation |
| `{typography.hand-small}` | 44px | Caveat | 600 | Secondary margin notes |
| `{typography.hand-caption}` | 40px | Caveat | 600 | Tally-card handwritten caption |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title is Zilla Slab 600 at 108px, left-aligned, moss ink.** Long titles wrap and shrink via the fit routine (108px toward a 44px floor in 2px steps); titles never center and never track.
- **Every stamp badge is Karla 700 at 0.3em tracking inside a double clay rule, rotated -3deg.** The outline-offset second rule is what reads as "stamp" — a single border reads as a button.
- **Every hand note is Caveat 600 rotated ±1–2deg in clay or leaf.** Upright Caveat reads as a font choice; the slight tilt reads as handwriting.
- **Every context line is Karla 700 at 0.24em tracking behind a dashed moss top rule.** The dashed rule is the context line's signature — never solid, never omitted.
- **Every leaf row pairs 26px leaf-glyph bullets with Karla 700 items.** Bullets are always the two-corner leaf shape, never dots or dashes.
- **Every tally card combines a tracked leaf label, a 120px slab numeral, and a Caveat caption.** All three lines are required — the card's voice is the trio.
- **Every margin annotation column opens with a hand note and closes with a takeaway.** A margin with only a tally card feels like a sidebar; the handwritten bookends make it a margin.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** composed as an asymmetric journal spread: a wide main column (≈60%) and a dashed margin column (≈40%) separated by a 2px dashed vertical moss rule with 64px margin inset. Slide padding is `88px 110px 80px` with an 80px inter-column gap.

The main column stacks stamp row, title (470px box, fit-guarded), clay underscore, subtitle, leaf row, and the context line pinned to the foot behind its dashed rule. The margin column stacks a clay hand note, a curved arrow, the tally card, and a leaf takeaway pinned to the foot. Neither column scrolls; long titles shrink instead.

### Persistent Chrome

The journal furniture persists, not navigation chrome:

- **Stamp row** — a clay stamp badge plus an optional handwritten aside opens the main column on title and section slides.
- **Dashed margin rule** — the vertical dashed separator with its hand-note bookends persists wherever a margin column appears.
- **Context footer** — the dashed-rule context line pins the main-column foot on every slide.

There is no page number, no progress bar, no logo — the journal spread is the chrome.

## Depth and Elevation

Fieldnote builds depth **like paper on a desk**, in the thinnest possible register. The kraft ground carries fiber striping and a top-light wash; the tally card floats on a translucent white back with a 2px grounding keyline; stamps carry a faint inset ink impression. All three effects stay at or under 12% strength — present enough to feel tactile, quiet enough to read as print.

Blurred drop shadows, bevels, and glossy lifts are forbidden — they turn kraft into app UI. If a module needs emphasis, stamp it, tilt it, or hand-underline it; never float it.

## Shapes and Treatment

### Border Radius

Small and purposeful: **4px on stamps and tally cards** (the softened corner of cut paper), **6px on the clay underscore** (the rounded end of a marker stroke), and the **two-corner leaf radius (`0 60% 0 60%`)** on leaf bullets. Large radii and pills are forbidden — nothing on the page is a button.

### Border Weights

- **3px solid clay + 1px outline offset 5px** — the stamp badge double rule.
- **2px solid leaf** — tally-card border.
- **2px dashed moss at 45%** — margin rule and context top rule; the system's only separators.
- **10px clay bar** — the hand-drawn title underscore (a filled bar, not a border).
- No solid ink rules exist anywhere; every separator is dashed.

### Decorative Element Types

**Stamp badge** — Double-rule clay impression with tracked Karla text at -3deg. Marks study numbers, verdicts, and section stamps. The outline-offset second rule is mandatory.

**Hand-annotation margin** — Dashed column holding clay Caveat observations, a curved SVG arrow, and a checkmarked takeaway. Comments on the main column; never carries primary content.

**Leaf bullet** — 26px two-corner rounded square in leaf green at -12deg. Dots keyword and finding rows in groups of two to four.

**Clay underscore** — 340×10 rounded clay bar beneath the title at -0.6deg. One per title slide; the human underline.

**Tally card** — Bordered leaf module with tracked label, oversized slab numeral, and handwritten caption at -1deg. Counts corpus items (postmortems read, interviews held, sites visited).

**Curve arrow** — Hand-drawn 6px clay SVG curve linking margin notes to modules. One or two per slide; arrows always curve, never run straight.

**Kraft ground** — Fiber hairlines plus a top-light wash over kraft. The only permitted background; never flat-filled without the fiber.

## Do's and Don'ts

### Do

- Keep every slide on fibrous kraft with the top-light wash; never flat-fill the ground.
- Set titles in left-aligned Zilla Slab 600 and structure in Karla; reserve Caveat strictly for margin response.
- Stamp study numbers and verdicts with the full double-rule badge at -3deg.
- Separate with dashed moss rules — the margin rule and the context top rule are both dashed.
- Pair clay human marks (stamps, underscore, arrows, primary notes) with leaf growth structure (bullets, tally cards).
- Tilt hand-placed elements in single degrees: stamps -3deg, notes ±1–2deg, underscore -0.6deg.
- Bookend every margin with a hand note on top and a takeaway at the foot.

### Don't

- Don't set primary content — titles, subtitles, body — in Caveat; the hand responds, never informs.
- Don't use solid rules anywhere; a solid divider turns the journal into an office memo.
- Don't swap the accent roles — stamps are clay, bullets are leaf, and never the reverse.
- Don't tilt anything past 4deg; the page is hand-placed, not scattered.
- Don't round anything past 6px and never use pills; nothing on the page is a button.
- Don't add blurred shadows, bevels, or gloss — depth stays at paper-on-desk strength.
- Don't symmetricize the spread; the loose 60/40 asymmetry is the composition.

## Responsive Behavior

Fieldnote is a **fixed-stage system**: all sizes above are 1920×1080 stage coordinates scaled uniformly by one transform. There are no breakpoints and no viewport-fluid rules in generated output.

Long titles are handled by the fit routine (shrink 108px toward a 44px floor in 2px steps until the 470px title box stops overflowing). The 60/40 column split never changes; if title plus subtitle threaten the column, the title shrinks first and the leaf row wraps to two lines before anything reflows.

For source-history reference only: the proportions derive from an open journal spread and would stack main-over-margin below 900px in a fluid context, but generated decks never reflow — they letterbox.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for an equivalent Chinese pairing and apply universal CJK adjustments. All recommended Chinese fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Display / tally numerals | Zilla Slab 600–700 | 思源宋体 Noto Serif SC 600–900 |
| Structure / body / stamps / context | Karla 400–700 | 思源黑体 Noto Sans SC 400–700 |
| Hand / margin notes / captions | Caveat 600 | 思源黑体 Noto Sans SC 500 (upright, unrotated) — see Known CJK Gap |

### Mixed-Content Strategy

**Strategy B** — role-mapped families with a graceful hand fallback. Set slab-role elements to `'Noto Serif SC', serif` and structure-role elements to `'Noto Sans SC', sans-serif`. The Caveat hand has no Chinese counterpart: render CJK margin notes in Noto Sans SC 500 at the hand sizes, unrotated, in the same clay/leaf colors — the color and the dashed margin carry the "annotation" signal once the handwriting voice is gone. Latin fragments inside CJK sentences keep their role's Latin face via stack order.

### Loading

Add to the slide `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700;900&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.6–1.7, display 1.15–1.25.
- **Letter-spacing**: set to 0 on every CJK run. The 0.24–0.3em stamp/context tracking looks broken on square glyphs; keep tracking on Latin-only runs.
- **Text transform**: don't apply `uppercase` to Chinese text. CJK stamps and context lines render without transform at 2px smaller sizes.
- **Punctuation**: use full-width Chinese punctuation （，。：；！？「」（））.
- **No period on display headlines**: omit trailing 。 on display-scale headlines.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin or digits.
- **Rotation**: don't rotate CJK hand-fallback notes — tilted square glyphs read as errors, not handwriting. Keep the stamp tilt (Latin "Nº 11" survives) but set CJK annotations upright.

### Aesthetic Notes for This System

The field-journal voice in a CJK build lives in the kraft ground, the dashed margins, the stamps, and the leaf/tally modules — all of which survive translation intact. Compensate for the lost Caveat hand by keeping annotation colors (clay primary, leaf secondary) and the curved arrows exactly as specified; the arrows do extra work once the handwriting is gone. Keep stamp numerals and tally counts in Latin ("Nº 11", "11") — they read as field codes and preserve the badge silhouettes.

### Known CJK Gap

- **No Chinese handwriting face on the CDN.** Caveat's casual-hand voice — the system's emotional core — has no legible CJK counterpart; Noto Sans SC 500 upright in annotation colors is the documented substitute, and the margin reads calmer than the Latin original.
- **Stamp tracking collapses.** The 0.3em badge tracking that airs out Latin stamps must be zeroed on CJK runs; keep badges compact and let the double rule carry the stamp signal.

## Iteration Guide

1. Any new slide keeps the fibrous kraft ground with the top-light wash and dashed separators. Don't flat-fill or recolor the ground.
2. Any new title uses left-aligned Zilla Slab 600 with the clay underscore; any new body uses Karla; any new margin reaction uses Caveat. Never cross the roles.
3. Any new study number or verdict gets the full double-rule stamp at -3deg — don't simplify to a single border.
4. Any new keyword or finding row uses leaf-glyph bullets with Karla 700 items, two to four per row.
5. Any new corpus count becomes a tally card with all three lines: tracked label, slab numeral, handwritten caption.
6. Any new separator is dashed moss at 45% — never solid, never another color.
7. Any new hand-placed element tilts in single degrees (≤4deg); CJK annotations stay upright.
8. Any new margin column opens with a hand note and closes with a takeaway; the tally card sits between.
9. Long titles shrink via the fit routine toward the 44px floor; never narrow the columns or center the title.
10. New arrows always curve (6px clay SVG); straight arrows and thin connectors don't exist here.

## Known Gaps

- **Fonts**: Zilla Slab / Karla / Caveat via Google Fonts CDN (`display=swap`); fallbacks Georgia, serif / system-ui, sans-serif / cursive. No font files committed. Offline rendering falls back to system stacks and loses the slab/hand contrast.
- **Title fit needs JS.** The shrink-to-fit routine runs on DOMContentLoaded, font-ready, and load plus delayed passes at 800/2000ms for late `display=swap` swaps; without JS, very long titles can overflow the 470px title box. Static export must bake the fitted size.
- **Caveat at small sizes.** The hand face stays legible at 40px+ but degrades fast below 32px; never use Caveat for fine print — Karla 400 carries all small text.
- **Kraft washes out on bright projectors.** `#E9DCC8` can blow toward white under strong lamps; the fiber striping and dashed rules remain the surface signal in that case.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in this design |
| 2 | Blend modes | None used | full | N/A — no blend modes |
| 3 | Animation / keyframes | None used (static journal spread) | full | N/A — static export is native |
| 4 | Pixel / hard offset shadows | None used (flat paper treatment) | full | N/A — no shadows |
| 5 | Gradients | Top-light wash radial + fiber repeating-linear | partial | Nearest two-stop wash; fiber striping flattened into background image |
| 6 | Grain / scanline / noise overlays | Fiber striping via repeating-linear-gradient | partial | Flattened kraft background PNG carrying the fiber |
| 7 | Transparency layers | Card white at 30%, washes under 30% | partial | Opaque kraft-tinted approximations of card/wash fills |
| 8 | Custom fonts | Zilla Slab + Karla + Caveat via Google Fonts CDN | partial | Embed all three faces if licensed; else Georgia + Verdana + Segoe Print substitution |
| 9 | Absolute-positioned decor | Rotated stamps/notes/arrows (transforms, in-flow) | partial | Grouped native shapes with rotation applied; SVG arrow redrawn as a native curve |
