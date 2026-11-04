---
version: alpha
name: Night Reel
description: A noir cinematic presentation system that composes every slide as a shot inside CinemaScope letterbox bars. Towering Bebas Neue condensed caps anchor a low-third title block over a spotlight vignette fading to pure black, with featherweight Inter for dialogue lines and exactly one blood-red accent per slide — the title rule — as the single saturated beat.

colors:
  black: "#000000"
  white: "#F5F5F5"
  blood-red: "#C1121F"
  smoke: "#8A8A8A"
  dialogue: "#C9C9C9"
  bar-line: "#2A2A2A"
  reel-dim: "#3D3D3D"
  spotlight: "#161616"

shadows:
  none-flat: "none"
  title-halo: "0 0 120px rgba(245, 245, 245, 0.06)"
  red-glow-soft: "0 0 24px rgba(193, 18, 31, 0.35)"

typography:
  credit-title:
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    fontSize: 196px
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: 0.015em
    textTransform: uppercase
  section-title:
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    fontSize: 120px
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: 0.015em
    textTransform: uppercase
  dialogue:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 44px
    fontWeight: 300
    lineHeight: 1.35
  body-light:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 300
    lineHeight: 1.5
  kicker:
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.5em
    textTransform: uppercase
  bar-brand:
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    fontSize: 34px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.42em
    textTransform: uppercase
  context-line:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0.08em
  scene-count:
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    fontSize: 34px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.3em

spacing:
  bar-top-height: 148px
  bar-bottom-height: 132px
  frame-pad-x: 96px
  frame-pad-bottom: 64px
  red-rule: "132px 8px"
  kicker-gap: 22px
  title-dialogue-gap: 30px
  rule-kicker-gap: 34px

canvas:
  width: 1920px
  height: 1080px

components:
  letterbox-top:
    height: 148px
    borderBottom: "1px solid {colors.bar-line}"
    description: "Top letterbox bar: smoke brand left, near-invisible reel marker right."
  letterbox-bottom:
    height: 132px
    borderTop: "1px solid {colors.bar-line}"
    description: "Bottom letterbox bar: light context line left, dim scene count right."
  spotlight-frame:
    background: "radial-gradient(ellipse 90% 75% at 50% 42%, {colors.spotlight} 0%, #0A0A0A 52%, {colors.black} 78%)"
    description: "Near-black radial glow behind the low third, vignetting to pure black at the frame edges."
  red-rule:
    width: 132px
    height: 8px
    background: "{colors.blood-red}"
    description: "The single red accent: a short heavy rule opening the low-third block. One per slide."
  low-third:
    anchor: bottom
    description: "Bottom-anchored title stack: red rule, tracked kicker, condensed caps title, one dialogue line."
  kicker:
    color: "{colors.smoke}"
    fontSize: 40px
    letterSpacing: 0.5em
    textTransform: uppercase
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    description: "Widely tracked smoke kicker — the quiet line before the title lands."
  scene-count:
    color: "{colors.reel-dim}"
    fontSize: 34px
    letterSpacing: 0.3em
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    description: "Near-invisible reel marker in the bars — present for rhythm, never for reading."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Night Reel is a **noir cinematic presentation system**. Its foundational premise is the **frame**: every slide is a shot composed inside letterbox bars, and every element obeys credit-sequence hierarchy — condensed caps for display, light grotesque for dialogue, smoke gray for metadata.

The type stack is two voices in deliberate tension. **Bebas Neue** is the display face — a tall, narrow, single-weight condensed sans that carries titles, kickers, and bar metadata in uppercase. Its caps-only rhythm is what makes the system read as film credits rather than slides. **Inter at weight 300** is the dialogue face — featherweight grotesque for subtitles, body lines, and the context line, always sentence case, always quiet against the towering caps.

The palette is near-monochrome: **pure black ground, off-white titles, smoke metadata**, and exactly one saturated beat — a **blood-red rule** opening the low-third block. The red is budgeted like a plot point: one per slide, never repeated in text, charts, or chrome. The surface rhythm is darkness with one light: a radial spotlight glow behind the title that vignettes to pure black, overlaid with a 1%-opacity scanline-grade shimmer.

