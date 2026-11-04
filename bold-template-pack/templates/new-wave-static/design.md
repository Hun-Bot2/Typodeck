---
version: alpha
name: New Wave Static
description: A Swiss-punk cover that vandalizes its own grid on purpose. Flush-left Archivo at poster scale carries the shout while a single Newsreader italic word intrudes in magenta; neon /// glyphs slash through kickers and dividers, ruled masthead and footer type lines clamp the poster, and a cropped outline giant plus a 45-degree rotated kicker crowd the margins. Nothing centers, nothing rounds, nothing whispers. Typography-only: no bands, bars, chips, or filled shapes.

colors:
  paper-white: "#FFFFFF"
  signal-black: "#000000"
  static-magenta: "#FF00A8"
  wave-cyan: "#00C2FF"

shadows:
  none-flat: "none"
  outline-ghost: "-webkit-text-stroke 6px {colors.static-magenta}"

rules:
  masthead-rule: "4px solid #000000"
  footer-rule: "4px solid #000000"

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
  masthead-caps:
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
  rotated-kicker:
    fontFamily: "'Archivo', 'Arial Black', sans-serif"
    fontSize: 30px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0.22em
  context-line:
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
  kicker-angle: 45deg
  masthead-h: 76px
  footer-h: 120px
  rule-clamp-w: 4px
  body-width: 1290px
  pad-page-x: 90px
  ghost-size: 560px
  ghost-stroke: 6px

canvas:
  width: 1920px
  height: 1080px

components:
  masthead-line:
    rule: "4px solid {colors.signal-black} below"
    height: 76px
    padding: "0 60px"
    description: "Top clamp as type: magenta TYPODECK + black RESEARCH left, cyan date + case count right, tracked caps over a 4px rule."
  ghost-numeral:
    fontSize: 560px
    stroke: "6px {colors.static-magenta}"
    opacity: 0.65
    description: "Cropped outline giant (the sample count) bleeding off the right/bottom edges behind content."
  rotated-kicker:
    angle: 45deg
    color: "{colors.signal-black} with {colors.static-magenta} ▸▸▸"
    description: "Sticker-like kicker rotated 45deg crowding the right margin; always imperative or indexical."
  slash-divider:
    glyphs: "/// in black + magenta + cyan"
    description: "Headline/subtitle separator: three slash runs discharging black into neon."
  context-line:
    marker: "▸ in {colors.static-magenta}"
    description: "Bold context line led by a magenta ▸ glyph."
  footer-line:
    rule: "4px solid {colors.signal-black} above"
    description: "Bottom clamp as type: 44px magenta numeral + warning caps left, page mark right, over a 4px rule."
  kicker-slashes:
    glyphs: "/// in {colors.static-magenta}"
    description: "Magenta slash run fusing into tracked kicker caps; the headline's fuse."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and ghost-bleed legibility.


## Overview

New Wave Static is a **Swiss-punk cover** — a disciplined flush-left grid deliberately vandalized with neon slashes, clashing scale, and one serif intruder. The composition reads top-to-bottom like a poster run: ruled masthead line, kicker with magenta slashes, poster-scale Archivo headline, slash divider, bold subtitle, marked context line, ruled footer line. The right third belongs to the static: a 560px cropped outline giant and a 45-degree rotated kicker.

The type contract is two faces in deliberate conflict. **Archivo** (700–900) is the shout — headlines, kickers, masthead, footer, sticker, all caps or mixed case at high weight with tight tracking. **Newsreader italic** (500) is the intruder — exactly one headline word flips to magenta serif italic, a high/low clash that proves the vandalism is intentional. A second serif word would make it a pattern; a pattern would make it safe.

The palette is **four flat colors, no tints**: paper white ground, signal black rules and type, static magenta and wave cyan as the neon pair. Magenta leads (ghost stroke, intruder word, footer giant, slash runs); cyan answers (payoff word, divider tail, date line). Black rules everything. There are no grays, no pastels, no gradients — voltage comes from full-saturation contrast.

**Density philosophy: poster-cluttered, grid-anchored.** The cover crowds masthead, kicker, headline, divider, subtitle, context line, footer, slashes, ghost, and rotated sticker into one frame — but the left text column holds a strict 90px rail and the rules clamp top and bottom, so the chaos reads as curated overload rather than accident.

