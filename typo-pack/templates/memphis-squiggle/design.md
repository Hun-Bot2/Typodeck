---
version: alpha
name: Squiggle Club
description: Memphis postmodernism at full volume on warm cream (#FFF6E9). Archivo Black display blocks with hard 6px ink offset shadows, round Nunito body, tracked Archivo 700 caps labels on tilted chips. Zigzag SVG rules, giant hollow outline numerals from real deck counts, clashing pink/teal/yellow/purple confetti scatter, ±3deg playful tilts. Sticker-book depth: 4–6px ink outlines, zero blur, deliberate color clashes.
colors:
  cream: "#FFF6E9"
  ink: "#111111"
  pink: "#FF6B9D"
  teal: "#4ECDC4"
  yellow: "#FFE66D"
  purple: "#6C5CE7"
  white: "#FFFFFF"
shadows:
  sticker-hard: "6px 6px 0 {colors.ink}"
  sticker-hard-sm: "4px 4px 0 {colors.ink}"
  sticker-pink: "6px 6px 0 {colors.pink}"
  sticker-teal: "6px 6px 0 {colors.teal}"
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
  chip-label:
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
  sticker-unit: 6px
  pad-slide-y: 72px
  pad-slide-x: 88px
  outline-w: 4px
  outline-w-lg: 6px
  gap-title-sub: 28px
  gap-sub-chip: 36px
  tilt-chip: 3deg
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
  confetti-chip:
    border: "4px solid {colors.ink}"
    boxShadow: "{shadows.sticker-hard-sm}"
    description: "Tilted pill or square chip in pink/teal/yellow/purple carrying labels or the context line. Tilt ±3deg."
  context-pill:
    background: "{colors.yellow}"
    border: "4px solid {colors.ink}"
    borderRadius: 999px
    padding: "14px 30px"
    boxShadow: "{shadows.sticker-hard}"
    description: "Yellow pill carrying the dateline/context line, tilted -2deg, hard ink shadow."
  scatter-dot:
    description: "Solid confetti dot (24–48px) in any accent, absolutely positioned, no outline."
  scatter-ring:
    border: "6px solid"
    description: "Hollow confetti ring (48–96px) in any accent with transparent center."
  scatter-bar:
    height: 18px
    description: "Short thick confetti bar (80–160px) in any accent with 4px ink outline, rotated ±20deg."
  scatter-triangle:
    description: "CSS-triangle confetti wedge (60–100px) in any accent with ink outline via drop-shadow-free borders."
  quote-bubble:
    background: "{colors.white}"
    border: "4px solid {colors.ink}"
    borderRadius: 28px
    boxShadow: "{shadows.sticker-hard}"
    description: "Round white speech bubble with a square tail for the one quotable line on inner slides."
  stat-card:
    background: "{colors.white}"
    border: "5px solid {colors.ink}"
    boxShadow: "{shadows.sticker-hard}"
    padding: "28px 32px"
    description: "Thick-outlined white card with an Archivo Black stat numeral and Nunito label on inner slides."
  footer-ticker:
    background: "{colors.ink}"
    color: "{colors.cream}"
    fontSize: 20px
    description: "Full-bleed ink strip at the foot carrying the counter and section mark in tracked Archivo caps."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`, treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Squiggle Club is **Memphis postmodernism at full volume**. Its foundational premise is the **sticker book**: every shape on the slide — chips, cards, numerals, confetti bars — carries a thick 4–6px ink outline plus a hard offset shadow with zero blur, as if die-cut and slapped onto warm cream. Nothing is hairline, nothing is muted, nothing sits quietly on a grid. Color clashes are deliberate: pink against purple, teal against yellow, all four accents colliding in the confetti field.

The type stack is three faces in strict roles. **Archivo Black** is the shout — titles, section heads, stat numerals, outline numerals. One weight (400), massive sizes, tight leading, always ink (or hollow ink stroke). **Nunito** is the friendly voice — body, decks, captions in round geometric warmth at 400/700. **Archivo 700** is the stamp — tracked caps labels on tilted chips, counters, ticker text. The contrast between the heavy grotesque shout, the round body, and the stamped caps is the entire personality.

The palette is party-on-cream: warm cream ground (#FFF6E9), ink black (#111111), and four clashing accents — pink (#FF6B9D), teal (#4ECDC4), yellow (#FFE66D), purple (#6C5CE7) — plus white for cards and bubbles. Accents never appear as body text; they fill chips, confetti, rules, and shadow layers.

Depth is flat sticker-book. The signature is the **two-layer title slap**: a 6px teal offset with a 12px ink offset behind it, both hard-edged. Cards and chips get a single 4–6px ink offset. No blur exists anywhere — a soft shadow would read as a printing error.

**Density philosophy: a party table, not a junk drawer.** The title slide carries the title block, zigzag rule, subtitle deck, context pill, outline numeral, ticker, and a dozen confetti pieces — but the text column stays a clean left-weighted measure with 28–36px gaps, and confetti keeps clear of the title's bounding box. Inner slides trade confetti density for stat cards and quote bubbles. Joyful but never illegible: type always wins over decoration.

**Key Characteristics:**
- Archivo Black display blocks: massive tight ink headlines with the two-layer teal-then-ink slap shadow.
- Zigzag glyph rules: SVG zigzag dividers in alternating accents with 8px strokes under titles and above footers.
- Bold outline numerals: giant hollow count numerals from real deck numbers anchoring corners.
- Clashing pastel-neon chips: tilted outlined chips in all four accents carrying labels and context.
- Confetti scatter field: dots, rings, bars, triangles in four accents, around but never over type.
- Center-field confetti stays sparse by restraint: at most two small pieces in the open middle, each fully clear of every type box — type sovereignty first.
- ±3deg playful tilts: chips and badges rotate; body text never tilts; display tilts at most 2deg.
- Thick-outline sticker depth: 4–6px ink outlines plus hard offset shadows, zero blur everywhere.
- Left-weighted party column: text anchors left, numeral anchors right, ticker pins the foot.
- Rounded-geometry Memphis: circles, pills, bubbles, squiggles — never torn paper, never tape, never grids.

## Colors

### Palette

- **Cream** (`{colors.cream}` — `#FFF6E9`): The party-table ground. Warm, dimmed white that lets all four accents shout without glare.
- **Ink** (`{colors.ink}` — `#111111`): Display type, outlines, offset shadows, ticker fill. Near-black, warm enough to sit on cream.
- **Pink** (`{colors.pink}` — `#FF6B9D`): Confetti, chips, zigzag segments, bubble tails. The loudest accent — ration to one chip per region.
- **Teal** (`{colors.teal}` — `#4ECDC4`): Title slap first layer, confetti, chips, stat-card fills. The cooling accent against pink and yellow.
- **Yellow** (`{colors.yellow}` — `#FFE66D`): Context pill fill, confetti dots, highlight moments. High-key — never behind white type.
- **Purple** (`{colors.purple}` — `#6C5CE7`): Outline-numeral shadow layer, chips, zigzag segments, ticker accents. The depth accent.
- **White** (`{colors.white}` — `#FFFFFF`): Stat cards, quote bubbles, ticker text base. Cards pop against cream via outlines, not brightness.

### Defaults

- **Default surface background**: `{colors.cream}` flat with the confetti scatter field.
- **Default headline color**: `{colors.ink}` in Archivo Black with the two-layer slap shadow.
- **Default body text color**: `{colors.ink}` in Nunito 400.
- **Default chip fills**: rotate pink → teal → yellow → purple across chips in reading order.
- **Default zigzag colors**: alternate pink/teal/purple segments left to right.
- **Default outline numeral**: transparent fill, 4px ink stroke, with a purple offset echo behind.
- **Default ticker**: `{colors.cream}` text on `{colors.ink}` fill.
- **Default accent for emphasis inside body**: Nunito 700 ink — never a hue. Color lives in shapes, not words.

When a slide needs to feel louder, add confetti density and promote a second chip; when it needs to feel calmer, drop to two accents (teal + yellow) and halve the scatter.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**Archivo Black** is the shout — a heavy single-weight grotesque for titles, section heads, subheads, stat numerals, and outline numerals. Its tight apertures and massive color are what make headlines feel slapped on rather than set.

**Nunito** is the friendly voice — a rounded geometric sans for body, decks, captions, and bubble quotes at 400/700. Nunito's roundness is the counterweight to Archivo Black's punch; together they read playful-but-legible.

**Archivo 700** is the stamp — tracked caps for chip labels, context pills, counters, and ticker text. The caps-plus-tracking treatment on tilted chips is the system's chrome register.

Never use Archivo Black for body, never use Nunito for display, never set Archivo chrome in sentence case. The three-role separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.party-title}` | 96px | Archivo Black | 400 | Title-slide display title |
| `{typography.section-head}` | 60px | Archivo Black | 400 | Inner-slide section headline |
| `{typography.subhead}` | 36px | Archivo Black | 400 | Card titles, region heads |
| `{typography.body}` | 27px | Nunito | 400 | Paragraph body and decks |
| `{typography.body-bold}` | 27px | Nunito | 700 | Emphasis runs inside body |
| `{typography.chip-label}` | 22px | Archivo | 700 | Tilted chip labels, tracked caps |
| `{typography.outline-numeral}` | 300px | Archivo Black | 400 | Hollow corner numeral |
| `{typography.stat-number}` | 96px | Archivo Black | 400 | Stat card numerals |
| `{typography.caption}` | 21px | Nunito | 400 | Captions and credit lines |
| `{typography.counter}` | 20px | Archivo | 700 | Ticker counter `01 / 01` |

### Defaults

- **Default size for a title-slide title**: `{typography.party-title}` (96px) — always Archivo Black, left-aligned, slap shadow.
- **Default size for an inner headline**: `{typography.section-head}` (60px) — Archivo Black, left-aligned.
- **Default size for paragraph body**: `{typography.body}` (27px) — Nunito 400, line-height 1.6.
- **Default size for chip labels**: `{typography.chip-label}` (22px) — Archivo 700 caps at 0.16em.
- **Default size for the corner numeral**: `{typography.outline-numeral}` (300px) — hollow ink stroke.
- **Default tracking for Archivo chrome**: 0.12–0.16em. Archivo caps without tracking read as UI, not stamps.
- **Default body weight**: 400 for Nunito, 700 for emphasis runs; **display is always Archivo Black 400** (its only weight).

When unsure which display token to reach for, default to `{typography.section-head}` — it is the inner-page workhorse. Reserve `{typography.party-title}` for the title slide and section dividers.

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title carries the two-layer slap shadow.** `6px 6px 0 teal, 12px 12px 0 ink`, hard-edged. A title without the slap reads as a poster, not a sticker.
- **Every title sits above a zigzag rule.** Alternating-accent SVG zigzag, 8px stroke, full text-measure width. Straight rules do not exist in this system.
- **Every front anchors a hollow outline numeral.** 300px Archivo Black, transparent fill, 4px ink stroke, drawn from a real deck number, parked in a corner clear of type.
- **Every label lives on a tilted outlined chip.** 4px ink outline, hard offset shadow, ±3deg rotation, tracked Archivo caps. Naked floating labels do not exist.
- **Every context line rides the yellow pill.** Yellow fill, 4px outline, 999px radius, −2deg tilt, hard ink shadow.
- **Every confetti piece keeps clear of type bounding boxes.** Scatter sits behind and around content; a dot overlapping a letter is a defect, not decoration.
- **Every ticker pins the foot.** Full-bleed ink strip with cream tracked caps: section mark left, counter right.

### Typography Principles

The voice contrast is **heavy shout ↔ round body ↔ stamped caps**. Archivo Black punches, Nunito explains with a smile, Archivo stamps the metadata. Switching any role flattens the party into a generic playful layout.

Display and body align left; chips and pills align with the text column's left edge (their tilts provide the asymmetry — the layout underneath stays disciplined). Italic is never used — Nunito 700 is the only emphasis, and it stays ink, never colored.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Slides render one at a time at full stage size and scale uniformly to the viewport through the shared scaler — no reflow, no breakpoints on the stage itself.

Default slide padding is `72px 88px`. The text column caps at `max-width: 1500px`, left-weighted; the outline numeral anchors the right side clear of the column; the ticker pins the foot full-bleed. Confetti scatters across the full stage behind content.

### Scatter Grid

Confetti follows a **loose 240px scatter register**: pieces anchor near register crossings with ±80px jitter and ±20deg rotation, which keeps the field even without looking gridded. A title front carries 10–14 pieces; inner slides carry 6–8. No piece may touch the title bounding box or the ticker strip.

### Persistent Chrome

Three elements appear on every slide:
- **Outline numeral** — hollow 300px count numeral anchored right, clear of the text column.
- **Context pill or chip row** — yellow pill on fronts, accent chip row on inner slides.
- **Ticker** — full-bleed ink foot strip with section mark and counter in tracked cream caps.

There is no dot rail, no floating nav, no progress bar. The cursor is `default` — the party is watched, not operated.

### Atmospheric Layer Stack

Every slide carries (in z-order):
1. Cream ground `{colors.cream}`, flat.
2. Back confetti layer (6–8 pieces behind content).
3. Text column: title, zigzag, deck, pill.
4. Outline numeral (may overlap back confetti, never type).
5. Front confetti layer (2–4 small pieces near edges, never over type).
6. Ticker strip pinned to the foot, above all layers.

This stack keeps type sovereign. A slide with confetti over letterforms is a defective render.

## Depth and Elevation

### Sticker Slap (Signature)

The system uses **hard offset shadows with zero blur** at two registers: 4px for chips and small shapes, 6px for titles, cards, and pills. Every shadow is solid ink except the title slap's first layer (teal) and designated accent shadows (pink, teal). Offsets always step down-right. A blurred shadow anywhere breaks the die-cut fiction.

### Two-Layer Title Slap

Titles carry `{shadows.title-slap}`: `6px 6px 0 teal, 12px 12px 0 ink`. The teal layer reads as the sticker's color backing, the ink layer as its drop shade. Both are hard-edged and axis-aligned — no rotation on shadows even when the title block tilts.

### Outlines as Elevation

Every shape carries a 4–6px ink outline that separates it from the cream before any shadow applies. The outline is the primary elevation signal; the shadow is secondary. White cards on cream survive purely through their 5px outlines — without them, card and ground would merge.

### Tilt as Energy

Chips tilt ±3deg, the context pill tilts −2deg, display blocks tilt at most 2deg. Tilt applies to shapes, never to body text, and tilted elements keep axis-aligned shadows (the shadow does not rotate with the shape), which sells the stuck-on feel.

## Shapes and Treatment

### Border Radius

Generous and round: pills at 999px, bubbles at 28px, dots fully round, rings hollow-round. Squares and cards stay sharp-cornered (Memphis mixes round and sharp deliberately), but nothing is hairline or tentative. The round/sharp mix is the geometry signature — all-round would read babyish, all-sharp would read Swiss.

### Border Weights

- **4px solid ink** — used on chips, pills, confetti bars, outline numerals (as stroke), zigzag-adjacent frames.
- **5px solid ink** — used on stat cards and quote bubbles.
- **6px solid accent** — used on confetti rings (accent-colored, hollow).
- **8px stroke** — used on zigzag SVG rules (accent-colored segments).

Outlines are always solid, never dashed or dotted. Dashed lines read as coupons or transit maps, not Memphis.

### Decorative Element Types

**Party title block** — Left-aligned 108px Archivo Black with the teal-then-ink slap shadow, tilted at most 2deg.

**Zigzag rule** — Full-measure SVG zigzag, 8px stroke, alternating pink/teal/purple segments. Under titles, above footers.

**Outline numeral** — 300px hollow Archivo Black count numeral with 4px ink stroke and purple offset echo, corner-anchored.

**Confetti chip** — Tilted pill or square in any accent with 4px ink outline and 4px hard shadow, carrying tracked caps labels.

**Context pill** — Yellow 999px pill with 4px outline and 6px shadow carrying the dateline, tilted −2deg.

**Scatter dot** — Solid 24–48px confetti dot in any accent, no outline.

**Scatter ring** — Hollow 48–96px confetti ring, 6px accent stroke, transparent center.

**Scatter bar** — 80–160px confetti bar, 18px tall, 4px ink outline, rotated ±20deg.

**Scatter triangle** — 60–100px confetti wedge in any accent.

**Quote bubble** — Round white speech bubble with 5px outline, 6px shadow, and a square tail for inner-slide quotes.

**Stat card** — Thick-outlined white card with a 96px Archivo Black numeral and Nunito label for inner slides.

**Footer ticker** — Full-bleed ink foot strip with cream tracked caps: section mark left, counter right.

## Do's and Don'ts

### Do

- Slap every title with the two-layer teal-then-ink hard shadow. The slap is the display signature.
- Run a zigzag rule under every title and above every ticker-adjacent footer. No straight rules.
- Anchor a hollow outline numeral from a real deck number in a corner clear of type.
- Set every label on a tilted outlined chip in tracked Archivo caps.
- Ride the context line on the yellow −2deg pill with its hard ink shadow.
- Scatter 10–14 confetti pieces on fronts, keeping every piece clear of type bounding boxes.
- Outline every shape 4–6px in ink (or 6–8px in accent for rings and zigzags) with zero-blur shadows.
- Clash accents deliberately — pink/purple, teal/yellow collisions are the palette working as designed.
- Keep the text column left-weighted with 28–36px gaps between title, zigzag, deck, and pill.
- Pin the ink ticker to the foot with section mark and counter on every slide.

### Don't

- Don't blur any shadow or add gradients, glass, or glow. Stickers are die-cut, not rendered.
- Don't set body text in an accent color or italicize anything. Emphasis is Nunito 700 ink.
- Don't overlap confetti with letterforms. Type is sovereign; decoration yields.
- Don't use torn paper, tape strips, or photocopy grit. Memphis geometry is clean-cut — collage texture belongs to a different design.
- Don't center the title or justify the deck. Display aligns left; chips align to the column edge.
- Don't tilt body text or tilt display blocks more than 2deg. Energy comes from chips, not paragraphs.
- Don't introduce a fifth accent or a muted earth tone. Four accents plus cream, ink, and white — the clash is curated.
- Don't letterspace Nunito or Archivo Black. Tracking belongs to Archivo caps chrome alone.
- Don't omit the numeral, the pill, or the ticker on any slide. The trio is the persistent chrome.
- Don't invent counts for numerals or chips. Every number on the slide comes from the real deck.

## Responsive Behavior

Squiggle Club is a **fixed-stage system**: every slide renders at 1920×1080 and scales uniformly to the viewport with one transform. There is no responsive reflow — phones letterbox the stage rather than restacking the party.

### Scaling Behavior

- Title holds 108px on the stage; the scaler shrinks the whole party on small viewports.
- Confetti, numeral, chips, and ticker are stage-absolute; they scale only via the uniform stage transform.
- Tilts are rotation transforms, so they stay identical under uniform scaling.
- The 240px scatter register is stage geometry and survives scaling unchanged.

### Component Breakpoints

No component breakpoints exist. The stage never reflows: the numeral stays right-anchored and the column stays left-weighted at every viewport size.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- No hover states, no auto-advance, no scroll hijack. Confetti is static print, not physics.

### Animation Triggers

No animation exists in this system — no floats, no spins, no reveals. The confetti has already landed. `prefers-reduced-motion` has nothing to disable.

### Print Behavior

The system prints cleanly: cream ground, ink outlines, flat accent fills. Hard offset shadows print as solid shapes. For ink-saving output, print with backgrounds off — outlines and type hold the design alone.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin stack for a Korean pairing that preserves shout/round/stamp contrast and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / title / numerals | Archivo Black 400 | Black Han Sans 400 |
| Body / decks / captions | Nunito 400/700 | Jua 400 (display-round) for decks, Noto Sans KR 400/700 for long body |
| Chrome / chips / ticker | Archivo 700 caps + tracking | Noto Sans KR 700 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy C** — role-matched three-family swap. Set display elements to `font-family: 'Black Han Sans', 'Archivo Black', sans-serif`, friendly decks to `'Jua', 'Nunito', sans-serif`, long body to `'Noto Sans KR', 'Nunito', sans-serif`, and chrome to `'Noto Sans KR', 'Archivo', sans-serif`. Black Han Sans is the true Korean counterpart to Archivo Black (single heavyweight display grotesque), and Jua's rounded Bold pocket matches Nunito's friendliness at deck scale. Hierarchy survives through the same weight and scale steps plus the unchanged sticker shadows.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Jua&family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Decks 1.75–1.85 (up from 1.6), display 1.15–1.25 (up from 1.04). Square syllable blocks crowd vertically more than Latin.
- **Letter-spacing**: set to 0 on every CJK run, including chip and ticker chrome — the 0.12–0.16em Latin tracking looks broken on pre-spaced syllables.
- **Text transform**: don't apply `uppercase` to Korean text — Hangul has no case. Chip labels render without transform in CJK builds.
- **Punctuation**: use Korean punctuation conventions; keep the zigzag rules and confetti unchanged.
- **No period on display headlines**: Korean display convention omits trailing 。 on large headlines.
- **Space between CJK and Latin**: insert an ASCII space between Hangul and adjacent Latin/digits.
- **Chip sizing**: widen chip horizontal padding to 36px for Korean labels — Hangul blocks run wider than tracked caps at the same size.

### Aesthetic Notes for This System

The system's identity rests on shout/round/stamp contrast, and a Korean build preserves it unusually well: Black Han Sans genuinely shouts like Archivo Black, and Jua genuinely smiles like Nunito. Lean on the **sticker shadows and outlines** regardless — the teal-then-ink slap works on Black Han Sans syllables and carries the party voice even where the faces differ.

The outline numeral translates perfectly — hollow Black Han Sans numerals (or Latin digits, which Black Han Sans covers) with the 4px ink stroke read identically. Keep the corner numeral on every CJK front.

### Known CJK Gap

- **Jua has a single weight and narrow glyph coverage for mixed alphanumeric runs.** Long Korean body with embedded Latin/digits should use Noto Sans KR instead; reserve Jua for short friendly decks.
- **No tracked-caps stamp voice in Korean.** Chip labels lose their stamped-caps character when tracking and case go away; the tilt, outline, and hard shadow carry the chip recognition alone.

## Iteration Guide

1. Any new slide opens on cream with the confetti scatter field at the 240px register. Don't skip the scatter.
2. Any new display element uses Archivo Black with the two-layer slap shadow. Any new body uses Nunito. Any new label uses Archivo 700 tracked caps on a chip.
3. Any new title sits left-aligned at 96px (fronts) or 60px (inner) above a full-measure zigzag rule.
4. Any new context or metadata line rides a tilted outlined chip — yellow pill for the dateline, rotating accents for the rest.
5. Any new corner gets a hollow outline numeral from a real deck number, clear of all type bounding boxes.
6. Any new measurement follows the sticker register: 4px small outlines, 5–6px large outlines, 4–6px hard shadows, 999px pills.
7. Any new emphasis inside body is Nunito 700 ink — never a hue, never italic.
8. Any new data uses stat cards (5px outline, 96px Black numeral) or quote bubbles with square tails.
9. Any new slide pins the ink ticker to the foot with section mark and counter.
10. No motion is ever added. The confetti has landed; animation of any kind breaks the sticker fiction.

## Known Gaps

- **Fonts**: Archivo Black / Nunito / Archivo via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the shout voice. Korean builds add Black Han Sans + Jua + Noto Sans KR with fallback `, "Apple SD Gothic Neo", sans-serif`.
- **The outline numeral uses `-webkit-text-stroke`** with transparent fill. Non-WebKit engines without stroke support render a solid transparent (invisible) numeral; the accepted fallback is solid ink at 12% opacity.
- **Zigzag rules are inline SVG polylines** with hand-placed points per measure. Changing the text width requires re-pointing the polyline; there is no auto-fit zigzag component.
- **Confetti positions are hand-placed** per slide on the 240px register. There is no scatter generator; adding a piece means adding a positioned div.
- **Tilted chips can collide with the text column** at long measures. Chip rows must be checked against the 1500px column cap on every slide.
- **Archivo Black ships a single weight (400).** Bold synthesis must be disabled (`font-synthesis: none`) or browsers will smear the display face.
- PPTX fidelity disclosure for this design:

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — system is fully flat | full | N/A (nothing to export) |
| 2 | Blend modes | Not used | full | N/A (nothing to export) |
| 3 | Animation / keyframes | Not used — no motion | full | N/A (nothing to export) |
| 4 | Pixel / hard offset shadows | Two-layer title slap + 4–6px sticker offsets | partial | Single solid offset shadow per shape |
| 5 | Gradients | Not used — flat accent fills | full | N/A (nothing to export) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to export) |
| 7 | Transparency layers | Transparent numeral fill over cream | full | Hollow WordArt-style outline text |
| 8 | Custom fonts | Archivo Black / Nunito / Archivo via CDN | partial | Embedded fonts or Arial Black + system sans |
| 9 | Absolute-positioned decor | Confetti field, numeral, zigzag, ticker | partial | Grouped native shapes; zigzag as polyline |
