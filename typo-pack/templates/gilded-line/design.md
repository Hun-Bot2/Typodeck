---
version: alpha
name: Gilded Line
description: A symmetrical art-deco cover in black lacquer, champagne, and gold. Cinzel's inscriptional capitals carry display type while Jost carries an italic subtitle; a centered champagne panel with double gold rules inverts the dark ground, crowned by a fan of teal rays and punctuated by diamond glyph dividers. Every element is mirrored about the vertical axis — bilateral symmetry is the compositional law.

colors:
  lacquer-black: "#0F0E0C"
  champagne: "#F5EFE0"
  gold: "#D4AF37"
  deep-gold: "#8C6D2B"
  deco-teal: "#1F4E5F"
  warm-gray: "#3D3830"

shadows:
  panel-lift: "none"
  gold-keyline: "inset 0 0 0 1px #D4AF37"
  lacquer-edge: "inset 0 0 0 1px rgba(212,175,55,0.35)"

typography:
  deco-display:
    fontFamily: "'Cinzel', 'Arial Black', sans-serif"
    fontSize: 68px
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: 0.04em
  deco-subtitle:
    fontFamily: "'Jost', system-ui, sans-serif"
    fontSize: 31px
    fontWeight: 400
    lineHeight: 1.5
  deco-kicker:
    fontFamily: "'Cinzel', 'Arial Black', sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.25em
  deco-context:
    fontFamily: "'Cinzel', 'Arial Black', sans-serif"
    fontSize: 23px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.25em
  deco-colophon:
    fontFamily: "'Cinzel', 'Arial Black', sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.3em
  divider-glyph:
    fontFamily: "'Jost', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.4em

spacing:
  frame-outer: 26px
  frame-inner: 38px
  corner-diamond: 26px
  panel-width: 1230px
  panel-pad: "66px 110px 54px 110px"
  panel-border: 3px
  outline-offset: 9px
  rule-gap: 24px
  side-inset: 130px

canvas:
  width: 1920px
  height: 1080px

components:
  lacquer-frame:
    outer: "2px solid {colors.gold} at 26px inset"
    inner: "1px solid rgba(212,175,55,0.65) at 38px inset"
    description: "Double gold keyline framing the black ground, with rotated-diamond corners at each vertex."
  corner-diamond:
    size: 26px
    border: "2px solid {colors.gold}"
    background: "{colors.lacquer-black}"
    description: "Square rotated 45deg capping each frame corner; reads as a set diamond."
  champagne-panel:
    background: "{colors.champagne}"
    border: "3px solid {colors.gold}"
    outline: "1px solid {colors.gold} offset 9px"
    description: "Centered illuminated panel carrying all type; the ground inversion is the cover's central gesture."
  fan-crest:
    rays: 7
    color: "{colors.deco-teal} with central {colors.gold}"
    description: "Seven rising rays (38/25/12/0deg fan) crowning the panel like a sunrise crest."
  diamond-rule:
    rule: "2px {colors.gold}, 220px arms"
    glyph: "◆/◇ 20px"
    description: "Gold hairline split by a centered diamond glyph; thin variant uses 150px 1px arms."
  side-ornament:
    inset: 130px
    line: "2px gradient-faded {colors.gold}, 300px"
    description: "Mirrored vertical ornament: diamond, faded gold line, hollow diamond, faded line, diamond."
  colophon:
    fontSize: 20px
    letterSpacing: 0.3em
    description: "Footer issue stamp (№ 11 · ANNO MMXXVI) in tracked Cinzel with a teal diamond separator."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Gilded Line is a **symmetrical art-deco cover** — the title slide behaves like a 1920s title card glimpsed across a dark lobby: black lacquer ground, a centered champagne panel glowing inside double gold rules, mirrored ornaments standing guard on both flanks. The composition has exactly one axis (vertical center) and everything — type, rules, diamonds, rays — submits to it.