**Key Characteristics:**
- Neon /// slash runs (black, magenta, cyan) slash through kickers and dividers on every cover.
- One headline word flips to Newsreader italic magenta — a serif intruder inside the grotesque shout.
- 45-degree rotated kicker in black with magenta ▸▸▸ crowds the margin like a pasted sticker.
- Giant cropped outline numeral (6px magenta stroke, half off-canvas) anchors the composition at 560px.
- Slash divider (black + magenta + cyan /// runs) separates headline from subtitle.
- Ruled masthead and footer type lines clamp the poster; the footer pairs a magenta numeral with the page mark.
- Four flat colors only — white, black, magenta, cyan — with zero tints, zero gradients, zero shadows, zero boxes.
- Nothing centers and nothing rounds: flush-left type, hard crops, sharp corners throughout.

## Colors

### Palette

- **Paper White** (`{colors.paper-white}` — `#FFFFFF`): The ground. Stark gallery white so the neons hit at full voltage.
- **Signal Black** (`{colors.signal-black}` — `#000000`): Rules (masthead, footer), headline ink, slash runs, rotated kicker. True black, never off-black.
- **Static Magenta** (`{colors.static-magenta}` — `#FF00A8`): Lead neon — masthead word, slash runs, ghost-numeral stroke, intruder word, divider tail, footer giant, subtitle slashes. The loudest voice.
- **Wave Cyan** (`{colors.wave-cyan}` — `#00C2FF`): Answer neon — divider tail, date line, one headline word. Always paired against magenta or black, never alone on white at small sizes.

### Defaults

- **Default surface background**: `{colors.paper-white}` flat, with the ghost numeral as the only ground mark.
- **Default headline color**: black with one magenta serif-intruder word and one cyan grotesque word per cover.
- **Default subtitle color**: black, Archivo 700, led by magenta `///` slashes.
- **Default clamp treatment**: 4px black rules with tracked caps above/below — magenta numeral + page mark at the foot.
- **Default neon assignment**: magenta = emphasis/stroke/voice, cyan = payoff/tail/date. Never swapped without reason.
- **Default small-text rule**: cyan never carries body-size text on white (contrast) — it appears as strokes, tails, and display words only (the cyan date line and payoff word are a deliberate punk display exception).

When a cover needs more voltage, enlarge the ghost numeral or the slash runs — never add a third neon. The four-color limit is the discipline inside the noise.

## Typography

### Font Family

The system runs two faces in staged conflict.

**Archivo** is the shout — used for everything except the intruder word: masthead, kicker, headline (800), subtitle (700), divider-adjacent labels, context line, rotated kicker, footer. Weights 700–900, tight tracking on display (-0.02em), wide tracking on caps lines (+0.10em to +0.24em). Archivo's grotesque neutrality is what makes the neon feel punk rather than corporate.

**Newsreader italic** is the intruder — used for exactly one headline word per cover (500 italic, magenta, un-tracked). Its high-contrast serif italics against Archivo's grotesque shout is the system's signature high/low clash.

Never use Newsreader for more than one word, never use it roman, never use it outside the headline. The one-word monopoly is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.poster-shout}` | 104px | Archivo | 800 | Cover headline |
| `{typography.intruder-italic}` | 104px | Newsreader italic | 500 | The one serif headline word |
| `{typography.deck-sub}` | 34px | Archivo | 700 | Cover subtitle |
| `{typography.masthead-caps}` | 24px | Archivo | 700 | Masthead/footer line caps |
| `{typography.kicker-caps}` | 28px | Archivo | 800 | Kicker above headline |
| `{typography.rotated-kicker}` | 30px | Archivo | 800 | 45° sticker kicker |
| `{typography.context-line}` | 24px | Archivo | 700 | Marked context line |
| `{typography.footer-giant}` | 44px | Archivo | 900 | Magenta footer numeral |
| `{typography.ghost-numeral}` | 560px | Archivo | 900 | Cropped outline giant |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every headline carries exactly one intruder word** — Newsreader italic 500 in magenta at headline size. Zero intruders reads as plain Swiss; two reads as indecision.
- **Every headline may carry one cyan grotesque word** — Archivo 800 in cyan (e.g. the payoff verb). The cyan word and the magenta intruder must be different words.
- **Accent spans are runtime token styling, never hardcoded words** — the headline is a single text source; JS wraps the 3rd word (magenta intruder) and the last word (cyan payoff) at render time. English `The Hidden Cost of Rushing to Ship` resolves to intruder `Cost` + payoff `Ship`; Korean `서두른 출시의 숨은 비용` resolves to intruder `숨은` + payoff `비용`. The title sets `word-break: keep-all` so CJK wraps only at spaces.
- **Every subtitle opens with magenta slashes** — `///` in Archivo 900 magenta before the sentence. Bare subtitles are not permitted.
- **Every kicker pairs magenta /// slashes with tracked caps** — the slashes are the fuse, the caps are the label.
- **Every rotated kicker is imperative or indexical** — `READ THE FAILURE LOG ▸▸▸`, never a noun phrase; 45°, black with magenta tail.
- **Every rotated kicker keeps ≥190px clearance** from the headline column (headline max 1210px, kicker origin x=1540) — headline/kicker collision is never shipped.
- **Every ghost numeral is the sample count** — cropped outline 560px magenta stroke at 65% opacity, bleeding off-canvas right/bottom.

