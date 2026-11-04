---
version: alpha
name: Monolith
description: A brutalist monumental presentation system on raw black. Anton caps fill the viewport at ~290px with tight leading and hard edge-crops, bone on black, with exactly one signal-orange type strike per slide. Small Inter carries body, tracked Anton caps label the top strip and footer. A footer pairing stacks subtitle and context as raw type with whitespace separation — no rules, bands, boxes, grids, shadows, or decoration.
colors:
  black: "#0E0E0E"
  slab-black: "#000000"
  bone: "#F5F0E6"
  signal-orange: "#FF4D00"
  dim: "#8A8578"
shadows:
  none: "none"
typography:
  mega:
    fontFamily: "'Anton', sans-serif"
    fontSize: "290px"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.01em"
    textTransform: uppercase
  display:
    fontFamily: "'Anton', sans-serif"
    fontSize: "150px"
    fontWeight: 400
    lineHeight: 0.96
    textTransform: uppercase
  headline:
    fontFamily: "'Anton', sans-serif"
    fontSize: "96px"
    fontWeight: 400
    lineHeight: 1
    textTransform: uppercase
  strip-label:
    fontFamily: "'Anton', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.25em"
    textTransform: uppercase
  band-context:
    fontFamily: "'Anton', sans-serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.18em"
    textTransform: uppercase
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.45
  body-compact:
    fontFamily: "'Inter', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.5
  case-count:
    fontFamily: "'Anton', sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.2em"
    textTransform: uppercase
spacing:
  margin-stage: 24px
  pad-band: "32px 48px"
  orange-rule: 8px
  gap-strip-title: 16px
  zone-height: 792px
canvas:
  width: 1920px
  height: 1080px
components:
  top-strip:
    fontFamily: "'Anton', sans-serif"
    fontSize: 24px
    letterSpacing: 0.25em
    textTransform: uppercase
    color: "{colors.bone}"
    description: "Edge-to-edge label row in plain type: research label left, date right. No square, no rules."
  mega-title:
    fontFamily: "'Anton', sans-serif"
    fontSize: 290px
    lineHeight: 0.94
    color: "{colors.bone}"
    description: "Viewport-filling caps wall with one orange strike word. Hard-cropped by the zone edge."
  orange-strike:
    color: "{colors.signal-orange}"
    description: "The single orange TYPE moment per slide: one strike word, one stat numeral, or one affirmed head. Never more than one; never a rule or block."
  footer-band:
    status: retired
    successor: "footer-line"
    description: "RETIRED as a slab + rule in the typography-only vocabulary. The footer sets subtitle and context as raw type pairs with whitespace separation."
  footer-line:
    padding: "32px 48px"
    description: "Footer type pairing on the ground: Inter subtitle with tracked Anton context, whitespace-separated."
  band-subtitle:
    fontFamily: "'Inter', sans-serif"
    fontSize: 32px
    color: "{colors.bone}"
    description: "Subtitle set in small Inter on the ground — the quiet counterweight to the caps wall."
  band-context:
    fontFamily: "'Anton', sans-serif"
    fontSize: 26px
    letterSpacing: 0.18em
    textTransform: uppercase
    color: "{colors.bone}"
    description: "Tracked Anton context line in the footer, right-aligned."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Monolith is a **brutalist monumental presentation system**. Its foundational premise is **mass**: the title is not placed on the slide, it is the slide. Anton caps at ~290px with 0.94 leading fill the viewport wall-to-wall, hard-cropped by the stage edge, bone on raw black. There is no grid to expose, no card to lift, no rule to follow — only a top strip, a wall of caps, and a footer pairing.

The type stack is two faces at violent contrast. **Anton** is the voice of the wall — display at 96–290px, tracked caps labels at 22–26px. Anton's condensed, heavy, all-caps character is the entire personality; it never sets body, never goes sentence case, never drops below presence. **Inter** is the whisper — 24–32px body in the footer and on content slides, the only element allowed to be quiet. The contrast is the design: a shout with a footnote.

The palette is three flats: **raw black** ground, **bone** type, **signal orange** for the single type strike. Orange appears exactly once per slide — one word in the title wall, one stat numeral, or one affirmed head. A second orange moment anywhere collapses the discipline. Dim taupe grays only the smallest meta text.

