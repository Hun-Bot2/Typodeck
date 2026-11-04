---
version: alpha
name: Cut & Paste
description: A handmade typographic collage system. Archivo Black shouts in two-tone red-over-ink with tilted type layers; the subtitle sets as tilted Franklin type; the source line runs in Caveat hand. Red content numeral, outlined ghost word, ▸ markers, plus-mark confetti on solid paper — a pinned-up studio wall in pure type, not a slide master.
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
    fontSize: "340px"
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
    fontFamily: "'Archivo Black', 'Arial Black', sans-serif"
    description: "Two-tone Archivo Black title in tilted free type: red first line, ink below. No slab."
  subtitle-scrap:
    status: retired
    successor: "subtitle-line"
    description: "RETIRED as a bordered taped scrap in the typography-only vocabulary. Subtitles set as tilted Franklin type."
  subtitle-line:
    rotation: "1.6deg"
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    description: "Tilted Franklin subtitle in plain ink type. No border, tape, or offset."
  tape-strip:
    status: retired
    description: "RETIRED in the typography-only vocabulary: tape strips are removed. Tilt and position carry the collage."
  sticky-note:
    status: retired
    successor: "hand-line"
    description: "RETIRED as a yellow note in the typography-only vocabulary. Source lines set as tilted Caveat ink type."
  hand-line:
    rotation: "-2.5deg"
    fontFamily: "'Caveat', cursive"
    description: "Tilted Caveat ink hand line carrying the source line verbatim. No fill, no tape."
  disc-badge:
    status: retired
    successor: "content-numeral"
    description: "RETIRED as an ink-ringed disc in the typography-only vocabulary. Numerals set as tilted red free type."
  content-numeral:
    rotation: "8deg"
    fontFamily: "'Archivo Black', 'Arial Black', sans-serif"
    color: "{colors.red}"
    description: "Tilted red Archivo Black content numeral in free type. Real content only."
  ghost-word:
    stroke: "3px rgba(20, 20, 20, 0.14)"
    fill: transparent
    rotation: "-6deg"
    description: "Giant outlined real title word rotated behind the composition."
  plus-confetti:
    fontSize: 40px
    description: "Scattered teal/red plus marks at mixed rotations on solid paper."
  dot-grid:
    status: retired
    successor: "paper"
    description: "RETIRED in the typography-only vocabulary: the ground is solid paper, unprinted."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Cut & Paste is a **handmade typographic collage system**. Slides are composed like a studio wall in pure type: a shouting two-tone Archivo Black headline in tilted free type, a tilted Franklin subtitle line, a Caveat hand line for the source line, and a tilted red content numeral punching the figure. A giant outlined ghost word — always a genuine word from the title — rotates behind everything, and plus-mark confetti scatters over solid paper.

The type stack is three voices. **Archivo Black** shouts: titles, content numerals, the ghost word. **Libre Franklin** (500 for subtitles, 400 for body) talks: subtitles, paragraphs, anything that must read effortlessly. **Caveat** (600) scribbles: the source hand line only. Black shouts once per slide; Franklin carries sustained reading; Caveat never sets anything structural.

Color is deliberately clashing but controlled: paper ground `{colors.paper}`, ink `{colors.ink}` for type, and two working accents — red `{colors.red}` and teal `{colors.teal}` — each with a fixed job. Red punches (first line, numeral, confetti). Teal marks (▸ markers, confetti). Yellow `{colors.yellow}` and scrap white `{colors.scrap}` are retained palette tokens with no type-only usage: yellow text fails on paper, so the sticky voice survives as tilted Caveat ink.

**Density philosophy: composed mess.** Type layers tilt, but hierarchy is rigid — shout first, subtitle second, hand third, numeral as punctuation. Text-bearing layers stay within ±3 degrees so collage never costs legibility; only the numeral (8°) and ghost word (−6°) tilt harder, and neither carries sentences.

