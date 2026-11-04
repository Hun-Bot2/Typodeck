---
version: alpha
name: Bubble OS
description: A Y2K chrome-and-candy presentation system on an ice-blue ground with glossy aqua/lilac/bubblegum gradient bands, plump Baloo 2 display type with layered color-word headlines, soft Quicksand body copy, white bubble cards with indigo keylines and specular gloss, pill badges for all chrome, and scattered star-glyph sparkles. The effect sits between a candy store and a tomorrowland OS splash screen — glossy, buoyant, and optimistic.
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
  bubble-card:
    background: "{colors.card-white}"
    border: "4px solid {colors.deep-indigo}"
    borderRadius: 48px
    padding: "60px 84px 56px"
    boxShadow: "{shadows.bubble-card}"
    description: "Primary content container. Always white, always 4px indigo keyline, always carries the top gloss wash and the offset indigo drop."
  pill-badge:
    padding: "10px 30px 12px"
    borderRadius: 999px
    fontFamily: "'Baloo 2', 'Arial Black', sans-serif"
    fontWeight: 700
    letterSpacing: 0.12em
    textTransform: uppercase
    description: "Universal label. Four fills: indigo (white text), bubblegum (indigo text), aqua (indigo text), lilac (indigo text). Always inset top-shine + 3px indigo drop."
  gloss-band:
    heightTop: 118px
    heightBottom: 92px
    background: "linear-gradient(100deg, {colors.aqua} 0%, {colors.lilac} 48%, {colors.bubblegum} 100%)"
    description: "Gradient bands bookending the slide top and bottom with rounded inner corners and a white gloss overlay on the top half."
  sparkle:
    glyph: "★"
    description: "Star-glyph shine marks scattered in margins at 28-72px, mixed rotations, bubblegum/indigo/lilac. Never inside the bubble card."
  color-word-pink:
    color: "{colors.bubble-deep}"
    description: "Emphasis word inside display headlines. Uses the deepened bubblegum for legibility on white — never raw bubblegum for text."
  color-word-highlight:
    background: "linear-gradient(180deg, {colors.aqua-pale}, {colors.aqua})"
    borderRadius: 26px
    description: "Aqua highlight span for one headline word. Indigo text on the aqua gradient with inset top-shine."
  dashed-divider:
    border: "3px dashed rgba(27, 31, 107, 0.25)"
    description: "Rule separating the card footer (context line + page pill) from body content. Always dashed, never solid."
  page-pill:
    background: "{colors.lilac}"
    color: "{colors.deep-indigo}"
    description: "Chunky lilac pill holding the slide number in Baloo 2 800."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. Bubble cards keep their 1580px width and 48px radii in stage coordinates on every screen — gloss bands, sparkles, and pills scale with the single stage transform, never with viewport-relative units.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and card/band overlap.

## Overview

Bubble OS is a **Y2K chrome-and-candy presentation system**. Its foundational premise is the **bubble**: every container is a glossy rounded card, every label is a pill, every headline layers color word by word, and every surface carries a specular highlight plus a scatter of star sparkles. Layouts feel inflated and buoyant — chrome gradients, candy pills, and shine marks keep the whole deck floating.

The type stack is two faces working in concert. **Baloo 2** is the display face — a plump, rounded, extrabold-friendly sans that carries headlines, pill labels, and page numerals with unmistakable toy-like warmth. **Quicksand** is the body face — a soft geometric sans with round terminals that reads cleanly at 22–38px and never fights Baloo 2 for attention. There is no third face: chrome, labels, and numerals are all Baloo 2, which keeps the voice unified and candy-consistent.

The palette is built around **ice blue as ground** (`{colors.ice-blue}` deepening to `{colors.ice-deep}` at the edges) lit by **three candy brights** — bubblegum, aqua, lilac — grounded by **deep indigo** for all text and keylines. Content floats on white bubble cards with 4px indigo keylines; glossy gradient bands in the candy trio bookend every slide. Candy brights never appear as small body text — bubblegum text uses the deepened `{colors.bubble-deep}` variant, and aqua appears as highlight fills behind indigo words.

Depth is the system's signature trick: **specular gloss plus chunky offset drops**. Every pill and highlight span carries an inset white top-shine; every bubble card carries a 14px indigo offset block plus a soft indigo ambient blur. Bands get a white gloss overlay on their top half. The result reads as inflated vinyl and chrome, not paper.

