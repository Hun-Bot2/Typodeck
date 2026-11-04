---
version: alpha
name: Dessau
description: A Bauhaus-primary presentation system on the Dessau school's visual grammar — white ground, heavy black rules, and flat unmodulated primaries (red #E30613, blue #0066B3, yellow #FFCC00). Jost, a Futura-descended geometric sans, carries every role: lowercase-only display, regular body, and wide-tracked caps labels. Column grid keyed by red and blue ▲/● text markers, giant display numerals, zero gradients, zero shadows — clarity that feels joyful and structural at once. Typography-only: no bars, bands, strips, or drawn shapes.

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
  rule-w: "4px"
  masthead-h: "96px"
  footer-h: "76px"
  col-gap: "140px"
  grid-margin: "96px"
  glyph-size: "22px"
  gap-title-sub: "32px"
  gap-sub-context: "40px"
  content-max-width: "1728px"

canvas:
  width: 1920px
  height: 1080px

components:
  masthead-rule:
    height: 96px
    rule: "4px solid {colors.black} below"
    description: "Black context line in tracked caps over a 4px rule. The poster's top frame, drawn not filled."
  footer-rule:
    height: 76px
    rule: "4px solid {colors.black} above"
    description: "Black page numeral right-aligned under a 4px rule. Closes the frame."
  primary-markers:
    glyphs: "▲ red / ● blue"
    size: 22px
    description: "Text markers keying columns and lists: red ▲ for the first/rushed voice, blue ● for the second/kept voice. Fixed pairs, never swapped."
  giant-numeral:
    fontSize: 340px
    colors: "{colors.red} / {colors.blue} / {colors.black}"
    description: "Display-scale page numeral anchoring the right zone with a fig. caption beneath. The compositional anchor, set in type."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and rule legibility.

## Overview

Dessau is a **Bauhaus-primary presentation system** that treats the 1920×1080 slide as a small poster press sheet. The compositional contract is strict: white ground, a heavy black rule top and bottom, red and blue ▲/● text markers keying the columns, a giant display numeral anchoring the right zone, and a single geometric sans — **Jost** — carrying every typographic role. Display headlines set **lowercase only**, after the Bauhaus universal-lowercase experiments; labels set in wide-tracked caps; body sets plain. Contrast comes from case, size, weight, and color — never from a second typeface.

The palette is doctrine, not decoration: black and white carry structure and text; red and blue carry emphasis, keying, and markers. No secondary colors exist — no orange, green, purple, or yellow on covers, no tints of the primaries, no gray text (black at full strength or nothing). Every color hits flat and unmodulated: no gradients, no transparency, no shadows. A Dessau slide should look printable in four inks.

Geometric glyphs are the ornament language. The ▲ (red) and ● (blue) appear as header marks and bullet glyphs. Each glyph keeps its assigned primary — a blue triangle or red circle is a system violation. Markers align to the column grid; floating decoration without a grid address does not exist.

**Density philosophy: medium, gridded.** A typical slide carries one display headline, one supporting line, and up to two columns of short content or one row of keyed blocks. Whitespace is structural (gutters, rule rhythm) rather than atmospheric. The slide should feel organized and confident, never airy-empty or crowded.

**Key Characteristics:**
- Lowercase-only display type in Jost 600 — headlines refuse capital letters on principle.
- Heavy black rules (96px masthead, 76px footer) framing the slide like a poster press sheet.
- Red ▲ and blue ● text markers keying columns and lists in fixed glyph-color assignments.
- Giant display numeral anchoring the right zone with a fig. caption.
- Single-family typography — Jost carries display, body, and labels.
- Flat unmodulated color — no gradients, shadows, transparency, tints, or boxes.
- Four working inks on the slide: white, black, red, blue — yellow reserved (unreadable as type on white).

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The ground. Pure neutral white between the rules.
- **Black** (`{colors.black}` — `#000000`): Structure and text. Both rules, all display and body text, the footer numeral.
- **Red** (`{colors.red}` — `#E30613`): First primary. ▲ markers, giant numeral (cover), first-series emphasis, one display accent per slide maximum.
- **Blue** (`{colors.blue}` — `#0066B3`): Second primary. ● markers, giant numeral (evidence), second-series emphasis.
- **Yellow** (`{colors.yellow}` — `#FFCC00`): Reserved token. Unreadable as type or rule on white, so it appears in no type-only cover.

