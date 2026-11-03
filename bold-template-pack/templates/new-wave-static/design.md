---
version: alpha
name: New Wave Static
description: A Swiss-punk cover that vandalizes its own grid on purpose. Flush-left Archivo at poster scale carries the shout while a single Newsreader italic word intrudes in magenta; fixed 24-degree neon slash bars cut the white ground, black masthead and footer bands clamp the poster, and a cropped outline giant plus a 45-degree rotated kicker crowd the margins. Nothing centers, nothing rounds, nothing whispers.

colors:
  paper-white: "#FFFFFF"
  signal-black: "#000000"
  static-magenta: "#FF00A8"
  wave-cyan: "#00C2FF"

shadows:
  none-flat: "none"
  outline-ghost: "-webkit-text-stroke 6px {colors.static-magenta}"
  chip-reverse: "none"

typography:
  poster-shout:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 104px
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.02em
  intruder-italic:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: 104px
    fontWeight: 500
    lineHeight: 1.02
  deck-sub:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.4
  band-caps:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.14em
  kicker-caps:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0.24em
  rotated-chip:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 30px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0.22em
  context-chip:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.1em
  footer-giant:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 44px
    fontWeight: 900
    lineHeight: 1
  ghost-numeral:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 560px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.05em

spacing:
  slash-angle: 24deg
  chip-angle: 45deg
  slash-magenta-w: 46px
  slash-cyan-w: 26px
  slash-black-w: 12px
  band-top-h: 76px
  band-foot-h: 120px
  body-width: 1290px
  pad-page-x: 90px
  ghost-size: 560px
  ghost-stroke: 6px

canvas:
  width: 1920px
  height: 1080px

components:
  masthead-band:
    background: "{colors.signal-black}"
    height: 76px
    padding: "0 60px"
    description: "Black top clamp: magenta TYPODECK chip + RESEARCH left, cyan date + case count right, tracked caps."
  slash-trio:
    angle: 24deg
    widths: "46px magenta / 26px cyan / 12px black"
    description: "Fixed-angle neon bars slashing the ground right-of-center; the system's primary gesture."
  ghost-numeral:
    fontSize: 560px
    stroke: "6px {colors.static-magenta}"
    opacity: 0.65
    description: "Cropped outline giant (the sample count) bleeding off the right/bottom edges behind content."
  rotated-chip:
    angle: 45deg
    background: "{colors.signal-black}"
    color: "{colors.wave-cyan}"
    description: "Sticker-like kicker chip rotated 45deg crowding the right margin; always imperative or indexical."
  slash-divider:
    black: "200px bar"
    magenta: "120px skew(-45deg) tail"
    cyan: "60px skew(-45deg) tail"
    description: "Headline/subtitle separator: black bar discharging into skewed neon tails."
  context-chip:
    background: "{colors.signal-black}"
    color: "{colors.white}"
    padding: "16px 30px"
    description: "Reversed black chip carrying the context line with a 16px cyan signal dot."
  footer-clamp:
    black: "flex band with magenta giant numeral"
    cyan: "340px page chip"
    description: "Bottom clamp: black band with 44px magenta numeral + warning caps, cyan page chip at right."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

New Wave Static is a **Swiss-punk cover** — a disciplined flush-left grid deliberately vandalized with neon diagonals, clashing scale, and one serif intruder. The composition reads top-to-bottom like a poster run: black masthead band, kicker with magenta rule, poster-scale Archivo headline, slash divider, bold subtitle, reversed context chip, black footer clamp. The right third belongs to the static: 24-degree slash bars, a 560px cropped outline giant, and a 45-degree rotated chip.

The type contract is two faces in deliberate conflict. **Archivo** (700–900) is the shout — headlines, kickers, bands, chips, footer, all caps or mixed case at high weight with tight tracking. **Newsreader italic** (500) is the intruder — exactly one headline word flips to magenta serif italic, a high/low clash that proves the vandalism is intentional. A second serif word would make it a pattern; a pattern would make it safe.