**Density philosophy: buoyant but organized.** One bubble card per slide holds the whole message — badges, headline, tagline, footer — floating on a decorated ice field. Sparkles live only in the margins outside the card; inside the card, alignment is calm and left-anchored. A typical slide carries one color-word headline + a pill cluster + one tagline + the dashed footer, all inside a single centered card.

**Key Characteristics:**
- Layered color-word headlines in Baloo 2 — indigo base, one deep-bubblegum emphasis word, one aqua highlight span.
- White bubble cards with 40px+ radii, 4px indigo keylines, and a specular gloss wash across the top edge.
- Glossy gradient bands (aqua → lilac → bubblegum) bookending the slide top and bottom.
- Pill badges for every label in four fills — indigo, bubblegum, aqua, lilac — with inset shine and a 3px drop.
- Star-glyph sparkles (★) scattered at mixed sizes and rotations in the margins.
- Dashed indigo dividers and chunky page pills instead of hairlines or plain folios.
- Two-font stack: Baloo 2 (display + chrome), Quicksand (body) — never substitute, never mix outside their roles.
- Candy brights reserved for fills, bands, and one headline word each — never for body text.

## Colors

### Palette

- **Ice Blue** (`{colors.ice-blue}` — `#E8F4FF`): The slide ground. Fills the stage between the gloss bands.
- **Ice Deep** (`{colors.ice-deep}` — `#D5E8FF`): Edge deepening for the ground gradient at the top and bottom of the stage.
- **Deep Indigo** (`{colors.deep-indigo}` — `#1B1F6B`): The structural color — all headline base text, card keylines, pill text on candy fills, and offset drops.
- **Indigo Soft** (`{colors.indigo-soft}` — `#3A3F8F`): Tagline and secondary text on white. Softer than the keyline indigo.
- **Bubblegum** (`{colors.bubblegum}` — `#FF7AD9`): Candy bright for pill fills, band stops, and sparkles. Never for text at this value.
- **Bubble Deep** (`{colors.bubble-deep}` — `#D12E7F`): Text-safe deepened bubblegum for the headline emphasis word. Legible on white at display sizes.
- **Aqua** (`{colors.aqua}` — `#7AF0FF`): Candy bright for pill fills, band stops, and highlight spans. Never for text.
- **Aqua Pale** (`{colors.aqua-pale}` — `#A5F5FF`): Top stop of the highlight-span gradient.
- **Lilac** (`{colors.lilac}` — `#B388FF`): Candy bright for the page pill, band mid-stop, and sparkles.
- **Card White** (`{colors.card-white}` — `#FFFFFF`): Bubble card fill. The only white surface in the system.

### Defaults

- **Default surface background**: `{colors.ice-blue}` deepening to `{colors.ice-deep}` at stage edges, with gloss bands top and bottom.
- **Default headline color**: `{colors.deep-indigo}` base with one `{colors.bubble-deep}` word and one aqua highlight span.
- **Default body text color**: `{colors.indigo-soft}` on card white.
- **Default pill cluster**: indigo pill first (primary tag), then bubblegum, then aqua — in that order.
- **Default sparkle colors**: bubblegum primary, indigo at 25–35% opacity for depth, lilac accents.
- **Default footer divider**: 3px dashed indigo at 25% opacity.

Candy fills always pair with indigo text except the indigo pill itself, which carries white text. No other text-on-candy combination is allowed.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Baloo 2** is the display face — a plump rounded sans with a toy-like bounce. Used for every headline, pill label, page numeral, and highlight span. Baloo 2's inflated geometry is what makes the system feel candy-native; replacing it with a grotesque or a serif breaks the entire aesthetic. Display weights are 700 with 800 reserved for page numerals and 600 for small pill labels.

**Quicksand** is the body face — a geometric sans with round terminals that echoes Baloo 2's softness at text sizes. Used for taglines, paragraphs, quote bodies, captions, and the context line. Quicksand's even color at 400–600 keeps long runs calm next to the bouncy display face.

