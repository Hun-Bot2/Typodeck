---
version: alpha
name: Gridline
description: An asymmetric Swiss presentation system on matte white with near-black ink and one signal red. Archivo ExtraBold headlines run flush-left and ragged-right over an exposed 12-column hairline grid, Inter carries body and captions, and a light-gray rail on the right parks a giant issue numeral. Structure comes from a single 6px red rule and hairline black rules — no shadows, no gradients, no rounded corners.
colors:
  white: "#FFFFFF"
  ink: "#111111"
  signal-red: "#E30613"
  rail-gray: "#F2F2F2"
  muted: "#6B6B6B"
  gridline: "rgba(17, 17, 17, 0.07)"
shadows:
  none: "none"
typography:
  display-xl:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "118px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  display:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "72px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1.08
  section-head:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.15
  kicker:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.18em"
    textTransform: uppercase
  index-numeral:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "400px"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.45
  body-compact:
    fontFamily: "'Inter', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
    textTransform: uppercase
  footer-index:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
  rail-meta:
    fontFamily: "'Inter', sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.1em"
    textTransform: uppercase
spacing:
  baseline: 8px
  margin-top: 64px
  margin-side: 72px
  gutter: 24px
  col-width: 126px
  red-rule-height: 6px
  hairline: 2px
  pad-rail: "40px 36px"
  gap-title-block: 36px
  gap-kicker-rule: 20px
  footer-height: 110px
  content-max-width: 1176px
canvas:
  width: 1920px
  height: 1080px
components:
  kicker-line:
    fontFamily: "'Archivo', sans-serif"
    fontSize: 20px
    fontWeight: 600
    letterSpacing: 0.18em
    textTransform: uppercase
    color: "{colors.signal-red}"
    description: "Red caps kicker with an 18px solid red square bullet at its left. Always sits above the red rule."
  red-rule:
    height: 6px
    background: "{colors.signal-red}"
    description: "The single 6px red rule. Exactly one per slide, spanning the content columns, 20px below the kicker."
  hairline-rule:
    height: 2px
    background: "{colors.ink}"
    description: "2px black structural rule for footers and section breaks."
  column-grid:
    columns: 12
    gutter: 24px
    lineColor: "{colors.gridline}"
    description: "Exposed 12-column hairline scaffold printed on the white ground at 7% ink. Always visible, never decorative-only."
  index-rail:
    background: "{colors.rail-gray}"
    padding: "40px 36px"
    description: "Light-gray rail occupying grid columns 9-12. Holds the giant index numeral, a red baseline rule, and stacked meta rows."
  index-numeral:
    fontFamily: "'Archivo', sans-serif"
    fontSize: 400px
    fontWeight: 800
    color: "{colors.ink}"
    description: "Giant issue numeral (e.g., 01) cropped by the rail's inner edge. Ink black on rail gray."
  meta-row:
    fontFamily: "'Inter', sans-serif"
    fontSize: 19px
    fontWeight: 500
    letterSpacing: 0.1em
    textTransform: uppercase
    description: "Small-caps meta line inside the rail: label over value, separated by 16px gaps."
  footer-bar:
    height: 110px
    borderTop: "2px solid {colors.ink}"
    description: "Footer band: 2px black rule, small-caps context left, paginated index right."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Gridline is an **asymmetric Swiss presentation system**. Its foundational premise is the **exposed 12-column grid**: the faint hairline scaffold is printed on the white ground at 7% ink on every surface, so alignment reads as content rather than decoration. Content occupies columns 1–8; columns 9–12 carry a light-gray index rail with a giant issue numeral. Nothing is centered, nothing is decorated, nothing casts a shadow.

The type stack is two faces with strict roles. **Archivo ExtraBold** is the display voice — flush-left, ragged-right, tight-tracked headlines at 48–118px plus the giant 400px index numeral. **Archivo SemiBold caps** at +0.18em tracking is the kicker voice, always in signal red. **Inter** is the workhorse — body at 24–34px, small-caps captions, rail meta, and footer context. The contrast is engineered: grotesque authority up top, neutral clarity below.

The palette is three colors plus gray: **matte white** ground, **near-black ink** for type and rules, **signal red** reserved for the kicker, the one red rule, and small square bullets, and **rail gray** for the index panel. Red never appears as body text and never fills large areas — it is a structural accent, one rule per slide.

