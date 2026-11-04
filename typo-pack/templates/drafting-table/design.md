---
version: alpha
name: Drafting Table
description: A blueprint-drafting presentation system drawn in white linework on deep blueprint blue, with condensed Barlow Condensed title-block caps measured by dimension lines with tick ends, IBM Plex Sans body copy, IBM Plex Mono drawing tags and measurement labels, a dual-density survey grid, amber revision-critical flags, registration crosses, and a revision-block table footer. The effect sits between a machine shop and a plan room — exact, issued, and inspected.
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
  sheet-frame:
    inset: 40px
    border: "3px solid {colors.line-white}"
    description: "Full border frame on every slide. Inset 40px from the stage edge on all sides."
  survey-grid:
    fine: "24px rgba(255,255,255,0.07)"
    major: "120px rgba(255,255,255,0.16)"
    description: "Dual-density white grid wallpaper: 24px fine lines under 120px major lines on blueprint blue."
  dimension-h:
    lineWeight: 2px
    tickHeight: 18px
    description: "Horizontal dimension line with 18px end ticks and a centered mono measurement tag on a blueprint chip."
  dimension-v:
    lineWeight: 2px
    tickWidth: 18px
    description: "Vertical dimension line with 18px end ticks and a rotated mono measurement tag."
  revision-table:
    border: "2px solid {colors.line-white}"
    cellPadding: "8px 26px"
    description: "Revision-block footer table: mono header row (REV/DATE/SHEET) over a mono value row with amber revision letter."
  registration-cross:
    glyph: "+"
    fontSize: 30px
    description: "Plus-mark registration crosses at the four sheet corners, outside the frame."
  amber-rule:
    width: 150px
    height: 6px
    background: "{colors.amber}"
    description: "Short amber rule marking the revision-critical break between headline and tagline."
  stamp-chip:
    border: "3px solid {colors.amber}"
    rotation: "-6deg"
    description: "Rotated amber outline stamp (e.g. issued-for-review mark). The only rotated element in the system."
  tag-square:
    size: 16px
    background: "{colors.amber}"
    description: "Solid amber square bullet preceding drawing tags in the header row."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. The 24px/120px survey grid, the 40px frame inset, and all dimension-line geometry are fixed stage coordinates — they scale only with the single stage transform, never with viewport-relative units.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and frame/dimension overlap.

## Overview

Drafting Table is a **blueprint-drafting presentation system**. Its foundational premise is the **issued sheet**: every slide is a drawing with a border frame, a measurement grid, dimension lines with tick ends, mono drawing tags, and a revision block. Layouts feel surveyed and toleranced — white linework, amber flags, and registration crosses keep the whole deck calibrated.

The type stack is three faces working in concert. **Barlow Condensed** is the display face — tall, exact, title-block caps at 500–600 weight that carry headlines with machined precision. **IBM Plex Sans** is the body face — a clean grotesque that reads plainly at 28–38px and stays out of the display face's way. **IBM Plex Mono** is the instrument face — used exclusively for drawing tags, dimension labels, revision cells, and stamp marks, always tracked wide and uppercase (for Latin).

The palette is built around **blueprint blue as ground** (`{colors.blueprint}` vignetted toward `{colors.blueprint-deep}` at the corners) drawn in **line white** with **light-line blue** for secondary marks and **amber** reserved strictly for revision-critical flags. Body text renders in pale blue (`{colors.pale-blue}`); headlines and linework render in pure white. Amber appears in exactly four places: the stamp, the revision letter, the accent rule, and the tag squares — nowhere else.

Depth in this system is essentially flat: there are no shadows, no blur, no gloss. Spatial hierarchy comes from **line weight and position** — 3px frame, 2px dimensions, 6px amber rule — plus the survey grid receding behind the content. The vignette is the only tonal modeling on the ground.

**Density philosophy: exact and complete.** One issued sheet per slide — header tags, dimensioned headline, tagline, stamp, revision footer — with every element measured and tagged. Whitespace is grid-aligned rather than generous: content pins to the 120px major grid, and the right rail carries the vertical dimension. A typical slide carries one caps headline + one tagline + the revision block, all inside the white frame.

**Key Characteristics:**
- Condensed white caps headlines measured by dimension lines with tick ends and mono tags.
- Dual-density white survey grid — 24px fine under 120px major — on blueprint blue.
- Revision-block table footer on every slide with amber revision letter.
- Amber reserved strictly for revision-critical marks — stamp, letter, rule, squares.
- Registration crosses at the sheet corners and a full white border frame.
- Rotated outline stamp chips breaking the grid at −6°.
- Three-font stack: Barlow Condensed (display), IBM Plex Sans (body), IBM Plex Mono (instruments).
- Zero shadows, zero rounding, zero decoration outside the drafting vocabulary.

