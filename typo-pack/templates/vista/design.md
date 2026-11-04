---
version: alpha
name: Vista
description: A mid-century travel-poster presentation system built on stacked horizontal bands. Display type runs in DM Serif Display for poster headlines, paired with Outfit for body and tracked caps labels. The palette stacks deep teal (`#0E3B43`) sky bands against warm sand (`#F6E7C1`) with burnt orange (`#E4572E`) for the sunburst badge and ticket rules, plus leaf green (`#A8C686`) for secondary fills. Bands are separated by dashed ticket-perforation rules; a circular sunburst numeral badge anchors each composition. Depth is flat poster space — solid fills, dashed rules, no shadows.
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
    description: "Full-bleed flat band in teal, sand, cream, or leaf. Bands stack top-to-bottom with ticket rules between; edges always full-bleed, never inset."
  ticket-rule:
    borderTop: "3px dashed {colors.burnt-orange}"
    description: "3px dashed burnt-orange perforation line separating bands. Full-bleed with circular notch cutouts at both edges."
  notch:
    width: 56px
    height: 56px
    borderRadius: 999px
    description: "Circular ground-colored notch punched at each end of a ticket rule to mimic a torn ticket stub."
  sunburst:
    width: 196px
    height: 196px
    borderRadius: 999px
    background: "{colors.burnt-orange}"
    color: "{colors.sand}"
    description: "Burnt-orange circle carrying the slide's key numeral in DM Serif Display, ringed by a radiating dashed burnt-orange ring."
  sunburst-ring:
    border: "3px dashed {colors.burnt-orange}"
    borderRadius: 999px
    offset: 14px
    description: "Radiating dashed ring floating 14px outside the sunburst badge, suggesting sun rays. Burnt orange (not sand) so the ring stays visible across both the teal sky and the sand headline band."
  keyline:
    height: 2px
    background: "{colors.sand}"
    description: "Thin keyline rule under tracked caps labels on teal bands. Sand on teal, teal on sand."
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

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Vista is a **mid-century travel-poster presentation system**. Its foundational premise is the band stack: every slide reads as sky band / headline band / ticket rule / body band, each a flat solid fill with full-bleed edges. Layouts move top to bottom like a journey — teal sky, sand headline field, dashed perforation, body ground — with a sunburst badge carrying the slide's key numeral. Corners are square, fills are opaque, and ornament is limited to perforations, badges, and thin keylines.