Layout is a **single column with 24px margins**: top strip, title zone, footer pairing. Content runs edge to edge; the title zone hard-crops anything past the edge via overflow hidden. The footer sets subtitle and context as raw type on the ground with whitespace separation.

**Density philosophy: one wall, one footer.** A typical slide carries a caps wall + a footer with two type blocks. Content slides keep the same skeleton at smaller scale (96–150px walls) with one Inter paragraph or one stat row in the footer zone. When titles lengthen, the wall steps down (290 → 150 → 96px) and wraps; the footer never moves and the strip never wraps.

**Key Characteristics:**
- Viewport-filling Anton caps at ~290px with 0.94 leading, hard-cropped by the stage edge.
- One orange type strike per slide — a single word, numeral, or head in signal orange, never more.
- Footer type pairing on the ground: subtitle left, context right, whitespace-separated.
- Tight 24px stage margins — content runs edge to edge with almost no frame.
- Raw stacked type — subtitle, context, and case count piled without dividers or chrome.
- Tracked Anton caps labels (22–26px, +0.18–0.25em) for the top strip and footer context.
- Zero rules, zero bands, zero grids, zero shadows, zero decoration.
- Two-face violence: Anton shouts, Inter whispers — nothing in between.

## Colors

### Palette

- **Black** (`{colors.black}` — `#0E0E0E`): The raw ground. Warm near-black, flat, untextured.
- **Slab Black** (`{colors.slab-black}` — `#000000`): Retained palette token; the footer-slab role is retired — the footer sets type on the ground.
- **Bone** (`{colors.bone}` — `#F5F0E6`): All type. Warm off-white with paper memory — never pure #FFF.
- **Signal Orange** (`{colors.signal-orange}` — `#FF4D00`): The single strike per slide. Loud, hot, structural.
- **Dim** (`{colors.dim}` — `#8A8578`): Smallest meta text only (case counts, strip alternates). Never headlines, never body.

### Defaults

- **Default surface background**: `{colors.black}` — flat, no texture, no grid, no vignette.
- **Default headline color**: `{colors.bone}` with exactly one `{colors.signal-orange}` strike word.
- **Default body text color**: `{colors.bone}`; smallest meta in `{colors.dim}`.
- **Default footer treatment**: bone type pairs on `{colors.black}` with whitespace separation (`{components.footer-line}`).
- **Default strip treatment**: bone tracked caps in plain type, label left, date right.
- **Default stat treatment**: bone Anton numerals at 96–150px with dim tracked labels beneath.

## Typography

### Font Family

The system runs two faces at maximum contrast.

**Anton** is the wall and the label — Regular (400) only, always caps. At 96–290px it is the title mass; at 22–26px with +0.18–0.25em tracking it is the strip and band voice. Anton's condensed heaviness is non-negotiable — substituting Archivo Black or Oswald softens the brutality.

**Inter** is the whisper — Regular (400) at 24–32px for subtitles, band paragraphs, and content body. Inter never exceeds 32px and never carries a headline; its smallness against Anton is the point.

