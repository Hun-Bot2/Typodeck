---
version: alpha
name: Bubble OS
description: A Y2K candy presentation system on a flat ice-blue ground with solid aqua/bubblegum candy rails, plump Baloo 2 display type with layered color-word headlines, soft Quicksand body copy, and scattered star-glyph sparkles. Typography-only register: no cards, pills, gradients, gloss, shadows, or dividers exist — hierarchy is carried by the two type voices, candy color words, and whitespace alone. The effect sits between a candy store and a tomorrowland OS splash screen — buoyant and optimistic.
colors:
  ice-blue: "#E8F4FF"
  ice-deep: "#D5E8FF"
  deep-indigo: "#1B1F6B"
  indigo-soft: "#3A3F8F"
  bubblegum: "#FF7AD9"
  bubble-deep: "#D12E7F"
  aqua: "#7AF0FF"
  aqua-pale: "#A5F5FF"
  lilac: "#B388FF"
  card-white: "#FFFFFF"
shadows:
  bubble-card: "14px 14px 0 rgba(27, 31, 107, 0.14), 0 30px 70px rgba(27, 31, 107, 0.20)"
  pill-drop: "0 3px 0 rgba(27, 31, 107, 0.25)"
  pill-shine: "inset 0 3px 0 rgba(255, 255, 255, 0.55)"
  band-edge: "0 4px 0 rgba(27, 31, 107, 0.18)"
  highlight-inset: "inset 0 3px 0 rgba(255, 255, 255, 0.7)"
typography:
  bubble-hero:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontSize: "100px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0em
  display:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontSize: "64px"
    fontWeight: 700
    lineHeight: 1.12
  headline:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.15
  subhead:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.6
  hero-tagline:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 500
    lineHeight: 1.4
  quote-body:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 500
    lineHeight: 1.5
  label-pill:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.12em
    textTransform: uppercase
  caption:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.5
  context-line:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: 27px
    fontWeight: 600
    lineHeight: 1.4
  page-pill:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1
spacing:
  bubble-unit: 4px
  pad-slide: "120px"
  pad-card: "60px 84px 56px"
  gap-pill: 20px
  radius-bubble: 48px
  radius-pill: 999px
  content-max-width: 1580px
canvas:
  width: 1920px
  height: 1080px
components:
  candy-rail:
    heightTop: 118px
    heightBottom: 92px
    backgroundTop: "{colors.aqua}"
    backgroundBottom: "{colors.bubblegum}"
    description: "Flat solid full-bleed rails bookending the slide top (aqua) and bottom (bubblegum). No gradient, no radius, no gloss."
  tag-line:
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontWeight: 700
    letterSpacing: 0.12em
    textTransform: uppercase
    description: "Universal label row: indigo and bubble-deep words separated by bubblegum ★ glyphs. No pills, no fills."
  sparkle:
    glyph: "★"
    description: "Star-glyph shine marks scattered in margins at 28-72px, mixed rotations, bubblegum/indigo/lilac. Never colliding with text."
  color-word-pink:
    color: "{colors.bubble-deep}"
    description: "Emphasis word inside display headlines. Uses the deepened bubblegum for legibility on ice — never raw bubblegum for text."
  color-word-second:
    color: "{colors.bubble-deep}"
    description: "Second emphasis word inside display headlines, also bubble-deep. Aqua survives only in the top rail, never as text or highlight."
  folio:
    color: "{colors.deep-indigo}"
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontWeight: 800
    description: "Plain Baloo 2 800 slide numeral. No pill, no fill."
  star-bullet:
    glyph: "★"
    color: "{colors.bubblegum}"
    description: "Small bubblegum ★ preceding the context line."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. Candy rails, sparkles, and type scale with the single stage transform, never with viewport-relative units.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and rail collisions.

## Overview

Bubble OS is a **Y2K candy presentation system**. Its foundational premise is **candy type on ice**: every label is a tracked tag word, every headline layers color word by word, and a scatter of star sparkles floats in the margins. Layouts feel buoyant — bouncy Baloo 2, candy color words, and shine marks keep the whole deck floating on the flat ice ground.

