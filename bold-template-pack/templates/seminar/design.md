---
version: alpha
name: Seminar
description: A quiet academic text system on a two-column page. A 66-character Source Serif argument column carries title and lede flush-left while a wide margin holds hanging citations and content sidenotes in small Inter, keyed by navy superscript markers. Whitespace closes the argument above the footnote. White, ink, navy, gray — plain, structured, unshadowed, no rules.
colors:
  white: "#FFFFFF"
  ink: "#222222"
  navy: "#1F3A5F"
  gray: "#8A8A8A"
  hairline: "#E3E3E3"
shadows:
  none: "none"
typography:
  argument-title:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "88px"
    fontWeight: 700
    lineHeight: 1.12
  section-title:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: 1.15
  lede:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.55
  body:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.65
  sidenote:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  sidenote-strong:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.6
  footnote:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  marker:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1
  date-note:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1
  page-number:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
spacing:
  pad-slide-y: 64px
  pad-slide-x: 120px
  argument-width: 1080px
  margin-gap: 120px
  margin-width: 400px
  measure: 66ch
  footnote-rule: 160px
  sidenote-gap: 32px
  margin-align: 18px
canvas:
  width: 1920px
  height: 1080px
components:
  section-marker:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: 28px
    fontWeight: 700
    color: "{colors.navy}"
    description: "Navy § 1 marker opening the page, date opposite in gray Inter."
  sidenote:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 17px
    lineHeight: 1.6
    hangingIndent: 24px
    description: "Margin note in Inter with navy superscript marker and hanging indent."
  hanging-citation:
    paddingLeft: 24px
    textIndent: "-24px"
    description: "Citation line wrapping under a hanging indent beneath its marker."
  footnote-rule:
    status: retired
    successor: "whitespace"
    description: "RETIRED in the typography-only vocabulary: the 160px rule is removed. The footnote follows the argument after a whitespace gap."
  footnote:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 17px
    color: "rgba(34, 34, 34, 0.72)"
    description: "Source line below the argument, whitespace-separated, with a navy superscript marker."
  sup-marker:
    fontSize: 0.72em
    color: "{colors.navy}"
    fontWeight: 600
    description: "Navy superscript key tying margin notes and footnotes to the argument."
  page-number:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    color: "{colors.gray}"
    description: "Gray page numeral at the bottom-right foot of the page."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.

## Overview

Seminar is a **quiet academic text system** modeled on the printed handout: one argument column, one margin, no rules. The left column sets a Source Serif title and italic lede on a 66-character measure; the wide right margin holds sidenotes and a hanging citation in small Inter; whitespace closes the argument above the footnoted source line. Navy section markers (§) and superscript keys are the only ornament.

The type stack is two faces with column roles. **Source Serif 4** (700 titles, 400/italic ledes and body) is the argument voice — everything the speaker would read aloud. **Inter** (400 notes, 600 citation leads, 500 page numeral) is the apparatus voice — sidenotes, citations, footnotes, dates, folios. Serif argues; sans annotates. A serif sidenote or a sans headline breaks the contract.

The palette is four restrained tokens: white ground `{colors.white}`, ink `{colors.ink}` for the argument, navy `{colors.navy}` for markers, and gray `{colors.gray}` for quiet notes (with a derived `{colors.hairline}` tint retained but unused in the typography-only vocabulary). There are no fills, no shadows, no gradients, no rules — emphasis comes from the margin apparatus, weight contrast, and whitespace.

**Density philosophy: sparse but apparatus-rich.** The page looks empty at first glance and rewards a second one: markers keying margin to argument, a hanging citation, a footnoted source. A typical slide carries one claim plus its marginalia. If a slide needs more, add another sidenote — never a card, badge, or panel.