**Key Characteristics:**
- Two-tone shout: red first line over ink Archivo Black in tilted free type.
- Tilted Franklin subtitle line in plain ink type.
- Tilted Caveat hand line for the source line.
- Tilted red content numeral in free type at 8 degrees.
- Outlined ghost word (real title word) at −6 degrees and 14% ink behind everything.
- Plus-mark confetti on solid paper — no master alignment grid.

## Colors

### Palette

- **Paper** (`{colors.paper}` — `#F4F1EA`): The studio-table ground, solid and unprinted.
- **Ink** (`{colors.ink}` — `#141414`): Display type, subtitle type, hand type.
- **Red** (`{colors.red}` — `#D7263D`): Punch color — shout first line, content numeral, confetti.
- **Teal** (`{colors.teal}` — `#1B9AAA`): Marker color — ▸ list markers and confetti.
- **Yellow** (`{colors.yellow}` — `#F4D35E`): Retained palette token with no type-only usage (yellow text fails on paper).
- **Scrap white** (`{colors.scrap}` — `#FFFFFF`): Retained palette token; scrap stock retired with the scraps.

### Defaults

- **Default surface background**: `{colors.paper}`, flat and unprinted.
- **Default headline treatment**: `{typography.shout}` with red `::first-line`, tilted free type.
- **Default body text color**: `{colors.ink}` in Libre Franklin 400/500.
- **Default hand color**: `{colors.ink}` in Caveat 600, tilted.
- **Default numeral**: red Archivo Black content numeral at 8° (`{typography.badge-numeral}`).

No gradients anywhere; all color is flat type. Opacity appears only in the ghost stroke (14%).

## Typography

### Font Family

**Archivo Black** is the shout — a single-weight grotesque poster face for titles, content numerals, and the ghost word. It appears at large sizes only (76px and up) and never sets sentences outside the title.

**Libre Franklin** is the talker — a sturdy grotesk for subtitles (500), body text (400), and any sustained reading.

