---
version: alpha
name: Maison
description: A minimal-luxury presentation system built on a centered single column with vast gutters and a 20vh top margin. Display type runs in Cormorant Garamond ivory on matte black (#0B0B0C), paired with Inter Light body copy and widely tracked Inter caps (+0.3em) labels. A single muted gold (#C6A664) carries hairline rules, the context label, and exactly one italic accent word per display moment. Matte alternating grounds, 1px hairline dividers, and oversized leading do all the work — no shadows, no blur, no ornament beyond the hairline.

colors:
  black: "#0B0B0C"
  black-soft: "#141416"
  ivory: "#F7F3EC"
  ivory-dim: "#CFC8B8"
  gold: "#C6A664"
  gold-deep: "#9A7F45"
  gray: "#6E6E6E"
  gray-line: "#3A3A3C"

shadows:
  none-matte: "none"
  hairline-glow-faint: "0 0 1px rgba(198, 166, 100, 0.4)"
  text-rest: "none"

typography:
  maison-hero:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "clamp(54px, 5vw, 84px)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.005em
  display:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "clamp(42px, 3.5vw, 60px)"
    fontWeight: 500
    lineHeight: 1.3
  headline:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "clamp(32px, 2.6vw, 44px)"
    fontWeight: 500
    lineHeight: 1.32
  accent-word:
    fontFamily: "'Cormorant Garamond', serif"
    fontStyle: italic
    fontWeight: 500
    color: "{colors.gold}"
    description: "Exactly one word per display headline, italic gold; never more, never on body."
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "clamp(19px, 1.5vw, 26px)"
    fontWeight: 300
    lineHeight: 1.8
  body-small:
    fontFamily: "'Inter', sans-serif"
    fontSize: "clamp(15px, 1.1vw, 18px)"
    fontWeight: 300
    lineHeight: 1.8
  label-context:
    fontFamily: "'Inter', sans-serif"
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.3em
    textTransform: uppercase
  label-folio:
    fontFamily: "'Inter', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.3em
    textTransform: uppercase
  quote-body:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "clamp(26px, 2.2vw, 36px)"
    fontWeight: 500
    fontStyle: italic
    lineHeight: 1.5
  counter:
    fontFamily: "'Inter', sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.3em

spacing:
  top-margin: "20vh"
  measure: "60ch"
  column-max: 1200px
  gutter-side: "12vw"
  pad-card: "48px 56px"
  gap-rule-title: 36px
  gap-title-sub: 36px
  gap-sub-rule: 48px
  rule-display: 120px
  hairline: 1px

canvas:
  width: 100vw
  height: 100vh

components:
  label-context:
    color: "{colors.gold}"
    fontFamily: "'Inter', sans-serif"
    fontSize: 17px
    fontWeight: 500
    letterSpacing: 0.3em
    textTransform: uppercase
    description: "Gold tracked caps context line floating above the display rule; the slide's quiet header."
  rule-display:
    width: 120px
    height: 1px
    background: "{colors.gold}"
    description: "Short centered 1px gold rule between the context label and the headline."
  rule-closing:
    width: 100%
    height: 1px
    background: "{colors.gold}"
    opacity: 0.55
    description: "Full-measure 1px gold closing rule above the folio line; softer than the display rule."
  label-folio:
    color: "{colors.ivory-dim}"
    fontFamily: "'Inter', sans-serif"
    fontSize: 14px
    fontWeight: 500
    letterSpacing: 0.3em
    textTransform: uppercase
    description: "Centered folio line beneath the closing rule: folio numeral plus genuine content phrase."
  accent-word:
    fontFamily: "'Cormorant Garamond', serif"
    fontStyle: italic
    color: "{colors.gold}"
    description: "The single italic gold word inside a display headline; applied to the display word of the title."
  quote-mark:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: 96px
    color: "{colors.gold}"
    description: "Oversized gold Cormorant quotation glyph opening quote slides; the only decorative glyph."
  stat-figure:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "clamp(72px, 6vw, 120px)"
    color: "{colors.ivory}"
    description: "Large Cormorant numeral for stat moments, centered, with a tracked caps gold label beneath."
  ground-alternate:
    background: "{colors.ivory}"
    color: "{colors.black}"
    description: "Inverted ivory slide ground used sparingly; headlines go black, rules and labels go gold-deep."
  divider-dot:
    color: "{colors.gold}"
    description: "Single centered gold interpunct separating stacked label lines; never doubled or ruled."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Maison is a **minimal-luxury presentation system**. Its foundational premise is **restraint**: one centered column at 60ch, one accent word, one hairline at a time, opening 20vh below the stage top. Layouts feel curated rather than composed — the context label floats above a gold hairline, the headline breathes at oversized leading with a single italic word in gold, and the subtitle follows at a whisper before the closing rule. Whitespace is the material; type is placed the way objects are placed in a viewing room.

The type stack is two faces with strict roles. **Cormorant Garamond** is the display face — a light, high-contrast serif for headlines, quote bodies, and stat figures in ivory (or black on inverted grounds). **Inter** is the quiet infrastructure — Light (300) for body copy at 1.8 leading, Medium (500) tracked caps at +0.3em for context labels, folio lines, and counters. The voice contrast is **lyrical serif display ↔ whispered sans body ↔ widely tracked caps hardware**.

The palette is four tones and nothing else: **matte black ground** (`{colors.black}`), **ivory text** (`{colors.ivory}`), **muted gold** (`{colors.gold}`) for rules, labels, and the accent word, and **gray** (`{colors.gray}`) for tertiary marks. Gold is rationed like spice — one accent word, two hairlines, one label per slide. Ivory grounds appear only as rare inverted alternates; the system's home is black.

Depth is nearly absent by doctrine: **matte alternating grounds, 1px hairline dividers, and oversized leading do all the work**. There are no shadows, no blur, no gradients, no texture. Hierarchy is built from scale, leading, and the single gold accent — a slide that needs more effects is a slide that needs fewer words.

**Density philosophy: low, columnar, patient.** One idea per slide, one column per slide, vast gutters on both sides. A typical slide carries the context label + display rule + headline + subtitle + closing rule + folio line — six quiet elements in a single vertical rhythm, never sidebars, never grids, never clusters.

**Key Characteristics:**
- Single italic accent word — exactly one word per display headline in Cormorant italic gold; everything else stays roman ivory.
- Hairline gold rules — 1px centered rules (120px display rule, full-measure closing rule) as the only dividers in the system.
- Oversized leading — display at 1.3 and body at 1.8 line-height, so whitespace glows between the lines.
- Vast-margin centered column — 20vh top margin, 60ch measure, nothing outside the column except alternating matte grounds.
- Tracked caps labels in gold — Inter Medium caps at +0.3em for context, kickers, and folio lines; the quiet hardware of the system.
- Matte black home ground — ivory alternates are rare inversions, never the default rhythm.
- Four tones only — black, ivory, gold, gray; a fifth color would read as noise.

## Colors

### Palette

- **Black** (`{colors.black}` — `#0B0B0C`): The matte home ground; near-black with a whisper of warmth.
- **Black Soft** (`{colors.black-soft}` — `#141416`): Panel-adjacent tone for rare inset regions on black; barely lifted.
- **Ivory** (`{colors.ivory}` — `#F7F3EC`): Display and body text on black; the alternate slide ground when inverted.
- **Ivory Dim** (`{colors.ivory-dim}` — `#CFC8B8`): Folio lines and secondary labels on black; softer than full ivory.
- **Gold** (`{colors.gold}` — `#C6A664`): The single accent — hairline rules, context labels, the accent word, quote marks.
- **Gold Deep** (`{colors.gold-deep}` — `#9A7F45`): Gold's companion on ivory grounds, where full gold would wash out.
- **Gray** (`{colors.gray}` — `#6E6E6E`): Tertiary marks — counters, hints, de-emphasized micro text on either ground.
- **Gray Line** (`{colors.gray-line}` — `#3A3A3C`): Hairlines on black where gold would over-assert; structural, never decorative.

### Defaults

- **Default surface background**: `{colors.black}`, matte, with no overlay of any kind.
- **Default headline color on black**: `{colors.ivory}` in Cormorant 500, with exactly one `{colors.gold}` italic accent word.
- **Default headline color on ivory alternates**: `{colors.black}` with a `{colors.gold-deep}` italic accent word.
- **Default body text color on black**: `{colors.ivory}` at 78% in Inter Light; on ivory: `{colors.black}` at 80%.
- **Default context label**: `{colors.gold}` Inter caps +0.3em (`{components.label-context}`).
- **Default folio line**: `{colors.ivory-dim}` Inter caps +0.3em (`{components.label-folio}`) beneath the closing rule.
- **Default rule treatment**: 120px gold display rule above the headline, full-measure 55% closing rule above the folio.

Gold text appears only as the accent word (display scale) and tracked caps labels. Gold body copy does not exist. Gray text appears only below 15px or at 60%+ transparency.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Cormorant Garamond** is the display face — a light, high-contrast serif with couture posture. Used for every headline, hero title, quote body (italic), stat figure, and the single accent word (italic gold). Cormorant's delicacy is the system's voice — replacing it with a sturdy transitional or slab serif collapses the luxury register into generic editorial.

**Inter** is the infrastructure face — Light (300) for body copy at oversized 1.8 leading, Medium (500) tracked caps at +0.3em for context labels, folio lines, and counters. Inter stays quiet by design: small, light or tracked, never competing with the serif.

Never use Inter for headlines, never use Cormorant for body paragraphs or labels. The two-role separation is the typographic structure.

### Typography Scale

| Token | Size (clamp) | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.maison-hero}` | 54–84px | Cormorant Garamond | 500 | Cover or section hero title at 1.3 leading |
| `{typography.display}` | 42–60px | Cormorant Garamond | 500 | Large section opener |
| `{typography.headline}` | 32–44px | Cormorant Garamond | 500 | Primary section headline |
| `{typography.accent-word}` | inherits | Cormorant Garamond | 500 italic | The single gold word per headline |
| `{typography.body}` | 19–26px | Inter | 300 | Subtitles, paragraphs at 1.8 leading |
| `{typography.body-small}` | 15–18px | Inter | 300 | Captions, secondary prose |
| `{typography.label-context}` | 17px | Inter | 500 | Gold context caps, +0.3em |
| `{typography.label-folio}` | 14px | Inter | 500 | Folio caps, +0.3em |
| `{typography.quote-body}` | 26–36px | Cormorant Garamond | 500 italic | Quote text with gold quote mark |
| `{typography.counter}` | 13px | Inter | 500 | Slide counter, gray, +0.3em |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every display headline carries exactly one italic gold accent word.** Zero accent words reads as unfinished; two or more reads as decoration. The accent is the display word of the title when one exists.
- **Every display element uses line-height ≥ 1.3.** Cormorant at tight leading turns brittle — the air between lines is part of the letterforms' setting.
- **Every Inter body block uses line-height 1.8.** The whisper register depends on oversized leading; 1.5 or below reads as ordinary sans body.
- **Every Inter label is uppercase with exactly +0.3em tracking.** Narrower tracking reads as corporate; wider reads as parody. Sentence-case Inter labels do not exist.
- **Every cover opens with the context label + 120px display rule** before the headline, and closes with the full-measure rule + folio line after the subtitle. The rules frame the column like a mount frames a print.
- **Every quote body is Cormorant italic with the oversized gold quote mark.** Roman quotes or sans quotes flatten the only expressive moment the system allows.
- **Every stat figure pairs a Cormorant numeral with a tracked gold caps label beneath** — never beside, never above, never in one line.

### Typography Principles

The voice contrast is **lyrical serif display ↔ whispered sans body ↔ widely tracked caps hardware**. Cormorant should always feel **placed** — centered, generous leading, never left-aligned, never tight. Inter body should always feel **hushed** — centered, Light weight, 1.8 leading, dimmed ivory. Inter caps should always feel **engraved** — small, gold, +0.3em, uppercase.

Italic appears in exactly two places: the single accent word per headline and the quote body. Italic body copy, italic labels, or italic counters do not exist.

## Layout

### Canvas System

The system targets `100vw × 100vh` per slide. Slides stack vertically inside a `slides-container` and translate via `transform: translateY(...)` for navigation. Only one slide occupies the viewport at a time.

The column caps at 1200px (60ch) and centers horizontally, opening 20vh below the stage top. Side gutters hold at 12vw minimum — the column never widens to fill availability. Vertical rhythm runs: context label → 36px → display rule → 36px → headline → 36px → subtitle → 48px → closing rule → 24px → folio line.

### Persistent Chrome

Two elements appear on every slide:
- **Display frame** — the context label + 120px gold rule (`{components.label-context}`, `{components.rule-display}`) opening the column.
- **Closing frame** — the full-measure gold rule + folio line (`{components.rule-closing}`, `{components.label-folio}`) with the slide counter seated at the folio's right end.

No navigation dots, no floating hints, no progress bars — chrome is the column's own frame, never overlaid UI.

### Atmospheric Overlay Stack

Maison has no atmospheric overlays — no grain, vignette, glow, or particles. The surface stack is matte by doctrine:
1. Surface background — `{colors.black}` or the rare `{colors.ivory}` alternate, flat.
2. `.slide-content` directly above, with no intervening layers.

A Maison slide with an overlay effect applied reads as a smudge on glass, not an enhancement.

## Depth and Elevation

### Matte Planes (Signature)

The system uses **matte plane alternation** as its only depth language: black grounds and rare ivory grounds alternate across the deck, and the contrast between consecutive slides is the elevation. Within a slide there is no depth — `{shadows.none-matte}` is the default and only elevation token. Text rests on the ground (`{shadows.text-rest}`); rules lie flat.

The `{shadows.hairline-glow-faint}` token (1px gold at 40%) exists only to keep 1px rules from shimmering on low-density screens — it is anti-aliasing assistance, not glow, and must never be widened.

### No Cards, No Panels

Cards and elevated panels do not exist in this system. Content that other systems would box — stats, quotes, callouts — is set as centered type with rules. A bordered box or filled panel breaks the viewing-room register immediately.

### Rule Separation

Regions separate with 1px hairlines only: gold for the display and closing rules, gray-line for rare structural divisions on black. No rule exceeds 1px; no rule carries a shadow.

### No Atmospheric Depth

Blur, blend modes, gradients, grain, and vignettes do not exist in this system. Any such effect must be removed, not tuned.

## Shapes and Treatment

### Border Radius

Zero everywhere, without exception. There are no boxes, chips, pills, or buttons to round — the system's only shapes are hairlines, type, and the interpunct. Any rounded element breaks the register.

### Border Weights

- **1px solid gold** — display rule (120px) and closing rule (full measure); the only gold lines in the system.
- **1px solid gray-line** — rare structural hairlines on black where gold would over-assert.
- **No other weights exist.** A 2px rule would read as a bar; a 4px rule as architecture from another system.

All lines are solid, centered, and horizontal. Vertical rules, dashed rules, and double rules do not exist here.

### Decorative Element Types

**Context label** — Gold Inter caps at +0.3em floating above the display rule; the slide's quiet header.

**Display rule** — Short centered 120px 1px gold rule between the context label and the headline.

**Accent word** — The single Cormorant italic gold word inside a display headline; the system's most distinctive typographic mark.

**Closing rule** — Full-measure 1px gold rule at 55% opacity above the folio line; softer than the display rule.

**Folio line** — Centered ivory-dim Inter caps folio beneath the closing rule: folio numeral plus genuine content phrase.

**Divider interpunct** — Single centered gold `·` separating stacked label lines; never doubled, never flanked by rules.

**Quote mark** — Oversized 96px gold Cormorant `“` opening quote slides; the only decorative glyph in the system.

**Stat figure** — Large centered Cormorant numeral with a tracked gold caps label beneath.

**Ground alternate** — The rare inverted ivory slide ground; headlines go black, labels and rules go gold-deep.

## Do's and Don'ts

### Do

- Open the column 20vh below the stage top at 60ch measure, centered, with 12vw minimum gutters.
- Set exactly one italic gold accent word in every display headline — the display word of the title when one exists.
- Frame the column with the display rule above the headline and the closing rule + folio line below the subtitle.
- Keep display leading at 1.3+ and body leading at 1.8 — the air is part of the setting.
- Track every Inter label at exactly +0.3em uppercase; gold for context, ivory-dim for folio, gray for counters.
- Alternate matte black home grounds with rare ivory inversions; never invert twice in a row.
- Center every element in the column — headlines, body, rules, labels, stat figures, quotes.
- Ration gold to the accent word, two hairlines, and one label per slide.
- Set quotes in Cormorant italic with the oversized gold quote mark.
- Pair stat figures with tracked gold caps labels beneath, never beside.

### Don't

- Don't add shadows, blur, gradients, blend modes, texture, or rounded corners. Matte planes and hairlines are the only depth.
- Don't set two accent words in one headline — or zero. Exactly one, always italic, always gold.
- Don't use Inter for headlines or Cormorant for body or labels. Each face has a single role.
- Don't left-align anything. The column centers; asymmetry belongs to other systems.
- Don't box content in cards or panels. Stats, quotes, and callouts are centered type with rules.
- Don't introduce a fifth color. Black, ivory, gold, gray — a second accent reads as noise.
- Don't track Inter labels wider or narrower than +0.3em. The engraved rhythm is fixed.
- Don't tighten display leading below 1.3 or body below 1.8. Density breaks the whisper register.
- Don't omit the display or closing rules on any slide. The frame is non-negotiable.
- Don't use italic outside the accent word and quote bodies. Italic labels or counters do not exist.

## Responsive Behavior

Maison is a **measure-locked system** built around the fixed 60ch column and 20vh top margin. Display sizes interpolate via `clamp()` on viewport width while the measure, rules, and tracking stay fixed.

### Scaling Behavior

- Hero text scales 54px → 84px on viewport width.
- Stat figures scale 72px → 120px.
- Body scales 19px → 26px.
- The 60ch measure, 120px display rule, 1px weights, and +0.3em tracking are fixed — they never scale, so the frame reads finer on larger canvases by design.

### Component Breakpoints

- `max-width: 1400px` — gutters narrow 12vw → 8vw; measure holds at 60ch.
- `max-width: 1024px` — top margin drops 20vh → 14vh; folio counter moves beneath the folio line.
- `max-width: 640px` — context label drops to 14px; display rule shortens 120px → 80px.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Slide transitions are 600ms ivory-through-black fades — a gallery light dimming between rooms, never a slide or push.
- Ground alternation (black ↔ ivory) is fixed per slide index; navigation never reorders it.

### Animation Triggers

The fade transition is the only motion in the system. It shortens to an instant cut under `prefers-reduced-motion`. No entry animations, no count-ups, no keyframed decor exist.

### Print Behavior

The system prints 1:1 — matte grounds, hairlines, and tracked caps survive print exactly. Black grounds print as rich black; for toner-saving drafts an ivory-ground variant may substitute with gold-deep rules. For static export, screenshots of each slide preserve all flat geometry with no overlay loss.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin typeface stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended Korean fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / hero / stat figures / quotes | Cormorant Garamond 500 | Noto Serif KR 600 |
| Body / subtitles / captions | Inter 300 | Noto Sans KR 300–400 |
| Caps labels / context / folio / counter | Inter 500 (uppercase + 0.3em) | Noto Sans KR 500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy B** — serif/sans split preserved. Set display elements to `font-family: 'Cormorant Garamond', 'Noto Serif KR', serif` so Latin words keep their couture serif while Hangul falls through to Noto Serif KR at matched weight. Set body and labels to Inter-first stacks with Noto Sans KR fallback. This system survives the split better than most because Cormorant and Noto Serif KR share high-contrast stroke logic at display sizes. A mixed line like `서두른 출시의 숨은 비용` renders fully in Noto Serif KR; a mixed line like `Typodeck Research · 2026년 11월` keeps its Latin in Cormorant with Hangul in Noto Serif KR — an acceptable duet.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~10–15% from the Latin spec. Body 1.95–2.05 (up from 1.8), display 1.4–1.45 (up from 1.3). The Latin spec is already airy; CJK needs only a breath more.
- **Letter-spacing**: set to 0 on every CJK run. The system's +0.3em caps tracking looks broken on square CJK glyphs — keep the gold color and caps position, drop the tracking and transform.
- **Text transform**: don't apply `uppercase` to Korean text. Every Inter label uses `text-transform: uppercase`; remove it for CJK runs.
- **No period on display headlines**: Korean display convention omits trailing periods on cover headlines.
- **Space between CJK and Latin**: insert an ASCII space between every Hangul run and adjacent Latin characters or digits.
- **Accent word in Korean**: Hangul has no italic — render the single accent word in Noto Serif KR 600 with gold color and no slant. The gold isolation carries the accent alone.

### Aesthetic Notes for This System

The system's identity rests on serif delicacy plus engraved caps — and a CJK build preserves both registers. Noto Serif KR at 600 gives display headlines the needed contrast logic, and the hairline rules translate perfectly at identical widths. Lean on the **non-typographic** signature elements: the 120px display rule, the full-measure closing rule, and the vast 20vh margin carry the luxury register when the Cormorant voice is unavailable.

The +0.3em engraved caps rhythm cannot transfer to Hangul. Render Korean context and folio labels in Noto Sans KR weight 500 at 0 tracking with no transform, one size down (15px context, 13px folio) to preserve the frame's delicate silhouette against the gold rules.

### Known CJK Gap

- **No italic in Hangul.** The single-italic-accent signature loses its slant — gold color isolation must carry the accent alone. Compensate by keeping the accent word choice equally deliberate.
- **Cormorant has no Hangul voice.** Noto Serif KR is a sturdy Ming-style serif that reads more editorial than couture. The vast margins and hairlines must carry the luxury register the face cannot.

## Iteration Guide

1. Any new slide opens its column 20vh below the stage top at 60ch measure, centered, on matte black (or a deliberate ivory alternate).
2. Any new display element uses Cormorant 500 at 1.3+ leading with exactly one italic gold accent word. Any new body element uses Inter Light at 1.8 leading in dimmed ivory. Any new label uses Inter Medium caps at +0.3em.
3. Any new headline gets `{colors.ivory}` on black or `{colors.black}` on ivory alternates, with the gold (or gold-deep) accent word.
4. Any new slide frames the column with the display rule above the headline and the closing rule + folio line below the subtitle.
5. Any new quote uses Cormorant italic with the oversized gold quote mark; any new stat uses a Cormorant figure with a tracked gold caps label beneath.
6. Any new ground alternation inverts black ↔ ivory deliberately and never twice in a row.
7. Any new label centers in the column at +0.3em tracking — gold context, ivory-dim folio, gray counter.
8. Gold stays rationed: one accent word, two hairlines, one label per slide — audit every addition.
9. No new shadows, blur, gradients, blend modes, texture, boxes, or rounded corners — matte planes and hairlines only.
10. New motion is limited to the 600ms gallery fade, cut to instant under `prefers-reduced-motion`.

## Known Gaps

- **Fonts**: Cormorant Garamond / Inter via Google Fonts CDN (`display=swap`); fallbacks `Georgia, serif` for display, `system-ui, sans-serif` for body and labels. Korean builds add Noto Serif KR / Noto Sans KR with fallbacks `"Apple SD Gothic Neo", "Malgun Gothic", serif/sans-serif`. No font files committed. Offline rendering falls back to system stacks and loses the couture serif voice.
- **The accent word is applied to the display word of the Latin title at render time.** Titles without a natural display word need an editorial accent choice; the system offers no automatic fallback.
- **The 20vh top margin is fixed** and does not compress for long titles. Titles beyond four display lines need a smaller hero step or a shortened title — the column will not reflow around them.
- **Ivory alternate grounds are manual.** There is no automatic alternation logic — authors choose per slide and must never invert twice in a row.
- **Stat figures and quote marks are hardcoded sizes** (120px max figure, 96px mark) with no data binding — adding a stat requires copying the figure-plus-label pattern.
- **The folio counter is static text** (`01 / 01` format on covers). Multi-slide decks need per-slide counter updates in markup.
- **Cormorant Garamond at small sizes turns brittle.** The system offers no Cormorant treatment below 26px — small text is always Inter.

### PPTX fidelity disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — matte by doctrine | full | N/A (nothing to reproduce) |
| 2 | Blend modes | Not used | full | N/A (nothing to reproduce) |
| 3 | Animation / keyframes | 600ms gallery fade between slides | none | Static slides (cut transition) |
| 4 | Pixel / hard offset shadows | Not used — text rests flat | full | N/A (nothing to reproduce) |
| 5 | Gradients | Not used — flat matte grounds | full | N/A (nothing to reproduce) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to reproduce) |
| 7 | Transparency layers | Ivory at 78% for body; closing rule at 55% | partial | Nearest opaque tints (#C9C2B2 body, #D8C48F rule) |
| 8 | Custom fonts | Cormorant Garamond / Inter via CDN | partial | Embedded subsets; fallback Georgia / Calibri |
| 9 | Absolute-positioned decor | Hairline rules as flat divs | full | Native 1pt line shapes |
