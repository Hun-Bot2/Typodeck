---
version: alpha
name: Fika
description: A Scandinavian soft-functional presentation system built on warmth and restraint. Display type runs in Fraunces (weight 500, lowercase headlines) paired with Nunito Sans for body and tracked caps labels. The palette stays on warm off-white (`#FAFAF7`) with slate text (`#31404B`), fjord navy (`#182B49`) for chip text and small marks, and three muted pastels — sage, blush, dusty blue — as flat panel fills and chips. Depth is nearly absent: matte surfaces, 16–24px corner radii, and at most one whisper-soft lift shadow. Layouts breathe through an airy two-column rhythm with huge gutters. The effect is a quiet kitchen table, not a stage.
colors:
  off-white: "#FAFAF7"
  slate: "#31404B"
  fjord: "#182B49"
  sage: "#A8C3B9"
  blush: "#E8B4A0"
  dusty-blue: "#7FA6C9"
  white: "#FFFFFF"
  sage-wash: "#DCE8E3"
  blush-wash: "#F5DCD2"
  blue-wash: "#D5E4F1"
shadows:
  lift: "0 8px 24px rgba(49, 64, 75, 0.08)"
  lift-lg: "0 16px 40px rgba(49, 64, 75, 0.10)"
  none: "none"
typography:
  hero:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "88px"
    fontWeight: 500
    lineHeight: 1.12
    textTransform: lowercase
  headline:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "72px"
    fontWeight: 500
    lineHeight: 1.12
    textTransform: lowercase
  subhead:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.2
    textTransform: lowercase
  data-numeral:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "240px"
    fontWeight: 500
    lineHeight: 1
  body:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.15em
    textTransform: uppercase
  chip:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.04em
  caption:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
  page-mark:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.2em
spacing:
  radius-panel: 24px
  radius-card: 16px
  radius-chip: 999px
  pad-slide-y: 96px
  pad-slide-x: 120px
  gap-col: 96px
  gap-stack-lg: 48px
  gap-stack-md: 32px
  gap-stack-sm: 20px
  chip-pad: "14px 28px"
  content-max-width: 1680px
canvas:
  width: 1920px
  height: 1080px
components:
  soft-panel:
    background: "{colors.sage-wash}"
    borderRadius: "{spacing.radius-panel}"
    padding: "64px"
    boxShadow: "{shadows.none}"
    description: "Large rounded companion panel in a pastel wash (sage/blush/blue rotate). Holds data numerals, figure captions, or a short list. No border, no shadow."
  chip:
    background: "{colors.blush}"
    color: "{colors.fjord}"
    padding: "{spacing.chip-pad}"
    borderRadius: "{spacing.radius-chip}"
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 700
    description: "999px pastel pill for key phrases. Pastel fills rotate sage → blush → dusty-blue; text always fjord navy (slate fails AA on dusty-blue at 4.17:1; fjord passes at 5.54:1)."
  kicker-dot:
    width: 14px
    height: 14px
    borderRadius: 999px
    background: "{colors.fjord}"
    description: "Small solid dot preceding the kicker label. Default fjord navy; may rotate with the slide's accent pastel for variety."
  rule-soft:
    height: 2px
    background: "{colors.sage-wash}"
    borderRadius: 2px
    description: "Low-contrast divider between context line and body. Never dark, never heavy."
  page-mark:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 700
    letterSpacing: 0.2em
    color: "{colors.slate}"
    description: "Bottom-left page numeral in tracked caps numerals (e.g. 01). Low-key, no rule, no box."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Fika is a **Scandinavian soft-functional presentation system**. Its foundational premise is friendliness through geometry: every container is rounded (16px cards, 24px panels, 999px chips), every headline is lowercase, every color is muted to a pastel register. Layouts breathe through huge gutters and an airy two-column rhythm — text on the left at roughly 58% width, one soft tinted companion panel on the right — and whitespace does the structuring work that rules and grids do in harder systems.

The type stack is two faces. **Fraunces** (weight 500) is the display face — a soft, slightly wonky serif with old-style warmth that carries headlines, subheads, and large data numerals, always in lowercase for headline runs. **Nunito Sans** is the work face — a rounded humanist sans used for body at 400 and for labels, chips, and captions at 700. The serif/sans contrast is gentle by design: neither face ever shouts.

