---
version: alpha
name: Modulo
description: A neutral modular-geometric presentation system built on a 4x4 module grid with uniform 16px gutters. Display type runs in Sora ExtraBold paired with Inter body copy and Sora SemiBold caps labels. The palette is architectural — paper white ground, deep structural navy (#1C2C4E), a single signal amber (#FCA311) living only on deep grounds, and cool silver (#E5E5E5). Hierarchy comes from grid position, scale, and glyph markers (■/●) only: no tiles, bands, cells, keylines, gradients, shadows, or rounded corners.

colors:
  white: "#FFFFFF"
  deep: "#1C2C4E"
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
    status: retired
    successor: "label-kicker"
    description: "RETIRED in the typography-only vocabulary: the barcode tile row is removed. Regions open with the bare kicker."
  label-kicker:
    color: "{colors.deep}"
    fontFamily: "'Sora', sans-serif"
    fontSize: 15px
    fontWeight: 600
    letterSpacing: 0.12em
    textTransform: uppercase
    description: "Bare eyebrow label in deep Sora caps. Never chipped, never ruled."
  color-band-deep:
    status: retired
    successor: "deep-ground"
    description: "RETIRED as a band in the typography-only vocabulary. Deep surfaces survive only as full-slide stat grounds."
  deep-ground:
    background: "{colors.deep}"
    color: "{colors.white}"
    description: "Full-slide deep-navy ground reserved for stat moments: amber Sora numerals, white caps, 120px side padding."
  color-band-amber:
    status: retired
    description: "RETIRED in the typography-only vocabulary: amber bands are removed. Amber display type lives on deep grounds only."
  module-card:
    status: retired
    successor: "module-position"
    description: "RETIRED as a bordered card in the typography-only vocabulary. Modules are type groups on grid positions."
  module-position:
    gutter: 16px
    description: "Type group occupying whole grid modules with 16px gutters. No fill, no keyline."
  module-card-deep:
    status: retired
    successor: "deep-ground"
    description: "RETIRED as an inverted cell in the typography-only vocabulary. Deep contrast survives as the stat ground."
  module-card-amber:
    status: retired
    successor: "deep-ground"
    description: "RETIRED as an amber cell in the typography-only vocabulary. The hero stat sets amber-on-deep instead."
  bullet-square:
    glyph: ■
    color: "{colors.deep}"
    description: "Primary list marker: ■ text glyph in deep navy leading the first text line."
  bullet-circle:
    glyph: ●
    color: "{colors.deep}"
    description: "Secondary list marker: ● text glyph in deep navy for nested or supporting points."
  stat-band-item:
    status: retired
    successor: "stat-numeral"
    description: "RETIRED as a band unit in the typography-only vocabulary. Stats set as free numerals with caps labels."
  stat-numeral:
    color: "{colors.amber}"
    ground: "{colors.deep}"
    description: "Stat numeral in amber Sora 800 on deep grounds, with white Sora caps label. Amber type never on white."
  footer-rule:
    status: retired
    successor: "whitespace"
    description: "RETIRED in the typography-only vocabulary: the 6px amber rule is removed. Footers are type-only."
  grid-keyline:
    status: retired
    successor: "module-position"
    description: "RETIRED in the typography-only vocabulary: the printed module grid is removed. The layout grid is invisible."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Modulo is a **neutral modular-geometric presentation system**. Its foundational premise is the **module**: one square unit repeated on a 4×4 grid with uniform 16px gutters, governing every type group on the slide. Layouts feel assembled from a construction kit — nothing floats, nothing overlaps, nothing escapes the grid. Where expressive systems layer atmosphere, Modulo removes it: no gradients, no shadows, no blur, no rounded corners, no fills, no keylines. Hierarchy is built from only three moves — scale jumps in Sora, module position, and the geometric glyph pair (■ squares, ● circles).

The type stack is two faces with strict roles. **Sora** carries all display and all labels: ExtraBold for heroes and headlines, SemiBold tracked caps for kickers and band labels. **Inter** carries all body copy at weight 400 with generous 1.65 line-height, deliberately quiet so the Sora display moments land harder. The voice contrast is **geometric display ↔ neutral body ↔ tracked caps chrome** — rational throughout, never playful, never editorial.

The palette is architectural and deliberately narrow: **white ground**, **deep structural navy** (`{colors.deep}`), **one signal amber** (`{colors.amber}`) living only on deep grounds, and **cool silver** (`{colors.silver}`) as a retained token. Amber is rationed — exactly one emphasis per region — which is what keeps the system from feeling flat: the eye always knows where to land. Deep navy carries structure (stat grounds, headlines on light); silver is retired from fills and keylines.

**Density philosophy: medium, gridded, airy inside the modules.** Type groups breathe internally (32–40px gaps) while gutters stay tight and uniform at 16px, so the slide reads as one locked assembly. A typical slide carries one kicker opener + one display moment + a module row — never more than one deep-ground stat moment per slide.

**Key Characteristics:**
- Bare Sora caps kickers opening every major region.
- Geometric glyph markers only — ■ squares for primary points, ● circles for secondary points; no drawn bullets anywhere.
- Deep-ground stat moments — full-slide deep navy carrying amber numerals and white caps (amber-on-deep 7.89:1).
- 4×4 modular type grid — every group occupies whole modules with uniform 16px gutters; nothing floats off-grid or overlaps.
- Single-amber discipline — amber marks exactly one emphasis per region (one numeral on deep); everything else stays deep or white.
- Zero depth effects — no shadows, gradients, blur, fills, keylines, or rounding; grid position and scale are the only depth language.
- Sora display + Inter body + Sora caps labels — two faces, three roles, never crossed.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The default ground. Flat, unprinted.
- **Deep** (`{colors.deep}` — `#1C2C4E`): The structural color — headlines on light, stat grounds, glyph markers, body-strong text.
- **Deep Soft** (`{colors.deep-soft}` — `#3D4C6D`): Body-adjacent tone for subtitles and secondary prose on white (8.56:1); softer than Deep while staying in the navy family.
- **Amber** (`{colors.amber}` — `#FCA311`): The single signal color — stat numerals and counters on deep grounds only (amber-on-deep 7.89:1). Exactly one amber emphasis per region.
- **Amber Deep** (`{colors.amber-deep}` — `#D98A0B`): Retained token. Correction: at 2.77:1 on white it is NOT text-safe — never set amber-deep (or amber) type on white at any size.
- **Silver** (`{colors.silver}` — `#E5E5E5`): Retained token; fills and printed grid retired.
- **Silver Dark** (`{colors.silver-dark}` — `#C9C9C9`): Retained token; keylines and borders retired.

### Defaults

- **Default surface background**: `{colors.white}`, flat and unprinted.
- **Default headline color on white**: `{colors.deep}` in Sora ExtraBold.
- **Default headline color on deep grounds**: `{colors.white}`.
- **Default body text color on white**: `{colors.deep-soft}` in Inter 400.
- **Default body text color on deep grounds**: `rgba(255, 255, 255, 0.82)`.
- **Default kicker treatment**: `{components.label-kicker}` — bare deep Sora caps (white on deep grounds).
- **Default stat numeral color**: `{colors.amber}` on deep grounds, `{colors.deep}` on white.
- **Default module rhythm across a row**: stat → points → issue → date type groups with 16px gutters.

Amber is never a text color on white at any size — amber (2.02:1) and amber-deep (2.77:1) both fail contrast on white. Amber text appears only as Sora display type on deep grounds.

**Color-comfort decision (2026-11-04): adjust luminance (lighten the deep ground, narrow the jumps).** Deep `#14213D`→`#1C2C4E` narrows the render-confirmed white↔deep full-field swing (white-on-deep 15.97:1→13.82:1) while keeping every deep-ground pair strong: amber-on-deep 7.90:1→6.83:1, deep-headline-on-white 15.97:1→13.82:1. Amber stays off white (D07 fix intact); amber-deep stays non-text. Alternation discipline restated as binding: one deep-ground moment per slide, never mixed grounds within a slide, and never two consecutive full-deep slides in a deck. Harness `accent` remapped amber→deep in `theme.mjs`: the harness renders on white, where amber text is 2.02:1 (fails even the 3:1 large floor) and this design forbids amber text on white at any size — deep (13.82:1) is the design's own light-ground stat color. Typo-only shapes unchanged — color values only.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Sora** is the display and label face — a geometric sans with engineered curves and consistent stroke weight. ExtraBold (800) carries heroes, headlines, module titles (700), and stat numerals; SemiBold (600) with +0.12em tracking and uppercase carries every kicker, label, caption tag, and counter. Sora's geometry is the system's voice — replacing it with a grotesque or humanist face dissolves the modular identity.

**Inter** is the body face — a neutral grotesque that reads cleanly at 14–21px and stays out of Sora's way. Used for paragraphs, subtitles, captions, and any prose longer than a label. Inter never appears in display sizes and never carries tracked-caps treatments.

Never use Inter for headlines, never use Sora for body paragraphs. The two-role separation is the typographic structure.

### Typography Scale

| Token | Size (clamp) | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.module-hero}` | 56–104px | Sora | 800 | Cover or section hero title, tight −0.015em tracking |
| `{typography.display}` | 36–60px | Sora | 800 | Large section opener |
| `{typography.headline}` | 26–40px | Sora | 800 | Primary section headline |
| `{typography.card-title}` | 19–24px | Sora | 700 | Module group title |
| `{typography.stat-number}` | 48–96px | Sora | 800 | Stat numeral (amber on deep, deep on white) |
| `{typography.body}` | 16–21px | Inter | 400 | Paragraph body, subtitles |
| `{typography.body-small}` | 14–17px | Inter | 400 | Module prose, secondary text |
| `{typography.label-band}` | 14px | Sora | 600 | Labels on deep grounds, uppercase +0.12em |
| `{typography.label-kicker}` | 15px | Sora | 600 | Bare eyebrow kicker, uppercase +0.12em |
| `{typography.caption}` | 13px | Inter | 500 | Captions, footnotes, table notes |
| `{typography.counter}` | 13px | Sora | 600 | Slide counter, +0.12em tracking |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every hero element is Sora 800 with tight negative tracking** (−0.015em). Sora at neutral or positive tracking reads as a different, looser face and breaks the engineered voice.
- **Every kicker is bare deep Sora caps.** No chip, no rule — the grid position opens the region.
- **Every Sora label is uppercase with exactly +0.12em tracking.** Sentence-case Sora labels or wider luxury-style tracking do not exist in this system.
- **Every stat numeral is Sora 800 at 48px minimum** with −0.02em tracking. Stat numerals in Inter or at body sizes read as data, not display.
- **Every Inter body block uses line-height ≥ 1.6.** Tighter body leading on Inter 400 crowds descenders against the modular grid.
- **Every stat pairs numeral + caps label** — amber Sora numeral with white tracked caps on deep grounds.
- **Every module title is Sora 700 sentence case.** Module titles in caps or Inter flatten the hierarchy into label soup.

### Typography Principles

The voice contrast is **geometric display ↔ neutral body ↔ tracked caps chrome**. Sora should always feel **planted and flush-left** — left-aligned, tight tracking, never centered except inside symmetric stat bands. Inter should always feel **quiet** — left-aligned, sentence case, no letterspacing, no bold inside paragraphs except `{colors.deep}` strong spans.

Italic is never used — neither Sora nor Inter appears in italic anywhere. Emphasis inside body copy is a `{colors.deep}` Sora-weight switch, never slant, never amber (amber fails on white).

## Layout

### Canvas System

The system targets `100vw × 100vh` per slide. Slides stack vertically inside a `slides-container` and translate via `transform: translateY(...)` for navigation. Only one slide occupies the viewport at a time.

Default slide padding is `64px 120px`. The inner `slide-content` caps at `max-width: 1680px` and left-aligns within the padded stage, so content holds a consistent left edge.

The module grid is invisible — 240px squares (8 columns × 4.5 rows on a 1920×1080 stage) governing alignment by shared constants. Type groups align to this grid; the 16px gutter is the only inter-module spacing.

### Persistent Chrome

Two elements appear on every slide:
- **Kicker opener** — the bare Sora caps kicker (`{components.label-kicker}`) at the top-left of the content region, establishing the modular voice before any text.
- **Footer pairing** — counter at left and deck context at right in `{typography.label-band}`, deep on white (amber counter + white context on deep grounds).

No navigation dots, no floating hints, no progress bars — chrome is type, never overlaid.

### Atmospheric Overlay Stack

Modulo has no atmospheric overlays — no scanlines, grain, vignette, or particles. The surface stack is flat by doctrine:
1. Surface background — solid white, or a full-slide deep stat ground.
2. `.slide-content` directly above, with no intervening layers.

A Modulo slide with an overlay effect applied reads as a rendering bug, not an enhancement.

## Depth and Elevation

### Grid Position (Signature)

The system uses **module position and scale** as its only depth language. A stat numeral at 96px next to a 15px label reads as foreground by scale alone. There are no shadows, no fills, no keylines — `{shadows.none-flat}` is the default and only elevation token. The underline/keyline tokens are retained but unused.

### Module Separation

Type groups separate by 16px gutters and whitespace, never by keyline, shadow, or offset. Emphasis is a scale or ground change (the deep stat ground), not an elevation change.

### Ground Alternation

White is the default ground; a full-slide deep ground carries the stat moment (amber numerals, white caps). Grounds never mix on one slide — one ground per slide, edge to edge.

### No Atmospheric Depth

Blur, blend modes, gradients, grain, and vignettes do not exist in this system. Any such effect must be removed, not tuned.

## Shapes and Treatment

### Border Radius

Zero everywhere, trivially — there are no cards, bands, tiles, chips, or buttons to round. Markers are text glyphs (■/●). A rounded shape anywhere breaks the modular identity immediately.

### Border Weights

No borders exist in this system. The retired weights (1px keylines, 6px footer rule, 4px underlines) are documented for history only: every separation is now whitespace, gutters, and glyph markers.

### Decorative Element Types

**Kicker** — Bare deep Sora caps label opening every major region.

**Glyph markers** — ■ text glyph for primary points, ● for secondary points, both in deep navy.

**Deep ground** — Full-slide deep-navy stat ground (`{components.deep-ground}`); white Sora content with amber numerals.

**Module position** — Type group on whole grid modules with 16px gutters and 32px internal gaps; group titles in Sora 700.

**Stat numeral** — Amber Sora 800 numeral with white tracked caps on deep grounds; deep Sora 800 on white.

## Do's and Don'ts

### Do

- Open every major region with the bare Sora caps kicker.
- Keep every type group on whole grid modules with uniform 16px gutters — nothing floats, nothing overlaps.
- Ration amber to exactly one emphasis per region: one numeral on deep.
- Fill grid modules with stats or labels not already on the slide — a module restating headline or subtitle words reads as echo, not structure.
- Mark deep-ground stats with the amber numeral; all other type stays white.
- Use Sora 800 for display, Inter 400 for body, Sora 600 tracked caps for labels — exclusively.
- Use ■/● glyph markers for every list — drawn bullets do not exist.
- Emphasize with scale or the deep stat ground instead of fills, borders, or lifts.
- Carry the footer pairing (counter + context) on every slide.
- Keep white surfaces flat and unprinted; the module grid aligns but never shows.
- Set stat numerals in Sora 800 at 48px+ with numeral + caps label.
- Keep content inside the 120px side padding on every ground.

### Don't

- Don't add shadows, gradients, blur, blend modes, fills, keylines, bands, tiles, or rounded corners. Grid position and scale are the only depth.
- Don't use drawn bullets, dashes, or numerals-as-bullets. List markers are ■/● text glyphs, never shapes.
- Don't place amber or amber-deep text on white at any size — both fail contrast (2.02 / 2.77). Amber text lives on deep grounds only.
- Don't use Inter for headlines or Sora for body paragraphs. Each face has a single role.
- Don't use italic anywhere. Emphasis is a scale change, a weight switch, or the deep stat ground.
- Don't introduce a fifth working color. The palette is white + deep + amber-on-deep; a second accent breaks the signal discipline.
- Don't center body copy or module grids. Left edges align, always.
- Don't mix grounds on one slide. One ground per slide — white, or deep for the stat moment.
- Don't add chips, rules, cells, or keylines to the kicker. The bare caps kicker opens every region.
- Don't track Sora labels wider or narrower than +0.12em. The caps rhythm is fixed.

## Responsive Behavior

Modulo is a **module-fraction system** built around whole-module occupancy. There are no fluid vw/vh font interpolations in the source behavior — sizes step down by module fraction at fixed breakpoints while gutters stay 16px.

### Scaling Behavior

- Hero text steps 104px → 72px → 56px as the stage narrows.
- Stat numerals step 96px → 64px → 48px.
- Body steps 21px → 18px → 16px.
- The 16px gutter and glyph markers are fixed — they never scale, so chrome reads finer on larger canvases by design.

### Component Breakpoints

- `max-width: 1400px` — module grids collapse 4→2 columns.
- `max-width: 1024px` — grids collapse 2→1 column; footer stacks counter over context.
- `max-width: 640px` — hero tracking loosens to −0.01em.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions are instant cuts (no easing) — motion would contradict the flat modular doctrine.
- Stat numerals render at final value immediately; no count-up animation exists.

### Animation Triggers

No animation exists in this system. Type and grounds appear in their final state on slide entry. There are no keyframes to disable under `prefers-reduced-motion`.

### Print Behavior

The system prints 1:1 — flat type on white or deep survives print exactly. For static export, screenshots of each slide preserve type and grounds with no overlay loss.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended Korean fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / hero / stat numerals | Sora 700–800 | Noto Sans KR 700–900 |
| Body / subtitles / captions | Inter 400–500 | Noto Sans KR 400 |
| Caps labels / kickers / counter | Sora 600 (uppercase + 0.12em) | Noto Sans KR 500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin glyph coverage. Set every text element to `font-family: 'Noto Sans KR', sans-serif`. Noto Sans KR ships Latin glyphs that read cleanly alongside Hangul, so a mixed line like `Typodeck Research · 2026년 11월` renders in one consistent face. This system normally runs two faces (display/labels vs body); collapsing to one CJK face is the right tradeoff because hierarchy still works through weight (800 / 700 / 500 / 400) plus module position and the ■/● glyph markers.

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

The system's identity rests on geometric display type plus the module grid — and a CJK build preserves the grid completely. Lean harder on the **typographic** signature elements: module position, the ■/● glyph markers, the deep stat ground, and bare Sora kickers carry the modular voice when the Sora geometry is unavailable. Noto Sans KR at weight 800 gives the needed heft for heroes and stat numerals.

The ■/● glyph markers translate perfectly — keep them at identical sizes. Render Korean kickers in Noto Sans KR weight 500 at 0 tracking with no transform, at 14px instead of 15px to preserve the kicker row's compact silhouette.

### Known CJK Gap

- **No geometric Korean display face.** Sora's engineered geometry has no Hangul equivalent on Google Fonts — Noto Sans KR is a neutral grotesque that loses the modular-construction voice. The module grid, grounds, and markers must carry the identity on their own.
- **No tracked-caps voice in Hangul.** The +0.12em uppercase label rhythm cannot transfer to Korean. Kickers keep their grid position but lose their caps character.

## Iteration Guide

1. Any new slide opens its major regions with the bare Sora caps kicker.
2. Any new display element uses Sora 800 with tight negative tracking. Any new body element uses Inter 400 at 1.6+ line-height. Any new label uses bare Sora 600 caps at +0.12em.
3. Any new headline gets `{colors.deep}` on white or `{colors.white}` on deep grounds.
4. Any new list uses ■ glyph markers (primary) or ● glyph markers (secondary) — never drawn bullets.
5. Any new module group occupies whole grid modules with 16px gutters; emphasis comes from scale or the deep ground instead of fills.
6. Any new stat moment takes the full deep slide ground with 120px content padding; at most one deep-ground moment per slide.
7. Amber marks exactly one emphasis per region — audit every addition against the single-amber discipline (amber type on deep only).
8. Any new stat numeral is Sora 800 at 48px+ with numeral + caps label.
9. The footer pairing with counter and context ships on every slide without modification.
10. No new shadows, gradients, blur, blend modes, fills, keylines, bands, tiles, rounded corners, or animations — grid position and scale are the only depth, instant cuts the only transition.

## Known Gaps

- **Fonts**: Sora / Inter via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` for display, `system-ui, sans-serif` for body. Korean builds add Noto Sans KR with fallbacks `"Apple SD Gothic Neo", "Malgun Gothic", sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the geometric display voice.
- **Printed module grid retired (typography-only rebuild).** The layout grid is invisible; the old gradient-ground export gap is gone with it.
- **Module grids are hardcoded HTML** with fixed column counts per breakpoint. There is no data-binding layer — adding a module requires copying the group pattern and checking whole-module occupancy.
- **Stat numerals render at final value** with no count-up. There is no JS animation layer to extend.
- **Amber-on-white text is forbidden at every size** — amber (2.02:1) and amber-deep (2.77:1) both fail contrast on white. Amber text lives on deep grounds only.
- **The footer zone is fixed at 120px** and does not grow with content. Long context strings must wrap within the single line or be shortened.
- **Deep full-slide grounds sanctioned (typography-only rebuild).** The stat moment takes the deep ground so the amber signal survives as contrast-passing type (amber-on-deep 7.89:1); one deep-ground moment per slide, never mixed grounds.

### PPTX fidelity disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — zero blur by doctrine | full | N/A (nothing to reproduce) |
| 2 | Blend modes | Not used | full | N/A (nothing to reproduce) |
| 3 | Animation / keyframes | Not used — instant cuts only | full | N/A (static by design) |
| 4 | Pixel / hard offset shadows | Not used (underlines retired) | full | N/A |
| 5 | Gradients | Not used — flat fills only | full | N/A (nothing to reproduce) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to reproduce) |
| 7 | Transparency layers | White at 82% for body on deep grounds | partial | Nearest opaque light tint (#C9D2E8 on deep) |
| 8 | Custom fonts | Sora / Inter via Google Fonts CDN | partial | Embedded Sora/Inter subsets; fallback Arial/Calibri |
| 9 | Absolute-positioned decor | Retired — markers, numerals, and kickers are plain text | full | Native text boxes |