**Density philosophy: low, held, bottom-weighted.** At least half of every frame stays empty black above the low-third block. A typical title shot carries one red rule, one kicker, one title, and one dialogue line — four elements, then darkness. Dense evidence shots (cue stacks, stat blocks, two-take comparisons) may stack to six low-third elements with the title stepped to 104px, then 88px. Crowding the frame past that ceiling destroys the cinematic hush; when content grows beyond it, it paginates to the next shot instead.

**Key Characteristics:**
- CinemaScope letterbox bars top and bottom with hairline inner rules, carrying only brand metadata and a scene count.
- Low-third title block: red rule, tracked kicker, towering Bebas caps title, single light-weight dialogue line.
- Exactly one blood-red accent per slide; everything else stays black, white, or smoke.
- Spotlight vignette ground fading to pure black, plus a faint 1% scanline-grade shimmer.
- Credit-sequence type hierarchy: condensed caps display, Inter light dialogue, near-invisible reel metadata.
- Vast negative space above the title — the empty black is part of the composition.

## Colors

### Palette

- **Black** (`{colors.black}` — `#000000`): The only ground — bars, frame, and letterbox shell all pure black.
- **White** (`{colors.white}` — `#F5F5F5`): Title caps only. Slightly softened so caps on black don't glare.
- **Blood Red** (`{colors.blood-red}` — `#C1121F`): The single accent — the low-third rule. Never text, never chrome, never repeated.
- **Smoke** (`{colors.smoke}` — `#8A8A8A`): Kickers, bar brand, context line — the mid metadata voice.
- **Dialogue** (`{colors.dialogue}` — `#C9C9C9`): Subtitle and body lines — brighter than smoke, dimmer than titles.
- **Bar Line** (`{colors.bar-line}` — `#2A2A2A`): Hairline inner rules separating the bars from the frame.
- **Reel Dim** (`{colors.reel-dim}` — `#3D3D3D`): Near-invisible reel markers and scene counts in the bars.
- **Spotlight** (`{colors.spotlight}` — `#161616`): Core of the radial glow behind the title block.

### Defaults

- **Default surface background**: `{colors.black}` with the spotlight gradient in the frame region.
- **Default headline color**: `{colors.white}` in Bebas caps.
- **Default body color**: `{colors.dialogue}` in Inter light.
- **Default metadata color**: `{colors.smoke}` for readable metadata, `{colors.reel-dim}` for rhythmic markers.
- **Default accent**: `{colors.blood-red}`, exactly once per slide as the low-third rule.

## Typography

### Font Family

The system runs two faces in strict credit-sequence roles.

**Bebas Neue** is the display face — a tall condensed sans available in a single weight, used for titles, kickers, the bar brand, and scene counts. Everything in Bebas is uppercase with generous tracking (0.3–0.5em on small lines, hairline 0.015em on giant titles). Bebas never carries sentences — it announces.

**Inter (300/400)** is the dialogue face — used at light weights for subtitles, body lines, and the context line. Inter is always sentence case with near-zero tracking; it speaks quietly beneath the towering caps.

