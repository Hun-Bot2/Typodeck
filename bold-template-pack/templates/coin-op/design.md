---
version: alpha
name: Coin-Op
description: A green-phosphor arcade presentation system glowing on a near-black void (#060A06). Display type runs in VT323 phosphor green (#3FE673) through layered blurred halos, paired with IBM Plex Mono body copy and Silkscreen pixel-caps labels. A single amber (#F2A91E) carries the marquee line and eyebrow labels against bone (#E8E4D8) secondary text. Type and light only — phosphor glow on glyphs, zero box-shadow, zero frames, rails, panels, scanlines, or fills.

colors:
  void: "#060A06"
  void-panel: "#0B120B"
  phosphor: "#3FE673"
  phosphor-dim: "#1FA84A"
  amber: "#F2A91E"
  amber-deep: "#C78A00"
  bone: "#E8E4D8"
  bone-dim: "#9AA39A"

shadows:
  glow-display: "0 0 8px rgba(63, 230, 115, 0.75), 0 0 32px rgba(63, 230, 115, 0.38), 0 0 90px rgba(63, 230, 115, 0.22)"
  glow-display-soft: "0 0 6px rgba(63, 230, 115, 0.6), 0 0 24px rgba(63, 230, 115, 0.3)"
  glow-amber: "0 0 8px rgba(242, 169, 30, 0.7), 0 0 28px rgba(242, 169, 30, 0.3)"
  glow-bone: "0 0 6px rgba(232, 228, 216, 0.35)"
  rail-outer: "0 0 18px rgba(255, 176, 0, 0.35)"
  rail-inner: "0 0 14px rgba(51, 255, 102, 0.30)"

typography:
  crt-hero:
    fontFamily: "'VT323', monospace"
    fontSize: "clamp(72px, 8vw, 128px)"
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.01em
  display:
    fontFamily: "'VT323', monospace"
    fontSize: "clamp(54px, 5vw, 84px)"
    fontWeight: 400
    lineHeight: 1.0
  headline:
    fontFamily: "'VT323', monospace"
    fontSize: "clamp(40px, 3.5vw, 56px)"
    fontWeight: 400
    lineHeight: 1.05
  stat-number:
    fontFamily: "'VT323', monospace"
    fontSize: "clamp(64px, 6vw, 110px)"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "clamp(17px, 1.4vw, 24px)"
    fontWeight: 400
    lineHeight: 1.7
  body-small:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "clamp(14px, 1.1vw, 18px)"
    fontWeight: 400
    lineHeight: 1.7
  marquee:
    fontFamily: "'Silkscreen', monospace"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.08em
    textTransform: uppercase
  label-slot:
    fontFamily: "'Silkscreen', monospace"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.14em
    textTransform: uppercase
  label-micro:
    fontFamily: "'Silkscreen', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.18em
    textTransform: uppercase
  cursor-block:
    fontFamily: "'VT323', monospace"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1

spacing:
  pixel-unit: 8px
  pad-slide-y: "56px"
  pad-slide-x: "56px"
  frame-outer: 4px
  frame-inner: 2px
  frame-gap: 16px
  pad-cabinet: "48px 72px"
  gap-grid-md: 24px
  ticker-height: 64px
  content-max-width: 66ch
  text-well: 1400px

canvas:
  width: 100vw
  height: 100vh

components:
  cabinet-frame:
    status: retired
    successor: "stage-inset"
    description: "RETIRED in the typography-only vocabulary: the double-rail frame is removed. The stage keeps a 72px inset with centered type."
  stage-inset:
    inset: 72px
    textAlign: center
    description: "Centered type stage on the void: 72px inset, marquee line top, footer line bottom, glowing well between."
  corner-screw:
    status: retired
    description: "RETIRED in the typography-only vocabulary with the frame it pinned."
  marquee-ticker:
    color: "{colors.amber}"
    fontFamily: "'Silkscreen', monospace"
    fontSize: 20px
    glow: "{shadows.glow-amber}"
    description: "Static amber Silkscreen caps line holding the deck context, centered, glowing. No band."
  coin-slot:
    status: retired
    successor: "divider-ticks"
    description: "RETIRED in the typography-only vocabulary: slot outlines are removed. Eyebrows flank with + ticks instead."
  scanlines:
    status: retired
    description: "RETIRED in the typography-only vocabulary: the ground is solid void, unprinted."
  crt-vignette:
    status: retired
    description: "RETIRED in the typography-only vocabulary: no vignette on the void."
  cursor-block:
    glyph: ▊
    color: "{colors.phosphor}"
    glow: "{shadows.glow-display-soft}"
    description: "Phosphor ▊ text glyph blinking at 1.06s steps after the closing line; rests visible under reduced motion."
  label-slot-chip:
    color: "{colors.amber}"
    fontFamily: "'Silkscreen', monospace"
    fontSize: 17px
    letterSpacing: 0.14em
    textTransform: uppercase
    glow: "{shadows.glow-amber}"
    description: "Amber Silkscreen caps label flanked by + ticks; the universal eyebrow on the stage."
  stat-well:
    status: retired
    successor: "stat-line"
    description: "RETIRED as a bordered panel in the typography-only vocabulary. Stats set as free glowing numerals over bone labels."
  stat-line:
    fontFamily: "'VT323', monospace"
    description: "Free glowing VT323 stat numeral over a bone micro label, centered. No panel, no edge."
  divider-ticks:
    color: "{colors.phosphor-dim}"
    description: "Row of phosphor tick glyphs (+ + +) separating regions inside the text well; dim, never bright."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Coin-Op is a **green-phosphor arcade presentation system**. Its foundational premise is **light on the void**: glowing type on solid near-black, centered in a 66ch text well. Layouts feel like attract-mode screens — a static amber marquee line up top, a huge glowing VT323 headline in the well, + tick flanks on the eyebrows, and a blinking ▊ glyph waiting for input below. Everything is type and glow; there is no hardware.

The type stack is three mono-flavored faces with strict roles. **VT323** is the display face — a tall, narrow terminal face with authentic CRT rhythm that carries heroes, headlines, and stat numerals in glowing phosphor. **IBM Plex Mono** is the body face — a highly legible mono for subtitles, paragraphs, and captions in bone. **Silkscreen** is the label face — a true pixel face for the marquee line, eyebrow labels, and micro chrome in amber. The voice contrast is **glowing terminal display ↔ calm mono body ↔ pixel caps chrome**.

The palette is nocturnal and narrow: **void ground** (`{colors.void}`), **phosphor green** (`{colors.phosphor}`) for display glow, **amber** (`{colors.amber}`) for marquee and eyebrow energy, and **bone** (`{colors.bone}`) for readable secondary text. Phosphor never carries body copy at small sizes — its glow blooms — and amber never carries paragraphs; bone owns everything meant to be read quietly.

Depth is the system's signature trick: **soft blurred glow on glyphs only**. Display headlines bloom through a triple-layer blurred halo (8px / 32px / 90px) via text-shadow; light radiates from the type itself. There are no box-shadows, no hard offset shadows, no scanlines, no vignette anywhere — glow is light, never geometry, and this system only exists after dark.

**Density philosophy: medium, centered, patient.** The stage holds one display moment + a small constellation (marquee line, eyebrow, divider ticks, cursor), all centered in the well with generous leading. A typical slide carries the marquee + headline + subtitle + eyebrow + cursor — never sidebars, never panels.

**Key Characteristics:**
- Phosphor glow display — VT323 headlines in #3FE673 with triple-layer blurred halos (8px / 32px / 90px) via text-shadow, never box-shadow, never hard shadows.
- Centered type stage — 72px inset on the void centering a 66ch text well.
- Marquee context line — static amber Silkscreen caps holding the deck context, centered, glowing.
- Plus-tick divider language — `+ + +` rows and `+` eyebrow flanks in phosphor-dim.
- Blinking ▊ cursor glyph — phosphor text glyph at 1.06s steps closing every slide.
- Three mono voices — VT323 (display), IBM Plex Mono (body), Silkscreen (pixel labels); never substituted, never crossed.
- Centered attract-mode rhythm — every region centers in the well; left-aligned prose does not exist here.

## Colors

### Palette

- **Void** (`{colors.void}` — `#060A06`): The near-black ground with a green bias; solid, unprinted.
- **Void Panel** (`{colors.void-panel}` — `#0B120B`): Retained token; panel fills retired — type sits on the void.
- **Phosphor** (`{colors.phosphor}` — `#3FE673`): The display glow — headlines, stat numerals, cursor glyph, tick accents.
- **Phosphor Dim** (`{colors.phosphor-dim}` — `#1FA84A`): Secondary chrome — divider ticks, eyebrow flanks, footer micro text.
- **Amber** (`{colors.amber}` — `#F2A91E`): The marquee energy — marquee line, eyebrow labels.
- **Amber Deep** (`{colors.amber-deep}` — `#C78A00`): Amber's dim companion for small caps on dark where full amber would bloom.
- **Bone** (`{colors.bone}` — `#E8E4D8`): Readable secondary text — subtitles, body copy, captions on the void.
- **Bone Dim** (`{colors.bone-dim}` — `#9AA39A`): Tertiary text — hints, counters, de-emphasized lines.

### Defaults

- **Default surface background**: `{colors.void}`, solid and unprinted.
- **Default headline color**: `{colors.phosphor}` in VT323 with the `{shadows.glow-display}` halo.
- **Default body text color**: `{colors.bone}` in IBM Plex Mono 400; tertiary lines in `{colors.bone-dim}`.
- **Default label color**: `{colors.amber}` in Silkscreen caps with the `{shadows.glow-amber}` halo.
- **Default marquee treatment**: `{components.marquee-ticker}` — static centered amber Silkscreen caps with glow.
- **Default stat numeral color**: `{colors.phosphor}` with `{shadows.glow-display-soft}` in free type (`{components.stat-line}`).
- **Default stage treatment**: 72px inset with centered type (`{components.stage-inset}`).

Phosphor text below 24px blooms unreadably — small text is always bone or amber-deep, never phosphor. No fills exist anywhere.

**Color-comfort decision (2026-11-04): adjust saturation (restrain both neons, retain void).** Phosphor `#33FF66`→`#3FE673` (S 1.00→0.77, 14.84:1→12.13:1) and amber `#FFB000`→`#F2A91E` (S 1.00→0.89, 10.88:1→9.93:1): the only design pairing two fully-saturated accents with multi-layer bloom, so per P3 (accents on dark grounds need less saturation) both accents step down while staying unmistakably phosphor-green and marquee-amber. Glow color stops re-matched to the new RGB with trimmed alphas (display 0.9/0.45/0.25→0.75/0.38/0.22, amber 0.8/0.35→0.7/0.3); blur radii, offsets, and the D08 glyph-limited text-shadow-only discipline are unchanged. Void, bone, and the 13px-micro rule are untouched. Typo-only shapes unchanged — color values only.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**VT323** is the display face — a tall, narrow terminal face with uneven retro rhythm. Used for every hero title, headline, stat numeral, and the ▊ cursor glyph. VT323's condensed texture is what makes headlines feel beamed rather than printed; replacing it with a geometric or grotesque face breaks the CRT voice entirely.

**IBM Plex Mono** is the body face — a legible, even mono for subtitles, paragraphs, and captions in bone. It reads quietly next to VT323's glow without disappearing, and its tabular rhythm suits the 8px pixel grid.

**Silkscreen** is the label face — a true pixel face for the marquee line, eyebrow labels, and micro chrome. Silkscreen is caps-only in this system; its chunky pixels are the arcade voice.

Never use VT323 for body, never use IBM Plex Mono for headlines, never use Silkscreen for prose. The three-role separation is the typographic structure.

### Typography Scale

| Token | Size (clamp) | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.crt-hero}` | 72–128px | VT323 | 400 | Hero title with triple halo |
| `{typography.display}` | 54–84px | VT323 | 400 | Large section opener |
| `{typography.headline}` | 40–56px | VT323 | 400 | Primary section headline |
| `{typography.stat-number}` | 64–110px | VT323 | 400 | Free stat numeral |
| `{typography.body}` | 17–24px | IBM Plex Mono | 400 | Subtitles, paragraphs |
| `{typography.body-small}` | 14–18px | IBM Plex Mono | 400 | Captions, footnotes |
| `{typography.marquee}` | 20px | Silkscreen | 400 | Static marquee line, caps +0.08em |
| `{typography.label-slot}` | 17px | Silkscreen | 400 | Tick-flanked eyebrow, caps +0.14em |
| `{typography.label-micro}` | 13px | Silkscreen | 400 | Footer chrome, counters, caps +0.18em |
| `{typography.cursor-block}` | 30px | VT323 | 400 | Blinking ▊ cursor glyph |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every hero element glows with the triple halo.** The pattern is `0 0 8px / 0 0 32px / 0 0 90px` in phosphor at descending alpha. A VT323 hero without bloom reads as flat terminal text and breaks the CRT voice.
- **Every VT323 display element keeps line-height ≤ 1.05.** VT323 is tall and narrow — loose leading unravels its texture into disconnected scan bars.
- **Every Silkscreen element is uppercase with wide tracking** — 0.08em for the marquee, 0.14em for eyebrows, 0.18em for micro chrome. Sentence-case Silkscreen does not exist.
- **Every eyebrow is flanked by `+` ticks** on both sides with 16px gaps. A bare amber label is an untreated eyebrow.
- **Every eyebrow is a non-count label** (e.g. `CASE FILES`) — it never repeats the slide's count or subtitle numerals.
- **Every IBM Plex Mono body block uses line-height ≥ 1.7.** Mono needs air; tighter leading on the void crowds into phosphor noise.
- **Every marquee line is static** — one centered glowing frame, never scrolling, never clipped. Motion is never load-bearing.
- **Every closing line ends with the blinking ▊ cursor glyph** at 1.06s steps. The cursor is the machine waiting for input — a slide that ends cold reads as powered off.

### Typography Principles

The voice contrast is **glowing terminal display ↔ calm mono body ↔ pixel caps chrome**. VT323 should always feel **beamed** — centered, glowing, tight leading, never left-aligned. IBM Plex Mono should always feel **quiet** — centered or centered-ragged, bone, sentence case, no tracking. Silkscreen should always feel **arcade** — caps, tracked, amber, flanked by ticks or set as the marquee line.

Italic is never used — no face in this system ships a meaningful italic, and slanting a pixel face destroys its grid. Emphasis inside body copy is a phosphor-dim or amber-deep color switch, never slant or weight jumps.

## Layout

### Canvas System

The system targets `100vw × 100vh` per slide. Slides stack vertically inside a `slides-container` and translate via `transform: translateY(...)` for navigation. Only one slide occupies the viewport at a time.

The type stage insets 72px from every stage edge. The text well caps at 1400px (66ch) and centers horizontally and vertically on the stage. The marquee line sits at the stage top, centered; the footer micro line sits at the stage bottom.

### Persistent Chrome

Three type elements appear on every slide:
- **Marquee line** — the static amber context line (`{components.marquee-ticker}`) at the stage top.
- **Eyebrow** — the amber Silkscreen caps label (`{components.label-slot-chip}`) flanked by `+` ticks.
- **Footer micro line** — Silkscreen 13px in phosphor-dim at the stage bottom: page marker at left, deck owner at right, ▊ cursor glyph center.

No navigation dots, no floating hints, no progress bars — chrome is type, never overlaid UI.

### Atmospheric Overlay Stack

Coin-Op has no atmospheric overlays — no scanlines, grain, vignette, frames, or panels. The surface stack is flat by doctrine:
1. Surface background — `{colors.void}` flat.
2. Glowing type directly above, with no intervening layers.

Glow on glyphs is the system's identity. A slide rendered flat (no halo) reads dimmed, not broken.

## Depth and Elevation

### Blurred Glow (Signature)

The system uses **blurred glow on glyphs** as its only depth language. Display headlines bloom through `{shadows.glow-display}` (8px / 32px / 90px phosphor), eyebrows breathe through `{shadows.glow-amber}`, bone body carries `{shadows.glow-bone}`. Every halo is a text-shadow with blur and zero offset — light radiates from the type itself. The rail halo tokens are retained but unused (their rails are retired).

Hard offset shadows and box-shadows do not exist anywhere. A hard shadow would read as daylight geometry; this system only exists after dark.

### Free Stats

Stats (`{components.stat-line}`) set as free glowing VT323 numerals over bone micro labels, centered on the void. The numeral provides its own light; no panel, no edge, no halo behind it.

### Stage Depth

Depth comes from halo contrast between type voices: amber eyebrows glow warm and near, phosphor display glows screen-deep, bone body barely breathes. Whitespace separates the voices — darkness between lines is the only layering.

### No Atmospheric Depth

Scanlines, vignette, frames, and panels are retired. Glow on glyphs and the void ground are the complete depth system.

## Shapes and Treatment

### Border Radius

Zero everywhere, trivially — there are no rails, bands, slots, wells, or cursor blocks to round. Markers are text glyphs (▲▼ + ▊). A rounded shape anywhere breaks the arcade identity immediately.

### Border Weights

No borders exist in this system. The retired weights (4px/2px rails, 2px slot outlines, 64px marquee band) are documented for history only — separation is handled by divider ticks (`+ + +` in phosphor-dim) and whitespace.

### Decorative Element Types

**Marquee line** — Static amber Silkscreen caps context line with the amber halo, centered at the stage top.

**Eyebrow** — Amber Silkscreen caps label flanked by `+` ticks on both sides; the universal label on the stage.

**Cursor glyph** — Phosphor ▊ text glyph blinking at 1.06s steps after the closing line.

**Stat line** — Free glowing VT323 numeral over a bone micro label, centered.

**Divider ticks** — Centered `+ + +` row in phosphor-dim separating regions inside the text well.

**Valence markers** — ▲/▼ text glyphs (phosphor / amber) leading comparison rows.

## Do's and Don'ts

### Do

- Glow every headline with the triple halo; keep the void ground solid and unprinted.
- Use `{colors.phosphor}` VT323 with the triple halo for every headline and `{colors.bone}` IBM Plex Mono for every body block.
- Set the deck context once in the static amber marquee line; keep it centered and glowing.
- Flank every eyebrow with `+` ticks on both sides at 16px gaps.
- Center every region in the 66ch text well — headlines, body, labels, stats, cursor.
- Separate inner regions with dim phosphor divider ticks, never with rules or borders.
- Close the slide with the blinking phosphor ▊ glyph after the final micro line.
- Keep small text bone or amber-deep — phosphor below 24px blooms unreadably.
- Mark comparison rows with ▲/▼ text glyphs in phosphor/amber.
- Spend glow on glyphs only — zero box-shadow, zero fills, zero geometry.

### Don't

- Don't add box-shadows, hard offset shadows, or geometry of any kind. Glow here is text-shadow with blur and zero offset — daylight geometry does not exist.
- Don't substitute fonts. VT323, IBM Plex Mono, and Silkscreen are the three voices — replacing any of them collapses the CRT identity.
- Don't add frames, rails, bands, panels, slots, screws, scanlines, or vignettes. The stage holds type and light only.
- Don't place phosphor body text at small sizes or bone text where amber leads. Glow needs scale; voices never swap grounds.
- Don't use VT323 for body or Silkscreen for prose. Each face has a single role.
- Don't introduce a fifth color or a second glow hue. The light is phosphor + amber + bone on void.
- Don't left-align prose or float panels outside the well. Everything centers inside the stage.
- Don't omit the marquee line, eyebrow ticks, or cursor glyph on any slide — even dense ones. The light is non-negotiable.
- Don't use uppercase IBM Plex Mono body text. Body is sentence case; caps belong to Silkscreen.
- Don't scroll, animate, or clip the marquee. One static glowing frame, always.

## Responsive Behavior

Coin-Op is a **stage-fraction system** built around the fixed 72px stage inset and the 8px pixel unit. Display sizes interpolate via `clamp()` on viewport width while the inset and well stay fixed.

### Scaling Behavior

- Hero text scales 72px → 128px on viewport width.
- Stat numerals scale 64px → 110px.
- Body scales 17px → 24px.
- The 72px inset, marquee size, and cursor glyph are fixed — they never scale, so chrome reads finer on larger canvases by design.

### Component Breakpoints

- `max-width: 1400px` — text well narrows 1400px → 1100px; marquee shortens to context only.
- `max-width: 1024px` — footer keeps page/owner/cursor; ticks stay three.
- `max-width: 640px` — footer micro line stacks centered.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions are 300ms phosphor-fade cuts (opacity through void) — a tube switching channels, not a camera move.
- The marquee line persists across transitions; it belongs to the stage, not the slide.

### Animation Triggers

One loop runs always: the ▊ cursor glyph (1.06s blink, steps). It rests visible under `prefers-reduced-motion`. The marquee is static by doctrine. No entry animations exist; content is simply lit when the slide arrives.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; printing produces only the active slide with glow flattened to solid color. For static export, screenshots of each slide preserve the static marquee and glowing type exactly.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended Korean fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / hero / stat numerals | VT323 400 | Noto Sans KR 700 (glow carries the voice) |
| Body / subtitles / captions | IBM Plex Mono 400 | Noto Sans KR 400 |
| Pixel labels / marquee / eyebrows / micro | Silkscreen 400 (caps + tracking) | Noto Sans KR 500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin glyph coverage. Set every text element to `font-family: 'Noto Sans KR', sans-serif`. Noto Sans KR ships Latin glyphs that read cleanly alongside Hangul, so a mixed line like `Typodeck Research · 2026년 11월` renders in one consistent face. This system normally runs three faces (terminal / mono / pixel); collapsing to one CJK face is the right tradeoff because none of the three Latin faces has a credible Hangul counterpart, and hierarchy still works through weight (700 / 500 / 400) plus the glow stack and tick dividers.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–25% from the Latin spec. Body 1.9–2.0 (up from 1.7), display 1.15–1.25 (up from 1.0–1.05). CJK characters are square and visually full — they crowd vertically more than Latin, and VT323's tight 1.0 leading would fuse Hangul lines.
- **Letter-spacing**: set to 0 on every CJK run. The system's +0.08–0.18em Silkscreen tracking looks broken on square CJK glyphs.
- **Text transform**: don't apply `uppercase` to Korean text. Every Silkscreen label uses `text-transform: uppercase`; remove it for CJK runs.
- **No period on display headlines**: Korean display convention omits trailing periods on cover headlines.
- **Space between CJK and Latin**: insert an ASCII space between every Hangul run and adjacent Latin characters or digits. Write `11개 포스트모템` with the numeral set in Noto Sans KR so weights match.
- **One font per sentence**: Noto Sans KR covers both Hangul and Latin glyphs in a unified style — let it handle mixed sentences rather than font-switching mid-word.

### Aesthetic Notes for This System

The system's identity rests on terminal glow plus the tick/cursor type language — and a CJK build preserves both. Lean harder on the **typographic** signature elements: the triple phosphor halo still blooms on Noto Sans KR 700 headlines and is what carries the CRT voice when the VT323 texture is gone. Keep the marquee line, tick flanks, and blinking ▊ glyph — the light does more identity work in a CJK build than in the Latin original.

The Silkscreen eyebrow (amber caps, tracked, tick-flanked) translates poorly: Hangul won't accept the pixel grid or tracking. Render Korean eyebrows in Noto Sans KR weight 500 at 0 tracking, no transform, at 16px instead of 17px — the amber color, tick flanks, and glow carry the recognition load.

### Known CJK Gap

- **No CDN-loadable Hangul terminal face.** The CRT voice depends on VT323's tall narrow rhythm — there is no equivalent Korean face on Google Fonts that reads as phosphor-terminal while remaining legible. Noto Sans KR at weight 700 gives heft but loses the terminal texture; the glow stack must carry the voice alone.
- **No Hangul pixel face for arcade labels.** Silkscreen's chunky grid has no Korean counterpart. Eyebrows and the marquee lose their pixel character; lean on amber type, tick flanks, and glow to keep the voice recognizable.

## Iteration Guide

1. Any new slide gets the 72px stage inset on the solid void with centered type in the 66ch well.
2. Any new display element uses VT323 with the triple phosphor halo. Any new body element uses bone IBM Plex Mono at 1.7+ line-height. Any new label uses amber Silkscreen caps with tracking and tick flanks where it acts as an eyebrow.
3. Any new headline gets `{colors.phosphor}` centered in the well at line-height ≤ 1.05.
4. Any new marquee sets the deck context once as a static centered glowing line; never scrolling, never clipped.
5. Any new region inside the well separates with dim phosphor divider ticks — never rules or borders.
6. Any new stat uses a free `{components.stat-line}` with a glowing VT323 numeral over a bone micro label.
7. Any new glow is text-shadow with blur and zero offset. Box-shadows and hard shadows are removed, not tuned.
8. Small text stays bone or amber-deep; phosphor below 24px is forbidden.
9. The footer micro line (page marker left, owner right, cursor glyph center) ships on every slide.
10. New animation is limited to the cursor blink, frozen under `prefers-reduced-motion`.

## Known Gaps

- **Fonts**: VT323 / IBM Plex Mono / Silkscreen via Google Fonts CDN (`display=swap`); fallbacks `ui-monospace, monospace` for VT323 and body, `"Arial Black", sans-serif` for Silkscreen caps. Korean builds add Noto Sans KR with fallbacks `"Apple SD Gothic Neo", "Malgun Gothic", sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the terminal glow voice.
- **The marquee line is static by doctrine**: one centered glowing frame, never scrolling. Do not re-introduce a scroll loop; the attract-mode feel comes from glow, ticks, and the blinking glyph.
- **Glow halos are layered text-shadows** that flatten to solid color in print and in export pipelines without shadow support; the phosphor color remains but the bloom is lost.
- **Scanlines, vignette, frames, and panels retired (typography-only rebuild).** The ground is solid void; the old overlay-flattening export gaps are gone with them.
- **Stat numerals render at final value** with no count-up. The only motion is the cursor blink.
- **The stage inset is fixed at 72px** and does not adapt to ultra-wide stages; content wider than the 1400px well must wrap or shrink.
- **Silkscreen has no lowercase design intent in this system.** Authors who set sentence-case Silkscreen will render its blocky caps rhythm at the wrong voice — caps with tracking is the only Silkscreen treatment.

### PPTX fidelity disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Layered blurred text-shadow halos (8/32/90px) | partial | Single soft outer-glow effect on display text |
| 2 | Blend modes | Not used | full | N/A (nothing to reproduce) |
| 3 | Animation / keyframes | Static marquee; cursor 1.06s blink | partial | Static marquee as set; static visible cursor |
| 4 | Pixel / hard offset shadows | Not used — glow only, zero offset | full | N/A by doctrine (halo shadows map to row 1) |
| 5 | Gradients | Not used (vignette retired) | full | N/A |
| 6 | Grain / scanline / noise overlays | Not used (scanlines retired) | full | N/A |
| 7 | Transparency layers | Glow alpha in text-shadows | partial | Flattened halo baked into text fill |
| 8 | Custom fonts | VT323 / IBM Plex Mono / Silkscreen via CDN | partial | Embedded subsets; fallback Consolas / Courier New |
| 9 | Absolute-positioned decor | Retired — marquee, eyebrows, and cursor are plain text | full | Native text boxes |