The type stack is two faces working in concert. **Baloo 2** is the display face — a plump, rounded, extrabold-friendly sans that carries headlines, tag words, and folios with unmistakable toy-like warmth. **Quicksand** is the body face — a soft geometric sans with round terminals that reads cleanly at 22–38px and never fights Baloo 2 for attention. There is no third face: labels and numerals are all Baloo 2, which keeps the voice unified and candy-consistent.

The palette is built around **flat ice blue as ground** (`{colors.ice-blue}`) lit by **three candy brights** — bubblegum, aqua, lilac — grounded by **deep indigo** for all text. Content sets directly on the ice; flat solid candy rails (aqua top, bubblegum bottom) bookend every slide. Candy brights never appear as small body text — bubblegum text uses the deepened `{colors.bubble-deep}` variant, and aqua appears only in the top rail and star accents.

Depth is the system's deliberate absence: **flat candy color, no gloss, no drops, no shadows**. Hierarchy comes from scale, candy color words, and whitespace — the result reads as crisp candy print, not vinyl.

**Density philosophy: buoyant but organized.** One centered column per slide holds the whole message — tag line, headline, tagline, footer — set directly on the decorated ice field. Sparkles live only in the margins; in the column, alignment is calm and left-anchored. A typical slide carries one color-word headline + a tag line + one tagline + the footer.

**Key Characteristics:**
- Layered color-word headlines in Baloo 2 — indigo base with bubble-deep emphasis words.
- Flat solid candy rails (aqua top, bubblegum bottom) bookending the slide.
- Tag lines for every label — indigo and bubble-deep tracked words with ★ separators; no pills.
- Star-glyph sparkles (★) scattered at mixed sizes and rotations in the margins.
- Plain Baloo 2 800 folio numerals instead of pills.
- Two-font stack: Baloo 2 (display + labels), Quicksand (body) — never substitute, never mix outside their roles.
- Candy brights reserved for rails, sparkles, and headline words — never for body text.

## Colors

### Palette

- **Ice Blue** (`{colors.ice-blue}` — `#E8F4FF`): The slide ground. Flat fill across the whole stage between the candy rails.
- **Ice Deep** (`{colors.ice-deep}` — `#D5E8FF`): Retained token; no visible role in the typography-only register.
- **Deep Indigo** (`{colors.deep-indigo}` — `#1B1F6B`): The structural color — all headline base text and tag words.
- **Indigo Soft** (`{colors.indigo-soft}` — `#3A3F8F`): Tagline and secondary text on ice. Softer than the structural indigo.
- **Bubblegum** (`{colors.bubblegum}` — `#FF7AD9`): Candy bright for the bottom rail, sparkles, and ★ separators. Never for text at this value.
- **Bubble Deep** (`{colors.bubble-deep}` — `#D12E7F`): Text-safe deepened bubblegum for headline emphasis words and the tag-line accent. Legible on ice at display sizes.
- **Aqua** (`{colors.aqua}` — `#7AF0FF`): Candy bright for the top rail. Never for text.
- **Aqua Pale** (`{colors.aqua-pale}` — `#A5F5FF`): Retained token; no visible role in the typography-only register.
- **Lilac** (`{colors.lilac}` — `#B388FF`): Candy bright for sparkles.
- **Card White** (`{colors.card-white}` — `#FFFFFF`): Retained token; no visible role in the typography-only register.

### Defaults

- **Default surface background**: `{colors.ice-blue}` flat, with the aqua top rail and bubblegum bottom rail.
- **Default headline color**: `{colors.deep-indigo}` base with `{colors.bubble-deep}` emphasis words.
- **Default body text color**: `{colors.indigo-soft}` on ice.
- **Default tag line**: indigo tag first (primary), then the bubble-deep accent — in that order — with ★ separators.
- **Default sparkle colors**: bubblegum primary, indigo at 25–35% opacity for depth, lilac accents.
- **Default footer separator**: none — whitespace rhythm separates the footer; dividers do not exist.

Text on the ground is always indigo, indigo-soft, or bubble-deep. No other text color is allowed.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Baloo 2** is the display face — a plump rounded sans with a toy-like bounce. Used for every headline, tag word, and folio numeral. Baloo 2's inflated geometry is what makes the system feel candy-native; replacing it with a grotesque or a serif breaks the entire aesthetic. Display weights are 700 with 800 reserved for folios.