### Defaults

- **Default surface background**: `{colors.white}` flat between the rules.
- **Default headline color**: `{colors.black}`, lowercase. One headline word or phrase per slide may take `{colors.red}` instead.
- **Default body text color**: `{colors.black}` at full opacity — never gray, never a primary.
- **Default label color**: `{colors.black}` on white.
- **Default marker keying**: red ▲ for the first column voice, blue ● for the second. Markers never detach from their text.
- **Default glyph assignment**: triangle red, circle blue — fixed pairs, never swapped.

When a slide needs emphasis beyond the headline accent, reach for scale or a marker — never for a fourth color, a tint, or gray text.

## Typography

### Font Family

The system runs **one face**: **Jost**, a Futura-descended geometric sans with round bowls, sharp apexes, and a principled Euro-modernist voice. It carries display (600, lowercase), body (400), and labels (600, caps, tracked). Typographic unity is the point — the Bauhaus masters set whole posters in one family, and so does Dessau.

Never introduce a second family. Contrast comes from case (lowercase display vs caps labels), size (96px vs 15px), weight (400 vs 600), and color (black vs white vs one primary) — a full expressive range without leaving Jost.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.bauhaus-display}` | 96px | Jost | 600 | Cover / section display title, lowercase |
| `{typography.bauhaus-numeral}` | 54px | Jost | 600 | Page numeral in the footer rule |
| `{typography.bauhaus-subtitle}` | 34px | Jost | 400 | Subtitle / lede below the title |
| `{typography.bauhaus-body}` | 22px | Jost | 400 | Paragraph body, column text |
| `{typography.bauhaus-context}` | 17px | Jost | 600 | Context line in the masthead, caps |
| `{typography.bauhaus-label}` | 15px | Jost | 600 | Column labels, caps, tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display title is lowercase** (`text-transform: lowercase`), Jost 600 at 96px, line-height 1.08, pretty-wrapped (fills the measure greedily while avoiding orphaned last lines; never balanced — balancing shatters long titles into overflow). A capital letter in a display title is a system violation (Latin script; CJK runs are caseless and exempt).
- **Every label and context line is uppercase with 0.2em tracking**, Jost 600. Sentence-case labels do not exist (Latin script).
- **Every display title may carry at most one primary-color accent** (a word or short phrase in red). Two accented phrases, or accents in different primaries on one slide, break the discipline.
- **Every subtitle sets in Jost 400 at 34px, sentence case**, line-height 1.45. Never lowercase-forced, never tracked.
- **Every footer numeral sets in Jost 600 at 54px in black**, right-aligned in the 76px footer. Never in a primary, never clipped.
- **Every masthead context line sets in black caps at 17px with 0.2em tracking.** Never in a primary (contrast and hierarchy).
- **Yellow type on white is forbidden.** Yellow appears nowhere in type-only covers — it survives as a token only.

### Typography Principles

The voice contrast is **lowercase geometric display ↔ plain sentence body ↔ tracked caps labels**, all in one family. The lowercase display is the system's most recognizable move — it should feel principled (a nod to Bayer's universal alphabet), not casual. Keep display lines short (under 30 characters) so the large lowercase letterforms stack into a confident block.

Alignment is left within columns, keyed to the grid margin. The masthead context line aligns left to the grid margin; the footer numeral aligns right to the grid margin. Centered text appears nowhere — the grid is bilateral and strict.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** framed as a press sheet: a 96px masthead closed by a 4px black rule, a 76px footer opened by a 4px black rule, and a white content field between them. Content margins are 96px left and right. The title zone holds the lowercase display block; the right zone (x=1352–1772) holds the 340px giant numeral with its fig. caption. No rule ever crosses a text block.

### Persistent Chrome

Two elements persist on every slide:

- **Masthead** — 96px, full width, carrying the context line (source · date) in black tracked caps, left-aligned to the 96px margin, closed by a 4px rule. On section slides it may carry the section name instead.
- **Footer** — 76px, full width, opened by a 4px rule, carrying the page numeral in black 54px Jost 600, right-aligned to the 96px margin.

No other chrome persists. No nav dots, no progress indicators — the rules are the chrome.

## Depth and Elevation

Dessau has **no depth system**. All color is flat, all shapes are unmodulated, and overlap is resolved by hard edges, never by shadow, blur, or transparency. The `{shadows.none-declared}` token exists only to satisfy the schema honestly: this system declines the entire category.

Hierarchy is achieved through **scale, color weight, and grid position**: black rules anchor, primaries punctuate, white breathes. A headline may abut the giant numeral, but the abutment is a flat collage edge — crisp, opaque, shadowless.

Any box, drop shadow, gradient, or alpha blend is a defect in a Dessau deck. Export paths (including PPTX) reproduce the system trivially because every element is a rule or a text run.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no bars, strips, squares, or drawn shapes. The ● glyph is the only round form in the system — and it is a text character, not a drawn circle. No pill shapes, no rounded buttons, no softened corners anywhere.

### Border Weights

- **4px solid black** — the masthead rule, footer rule, and section rules. The only drawn strokes in the system.
- **▲ ● text glyphs** — 22px markers in red and blue, never drawn shapes, never edged.

Rules are horizontal only; vertical dividers, frames, outlines, and keylines are forbidden — the grid is made of type and rules, not masses.

### Decorative Element Types

**Masthead rule** — 96px black context line over a 4px rule. Structural frame, always present.

**Footer rule** — 76px black page numeral under a 4px rule. Structural frame, always present.

**Primary markers** — Red ▲ and blue ● text glyphs keying columns and lists. They are the grid made visible.

**Giant numeral** — 340px page numeral in red, blue, or black with a fig. caption. The compositional anchor.

**Section rule** — 4px black rule above a caption or below a key row. Maximum two per slide (masthead/footer excluded).

## Do's and Don'ts

### Do

- Set every display title lowercase in Jost 600 at 110px — no capital letters, ever (Latin).
- Frame every slide with the 96px masthead rule and the 76px footer rule.
- Key columns and lists with red ▲ and blue ● text markers — fixed pairs, never detached from their text.
- Anchor the right zone with the 340px giant numeral plus fig. caption.
- Use Jost for every text role — display, body, labels, numerals.
- Hold all color flat and full-strength: white, black, red, blue — no tints, no gradients, no transparency, no boxes.
- Align every element to the column grid and rule rhythm — everything has a grid address.
- Limit display accents to one red word or phrase per slide.
- Spend the red accent on the title's operative word (e.g. the verb of the finding) — never on a connector.
- Close the title zone with a grid-keyed caption row: a 4px rule plus a figure caption (`fig. NN — n = NN`) — the field below the subtitle never sits empty.
- Set chrome text in black — context caps top-left, numeral bottom-right.

### Don't

- Don't set display type with capitals, or body/labels in lowercase-forced style.
- Don't introduce a second typeface for any role.
- Don't use orange, green, purple, yellow, gray text, or tints of the primaries.
- Don't add boxes, bars, strips, shadows, gradients, blur, transparency, or textures.
- Don't swap glyph-color assignments (no blue triangles, no red circles).
- Don't round any corner — the ● is a text glyph, not a drawn circle.
- Don't float decoration without a grid address — no unaligned confetti.
- Don't omit the masthead or footer rules on any slide.
- Don't center text — the grid is bilateral; alignment is left in columns, margin-keyed in chrome.

## Responsive Behavior

Dessau is a **fixed-stage system**: the 1920×1080 press sheet scales uniformly via one transform and never reflows. Rule weights, column widths, and numeral sizes are absolute coordinates — the poster's proportions are the design.

### Scaling Behavior

- All type, rule, and numeral dimensions are fixed px values on the 1920×1080 stage.
- The stage scaler letterboxes on non-16:9 viewports; bars outside the stage are black.
- No clamp(), vw, or vh units appear in slide CSS.

### Component Breakpoints

None. The system has no breakpoints; the single transform handles all viewports.

### Presenter Behavior

- Slides advance linearly with a hard cut (0ms) — the Bauhaus register favors the decisive cut over the dissolve.
- No staged builds within a slide; columns appear whole.

### Animation Triggers

None by default. If motion is required, columns may wipe in as whole blocks (200ms linear, honoring `prefers-reduced-motion` by appearing instantly). Display type never animates.

### Print Behavior

Print at 16:9 full-bleed. The four working inks reproduce exactly; black rules should print at 100K. For economy printing, the rules may drop to 80K — document the substitution on the print proof.

## CJK & International Content

The lowercase-display rule is Latin-specific (CJK scripts are caseless), so CJK builds keep the grid, rules, primaries, and markers identical and transfer hierarchy to weight and size within a single CJK family.

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
- **Glyph-color assignments unchanged**: markers are script-independent; triangle-red and circle-blue keep their primaries.

### Aesthetic Notes for This System

Dessau's identity is carried more by rules, markers, and grid than by letterforms, so CJK transfer is robust: the rules, keyed columns, and giant numeral do the recognition work even when Jost's geometry is absent. The main loss is the lowercase-display principle — compensate by holding CJK display at the same 96px size and tight leading so its block silhouette matches the Latin lowercase block.

### Known CJK Gap

- **No geometric-constructivist CJK face exists on the CDN.** Noto Sans KR/SC are neutral grotesques, not Futura-descended geometrics — the display voice flattens from "principled modernist" to "clean sans." The grid, rules, and primaries must carry the Bauhaus signal alone.
- **The lowercase rule has no CJK expression.** Caseless scripts cannot participate in the system's most recognizable typographic move; weight and block-shape substitute imperfectly.

## Iteration Guide

1. Any new slide starts from the press-sheet frame: 96px masthead rule, 76px footer rule, white field, ▲/● keyed columns and the giant numeral anchoring the right zone.
2. Any new text element uses Jost. Display is 600 lowercase; body is 400 sentence case; labels are 600 caps tracked. No second family.
3. Any new display title carries at most one red accent word or phrase — everything else black.
4. Any new column takes its marker in red/blue order with its matching glyph (▲/●). Yellow takes no column.
5. Any new marker keeps its fixed glyph-color pair at 22px; compositional anchoring belongs to the 340px giant numeral.
6. Any new color must be white, black, red, or blue at full strength. Yellow, tints, grays, and secondaries are violations.
7. Any new emphasis uses scale, case, or a primary marker — never bold-italic, underline (except the 4px section rule), or a new color.
8. Any new element takes a grid address: column-aligned, rule-aligned, margin-aligned. Unaligned floats are forbidden.
9. Any new slide keeps all color flat and opaque — no boxes, no shadow, gradient, blur, or transparency.
10. Any new deck is reviewed against the poster test: does every slide read as rules plus type in four inks? If not, remove the offending element.

## Known Gaps

- **Fonts**: Jost (+ Noto Sans KR for Korean) via Google Fonts CDN (`display=swap`); fallbacks `Futura, "Century Gothic", "Arial Black", sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the geometric voice.
- **No chart system.** Data graphics have no native pattern in the type-only system; line charts, pies, and scatters must be set as Jost numerals and captions.
- **No table system.** Tabular data uses column text with the 4px section rule as the only divider; ruled grids are forbidden, so dense tables fit poorly.
- **No image treatment.** Photography has no defined mask or duotone rule; the system assumes typographic slides.
- **Yellow retired from covers.** Yellow survives as a token but appears in no type-only cover — it cannot hold as type or rule on white.
- **Lowercase proper nouns.** Names and trademarks forced lowercase (the doctrine) can read as errors to unfamiliar audiences — warn presenters this is intentional.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional 200ms column wipe-in | none | Static final frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows in system |
| 5 | Gradients | Not used | full | N/A — all fills flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — clean ground |
| 7 | Transparency layers | Not used | full | N/A — all fills opaque |
| 8 | Custom fonts | Jost / Noto Sans KR via CDN | partial | Embedded subset or Futura/system fallback |
| 9 | Absolute-positioned decor | Giant numeral (positioned type) | full | Native text box in place |
