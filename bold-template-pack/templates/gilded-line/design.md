---
version: alpha
name: Gilded Line
description: A symmetrical art-deco cover in black lacquer, champagne, and gold. Cinzel's inscriptional capitals carry display type while Jost carries an italic subtitle; champagne type on the dark ground is crowned by a diamond ornament line and punctuated by diamond glyph dividers. Every element is mirrored about the vertical axis — bilateral symmetry is the compositional law. Typography-only: no panels, frames, fans, or filled shapes.

colors:
  lacquer-black: "#0F0E0C"
  champagne: "#F5EFE0"
  champagne-dim: "#D8CFB8"
  gold: "#D4AF37"
  deep-gold: "#8C6D2B"
  deco-teal: "#1F4E5F"
  warm-gray: "#3D3830"

shadows:
  none-flat: "none"

rules:
  diamond-rule: "2px solid #D4AF37, 220px arms"
  diamond-rule-thin: "1px solid #D4AF37, 150px arms"

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
  column-width: 1230px
  column-pad: "40px 60px"
  rule-gap: 24px
  side-inset: 150px
  ornament-gap: 30px

canvas:
  width: 1920px
  height: 1080px

components:
  diamond-crest:
    glyphs: "◇ ◆ ◇"
    size: 26px
    tracking: 0.6em
    description: "Diamond ornament line crowning the column like a pediment; the sunrise crest rendered in glyphs."
  diamond-rule:
    rule: "2px {colors.gold}, 220px arms"
    glyph: "◆/◇ 20px"
    description: "Gold hairline split by a centered diamond glyph; thin variant uses 150px 1px arms."
  side-ornament:
    inset: 150px
    glyphs: "◆ ◇ ◆ ◇ ◆"
    description: "Mirrored vertical diamond stack: solid and hollow diamonds alternating, no lines."
  col-divider:
    glyphs: "◆ ◇ ◆"
    description: "Diamond stack separating comparison columns; replaces the former dividing bar."
  colophon:
    fontSize: 20px
    letterSpacing: 0.3em
    description: "Footer issue stamp (№ 11 · ANNO MMXXVI) in tracked Cinzel with a champagne diamond separator."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and rule overlap.


## Overview

Gilded Line is a **symmetrical art-deco cover** — the title slide behaves like a 1920s title card glimpsed across a dark lobby: black lacquer ground, champagne and gold inscription centered on axis, mirrored diamond ornaments standing guard on both flanks. The composition has exactly one axis (vertical center) and everything — type, rules, diamonds — submits to it.

The type contract is two faces. **Cinzel** (400–700, always tracked capitals) is the inscriptional voice: kicker, headline, context, colophon. Its Roman capitals are what make the cover read as engraved rather than printed. **Jost** (400, italic for the subtitle) is the warm modernist counterweight — a single italic sentence that keeps the ceremony from freezing over. Cinzel shouts in stone; Jost speaks in the room.

The palette is **lacquer, champagne, and gold**. Black lacquer (`{colors.lacquer-black}`) is the ground; champagne (`{colors.champagne}`) is the headline ink; gold (`{colors.gold}`) draws every rule and diamond and sets the kicker, context, and colophon. Deco teal is a reserved token, unused in the typography-only system (it cannot hold contrast on lacquer).

**Density philosophy: restrained opulence.** The column holds six elements (crest, kicker, rule, headline, subtitle, context, colophon) and nothing else; the lacquer ground around it holds only the two mirrored diamond ornaments. Emptiness is part of the luxury — every added element must justify breaking the silence.

**Key Characteristics:**
- Diamond ornament lines at two scales — the crowning crest plus mirrored side guards, all in glyphs.
- Diamond glyph dividers (◆ ◇) split gold hairlines instead of dots, dashes, or bullets.
- Strict bilateral symmetry — mirrored side ornaments, centered type, mirrored rules; nothing sits off-axis.
- Footer colophon stamps the issue mark (№ 11 · ANNO MMXXVI) as tracked Cinzel capitals.
- Champagne type on lacquer reads as an illuminated inscription; gold kickers and rules gild it.
- Zero boxes, zero shadows, zero blur — richness comes from metallic color relationships and hairline precision.

## Colors

### Palette