**Quicksand** is the body face — a geometric sans with round terminals that echoes Baloo 2's softness at text sizes. Used for taglines, paragraphs, quote bodies, captions, and the context line. Quicksand's even color at 400–600 keeps long runs calm next to the bouncy display face.

Never use Baloo 2 for body runs, never use Quicksand for headlines or tag lines. The two-role separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.bubble-hero}` | 100px | Baloo 2 | 700 | Cover display title with color-word layering |
| `{typography.display}` | 64px | Baloo 2 | 700 | Large section opener |
| `{typography.headline}` | 44px | Baloo 2 | 700 | Primary section headline |
| `{typography.subhead}` | 30px | Baloo 2 | 700 | Card title or region subheading |
| `{typography.body}` | 26px | Quicksand | 400 | Paragraph body |
| `{typography.hero-tagline}` | 38px | Quicksand | 500 | Subtitle below the hero title |
| `{typography.quote-body}` | 34px | Quicksand | 500 | Quote text |
| `{typography.label-pill}` | 22px | Baloo 2 | 700 | Tag-line words |
| `{typography.caption}` | 22px | Quicksand | 600 | Small supporting notes |
| `{typography.context-line}` | 27px | Quicksand | 600 | Footer context line |
| `{typography.page-pill}` | 24px | Baloo 2 | 800 | Plain folio numeral |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display headline layers color word by word.** The pattern is indigo base + `{colors.bubble-deep}` emphasis words. A single flat color at display scale reads as untreated type and breaks the candy voice.
- **Every headline emphasis word uses bubble-deep, never raw bubblegum.** `#FF7AD9` text on ice fails legibility; the deepened variant keeps the candy signal at readable contrast.
- **Every tag word is uppercase Baloo 2 with +0.12em tracking.** Sentence-case or tracked-out tag text does not exist in this system.
- **Every tagline uses Quicksand 500 at 1.4 line-height.** Tighter leading crowds the round letterforms; lighter weight disappears next to Baloo 2.
- **Every context line is sentence case with a bubblegum star bullet.** Uppercasing the context line makes it shout over the headline.

### Typography Principles

The voice contrast is **plump display ↔ soft geometric body**. Switching either role to a different face flattens the system into a generic rounded aesthetic. Italic is never used — emphasis comes from color words, not slant.

Baloo 2 should always feel **buoyant** — generous line-height, no negative tracking, color doing the emphasis work. Quicksand should always feel **calm** — left-aligned, sentence case, no letter-spacing.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Each slide renders at exactly 1920×1080 and scales uniformly via a single transform (`deck-stage.js` or equivalent). Letterboxing is permitted; reflowing is not.

Default slide anatomy: candy rails (118px aqua top, 92px bubblegum bottom) frame a flat ice ground; one centered type column (1580px wide) holds tag line, headline, tagline, and footer directly on the ice. Sparkles occupy the margin ring between the column edge and the stage edge, never colliding with text.

### Persistent Chrome

Three elements appear on every slide:
- **Candy rails** — flat solid bars top (aqua) and bottom (bubblegum); no gradient, no radius, no gloss.
- **Sparkle ring** — 4–6 star glyphs scattered in the margins at 28–72px, mixed rotations.
- **Footer** — context line with star bullet + plain folio numeral, pinned to the column bottom with whitespace above.

The cursor and slide counter are inherited from the deck shell; this system adds no nav dots or counters of its own — the folio is the page number.

## Depth and Elevation

### Flat Candy Color (Signature)

The system uses **flat candy color** as its only depth signal. No gloss, no shine, no offset drops, no shadows of any kind are rendered; the retained shadow tokens are unrendered. Hierarchy comes from scale, color words, and whitespace on the flat ice ground.

### No Drops, No Gloss

All drops and shines are retired: no card offsets, no pill drops, no inset top-shine, no gloss overlays. Blurred black shadows and colored glows do not exist anywhere in the system, and neither do the former indigo offsets. If an element needs emphasis, color a word — never lift it.

## Shapes and Treatment

### Border Radius