The palette is **four flat colors, no tints**: paper white ground, signal black clamps and type, static magenta and wave cyan as the neon pair. Magenta leads (ghost stroke, intruder word, footer giant, masthead chip); cyan answers (slash bar, rotated chip text, context dot, page chip). Black frames everything. There are no grays, no pastels, no gradients — voltage comes from full-saturation contrast.

**Density philosophy: poster-cluttered, grid-anchored.** The cover crowds masthead, kicker, headline, divider, subtitle, chip, footer, slashes, ghost, and rotated sticker into one frame — but the left text column holds a strict 90px rail and the bands clamp top and bottom, so the chaos reads as curated overload rather than accident.

**Key Characteristics:**
- Fixed 24-degree neon slash bars (magenta 46px, cyan 26px, black 12px) cut the white ground on every cover.
- One headline word flips to Newsreader italic magenta — a serif intruder inside the grotesque shout.
- 45-degree rotated kicker chip in reversed black/cyan crowds the margin like a pasted sticker.
- Giant cropped outline numeral (6px magenta stroke, half off-canvas) anchors the composition at 560px.
- Skewed slash-divider (black bar + magenta + cyan tails) separates headline from subtitle.
- Black masthead and footer bands clamp the poster; the footer pairs a magenta numeral with a cyan page chip.
- Four flat colors only — white, black, magenta, cyan — with zero tints, zero gradients, zero shadows.
- Nothing centers and nothing rounds: flush-left type, hard crops, sharp corners throughout.

## Colors

### Palette

- **Paper White** (`{colors.paper-white}` — `#FFFFFF`): The ground. Stark gallery white so the neons hit at full voltage.
- **Signal Black** (`{colors.signal-black}` — `#000000`): Clamps (masthead, footer), headline ink, slash accent, rotated chip fill, context chip fill. True black, never off-black.
- **Static Magenta** (`{colors.static-magenta}` — `#FF00A8`): Lead neon — masthead chip, 46px slash, ghost-numeral stroke, intruder word, divider tail, footer giant, subtitle slashes. The loudest voice.
- **Wave Cyan** (`{colors.wave-cyan}` — `#00C2FF`): Answer neon — 26px slash, rotated-chip text, context dot, footer page chip, one headline word. Always paired against magenta or black, never alone on white at small sizes.

### Defaults

- **Default surface background**: `{colors.paper-white}` flat, with the slash trio + ghost numeral as the only ground marks.
- **Default headline color**: black with one magenta serif-intruder word and one cyan grotesque word per cover.
- **Default subtitle color**: black, Archivo 700, led by magenta `///` slashes.
- **Default band treatment**: black fill, white caps, one magenta chip (top) / one magenta giant + cyan chip (bottom).
- **Default neon assignment**: magenta = emphasis/stroke/voice, cyan = signal/dot/chip-fill. Never swapped without reason.
- **Default small-text rule**: cyan never carries body-size text on white (contrast) — it appears as chips, dots, strokes, and display words only.

When a cover needs more voltage, enlarge the ghost numeral or widen the magenta slash — never add a third neon. The four-color limit is the discipline inside the noise.

## Typography

### Font Family

The system runs two faces in staged conflict.

**Archivo** is the shout — used for everything except the intruder word: masthead, kicker, headline (800), subtitle (700), divider-adjacent labels, context chip, rotated chip, footer. Weights 700–900, tight tracking on display (-0.02em), wide tracking on caps chips (+0.10em to +0.24em). Archivo's grotesque neutrality is what makes the neon feel punk rather than corporate.

**Newsreader italic** is the intruder — used for exactly one headline word per cover (500 italic, magenta, un-tracked). Its high-contrast serif italics against Archivo's grotesque shout is the system's signature high/low clash.

