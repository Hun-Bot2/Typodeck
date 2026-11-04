---
version: alpha
name: Vista
description: A mid-century travel-poster presentation system built on stacked horizontal bands. Display type runs in DM Serif Display for poster headlines, paired with Outfit for body and tracked caps labels. The palette stacks deep teal (`#0E3B43`) sky bands against warm sand (`#F6E7C1`) with burnt orange (`#E4572E`) for the poster figure numeral, plus leaf green (`#A8C686`) for secondary bands. Typography-only register: bands abut directly with no ticket rules, badges, rings, notches, or keylines — hierarchy is carried by the band grounds, scale, and tracked caps alone. Depth is flat poster space — solid grounds, no shadows.
colors:
  deep-teal: "#0E3B43"
  teal-deep: "#0A2D34"
  sand: "#F6E7C1"
  sand-deep: "#EDD9A8"
  burnt-orange: "#E4572E"
  leaf: "#A8C686"
  cream-white: "#FFFDF6"
shadows:
  none: "none"
typography:
  hero:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: "76px"
    fontWeight: 400
    lineHeight: 1.1
  headline:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.08
  subhead:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.15
  badge-numeral:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.2em
    textTransform: uppercase
  ticket-stub:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.2em
    textTransform: uppercase
  caption:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.5
  page-mark:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.25em
spacing:
  band-sky: 248px
  band-headline: 320px
  ticket-dash: 3px
  notch: 28px
  keyline: 2px
  pad-band-x: 120px
  pad-band-y: 56px
  gap-stack-lg: 40px
  gap-stack-md: 28px
  gap-stack-sm: 16px
  badge-size: 196px
  content-max-width: 1680px
canvas:
  width: 1920px
  height: 1080px
components:
  band:
    width: 1920px
    padding: "{spacing.pad-band-y} {spacing.pad-band-x}"
    description: "Full-bleed flat band in teal, sand, cream, or leaf. Bands stack top-to-bottom abutting directly; edges always full-bleed, never inset."
  poster-figure:
    fontFamily: "'DM Serif Display', Georgia, serif"
    fontSize: 72px
    fontWeight: 400
    color: "{colors.burnt-orange}"
    description: "The slide's key numeral set bare on the headline band in burnt-orange DM Serif Display. No badge, no ring — scale and signal color carry the figure."
  kicker:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 600
    letterSpacing: 0.2em
    textTransform: uppercase
    description: "Bare tracked-caps kicker in the sky band. No keyline — position and tracking carry the kicker signal."
  leaf-word:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    letterSpacing: 0.2em
    textTransform: uppercase
    description: "Secondary meta line as plain tracked caps. No chip, no tag shape."
  page-mark:
    fontFamily: "'Outfit', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    letterSpacing: 0.25em
    description: "Tracked page numeral (e.g. 01) right-aligned in the bottom band."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and band-boundary crossings.

## Overview

Vista is a **mid-century travel-poster presentation system**. Its foundational premise is the band stack: every slide reads as sky band / headline band / body band, each a flat solid fill with full-bleed edges. Layouts move top to bottom like a journey — teal sky, sand headline field, body ground — with a burnt-orange poster figure carrying the slide's key numeral. Corners are square, fills are opaque, and ornament is limited to the band grounds and tracked caps.

