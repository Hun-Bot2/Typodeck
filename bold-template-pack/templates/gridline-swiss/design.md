---
version: alpha
name: Gridline
description: An asymmetric Swiss presentation system on matte white with near-black ink and one signal red. Archivo ExtraBold headlines run flush-left and ragged-right on an invisible 12-column layout grid, Inter carries body and captions, and a right-hand folio column carries a giant free issue numeral with stacked meta. Structure comes from position, scale, weight, red type accents, and whitespace only — no rules, rails, panels, bullets, shadows, gradients, or rounded corners.
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
    fontSize: "380px"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "36px"
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
    description: "Red caps kicker in plain type. Whitespace below separates it from the title block; no bullet, no rule."
  red-rule:
    status: retired
    background: "{colors.signal-red}"
    successor: "kicker-line"
    description: "RETIRED in the typography-only vocabulary: the 6px red bar is removed (the background field stays for harness compatibility). The red accent survives as kicker text and valence type only."
  hairline-rule:
    status: retired
    successor: "whitespace"
    description: "RETIRED in the typography-only vocabulary: black structural rules are removed. Footers and zones separate by whitespace."
  column-grid:
    columns: 12
    gutter: 24px
    visible: false
    description: "Invisible 12-column layout grid. Aligns content and the folio column by shared constants; never printed, never visible."
  index-rail:
    status: retired
    successor: "folio-column"
    description: "RETIRED in the typography-only vocabulary: the gray panel is removed. Its contents become the folio column — free type on white."
  folio-column:
    columns: "9-12"
    textAlign: right
    description: "Right-hand folio column on grid columns 9-12: giant free index numeral with stacked meta rows beneath, whitespace-separated."
  index-numeral:
    fontFamily: "'Archivo', sans-serif"
    fontSize: 380px
    fontWeight: 800
    color: "{colors.ink}"
    description: "Giant free issue numeral (e.g., 01) in the folio column, right-aligned on white. Ink black, fully contained."
  meta-row:
    fontFamily: "'Inter', sans-serif"
    fontSize: 19px
    fontWeight: 500
    letterSpacing: 0.1em
    textTransform: uppercase
    description: "Small-caps meta line in the folio column: label over value, whitespace-separated."
  footer-bar:
    height: 110px
    description: "Footer pairing in plain type: small-caps context left, paginated index right, no rule."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Gridline is an **asymmetric Swiss presentation system**. Its foundational premise is the **invisible 12-column grid**: content aligns to shared column constants on every surface, so alignment reads as discipline rather than decoration. Content occupies columns 1–8; columns 9–12 carry a folio column with a giant free issue numeral and stacked meta. Nothing is centered, nothing is decorated, nothing casts a shadow.

The type stack is two faces with strict roles. **Archivo ExtraBold** is the display voice — flush-left, ragged-right, tight-tracked headlines at 48–118px plus the giant 380px index numeral. **Archivo SemiBold caps** at +0.18em tracking is the kicker voice, always in signal red. **Inter** is the workhorse — body at 24–36px, small-caps captions, folio meta, and footer context. The contrast is engineered: grotesque authority up top, neutral clarity below.

The palette is three colors plus gray: **matte white** ground, **near-black ink** for type, **signal red** reserved for the kicker and valence type (flagged cells, the negative comparison head). Red never appears as body text and never fills large areas — it is a type accent, spent sparingly per slide.

Structure comes from type, not chrome. Position, scale, weight, red accents, and whitespace are the entire depth system: no rules, no rails, no panels, no bullets, no cards, no shadows, no gradients, no rounded corners, no imagery. Whitespace is the luxury: 64px top margin, 72px side margins, 24px gutters, and a ragged right edge that proves the grid is real.

**Density philosophy: disciplined air.** A typical slide carries one headline block + one supporting element (a list, a typographic ledger, or a stat row) + the folio column. The folio is always populated — numeral plus meta rows — so even sparse slides feel complete. When content grows, the headline shrinks (118 → 72 → 48px); the grid and folio never move.