Caps sentences in Inter or sentence-case titles in Bebas both break the credit hierarchy.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.credit-title}` | 196px | Bebas Neue | 400 | Cover title, caps, 0.94 line-height |
| `{typography.section-title}` | 120px | Bebas Neue | 400 | Inner-section title |
| `{typography.dialogue}` | 44px | Inter | 300 | Cover subtitle / dialogue line |
| `{typography.body-light}` | 32px | Inter | 300 | Body lines on dark |
| `{typography.kicker}` | 40px | Bebas Neue | 400 | Tracked smoke kicker above titles |
| `{typography.bar-brand}` | 34px | Bebas Neue | 400 | Top-bar brand + reel marker |
| `{typography.context-line}` | 30px | Inter | 300 | Bottom-bar context line |
| `{typography.scene-count}` | 34px | Bebas Neue | 400 | Bottom-bar scene count |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title is Bebas caps at 0.94–0.96 line-height.** The tight leading is the credit look; looser leading turns caps into a poster. Long titles shrink via the fit routine (196px toward a 56px floor in 4px steps) — never letterspaced tighter to fit.
- **Every kicker is smoke Bebas at 0.5em tracking.** The extreme tracking against the tight title leading is the system's core contrast.
- **Every dialogue line is Inter 300 sentence case.** Never uppercase, never tracked beyond 0.08em, never heavier than 400.
- **Every bar metadata line is Bebas with 0.3em+ tracking** in smoke or reel-dim — present for frame rhythm, dim enough to ignore.
- **Every low-third block opens with the red rule.** No title appears without its red beat; no slide carries a second one.
- **Every title keeps hairline positive tracking (0.015em).** Bebas is dense — zero tracking crowds the caps, wide tracking dissolves them.
- **Every context line stays Inter light at 0.08em.** It reads once, then recedes into the bottom bar.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** composed as three horizontal bands: a 148px top letterbox bar, a flexible frame region carrying the spotlight and the bottom-anchored low-third block, and a 132px bottom letterbox bar. The low third holds four stacked elements on title shots (rule, kicker, title, dialogue) with 22–34px gaps; dense evidence shots may stack to six (rule, kicker, title or stat block, up to three cue/stat/take rows); everything above is empty black.

Frame padding is `0 96px 64px`; bar padding is `0 96px`. The dialogue line caps at 1400px measure so it never runs the full frame width. The title box caps at 470px height with hidden overflow, guarded by the fit routine.

### Persistent Chrome

The letterbox bars are the persistent chrome:

- **Top bar** — brand marker left in smoke Bebas, reel marker right in near-invisible reel-dim. Both derive from real deck content (research brand, corpus size).
- **Bottom bar** — context line left in light Inter, scene count right in dim Bebas. The count is the deck's page number, styled as a scene marker.

No navigation, no progress, no logos — the bars frame; they never decorate.

## Depth and Elevation

Night Reel builds depth **optically, not with shadows**. The spotlight radial gradient lifts the title zone out of the black, and the 1% scanline shimmer adds a film-grade grain that keeps large black fields from reading as dead pixels. Text carries no shadow in the base treatment; the halo and red-glow tokens exist only as APL-safe accents for export contexts where pure flat caps lose presence — and even there they stay under 8% effective luminance lift.

Any hard offset shadow, bevel, or card lift breaks the cinematic flatness. If an element needs separation on black, dim its neighbors instead of lifting it.

## Shapes and Treatment

### Border Radius

Zero everywhere. Bars, frame, rule, and any future panels are all square-cut. The red rule is a hard 132×8 rectangle; rounding it would turn a censor bar into a pill and collapse the noir severity.

### Border Weights

- **1px bar-line rules** — the inner hairlines separating letterbox bars from the frame. The only rules in the system.
- **8px red rule** — the low-third accent bar at 132px wide. Heavy, short, unmissable.
- No other borders exist: no card outlines, no dividers inside the low third, no framed panels.

### Decorative Element Types

**Letterbox bars** — The 148px/132px black bands with hairline inner rules. The system's frame and primary identity; every slide carries both.

**Low-third block** — The bottom-anchored title stack: red rule, smoke kicker, caps title, dialogue line. The only content module on a title slide.

**Red rule** — The 132×8 blood-red bar. One per slide, always opening the low third, never reused as underline, bullet, or chart accent.

**Spotlight vignette** — The radial near-black glow (spotlight core → pure black) behind the title zone. Motivates the title's presence in the dark.

**Scanline-grade shimmer** — A 1%-opacity horizontal stripe overlay across the frame. Subliminal film grain; visible only in that its absence reads as digital flatness.

**Reel markers** — Near-invisible Bebas metadata in the bars (corpus size, scene count). Rhythmic texture for the frame edges.

**Cue stack** — The list device for text-heavy shots: up to three cue rows beneath the title, each pairing a Bebas 34px 0.3em smoke cue label (`01`, `02`, `03`) with an Inter 300 32px dialogue-color line. 18px gaps between rows; cue labels are never red, never white.

**Stat block** — The evidence device: stacked rows of Bebas 104px white figures, each followed 12px below by an Inter 300 28px smoke label. 24px gaps between rows, at most three rows per shot. Figures speak in the display caps voice; labels stay quiet smoke.

**Two-take stack** — The comparison device: two takes stacked sequentially (never side by side), each opened by a Bebas 34px 0.3em smoke sub-kicker with one dialogue line beneath, separated by 48px of empty black. Spacing is the only separator — no divider, no second red, no panels.

**Title-less low third** — On evidence shots only, the title line may be omitted when the figures are the subject: red rule + kicker + stat block, nothing else. Every other shot carries a title.

## Do's and Don'ts

### Do

- Keep both letterbox bars on every slide with their hairline inner rules and dim metadata.
- Anchor the title block to the bottom of the frame and leave at least half the frame empty black.
- Open every low third with the single red rule — and budget exactly one red element per slide.
- Set titles in Bebas caps at 0.94 leading and dialogue in Inter 300 sentence case.
- Let the spotlight vignette and 1% shimmer carry all atmospheric depth; keep text flat.
- Dim neighbors instead of lifting elements when separation is needed on black.
- Shrink long titles with the fit routine toward the 56px floor; never tighten tracking to fit.
- Stack dense evidence as cue, stat, or take rows under a 104px title; omit the title only when figures are the subject.

### Don't

- Don't add a second red element — no red text, red bullets, red chart series, or red chrome.
- Don't center titles or float them mid-frame; the low third is the only title position.
- Don't set sentences in Bebas or display lines in Inter — caps announce, light grotesque speaks.
- Don't widen title leading past 1.0 or track titles beyond 0.03em; the dense caps stack is the look.
- Don't introduce gray panels, cards, or bordered boxes on the frame — content floats on black.
- Don't raise the shimmer past 2% opacity or add visible grain, noise, or starfields.
- Don't crowd the frame past six low-third elements on dense evidence shots (four on title shots); content beyond the ceiling paginates to the next shot.

## Responsive Behavior

Night Reel is a **fixed-stage system**: all sizes above are 1920×1080 stage coordinates scaled uniformly by one transform. There are no breakpoints and no viewport-fluid rules in generated output.

Long titles are handled by the fit routine (shrink 196px toward a 56px floor in 4px steps until the 470px title box stops overflowing). The low-third stack never reflows: if title plus dialogue exceed the frame, the title shrinks first, and the dialogue line wraps to a second line within its 1400px measure.

For source-history reference only: the proportions derive from a CinemaScope credit sequence and would narrow the bars and stack the low third tighter below 900px in a fluid context, but generated decks never reflow — they letterbox.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for an equivalent Chinese pairing and apply universal CJK adjustments. All recommended Chinese fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Display / kickers / bar metadata | Bebas Neue (condensed caps) | 思源黑体 Noto Sans SC 900 |
| Dialogue / body / context | Inter 300–400 | 思源黑体 Noto Sans SC 300–400 |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin coverage, differentiated by weight. Set every text element to `'Noto Sans SC', sans-serif`: titles at 900, kickers and bar lines at 500, dialogue at 300–400. The condensed-caps voice cannot survive translation (no condensed Chinese grotesque exists on the CDN), so weight contrast plus the letterbox frame and red rule carry the cinematic identity instead.

### Loading

Add to the slide `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–25% from the Latin spec. Dialogue 1.5–1.6, display 1.1–1.2 (up from 0.94 — square glyphs at credit leading collide).
- **Letter-spacing**: set to 0 on every CJK run. The 0.3–0.5em Bebas tracking and 0.015em title tracking both break on square glyphs.
- **Text transform**: don't apply `uppercase` to Chinese text. CJK titles render without transform at weight 900.
- **Punctuation**: use full-width Chinese punctuation （，。：；！？「」（））.
- **No period on display headlines**: omit trailing 。 on display-scale headlines.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin or digits.
- **Title scale**: CJK titles read larger than Bebas at the same size — start the fit routine at 150px instead of 196px for CJK builds.
- **Korean word wrap (D23 fix)**: the title and dialogue carry `word-break: keep-all; overflow-wrap: normal` so breaks fall only at spaces (no orphan syllable), and the fit routine applies `text-wrap: balance` only when the title contains Hangul — the Korean two-liner wraps "서두른 출시의" / "숨은 비용" (D27-style) while Latin titles keep their authored breaks. No measure change was needed: the balanced two-liner clears the subtitle inside the 470px title box.

