---
version: alpha
name: Chapter & Verse
description: A book-first presentation system styled as a finely printed volume. Newsreader SemiBold titles rest on a centered 34em measure with 1.7 lede leading; an oxblood chapter kicker opens each spread and a hairline folio rule with page mark closes it. Cream paper (#FBF7EF), warm ink (#1C1A17), oxblood (#7A2E2E), tan hairlines (#B9A88F) — matte, no shadows, rules and ornaments only.
colors:
  cream: "#FBF7EF"
  ink: "#1C1A17"
  oxblood: "#7A2E2E"
  tan: "#B9A88F"
  smoke: "#6B6257"
shadows:
  none: "none"
typography:
  chapter-title:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: "100px"
    fontWeight: 600
    lineHeight: 1.06
  section-title:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: "64px"
    fontWeight: 600
    lineHeight: 1.1
  lede:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: "31px"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.7
  drop-cap:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: "3.1em"
    fontWeight: 600
    lineHeight: 0.8
  kicker:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.34em
    textTransform: uppercase
  running-head:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.24em
    textTransform: uppercase
  folio:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.06em
  page-mark:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1
spacing:
  pad-slide-y: 64px
  pad-slide-x: 120px
  measure: 34em
  title-max-width: 1320px
  lede-max-width: 780px
  kicker-gap: 24px
  rule-kicker: 120px
  ornament-gap: 40px
canvas:
  width: 1920px
  height: 1080px
components:
  running-head:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    letterSpacing: 0.24em
    textTransform: uppercase
    color: "{colors.smoke}"
    description: "Top-of-page row: work left, date right, tracked caps over a 1px tan hairline."
  chapter-kicker:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    letterSpacing: 0.34em
    textTransform: uppercase
    color: "{colors.oxblood}"
    description: "Centered chapter label flanked by 120px oxblood hairlines with 24px gaps."
  ornament-divider:
    width: 200px
    color: "{colors.tan}"
    glyph: ◆
    glyphColor: "{colors.oxblood}"
    description: "Hairline — diamond — hairline divider between title and lede."
  drop-cap-lede:
    float: left
    fontSize: 3.1em
    lineHeight: 0.8
    padding: "8px 14px 0 0"
    color: "{colors.oxblood}"
    description: "Lede paragraph in Newsreader 400 at 1.7 leading; first letter floated oxblood cap."
  folio:
    borderTop: "1px solid {colors.tan}"
    paddingTop: 20px
    description: "Closing footer: tan hairline, source line left, fleuron center, page numeral right."
  page-mark:
    fontFamily: "'Newsreader', Georgia, serif"
    fontSize: 20px
    color: "{colors.oxblood}"
    description: "Oxblood serif page numeral at folio right."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Chapter & Verse is a **book-first presentation system**. Each slide is set like a page from a finely printed volume: a running head across the top, a chapter kicker, a serif title hung in whitespace, a lede paragraph opened by a drop cap, and a folio rule with a page mark at the foot. Nothing on the page behaves like a dashboard widget; everything behaves like front-matter, body text, or folio.

The type stack is two faces with strict roles. **Newsreader** (600/400) carries every word a reader actually reads — titles, ledes, body, the drop cap, the page numeral. **Inter** (500, tracked caps) carries every word a reader navigates by — running head, chapter kicker, folio source line. Serif speaks; sans labels. Crossing those roles (an Inter headline, a Newsreader kicker) breaks the book contract immediately.

The palette is paper and ink: cream ground `{colors.cream}`, warm near-black ink `{colors.ink}`, oxblood `{colors.oxblood}` reserved for the kicker, drop cap, ornament glyph, and page mark, and tan `{colors.tan}` reserved for hairline rules. A derived muted ink `{colors.smoke}` quiets the running head. Surfaces are matte — no shadows, no gradients, no blur. The only depth cue is ink weight on paper.

**Density philosophy: sparse and deliberate.** A typical slide carries one title, one lede, and its furniture (running head, kicker, ornament, folio). Whitespace is the dominant element; the 34em measure keeps line lengths bookish even on a 1920px stage. If a slide feels empty, it is correct — add words, never widgets.

**Key Characteristics:**
- Newsreader for reading text (titles, lede, body, page numeral), Inter tracked caps for navigation text (kicker, running head, folio) — never crossed.
- Centered 34em measure with 1.7 lede leading; title balanced across two to three lines.
- Oxblood reserved for four accents only: chapter kicker, drop cap, ornament diamond, page numeral.
- Every rule a 1px hairline in tan (furniture) or oxblood (kicker flanks); no other strokes exist.
- Folio footer on every slide: hairline, source line left, fleuron center, page numeral right.
- Running head on every slide: work left, date right, tracked 14px caps over a hairline.
- Matte cream paper; zero shadows, zero gradients, zero rounded chrome.

## Colors

### Palette

- **Cream** (`{colors.cream}` — `#FBF7EF`): The only slide ground. Warm book paper, never pure white.
- **Ink** (`{colors.ink}` — `#1C1A17`): Title, lede, and body text. Warm near-black; softer than `#000`.
- **Oxblood** (`{colors.oxblood}` — `#7A2E2E`): The single accent. Chapter kicker, drop cap, ornament diamond, page numeral, kicker flank rules. Never body text, never grounds.
- **Tan** (`{colors.tan}` — `#B9A88F`): Hairline rules only — running-head rule, ornament flanks, folio rule. Never text except at large tracked sizes where contrast still holds; running-head text uses smoke instead.
- **Smoke** (`{colors.smoke}` — `#6B6257`): Derived muted ink for the running head and other quiet furniture text.

### Defaults

- **Default surface background**: `{colors.cream}`, flat, no texture, no vignette.
- **Default headline color**: `{colors.ink}` at 100px / 600 weight.
- **Default body text color**: `{colors.ink}` at 82% opacity for ledes, 100% for body.
- **Default rule color**: `{colors.tan}` at 1px; kicker flanks in `{colors.oxblood}` at 1px.
- **Default accent usage**: at most four oxblood marks per slide (kicker, drop cap, diamond, page mark).

## Typography

### Font Family

**Newsreader** is the reading face — an editorial serif with bookish italics and sturdy 600 titles. It sets titles, ledes, body paragraphs, the drop cap, and the page numeral. Its 400 weight at 1.7 leading is the system's body texture.

**Inter** is the furniture face — a neutral grotesque used only at 500 weight in tracked capitals (running head, kicker) or small tracked settings (folio source line). It never sets headlines or paragraphs; its one content-adjacent exception is the stanza head, which counts as a structural navigation label rather than a headline (see Decorative Element Types).

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.chapter-title}` | 100px | Newsreader | 600 | Cover/chapter title, balanced, max 1320px |
| `{typography.section-title}` | 64px | Newsreader | 600 | Section opener inside a deck |
| `{typography.lede}` | 31px | Newsreader | 400 | Subtitle lede with drop cap, 1.7 leading |
| `{typography.body}` | 24px | Newsreader | 400 | Paragraph body, 1.7 leading |
| `{typography.drop-cap}` | 3.1em | Newsreader | 600 | First letter of the lede, oxblood, floated |
| `{typography.kicker}` | 16px | Inter | 500 | Chapter kicker, 0.34em tracking, uppercase |
| `{typography.running-head}` | 14px | Inter | 500 | Running head, 0.24em tracking, uppercase |
| `{typography.folio}` | 16px | Inter | 500 | Folio source line, 0.06em tracking |
| `{typography.page-mark}` | 20px | Newsreader | 600 | Folio page numeral, oxblood |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every lede opens with an oxblood drop cap.** Newsreader 600 at 3.1em, floated left, 0.8 line-height, `8px 14px 0 0` padding. A lede without it reads as a generic subtitle.
- **Every chapter kicker is tracked 0.34em uppercase Inter in oxblood**, flanked by 120px oxblood hairlines with 24px gaps. No other kicker style exists.
- **Every Inter furniture label is uppercase with wide tracking** — 0.24em (running head) or 0.34em (kicker). Sentence-case Inter caps styling does not exist except the folio source line, which renders verbatim content at 0.06em.
- **Every Newsreader title keeps normal case and balanced wrapping.** All-caps Newsreader never appears.
- **Every lede and body block uses 1.7 line-height.** Tighter leading breaks the book texture.
- **Every folio carries the fleuron center mark** in oxblood Newsreader between source line and page numeral.

### Typography Principles

The voice contrast is **serif reading voice ↔ tracked-sans furniture voice**. Newsreader should feel unhurried and literary — normal case, generous leading, no letterspacing. Inter should feel like printer's furniture — small, tracked, uppercase, quiet. Italic Newsreader is permitted for emphasis inside ledes only, never for whole blocks.

## Layout

### Canvas System

Each slide is a fixed 1920×1080 stage. Slide padding is `64px 120px 56px`. Content stacks vertically: running head (top), centered main column (flex-centered), folio (bottom). The main column caps at a 34em measure for reading text; the title may extend to 1320px. No multi-column grids — the single centered measure is the layout system.

### Persistent Chrome

Two furniture elements appear on every slide:

- **Running head** (`{components.running-head}`) — work left, date right, tracked 14px smoke caps over a 1px tan hairline with 18px gap.
- **Folio** (`{components.folio}`) — 1px tan hairline, then source line left (Inter 500 16px ink), fleuron center (oxblood Newsreader 18px), page numeral right (Newsreader 600 20px oxblood).

No slide counter beyond the page mark, no navigation chrome, no progress devices — a book has folios, not dashboards.

### Composition Rules

The title block is always centered; the lede paragraph is left-aligned inside its centered 780px measure so the drop cap seats correctly. Kicker sits 0px above title with 36px title margin; the ornament divider sits 40px below the title and 8px above the lede. The folio pins to the bottom via flex layout, never absolutely over content.

Multi-paragraph blocks follow stanza rules: the drop cap opens the first paragraph only; paragraphs separate by 1em of whitespace with no first-line indent; a centered 200px tan hairline may separate distinct stanzas or arguments (at most one per slide beyond the ornament divider); a second ◆ divider is never used as an in-text separator.

## Depth and Elevation

This system has **no depth**. There are no shadows, no blur, no gradients, no layered surfaces. Hierarchy is carried entirely by scale (100px title vs 31px lede vs 16px furniture), weight (600 vs 400), and color (ink vs oxblood vs smoke). Any `box-shadow` or `text-shadow` value is a defect. Cards and panels do not exist; if content needs grouping, separate it with an ornament divider or a hairline rule.

## Shapes and Treatment

### Border Radius

Zero everywhere. Rules are hairlines, ornaments are glyphs, and there are no boxes to round. A `border-radius` greater than 0 anywhere is a defect.

### Border Weights

- **1px solid** — the only stroke in the system: running-head rule, kicker flanks, ornament flanks, folio rule.
- No 2px, no double rules, no dotted or dashed strokes. Weight contrast comes from glyph color, not stroke width.

### Decorative Element Types

**Chapter kicker** — Centered tracked-caps label in oxblood flanked by 120px oxblood hairlines. The slide's opening mark.

**Ornament divider** — 200px tan hairline pair broken by a centered oxblood ◆ diamond (14px). Sits between title and lede.

**Drop cap** — The lede's first letter set 3.1em / Newsreader 600 / oxblood / floated. The system's most recognizable mark.

**Fleuron** — A single ❦ glyph in oxblood Newsreader 18px centered in the folio. Used once per slide, never elsewhere.

**Folio** — Tan hairline with source-left / fleuron-center / numeral-right rhythm. Closes every slide.

**Running head** — Smoke tracked caps (work left, date right) over a tan hairline. Opens every slide.

**Figure procession** — The evidence-slide device for numerals: a centered stack of Newsreader 600 68px ink figures, each followed 12px below by an Inter 500 14px smoke tracked-caps label (0.24em, uppercase). Figures are separated by 32px gaps around a centered 200px 1px tan hairline. No oxblood in figures or labels — the four-mark budget is untouched — and never more than three figures per slide.

**Stanza head** — The sanctioned body subhead and the only subhead form: Inter 500 16px smoke tracked caps (0.34em, uppercase), centered, 40px above and 16px below. Serif caps lines and bolded body openers are not subheads; sequential stanzas (comparison included) are headed this way, never multi-columned.

No badges, no pills, no chips, no arrows, no bullets beyond standard text lists. If an element is not in this list, it does not belong.

## Do's and Don'ts

### Do

- Set every reading word in Newsreader and every furniture word in tracked Inter 500 — the two-voice separation is the system.
- Open every lede with the oxblood drop cap at 3.1em floated.
- Flank the chapter kicker with 120px oxblood hairlines at 24px gaps.
- Close every slide with the full folio: hairline, source left, fleuron center, numeral right.
- Keep the centered 34em measure and 1.7 lede leading on every reading block.
- Use the ornament divider between title and lede — never stack title directly on text.
- Stack evidence figures as the figure procession: serif figures, smoke caps labels, tan hairlines.
- Head stanzas with smoke Inter tracked caps — the stanza head is the only subhead.
- Keep surfaces matte cream with 1px hairlines only.
- Render verbatim content (title, subtitle, source) exactly as given; furniture never paraphrases content.

### Don't

- Don't add shadows, gradients, blur, or rounded corners anywhere — the page is flat paper.
- Don't set headlines in Inter or furniture in Newsreader (except the serif page numeral).
- Don't use oxblood for body text or grounds — four accent marks per slide, maximum.
- Don't introduce a second accent color; tan is for rules, smoke for quiet furniture text.
- Don't center the lede paragraph — it stays left-aligned so the drop cap seats.
- Don't track or uppercase Newsreader; don't set Inter furniture in sentence case (folio source excepted).
- Don't place two ornaments adjacent — one diamond divider, one fleuron per slide.
- Don't drop-cap beyond the first paragraph, and don't spend a second ◆ as an in-text separator.
- Don't add badges, pills, cards, or any chrome a printed book would not contain.

## Responsive Behavior

The finished deck is a fixed 1920×1080 stage scaled by one uniform transform (see Fixed-Stage Policy); it letterboxes on other viewports and never reflows. Historically the underlying proportions are fluid-friendly — the 34em measure and 1320px title cap were chosen so the same composition survives from page to poster — but generated output does not implement breakpoints, media queries, or component collapse. Verify long titles wrap to at most four balanced lines inside the stage before capture.

## CJK & International Content

When setting Korean or other CJK content, pair Newsreader's Latin voice with **Noto Serif KR** for reading text and **Noto Sans KR** for furniture text, loaded from Google Fonts alongside the Latin faces.

Recommended pairing:

| Role | Latin (default) | CJK counterpart |
|---|---|---|
| Titles / lede / body / drop cap | Newsreader 400–600 | Noto Serif KR 400–600 |
| Kicker / running head / folio | Inter 500 (tracked, uppercase) | Noto Sans KR 500 (no transform, no tracking) |

Loading (add alongside the Latin families):

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&family=Noto+Sans+KR:wght@500&display=swap" rel="stylesheet">
```

