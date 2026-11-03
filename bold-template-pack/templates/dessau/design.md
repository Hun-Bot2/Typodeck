---
version: alpha
name: Dessau
description: A Bauhaus-primary presentation system on the Dessau school's visual grammar — white ground, heavy black bars, and flat unmodulated primaries (red #E30613, blue #0066B3, yellow #FFCC00). Jost, a Futura-descended geometric sans, carries every role: lowercase-only display, regular body, and wide-tracked caps labels. Three-column grid keyed by vertical primary bars, triangle/circle/square glyph ornaments, zero gradients, zero shadows — clarity that feels joyful and structural at once.

colors:
  white: "#FFFFFF"
  black: "#000000"
  red: "#E30613"
  blue: "#0066B3"
  yellow: "#FFCC00"

shadows:
  none-declared: "none — the system uses no shadows"

typography:
  bauhaus-display:
    fontFamily: "'Jost', 'Noto Sans KR', sans-serif"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: 0
    textTransform: lowercase
  bauhaus-subtitle:
    fontFamily: "'Jost', 'Noto Sans KR', sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.45
  bauhaus-context:
    fontFamily: "'Jost', 'Noto Sans KR', sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.2em
    textTransform: uppercase
  bauhaus-body:
    fontFamily: "'Jost', 'Noto Sans KR', sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.6
  bauhaus-label:
    fontFamily: "'Jost', 'Noto Sans KR', sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.2em
    textTransform: uppercase
  bauhaus-numeral:
    fontFamily: "'Jost', 'Noto Sans KR', sans-serif"
    fontSize: "54px"
    fontWeight: 600
    lineHeight: 1

spacing:
  bar-top: "96px"
  bar-bottom: "72px"
  col-gap: "48px"
  grid-margin: "96px"
  primary-bar-w: "28px"
  glyph-size: "40px"
  gap-title-sub: "32px"
  gap-sub-context: "40px"
  content-max-width: "1500px"

canvas:
  width: 1920px
  height: 1080px

components:
  black-bar-top:
    height: 96px
    background: "{colors.black}"
    description: "Full-width black band across the slide top carrying the context line in white caps. The poster's press-sheet frame."
  black-bar-bottom:
    height: 72px
    background: "{colors.black}"
    description: "Full-width black band across the slide bottom carrying the page numeral and the tri-color strip. Closes the frame."
  primary-bars:
    width: 28px
    colors: "{colors.red} / {colors.blue} / {colors.yellow}"
    description: "Three vertical bars in red, blue, yellow. Red fronts the title column at the grid margin; blue and yellow pair as the divider into the glyph column. Full content-height, flat, 28px wide."
  glyph-triangle:
    size: 40px
    color: "{colors.red}"
    description: "Upward equilateral triangle in flat red. Marks primary headers and first-column anchors."
  glyph-circle:
    size: 40px
    color: "{colors.blue}"
    description: "Perfect circle in flat blue. Marks secondary headers and second-column anchors."
  glyph-square:
    size: 40px
    color: "{colors.yellow}"
    description: "Square in flat yellow, edged in black when on white. Marks tertiary anchors and bullet points."
  tricolor-strip:
    height: 12px
    description: "Three equal flat segments (red/blue/yellow) riding the top edge of the bottom black bar. The system's sign-off line."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Dessau is a **Bauhaus-primary presentation system** that treats the 1920×1080 slide as a small poster press sheet. The compositional contract is strict: white ground, a heavy black bar top and bottom, three flat vertical bars in red, blue, and yellow keying the composition (red fronting the title column, blue/yellow pairing into the glyph column), and a single geometric sans — **Jost** — carrying every typographic role. Display headlines set **lowercase only**, after the Bauhaus universal-lowercase experiments; labels set in wide-tracked caps; body sets plain. Contrast comes from case, size, weight, and color — never from a second typeface.

The palette is doctrine, not decoration: black and white carry structure and text; the three primaries carry emphasis, keying, and ornament. No secondary colors exist — no orange, green, or purple anywhere, no tints of the primaries, no gray text (black at full strength or nothing). Every color hits flat and unmodulated: no gradients, no transparency, no shadows. A Dessau slide should look printable in five spot inks.