Never use Baloo 2 for body runs, never use Quicksand for headlines or pills. The two-role separation is the typographic structure.

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
| `{typography.label-pill}` | 22px | Baloo 2 | 700 | Text inside pill badges |
| `{typography.caption}` | 22px | Quicksand | 600 | Small supporting notes |
| `{typography.context-line}` | 27px | Quicksand | 600 | Footer context line |
| `{typography.page-pill}` | 24px | Baloo 2 | 800 | Slide numeral in the page pill |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display headline layers color word by word.** The pattern is indigo base + one `{colors.bubble-deep}` emphasis word + one aqua highlight span. A single flat color at display scale reads as untreated type and breaks the candy voice.
- **Every headline emphasis word uses bubble-deep, never raw bubblegum.** `#FF7AD9` text on white fails legibility; the deepened variant keeps the candy signal at readable contrast.
- **Every pill label is uppercase Baloo 2 with +0.12em tracking.** Sentence-case or tracked-out pill text does not exist in this system.
- **Every highlight span carries the inset top-shine.** The aqua gradient without its specular inset reads as a flat marker swipe, not chrome.
- **Every tagline uses Quicksand 500 at 1.4 line-height.** Tighter leading crowds the round letterforms; lighter weight disappears next to Baloo 2.
- **Every context line is sentence case with a bubblegum star bullet.** Uppercasing the context line makes it shout over the headline.

### Typography Principles

The voice contrast is **plump display ↔ soft geometric body**. Switching either role to a different face flattens the system into a generic rounded aesthetic. Italic is never used — emphasis comes from color words and highlight spans, not slant.

Baloo 2 should always feel **buoyant** — generous line-height, no negative tracking, color doing the emphasis work. Quicksand should always feel **calm** — left-aligned, sentence case, no letter-spacing.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Each slide renders at exactly 1920×1080 and scales uniformly via a single transform (`deck-stage.js` or equivalent). Letterboxing is permitted; reflowing is not.

Default slide anatomy: gloss bands (118px top, 92px bottom) frame an ice ground; one bubble card (1580px wide, max 850px tall) centers on the stage with 60px/84px internal padding. Sparkles occupy the margin ring between the card edge and the stage edge. Nothing except bands and sparkles lives outside the card.

### Persistent Chrome

Three elements appear on every slide:
- **Gloss bands** — gradient bars top and bottom with rounded inner corners and a white gloss overlay.
- **Sparkle ring** — 6–10 star glyphs scattered in the margins at 28–72px, mixed rotations.
- **Card footer** — dashed divider + context line with star bullet + lilac page pill, pinned to the card bottom.

The cursor and slide counter are inherited from the deck shell; this system adds no nav dots or counters of its own — the page pill inside the card is the folio.

## Depth and Elevation

### Specular Gloss (Signature)

The system uses **inset white top-shine** as its primary depth signal. Every pill, highlight span, and gloss band carries a white gradient or inset shadow across its top 40–50%: pills use `{shadows.pill-shine}`, highlight spans use `{shadows.highlight-inset}`, bands use a 65%-white overlay fading to transparent. The shine always comes from above — bottom or side shines do not exist.

### Chunky Offset Drops

Two offset patterns serve the system:
- `{shadows.bubble-card}` — a 14px solid indigo offset at 14% plus a 70px ambient indigo blur. Used exclusively on the bubble card.
- `{shadows.pill-drop}` — a 3px solid indigo drop at 25%. Used on every pill and page numeral.

All drops step down (and down-right for the card block) in the indigo keyline color. Blurred black shadows and colored glows do not exist anywhere in the system.

### Gloss Wash as Depth

The bubble card's top gloss wash (`::before`, aqua at 30% fading to transparent over 120px) provides ambient depth without shadow. Band gloss overlays work the same way. These washes are core to the chrome perception, not decorative add-ons.

## Shapes and Treatment

### Border Radius

Everything is round. The bubble card uses 48px radii; pills and page numerals are fully rounded (999px); highlight spans use 26px; gloss bands round only their inner corners (44px). Sharp corners appear nowhere except the stage edge itself — a square card or square badge breaks the candy aesthetic immediately.

### Border Weights

- **4px solid indigo** — the bubble-card keyline. The only structural border in the system.
- **3px dashed indigo at 25%** — the card footer divider.
- **No borders on pills** — pills are defined by fill + shine + drop, never by outline.

Borders are always indigo. Candy-colored borders and hairline rules do not exist here.

### Decorative Element Types

**Bubble card** — White rounded container with indigo keyline, top gloss wash, and offset drop. Holds the entire slide message.

**Pill badge** — Fully rounded label in one of four fills (indigo/bubblegum/aqua/lilac) with inset shine and a 3px drop. Appears in clusters of 2–3 above headlines.

**Gloss band** — Full-width gradient bar (aqua → lilac → bubblegum) with rounded inner corners and a gloss overlay. Always paired top + bottom.

