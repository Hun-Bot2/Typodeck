---
version: alpha
name: Iron Press
description: A Victorian letterpress presentation system built on pressed-ink formality. Display type runs in IM Fell English for headlines and tracked small-caps labels, paired with EB Garamond for body and italic accents. The palette sits on aged paper (`#F1E9D6`) with near-black ink (`#1F1A14`) and oxblood (`#7B1E1E`) for ornaments and emphasis. Typography-only register: no frames, rules, or plates exist — composition is centered, symmetrical, and single-measure, structured by ornaments and whitespace alone. Depth is flat impression only — zero shadows, zero rounding, zero gradients.
colors:
  aged-paper: "#F1E9D6"
  paper-deep: "#E4D9BE"
  ink: "#1F1A14"
  oxblood: "#7B1E1E"
  gray: "#4A4A4A"
  white: "#FFFFFF"
shadows:
  none: "none"
typography:
  hero:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "80px"
    fontWeight: 400
    lineHeight: 1.16
  headline:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "76px"
    fontWeight: 400
    lineHeight: 1.15
  subhead:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "42px"
    fontWeight: 400
    lineHeight: 1.25
  dropcap:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "120px"
    fontWeight: 400
    lineHeight: 0.9
  body:
    fontFamily: "'EB Garamond', Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.65
  body-italic:
    fontFamily: "'EB Garamond', Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.6
  smallcaps:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.22em
    textTransform: uppercase
  smallcaps-sm:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.22em
    textTransform: uppercase
  caption:
    fontFamily: "'EB Garamond', Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.5
  page-mark:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.3em
spacing:
  frame-outer: 3px
  frame-inner: 1px
  frame-gap: 12px
  frame-inset: 40px
  rule-thick: 3px
  rule-thin: 1px
  pad-slide-y: 120px
  pad-slide-x: 160px
  gap-stack-lg: 56px
  gap-stack-md: 36px
  gap-stack-sm: 24px
  measure: 56ch
  content-max-width: 1400px
canvas:
  width: 1920px
  height: 1080px
components:
  ornament-break:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: 34px
    color: "{colors.oxblood}"
    description: "Centered fleuron (❦) row separating kicker, headline, and body. The only separator in the system — rules do not exist."
  ornament:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: 34px
    color: "{colors.oxblood}"
    description: "Pilcrow (¶) or fleuron (❦) glyph in oxblood marking section breaks and flanking the page mark."
  dropcap:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: 120px
    color: "{colors.oxblood}"
    float: left
    lineHeight: 0.9
    padding: "8px 16px 0 0"
    description: "4-line oxblood initial opening the body measure on text slides."
  page-mark:
    fontFamily: "'IM Fell English', Georgia, serif"
    fontSize: 22px
    letterSpacing: 0.3em
    color: "{colors.ink}"
    description: "Centered page numeral flanked by pilcrow ornaments (¶ 1 ¶), bottom center of the slide."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and margin collisions.

## Overview

Iron Press is a **Victorian letterpress presentation system**. Its foundational premise is the printed page as a fixed artifact: centered formal composition, symmetrical ornaments, fleuron breaks, and small-caps hierarchy. Layouts hold a single centered measure with generous top and bottom margins; symmetry plus whitespace enforces the calm. Curved, scattered, or asymmetric arrangements do not exist.