**Key Characteristics:**
- Invisible 12-column layout grid — alignment discipline with nothing printed on the ground.
- Giant free index numeral (Archivo 800, ~380px) in the folio column, right-aligned, fully contained.
- Red kicker line (Archivo 600 caps, +0.18em tracking) in plain type, separated by whitespace.
- Flush-left ragged-right headlines in Archivo 800 with tight -0.01em tracking; centering is forbidden.
- Footer pairing in plain type: small-caps context left, paginated index right.
- Zero rules, zero panels, zero bullets, zero shadows, zero gradients, zero border-radius anywhere in the system.
- Content locked to columns 1–8; the folio on columns 9–12 is always present and always populated.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The only ground. Matte, untextured, unprinted.
- **Ink** (`{colors.ink}` — `#111111`): All headlines, body text, and the index numeral. Near-black, never pure #000.
- **Signal Red** (`{colors.signal-red}` — `#E30613`): The single accent — kicker text and valence type (flagged ledger cells in red semibold, the negative comparison head). Never body text, never large fills.
- **Rail Gray** (`{colors.rail-gray}` — `#F2F2F2`): Retained palette token; its panel and zebra roles are retired in the typography-only vocabulary. Cool light gray, no warmth.
- **Muted** (`{colors.muted}` — `#6B6B6B`): Captions, secondary meta, and ledger header text. Never headlines.
- **Gridline wash** (`{colors.gridline}` — `rgba(17,17,17,0.07)`): Retained token; the printed scaffold is retired — the layout grid is invisible.

### Defaults

- **Default surface background**: `{colors.white}`, flat and unprinted.
- **Default headline color**: `{colors.ink}` — always, on every surface.
- **Default body text color**: `{colors.ink}` at full strength for ledes; `{colors.muted}` for secondary lines.
- **Default kicker color**: `{colors.signal-red}` — red kickers are the system's primary accent moment.
- **Default separation**: whitespace and scale only — no rules, no dividers, no panels.
- **Default folio treatment**: free ink numeral with stacked small-caps meta on white (`{components.folio-column}`).
- **Default ledger treatment**: small-caps muted headers over aligned tabular columns; flagged cells in red semibold, never red bullets.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Archivo** is the display and label face — a grotesque with engineered confidence. ExtraBold (800) carries every headline and the giant index numeral; SemiBold (600) in caps with +0.18em tracking carries kickers; SemiBold with +0.12em tracking carries the footer index. Archivo's tight, upright caps are what make the system read Swiss rather than generic sans.

**Inter** is the body and meta face — neutral, highly legible, invisible by design. Regular (400) carries body and ledes; Medium (500) in small caps carries captions, folio meta, and footer context. Inter never appears above 36px and never carries a headline.

Never use Inter for headlines, never use Archivo for body runs. The grotesque-up-top / neutral-below split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | 118px | Archivo | 800 | Cover title — flush-left, ragged-right, tight tracking |
| `{typography.display}` | 72px | Archivo | 800 | Section opener headline |
| `{typography.headline}` | 48px | Archivo | 800 | Standard slide headline |
| `{typography.section-head}` | 30px | Archivo | 800 | Sub-section head inside a content slide |
| `{typography.kicker}` | 20px | Archivo | 600 | Red caps kicker in plain type, whitespace below |
| `{typography.index-numeral}` | 380px | Archivo | 800 | Giant free numeral in the folio column |
| `{typography.body}` | 36px | Inter | 400 | Cover subtitle / lede paragraph |
| `{typography.body-compact}` | 24px | Inter | 400 | Standard body on content slides |
| `{typography.caption}` | 20px | Inter | 500 | Small-caps captions and table headers |
| `{typography.footer-index}` | 22px | Archivo | 600 | Paginated index in the footer (`01 / 24`) |
| `{typography.rail-meta}` | 19px | Inter | 500 | Small-caps meta rows in the folio column |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline is flush-left with a ragged right edge.** Centered or justified display type does not exist in this system.
- **Every cover title carries tight -0.01em tracking.** Archivo at display sizes needs the slight squeeze to feel engineered.
- **Every kicker is red, caps, +0.18em, in plain type.** No bullet, no rule — whitespace below separates it from the title block.
- **Every index numeral sits fully contained in the folio column.** The free numeral holds clear space on all sides — edge-cropping would fight the folio's calm.
- **Every footer pairs small-caps context (left) with a paginated index (right)** in the `NN / NN` format. One without the other breaks the pairing.
- **Every caption and meta line is uppercase with +0.08–0.10em tracking.** Sentence-case small text reads as leftover body copy.

