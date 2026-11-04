---
version: alpha
name: Fieldnote
description: An eco kraft presentation system that sets sturdy Zilla Slab titles loose and left-aligned on solid kraft, with Karla body text and Caveat handwriting annotating whitespace margins. Rotated stamp lines, leaf word-rows, tally margin blocks, and checkmarked takeaways make every slide feel gathered by hand in the field. Typography-only register: no badges, underscores, bullets-as-shapes, cards, arrows, dashes, fiber, or washes exist — hierarchy is carried by the three type voices, tilt, and whitespace alone.

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
  stamp-line:
    rotation: -3deg
    color: "{colors.clay}"
    fontSize: 26px
    fontWeight: 700
    letterSpacing: 0.3em
    textTransform: uppercase
    fontFamily: "'Karla', system-ui, sans-serif"
    description: "Bare clay tracked-caps stamp line marking study numbers and verdicts, tilted -3deg like a fresh impression. No border, no outline."
  leaf-marker:
    size: 26px
    color: "{colors.leaf}"
    description: "Typographic middot marker in leaf green; separates keyword rows and findings."
  leaf-word:
    color: "{colors.leaf}"
    fontSize: 27px
    fontWeight: 700
    fontFamily: "'Karla', system-ui, sans-serif"
    description: "Keyword row as plain bold leaf words separated by middots. No bullets-as-shapes."
  tally-block:
    rotation: -1deg
    description: "Typographic tally: tracked leaf label, oversized slab numeral, and handwritten caption. No border, no fill."
  margin-note:
    color: "{colors.clay}"
    fontSize: 52px
    fontFamily: "'Caveat', cursive"
    description: "Large rotated clay handwriting reacting to the main column from the whitespace margin."
  takeaway:
    color: "{colors.leaf}"
    fontSize: 44px
    fontFamily: "'Caveat', cursive"
    description: "Checkmarked leaf takeaway closing the margin column. The check is a text glyph, never a drawn mark."
  kraft-ground:
    background: "{colors.kraft}"
    description: "Solid flat kraft ground. No fiber, no wash, no texture."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and column collisions.

## Overview

Fieldnote is an **eco kraft presentation system**. Its foundational premise is the **gathered page**: every slide behaves like a journal spread where printed structure (slab title, grotesque body, stamp lines) meets handwritten response (margin notes, tallies, takeaways) on solid kraft.

The type stack is three voices in field-journal roles. **Zilla Slab** is the display face — a sturdy humanist slab with typewriter roots that carries titles and tally numerals, loose and left-aligned. **Karla** is the structure face — a slightly quirky grotesque for body text, stamp lines, leaf word-rows, and the context line. **Caveat** is the hand — a quick casual handwriting face used only for margin annotations, reactions, and tally captions. The hand never carries primary content; it responds to it.

The palette is foraged: **kraft ground, moss ink, leaf green, clay red**. Kraft is the only surface; moss sets all primary text; leaf voices growth-adjacent words (word-rows, tally labels, secondary notes); clay marks the human hand (stamp lines, annotations, takeaways). Rotation is measured in single degrees — stamp lines at -3deg, notes at ±1–2deg — enough to feel placed by hand, never enough to feel scattered.

**Density philosophy: medium, asymmetric, breathing.** A wide main column (≈60%) carries the stamp line, title, subtitle, and leaf word-row; a whitespace margin column (≈40%) holds one hand note, one tally block, and one takeaway. The margin never competes with the column — it comments on it. Whitespace is the unfilled journal page: comfortable, irregular, and never gridded to symmetry.

**Key Characteristics:**
- Rotated clay stamp lines — bare tracked caps at -3deg marking study numbers and verdicts.
- Caveat hand-annotation margins — clay observations and checkmarked takeaways in a whitespace margin column.
- Leaf word-rows — bold leaf keywords separated by middots; findings use leaf middot markers.
- Typographic tally blocks — tracked label, oversized slab numeral, and handwritten caption with no border or fill.
- Solid flat kraft ground — no fiber, no wash, no texture; whitespace separates instead of rules.

## Colors

### Palette

