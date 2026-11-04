---
version: alpha
name: Whiplash
description: An art-nouveau organic presentation system setting a top-anchored left-aligned column on warm parchment (#F3EDE0). Marcellus (classical inscriptional serif) carries large left-aligned display and tracked caps labels over EB Garamond italic deck prose; deep green (#2F3E33) is the ink, bronze (#8C6A3C) draws every flourish, rose (#B76E79) warms accents and markers. Context-first stack, asymmetric fleuron divider, plain italic deck with no drop cap, ○/● glyph bullets, and a right-side ornament field holding a single fleuron bloom. Typography-only: no arches, rings, curls, or drawn shapes.

colors:
  parchment: "#F3EDE0"
  deep-green: "#2F3E33"
  bronze: "#8C6A3C"
  rose: "#B76E79"

shadows:
  none-declared: "none — the system uses no shadows"

typography:
  nouveau-display:
    fontFamily: "'Marcellus', 'Noto Serif KR', serif"
    fontSize: "100px"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: 0
  nouveau-subtitle:
    fontFamily: "'EB Garamond', 'Noto Serif KR', serif"
    fontSize: "31px"
    fontWeight: 400
    lineHeight: 1.55
    fontStyle: italic
  nouveau-context:
    fontFamily: "'Marcellus', 'Noto Sans KR', serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.22em
    textTransform: uppercase
  nouveau-body:
    fontFamily: "'EB Garamond', 'Noto Serif KR', serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.75
  nouveau-fleuron:
    fontFamily: "'EB Garamond', serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1
  nouveau-bloom:
    fontFamily: "'EB Garamond', serif"
    fontSize: "300px"
    fontWeight: 400
    lineHeight: 1

spacing:
  overline-w: "64px"
  fleuron-gap: "18px"
  divider-line: "320px"
  gap-context-title: "30px"
  gap-title-div: "30px"
  gap-div-sub: "26px"
  content-left: "252px"
  content-top: "214px"
  content-max-width: "852px"
  field-left: "1300px"
  field-width: "480px"

canvas:
  width: 1920px
  height: 1080px

components:
  context-overline:
    width: 64px
    height: 2px
    color: "{colors.bronze}"
    description: "Short 64px bronze overline above the context line opening the stack. Marks the top anchor of the column."
  fleuron-divider:
    glyph: "❦"
    color: "{colors.bronze}"
    fontSize: 30px
    description: "Left-anchored asymmetric divider between title and subtitle: bronze fleuron at 30px, one 320px 1px bronze hairline, one rose ● glyph. Never symmetric flanking hairlines."
  deck-line:
    fontFamily: "'EB Garamond', serif"
    fontStyle: italic
    fontSize: 31px
    description: "Plain italic deck subtitle at text scale, left-aligned, with no drop cap or initial ornament in any script."
  swash-accent:
    fontFamily: "'EB Garamond', serif"
    fontStyle: italic
    color: "{colors.rose}"
    description: "Rose italic phrase inside body or subtitle lines lifting one key phrase per slide. Maximum one per slide."
  glyph-bullet:
    glyphs: "○ bronze / ● rose"
    fontSize: 20px
    description: "List markers as text: hollow bronze ○ for the first voice, solid rose ● for the second. Never drawn shapes."
  ornament-field:
    width: 480px
    description: "Right-side ornament field (x=1300 to x=1780): one translucent bronze fleuron bloom on empty parchment. Botanical counterweight to the column; carries no text."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS, treat that as source history only, not as the target generation model for `frontend-slides`.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and divider legibility.

## Overview

Whiplash is an **art-nouveau organic presentation system** named for the whiplash curve — the long, botanical, asymmetric line that defines the style. Every slide composes as an asymmetric pair: a top-anchored left-aligned text column on the left, and a bronze fleuron bloom floating on empty parchment to the right. The stack reads context first, then the large left-aligned title, then an asymmetric fleuron divider, then a plain italic deck with no drop cap. Straight modernist edges (bars, boxes, sharp grids) do not exist here; even rules arrive as hairlines with flanking glyphs.

The type pairing is classical: **Marcellus** (an inscriptional serif with quiet Trajan-like flare, single weight) for large left-aligned display titles and tracked caps labels, over **EB Garamond** (a warm humanist Garamond) for the italic deck, body prose, and fleuron ornaments. Marcellus speaks in stone-cut capitals-at-heart even in mixed case; Garamond answers in bookish warmth. The two never trade jobs — Garamond never sets display, Marcellus never sets paragraphs.

The palette is four heirloom tones: parchment ground, deep-green ink, bronze for every drawn line and glyph, rose for warmth (divider glyph, markers, and at most one swash accent per slide). Color is always flat and matte, like letterpress ink on cotton paper. No gradients, no shadows, no glow — presence comes from scale and the fleuron's curl.

**Density philosophy: low-medium, unfurling.** A typical slide carries one column: tracked context line with overline, large left-aligned display title, asymmetric fleuron divider, and a plain italic deck. Supporting content joins as short Garamond lines inside the column — never as side panels or card grids, which would break the single-composition contract. The right ornament field stays text-free.

**Key Characteristics:**
- Context-first stack — tracked caps context with bronze overline, then the large left-aligned title.
- Asymmetric fleuron divider (❦ plus one hairline and a rose ● glyph) left-anchored between title and deck.
- Plain italic deck with no drop cap — Garamond italic at text scale, left-aligned.
- Italic swash accents in rose EB Garamond italic lifting one key phrase per slide.
- ○/● glyph bullets in bronze and rose keying comparison lists.
- Marcellus inscriptional display over Garamond prose — classical voice, never geometric.
- Four heirloom tones, flat and matte: parchment, deep green, bronze, rose.
- Curves live in the fleuron's curl — bloom, divider, and letterforms; no straight-edged boxes or bars.
- Asymmetric composition: text column left, ornament field right, generous empty parchment between and around.

## Colors

### Palette

- **Parchment** (`{colors.parchment}` — `#F3EDE0`): The ground. Warm aged-paper tone, flat — texture is implied by color, never rendered as noise or fiber.
- **Deep Green** (`{colors.deep-green}` — `#2F3E33`): The ink. A dark botanical green-black. All display, body, and label text.
- **Bronze** (`{colors.bronze}` — `#8C6A3C`): The drawing metal. Fleuron, divider hairline, overline, bloom, ○ markers. Every drawn line is bronze.
- **Rose** (`{colors.rose}` — `#B76E79`): The warmth. Divider glyph, ● markers, and the single swash accent per slide. Never for rules that must read as structure, never for body text.

### Defaults

- **Default surface background**: `{colors.parchment}` flat.
- **Default headline color**: `{colors.deep-green}`.
- **Default body/subtitle color**: `{colors.deep-green}` at full opacity.
- **Default label color**: `{colors.deep-green}`, tracked 0.22em, uppercase (Latin).
- **Default drawn-line color**: `{colors.bronze}` — divider hairline, overline.
- **Default accent**: `{colors.rose}` divider glyph + ● markers + at most one swash phrase per slide.

When a slide needs more emphasis, enlarge the display or the bloom — never add a second swash accent or a fifth color.

## Typography

### Font Family

The system runs two classical faces, each locked to its role.

**Marcellus** is the display face — an inscriptional serif with flared Roman capitals and a calm, monumental rhythm. Used for large left-aligned display titles and tracked caps labels. It ships in a single weight (400), which is the system's discipline: display hierarchy comes from size and position, never from weight.

**EB Garamond** is the text face — a warm, readable Garamond with a true italic used for the deck and swash accents. Used for the plain italic deck, body paragraphs, and the fleuron glyphs (❦ renders in Garamond's ornament cut, including the large translucent bloom). Its old-style figures and soft italics are the system's lyrical register.

Never use Garamond for display, never use Marcellus for paragraphs. Marcellus at text sizes turns stony; Garamond at display sizes turns bookish — the roles protect each face.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.nouveau-display}` | 100px | Marcellus | 400 | Left-aligned column display title |
| `{typography.nouveau-subtitle}` | 31px | EB Garamond | 400 italic | Plain italic deck below the divider |
| `{typography.nouveau-body}` | 23px | EB Garamond | 400 | Paragraph body |
| `{typography.nouveau-context}` | 15px | Marcellus | 400 | Tracked context line opening the stack |
| `{typography.nouveau-fleuron}` | 30px | EB Garamond | 400 | ❦ divider glyph |
| `{typography.nouveau-bloom}` | 300px | EB Garamond | 400 | Translucent ornament-field bloom |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display title sets in Marcellus 400 at 100px**, left-aligned, line-height 1.06, deep green. No bold (the face has none), no italic, no letterspacing.
- **Every deck subtitle is plain Garamond italic at 31px** with no drop cap, no initial ornament, in every script. The deck opens with its first word at text scale.
- **Every title/deck pair is separated by the asymmetric fleuron divider** — bronze ❦ at 30px left-anchored, one 320px 1px bronze hairline, one rose ● glyph, with 18px gaps.
- **Every stack opens with the context line** — Marcellus caps at 15px with 0.22em tracking, left-aligned, deep green (Latin; CJK runs drop case and tracking), headed by the 64px bronze overline.
- **At most one swash accent per slide**: a single short phrase in Garamond italic set in rose. Two rose phrases on one slide break the accent economy.
- **Every comparison list uses ○/● glyph bullets** — hollow bronze ○ for the first voice, solid rose ● for the second. Drawn bullets do not exist.
- **No underline, no bold, no all-caps display.** Emphasis is size contrast and the single swash.

### Typography Principles

The voice contrast is **inscriptional Marcellus display ↔ lyrical Garamond prose ↔ tracked Marcellus labels**. The register is cultivated and unhurried: generous leading (1.55–1.75 on prose), left-aligned measure capped at 852px, short lines that let the column breathe. Display lines should break into two or three balanced lines.

Alignment is left throughout, on the column edge (x=252). Centered or right-aligned text appears nowhere — the asymmetry is the composition's calm tension (the ornament field balances the column, not a second text block).

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** with an asymmetric composition: the text column sits left-aligned (x=252, width 852px), top-anchored at y=214: context line with overline first, then the large display title, then the asymmetric divider, then the plain italic deck. The right ornament field (x=1300 to x=1780, width 480px) holds the fleuron bloom on empty parchment. The gap between column and field stays empty.

### Persistent Chrome

Whiplash carries **no persistent chrome**: no bars, dots, counters, or footers. Slide sequence may be marked by a small bronze fleuron-count (❦❦ for slide 2) tucked at the column base — at most a whisper, never a footer strip.

If a deck context demands formal pagination, a single Marcellus numeral in bronze may sit beneath the column — never a bar, never a boxed counter.

## Depth and Elevation

Whiplash has **no shadow or blur system**. The `{shadows.none-declared}` token exists only to satisfy the schema honestly: this system declines shadows entirely.

Layering is minimal and flat: text sits on parchment in the column; the fleuron overlaps nothing; the bloom sits behind nothing and above nothing (it is the field's center). Any drawn shape, drop shadow, glow, gradient, or transparency effect beyond the flat translucent bloom is a defect in a Whiplash deck.

Hierarchy comes from **scale, position, and warmth**: the context overline marks the top anchor, the title is largest, the divider marks the threshold, the plain deck closes the reading, rose warms exactly the divider glyph, the ● markers, and one moment of prose.

## Shapes and Treatment

### Border Radius

Curves live only inside glyphs: the fleuron's curl (divider, bloom, terminals) and the ○/● markers. No other radii exist — in particular, no rounded rectangles, pills, arches, rings, or softened boxes. Drawn frames of any kind are forbidden; if a boundary is needed, it must be a hairline with fleuron terminals.

### Border Weights

- **1px solid bronze** — divider hairline (320px).
- **2px solid bronze, 64px long** — the context overline opening the stack.

No other strokes exist. Black rules, gray keylines, arches, rings, and boxed borders are forbidden.

### Decorative Element Types

**Context overline** — Short 64px 2px bronze rule above the context line. Marks the top anchor of the column.

**Fleuron divider** — Left-anchored asymmetric row: bronze ❦ at 30px, one 320px 1px bronze hairline, one rose ● glyph, 18px gaps. The title/deck threshold.

**Deck line** — Plain Garamond italic subtitle at 31px, left-aligned, no initial ornament. Markup stays contiguous; identical treatment in every script.

**Swash accent** — One short phrase per slide in Garamond italic, rose. Lifts a key phrase; never a whole sentence, never twice.

**Glyph bullets** — ○ bronze and ● rose text markers keying comparison lists. Botanical punctuation, deliberately asymmetric.

**Ornament field** — Right-side text-free composition: 300px translucent bronze fleuron bloom at 22%. Botanical counterweight to the column.

## Do's and Don'ts

### Do

- Set every display title in Marcellus 400 at 100px, left-aligned, deep green.
- Open every stack with the tracked context line and its bronze overline.
- Separate title and deck with the asymmetric fleuron divider — ❦ plus one hairline and a rose ● glyph.
- Set every deck in plain Garamond italic 31px with no drop cap and no initial ornament.
- Set body in Garamond roman 23px.
- Track every Latin context line at 0.22em Marcellus caps, left-aligned.
- Key comparison lists with ○/● glyph bullets — bronze ○ first voice, rose ● second.
- Limit rose prose to one swash phrase per slide.
- Keep the ornament field text-free and the gap between column and field empty.
- Left-align all text on the column edge (x=252).
- Hold all color flat and matte — letterpress ink on cotton paper.

### Don't

- Don't draw straight-edged boxes, bars, panels, or modernist grids.
- Don't set display type in Garamond or paragraphs in Marcellus.
- Don't use bold, underline, or all-caps display — Marcellus has one weight and size contrast carries hierarchy.
- Don't add a drop cap or any initial ornament to the deck.
- Don't center or right-align text — the composition is left-aligned in the offset column.
- Don't add arches, rings, curls, or drawn shapes — ornament lives in fleuron glyphs and hairlines.
- Don't add shadows, gradients, glow, blur, or transparency effects beyond the flat bloom.
- Don't use black or gray for rules — every drawn line is bronze.
- Don't repeat the swash accent or the fleuron more than specified — one swash, one divider, one bloom.
- Don't add persistent chrome bars, dots, or footers.
- Don't introduce a fifth color or a third typeface.

## Responsive Behavior

Whiplash is a **fixed-stage system**: the 1920×1080 plate scales uniformly via one transform and never reflows. Column measure and ornament positions are absolute coordinates — reflowing would break the column/field asymmetry.

### Scaling Behavior

- All type, divider, and ornament dimensions are fixed px values on the 1920×1080 stage.
- The stage scaler letterboxes on non-16:9 viewports; bars are black and outside the composition.
- No clamp(), vw, or vh units appear in slide CSS.

### Component Breakpoints

None. The system has no breakpoints; the single transform handles all viewports.

### Presenter Behavior

- Slides advance linearly with a slow 500ms cross-fade, honoring `prefers-reduced-motion` (fade becomes a cut).
- No staged builds; the composition appears whole.

### Animation Triggers

None by default. If motion is required, the fleuron may fade in once (400ms ease-out) after the title — the only permitted staged entrance, and it honors `prefers-reduced-motion`.

### Print Behavior

Print at 16:9 full-bleed or fit-to-page on cream stock when possible. All four inks are flat and print-safe; bronze and rose hold on uncoated paper. Do not strip the parchment ground — the composition assumes it.

## CJK & International Content

The inscriptional/lyrical contrast maps onto CJK serif pairs; the bloom, divider, and ○/● markers are script-independent and stay identical. There is no drop cap in any script.

### Recommended Korean Pairing

| Role | Default | Korean counterpart |
|---|---|---|
| Display / labels | Marcellus 400 | Noto Serif KR 600 |
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

- **Line-height**: increase ~15%. Display 1.2–1.25 (up from 1.06), subtitle 1.65–1.75, body 1.85–1.95. CJK density needs air to keep the lyrical register.
- **Letter-spacing**: 0 on every CJK run. The 0.22em label tracking applies to Latin runs only.
- **Text transform**: never apply `uppercase` to CJK text. Mixed context lines keep the transform with tracking reduced to 0.14em.
- **No drop cap in any script**: the deck opens at text scale in Latin and CJK alike. The asymmetric divider and the ornament field carry the ornament load.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: convention omits sentence-final punctuation at display scale.
- **Space between CJK and Latin**: one ASCII space between scripts: `Typodeck Research · 2026년 11월`.
- **Swash accent**: CJK swash phrases render in rose without italic (CJK has no italic); weight steps to 600 to hold the accent.

### Aesthetic Notes for This System

Whiplash's identity transfers well because the offset-column composition does most of the recognition work regardless of script. The main loss is the inscriptional display voice (Noto Serif KR 600 is a book serif, not a Roman inscriptional). Compensate by holding display at full 100px size so the composition keeps its monumental feel.

### Known CJK Gap

- **No inscriptional CJK face exists on the CDN.** Marcellus's stone-cut Roman character has no Korean or Chinese counterpart — Noto Serif KR/SC substitute book-serif neutrality. The fleuron and ornament must carry the classical signal.
- **No CJK italic.** The lyrical Garamond-italic deck voice collapses to upright CJK; rose color + 600 weight substitute for the swash accent only.

## Iteration Guide

1. Any new slide starts from the offset plate: parchment ground, text column left, ornament field right.
2. Any new display element uses Marcellus left-aligned in the column. Any new text element uses Garamond. Never cross the roles.
3. Any new stack opens with the tracked context line and its 64px bronze overline at the top anchor.
4. Any new title/deck pair takes the asymmetric fleuron divider between them — ❦ plus one hairline and a rose ● glyph, left-anchored.
5. Any new deck is plain Garamond italic 31px, left-aligned, with no drop cap in any script.
6. Any new slide carries at most one rose swash phrase — a few words, Garamond italic, never a sentence.
7. Any new drawn line is bronze — 1px hairlines, 64px overline. Black or gray rules are violations.
8. Any new element aligns to the column edge (x=252) or the ornament field. Centered text is forbidden; the field carries no text.
9. Any new color must be one of the four heirloom tones, flat and matte. No fifth color, no gradient, no shadow beyond the flat bloom.
10. Any new deck is reviewed against the engraving test: would this plate print in four flat inks on cotton paper? If not, remove the offending effect.

## Known Gaps

- **Fonts**: Marcellus / EB Garamond (+ Noto Serif KR / Noto Sans KR for Korean) via Google Fonts CDN (`display=swap`); fallbacks `Didot, "Bodoni MT", serif` / `Garamond, "Adobe Garamond", serif`. No font files committed. Offline rendering falls back to system serifs and loses the inscriptional voice.
- **No chart system.** Data graphics have no native pattern; the fleuron composition resists axes and bars. Decks needing charts should choose another system.
- **No table system.** Tabular data has no ruled-grid pattern (ruled grids are forbidden); short definition lists with fleuron bullets are the maximum structure permitted.
- **No image treatment.** Photography and illustration have no defined mask or frame rule; the system assumes typographic slides.
- **Marcellus ships one weight (400).** Display hierarchy cannot use weight contrast; oversized sizes and position must do all the work. Do not faux-bold Marcellus.
- **Fleuron glyph coverage.** ❦ (U+2766) renders from EB Garamond's ornament cut through a pinned fallback stack (`"EB Garamond", "Cormorant Garamond", "Noto Serif", "Noto Serif KR", "DejaVu Serif", Garamond, serif`); fallback serif fleurons vary in drawing (some render heart-like). Verify the divider glyph and the bloom in screenshots on the target machine — the bloom is decorative-only and must never carry meaning.
- **Swash accent: plain choice recorded.** The cover ships zero swash accents (one is the maximum, none the default); the divider glyph and ● markers carry the rose ration. Add a swash phrase only when a slide has no other rose moment.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional 500ms cross-fade / fleuron fade-in | none | Static final frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows in system |
| 5 | Gradients | Not used | full | N/A — all fills flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — clean ground |
| 7 | Transparency layers | Bloom at 22% opacity | partial | Nearest opaque bronze tint |
| 8 | Custom fonts | Marcellus / EB Garamond / Noto KR via CDN | partial | Embedded subset or Didot/Garamond fallback |
| 9 | Absolute-positioned decor | Bloom glyph (positioned type) | full | Native text box in place |