The type contract is two faces. **Cinzel** (400–700, always tracked capitals) is the inscriptional voice: kicker, headline, context, colophon. Its Roman capitals are what make the panel read as engraved rather than printed. **Jost** (400, italic for the subtitle) is the warm modernist counterweight — a single italic sentence that keeps the ceremony from freezing over. Cinzel shouts in stone; Jost speaks in the room.

The palette is **lacquer, champagne, and gold**, with teal in a strictly ceremonial supporting role. Black lacquer (`{colors.lacquer-black}`) is the ground; champagne (`{colors.champagne}`) is the illuminated panel; gold (`{colors.gold}`) draws every frame, rule, and diamond. Teal (`{colors.deco-teal}`) appears only in the fan crest, kicker, and context line — small cool accents that make the gold read warmer by contrast.

**Density philosophy: restrained opulence.** The panel holds six elements (fan, kicker, rule, headline, subtitle, context, colophon) and nothing else; the lacquer ground around it holds only the frame and the two mirrored ornaments. Emptiness is part of the luxury — every added element must justify breaking the silence.

**Key Characteristics:**
- Double-rule gold frames at two scales — outer lacquer frame with rotated-diamond corners plus champagne panel with outline-offset inner rule.
- Fan-line header of seven rising rays (six teal, one central gold) crowns every cover like a sunrise crest.
- Diamond glyph dividers (◆ ◇) split gold hairlines instead of dots, dashes, or bullets.
- Strict bilateral symmetry — mirrored side ornaments, centered type, mirrored rules; nothing sits off-axis.
- Footer colophon stamps the issue mark (№ 11 · ANNO MMXXVI) as tracked Cinzel capitals.
- Champagne panel inverts the ground so the headline reads as an illuminated inscription on dark lacquer.
- Teal appears only in ceremonial micro-roles (fan, kicker, context) — never as ground, never as headline.
- Zero shadows, zero blur — richness comes from metallic color relationships and hairline precision.

## Colors

### Palette

- **Lacquer Black** (`{colors.lacquer-black}` — `#0F0E0C`): The ground. Warm-biased near-black that reads as polished lacquer under the gold frame, not as void.
- **Champagne** (`{colors.champagne}` — `#F5EFE0`): The illuminated panel. Warm ivory that carries all cover type; the single largest light area.
- **Gold** (`{colors.gold}` — `#D4AF37`): The drawing color — frames, rules, diamonds, panel border, central fan ray. Every line on the slide is gold.
- **Deep Gold** (`{colors.deep-gold}` — `#8C6D2B`): Gold's readable shade — divider glyphs and colophon text on champagne, where full gold would fail contrast.
- **Deco Teal** (`{colors.deco-teal}` — `#1F4E5F`): Ceremonial accent — six fan rays, kicker, context line, colophon diamond. Small doses only.
- **Warm Gray** (`{colors.warm-gray}` — `#3D3830`): Subtitle ink on champagne — softer than lacquer, warmer than neutral gray.

### Defaults

- **Default surface background**: `{colors.lacquer-black}` flat with the double gold keyline frame.
- **Default panel background**: `{colors.champagne}` with the 3px gold border + 9px-offset 1px outline.
- **Default headline color**: lacquer-black on champagne (`{typography.deco-display}`).
- **Default subtitle color**: `{colors.warm-gray}`, Jost italic.
- **Default kicker/context color**: `{colors.deco-teal}` in tracked Cinzel.
- **Default rule/diamond color**: `{colors.gold}` for rules, `{colors.deep-gold}` for glyphs on champagne, gold for glyphs on lacquer.
- **Default colophon color**: deep-gold with a teal diamond separator.

When a cover needs to feel warmer, deepen the champagne toward `#F0E6D2` — never warm the lacquer, which must stay near-black for the gold to sing.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Cinzel** is the inscriptional voice — used for the kicker, headline (700), context line, and colophon (all 400 except the headline). Always capitals, always tracked (+0.04em on headlines up to +0.30em on the colophon). Cinzel's classical proportions are what make the cover feel engraved; substituting a geometric sans collapses the deco register into generic minimalism.