Roundness lives in the letterforms, not in shapes: no cards, pills, highlight spans, or rounded rails exist in the typography-only register. Baloo 2's inflated geometry carries all the candy softness; any rounded container would break the flat-candy register.

### Border Weights

Borders do not exist. There are no card keylines, footer dividers, pill outlines, or hairline rules. Whitespace is the only separator.

### Decorative Element Types

**Candy rail** — Flat solid full-bleed bar: aqua top, bubblegum bottom. No gradient, no radius, no gloss. Always paired top + bottom.

**Tag line** — Indigo and bubble-deep tracked words with ★ separators above headlines. No pills, no fills.

**Sparkle** — A ★ glyph at 28–72px in bubblegum, indigo, or lilac, rotated −12° to +10°. Lives only in the margin ring, 4–6 per slide, never colliding with text.

**Color-word emphasis** — Headline words in bubble-deep. Carries the semantic emphasis of the statement.

**Folio** — Plain Baloo 2 800 slide numeral. The system's only page number.

**Star bullet** — A small bubblegum ★ preceding the context line.

## Do's and Don'ts

### Do

- Layer every display headline in two colors: indigo base with bubble-deep emphasis words.
- Use the deepened `{colors.bubble-deep}` for all pink text — raw bubblegum is rails-and-sparkles-only.
- Keep every surface flat: no cards, no pills, no highlight spans, no gloss.
- Scatter 4–6 sparkles in the margin ring of every slide at mixed sizes and rotations, clear of text.
- Keep tag words in the canonical order: indigo first, then the bubble-deep accent.
- Set content directly on the ice with whitespace rhythm — never a container.
- Bookend every slide with the paired flat candy rails.

### Don't

- Don't set any headline in a single flat color — color-word layering is non-optional.
- Don't use raw `#FF7AD9` or `#7AF0FF` for text — both fail contrast on ice.
- Don't add cards, pills, keylines, dividers, gloss, or shadows of any kind.
- Don't place sparkles where they collide with text — the clear margin ring is their only home.
- Don't use dividers of any kind — whitespace separates the footer; folios are plain numerals.
- Don't introduce a fourth candy or a neon — the trio is bubblegum + aqua + lilac.
- Don't use Baloo 2 for body or Quicksand for headlines — each face has a single role.
- Don't drop the candy rails — unbookended ice reads as an empty field.
- Don't use italic, underline, or all-caps body text — emphasis is color words only.
- Don't use shadows, glows, or gloss anywhere — flat candy color only.

## Responsive Behavior

Bubble OS is a **fixed-stage system** built around 1920×1080 stage coordinates. There are no viewport-fluid rules and no breakpoints for the deck itself — the single stage transform scales rails, type, and sparkles uniformly to any screen.

### Scaling Behavior

- The centered type column keeps its 1580px width in stage coordinates at every viewport.
- Tag type, headline sizes, and sparkle positions are fixed stage values — they scale only via the stage transform.

### Component Breakpoints

None. The layout is a single centered column; it never reflows into cards or stacks. On narrow portrait phones the stage letterboxes — content stays exactly composed.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions use 600ms ease-out on opacity + a 24px rise — soft, buoyant motion.
- The `prefers-reduced-motion` media query disables transitions; static rails and sparkles stay on always.

### Animation Triggers

Tag words stagger in with a 90ms delay cascade and a gentle fade. The type column fades up on entry. Sparkles carry a slow 4s twinkle (opacity 0.5 → 1.0) unless reduced motion is set. No layout animation runs on scroll or hover.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; for static export, screenshots of each slide preserve the flat candy colors. Sparkles and rails print as flat vector shapes.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / tag lines | Baloo 2 600–800 | Gmarket Sans Bold via CDN, else Noto Sans KR 700 |
| Body / tagline / context | Quicksand 400–600 | Noto Sans KR 400–500 |

### Mixed-Content Strategy