**Caveat** is the hand — a marker script at 600 for the source hand line. It never sets headlines or body.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.shout}` | 92px | Archivo Black | 400 | Title, red first line, tilted free type |
| `{typography.scrap-text}` | 30px | Libre Franklin | 500 | Subtitle line text |
| `{typography.body}` | 24px | Libre Franklin | 400 | Body paragraphs |
| `{typography.hand-note}` | 32px | Caveat | 600 | Hand source line |
| `{typography.badge-numeral}` | 76px | Archivo Black | 400 | Red content numeral, tilted free type |
| `{typography.ghost-word}` | 340px | Archivo Black | 400 | Outlined background word |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every shout carries a red first line.** The title's `::first-line` renders in `{colors.red}`; remaining lines render in ink. A single-color shout is unfinished.
- **Every shout tilts −1.2 degrees in free type.** No slab, no band — the two-tone type carries the attitude.
- **Every subtitle is tilted Franklin type at +1.6 degrees.** No border, no tape, no offset.
- **Every source line is Caveat 600 ink, tilted −2.5 degrees.** The hand voice appears nowhere else.
- **Every content numeral is red Archivo Black free type at 8 degrees.** The numeral carries a content figure or single content glyph only.
- **Every ghost word is a genuine title word**, transparent-filled with a 3px 14%-ink stroke at −6 degrees. Invented background words are forbidden.
- **Every ghost word keeps at least one full letterform clear** of reading layers — park it in open paper (right side, below the subtitle line) so no letter reads as a smudge fragment.
- **Every list marker is a ▸ text glyph** — ink for the plain side, teal for the marked side. No squares, no bullets, no boxes.

### Typography Principles

The voice contrast is **shout ↔ talk ↔ scribble**. Archivo Black should feel pasted on — big, tight (1.04), slightly rotated, never letterspaced. Libre Franklin should feel plain and helpful — normal case, no tracking, comfortable leading. Caveat should feel quickly written — sentence case, no tracking, tilted with its note. Uppercase is reserved for the ghost word and badge; running text never shouts in caps.

## Layout

### Canvas System

Each slide is a fixed 1920×1080 stage with 130px side padding and 90px top clearance. Composition is a **broken free grid**: a left-anchored flow column (shout → subtitle) plus absolutely positioned paste-ons (ghost word, numeral, hand line, confetti). The flow column keeps hierarchy legible; the paste-ons supply the collage chaos around it, never over reading text.

### Persistent Chrome

There is no fixed furniture — collage has no running heads or folios. Three recurring anchors appear on every slide instead:

- **Ghost word** (`{components.ghost-word}`) — outlined title word, right side, behind everything.
- **Content numeral** (`{components.content-numeral}`) — red numeral in free type, top-right, tilted 8°.
- **Hand line** (`{components.hand-line}`) — Caveat ink source line, bottom-right, tilted −2.5°.

Page position, where needed, is carried by the numeral itself (a content numeral), never by a separate counter.

### Composition Rules

Text-bearing layers tilt at most ±3°: shout −1.2°, subtitle +1.6°, hand −2.5°. Type layers counter-angle against each other so the collage reads torn and pasted. Confetti plus-marks keep 60px clearance from reading text. No layer may cover another layer's text — overlaps are edge-to-edge only.

## Depth and Elevation

Depth is **tilt and scale**: no shadows, no offsets, no slabs, no fills. Type layers advance by size (shout over subtitle over hand), by tilt contrast, and by the ghost word's 14% outline receding behind. Stacking order is fixed: paper → ghost word → subtitle/hand → shout → numeral → confetti. Elevation never changes on interaction; the wall is already pasted.

## Shapes and Treatment

### Border Radius

Nothing exists to round: no scraps, notes, blocks, badges, or tape. Type, ghost outlines, and confetti follow glyph geometry only. A rounded shape anywhere violates the flat-type doctrine.

### Border Weights

No borders exist in this system. The retired marks (2px scrap border, 3px badge ring, 14px swash bar) are documented for history only. The one surviving stroke is the **3px 14%-ink ghost word outline** (`-webkit-text-stroke` with transparent fill).

### Decorative Element Types

**Shout** — Two-tone Archivo Black title at −1.2°: red first line, ink below, free type.

**Subtitle line** — Franklin 500 ink line at +1.6° in plain type.

**Hand line** — Caveat 600 ink line at −2.5°; carries the source line verbatim.

**Content numeral** — Red Archivo Black numeral, 8° tilt, free type.

**Ghost word** — 340px outlined title word at −6°, right side below the subtitle line, behind all reading layers with ≥1 full letterform clear.

**Plus confetti** — 40px teal/red plus marks at mixed rotations, clear of reading text.

**List markers** — ▸ text glyphs (ink / teal) leading comparison rows.

## Do's and Don'ts

### Do

- Shout in two tones — red first line, ink below — in tilted free type.
- Tilt every subtitle line +1.6° in plain Franklin ink type.
- Tilt text-bearing layers within ±3° and counter-angle them against each other.
- Pull the ghost word from the real title and keep it behind everything at 14% stroke.
- Set the folio low-left on open paper (Archivo Black, −2°) so the bottom-left quadrant never sits empty.
- Carry the source line verbatim in the tilted Caveat ink hand line.
- Keep confetti 60px clear of reading text and overlaps edge-to-edge only.
- Use flat type color only — tilt, scale, and the ghost outline are the entire depth system.
- Let layers collide at edges; neat gutters are the enemy of collage.

### Don't

- Don't align layers to a master grid or equalize their margins — the free grid is the layout.
- Don't tilt sentences past ±3° or rotate body text at all; legibility beats chaos.
- Don't invent ghost words, content numerals, or hand scribbles — every visible word is real content.
- Don't add slabs, offsets, borders, tape, fills, or gradient washes — type on flat paper only.
- Don't set headlines in Caveat or body in Archivo Black; the three voices never swap.
- Don't outline or shadow the shout itself — two-tone type and tilt do the work.
- Don't box, badge, or back any layer; tilt and position carry the collage.
- Don't add chrome a studio wall would not have: no nav dots, no counters, no progress bars.

## Responsive Behavior

The finished deck is a fixed 1920×1080 stage scaled by one uniform transform (see Fixed-Stage Policy); it letterboxes on other viewports and never reflows. The free-grid composition is tuned in absolute stage coordinates: the flow column absorbs long titles by wrapping (verify ≤6 shout lines and subtitle clearance before capture), while the absolute paste-ons hold fixed stage positions. No breakpoints or collapse rules ship in generated output.

## CJK & International Content

When setting Korean or other CJK content, keep the collage structure and swap the three voices for CJK-capable faces: **Noto Sans KR** 900 for the shout and numeral, **Noto Sans KR** 400/500 for subtitles and body, and **Nanum Pen Script** for the hand line.

Recommended pairing:

| Role | Latin (default) | CJK counterpart |
|---|---|---|
| Shout / numeral / ghost | Archivo Black | Noto Sans KR 900 |
| Subtitle / body | Libre Franklin 400/500 | Noto Sans KR 400/500 |
| Hand line | Caveat 600 | Nanum Pen Script 400 |

Loading (add alongside the Latin families):

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;900&family=Nanum+Pen+Script&display=swap" rel="stylesheet">
```