Structure comes from rules, not containers. A **6px red rule** under the kicker, **2px black hairlines** for footers and breaks, and the exposed column grid are the entire depth system. There are no cards, no shadows, no gradients, no rounded corners, no imagery. Whitespace is the luxury: 64px top margin, 72px side margins, 24px gutters, and a ragged right edge that proves the grid is real.

**Density philosophy: disciplined air.** A typical slide carries one headline block + one supporting element (a list, a small table, or a stat row) + the index rail. The rail is always populated — numeral, red baseline, meta rows — so even sparse slides feel complete. When content grows, the headline shrinks (118 → 72 → 48px); the grid, rail, and rules never move.

**Key Characteristics:**
- Exposed 12-column hairline grid printed faintly on the white ground — alignment as visible content.
- Giant index numeral (Archivo 800, ~400px) parked in the gray rail, cropped by the rail edge.
- One 6px signal-red rule per slide — never more, never thinner — under the kicker or title block.
- Flush-left ragged-right headlines in Archivo 800 with tight -0.01em tracking; centering is forbidden.
- Red kicker line (Archivo 600 caps, +0.18em tracking) paired with an 18px solid red square bullet.
- Hairline 2px black footer rule with small-caps context left and a paginated index right.
- Zero shadows, zero gradients, zero border-radius anywhere in the system.
- Content locked to columns 1–8; the rail on columns 9–12 is always present and always populated.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The only ground. Matte, untextured, carrying the faint column grid.
- **Ink** (`{colors.ink}` — `#111111`): All headlines, body text, hairline rules, and the index numeral. Near-black, never pure #000.
- **Signal Red** (`{colors.signal-red}` — `#E30613`): The single accent — kicker text, the 6px rule, square bullets, numeral baseline. Never body text, never large fills.
- **Rail Gray** (`{colors.rail-gray}` — `#F2F2F2`): The index rail panel and zebra fills in tables. Cool light gray, no warmth.
- **Muted** (`{colors.muted}` — `#6B6B6B`): Captions, secondary meta, and table header text. Never headlines.
- **Gridline wash** (`{colors.gridline}` — `rgba(17,17,17,0.07)`): The exposed column-grid hairlines. Visible but quiet.

### Defaults

- **Default surface background**: `{colors.white}` with the exposed 12-column grid (`{components.column-grid}`).
- **Default headline color**: `{colors.ink}` — always, on every surface.
- **Default body text color**: `{colors.ink}` at full strength for ledes; `{colors.muted}` for secondary lines.
- **Default kicker color**: `{colors.signal-red}` — red kickers are the system's primary accent moment.
- **Default rule colors**: structural rules are `{colors.ink}` at 2px; the single accent rule is `{colors.signal-red}` at 6px.
- **Default rail treatment**: `{colors.rail-gray}` panel with an ink numeral and a red baseline rule.
- **Default table treatment**: hairline 2px top rule in ink, 1px row dividers in rail gray, red square bullets for flagged rows.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Archivo** is the display and label face — a grotesque with engineered confidence. ExtraBold (800) carries every headline and the giant index numeral; SemiBold (600) in caps with +0.18em tracking carries kickers; SemiBold with +0.12em tracking carries the footer index. Archivo's tight, upright caps are what make the system read Swiss rather than generic sans.

**Inter** is the body and meta face — neutral, highly legible, invisible by design. Regular (400) carries body and ledes; Medium (500) in small caps carries captions, rail meta, and footer context. Inter never appears above 34px and never carries a headline.

Never use Inter for headlines, never use Archivo for body runs. The grotesque-up-top / neutral-below split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | 118px | Archivo | 800 | Cover title — flush-left, ragged-right, tight tracking |
| `{typography.display}` | 72px | Archivo | 800 | Section opener headline |
| `{typography.headline}` | 48px | Archivo | 800 | Standard slide headline |
| `{typography.section-head}` | 30px | Archivo | 800 | Sub-section head inside a content slide |
| `{typography.kicker}` | 20px | Archivo | 600 | Red caps kicker above the red rule |
| `{typography.index-numeral}` | 400px | Archivo | 800 | Giant numeral in the index rail |
| `{typography.body}` | 34px | Inter | 400 | Cover subtitle / lede paragraph |
| `{typography.body-compact}` | 24px | Inter | 400 | Standard body on content slides |
| `{typography.caption}` | 20px | Inter | 500 | Small-caps captions and table headers |
| `{typography.footer-index}` | 22px | Archivo | 600 | Paginated index in the footer (`01 / 24`) |
| `{typography.rail-meta}` | 19px | Inter | 500 | Small-caps meta rows inside the rail |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline is flush-left with a ragged right edge.** Centered or justified display type does not exist in this system.
- **Every cover title carries tight -0.01em tracking.** Archivo at display sizes needs the slight squeeze to feel engineered.
- **Every kicker is red, caps, +0.18em, with an 18px solid red square bullet** at its left. A kicker without the square reads as an unfinished label.
- **Every index numeral is cropped by the rail edge.** The numeral's right side bleeds past the rail boundary — full containment reads as timid.
- **Every footer pairs small-caps context (left) with a paginated index (right)** in the `NN / NN` format. One without the other breaks the band.
- **Every caption and meta line is uppercase with +0.08–0.10em tracking.** Sentence-case small text reads as leftover body copy.