The palette stays on warm **off-white** (`{colors.off-white}`) with **slate** text (`{colors.slate}`), **fjord navy** (`{colors.fjord}`) for chip text and small marks, and three muted pastels — **sage**, **blush**, **dusty blue** — plus 35%-mix washes of each for large panel fills. Pastels are fills, never text: body and headlines are always slate on light grounds, chip text is always fjord. The result is calm without being cold — color reads as furniture, not signal.

Depth is the system's deliberate absence: **matte surfaces, no gradients, no gloss, no hard shadows**. At most one soft lift shadow (`{shadows.lift}`) appears per slide, usually under the companion panel. Rounded corners plus flat fills plus whitespace create all the separation the system needs.

**Density philosophy: sparse and unhurried.** A typical slide carries one headline, one short body block, and one companion moment (a data numeral, three chips, or a short list). If a slide feels busy, remove an element rather than shrinking anything. Generous padding (96px vertical, 120px horizontal) is structural, not decorative.

**Key Characteristics:**
- Lowercase Fraunces headlines (`{typography.headline}`) — weight 500, sentence meaning set entirely in lowercase.
- Soft rounded panels (`{components.soft-panel}`) — 24px radii, flat pastel-wash fills, zero borders.
- Muted pastel chips (`{components.chip}`) — 999px pills in rotating pastels with fjord navy text.
- Airy two-column rhythm — text left (~58%), one tinted panel right, gutters ≥ 96px.
- Matte surface discipline — no gradients, no gloss, no hard shadows; at most one whisper lift shadow.
- Fraunces old-style numerals for data moments inside pastel panels.

## Colors

### Palette

- **Off-White** (`{colors.off-white}` — `#FAFAF7`): The universal ground. Every slide starts here; panels and text sit on it.
- **Slate** (`{colors.slate}` — `#31404B`): The body text color. Headlines, body, labels, captions — all slate. Never pure black.
- **Fjord** (`{colors.fjord}` — `#182B49`): Deep sophisticated navy for chip text and the kicker dot. Passes AA on every pastel fill (sage 7.55, blush 7.75, dusty-blue 5.54) where slate fails on dusty-blue (4.17).
- **Sage** (`{colors.sage}` — `#A8C3B9`): First pastel. Chip fills, dots, small accents, and the wash source for large panels.
- **Blush** (`{colors.blush}` — `#E8B4A0`): Second pastel. Rotates with sage for chips and companion panels.
- **Dusty Blue** (`{colors.dusty-blue}` — `#7FA6C9`): Third pastel. Chip fills and wash source only; the kicker dot defaults to fjord.
- **White** (`{colors.white}` — `#FFFFFF`): Reserved for small floating cards over pastel panels (rare) and chip text reversal — never a slide ground.
- **Sage Wash** (`{colors.sage-wash}` — `#DCE8E3`): 35%-mix sage for large panel fills so big areas stay quiet.
- **Blush Wash** (`{colors.blush-wash}` — `#F5DCD2`): 35%-mix blush for large panel fills.
- **Blue Wash** (`{colors.blue-wash}` — `#D5E4F1`): 35%-mix dusty blue for large panel fills.

### Defaults

- **Default surface background**: `{colors.off-white}` flat. No texture, no grid, no vignette.
- **Default headline color**: `{colors.slate}` — pastels never carry headline text.
- **Default body text color**: `{colors.slate}` at full opacity; secondary captions at 72% opacity.
- **Default companion-panel fill**: `{colors.sage-wash}`; rotate to blush-wash then blue-wash across consecutive slides.
- **Default chip fills**: rotate sage → blush → dusty-blue at full pastel strength with fjord text.
- **Default divider**: `{components.rule-soft}` — 2px sage-wash line, never dark.
- **Default accent for dots and small marks**: `{colors.fjord}`.

### Pastel Policy

Pastels exist only with a deliberate contrast role in this system: full-strength pastels are chip fills behind fjord text; washes are large panel fills behind slate text (all ≥ 8.1:1). Pastels are never text colors, never grounds for pale text, and never layered on pale grounds to carry meaning by color alone — chips and dots always pair with adjacent text labels. No new pastel may join the three without a documented text pairing that passes AA. See `evals/typo-only/color.md` for the shared rule and measurements.