Never use Inter for display, never use Anton for sentences. The shout/whisper split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.mega}` | 290px | Anton | 400 | Cover title wall — caps, cropped, one orange word |
| `{typography.display}` | 150px | Anton | 400 | Section opener wall |
| `{typography.headline}` | 96px | Anton | 400 | Standard slide headline wall |
| `{typography.strip-label}` | 24px | Anton | 400 | Top strip labels, +0.25em tracked |
| `{typography.band-context}` | 26px | Anton | 400 | Footer context line, +0.18em tracked |
| `{typography.body}` | 32px | Inter | 400 | Footer subtitle / cover whisper |
| `{typography.body-compact}` | 24px | Inter | 400 | Content body and footer paragraphs |
| `{typography.case-count}` | 22px | Anton | 400 | Case count / pagination, +0.2em tracked |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title wall is uppercase Anton with leading ≤ 1.0.** Loose leading or sentence case turns mass into text.
- **Every slide carries exactly one orange type strike.** On covers it is the strike word in the wall; on stat slides the numeral; on choice slides the affirmed head. Nothing else may be orange.
- **Every title wall is hard-cropped by its zone** (`overflow: hidden`, no fade, no ellipsis). Soft truncation does not exist.
- **Break walls after connector words, never before them.** Line breaks fall after small joiners (`of`, `to`, `and`) so the orange strike word opens its own line clean (e.g. `COST OF / RUSHING TO / SHIP`) — no stranded one-glyph openers, no strike word sharing its line head with a joiner.
- **Every footer separates from the zone with whitespace.** No slab, no rule — the type pairing floats on the ground.
- **Every strip label is tracked +0.25em in plain type.** No bullet, no rule.
- **Every whisper (Inter run) stays at or under 32px.** Large Inter next to Anton reads as indecision.
- **Every context line in the footer is right-aligned tracked caps** against the left-aligned subtitle — the stacked-type asymmetry.

### Typography Principles

The voice contrast is **shout ↔ whisper**. Anton declares at maximum volume; Inter annotates at minimum. There is no middle register — no 48px subheads, no medium emphasis, no pull quotes. If something matters less than the wall, it is 32px Inter in the footer; if it matters more, it joins the wall.

Walls should always feel **too big** — cropped, edge-running, slightly uncomfortable. Whispers should feel **withheld** — small, plain, left-aligned, no letterspacing.

### Defaults

- **Default size for a cover wall**: `{typography.mega}` (290px) — steps to 150px past ~45 characters, 96px past ~80.
- **Default size for a slide headline**: `{typography.headline}` (96px).
- **Default size for the footer subtitle**: `{typography.body}` (32px).
- **Default strip label**: `{typography.strip-label}` (24px, +0.25em).
- **Default footer context**: `{typography.band-context}` (26px, +0.18em).

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** with tight **24px margins** on all sides. The vertical stack is: top strip (~40px), title zone (flex, ~790px on covers), footer pairing (~200px). The title zone hard-crops with `overflow: hidden`; the footer sets type full-bleed on the ground.

There is no column grid. Horizontal placement has two positions: flush-left (walls, subtitles) and flush-right (context lines). Centered placement does not exist.

### Persistent Chrome

Two elements appear on every slide:

- **Top strip** — `{components.top-strip}`: research label left, date right, tracked Anton caps in plain type.
- **Footer pairing** — `{components.footer-line}`: subtitle left, context right, whitespace-separated.

There are no lines in this system — only type, scale, and air.

### Monumental Rhythm

The cover reads as three masses: strip / wall / footer. The wall dominates (~75% of stage height); the footer grounds it; the strip barely registers. This proportion is the rhythm — slides that shrink the wall below 60% of stage height stop reading as this system.

## Depth and Elevation

### Flat Mass by Doctrine

Monolith has **no depth system**. No shadows, no gradients, no translucency, no layers, no rules, no bands. Hierarchy is scale alone: 290px against 32px against 24px, with whitespace between masses.

### Hue as Structure

- **The strike type** advances purely by hue — orange on black vibrates forward without any shadow or glow.
- **The zone crop** creates implied mass beyond the edge: what you cannot see makes the wall feel larger than the stage.
- **Whitespace** separates strip, wall, and footer — never rules, never slabs.

### Mass Against Air

The only spatial move is the wall's **negative side bearing bleed**: long lines run past the comfortable measure and crop hard. Generous whitespace never appears beside a wall — air exists only in the footer padding and the 24px stage margins.

## Shapes and Treatment

### Border Radius

Zero everywhere, absolutely — there is nothing to round: no bands, no blocks, no bullets, no boxes. A rounded corner in this system reads as damage.

### Border Weights

No borders or lines exist in this system. The retired marks (8px orange rule, 20px strip bullet) are documented for history only: the strike survives as orange type, and every separation is whitespace.

### Decorative Element Types

**Title wall** — The 290px Anton caps mass with one orange strike word, hard-cropped by the zone. The system's entire identity.

**Orange strike** — The single orange type moment per slide. Count orange elements on every slide: the answer must be exactly one (strike word, stat numeral, or affirmed head).

**Footer pairing** — Subtitle (left) and context (right) as raw type on the ground, whitespace-separated.

**Top strip** — Tracked caps label row in plain type. No bullets, no rules.

**Stat wall** — On data slides: a 150px Anton numeral wall with a dim tracked label beneath, footer carrying the source line.

**Stacked type** — Footer content piles (subtitle over meta, context over count) with no dividers — proximity and size carry the grouping.

## Do's and Don'ts

### Do

- Fill the viewport with the wall — 290px on covers, cropped hard by the zone edge.
- Keep exactly one orange type strike per slide. Count orange on every slide.
- Run content edge to edge inside 24px margins. Tight is the aesthetic.
- Separate the footer from the zone with whitespace — never a slab, never a rule.
- Stack footer type raw: subtitle left, context right, no dividers.
- Track strip and footer labels (+0.18–0.25em) in Anton caps.
- Step the wall down (290 → 150 → 96px) as titles lengthen; never squeeze below 96px on covers.
- Let long lines crop. The hard crop is a feature, not a failure — within one word of depth.
- Keep Inter at or under 32px, plain, left-aligned.
- Set the strip as plain tracked caps in bone — label left, date right.

### Don't

- Don't add a second orange moment — one strike word, numeral, or head. One strike.
- Don't use lines, rules, bullets, slabs, or bands anywhere. Orange is type only.
- Don't round any corner, blur anything, or add any gradient, grid, or shadow.
- Don't center anything. Flush-left walls, flush-right context — no exceptions.
- Don't use Inter above 32px or Anton below presence (22px labels minimum, tracked).
- Don't use sentence case or lowercase in Anton. Caps always.
- Don't use italic anywhere — emphasis is orange or scale.
- Don't panel, card, or box content. Blocks stack raw on black.
- Don't fade, ellipsis, or softly truncate the wall. Hard crop only.
- Don't add decoration to "balance" the black. The black is the balance.

## Responsive Behavior

Monolith is a **fixed-stage system** built for 1920×1080 output. All sizes are absolute pixels; there are no breakpoints in the generated deck. The stage scales uniformly via a single transform (letterboxed, no reflow).

### Scaling Behavior

- The 290px wall and 24px margins are fixed at 1920×1080 and scale with the stage transform.
- Wall sizes step by content length (290 → 150 → 96px), not by viewport.
- The footer keeps its padding at all scales; the zone absorbs all variance.

### Component Breakpoints

None. The fixed-stage model has no viewport breakpoints. (Source-history note: a fluid ancestor shrank the wall with viewport width; that behavior is superseded by the fixed-stage policy above.)

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are instant cuts — slabs slam, they do not fade.

### Animation Triggers

None. This system has no animation: no entry motion, no reveals, no pulses. Static slabs only.

### Print Behavior

The system prints as designed — black ground, bone type, orange strike type. Heavy black coverage suits laser output; for draft printing, the strike type survives grayscale as a dark accent. Screenshots preserve the wall, crop, and footer exactly.

## CJK & International Content

When using this system for Korean (or other CJK) content, swap the Latin stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Title wall / labels | Anton 400 (caps) | Noto Sans KR 900 (no transform, no tracking on CJK) |
| Body / whisper | Inter 400 | Noto Sans KR 400 |
| Latin codes / dates | Anton tracked / Inter | Keep Anton/Inter for Latin-only runs (`NOV 2026`) |

### Mixed-Content Strategy

**Strategy B** — split pairing. CJK walls and whispers render in Noto Sans KR (900 for walls, 400 for whispers); Latin-only labels and dates stay in Anton/Inter to preserve the condensed voice where it can survive. The orange strike word applies to a Korean word clause (no word-splitting mid-phrase). The footer pairing, strip, and crop translate unchanged and carry extra identity load.

### Loading

Add to the slide `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: raise walls to 1.05–1.1 (up from 0.94–1.0) and whispers to 1.65–1.75. Tight Anton leading clips CJK glyphs.
- **Letter-spacing**: set to 0 on every CJK run. Strip/footer tracking (+0.18–0.25em) applies to Latin runs only.
- **Text transform**: never apply `uppercase` to CJK text.
- **Punctuation**: use full-width CJK punctuation where the locale demands it; keep `·` separators with spaces in mixed lines.
- **No trailing period on display walls**: omit terminal punctuation on cover titles per CJK convention.
- **Space between CJK and Latin**: keep an ASCII space between Hangul/Hanja and adjacent Latin or digits.
- **Wall sizing**: CJK walls at 900 weight run wider per character — expect one more wrap line than Latin at the same size, and step down earlier (290 → 150 past ~30 CJK characters).