**Sparkle** — A ★ glyph at 28–72px in bubblegum, indigo, or lilac, rotated −12° to +10°. Lives only in the margin ring, 6–10 per slide.

**Color-word emphasis** — One headline word in bubble-deep. Carries the semantic emphasis of the statement.

**Highlight span** — One headline word on an aqua gradient with rounded corners and inset shine. Carries the second emphasis beat.

**Dashed divider** — 3px dashed indigo rule separating card body from card footer.

**Page pill** — Lilac pill with the Baloo 2 800 slide numeral. The system's only folio.

**Star bullet** — A small bubblegum ★ preceding the context line.

## Do's and Don'ts

### Do

- Layer every display headline in three colors: indigo base, one bubble-deep word, one aqua highlight span.
- Use the deepened `{colors.bubble-deep}` for all pink text — raw bubblegum is fills-only.
- Round every container: 48px cards, full-round pills, 26px highlight spans.
- Put the inset top-shine on every pill, highlight span, and gloss band.
- Scatter 6–10 sparkles in the margin ring of every slide at mixed sizes and rotations.
- Keep pills in the canonical cluster order: indigo first, then bubblegum, then aqua.
- Keyline the bubble card in 4px indigo with the offset drop + gloss wash.
- Bookend every slide with the paired gloss bands, gloss overlay facing inward.

### Don't

- Don't set any headline in a single flat color — color-word layering is non-optional.
- Don't use raw `#FF7AD9` or `#7AF0FF` for text — both fail contrast on white and on ice.
- Don't square any corner — sharp cards, badges, or buttons break the candy voice.
- Don't place sparkles inside the bubble card — the margin ring is their only home.
- Don't use hairlines, solid dividers, or plain-text folios — dividers are dashed, folios are pills.
- Don't introduce a fourth candy or a neon — the trio is bubblegum + aqua + lilac.
- Don't use Baloo 2 for body or Quicksand for headlines — each face has a single role.
- Don't drop the gloss bands or the card gloss wash — unglazed surfaces read as flat vector art.
- Don't use italic, underline, or all-caps body text — emphasis is color words only.
- Don't shadow with black blurs or outer glows — drops are indigo, offsets, and small.

## Responsive Behavior

Bubble OS is a **fixed-stage system** built around 1920×1080 stage coordinates. There are no viewport-fluid rules and no breakpoints for the deck itself — the single stage transform scales cards, bands, pills, and sparkles uniformly to any screen.

### Scaling Behavior

- The bubble card keeps its 1580px width, 48px radii, and 4px keyline in stage coordinates at every viewport.
- Pill type, headline sizes, and sparkle positions are fixed stage values — they scale only via the stage transform.
- Gloss overlays and inset shines are resolution-independent and survive downscaling intact.

### Component Breakpoints

None. The layout is a single centered card; it never reflowing into columns or stacks. On narrow portrait phones the stage letterboxes — content stays exactly composed.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions use 600ms ease-out on opacity + a 24px rise — soft, buoyant motion.
- The `prefers-reduced-motion` media query disables transitions; static gloss and sparkles stay on always.

### Animation Triggers

Pills stagger in with a 90ms delay cascade and a gentle scale-up (0.9 → 1.0). The bubble card fades up on entry. Sparkles carry a slow 4s twinkle (opacity 0.5 → 1.0) unless reduced motion is set. No layout animation runs on scroll or hover beyond a 2px pill lift.

### Print Behavior

The system has no `@media print` rule. The deck is screen-first; for static export, screenshots of each slide preserve all gloss and gradient effects. Sparkles and bands print as flat vector shapes.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent CJK pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / headlines / pills | Baloo 2 600–800 | Gmarket Sans Bold via CDN, else Noto Sans KR 700 |
| Body / tagline / context | Quicksand 400–600 | Noto Sans KR 400–500 |

### Mixed-Content Strategy

**Strategy A** — CJK family with Latin coverage for body, display face preserved for Latin numerals. Set body elements to `'Noto Sans KR', sans-serif`; keep Baloo 2 for pill numerals and the page pill where runs are Latin-only. Mixed lines like `11개 포스트모템` render the digits in Baloo 2 only when isolated in their own element — never font-switch mid-sentence.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Baloo+2:wght@600;700;800&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Display 1.25–1.35 (up from 1.1–1.15), body 1.75–1.85 (up from 1.4–1.6).
- **Letter-spacing**: set to 0 on every CJK run. The +0.12em pill tracking looks broken on square CJK glyphs.
- **Text transform**: don't apply `uppercase` to CJK text. Render Korean pill labels without transform at weight 700.
- **No period on display headlines**: omit trailing 。 on display-scale headlines per CJK convention.
- **Space between CJK and Latin**: insert an ASCII space between every CJK character and adjacent Latin character or digit.
- **One font per sentence**: let Noto Sans KR handle mixed sentences; don't fall back to Baloo 2 mid-sentence for ASCII.