When a slide needs a warmer or cooler cast, switch the companion panel to the blush or blue wash — but keep all text slate and the ground off-white.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Fraunces** is the display face — a soft serif with old-style proportions and gentle irregularity. Used for hero titles, headlines, subheads, and large data numerals. Headline runs are always lowercase (`text-transform: lowercase`), which is the system's most recognizable typographic move. Weight is always 500; heavier weights would break the softness.

**Nunito Sans** is the work face — a rounded humanist sans. Used for body (400), labels and chips (700), captions (400), and page marks (700). Its roundness echoes the container radii and keeps small text friendly.

Never use Fraunces for body or labels, never use Nunito Sans for headlines or data numerals. The serif-display / sans-work split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.hero}` | 88px | Fraunces | 500 | Cover display title, lowercase |
| `{typography.headline}` | 72px | Fraunces | 500 | Primary section headline, lowercase |
| `{typography.subhead}` | 40px | Fraunces | 500 | Region-level subheading, lowercase |
| `{typography.data-numeral}` | 240px | Fraunces | 500 | Data numeral inside companion panel |
| `{typography.body}` | 32px | Nunito Sans | 400 | Paragraph body |
| `{typography.body-sm}` | 24px | Nunito Sans | 400 | Secondary body, list items |
| `{typography.label}` | 22px | Nunito Sans | 700 | Tracked caps kicker label |
| `{typography.chip}` | 22px | Nunito Sans | 700 | Chip text (not tracked) |
| `{typography.caption}` | 20px | Nunito Sans | 400 | Captions, context lines |
| `{typography.page-mark}` | 20px | Nunito Sans | 700 | Page numeral, tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline is lowercase.** Apply `text-transform: lowercase` to every hero, headline, and subhead. Capitalized display type breaks the friendly voice instantly.
- **Every display run uses Fraunces 500.** No other weight, no italic in headlines. Data numerals use the same face and weight at 240px.
- **Every kicker label is tracked caps.** Nunito Sans 700, 22px, 0.15em tracking, uppercase, preceded by a `{components.kicker-dot}`.
- **Every chip uses Nunito Sans 700 untracked.** Chips are sentence-case short phrases, never uppercase, never letterspaced. Chips must carry new labels (section tags, dates, format notes) — never headline or subtitle words restated.
- **Every body block uses line-height 1.6.** Nunito Sans needs the air; tighter leading feels cramped against the huge gutters.
- **Every caption/context line is 20–24px Nunito Sans 400.** Context never uses the display serif.

### Typography Principles

The voice contrast is **soft serif display ↔ rounded sans work**. Italic appears only as an occasional emphasis inside body text — never in headlines, never in labels. Numerals in prose use Nunito Sans; numerals as data moments use Fraunces at large sizes inside pastel panels.

Fraunces should always feel **settled** — left-aligned, generous line-height (1.12–1.2), never centered for multi-line runs (centering is permitted on the cover title only when the layout is single-column). Nunito Sans body is always left-aligned, sentence case.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Default slide padding is 96px vertical and 120px horizontal. The inner content region caps at `max-width: 1680px` and centers, so content keeps a calm measure while the off-white ground fills the stage.

The primary layout is **airy two-column**: text column left at ~58% width, one companion panel right at ~34% width, with a ≥96px gutter between them. Single-column centered layouts are permitted for cover and section-divider slides only.

### Persistent Chrome

Two quiet elements appear on every slide:

- **Kicker row** — `{components.kicker-dot}` + tracked-caps label in Nunito Sans 700, top-left of the content region. Carries the deck's context line or section name.
- **Page mark** — `{components.page-mark}` in Nunito Sans 700 tracked numerals (`01`), bottom-left of the content region at 20px.

No navigation rails, no progress bars, no heavy footers. Chrome stays whisper-quiet so the pastels and whitespace dominate.

### Gutter Discipline

Gutters are structural. Column gap is never under 96px; stack gaps are 48px (headline→body), 32px (body→chips), 20px (tight list items). Nothing touches the viewport edge — the 120px horizontal padding is a hard minimum. If content overflows, shorten the copy or drop a chip; never compress the gutters.

## Depth and Elevation

The system practices **matte flatness**. Surfaces are opaque flat fills; separation comes from color difference (wash panel vs off-white ground) and whitespace, not from shadow.

One soft shadow exists: `{shadows.lift}` (`0 8px 24px rgba(49,64,75,0.08)`), used at most once per slide — typically under the companion panel or a floating white card. A larger variant (`{shadows.lift-lg}`) is reserved for cover slides. Hard offset shadows, glows, blurs, and gradients do not exist anywhere in the system.

Corner radius carries the elevation signal instead: larger panels get 24px radii, inner cards 16px, chips 999px. The eye reads roundness + tint as "raised" without any shadow help.

## Shapes and Treatment

### Border Radius

Roundness is the primary shape language. Panels use 24px, cards 16px, chips and dots fully round (999px). Square corners appear nowhere — a sharp corner would read as a mistake against the system's softness.

### Border Weights

Borders effectively do not exist. Panels, chips, and cards have no strokes; dividers are 2px tint fills (`{components.rule-soft}`), not borders. If a boundary is needed, use a wash fill change instead of a line.

### Decorative Element Types

**Soft panel** — Large 24px-radius rectangle in a pastel wash holding a data numeral, figure, or short list. No border, no shadow (or one lift shadow). The slide's right-hand companion.

**Chip** — 999px pastel pill in rotating sage/blush/dusty-blue with fjord Nunito Sans 700 text. Appears in rows of 2–4 under body copy for key phrases.

**Kicker dot** — 14px solid pastel dot preceding the kicker label. The smallest color moment on the slide; rotates with the accent pastel.

**Soft rule** — 2px sage-wash divider between context and body. Low contrast by design.

**Page mark** — Tracked 20px numerals bottom-left. No rule, no box, no ornament.

**Data numeral** — Fraunces 500 at 240px inside a companion panel with a small caption beneath. The system's one allowed "big number" moment.

## Do's and Don'ts

### Do

- Set every headline in lowercase Fraunces 500. The lowercase treatment is the voice.
- Keep headlines, body, and labels slate on light grounds and chip text fjord; pastels are fills, never text colors.
- Rotate companion-panel washes (sage → blush → blue) across consecutive slides for gentle variety.
- Hold the ≥96px column gutter and 120px page padding as hard minimums.
- Use chips for key content phrases in rows of 2–4, rotating pastel fills.
- Let whitespace structure the slide; reach for a wash panel before reaching for a rule.
- Render data moments as Fraunces numerals inside pastel panels with small captions.
- Keep the kicker row and page mark quiet and consistent on every slide.

### Don't

- Don't capitalize display type or add letterspacing to Fraunces headlines.
- Don't use hard shadows, glows, gradients, or gloss anywhere — matte only.
- Don't place body text in a pastel color or on a saturated ground.
- Don't use square corners on any container; roundness is non-negotiable.
- Don't add borders, keylines, or grid wallpapers — fills and whitespace separate.
- Don't exceed one soft shadow per slide or use shadows on text.
- Don't use Fraunces for body/labels or Nunito Sans for headlines/numerals.
- Don't crowd the slide; if it feels busy, remove an element rather than shrinking type.
- Don't introduce a fourth pastel or a saturated neon — the palette is slate + fjord text colors plus three muted pastels plus washes.
- Don't center multi-line body text; left-align everywhere except single-column covers.

## Responsive Behavior

Fika is a **fixed-stage system** (1920×1080) under the Frontend Slides policy. This section records the source proportions for translation, not live responsive rules.

### Scaling Behavior

- Hero 88px, headline 72px, subhead 40px, body 32px at stage scale.
- Panel radii (24px), card radii (16px), and chip padding are fixed pixel values.
- The 96px column gutter and 120px page padding scale with the uniform stage transform only.

### Component Breakpoints

No breakpoints exist in the fixed-stage model. In a hypothetical fluid build, the two-column layout would stack below 900px width and chips would wrap — but the generated deck never reflows; it letterboxes.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp`/`ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are a soft 500ms ease fade/slide; motion is minimal by design.

### Animation Triggers

Chips and panels may fade in with a 120ms stagger on slide entry. The `prefers-reduced-motion` media query disables all entry motion. No ambient animation exists — stillness is part of the calm.

### Print Behavior

The system prints cleanly: flat fills, no shadows to band, no dark grounds to drain ink. Export each slide as a static 1920×1080 frame; entry animations resolve to their end state.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / data numerals | Fraunces 500 (lowercase) | Noto Serif KR 600 |
| Body / chips / captions | Nunito Sans 400–700 | Noto Sans KR 400–700 |
| Labels / kickers | Nunito Sans 700 (caps + 0.15em) | Noto Sans KR 700 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — two CJK families mirroring the Latin serif/sans split. Set display elements to `font-family: 'Noto Serif KR', serif` and work elements to `'Noto Sans KR', sans-serif`. The serif/sans contrast survives translation, which preserves more of the system's voice than collapsing to one face. Latin runs inside CJK sentences (e.g. `Typodeck Research`) keep their Latin faces via the font stack fallback order.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Noto+Serif+KR:wght@600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.8–1.9 (up from 1.6), display 1.3–1.4 (up from 1.12–1.2).
- **Letter-spacing**: set to 0 on every CJK run. The 0.15em kicker tracking and 0.2em page-mark tracking must not apply to CJK characters.
- **Text transform**: don't apply `lowercase` or `uppercase` to CJK text — CJK has no case. The friendly voice carries through panels and round geometry instead.
- **Punctuation**: use full-width CJK punctuation (。，：；！？「」) in Korean sentences.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between CJK characters and adjacent Latin/digits (e.g. `11개 포스트모템` keeps the digit run intact; mixed phrases like `리뷰 원칙` need no internal spaces).

### Aesthetic Notes for This System

The system's lowercase-Fraunces voice cannot transfer to CJK (no case, no Fraunces equivalent). Compensate by leaning on the **non-typographic** signature elements: pastel washes, 24px roundness, huge gutters, and chips carry the friendliness on their own. Noto Serif KR at 600 gives display headlines enough softness to sit in Fraunces's place.

Kicker labels lose their tracked-caps treatment in CJK; keep the kicker dot + keyline position so the row still reads as a kicker through layout rather than tracking.

### Known CJK Gap

- **No rounded-CJK work face on CDN.** Nunito Sans's roundness has no Korean counterpart on Google Fonts; Noto Sans KR is a neutral grotesque. The roundness voice must come from container radii and chips, not letterforms.
- **No lowercase signal in CJK.** The system's most recognizable move (lowercase headlines) vanishes. Do not fake it with smaller sizes — keep display scale and let panels carry the identity.

## Iteration Guide

1. Any new slide starts on the off-white ground with 96px/120px padding, a kicker row, and a page mark.
2. Any new headline uses Fraunces 500 lowercase at the matching scale token. Any new body uses Nunito Sans 400. Any new label uses Nunito Sans 700 tracked caps.
3. Any new companion panel uses a pastel wash fill (rotate sage → blush → blue) at 24px radius with no border.
4. Any new key-phrase row uses 2–4 chips with rotating full-strength pastel fills and fjord text.
5. Any new data moment uses a Fraunces 240px numeral inside a wash panel with a 20px caption beneath.
6. Any new divider uses the 2px sage-wash soft rule — never a dark line.
7. Any new shadow must be the single allowed lift shadow per slide; when in doubt, use none.
8. Any new color must come from slate + fjord + the three pastels + washes; no fourth pastel, no saturation boosts.
9. If a slide feels crowded, remove an element or move it to a companion panel — never shrink type below its token.
10. Animated elements (chip/panel fade-ins) respect `prefers-reduced-motion`; stillness is the default.

## Known Gaps

- **Fonts**: Fraunces / Nunito Sans via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", Georgia, serif` for display / `system-ui, sans-serif` for work faces. No font files committed. Offline rendering falls back to system stacks and loses the soft-serif voice.
- **Lowercase is a transform**: headlines rely on `text-transform: lowercase`; export targets without transform support must lowercase the source strings instead.
- **Single lift shadow**: decks with many floating cards per slide cannot stack shadows; flatten extra cards onto wash fills.
- **Wash fills are flat tints**: there is no texture or gradient fallback needed — panels are already solid colors.
- **Page marks are manual**: the `01` numeral is authored per slide; there is no auto-numbering layer.
- **No dark mode**: the system is light-ground only; dark slides would need a new palette, not an inversion.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Chip/panel fade-in stagger (120ms) | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A |
| 5 | Gradients | Not used | full | N/A — all fills are flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Lift shadow `rgba(49,64,75,0.08)`; 72% caption opacity | partial | Opaque approximations (drop shadow or flatten to solid) |
| 8 | Custom fonts | Fraunces + Nunito Sans via Google Fonts CDN | partial | Embedded or substituted serif/sans pair |
| 9 | Absolute-positioned decor | Kicker dot, chips, companion panel | full | Grouped native shapes |