**Strategy A** — CJK family with Latin coverage for body, display face preserved for Latin numerals. Set body elements to `'Noto Sans KR', sans-serif`; keep Baloo 2 for tag numerals and the folio where runs are Latin-only. Mixed lines like `11개 포스트모템` render the digits in Baloo 2 only when isolated in their own element — never font-switch mid-sentence.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Baloo+2:wght@600;700;800&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Display 1.25–1.35 (up from 1.1–1.15), body 1.75–1.85 (up from 1.4–1.6).
- **Letter-spacing**: set to 0 on every CJK run. The +0.12em tag tracking looks broken on square CJK glyphs.
- **Text transform**: don't apply `uppercase` to CJK text. Render Korean tag words without transform at weight 700.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between every CJK character and adjacent Latin character or digit.
- **One font per sentence**: let Noto Sans KR handle mixed sentences; don't fall back to Baloo 2 mid-sentence for ASCII.

### Aesthetic Notes for This System

The system's identity rests on plump rounded display type + candy color-word layering + rails and sparkles. A CJK build loses Baloo 2's bounce but keeps everything else: the bubble-deep emphasis words still work on Noto Sans KR 700, and they carry the candy voice when the face itself is generic. Keep all candy rails, tag lines, and sparkles — they do more identity work in a CJK build than in the Latin original.

Tag words in Korean should stay short (2–4 characters) to preserve the tag rhythm.

### Known CJK Gap

- **No CDN-loadable plump Korean display face.** Baloo 2's inflated bounce has no Korean equivalent on Google Fonts; Noto Sans KR 700 gives weight but loses the toy signal. Rails, sparkles, and color-word layering must carry the candy voice on their own.
- **Round-terminal Korean body face unavailable.** Quicksand's round terminals have no CJK counterpart; Noto Sans KR renders with standard terminals.

## Iteration Guide

1. Any new slide gets the paired candy rails, the sparkle ring (4–6 stars), and one centered type column. Don't skip the rails.
2. Any new display element uses Baloo 2 with two-color word layering. Any new body element uses Quicksand. Never cross the role boundaries.
3. Any new headline gets indigo base + bubble-deep emphasis words — in that emphasis order.
4. Any new label is a tag word in the tag line, uppercase Baloo 2 at +0.12em. Don't substitute a pill or an h-tag.
5. Any new content sets directly on the ice — containers of any kind are forbidden.
6. Any new footer separation is whitespace — dividers of any kind do not exist here.
7. Any new folio is a plain Baloo 2 800 numeral — bottom-right of the footer.
8. Any new decorative mark is a ★ sparkle in the margin ring. No other glyphs, no rules-as-decoration.
9. If a slide needs emphasis beyond the headline, color another word — never a container or a larger size.
10. Animated elements (tag cascade, column rise, sparkle twinkle) should respect `prefers-reduced-motion`. Rails and sparkles are static and stay on always.

## Known Gaps

- **Fonts**: Baloo 2 / Quicksand via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the plump display voice.
- **Word-layering paint is JS-applied** on the cover: the headline ships as contiguous text and a small script wraps the emphasis words. If JS fails, the headline renders in flat indigo — correct content, reduced candy signal.
- **Overflow guard is JS-applied**: title size steps down until the column fits. Without JS, very long titles can overflow the column.
- **Sparkle positions are hand-placed** per slide via absolute coordinates. There is no auto-scatter; new slides need manual sparkle placement in the margin ring.
- **Tag-line order is conventional, not enforced.** Nothing in the CSS prevents a wrong-order line; authors must follow the indigo → bubble-deep order.
- **No cards, pills, gloss, or gradients.** The typography-only register renders none of the retired chrome; decks must not reintroduce them.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in this register |
| 2 | Blend modes | None used | full | N/A |
| 3 | Animation / keyframes | Tag cascade, column rise, sparkle twinkle | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | None used | full | N/A — no shadows in this register |
| 5 | Gradients | None used (flat rails and ground) | full | N/A — no gradients in this register |
| 6 | Grain / scanline / noise overlays | None used | full | N/A |
| 7 | Transparency layers | Sparkle opacity variants only | partial | Opaque approximations of dim sparkles |
| 8 | Custom fonts | Baloo 2 / Quicksand via Google Fonts CDN | partial | Embedded subset or Arial Rounded / Verdana substitution |
| 9 | Absolute-positioned decor | Sparkles (type glyphs) | full | Native text boxes 1:1 |
