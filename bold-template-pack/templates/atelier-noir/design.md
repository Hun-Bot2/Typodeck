---
version: alpha
name: Atelier Noir
description: A high-fashion editorial presentation system set in porcelain on near-black, with tall Italiana serif statements carrying one italic accent word each, whisper-light Montserrat body copy, widely tracked gallery caps, a giant cropped issue numeral looming behind the content, and oversized runway margins with a rotated margin note. Typography-only register: no dividers, bars, or rules exist — hierarchy is carried by the two type voices, tonal layering, and vast whitespace alone. The effect sits between a runway program and a gallery wall text — couture, sparse, and nocturnal.
colors:
  noir: "#1D1C1B"
  porcelain: "#FAF8F5"
  gallery-gray: "#999999"
  soft-line: "#C9C9C9"
  accent-ivory: "#E8E2D8"
  wine: "#4A0E18"
shadows:
  none-flat: "none"
typography:
  runway-hero:
    fontFamily: "'Italiana', serif"
    fontSize: "126px"
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0em
  display:
    fontFamily: "'Italiana', serif"
    fontSize: "88px"
    fontWeight: 400
    lineHeight: 1.16
  headline:
    fontFamily: "'Italiana', serif"
    fontSize: "60px"
    fontWeight: 400
    lineHeight: 1.18
  subhead:
    fontFamily: "'Italiana', serif"
    fontSize: "42px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 300
    lineHeight: 1.7
  hero-tagline:
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: "33px"
    fontWeight: 300
    lineHeight: 1.65
  quote-body:
    fontFamily: "'Italiana', serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.3
  gallery-label:
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.3em
    textTransform: uppercase
  issue-line:
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.34em
    textTransform: uppercase
  margin-note:
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.4em
    textTransform: uppercase
  context-line:
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: 27px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0.04em
spacing:
  hairline: 1px
  margin-runway: 170px
  margin-main-left: 250px
  margin-main-right: 640px
  gutter-vline-1: 150px
  gutter-vline-2: 1210px
  content-max-width: 1030px
canvas:
  width: 1920px
  height: 1080px
components:
  issue-numeral:
    fontFamily: "'Italiana', serif"
    fontSize: 780px
    color: "{colors.porcelain}"
    opacity: 0.13
    description: "Giant cropped numeral bled off the right edge behind the content. Whisper opacity, never above 15%."
  accent-word:
    fontStyle: italic
    color: "{colors.accent-ivory}"
    description: "Exactly one italic serif word per display headline. Synthesized oblique on Italiana, ivory tint."
  kicker:
    color: "{colors.porcelain}"
    fontFamily: "'Montserrat', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 500
    letterSpacing: 0.3em
    textTransform: uppercase
    description: "Bare porcelain kicker word in tracked caps, top-left of the spread. No bar, no mark."
  margin-note-rail:
    rotation: 180deg
    description: "Rotated tracked-caps note running down the left margin gutter in dim gallery gray."
  footer-row:
    description: "Whitespace-separated footer with context left and folio right. No rule."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. The runway margins, zone boundaries, and the giant numeral's crop are fixed stage coordinates — they scale only with the single stage transform, never with viewport-relative units.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and numeral collisions.

## Overview

Atelier Noir is a **high-fashion editorial presentation system**. Its foundational premise is the **spread**: every slide is a full-bleed magazine spread with oversized margins, one porcelain serif statement, and a looming issue numeral. Layouts feel tailored and nocturnal — vast black margins, tonal layering, and tracked-out caps keep the whole deck on the runway.

The type stack is two faces working in concert. **Italiana** is the display face — a tall hairline roman with couture proportions that carries headlines, the issue numeral, and quote bodies. **Montserrat** is everything else — whisper-light 300 for body and taglines, tracked 500 caps for gallery labels, issue lines, margin notes, and folios. The light/heavy, serif/sans, roman/caps contrasts are the entire typographic drama.

