---
version: alpha
name: Ma
description: A Japanese zen-minimal presentation system built around ma — negative space as active material. Seventy percent of every slide stays empty warm white (#F8F6F0); a single text cluster sits left, breathing downward, in Shippori Mincho (display serif) with Zen Kaku Gothic New (body + tracked labels). Sumi black (#2B2B2B) ink, one hairline vertical rule, tiny stone margin marks, a single oversized numeral, and one shu-red (#A63D2F) hanko seal glyph. No cards, no boxes, no shadows, no gradients — a gallery wall with one object on it.

colors:
  warm-white: "#F8F6F0"
  sumi: "#2B2B2B"
  shu-red: "#A63D2F"
  stone: "#D8D2C4"

shadows:
  none-declared: "none — the system uses no shadows"

typography:
  zen-display:
    fontFamily: "'Shippori Mincho', 'Noto Serif KR', serif"
    fontSize: "92px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0.01em
  zen-subtitle:
    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans KR', sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.7
  zen-context:
    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans KR', sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.32em
    textTransform: uppercase
  zen-numeral:
    fontFamily: "'Shippori Mincho', 'Noto Serif KR', serif"
    fontSize: "200px"
    fontWeight: 600
    lineHeight: 1
  zen-seal:
    fontFamily: "'Shippori Mincho', serif"
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.4
  zen-body:
    fontFamily: "'Zen Kaku Gothic New', 'Noto Sans KR', sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.9

spacing:
  void-ratio: "0.7"
  cluster-x: "400px"
  cluster-top: "190px"
  rule-x: "300px"
  rule-width: "2px"
  margin-mark: "14px"
  seal-glyph-size: "44px"
  gap-title-sub: "32px"
  gap-sub-context: "56px"
  content-max-width: "1100px"

canvas:
  width: 1920px
  height: 1080px

components:
  vertical-rule:
    position: "absolute; left: 300px; top: 0; bottom: 0"
    width: 2px
    background: "{colors.sumi}"
    opacity: 0.85
    description: "The single structural line on the slide — full-height 2px sumi rule offset from the left edge. The text cluster never crosses it."
  margin-mark:
    size: 14px
    color: "{colors.stone}"
    description: "Tiny plus-shaped registration marks near the four slide corners, like printer crop marks. Pure craft signal, 1px strokes."
  oversized-numeral:
    fontFamily: "'Shippori Mincho', serif"
    fontSize: 200px
    color: "{colors.stone}"
    description: "One display-scale numeral (01) in stone gray, absolutely positioned to pass behind the title's opening lines (stone behind sumi, zero flow cost). Counts without shouting; never in sumi or red."
  seal-mark:
    size: 44px
    color: "{colors.shu-red}"
    fontFamily: "'Shippori Mincho', serif"
    description: "Single kanji glyph set directly in shu-red Mincho, no square behind it. The only saturated moment on the slide; exactly one per slide."
  context-line:
    fontFamily: "'Zen Kaku Gothic New', sans-serif"
    letterSpacing: 0.32em
    textTransform: uppercase
    color: "{colors.sumi}"
    description: "Widely tracked micro-label line above the title carrying source and date. Never larger than 16px."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and cluster drift.

## Overview

Ma is a **Japanese zen-minimal presentation system** whose entire identity is restraint. The governing concept is *ma* (間) — the charged emptiness between things. Roughly seventy percent of every 1920×1080 canvas stays untouched warm white; a single text cluster anchors left and breathes downward; four whisper-quiet ornaments (one vertical rule, corner margin marks, one oversized numeral, one red seal glyph) complete the slide. Nothing else exists. There are no cards, no icon sets, no chart chrome beyond hairlines, no shadows, no gradients, no textures. If an element does not earn its place in the silence, it is removed.

The type pairing is the classic Japanese editorial combination: **Shippori Mincho** (a contemporary Mincho serif with crisp horizontal strokes and sharp triangular stops) for display, against **Zen Kaku Gothic New** (a clean, even Gothic sans) for body prose and widely tracked micro-labels. The roles never reverse — Gothic never sets the headline, Mincho never sets small labels. Weight range stays narrow (400–600); emphasis comes from size, tracking, and position, never from bold shouting.

The palette is four colors: warm white ground, sumi ink, stone gray for ghost elements, and one shu-red accent used exactly once per slide as the hanko seal glyph. Red anywhere else — a rule, a word, a second mark — breaks the system's economy of attention.

**Density philosophy: minimum, defended.** Every addition to a Ma slide must justify displacing emptiness. A typical slide carries one display title, one short supporting line, one micro-label, and the four ornaments. Supporting content (a second paragraph, a small list) is permitted only when it joins the single cluster — never as a second cluster, never as a side panel. Two clusters on one slide is not a Ma slide.

**Key Characteristics:**
- Seventy-percent emptiness — one text cluster anchored lower-left, nothing competing anywhere else.
- Single 2px vertical sumi rule running full slide height, the only structural line.
- One oversized stone-gray numeral at display scale, passing behind the title's opening lines.
- One shu-red hanko seal glyph — the single saturated moment per slide.
- Tiny stone-gray margin registration marks at the corners, like printer crop marks.
- Mincho display against Gothic tracked micro-labels — the classic Japanese editorial pairing, never reversed.
- Absolutely no shadows, gradients, cards, or textures — flat ink on warm paper.
- Emphasis through size, tracking, and position only — never through bold, color, or underline.

## Colors

### Palette

- **Warm White** (`{colors.warm-white}` — `#F8F6F0`): The ground. A paper white with a faint warm cast, like uncoated washi stock. Every slide surface, no exceptions.
- **Sumi** (`{colors.sumi}` — `#2B2B2B`): The ink. A soft near-black with warmth — never pure `#000`. All text, the vertical rule, hairlines.
- **Shu Red** (`{colors.shu-red}` — `#A63D2F`): A deep vermilion red reserved exclusively for the single hanko seal glyph. One use per slide, 44px Mincho, never as a rule, never repeated, never behind a square.
- **Stone** (`{colors.stone}` — `#D8D2C4`): A warm pale gray for ghost elements only — the oversized numeral and the margin marks. Never for body text (contrast too low), never for rules that must read.

### Defaults

- **Default surface background**: `{colors.warm-white}` flat. No grid, no texture, no vignette.
- **Default headline color**: `{colors.sumi}`.
- **Default body text color**: `{colors.sumi}` at full opacity — small Gothic text needs full ink on this ground.
- **Default micro-label color**: `{colors.sumi}` at full opacity, tracked 0.32em, uppercase (Latin only).
- **Default ghost numeral color**: `{colors.stone}`.
- **Default accent**: exactly one `{colors.shu-red}` seal glyph per slide.

When a slide needs a second point of visual interest, the answer is never a second red element — it is repositioning the numeral or the seal, or widening the void around the cluster.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Shippori Mincho** is the display face — a contemporary Mincho serif with strong horizontal/vertical contrast, crisp hairline horizontals, and sharp weighted verticals. Used for the title, the oversized numeral, and the seal glyph. Its quiet formality is the system's voice; replacing it with a Latin Didone or a brush script breaks the zen register entirely.

**Zen Kaku Gothic New** is the text face — a neutral, even-proportioned Gothic sans with generous apertures. Used for subtitles, body paragraphs, and the tracked micro-label line. It reads cleanly at 15–30px and deliberately disappears next to the Mincho display.

Never use Mincho for labels or body, never use Gothic for the display title. The serif-display / sans-text separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.zen-display}` | 92px | Shippori Mincho | 600 | Cover / section display title |
| `{typography.zen-numeral}` | 200px | Shippori Mincho | 600 | Oversized ghost numeral |
| `{typography.zen-subtitle}` | 30px | Zen Kaku Gothic New | 400 | Subtitle / lede below the title |
| `{typography.zen-body}` | 21px | Zen Kaku Gothic New | 400 | Paragraph body |
| `{typography.zen-context}` | 15px | Zen Kaku Gothic New | 500 | Tracked micro-label line |
| `{typography.zen-seal}` | 44px | Shippori Mincho | 600 | Single seal glyph in shu-red |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display title sets in Mincho 600 at 92px with line-height 1.25 and `text-wrap: pretty`.** No italic, no letterspacing beyond +0.01em, no color but sumi. Pretty-wrapping fills the measure on long titles instead of balancing into overflow.
- **Every micro-label line is uppercase with 0.32em tracking at 15px.** Sentence-case or tight-tracked labels do not exist in this system (Latin runs only; CJK runs drop both).
- **Every oversized numeral sets in Mincho 600 at 200px in stone gray.** A numeral in sumi or red, or in the Gothic face, breaks the ghost treatment.
- **Every seal is exactly one 44px shu-red Mincho glyph on the bare ground.** No square, no border, no shadow, no second seal.
- **Every subtitle sets in Gothic 400 at 30px with line-height 1.7.** Never serif, never tracked, never uppercase.
- **Every body block uses line-height 1.9.** The face runs compact; generous leading keeps the airy register.
- **No underline, no bold emphasis, no italic emphasis anywhere.** Emphasis is positional: what matters is larger, or stands more alone.

### Typography Principles

The voice contrast is **formal Mincho display ↔ invisible Gothic text ↔ whispered tracked labels**. The display speaks once, clearly; everything else recedes. Line-length stays short (under 40 Latin characters per line in the cluster) because the cluster occupies a narrow left column — long lines would march into the void and destroy the asymmetry.

Alignment is left, always, keyed to the cluster's single left edge. Centered text does not exist in this system — centering would imply symmetry the layout explicitly refuses.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. Content lives in a single cluster anchored left: cluster left edge at x=400px, cluster top at y=190px, flowing downward. The right two-thirds of the canvas and the top third stay empty. Maximum text measure is 1100px so long titles wrap within the left zone rather than colonizing the void.

The vertical rule stands at x=300px, full height, 2px wide — 100px left of the cluster edge, a quiet fence between margin and message. The oversized numeral passes behind the title's opening lines (stone behind sumi, non-interactive, zero flow cost so long titles keep their full measure). The seal stamps near the cluster's end — after the context line or at the cluster's lower edge.

### Persistent Chrome

Ma carries **no persistent chrome**: no nav dots, no slide counter, no progress bar, no footer. The void must stay unbroken across the deck. Slide identity comes from the ghost numeral, which increments per slide (01, 02, 03 …) and is part of the composition, not chrome.

If a deck context demands page numbers for print, the ghost numeral serves that purpose — never add a separate footer counter.

## Depth and Elevation

Ma has **no depth system**. There are no shadows, no blur, no layering, no elevation tokens. All elements sit on one plane of warm paper. The ghost numeral may pass *behind* the title text (stone behind sumi) but this is overlap, not elevation — no shadow, no blur, no transparency tricks beyond the flat stone color itself.

The `{shadows.none-declared}` token exists only to satisfy the schema honestly: this system declines the entire category. Any drop shadow, however subtle, is a defect in a Ma deck.

Spatial hierarchy is achieved exclusively through **scale, tone, and emptiness**: the title is largest and darkest, the subtitle smaller, the context smallest and most tracked, the numeral largest but palest. Distance is implied by paleness, not by blur.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes: rules are straight lines, margin marks are straight ticks, the seal is a bare glyph. A rounded corner anywhere reads as foreign matter in this system.

### Border Weights

- **2px solid sumi** — the vertical rule. The only 2px element.
- **1px solid stone** — margin marks (two 14px ticks forming a plus).
- **1px solid sumi at 40% opacity** — the optional hairline between subtitle and context, used only when the cluster carries all three lines.

No other strokes exist. Boxes, outlines, frames, and filled squares are forbidden — the seal has no edge but its own letterform.

### Decorative Element Types

**Vertical rule** — Full-height 2px sumi line at x=300px. The slide's only structural stroke. It never moves, never shortens, never takes another color.

**Margin mark** — 14px plus-shaped registration mark in 1px stone strokes, placed near each of the four slide corners (48px insets). Evokes printer crop marks and tea-ceremony precision. Pure craft signal.

**Oversized numeral** — One two-digit numeral in 200px Mincho 600, stone gray, floating at the cluster's shoulder. Increments per slide. Never interactive, never in ink or red.

**Seal mark** — Single 44px shu-red Mincho glyph (e.g. 研 for research, 序 for opening, 結 for closing) on the bare ground. Stamped once per slide near the cluster. The system's only saturated color; there are no filled shapes.

**Context hairline** — An optional 64px 1px sumi hairline (40% opacity) sitting between subtitle and context line. The only horizontal stroke permitted. Omitted when the cluster is short.

## Do's and Don'ts

### Do

- Keep seventy percent of the canvas empty on every slide; defend the void against every addition.
- Set every display title in Mincho 600 sumi at 96px, left-aligned to the cluster edge.
- Track every Latin micro-label at 0.32em uppercase, 15px, Gothic 500.
- Stamp exactly one shu-red seal glyph per slide near the cluster.
- Pass one stone-gray oversized numeral behind the title's opening lines, incrementing per slide.
- Hold the vertical rule at x=300px, full height, 2px, sumi — on every slide.
- Place margin marks near all four corners on every slide.
- Use line-height 1.9 for Gothic body and 1.7 for subtitles — air is the register.
- Let long titles wrap inside the 1100px cluster measure; never shrink type to fit one line.
- Keep all color flat and matte — paper, ink, stone ghost, one red stamp.

### Don't

- Don't add a second text cluster, side panel, card, or callout box anywhere.
- Don't use any shadow, blur, gradient, texture, or transparency effect.
- Don't set display type in the Gothic face or labels in the Mincho face.
- Don't use shu-red for anything but the single seal glyph — never for other text, rules, or numerals, and never behind a square.
- Don't center text, rules, or the cluster — the asymmetry is the composition.
- Don't round any corner or draw any box, frame, or outline.
- Don't add persistent chrome: no nav dots, counters, progress bars, or footers.
- Don't use bold, italic, underline, or color for emphasis — emphasis is positional.
- Don't place body text in stone gray — ghost tone is for the numeral and marks only.
- Don't fill the top-right void with decoration, no matter how empty it feels.

## Responsive Behavior

Ma is a **fixed-stage system**: the 1920×1080 composition scales uniformly via one transform and never reflows. The void ratio, rule position, and cluster anchor are absolute coordinates, not fluid proportions — reflowing would destroy the deliberate asymmetry.

### Scaling Behavior

- All type, rule, seal, and mark dimensions are fixed px values on the 1920×1080 stage.
- The stage scaler letterboxes on non-16:9 viewports; bars are black and outside the composition.
- No clamp(), vw, or vh units appear in slide CSS — the composition is a fixed print-like plate.

### Component Breakpoints

None. The system has no breakpoints; the single transform handles all viewports.

### Presenter Behavior

- Slides advance linearly; no builds or staged reveals — the cluster appears whole.
- No animated transitions beyond a simple 300ms fade, honoring `prefers-reduced-motion` (fade becomes a cut).

### Animation Triggers

None by default. Ma slides are still. If motion is required, a single slow fade-in of the cluster (600ms ease-out) is the only permitted entrance; the ornaments are always present, never animated in.

### Print Behavior

Print at 16:9 full-bleed or fit-to-page. All colors are flat and print-safe; the warm-white ground should print (do not strip backgrounds). Stone-gray elements remain visible on white office paper but paler — acceptable, as they are ghost elements.

## CJK & International Content

Ma's Latin-adjacent faces are already Japanese faces, so CJK builds stay close to home. Japanese content needs no substitution; Korean and Chinese content swap to sibling faces with matching roles.

### Recommended Korean Pairing

| Role | Default | Korean counterpart |
|---|---|---|
| Display / numeral / seal-adjacent | Shippori Mincho 600 | Noto Serif KR 600 |
| Body / subtitle / labels | Zen Kaku Gothic New 400–500 | Noto Sans KR 400–500 |

### Recommended Chinese Pairing

| Role | Default | Chinese counterpart |
|---|---|---|
| Display / numeral | Shippori Mincho 600 | Noto Serif SC 600 |
| Body / subtitle / labels | Zen Kaku Gothic New 400–500 | Noto Sans SC 400–500 |

### Mixed-Content Strategy

**Strategy A** — role-matched CJK families with built-in Latin coverage. Set display runs to `'Shippori Mincho', 'Noto Serif KR', serif` and text runs to `'Zen Kaku Gothic New', 'Noto Sans KR', sans-serif` so mixed sentences like `Typodeck Research · 2026년 11월` resolve CJK glyphs from the Noto KR faces while Latin stays in the Japanese faces. The two Mincho/Gothic voices are visually close enough across languages that the role contrast survives.

### Loading

Add to the `<head>` alongside the default faces:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500&family=Noto+Serif+KR:wght@600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15–20%. Display 1.35–1.45 (up from 1.25), subtitle 1.8–1.9, body 2.0–2.1. CJK glyphs are square and full; the zen register wants even more air.
- **Letter-spacing**: 0 on every CJK run. The 0.32em label tracking and +0.01em display tracking apply to Latin runs only.
- **Text transform**: never apply `uppercase` to CJK text. Context lines mixing Latin and CJK keep the transform (it only affects Latin) but drop tracking to 0.2em for mixed runs.
- **Punctuation**: use full-width CJK punctuation (、。：「」（）·). The middle dot in context lines stays full-width spaced.
- **No trailing 。 on display headlines**: convention omits sentence-final punctuation at display scale.
- **Space between CJK and Latin**: keep one ASCII space (or the CJK space) between scripts: `11개 포스트모템` keeps its internal spacing; `Typodeck Research · 2026년 11월` spaces around ·.
- **Seal glyph**: the hanko kanji (研/序/結) reads correctly in Japanese, Korean (hanja), and Chinese — no substitution needed.

### Aesthetic Notes for This System

Ma's identity survives CJK transfer better than most systems because its voice is structural (void, rule, cluster, seal) rather than typographic-contrast dependent. The Mincho/Gothic role contrast maps cleanly onto Serif/Sans KR pairs. The main risk is the tracked micro-label: CJK labels at 0 tracking lose their whisper quality, so compensate by holding them at 15px with slightly lighter opacity (85%) to keep them receding.

### Known CJK Gap

- **Shippori Mincho has no Korean coverage.** Korean display runs fall to Noto Serif KR, whose skeleton is a Korean serif rather than a Japanese Mincho — close in spirit, different in detail (fewer triangular stops, different horizontal emphasis). Acceptable: the role contrast carries the identity.
- **Zen Kaku Gothic New has no Korean coverage.** Same fallback story via Noto Sans KR; the Gothic voice is generic enough that the swap is nearly invisible.

## Iteration Guide

1. Any new slide starts from the empty warm-white plate: rule at x=300, four margin marks, then exactly one cluster and one numeral and one seal. Add nothing else without removing something.
2. Any new display element uses Shippori Mincho 600 sumi. Any new text element uses Zen Kaku Gothic New. Never cross the roles.
3. Any new cluster anchors to the same left edge (x=400) and top anchor (y=190); the void stays right and below.
4. Any new micro-label uses 15px Gothic 500, 0.32em tracking, uppercase (Latin) — the whisper line.
5. Any new numeral continues the 01/02/03 sequence in 200px Mincho stone, passing behind the title's opening lines at zero flow cost.
6. Any new seal is one 44px shu-red Mincho glyph on the bare ground, placed near the cluster's end — exactly one per slide.
7. Any new divider is the 64px 1px sumi hairline at 40% — the only horizontal stroke. When in doubt, omit it.
8. Any new color must be one of the four palette colors. A fifth color is a system violation.
9. Any new emphasis is positional (larger, lonelier) — never bold, italic, underline, or color.
10. Any new slide is reviewed by asking: what can be removed? If nothing, it may still be too much.

## Known Gaps

- **Fonts**: Shippori Mincho / Zen Kaku Gothic New (+ Noto Serif KR / Noto Sans KR for Korean) via Google Fonts CDN (`display=swap`); fallbacks `"Hiragino Mincho ProN", serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the Mincho/Gothic voice.
- **No chart system.** Ma declines data graphics beyond hairline rules and numerals; a deck needing bar/line charts must borrow restraint-compatible hairline charts or choose another system.
- **No table system.** Tabular data has no native pattern; single-column lists with hairline separators are the maximum density permitted.
- **No image treatment.** Photography and illustration have no defined frame, mask, or duotone rule — the system assumes typographic slides. If imagery is unavoidable, place it full-bleed right of x=1200 and keep the cluster intact (undocumented extension).
- **Ghost numeral legibility on projectors.** Stone `#D8D2C4` on warm white is deliberately faint; on washed-out projectors it may vanish. Acceptable (it is decorative), but do not darken it — darkening promotes it to content.
- **The 70% void can read as unfinished** to audiences expecting dense slides. This is the system's thesis, not a bug — but presenters should be warned.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional 300ms fade / 600ms cluster fade-in | none | Static final frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows in system |
| 5 | Gradients | Not used | full | N/A — all fills flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — clean ground |
| 7 | Transparency layers | Hairline at 40% opacity; context CJK at 85% | partial | Nearest opaque tint of sumi |
| 8 | Custom fonts | Shippori Mincho / Zen Kaku Gothic New / Noto KR via CDN | partial | Embedded subset or Hiragino/system fallback |
| 9 | Absolute-positioned decor | Rule, marks, numeral, seal glyph (type + one rule) | full | Native text boxes + one line |
