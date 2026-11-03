---
version: alpha
name: Coin-Op
description: A green-phosphor arcade presentation system built around a centered cabinet frame on a near-black void (#060A06). Display type runs in VT323 glowing phosphor green (#33FF66) through layered blurred halos, paired with IBM Plex Mono body copy and Silkscreen pixel-caps labels. A single amber (#FFB000) carries the cabinet rails, marquee ticker, and coin-slot rules against bone (#E8E4D8) secondary text. Depth comes only from soft glow — blurred halos, scanlines, vignette — never hard offset shadows.

colors:
  void: "#060A06"
  void-panel: "#0B120B"
  phosphor: "#33FF66"
  phosphor-dim: "#1FA84A"
  amber: "#FFB000"
  amber-deep: "#C78A00"
  bone: "#E8E4D8"
  bone-dim: "#9AA39A"

shadows:
  glow-display: "0 0 8px rgba(51, 255, 102, 0.9), 0 0 32px rgba(51, 255, 102, 0.45), 0 0 90px rgba(51, 255, 102, 0.25)"
  glow-display-soft: "0 0 6px rgba(51, 255, 102, 0.7), 0 0 24px rgba(51, 255, 102, 0.35)"
  glow-amber: "0 0 8px rgba(255, 176, 0, 0.8), 0 0 28px rgba(255, 176, 0, 0.35)"
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
    borderOuter: "4px solid {colors.amber}"
    borderInner: "2px solid {colors.phosphor}"
    inset: 56px
    description: "Centered double-rail cabinet frame: 4px amber outer rail with soft amber halo, 2px phosphor inner rail 16px inside with phosphor halo."
  corner-screw:
    width: 12px
    height: 12px
    background: "{colors.amber}"
    description: "Small solid amber square seated on each outer-rail corner, glowing with the amber halo."
  marquee-ticker:
    background: "{colors.amber}"
    color: "{colors.void}"
    height: 64px
    fontFamily: "'Silkscreen', monospace"
    fontSize: 20px
    description: "Amber band across the cabinet top scrolling the deck context endlessly; void Silkscreen caps on amber."
  coin-slot:
    width: 10px
    height: 44px
    border: "2px solid {colors.amber}"
    borderRadius: 6px
    description: "Vertical amber slot glyph; runs of three per cabinet rail form the system's divider language."
  scanlines:
    background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.28) 3px, rgba(0, 0, 0, 0.28) 4px)"
    description: "Horizontal CRT scanline overlay across the whole stage at low alpha; always present."
  crt-vignette:
    background: "radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.55) 100%)"
    description: "Radial vignette darkening stage corners to mimic a curved tube; always present on the void."
  cursor-block:
    width: 18px
    height: 30px
    background: "{colors.phosphor}"
    description: "Solid phosphor block cursor blinking at 1.06s steps after the closing line; pauses under reduced motion."
  label-slot-chip:
    color: "{colors.amber}"
    fontFamily: "'Silkscreen', monospace"
    fontSize: 17px
    letterSpacing: 0.14em
    textTransform: uppercase
    description: "Amber Silkscreen caps label flanked by coin-slot glyphs; the universal eyebrow inside the cabinet."
  stat-well:
    border: "2px solid {colors.phosphor-dim}"
    background: "{colors.void-panel}"
    padding: "28px 32px"
    description: "Recessed phosphor-edged panel holding a glowing stat numeral over a bone micro label."
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

Coin-Op is a **green-phosphor arcade presentation system**. Its foundational premise is the **cabinet**: one centered double-rail frame on a near-black void, holding a glowing screen with a 66ch text well. Layouts feel like attract-mode screens — a scrolling amber marquee up top, a huge glowing VT323 headline in the well, coin-slot rules down the rails, and a blinking block cursor waiting for input below. Everything sits inside the cabinet; nothing escapes the rails.

The type stack is three mono-flavored faces with strict roles. **VT323** is the display face — a tall, narrow terminal face with authentic CRT rhythm that carries heroes, headlines, and stat numerals in glowing phosphor. **IBM Plex Mono** is the body face — a highly legible mono for subtitles, paragraphs, and captions in bone. **Silkscreen** is the label face — a true pixel face for the marquee ticker, slot labels, and micro chrome in amber. The voice contrast is **glowing terminal display ↔ calm mono body ↔ pixel caps chrome**.