The palette is built around **noir as ground** (`{colors.noir}`) with **porcelain** display text, **gallery gray** chrome, and **soft-line** secondary text. There are no fills, no tints, no gradients, no bars — black, porcelain, and gray only. The `{colors.wine}` token is retained for palette identity but retired from the visible vocabulary: at 1.23:1 on noir it cannot render as text, and the bar that carried it is retired.

Depth in this system is achieved without any shadow or blur: the issue numeral recedes through **opacity alone** (13%), the margin note dims to 70%, and content advances through **porcelain brightness**. Layering is tonal, never spatial.

**Density philosophy: runway sparse.** One statement per slide — kicker, issue line, serif headline with its italic word, tagline, footer — surrounded by hundreds of pixels of black. The left margin carries only the rotated note; the right third belongs to the numeral. A typical slide carries ~40 words total; anything denser breaks the couture register.

**Key Characteristics:**
- Giant cropped issue numeral at 13% opacity bled off the right edge.
- Porcelain Italiana headlines with exactly one italic accent word each.
- Whitespace-structured zones instead of dividers, boxes, or panels.
- Oversized runway margins (150px+) with a rotated margin note on the left rail.
- Widely tracked Montserrat caps (+0.3em and above) for all chrome in gallery gray.
- Two-font stack: Italiana (display), Montserrat (body + chrome) — never substitute.
- Zero shadows, zero fills, zero decoration outside the numeral and the type.

## Colors

### Palette

- **Noir** (`{colors.noir}` — `#1D1C1B`): The spread ground. Near-black, never pure black.
- **Porcelain** (`{colors.porcelain}` — `#FAF8F5`): Display headlines, kicker word, numeral, context line.
- **Gallery Gray** (`{colors.gallery-gray}` — `#999999`): Tracked caps chrome — labels, issue line, folio, top row.
- **Soft Line** (`{colors.soft-line}` — `#C9C9C9`): Tagline and secondary body text.
- **Accent Ivory** (`{colors.accent-ivory}` — `#E8E2D8`): The italic accent word — a breath warmer than porcelain.
- **Wine** (`{colors.wine}` — `#4A0E18`): Retained token; retired from the visible vocabulary (unreadable on noir, and its bar is retired).

### Defaults

- **Default surface background**: `{colors.noir}` flat. No vignette, no texture, no gradient.
- **Default headline color**: `{colors.porcelain}` with one `{colors.accent-ivory}` italic word.
- **Default body text color**: `{colors.soft-line}` for taglines, `{colors.gallery-gray}` for chrome.
- **Default numeral treatment**: porcelain at 13% opacity, cropped by the right stage edge.
- **Default zone separation**: none — whitespace separates margin, content, and numeral field; dividers do not exist.
- **Default wine usage**: none — the token is retained but unrendered.

Porcelain on noir holds excellent contrast at all sizes; gallery gray is restricted to caps chrome at 18px+ tracked wide. No other text color is allowed.