- **Kraft** (`{colors.kraft}` — `#E9DCC8`): The only slide ground — warm recycled-paper mid-tone, flat.
- **Kraft Deep** (`{colors.kraft-deep}` — `#DCCDAF`): Retained token; no visible role in the typography-only register.
- **Moss Ink** (`{colors.moss-ink}` — `#2E3B2E`): All primary text — titles, body, context, numerals.
- **Leaf** (`{colors.leaf}` — `#5A7A4E`): Growth voice — leaf word-rows, tally labels, secondary hand notes.
- **Clay** (`{colors.clay}` — `#B4552D`): Hand voice — stamp lines, annotations, takeaways. The human mark on the page.
- **Dash Ink** (`{colors.dash-ink}` — `rgba(46, 59, 46, 0.45)`): Retained token; no visible role in the typography-only register.

### Defaults

- **Default surface background**: `{colors.kraft}` solid and flat. No fiber, no wash, no texture.
- **Default headline color**: `{colors.moss-ink}` in Zilla Slab 600.
- **Default body color**: `{colors.moss-ink}` in Karla; hand notes in clay or leaf Caveat.
- **Default accent pairing**: clay for human marks, leaf for growth words — never swapped (stamp lines are clay, word-rows are leaf).
- **Default separator**: none — whitespace rhythm separates; solid and dashed rules alike do not exist.

## Typography

### Font Family

The system runs three faces, each locked to its journal role.

**Zilla Slab** is the display face — a sturdy slab with open apertures and a typewriter-adjacent rhythm, used for titles, section heads, and tally numerals. Always left-aligned, always moss ink, never tracked.

**Karla** is the structure face — a warm grotesque with offbeat italics, used for body text, stamp and tally labels (tracked uppercase), leaf word-rows, and the context line. Karla organizes; it never decorates.