### Defaults

- **Default size for a cover title**: `{typography.poster-shout}` (104px Archivo 800, 1.02 line-height, -0.02em).
- **Default size for the intruder word**: same 104px box in Newsreader italic 500 magenta.
- **Default size for a cover subtitle**: `{typography.deck-sub}` (34px Archivo 700, 1.4 line-height, max 22em).
- **Default size for masthead caps**: 24px Archivo 700 at +0.14em; kicker 28px at +0.24em; rotated kicker 30px; context 24px.
- **Default headline color**: black with magenta intruder + cyan payoff word; default subtitle: black with magenta slashes.

When unsure which face to reach for, default to Archivo — Newsreader appears by invitation only, one word per cover.

### Typography Principles

The voice contrast is **shout ↔ whisper-of-a-hostage-note**: Archivo yells from the wall, Newsreader italic slips one elegant word into the ransom. Case is tactical — masthead/kicker/lines/footer in tracked caps, headline in mixed case (the intruder needs lowercase curves to clash against), subtitle in sentence case bold. Italic exists exactly once (the intruder); a second italic would domesticate it.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The cover is a clamped poster: 76px ruled masthead on top, 120px ruled footer at bottom, a 1290px left text column on the 90px rail between them, and the static zone (ghost, rotated kicker) owning the right third. The stage background is white; letterbox bars outside are black — verify the white ground edge reads in screenshots.

The ghost numeral and rotated kicker live in the static zone only, never over the text column.

### Slash Geometry

Slash energy resolves to **glyphs plus one fixed angle**: /// runs (black, magenta, cyan) slash through kickers and dividers, and the rotated kicker holds exactly 45°. Off-angle rotated type is a defect — the punk read depends on the clash between the 45° sticker and the orthogonal grid.

### Persistent Chrome

Three elements appear on every cover:

- **Masthead line** — 76px tracked-caps line over a 4px rule: magenta `TYPODECK` + `RESEARCH` left, cyan date + case count right.
- **Footer line** — 120px tracked-caps line under a 4px rule: magenta giant numeral + warning caps left, page mark right.
- **Slash divider** — black/magenta/cyan /// runs separating headline from subtitle.

### Curated Overload

New Wave Static has no atmospheric layer — no grain, no vignette, no ambient motion. Its "atmosphere" is compositional overload: slashes, ghost, sticker, rules, and kickers colliding inside a strict rail-and-clamp frame. Removing any one static element is permitted; removing two leaves a plain Swiss slide that fails the genre.

## Depth and Elevation

### Overlap as Depth (Signature)

Depth in this system is **collage overlap**: the ghost numeral sits behind everything, the rotated kicker floats above the ghost, the text column shouts from the rail, and the rules clamp top and bottom. Z-order is the only elevation cue — ghost (back) → text column → sticker → rules (front). No shadows mediate these overlaps; hard abutment is the aesthetic.

### Outline Giants as Air

The 560px outline numeral creates depth by **scale contrast**, not blur: a half-off-canvas stroke-only giant reads as far-behind-poster while the solid 104px headline reads as pasted-on-front. The 65% opacity sells the distance. Filling the ghost solid would collapse the depth and deafen the headline.

### Neon Glyphs as Pops

The rotated kicker, context marker, and slash runs pop forward through **full-saturation neon** against the white ground — magenta and cyan type at high weight, no fills behind them. Neon on white adds lift without any glow effect.

### No-Shadow, No-Box Rule

