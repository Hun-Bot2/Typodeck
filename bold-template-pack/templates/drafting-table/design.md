---
version: alpha
name: Drafting Table
description: A blueprint-drafting presentation system set in white type on solid blueprint blue, with condensed Barlow Condensed title-block caps annotated by mono measurement notes, IBM Plex Sans body copy, IBM Plex Mono drawing tags, amber revision-critical flags, registration crosses, and a revision-block footer. Typography-only register: no frames, grids, dimension lines, tables, rules, or vignettes exist — hierarchy is carried by the three type voices, position, and the amber flags alone. The effect sits between a machine shop and a plan room — exact, issued, and inspected.
colors:
  blueprint: "#0F3D7A"
  blueprint-deep: "#041226"
  line-white: "#FFFFFF"
  light-line: "#7FB3E8"
  pale-blue: "#D6E6FA"
  amber: "#FFD166"
shadows:
  none-flat: "none"
typography:
  title-block:
    fontFamily: "'Barlow Condensed', 'Arial Black', sans-serif"
    fontSize: "146px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: 0.01em
    textTransform: uppercase
  display:
    fontFamily: "'Barlow Condensed', 'Arial Black', sans-serif"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: 1.04
    textTransform: uppercase
  headline:
    fontFamily: "'Barlow Condensed', 'Arial Black', sans-serif"
    fontSize: "64px"
    fontWeight: 600
    lineHeight: 1.06
    textTransform: uppercase
  subhead:
    fontFamily: "'Barlow Condensed', 'Arial Black', sans-serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.1
    textTransform: uppercase
  body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.6
  hero-tagline:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 400
    lineHeight: 1.4
  quote-body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.55
  drawing-tag:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.18em
    textTransform: uppercase
  dimension-tag:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.12em
  revision-head:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.2em
    textTransform: uppercase
  revision-cell:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1
  stamp-mark:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 21px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.22em
    textTransform: uppercase
spacing:
  line-unit: 2px
  grid-fine: 24px
  grid-major: 120px
  frame-inset: 40px
  frame-weight: 3px
  content-left: 120px
  content-right: 200px
canvas:
  width: 1920px
  height: 1080px
components:
  dimension-note:
    color: "{colors.amber}"
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 20px
    letterSpacing: 0.12em
    description: "Bare amber mono measurement annotation above the headline. No line, no ticks, no chip."
  dimension-note-v:
    color: "{colors.amber}"
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 20px
    letterSpacing: 0.12em
    rotation: "-90deg"
    description: "Rotated amber mono measurement annotation on the right rail. No line, no ticks."
  revision-block:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    description: "Typographic revision footer: stacked REV/DATE/SHEET label/value rows with an amber revision letter. No borders, no table."
  registration-cross:
    glyph: "+"
    fontSize: 30px
    description: "Plus-mark registration crosses at the four sheet corners."
  stamp-line:
    color: "{colors.amber}"
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 21px
    letterSpacing: 0.22em
    textTransform: uppercase
    rotation: "-6deg"
    description: "Bare amber mono tracked stamp line (e.g. issued-for-review mark). No border, no fill. The only rotated element in the system."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. Type positions, measurement annotations, and revision-block geometry are fixed stage coordinates — they scale only with the single stage transform, never with viewport-relative units.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and column collisions.

## Overview

Drafting Table is a **blueprint-drafting presentation system**. Its foundational premise is the **issued sheet**: every slide is a drawing with mono drawing tags, measurement annotations, and a revision block on solid blueprint. Layouts feel surveyed and toleranced — white type, amber flags, and registration crosses keep the whole deck calibrated.

The type stack is three faces working in concert. **Barlow Condensed** is the display face — tall, exact, title-block caps at 500–600 weight that carry headlines with machined precision. **IBM Plex Sans** is the body face — a clean grotesque that reads plainly at 28–38px and stays out of the display face's way. **IBM Plex Mono** is the instrument face — used exclusively for drawing tags, dimension labels, revision cells, and stamp marks, always tracked wide and uppercase (for Latin).