Universal CJK adjustments: letter-spacing 0 on all CJK runs; no uppercase transforms; raise shout leading to 1.25 and subtitle leading to 1.65; keep the red `::first-line` (it works on any script); keep all tilts and the numeral exactly as specified — collage geometry is script-independent. The ghost word uses the CJK title's strongest content word at the same 400px outline treatment.

Known CJK gap: Nanum Pen Script is lighter and narrower than Caveat, so the hand line reads slightly less marker-bold; widen the line measure by ~10% in CJK builds. Noto Sans KR 900 is less poster-crude than Archivo Black — the red first line and counter-tilt must carry the shout attitude the face alone cannot.

## Iteration Guide

1. Any new shout uses Archivo Black at 92px/1.04 with the red first line, tilted −1.2° in free type.
2. Any new subtitle uses Franklin 500 ink type at +1.6° — no border, tape, or offset.
3. Any new source line goes in the Caveat ink hand line at −2.5° — never as plain footer text, never filled.
4. Any new numeral is a real content figure in red Archivo Black free type at 8°.
5. Any new background word is a genuine title word at 400px outlined, −6°, behind everything.
6. Any new list uses ▸ text markers (ink / teal) — never squares, bullets, or boxes.
7. Any new confetti is a teal/red plus at 40px, 60px clear of reading text.
8. Any new layer keeps text tilts within ±3° and overlaps edge-to-edge, never over reading text.
9. Any new color comes from the six declared tokens; alpha only on the ghost stroke (14%).
10. Verify every new slide at 1920×1080 for shout wrap (≤6 lines), subtitle/hand clearance, and numeral overlap before capture.

## Known Gaps

- **Fonts**: Archivo Black / Libre Franklin / Caveat via Google Fonts CDN (`display=swap`); fallbacks Arial Black, sans-serif / system-ui, sans-serif / cursive. No font files committed. Offline rendering falls back to system stacks and the shout loses its poster voice.
- **Ghost outline** uses `-webkit-text-stroke` with transparent fill; renderers without text-stroke support show a faint solid word — set a 14%-ink solid fallback color first in the stack.
- **`::first-line` tone** follows wrapping, so the red/ink boundary moves with title length; verify the break reads intentionally on every title.
- **Tape, offsets, and fills retired (typography-only rebuild).** The old translucency/offset export gaps are gone with the paste hardware; translucency survives only in the ghost stroke.
- **Plus confetti and tilts** are static in this system; there is no entrance animation to preserve or drop.

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used (tape retired) | full | N/A |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used | full | N/A — static wall |
| 4 | Pixel / hard offset shadows | Not used (offsets retired) | full | N/A |
| 5 | Gradients | Not used (dot grid retired) | full | N/A |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Ghost stroke 14% | partial | 20%-gray outline word |
| 8 | Custom fonts | Archivo Black + Libre Franklin + Caveat via Google Fonts CDN | partial | Embedded faces; fallback Arial Black / system-ui / cursive |
| 9 | Absolute-positioned decor | Ghost, numeral, hand line, confetti as placed text | full | Native text boxes at fixed coordinates |