### Aesthetic Notes for This System

The system's identity rests on plump rounded display type + candy color-word layering + gloss. A CJK build loses Baloo 2's bounce but keeps everything else: the aqua highlight span and bubble-deep emphasis word still work on Noto Sans KR 700, and they carry the candy voice when the face itself is generic. Keep all gloss bands, pills, and sparkles — they do more identity work in a CJK build than in the Latin original.

Pill labels in Korean should stay short (2–4 characters) to preserve the pill silhouette; widen pill padding to 36px horizontal to keep the candy proportion.

### Known CJK Gap

- **No CDN-loadable plump Korean display face.** Baloo 2's inflated bounce has no Korean equivalent on Google Fonts; Noto Sans KR 700 gives weight but loses the toy signal. Gloss, pills, and color-word layering must carry the candy voice on their own.
- **Round-terminal Korean body face unavailable.** Quicksand's round terminals have no CJK counterpart; Noto Sans KR renders with standard terminals.

## Iteration Guide

1. Any new slide gets the paired gloss bands, the sparkle ring (6–10 stars), and one centered bubble card. Don't skip the bands.
2. Any new display element uses Baloo 2 with three-color word layering. Any new body element uses Quicksand. Never cross the role boundaries.
3. Any new headline gets indigo base + one bubble-deep word + one aqua highlight span — in that emphasis order.
4. Any new label is a pill in one of the four canonical fills, uppercase Baloo 2 at +0.12em. Don't substitute a plain h-tag.
5. Any new container is a 48px-radius bubble card with the 4px indigo keyline, gloss wash, and offset drop.
6. Any new divider is the 3px dashed indigo rule. Solid and hairline rules do not exist here.
7. Any new folio is the lilac page pill with a Baloo 2 800 numeral — bottom-right of the card footer.
8. Any new decorative mark is a ★ sparkle in the margin ring. No other glyphs, no rules-as-decoration.
9. If a slide needs emphasis beyond the headline, add a pill — never a second highlight color or a larger size.
10. Animated elements (pill cascade, card rise, sparkle twinkle) should respect `prefers-reduced-motion`. Gloss and gradients are static and stay on always.

## Known Gaps

- **Fonts**: Baloo 2 / Quicksand via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the plump display voice.
- **Word-layering paint is JS-applied** on the cover: the headline ships as contiguous text and a small script wraps the emphasis/highlight words. If JS fails, the headline renders in flat indigo — correct content, reduced candy signal.
- **Overflow guard is JS-applied**: title size steps down until the card fits 850px. Without JS, very long titles can overflow the card.
- **Sparkle positions are hand-placed** per slide via absolute coordinates. There is no auto-scatter; new slides need manual sparkle placement in the margin ring.
- **Pill cluster order is conventional, not enforced.** Nothing in the CSS prevents a wrong-order cluster; authors must follow the indigo → bubblegum → aqua order.
- **The gloss wash heights are fixed** (120px card wash, 46% band overlay) and do not adapt to card content height.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | 70px ambient indigo blur under card | partial | Single 14px solid indigo offset; drop the ambient blur |
| 2 | Blend modes | None used | full | N/A |
| 3 | Animation / keyframes | Pill cascade, card rise, sparkle twinkle | none | Static end-state frame |
| 4 | Pixel / hard offset shadows | 14px solid card offset, 3px pill drops | partial | Single solid offset shadow per element |
| 5 | Gradients | Band gradients, highlight-span gradient, ground gradient | partial | Nearest two-stop linear gradients |
| 6 | Grain / scanline / noise overlays | None used | full | N/A |
| 7 | Transparency layers | Gloss overlays, dashed-divider alpha | partial | Opaque white overlays at 90% + solid divider |
| 8 | Custom fonts | Baloo 2 / Quicksand via Google Fonts CDN | partial | Embedded subset or Arial Rounded / Verdana substitution |
| 9 | Absolute-positioned decor | Sparkles, bands, pills | full | Grouped native shapes |