The palette is built around **solid blueprint blue as ground** (`{colors.blueprint}`) set in **line white** with **light-line blue** for secondary marks and **amber** reserved strictly for revision-critical flags. Body text renders in pale blue (`{colors.pale-blue}`); headlines render in pure white. Amber appears in exactly three places: the stamp line, the revision letter, and the measurement notes — nowhere else.

Depth in this system is flat: there are no shadows, no blur, no gloss, no gradients. Spatial hierarchy comes from **type role, scale, and position** — condensed display, plain body, tracked mono instruments — on the solid ground.

**Density philosophy: exact and complete.** One issued sheet per slide — header tags, annotated headline, tagline, stamp line, revision footer — with every element positioned and tagged. Whitespace is aligned rather than generous: content pins to fixed stage coordinates, and the right rail carries the vertical measurement note. A typical slide carries one caps headline + one tagline + the revision block.

**Key Characteristics:**
- Condensed white caps headlines annotated by amber mono measurement notes.
- Solid blueprint ground with no grid, frame, or vignette.
- Revision block footer on every slide with amber revision letter and no borders.
- Amber reserved strictly for revision-critical marks — stamp line, letter, measurement notes.
- Registration crosses at the sheet corners.
- Rotated stamp lines breaking the alignment at −6°.
- Three-font stack: Barlow Condensed (display), IBM Plex Sans (body), IBM Plex Mono (instruments).
- Zero shadows, zero rounding, zero shapes outside the type vocabulary.

## Colors

### Palette

- **Blueprint** (`{colors.blueprint}` — `#0F3D7A`): The sheet ground. Fills the stage solid and flat.
- **Blueprint Deep** (`{colors.blueprint-deep}` — `#041226`): Retained token; no visible role in the typography-only register.
- **Line White** (`{colors.line-white}` — `#FFFFFF`): Headlines, crosses, revision values.
- **Light Line** (`{colors.light-line}` — `#7FB3E8`): Secondary marks — header tags, sheet line, revision headers.
- **Pale Blue** (`{colors.pale-blue}` — `#D6E6FA`): Tagline and body text. Softer than line white.
- **Amber** (`{colors.amber}` — `#FFD166`): Revision-critical flags only — stamp line, revision letter, measurement notes.

### Defaults

- **Default surface background**: `{colors.blueprint}` solid and flat.
- **Default headline color**: `{colors.line-white}`, always uppercase Barlow Condensed.
- **Default body text color**: `{colors.pale-blue}`.
- **Default tag color**: `{colors.light-line}` for drawing tags; `{colors.amber}` for measurement notes.
- **Default amber usage**: exactly the stamp line + revision letter + measurement notes per slide.
- **Default corners**: four registration crosses at the sheet corners.

White text on blueprint holds strong contrast at all specified sizes. Amber appears only in the three flag elements — never as running prose or headlines.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**Barlow Condensed** is the display face — a tall technical grotesque in the title-block tradition. Used for every headline at 500–600 weight, always uppercase with +0.01em tracking. Its machined verticality is what makes the system feel drafted; replacing it with a wide grotesque or a serif breaks the entire aesthetic.

**IBM Plex Sans** is the body face — a plain engineered grotesque. Used for taglines, paragraphs, quote bodies, and the context line at 400 weight. It reads as specification prose next to the condensed display caps.

**IBM Plex Mono** is the instrument face — a technical monospace used exclusively for drawing tags, dimension labels, revision headers/cells, sheet lines, and stamp marks. The mono + wide-tracked uppercase combination is the system's "instrument" voice.

