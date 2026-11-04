---
version: alpha
name: Night Reel
description: A noir cinematic presentation system that composes every slide as a shot inside CinemaScope letterbox zones. Towering Bebas Neue condensed caps anchor a low-third title block on solid black, with featherweight Inter for dialogue lines and exactly one blood-red accent per slide — the kicker line — as the single saturated beat. Typography-only register: no rules, bars-as-boxes, vignettes, or shimmer exist — hierarchy is carried by position, scale, tracking, and the single red line alone.

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
    description: "Top letterbox zone on the black ground: smoke brand left, near-invisible reel marker right. No hairlines."
  letterbox-bottom:
    height: 132px
    description: "Bottom letterbox zone on the black ground: light context line left, dim scene count right. No hairlines."
  red-kicker:
    color: "{colors.blood-red}"
    fontSize: 40px
    letterSpacing: 0.5em
    textTransform: uppercase
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    description: "The single red accent: a widely tracked blood-red kicker opening the low-third block. One per slide."
  low-third:
    anchor: bottom
    description: "Bottom-anchored title stack: red kicker, condensed caps title, one dialogue line."
  kicker:
    color: "{colors.blood-red}"
    fontSize: 40px
    letterSpacing: 0.5em
    textTransform: uppercase
    fontFamily: "'Bebas Neue', 'Arial Black', sans-serif"
    description: "Widely tracked blood-red kicker — the single saturated line before the title lands."
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

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and low-third collisions.

## Overview

Night Reel is a **noir cinematic presentation system**. Its foundational premise is the **frame**: every slide is a shot composed inside letterbox bars, and every element obeys credit-sequence hierarchy — condensed caps for display, light grotesque for dialogue, smoke gray for metadata.

The type stack is two voices in deliberate tension. **Bebas Neue** is the display face — a tall, narrow, single-weight condensed sans that carries titles, kickers, and bar metadata in uppercase. Its caps-only rhythm is what makes the system read as film credits rather than slides. **Inter at weight 300** is the dialogue face — featherweight grotesque for subtitles, body lines, and the context line, always sentence case, always quiet against the towering caps.

The palette is near-monochrome: **pure black ground, off-white titles, smoke metadata**, and exactly one saturated beat — a **blood-red kicker** opening the low-third block. The red is budgeted like a plot point: one line per slide, never repeated in titles, dialogue, or chrome. The surface rhythm is pure darkness: a solid black ground with no vignette, no shimmer, no gradients.

**Density philosophy: low, held, bottom-weighted.** At least half of every frame stays empty black above the low-third block. A typical title shot carries one red kicker, one title, and one dialogue line — three elements, then darkness. Dense evidence shots (cue stacks, stat blocks, two-take comparisons) may stack to six low-third elements with the title stepped to 104px, then 88px. Crowding the frame past that ceiling destroys the cinematic hush; when content grows beyond it, it paginates to the next shot instead.

**Key Characteristics:**
- CinemaScope letterbox zones top and bottom with no hairlines, carrying only brand metadata and a scene count.
- Low-third title block: red kicker, towering Bebas caps title, single light-weight dialogue line.
- Exactly one blood-red line per slide; everything else stays black, white, or smoke.
- Solid black ground — no vignette, no shimmer, no gradients.
- Credit-sequence type hierarchy: condensed caps display, Inter light dialogue, near-invisible reel metadata.
- Vast negative space above the title — the empty black is part of the composition.

## Colors

### Palette

- **Black** (`{colors.black}` — `#000000`): The only ground — bars, frame, and letterbox shell all pure black.
- **White** (`{colors.white}` — `#F5F5F5`): Title caps only. Slightly softened so caps on black don't glare.
- **Blood Red** (`{colors.blood-red}` — `#C1121F`): The single accent — the low-third kicker line at 40px tracked Bebas. Never titles, never dialogue, never chrome, never repeated.
- **Smoke** (`{colors.smoke}` — `#8A8A8A`): Bar brand, context line, stat labels — the mid metadata voice.
- **Dialogue** (`{colors.dialogue}` — `#C9C9C9`): Subtitle and body lines — brighter than smoke, dimmer than titles.
- **Bar Line** (`{colors.bar-line}` — `#2A2A2A`): Retained token; no visible role in the typography-only register.
- **Reel Dim** (`{colors.reel-dim}` — `#3D3D3D`): Near-invisible reel markers and scene counts in the bars.
- **Spotlight** (`{colors.spotlight}` — `#161616`): Retained token; no visible role in the typography-only register.

### Defaults

