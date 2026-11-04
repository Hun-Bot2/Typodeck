---
version: alpha
name: Fika
description: A Scandinavian soft-functional presentation system built on warmth and restraint. Display type runs in Fraunces (weight 500, lowercase headlines) paired with Nunito Sans for body and tracked caps labels. The palette stays on warm off-white (`#FAFAF7`) with slate text (`#31404B`) and fjord navy (`#182B49`) for key-phrase lines. Typography-only register: no panels, chips, dots, rules, or shadows exist — hierarchy is carried by scale, weight, color, and whitespace alone. Layouts breathe through an airy two-column rhythm with huge gutters. The effect is a quiet kitchen table, not a stage.
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
  companion-figure:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: 240px
    fontWeight: 500
    color: "{colors.slate}"
    description: "Typographic data moment set directly on the ground: Fraunces numeral with a small Nunito caption beneath. No fill, no border, no shadow — the column gutter is the only separation."
  keyword-line:
    color: "{colors.fjord}"
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 700
    description: "Row of 2–4 key phrases in fjord navy Nunito Sans 700, separated by slate middots. Text always fjord (slate-on-pale pairings measured in evals/typo-only/color.md informed the fjord choice)."
  kicker:
    fontFamily: "'Nunito Sans', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 700
    letterSpacing: 0.15em
    textTransform: uppercase
    color: "{colors.slate}"
    description: "Bare tracked-caps kicker label. No dot, no mark — position and tracking carry the kicker signal."
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

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and margin collisions.

## Overview

Fika is a **Scandinavian soft-functional presentation system**. Its foundational premise is friendliness through restraint: every headline is lowercase, every color is muted, and nothing on the slide is a container. Layouts breathe through huge gutters and an airy two-column rhythm — text on the left at roughly 58% width, one typographic companion figure on the right — and whitespace does the structuring work that rules, panels, and grids do in harder systems.

The type stack is two faces. **Fraunces** (weight 500) is the display face — a soft, slightly wonky serif with old-style warmth that carries headlines, subheads, and large data numerals, always in lowercase for headline runs. **Nunito Sans** is the work face — a rounded humanist sans used for body at 400 and for labels, chips, and captions at 700. The serif/sans contrast is gentle by design: neither face ever shouts.

The palette stays on warm **off-white** (`{colors.off-white}`) with **slate** text (`{colors.slate}`) and **fjord navy** (`{colors.fjord}`) for key-phrase lines. Body and headlines are always slate on the ground; key phrases are always fjord. The pastel and wash tokens (sage, blush, dusty blue, washes) are retained for palette identity but have no visible role in the typography-only register — no pastel text (contrast), no pastel fills (no containers). The result is calm without being cold.

Depth is the system's deliberate absence: **flat ground, no gradients, no gloss, no shadows, no containers**. Scale, weight, color, and whitespace create all the separation the system needs.

**Density philosophy: sparse and unhurried.** A typical slide carries one headline, one short body block, and one companion moment (a data numeral, a key-phrase line, or a short list). If a slide feels busy, remove an element rather than shrinking anything. Generous padding (96px vertical, 120px horizontal) is structural, not decorative.

**Key Characteristics:**
- Lowercase Fraunces headlines (`{typography.headline}`) — weight 500, sentence meaning set entirely in lowercase.
- Typographic companion figure (`{components.companion-figure}`) — Fraunces numeral + caption set directly on the ground.
- Fjord key-phrase line (`{components.keyword-line}`) — Nunito 700 phrases separated by slate middots.
- Airy two-column rhythm — text left (~58%), one companion figure right, gutters ≥ 96px.
- Matte surface discipline — no gradients, no gloss, no shadows, no containers of any kind.
- Fraunces old-style numerals for data moments, always bare on the ground.

## Colors

### Palette