### Typography Principles

The voice contrast is **grotesque authority ↔ neutral clarity**. Archivo states; Inter explains. Italic is never used anywhere — emphasis comes from red, weight, or scale, never slant.

Headlines should always feel **planted against the left margin** — the flush-left edge is the system's spine. Body should feel **invisible** — left-aligned, generous line-height (≥1.45), no letterspacing, no caps except in caption roles.

### Defaults

- **Default size for a cover title**: `{typography.display-xl}` (118px) — steps down to 72px when the title exceeds ~45 characters.
- **Default size for a slide headline**: `{typography.headline}` (48px).
- **Default size for body**: `{typography.body-compact}` (24px); covers use `{typography.body}` (36px) for the lede.
- **Default kicker size**: `{typography.kicker}` (20px) — never larger, never smaller.
- **Default footer sizes**: context in `{typography.caption}`, index in `{typography.footer-index}`.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The slide frame carries 64px top margin and 72px side margins; the footer pairing occupies the bottom 110px. The inner content grid is 12 columns of 126px with 24px gutters (1776px total), invisible — alignment by shared constants, nothing printed.

Content columns are 1–8 (1176px wide). The folio column occupies columns 9–12 (576px wide) with a 24px gutter gap from the content block. On dense content slides the folio may narrow to columns 10–12, but it is never removed.

### Persistent Chrome

Two elements appear on every slide:

- **Folio column** — `{components.folio-column}` on columns 9–12: giant free numeral with stacked meta rows (issue / cases / date), whitespace-separated.
- **Footer pairing** — `{components.footer-bar}`: small-caps context left, paginated index right, no rule.

The invisible 12-column grid aligns every slide and prints nothing.

### Asymmetric Rhythm

The 8/4 content-to-folio split is the system's rhythm. Content never crosses into the folio; the folio never carries body copy. The ragged right edge of the headline block should land at visibly different x-positions line to line — even, justified-looking right edges mean the measure is wrong.

## Depth and Elevation

### Flat by Doctrine

Gridline has **no depth system**. There are no shadows, no gradients, no translucency, no layered cards, no rules, no panels. Hierarchy is built exclusively from position, scale (118 → 20px), weight (800 → 400), color (ink → muted → red accent), and whitespace.

### Type as Structure

- **The red kicker** (`{components.kicker-line}`) is the primary structural accent — plain red caps with whitespace below separating it from the title block.
- **Whitespace gaps** separate footer, header, and ledger zones — never rules, never dividers.
- **Scale steps** separate rows inside ledgers and lists — never boxes, never bullets.

A slide that needs more emphasis gets a bigger headline or a redder kicker — never a shadow, a panel, or a rule.

### The Folio as Figure

The only figure/ground move in the system is the **giant free numeral** against the white ground. The 380px Archivo numeral floats in the folio column with clear space on all sides; its scale against the small-caps meta is the sharpest contrast on the slide after the red kicker.

## Shapes and Treatment

### Border Radius

Zero everywhere, trivially — there are no boxes, rules, bullets, or panels to round. A rounded corner anywhere collapses the Swiss reading immediately.

### Border Weights

No borders exist in this system. The retired weights (6px red, 2px black, 1px gray, 18px square) are documented for history only: rules, dividers, and bullets were removed in the typography-only vocabulary, and every separation they performed is now whitespace.

### Decorative Element Types

**Red kicker** — The plain red caps kicker opening the content columns. The system's most recognizable mark.

**Index numeral** — The 380px Archivo 800 free numeral in the folio column, right-aligned, fully contained with clear space.

**Column grid** — The invisible 12-column layout scaffold. Alignment discipline, never printed.

**Meta row** — Small-caps label/value pairs in the folio column, whitespace-separated.

**Footer pairing** — Context/index type pairing. Closes every slide identically.

**Stat row** — On data slides: 3–4 large Archivo 800 numerals (72px) in a row with small-caps Inter labels beneath, whitespace-separated.

**Typographic ledger** — Header row in Inter 500 caps over aligned tabular columns; flagged cells in red semibold type, never bullets, never red fills.