- **Default surface background**: `{colors.black}` solid. No vignette, no shimmer, no gradients.
- **Default headline color**: `{colors.white}` in Bebas caps.
- **Default body color**: `{colors.dialogue}` in Inter light.
- **Default metadata color**: `{colors.smoke}` for readable metadata, `{colors.reel-dim}` for rhythmic markers.
- **Default accent**: `{colors.blood-red}`, exactly once per slide as the low-third kicker line.

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
| `{typography.kicker}` | 40px | Bebas Neue | 400 | Tracked blood-red kicker above titles |
| `{typography.bar-brand}` | 34px | Bebas Neue | 400 | Top-bar brand + reel marker |
| `{typography.context-line}` | 30px | Inter | 300 | Bottom-bar context line |
| `{typography.scene-count}` | 34px | Bebas Neue | 400 | Bottom-bar scene count |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every title is Bebas caps at 0.94–0.96 line-height.** The tight leading is the credit look; looser leading turns caps into a poster. Long titles shrink via the fit routine (196px toward a 56px floor in 4px steps) — never letterspaced tighter to fit.
- **Every kicker is blood-red Bebas at 0.5em tracking.** The extreme tracking against the tight title leading is the system's core contrast; the red is the slide's single saturated beat.
- **Every dialogue line is Inter 300 sentence case.** Never uppercase, never tracked beyond 0.08em, never heavier than 400.
- **Every bar metadata line is Bebas with 0.3em+ tracking** in smoke or reel-dim — present for frame rhythm, dim enough to ignore.
- **Every low-third block opens with the red kicker.** No title appears without its red beat; no slide carries a second red element.
- **Every title keeps hairline positive tracking (0.015em).** Bebas is dense — zero tracking crowds the caps, wide tracking dissolves them.
- **Every context line stays Inter light at 0.08em.** It reads once, then recedes into the bottom bar.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** composed as three horizontal zones on solid black: a 148px top letterbox zone, a flexible frame region carrying the bottom-anchored low-third block, and a 132px bottom letterbox zone. The low third holds three stacked elements on title shots (red kicker, title, dialogue) with 22–34px gaps; dense evidence shots may stack to six (red kicker, title or stat block, up to three cue/stat/take rows); everything above is empty black.

Frame padding is `0 96px 64px`; bar padding is `0 96px`. The dialogue line caps at 1400px measure so it never runs the full frame width. The title box caps at 470px height with hidden overflow, guarded by the fit routine.

### Persistent Chrome

The letterbox bars are the persistent chrome:

- **Top bar** — brand marker left in smoke Bebas, reel marker right in near-invisible reel-dim. Both derive from real deck content (research brand, corpus size).
- **Bottom bar** — context line left in light Inter, scene count right in dim Bebas. The count is the deck's page number, styled as a scene marker.

No navigation, no progress, no logos — the bars frame; they never decorate.

## Depth and Elevation

Night Reel builds depth **positionally, not optically**. The ground is solid black; hierarchy comes from the low-third anchor, scale contrast, tracking, and the single red kicker. Text carries no shadow; the halo and red-glow tokens are retained but unrendered outside export fallbacks.

Any gradient, vignette, shimmer, hard offset shadow, bevel, or card lift breaks the cinematic flatness. If an element needs separation on black, dim its neighbors instead of lifting it.

## Shapes and Treatment

### Border Radius

There is nothing to round: no bars-as-boxes, rules, panels, or vignettes exist in the typography-only register. Type on solid black is square-cut by nature; any rounded shape would collapse the noir severity.

### Border Weights

Borders do not exist. There are no bar hairlines, accent bars, card outlines, dividers, or framed panels. Position and the single red kicker are the only structural signals.

### Decorative Element Types

**Letterbox zones** — The 148px/132px black bands with no hairlines. The system's frame and primary identity; every slide carries both.

**Low-third block** — The bottom-anchored title stack: red kicker, caps title, dialogue line. The only content module on a title slide.

**Red kicker** — The blood-red tracked Bebas line. One per slide, always opening the low third, never reused as underline, bullet, or chart accent.

**Reel markers** — Near-invisible Bebas metadata in the bars (corpus size, scene count). Rhythmic texture for the frame edges.

**Cue stack** — The list device for text-heavy shots: up to three cue rows beneath the title, each pairing a Bebas 34px 0.3em smoke cue label (`01`, `02`, `03`) with an Inter 300 32px dialogue-color line. 18px gaps between rows; cue labels are never red, never white.

**Stat block** — The evidence device: stacked rows of Bebas 104px white figures, each followed 12px below by an Inter 300 28px smoke label. 24px gaps between rows, at most three rows per shot. Figures speak in the display caps voice; labels stay quiet smoke.

**Two-take stack** — The comparison device: two takes stacked sequentially (never side by side), each opened by a Bebas 34px 0.3em smoke sub-kicker with one dialogue line beneath, separated by 48px of empty black. Spacing is the only separator — no divider, no second red, no panels.

**Title-less low third** — On evidence shots only, the title line may be omitted when the figures are the subject: red kicker + stat block, nothing else. Every other shot carries a title.

## Do's and Don'ts

### Do

- Keep both letterbox zones on every slide with their dim metadata and no hairlines.
- Anchor the title block to the bottom of the frame and leave at least half the frame empty black.
- Open every low third with the single red kicker — and budget exactly one red element per slide.
- Set titles in Bebas caps at 0.94 leading and dialogue in Inter 300 sentence case.
- Keep the ground solid black and all text flat — no vignette, no shimmer, no gradients.
- Dim neighbors instead of lifting elements when separation is needed on black.
- Shrink long titles with the fit routine toward the 56px floor; never tighten tracking to fit.
- Stack dense evidence as cue, stat, or take rows under a 104px title; omit the title only when figures are the subject.