**Jost** is the humanist voice — used for the subtitle (400 italic) and the divider-glyph spacing context. Futura-descended but warmer, it keeps one foot in modernism so the cover reads as revival rather than pastiche.

Never use Jost for display capitals and never use Cinzel for sentence-case prose. The stone/inscription versus voice/prose boundary is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.deco-display}` | 68px | Cinzel | 700 | Cover headline on champagne |
| `{typography.deco-subtitle}` | 31px | Jost italic | 400 | Cover subtitle |
| `{typography.deco-kicker}` | 24px | Cinzel | 400 | Panel kicker with diamond guards |
| `{typography.deco-context}` | 23px | Cinzel | 400 | Context line under the thin rule |
| `{typography.deco-colophon}` | 20px | Cinzel | 400 | Footer issue stamp |
| `{typography.divider-glyph}` | 20px | Jost | 400 | Diamond glyphs splitting rules |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every Cinzel string is tracked capitals** — +0.04em minimum on headlines, +0.25em on kicker/context, +0.30em on the colophon. Untracked Cinzel reads as a wedding invitation, not a title card.
- **Every kicker is diamond-guarded** — `◆ POSTMORTEM DOSSIER ◆` with the diamonds in matching teal, never bare.
- **Kicker and context never repeat the same string.** The kicker names the dossier or finding; the context line alone carries the source attribution — no doubled source lines on one panel.
- **Every subtitle is Jost italic** — the single italic sentence on the cover; roman subtitles are not permitted.
- **Every headline sits between two rules** — the full diamond-rule above (220px arms) and the thin diamond-rule below (150px arms) framing the inscription.
- **Every colophon carries the issue mark** — `№ 11 ◆ ANNO MMXXVI` in 20px tracked Cinzel with a teal diamond separator.
- **Every centered line uses text-indent compensation** — `text-indent` equal to the letter-spacing so tracked capitals center optically, not mathematically.

### Defaults

- **Default size for a cover title**: `{typography.deco-display}` (68px Cinzel 700, 1.22 line-height).
- **Default size for a cover subtitle**: `{typography.deco-subtitle}` (31px Jost italic, 1.5 line-height, max 24em).
- **Default size for kicker/context**: 23–24px Cinzel at +0.25em tracking.
- **Default size for the colophon**: 20px Cinzel at +0.30em tracking.
- **Default headline color**: lacquer-black; default subtitle: warm-gray; default kicker/context: deco-teal.

When unsure which face to reach for, ask whether the string is inscription (names, titles, dates, marks — Cinzel) or utterance (the one explanatory sentence — Jost italic).

### Typography Principles

The voice contrast is **inscription ↔ utterance**: Cinzel engraves, Jost speaks. Capitals belong to stone; sentence case belongs to voice. Italic exists exactly once (the subtitle) — a second italic anywhere would dilute the subtitle's warmth monopoly. Letterspacing widens as size shrinks (headline +0.04em → colophon +0.30em) so small capitals keep their airy monumentality.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The cover is a centered stack: lacquer ground with the double gold frame (26px/38px insets, diamond corners), mirrored side ornaments at 130px insets, and the 1230px champagne panel centered both axes (max-height 940px, 66/110/54px padding). All type centers; the panel is the only content container.

The stage background is lacquer-black; letterbox bars outside the stage are pure black, which merges with the lacquer at the frame edge — verify screenshots that the gold frame still reads against the bars.

### Symmetry Law

Every measurement is mirrored about the vertical center axis. Side ornaments sit at equal 130px insets; rules extend equal arms (220px/150px); the fan spreads symmetric rotation pairs (±38°/±25°/±12°/0°); tracked capitals carry text-indent compensation for optical centering. An off-axis element is a defect, not a variation — this system has no asymmetric mode.

### Persistent Chrome

Three elements appear on every cover:

- **Lacquer frame** — double gold keyline (2px at 26px, 1px at 38px) with rotated-diamond corners.
- **Side ornaments** — mirrored diamond/line/diamond stacks at left/right 130px insets.
- **Colophon** — the issue stamp (`№ 11 ◆ ANNO MMXXVI`) closing the panel.

### Ceremonial Restraint

Gilded Line has no atmospheric layer — no grain, no vignette, no ambient animation. Richness comes from metallic color relationships (gold on lacquer, teal against champagne) and hairline precision. The one permitted glow is the champagne panel itself, which reads as illuminated purely by value contrast against the lacquer.

## Depth and Elevation

### Inversion as Elevation (Signature)

Depth in this system is **value inversion**: the champagne panel floats on the lacquer ground the way a lit window floats on a night facade. No shadow is drawn — the 3px gold border + 9px-offset outline draws the edge, and the 90% value step does the lifting. Adding a drop shadow would soil the lacquer; the panel must look inlaid, not pasted.

### Keylines as Edges

The double frames (lacquer frame, panel outline-offset) are **engraved edges**, not drop effects. The 9px outline offset on the panel creates a champagne moat between two gold lines — the signature "gilded line" the system is named for. Both lines must hold at all scales; if the offset collapses, the panel reads as merely bordered.

### Fan Crest as Apex

The seven-ray fan is the compositional high point — it rises above the kicker like a pediment. Its six teal rays plus central gold ray create a small color-depth cue (warm center advancing, cool flanks receding) without any blur or gradient mesh.

### No-Shadow Rule

`box-shadow` is banned outright. The keyline tokens (`{shadows.gold-keyline}`, `{shadows.lacquer-edge}`) are 1px structural edges. Depth is inversion, keylines, and metallic color temperature only.

## Shapes and Treatment

### Border Radius

Absolute zero. Frames, panel, rays, rules, and ornaments are all rectilinear. The only curves on the slide are the letterforms themselves (Cinzel's classical rounds, Jost's geometric circles) and the diamond glyphs' implicit rotation. A rounded rectangle anywhere would read as contemporary-soft against the 1920s geometry.

### Border Weights

- **1px solid** — inner lacquer keyline (65% gold), thin diamond-rule arms, panel outline-offset.
- **2px solid** — outer lacquer keyline, corner diamonds, full diamond-rule arms, side-ornament lines.
- **3px solid** — champagne panel border, fan rays (4px on the central gold ray).
- **26px diamonds** — rotated-square frame corners; 20px ◆/◇ divider glyphs.

Lines are always solid gold (or teal for fan/kicker accents) — never dashed, never dotted, never black on champagne except the headline letterforms.

### Decorative Element Types

**Lacquer frame** — Double gold keyline on the black ground with rotated-diamond corners. The system's proscenium; appears on every cover.

**Champagne panel** — Centered illuminated container with 3px gold border + 9px-offset outline. Holds all cover type.

**Fan crest** — Seven rising rays (symmetric ±38/±25/±12/0 fan, teal with gold center) crowning the panel. The sunrise pediment.

**Diamond rule** — Gold hairline split by a centered ◆/◇ glyph; full variant (220px 2px arms) above the headline, thin variant (150px 1px arms) above the context.

**Side ornament** — Mirrored vertical stack (diamond / faded gold line / hollow diamond / faded line / diamond) at 130px insets. The flanking guard.

**Corner diamond** — 26px lacquer square with 2px gold border rotated 45°, capping each frame vertex.

**Colophon** — Footer issue stamp in tracked Cinzel with teal diamond separator. The printer's mark.

## Do's and Don'ts

### Do

- Center and mirror everything about the vertical axis — symmetry is the compositional law, not a preference.
- Use Cinzel tracked capitals for inscription (kicker, headline, context, colophon) and Jost italic for the single subtitle sentence — exclusively.
- Frame the lacquer ground twice (2px at 26px, 1px at 38px) and cap the corners with rotated diamonds.
- Invert the ground with the champagne panel (3px gold border + 9px-offset outline) so the headline reads as illuminated.
- Crown the panel with the seven-ray fan (six teal, one central gold) and split rules with ◆/◇ glyphs.
- Compensate tracked-capitals centering with matching text-indent so lines center optically.
- Stamp the colophon issue mark (№ 11 · ANNO MMXXVI) to close every cover.
- Keep teal in ceremonial micro-roles only — fan, kicker, context, colophon diamond.

### Don't

- Don't place anything off-axis — asymmetric accents, left-aligned type, or unbalanced ornaments fail review.
- Don't add shadows, blurs, gradients (beyond the ornament fade), or textures — richness is metallic color + hairline precision.
- Don't round any rectangle — the geometry is strictly 1920s rectilinear.
- Don't use Cinzel for sentence prose or Jost for display capitals — the inscription/utterance boundary is structural.
- Don't use untracked Cinzel — small capitals especially need +0.25em or more to hold monumentality.
- Don't expand teal beyond its micro-roles — a teal ground or teal headline breaks the gold-on-black glamour.
- Don't add a third typeface, a fourth hue, bullets, or numbered lists on the cover — the ornament vocabulary is closed.
- Don't crowd the lacquer — the ground holds only frame and side ornaments; silence is part of the luxury.
- Don't substitute round bullets or dashes for the diamond glyphs — ◆/◇ are the only dividers.
- Don't let the champagne panel touch the lacquer frame — the black moat between them is load-bearing.

## Responsive Behavior

Gilded Line is a **fixed-stage system** built for 1920×1080 with absolute pixel sizing — 68px display, 1230px panel, 26px/38px frame insets. There are no breakpoints and no fluid type; the stage scaler handles all viewport adaptation with a uniform transform.

### Scaling Behavior

- The whole stage scales uniformly via `__typodeckFitStage`; symmetry and centering are preserved exactly at every viewport.
- At phone widths the stage letterboxes — the gold frame must remain visible against the black bars (verify in screenshots).
- Frame insets, rule arms, and ray angles scale with the stage (they are inside it), so the ornament proportions hold at every size.

### Component Breakpoints

None. The panel width, frame insets, and side-ornament positions are fixed. If a future multi-slide extension needs narrower layouts, it must define new panel metrics explicitly rather than reflowing these.

### Presenter Behavior

- Covers are static tableaux: no entrance animation is specified beyond the standard stage transition.
- No element pulses, shimmers, or twinkles — metallic effects are color relationships, not motion. `prefers-reduced-motion` is satisfied by default.

### Animation Triggers

None. Any future shimmer or ray-rise animation must respect `prefers-reduced-motion` and complete within 800ms so screenshots capture end state.

### Print Behavior

The system prints as a flat static frame: lacquer ground prints near-black (heavy ink — warn on draft printers), champagne prints warm ivory, gold prints flat (no metallic ink simulation). Hairlines hold at 1px. No `@media print` overrides are defined; export captures the stage at 1920×1080.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for a Song/Ming serif pairing with a clean sans for the subtitle, and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Inscription / headline / kicker / colophon | Cinzel 400–700 | Noto Serif SC 600–900 |
| Subtitle / utterance | Jost 400 italic | Noto Sans SC 400 |

### Mixed-Content Strategy

**Strategy A** — two CJK families mirroring the Latin inscription/utterance split. Set display strings to `font-family: 'Noto Serif SC', serif` and the subtitle to `font-family: 'Noto Sans SC', sans-serif`. The Song-style serif carries the engraved monumentality; the sans carries the single warm sentence. Latin fragments (e.g. `11`, `MMXXVI`) keep their Latin faces via fallback order.

### Loading

Add to the cover's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&family=Noto+Serif+SC:wght@600;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15–20% from the Latin spec. Headline 1.4–1.5 (up from 1.22), subtitle 1.7–1.8 (up from 1.5).
- **Letter-spacing**: set to 0 on every CJK run. The +0.04em–0.30em Cinzel tracking looks broken on square CJK glyphs; keep Latin tracking only on pure-Latin runs (e.g. the colophon numerals).
- **Text transform**: never apply `uppercase` to CJK runs; CJK has no case. Kicker diamonds stay, tracking goes.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: omit the period on cover-scale CJK titles.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin/digits, e.g. `11 个复盘`.
- **Colophon**: keep `№ 11 ◆ ANNO MMXXVI` in Latin Cinzel even in CJK builds — the issue stamp is a fixed mark.

### Aesthetic Notes for This System

The deco register survives CJK transfer well: Noto Serif SC's Song-style verticals echo Cinzel's inscriptional gravity, and the symmetry law, gold frames, fan crest, and diamond glyphs — all non-typographic — carry the glamour regardless of script. The biggest loss is tracked-capitals airiness; compensate by widening rule arms slightly and letting the panel breathe. Keep the subtitle in regular (non-italic) Noto Sans SC — CJK italics are synthetic obliques and would cheapen the panel.

### Known CJK Gap

- **No CJK face matches Cinzel's Roman inscriptionality.** Noto Serif SC gives engraved weight but through Song rather than Roman letterforms — the cultural register shifts from 1920s Paris to a Sino-deco hybrid. The frames and fan must anchor the deco read.
- **Tracked micro-caps collapse.** The colophon's +0.30em airiness cannot transfer to CJK; keep the colophon Latin as specified.

## Iteration Guide

1. Any new cover centers a champagne panel on the lacquer ground inside the double gold frame with diamond corners — the proscenium is non-optional.
2. Any new headline uses Cinzel 700 at 68px tracked capitals in lacquer-black, framed by the full diamond-rule above and the thin rule below.
3. Any new subtitle is exactly one Jost italic sentence in warm-gray — never roman, never two sentences.
4. Any new kicker/context/colophon uses tracked Cinzel (0.25–0.30em) in teal or deep-gold with optical centering compensation.
5. Any new divider is a diamond-rule (gold arms + ◆/◇ glyph) — never bare rules, bullets, or dashes.
6. Any new ornament mirrors about the vertical axis — side guards, fan rays, corner diamonds all come in symmetric pairs.
7. Any new measurement follows the frame/panel rhythm (26/38px insets, 220/150px rule arms, 9px outline offset); nothing is rounded.
8. Any new color must be one of the six palette entries with teal confined to micro-roles — no new hues.
9. New covers stay flat and static: no shadows, no blur, no animation — depth is inversion and keylines only.
10. CJK builds swap to Noto Serif/Sans SC per the CJK section, zero tracking on CJK runs, Latin colophon preserved.
11. Long titles auto-fit: the `__gdFitTitle` script shrinks the 68px headline in 2px steps (floor 36px) only while the panel exceeds 940px — PRIMARY covers never trigger it.

## Known Gaps

- **Fonts**: Cinzel / Jost via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the inscriptional voice.
- **Side-ornament lines use linear-gradient fades** (transparent → gold → transparent) — the sole gradient in the system; flat 2px gold lines are the approved simplification.
- **Diamond glyphs (◆ ◇ №) depend on system glyph coverage** — on minimal font stacks they may render from a fallback face with slightly different metrics.
- **Corner diamonds are CSS-rotated squares** positioned over the frame vertices — sub-pixel seams can appear at some scale factors; verify in screenshots.
- **Outline-offset panel rule has no IE11-era support path** — irrelevant for modern Chrome capture but noted for legacy export.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in system |
| 2 | Blend modes | None used | full | N/A — no blends in system |
| 3 | Animation / keyframes | None used | full | N/A — static tableau |
| 4 | Pixel / hard offset shadows | None used (keylines only) | full | N/A — borders export natively |
| 5 | Gradients | Linear fade on side-ornament lines only | partial | Flat 2px gold lines |
| 6 | Grain / scanline / noise overlays | None used | full | N/A — no overlays |
| 7 | Transparency layers | 65% gold inner keyline (rgba) | partial | Opaque gold at 1px, or 80% tint fill |
| 8 | Custom fonts | Cinzel + Jost via CDN | partial | Embedded fonts or Times New Roman/Calibri substitution |
| 9 | Absolute-positioned decor | Frame, corners, side ornaments, fan (positioned divs) | partial | Grouped native shapes + line connectors |
