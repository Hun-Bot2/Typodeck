---
version: alpha
name: Cut & Paste
description: A handmade typographic collage system. Archivo Black shouts in two-tone ink-over-red against rotated teal offset blocks; the subtitle rides a taped white scrap with a red torn-edge block; the source line sticks on a tilted yellow note in Caveat hand. Red disc badge, outlined ghost word, tape strips, plus-mark confetti on a dot grid — a pinned-up studio wall, not a slide master.
colors:
  paper: "#F4F1EA"
  ink: "#141414"
  red: "#D7263D"
  teal: "#1B9AAA"
  yellow: "#F4D35E"
  scrap: "#FFFFFF"
shadows:
  offset-red: "14px 14px 0 #D7263D"
  offset-teal: "18px 18px 0 #1B9AAA"
  offset-ink: "8px 8px 0 #141414"
  tape: "2px 3px 6px rgba(20, 20, 20, 0.18)"
typography:
  shout:
    fontFamily: "'Archivo Black', 'Arial Black', sans-serif"
    fontSize: "92px"
    fontWeight: 400
    lineHeight: 1.04
  shout-first-line:
    fontFamily: "'Archivo Black', 'Arial Black', sans-serif"
    fontSize: "92px"
    color: "#D7263D"
  scrap-text:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.45
  body:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.6
  hand-note:
    fontFamily: "'Caveat', cursive"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.25
  badge-numeral:
    fontFamily: "'Archivo Black', 'Arial Black', sans-serif"
    fontSize: "76px"
    fontWeight: 400
    lineHeight: 1
  ghost-word:
    fontFamily: "'Archivo Black', 'Arial Black', sans-serif"
    fontSize: "400px"
    fontWeight: 400
    lineHeight: 1
spacing:
  pad-slide-y: 90px
  pad-slide-x: 130px
  shout-max-width: 1220px
  scrap-max-width: 880px
  scrap-pad: "26px 34px"
  note-max-width: 560px
  tape-w: 120px
  tape-h: 34px
  badge-size: 180px
  max-tilt: 3deg
canvas:
  width: 1920px
  height: 1080px
components:
  shout-block:
    rotation: "-1.2deg"
    offsetBlock: "{shadows.offset-teal}"
    description: "Archivo Black title on a rotated teal slab; first line reversed red-on-paper band, rest ink-on-teal."
  subtitle-scrap:
    background: "{colors.scrap}"
    border: "2px solid {colors.ink}"
    rotation: "1.6deg"
    offsetBlock: "{shadows.offset-red}"
    description: "Bordered white scrap with two taped corners and a red offset torn-edge block."
  tape-strip:
    width: 120px
    height: 34px
    background: "rgba(244, 211, 94, 0.6)"
    boxShadow: "{shadows.tape}"
    description: "Translucent yellow tape pinning scrap corners at ±35 degrees."
  sticky-note:
    background: "{colors.yellow}"
    rotation: "-2.5deg"
    fontFamily: "'Caveat', cursive"
    description: "Tilted yellow note in Caveat hand carrying the source line, taped at top."
  disc-badge:
    size: 180px
    background: "{colors.red}"
    border: "3px solid {colors.ink}"
    rotation: "8deg"
    boxShadow: "{shadows.offset-ink}"
    description: "Ink-ringed red disc with a white Archivo Black content numeral."
  ghost-word:
    stroke: "3px rgba(20, 20, 20, 0.14)"
    fill: transparent
    rotation: "-6deg"
    description: "Giant outlined real title word rotated behind the composition."
  plus-confetti:
    fontSize: 40px
    description: "Scattered teal/red plus marks at mixed rotations on the dot grid."
  dot-grid:
    backgroundImage: "radial-gradient(rgba(20, 20, 20, 0.07) 1.5px, transparent 1.5px)"
    backgroundSize: "28px 28px"
    description: "Faint dotted paper ground covering the whole slide."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Cut & Paste is a **handmade typographic collage system**. Slides are composed like a studio wall: a shouting Archivo Black headline pasted over a teal offset block, a bordered subtitle scrap taped at the corners over a red offset block, a yellow sticky note in Caveat hand for the source line, and a tilted red disc badge punching the content numeral. A giant outlined ghost word — always a genuine word from the title — rotates behind everything, and plus-mark confetti scatters over a faint dot grid.

The type stack is three voices. **Archivo Black** shouts: titles, badge numerals, the ghost word. **Libre Franklin** (500 on scraps, 400 for body) talks: subtitles, paragraphs, anything that must read effortlessly. **Caveat** (600) scribbles: the sticky-note source line and hand underlines only. Black shouts once per slide; Franklin carries sustained reading; Caveat never sets anything structural.