Never use Newsreader for more than one word, never use it roman, never use it outside the headline. The one-word monopoly is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.poster-shout}` | 104px | Archivo | 800 | Cover headline |
| `{typography.intruder-italic}` | 104px | Newsreader italic | 500 | The one serif headline word |
| `{typography.deck-sub}` | 34px | Archivo | 700 | Cover subtitle |
| `{typography.band-caps}` | 24px | Archivo | 700 | Masthead/footer band caps |
| `{typography.kicker-caps}` | 28px | Archivo | 800 | Kicker above headline |
| `{typography.rotated-chip}` | 30px | Archivo | 800 | 45° sticker chip |
| `{typography.context-chip}` | 24px | Archivo | 700 | Reversed context chip |
| `{typography.footer-giant}` | 44px | Archivo | 900 | Magenta footer numeral |
| `{typography.ghost-numeral}` | 560px | Archivo | 900 | Cropped outline giant |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline carries exactly one intruder word** — Newsreader italic 500 in magenta at headline size. Zero intruders reads as plain Swiss; two reads as indecision.
- **Every headline may carry one cyan grotesque word** — Archivo 800 in cyan (e.g. the payoff verb). The cyan word and the magenta intruder must be different words.
- **Accent spans are runtime token styling, never hardcoded words** — the headline is a single text source; JS wraps the 3rd word (magenta intruder) and the last word (cyan payoff) at render time. English `The Hidden Cost of Rushing to Ship` resolves to intruder `Cost` + payoff `Ship`; Korean `서두른 출시의 숨은 비용` resolves to intruder `숨은` + payoff `비용`. The title sets `word-break: keep-all` so CJK wraps only at spaces.
- **Every subtitle opens with magenta slashes** — `///` in Archivo 900 magenta before the sentence. Bare subtitles are not permitted.
- **Every kicker pairs a magenta rule (90×10) with tracked caps** — the rule is the fuse, the caps are the label.
- **Every rotated chip is imperative or indexical** — `READ THE FAILURE LOG ▸`, never a noun phrase; 45°, black fill, cyan text.
- **Every rotated chip keeps ≥190px clearance** from the headline column (headline max 1210px, chip origin x=1540) — headline/chip collision is never shipped.
- **Every ghost numeral is the sample count** — cropped outline 560px magenta stroke at 65% opacity, bleeding off-canvas right/bottom.

### Defaults

- **Default size for a cover title**: `{typography.poster-shout}` (104px Archivo 800, 1.02 line-height, -0.02em).
- **Default size for the intruder word**: same 104px box in Newsreader italic 500 magenta.
- **Default size for a cover subtitle**: `{typography.deck-sub}` (34px Archivo 700, 1.4 line-height, max 22em).
- **Default size for band caps**: 24px Archivo 700 at +0.14em; kicker 28px at +0.24em; chips 24–30px.
- **Default headline color**: black with magenta intruder + cyan payoff word; default subtitle: black with magenta slashes.

When unsure which face to reach for, default to Archivo — Newsreader appears by invitation only, one word per cover.

### Typography Principles

The voice contrast is **shout ↔ whisper-of-a-hostage-note**: Archivo yells from the wall, Newsreader italic slips one elegant word into the ransom. Case is tactical — masthead/kicker/chips/footer in tracked caps, headline in mixed case (the intruder needs lowercase curves to clash against), subtitle in sentence case bold. Italic exists exactly once (the intruder); a second italic would domesticate it.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The cover is a clamped poster: 76px black masthead on top, 120px footer clamp at bottom, a 1290px left text column on the 90px rail between them, and the static zone (slashes, ghost, rotated chip) owning the right third. The stage background is white; letterbox bars outside are black, merging with the bands — verify the white ground edge reads in screenshots.

Text never crosses the slash trio: the 1290px body column ends where the magenta bar begins. The ghost numeral and rotated chip live behind/above the static zone only, never over the text column.

### Slash Geometry

Every diagonal resolves to **two fixed angles**: 24° for ground slashes (the trio + the footer-corner echo) and 45° for chips and divider tails (rotated kicker, skewed divider tails). Slash widths are fixed (46/26/12px trio, 20px echo). Off-angle diagonals are defects — the punk read depends on the clash between exactly-two angles and the orthogonal grid.

### Persistent Chrome

Three elements appear on every cover:

- **Masthead band** — 76px black bar: magenta `TYPODECK` chip + `RESEARCH` left, cyan date + case count right.
- **Footer clamp** — 120px band: black zone with magenta giant numeral + warning caps left, 340px cyan page chip right.
- **Slash trio** — 24° magenta/cyan/black bars cutting the ground right-of-center.

### Curated Overload

New Wave Static has no atmospheric layer — no grain, no vignette, no ambient motion. Its "atmosphere" is compositional overload: slashes, ghost, sticker, bands, and chips colliding inside a strict rail-and-clamp frame. Removing any one static element is permitted; removing two leaves a plain Swiss slide that fails the genre.

## Depth and Elevation

### Overlap as Depth (Signature)

Depth in this system is **collage overlap**: the ghost numeral sits behind the slash trio, the rotated chip floats above the slashes, the context chip sits on the white ground, and the bands clamp over everything top and bottom. Z-order is the only elevation cue — ghost (back) → slashes → text column → chips → bands (front). No shadows mediate these overlaps; hard abutment is the aesthetic.

### Outline Giants as Air

The 560px outline numeral creates depth by **scale contrast**, not blur: a half-off-canvas stroke-only giant reads as far-behind-poster while the solid 104px headline reads as pasted-on-front. The 65% opacity sells the distance. Filling the ghost solid would collapse the depth and deafen the headline.

### Reversed Chips as Pops

Black chips (rotated kicker, context line) pop forward through **value inversion** against the white ground — the same trick as the bands, at sticker scale. Cyan text/dots on the black chips add a neon lift without any glow effect.

### No-Shadow Rule