Geometry is the ornament language. The triangle (red), circle (blue), and square (yellow) appear as header marks, bullet glyphs, and large compositional anchors. Each shape keeps its assigned primary — a blue triangle or red circle is a system violation. Shapes align to the column grid and the bar rhythm; floating decoration without a grid address does not exist.

**Density philosophy: medium, gridded.** A typical slide carries one display headline, one supporting line, and up to three columns of short content or one row of three keyed blocks. Whitespace is structural (gutters, bar rhythm) rather than atmospheric. The slide should feel organized and confident, never airy-empty or crowded.

**Key Characteristics:**
- Lowercase-only display type in Jost 600 — headlines refuse capital letters on principle.
- Heavy black bars (96px top, 72px bottom) framing the slide like a poster press sheet.
- Three vertical primary bars (red / blue / yellow): red fronts the title column, blue and yellow pair as the divider into the glyph column.
- Triangle / circle / square glyph ornaments in fixed shape-color assignments.
- Single-family typography — Jost carries display, body, and labels.
- Flat unmodulated color — no gradients, shadows, transparency, or tints.
- Five spot inks only: white, black, red, blue, yellow — no secondaries, no grays.
- Tricolor strip sign-off riding the bottom bar.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The ground. Pure neutral white between the black bars.
- **Black** (`{colors.black}` — `#000000`): Structure and text. Both bars, all display and body text on white, glyph edging on yellow.
- **Red** (`{colors.red}` — `#E30613`): First primary. First column bar, triangle glyphs, first-series emphasis, one display accent per slide maximum.
- **Blue** (`{colors.blue}` — `#0066B3`): Second primary. Second column bar, circle glyphs, second-series emphasis.
- **Yellow** (`{colors.yellow}` — `#FFCC00`): Third primary. Third column bar, square glyphs. Always edged or bar-paired in black on white grounds so it holds.

### Defaults

- **Default surface background**: `{colors.white}` flat between the bars.
- **Default headline color**: `{colors.black}`, lowercase. One headline word or phrase per slide may take `{colors.red}` instead.
- **Default body text color**: `{colors.black}` at full opacity — never gray, never a primary.
- **Default label color**: `{colors.black}` on white; `{colors.white}` inside the black bars.
- **Default bar keying**: red fronts the title column at the left margin; blue and yellow stand paired as the divider before the glyph column. Bars never cross text blocks.
- **Default glyph assignment**: triangle red, circle blue, square yellow — fixed pairs, never swapped.

When a slide needs emphasis beyond the headline accent, reach for scale or a glyph — never for a fourth color, a tint, or gray text.

## Typography

### Font Family

The system runs **one face**: **Jost**, a Futura-descended geometric sans with round bowls, sharp apexes, and a principled Euro-modernist voice. It carries display (600, lowercase), body (400), and labels (600, caps, tracked). Typographic unity is the point — the Bauhaus masters set whole posters in one family, and so does Dessau.