Color is deliberately clashing but controlled: paper ground `{colors.paper}`, ink `{colors.ink}` for type and borders, and three paste colors — red `{colors.red}`, teal `{colors.teal}`, yellow `{colors.yellow}` — each with a fixed job. Red punches (first line, badge, scrap offset). Teal backs (title block, swash, confetti). Yellow sticks (tape, sticky note). White `{colors.scrap}` exists only as scrap stock.

**Density philosophy: composed mess.** Layers overlap and tilt, but hierarchy is rigid — shout first, scrap second, sticky third, badge as punctuation. Text-bearing scraps stay within ±3 degrees so collage never costs legibility; only the badge (8°) and ghost word (−6°) tilt harder, and neither carries sentences.

**Key Characteristics:**
- Two-tone shout: red first line over ink Archivo Black, backed by a rotated teal offset block.
- Bordered white subtitle scrap with taped corners and a red offset torn-edge block.
- Tilted yellow Caveat sticky note for the source line, taped at top.
- Ink-ringed red disc badge with a white content numeral at 8 degrees.
- Outlined ghost word (real title word) at −6 degrees and 14% ink behind everything.
- Translucent tape strips, plus-mark confetti, faint 28px dot grid — no master alignment grid.

## Colors

### Palette

- **Paper** (`{colors.paper}` — `#F4F1EA`): The studio-table ground with the faint dot grid.
- **Ink** (`{colors.ink}` — `#141414`): Display type, scrap borders, badge ring, offset punctuation.
- **Red** (`{colors.red}` — `#D7263D`): Punch color — shout first line, disc badge, scrap offset block, confetti.
- **Teal** (`{colors.teal}` — `#1B9AAA`): Backing color — title offset block, underline swash, confetti.
- **Yellow** (`{colors.yellow}` — `#F4D35E`): Sticky color — tape strips (at 60% alpha), sticky note (full).
- **Scrap white** (`{colors.scrap}` — `#FFFFFF`): Subtitle scrap stock only, always with a 2px ink border.

### Defaults

- **Default surface background**: `{colors.paper}` with the 28px dot grid (`{components.dot-grid}`).
- **Default headline treatment**: `{typography.shout}` with red `::first-line` and teal offset block.
- **Default body text color**: `{colors.ink}` in Libre Franklin 400/500.
- **Default hand color**: `{colors.ink}` in Caveat 600 on yellow.
- **Default badge**: red disc, white numeral, 3px ink ring, 8px ink offset.

No gradients anywhere; all color is flat paste. Opacity appears only in tape (60%) and the ghost stroke (14%).

## Typography

### Font Family

**Archivo Black** is the shout — a single-weight grotesque poster face for titles, badge numerals, and the ghost word. It appears at large sizes only (76px and up) and never sets sentences outside the title.

**Libre Franklin** is the talker — a sturdy grotesk for subtitle scraps (500), body text (400), and any sustained reading. It is the only face allowed inside bordered scraps.