- **Off-White** (`{colors.off-white}` — `#FAFAF7`): The universal ground. Every slide starts here; all text sits on it.
- **Slate** (`{colors.slate}` — `#31404B`): The body text color. Headlines, body, labels, captions — all slate. Never pure black.
- **Fjord** (`{colors.fjord}` — `#182B49`): Deep sophisticated navy for key-phrase lines. Crisp against the off-white ground at 22px bold.
- **Sage** (`{colors.sage}` — `#A8C3B9`): First pastel. Retained token; no visible role in the typography-only register.
- **Blush** (`{colors.blush}` — `#E8B4A0`): Second pastel. Retained token; no visible role in the typography-only register.
- **Dusty Blue** (`{colors.dusty-blue}` — `#7FA6C9`): Third pastel. Retained token; no visible role in the typography-only register.
- **White** (`{colors.white}` — `#FFFFFF`): Retained token; never a slide ground, never rendered in this register.
- **Sage Wash** (`{colors.sage-wash}` — `#DCE8E3`): 35%-mix sage. Retained token; no visible role in the typography-only register.
- **Blush Wash** (`{colors.blush-wash}` — `#F5DCD2`): 35%-mix blush. Retained token; no visible role in the typography-only register.
- **Blue Wash** (`{colors.blue-wash}` — `#D5E4F1`): 35%-mix dusty blue. Retained token; no visible role in the typography-only register.

### Defaults

- **Default surface background**: `{colors.off-white}` flat. No texture, no grid, no vignette.
- **Default headline color**: `{colors.slate}` — pastels never carry headline text.
- **Default body text color**: `{colors.slate}` at full opacity; secondary captions at 72% opacity.
- **Default companion figure**: `{components.companion-figure}` — bare Fraunces numeral + caption on the ground.
- **Default key-phrase line**: `{components.keyword-line}` — fjord phrases with slate middot separators.
- **Default divider**: none — whitespace rhythm separates blocks; rules do not exist.
- **Default accent for key phrases**: `{colors.fjord}`.

### Pastel Policy

Pastels and washes are retained as palette tokens but retired from the visible vocabulary: no pastel text (all three fail AA on the ground), no pastel fills (the typography-only register has no containers). The fjord navy introduced for legibility (`evals/typo-only/color.md`) survives as the key-phrase text color. No new pastel may join the three without a documented text pairing that passes AA. See `evals/typo-only/color.md` for the shared rule and measurements.

When a slide needs a warmer or cooler cast, adjust nothing about color — vary the companion figure's scale and the column rhythm instead. All text stays slate/fjord and the ground stays off-white.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Fraunces** is the display face — a soft serif with old-style proportions and gentle irregularity. Used for hero titles, headlines, subheads, and large data numerals. Headline runs are always lowercase (`text-transform: lowercase`), which is the system's most recognizable typographic move. Weight is always 500; heavier weights would break the softness.

**Nunito Sans** is the work face — a rounded humanist sans. Used for body (400), labels and key phrases (700), captions (400), and page marks (700). Its roundness keeps small text friendly against the huge gutters.