The palette is nocturnal and narrow: **void ground** (`{colors.void}`), **phosphor green** (`{colors.phosphor}`) for display glow, **amber** (`{colors.amber}`) for cabinet rails and marquee energy, and **bone** (`{colors.bone}`) for readable secondary text. Phosphor never carries body copy at small sizes — its glow blooms — and amber never carries paragraphs; bone owns everything meant to be read quietly.

Depth is the system's signature trick: **soft blurred glow only**. Display headlines bloom through a triple-layer blurred halo (8px / 32px / 90px), rails breathe with halo box-shadows, and the scanline + vignette stack curves the void like a tube. There are no hard offset shadows anywhere — a hard shadow would read as daylight, and this system only exists after dark.

**Density philosophy: medium, centered, patient.** The cabinet holds one display moment + a small constellation (ticker, slot label, divider ticks, cursor), all centered in the well with generous leading. A typical slide carries the marquee + headline + subtitle + slot label + cursor — never sidebars, never floating cards outside the rails.

**Key Characteristics:**
- Phosphor glow display — VT323 headlines in #33FF66 with triple-layer blurred halos (8px / 32px / 90px), never hard shadows.
- Arcade-cabinet frame — 4px amber outer rail plus 2px phosphor inner rail with corner screws, centering a 66ch text well.
- Marquee context ticker — amber band scrolling the deck context endlessly across the top of the cabinet.
- Coin-slot rules — vertical amber slot glyphs running down both cabinet rails as the system's divider language.
- Scanline + vignette CRT stack — a repeating horizontal scanline overlay and radial vignette on every surface, plus a blinking block cursor.
- Three mono voices — VT323 (display), IBM Plex Mono (body), Silkscreen (pixel labels); never substituted, never crossed.
- Centered attract-mode rhythm — every region centers in the well; left-aligned prose does not exist here.

## Colors

### Palette

- **Void** (`{colors.void}` — `#060A06`): The near-black ground with a green bias; the room the cabinet hums in.
- **Void Panel** (`{colors.void-panel}` — `#0B120B`): Recessed panel fill for stat wells and inset regions — one step up from the void.
- **Phosphor** (`{colors.phosphor}` — `#33FF66`): The display glow — headlines, stat numerals, inner rail, cursor, tick accents.
- **Phosphor Dim** (`{colors.phosphor-dim}` — `#1FA84A`): Edges and secondary chrome — stat-well borders, divider ticks, footer micro text.
- **Amber** (`{colors.amber}` — `#FFB000`): The cabinet energy — outer rails, corner screws, marquee band, slot labels, coin slots.
- **Amber Deep** (`{colors.amber-deep}` — `#C78A00`): Amber's dim companion for small caps on dark where full amber would bloom.
- **Bone** (`{colors.bone}` — `#E8E4D8`): Readable secondary text — subtitles, body copy, captions on the void.
- **Bone Dim** (`{colors.bone-dim}` — `#9AA39A`): Tertiary text — hints, counters, de-emphasized lines.

### Defaults

- **Default surface background**: `{colors.void}` with the scanline + vignette stack (`{components.scanlines}`, `{components.crt-vignette}`).
- **Default headline color**: `{colors.phosphor}` in VT323 with the `{shadows.glow-display}` halo.
- **Default body text color**: `{colors.bone}` in IBM Plex Mono 400; tertiary lines in `{colors.bone-dim}`.
- **Default label color**: `{colors.amber}` in Silkscreen caps with the `{shadows.glow-amber}` halo.
- **Default marquee treatment**: `{components.marquee-ticker}` — void Silkscreen caps on the amber band, scrolling.
- **Default stat numeral color**: `{colors.phosphor}` with `{shadows.glow-display-soft}` inside `{components.stat-well}`.
- **Default rail treatment**: amber outer + phosphor inner (`{components.cabinet-frame}`) with halo shadows.

Phosphor text below 24px blooms unreadably — small text is always bone or amber-deep, never phosphor. Amber fills carry void text, never bone.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**VT323** is the display face — a tall, narrow terminal face with uneven retro rhythm. Used for every hero title, headline, stat numeral, and the block cursor. VT323's condensed texture is what makes headlines feel beamed rather than printed; replacing it with a geometric or grotesque face breaks the CRT voice entirely.