**Color-comfort decision (2026-11-04): adjust luminance (lift ground).** Noir `#111111`→`#1D1C1B` narrows the extreme porcelain range 17.81:1→16.05:1 while keeping the couture nocturnal ground (still neutral near-black; monochrome identity untouched, no saturation to restrain). All ink pairs re-measured on the new ground: porcelain 16.05:1, accent-ivory 13.21:1, soft-line 10.28:1, gallery-gray 5.97:1. Wine stays retired. Harness `accent` remapped wine→porcelain in `theme.mjs` (wine kicker was 1.23:1, unreadable; the design's kicker is porcelain tracked caps). Typo-only shapes unchanged — color values only.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Italiana** is the display face — a tall single-weight roman with hairline contrast and couture proportions. Used for every headline, the issue numeral, and quote bodies. Italiana's elongated elegance is what makes the system feel runway-native; replacing it with a sturdy serif or any sans breaks the entire aesthetic. It ships only weight 400 — hierarchy comes from size and the italic accent word, never from weight.

**Montserrat** is the support face — a clean geometric sans used light (300) for body, taglines, and context, and medium (500) tracked wide for every caps label. The 300/500 contrast within the one family is the system's quiet engine: whispers for prose, spaced authority for chrome.

Never use Montserrat for headlines or the numeral, never use Italiana for body, labels, or chrome. The two-role separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.runway-hero}` | 126px | Italiana | 400 | Cover runway headline with italic word |
| `{typography.display}` | 88px | Italiana | 400 | Large section opener |
| `{typography.headline}` | 60px | Italiana | 400 | Primary section headline |
| `{typography.subhead}` | 42px | Italiana | 400 | Region subheading |
| `{typography.body}` | 26px | Montserrat | 300 | Paragraph body |
| `{typography.hero-tagline}` | 33px | Montserrat | 300 | Tagline below the hero |
| `{typography.quote-body}` | 48px | Italiana | 400 | Quote text |
| `{typography.gallery-label}` | 20px | Montserrat | 500 | Tracked caps chrome labels |
| `{typography.issue-line}` | 22px | Montserrat | 500 | Issue line above the headline |
| `{typography.margin-note}` | 18px | Montserrat | 500 | Rotated left-rail note |
| `{typography.context-line}` | 27px | Montserrat | 300 | Footer context line |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display headline carries exactly one italic accent word.** Zero reads as unfinished; two or more reads as indecisive. The accent word renders in `{colors.accent-ivory}` italic.
- **Every caps label tracks at +0.3em or wider** — +0.3em for gallery labels, +0.34em for the issue line, +0.4em for the margin note. Tighter tracking reads as corporate, not couture.
- **Every tagline uses Montserrat 300 at 1.65 line-height in soft-line gray.** Heavier weight or tighter leading shouts over the serif.
- **Every issue line pairs gray caps with a porcelain numeral.** The `N° 11` in porcelain is the line's focal beat.
- **Every context line stays sentence case at 300 weight.** Uppercasing the context line makes it compete with the chrome.
- **Every numeral uses bare Italiana at whisper opacity.** Outlined, filled-bright, or shadowed numerals do not exist.

### Typography Principles

The voice contrast is **tall serif statement ↔ whisper-light sans ↔ spaced caps chrome**. Switching any role to a different face flattens the system into a generic dark deck. Italic appears only in the single accent word — never in body, never in chrome, never in quotes.

Italiana should always feel **tailored** — generous leading, no tracking, the italic word as the single gesture. Montserrat 300 should always feel **hushed** — light, airy, gray. Montserrat 500 caps should always feel **measured** — widely spaced, gray, precise.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Each slide renders at exactly 1920×1080 and scales uniformly via a single transform (`deck-stage.js` or equivalent). Letterboxing is permitted; reflowing is not.

Default spread anatomy: top row at 96px (kicker left, year right); main column from 250px (issue line, headline, tagline) between x=250 and x=1210; rotated margin note centered on the left rail; numeral bled off the right edge centered vertically; footer row above 92px bottom with context left and folio right. The right third of the stage belongs to the numeral — content never enters it.

### Persistent Chrome

Five elements appear on every slide:
- **Top row** — bare porcelain kicker left, gray year right, in tracked caps.
- **Margin note** — rotated note in the left gutter.
- **Numeral field boundary** — the content/numeral division at x=1210 is positional only; no line marks it.
- **Issue numeral** — giant cropped numeral behind the right field at 13%.
- **Footer** — whitespace-separated row with sentence-case context left and tracked folio right.

There is no nav rail, no counter, no progress chrome — the folio (`01`) in the footer is the only numbering.

## Depth and Elevation

### Tonal Layering (Signature)

This system has **no shadows, no blur, no gloss, no gradients, no dividers, and no bars**. Depth is carried entirely by tone: porcelain content at 100% advances, the margin note at 70% whispers, the numeral at 13% recedes. Introducing any drop shadow, glow, bevel, or line breaks the couture register immediately.

### Opacity Discipline

Three alpha levels exist and no others: 100% (content), 70% (margin note), 13% (numeral). No element may use an intermediate alpha — tonal ambiguity flattens the spread.

### The Retired Wine

The wine token is retained but unrendered: the 8×44 bar that carried it is retired, and wine cannot render as text on noir. No chromatic pixel appears on the slide; the spread is strictly monochrome.

## Shapes and Treatment

### Border Radius

There are no boxes, rules, or bars at all. The system is pure type on noir: numeral, headlines, chrome, and whitespace. If a bordered element ever appears (emergency only), it is square — but the register forbids it. Rounded corners do not exist in this register.

### Border Weights

Borders do not exist. There are no dividers, footer rules, wine bars, frames, chips, outlines, or boxes. Whitespace is the only structure.

### Decorative Element Types

**Issue numeral** — ~780px Italiana numeral at 13% porcelain, vertically centered, bled off the right edge. The spread's backdrop and scale event.

**Accent word** — The single italic ivory word inside each headline. The spread's only gesture.

**Kicker** — Bare porcelain tracked-caps word. Opens every spread top-left.

**Margin-note rail** — Rotated (+180°) tracked-caps note in the left gutter. The spread's whisper.

**Footer row** — Context (sentence case, light) left and folio (tracked caps, gray) right, whitespace-separated.

**Issue line** — Gray tracked caps with a porcelain `N°` numeral beat above the headline.

## Do's and Don'ts

### Do

- Bleed the giant numeral off the right edge at 13% on every slide.
- Give every headline exactly one italic ivory accent word — never zero, never two.
- Structure every spread with whitespace zones — no dividers, no bars, no rules.
- Hold the runway margins — content between x=250 and x=1210, numeral field clear right.
- Track every caps label at +0.3em or wider in gallery gray.
- Open every spread with the bare porcelain kicker — no bar, no mark.
- Run the rotated margin note down the left gutter on every slide.
- Keep spreads to ~40 words — one statement, one tagline, quiet chrome.

### Don't

- Don't add shadows, glows, gradients, fills, boxes, dividers, or bars — tone and type only.
- Don't round anything — there are no containers to round.
- Don't set headlines in any face but Italiana or chrome in any face but Montserrat.
- Don't use a second accent word or a second color anywhere — the spread is monochrome.
- Don't track caps tighter than +0.3em — tight tracking reads corporate.
- Don't fill the numeral bright, outline it, or shadow it — 13% flat, always.
- Don't let content enter the numeral field right of x=1210.
- Don't uppercase body text or italicize anything but the accent word.
- Don't add nav dots, counters, progress bars, or badges — the folio is the numbering.
- Don't densify — a crowded spread is a failed spread; cut words instead.

## Responsive Behavior

Atelier Noir is a **fixed-stage system** built around 1920×1080 stage coordinates. There are no viewport-fluid rules and no breakpoints for the deck itself — the single stage transform scales the spread and numeral uniformly to any screen.

### Scaling Behavior

- Runway margins, zone boundaries, and the numeral crop are fixed stage values.
- Headline sizes and caps tracking are fixed — they scale only via the stage transform.

### Component Breakpoints

None. The spread never reflows. On narrow portrait phones the stage letterboxes — the composition stays exactly art-directed.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions use a 900ms slow fade — a gallery dissolve, no movement.
- The `prefers-reduced-motion` media query shortens the fade to a hard cut.

### Animation Triggers

The numeral fades in first (600ms), then the headline rises 12px into place, then chrome fades in staggered 100ms apart. No hover, scroll, or loop animation exists — the spread is still by design.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; for static export, screenshots of each slide preserve the tonal layering. Noir prints as a rich flat black ground.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display headlines / numeral | Italiana 400 | Noto Serif KR 400–600 (no hairline CJK equivalent) |
| Body / caps chrome | Montserrat 300/500 | Noto Sans KR 300–500, Noto Serif KR for the accent word |

### Mixed-Content Strategy

**Strategy A** — serif/sans CJK pairing preserving the system's contrast. Set headlines to `'Noto Serif KR', serif` and body/chrome to `'Noto Sans KR', sans-serif`. Keep Montserrat for pure-ASCII numerals (`N° 11`, `01`, `2026`) where runs are Latin-only. Mixed lines never font-switch mid-sentence.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Display 1.3–1.4 (up from 1.14–1.2), body 1.85–2.0 (up from 1.65–1.7).
- **Letter-spacing**: set to 0 on every CJK run. The +0.3em caps tracking looks broken on square CJK glyphs.
- **Text transform**: don't apply `uppercase` to CJK text. Render Korean chrome labels without transform.
- **Punctuation**: use full-width Korean punctuation where appropriate.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between every CJK character and adjacent Latin character or digit.
- **One font per sentence**: let the Noto CJK faces handle mixed sentences.

### Aesthetic Notes for This System

The system's identity rests on hairline serif + whisper sans + spaced caps + tonal layering. A CJK build loses Italiana's hairline (Noto Serif KR is sturdier) but keeps everything structural: the numeral field, zone positions, and vast margins carry full recognition. The italic accent word has no CJK mechanism — render the accent word in Noto Serif KR 600 at porcelain brightness against the 400-weight headline instead of slanting.

Korean chrome labels lose the +0.3em tracking; compensate with wider word spacing and the dimmed gray tone to keep the measured feel.

### Known CJK Gap

- **No hairline CJK serif.** Italiana's couture hairline has no Korean equivalent; Noto Serif KR 400 is the lightest available and reads sturdier. Reduce CJK display size ~10% to hold elegance.
- **No CJK italic.** The signature accent-word slant cannot render in Korean; weight-and-brightness contrast (600 vs 400) substitutes for the gesture.

## Iteration Guide

1. Any new slide gets the top row, the margin note, the numeral field, and the footer row. Don't skip the chrome.
2. Any new display element uses Italiana with exactly one italic accent word. Any new body element uses Montserrat 300. Any new label uses Montserrat 500 tracked caps. Never cross the role boundaries.
3. Any new headline gets its accent word in italic accent-ivory — one word, never zero, never two.
4. Any new label tracks at +0.3em minimum in gallery gray. Don't substitute a plain h-tag.
5. Any new slide carries no color event — the spread is monochrome; wine stays retired.
6. Any new structure is whitespace — dividers, bars, boxes, frames, and panels do not exist here.
7. Any new numeral bleeds off the right edge at 13% — vertically centered, cropped, flat.
8. Any new spread holds ~40 words maximum. Cut words before shrinking type or margins.
9. If a slide needs emphasis beyond the headline, enlarge nothing — let the numeral do the work.
10. Animated elements (numeral fade, headline rise, chrome stagger) should respect `prefers-reduced-motion`. The spread itself is static and stays on always.

## Known Gaps

- **Fonts**: Italiana / Montserrat via Google Fonts CDN (`display=swap`); fallbacks `serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the hairline serif voice.
- **Accent-word paint is JS-applied** on the cover: the headline ships as contiguous text and a small script wraps the accent word. If JS fails, the headline renders in flat porcelain — correct content, missing gesture.
- **Overflow guard is JS-applied**: headline size steps down until the whole main block (issue line + headline + tagline) fits above the footer row. Without JS, very long titles can collide with the footer.
- **The accent italic is synthesized oblique.** Italiana ships no true italic; browsers slant the roman. The 600-weight CJK substitute is documented for Korean builds.
- **The numeral value is per-edition manual.** Nothing binds the `11` to content; authors must update it when the edition changes.
- **No dividers, bars, or rules.** The typography-only register renders none of the retired hairlines or the wine bar; decks must not reintroduce them.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A |
| 2 | Blend modes | None used | full | N/A |
| 3 | Animation / keyframes | Gallery fade + staggered chrome | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | None used | full | N/A |
| 5 | Gradients | None used | full | N/A |
| 6 | Grain / scanline / noise overlays | None used | full | N/A |
| 7 | Transparency layers | Numeral 13% alpha only | partial | Opaque gray approximation (numeral #2A2A2A) |
| 8 | Custom fonts | Italiana / Montserrat via Google Fonts CDN | partial | Embedded subset or Didot / Arial substitution |
| 9 | Absolute-positioned decor | Numeral + margin note (type only) | full | Native text boxes 1:1 |