Never use Fraunces for body or labels, never use Nunito Sans for headlines or data numerals. The serif-display / sans-work split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.hero}` | 88px | Fraunces | 500 | Cover display title, lowercase |
| `{typography.headline}` | 72px | Fraunces | 500 | Primary section headline, lowercase |
| `{typography.subhead}` | 40px | Fraunces | 500 | Region-level subheading, lowercase |
| `{typography.data-numeral}` | 240px | Fraunces | 500 | Data numeral bare on the ground |
| `{typography.body}` | 32px | Nunito Sans | 400 | Paragraph body |
| `{typography.body-sm}` | 24px | Nunito Sans | 400 | Secondary body, list items |
| `{typography.label}` | 22px | Nunito Sans | 700 | Tracked caps kicker label |
| `{typography.chip}` | 22px | Nunito Sans | 700 | Key-phrase text (not tracked) |
| `{typography.caption}` | 20px | Nunito Sans | 400 | Captions, context lines |
| `{typography.page-mark}` | 20px | Nunito Sans | 700 | Page numeral, tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline is lowercase.** Apply `text-transform: lowercase` to every hero, headline, and subhead. Capitalized display type breaks the friendly voice instantly.
- **Every display run uses Fraunces 500.** No other weight, no italic in headlines. Data numerals use the same face and weight at 240px, bare on the ground.
- **Every kicker label is tracked caps.** Nunito Sans 700, 22px, 0.15em tracking, uppercase, with no preceding mark.
- **Every key phrase uses Nunito Sans 700 untracked.** Key phrases are sentence-case short phrases, never uppercase, never letterspaced, separated by slate middots. Key phrases must carry new labels (section tags, dates, format notes) — never headline or subtitle words restated.
- **Every body block uses line-height 1.6.** Nunito Sans needs the air; tighter leading feels cramped against the huge gutters.
- **Every caption/context line is 20–24px Nunito Sans 400.** Context never uses the display serif.

### Typography Principles

The voice contrast is **soft serif display ↔ rounded sans work**. Italic appears only as an occasional emphasis inside body text — never in headlines, never in labels. Numerals in prose use Nunito Sans; numerals as data moments use Fraunces at large sizes bare on the ground.

Fraunces should always feel **settled** — left-aligned, generous line-height (1.12–1.2), never centered for multi-line runs (centering is permitted on the cover title only when the layout is single-column). Nunito Sans body is always left-aligned, sentence case.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Default slide padding is 96px vertical and 120px horizontal. The inner content region caps at `max-width: 1680px` and centers, so content keeps a calm measure while the off-white ground fills the stage.

The primary layout is **airy two-column**: text column left at ~58% width, one companion figure right at ~34% width, with a ≥96px gutter between them. Single-column centered layouts are permitted for cover and section-divider slides only.

### Persistent Chrome

Two quiet elements appear on every slide:

- **Kicker row** — `{components.kicker}` tracked-caps label in Nunito Sans 700, top-left of the content region. Carries the deck's context line or section name.
- **Page mark** — `{components.page-mark}` in Nunito Sans 700 tracked numerals (`01`), bottom-left of the content region at 20px.

No navigation rails, no progress bars, no heavy footers. Chrome stays whisper-quiet so the type and whitespace dominate.

### Gutter Discipline

Gutters are structural. Column gap is never under 96px; stack gaps are 48px (headline→body), 32px (body→key phrases), 20px (tight list items). Nothing touches the viewport edge — the 120px horizontal padding is a hard minimum. If content overflows, shorten the copy or drop a key phrase; never compress the gutters.

## Depth and Elevation

The system practices **matte flatness**. The ground is one opaque flat fill; separation comes from scale, weight, color, and whitespace — never from shadow, panels, or fills.

No shadow is used anywhere in the typography-only register (the `{shadows.lift}` tokens are retained but unrendered). Hard offset shadows, glows, blurs, and gradients do not exist anywhere in the system.

Type scale carries the hierarchy signal instead: display numerals at 160–240px, headlines at 72–88px, body at 32px, labels at 22px. The eye reads size + color as structure without any container help.

## Shapes and Treatment

### Border Radius

There are no shaped elements to round. The typography-only register has no panels, chips, dots, or rules — radius tokens are retained but unrendered. Softness comes from the Fraunces/Nunito letterforms and the airy gutters, not from geometry.

### Border Weights

Borders do not exist. There are no strokes, no fills-behind-text, and no divider rules. If a boundary is needed, use whitespace and scale contrast instead of a line.

### Decorative Element Types

**Companion figure** — Fraunces 500 numeral at 160–240px with a small Nunito caption beneath, set directly on the ground. The slide's right-hand companion. No fill, no border, no shadow.

**Key-phrase line** — 2–4 fjord Nunito Sans 700 phrases in a wrapping row under body copy, separated by slate middots. No pills, no fills.

**Kicker** — Bare tracked-caps label. No dot, no mark.

**Page mark** — Tracked 20px numerals bottom-left. No rule, no box, no ornament.

**Data numeral** — Fraunces 500 at 240px bare on the ground with a small caption beneath. The system's one allowed "big number" moment.

## Do's and Don'ts

### Do

- Set every headline in lowercase Fraunces 500. The lowercase treatment is the voice.
- Keep headlines, body, and labels slate on the ground and key-phrase lines fjord; pastels have no visible role.
- Vary the companion figure's scale and the column rhythm across consecutive slides for gentle variety.
- Hold the ≥96px column gutter and 120px page padding as hard minimums.
- Use the key-phrase line for key content phrases in rows of 2–4 with middot separators.
- Let whitespace structure the slide; never reach for a panel, fill, or rule.
- Render data moments as bare Fraunces numerals on the ground with small captions.
- Keep the kicker row and page mark quiet and consistent on every slide.

### Don't

- Don't capitalize display type or add letterspacing to Fraunces headlines.
- Don't use shadows, glows, gradients, or gloss anywhere — matte only.
- Don't place body text in a pastel color or on a saturated ground.
- Don't add panels, chips, dots, borders, keylines, or grid wallpapers — whitespace and scale separate.
- Don't use shadows on text or under type.
- Don't use Fraunces for body/labels or Nunito Sans for headlines/numerals.
- Don't crowd the slide; if it feels busy, remove an element rather than shrinking type.
- Don't introduce a fourth pastel or a saturated neon — visible text colors are slate + fjord only.
- Don't center multi-line body text; left-align everywhere except single-column covers.

## Responsive Behavior

Fika is a **fixed-stage system** (1920×1080) under the Frontend Slides policy. This section records the source proportions for translation, not live responsive rules.

### Scaling Behavior

- Hero 88px, headline 72px, subhead 40px, body 32px at stage scale.
- Companion-figure sizes and key-phrase padding are fixed pixel values.
- The 96px column gutter and 120px page padding scale with the uniform stage transform only.

### Component Breakpoints

No breakpoints exist in the fixed-stage model. In a hypothetical fluid build, the two-column layout would stack below 900px width and key phrases would wrap — but the generated deck never reflows; it letterboxes.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp`/`ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are a soft 500ms ease fade/slide; motion is minimal by design.

### Animation Triggers

Key phrases and companion figures may fade in with a 120ms stagger on slide entry. The `prefers-reduced-motion` media query disables all entry motion. No ambient animation exists — stillness is part of the calm.

### Print Behavior

The system prints cleanly: flat fills, no shadows to band, no dark grounds to drain ink. Export each slide as a static 1920×1080 frame; entry animations resolve to their end state.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / data numerals | Fraunces 500 (lowercase) | Noto Serif KR 600 |
| Body / key phrases / captions | Nunito Sans 400–700 | Noto Sans KR 400–700 |
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

The system's lowercase-Fraunces voice cannot transfer to CJK (no case, no Fraunces equivalent). Compensate by leaning on the remaining signature elements: huge gutters, the fjord key-phrase line, and the airy two-column rhythm carry the friendliness on their own. Noto Serif KR at 600 gives display headlines enough softness to sit in Fraunces's place.

Kicker labels lose their tracked-caps treatment in CJK; keep the kicker position so the row still reads as a kicker through layout rather than tracking.

### Known CJK Gap

- **No rounded-CJK work face on CDN.** Nunito Sans's roundness has no Korean counterpart on Google Fonts; Noto Sans KR is a neutral grotesque. The soft voice must come from scale and whitespace, not letterforms.
- **No lowercase signal in CJK.** The system's most recognizable move (lowercase headlines) vanishes. Do not fake it with smaller sizes — keep display scale and let the two-column rhythm carry the identity.

## Iteration Guide

1. Any new slide starts on the off-white ground with 96px/120px padding, a kicker row, and a page mark.
2. Any new headline uses Fraunces 500 lowercase at the matching scale token. Any new body uses Nunito Sans 400. Any new label uses Nunito Sans 700 tracked caps.
3. Any new companion figure uses a bare Fraunces numeral + caption on the ground — no fill, no border, no shadow.
4. Any new key-phrase row uses 2–4 fjord phrases with slate middot separators — no pills, no fills.
5. Any new data moment uses a Fraunces 240px numeral bare on the ground with a 20px caption beneath.
6. Any new separation uses whitespace rhythm — dividers and rules do not exist.
7. Any new shadow is forbidden — the shadow tokens are retained but unrendered; when in doubt, use none.
8. Any new visible color must be slate or fjord; pastels and washes are retained tokens with no visible role.
9. If a slide feels crowded, remove an element — never shrink type below its token, never add a container.
10. Animated elements (key-phrase/figure fade-ins) respect `prefers-reduced-motion`; stillness is the default.

## Known Gaps

- **Fonts**: Fraunces / Nunito Sans via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", Georgia, serif` for display / `system-ui, sans-serif` for work faces. No font files committed. Offline rendering falls back to system stacks and loses the soft-serif voice.
- **Lowercase is a transform**: headlines rely on `text-transform: lowercase`; export targets without transform support must lowercase the source strings instead.
- **No shadows, panels, or fills**: the typography-only register renders none of the retained shadow/pastel tokens; decks must not reintroduce them as containers.
- **Page marks are manual**: the `01` numeral is authored per slide; there is no auto-numbering layer.
- **No dark mode**: the system is light-ground only; dark slides would need a new palette, not an inversion.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in system |
| 2 | Blend modes | Not used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Key-phrase/figure fade-in stagger (120ms) | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | Not used | full | N/A |
| 5 | Gradients | Not used | full | N/A — all fills are flat |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | 72% caption opacity | partial | Opaque approximations (flatten to solid) |
| 8 | Custom fonts | Fraunces + Nunito Sans via Google Fonts CDN | partial | Embedded or substituted serif/sans pair |
| 9 | Absolute-positioned decor | None — in-flow type only | full | Native text boxes 1:1 |