- **Lacquer Black** (`{colors.lacquer-black}` — `#0F0E0C`): The ground. Warm-biased near-black that reads as polished lacquer behind gold type, not as void.
- **Champagne** (`{colors.champagne}` — `#F5EFE0`): The headline ink. Warm ivory that carries display type on lacquer.
- **Champagne Dim** (`{colors.champagne-dim}` — `#D8CFB8`): Secondary ink — subtitle and supporting lines on lacquer.
- **Gold** (`{colors.gold}` — `#D4AF37`): The drawing color — rules, diamonds, kicker, context, colophon. Every line and accent on the slide is gold.
- **Deep Gold** (`{colors.deep-gold}` — `#8C6D2B`): Reserved shade for small gold text needing extra depth; unused in current covers.
- **Deco Teal** (`{colors.deco-teal}` — `#1F4E5F`): Reserved token, unused in the typography-only system — it cannot hold contrast on lacquer.
- **Warm Gray** (`{colors.warm-gray}` — `#3D3830`): Reserved token from the panel era, unused in the typography-only system.

### Defaults

- **Default surface background**: `{colors.lacquer-black}` flat, unframed.
- **Default headline color**: `{colors.champagne}` (`{typography.deco-display}`).
- **Default subtitle color**: `{colors.champagne-dim}`, Jost italic.
- **Default kicker/context color**: `{colors.gold}` in tracked Cinzel.
- **Default rule/diamond color**: `{colors.gold}` throughout.
- **Default colophon color**: gold with a champagne diamond separator.

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
| `{typography.deco-display}` | 68px | Cinzel | 700 | Cover headline on lacquer |
| `{typography.deco-subtitle}` | 31px | Jost italic | 400 | Cover subtitle |
| `{typography.deco-kicker}` | 24px | Cinzel | 400 | Kicker with diamond guards |
| `{typography.deco-context}` | 23px | Cinzel | 400 | Context line under the thin rule |
| `{typography.deco-colophon}` | 20px | Cinzel | 400 | Footer issue stamp |
| `{typography.divider-glyph}` | 20px | Jost | 400 | Diamond glyphs splitting rules |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every Cinzel string is tracked capitals** — +0.04em minimum on headlines, +0.25em on kicker/context, +0.30em on the colophon. Untracked Cinzel reads as a wedding invitation, not a title card.
- **Every kicker is diamond-guarded** — `◆ POSTMORTEM DOSSIER ◆` with the diamonds in matching gold, never bare.
- **Kicker and context never repeat the same string.** The kicker names the dossier or finding; the context line alone carries the source attribution — no doubled source lines on one cover.
- **Every subtitle is Jost italic** — the single italic sentence on the cover; roman subtitles are not permitted.
- **Every headline sits between two rules** — the full diamond-rule above (220px arms) and the thin diamond-rule below (150px arms) framing the inscription.
- **Every colophon carries the issue mark** — `№ 11 ◆ ANNO MMXXVI` in 20px tracked Cinzel with a champagne diamond separator.
- **Every centered line uses text-indent compensation** — `text-indent` equal to the letter-spacing so tracked capitals center optically, not mathematically.

### Defaults

- **Default size for a cover title**: `{typography.deco-display}` (68px Cinzel 700, 1.22 line-height).
- **Default size for a cover subtitle**: `{typography.deco-subtitle}` (31px Jost italic, 1.5 line-height, max 24em).
- **Default size for kicker/context**: 23–24px Cinzel at +0.25em tracking.
- **Default size for the colophon**: 20px Cinzel at +0.30em tracking.
- **Default headline color**: champagne; default subtitle: champagne-dim; default kicker/context: gold.

When unsure which face to reach for, ask whether the string is inscription (names, titles, dates, marks — Cinzel) or utterance (the one explanatory sentence — Jost italic).

### Typography Principles

The voice contrast is **inscription ↔ utterance**: Cinzel engraves, Jost speaks. Capitals belong to stone; sentence case belongs to voice. Italic exists exactly once (the subtitle) — a second italic anywhere would dilute the subtitle's warmth monopoly. Letterspacing widens as size shrinks (headline +0.04em → colophon +0.30em) so small capitals keep their airy monumentality.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The cover is a centered stack: lacquer ground, mirrored diamond side ornaments at 150px insets, and the 1230px type column centered both axes. All type centers; there is no content container — the column is an alignment, not a box.

The stage background is lacquer-black; letterbox bars outside the stage are pure black, which merges with the lacquer — verify screenshots that the gold inscription still reads against the dark.

### Symmetry Law

Every measurement is mirrored about the vertical center axis. Side ornaments sit at equal 150px insets; rules extend equal arms (220px/150px); the crest spreads a symmetric glyph trio (◇ ◆ ◇); tracked capitals carry text-indent compensation for optical centering. An off-axis element is a defect, not a variation — this system has no asymmetric mode.

### Persistent Chrome

Three elements appear on every cover:

- **Diamond crest** — the crowning glyph trio (◇ ◆ ◇) opening the column.
- **Side ornaments** — mirrored diamond stacks at left/right 150px insets.
- **Colophon** — the issue stamp (`№ 11 ◆ ANNO MMXXVI`) closing the column.

### Ceremonial Restraint

Gilded Line has no atmospheric layer — no grain, no vignette, no ambient animation. Richness comes from metallic color relationships (gold and champagne on lacquer) and hairline precision. The champagne inscription reads as illuminated purely by value contrast against the lacquer.

## Depth and Elevation

### Inscription as Presence (Signature)

Presence in this system is **value contrast**: champagne and gold letterforms float on the lacquer ground the way lit windows float on a night facade. No shadow is drawn, no panel is built — the 90% value step does the lifting. Adding a drop shadow or a panel would soil the lacquer; the type must look inlaid, not pasted.

### Rules as Edges

The diamond-rules are **engraved edges**, not drop effects. The full rule above the headline and the thin rule below it create the signature "gilded line" the system is named for: gold arms split by a centered diamond. Both rules must hold at all scales.

### Diamond Crest as Apex

The diamond crest is the compositional high point — it crowns the kicker like a pediment. Its hollow/solid/hollow trio (◇ ◆ ◇) creates a small depth cue (solid center advancing, hollow flanks receding) without any blur or gradient.

### No-Shadow, No-Box Rule

`box-shadow` is banned outright, and so are boxes: no panels, frames, fans, or filled shapes. The rule tokens (`{rules.diamond-rule}`, `{rules.diamond-rule-thin}`) are the only structural strokes. Depth is value contrast, rules, and metallic color temperature only.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no panels, frames, fans, or filled shapes. The only geometry on the slide is letterforms (Cinzel's classical rounds, Jost's geometric circles), diamond glyphs, and hairline rules. A rounded rectangle anywhere would read as contemporary-soft against the 1920s geometry.

### Border Weights

- **1px solid** — thin diamond-rule arms, list-item hairlines.
- **2px solid** — full diamond-rule arms.
- **26px / 20px diamonds** — ◆/◇ glyphs for the crest, dividers, and ornaments.

Lines are always solid gold — never dashed, never dotted, never box edges.

### Decorative Element Types

**Diamond crest** — Crowning glyph trio (◇ ◆ ◇) opening the column. The sunrise pediment; appears on every cover.

**Diamond rule** — Gold hairline split by a centered ◆/◇ glyph; full variant (220px 2px arms) above the headline, thin variant (150px 1px arms) above the context.

**Side ornament** — Mirrored vertical diamond stack (◆ ◇ ◆ ◇ ◆) at 150px insets. The flanking guard.

**Column divider** — Diamond trio (◆ ◇ ◆) separating comparison columns. The only vertical structure, made of glyphs.

**Colophon** — Footer issue stamp in tracked Cinzel with champagne diamond separator. The printer's mark.

## Do's and Don'ts

### Do

- Center and mirror everything about the vertical axis — symmetry is the compositional law, not a preference.
- Use Cinzel tracked capitals for inscription (kicker, headline, context, colophon) and Jost italic for the single subtitle sentence — exclusively.
- Set the headline in champagne on lacquer so it reads as an illuminated inscription.
- Crown the column with the diamond crest (◇ ◆ ◇) and split rules with ◆/◇ glyphs.
- Compensate tracked-capitals centering with matching text-indent so lines center optically.
- Stamp the colophon issue mark (№ 11 · ANNO MMXXVI) to close every cover.

### Don't

- Don't place anything off-axis — asymmetric accents, left-aligned type, or unbalanced ornaments fail review.
- Don't add boxes, shadows, blurs, gradients, or textures — richness is metallic color + hairline precision.
- Don't round any rectangle — the geometry is strictly 1920s rectilinear.
- Don't use Cinzel for sentence prose or Jost for display capitals — the inscription/utterance boundary is structural.
- Don't use untracked Cinzel — small capitals especially need +0.25em or more to hold monumentality.
- Don't add panels, frames, fans, or filled shapes — ornament lives in diamond glyphs and rules.
- Don't add a third typeface, a fourth hue, bullets, or numbered lists on the cover — the ornament vocabulary is closed.
- Don't crowd the lacquer — the ground holds only side ornaments; silence is part of the luxury.
- Don't substitute round bullets or dashes for the diamond glyphs — ◆/◇ are the only dividers.

## Responsive Behavior

Gilded Line is a **fixed-stage system** built for 1920×1080 with absolute pixel sizing — 68px display, 1230px column, 150px side-ornament insets. There are no breakpoints and no fluid type; the stage scaler handles all viewport adaptation with a uniform transform.

### Scaling Behavior