### Typography Principles

The voice contrast is **grotesque authority ↔ neutral clarity**. Archivo states; Inter explains. Italic is never used anywhere — emphasis comes from red, weight, or scale, never slant.

Headlines should always feel **planted against the left margin** — the flush-left edge is the system's spine. Body should feel **invisible** — left-aligned, generous line-height (≥1.45), no letterspacing, no caps except in caption roles.

### Defaults

- **Default size for a cover title**: `{typography.display-xl}` (118px) — steps down to 72px when the title exceeds ~45 characters.
- **Default size for a slide headline**: `{typography.headline}` (48px).
- **Default size for body**: `{typography.body-compact}` (24px); covers use `{typography.body}` (34px) for the lede.
- **Default kicker size**: `{typography.kicker}` (20px) — never larger, never smaller.
- **Default footer sizes**: context in `{typography.caption}`, index in `{typography.footer-index}`.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The slide frame carries 64px top margin and 72px side margins; the footer band occupies the bottom 110px. The inner content grid is 12 columns of 126px with 24px gutters (1776px total), with the exposed hairline scaffold drawn across the full frame.

Content columns are 1–8 (1176px wide). The index rail occupies columns 9–12 (576px wide) with a 24px gutter gap from the content block. On dense content slides the rail may narrow to columns 10–12, but it is never removed.

### Persistent Chrome

Two elements appear on every slide:

- **Index rail** — `{components.index-rail}` on columns 9–12: giant numeral, red baseline rule, stacked meta rows (issue / cases / date).
- **Footer bar** — `{components.footer-bar}`: 2px black rule, small-caps context left, paginated index right.

The exposed column grid is the third persistent element — it prints on the white ground of every slide at 7% ink.

### Asymmetric Rhythm

The 8/4 content-to-rail split is the system's rhythm. Content never crosses into the rail; the rail never carries body copy. The ragged right edge of the headline block should land at visibly different x-positions line to line — even, justified-looking right edges mean the measure is wrong.

## Depth and Elevation

### Flat by Doctrine

Gridline has **no depth system**. There are no shadows, no gradients, no translucency, no layered cards. Hierarchy is built exclusively from scale (118 → 20px), weight (800 → 400), color (ink → muted → red accent), and rules (6px red, 2px black, 1px gray).

### Rules as Structure

- **The 6px red rule** (`{components.red-rule}`) is the primary structural accent — exactly one per slide, spanning the content columns, 20px below the kicker.
- **2px black hairlines** (`{components.hairline-rule}`) separate footer, header, and table zones.
- **1px gray dividers** separate rows inside tables and lists.

A slide that needs more emphasis gets a bigger headline or a redder kicker — never a shadow or a panel.

### The Rail as Figure

The only figure/ground move in the system is the **rail gray panel** against the white ground. The panel is flat, borderless, and full-height within the frame; its edge against the white is the sharpest line on the slide after the red rule.

## Shapes and Treatment

### Border Radius

Zero everywhere. Every panel, rule, bullet, and numeral box is square. A rounded corner anywhere collapses the Swiss reading immediately.

### Border Weights

- **6px solid** — the red rule only. Nothing else in the system uses 6px.
- **2px solid** — black structural rules (footer, header, table tops).
- **1px solid** — gray row dividers and the exposed column grid hairlines (at 7% ink).
- **18px square** — the solid red kicker bullet. It is a filled square, not a border.

Borders are always solid and always horizontal or vertical — no diagonals, no curves, no ornaments.

### Decorative Element Types

**Red rule** — The single 6px red bar spanning the content columns. The system's most recognizable mark.