The type stack is two old-style serifs. **IM Fell English** (weight 400, the face's only weight) is the display face — a weathered antique serif carrying headlines, kickers, small-caps labels, ornaments, and the drop cap. **EB Garamond** is the body face — used for paragraphs at 400 and for the italic subtitle voice. Hierarchy is expressed through size, caps, ornament breaks, and oxblood accents; weight contrast is minimal because the Fell faces ship a single weight.

The palette sits on **aged paper** (`{colors.aged-paper}`) with near-black **ink** (`{colors.ink}`) and **oxblood** (`{colors.oxblood}`) reserved for ornaments, the drop cap, and rare emphasis. Gray (`{colors.gray}`) handles captions and secondary lines. The result reads as a title page from a 19th-century volume — printed, bound, permanent.

Depth is **flat impression only**: zero shadows, zero rounded corners, zero gradients, zero blur, zero rules. Emphasis comes from oxblood ink and scale alone, as if from a second pass through the press.

**Density philosophy: stately and sparse.** A typical slide carries one kicker, one headline, one ornament break, one short body measure, and one ornament row. Symmetry plus whitespace enforces the calm; nothing crowds the edges.

**Key Characteristics:**
- Fleuron ornament breaks (`{components.ornament-break}`) — centered oxblood ❦ rows separating kicker, headline, and body.
- Centered small-caps hierarchy (`{typography.smallcaps}`) — IM Fell English uppercase at 0.22em tracking for kickers and context.
- Pilcrow and fleuron ornaments (`{components.ornament}`) — ¶ and ❦ in oxblood marking breaks and flanking the page mark.
- Ornamental drop cap (`{typography.dropcap}`) — 4-line oxblood Fell initial opening text measures.
- Pressed-ink flatness — zero shadows, zero rounding, zero gradients, zero rules.
- Single-measure centered column — ~56ch centered block with ornament breaks around the headline.

## Colors

### Palette

- **Aged Paper** (`{colors.aged-paper}` — `#F1E9D6`): The universal ground. Warm, slightly darkened, suggesting old stock.
- **Paper Deep** (`{colors.paper-deep}` — `#E4D9BE`): A deeper tone retained as a token; never rendered in the typography-only register (no plates, no insets).
- **Ink** (`{colors.ink}` — `#1F1A14`): Near-black warm ink. Headlines, body, kickers.
- **Oxblood** (`{colors.oxblood}` — `#7B1E1E`): The accent ink. Ornaments, drop cap, emphasis words. Never body text.
- **Gray** (`{colors.gray}` — `#4A4A4A`): Captions, datelines, secondary context lines.
- **White** (`{colors.white}` — `#FFFFFF`): Effectively unused except as a knockout inside oxblood seals (rare). Never a slide ground.

### Defaults

- **Default surface background**: `{colors.aged-paper}` flat. Pressed ink on paper only — no texture images, no noise overlays.
- **Default headline color**: `{colors.ink}`; the drop cap and ornaments are `{colors.oxblood}`.
- **Default body text color**: `{colors.ink}` at full opacity; captions in `{colors.gray}`.
- **Default separator**: `{components.ornament-break}` — centered oxblood ❦ row; rules do not exist.
- **Default emphasis**: a single oxblood word or italic Garamond phrase per slide — never bold (the faces have no bold).

When a slide needs a figure or schedule moment, set it as centered type in the single measure with an ornament break — never a plate, border, or inset.

## Typography

### Font Family

The system runs two old-style serifs, each locked to its role.

**IM Fell English** is the display face — a weathered antique serif with irregular old-style character, available only in weight 400 (plus italic). Used for hero titles, headlines, subheads, kickers, small-caps labels, ornaments, the drop cap, and page marks. Its roughness is the system's voice; replacing it with a clean transitional serif would erase the letterpress feel.

**EB Garamond** is the body face — a classical Garamond revival. Used for paragraphs (400), the italic subtitle voice, and captions. It reads cleanly at 30px and provides a calm counterpoint to Fell's roughness.

Never use EB Garamond for headlines or kickers, never use IM Fell English for body paragraphs. The Fell-display / Garamond-body split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.hero}` | 80px | IM Fell English | 400 | Cover display title, centered |
| `{typography.headline}` | 76px | IM Fell English | 400 | Primary section headline, centered |
| `{typography.subhead}` | 42px | IM Fell English | 400 | Region-level subheading |
| `{typography.dropcap}` | 120px | IM Fell English | 400 | 4-line oxblood initial |
| `{typography.body}` | 30px | EB Garamond | 400 | Paragraph body |
| `{typography.body-italic}` | 32px | EB Garamond | 400 italic | Subtitle / lede voice |
| `{typography.smallcaps}` | 24px | IM Fell English | 400 | Tracked caps kickers |
| `{typography.smallcaps-sm}` | 20px | IM Fell English | 400 | Context lines, datelines |
| `{typography.caption}` | 22px | EB Garamond | 400 | Captions, figure notes |
| `{typography.page-mark}` | 22px | IM Fell English | 400 | Page numeral with ornaments |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every kicker is tracked small caps.** IM Fell English, uppercase, 0.22em tracking, 24px — centered, with no flanking marks.
- **Every cover headline is centered Fell at 80px.** Centered alignment is mandatory for display type on every slide.
- **Every text measure opens with either an ornament break or a drop cap.** Covers use the ❦ break; body slides use the oxblood drop cap.
- **Every subtitle uses the italic Garamond voice.** 32px italic, centered, in ink — never Fell, never upright, never oxblood.
- **Every ornament is oxblood.** Pilcrows, fleurons, and the drop cap are always `{colors.oxblood}`; ink ornaments do not exist.
- **Every page mark is centered with ornaments.** Format `¶ 1 ¶` in Fell 22px with 0.3em numeral tracking, bottom center of the slide.
- **Every context/dateline uses smallcaps-sm.** 20px Fell caps at 0.22em tracking in gray or ink.

### Typography Principles

The voice contrast is **rough antique display ↔ classical calm body**. Bold does not exist — emphasis comes from oxblood ink, italic, size, or caps. Letterspacing appears only on Fell caps runs (0.22–0.3em); body and headline Fell keeps native spacing.

Display type is always **centered**. Body is centered on covers and may justify-center on text slides (centered measure, left-aligned or justified lines at the author's discretion, but the block itself stays centered). Left-aligned display type does not exist.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. All content lives on the open paper with 120px vertical / 160px horizontal padding. The inner content region caps at `max-width: 1400px` and centers.

The only layout is **centered single-measure**: one centered column at ~56ch. Two-column, scattered, or asymmetric layouts do not exist. Vertical rhythm runs kicker → ornament → headline → ornament → subtitle → ornament → body → page mark.

### Persistent Chrome

Two formal elements appear on every slide:

- **Ornament break** — `{components.ornament-break}` separating the major blocks. Non-negotiable; the ❦ row is the system's structural mark.
- **Page mark** — `{components.page-mark}` centered at the bottom of the slide: `¶ 1 ¶` in Fell with oxblood ornaments.

No navigation rails, no progress bars, no side chrome. Symmetry is the chrome.

### Centering Discipline

Symmetry is structural. Every element centers on the slide's vertical axis: kickers, headlines, ornament breaks, subtitles, ornaments, body measures, page marks. Off-center placement of any element breaks the letterpress formality. If content overflows, shorten the copy or reduce the measure — never break centering.

## Depth and Elevation

The system practices **pressed-ink flatness**. The ground is one opaque flat fill; there are no insets, panels, or plates. Shadows, glows, blurs, gradients, rules, and rounded corners do not exist anywhere in the system.

Emphasis hierarchy is achieved through ink color (ink vs oxblood), size, caps, and whitespace — exactly as a two-ink letterpress job would. A second "pass through the press" (oxblood) is the system's only elevation metaphor.

## Shapes and Treatment

### Border Radius

There is nothing to round: no frames, rules, insets, or plates exist in the typography-only register. A rounded corner — or any container at all — would read as a gross anachronism against the letterpress voice.

### Border Weights

Borders do not exist. There are no frame rules, companion rules, or plate borders; dashed, dotted, diagonal, and solid lines alike do not exist. Separation is an ornament glyph or whitespace, never a line.

### Decorative Element Types

**Ornament break** — Centered oxblood ❦ row in Fell at 34px separating kicker, headline, and body. The system's dominant structural mark.

**Ornament** — Pilcrow (¶) or fleuron (❦) glyph in Fell at 34px, always oxblood. Marks section breaks and flanks the page mark.

**Drop cap** — 4-line (120px) oxblood Fell initial floated left at the head of a body measure, 8px top / 16px right offset.

**Page mark** — Centered `¶ 1 ¶` in Fell 22px, bottom center of the slide. Oxblood ornaments, ink numeral.

## Do's and Don'ts

### Do

- Separate kicker, headline, and body with the centered oxblood ❦ ornament break.
- Center every element on the vertical axis — kickers, headlines, ornaments, body, page marks.
- Set kickers and context lines in tracked Fell small caps (0.22em).
- Use the italic Garamond voice for every subtitle and lede.
- Render ornaments and the drop cap in oxblood, always.
- Express hierarchy through size, caps, ornaments, and the second ink — never through weight.
- Keep the single centered measure at ~56ch with generous top/bottom margins.
- Flank the page numeral with pilcrow ornaments on every slide.

### Don't

- Don't left-align, right-align, or scatter any element — symmetry is law.
- Don't use shadows, rounded corners, gradients, glows, or blur anywhere.
- Don't use bold or heavy weights; the faces have no bold and faux-bold is forbidden.
- Don't set body text in oxblood — the accent ink is for ornaments and rare emphasis only.
- Don't use IM Fell English for body or EB Garamond for headlines/kickers.
- Don't add frames, rules, borders, plates, or insets of any kind.
- Don't use dashed, dotted, diagonal, curved, or straight rules — lines do not exist.
- Don't introduce a third ink color; the palette is ink + oxblood + gray on aged paper.
- Don't omit the ornament break or the page mark on any slide.
- Don't letterspace body text or headline Fell — tracking belongs to caps runs only.

## Responsive Behavior

Iron Press is a **fixed-stage system** (1920×1080) under the Frontend Slides policy. This section records the source proportions for translation, not live responsive rules.

### Scaling Behavior

- Hero 80px, headline 76px, subhead 42px, body 30px at stage scale.
- Ornament-break size (34px) and page-mark tracking are fixed values.
- The 56ch measure and 1400px content cap scale with the uniform stage transform only.

### Component Breakpoints

No breakpoints exist in the fixed-stage model. The single-measure layout has no columns to collapse; the generated deck never reflows and letterboxes instead.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp`/`ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are a dignified 600ms ease fade; no sliding, no bounce.

### Animation Triggers

No entry animation by default — the printed page is already complete. An optional 600ms fade-in on slide entry is permitted; `prefers-reduced-motion` disables even that. Ambient animation does not exist.

### Print Behavior

The system is print-native in spirit: flat inks, no shadows, light ground. Export each slide as a static 1920×1080 frame. The aged-paper ground may print as plain white-stock equivalent at the producer's discretion.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / kickers | IM Fell English 400 | Noto Serif KR 600 |
| Body / subtitles / captions | EB Garamond 400 (+italic) | Noto Serif KR 400 |
| Ornaments / page marks | Fell ¶/❦ glyphs | Fell ¶/❦ glyphs (unchanged — ornaments stay Latin) |

### Mixed-Content Strategy

**Strategy A** — single CJK serif family with weight contrast. Set every text element to `font-family: 'Noto Serif KR', serif`, using 600 for display/kickers and 400 for body. Noto Serif KR ships Latin glyphs that read cleanly, so mixed sentences render in one consistent face. Keep the Fell pilcrow/fleuron ornaments in IM Fell English — they are decorative glyphs, not text, and carry the antique signal the CJK face cannot.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.85–1.95 (up from 1.65), display 1.3–1.4 (up from 1.15–1.25).
- **Letter-spacing**: set to 0 on every CJK run. The 0.22em small-caps tracking and 0.3em page-mark tracking must not apply to CJK characters.
- **Text transform**: don't apply `uppercase` to CJK text — CJK has no case. Kickers keep their centered position so they still read as kickers.
- **Punctuation**: use full-width CJK punctuation (。，：；！？「」) in Korean sentences.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between CJK characters and adjacent Latin/digits in mixed sentences.

### Aesthetic Notes for This System

The system's antique voice depends on Fell's weathered irregularity, which no CJK face reproduces. Compensate with the signature ornaments: the oxblood Fell ¶/❦ glyphs (kept in the Latin face) and the centered symmetry carry the letterpress identity. Noto Serif KR at 600 gives headlines enough gravitas to sit in Fell's place.

The italic Garamond subtitle voice has no CJK equivalent (CJK italics are faked obliques); set CJK subtitles upright in Noto Serif KR 400 at the same 32px size and let the centered position plus flanking ornament carry the subtitle signal.

### Known CJK Gap

- **No weathered-CJK display face on CDN.** Fell's antique roughness cannot transfer; the CJK build reads "formal serif" rather than "Victorian press". The ornaments and symmetry must carry the period signal alone.
- **No CJK italic.** The subtitle voice collapses to upright; do not apply synthetic oblique to CJK runs.

## Iteration Guide

1. Any new slide starts on the open aged-paper ground with a centered page mark.
2. Any new kicker uses Fell small caps (24px, 0.22em, centered), with no flanking marks.
3. Any new headline uses centered Fell at the matching scale token with an ornament break above and below.
4. Any new subtitle uses the 32px italic Garamond voice, centered, in ink.
5. Any new body measure opens with an oxblood drop cap and holds ~56ch centered.
6. Any new ornament (¶/❦) renders in Fell at 34px in oxblood.
7. Any new emphasis uses oxblood ink or Garamond italic — never bold, never underline.
8. Any new figure moment uses centered type in the single measure with an ornament break — never a plate or border.
9. Any new color must be ink, oxblood, or gray; no third ink, no rendered tints.
10. Motion is limited to an optional 600ms fade honoring `prefers-reduced-motion`; stillness is the default.

## Known Gaps

- **Fonts**: IM Fell English / EB Garamond via Google Fonts CDN (`display=swap`); fallbacks `Georgia, serif` for both faces. No font files committed. Offline rendering falls back to Georgia and loses the weathered Fell character.
- **Single weight**: neither display role has a bold; faux-bold is forbidden, so emphasis vocabulary is limited to ink color, italic, size, and caps.
- **No frames or rules**: the typography-only register has no frame construction; symmetry and ornament breaks structure the slide.
- **Page marks are manual**: the `¶ 1 ¶` numeral is authored per slide; there is no auto-numbering layer.
- **No dark/color surfaces**: the system is aged-paper only; dark or saturated slides would need a new palette.
- **Fleuron availability**: the ❦ glyph depends on Fell/Georgia coverage; if missing, fall back to ¶ (always available) rather than an image.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional 600ms fade on entry | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A |
| 5 | Gradients | Not used | full | N/A — all fills are flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — tone contrast only |
| 7 | Transparency layers | Not used | full | N/A — all inks opaque |
| 8 | Custom fonts | IM Fell English + EB Garamond via Google Fonts CDN | partial | Embedded or substituted serif pair (Georgia) |
| 9 | Absolute-positioned decor | Ornaments, drop cap (type only) | full | Native text boxes 1:1 |