## Colors

### Palette

- **Blueprint** (`{colors.blueprint}` — `#0F3D7A`): The sheet ground. Fills the stage under the survey grid.
- **Blueprint Deep** (`{colors.blueprint-deep}` — `#041226`): Corner vignette tone, 35% at the stage corners.
- **Line White** (`{colors.line-white}` — `#FFFFFF`): Headlines, frame, dimensions, grid lines, revision cells.
- **Light Line** (`{colors.light-line}` — `#7FB3E8`): Secondary marks — header tags, sheet line, revision headers.
- **Pale Blue** (`{colors.pale-blue}` — `#D6E6FA`): Tagline and body text. Softer than line white.
- **Amber** (`{colors.amber}` — `#FFD166`): Revision-critical flags only — stamp, revision letter, accent rule, tag squares.

### Defaults

- **Default surface background**: `{colors.blueprint}` with the dual survey grid and a 35% corner vignette.
- **Default headline color**: `{colors.line-white}`, always uppercase Barlow Condensed.
- **Default body text color**: `{colors.pale-blue}`.
- **Default tag color**: `{colors.light-line}` for drawing tags, white for dimension tags on blueprint chips.
- **Default amber usage**: exactly the stamp + revision letter + accent rule + tag squares per slide.
- **Default frame**: 3px line white at 40px inset with four registration crosses outside.

White text on blueprint holds strong contrast at all specified sizes. Amber never appears as running text — only as the four flag elements.

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
| `{typography.title-block}` | 146px | Barlow Condensed | 600 | Cover title-block headline, dimensioned |
| `{typography.display}` | 96px | Barlow Condensed | 600 | Large section opener |
| `{typography.headline}` | 64px | Barlow Condensed | 600 | Primary section headline |
| `{typography.subhead}` | 40px | Barlow Condensed | 500 | Region subheading |
| `{typography.body}` | 28px | IBM Plex Sans | 400 | Paragraph body |
| `{typography.hero-tagline}` | 38px | IBM Plex Sans | 400 | Tagline below the title block |
| `{typography.quote-body}` | 34px | IBM Plex Sans | 400 | Quote text |
| `{typography.drawing-tag}` | 22px | IBM Plex Mono | 500 | Header drawing tags |
| `{typography.dimension-tag}` | 20px | IBM Plex Mono | 400 | Dimension measurement labels |
| `{typography.revision-head}` | 17px | IBM Plex Mono | 500 | Revision table headers |
| `{typography.revision-cell}` | 24px | IBM Plex Mono | 500 | Revision table values |
| `{typography.stamp-mark}` | 21px | IBM Plex Mono | 500 | Rotated stamp text |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display headline is uppercase Barlow Condensed.** Sentence-case or lowercase display type does not exist in this system.
- **Every cover headline is measured by a horizontal dimension line** with 18px end ticks and a centered mono tag on a blueprint chip. An unmeasured headline reads as unissued.
- **Every mono tag is uppercase with wide tracking** — +0.12em minimum for dimensions, +0.18–0.22em for drawing tags and stamps. Sentence-case mono does not exist for Latin runs.
- **Every revision letter renders in amber.** A white revision letter reads as unflagged and breaks the revision language.
- **Every stamp is rotated −6° with a 3px amber outline.** Level stamps or filled stamps do not exist.
- **Every tagline uses Plex Sans 400 at 1.4 line-height in pale blue.** Tighter leading or white taglines flatten the headline/tagline hierarchy.

### Typography Principles

The voice contrast is **condensed caps display ↔ plain spec body ↔ tracked mono instruments**. Switching any of the three roles to a different face flattens the system into a generic blue deck. Italic is never used anywhere — emphasis comes from amber flags and dimension weight, not slant.

Barlow Condensed should always feel **machined** — uppercase, tight leading, measured by dimensions. Plex Sans should always feel **plain** — left-aligned, sentence case, no tracking. Plex Mono should always feel **instrumental** — tracked, tagged, and precise.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Each slide renders at exactly 1920×1080 and scales uniformly via a single transform (`deck-stage.js` or equivalent). Letterboxing is permitted; reflowing is not.

Default sheet anatomy inside the 40px frame: header drawing tags at 92px; horizontal dimension at 208px; title block from 248px; amber rule + tagline below the title; vertical dimension on the right rail; stamp breaking the grid near the tagline; revision footer pinned above the frame bottom. Content pins to the 120px major grid horizontally (120px left, 200px right of stage edges).

### Persistent Chrome

Four elements appear on every slide:
- **Sheet frame** — 3px white border at 40px inset with four registration crosses outside the corners.
- **Survey grid** — dual-density white grid wallpaper across the whole stage.
- **Header tags** — left sheet tag with amber square + right scale/revision tag.
- **Revision footer** — top border rule + context/sheet block left + revision table right.