**Key Characteristics:**
- Source Serif argument column (66ch, flush-left) beside a 400px Inter sidenote margin.
- Hanging citations and content sidenotes in the margin, keyed by navy superscript markers.
- No rules per slide: whitespace closes the argument above the footnote.
- Navy § section markers opening the page and keying margin notes.
- Plain white ground; zero shadows, zero fills, zero rounded chrome.
- Page numeral in gray Inter at the bottom-right foot, nothing else in the footer.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The only ground. Plain seminar-room white.
- **Ink** (`{colors.ink}` — `#222222`): Argument text — titles, ledes, body. Softened black.
- **Navy** (`{colors.navy}` — `#1F3A5F`): Markers only — § signs, superscript keys, citation leads. Never body text.
- **Gray** (`{colors.gray}` — `#8A8A8A`): Quiet notes, the date, the page numeral.
- **Hairline** (`{colors.hairline}` — `#E3E3E3`): Derived tint, retained as a token; keyline usage retired. Never text.

### Defaults

- **Default surface background**: `{colors.white}`, flat, no texture.
- **Default headline color**: `{colors.ink}` at 88px / 700, flush-left.
- **Default lede color**: `{colors.ink}` at 78% opacity, italic.
- **Default sidenote color**: `{colors.ink}` at 72% opacity for notes, `{colors.navy}` for markers.
- **Default close**: a whitespace gap above the footnote — never a rule, never a keyline.

Opacity tints of ink keep small Inter notes quiet without introducing new grays; navy and gray stay at full strength.

## Typography

### Font Family

**Source Serif 4** is the argument face — a sturdy text serif for titles (700), ledes (400 italic), body (400), and the § markers (700, navy). It sets everything in the left column.