Never use Barlow Condensed for body, never use Plex Sans for tags or dimensions, never use Plex Mono for headlines. The three-role separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.title-block}` | 146px | Barlow Condensed | 600 | Cover title-block headline, annotated |
| `{typography.display}` | 96px | Barlow Condensed | 600 | Large section opener |
| `{typography.headline}` | 64px | Barlow Condensed | 600 | Primary section headline |
| `{typography.subhead}` | 40px | Barlow Condensed | 500 | Region subheading |
| `{typography.body}` | 28px | IBM Plex Sans | 400 | Paragraph body |
| `{typography.hero-tagline}` | 38px | IBM Plex Sans | 400 | Tagline below the title block |
| `{typography.quote-body}` | 34px | IBM Plex Sans | 400 | Quote text |
| `{typography.drawing-tag}` | 22px | IBM Plex Mono | 500 | Header drawing tags |
| `{typography.dimension-tag}` | 20px | IBM Plex Mono | 400 | Measurement annotations |
| `{typography.revision-head}` | 17px | IBM Plex Mono | 500 | Revision block labels |
| `{typography.revision-cell}` | 24px | IBM Plex Mono | 500 | Revision block values |
| `{typography.stamp-mark}` | 21px | IBM Plex Mono | 500 | Rotated stamp text |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display headline is uppercase Barlow Condensed.** Sentence-case or lowercase display type does not exist in this system.
- **Every cover headline carries an amber mono measurement note** above it and a rotated one on the right rail. An unannotated headline reads as unissued.
- **Every mono tag is uppercase with wide tracking** — +0.12em minimum for measurement notes, +0.18–0.22em for drawing tags and stamps. Sentence-case mono does not exist for Latin runs.
- **Every revision letter renders in amber.** A white revision letter reads as unflagged and breaks the revision language.
- **Every stamp line is bare amber mono rotated −6°.** Level, bordered, or filled stamps do not exist.
- **Every tagline uses Plex Sans 400 at 1.4 line-height in pale blue.** Tighter leading or white taglines flatten the headline/tagline hierarchy.

### Typography Principles

The voice contrast is **condensed caps display ↔ plain spec body ↔ tracked mono instruments**. Switching any of the three roles to a different face flattens the system into a generic blue deck. Italic is never used anywhere — emphasis comes from amber flags and scale, not slant.

Barlow Condensed should always feel **machined** — uppercase, tight leading, annotated by measurement notes. Plex Sans should always feel **plain** — left-aligned, sentence case, no tracking. Plex Mono should always feel **instrumental** — tracked, tagged, and precise.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Each slide renders at exactly 1920×1080 and scales uniformly via a single transform (`deck-stage.js` or equivalent). Letterboxing is permitted; reflowing is not.

Default sheet anatomy on the open sheet: header drawing tags at 92px; measurement note at 208px; title block from 248px; tagline below the title; vertical measurement note on the right rail; stamp line near the tagline; revision footer pinned above the sheet bottom. Content pins to fixed stage coordinates horizontally (120px left, 200px right of stage edges).

### Persistent Chrome

Four elements appear on every slide:
- **Registration crosses** — four `+` marks at the sheet corners.
- **Header tags** — left sheet tag + right scale/revision tag with amber revision letter.
- **Measurement notes** — amber mono annotations above the headline and on the right rail.
- **Revision footer** — context/sheet block left + revision block right.

The slide numeral lives in the revision block's SHEET row (01 / 01 format) — there is no separate counter or nav rail.

## Depth and Elevation

### Flat Type (Signature)

This system has **no shadows, no blur, no gloss, no gradients, no frames, no grids, and no rules**. Hierarchy is carried entirely by type role, scale, and position. Introducing any drop shadow, line, or container breaks the drafting voice immediately.

### Solid Ground

The ground is solid flat blueprint with no vignette, no grid, and no tonal modeling. Type sits directly on the ground; nothing recedes behind it.

### Whitespace as Separation

Measurement notes sit bare on the ground; revision rows stack with whitespace between label and value. There are no chips, cutouts, borders, or tables — alignment and proximity separate, never lines.

## Shapes and Treatment

### Border Radius

There is nothing to round: no frames, tables, chips, tags-as-boxes, stamps-as-boxes, or squares exist in the typography-only register. Type on blueprint is rectilinear by nature; any rounded or boxed shape breaks the drafting aesthetic immediately.

### Border Weights

Borders do not exist. There are no frames, stamp outlines, dimension lines, table borders, footer rules, ticks, accent bars, or grid lines. Whitespace and type alignment are the only structure.

### Decorative Element Types

**Measurement note** — Bare amber mono annotation above the headline. No line, no ticks, no chip.

**Measurement note (vertical)** — Rotated amber mono annotation on the right rail. No line, no ticks.

**Revision block** — Stacked REV / DATE / SHEET label/value rows. Amber revision letter. No borders, no table.

**Registration cross** — 30px mono `+` marks at the four sheet corners.

**Stamp line** — Bare amber mono tracked text rotated −6°, transparent ground.

## Do's and Don'ts

### Do

- Place four registration crosses at the sheet corners of every slide.
- Keep the ground solid flat blueprint — no grid, no frame, no vignette.
- Annotate the cover headline with amber mono measurement notes above and on the rail.
- Set all display type in uppercase Barlow Condensed with tight leading.
- Track all mono tags wide (+0.12em minimum) and uppercase for Latin runs.
- Reserve amber strictly for the stamp line, revision letter, and measurement notes.
- Pin content to fixed stage coordinates — 120px left, 200px right, header at 92px.
- Rotate the stamp line −6° and keep it the only rotated element on the sheet.
- Hold the SHEET row as the folio — `01 / 01` zero-padded format.

### Don't

- Don't add shadows, blur, gloss, gradients, frames, grids, or rules — the system is flat type.
- Don't add boxes, borders, chips, or squares of any kind — rectilinear type only.
- Don't set display type in sentence case or a non-condensed face.
- Don't use amber for body text, headlines, or any fourth flag element.
- Don't leave a headline unannotated on the cover — measurement notes are the signature.
- Don't use sentence-case or untracked mono — instruments are always tracked caps.
- Don't level, border, or fill the stamp line — bare amber at −6°, always.
- Don't introduce lines, ticks, tables, or borders of any kind.
- Don't use italic anywhere — emphasis is amber flags and scale.
- Don't place content outside the sheet bounds.

## Responsive Behavior

Drafting Table is a **fixed-stage system** built around 1920×1080 stage coordinates. There are no viewport-fluid rules and no breakpoints for the deck itself — the single stage transform scales the sheet type uniformly to any screen.

### Scaling Behavior

- Content coordinates (120px/200px margins, header at 92px) and annotation positions are fixed stage values.
- Headline sizes and tag tracking are fixed — they scale only via the stage transform.

### Component Breakpoints

None. The issued-sheet layout never reflows. On narrow portrait phones the stage letterboxes — the sheet stays exactly composed.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions use a 400ms linear wipe (left to right) — drafting a new sheet over the old.
- The `prefers-reduced-motion` media query replaces the wipe with a hard cut.

### Animation Triggers

Measurement notes fade in on slide entry with the headline. The stamp line fades in last with a 150ms delay. Revision block values are static. No hover or scroll animation exists anywhere.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; for static export, screenshots of each slide preserve the flat type. Blueprint blue prints as a flat spot-like ground.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display headlines | Barlow Condensed 600 caps | Noto Sans KR 700 (no condensed CJK equivalent) |
| Body / tagline | IBM Plex Sans 400 | Noto Sans KR 400 |
| Instruments / tags / measurement notes | IBM Plex Mono 500 tracked caps | Noto Sans KR 500, no transform, no tracking |

### Mixed-Content Strategy

**Strategy A** — single CJK family with Latin coverage for Korean runs, Latin stack preserved for measurement numerals. Set Korean text elements to `'Noto Sans KR', sans-serif`; keep IBM Plex Mono for pure-numeral measurement notes (`1600 ±0.5`) and revision values where runs are ASCII-only. Mixed lines never font-switch mid-sentence.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–25% from the Latin spec. Display 1.2–1.3 (up from 1.02–1.1), body 1.75–1.85 (up from 1.4–1.6).
- **Letter-spacing**: set to 0 on every CJK run. The wide mono tracking looks broken on square CJK glyphs.
- **Text transform**: don't apply `uppercase` to CJK text — CJK has no case. Remove it from all tags on CJK runs.
- **Punctuation**: use full-width Korean punctuation where appropriate.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between every CJK character and adjacent Latin character or digit.
- **One font per sentence**: let Noto Sans KR handle mixed sentences.

### Aesthetic Notes for This System

The system's identity rests on condensed caps + tracked mono instruments. A CJK build loses the condensed caps voice (no condensed Korean face exists on CDN) but keeps everything structural: the measurement notes, revision block, crosses, and amber flags carry full recognition load. Lean harder on the measurement notes and revision block in CJK builds — they do more identity work than in the Latin original.

Korean drawing tags render in Noto Sans KR 500 at 0 tracking without transform; keep the amber mono notes so tags stay recognizable as instruments.

### Known CJK Gap

- **No condensed CJK display face.** Barlow Condensed's machined verticality has no Korean equivalent; Noto Sans KR 700 is full-width and changes headline rhythm. Reduce CJK display size ~15% to hold line counts.
- **No CJK monospace instrument voice.** Plex Mono's tracked-caps instrument signal has no CJK counterpart; tags lose their mono character and rely on position and amber flags.

## Iteration Guide

1. Any new slide gets four registration crosses, header tags, measurement notes, and the revision footer on the solid sheet. Don't skip the instruments.
2. Any new display element uses uppercase Barlow Condensed. Any new body element uses Plex Sans. Any new tag or note uses Plex Mono. Never cross the role boundaries.
3. Any new cover headline gets an amber mono measurement note above plus a rotated one on the rail.
4. Any new label is a mono drawing tag or measurement note. Don't substitute boxes, chips, or squares.
5. Any new revision footer is the revision-block pattern: stacked label/value rows, mono headers tracked +0.2em, amber key value.
6. Any new content pins to fixed stage coordinates: 120px/200px margins, header at 92px.
7. Any new accent is amber and must be one of the three flags — stamp line, letter, measurement notes. No fourth amber element.
8. Any new decorative mark is drafting vocabulary only: crosses and tracked mono. No shapes, no icons, no illustration.
9. If a slide needs emphasis beyond the headline, add a stamp line — never a container or a larger size.
10. Animated elements (note fade, stamp fade) should respect `prefers-reduced-motion`. Stillness is the default.

## Known Gaps

- **Fonts**: Barlow Condensed / IBM Plex Sans / IBM Plex Mono via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif` / `ui-monospace, monospace`. No font files committed. Offline rendering falls back to system stacks and loses the condensed title-block voice.
- **Overflow guard is JS-applied**: title-block size steps down and the tagline re-pins below it until the sheet fits. Without JS, very long titles can collide with the tagline.
- **Measurement values are illustrative**, not computed from rendered geometry. Authors must update note values (`1600 ±0.5`, `732`) when layout changes.
- **No frames, grids, lines, tables, or vignettes.** The typography-only register renders none of the retired drafting shapes; decks must not reintroduce them.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A |
| 2 | Blend modes | None used | full | N/A |
| 3 | Animation / keyframes | Note fade, stamp fade | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | None used | full | N/A |
| 5 | Gradients | None used (solid blueprint ground) | full | N/A — no gradients in this register |
| 6 | Grain / scanline / noise overlays | None used | full | N/A |
| 7 | Transparency layers | None used (all type opaque) | full | N/A |
| 8 | Custom fonts | Barlow Condensed / Plex Sans / Plex Mono via CDN | partial | Embedded subset or Arial Narrow / Arial / Courier substitution |
| 9 | Absolute-positioned decor | None — positioned type only | full | Native text boxes 1:1 |