The slide numeral lives in the revision table's SHEET cell (01 / 01 format) — there is no separate counter or nav rail.

## Depth and Elevation

### Flat Linework (Signature)

This system has **no shadows, no blur, no gloss, and no gradients except the ground vignette**. Hierarchy is carried entirely by line weight: 6px amber rule > 3px frame > 2px dimensions and table borders > 1px grid lines. Introducing any drop shadow or elevation blur breaks the drafting voice immediately.

### Vignette as Ground Modeling

The single exception is the radial corner vignette (`{colors.blueprint-deep}` at 35%), which gives the sheet a faint plan-room depth. It applies to the ground only — never to content elements — and must stay subtle enough that grid lines remain visible through it.

### Chips as Separation

Dimension tags sit on solid blueprint chips with 2px white borders so the dimension line appears to pass behind the label. Revision table cells use the same chip logic. These are flat cutouts, not elevated cards — no shadow, no offset.

## Shapes and Treatment

### Border Radius

Effectively zero. Every element is square: frame, table, chips, tags, stamp, squares. A rounded corner anywhere — on a chip, a table, or a tag — breaks the drafting aesthetic immediately. The system's geometry is 100% rectilinear.

### Border Weights

- **3px solid white** — sheet frame, stamp outline (amber), tag chips.
- **2px solid white** — dimension lines, revision table borders, footer rule, dimension ticks.
- **6px solid amber** — the accent rule. The heaviest mark in the system.
- **1px white at 7–16%** — survey grid lines (wallpaper, not borders).

Borders are always solid and always white or amber. Dashed, dotted, and hairline-gray borders do not exist here — except the dimension line never dashes; only solid measurement lines are used.

### Decorative Element Types

**Sheet frame** — 3px white border at 40px inset. Present on every slide without exception.

**Survey grid** — Dual-density white grid wallpaper. The fine 24px layer recedes; the 120px major layer structures content placement.

**Dimension line (horizontal)** — 2px white line with 18px vertical end ticks and a centered mono measurement tag on a bordered blueprint chip.

**Dimension line (vertical)** — 2px white line with 18px horizontal end ticks and a rotated mono tag. Lives on the right rail.

**Revision table** — Bordered mono table with REV / DATE / SHEET columns. Amber revision letter in the value row.

**Registration cross** — 30px mono `+` marks at the four sheet corners outside the frame.

**Amber rule** — 150×6px solid amber bar marking the headline/tagline break.

**Stamp chip** — Amber outline stamp rotated −6°, mono tracked text, transparent fill.

**Tag square** — 16px solid amber square preceding header drawing tags.

## Do's and Don'ts

### Do

- Frame every slide in the 3px white border with four registration crosses outside.
- Draw the dual-density survey grid on every slide — fine 24px under major 120px.
- Measure the cover headline with a ticked dimension line and a mono tag on a chip.
- Set all display type in uppercase Barlow Condensed with tight leading.
- Track all mono tags wide (+0.12em minimum) and uppercase for Latin runs.
- Reserve amber strictly for the stamp, revision letter, accent rule, and tag squares.
- Pin content to the 120px major grid — 120px left, 200px right, header at 92px.
- Rotate the stamp −6° and keep it the only rotated element on the sheet.
- Hold the SHEET cell as the folio — `01 / 01` zero-padded format.

### Don't

- Don't add shadows, blur, gloss, or gradients beyond the ground vignette — the system is flat.
- Don't round any corner — rectilinear geometry is non-negotiable.
- Don't set display type in sentence case or a non-condensed face.
- Don't use amber for body text, headlines, or any fifth flag element.
- Don't leave a headline unmeasured on the cover — dimensions are the signature.
- Don't use sentence-case or untracked mono — instruments are always tracked caps.
- Don't level the stamp or fill it — outline-only at −6°, always.
- Don't introduce hairlines, dotted rules, or gray borders — linework is white or amber.
- Don't use italic anywhere — emphasis is amber flags and dimension weight.
- Don't place content outside the frame except registration crosses.

## Responsive Behavior

Drafting Table is a **fixed-stage system** built around 1920×1080 stage coordinates. There are no viewport-fluid rules and no breakpoints for the deck itself — the single stage transform scales the sheet, grid, and linework uniformly to any screen.

### Scaling Behavior

- The 40px frame inset, 24px/120px grid, and all dimension geometry are fixed stage values.
- Headline sizes and tag tracking are fixed — they scale only via the stage transform.
- Line weights (1/2/3/6px) scale with the stage; at small sizes the fine grid may shimmer, which is acceptable.

### Component Breakpoints

None. The issued-sheet layout never reflows. On narrow portrait phones the stage letterboxes — the sheet stays exactly composed.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions use a 400ms linear wipe (left to right) — drafting a new sheet over the old.
- The `prefers-reduced-motion` media query replaces the wipe with a hard cut.