**Inter** is the apparatus face — a neutral grotesque for sidenotes (400), citation leads (600), footnotes (400), the date (400), and the page numeral (500). It sets everything in the margin, foot, and head except the § marker.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.argument-title}` | 88px | Source Serif 4 | 700 | Argument title, flush-left, 66ch |
| `{typography.section-title}` | 56px | Source Serif 4 | 700 | Section opener inside a deck |
| `{typography.lede}` | 30px | Source Serif 4 | 400 italic | Subtitle lede under the title |
| `{typography.body}` | 24px | Source Serif 4 | 400 | Paragraph body |
| `{typography.sidenote}` | 17px | Inter | 400 | Margin notes and citations |
| `{typography.sidenote-strong}` | 17px | Inter | 600 | Citation leads in the margin |
| `{typography.footnote}` | 17px | Inter | 400 | Source line below the argument |
| `{typography.marker}` | 28px | Source Serif 4 | 700 | Navy § section markers |
| `{typography.date-note}` | 17px | Inter | 400 | Gray date opposite the marker |
| `{typography.page-number}` | 16px | Inter | 500 | Gray page numeral, bottom-right |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every argument title is flush-left Source Serif 700 at 88px/1.12.** Centered or tracked titles do not exist.
- **Every lede is Source Serif italic at 30px/1.55 in 78%-ink.** Upright or full-ink ledes read as body.
- **Every sidenote carries a navy superscript marker** (`{components.sup-marker}`) and a 24px hanging indent. Unkeyed margin text is a defect.
- **Every citation wraps under its hanging indent** — first line at the marker, continuation lines indented 24px.
- **Every slide closes its argument with whitespace above the footnote.** No rule, no keyline — a rule anywhere is a defect.
- **Every § marker is navy Source Serif 700 at 28px.** The section sign appears in no other style.
- **Every footnote sets its source verbatim in 17px Inter at 72%-ink** with a navy superscript key.

### Typography Principles

The voice contrast is **argued serif ↔ annotating sans**. Source Serif should feel read aloud — flush-left, normal case, comfortable leading, italic reserved for the lede. Inter should feel penciled in the margin — small, quiet, precise, never tracked, never uppercase. Italics belong to the serif lede only; Inter stays upright except for cited phrases.

## Layout

### Canvas System

Each slide is a fixed 1920×1080 stage with `64px 120px` padding. The page is a two-column grid: a 1080px argument column, a 120px gutter, and a 400px margin column. The § marker row opens the page (marker left, date right); the argument stacks title → lede → footnote with a whitespace close; the margin stacks sidenotes from the title's cap height (18px offset); the page numeral sits bottom-right.

### Persistent Chrome

The apparatus, not furniture, persists:

- **Section marker row** (`{components.section-marker}`) — navy § 1 left, gray date right, no rule.
- **Footnote** (`{components.footnote}`) — closing the argument after a whitespace gap.
- **Page numeral** (`{components.page-number}`) — gray, bottom-right.

No headers, no footers, no counters beyond the numeral, no navigation chrome. The margin is the interface.

### Composition Rules

The margin's first baseline aligns to the title's cap height via an 18px top offset. Sidenotes stack with 32px gaps and never exceed the argument column's height — a third sidenote must fit above the footnote's top edge. The footnote text wraps within the argument column. The page numeral pins to the bottom-right padding corner, clear of the footnote by at least 120px.

## Depth and Elevation

This system has **no depth**. No shadows, no fills, no gradients, no blur, no layered panels. Position on the page — argument versus margin — is the only spatial signal, and hierarchy within a column comes from scale and weight. Any `box-shadow`, background fill other than white, or `text-shadow` is a defect.

## Shapes and Treatment

### Border Radius

Zero everywhere, trivially — there are no boxes, pills, or buttons to round. The page is type on white; radius never arises.

### Border Weights

No strokes exist in this system. The retired 160px footnote rule and hairline margin separators are documented for history only: the argument earns its close with whitespace.

### Decorative Element Types

**Section marker** — Navy § 1 in Source Serif 700 at 28px opening the page, gray Inter date opposite.

**Sidenote** — 17px Inter margin note with navy superscript marker and 24px hanging indent.

**Hanging citation** — Author-date citation in the margin, 600 lead, wrapping under a hanging indent.

**Superscript marker** — Navy 0.72em 600 key tying margin notes and footnotes to the argument.

**Footnote** — Verbatim source line in 17px 72%-ink Inter with a navy superscript key, whitespace-separated from the argument.

**Page numeral** — Gray 16px Inter 500 numeral at the bottom-right foot.

No bullets beyond text lists, no arrows, no badges, no dividers, no rules. If an element is not in this list, it does not belong.

## Do's and Don'ts

### Do

- Argue in the left column in Source Serif and annotate in the margin in Inter — the column/voice split is the system.
- Key every margin note and footnote with a navy superscript marker and hanging indent.
- Close every argument with whitespace above the footnote.
- Open every page with the navy § marker and the gray date opposite.
- Draw margin notes strictly from real content phrases — citations, dates, and content numerals.
- Align the margin's first baseline to the title's cap height with the 18px offset.
- Keep the ground plain white with no fills, shadows, or textures.
- Set the footnote source verbatim; the apparatus never paraphrases content.

### Don't

- Don't add rules, header keylines, or margin separators — separation is whitespace only.
- Don't center, track, or uppercase the argument title — flush-left serif, always.
- Don't set sidenotes in serif or headlines in Inter; the voices never swap.
- Don't invent margin content — no lorem notes, no decorative citations, no placeholder keys.
- Don't fill, shadow, round, or panel anything; the page is type on white.
- Don't use navy for body text or gray for the argument — markers and quiet notes only.
- Don't stack sidenotes past the footnote's top edge; the margin ends where the argument closes.
- Don't add footers, counters, or navigation chrome beyond the single page numeral.

## Responsive Behavior

The finished deck is a fixed 1920×1080 stage scaled by one uniform transform (see Fixed-Stage Policy); it letterboxes on other viewports and never reflows. The two-column grid is tuned in absolute stage coordinates: the 1080px argument column absorbs long titles by wrapping (verify ≤6 title lines and footnote clearance before capture) while the 400px margin holds fixed sidenote positions. No breakpoints or collapse rules ship in generated output.

## CJK & International Content

When setting Korean or other CJK content, pair the Latin voices with **Noto Serif KR** for the argument column and **Noto Sans KR** for the margin apparatus, loaded from Google Fonts alongside the Latin faces.

Recommended pairing:

| Role | Latin (default) | CJK counterpart |
|---|---|---|
| Title / lede / body / § marker | Source Serif 4 | Noto Serif KR 400–700 |
| Sidenotes / citations / footnote / date | Inter 400–600 | Noto Sans KR 400–500 |

Loading (add alongside the Latin families):

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@400;500&display=swap" rel="stylesheet">
```