**Numbered findings list** — The canonical vertical list for findings and takeaways. Each row pairs a two-digit numeral (Archivo 800, 30px, ink) in a fixed 96px lead column with a stacked head + body: `{typography.section-head}` head over `{typography.body-compact}` body. Rows separate by whitespace; max four rows per slide. Bare bullets, hanging dashes, and unnumbered stacks are not lists in this system.

**Two-zone comparison** — The A/B device: side A and side B sit side by side with a wide whitespace gutter. Each zone opens with a `{typography.section-head}` zone label; rows beneath follow the ledger row rhythm. Side identity is positional — zones are never tinted. Valence is typed: a failing side carries a red zone head; red semibold flags failing cells on *either* side. A neutral A/B with no good/bad valence stays all-ink.

## Do's and Don'ts

### Do

- Align every slide to the invisible 12-column grid. The grid disciplines layout; it never prints.
- Set every headline flush-left with a ragged right edge in Archivo 800.
- Set every kicker as plain red caps with whitespace below — no bullet, no rule.
- Contain the giant free index numeral in the folio column with clear space — never crop it against the column edge.
- Close every slide with the footer pairing: context left, paginated index right, no rule.
- Populate the folio on every slide: numeral plus at least two meta rows.
- Step the headline down (118 → 72 → 48px) as titles lengthen; never squeeze tracking past -0.01em.
- Mark flagged ledger cells with red semibold type.
- Set findings as the numbered list: numeral + section-head + body, whitespace-separated.
- Encode comparisons by zone position with a wide gutter; type valence in red (failing head, flagged cells).
- Let whitespace do the work: 64px top, 72px sides, 24px gutters, no exceptions.

### Don't

- Don't center anything larger than a caption. Centered headlines destroy the Swiss reading.
- Don't add rules, bullets, panels, or dividers of any weight. Separation is whitespace only.
- Don't round any corner, blur any shadow (there are none), or add any gradient.
- Don't fill large areas with red. Red is kicker text and valence type, never a field.
- Don't use Inter for headlines or Archivo for body runs.
- Don't use italic for emphasis anywhere — use red, weight, or scale.
- Don't remove the folio or the footer to "make room." Shrink the headline instead.
- Don't justify body text. Left-aligned with a ragged edge, always.
- Don't place body copy inside the folio. The folio carries numerals and meta only.
- Don't print the column grid on "structured" slides. The grid aligns; it never shows.
- Don't tint comparison zones; red marks valence, position marks sides.

## Responsive Behavior

Gridline is a **fixed-stage system** built for 1920×1080 output. All sizes are absolute pixels; there are no breakpoints in the generated deck. The stage scales uniformly via a single transform (letterboxed, no reflow).

### Scaling Behavior

- The 12-column grid, 126px columns, and 24px gutters are fixed at 1920×1080 and scale uniformly with the stage transform.
- Headline sizes step down by content length (118 → 72 → 48px), not by viewport.
- The index numeral stays 380px at stage scale; its position is fixed relative to the folio column.

### Component Breakpoints

None. The fixed-stage model has no viewport breakpoints. (Source-history note: a fluid ancestor of this system stacked the folio below content under 900px; that behavior is superseded by the fixed-stage policy above.)

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are instant cuts — no fade, no slide motion. Swiss decks cut like paper.

### Animation Triggers

None. This system has no animation: no entry transitions, no counters, no chart grows. Static frames only.

### Print Behavior

The system prints 1:1 — white ground, ink type, red kicker type. Nothing prints beyond type on white. For static export, screenshots preserve the type and folio exactly.

## CJK & International Content

When using this system for Korean (or other CJK) content, swap the Latin stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / index numeral | Archivo 800 | Noto Sans KR 900 |
| Kicker / footer index | Archivo 600 (caps + tracking) | Noto Sans KR 700 (no transform, no tracking) |
| Body / captions / meta | Inter 400–500 | Noto Sans KR 400–500 |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin coverage. Set every text element to `font-family: 'Noto Sans KR', sans-serif`. Noto Sans KR ships Latin glyphs that sit cleanly beside Hangul, so a mixed line like `Typodeck Research · 2026년 11월` renders in one consistent face. Hierarchy survives through weight (900 / 700 / 500 / 400) plus the red kicker and folio system, which carry more identity load in CJK builds.

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
- **Text transform**: never apply `uppercase` to CJK text. Korean kickers render in Noto Sans KR 700 at 0 tracking in plain red type.
- **Punctuation**: use full-width CJK punctuation where the locale demands it; keep the `·` separator with spaces in mixed lines.
- **No trailing period on display headlines**: omit terminal punctuation on cover titles per CJK convention.
- **Space between CJK and Latin**: keep an ASCII space between Hangul/Hanja and adjacent Latin or digits (`11개 포스트모템` keeps the digit run tight; `Typodeck Research · 2026년` keeps spaced separators).
- **One font per sentence**: let Noto Sans KR handle mixed sentences; never font-switch mid-line back to Archivo or Inter.