- The whole stage scales uniformly via `__typodeckFitStage`; symmetry and centering are preserved exactly at every viewport.
- At phone widths the stage letterboxes — the gold inscription must remain legible against the black bars (verify in screenshots).
- Column width, rule arms, and ornament insets scale with the stage (they are inside it), so the ornament proportions hold at every size.

### Component Breakpoints

None. The column width, rule arms, and side-ornament positions are fixed. If a future multi-slide extension needs narrower layouts, it must define new column metrics explicitly rather than reflowing these.

### Presenter Behavior

- Covers are static tableaux: no entrance animation is specified beyond the standard stage transition.
- No element pulses, shimmers, or twinkles — metallic effects are color relationships, not motion. `prefers-reduced-motion` is satisfied by default.

### Animation Triggers

None. Any future shimmer animation must respect `prefers-reduced-motion` and complete within 800ms so screenshots capture end state.

### Print Behavior

The system prints as a flat static frame: lacquer ground prints near-black (heavy ink — warn on draft printers), champagne type prints warm ivory, gold prints flat (no metallic ink simulation). Hairlines hold at 1px. No `@media print` overrides are defined; export captures the stage at 1920×1080.

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

The deco register survives CJK transfer well: Noto Serif SC's Song-style verticals echo Cinzel's inscriptional gravity, and the symmetry law, diamond crest, and diamond glyphs carry the glamour regardless of script. The biggest loss is tracked-capitals airiness; compensate by widening rule arms slightly and letting the column breathe. Keep the subtitle in regular (non-italic) Noto Sans SC — CJK italics are synthetic obliques and would cheapen the inscription.

### Known CJK Gap

- **No CJK face matches Cinzel's Roman inscriptionality.** Noto Serif SC gives engraved weight but through Song rather than Roman letterforms — the cultural register shifts from 1920s Paris to a Sino-deco hybrid. The diamond crest and rules must anchor the deco read.
- **Tracked micro-caps collapse.** The colophon's +0.30em airiness cannot transfer to CJK; keep the colophon Latin as specified.

## Iteration Guide

1. Any new cover centers a champagne-and-gold inscription column on the lacquer ground between mirrored diamond ornaments — the symmetry is non-optional.
2. Any new headline uses Cinzel 700 at 68px tracked capitals in champagne, framed by the full diamond-rule above and the thin rule below.
3. Any new subtitle is exactly one Jost italic sentence in champagne-dim — never roman, never two sentences.
4. Any new kicker/context/colophon uses tracked Cinzel (0.25–0.30em) in gold with optical centering compensation.
5. Any new divider is a diamond-rule (gold arms + ◆/◇ glyph) — never bare rules, bullets, or dashes.
6. Any new ornament mirrors about the vertical axis — side guards and crest glyphs all come in symmetric pairs.
7. Any new measurement follows the column rhythm (1230px column, 220/150px rule arms, 150px ornament insets); nothing is boxed.
8. Any new color must be lacquer, champagne, champagne-dim, or gold — teal, deep-gold, and warm-gray are reserved, not for covers.
9. New covers stay flat and static: no boxes, no shadows, no blur, no animation — depth is value contrast and rules only.
10. CJK builds swap to Noto Serif/Sans SC per the CJK section, zero tracking on CJK runs, Latin colophon preserved.
11. Long titles auto-fit: the `__gdFitTitle` script shrinks the 68px headline in 2px steps (floor 36px) only while the column exceeds 980px — PRIMARY covers never trigger it.

## Known Gaps

- **Fonts**: Cinzel / Jost via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the inscriptional voice.
- **Diamond glyphs (◆ ◇ №) depend on system glyph coverage** — on minimal font stacks they may render from a fallback face with slightly different metrics.
- **Deco teal, deep-gold, and warm-gray are reserved tokens** carried over from the panel era; current covers use only lacquer, champagne, champagne-dim, and gold.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in system |
| 2 | Blend modes | None used | full | N/A — no blends in system |
| 3 | Animation / keyframes | None used | full | N/A — static tableau |
| 4 | Pixel / hard offset shadows | None used (rules only) | full | N/A — rules export natively |
| 5 | Gradients | None used | full | N/A — no gradients in system |
| 6 | Grain / scanline / noise overlays | None used | full | N/A — no overlays |
| 7 | Transparency layers | Dimmed ◆/◇ glyphs (55% opacity) | partial | Solid gold glyphs at smaller size |
| 8 | Custom fonts | Cinzel + Jost via CDN | partial | Embedded fonts or Times New Roman/Calibri substitution |
| 9 | Absolute-positioned decor | Side-ornament glyph stacks (positioned divs) | partial | Native text boxes in place |