Universal CJK adjustments: letter-spacing 0 on all CJK runs; no uppercase transforms; raise title leading to 1.3, lede to 1.7, and sidenote to 1.75; set the lede upright (CJK has no italic — use Noto Serif KR 400 at full ink instead of the 78% italic treatment); keep the hanging indents, superscript markers, and the whitespace close unchanged, since the apparatus carries recognition across scripts. The § marker stays in Source Serif even in CJK builds.

Known CJK gap: the italic-lede distinction collapses (no CJK italic), so lede-vs-body contrast must come from size and color alone. Noto Sans KR 500 stands in for Inter 600 citation leads with slightly less punch; keep the navy marker to preserve the keying signal.

## Iteration Guide

1. Any new slide opens with the § marker row (navy marker left, gray date right) and closes with the footnote and page numeral after a whitespace gap.
2. Any new title uses Source Serif 700 at 88px/1.12, flush-left in the 1080px argument column.
3. Any new lede uses Source Serif italic at 30px/1.55 in 78%-ink, directly under the title.
4. Any new sidenote uses 17px Inter with a navy superscript marker and 24px hanging indent, drawn from real content.
5. Any new citation uses the hanging-citation component — 600 lead, wrapped lines indented.
6. Any new slide carries no rules: the footnote follows the argument after a whitespace gap.
7. Any new margin stack aligns its first baseline to the title cap height (18px offset) with 32px gaps.
8. Any new color comes from the five declared tokens; tints via ink opacity only.
9. Any new slide keeps the plain white ground — no fills, shadows, or textures.
10. Verify every new slide at 1920×1080 for title wrap (≤6 lines), sidenote/footnote clearance, and numeral position before capture.
11. Any new footnote key must differ from every margin-note key on the slide, and no margin note may restate the footnote — a duplicated key or an echoing note is a defect; each margin note must add information drawn from real content phrases.

## Known Gaps

- **Fonts**: Source Serif 4 / Inter via Google Fonts CDN (`display=swap`); fallbacks Georgia, serif / system-ui, sans-serif. No font files committed. Offline rendering falls back to system stacks and loses the serif-argument voice.
- **No shadow token**: `{shadows.none}` is intentionally `none`; depth-requiring export targets have nothing to map — by design.
- **Hanging indents** use `padding-left` + negative `text-indent`; rigid paginators may need explicit first-line/inset paragraph styles as a fallback.
- **Superscript markers** use `<sup>` with 0.72em sizing; export targets without `<sup>` styling need a raised-baseline character style.
- **Long titles** beyond ~110 characters wrap to six lines at 88px; beyond that, reduce to 76px rather than narrowing the margin.

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in design |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used | full | N/A — static page |
| 4 | Pixel / hard offset shadows | Not used | full | N/A — no shadows by design |
| 5 | Gradients | Not used | full | N/A — flat white ground |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A |
| 7 | Transparency layers | Ink at 78%/72% for lede/notes | full | Nearest opaque grays `#4A4A4A` / `#5C5C5C` |
| 8 | Custom fonts | Source Serif 4 + Inter via Google Fonts CDN | partial | Embedded faces; fallback Georgia / system-ui |
| 9 | Absolute-positioned decor | Page numeral only, fixed corner | full | Native text box at fixed coordinates |