Never introduce a second family. Contrast comes from case (lowercase display vs caps labels), size (96px vs 15px), weight (400 vs 600), and color (black vs white vs one primary) — a full expressive range without leaving Jost.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.bauhaus-display}` | 96px | Jost | 600 | Cover / section display title, lowercase |
| `{typography.bauhaus-numeral}` | 54px | Jost | 600 | Page numeral in the bottom bar |
| `{typography.bauhaus-subtitle}` | 34px | Jost | 400 | Subtitle / lede below the title |
| `{typography.bauhaus-body}` | 22px | Jost | 400 | Paragraph body, column text |
| `{typography.bauhaus-context}` | 17px | Jost | 600 | Context line in the top bar, caps |
| `{typography.bauhaus-label}` | 15px | Jost | 600 | Column labels, caps, tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display title is lowercase** (`text-transform: lowercase`), Jost 600 at 96px, line-height 1.08, pretty-wrapped (fills the measure greedily while avoiding orphaned last lines; never balanced — balancing shatters long titles into overflow). A capital letter in a display title is a system violation (Latin script; CJK runs are caseless and exempt).
- **Every label and context line is uppercase with 0.2em tracking**, Jost 600. Sentence-case labels do not exist (Latin script).
- **Every display title may carry at most one primary-color accent** (a word or short phrase in red). Two accented phrases, or accents in different primaries on one slide, break the discipline.
- **Every subtitle sets in Jost 400 at 34px, sentence case**, line-height 1.45. Never lowercase-forced, never tracked.
- **Every bottom-bar numeral sets in Jost 600 at 54px in white**, centered in the 72px bar. Never in a primary, never overflowing the bar.
- **Every top-bar context line sets in white caps at 17px with 0.2em tracking.** Never in a primary (contrast and hierarchy).
- **Yellow type on white is forbidden.** Yellow appears only as bars, glyphs, and the tricolor strip — never as letterforms on white.

### Typography Principles

The voice contrast is **lowercase geometric display ↔ plain sentence body ↔ tracked caps labels**, all in one family. The lowercase display is the system's most recognizable move — it should feel principled (a nod to Bayer's universal alphabet), not casual. Keep display lines short (under 30 characters) so the large lowercase letterforms stack into a confident block.

Alignment is left within columns, keyed to bar edges. The top-bar context line aligns left to the grid margin; the bottom-bar numeral aligns right to the grid margin. Centered text appears nowhere — the grid is bilateral and strict.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** framed as a press sheet: a 96px black bar across the top, a 72px black bar across the bottom (topped by the 12px tricolor strip), and a white content field of 1920×912 between them. Content margins are 96px left and right. The red 28px bar stands at the left margin fronting the title zone (x=152–1204); the blue and yellow 28px bars stand paired at x=1236 and x=1292 as the divider into the glyph zone (x=1352–1712), which holds the large geometric glyph composition — triangle, circle, square stacked at display scale. No bar ever crosses a text block.

### Persistent Chrome

Two elements persist on every slide:

- **Top black bar** — 96px, full width, carrying the context line (source · date) in white tracked caps, left-aligned to the 96px margin. On section slides it may carry the section name instead.
- **Bottom black bar** — 72px, full width, topped by the 12px tricolor strip (three equal red/blue/yellow segments), carrying the page numeral in white 54px Jost 600, right-aligned to the 96px margin.

No other chrome persists. No nav dots, no progress indicators — the bars are the chrome.

## Depth and Elevation

Dessau has **no depth system**. All color is flat, all shapes are unmodulated, and overlap is resolved by hard edges, never by shadow, blur, or transparency. The `{shadows.none-declared}` token exists only to satisfy the schema honestly: this system declines the entire category.

Hierarchy is achieved through **scale, color weight, and grid position**: black masses anchor, primaries punctuate, white breathes. A glyph may overlap a bar or a headline may overlap a glyph field, but the overlap is a flat collage edge — crisp, opaque, shadowless.

Any drop shadow, gradient, or alpha blend is a defect in a Dessau deck. Export paths (including PPTX) reproduce the system trivially because every element is a native solid shape or text run.

## Shapes and Treatment

### Border Radius

Zero for bars, strips, squares, and text containers. The circle glyph is the only round form in the system — and it is a true geometric circle, not a rounded rectangle. No pill shapes, no rounded buttons, no softened corners anywhere.

### Border Weights

- **No strokes on bars or color blocks** — primaries and black masses are pure fills meeting at hard edges.
- **6px solid black edge** — applied to the yellow square glyph (and only it) when it sits on white, so the light primary holds its shape.
- **4px solid black underline** — the single permitted emphasis rule beneath a column label or key figure. One per column maximum.

Strokes otherwise do not exist. Frames, outlines, and keylines are forbidden — the grid is made of masses, not lines.

### Decorative Element Types

**Black bar (top)** — 96px full-width black band with the white context line. Structural frame, always present.

**Black bar (bottom)** — 72px full-width black band with the white page numeral. Structural frame, always present.

**Primary bars** — Three 28px vertical bars (red / blue / yellow) fronting the three columns, running the content-field height. They are the grid made visible.

**Glyph triangle** — Flat red upward equilateral triangle, 40px standard / up to 200px compositional. First-column and primary-header mark.

**Glyph circle** — Flat blue circle, 40px standard / up to 200px compositional. Second-column and secondary-header mark.

**Glyph square** — Flat yellow square with 6px black edge on white, 40px standard / up to 200px compositional. Third-column mark and bullet glyph.

**Tricolor strip** — 12px-tall strip of three equal red/blue/yellow segments riding the top edge of the bottom bar. The sign-off line, always present.

**Label underline** — 4px black rule beneath a column label, width of the label text. Maximum one per column.

## Do's and Don'ts

### Do

- Set every display title lowercase in Jost 600 at 110px — no capital letters, ever (Latin).
- Frame every slide with the 96px top bar and the 72px bottom bar + tricolor strip.
- Key the composition with red / blue / yellow vertical bars: red fronting the title column, blue and yellow paired as the divider — never crossing text.
- Keep triangle-red, circle-blue, square-yellow assignments fixed everywhere.
- Use Jost for every text role — display, body, labels, numerals.
- Hold all color flat and full-strength: five spot inks, no tints, no gradients, no transparency.
- Edge the yellow square in 6px black whenever it sits on white.
- Align every element to the column grid and bar rhythm — everything has a grid address.
- Limit display accents to one red word or phrase per slide.
- Set bar text in white — context caps top-left, numeral bottom-right.

### Don't

- Don't set display type with capitals, or body/labels in lowercase-forced style.
- Don't introduce a second typeface for any role.
- Don't use orange, green, purple, gray text, or tints of the primaries.
- Don't add shadows, gradients, blur, transparency, or textures.
- Don't swap glyph-color assignments (no blue triangles, no red circles).
- Don't set letterforms in yellow on white — yellow is for masses, not type.
- Don't round any corner except the true-circle glyph.
- Don't float decoration without a grid address — no unaligned confetti.
- Don't omit the bars or the tricolor strip on any slide.
- Don't center text — the grid is bilateral; alignment is left in columns, bar-keyed in chrome.

## Responsive Behavior

Dessau is a **fixed-stage system**: the 1920×1080 press sheet scales uniformly via one transform and never reflows. Bar heights, column widths, and glyph sizes are absolute coordinates — the poster's proportions are the design.

### Scaling Behavior

- All type, bar, and glyph dimensions are fixed px values on the 1920×1080 stage.
- The stage scaler letterboxes on non-16:9 viewports; bars outside the stage are black and read as an extension of the frame.
- No clamp(), vw, or vh units appear in slide CSS.

### Component Breakpoints

None. The system has no breakpoints; the single transform handles all viewports.

### Presenter Behavior

- Slides advance linearly with a hard cut (0ms) — the Bauhaus register favors the decisive cut over the dissolve.
- No staged builds within a slide; columns appear whole.

### Animation Triggers

None by default. If motion is required, glyphs may wipe in along their column bars (200ms linear, honoring `prefers-reduced-motion` by appearing instantly). Type never animates.

### Print Behavior

Print at 16:9 full-bleed. The five spot inks reproduce exactly; black bars should print at 100K. For economy printing, the bars may drop to 80K and yellow holds without its black edge — document the substitution on the print proof.

## CJK & International Content

The lowercase-display rule is Latin-specific (CJK scripts are caseless), so CJK builds keep the grid, bars, primaries, and glyphs identical and transfer hierarchy to weight and size within a single CJK family.

### Recommended Korean Pairing

| Role | Default | Korean counterpart |
|---|---|---|
| Display / body / labels / numerals | Jost 400–600 | Noto Sans KR 400 / 500 / 700 |

A single family (Noto Sans KR) preserves the one-family doctrine. Weights step up (700 for display/labels) because CJK glyphs need more stroke contrast to match Jost 600's presence.

### Recommended Chinese Pairing

| Role | Default | Chinese counterpart |
|---|---|---|
| Display / body / labels / numerals | Jost 400–600 | Noto Sans SC 400 / 500 / 700 |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin coverage for CJK-dominant slides: set every text element to `'Noto Sans KR', sans-serif` so mixed sentences render in one consistent face. For Latin-dominant slides with CJK accents, stack `'Jost', 'Noto Sans KR', sans-serif` so Latin keeps the geometric voice and only CJK glyphs fall through.

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15%. Display 1.2–1.25 (up from 1.08), subtitle 1.55–1.6, body 1.7–1.75. CJK blocks run denser; the grid wants matching air.
- **Letter-spacing**: 0 on every CJK run. The 0.2em label tracking applies to Latin runs only.
- **Text transform**: `lowercase` and `uppercase` do not apply to CJK text. Labels mixing Latin and CJK keep the transform (Latin-only effect) with tracking reduced to 0.12em.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: convention omits sentence-final punctuation at display scale.
- **Space between CJK and Latin**: one ASCII space between scripts: `11개 포스트모템`, `Typodeck Research · 2026년 11월`.
- **Glyph-color assignments unchanged**: geometry is script-independent; triangle/circle/square keep their primaries.

### Aesthetic Notes for This System

Dessau's identity is carried more by masses and grid than by letterforms, so CJK transfer is robust: the bars, primary columns, and glyph trio do the recognition work even when Jost's geometry is absent. The main loss is the lowercase-display principle — compensate by holding CJK display at the same 96px size and tight leading so its block silhouette matches the Latin lowercase block.

### Known CJK Gap

- **No geometric-constructivist CJK face exists on the CDN.** Noto Sans KR/SC are neutral grotesques, not Futura-descended geometrics — the display voice flattens from "principled modernist" to "clean sans." The grid, bars, and primaries must carry the Bauhaus signal alone.
- **The lowercase rule has no CJK expression.** Caseless scripts cannot participate in the system's most recognizable typographic move; weight and block-shape substitute imperfectly.

## Iteration Guide

1. Any new slide starts from the press-sheet frame: 96px top bar, 72px bottom bar + tricolor strip, white field, red key bar at the margin and the blue/yellow divider pair before the glyph zone.
2. Any new text element uses Jost. Display is 600 lowercase; body is 400 sentence case; labels are 600 caps tracked. No second family.
3. Any new display title carries at most one red accent word or phrase — everything else black.
4. Any new column takes the next primary in red/blue/yellow order with its matching glyph (triangle/circle/square).
5. Any new glyph keeps its fixed shape-color pair at 40px standard or display scale for compositional anchors.
6. Any new color must be one of the five spot inks at full strength. Tints, grays, and secondaries are violations.
7. Any new emphasis uses scale, case, or a primary mass — never bold-italic, underline (except the 4px label rule), or a new color.
8. Any new element takes a grid address: column-aligned, bar-aligned, margin-aligned. Unaligned floats are forbidden.
9. Any new slide keeps all fills flat and opaque — no shadow, gradient, blur, or transparency.
10. Any new deck is reviewed against the poster test: does every slide look printable in five spot inks? If not, remove the offending effect.

## Known Gaps

- **Fonts**: Jost (+ Noto Sans KR for Korean) via Google Fonts CDN (`display=swap`); fallbacks `Futura, "Century Gothic", "Arial Black", sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the geometric voice.
- **No chart system beyond primary bars.** Data graphics are limited to flat horizontal/vertical bars in the three primaries with Jost numerals; line charts, pies, and scatters have no native pattern.
- **No table system.** Tabular data uses column text with the 4px label rule as the only divider; ruled grids are forbidden, so dense tables fit poorly.
- **No image treatment.** Photography has no defined mask or duotone rule; if unavoidable, place rectangular full-column-bleed images with no rounding and no overlay (undocumented extension).
- **Yellow-on-white fragility.** The yellow column bar and tricolor segment hold by mass, but thin yellow elements (under 12px) vibrate on white — keep yellow masses chunky.
- **Lowercase proper nouns.** Names and trademarks forced lowercase (the doctrine) can read as errors to unfamiliar audiences — warn presenters this is intentional.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional 200ms glyph wipe-in | none | Static final frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows in system |
| 5 | Gradients | Not used | full | N/A — all fills flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — clean ground |
| 7 | Transparency layers | Not used | full | N/A — all fills opaque |
| 8 | Custom fonts | Jost / Noto Sans KR via CDN | partial | Embedded subset or Futura/system fallback |
| 9 | Absolute-positioned decor | Bars, glyphs, strip (absolute divs) | full | Grouped native shapes |