### Don't

- Don't add a second red element — the kicker line is the only red; no red titles, bullets, chart series, or chrome.
- Don't center titles or float them mid-frame; the low third is the only title position.
- Don't set sentences in Bebas or display lines in Inter — caps announce, light grotesque speaks.
- Don't widen title leading past 1.0 or track titles beyond 0.03em; the dense caps stack is the look.
- Don't introduce gray panels, cards, bordered boxes, rules, or vignettes on the frame — content floats on black.
- Don't add shimmer, grain, noise, or starfields at any opacity.
- Don't crowd the frame past six low-third elements on dense evidence shots (three on title shots); content beyond the ceiling paginates to the next shot.

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

**Strategy A** — single CJK family with built-in Latin coverage, differentiated by weight. Set every text element to `'Noto Sans SC', sans-serif`: titles at 900, kickers and bar lines at 500, dialogue at 300–400. The condensed-caps voice cannot survive translation (no condensed Chinese grotesque exists on the CDN), so weight contrast plus the letterbox zones and red kicker carry the cinematic identity instead.

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

The noir voice in a CJK build lives in the compositional elements: the letterbox zones, the low-third position, and the single red kicker. Lean on them harder — widen the zones by 10–15% if the translated title feels small, and keep the red kicker at full 40px tracked presence since it becomes the primary brand mark once the Bebas voice is gone. Keep reel markers and scene counts in Latin Bebas ("01", corpus numerals) — they read as timecode and preserve the frame-edge rhythm.

### Known CJK Gap

- **No condensed Chinese display face.** Bebas's tall narrow caps are the system's voice and have no CJK counterpart; weight-900 grotesque gives gravity but loses the credit-sequence silhouette.
- **Extreme tracking collapses.** The 0.5em kicker tracking that airs out the Latin low third must be zeroed; compensate with smaller kicker sizes (32px) and wider element gaps.

## Iteration Guide

1. Any new slide keeps both letterbox zones with dim bar metadata and no hairlines. Don't restyle or drop the zones.
2. Any new display element uses Bebas caps; any new sentence uses Inter light. Never cross the roles.
3. Any new title anchors to the low third beneath the red kicker — never centered, never top-aligned.
4. Any new accent is the single red kicker line. Don't add red titles, bullets, or a second red element anywhere.
5. Any new frame keeps the solid black ground; don't add vignettes, shimmer, grain, noise, or visible texture.
6. Any new metadata in the bars uses dim Bebas (0.3em+) or light Inter — present for rhythm, never demanding reading.
7. Any new content beyond the low-third ceiling (three elements on title shots, six on dense evidence shots) paginates to the next shot; don't shrink the empty black.
8. Any new emphasis on black comes from dimming neighbors, never from shadows, lifts, or panels.
9. Long titles shrink via the fit routine toward the 56px floor; never tighten tracking or widen leading to fit.
10. Animated builds (if any) fade the low third up once; the zones never animate.
11. Any new list uses the cue-stack device: Bebas cue labels with Inter dialogue rows, at most three rows.
12. Any new evidence figure uses the stat-block device: Bebas 104px white figures with smoke labels, at most three rows.
13. Any new comparison uses the two-take stack: sequential takes under smoke sub-kickers, 48px of black between, no divider.
14. Any new dense evidence shot may stack to six low-third elements with the title stepped to 104px (then 88px); the 56px floor stays overflow-only, and anything past six elements paginates.
15. Any new low third keeps its title except on evidence shots, where the red kicker plus stat block may stand alone.

## Known Gaps

- **Fonts**: Bebas Neue / Inter via Google Fonts CDN (`display=swap`); fallbacks "Arial Black", sans-serif / system-ui, sans-serif. No font files committed. Offline rendering falls back to system stacks and loses the condensed-credit voice.
- **Title fit needs JS.** The shrink-to-fit routine runs on DOMContentLoaded, font-ready, and load plus delayed passes at 800/2000ms for late `display=swap` swaps; without JS, very long titles can overflow the 470px title box. Static export must bake the fitted size.
- **Single-weight display.** Bebas ships one weight; all display hierarchy must come from size, tracking, and color — there is no bold Bebas for extra emphasis.
- **No vignette, shimmer, or gradients.** The typography-only register renders a solid black ground; the retained spotlight/shimmer tokens must not be reintroduced.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in this design |
| 2 | Blend modes | None used | full | N/A — no blend modes |
| 3 | Animation / keyframes | None used (static credit frame) | full | N/A — static export is native |
| 4 | Pixel / hard offset shadows | None used (flat caps on black) | full | N/A — no shadows |
| 5 | Gradients | Not used (solid black ground) | full | N/A — no gradients in this register |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A — no overlays in this register |
| 7 | Transparency layers | None used (all type opaque) | full | N/A |
| 8 | Custom fonts | Bebas Neue + Inter via Google Fonts CDN | partial | Embed both faces if licensed; else Arial Narrow Bold + Calibri Light substitution |
| 9 | Absolute-positioned decor | None — in-flow flexbox layout | full | Native shapes / text boxes 1:1 |