### Animation Triggers

Dimension lines draw in on slide entry (200ms line grow + tag fade). The stamp fades in last with a 150ms delay. Revision table values are static. No hover or scroll animation exists anywhere.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; for static export, screenshots of each slide preserve the grid and linework. Blueprint blue prints as a flat spot-like ground.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display headlines | Barlow Condensed 600 caps | Noto Sans KR 700 (no condensed CJK equivalent) |
| Body / tagline | IBM Plex Sans 400 | Noto Sans KR 400 |
| Instruments / tags / dimensions | IBM Plex Mono 500 tracked caps | Noto Sans KR 500, no transform, no tracking |

### Mixed-Content Strategy

**Strategy A** — single CJK family with Latin coverage for Korean runs, Latin stack preserved for measurement numerals. Set Korean text elements to `'Noto Sans KR', sans-serif`; keep IBM Plex Mono for pure-numeral dimension tags (`1600 ±0.5`) and revision cells where runs are ASCII-only. Mixed lines never font-switch mid-sentence.

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

The system's identity rests on condensed caps + tracked mono + white linework. A CJK build loses the condensed caps voice (no condensed Korean face exists on CDN) but keeps everything structural: the frame, grid, dimensions, revision table, and amber flags carry full recognition load. Lean harder on the dimension lines and revision block in CJK builds — they do more identity work than in the Latin original.

Korean drawing tags render in Noto Sans KR 500 at 0 tracking without transform; keep the amber tag squares and chip borders so tags stay recognizable as instruments.

### Known CJK Gap

- **No condensed CJK display face.** Barlow Condensed's machined verticality has no Korean equivalent; Noto Sans KR 700 is full-width and changes headline rhythm. Reduce CJK display size ~15% to hold line counts.
- **No CJK monospace instrument voice.** Plex Mono's tracked-caps instrument signal has no CJK counterpart; tags lose their mono character and rely on chips, squares, and borders.

## Iteration Guide

1. Any new slide gets the sheet frame, the survey grid, four registration crosses, header tags, and the revision footer. Don't skip the frame.
2. Any new display element uses uppercase Barlow Condensed. Any new body element uses Plex Sans. Any new tag or dimension uses Plex Mono. Never cross the role boundaries.
3. Any new cover headline gets a ticked dimension line with a mono measurement tag on a chip.
4. Any new label is a mono drawing tag with an amber square (header) or a bordered chip (dimension). Don't substitute a plain h-tag.
5. Any new table is the revision-block pattern: 2px white borders, mono headers tracked +0.2em, amber key value.
6. Any new measurement snaps to the grid: content at 120px/200px margins, header at 92px, dimensions on major lines.
7. Any new accent is amber and must be one of the four flags — stamp, letter, rule, square. No fifth amber element.
8. Any new decorative mark is drafting vocabulary only: crosses, ticks, chips, rules. No glyphs, no icons, no illustration.
9. If a slide needs emphasis beyond the headline, add a stamp — never a second rule color or a larger size.
10. Animated elements (dimension draw-in, stamp fade) should respect `prefers-reduced-motion`. Grid and vignette are static and stay on always.

## Known Gaps

- **Fonts**: Barlow Condensed / IBM Plex Sans / IBM Plex Mono via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif` / `ui-monospace, monospace`. No font files committed. Offline rendering falls back to system stacks and loses the condensed title-block voice.
- **Overflow guard is JS-applied**: title-block size steps down and the tagline re-pins below it until the sheet fits. Without JS, very long titles can collide with the tagline rule.
- **Dimension measurement values are illustrative**, not computed from rendered geometry. Authors must update tag values (`1600 ±0.5`, `732`) when layout changes.
- **The fine 24px grid may shimmer** on low-DPI downscaled renders. This is accepted as a plan-room artifact.
- **The vignette is a fixed radial stop** (`{colors.blueprint-deep}` at 35%). Adjusting it requires editing the gradient stops; there is no tokenized intensity.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A |
| 2 | Blend modes | None used | full | N/A |
| 3 | Animation / keyframes | Dimension draw-in, stamp fade | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | None used | full | N/A |
| 5 | Gradients | Radial corner vignette only | partial | Flat blueprint ground, no vignette |
| 6 | Grain / scanline / noise overlays | None used | full | N/A |
| 7 | Transparency layers | Grid-line alpha (7–16%) | partial | Opaque light-blue grid lines |
| 8 | Custom fonts | Barlow Condensed / Plex Sans / Plex Mono via CDN | partial | Embedded subset or Arial Narrow / Arial / Courier substitution |
| 9 | Absolute-positioned decor | Frame, crosses, dimensions, stamp, table | full | Grouped native shapes |