### Aesthetic Notes for This System

Mass translates; condensedness does not. Noto Sans KR 900 at wall sizes is heavy but full-width — it fills vertically rather than towering. Compensate by keeping walls large (never below 150px on CJK covers unless wrapping demands it), keeping the hard crop (cropped Hangul reads as intentional mass), and letting the orange strike word carry the recognition load.

### Known CJK Gap

- **No condensed Korean display face on CDN.** Anton's towering condensed caps have no Hangul equivalent; Noto Sans KR 900 is wide and sturdy, so CJK walls feel heavy rather than soaring. The crop and the strike must carry the brutality.
- **Tracked-label voice weakens.** The strip/footer tracking signal applies to Latin only; Korean labels at 0 tracking feel functional rather than monumental.

## Iteration Guide

1. Any new slide keeps the strip / wall / footer stack with 24px margins and whitespace separation. Don't skip the masses.
2. Any new wall uses Anton caps at 290/150/96px with leading ≤ 1.0 and exactly one orange strike word.
3. Any new whisper uses Inter 400 at ≤ 32px, plain, left-aligned, in the footer.
4. Any new label uses tracked Anton caps (22–26px, +0.18–0.25em), strip-left or band-right.
5. Any new zone hard-crops with `overflow: hidden` — no fades, no ellipses, no soft truncation.
6. Any new orange element must be counted: exactly one strike word, numeral, or head per slide — that is the full budget.
7. If a title exceeds ~45 characters, step the wall to 150px; past ~80, to 96px. Never set a cover wall below 96px.
8. If a footer needs a third block, stack it raw under the subtitle — never add dividers or side-by-side cards.
9. New stats are 150px Anton numeral walls with dim tracked labels; sources go in the footer as Inter whispers.
10. New slides are static slabs with no animation. Keep it that way.
11. Keep every title wall single-sourced: the `h1` holds one contiguous title string — never hand-split it into per-line/per-word spans and never duplicate it into `aria-label`. Line splits come from `data-break-after` token positions and the orange strike from `data-accent-index` at render time (`__monoRenderTitle`), so any locale swap re-renders with no markup edits.
12. When a translation has fewer words than the English title, the accent index clamps to the final token and out-of-range break positions are ignored. Verify the swapped render keeps exactly one orange strike word and breaks only at spaces (`word-break: keep-all`, `overflow-wrap: normal`) — no mid-word orphans.
13. Never depend on `text-transform: uppercase` for CJK runs: the renderer adds `is-cjk` (no transform, zero tracking, 1.08 leading) whenever the title contains CJK characters, while Latin keeps the brutalist caps wall.

## Known Gaps

- **Fonts**: Anton / Inter via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the condensed monumental voice entirely.
- **No image treatment specified.** Photography and illustration are out of scope — the wall is the visual.
- **No chart or table system.** Data must be reduced to stat walls (one numeral + label) with sourced whispers in the footer.
- **Long titles degrade to 96px.** Past ~80 characters the wall loses monumentality; authors should shorten titles rather than accept small walls.
- **The crop is viewport-fixed.** Line breaks that crop gracefully at 1920×1080 are hand-tuned per title; new titles must be screenshot-verified for crop depth (within one word).
- **Footer padding is fixed.** Subtitles past ~90 characters wrap to two lines and must be verified against the footer padding.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in this system |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used — static slabs only | full | N/A |
| 4 | Pixel / hard offset shadows | Not used — zero shadows by doctrine | full | N/A |
| 5 | Gradients | Not used | full | N/A |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Not used — all fills opaque | full | N/A |
| 8 | Custom fonts | Anton / Inter via Google Fonts CDN | partial | Embed licensed equivalents or substitute Arial Black / Calibri |
| 9 | Absolute-positioned decor | Strip, wall, footer as stacked text | full | Native text boxes |