**Kicker square** — An 18×18px solid red square anchoring the kicker line's left edge.

**Index numeral** — The 400px Archivo 800 numeral in the rail, cropped by the rail edge, with a 6px red baseline beneath it.

**Column grid** — The exposed 12-column hairline scaffold at 7% ink. Structural content, not background decoration.

**Meta row** — Small-caps label/value pairs in the rail, separated by 16px gaps and 1px gray dividers.

**Footer band** — The 2px black rule with context/index pairing. Closes every slide identically.

**Stat row** — On data slides: 3–4 large Archivo 800 numerals (72px) in a row with small-caps Inter labels beneath, separated by 1px gray vertical dividers.

**Swiss table** — Header row in Inter 500 caps with a 2px black top rule; body rows in Inter 400 with 1px gray dividers; flagged cells marked with red square bullets, never red text.

## Do's and Don'ts

### Do

- Keep the exposed 12-column grid visible on every slide. The grid is content, not scaffolding to hide.
- Set every headline flush-left with a ragged right edge in Archivo 800.
- Use exactly one 6px red rule per slide, 20px below the kicker, spanning the content columns.
- Pair every kicker with its 18px solid red square bullet.
- Crop the giant index numeral against the rail edge — never fully contain it.
- Close every slide with the hairline footer: context left, paginated index right.
- Populate the rail on every slide: numeral, red baseline, at least two meta rows.
- Step the headline down (118 → 72 → 48px) as titles lengthen; never squeeze tracking past -0.01em.
- Mark flagged table cells with red square bullets, keeping cell text ink.
- Let whitespace do the work: 64px top, 72px sides, 24px gutters, no exceptions.

### Don't

- Don't center anything larger than a caption. Centered headlines destroy the Swiss reading.
- Don't add a second red rule, a thinner red rule, or red body text. One rule, 6px, structural positions only.
- Don't round any corner, blur any shadow (there are none), or add any gradient.
- Don't fill large areas with red. Red is a line and a bullet, never a field.
- Don't use Inter for headlines or Archivo for body runs.
- Don't use italic for emphasis anywhere — use red, weight, or scale.
- Don't remove the rail or the footer to "make room." Shrink the headline instead.
- Don't justify body text. Left-aligned with a ragged edge, always.
- Don't place body copy inside the rail. The rail carries numerals and meta only.
- Don't hide the column grid on "clean" slides. The grid is the identity.

## Responsive Behavior

Gridline is a **fixed-stage system** built for 1920×1080 output. All sizes are absolute pixels; there are no breakpoints in the generated deck. The stage scales uniformly via a single transform (letterboxed, no reflow).

### Scaling Behavior

- The 12-column grid, 126px columns, and 24px gutters are fixed at 1920×1080 and scale uniformly with the stage transform.
- Headline sizes step down by content length (118 → 72 → 48px), not by viewport.
- The index numeral stays 400px at stage scale; its crop position is fixed relative to the rail.

### Component Breakpoints

None. The fixed-stage model has no viewport breakpoints. (Source-history note: a fluid ancestor of this system stacked the rail below content under 900px; that behavior is superseded by the fixed-stage policy above.)

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are instant cuts — no fade, no slide motion. Swiss decks cut like paper.

### Animation Triggers

None. This system has no animation: no entry transitions, no counters, no chart grows. Static frames only.

### Print Behavior

The system prints 1:1 — white ground, ink type, red rules. The exposed grid prints at 7% ink and survives laser output. For static export, screenshots preserve all rules and the rail exactly.

## CJK & International Content

When using this system for Korean (or other CJK) content, swap the Latin stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / index numeral | Archivo 800 | Noto Sans KR 900 |
| Kicker / footer index | Archivo 600 (caps + tracking) | Noto Sans KR 700 (no transform, no tracking) |
| Body / captions / meta | Inter 400–500 | Noto Sans KR 400–500 |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin coverage. Set every text element to `font-family: 'Noto Sans KR', sans-serif`. Noto Sans KR ships Latin glyphs that sit cleanly beside Hangul, so a mixed line like `Typodeck Research · 2026년 11월` renders in one consistent face. Hierarchy survives through weight (900 / 700 / 500 / 400) plus the red rule and rail system, which carry more identity load in CJK builds.

### Loading