### Aesthetic Notes for This System

The noir voice in a CJK build lives entirely in the non-typographic elements: the letterbox bars, the low-third position, the spotlight vignette, and the single red rule. Lean on them harder — widen the bars by 10–15% if the translated title feels small, and keep the red rule at full 132×8 presence since it becomes the primary brand mark once the Bebas voice is gone. Keep reel markers and scene counts in Latin Bebas ("01", corpus numerals) — they read as timecode and preserve the frame-edge rhythm.

### Known CJK Gap

- **No condensed Chinese display face.** Bebas's tall narrow caps are the system's voice and have no CJK counterpart; weight-900 grotesque gives gravity but loses the credit-sequence silhouette.
- **Extreme tracking collapses.** The 0.5em kicker tracking that airs out the Latin low third must be zeroed; compensate with smaller kicker sizes (32px) and wider element gaps.

## Iteration Guide

1. Any new slide keeps both letterbox bars with hairline inner rules and dim bar metadata. Don't restyle or drop the bars.
2. Any new display element uses Bebas caps; any new sentence uses Inter light. Never cross the roles.
3. Any new title anchors to the low third beneath the red rule and kicker — never centered, never top-aligned.
4. Any new accent is the single red rule. Don't add red text, red bullets, or a second red shape anywhere.
5. Any new frame keeps the spotlight vignette and 1% shimmer; don't add grain, noise, or visible texture.
6. Any new metadata in the bars uses dim Bebas (0.3em+) or light Inter — present for rhythm, never demanding reading.
7. Any new content beyond the low-third ceiling (four elements on title shots, six on dense evidence shots) paginates to the next shot; don't shrink the empty black.
8. Any new emphasis on black comes from dimming neighbors, never from shadows, lifts, or panels.
9. Long titles shrink via the fit routine toward the 56px floor; never tighten tracking or widen leading to fit.
10. Animated builds (if any) fade the low third up once; the bars and spotlight never animate.
11. Any new list uses the cue-stack device: Bebas cue labels with Inter dialogue rows, at most three rows.
12. Any new evidence figure uses the stat-block device: Bebas 104px white figures with smoke labels, at most three rows.
13. Any new comparison uses the two-take stack: sequential takes under smoke sub-kickers, 48px of black between, no divider.
14. Any new dense evidence shot may stack to six low-third elements with the title stepped to 104px (then 88px); the 56px floor stays overflow-only, and anything past six elements paginates.
15. Any new low third keeps its title except on evidence shots, where kicker plus stat block may stand alone beneath the red rule.