Universal CJK adjustments: set letter-spacing to 0 on every CJK run (the 0.24–0.34em furniture tracking breaks square glyphs); remove `uppercase` from CJK furniture; raise lede leading to 1.85 and title leading to 1.2; keep the drop cap — a CJK syllable block sets beautifully at 3.1em — in oxblood; keep all hairlines, the diamond divider, and the folio unchanged, since the furniture carries recognition when the faces change. Space CJK runs off from adjacent Latin with a normal word space.

Known CJK gap: Noto Serif KR has no true Newsreader-like book italic and its caps voice differs; tracked-caps furniture collapses to plain Noto Sans KR 500. The kicker keeps its flanking rules and oxblood color so the chapter-opening rhythm survives the face swap.

## Iteration Guide

1. Any new slide gets the running head (work left, date right, hairline below) and the folio (hairline, source left, fleuron center, numeral right). Furniture is never optional.
2. Any new title uses Newsreader 600 at 100px (chapter) or 64px (section), centered, balanced, normal case.
3. Any new lede uses Newsreader 400 at 31px / 1.7 with the oxblood drop cap, left-aligned in a 780px measure.
4. Any new kicker uses the chapter-kicker component — oxblood tracked caps with 120px flanks. Never a plain label.
5. Any new separator uses the ornament divider or a 1px tan hairline. No other divider exists.
6. Any new accent must be oxblood and must be one of the four marks (kicker, drop cap, diamond, page mark). A fifth accent is a defect.
7. Any new measure stays at or under 34em for reading text; the title cap is 1320px.
8. Any new color must come from the five declared tokens; tints via opacity only.
9. Any new slide keeps the matte cream ground — no texture, no vignette, no gradient wash.
10. Verify every new slide at 1920×1080 for title wrap (≤4 lines) and folio clearance before capture.
11. Any new evidence figure uses the figure-procession device: Newsreader 600 68px ink figures with smoke tracked-caps labels, tan hairlines between, at most three per slide.
12. Any new body subhead uses the stanza-head device — smoke Inter tracked caps — never a serif caps line or a bolded body opener.
13. Any new multi-paragraph block drops the cap on the first paragraph only, separates paragraphs with whitespace, and spends at most one tan hairline between stanzas; never a second ◆ divider.