Add to the slide `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15–20% from the Latin spec. Display 1.2–1.25 (up from 1.02–1.08), body 1.65–1.75 (up from 1.45–1.5).
- **Letter-spacing**: set to 0 on every CJK run. The kicker's +0.18em and caption +0.08em tracking look broken on square CJK glyphs.
- **Text transform**: never apply `uppercase` to CJK text. Korean kickers render in Noto Sans KR 700 at 0 tracking with the red square bullet retained.
- **Punctuation**: use full-width CJK punctuation where the locale demands it; keep the `·` separator with spaces in mixed lines.
- **No trailing period on display headlines**: omit terminal punctuation on cover titles per CJK convention.
- **Space between CJK and Latin**: keep an ASCII space between Hangul/Hanja and adjacent Latin or digits (`11개 포스트모템` keeps the digit run tight; `Typodeck Research · 2026년` keeps spaced separators).
- **One font per sentence**: let Noto Sans KR handle mixed sentences; never font-switch mid-line back to Archivo or Inter.

### Aesthetic Notes for This System

The grid carries the CJK build. Noto Sans KR 900 at display sizes is sturdy but lacks Archivo's tight grotesque character, so lean harder on the **non-typographic** signatures: the exposed column grid, the 6px red rule, the cropped index numeral (Latin digits `01` stay in Archivo 800 even in CJK builds — numerals are locale-neutral), and the rail/meta/footer chrome, which translate unchanged.

### Known CJK Gap

- **No Swiss-grotesque Korean display face on CDN.** Noto Sans KR 900 gives heft but not Archivo's engineered tightness. Tight -0.01em tracking must be removed for CJK (it crowds square glyphs), so CJK headlines feel slightly looser than Latin ones.
- **Kicker voice weakens.** The red caps + 0.18em + square-bullet combination loses its tracking signal in Korean; the red color and square bullet carry recognition alone.

## Iteration Guide

1. Any new slide keeps the exposed 12-column grid at 7% ink, the index rail on columns 9–12, and the hairline footer. Don't skip the chrome.
2. Any new headline uses Archivo 800, flush-left, ragged-right, -0.01em tracking. Any new body uses Inter 400. Any new label uses Archivo 600 caps or Inter 500 small caps.
3. Any new kicker is red with its 18px square bullet, followed 20px later by the single 6px red rule spanning the content columns.
4. Any new numeral moment (stat, index, section number) uses Archivo 800 — 400px in the rail, 72px in stat rows.
5. Any new table uses the Swiss table pattern: 2px black top rule, caps header, 1px gray dividers, red square flags.
6. Any new measurement snaps to the 8px baseline and the 126/24 column system. Off-grid placement breaks the exposed-grid contract.
7. Any new accent is red and structural (rule, bullet, baseline). Never red text in body, never red fills.
8. If a headline exceeds ~45 characters, step it down to 72px; past ~80 characters, step to 48px. Never compress tracking past -0.01em.
9. If a slide needs a second content zone, use columns 1–5 + 6–8 splits with a 1px gray vertical divider — never a card or panel.
10. New slides are static cuts with no animation. Keep it that way.

## Known Gaps

- **Fonts**: Archivo / Inter via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the grotesque display voice.
- **No image treatment specified.** This system has no imagery direction — photography, illustration, and icons are out of scope. Content slides must argue with type, rules, and numerals alone.
- **No chart system beyond stat rows and bars.** Complex data visualization (line charts, scatter plots) has no specified style; authors should reduce data to stat rows or simple horizontal bars in ink with red flags.
- **Rail width is fixed.** Columns 9–12 cannot widen for long meta values; meta lines must wrap or abbreviate to fit 576px.
- **Index numerals are manual.** The `01 / 24` pagination and rail numerals are hand-set per slide; there is no auto-numbering layer.
- **The exposed grid is cosmetic CSS.** It aligns with the content grid by shared constants (72px margins, 24px gutters), not by layout coupling — editing one without the other breaks alignment silently.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in this system |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used — static cuts only | full | N/A |
| 4 | Pixel / hard offset shadows | Not used — zero shadows by doctrine | full | N/A |
| 5 | Gradients | Not used | full | N/A |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Grid hairlines at 7% ink; rail gray is solid | partial | Flatten gridlines to solid #EDEDED 1px lines |
| 8 | Custom fonts | Archivo / Inter via Google Fonts CDN | partial | Embed licensed equivalents or substitute Arial / Calibri |
| 9 | Absolute-positioned decor | Rail panel, red rule, kicker square as positioned blocks | full | Grouped native rectangles |