**Caveat** is the hand — a fast, legible handwriting face used only for margin notes, reactions, tally captions, and takeaways. Caveat never carries the title, subtitle, or any primary content — the moment the hand becomes the message, the journal illusion breaks.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.field-title}` | 108px | Zilla Slab | 600 | Cover title, left-aligned |
| `{typography.section-title}` | 68px | Zilla Slab | 600 | Inner-section title |
| `{typography.tally-numeral}` | 120px | Zilla Slab | 700 | Tally corpus count |
| `{typography.body-grotesque}` | 42px | Karla | 500 | Cover subtitle / lead body |
| `{typography.body-small}` | 30px | Karla | 400 | Supporting body copy |
| `{typography.stamp-label}` | 26px | Karla | 700 | Stamp-line text, 0.3em tracked |
| `{typography.context-caps}` | 27px | Karla | 700 | Context line, 0.24em tracked |
| `{typography.leaf-item}` | 27px | Karla | 700 | Leaf word-row items |
| `{typography.tally-label}` | 22px | Karla | 700 | Tally label, 0.26em tracked |
| `{typography.hand-note}` | 52px | Caveat | 600 | Primary margin annotation |
| `{typography.hand-small}` | 44px | Caveat | 600 | Secondary margin notes |
| `{typography.hand-caption}` | 40px | Caveat | 600 | Tally handwritten caption |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title is Zilla Slab 600 at 108px, left-aligned, moss ink.** Long titles wrap and shrink via the fit routine (108px toward a 44px floor in 2px steps); titles never center and never track.
- **Every stamp line is bare Karla 700 clay at 0.3em tracking, rotated -3deg.** The tilt and tracking read as "stamp" — borders and outlines do not exist.
- **Every hand note is Caveat 600 rotated ±1–2deg in clay or leaf.** Upright Caveat reads as a font choice; the slight tilt reads as handwriting.
- **Every context line is Karla 700 at 0.24em tracking with whitespace above.** No rule of any kind — the position pins the foot.
- **Every leaf row pairs Karla 700 items with leaf middot separators.** Markers are always the "·" glyph, never shapes or dashes.
- **Every tally block combines a tracked leaf label, a 120px slab numeral, and a Caveat caption.** All three lines are required — the block's voice is the trio.
- **Every margin annotation column opens with a hand note and closes with a takeaway.** A margin with only a tally block feels like a sidebar; the handwritten bookends make it a margin.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** composed as an asymmetric journal spread: a wide main column (≈60%) and a whitespace margin column (≈40%) separated by an 80px gutter with 64px margin inset. Slide padding is `88px 110px 80px` with an 80px inter-column gap.

The main column stacks stamp row, title (470px box, fit-guarded), subtitle, leaf word-row, and the context line pinned to the foot with whitespace above. The margin column stacks a clay hand note, the tally block, and a leaf takeaway pinned to the foot. Neither column scrolls; long titles shrink instead.

### Persistent Chrome

The journal furniture persists, not navigation chrome:

- **Stamp row** — a clay stamp line plus an optional handwritten aside opens the main column on title and section slides.
- **Margin bookends** — the hand note on top and takeaway at the foot persist wherever a margin column appears.
- **Context footer** — the bare context line pins the main-column foot on every slide.

There is no page number, no progress bar, no logo — the journal spread is the chrome.

## Depth and Elevation

Fieldnote builds depth **like ink on a desk**: the kraft ground is solid and flat, and hierarchy comes from the three type voices, tilt, and whitespace. No fiber, no wash, no translucent backs, no keylines, no inset impressions — the retained texture tokens are unrendered.

Blurred drop shadows, bevels, glossy lifts, borders, and fills are forbidden — they turn kraft into app UI. If a module needs emphasis, stamp it or tilt it; never box it, underline it, or float it.

## Shapes and Treatment

### Border Radius

There is nothing to round: no stamps-as-boxes, tally cards, underscores, or leaf shapes exist in the typography-only register. Letterforms carry all the softness; large radii and pills are forbidden — nothing on the page is a button.

### Border Weights

Borders do not exist. There are no stamp rules, tally borders, margin rules, context rules, underscore bars, or arrows; every separator — solid or dashed — is forbidden. Whitespace is the only separator.

### Decorative Element Types

**Stamp line** — Bare clay tracked Karla caps at -3deg. Marks study numbers, verdicts, and section stamps. The tilt is mandatory.

**Hand-annotation margin** — Whitespace column holding clay Caveat observations and a checkmarked takeaway. Comments on the main column; never carries primary content.

**Leaf word-row** — Bold leaf Karla keywords separated by middots, in groups of two to four. Findings use leaf "·" markers.

**Tally block** — Tracked leaf label, oversized slab numeral, and handwritten caption at -1deg. Counts corpus items (postmortems read, interviews held, sites visited).

**Takeaway** — Leaf Caveat line with a "✓" text glyph closing the margin. The check is type, never a drawn mark.

**Kraft ground** — Solid flat kraft. The only permitted background; never textured, never washed.

## Do's and Don'ts

### Do

- Keep every slide on solid flat kraft; never texture, wash, or recolor the ground.
- Set titles in left-aligned Zilla Slab 600 and structure in Karla; reserve Caveat strictly for margin response.
- Stamp study numbers and verdicts with the bare clay stamp line at -3deg.
- Separate with whitespace only — no dashed or solid rules of any kind.
- Pair clay human marks (stamp lines, primary notes, takeaways) with leaf growth words (word-rows, tally labels).
- Tilt hand-placed elements in single degrees: stamp lines -3deg, notes ±1–2deg.
- Bookend every margin with a hand note on top and a takeaway at the foot.

### Don't

- Don't set primary content — titles, subtitles, body — in Caveat; the hand responds, never informs.
- Don't use rules, badges, cards, arrows, or underscores anywhere; dividers turn the journal into an office memo.
- Don't swap the accent roles — stamp lines are clay, word-rows are leaf, and never the reverse.
- Don't tilt anything past 4deg; the page is hand-placed, not scattered.
- Don't add boxes, pills, borders, fills, or textures; nothing on the page is a button.
- Don't add blurred shadows, bevels, or gloss — depth stays at ink-on-desk flatness.
- Don't symmetricize the spread; the loose 60/40 asymmetry is the composition.

## Responsive Behavior

Fieldnote is a **fixed-stage system**: all sizes above are 1920×1080 stage coordinates scaled uniformly by one transform. There are no breakpoints and no viewport-fluid rules in generated output.

Long titles are handled by the fit routine (shrink 108px toward a 44px floor in 2px steps until the 470px title box stops overflowing). The 60/40 column split never changes; if title plus subtitle threaten the column, the title shrinks first and the leaf word-row wraps to two lines before anything reflows.

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

**Strategy B** — role-mapped families with a graceful hand fallback. Set slab-role elements to `'Noto Serif SC', serif` and structure-role elements to `'Noto Sans SC', sans-serif`. The Caveat hand has no Chinese counterpart: render CJK margin notes in Noto Sans SC 500 at the hand sizes, unrotated, in the same clay/leaf colors — the color and the margin position carry the "annotation" signal once the handwriting voice is gone. Latin fragments inside CJK sentences keep their role's Latin face via stack order.

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
- **Korean word wrap (D24 fix)**: the title and subtitle carry `word-break: keep-all; overflow-wrap: normal` so breaks fall only at spaces (no orphan syllable), and the fit routine applies `text-wrap: balance` only when the title contains Hangul — the Korean two-liner wraps "서두른 출시의" / "숨은 비용" (D27-style) while Latin titles keep their authored breaks. No column change was needed: the balanced two-liner keeps clear of the subtitle inside the 470px title box.

### Aesthetic Notes for This System

The field-journal voice in a CJK build lives in the kraft ground, the 60/40 spread, the stamp lines, and the leaf/tally words — all of which survive translation intact. Compensate for the lost Caveat hand by keeping annotation colors (clay primary, leaf secondary) exactly as specified; the margin position does extra work once the handwriting is gone. Keep stamp numerals and tally counts in Latin ("Nº 11", "11") — they read as field codes and preserve the stamp silhouettes.

### Known CJK Gap

- **No Chinese handwriting face on the CDN.** Caveat's casual-hand voice — the system's emotional core — has no legible CJK counterpart; Noto Sans SC 500 upright in annotation colors is the documented substitute, and the margin reads calmer than the Latin original.
- **Stamp tracking collapses.** The 0.3em tracking that airs out Latin stamp lines must be zeroed on CJK runs; keep stamp lines compact and let the clay color carry the stamp signal.

## Iteration Guide

1. Any new slide keeps the solid flat kraft ground with whitespace separators. Don't texture, wash, or recolor the ground.
2. Any new title uses left-aligned Zilla Slab 600 with no underscore; any new body uses Karla; any new margin reaction uses Caveat. Never cross the roles.
3. Any new study number or verdict gets the bare clay stamp line at -3deg — don't add borders or rules.
4. Any new keyword or finding row uses leaf Karla 700 items with middot separators, two to four per row.
5. Any new corpus count becomes a tally block with all three lines: tracked label, slab numeral, handwritten caption.
6. Any new separator is whitespace — rules of any kind are forbidden.
7. Any new hand-placed element tilts in single degrees (≤4deg); CJK annotations stay upright.
8. Any new margin column opens with a hand note and closes with a takeaway; the tally block sits between.
9. Long titles shrink via the fit routine toward the 44px floor; never narrow the columns or center the title.
10. Arrows do not exist here — proximity and the margin position link notes to blocks.

## Known Gaps

- **Fonts**: Zilla Slab / Karla / Caveat via Google Fonts CDN (`display=swap`); fallbacks Georgia, serif / system-ui, sans-serif / cursive. No font files committed. Offline rendering falls back to system stacks and loses the slab/hand contrast.
- **Title fit needs JS.** The shrink-to-fit routine runs on DOMContentLoaded, font-ready, and load plus delayed passes at 800/2000ms for late `display=swap` swaps; without JS, very long titles can overflow the 470px title box. Static export must bake the fitted size.
- **Caveat at small sizes.** The hand face stays legible at 40px+ but degrades fast below 32px; never use Caveat for fine print — Karla 400 carries all small text.
- **Kraft washes out on bright projectors.** `#E9DCC8` can blow toward white under strong lamps; the three-voice type contrast remains the surface signal in that case.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in this design |
| 2 | Blend modes | None used | full | N/A — no blend modes |
| 3 | Animation / keyframes | None used (static journal spread) | full | N/A — static export is native |
| 4 | Pixel / hard offset shadows | None used (flat paper treatment) | full | N/A — no shadows |
| 5 | Gradients | Not used (solid kraft ground) | full | N/A — no gradients in this register |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — no overlays in this register |
| 7 | Transparency layers | None used (all type opaque) | full | N/A |
| 8 | Custom fonts | Zilla Slab + Karla + Caveat via Google Fonts CDN | partial | Embed all three faces if licensed; else Georgia + Verdana + Segoe Print substitution |
| 9 | Absolute-positioned decor | None — in-flow layout with rotated type | full | Native text boxes with rotation applied |