**Caveat** is the hand — a marker script at 600 for the sticky-note source line and hand-drawn-feeling accents. It never sets headlines or body.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.shout}` | 92px | Archivo Black | 400 | Title, red first line, teal offset |
| `{typography.scrap-text}` | 30px | Libre Franklin | 500 | Subtitle scrap text |
| `{typography.body}` | 24px | Libre Franklin | 400 | Body paragraphs |
| `{typography.hand-note}` | 32px | Caveat | 600 | Sticky-note source line |
| `{typography.badge-numeral}` | 76px | Archivo Black | 400 | White numeral in red disc |
| `{typography.ghost-word}` | 400px | Archivo Black | 400 | Outlined background word |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every shout carries a red first line on a paper band.** The title's `::first-line` renders in `{colors.red}` over `{colors.paper}`; remaining lines render in ink directly on the teal slab. A single-color shout is unfinished.
- **Every shout sits on a full teal slab.** The slab extends past the title box (`-14px -28px -22px`) at 1.2 degrees; ink-on-teal carries the lower lines.
- **Every subtitle scrap has a 2px ink border, two tape strips, and a red offset block.** Unbordered, untaped, or unoffset scraps do not exist.
- **Every sticky note is yellow, Caveat 600, tilted −2.5 degrees, with one top tape strip.** The hand voice appears nowhere else.
- **Every badge numeral is white Archivo Black in the ink-ringed red disc at 8 degrees.** The disc carries a content numeral or single content glyph only.
- **Every ghost word is a genuine title word**, transparent-filled with a 3px 14%-ink stroke at −6 degrees. Invented background words are forbidden.
- **Every tape strip is 120×34px translucent yellow at ±35 degrees**, overlapping the scrap edge it pins.

### Typography Principles

The voice contrast is **shout ↔ talk ↔ scribble**. Archivo Black should feel pasted on — big, tight (1.04), slightly rotated, never letterspaced. Libre Franklin should feel plain and helpful — normal case, no tracking, comfortable leading. Caveat should feel quickly written — sentence case, no tracking, tilted with its note. Uppercase is reserved for the ghost word and badge; running text never shouts in caps.

## Layout

### Canvas System

Each slide is a fixed 1920×1080 stage with 130px side padding and 90px top clearance. Composition is a **broken free grid**: a left-anchored flow column (shout → swash → scrap) plus absolutely positioned paste-ons (ghost word, badge, sticky note, confetti). The flow column keeps hierarchy legible; the paste-ons supply the collage chaos around it, never over reading text.

### Persistent Chrome

There is no fixed furniture — collage has no running heads or folios. Three recurring anchors appear on every slide instead:

- **Ghost word** (`{components.ghost-word}`) — outlined title word, right side, behind everything.
- **Disc badge** (`{components.disc-badge}`) — red numeral disc, top-right, tilted 8°.
- **Sticky note** (`{components.sticky-note}`) — yellow Caveat source line, bottom-right, tilted −2.5°.

Page position, where needed, is carried by the badge numeral itself (a content numeral), never by a separate counter.

### Composition Rules

Text-bearing layers tilt at most ±3°: shout −1.2°, scrap +1.6°, sticky −2.5°. Offset blocks counter-rotate against their layer (teal +1.5° behind the shout, red −1° behind the scrap) so color peeks unevenly like torn edges. Tape strips overlap scrap edges by half their width. Confetti plus-marks keep 60px clearance from reading text. No layer may cover another layer's text — overlaps are edge-to-edge only.

## Depth and Elevation

Depth is **paste depth**: flat solid offset blocks, never blurred shadows. The vocabulary is three offsets — `{shadows.offset-red}` (14px), `{shadows.offset-teal}` (18px), `{shadows.offset-ink}` (8px) — each a hard solid step that reads as a layer of paper or a thick paste edge. Tape strips alone carry a small soft shadow (`{shadows.tape}`) to sell translucency. Stacking order is fixed: dot grid → ghost word → offset blocks → shout/scrap/sticky → tape → badge → confetti. Elevation never changes on interaction; the wall is already pasted.

## Shapes and Treatment

### Border Radius

Paper is square: scraps, notes, offset blocks, and tape have zero radius. The single round shape in the system is the **disc badge** (50% radius) — its roundness against all-square paper is the point. Ghost type, swash bars, and confetti follow their own geometry (swash bars square, confetti plain glyphs).

### Border Weights

- **2px solid ink** — subtitle scrap border. The only bordered rectangle.
- **3px solid ink** — disc badge ring.
- **3px 14%-ink stroke** — ghost word outline (`-webkit-text-stroke` with transparent fill).
- **14px solid red** — underline swash bar beneath the shout's teal slab.
- Tape has no border; sticky notes have no border (their tilt + tape + color carry them).

### Decorative Element Types

**Shout block** — Two-tone Archivo Black title at −1.2° on a counter-rotated teal offset block.

**Underline swash** — 14px red bar, 60% of shout width, rotated −1°, tucked under the teal slab.

**Subtitle scrap** — White 2px-bordered scrap at +1.6° with two corner tapes and a red offset torn-edge block.

**Tape strip** — 120×34px translucent yellow at ±35°, half-overlapping the edge it pins.

**Sticky note** — Yellow Caveat note at −2.5° with one top tape strip; carries the source line verbatim.

**Disc badge** — Red 180px disc, ink ring, white numeral, 8° tilt, 8px ink offset.

**Ghost word** — 400px outlined title word at −6°, right side, behind all reading layers.

**Plus confetti** — 40px teal/red plus marks at mixed rotations, clear of reading text.

**Dot grid** — 28px faint dotted paper ground across the whole slide.

## Do's and Don'ts

### Do

- Shout in two tones — red first line, ink below — on a counter-rotated teal block.
- Border, tape, and offset every subtitle scrap; all three treatments travel together.
- Tilt text-bearing layers within ±3° and counter-rotate their offset blocks.
- Pull the ghost word from the real title and keep it behind everything at 14% stroke.
- Carry the source line verbatim on the yellow Caveat sticky with its top tape.
- Keep confetti 60px clear of reading text and overlaps edge-to-edge only.
- Use flat paste color only — the three offsets are the entire depth system.
- Let layers collide at edges; neat gutters are the enemy of collage.

### Don't

- Don't align layers to a master grid or equalize their margins — the free grid is the layout.
- Don't tilt sentences past ±3° or rotate body text at all; legibility beats chaos.
- Don't invent ghost words, badge numerals, or sticky scribbles — every visible word is real content.
- Don't blur offsets, round scraps, or gradient-wash the paper — paste is flat and square.
- Don't set headlines in Caveat or body in Archivo Black; the three voices never swap.
- Don't outline or shadow the shout itself — its backing block does the depth work.
- Don't tape the badge or the ghost word; tape pins paper scraps only.
- Don't add chrome a studio wall would not have: no nav dots, no counters, no progress bars.

## Responsive Behavior

The finished deck is a fixed 1920×1080 stage scaled by one uniform transform (see Fixed-Stage Policy); it letterboxes on other viewports and never reflows. The free-grid composition is tuned in absolute stage coordinates: the flow column absorbs long titles by wrapping (verify ≤6 shout lines and scrap clearance before capture), while the absolute paste-ons hold fixed stage positions. No breakpoints or collapse rules ship in generated output.

## CJK & International Content

When setting Korean or other CJK content, keep the collage structure and swap the three voices for CJK-capable faces: **Noto Sans KR** 900 for the shout and badge, **Noto Sans KR** 400/500 for scraps and body, and **Nanum Pen Script** for the sticky-note hand.

Recommended pairing:

| Role | Latin (default) | CJK counterpart |
|---|---|---|
| Shout / badge / ghost | Archivo Black | Noto Sans KR 900 |
| Scrap / body | Libre Franklin 400/500 | Noto Sans KR 400/500 |
| Sticky hand | Caveat 600 | Nanum Pen Script 400 |

Loading (add alongside the Latin families):

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;900&family=Nanum+Pen+Script&display=swap" rel="stylesheet">
```