`box-shadow`, `text-shadow` (except the ghost's structural stroke), blur, gradients, bands, bars, and chips are banned. The ghost uses `-webkit-text-stroke`, which is an outline, not a shadow. Depth is overlap order and scale contrast only.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no bands, chips, bars, or filled shapes. The rotated sticker kicker's 45° rotation already signals "pasted" without needing corners at all. A rounded element would read as app-UI against the wheat-paste poster register.

### Border Weights

- **4px solid** — masthead and footer clamp rules (`{rules.masthead-rule}`, `{rules.footer-rule}`). The only drawn strokes in the system.
- **6px stroke** — ghost-numeral outline (`-webkit-text-stroke`), magenta at 65% opacity.
- **/// ▸ glyphs** — slash runs and markers set as text in black/magenta/cyan, never drawn bars.

Strokes and glyphs are always solid and flat — never dashed, never outlined-twice, never gradient-filled, never box edges.

### Decorative Element Types

**Masthead line** — Tracked-caps top clamp with magenta word + cyan date telemetry over a 4px rule. The poster's header strip; appears on every cover.

**Ghost numeral** — 560px cropped outline giant of the sample count, magenta 6px stroke at 65%, bleeding off-canvas. The poster's depth anchor.

**Rotated kicker** — 45° black imperative caps with magenta ▸▸▸ crowding the margin. The pasted-on voice.

**Slash divider** — Black/magenta/cyan /// runs discharging into neon. The headline/subtitle separator.

**Context line** — Bold sign-off line led by a magenta ▸ marker. The sign-off sticker, without the sticker.

**Footer line** — 44px magenta giant + warning caps beside the page mark under a 4px rule. The poster's bottom strip.

**Kicker slashes** — Magenta /// run fusing into tracked caps. The headline's fuse.

## Do's and Don'ts

### Do

- Clamp every cover with the ruled masthead (76px) and footer (120px) type lines — they are the poster's frame.
- Set headlines flush-left in 104px Archivo 800 on the 90px rail with exactly one magenta Newsreader intruder word.
- Slash kickers and dividers with neon /// runs (black, magenta, cyan) on every cover.
- Crop the 560px outline ghost numeral off the right/bottom edges at 65% opacity behind the sticker.
- Paste the 45° rotated black/magenta imperative kicker into the right margin.
- Separate headline from subtitle with the slash divider (black + magenta + cyan /// runs).
- Open every subtitle with magenta `///` slashes and close the column with the marked context line.
- Keep the palette at four flats — white, black, magenta, cyan — with no tints, gradients, or boxes.

### Don't

- Don't center type or balance the composition — flush-left rails and right-margin static are the layout law.
- Don't add shadows, glows, blurs, or gradients — depth is overlap and scale contrast only.
- Don't add bands, bars, chips, or filled shapes — slashes and markers are glyphs, clamps are rules.
- Don't use a second Newsreader word or use Newsreader outside the headline — the one-word monopoly is structural.
- Don't rotate type off-angle — 45° for the sticker kicker, nothing else.
- Don't let cyan carry small text on white — cyan is for strokes, tails, and display words (contrast).
- Don't add a third typeface, a third neon, or bullets — the vocabulary is closed and loud.
- Don't fill the ghost numeral solid — stroke-only at 65% is what keeps it behind the headline.
- Don't tidy the static zone into alignment — the ghost and sticker collide on purpose.

## Responsive Behavior

New Wave Static is a **fixed-stage system** built for 1920×1080 with absolute pixel sizing — 104px shout, 560px ghost, 76/120px ruled clamps. There are no breakpoints and no fluid type; the stage scaler handles all viewport adaptation with a uniform transform.

### Scaling Behavior

- The whole stage scales uniformly via `__typodeckFitStage`; the 45° sticker angle (being a transform) holds exactly at every viewport.
- At phone widths the stage letterboxes — the poster reads as a scaled flyer, which suits the genre.
- Slash runs, ghost stroke, and clamp rules scale with the stage (they are inside it), preserving the voltage at every size.

### Component Breakpoints

None. The 1290px text column, sticker position, and ghost crop are fixed coordinates. If a future multi-slide extension needs narrower layouts, it must define new coordinates explicitly rather than reflowing these.

### Presenter Behavior

- Covers are static posters: no entrance animation is specified beyond the standard stage transition.
- No element vibrates, flickers, or scrolls despite the "static" name — the noise is compositional, not kinetic. `prefers-reduced-motion` is satisfied by default.

### Animation Triggers

None. Any future jitter or flicker animation must respect `prefers-reduced-motion` and complete within 800ms so screenshots capture end state.

### Print Behavior

The system prints as a flat static frame: magenta/cyan print at full saturation (warn on uncalibrated printers — neons shift), black rules print solid, ghost stroke holds at 6px. No `@media print` overrides are defined; export captures the stage at 1920×1080.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for a heavy gothic CJK face with a Song-style intruder, and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Shout / lines / sticker / ghost | Archivo 700–900 | Noto Sans SC 700–900 |
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
- **Letter-spacing**: set to 0 on every CJK run. The -0.02em display tightening and +0.10–0.24em caps tracking look broken on square CJK glyphs; keep Latin tracking only on pure-Latin runs (masthead, page mark).
- **Text transform**: never apply `uppercase` to CJK runs; CJK has no case.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: omit the period on cover-scale CJK titles.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin/digits, e.g. `11 个复盘`.
- **Intruder stays one word**: the Song intruder keeps its one-word monopoly in CJK builds — pick the semantic pivot of the translated headline.
- **Word-break**: the headline sets `word-break: keep-all` so CJK line breaks fall only at spaces, never mid-word.

### Aesthetic Notes for This System

The punk register transfers well because it rests on **structural** voltage: slash runs, ruled clamps, ghost numeral, and rotated sticker all work in any script. Noto Sans SC 900 has genuine poster heft, and the Song intruder in magenta reproduces the high/low clash honestly (upright Song italics would be synthetic — never oblique CJK). Keep the `///` subtitle slashes and the ghost numeral Latin digits even in CJK builds.

### Known CJK Gap

- **No CJK italic exists.** Newsreader italic's slanted elegance has no CJK equivalent — the Song intruder is upright by necessity, trading slant-clash for style-clash. The magenta color + Song letterforms must carry the intrusion alone.
- **Tracked caps lines collapse.** The +0.14–0.24em line tracking that makes Latin clamps feel engineered must drop to 0 for CJK; keep Latin lines (masthead, page mark) in Archivo to preserve at least two tracked elements.

## Iteration Guide

1. Any new cover clamps the poster with the 76px ruled masthead and 120px ruled footer — clamps first, content second.
2. Any new headline uses 104px Archivo 800 flush-left on the 90px rail with exactly one magenta Newsreader intruder + one cyan payoff word.
3. Any new subtitle is 34px Archivo 700 opened by magenta `///` slashes, followed by the marked context line.
4. Any new kicker pairs magenta /// slashes with 28px tracked caps; any new margin sticker is a 45° black/magenta imperative kicker.
5. Any new cover crops the 560px ghost numeral off-canvas at 65% and slashes kickers/dividers with neon /// runs.
6. Any new divider is the slash divider (black + magenta + cyan /// runs) — never drawn bars or centered ornaments.
7. Any new measurement follows the clamp/column rhythm (76/120px clamps, 1290px column, 90px rail); nothing rounds, nothing centers, nothing boxes.
8. Any new color must be one of the four flats — no tints, no gradients, no third neon.
9. New covers stay flat and static: no boxes, no shadows, no glows, no blur, no animation — depth is overlap + scale contrast.
10. CJK builds swap to Noto Sans/Serif SC per the CJK section, zero tracking on CJK runs, Song intruder keeps the monopoly.

## Known Gaps

- **Fonts**: Archivo / Newsreader via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `Georgia, serif`. No font files committed. Offline rendering falls back to system stacks and loses the shout/intruder contrast.
- **Ghost numeral uses `-webkit-text-stroke`** (6px magenta) with transparent fill — supported in Chrome/Edge/Safari/Firefox, but stroke rendering varies subtly by engine; verify in screenshots.
- **Ghost digits stay Latin** (`11`) even in CJK builds by design — CJK numerals at 560px outline were judged less legible in testing.
- **Rotated kicker clearance rule (absolute, 45°):** the headline column caps at 1210px and the kicker origin sits at x=1540 — ≥190px of air between them at cover scale. The kicker's right-edge bleed is intentional; on LONG-title variants verify the render and shift the kicker origin down (never left into the text column) if the headline reaches it.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in system |
| 2 | Blend modes | None used | full | N/A — no blends in system |
| 3 | Animation / keyframes | None used | full | N/A — static poster |
| 4 | Pixel / hard offset shadows | None used (type overlaps only) | full | N/A — type exports natively |
| 5 | Gradients | None used | full | N/A — no gradients in system |
| 6 | Grain / scanline / noise overlays | None used | full | N/A — no overlays |
| 7 | Transparency layers | Ghost numeral at 65% opacity | partial | Ghost at 65% transparency shape fill, or solid at 70% tint |
| 8 | Custom fonts | Archivo + Newsreader via CDN | partial | Embedded fonts or Arial Black/Georgia substitution |
| 9 | Absolute-positioned decor | Ghost, sticker kicker (positioned type) | partial | Native text boxes in place |
