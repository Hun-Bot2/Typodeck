---
version: alpha
name: Squiggle Club
description: Memphis postmodernism at full volume on warm cream (#FFF6E9). Archivo Black display blocks with the two-layer teal-then-ink slap shadow, round Nunito body, tracked Archivo 700 caps labels as tilted type with accent glyph markers. Zigzag SVG rules, giant hollow outline numerals from real deck counts, ±3deg playful tilts. Type-only depth: slap shadows on letterforms, zero blur, deliberate color clashes. Typography-only: no chips, pills, confetti, cards, bubbles, or bands.
colors:
  cream: "#FFF6E9"
  ink: "#111111"
  pink: "#FF6B9D"
  teal: "#4ECDC4"
  yellow: "#FFE66D"
  purple: "#6C5CE7"
  white: "#FFFFFF"
shadows:
  title-slap: "6px 6px 0 {colors.teal}, 12px 12px 0 {colors.ink}"
  none-blur: "none"
typography:
  party-title:
    fontFamily: "'Archivo Black', sans-serif"
    fontSize: "96px"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: -0.01em
  section-head:
    fontFamily: "'Archivo Black', sans-serif"
    fontSize: "60px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: 0
  subhead:
    fontFamily: "'Archivo Black', sans-serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: 0
  body:
    fontFamily: "'Nunito', sans-serif"
    fontSize: "27px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-bold:
    fontFamily: "'Nunito', sans-serif"
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: 0
  stamp-label:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.16em
    textTransform: uppercase
  outline-numeral:
    fontFamily: "'Archivo Black', sans-serif"
    fontSize: "300px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0
  stat-number:
    fontFamily: "'Archivo Black', sans-serif"
    fontSize: "96px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0
  caption:
    fontFamily: "'Nunito', sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  counter:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.12em
spacing:
  pad-slide-y: 72px
  pad-slide-x: 88px
  zigzag-stroke: 8px
  gap-title-sub: 28px
  gap-sub-label: 36px
  tilt-label: 3deg
  tilt-display: 2deg
  content-max-width: 1500px
canvas:
  width: 1920px
  height: 1080px
components:
  party-title-block:
    fontSize: 96px
    textShadow: "{shadows.title-slap}"
    description: "Left-aligned Archivo Black title with the two-layer teal-then-ink slap shadow. One contiguous block, tilted at most 2deg."
  zigzag-rule:
    height: 22px
    description: "Hand-drawn-feeling SVG zigzag divider, 8px stroke, alternating pink/teal/purple segments. Sits under titles and above footers."
  outline-numeral:
    fontSize: 300px
    textStroke: "4px {colors.ink}"
    description: "Giant hollow count numeral (ink stroke, transparent fill) anchored to a corner, drawn from a real deck number."
  stamp-label:
    tilt: "±3deg"
    marker: "● glyph in pink/teal/purple"
    description: "Tracked Archivo caps label as tilted ink type led by an accent ● glyph. Tilt ±3deg. Markers are decorative; all words set in ink."
  context-line:
    tilt: "-2deg"
    marker: "● glyph in pink"
    description: "Dateline/context line as tilted tracked caps led by a pink ● glyph. No pill, no fill."
  glyph-bullet:
    glyphs: "■ pink / ● teal"
    description: "List markers as text: pink ■ for the first voice, teal ● for the second. Words always ink."
  quote-line:
    fontFamily: "'Nunito', sans-serif"
    fontWeight: 700
    description: "The one quotable line on inner slides, set as bold centered Nunito. No bubble."
  stat-block:
    fontFamily: "'Archivo Black', sans-serif"
    description: "Archivo Black stat numeral with a Nunito label on inner slides. No card."
  footer-line:
    color: "{colors.ink}"
    fontSize: 20px
    description: "Ink type line at the foot carrying the counter and section mark in tracked Archivo caps, under a zigzag rule."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`, treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and numeral legibility.


## Overview

Squiggle Club is **Memphis postmodernism at full volume**. Its foundational premise is the **slapped-on page**: display letterforms carry a hard two-layer offset shadow with zero blur, as if die-cut and slapped onto warm cream, while zigzag strokes and outline numerals clash around them. Nothing is hairline, nothing is muted, nothing sits quietly on a grid. Color clashes are deliberate: pink against purple, teal against yellow, accents colliding in the zigzags and markers.

The type stack is three faces in strict roles. **Archivo Black** is the shout — titles, section heads, stat numerals, outline numerals. One weight (400), massive sizes, tight leading, always ink (or hollow ink stroke). **Nunito** is the friendly voice — body, decks, captions in round geometric warmth at 400/700. **Archivo 700** is the stamp — tracked caps labels as tilted type, counters, footer text. The contrast between the heavy grotesque shout, the round body, and the stamped caps is the entire personality.

The palette is party-on-cream: warm cream ground (#FFF6E9), ink black (#111111), and four clashing accents — pink (#FF6B9D), teal (#4ECDC4), yellow (#FFE66D), purple (#6C5CE7). Accents never appear as body text — on cream they all fail contrast — they live only in zigzag strokes, slap-shadow layers, and decorative glyph markers beside ink words.

Depth is flat and typographic. The signature is the **two-layer title slap**: a 6px teal offset with a 12px ink offset behind it, both hard-edged, applied to letterforms only. No blur exists anywhere — a soft shadow would read as a printing error.

**Density philosophy: a party table, not a junk drawer.** The title slide carries the title block, zigzag rule, subtitle deck, context line, outline numeral, stamp labels, and footer line — but the text column stays a clean left-weighted measure with 28–36px gaps. Inner slides trade stamp density for stat blocks and quote lines. Joyful but never illegible: type always wins over decoration.

**Key Characteristics:**
- Archivo Black display blocks: massive tight ink headlines with the two-layer teal-then-ink slap shadow.
- Zigzag rules: SVG zigzag dividers in alternating accents with 8px strokes under titles and above footers.
- Bold outline numerals: giant hollow count numerals from real deck numbers anchoring corners.
- Tilted stamp labels: tracked Archivo caps as rotated ink type with accent ● glyph markers.
- Accent glyph markers: pink ■ and teal ● bullets keying comparison lists; words always ink.
- ±3deg playful tilts: labels rotate; body text never tilts; display tilts at most 2deg.
- Type-only Memphis depth: slap shadows on letterforms, zigzag strokes, zero blur everywhere.
- Left-weighted party column: text anchors left, numeral anchors right, footer line pins the foot.
- Geometric Memphis in type: outline numerals, zigzags, glyph markers — never torn paper, never tape, never grids, never boxes.

## Colors

### Palette

- **Cream** (`{colors.cream}` — `#FFF6E9`): The party-table ground. Warm, dimmed white that lets the ink type and zigzag accents shout without glare.
- **Ink** (`{colors.ink}` — `#111111`): All display type, body type, labels, slap-shadow layer. Near-black, warm enough to sit on cream.
- **Pink** (`{colors.pink}` — `#FF6B9D`): Zigzag segments, ●/■ glyph markers. The loudest accent — decorative only, never words (2.50:1 on cream fails even the large-text floor).
- **Teal** (`{colors.teal}` — `#4ECDC4`): Title slap first layer, zigzag segments, ● glyph markers. The cooling accent; decorative only, never words.
- **Yellow** (`{colors.yellow}` — `#FFE66D`): Reserved token, unused in type-only covers — it cannot hold as stroke or marker on cream.
- **Purple** (`{colors.purple}` — `#6C5CE7`): Zigzag segments, outline-numeral offset echo, stamp-label markers. The depth accent; decorative only, never words (4.54:1 clears the large-text 3:1 floor but fails AA body text, so purple words are banned outright).
- **White** (`{colors.white}` — `#FFFFFF`): Reserved token, unused in the typography-only system.

### Defaults

- **Default surface background**: `{colors.cream}` flat.
- **Default headline color**: `{colors.ink}` in Archivo Black with the two-layer slap shadow.
- **Default body text color**: `{colors.ink}` in Nunito 400.
- **Default label color**: `{colors.ink}` with an accent ● marker — markers rotate pink → teal → purple across labels in reading order.
- **Pastel & tint policy**: accents are saturated strokes and markers, never text — color lives in lines, not words. If a light tint is ever introduced, it must carry a deliberate contrast role as a ground for dark text; never pastel-on-pale text. See `evals/typo-only/color.md` for the shared rule and measurements.
- **Default zigzag colors**: alternate pink/teal/purple segments left to right.
- **Default outline numeral**: transparent fill, 4px ink stroke, with a purple offset echo behind.
- **Default footer**: `{colors.ink}` tracked caps under a zigzag rule.
- **Default accent for emphasis inside body**: Nunito 700 ink — never a hue. Color lives in lines, not words.

When a slide needs to feel louder, widen the zigzag register and promote a second stamp label; when it needs to feel calmer, drop to two zigzag accents (pink + purple) and halve the markers. Note: the D18 run-1 contrast fix (white labels on purple chips, 4.86:1) retired with the chips themselves — no purple, pink, teal, or yellow words exist in the type-only system, so no accent-text regression is possible; verify any reintroduction against `evals/typo-only/color.md` before shipping.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**Archivo Black** is the shout — a heavy single-weight grotesque for titles, section heads, subheads, stat numerals, and outline numerals. Its tight apertures and massive color are what make headlines feel slapped on rather than set.

**Nunito** is the friendly voice — a rounded geometric sans for body, decks, captions, and quote lines at 400/700. Nunito's roundness is the counterweight to Archivo Black's punch; together they read playful-but-legible.

**Archivo 700** is the stamp — tracked caps for stamp labels, context lines, counters, and footer text. The caps-plus-tracking treatment on tilted type is the system's chrome register.

Never use Archivo Black for body, never use Nunito for display, never set Archivo chrome in sentence case. The three-role separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.party-title}` | 96px | Archivo Black | 400 | Title-slide display title |
| `{typography.section-head}` | 60px | Archivo Black | 400 | Inner-slide section headline |
| `{typography.subhead}` | 36px | Archivo Black | 400 | Card titles, region heads |
| `{typography.body}` | 27px | Nunito | 400 | Paragraph body and decks |
| `{typography.body-bold}` | 27px | Nunito | 700 | Emphasis runs inside body |
| `{typography.stamp-label}` | 22px | Archivo | 700 | Tilted stamp labels, tracked caps |
| `{typography.outline-numeral}` | 300px | Archivo Black | 400 | Hollow corner numeral |
| `{typography.stat-number}` | 96px | Archivo Black | 400 | Stat block numerals |
| `{typography.caption}` | 21px | Nunito | 400 | Captions and credit lines |
| `{typography.counter}` | 20px | Archivo | 700 | Footer counter `01 / 01` |

### Defaults

- **Default size for a title-slide title**: `{typography.party-title}` (96px) — always Archivo Black, left-aligned, slap shadow.
- **Default size for an inner headline**: `{typography.section-head}` (60px) — Archivo Black, left-aligned.
- **Default size for paragraph body**: `{typography.body}` (27px) — Nunito 400, line-height 1.6.
- **Default size for stamp labels**: `{typography.stamp-label}` (22px) — Archivo 700 caps at 0.16em.
- **Default size for the corner numeral**: `{typography.outline-numeral}` (300px) — hollow ink stroke.
- **Default tracking for Archivo chrome**: 0.12–0.16em. Archivo caps without tracking read as UI, not stamps.
- **Default body weight**: 400 for Nunito, 700 for emphasis runs; **display is always Archivo Black 400** (its only weight).

When unsure which display token to reach for, default to `{typography.section-head}` — it is the inner-page workhorse. Reserve `{typography.party-title}` for the title slide and section dividers.

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title carries the two-layer slap shadow.** `6px 6px 0 teal, 12px 12px 0 ink`, hard-edged, on the letterforms. A title without the slap reads as a poster, not a sticker.
- **Every title sits above a zigzag rule.** Alternating-accent SVG zigzag, 8px stroke, full text-measure width. Straight rules do not exist in this system.
- **Every front anchors a hollow outline numeral.** 300px Archivo Black, transparent fill, 4px ink stroke, drawn from a real deck number, parked in a corner clear of type.
- **Every label is tilted stamped type.** ±3deg rotation, tracked Archivo caps in ink, led by an accent ● glyph. Labels on fills do not exist.
- **Every context line is tilted stamped type.** −2deg tilt, tracked caps in ink, led by a pink ● glyph.
- **Every list is keyed by glyph bullets.** Pink ■ for the first voice, teal ● for the second; words always ink.
- **Every footer line pins the foot.** Ink tracked caps under a zigzag rule: section mark left, counter right.

### Typography Principles

The voice contrast is **heavy shout ↔ round body ↔ stamped caps**. Archivo Black punches, Nunito explains with a smile, Archivo stamps the metadata. Switching any role flattens the party into a generic playful layout.

Display and body align left; stamp labels align with the text column's left edge (their tilts provide the asymmetry — the layout underneath stays disciplined). Italic is never used — Nunito 700 is the only emphasis, and it stays ink, never colored.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Slides render one at a time at full stage size and scale uniformly to the viewport through the shared scaler — no reflow, no breakpoints on the stage itself.

Default slide padding is `72px 88px`. The text column caps at `max-width: 1500px`, left-weighted; the outline numeral anchors the right side clear of the column; the footer line pins the foot under its zigzag rule.

### Persistent Chrome

Three elements appear on every slide:
- **Outline numeral** — hollow 300px count numeral anchored right, clear of the text column.
- **Context line or stamp-label row** — tilted stamped type with accent markers.
- **Footer line** — ink type line with section mark and counter in tracked caps, under a zigzag rule.

There is no dot rail, no floating nav, no progress bar. The cursor is `default` — the party is watched, not operated.

### Atmospheric Layer Stack

Every slide carries (in z-order):
1. Cream ground `{colors.cream}`, flat.
2. Back zigzag rule under the title.
3. Text column: title, deck, context line, labels.
4. Outline numeral (never over type).
5. Footer zigzag + footer line pinned to the foot, above all layers.

This stack keeps type sovereign. A slide with decoration over letterforms is a defective render.

## Depth and Elevation

### Slap Shadow (Signature)

The system uses **hard offset text-shadows with zero blur** on display letterforms only: the two-layer title slap. Offsets always step down-right. A blurred shadow anywhere breaks the die-cut fiction, and shadows on boxes are banned along with the boxes.

### Two-Layer Title Slap

Titles carry `{shadows.title-slap}`: `6px 6px 0 teal, 12px 12px 0 ink`. The teal layer reads as the sticker's color backing, the ink layer as its drop shade. Both are hard-edged and axis-aligned — no rotation on shadows even when the title block tilts.

### Zigzags as Energy

The 8px zigzag strokes carry the accent clash — pink, teal, purple segments colliding under titles and above footers. They are the only drawn strokes in the system: no outlines, no frames, no confetti shapes.

### Tilt as Energy

Stamp labels tilt ±3deg, the context line tilts −2deg, display blocks tilt at most 2deg. Tilt applies to stamped type, never to body text, and tilted elements keep axis-aligned shadows (the shadow does not rotate with the type), which sells the stuck-on feel.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no pills, bubbles, chips, cards, or confetti shapes. Roundness survives only inside glyphs (●/■ markers, outline numerals, letterforms) — the round/sharp mix is the geometry signature: all-round would read babyish, all-sharp would read Swiss.

### Border Weights

- **8px stroke** — zigzag SVG rules (accent-colored segments). The only drawn stroke in the system.
- **4px ink stroke** — outline-numeral `-webkit-text-stroke` plus the purple offset echo.
- **●/■ text glyphs** — accent markers in pink/teal/purple, never drawn shapes.

Strokes are always solid, never dashed or dotted, never box edges. Dashed lines read as coupons or transit maps, not Memphis.

### Decorative Element Types

**Party title block** — Left-aligned 108px Archivo Black with the teal-then-ink slap shadow, tilted at most 2deg.

**Zigzag rule** — Full-measure SVG zigzag, 8px stroke, alternating pink/teal/purple segments. Under titles, above footers.

**Outline numeral** — 300px hollow Archivo Black count numeral with 4px ink stroke and purple offset echo, corner-anchored.

**Stamp label** — Tilted tracked-caps ink label with an accent ● glyph marker, ±3deg.

**Context line** — Tilted tracked-caps ink dateline with a pink ● glyph marker, −2deg.

**Glyph bullets** — Pink ■ and teal ● text markers keying comparison lists.

**Quote line** — Bold centered Nunito quotable line for inner slides. No bubble.

**Stat block** — 96px Archivo Black numeral with a Nunito label for inner slides. No card.

**Footer line** — Ink tracked caps at the foot under a zigzag rule: section mark left, counter right.

## Do's and Don'ts

### Do

- Slap every title with the two-layer teal-then-ink hard shadow. The slap is the display signature.
- Run a zigzag rule under every title and above every footer line. No straight rules.
- Anchor a hollow outline numeral from a real deck number in a corner clear of type.
- Set every label as tilted stamped ink type with an accent ● marker in tracked Archivo caps.
- Set the context line as tilted stamped ink type with a pink ● marker.
- Key comparison lists with pink ■ and teal ● glyph bullets; words always ink.
- Clash accents deliberately in zigzags and markers — pink/purple, teal/pink collisions are the palette working as designed.
- Keep the text column left-weighted with 28–36px gaps between title, zigzag, deck, and labels.
- Pin the ink footer line to the foot with section mark and counter on every slide.

### Don't

- Don't blur any shadow or add gradients, glass, or glow. Slap shadows are die-cut, not rendered.
- Don't set body text in an accent color or italicize anything. Emphasis is Nunito 700 ink.
- Don't add chips, pills, confetti, cards, bubbles, or bands. Accents live in zigzags, slap layers, and glyph markers.
- Don't use torn paper, tape strips, or photocopy grit. Memphis geometry is clean-cut — collage texture belongs to a different design.
- Don't center the title or justify the deck. Display aligns left; labels align to the column edge.
- Don't tilt body text or tilt display blocks more than 2deg. Energy comes from stamp labels, not paragraphs.
- Don't introduce a fifth accent or a muted earth tone. Three working accents plus cream and ink — the clash is curated.
- Don't letterspace Nunito or Archivo Black. Tracking belongs to Archivo caps chrome alone.
- Don't omit the numeral, the context line, or the footer line on any slide. The trio is the persistent chrome.
- Don't invent counts for numerals or labels. Every number on the slide comes from the real deck.

## Responsive Behavior

Squiggle Club is a **fixed-stage system**: every slide renders at 1920×1080 and scales uniformly to the viewport with one transform. There is no responsive reflow — phones letterbox the stage rather than restacking the party.

### Scaling Behavior

- Title holds 108px on the stage; the scaler shrinks the whole party on small viewports.
- Zigzags, numeral, labels, and footer line are stage-absolute; they scale only via the uniform stage transform.
- Tilts are rotation transforms, so they stay identical under uniform scaling.

### Component Breakpoints

No component breakpoints exist. The stage never reflows: the numeral stays right-anchored and the column stays left-weighted at every viewport size.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- No hover states, no auto-advance, no scroll hijack. The party is static print, not physics.

### Animation Triggers

No animation exists in this system — no floats, no spins, no reveals. The party is already printed. `prefers-reduced-motion` has nothing to disable.

### Print Behavior

The system prints cleanly: cream ground, ink type, flat accent strokes. Hard slap shadows print as solid shapes. For ink-saving output, print with backgrounds off — zigzags and type hold the design alone.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin stack for a Korean pairing that preserves shout/round/stamp contrast and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / title / numerals | Archivo Black 400 | Black Han Sans 400 |
| Body / decks / captions | Nunito 400/700 | Jua 400 (display-round) for decks, Noto Sans KR 400/700 for long body |
| Chrome / labels / footer | Archivo 700 caps + tracking | Noto Sans KR 700 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy C** — role-matched three-family swap. Set display elements to `font-family: 'Black Han Sans', 'Archivo Black', sans-serif`, friendly decks to `'Jua', 'Nunito', sans-serif`, long body to `'Noto Sans KR', 'Nunito', sans-serif`, and chrome to `'Noto Sans KR', 'Archivo', sans-serif`. Black Han Sans is the true Korean counterpart to Archivo Black (single heavyweight display grotesque), and Jua's rounded Bold pocket matches Nunito's friendliness at deck scale. Hierarchy survives through the same weight and scale steps plus the unchanged slap shadow.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Decks 1.75–1.85 (up from 1.6), display 1.15–1.25 (up from 1.04). Square syllable blocks crowd vertically more than Latin.
- **Letter-spacing**: set to 0 on every CJK run, including label and footer chrome — the 0.12–0.16em Latin tracking looks broken on pre-spaced syllables.
- **Text transform**: don't apply `uppercase` to Korean text — Hangul has no case. Stamp labels render without transform in CJK builds.
- **Punctuation**: use Korean punctuation conventions; keep the zigzag rules and glyph markers unchanged.
- **No period on display headlines**: Korean display convention omits trailing 。 on large headlines.
- **Space between CJK and Latin**: insert an ASCII space between Hangul and adjacent Latin/digits.
- **Label sizing**: hold Korean stamp labels to short clauses — Hangul blocks run wider than tracked caps at the same size.

### Aesthetic Notes for This System

The system's identity rests on shout/round/stamp contrast, and a Korean build preserves it unusually well: Black Han Sans genuinely shouts like Archivo Black, and Jua genuinely smiles like Nunito. Lean on the **slap shadow and zigzags** regardless — the teal-then-ink slap works on Black Han Sans syllables and carries the party voice even where the faces differ.

The outline numeral translates perfectly — hollow Black Han Sans numerals (or Latin digits, which Black Han Sans covers) with the 4px ink stroke read identically. Keep the corner numeral on every CJK front.

### Known CJK Gap

- **Jua has a single weight and narrow glyph coverage for mixed alphanumeric runs.** Long Korean body with embedded Latin/digits should use Noto Sans KR instead; reserve Jua for short friendly decks.
- **No tracked-caps stamp voice in Korean.** Stamp labels lose their stamped-caps character when tracking and case go away; the tilt and glyph markers carry the label recognition alone.

## Iteration Guide

1. Any new slide opens on cream with a zigzag rule under the title zone. Don't skip the zigzag.
2. Any new display element uses Archivo Black with the two-layer slap shadow. Any new body uses Nunito. Any new label uses Archivo 700 tracked caps as tilted stamped type with an accent marker.
3. Any new title sits left-aligned at 96px (fronts) or 60px (inner) above a full-measure zigzag rule.
4. Any new context or metadata line is tilted stamped ink type with an accent ● marker — no fills, no pills.
5. Any new corner gets a hollow outline numeral from a real deck number, clear of all type bounding boxes.
6. Any new measurement follows the type register: 8px zigzag strokes, ±3deg label tilts, 2deg max display tilt.
7. Any new emphasis inside body is Nunito 700 ink — never a hue, never italic.
8. Any new data uses stat blocks (96px Black numeral + Nunito label) or bold centered quote lines — no cards, no bubbles.
9. Any new slide pins the ink footer line to the foot with section mark and counter under a zigzag rule.
10. No motion is ever added. The party is printed; animation of any kind breaks the fiction.

## Known Gaps

- **Fonts**: Archivo Black / Nunito / Archivo via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the shout voice. Korean builds add Black Han Sans + Jua + Noto Sans KR with fallback `, "Apple SD Gothic Neo", sans-serif`.
- **The outline numeral uses `-webkit-text-stroke`** with transparent fill. Non-WebKit engines without stroke support render a solid transparent (invisible) numeral; the accepted fallback is solid ink at 12% opacity.
- **Zigzag rules are inline SVG polylines** with hand-placed points per measure. Changing the text width requires re-pointing the polyline; there is no auto-fit zigzag component.
- **Stamp labels are hand-placed** per slide. There is no label generator; adding a label means adding positioned type.
- **Tilted labels can collide with the text column** at long measures. Label rows must be checked against the 1500px column cap on every slide.
- **Archivo Black ships a single weight (400).** Bold synthesis must be disabled (`font-synthesis: none`) or browsers will smear the display face.
- PPTX fidelity disclosure for this design:

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — system is fully flat | full | N/A (nothing to export) |
| 2 | Blend modes | Not used | full | N/A (nothing to export) |
| 3 | Animation / keyframes | Not used — no motion | full | N/A (nothing to export) |
| 4 | Pixel / hard offset shadows | Two-layer title slap on letterforms only | partial | Single solid offset shadow on display text |
| 5 | Gradients | Not used — flat accent strokes | full | N/A (nothing to export) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to export) |
| 7 | Transparency layers | Transparent numeral fill over cream | full | Hollow WordArt-style outline text |
| 8 | Custom fonts | Archivo Black / Nunito / Archivo via CDN | partial | Embedded fonts or Arial Black + system sans |
| 9 | Absolute-positioned decor | Numeral, labels, zigzag, footer line | partial | Native text boxes + polyline in place |