Universal CJK adjustments: letter-spacing 0 on all CJK runs; no uppercase transforms; raise shout leading to 1.25 and scrap leading to 1.65; keep the red `::first-line` (it works on any script); keep all tilts, offsets, tape, and the badge exactly as specified — collage geometry is script-independent. The ghost word uses the CJK title's strongest content word at the same 400px outline treatment.

Known CJK gap: Nanum Pen Script is lighter and narrower than Caveat, so the sticky note reads slightly less marker-bold; widen the note by ~10% in CJK builds. Noto Sans KR 900 is less poster-crude than Archivo Black — the red first line and teal offset must carry the shout attitude the face alone cannot.

## Iteration Guide

1. Any new shout uses Archivo Black at 92px/1.04 with the red first line and teal offset block at −1.2°.
2. Any new subtitle uses the full scrap treatment: white stock, 2px ink border, two tapes, red offset, +1.6°.
3. Any new source line goes on the yellow Caveat sticky at −2.5° with its top tape — never as plain footer text.
4. Any new badge carries a real content numeral in the red disc at 8° with ink ring and offset.
5. Any new background word is a genuine title word at 400px outlined, −6°, behind everything.
6. Any new tape strip is 120×34px translucent yellow at ±35°, half-overlapping its scrap edge.
7. Any new confetti is a teal/red plus at 40px, 60px clear of reading text.
8. Any new layer keeps text tilts within ±3° and overlaps edge-to-edge, never over reading text.
9. Any new color comes from the six declared tokens; alpha only on tape (60%) and ghost stroke (14%).
10. Verify every new slide at 1920×1080 for shout wrap (≤6 lines), scrap/sticky clearance, and badge overlap before capture.

## Known Gaps

- **Fonts**: Archivo Black / Libre Franklin / Caveat via Google Fonts CDN (`display=swap`); fallbacks Arial Black, sans-serif / system-ui, sans-serif / cursive. No font files committed. Offline rendering falls back to system stacks and the shout loses its poster voice.
- **Ghost outline** uses `-webkit-text-stroke` with transparent fill; renderers without text-stroke support show a faint solid word — set a 14%-ink solid fallback color first in the stack.
- **`::first-line` tone** follows wrapping, so the red/ink boundary moves with title length; verify the break reads intentionally on every title.
- **Tape translucency** flattens to opaque pale yellow on export targets without alpha compositing.
- **Plus confetti and tilts** are static in this system; there is no entrance animation to preserve or drop.

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Tape soft shadow only (`2px 3px 6px`) | partial | Flat tape, no shadow |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used | full | N/A — static wall |
| 4 | Pixel / hard offset shadows | Solid red/teal/ink offset blocks | full | Native offset rectangles |
| 5 | Gradients | Dot grid via radial-gradient dots | partial | Flat paper + dotted pattern fill |
| 6 | Grain / scanline / noise overlays | Dot grid only (see row 5) | partial | Pattern fill or flat paper |
| 7 | Transparency layers | Tape at 60% alpha; ghost stroke 14% | partial | Opaque pale-yellow tape; 20%-gray outline word |
| 8 | Custom fonts | Archivo Black + Libre Franklin + Caveat via Google Fonts CDN | partial | Embedded faces; fallback Arial Black / system-ui / cursive |
| 9 | Absolute-positioned decor | Ghost, badge, sticky, tape, confetti absolutely placed | full | Grouped native shapes at fixed coordinates |