### Aesthetic Notes for This System

The type system carries the CJK build. Noto Sans KR 900 at display sizes is sturdy but lacks Archivo's tight grotesque character, so lean harder on the **typographic** signatures: the red kicker, the flush-left discipline, the free index numeral (Latin digits `01` stay in Archivo 800 even in CJK builds — numerals are locale-neutral), and the folio/meta/footer type, which translate unchanged.

### Known CJK Gap

- **No Swiss-grotesque Korean display face on CDN.** Noto Sans KR 900 gives heft but not Archivo's engineered tightness. Tight -0.01em tracking must be removed for CJK (it crowds square glyphs), so CJK headlines feel slightly looser than Latin ones.
- **Kicker voice weakens.** The red caps + 0.18em combination loses its tracking signal in Korean; the red color carries recognition alone.

## Iteration Guide

1. Any new slide aligns to the invisible 12-column grid, keeps the folio column on columns 9–12, and closes with the footer pairing. Don't skip the chrome.
2. Any new headline uses Archivo 800, flush-left, ragged-right, -0.01em tracking. Any new body uses Inter 400. Any new label uses Archivo 600 caps or Inter 500 small caps.
3. Any new kicker is red plain caps type, followed by whitespace separating it from the title block. No bullet, no rule.
4. Any new numeral moment (stat, index, section number) uses Archivo 800 — 380px free in the folio, 72px in stat rows.
5. Any new data set uses the typographic ledger pattern: caps header, aligned tabular columns, red semibold flags. No rules, no dividers, no bullets.
6. Any new measurement snaps to the 8px baseline and the 126/24 column system. Off-grid placement breaks the alignment contract.
7. Any new accent is red type (kicker, flag, failing head). Never red body text, never red fills, never red rules.
8. If a headline exceeds ~45 characters, step it down to 72px; past ~80 characters, step to 48px. Never compress tracking past -0.01em.
9. If a slide needs a second content zone, use side-by-side zones with a wide whitespace gutter — never a divider, card, or panel.
10. New slides are static cuts with no animation. Keep it that way.
11. Any new findings list uses the numbered-findings pattern: Archivo 800 numeral in a 96px lead column, section-head, body-compact, whitespace-separated. Never bare bullets or hanging dashes.
12. Any new comparison uses the two-zone split with positional side identity; red type marks valence (failing head, flagged cells) on either side, never side membership. Neutral A/B comparisons stay all-ink.

## Known Gaps

- **Fonts**: Archivo / Inter via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the grotesque display voice.
- **No image treatment specified.** This system has no imagery direction — photography, illustration, and icons are out of scope. Content slides must argue with type and numerals alone.
- **No chart system beyond stat rows.** Complex data visualization (line charts, scatter plots, bars) has no specified style; authors should reduce data to stat rows or typographic ledgers with red type flags.
- **Folio width is fixed.** Columns 9–12 cannot widen for long meta values; meta lines must wrap or abbreviate to fit 576px.
- **Index numerals are manual.** The `01 / 24` pagination and folio numerals are hand-set per slide; there is no auto-numbering layer.
- **The invisible grid is conventional.** It aligns by shared constants (72px margins, 24px gutters), not by layout coupling — editing one without the other breaks alignment silently.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in this system |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used — static cuts only | full | N/A |
| 4 | Pixel / hard offset shadows | Not used — zero shadows by doctrine | full | N/A |
| 5 | Gradients | Not used | full | N/A |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Not used (printed grid retired) | full | N/A |
| 8 | Custom fonts | Archivo / Inter via Google Fonts CDN | partial | Embed licensed equivalents or substitute Arial / Calibri |
| 9 | Absolute-positioned decor | Retired — folio numeral and kicker are plain text boxes | full | Native text boxes |