The type stack is two faces. **DM Serif Display** (weight 400, the face's only weight) is the poster face — a high-contrast modern serif with mid-century warmth carrying hero titles, headlines, subheads, and poster figures. **Outfit** is the work face — a clean geometric sans used for body (400) and tracked caps labels (600). The serif-poster / sans-caption contrast echoes a railway poster crossed with a timetable.

The palette stacks **deep teal** (`{colors.deep-teal}`) sky bands against **warm sand** (`{colors.sand}`) with **burnt orange** (`{colors.burnt-orange}`) for the poster figure numeral, plus **leaf green** (`{colors.leaf}`) for secondary bands and **cream white** (`{colors.cream-white}`) for body grounds. Teal and sand alternate as grounds; burnt orange never carries body text.

Depth is **flat poster space**: solid grounds, no shadows, no gradients, no blur, no rules. Band contrast does all the separation work.

**Density philosophy: poster-bold but ticket-tidy.** A typical slide carries one kicker, one headline, one poster figure, and one body block. Bands keep elements separated without whitespace oceans; padding inside bands is moderate (56px vertical, 120px horizontal) because the band edges themselves structure the slide.

**Key Characteristics:**
- Stacked band layout (`{components.band}`) — full-bleed flat bands in teal/sand/cream/leaf reading top-to-bottom like a poster horizon, abutting directly.
- Poster figure numeral (`{components.poster-figure}`) — burnt-orange DM Serif numeral set bare on the headline band.
- Poster-serif headlines (`{typography.headline}`) — DM Serif Display, teal on sand or sand on teal, never letterspaced.
- Tracked Outfit caps labels (`{typography.label}`) — bare 0.2em tracked uppercase kickers; no keylines.
- Plain meta words (`{components.leaf-word}`) — small tracked-caps subsection markers with no chip shape.
- Flat opaque grounds only — zero shadows, zero gradients, zero blur, zero rules.

## Colors

### Palette

- **Deep Teal** (`{colors.deep-teal}` — `#0E3B43`): The sky color. Top bands, bottom bands, headline text on sand, body text on cream.
- **Teal Deep** (`{colors.teal-deep}` — `#0A2D34`): A darker teal for the bottom-most ground band. Used sparingly for anchoring.
- **Sand** (`{colors.sand}` — `#F6E7C1`): The headline field. Warm mid ground carrying teal poster type; also ground behind the burnt-orange figure.
- **Sand Deep** (`{colors.sand-deep}` — `#EDD9A8`): Darker sand for alternating sub-bands. Retained token.
- **Burnt Orange** (`{colors.burnt-orange}` — `#E4572E`): The signal color. Poster figure numeral and rare headline emphasis at display sizes. Never body text.
- **Leaf** (`{colors.leaf}` — `#A8C686`): Secondary band ground. A cool counterpoint to the warm sand.
- **Cream White** (`{colors.cream-white}` — `#FFFDF6`): Body ground. Lighter than sand, used for text-heavy bands to maximize legibility.

### Defaults

- **Default band order (cover)**: teal sky → sand headline → cream body → teal ground, bands abutting directly. Alternate teal/sand so adjacent bands always contrast.
- **Default headline color**: `{colors.deep-teal}` on sand; `{colors.sand}` on teal. Never orange headlines, never low-contrast pairings.
- **Default body text color**: `{colors.deep-teal}` on cream/sand; `{colors.sand}` on teal.
- **Default band separator**: none — adjacent ground colors abut; rules do not exist.
- **Default poster figure**: `{components.poster-figure}` — burnt-orange numeral bare on the headline band.
- **Default kicker**: `{components.kicker}` — bare tracked caps; no keyline.
- **Default caption color**: teal at 75% on light bands, sand at 75% on teal bands.

When a slide needs a cooler moment, swap one sand band for leaf — but keep the teal/cream text rules and the orange figure signal unchanged.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**DM Serif Display** is the poster face — a high-contrast modern serif with bracketed warmth, available only in weight 400 (plus italic). Used for hero titles, headlines, subheads, and poster figures. Its poster scale and contrast are the system's display voice; a grotesque or slab replacement would erase the travel-poster feel.

**Outfit** is the work face — a clean geometric sans. Used for body (400), labels and meta lines (600 tracked caps), captions (400), and page marks (600). Its geometric clarity reads as the caption voice against the poster's serif.

Never use Outfit for headlines or poster figures, never use DM Serif Display for body, labels, or captions. The serif-poster / sans-caption split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.hero}` | 76px | DM Serif Display | 400 | Cover display title |
| `{typography.headline}` | 64px | DM Serif Display | 400 | Primary section headline |
| `{typography.subhead}` | 44px | DM Serif Display | 400 | Region-level subheading |
| `{typography.badge-numeral}` | 72px | DM Serif Display | 400 | Poster figure numeral on the band |
| `{typography.body}` | 30px | Outfit | 400 | Paragraph body |
| `{typography.body-sm}` | 25px | Outfit | 400 | Secondary body, list items |
| `{typography.label}` | 22px | Outfit | 600 | Tracked caps kicker label |
| `{typography.ticket-stub}` | 20px | Outfit | 600 | Small caps meta line in sky band |
| `{typography.caption}` | 21px | Outfit | 400 | Captions, context lines |
| `{typography.page-mark}` | 20px | Outfit | 600 | Page numeral, tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline uses DM Serif Display with native spacing.** Never letterspace the poster serif; tracking on DM Serif Display breaks its rhythm.
- **Every kicker is bare tracked Outfit caps.** 22px, 600 weight, 0.2em tracking, uppercase, with no keyline.
- **Every poster figure is burnt-orange DM Serif at 64–72px.** The numeral is the slide's key figure, set bare on the headline band.
- **Bands abut directly.** No ticket rules, notches, or separators exist — adjacent ground colors meet edge to edge.
- **Every body block uses Outfit 400 at 1.55 line-height.** Sentence case, left-aligned (or centered on single-measure covers).
- **Every context line uses tracked caps or caption.** Context on teal bands uses sand tracked caps; on light bands, teal caption.
- **Every page mark is right-aligned tracked numerals.** 20px, 600, 0.25em tracking, in the bottom band's contrasting color.

### Typography Principles

The voice contrast is **warm poster serif ↔ geometric caption sans**. Italic appears only in DM Serif Display for a single accent word per headline at most — never in Outfit, never for whole sentences. Numerals in prose use Outfit; numerals as poster moments use burnt-orange DM Serif Display bare on the band.

Headlines may center (on poster bands) or left-align (on caption-style body slides) depending on the band's role — covers center, section slides left-align. Body is left-aligned except on centered covers. Labels are always uppercase with 0.2em+ tracking on Latin runs.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Bands are full-bleed (1920px wide, no horizontal inset) with 56px vertical / 120px horizontal inner padding. The inner content region caps at `max-width: 1680px` and centers within each band.

The primary layout is the **band stack**: sky band (teal, ~250px) → headline band (sand, ~320px) → body band (cream, flexible) → ground band (teal-deep, ~120px). Proportions flex per slide, but the top-to-bottom poster order and full-bleed edges are constant.

### Persistent Chrome

Three compact elements appear on every slide:

- **Kicker label** — `{typography.label}` bare tracked caps, top-left of the sky band. Carries context or section name.
- **Poster figure** — `{components.poster-figure}` carrying the slide's key numeral, centered in the headline band.
- **Page mark** — `{components.page-mark}` right-aligned in the ground band.

No navigation rails, no progress bars. The bands are the chrome.

### Band Discipline

Bands are full-bleed and opaque — never inset, never translucent, never rounded. Adjacent bands must always contrast (teal next to sand/cream, never teal on teal). Bands abut directly with no rules between them. If content overflows a band, rebalance band heights — never let text cross a band boundary.

## Depth and Elevation

The system practices **flat poster space**. All bands are opaque solid fills; separation comes from hue contrast between adjacent bands, not from shadow or elevation.

Shadows, glows, blurs, gradients, rules, and rounded corners do not exist anywhere in the system. Everything is square and flat; the poster figure is bare type with no badge, ring, or notch.

## Shapes and Treatment

### Border Radius

Square everywhere. Bands have zero radius; no badges, rings, notches, or chips exist. A rounded rectangle — or any circle — would read as off-metaphor.

### Border Weights

Lines do not exist: no ticket rules, no rings, no keylines, no borders. Band edges are the only boundaries, and they are ground-color changes, not strokes.

### Decorative Element Types

**Band** — Full-bleed flat color field (teal/sand/cream/leaf). The compositional unit; every slide is 3–5 bands abutting directly.

**Poster figure** — Burnt-orange DM Serif numeral at 64–72px set bare on the headline band. The slide's key figure; no badge, no ring.

**Kicker** — Bare tracked-caps label in the sky band. No keyline.

**Page mark** — Tracked 20px numerals right-aligned in the ground band.

**Meta word** — Small tracked-caps word for secondary meta. Plain type, no tag shape.

## Do's and Don'ts

### Do

- Stack full-bleed opaque bands top-to-bottom in poster order on every slide.
- Abut bands directly with no rules, notches, or separators between them.
- Set the poster figure as a bare burnt-orange DM Serif numeral on the headline band.
- Set headlines in DM Serif Display with native spacing, teal on sand or sand on teal.
- Set kickers in bare tracked Outfit caps (0.2em); no keylines.
- Keep every band edge square and full-bleed; circles do not exist.
- Alternate band grounds so adjacent bands always contrast.
- Right-align the page mark in the bottom ground band.

### Don't

- Don't inset, round, or translucify any band — full-bleed opaque squares only.
- Don't use shadows, gradients, glows, or blur anywhere.
- Don't letterspace DM Serif Display headlines or set them in burnt orange.
- Don't use Outfit for headlines/numerals or DM Serif Display for body/labels.
- Don't place body text across a band boundary — rebalance band heights instead.
- Don't stack two adjacent bands in the same ground color.
- Don't add rules, badges, rings, notches, chips, or keylines of any kind.
- Don't introduce curved dividers, diagonal cuts, or wave separators — bands are horizontal.
- Don't add a second poster figure per slide; one numeral carries the key figure.
- Don't use italic Outfit or whole-sentence serif italic — one accent word at most.

## Responsive Behavior

Vista is a **fixed-stage system** (1920×1080) under the Frontend Slides policy. This section records the source proportions for translation, not live responsive rules.

### Scaling Behavior

- Hero 76px, headline 64px, subhead 44px, body 30px at stage scale.
- Band heights (sky 248px, headline ~320px) and the poster figure size (72px) are fixed pixel values.
- Band padding (56px/120px) scales with the uniform stage transform only.

### Component Breakpoints

No breakpoints exist in the fixed-stage model. Bands are horizontal and full-width, so there is nothing to collapse; the generated deck never reflows and letterboxes instead.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp`/`ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are a brisk 450ms ease slide-up (next band stack rising like a departing train); stillness-respecting.

### Animation Triggers

Bands may rise in with a 90ms stagger on slide entry. `prefers-reduced-motion` disables it. No other ambient animation exists.

### Print Behavior

The system prints as flat poster bands: solid grounds, no shadows, no rules. Export each slide as a static 1920×1080 frame; entry animations resolve to their end state.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / poster figures | DM Serif Display 400 | Noto Serif KR 600 |
| Body / captions | Outfit 400 | Noto Sans KR 400 |
| Labels / kickers / meta lines | Outfit 600 (caps + 0.2em) | Noto Sans KR 700 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — two CJK families mirroring the Latin serif/sans split. Set display elements to `font-family: 'Noto Serif KR', serif` and work elements to `'Noto Sans KR', sans-serif`. The poster/ticket contrast survives translation. Latin runs inside CJK sentences keep their Latin faces via fallback order.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.75–1.85 (up from 1.55), display 1.25–1.35 (up from 1.1–1.15). Rebalance band heights if CJK headlines wrap taller.
- **Letter-spacing**: set to 0 on every CJK run. The 0.2em label tracking and 0.25em page-mark tracking must not apply to CJK characters.
- **Text transform**: don't apply `uppercase` to CJK text. Kickers keep their sky-band position so they still read as kickers through position.
- **Punctuation**: use full-width CJK punctuation (。，：；！？「」) in Korean sentences.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between CJK characters and adjacent Latin/digits in mixed sentences.

### Aesthetic Notes for This System

The system's poster voice transfers well: Noto Serif KR at 600 has the heft for band headlines, and the band-stack geometry is script-independent. Lean on the band contrast and the burnt-orange poster figure, which carry the travel-poster identity regardless of script.

Poster figures in CJK builds should stay Latin digits (e.g. `11`) in DM Serif Display — numerals are script-neutral and the figure keeps the poster's boldest moment intact.

### Known CJK Gap

- **No geometric-CJK work face on CDN.** Outfit's geometric caption voice has no Korean counterpart on Google Fonts; Noto Sans KR is a neutral grotesque. The caption signal must come from band contrast and tracked-Latin numerals rather than letterforms.
- **No CJK poster serif with DM's contrast.** Noto Serif KR 600 is sturdy but lower-contrast than DM Serif Display; headlines lose some poster snap. Compensate with scale (hold 76px hero) and band contrast.

## Iteration Guide

1. Any new slide stacks full-bleed opaque bands in poster order, abutting directly with no rules.
2. Any new headline uses DM Serif Display at the matching scale token with native spacing, in the band's contrasting color.
3. Any new kicker uses bare tracked Outfit caps (0.2em) in the sky band — no keyline.
4. Any new key figure uses the burnt-orange DM Serif numeral bare on the headline band — no badge, no ring.
5. Any new body block uses Outfit 400 at 1.55 in the cream/sand body band.
6. Any new band seam is a direct ground-color abutment — rules of any kind are forbidden.
7. Any new color must come from the teal/sand/orange/leaf/cream set; adjacent bands must contrast.
8. Any new secondary meta uses a plain tracked-caps word — never a chip, tag, or pill.
9. If content overflows a band, rebalance band heights; text never crosses a seam.
10. Animated elements (band rise) respect `prefers-reduced-motion`; static bands are the default.

## Known Gaps

- **Fonts**: DM Serif Display / Outfit via Google Fonts CDN (`display=swap`); fallbacks `Georgia, serif` for display / `system-ui, sans-serif` for work faces. No font files committed. Offline rendering falls back to system stacks and loses the poster voice.
- **Single display weight**: DM Serif Display ships only 400; emphasis inside headlines is limited to scale, italic accent words, or color.
- **Figure is single-numeral**: the poster figure fits 1–3 characters at 64–72px; longer figures need a smaller size (unproven).
- **No badges, rings, or notches**: the typography-only register renders none of the retired badge/notch shapes; decks must not reintroduce them.
- **Page marks are manual**: the ground-band numeral is authored per slide; there is no auto-numbering layer.
- **No dark-poster variant**: the teal/cream alternation is fixed; all-teal slides would need new text-color rules.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Band rise stagger | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A |
| 5 | Gradients | Not used | full | N/A — all fills are flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | 75% caption tints on bands | partial | Opaque approximations (pre-mixed tints) |
| 8 | Custom fonts | DM Serif Display + Outfit via Google Fonts CDN | partial | Embedded or substituted serif/sans pair |
| 9 | Absolute-positioned decor | None — in-flow type on bands | full | Native text boxes 1:1 |