**IBM Plex Mono** is the body face — a legible, even mono for subtitles, paragraphs, and captions in bone. It reads quietly next to VT323's glow without disappearing, and its tabular rhythm suits the 8px pixel grid.

**Silkscreen** is the label face — a true pixel face for the marquee ticker, slot labels, and micro chrome. Silkscreen is caps-only in this system; its chunky pixels are the cabinet's hardware voice.

Never use VT323 for body, never use IBM Plex Mono for headlines, never use Silkscreen for prose. The three-role separation is the typographic structure.

### Typography Scale

| Token | Size (clamp) | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.crt-hero}` | 72–128px | VT323 | 400 | Cabinet hero title with triple halo |
| `{typography.display}` | 54–84px | VT323 | 400 | Large section opener |
| `{typography.headline}` | 40–56px | VT323 | 400 | Primary section headline |
| `{typography.stat-number}` | 64–110px | VT323 | 400 | Stat numeral in wells |
| `{typography.body}` | 17–24px | IBM Plex Mono | 400 | Subtitles, paragraphs |
| `{typography.body-small}` | 14–18px | IBM Plex Mono | 400 | Captions, footnotes |
| `{typography.marquee}` | 20px | Silkscreen | 400 | Scrolling ticker text, caps +0.08em |
| `{typography.label-slot}` | 17px | Silkscreen | 400 | Slot-flanked eyebrow, caps +0.14em |
| `{typography.label-micro}` | 13px | Silkscreen | 400 | Footer chrome, counters, caps +0.18em |
| `{typography.cursor-block}` | 30px | VT323 | 400 | Blinking block cursor glyph |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every hero element glows with the triple halo.** The pattern is `0 0 8px / 0 0 32px / 0 0 90px` in phosphor at descending alpha. A VT323 hero without bloom reads as flat terminal text and breaks the CRT voice.
- **Every VT323 display element keeps line-height ≤ 1.05.** VT323 is tall and narrow — loose leading unravels its texture into disconnected scan bars.
- **Every Silkscreen element is uppercase with wide tracking** — 0.08em for the marquee, 0.14em for slot labels, 0.18em for micro chrome. Sentence-case Silkscreen does not exist.
- **Every slot label is flanked by coin-slot glyphs** on both sides with 16px gaps. A bare amber label without slots is an untreated eyebrow.
- **Every IBM Plex Mono body block uses line-height ≥ 1.7.** Mono needs air; tighter leading on the void crowds into phosphor noise.
- **Every marquee ticker scrolls endlessly** at one fixed speed (28s loop), pausing under `prefers-reduced-motion` with the context readable in its first frame.
- **Every closing line ends with the blinking block cursor** at 1.06s steps. The cursor is the cabinet waiting for input — a slide that ends cold reads as powered off.

### Typography Principles

The voice contrast is **glowing terminal display ↔ calm mono body ↔ pixel caps chrome**. VT323 should always feel **beamed** — centered, glowing, tight leading, never left-aligned. IBM Plex Mono should always feel **quiet** — centered or centered-ragged, bone, sentence case, no tracking. Silkscreen should always feel **hardware** — caps, tracked, amber, flanked by slots or seated in the marquee.

Italic is never used — no face in this system ships a meaningful italic, and slanting a pixel face destroys its grid. Emphasis inside body copy is a phosphor-dim or amber-deep color switch, never slant or weight jumps.

## Layout

### Canvas System

The system targets `100vw × 100vh` per slide. Slides stack vertically inside a `slides-container` and translate via `transform: translateY(...)` for navigation. Only one slide occupies the viewport at a time.

The cabinet frame insets 56px from every stage edge. The inner rail sits 16px inside the outer rail, and cabinet padding is `48px 72px` within the inner rail. The text well caps at 1400px (66ch) and centers horizontally and vertically in the cabinet. The marquee ticker docks to the cabinet top at 64px height, full inner width.

### Persistent Chrome

Three elements appear on every slide:
- **Marquee ticker** — the scrolling amber context band (`{components.marquee-ticker}`) docked to the cabinet top.
- **Coin-slot rails** — three slot glyphs per side (`{components.coin-slot}`) running down the cabinet's left and right rails.
- **Footer micro line** — Silkscreen 13px in phosphor-dim at the cabinet bottom: page marker at left, deck owner at right, block cursor center.

No navigation dots, no floating hints, no progress bars — chrome is cabinet hardware, never overlaid UI.

### Atmospheric Overlay Stack

Every slide carries (in z-order):
1. Surface background — `{colors.void}` flat.
2. Cabinet frame, marquee, and content at z-index 10.
3. Scanlines (`{components.scanlines}`) across the whole stage at z-index 49.
4. CRT vignette (`{components.crt-vignette}`) at z-index 50.

This glow + scanline + vignette stack is the system's identity. A slide rendered without it looks like a wireframe taped to a wall.

## Depth and Elevation

### Blurred Glow (Signature)

The system uses **blurred glow** as its only depth language. Display headlines bloom through `{shadows.glow-display}` (8px / 32px / 90px phosphor), slot labels breathe through `{shadows.glow-amber}`, and the cabinet rails float on `{shadows.rail-outer}` and `{shadows.rail-inner}` halo shadows. Every shadow in the system has blur and zero offset — light radiates, nothing drops.

Hard offset shadows do not exist anywhere. A hard shadow would read as daylight geometry; this system only exists after dark.

### Recessed Panels

Stat wells (`{components.stat-well}`) recess into the void: `{colors.void-panel}` fill with a 2px phosphor-dim edge and no halo of their own — the glowing numeral inside provides the light. Panels never lift, never cast, never tilt.

### Frame Depth

The double-rail frame creates depth through halo contrast: the amber outer rail glows warm and near, the phosphor inner rail glows cool and screen-deep. Corner screws pin the outer rail with small amber blooms. The 16px gap between rails is void, not trim — darkness separates the layers.

### Atmospheric Depth

The scanline overlay and radial vignette provide ambient tube depth without requiring glow on individual elements. The marquee ticker's steady scroll adds temporal depth behind the static well. None of these are decorative add-ons — they are core to the depth perception of the system.

## Shapes and Treatment

### Border Radius

Near zero, with exactly two exceptions: coin-slot glyphs use 6px rounding (slots are milled, not cut), and the stat-well keeps square corners. The cabinet rails, marquee band, cursor block, and panels are all perfectly square. Rounded cards or pill badges break the cabinet-hardware identity immediately.

### Border Weights

- **4px solid amber** — cabinet outer rail, the heaviest line in the system.
- **2px solid phosphor** — cabinet inner rail and stat-well edges (dim variant for wells).
- **2px solid amber** — coin-slot glyph outlines on the rails.
- **64px amber band** — the marquee ticker; weight carried by fill, not border.

Borders are always solid and always glowing. Dashed or dotted rules do not exist here — separation is handled by divider ticks (`+ + +` in phosphor-dim) instead.

### Decorative Element Types

**Cabinet frame** — Double-rail frame (4px amber outer, 2px phosphor inner, 16px void gap) with halo shadows. The system's most distinctive non-typographic mark.

**Corner screw** — 12px solid amber square on each outer-rail corner with the amber halo; pins the frame like hardware.

**Marquee ticker** — Amber band scrolling the deck context endlessly in void Silkscreen caps; docks to the cabinet top.

**Coin slot** — 10×44 vertical slot glyph with 2px amber outline and 6px rounding; runs of three per rail form the divider language.

**Slot label** — Amber Silkscreen caps eyebrow flanked by coin slots on both sides; the universal label inside the cabinet.

**Scanlines** — Repeating 4px horizontal overlay (3px transparent, 1px black at 28%) across the whole stage.

**CRT vignette** — Radial darkening to 55% black at the corners, mimicking a curved tube.

**Block cursor** — 18×30 solid phosphor block blinking at 1.06s steps after the closing line.

**Stat well** — Recessed void-panel with phosphor-dim edge holding a glowing VT323 numeral over a bone micro label.

**Divider ticks** — Centered `+ + +` row in phosphor-dim separating regions inside the text well.

## Do's and Don'ts

### Do

- Apply the scanline + vignette stack to every slide. The tube atmosphere is the design system; surfaces without it look like wireframes.
- Use `{colors.phosphor}` VT323 with the triple halo for every headline and `{colors.bone}` IBM Plex Mono for every body block.
- Scroll the deck context endlessly in the amber marquee at one fixed speed; keep the first frame readable under reduced motion.
- Flank every slot label with coin-slot glyphs on both sides at 16px gaps.
- Center every region in the 66ch text well — headlines, body, labels, stats, cursor.
- Run three coin slots down each cabinet rail as the divider language.
- Close the slide with the blinking phosphor block cursor after the final micro line.
- Keep small text bone or amber-deep — phosphor below 24px blooms unreadably.
- Pin amber corner screws on all four outer-rail corners of the cabinet frame.
- Separate inner regions with dim phosphor divider ticks, never with rules or borders.

### Don't

- Don't add hard offset shadows, either box or text. Every shadow here blurs with zero offset — daylight geometry does not exist.
- Don't substitute fonts. VT323, IBM Plex Mono, and Silkscreen are the three voices — replacing any of them collapses the CRT identity.
- Don't round rails, bands, panels, or the cursor. Only coin slots carry 6px rounding.
- Don't place phosphor body text at small sizes or bone text on the amber marquee. Glow needs scale; amber needs void text.
- Don't use VT323 for body or Silkscreen for prose. Each face has a single role.
- Don't introduce a fifth color or a second glow hue. The light is phosphor + amber + bone on void.
- Don't left-align prose or float cards outside the cabinet rails. Everything centers inside the frame.
- Don't omit the scanlines, vignette, marquee, or cursor on any slide — even dense ones. The hardware is non-negotiable.
- Don't use uppercase IBM Plex Mono body text. Body is sentence case; caps belong to Silkscreen.
- Don't scroll the marquee at varying speeds or reverse its direction. One loop, one speed, leftward.

## Responsive Behavior

Coin-Op is a **cabinet-fraction system** built around the fixed 56px frame inset and the 8px pixel unit. Display sizes interpolate via `clamp()` on viewport width while the rails, slots, ticker height, and scanline pitch stay fixed.

### Scaling Behavior

- Hero text scales 72px → 128px on viewport width.
- Stat numerals scale 64px → 110px.
- Body scales 17px → 24px.
- The 4px/2px rails, 10×44 slots, 64px ticker, 4px scanline pitch, and 12px screws are fixed — they never scale, so hardware reads finer on larger canvases by design.

### Component Breakpoints

- `max-width: 1400px` — text well narrows 1400px → 1100px; ticker text shortens to context only.
- `max-width: 1024px` — rails drop to single amber rail; slots reduce to two per side.
- `max-width: 640px` — marquee height drops 64px → 48px; footer micro line stacks centered.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions are 300ms phosphor-fade cuts (opacity through void) — a tube switching channels, not a camera move.
- The marquee keeps scrolling across transitions; it belongs to the cabinet, not the slide.

### Animation Triggers

Two loops run always: the marquee ticker (28s linear scroll, infinite) and the block cursor (1.06s blink, steps). Both freeze under `prefers-reduced-motion` — the ticker rests on its first readable frame, the cursor rests visible. No entry animations exist; content is simply lit when the slide arrives.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; printing produces only the active slide with glow flattened to solid color. For static export, screenshots of each slide preserve scanlines and vignette (both CSS-rendered) but freeze the ticker mid-scroll.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended Korean fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / hero / stat numerals | VT323 400 | Noto Sans KR 700 (glow carries the voice) |
| Body / subtitles / captions | IBM Plex Mono 400 | Noto Sans KR 400 |
| Pixel labels / marquee / slot labels / micro | Silkscreen 400 (caps + tracking) | Noto Sans KR 500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin glyph coverage. Set every text element to `font-family: 'Noto Sans KR', sans-serif`. Noto Sans KR ships Latin glyphs that read cleanly alongside Hangul, so a mixed line like `Typodeck Research · 2026년 11월` renders in one consistent face. This system normally runs three faces (terminal / mono / pixel); collapsing to one CJK face is the right tradeoff because none of the three Latin faces has a credible Hangul counterpart, and hierarchy still works through weight (700 / 500 / 400) plus the glow stack and cabinet hardware.

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

The system's identity rests on terminal glow plus cabinet hardware — and a CJK build preserves both. Lean harder on the **non-typographic** signature elements: the triple phosphor halo still blooms on Noto Sans KR 700 headlines and is what carries the CRT voice when the VT323 texture is gone. Keep the marquee ticker, coin slots, scanlines, vignette, and blinking cursor — the hardware does more identity work in a CJK build than in the Latin original.

The Silkscreen slot label (amber caps, tracked, slot-flanked) translates poorly: Hangul won't accept the pixel grid or tracking. Render Korean slot labels in Noto Sans KR weight 500 at 0 tracking, no transform, at 16px instead of 17px — the amber color, slot flanks, and glow carry the recognition load.

### Known CJK Gap

- **No CDN-loadable Hangul terminal face.** The CRT voice depends on VT323's tall narrow rhythm — there is no equivalent Korean face on Google Fonts that reads as phosphor-terminal while remaining legible. Noto Sans KR at weight 700 gives heft but loses the terminal texture; the glow stack must carry the voice alone.
- **No Hangul pixel face for hardware labels.** Silkscreen's chunky grid has no Korean counterpart. Slot labels and the marquee lose their pixel character; lean on amber fills, slot flanks, and the frame to keep hardware recognizable.

## Iteration Guide

1. Any new slide gets the full cabinet frame (amber outer + phosphor inner rails, corner screws, three slots per side) with the scanline + vignette stack over the void.
2. Any new display element uses VT323 with the triple phosphor halo. Any new body element uses bone IBM Plex Mono at 1.7+ line-height. Any new label uses amber Silkscreen caps with tracking and slot flanks where it acts as an eyebrow.
3. Any new headline gets `{colors.phosphor}` centered in the well at line-height ≤ 1.05.
4. Any new marquee scrolls the deck context endlessly at the fixed 28s loop; first frame stays readable under reduced motion.
5. Any new region inside the well separates with dim phosphor divider ticks — never rules or borders.
6. Any new stat uses a recessed `{components.stat-well}` with a glowing VT323 numeral over a bone micro label.
7. Any new glow blurs with zero offset. Hard shadows are removed, not tuned.
8. Small text stays bone or amber-deep; phosphor below 24px is forbidden.
9. The footer micro line (page marker left, owner right, cursor center) ships on every slide.
10. New animation is limited to marquee scroll and cursor blink, both frozen under `prefers-reduced-motion`.

## Known Gaps

- **Fonts**: VT323 / IBM Plex Mono / Silkscreen via Google Fonts CDN (`display=swap`); fallbacks `ui-monospace, monospace` for VT323 and body, `"Arial Black", sans-serif` for Silkscreen caps. Korean builds add Noto Sans KR with fallbacks `"Apple SD Gothic Neo", "Malgun Gothic", sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the terminal glow voice.
- **The marquee ticker is CSS-animated** with a fixed 28s linear loop and duplicated content for seamless wrap. Ticker text longer than twice the well width needs its duplication count adjusted in markup.
- **Glow halos are layered text-shadows** that flatten to solid color in print and in export pipelines without shadow support; the phosphor color remains but the bloom is lost.
- **Scanlines and vignette are CSS-rendered overlays** at z-index 49–50. Export pipelines that strip positioned overlays lose the tube atmosphere and must flatten them into the background image.
- **Stat numerals render at final value** with no count-up. The only JS-free motion is the marquee and cursor loops.
- **The cabinet frame inset is fixed at 56px** and does not adapt to ultra-wide stages; content wider than the 1400px well must wrap or shrink.
- **Silkscreen has no lowercase design intent in this system.** Authors who set sentence-case Silkscreen will render its blocky caps rhythm at the wrong voice — caps with tracking is the only Silkscreen treatment.

### PPTX fidelity disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Layered blurred text-shadow halos (8/32/90px) | partial | Single soft outer-glow effect on display text |
| 2 | Blend modes | Not used | full | N/A (nothing to reproduce) |
| 3 | Animation / keyframes | Marquee 28s scroll loop; cursor 1.06s blink | none | Static marquee first frame; static visible cursor |
| 4 | Pixel / hard offset shadows | Not used — glow only, zero offset | full | N/A by doctrine (halo shadows map to row 1) |
| 5 | Gradients | Radial vignette over void | partial | Flattened vignette baked into background image |
| 6 | Grain / scanline / noise overlays | Repeating-gradient scanlines at z-49 | partial | Flattened scanlines baked into background image |
| 7 | Transparency layers | Scanline alpha + vignette alpha | partial | Pre-composited flat background layer |
| 8 | Custom fonts | VT323 / IBM Plex Mono / Silkscreen via CDN | partial | Embedded subsets; fallback Consolas / Courier New |
| 9 | Absolute-positioned decor | Rails, slots, screws, ticker as divs | full | Grouped native rectangles |