The type stack is two faces. **DM Serif Display** (weight 400, the face's only weight) is the poster face — a high-contrast modern serif with mid-century warmth carrying hero titles, headlines, subheads, and badge numerals. **Outfit** is the work face — a clean geometric sans used for body (400) and tracked caps labels (600). The serif-poster / sans-ticket contrast echoes a railway poster crossed with a boarding pass.

The palette stacks **deep teal** (`{colors.deep-teal}`) sky bands against **warm sand** (`{colors.sand}`) with **burnt orange** (`{colors.burnt-orange}`) for the sunburst badge and ticket rules, plus **leaf green** (`{colors.leaf}`) for secondary fills and **cream white** (`{colors.cream-white}`) for body grounds. Teal and sand alternate as grounds; burnt orange never carries body text.

Depth is **flat poster space**: solid fills, dashed rules, no shadows, no gradients, no blur. Band contrast does all the separation work.

**Density philosophy: poster-bold but ticket-tidy.** A typical slide carries one kicker, one headline, one ticket rule, one body block, and one badge. Bands keep elements separated without whitespace oceans; padding inside bands is moderate (56px vertical, 120px horizontal) because the band edges themselves structure the slide.

**Key Characteristics:**
- Stacked band layout (`{components.band}`) — full-bleed flat bands in teal/sand/cream reading top-to-bottom like a poster horizon.
- Ticket-stub dashed rules (`{components.ticket-rule}`) — 3px dashed burnt-orange perforations with notch cutouts separating bands.
- Sunburst numeral badge (`{components.sunburst}`) — burnt-orange circle with radiating dashed ring carrying the key figure.
- Poster-serif headlines (`{typography.headline}`) — DM Serif Display, teal on sand or sand on teal, never letterspaced.
- Tracked Outfit caps labels (`{typography.label}`) — 0.2em tracked uppercase kickers on thin keyline rules.
- Flat opaque fills only — zero shadows, zero gradients, zero blur.

## Colors

### Palette

- **Deep Teal** (`{colors.deep-teal}` — `#0E3B43`): The sky color. Top bands, bottom bands, headline text on sand, body text on cream.
- **Teal Deep** (`{colors.teal-deep}` — `#0A2D34`): A darker teal for the bottom-most ground band and notch fills. Used sparingly for anchoring.
- **Sand** (`{colors.sand}` — `#F6E7C1`): The headline field. Warm mid ground carrying teal poster type; also badge-numeral color on orange.
- **Sand Deep** (`{colors.sand-deep}` — `#EDD9A8`): Darker sand for alternating sub-bands and keyline accents on cream.
- **Burnt Orange** (`{colors.burnt-orange}` — `#E4572E`): The signal color. Sunburst badge fill, ticket rules, kickers' keylines, rare headline emphasis. Never body text.
- **Leaf** (`{colors.leaf}` — `#A8C686`): Secondary fill for side panels and small chips. A cool counterpoint to the warm sand.
- **Cream White** (`{colors.cream-white}` — `#FFFDF6`): Body ground. Lighter than sand, used for text-heavy bands to maximize legibility.

### Defaults

- **Default band order (cover)**: teal sky → sand headline → ticket rule → cream body → teal ground. Alternate teal/sand so adjacent bands always contrast.
- **Default headline color**: `{colors.deep-teal}` on sand; `{colors.sand}` on teal. Never orange headlines, never low-contrast pairings.
- **Default body text color**: `{colors.deep-teal}` on cream/sand; `{colors.sand}` on teal.
- **Default ticket-rule color**: `{colors.burnt-orange}` dashed, full-bleed, with notches.
- **Default badge fill**: `{colors.burnt-orange}` with `{colors.sand}` numeral and dashed burnt-orange ring.
- **Default keyline**: 2px sand on teal bands, 2px teal on sand/cream bands.
- **Default caption color**: teal at 75% on light bands, sand at 75% on teal bands.

When a slide needs a cooler moment, swap one sand band for leaf — but keep the teal/cream text rules and the orange ticket signals unchanged.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**DM Serif Display** is the poster face — a high-contrast modern serif with bracketed warmth, available only in weight 400 (plus italic). Used for hero titles, headlines, subheads, and badge numerals. Its poster scale and contrast are the system's display voice; a grotesque or slab replacement would erase the travel-poster feel.

**Outfit** is the work face — a clean geometric sans. Used for body (400), labels and ticket stubs (600 tracked caps), captions (400), and page marks (600). Its geometric clarity reads as the "ticket" voice against the poster's serif.

Never use Outfit for headlines or badge numerals, never use DM Serif Display for body, labels, or captions. The serif-poster / sans-ticket split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.hero}` | 76px | DM Serif Display | 400 | Cover display title |
| `{typography.headline}` | 64px | DM Serif Display | 400 | Primary section headline |
| `{typography.subhead}` | 44px | DM Serif Display | 400 | Region-level subheading |
| `{typography.badge-numeral}` | 72px | DM Serif Display | 400 | Numeral inside sunburst badge |
| `{typography.body}` | 30px | Outfit | 400 | Paragraph body |
| `{typography.body-sm}` | 25px | Outfit | 400 | Secondary body, list items |
| `{typography.label}` | 22px | Outfit | 600 | Tracked caps kicker label |
| `{typography.ticket-stub}` | 20px | Outfit | 600 | Small caps line on ticket stubs |
| `{typography.caption}` | 21px | Outfit | 400 | Captions, context lines |
| `{typography.page-mark}` | 20px | Outfit | 600 | Page numeral, tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline uses DM Serif Display with native spacing.** Never letterspace the poster serif; tracking on DM Serif Display breaks its rhythm.
- **Every kicker is tracked Outfit caps on a keyline.** 22px, 600 weight, 0.2em tracking, uppercase, sitting on a 2px keyline rule.
- **Every badge numeral is DM Serif 72px in sand on burnt orange.** The numeral is the slide's key figure; the dashed burnt-orange ring floats 14px outside the badge.
- **Every ticket rule is 3px dashed burnt orange.** Full-bleed with circular punched-hole notches (56px, teal-deep) centered on the rule at both edges.
- **Every body block uses Outfit 400 at 1.55 line-height.** Sentence case, left-aligned (or centered on single-measure covers).
- **Every context line uses tracked caps or caption.** Context on teal bands uses sand tracked caps; on light bands, teal caption.
- **Every page mark is right-aligned tracked numerals.** 20px, 600, 0.25em tracking, in the bottom band's contrasting color.

### Typography Principles

The voice contrast is **warm poster serif ↔ geometric ticket sans**. Italic appears only in DM Serif Display for a single accent word per headline at most — never in Outfit, never for whole sentences. Numerals in prose use Outfit; numerals as poster moments use DM Serif Display inside the sunburst badge.

Headlines may center (on poster bands) or left-align (on ticket-style body slides) depending on the band's role — covers center, section slides left-align. Body is left-aligned except on centered covers. Labels are always uppercase with 0.2em+ tracking on Latin runs.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Bands are full-bleed (1920px wide, no horizontal inset) with 56px vertical / 120px horizontal inner padding. The inner content region caps at `max-width: 1680px` and centers within each band.

The primary layout is the **band stack**: sky band (teal, ~250px) → headline band (sand, ~320px) → ticket rule → body band (cream, flexible) → ground band (teal-deep, ~120px). Proportions flex per slide, but the top-to-bottom poster order and full-bleed edges are constant.

### Persistent Chrome

Three compact elements appear on every slide:

- **Kicker label** — `{typography.label}` tracked caps on a keyline, top-left of the sky band. Carries context or section name.
- **Sunburst badge** — `{components.sunburst}` carrying the slide's key numeral, docked at the sky/headline boundary (overlapping both bands).
- **Page mark** — `{components.page-mark}` right-aligned in the ground band.

No navigation rails, no progress bars. The bands and ticket rules are the chrome.

### Band Discipline

Bands are full-bleed and opaque — never inset, never translucent, never rounded. Adjacent bands must always contrast (teal next to sand/cream, never teal on teal). Ticket rules separate the headline band from the body band on every slide; additional rules may separate further bands but never appear inside a band. If content overflows a band, rebalance band heights — never let text cross a band boundary.

## Depth and Elevation

The system practices **flat poster space**. All bands are opaque solid fills; separation comes from hue contrast between adjacent bands, not from shadow or elevation.

Shadows, glows, blurs, gradients, and rounded corners do not exist anywhere in the system — with one deliberate exception: the sunburst badge and ticket notches are circular, because the ticket/poster metaphor requires them. Everything else is square and flat.

The badge overlaps the sky/headline boundary by design (docked, not floating) — the overlap is a poster layering cue, not an elevation cue, and carries no shadow.

## Shapes and Treatment

### Border Radius

Square everywhere except the badge system. Bands, panels, chips, and rules have zero radius. Circles appear only as the sunburst badge (196px), its dashed ring, and ticket-notch cutouts (56px). A rounded rectangle would read as off-metaphor.

### Border Weights

- **3px dashed burnt orange** — ticket rules (the system's dominant line).
- **3px dashed burnt orange** — sunburst radiating ring.
- **2px solid** — keylines under labels (sand on teal, teal on sand).
- Solid borders on containers do not exist; band edges are the boundaries.

### Decorative Element Types

**Band** — Full-bleed flat color field (teal/sand/cream/leaf). The compositional unit; every slide is 3–5 bands.

**Ticket rule** — 3px dashed burnt-orange perforation with 56px circular notches at both edges. Separates headline and body bands on every slide.

**Sunburst badge** — 196px burnt-orange circle with a 72px DM Serif sand numeral, ringed by a dashed burnt-orange circle floating 14px out. Docked at the sky/headline seam.

**Keyline** — 2px thin rule under tracked caps labels. Sand on teal, teal on sand.

**Page mark** — Tracked 20px numerals right-aligned in the ground band.

**Leaf chip** — Small square (zero radius) leaf-green tag for secondary meta. The only chip in the system; square, not round.

## Do's and Don'ts

### Do

- Stack full-bleed opaque bands top-to-bottom in poster order on every slide.
- Separate the headline and body bands with a dashed ticket rule + notches.
- Dock the sunburst badge at the sky/headline seam with its radiating dashed ring.
- Set headlines in DM Serif Display with native spacing, teal on sand or sand on teal.
- Set kickers in tracked Outfit caps (0.2em) on a 2px keyline.
- Keep every band edge square and full-bleed; circles belong to the badge system only.
- Alternate band grounds so adjacent bands always contrast.
- Right-align the page mark in the bottom ground band.

### Don't

- Don't inset, round, or translucify any band — full-bleed opaque squares only.
- Don't use shadows, gradients, glows, or blur anywhere, including under the badge.
- Don't letterspace DM Serif Display headlines or set them in burnt orange.
- Don't use Outfit for headlines/numerals or DM Serif Display for body/labels.
- Don't place body text across a band boundary — rebalance band heights instead.
- Don't stack two adjacent bands in the same ground color.
- Don't use solid rules where the ticket perforation belongs (band seams are dashed).
- Don't introduce curved dividers, diagonal cuts, or wave separators — bands are horizontal.
- Don't add a second badge per slide; one sunburst carries the key figure.
- Don't use italic Outfit or whole-sentence serif italic — one accent word at most.

## Responsive Behavior

Vista is a **fixed-stage system** (1920×1080) under the Frontend Slides policy. This section records the source proportions for translation, not live responsive rules.

### Scaling Behavior

- Hero 76px, headline 64px, subhead 44px, body 30px at stage scale.
- Band heights (sky 248px, headline ~320px), badge 196px, notches 56px, dashes 3px are fixed pixel values.
- Band padding (56px/120px) scales with the uniform stage transform only.

### Component Breakpoints

No breakpoints exist in the fixed-stage model. Bands are horizontal and full-width, so there is nothing to collapse; the generated deck never reflows and letterboxes instead.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp`/`ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are a brisk 450ms ease slide-up (next band stack rising like a departing train); stillness-respecting.

### Animation Triggers

Bands may rise in with a 90ms stagger on slide entry; the badge ring may rotate slowly (60s loop). `prefers-reduced-motion` disables both. No other ambient animation exists.

### Print Behavior

The system prints as flat poster bands: solid fills, no shadows to band, dashed rules reproduce cleanly. Export each slide as a static 1920×1080 frame; entry animations resolve to their end state.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / badge numerals | DM Serif Display 400 | Noto Serif KR 600 |
| Body / captions | Outfit 400 | Noto Sans KR 400 |
| Labels / kickers / ticket stubs | Outfit 600 (caps + 0.2em) | Noto Sans KR 700 (no transform, no tracking) |

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
- **Text transform**: don't apply `uppercase` to CJK text. Kickers keep their keyline rule so they still read as kickers through position.
- **Punctuation**: use full-width CJK punctuation (。，：；！？「」) in Korean sentences.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between CJK characters and adjacent Latin/digits in mixed sentences.

### Aesthetic Notes for This System

The system's poster voice transfers well: Noto Serif KR at 600 has the heft for band headlines, and the band/ticket/badge geometry is script-independent. Lean on the **non-typographic** elements — orange perforations, the sunburst badge, band contrast — which carry the travel-poster identity regardless of script.

Badge numerals in CJK builds should stay Latin digits (e.g. `11`) in DM Serif Display — numerals are script-neutral and the badge keeps its poster-most element intact.

### Known CJK Gap

- **No geometric-CJK work face on CDN.** Outfit's geometric ticket voice has no Korean counterpart on Google Fonts; Noto Sans KR is a neutral grotesque. The ticket signal must come from dashes, keylines, and tracked-Latin numerals rather than letterforms.
- **No CJK poster serif with DM's contrast.** Noto Serif KR 600 is sturdy but lower-contrast than DM Serif Display; headlines lose some poster snap. Compensate with scale (hold 76px hero) and band contrast.

## Iteration Guide

1. Any new slide stacks full-bleed opaque bands in poster order with the ticket rule between headline and body.
2. Any new headline uses DM Serif Display at the matching scale token with native spacing, in the band's contrasting color.
3. Any new kicker uses tracked Outfit caps (0.2em) on a 2px keyline in the sky band.
4. Any new key figure uses the sunburst badge (196px orange, sand serif numeral, dashed ring) docked at the sky/headline seam.
5. Any new body block uses Outfit 400 at 1.55 in the cream/sand body band.
6. Any new band seam uses the 3px dashed orange ticket rule with 56px notches — never a solid line.
7. Any new color must come from the teal/sand/orange/leaf/cream set; adjacent bands must contrast.
8. Any new secondary meta uses the square leaf chip — never a round pill.
9. If content overflows a band, rebalance band heights; text never crosses a seam.
10. Animated elements (band rise, ring rotation) respect `prefers-reduced-motion`; static bands are the default.

## Known Gaps

- **Fonts**: DM Serif Display / Outfit via Google Fonts CDN (`display=swap`); fallbacks `Georgia, serif` for display / `system-ui, sans-serif` for work faces. No font files committed. Offline rendering falls back to system stacks and loses the poster voice.
- **Single display weight**: DM Serif Display ships only 400; emphasis inside headlines is limited to scale, italic accent words, or color.
- **Badge is single-numeral**: the 196px badge fits 1–3 characters; longer figures need a smaller numeral size or a wider oval (unproven).
- **Notches are painted**: the 56px ticket notches are absolutely-positioned ground-colored circles; they assume opaque adjacent bands.
- **Page marks are manual**: the ground-band numeral is authored per slide; there is no auto-numbering layer.
- **No dark-poster variant**: the teal/cream alternation is fixed; all-teal slides would need new text-color rules.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Band rise stagger; badge-ring 60s rotation | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A |
| 5 | Gradients | Not used | full | N/A — all fills are flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | 75% caption tints on bands | partial | Opaque approximations (pre-mixed tints) |
| 8 | Custom fonts | DM Serif Display + Outfit via Google Fonts CDN | partial | Embedded or substituted serif/sans pair |
| 9 | Absolute-positioned decor | Badge, ring, notches, keylines | full | Grouped native shapes |
