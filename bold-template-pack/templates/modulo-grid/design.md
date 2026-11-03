---
version: alpha
name: Modulo
description: A neutral modular-geometric presentation system built on a 4x4 tile grid with uniform 16px gutters. Display type runs in Sora ExtraBold paired with Inter body copy and Sora SemiBold caps labels. The palette is architectural — paper white ground, deep structural navy (#14213D), a single signal amber (#FCA311), and cool silver (#E5E5E5). Depth comes only from flat color-block adjacency: tile-strip headers, full-bleed bands, and geometric square/circle bullets. No gradients, no shadows, no rounded corners.

colors:
  white: "#FFFFFF"
  deep: "#14213D"
  deep-soft: "#3D4C6D"
  amber: "#FCA311"
  amber-deep: "#D98A0B"
  silver: "#E5E5E5"
  silver-dark: "#C9C9C9"

shadows:
  none-flat: "none"
  band-inset-rule: "inset 0 1px 0 0 {colors.silver-dark}"
  tile-keyline: "0 0 0 1px {colors.silver-dark}"
  amber-underline: "0 4px 0 0 {colors.amber}"
  deep-underline: "0 4px 0 0 {colors.deep}"

typography:
  module-hero:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(56px, 6vw, 104px)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: -0.015em
  display:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(36px, 3.5vw, 60px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -0.01em
  headline:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(26px, 2.6vw, 40px)"
    fontWeight: 800
    lineHeight: 1.12
  card-title:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(19px, 1.6vw, 24px)"
    fontWeight: 700
    lineHeight: 1.25
  stat-number:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(48px, 5vw, 96px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.02em
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "clamp(16px, 1.2vw, 21px)"
    fontWeight: 400
    lineHeight: 1.65
  body-small:
    fontFamily: "'Inter', sans-serif"
    fontSize: "clamp(14px, 1vw, 17px)"
    fontWeight: 400
    lineHeight: 1.6
  label-band:
    fontFamily: "'Sora', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em
    textTransform: uppercase
  label-kicker:
    fontFamily: "'Sora', sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.12em
    textTransform: uppercase
  caption:
    fontFamily: "'Inter', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
  counter:
    fontFamily: "'Sora', sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em

spacing:
  module: 240px
  gutter: 16px
  pad-slide-y: "64px"
  pad-slide-x: "120px"
  pad-card-lg: "40px"
  pad-card-md: "32px"
  pad-card-sm: "20px 24px"
  gap-grid: 16px
  tile-strip: 48px
  band-height: 120px
  content-max-width: 1680px

canvas:
  width: 100vw
  height: 100vh

components:
  tile-strip:
    height: 48px
    tileSize: 48px
    gap: 16px
    description: "Opening row of solid 48px squares (amber, deep, silver sequence) that heads every major region like a construction-kit barcode."
  label-kicker:
    color: "{colors.deep}"
    fontFamily: "'Sora', sans-serif"
    fontSize: 15px
    fontWeight: 600
    letterSpacing: 0.12em
    textTransform: uppercase
    description: "Eyebrow label always preceded by a 12px solid amber square with a 12px gap; never standalone text."
  color-band-deep:
    background: "{colors.deep}"
    color: "{colors.white}"
    minHeight: 120px
    description: "Full-bleed deep-navy horizontal band carrying footer content, stats, or labels edge to edge with 120px side padding."
  color-band-amber:
    background: "{colors.amber}"
    color: "{colors.deep}"
    minHeight: 96px
    description: "Full-bleed amber band reserved for the single strongest emphasis per slide: one stat, one warning, one callout."
  module-card:
    background: "{colors.white}"
    border: "1px solid {colors.silver-dark}"
    padding: "32px"
    description: "Flat white card occupying whole grid modules; 1px silver keyline is the only edge treatment, never a shadow."
  module-card-deep:
    background: "{colors.deep}"
    color: "{colors.white}"
    padding: "32px"
    description: "Inverted deep-navy module for contrast cells inside a card grid; pairs with an amber bullet or numeral."
  module-card-amber:
    background: "{colors.amber}"
    color: "{colors.deep}"
    padding: "32px"
    description: "Signal-amber module used at most once per slide for the hero stat or key figure; Sora 800 numerals in deep navy."
  bullet-square:
    width: 14px
    height: 14px
    background: "{colors.amber}"
    description: "Primary list bullet: solid amber square, vertically centered on the first text line."
  bullet-circle:
    width: 12px
    height: 12px
    background: "{colors.deep}"
    borderRadius: "50%"
    description: "Secondary list bullet: solid deep-navy circle for nested or supporting points."
  stat-band-item:
    color: "{colors.amber}"
    description: "Stat numeral in amber Sora 800 inside deep bands, with white Sora caps label beneath."
  footer-rule:
    height: 6px
    background: "{colors.amber}"
    description: "6px amber rule that tops the deep footer band; the only horizontal rule weight in the system besides 1px keylines."
  grid-keyline:
    background: "1px {colors.silver} lines"
    description: "Faint 240px background module grid etched on white surfaces at full silver; structural, not decorative."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Modulo is a **neutral modular-geometric presentation system**. Its foundational premise is the **module**: one square unit repeated on a 4×4 grid with uniform 16px gutters, governing every card, band, tile strip, and bullet on the slide. Layouts feel assembled from a construction kit — nothing floats, nothing overlaps, nothing escapes the grid. Where expressive systems layer atmosphere, Modulo removes it: no gradients, no shadows, no blur, no rounded corners. Hierarchy is built from only three moves — scale jumps in Sora, flat color-block adjacency (white / deep / amber / silver), and the geometric bullet pair (amber squares, deep circles).

The type stack is two faces with strict roles. **Sora** carries all display and all labels: ExtraBold for heroes and headlines, SemiBold tracked caps for kickers and band labels. **Inter** carries all body copy at weight 400 with generous 1.65 line-height, deliberately quiet so the Sora display moments land harder. The voice contrast is **geometric display ↔ neutral body ↔ tracked caps chrome** — rational throughout, never playful, never editorial.

The palette is architectural and deliberately narrow: **white ground**, **deep structural navy** (`{colors.deep}`), **one signal amber** (`{colors.amber}`), and **cool silver** (`{colors.silver}`) for secondary modules and keylines. Amber is rationed — exactly one emphasis per region — which is what keeps a four-color system from feeling flat: the eye always knows where to land. Deep navy carries structure (bands, inverted modules, headlines on light); silver carries secondary structure (module fills, background grid, keylines).

**Density philosophy: medium, gridded, airy inside the cells.** Cards breathe internally (32–40px padding) while gutters stay tight and uniform at 16px, so the slide reads as one locked assembly rather than scattered panels. A typical slide carries one tile-strip opener + one display moment + a module row or band — never more than two bands per slide, never more than one amber module per slide.

**Key Characteristics:**
- Geometric tile-strip headers — a row of 48px solid squares (amber, deep, silver) that opens every major region like a construction-kit barcode.
- Geometric bullets only — solid amber squares for primary points, deep-navy circles for secondary points; no glyph bullets anywhere.
- Full-bleed color-block bands — deep-navy or amber horizontal bands that carry labels, stats, or footer content edge to edge.
- 4×4 modular card grid — every card occupies whole modules with uniform 16px gutters; nothing floats off-grid or overlaps.
- Single-amber discipline — amber marks exactly one emphasis per region (one numeral, one rule, one bullet); everything else stays deep, silver, or white.
- Zero depth effects — no shadows, gradients, blur, or rounding; adjacency of flat color blocks is the only depth language.
- Sora display + Inter body + Sora caps labels — two faces, three roles, never crossed.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The ground. All default surfaces; module cards sit on it with 1px silver keylines.
- **Deep** (`{colors.deep}` — `#14213D`): The structural color — headlines on light, inverted modules, footer and stat bands, circle bullets, body-strong text.
- **Deep Soft** (`{colors.deep-soft}` — `#3D4C6D`): Body-adjacent tone for subtitles and secondary prose on white; softer than Deep while staying in the navy family.
- **Amber** (`{colors.amber}` — `#FCA311`): The single signal color — hero stat modules, square bullets, kicker chips, the footer rule, band numerals. Exactly one amber emphasis per region.
- **Amber Deep** (`{colors.amber-deep}` — `#D98A0B`): Amber's text-safe companion for small caps labels on white where full amber would fail contrast.
- **Silver** (`{colors.silver}` — `#E5E5E5`): Secondary structure — alternate module fills, the background 240px grid, zebra fills on data rows.
- **Silver Dark** (`{colors.silver-dark}` — `#C9C9C9`): Keylines, card borders, and rules on white; the only border color in the system.

### Defaults

- **Default surface background**: `{colors.white}` with the faint 240px silver module grid (`{components.grid-keyline}`).
- **Default headline color on white**: `{colors.deep}` in Sora ExtraBold.
- **Default headline color on deep bands**: `{colors.white}`; on amber bands or modules: `{colors.deep}`.
- **Default body text color on white**: `{colors.deep-soft}` in Inter 400.
- **Default body text color on deep bands**: `rgba(255, 255, 255, 0.82)`; on amber: `{colors.deep}` at 85%.
- **Default kicker treatment**: `{components.label-kicker}` — deep Sora caps with a 12px amber square chip.
- **Default stat numeral color**: `{colors.amber}` on deep bands, `{colors.deep}` on amber modules, `{colors.deep}` on white.
- **Default card fill order across a module row**: white → silver → deep, with at most one amber module per slide.

Amber is never a text color on white at body sizes — it fails contrast. Amber text appears only as large Sora numerals (48px+) on deep grounds, or as `{colors.amber-deep}` caps labels at 14–15px.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Sora** is the display and label face — a geometric sans with engineered curves and consistent stroke weight. ExtraBold (800) carries heroes, headlines, card titles (700), and stat numerals; SemiBold (600) with +0.12em tracking and uppercase carries every kicker, band label, caption tag, and counter. Sora's geometry is the system's voice — replacing it with a grotesque or humanist face dissolves the modular identity.

**Inter** is the body face — a neutral grotesque that reads cleanly at 14–21px and stays out of Sora's way. Used for paragraphs, subtitles, captions, and any prose longer than a label. Inter never appears in display sizes and never carries tracked-caps treatments.

Never use Inter for headlines, never use Sora for body paragraphs. The two-role separation is the typographic structure.

### Typography Scale

| Token | Size (clamp) | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.module-hero}` | 56–104px | Sora | 800 | Cover or section hero title, tight −0.015em tracking |
| `{typography.display}` | 36–60px | Sora | 800 | Large section opener |
| `{typography.headline}` | 26–40px | Sora | 800 | Primary section headline |
| `{typography.card-title}` | 19–24px | Sora | 700 | Module card title |
| `{typography.stat-number}` | 48–96px | Sora | 800 | Stat numeral in bands and amber modules |
| `{typography.body}` | 16–21px | Inter | 400 | Paragraph body, subtitles |
| `{typography.body-small}` | 14–17px | Inter | 400 | Card body, secondary prose |
| `{typography.label-band}` | 14px | Sora | 600 | Labels inside color bands, uppercase +0.12em |
| `{typography.label-kicker}` | 15px | Sora | 600 | Eyebrow kicker with amber chip, uppercase +0.12em |
| `{typography.caption}` | 13px | Inter | 500 | Captions, footnotes, table notes |
| `{typography.counter}` | 13px | Sora | 600 | Slide counter, +0.12em tracking |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every hero element is Sora 800 with tight negative tracking** (−0.015em). Sora at neutral or positive tracking reads as a different, looser face and breaks the engineered voice.
- **Every kicker carries the 12px amber square chip** with a 12px gap before the text. A kicker without its chip is an untreated eyebrow and breaks the system's most recognizable small chrome.
- **Every Sora label is uppercase with exactly +0.12em tracking.** Sentence-case Sora labels or wider luxury-style tracking do not exist in this system.
- **Every stat numeral is Sora 800 at 48px minimum** with −0.02em tracking. Stat numerals in Inter or at body sizes read as data, not display.
- **Every Inter body block uses line-height ≥ 1.6.** Tighter body leading on Inter 400 crowds descenders against the modular grid.
- **Every band label pairs numeral + caps label vertically** — amber Sora numeral over white tracked caps on deep bands, never side by side, never in one line.
- **Every card title is Sora 700 sentence case.** Card titles in caps or Inter flatten the card hierarchy into label soup.

### Typography Principles

The voice contrast is **geometric display ↔ neutral body ↔ tracked caps chrome**. Sora should always feel **planted and flush-left** — left-aligned, tight tracking, never centered except inside symmetric stat bands. Inter should always feel **quiet** — left-aligned, sentence case, no letterspacing, no bold inside paragraphs except `{colors.deep}` strong spans.

Italic is never used — neither Sora nor Inter appears in italic anywhere. Emphasis inside body copy is a `{colors.deep}` Sora-weight switch or an amber-deep caps run, never slant.

## Layout

### Canvas System

The system targets `100vw × 100vh` per slide. Slides stack vertically inside a `slides-container` and translate via `transform: translateY(...)` for navigation. Only one slide occupies the viewport at a time.

Default slide padding is `64px 120px`. The inner `slide-content` caps at `max-width: 1680px` and left-aligns within the padded stage, so content holds a consistent left edge while bands bleed full-width behind it.

The background module grid is fixed at 240px squares (8 columns × 4.5 rows on a 1920×1080 stage), drawn as 1px `{colors.silver}` lines. Cards and bands align to this grid; the 16px gutter is the only inter-card spacing.

### Persistent Chrome

Two elements appear on every slide:
- **Tile-strip opener** — the 48px geometric tile row (`{components.tile-strip}`) at the top-left of the content region, establishing the modular voice before any text.
- **Deep footer band** — full-bleed `{components.color-band-deep}` at 120px height with the 6px amber footer rule on top, carrying the slide counter at left and the deck context at right in `{typography.label-band}`.

No navigation dots, no floating hints, no progress bars — chrome is structural (tile strip + footer band), never overlaid.

### Atmospheric Overlay Stack

Modulo has no atmospheric overlays — no scanlines, grain, vignette, or particles. The surface stack is flat by doctrine:
1. Surface background — white with the 240px silver module grid, or a full-bleed deep/amber band.
2. `.slide-content` directly above, with no intervening layers.

A Modulo slide with an overlay effect applied reads as a rendering bug, not an enhancement.

## Depth and Elevation

### Flat Adjacency (Signature)

The system uses **flat color-block adjacency** as its only depth language. A deep module next to a white module reads as elevated; an amber module inside a silver row reads as foreground. There are no shadows — `{shadows.none-flat}` is the default and only elevation token. Borders are 1px silver keylines, never drop shadows.

The two underline tokens (`{shadows.amber-underline}` / `{shadows.deep-underline}`) are 4px solid offsets that behave as rules, not shadows — they sit flush under display text or band edges with zero blur and zero spread.

### Card Edges

Cards are separated from the ground by a 1px `{colors.silver-dark}` keyline (`{shadows.tile-keyline}`), never by shadow or offset. Featured cells invert to deep or amber fills instead of lifting — emphasis is a fill change, not an elevation change.

### Band Separation

Bands separate from content regions by full-bleed fill contrast alone. The deep footer band adds the 6px amber rule at its top edge; content bands use no rule. No band carries a top or bottom shadow.

### No Atmospheric Depth

Blur, blend modes, gradients, grain, and vignettes do not exist in this system. Any such effect must be removed, not tuned.

## Shapes and Treatment

### Border Radius

Effectively zero, with exactly one exception: the secondary bullet-circle is a true circle (`border-radius: 50%`). Everything else — cards, bands, tiles, chips, buttons — is perfectly square. A rounded card or pill badge breaks the modular identity immediately.

### Border Weights

- **1px solid silver-dark** — card keylines, table rules, divider lines on white.
- **6px solid amber** — the footer rule topping the deep footer band; the only heavy rule in the system.
- **4px solid underlines** — display-text emphasis underlines in amber or deep (`{shadows.amber-underline}` / `{shadows.deep-underline}`).
- **Module fills instead of borders** — inverted cells use full fills (deep/silver/amber), never thick outline frames.

Borders are always solid and always square-cornered. Dashed, dotted, or double rules do not exist here.

### Decorative Element Types

**Tile strip** — Opening row of solid 48px squares in amber/deep/silver sequence. The system's most distinctive non-typographic mark; heads every major region.

**Kicker chip** — 12px solid amber square pinned 12px before every Sora caps kicker. The smallest unit of the modular language.

**Bullet square** — 14px solid amber square for primary list points, centered on the first text line.

**Bullet circle** — 12px solid deep-navy circle for secondary or nested points; the only round shape in the system.

**Color band (deep)** — Full-bleed 120px deep-navy band for footers, stat rows, and label rails; white Sora content with amber numerals.

**Color band (amber)** — Full-bleed 96px amber band for the single strongest emphasis per slide; deep-navy Sora content.

**Module card** — Flat white card on whole grid modules with a 1px silver keyline and 32px padding; card titles in Sora 700.

**Module card (deep)** — Inverted deep-navy cell for contrast inside a card grid; white text with an amber bullet or numeral.

**Module card (amber)** — Signal-amber cell used at most once per slide for the hero stat; deep-navy Sora 800 numerals.

**Stat band item** — Vertical numeral-over-label unit inside deep bands: amber Sora 800 numeral above white tracked caps.

**Footer rule** — 6px amber rule topping the deep footer band; the system's only heavy horizontal.

**Grid keyline** — The faint 240px silver background module grid on white surfaces; structural alignment cue, not decoration.

## Do's and Don'ts

### Do

- Open every major region with the 48px geometric tile strip in amber/deep/silver sequence.
- Keep every card on whole grid modules with uniform 16px gutters — nothing floats, nothing overlaps, nothing bleeds except bands.
- Ration amber to exactly one emphasis per region: one numeral, one rule, one bullet, one module.
- Use Sora 800 for display, Inter 400 for body, Sora 600 tracked caps for labels — exclusively.
- Pin the 12px amber chip before every kicker and use square/circle geometric bullets for every list.
- Invert emphasis cells to deep or amber fills instead of adding shadows, borders, or lifts.
- Carry the deep footer band with its amber rule and counter/context chrome on every slide.
- Keep the faint 240px silver module grid on every white surface as the structural ground.
- Set stat numerals in Sora 800 at 48px+ with numeral-over-label stacking inside bands.
- Bleed color bands full-width edge to edge while content keeps the 120px side padding.

### Don't

- Don't add shadows, gradients, blur, blend modes, or rounded corners (except the bullet circle). Flat adjacency is the only depth.
- Don't use glyph bullets, dashes, or numerals-as-bullets. List markers are drawn squares and circles, never characters.
- Don't place amber body text on white — it fails contrast. Amber text is large numerals on deep grounds only.
- Don't use Inter for headlines or Sora for body paragraphs. Each face has a single role.
- Don't use italic anywhere. Emphasis is a fill change, a weight switch, or an amber-deep caps run.
- Don't introduce a fifth color. The palette is white + deep + amber + silver; a second accent breaks the signal discipline.
- Don't center body copy or card grids. Left edges align; centering is reserved for symmetric stat bands.
- Don't stack more than two bands per slide or more than one amber module per slide. Restraint is the system.
- Don't drop the tile strip in favor of a plain text eyebrow. The strip is the most recognizable region opener.
- Don't track Sora labels wider or narrower than +0.12em. The caps rhythm is fixed.

## Responsive Behavior

Modulo is a **module-fraction system** built around whole-module occupancy. There are no fluid vw/vh font interpolations in the source behavior — sizes step down by module fraction at fixed breakpoints while gutters stay 16px and the tile strip stays 48px.

### Scaling Behavior

- Hero text steps 104px → 72px → 56px as the stage narrows.
- Stat numerals step 96px → 64px → 48px.
- Body steps 21px → 18px → 16px.
- The 16px gutter, 48px tile strip, 14px/12px bullets, and 6px footer rule are fixed — they never scale, so chrome reads finer on larger canvases by design.

### Component Breakpoints

- `max-width: 1400px` — module card grids collapse 4→2 columns; bands keep full bleed.
- `max-width: 1024px` — card grids collapse 2→1 column; footer band stacks counter over context.
- `max-width: 640px` — tile strip shortens to three tiles; hero tracking loosens to −0.01em.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions are instant cuts (no easing) — motion would contradict the flat modular doctrine.
- Stat numerals render at final value immediately; no count-up animation exists.

### Animation Triggers

No animation exists in this system. Band fills, tile strips, and numerals appear in their final state on slide entry. There are no keyframes to disable under `prefers-reduced-motion`.

### Print Behavior

The system prints 1:1 — flat fills, keylines, and tracked caps survive print exactly. The silver background grid prints at 60% opacity to save toner. For static export, screenshots of each slide preserve all flat geometry with no overlay loss.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended Korean fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / hero / stat numerals | Sora 700–800 | Noto Sans KR 700–900 |
| Body / subtitles / captions | Inter 400–500 | Noto Sans KR 400 |
| Caps labels / kickers / band labels / counter | Sora 600 (uppercase + 0.12em) | Noto Sans KR 500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin glyph coverage. Set every text element to `font-family: 'Noto Sans KR', sans-serif`. Noto Sans KR ships Latin glyphs that read cleanly alongside Hangul, so a mixed line like `Typodeck Research · 2026년 11월` renders in one consistent face. This system normally runs two faces (display/labels vs body); collapsing to one CJK face is the right tradeoff because hierarchy still works through weight (800 / 700 / 500 / 400) plus the geometric chrome (tile strips, bullets, bands).

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.85–1.95 (up from 1.6–1.65), display 1.15–1.25 (up from 1.04–1.12). CJK characters are square and visually full — they crowd vertically more than Latin.
- **Letter-spacing**: set to 0 on every CJK run. The system's −0.015em display tracking and +0.12em caps tracking both look broken on square CJK glyphs.
- **Text transform**: don't apply `uppercase` to Korean text. Every Sora label uses `text-transform: uppercase`; remove it for CJK runs.
- **No period on display headlines**: Korean display convention omits trailing periods on cover headlines.
- **Space between CJK and Latin**: insert an ASCII space between every Hangul syllable block run and adjacent Latin characters or digits. Write `11개 포스트모템` with the numeral set in Noto Sans KR so weights match.
- **One font per sentence**: Noto Sans KR covers both Hangul and Latin glyphs in a unified style — let it handle mixed sentences rather than font-switching mid-word.

### Aesthetic Notes for This System

The system's identity rests on geometric display type plus modular chrome — and a CJK build preserves the chrome completely. Lean harder on the **non-typographic** signature elements: the tile strip, square/circle bullets, color-block bands, and amber-chip kickers carry the modular voice when the Sora geometry is unavailable. Noto Sans KR at weight 800 gives the needed heft for heroes and stat numerals.

The amber kicker chip (12px square) and geometric bullets translate perfectly — keep them at identical sizes. Render Korean kickers in Noto Sans KR weight 500 at 0 tracking with no transform, at 14px instead of 15px to preserve the chip row's compact silhouette.

### Known CJK Gap

- **No geometric Korean display face.** Sora's engineered geometry has no Hangul equivalent on Google Fonts — Noto Sans KR is a neutral grotesque that loses the modular-construction voice. The tile strips, bands, and bullets must carry the identity on their own.
- **No tracked-caps voice in Hangul.** The +0.12em uppercase label rhythm cannot transfer to Korean. Kickers keep the amber chip and band position but lose their caps character.

## Iteration Guide

1. Any new slide opens its major regions with the 48px geometric tile strip in amber/deep/silver sequence.
2. Any new display element uses Sora 800 with tight negative tracking. Any new body element uses Inter 400 at 1.6+ line-height. Any new label uses Sora 600 caps at +0.12em with the amber chip where it acts as a kicker.
3. Any new headline gets `{colors.deep}` on white, `{colors.white}` on deep bands, or `{colors.deep}` on amber grounds.
4. Any new list uses square bullets (primary) or circle bullets (secondary) — never glyph markers.
5. Any new card occupies whole grid modules with 16px gutters and a 1px silver keyline; emphasis cells invert fills instead of lifting.
6. Any new band bleeds full-width with 120px content padding; at most two bands per slide, at most one amber module per slide.
7. Amber marks exactly one emphasis per region — audit every addition against the single-amber discipline.
8. Any new stat numeral is Sora 800 at 48px+ with numeral-over-label stacking inside bands.
9. The deep footer band with amber rule, counter, and context ships on every slide without modification.
10. No new shadows, gradients, blur, blend modes, rounded corners, or animations — flat adjacency is the only depth, instant cuts the only transition.

## Known Gaps

- **Fonts**: Sora / Inter via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` for display, `system-ui, sans-serif` for body. Korean builds add Noto Sans KR with fallbacks `"Apple SD Gothic Neo", "Malgun Gothic", sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the geometric display voice.
- **The 240px background module grid is CSS-rendered** via layered linear-gradients. Export pipelines that strip background images lose the structural ground and must re-add it as a flat tiled image.
- **Card grids are hardcoded HTML** with fixed column counts per breakpoint. There is no data-binding layer — adding a module requires copying the card pattern and checking whole-module occupancy.
- **Stat numerals render at final value** with no count-up. There is no JS animation layer to extend.
- **Amber-on-white text is intentionally restricted** to large numerals and deep-amber caps labels. Authors who place body copy in amber will fail contrast — the system offers no safe mid-size amber text style.
- **The footer band height is fixed at 120px** and does not grow with content. Long context strings must wrap within the band's single line or be shortened.
- **No dark-mode slide variant exists.** The system is light-ground by doctrine; deep surfaces appear only as bands and inverted modules, never as full-slide grounds.

### PPTX fidelity disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — zero blur by doctrine | full | N/A (nothing to reproduce) |
| 2 | Blend modes | Not used | full | N/A (nothing to reproduce) |
| 3 | Animation / keyframes | Not used — instant cuts only | full | N/A (static by design) |
| 4 | Pixel / hard offset shadows | 4px solid underlines under display text | full | Native single-offset rectangle shape |
| 5 | Gradients | Not used — flat fills only | full | N/A (nothing to reproduce) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to reproduce) |
| 7 | Transparency layers | White at 82% for body on deep bands | partial | Nearest opaque light tint (#C9D2E8 on deep) |
| 8 | Custom fonts | Sora / Inter via Google Fonts CDN | partial | Embedded Sora/Inter subsets; fallback Arial/Calibri |
| 9 | Absolute-positioned decor | Tile strips, bullets, bands as flat divs | full | Grouped native rectangles |