## Known Gaps

- **Fonts**: Newsreader / Inter via Google Fonts CDN (`display=swap`); fallbacks Georgia, serif / system-ui, sans-serif. No font files committed. Offline rendering falls back to system stacks and loses the editorial serif voice.
- **No shadow token**: `{shadows.none}` is intentionally `none`; export targets that require depth cues have nothing to map — this is by design, not an omission.
- **Fleuron and diamond glyphs** (❦ ◆) depend on system serif coverage; if a renderer lacks them they fall back to Georgia/serif or show tofu — verify on the export target.
- **Drop cap via `::first-letter`** floats correctly in browsers and modern renderers; rigid paginators may need a manual two-span cap as a fallback.
- **Long titles** beyond ~90 characters wrap to four lines at 100px; beyond that, reduce to 84px rather than reflowing furniture.

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in design |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used | full | N/A — static page |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows by design |
| 5 | Gradients | Not used | full | N/A — flat cream ground |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Lede ink at 82% opacity | full | Nearest opaque warm gray `#3A352E` |
| 8 | Custom fonts | Newsreader 400/600 + Inter 500 via Google Fonts CDN | partial | Embedded Newsreader/Inter; fallback Georgia / system-ui |
| 9 | Absolute-positioned decor | Not used — all furniture in flow | full | Native text boxes and hairline shapes |
