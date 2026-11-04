---
version: alpha
name: Front Page
description: A newspaper broadsheet compressed into a title slide. Centered Playfair Display nameplate under a double rule, full-width 900-weight wood-type headline, justified Lora standfirst with a dark-red drop cap, and open columns with content-derived folio lines. Warm newsprint ground (#F7F4EC), soft-black ink, dark red rationed to kicker, drop cap, and one ornament. Flat, ruled, justified — authority from measure and restraint. Typography-only: no boxes, no column grids, no filled accents.
colors:
  newsprint: "#F7F4EC"
  ink: "#141414"
  dark-red: "#8B0000"
  gray: "#6B6B6B"
  keyline: "#D9D2C2"
  white: "#FFFFFF"
shadows:
  none-flat: "none"
  rule-shadow: "none"
  plate-lift: "none"
typography:
  nameplate:
    fontFamily: "'Playfair Display', serif"
    fontSize: "60px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: 0.14em
    textTransform: uppercase
  wood-headline:
    fontFamily: "'Playfair Display', serif"
    fontSize: "92px"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: 0
  section-head:
    fontFamily: "'Playfair Display', serif"
    fontSize: "54px"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: 0
  standfirst:
    fontFamily: "'Lora', serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-column:
    fontFamily: "'Lora', serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  kicker:
    fontFamily: "'Libre Franklin', sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.28em
    textTransform: uppercase
  dateline:
    fontFamily: "'Libre Franklin', sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.18em
    textTransform: uppercase
  folio-line-head:
    fontFamily: "'Libre Franklin', sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.22em
    textTransform: uppercase
  folio-line-body:
    fontFamily: "'Lora', serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption:
    fontFamily: "'Lora', serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  folio-line:
    fontFamily: "'Libre Franklin', sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.2em
    textTransform: uppercase
spacing:
  rule-unit: 1px
  pad-slide-y: 56px
  pad-slide-x: 88px
  col-gap: 96px
  gap-masthead-head: 28px
  gap-head-deck: 24px
  gap-deck-strip: 32px
  content-max-width: 1744px
canvas:
  width: 1920px
  height: 1080px
components:
  masthead:
    borderTop: "3px solid {colors.ink}"
    borderBottom: "1px solid {colors.ink}"
    padding: "14px 0 12px 0"
    description: "Centered nameplate plate: triple-topline, 64px tracked Playfair caps, dateline row beneath. Opens every section front."
  double-rule:
    borderTop: "3px solid {colors.ink}"
    paddingTop: 3px
    borderBottom: "1px solid {colors.ink}"
    description: "3px-over-1px rule pair with a 3px gap. Opens the masthead and closes the folio foot."
  dateline-row:
    fontSize: 22px
    letterSpacing: 0.18em
    description: "Three-part row under the plate: context dateline left, edition mark center, report count right, in tracked caps."
  kicker-deck:
    color: "{colors.dark-red}"
    fontSize: 24px
    letterSpacing: 0.28em
    description: "Dark-red tracked caps kicker centered above the headline. Content-derived (counts, lesson), never decorative."
  wood-headline-block:
    fontSize: 92px
    fontWeight: 900
    description: "Full-width centered Playfair 900 headline spanning all columns with a balanced two-line break."
  standfirst-deck:
    fontFamily: "'Lora', serif"
    fontSize: 30px
    description: "Justified subtitle deck with a dark-red Playfair drop cap on the first letter via ::first-letter."
  column-strip:
    columns: 3
    columnGap: 96px
    description: "Lower open columns separated by whitespace only; each carries a folio head + Lora body, all content-derived."
  folio-line-item:
    separator: "◆ in {colors.dark-red}"
    description: "One strip item: tracked caps head in gray + Lora body in ink, items joined by red ◆ separators."
  folio-line:
    borderTop: "1px solid {colors.ink}"
    padding: "12px 0 0 0"
    fontSize: 20px
    description: "Closing foot line: page mark left, section mark center, counter right, in tracked caps."
  pull-quote:
    fontFamily: "'Playfair Display', serif"
    fontSize: 40px
    fontWeight: 900
    description: "Centered Playfair quote with 24px red rule above; used on inner slides for the one quotable line."
  byline:
    fontFamily: "'Libre Franklin', sans-serif"
    fontSize: 20px
    letterSpacing: 0.2em
    description: "Tracked caps byline with red square bullet; credits the research desk on inner slides."
  fact-block:
    rule: "1px solid {colors.ink} above"
    padding: "24px 0 0 0"
    description: "Ruled sidebar block for the key figure on inner slides; head in tracked caps, figure in Playfair 900. Never framed."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`, treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and rule legibility.


## Overview

Front Page is a **newspaper broadsheet compressed into a title slide**. Its foundational premise is the **locked chase**: every region is held by horizontal rules — a double rule opens the masthead, a single rule closes the folio. Nothing floats, nothing overlaps, nothing rounds, and no vertical grid boxes the columns. The page earns trust the way newsprint does: by looking already edited, already checked, already history.

The type stack is three faces in strict roles. **Playfair Display 900** is the wood type — nameplate, headlines, drop cap, pull quotes. **Lora 400** is the reading voice — standfirst decks, column body, captions, justified everywhere it runs long. **Libre Franklin 600** is the pressman's voice — kickers, datelines, folio heads, bylines, all tracked caps. The contrast between high-contrast Didone display, sturdy slab-inflected text serif, and grotesque caps chrome is the entire personality.

The palette is press-room minimal: warm newsprint ground (#F7F4EC), soft-black ink (#141414), gray (#6B6B6B) for secondary chrome, and dark red (#8B0000) rationed to exactly three appearances per front — kicker, drop cap, one ornament. Red is the only hue on the page; everything else is paper and ink.

Depth is entirely flat. There are no shadows, no blur, no gradients, no rounded corners. Emphasis comes from scale (92px wood type against 24px columns), weight (900 against 400), and rules (3px against 1px). A slide with a drop shadow stops being a newspaper.

**Density philosophy: a full front, calmly locked.** The title slide carries the masthead, kicker, headline, standfirst, folio strip line, and folio line — six locked regions with 24–32px gutters. Inner slides keep the masthead condensed and run two open justified columns with a fact block. White space exists inside the regions (generous leading, airy padding), never as loose floating margin.

**Key Characteristics:**
- Nameplate masthead: centered tracked Playfair caps plate under a double rule with a three-part dateline row.
- Full-width wood-type headline: title spans all columns at 92px Playfair 900, centered, balanced break.
- Justified standfirst deck: subtitle justifies edge to edge with a dark-red Playfair drop cap via ::first-letter.
- Open columns: lower strip and inner columns separated by whitespace only, items derived from real deck content.
- Double-rule frame lines: 3px-over-1px pairs open the masthead and close the folio.
- Dark-red rationing: red appears exactly three times per front — kicker, drop cap, one ornament.
- Folio foot line: page mark, section mark, counter in tracked caps close every page.
- Flat press depth: no shadows, no blur, no rounding, no boxes — authority from rules and measure.
- Justified measure everywhere: long text justifies; only headlines, kickers, and folio center.

## Colors

### Palette

- **Newsprint** (`{colors.newsprint}` — `#F7F4EC`): The page ground. Warm, dimmed white that reads as morning stock rather than screen glare.
- **Ink** (`{colors.ink}` — `#141414`): Headlines, body, rules, nameplate. Soft black — never pure #000, which would feel laser-printed next to newsprint.
- **Dark Red** (`{colors.dark-red}` — `#8B0000`): Kicker, drop cap, one rule accent per front. Deep press red, never bright.
- **Gray** (`{colors.gray}` — `#6B6B6B`): Dateline secondary runs, folio line heads, captions. Quiet, never competing with ink.
- **Keyline** (`{colors.keyline}` — `#D9D2C2`): Reserved token from the column-grid era, unused in the typography-only system.
- **White** (`{colors.white}` — `#FFFFFF`): Reserved token, unused in the typography-only system. Never a page background.

### Defaults

- **Default surface background**: `{colors.newsprint}` flat — no texture image, no gradient wash.
- **Default headline color**: `{colors.ink}` at Playfair 900.
- **Default body text color**: `{colors.ink}` in Lora 400, justified.
- **Default kicker color**: `{colors.dark-red}` in tracked Libre Franklin caps.
- **Default dateline color**: `{colors.gray}` in tracked caps, with the context run in ink.
- **Default column separation**: whitespace (96px gap), never a rule.
- **Default frame rule color**: `{colors.ink}` at 3px/1px for double rules, 1px for the folio close.
- **Default drop cap color**: `{colors.dark-red}` in Playfair 900.
- **Default ornament**: the red ⁂ asterism or ◆ separators — the third red ration.

When a slide needs to feel more urgent, widen the kicker tracking and enlarge the ornament; when it needs to feel calmer, drop the third red accent and let kicker plus drop cap carry the hue.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**Playfair Display** is the wood type — a high-contrast Didone for the nameplate (tracked caps 900 at 60px), headlines (900), drop caps (900), and pull quotes. Its sharp serifs and vertical stress are what make the page feel printed rather than rendered.

**Lora** is the reading voice — a sturdy contemporary serif for standfirst decks, column body, folio line bodies, and captions. Lora justifies beautifully at 24–30px and holds long measures without tiring.

**Libre Franklin** is the pressman's voice — a grotesque used exclusively in tracked caps (600) for kickers, datelines, folio heads, bylines, and the folio line. The caps-plus-tracking treatment is the system's chrome register.

Never use Playfair for body, never use Lora for chrome, never set Libre Franklin in sentence case. The three-role separation is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.nameplate}` | 60px | Playfair Display | 900 | Masthead plate, tracked caps |
| `{typography.wood-headline}` | 92px | Playfair Display | 900 | Full-width title headline |
| `{typography.section-head}` | 54px | Playfair Display | 900 | Inner-slide headline |
| `{typography.standfirst}` | 30px | Lora | 400 | Justified subtitle deck with drop cap |
| `{typography.body-column}` | 24px | Lora | 400 | Justified column body |
| `{typography.kicker}` | 24px | Libre Franklin | 600 | Red tracked caps kicker |
| `{typography.dateline}` | 22px | Libre Franklin | 600 | Masthead dateline row |
| `{typography.folio-line-head}` | 20px | Libre Franklin | 600 | Folio strip item heads |
| `{typography.folio-line-body}` | 26px | Lora | 400 | Folio strip item bodies |
| `{typography.caption}` | 20px | Lora | 400 | Captions and credit lines |
| `{typography.folio-line}` | 20px | Libre Franklin | 600 | Closing foot line |

### Defaults

- **Default size for a title headline**: `{typography.wood-headline}` (92px) — always Playfair 900, centered, full-width.
- **Default size for an inner headline**: `{typography.section-head}` (54px) — Playfair 900, left-aligned over columns.
- **Default size for the standfirst**: `{typography.standfirst}` (30px) — Lora 400, justified, drop cap on first letter.
- **Default size for column body**: `{typography.body-column}` (24px) — Lora 400, justified, hyphenated.
- **Default size for kickers**: `{typography.kicker}` (24px) — red, 0.28em tracking, uppercase.
- **Default tracking for Libre Franklin chrome**: 0.18–0.28em. Franklin without wide tracking reads as UI, not press.
- **Default body weight**: 400 for Lora; **default display weight**: 900 for Playfair.

When unsure which display token to reach for, default to `{typography.section-head}` — it is the inner-page workhorse. Reserve `{typography.wood-headline}` for fronts and section dividers.

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every front opens with the nameplate masthead.** Tracked 60px Playfair caps between the top triple rule and the dateline row. A front without the plate reads as an article, not a paper.
- **Every headline spans the full measure centered.** Full-width 92px, balanced break, no column constraint. A narrow or left-aligned title headline breaks the wood-type voice.
- **Every standfirst justifies with a red drop cap.** The first letter renders Playfair 900 dark-red at ~3.2em via ::first-letter so the deck text stays one contiguous block.
- **Every kicker is dark-red tracked caps.** 24px Franklin 600 at 0.28em, centered above the headline. A black or sentence-case kicker reads as a label, not a press kicker.
- **Every column strip separates items with whitespace.** A 96px gap and red ◆ separators, never keyline grids. Gridded cells read as a table, not a paper.
- **Every front closes with the folio line.** Page mark, section mark, counter in tracked caps above a 1px close rule.
- **Every red appearance is one of the three rations.** Kicker, drop cap (or column head), one ornament — a fourth red element splits the page's single hue.

### Typography Principles

The voice contrast is **Didone display ↔ text serif ↔ grotesque caps chrome**. Playfair shouts from the top of the page, Lora murmurs in justified columns, Franklin stamps the metadata. Switching any role flattens the paper into a generic editorial layout.

Headlines and kickers center; everything long justifies. Hyphenation stays on for justified Lora so rivers never open in the 24px columns. Italic appears only in Lora captions and credit lines — never in headlines, never in chrome.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Slides render one at a time at full stage size and scale uniformly to the viewport through the shared scaler — no reflow, no breakpoints on the stage itself.

Default slide padding is `56px 88px`. The inner page caps at `max-width: 1744px` and holds six locked regions on the title front: masthead, kicker, headline, standfirst, folio strip line, folio line. Inner slides condense the masthead to a single rule plus folio head and run two open justified columns.

### Open Columns

The lower strip runs **one centered folio line**: three content items with inline heads joined by red ◆ separators, wrapping as needed. Inner columns run two-up with 96px gutters and no dividers, justifying with hyphenation on. On inner slides a fact block may follow the columns under its own rule.

### Persistent Chrome

Three elements appear on every slide:
- **Masthead** — full plate on fronts, condensed single-rule head on inner slides, pinned to the top of the page.
- **Open columns** — whitespace-separated columns wherever two text blocks meet; never a divider.
- **Folio line** — page mark, section mark, counter in tracked caps, pinned above the foot close rule.

There is no dot rail, no floating nav, no progress bar. The cursor is `default` — the page is read, not operated.

### Atmospheric Layer Stack

Every slide carries (in z-order):
1. Newsprint ground `{colors.newsprint}`, flat.
2. Rules: double-rule pairs, section rules, folio close rule.
3. Type blocks: plate, headline, decks, columns, folio items.
4. The single red ornament (title fronts only), set in type.

This stack is deliberately shallow. A slide with glass, blur, or glow stops being newsprint.

## Depth and Elevation

### Flat Press (Signature)

The system uses **no cast shadows and no elevation**. Depth is expressed through **rule weight and type scale**: 3px rules sit above 1px rules, 96px wood type sits above 24px columns, red sits above ink. The restraint is the signature — a blurred drop shadow anywhere breaks the printed-page fiction.

### Rule Weight as Elevation

The masthead double rule (3px over 1px) is the heaviest mark on the page and reads as the topmost layer. The single 1px ink rules hold the middle register. Weight steps of 3→1 perform the layering that shadows perform in other systems.

### Scale Contrast as Depth

The 92px headline against 24px column body creates a near-four-to-one scale step — the steepest in any light system in the family. Foreground and background separate by size alone, which is why the headline must always span full width: a small headline would sink into the columns.

### Hue Reservation as Focus

Dark red appears exactly three times per front. Scarcity is the focus mechanism: because red is the only hue, the eye visits kicker, drop cap, and accent in order and then rests in the ink. A fourth red element would flatten this visit order into noise.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no fact frames, no column grids, no cells — plates, rules, and columns only. A single rounded corner would read as a screen UI element pasted onto a printed page.

### Border Weights

- **3px solid ink** — used only as the top stroke of double-rule pairs (masthead open, folio close).
- **1px solid ink** — used on strip top rules, fact-block rules, folio close base, and dateline separators.
- **Red ⁂ asterism** — used once per front as the strip-top ornament (30px glyph, centered).
- **Red ◆ separators** — used between folio strip items.

Rules are always solid and horizontal, never dashed, never dotted, never vertical dividers. Dashed rules read as coupons, not broadsheets.

### Decorative Element Types

**Masthead** — Centered 64px tracked Playfair plate between a top triple rule and the three-part dateline row. Opens every front.

**Double rule** — 3px-over-1px pair with a 3px gap. Opens the masthead and closes the folio.

**Dateline row** — Context dateline left, edition mark center, report count right, in 22px tracked Franklin caps.

**Kicker deck** — Dark-red tracked caps kicker centered above the headline, derived from real deck content.

**Wood headline block** — Full-width centered 96px Playfair 900 headline with a balanced two-line break.

**Standfirst deck** — Justified 30px Lora subtitle with a dark-red Playfair drop cap via ::first-letter.

**Column strip** — Centered folio strip line: three content items with folio heads plus Lora bodies joined by red ◆ separators, all content-derived.

**Folio strip item** — Tracked gray caps head beside ink Lora body. The small unit of the strip line.

**Folio line** — Page mark, section mark, counter in tracked caps above the 1px foot close rule.

**Pull quote** — Centered 40px Playfair 900 quote with a 24px red rule above, for inner slides.

**Byline** — Tracked caps credit with a red square bullet, for inner slides.

**Fact block** — Ruled sidebar block with tracked caps head and Playfair 900 figure, for inner slides. Never framed.

## Do's and Don'ts

### Do

- Open every front with the full nameplate masthead and its three-part dateline row.
- Span the title headline full width at 92px Playfair 900, centered, with a balanced break.
- Justify the standfirst edge to edge with a dark-red Playfair drop cap on the first letter.
- Set the lower strip as one centered folio line with three content items joined by red ◆ separators.
- Derive every folio item, kicker, and dateline run from real deck content — counts, dates, lesson lines.
- Ration dark red to kicker, drop cap, and one accent per front.
- Close every page with the folio line above the 1px foot rule.
- Frame the masthead and folio with 3px-over-1px double rules.
- Justify all long Lora text with hyphenation on.
- Keep every corner sharp and every surface flat — no shadows, no blur, no rounding.

### Don't

- Don't float, overlap, or rotate any element. The chase is locked; nothing escapes its rectangle.
- Don't introduce a fourth typeface or a sentence-case Franklin run. The three-role separation is structural.
- Don't blur shadows, add gradients, or use glass. Newsprint is flat stock under ink.
- Don't use pure black or bright red. Ink is #141414, red is oxblood-dark #8B0000.
- Don't center long text or left-rag column body. Long measures justify; only display centers.
- Don't add a fourth red element or a second hue. One hue, three appearances.
- Don't round any corner or pill any chip. Don't box columns, facts, or strips. Rules and type only.
- Don't letterspace Lora or Playfair body runs. Tracking belongs to Franklin caps alone.
- Don't omit the masthead, section rule, or folio line on any slide. The trio is the persistent chrome.
- Don't invent stories, quotes, or figures for folio items. Items carry counts and lines from the real deck.

## Responsive Behavior

Front Page is a **fixed-stage system**: every slide renders at 1920×1080 and scales uniformly to the viewport with one transform. There is no responsive reflow — phones letterbox the stage rather than restacking the columns.

### Scaling Behavior

- Headline holds 96px on the stage; the scaler shrinks the whole page on small viewports.
- Columns, rules, and the masthead are stage-absolute geometry; they scale only via the uniform stage transform.
- Justification and hyphenation are set on the stage and survive scaling unchanged.
- The drop cap ::first-letter sizing is em-relative, so it stays proportional under the uniform transform.

### Component Breakpoints

No component breakpoints exist. The stage never reflows: two columns stay two columns at every viewport size.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- No hover states, no auto-advance, no scroll hijack. The page is read top to bottom.

### Animation Triggers

No animation exists in this system — no blinks, no reveals, no keyframes. The page is already printed. `prefers-reduced-motion` has nothing to disable.

### Print Behavior

The system is print-native by design: newsprint ground, ink type, flat rules. Printing yields the active front cleanly at 16:9. Newsprint prints as a warm tint; for pure-white stock, print with backgrounds off and the ink holds.

## CJK & International Content

When using this template for Korean (or other CJK) content, swap the Latin serif stack for a Korean serif/body pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / nameplate / headline / drop cap | Playfair Display 900 | Noto Serif KR 900 |
| Body / standfirst / columns / captions | Lora 400 | Noto Serif KR 400 |
| Chrome / kicker / dateline / folio | Libre Franklin 600 caps + tracking | Noto Sans KR 500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — Korean serif first with Latin serif fallback. Set display and body elements to `font-family: 'Noto Serif KR', 'Playfair Display', serif` and chrome to `'Noto Sans KR', 'Libre Franklin', sans-serif`. Noto Serif KR carries Hangul headlines with genuine stroke contrast that echoes Playfair's Didone stress; its Latin glyphs are serviceable but lighter, so mixed words like `Typodeck Research` keep Playfair via the fallback for display runs. Hierarchy survives through weight (900 / 400) plus the unchanged rule system.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@500;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Columns 1.85–1.95 (up from 1.65), headline 1.2–1.3 (up from 1.08). Square syllable blocks crowd vertically more than Latin.
- **Letter-spacing**: set to 0 on every CJK run, including Franklin-role chrome — the 0.18–0.28em Latin tracking looks broken on pre-spaced syllables.
- **Text transform**: don't apply `uppercase` to Korean text — Hangul has no case. Kicker and folio runs render without transform in CJK builds.
- **Justification**: keep justified columns — Hangul justifies cleanly — but disable hyphenation for Korean runs (no mid-syllable breaks).
- **Punctuation**: use Korean punctuation conventions; keep the red square bullet and rule system unchanged.
- **No period on display headlines**: Korean display convention omits trailing 。 on large headlines.
- **Space between CJK and Latin**: insert an ASCII space between Hangul and adjacent Latin/digits.
- **Drop cap**: keep the ::first-letter treatment — a 3.2em Noto Serif KR 900 syllable in dark red works as well as a Latin cap.

### Aesthetic Notes for This System

The system's identity rests on Didone contrast plus grotesque caps chrome, and a Korean build preserves the first better than the second: Noto Serif KR 900 has real stroke contrast that echoes Playfair at headline scale. The Franklin tracked-caps voice has no Korean equivalent — compensate by setting Korean chrome in Noto Sans KR 500 at the same sizes with the double rules and red kicker color doing the recognition work.

The drop cap translates beautifully — a single large red serif syllable opening a justified deck is arguably more striking in Hangul than in Latin. Keep it on every CJK front.

### Known CJK Gap

- **No Korean Didone with Playfair's hairline contrast.** Noto Serif KR 900 is sturdy rather than sharp; headlines lose the razor-thin hairlines that make the Latin wood type sing. The full-width centered setting and balanced break must carry the drama.
- **No tracked-caps chrome voice in Korean.** Kickers and folio lines lose their pressman's stamp when tracking and case go away; the red color and rule framing carry the chrome alone.

## Iteration Guide

1. Any new front opens with the full nameplate masthead and three-part dateline row. Don't skip the plate.
2. Any new headline uses Playfair 900 — 92px full-width centered on fronts, 54px left-aligned on inner slides.
3. Any new subtitle uses the justified standfirst with the red ::first-letter drop cap.
4. Any new kicker uses dark-red tracked Franklin caps derived from real content counts or lesson lines.
5. Any new multi-column region uses open columns with 96px gutters and no dividers, folio head + Lora body per column.
6. Any new measurement follows the rule register: 3px frame strokes, 1px ink rules, 96px gutters.
7. Any new red is one of the three rations — kicker, drop cap, one ornament. Never a fourth.
8. Any new data uses fact blocks (rule above, caps head, Playfair figure) or pull quotes with the red rule above.
9. Any new page closes with the folio line: page mark, section mark, counter above the foot rule.
10. No motion is ever added. The page is printed; animation of any kind breaks the fiction.

## Known Gaps

- **Fonts**: Playfair Display / Lora / Libre Franklin via Google Fonts CDN (`display=swap`); fallbacks `"Didot", Georgia, serif` / `Georgia, serif` / `system-ui, sans-serif`. No font files committed. Offline rendering falls back to system serifs and loses the Didone voice. Korean builds add Noto Serif KR + Noto Sans KR with fallback `, "Apple SD Gothic Neo", sans-serif`.
- **Justified Lora needs hyphenation dictionaries** (`hyphens: auto` with `lang` set). Without them, narrow columns open rivers; the standfirst measure is wide enough to survive, the 2-col body is not.
- **The drop cap is a ::first-letter treatment** — it styles whatever letter opens the deck, including quotation marks and numerals. Decks opening with `"` need a hand-placed cap instead.
- **Nameplate tracking at 0.14em** is tuned for short plates (2–4 words). Long publication names overflow the measure and must be shortened, not shrunk.
- **Columns are flow blocks**, not table cells — adding a third column requires re-specifying the grid, not appending a cell.
- **No art budget exists.** The system has no photo, illustration, or chart-image treatment; data must be set as fact blocks and folio items.
- PPTX fidelity disclosure for this design:

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — system is fully flat | full | N/A (nothing to export) |
| 2 | Blend modes | Not used | full | N/A (nothing to export) |
| 3 | Animation / keyframes | Not used — no motion | full | N/A (nothing to export) |
| 4 | Pixel / hard offset shadows | Not used | full | N/A (nothing to export) |
| 5 | Gradients | Not used — flat newsprint | full | N/A (nothing to export) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to export) |
| 7 | Transparency layers | Not used | full | N/A (nothing to export) |
| 8 | Custom fonts | Playfair / Lora / Franklin via CDN | partial | Embedded fonts or Georgia/Didot + system sans |
| 9 | Absolute-positioned decor | None — all flow layout | full | Native text boxes in reading order |
