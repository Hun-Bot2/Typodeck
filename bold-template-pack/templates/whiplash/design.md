---
version: alpha
name: Whiplash
description: An art-nouveau organic presentation system setting content inside arched, bronze-ruled compositions on warm parchment (#F3EDE0). Marcellus (classical inscriptional serif) carries display and tracked caps labels over EB Garamond body prose; deep green (#2F3E33) is the ink, bronze (#8C6A3C) draws every flourish, rose (#B76E79) warms accents and the inner arch line. Tall arch frames, fleuron (❦) dividers, ornamental drop caps, and italic swash accents — curves replace every straight modernist edge.

colors:
  parchment: "#F3EDE0"
  deep-green: "#2F3E33"
  bronze: "#8C6A3C"
  rose: "#B76E79"

shadows:
  none-declared: "none — depth comes from the rose inner-arch echo, not shadows"

typography:
  nouveau-display:
    fontFamily: "'Marcellus', 'Noto Serif KR', serif"
    fontSize: "84px"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: 0.01em
  nouveau-subtitle:
    fontFamily: "'EB Garamond', 'Noto Serif KR', serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.6
    fontStyle: italic
  nouveau-context:
    fontFamily: "'Marcellus', 'Noto Sans KR', serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.2em
    textTransform: uppercase
  nouveau-body:
    fontFamily: "'EB Garamond', 'Noto Serif KR', serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.75
  nouveau-dropcap:
    fontFamily: "'Marcellus', 'Noto Serif KR', serif"
    fontSize: "96px"
    fontWeight: 400
    lineHeight: 0.85
  nouveau-fleuron:
    fontFamily: "'EB Garamond', serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1

spacing:
  arch-width: "1240px"
  arch-top: "90px"
  arch-bottom: "90px"
  arch-radius: "440px"
  rule-outer: "2px"
  rule-inner: "1px"
  arch-inset: "18px"
  fleuron-gap: "28px"
  gap-title-div: "32px"
  gap-div-sub: "28px"
  gap-sub-context: "36px"
  content-max-width: "940px"

canvas:
  width: 1920px
  height: 1080px

components:
  arch-frame:
    width: 1240px
    border: "2px solid {colors.bronze}"
    borderRadius: "440px 440px 0 0"
    description: "Tall centered arch in 2px bronze enclosing the headline composition. Flat base at the bottom, generous 440px crown. The system's signature shape."
  arch-inner-line:
    border: "1px solid {colors.rose}"
    inset: 18px
    description: "Rose 1px arch echoing the bronze frame 18px inside — the warm shadow of the frame. Always paired, never alone."
  fleuron-divider:
    glyph: "❦"
    color: "{colors.bronze}"
    fontSize: 36px
    description: "Centered bronze fleuron between title and subtitle, flanked by 120px 1px bronze hairlines with 28px gaps. The title-slide separator."
  drop-cap:
    fontFamily: "'Marcellus', serif"
    fontSize: 96px
    color: "{colors.deep-green}"
    description: "Ornamental initial opening the subtitle via first-letter styling (markup stays contiguous). Latin initials only; CJK subtitles omit it."
  swash-accent:
    fontFamily: "'EB Garamond', serif"
    fontStyle: italic
    color: "{colors.rose}"
    description: "Rose italic phrase inside body or subtitle lines lifting one key phrase per slide. Maximum one per slide."
  tendril:
    color: "{colors.bronze}"
    description: "Small curved flourish (CSS border-arc) tucked just inside the arch base corners. Botanical punctuation, never structural."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS, treat that as source history only, not as the target generation model for `frontend-slides`.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Whiplash is an **art-nouveau organic presentation system** named for the whiplash curve — the long, botanical, asymmetric line that defines the style. Every slide composes inside curves: the headline sits within a tall bronze arch on warm parchment, a rose inner line echoes the arch like a warm shadow, fleuron dividers separate title from subtitle, and small tendril flourishes punctuate the frame's base. Straight modernist edges (bars, boxes, sharp grids) do not exist here; even rules arrive as hairlines with curved terminals or flanking glyphs.

The type pairing is classical: **Marcellus** (an inscriptional serif with quiet Trajan-like flare, single weight) for display titles, drop caps, and tracked caps labels, over **EB Garamond** (a warm humanist Garamond) for subtitles, body prose, and italic swash accents. Marcellus speaks in stone-cut capitals-at-heart even in mixed case; Garamond answers in bookish warmth. The two never trade jobs — Garamond never sets display, Marcellus never sets paragraphs.

The palette is four heirloom tones: parchment ground, deep-green ink, bronze for every drawn line and glyph, rose for warmth (inner arch, one swash accent per slide). Color is always flat and matte, like letterpress ink on cotton paper. No gradients, no shadows, no glow — depth comes from the arch/echo pairing and from scale.

**Density philosophy: low-medium, unfurling.** A typical slide carries one arched headline composition: display title, fleuron divider, subtitle with drop cap, and a tracked context line. Supporting content joins as short Garamond lines inside the arch — never as side panels or card grids, which would break the single-curved-composition contract. The parchment margin around the arch is generous and stays empty.

**Key Characteristics:**
- Tall arch frame in double hairline (2px bronze outer, 1px rose inner echo) enclosing the headline.
- Fleuron divider (❦) in bronze between title and subtitle, flanked by hairline flourishes.
- Ornamental drop cap opening the subtitle — Marcellus at display scale in deep green.
- Italic swash accents in rose EB Garamond italic lifting one key phrase per slide.
- Marcellus inscriptional display over Garamond prose — classical voice, never geometric.
- Four heirloom tones, flat and matte: parchment, deep green, bronze, rose.
- Curves everywhere — arches, tendrils, fleuron terminals; no straight-edged boxes or bars.
- Centered arched composition with generous empty parchment margins.

## Colors

### Palette

- **Parchment** (`{colors.parchment}` — `#F3EDE0`): The ground. Warm aged-paper tone, flat — texture is implied by color, never rendered as noise or fiber.
- **Deep Green** (`{colors.deep-green}` — `#2F3E33`): The ink. A dark botanical green-black. All display, body, and label text, plus the drop cap.
- **Bronze** (`{colors.bronze}` — `#8C6A3C`): The drawing metal. Arch frame, fleuron and divider hairlines, tendrils, label rules. Every drawn line is bronze.
- **Rose** (`{colors.rose}` — `#B76E79`): The warmth. Inner arch echo line and the single swash accent per slide. Never for rules that must read as structure, never for body text.

### Defaults

- **Default surface background**: `{colors.parchment}` flat.
- **Default headline color**: `{colors.deep-green}`.
- **Default body/subtitle color**: `{colors.deep-green}` at full opacity.
- **Default label color**: `{colors.deep-green}`, tracked 0.2em, uppercase (Latin).
- **Default drawn-line color**: `{colors.bronze}` — arch, divider hairlines, tendrils.
- **Default accent**: `{colors.rose}` inner arch echo + at most one swash phrase per slide.

When a slide needs more emphasis, enlarge the display or lengthen the arch — never add a second swash accent, a second arch, or a fifth color.

## Typography

### Font Family

The system runs two classical faces, each locked to its role.

**Marcellus** is the display face — an inscriptional serif with flared Roman capitals and a calm, monumental rhythm. Used for display titles, the subtitle drop cap, and tracked caps labels. It ships in a single weight (400), which is the system's discipline: display hierarchy comes from size and the arch, never from weight.

**EB Garamond** is the text face — a warm, readable Garamond with a true italic used for subtitles and swash accents. Used for subtitles, body paragraphs, and the fleuron glyph (❦ renders in Garamond's ornament cut). Its old-style figures and soft italics are the system's lyrical register.

Never use Garamond for display, never use Marcellus for paragraphs. Marcellus at text sizes turns stony; Garamond at display sizes turns bookish — the roles protect each face.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.nouveau-display}` | 84px | Marcellus | 400 | Arched display title |
| `{typography.nouveau-dropcap}` | 96px | Marcellus | 400 | Subtitle ornamental initial |
| `{typography.nouveau-subtitle}` | 32px | EB Garamond | 400 italic | Subtitle below the fleuron |
| `{typography.nouveau-body}` | 23px | EB Garamond | 400 | Paragraph body |
| `{typography.nouveau-context}` | 16px | Marcellus | 400 | Tracked context line |
| `{typography.nouveau-fleuron}` | 36px | EB Garamond | 400 | ❦ divider glyph |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display title sets in Marcellus 400 at 84px**, centered, line-height 1.18, deep green. No bold (the face has none), no italic, no letterspacing beyond +0.01em.
- **Every subtitle opens with a Marcellus 96px deep-green drop cap** via first-letter styling; the subtitle paragraph itself is Garamond italic 32px. (Latin initials only; CJK subtitles render without the cap.)
- **Every title/subtitle pair is separated by the fleuron divider** — bronze ❦ at 36px centered, flanked by 120px 1px bronze hairlines with 28px gaps.
- **Every context line is Marcellus caps at 16px with 0.2em tracking**, centered, deep green (Latin; CJK runs drop case and tracking).
- **At most one swash accent per slide**: a single short phrase in Garamond italic set in rose. Two rose phrases on one slide break the accent economy.
- **Every display title lives inside the arch frame.** Display type outside the arch does not exist.
- **No underline, no bold, no all-caps display.** Emphasis is the arch, the cap, and the single swash.

### Typography Principles

The voice contrast is **inscriptional Marcellus display ↔ lyrical Garamond prose ↔ tracked Marcellus labels**. The register is cultivated and unhurried: generous leading (1.6–1.75 on prose), centered measure capped at 940px, short lines that let the arch breathe. Display lines should break into two or three balanced lines — a single long display line strains the arch's shoulders.

Alignment is centered throughout, on the arch's vertical axis. Left or right alignment appears nowhere — symmetry is the composition's calm center (ornament may be lightly asymmetric, but text never is).

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** with a centered arch composition: the bronze arch spans 1240px wide, centered (x=340 to x=1580), running from y=90 to y=990 with a generous crown (440px radius) and a flat base. The rose inner echo insets 18px inside. Text measure caps at 940px centered on the arch axis (x=960), starting at y=225 clear of the crown curve. The display title crowns the upper third inside the arch, the fleuron divider follows, then the subtitle with drop cap, then the context line near the base. Parchment margins (340px each side) stay empty except the tendrils at the arch base.

### Persistent Chrome

Whiplash carries **no persistent chrome**: no bars, dots, counters, or footers. The arch is the frame, and it belongs to the composition, not the chrome. Slide sequence may be marked by a small bronze fleuron-count (❦❦ for slide 2) tucked at the arch base — at most a whisper, never a footer strip.

If a deck context demands formal pagination, a single Marcellus numeral in bronze may sit centered beneath the arch base — never a bar, never a boxed counter.

## Depth and Elevation

Whiplash has **no shadow or blur system**. Depth is implied the engraver's way: the rose inner arch echoes the bronze outer arch, creating a two-line relief that reads as an incised plate. The `{shadows.none-declared}` token exists only to satisfy the schema honestly: this system declines shadows entirely.

Layering is minimal and flat: text sits on parchment inside the arch; the fleuron overlaps nothing; tendrils tuck behind the arch base line. Any drop shadow, glow, gradient, or transparency effect is a defect in a Whiplash deck.

Hierarchy comes from **scale, the arch, and warmth**: the title is largest and crowned by the arch's curve, the fleuron marks the threshold, the subtitle's drop cap opens the reading, rose warms exactly one moment.

## Shapes and Treatment

### Border Radius

The arch crown is the system's governing curve: a generous 440px radius on the 1240px arch — deep enough to read as an arch, shallow enough that full-measure titles clear its shoulders. Tendrils use quarter-circle arcs. No other radii exist — in particular, no rounded rectangles, pills, or softened boxes. Rectangular frames of any kind are forbidden; if a boundary is needed, it must be an arch or a hairline with fleuron terminals.

### Border Weights

- **2px solid bronze** — the outer arch frame. The system's primary stroke.
- **1px solid rose** — the inner arch echo, inset 18px. Always paired with the outer arch.
- **1px solid bronze** — fleuron divider hairlines (120px each side) and tendril arcs.
- **1px solid bronze at 60%** — the optional context rule above the context line (160px, centered).

No other strokes exist. Black rules, gray keylines, and boxed borders are forbidden.

### Decorative Element Types

**Arch frame** — 1240px centered arch, 2px bronze, semicircular crown, flat base. Encloses the headline composition on every slide. Never omitted, never squared.

**Arch inner echo** — 1px rose arch 18px inside the bronze frame. The warm shadow of the frame; always paired, never alone.

**Fleuron divider** — Bronze ❦ at 36px centered between title and subtitle, flanked by 120px 1px bronze hairlines with 28px gaps. The title-slide threshold.

**Drop cap** — Marcellus 96px deep-green initial opening the subtitle via first-letter styling. Markup stays contiguous; Latin initials only.

**Swash accent** — One short phrase per slide in Garamond italic, rose. Lifts a key phrase; never a whole sentence, never twice.

**Tendril** — Small quarter-arc bronze flourish (CSS border-arc) tucked just inside each arch base corner, curling inward. Botanical punctuation; mirrored pair.

**Context rule** — Optional 160px 1px bronze hairline at 60% centered above the context line. Used when the context needs separation from a long subtitle.

## Do's and Don'ts

### Do

- Enclose every headline composition in the bronze arch with its rose inner echo.
- Set every display title in Marcellus 400 at 92px, centered, deep green.
- Separate title and subtitle with the fleuron divider — ❦ plus flanking hairlines.
- Open every Latin subtitle with the Marcellus 96px drop cap.
- Set subtitles in Garamond italic 32px and body in Garamond roman 23px.
- Track every Latin context line at 0.2em Marcellus caps, centered.
- Limit rose prose to one swash phrase per slide.
- Keep parchment margins empty except the base tendrils.
- Center all text on the arch axis (x=960).
- Hold all color flat and matte — letterpress ink on cotton paper.

### Don't

- Don't draw straight-edged boxes, bars, panels, or modernist grids.
- Don't set display type in Garamond or paragraphs in Marcellus.
- Don't use bold, underline, or all-caps display — Marcellus has one weight and the arch carries hierarchy.
- Don't place display type outside the arch frame.
- Don't add shadows, gradients, glow, blur, or transparency effects.
- Don't use black or gray for rules — every drawn line is bronze (or the rose echo).
- Don't repeat the swash accent or the fleuron more than specified — one swash, one divider.
- Don't left- or right-align text — the composition is centered on the arch axis.
- Don't add persistent chrome bars, dots, or footers.
- Don't introduce a fifth color or a third typeface.

## Responsive Behavior

Whiplash is a **fixed-stage system**: the 1920×1080 arched plate scales uniformly via one transform and never reflows. Arch geometry, measure, and ornament positions are absolute coordinates — reflowing would break the arch's semicircular crown.

### Scaling Behavior

- All type, arch, and ornament dimensions are fixed px values on the 1920×1080 stage.
- The stage scaler letterboxes on non-16:9 viewports; bars are black and outside the composition.
- No clamp(), vw, or vh units appear in slide CSS.

### Component Breakpoints

None. The system has no breakpoints; the single transform handles all viewports.

### Presenter Behavior

- Slides advance linearly with a slow 500ms cross-fade, honoring `prefers-reduced-motion` (fade becomes a cut).
- No staged builds; the arched composition appears whole.

### Animation Triggers

None by default. If motion is required, the fleuron may fade in once (400ms ease-out) after the title — the only permitted staged entrance, and it honors `prefers-reduced-motion`.

### Print Behavior

Print at 16:9 full-bleed or fit-to-page on cream stock when possible. All four inks are flat and print-safe; bronze and rose hold on uncoated paper. Do not strip the parchment ground — the arch composition assumes it.

## CJK & International Content

The inscriptional/lyrical contrast maps onto CJK serif pairs; the arch, fleuron, and tendrils are script-independent and stay identical. The drop cap is Latin-only.

### Recommended Korean Pairing

| Role | Default | Korean counterpart |
|---|---|---|
| Display / drop cap / labels | Marcellus 400 | Noto Serif KR 600 |
| Subtitle / body / swash | EB Garamond 400 + italic | Noto Serif KR 400 |

Korean builds run both roles in Noto Serif KR at different weights (600 display, 400 text) since no Korean inscriptional face exists on the CDN. Labels use Noto Sans KR 500 tracked only when the slide mixes Latin labels with Korean text; otherwise Serif KR throughout.

### Recommended Chinese Pairing

| Role | Default | Chinese counterpart |
|---|---|---|
| Display / labels | Marcellus 400 | Noto Serif SC 600 |
| Subtitle / body | EB Garamond 400 + italic | Noto Serif SC 400 |

### Mixed-Content Strategy

**Strategy A** — role-matched CJK serif stacks: display/labels `'Marcellus', 'Noto Serif KR', serif`, text `'EB Garamond', 'Noto Serif KR', serif`. Mixed sentences like `11개 포스트모템이 가르쳐준 리뷰 원칙` resolve CJK glyphs from Noto Serif KR while any Latin keeps the classical voice. The fleuron ❦ stays in EB Garamond (its ornament cut covers the glyph).

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500&family=Noto+Serif+KR:wght@400;600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15%. Display 1.3–1.35 (up from 1.18), subtitle 1.7–1.8, body 1.85–1.95. CJK density needs air to keep the lyrical register.
- **Letter-spacing**: 0 on every CJK run. The 0.2em label tracking and +0.01em display tracking apply to Latin runs only.
- **Text transform**: never apply `uppercase` to CJK text. Mixed context lines keep the transform with tracking reduced to 0.14em.
- **Drop cap**: omitted for CJK subtitles — a 96px CJK initial breaks the line rhythm rather than ornamenting it. Set the slide `lang` attribute (`ko`/`zh`/`ja`); the `:lang` rules in `preview.html` self-neutralize the cap. The fleuron divider carries the ornament load alone.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: convention omits sentence-final punctuation at display scale.
- **Space between CJK and Latin**: one ASCII space between scripts: `Typodeck Research · 2026년 11월`.
- **Swash accent**: CJK swash phrases render in rose without italic (CJK has no italic); weight steps to 600 to hold the accent.

### Aesthetic Notes for This System

Whiplash's identity transfers well because the arch composition does most of the recognition work regardless of script. The main losses are the inscriptional display voice (Noto Serif KR 600 is a book serif, not a Roman inscriptional) and the drop cap. Compensate by holding display at full 84px size and letting the arch crown sit closer to the title (reduce crown clearance by ~20px) so the composition keeps its monumental feel.

### Known CJK Gap

- **No inscriptional CJK face exists on the CDN.** Marcellus's stone-cut Roman character has no Korean or Chinese counterpart — Noto Serif KR/SC substitute book-serif neutrality. The arch and ornament must carry the classical signal.
- **No CJK italic.** The lyrical Garamond-italic subtitle voice collapses to upright CJK; rose color + 600 weight substitute for the swash accent only.

## Iteration Guide

1. Any new slide starts from the arched plate: parchment ground, bronze arch + rose echo centered, tendrils at the base.
2. Any new display element uses Marcellus centered inside the arch. Any new text element uses Garamond. Never cross the roles.
3. Any new title/subtitle pair takes the fleuron divider between them — ❦ plus flanking hairlines, centered on the axis.
4. Any new Latin subtitle opens with the Marcellus 96px drop cap via first-letter styling; CJK subtitles omit it.
5. Any new context line is Marcellus caps 16px tracked 0.2em, centered near the arch base, with the optional context rule above.
6. Any new slide carries at most one rose swash phrase — a few words, Garamond italic, never a sentence.
7. Any new drawn line is bronze (or the rose echo) — 2px arch, 1px hairlines. Black or gray rules are violations.
8. Any new element aligns to the arch axis (x=960). Asymmetric placement is forbidden for text; tendrils mirror.
9. Any new color must be one of the four heirloom tones, flat and matte. No fifth color, no gradient, no shadow.
10. Any new deck is reviewed against the engraving test: would this plate print in four flat inks on cotton paper? If not, remove the offending effect.

## Known Gaps

- **Fonts**: Marcellus / EB Garamond (+ Noto Serif KR / Noto Sans KR for Korean) via Google Fonts CDN (`display=swap`); fallbacks `Didot, "Bodoni MT", serif` / `Garamond, "Adobe Garamond", serif`. No font files committed. Offline rendering falls back to system serifs and loses the inscriptional voice.
- **No chart system.** Data graphics have no native pattern; the arch composition resists axes and bars. Decks needing charts should choose another system.
- **No table system.** Tabular data has no ruled-grid pattern (ruled grids are forbidden); short definition lists with fleuron bullets are the maximum structure permitted.
- **No image treatment.** Photography and illustration have no arch-mask specification beyond the headline arch itself; arched image masks (arch-shaped picture windows) are a plausible but undocumented extension.
- **Marcellus ships one weight (400).** Display hierarchy cannot use weight contrast; oversized sizes and the arch must do all the work. Do not faux-bold Marcellus.
- **Fleuron glyph coverage.** ❦ (U+2766) renders from EB Garamond's ornament cut; if it fails, fallback serif fleurons vary in drawing. Verify the divider glyph in screenshots on the target machine.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional 500ms cross-fade / fleuron fade-in | none | Static final frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows in system |
| 5 | Gradients | Not used | full | N/A — all fills flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — clean ground |
| 7 | Transparency layers | Context rule at 60% opacity | partial | Nearest opaque bronze tint |
| 8 | Custom fonts | Marcellus / EB Garamond / Noto KR via CDN | partial | Embedded subset or Didot/Garamond fallback |
| 9 | Absolute-positioned decor | Arch, echo, divider, tendrils (absolute divs) | full | Grouped native shapes |