## Known Gaps

- **Fonts**: Bebas Neue / Inter via Google Fonts CDN (`display=swap`); fallbacks "Arial Black", sans-serif / system-ui, sans-serif. No font files committed. Offline rendering falls back to system stacks and loses the condensed-credit voice.
- **Title fit needs JS.** The shrink-to-fit routine runs on DOMContentLoaded, font-ready, and load plus delayed passes at 800/2000ms for late `display=swap` swaps; without JS, very long titles can overflow the 470px title box. Static export must bake the fitted size.
- **Single-weight display.** Bebas ships one weight; all display hierarchy must come from size, tracking, and color — there is no bold Bebas for extra emphasis.
- **Near-black gradients band on cheap panels.** The spotlight vignette can show banding on 6-bit displays; the 1% shimmer partially dithers it.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in this design |
| 2 | Blend modes | None used | full | N/A — no blend modes |
| 3 | Animation / keyframes | None used (static credit frame) | full | N/A — static export is native |
| 4 | Pixel / hard offset shadows | None used (flat caps on black) | full | N/A — no shadows |
| 5 | Gradients | Radial spotlight vignette behind title | partial | Nearest radial gradient; on flat-only exporters, solid #0A0A0A frame fill |
| 6 | Grain / scanline / noise overlays | 1% repeating-linear shimmer overlay | none | Dropped on export (subliminal at 1%; absence is acceptable) |
| 7 | Transparency layers | Spotlight alpha ramp only | partial | Opaque gradient stops approximating the ramp |
| 8 | Custom fonts | Bebas Neue + Inter via Google Fonts CDN | partial | Embed both faces if licensed; else Arial Narrow Bold + Calibri Light substitution |
| 9 | Absolute-positioned decor | Shimmer overlay is absolute inset-0 | none | Dropped with the shimmer; layout is in-flow flexbox otherwise |