`box-shadow`, `text-shadow` (except the ghost's structural stroke), blur, and gradients are banned. The ghost uses `-webkit-text-stroke`, which is an outline, not a shadow. Depth is overlap order, scale contrast, and inversion only.

## Shapes and Treatment

### Border Radius

Absolute zero. Bands, chips, rules, slashes, and dividers are all sharp-cornered — including the rotated sticker chip, whose 45° rotation already signals "pasted" without needing rounded corners. A rounded element would read as app-UI against the wheat-paste poster register.

### Border Weights

- **10–12px solid** — black slash accent (12px), kicker rule height (10px), divider bar height (12px).
- **20–26px solid** — cyan slash (26px), magenta echo slash (20px).
- **46px solid** — lead magenta slash. The heaviest stroke in the system.
- **6px stroke** — ghost-numeral outline (`-webkit-text-stroke`), magenta at 65% opacity.
- **16px square** — cyan signal dot in the context chip (square, not circular).

Strokes are always solid and flat — never dashed, never outlined-twice, never gradient-filled.

### Decorative Element Types

**Masthead band** — Black top clamp with magenta chip + cyan date telemetry. The poster's header strip; appears on every cover.

**Slash trio** — 24° magenta/cyan/black bars (46/26/12px) cutting the ground. The primary vandalism gesture.

**Ghost numeral** — 560px cropped outline giant of the sample count, magenta 5px stroke at 50%, bleeding off-canvas. The poster's depth anchor.

**Rotated chip** — 45° black sticker with cyan imperative caps crowding the margin. The pasted-on voice.

**Slash divider** — Black 200px bar discharging into skewed magenta (120px) + cyan (60px) tails. The headline/subtitle separator.

**Context chip** — Reversed black chip with cyan square dot carrying the context line. The sign-off sticker.

**Footer clamp** — Black band with 44px magenta giant + warning caps beside a 340px cyan page chip. The poster's bottom strip.

**Kicker rule** — 90×10 magenta bar fusing into tracked caps. The headline's fuse.

## Do's and Don'ts

### Do

- Clamp every cover with the black masthead (76px) and footer (120px) bands — they are the poster's frame.
- Set headlines flush-left in 104px Archivo 800 on the 90px rail with exactly one magenta Newsreader intruder word.
- Slash the ground with the 24° trio (46px magenta / 26px cyan / 12px black) right-of-center on every cover.
- Crop the 560px outline ghost numeral off the right/bottom edges at 65% opacity behind the slashes.
- Paste the 45° rotated black/cyan imperative chip into the right margin.
- Separate headline from subtitle with the skewed slash-divider (black bar + magenta + cyan tails).
- Open every subtitle with magenta `///` slashes and close the column with the reversed context chip.
- Keep the palette at four flats — white, black, magenta, cyan — with no tints or gradients.

### Don't

- Don't center type or balance the composition — flush-left rails and right-margin static are the layout law.
- Don't add shadows, glows, blurs, or gradients — depth is overlap, scale contrast, and inversion only.
- Don't round any corner — chips, bands, and stickers are all sharp.
- Don't use a second Newsreader word or use Newsreader outside the headline — the one-word monopoly is structural.
- Don't use off-angle diagonals — 24° for slashes, 45° for chips/tails, nothing else.
- Don't let cyan carry small text on white — cyan is for chips, dots, strokes, and display words (contrast).
- Don't add a third typeface, a third neon, bullets, or polite hairline rules — the vocabulary is closed and loud.
- Don't let text cross the slash trio — the 1290px column ends where the magenta begins.
- Don't fill the ghost numeral solid — stroke-only at 50% is what keeps it behind the headline.
- Don't tidy the static zone into alignment — the slashes, ghost, and sticker collide on purpose.

## Responsive Behavior

New Wave Static is a **fixed-stage system** built for 1920×1080 with absolute pixel sizing — 104px shout, 560px ghost, 76/120px bands. There are no breakpoints and no fluid type; the stage scaler handles all viewport adaptation with a uniform transform.

### Scaling Behavior

- The whole stage scales uniformly via `__typodeckFitStage`; slash angles (being transforms) hold exactly at every viewport.
- At phone widths the stage letterboxes — the poster reads as a scaled flyer, which suits the genre.
- Slash widths, ghost stroke, and band heights scale with the stage (they are inside it), preserving the voltage at every size.

### Component Breakpoints

None. The 1290px text column, slash positions, and ghost crop are fixed coordinates. If a future multi-slide extension needs narrower layouts, it must define new coordinates explicitly rather than reflowing these.

### Presenter Behavior

- Covers are static posters: no entrance animation is specified beyond the standard stage transition.
- No element vibrates, flickers, or scrolls despite the "static" name — the noise is compositional, not kinetic. `prefers-reduced-motion` is satisfied by default.

### Animation Triggers

None. Any future jitter or flicker animation must respect `prefers-reduced-motion` and complete within 800ms so screenshots capture end state.

### Print Behavior

The system prints as a flat static frame: magenta/cyan print at full saturation (warn on uncalibrated printers — neons shift), black bands print solid, ghost stroke holds at 5px. No `@media print` overrides are defined; export captures the stage at 1920×1080.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for a heavy gothic CJK face with a Song-style intruder, and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Shout / bands / chips / ghost | Archivo 700–900 | Noto Sans SC 700–900 |
| Intruder word | Newsreader italic 500 | Noto Serif SC 600 (upright, no italic) |

### Mixed-Content Strategy

**Strategy A** — gothic CJK workhorse plus Song intruder. Set cover text to `font-family: 'Noto Sans SC', sans-serif` at 700–900 and flip exactly one headline word to `font-family: 'Noto Serif SC', serif` in magenta — the Song/gothic clash reproduces the high/low intruder logic without synthetic italics. Latin fragments (`TYPODECK`, `P. 01`) keep Archivo via fallback order.

### Loading

Add to the cover's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700;900&family=Noto+Serif+SC:wght@600&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15–20% from the Latin spec. Headline 1.2–1.25 (up from 1.02), subtitle 1.6–1.7 (up from 1.4).
- **Letter-spacing**: set to 0 on every CJK run. The -0.02em display tightening and +0.10–0.24em chip tracking look broken on square CJK glyphs; keep Latin tracking only on pure-Latin runs (masthead, page chip).
- **Text transform**: never apply `uppercase` to CJK runs; CJK has no case.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: omit the period on cover-scale CJK titles.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin/digits, e.g. `11 个复盘`.
- **Intruder stays one word**: the Song intruder keeps its one-word monopoly in CJK builds — pick the semantic pivot of the translated headline.
- **Word-break**: the headline sets `word-break: keep-all` so CJK line breaks fall only at spaces, never mid-word.

### Aesthetic Notes for This System

The punk register transfers well because it rests on **non-typographic** voltage: slash bars, black clamps, ghost numeral, and rotated sticker all work in any script. Noto Sans SC 900 has genuine poster heft, and the Song intruder in magenta reproduces the high/low clash honestly (upright Song italics would be synthetic — never oblique CJK). Keep the `///` subtitle slashes and the ghost numeral Latin digits even in CJK builds.

### Known CJK Gap

- **No CJK italic exists.** Newsreader italic's slanted elegance has no CJK equivalent — the Song intruder is upright by necessity, trading slant-clash for style-clash. The magenta color + Song letterforms must carry the intrusion alone.
- **Tracked caps chips collapse.** The +0.14–0.24em band/chip tracking that makes Latin chips feel engineered must drop to 0 for CJK; keep Latin chips (masthead, page mark) in Archivo to preserve at least two tracked elements.

## Iteration Guide

1. Any new cover clamps the poster with the 76px black masthead and 120px footer — bands first, content second.
2. Any new headline uses 104px Archivo 800 flush-left on the 90px rail with exactly one magenta Newsreader intruder + one cyan payoff word.
3. Any new subtitle is 34px Archivo 700 opened by magenta `///` slashes, followed by the reversed context chip.
4. Any new kicker pairs the 90×10 magenta rule with 28px tracked caps; any new margin sticker is a 45° black/cyan imperative chip.
5. Any new cover slashes the ground with the 24° trio at fixed widths and crops the 560px ghost numeral off-canvas at 50%.
6. Any new divider is the slash-divider (black bar + skewed magenta/cyan tails) — never bare rules or centered ornaments.
7. Any new measurement follows the band/column rhythm (76/120px bands, 1290px column, 90px rail); nothing rounds, nothing centers.
8. Any new color must be one of the four flats — no tints, no gradients, no third neon.
9. New covers stay flat and static: no shadows, no glows, no blur, no animation — depth is overlap + scale + inversion.
10. CJK builds swap to Noto Sans/Serif SC per the CJK section, zero tracking on CJK runs, Song intruder keeps the monopoly.

## Known Gaps

- **Fonts**: Archivo / Newsreader via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `Georgia, serif`. No font files committed. Offline rendering falls back to system stacks and loses the shout/intruder contrast.
- **Ghost numeral uses `-webkit-text-stroke`** (6px magenta) with transparent fill — supported in Chrome/Edge/Safari/Firefox, but stroke rendering varies subtly by engine; verify in screenshots.
- **Ghost digits stay Latin** (`11`) even in CJK builds by design — CJK numerals at 560px outline were judged less legible in testing.
- **Slash bars are fixed-position rotated divs** (1500px tall, 24°) — at unusual aspect ratios inside the scaler they still cover the stage, but coordinates assume 1920×1080.
- **Rotated chip clearance rule (absolute, 45°):** the headline column caps at 1210px and the chip origin sits at x=1540 — ≥190px of air between them at cover scale. The chip's right-edge bleed is intentional; on LONG-title variants verify the render and shift the chip origin down (never left into the text column) if the headline reaches it.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in system |
| 2 | Blend modes | None used | full | N/A — no blends in system |
| 3 | Animation / keyframes | None used | full | N/A — static poster |
| 4 | Pixel / hard offset shadows | None used (flat overlaps only) | full | N/A — shapes export natively |
| 5 | Gradients | None used | full | N/A — all fills solid |
| 6 | Grain / scanline / noise overlays | None used | full | N/A — no overlays |
| 7 | Transparency layers | Ghost numeral at 65% opacity | partial | Ghost at 65% transparency shape fill, or solid at 70% tint |
| 8 | Custom fonts | Archivo + Newsreader via CDN | partial | Embedded fonts or Arial Black/Georgia substitution |
| 9 | Absolute-positioned decor | Slashes, ghost, sticker, bands (positioned divs) | partial | Grouped native shapes (parallelograms + text boxes) |
