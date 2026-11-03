---
version: alpha
name: Field Manual
description: A technical-manual presentation system on warm dotted-grid paper. Archivo Bold caps issue headers, IBM Plex Sans carries body, and IBM Plex Mono tags every step, figure, and note with a visible reference code. A 60/40 text-plus-figure split with dashed leader lines, bordered callout boxes, and caution-amber warning chips makes every slide read as one page of a larger controlled document.
colors:
  paper: "#FAF8F3"
  ink: "#1A1A1A"
  procedural-blue: "#0B5FFF"
  caution-amber: "#FFB000"
  muted: "#6E6A5E"
  dot-grid: "rgba(26, 26, 26, 0.14)"
  box-fill: "#FFFFFF"
shadows:
  none: "none"
typography:
  manual-title:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "92px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
    textTransform: uppercase
  section-head:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.1
    textTransform: uppercase
  subhead:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    textTransform: uppercase
  doc-header:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.12em"
    textTransform: uppercase
  step-label:
    fontFamily: "'IBM Plex Sans', sans-serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.3
    textTransform: uppercase
  body:
    fontFamily: "'IBM Plex Sans', sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.5
  body-compact:
    fontFamily: "'IBM Plex Sans', sans-serif"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: 1.55
  callout:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.5
  figure-tag:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.14em"
    textTransform: uppercase
  warn-chip:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.1em"
    textTransform: uppercase
  section-tag:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1
spacing:
  baseline: 8px
  frame-margin: 32px
  frame-padding: 56px
  gutter: 48px
  split-left: "60%"
  split-right: "40%"
  hairline: 1px
  heavy-rule: 3px
  pad-box: "28px 32px"
  gap-steps: 20px
  chip-padding: "12px 20px"
canvas:
  width: 1920px
  height: 1080px
components:
  doc-header:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 20px
    fontWeight: 500
    description: "Three-part mono strip: document code left, procedure title center, date right. Closed by the double rule."
  double-rule:
    borderTop: "3px solid {colors.ink}"
    borderBottom: "1px solid {colors.ink}"
    gap: 8px
    description: "Heavy 3px rule over a 1px rule with an 8px gap. Opens and closes the document frame."
  warn-chip:
    background: "{colors.caution-amber}"
    color: "{colors.ink}"
    padding: "12px 20px"
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 19px
    description: "Amber filled warning chip with a leading warning glyph. The only filled element in the system."
  step-row:
    numeralSize: 52px
    border: "1px solid {colors.ink}"
    description: "Numbered step: bordered 56px numeral square, uppercase Plex Sans label, dashed leader, mono section tag."
  leader-line:
    borderBottom: "2px dashed {colors.muted}"
    description: "Dashed leader stitching steps to tags and figures to notes. Always muted, always 2px dashes."
  figure-box:
    border: "1px solid {colors.ink}"
    background: "{colors.box-fill}"
    padding: "28px 32px"
    description: "White bordered exhibit box with a mono figure tag header and check-row contents."
  note-box:
    border: "1px solid {colors.procedural-blue}"
    background: "{colors.box-fill}"
    padding: "24px 28px"
    description: "Blue-bordered callout box: mono blue NOTE tag over a short Plex Sans finding."
  check-row:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 20px
    description: "Exhibit checklist row: boxed glyph (done/open), mono label, dashed leader, mono item tag."
  revision-footer:
    borderTop: "1px solid {colors.ink}"
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 19px
    description: "Ruled footer: document code left, page right, mono uppercase."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Field Manual is a **technical-manual presentation system**. Its foundational premise is the **numbered artifact**: every step, figure, note, and warning carries a visible reference code (`01`, `FIG. 01`, `NOTE 01`, `§2.1`), so each slide reads as one page of a larger controlled document rather than a standalone canvas. The frame is a document: doc-header strip, double rule, ruled sections, revision footer.

The type stack is three faces with procedural roles. **Archivo Bold caps** issues orders — titles, section heads, and step-adjacent heads, always uppercase, always left-aligned. **IBM Plex Sans** explains — body, subtitles, note findings, and step labels in sentence or uppercase depending on the component. **IBM Plex Mono** tags — document codes, figure tags, section references, check rows, chips, and footer. The mono voice is the system's paperwork: if it looks stamped, filed, or referenced, it is Plex Mono.

The palette is **warm paper and ink** with two functional accents. **Procedural blue** marks notes, figure tags, and informational chrome. **Caution amber** fills warning chips — the only filled elements anywhere. Blue never fills large areas; amber never appears outside chips and open-checkbox glyphs. Muted taupe grays secondary text and dashed leaders.

Layout follows a **60/40 split**: ruled text with numbered steps on the left, a bordered figure column with exhibits and callout boxes on the right, stitched together with dashed leader lines. The ground is dotted-grid paper — fine 1px dots on a 24px grid at 14% ink — giving every surface the feel of engineering paper.

**Density philosophy: dense but ruled.** These slides carry more elements than an editorial system allows — header, title, steps, figure, note, footer — but every element sits inside a ruled section with a visible tag, so density reads as thoroughness rather than clutter. When content grows, the title steps down (92 → 64 → 44px) and steps compress; the figure column keeps exactly one exhibit plus one note.

**Key Characteristics:**
- Doc header strip with mono document code, centered procedure title, and date — closed by a 3px + 1px double rule.
- Numbered steps with bordered numeral squares, dashed leader lines, and mono section tags (`§2.1`).
- Bordered figure boxes (`FIG. 01`) with check-row exhibits and dashed leaders to callout notes.
- Blue-bordered `NOTE` callout boxes pairing a mono tag with a short Plex Sans finding.
- Caution-amber warning chips — the only filled elements in the system.
- Fine dotted-grid paper ground with an 8px baseline and ruled sections throughout.
- Three-face discipline: Archivo caps issue, Plex Sans explain, Plex Mono tag.
- Zero shadows, zero gradients, zero border-radius; boxes are 1px borders on white or paper.

## Colors

### Palette

- **Paper** (`{colors.paper}` — `#FAF8F3`): The warm ground, always carrying the dotted grid. Reads as aged but clean stock.
- **Ink** (`{colors.ink}` — `#1A1A1A`): All type, rules, borders, and numeral squares. Warm near-black.
- **Procedural Blue** (`{colors.procedural-blue}` — `#0B5FFF`): Note boxes, figure tags, informational markers, checked-box glyphs. Never large fills, never body text.
- **Caution Amber** (`{colors.caution-amber}` — `#FFB000`): Warning-chip fills and open-checkbox glyphs only. The system's alert color.
- **Muted** (`{colors.muted}` — `#6E6A5E`): Secondary text, dashed leaders, and caption lines. Warm gray-taupe.
- **Dot Grid** (`{colors.dot-grid}` — `rgba(26,26,26,0.14)`): 1px dots on a 24px grid over the paper.
- **Box Fill** (`{colors.box-fill}` — `#FFFFFF`): Figure and note box interiors — white cards pinned on the paper.

### Defaults

- **Default surface background**: `{colors.paper}` with the dotted grid. Figure and note boxes punch white over it.
- **Default headline color**: `{colors.ink}`, always caps, always Archivo 700.
- **Default body text color**: `{colors.ink}`; secondary lines in `{colors.muted}`.
- **Default tag color**: `{colors.ink}` for structural tags; `{colors.procedural-blue}` for note/figure tags.
- **Default chip treatment**: `{colors.caution-amber}` fill with ink mono text and a leading `⚠` glyph.
- **Default box borders**: 1px ink for figures and steps; 1px blue for notes.
- **Default leader lines**: 2px dashed `{colors.muted}`.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**Archivo** is the command face — Bold (700), always caps, used for titles, section heads, and subheads. Archivo issues; it never explains at length and never appears in sentence case.

**IBM Plex Sans** is the explanation face — Regular (400) for body and subtitles, Medium (500) uppercase for step labels. It carries every sentence-length run in the system.

**IBM Plex Mono** is the paperwork face — Medium (500) for tags, codes, chips, check rows, and footer; Regular (400) for section references. If an element looks stamped, filed, or cross-referenced, it is Plex Mono.

Never use Archivo for body, never use Plex Sans for reference codes, never use Plex Mono for headlines. The command/explain/tag split is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.manual-title}` | 92px | Archivo | 700 | Cover title — caps, tight, left-aligned |
| `{typography.section-head}` | 44px | Archivo | 700 | Standard slide headline, caps |
| `{typography.subhead}` | 28px | Archivo | 700 | Sub-section head, caps |
| `{typography.doc-header}` | 20px | Plex Mono | 500 | Doc strip codes and procedure title |
| `{typography.step-label}` | 26px | Plex Sans | 500 | Uppercase step labels |
| `{typography.body}` | 30px | Plex Sans | 400 | Cover subtitle |
| `{typography.body-compact}` | 23px | Plex Sans | 400 | Standard body and note findings |
| `{typography.callout}` | 20px | Plex Mono | 500 | Check rows and mono callouts |
| `{typography.figure-tag}` | 19px | Plex Mono | 500 | Figure/note tags, tracked caps |
| `{typography.warn-chip}` | 19px | Plex Mono | 500 | Warning chip text |
| `{typography.section-tag}` | 19px | Plex Mono | 400 | Section references (`§2.1`, `A-3`) |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every Archivo header is uppercase.** Sentence-case Archivo does not exist in this system.
- **Every step carries a bordered 52px numeral square**, a dashed leader, and a mono section tag. A step without its tag reads as an unordered bullet and breaks the procedural voice.
- **Every figure box opens with a tracked mono tag** (`FIG. 01 — …`) with a blue square bullet. Untagged boxes read as generic cards.
- **Every note box pairs a blue mono tag** (`NOTE 01`) with a short Plex Sans finding. Tag without finding (or reverse) is incomplete.
- **Every warning chip is amber-filled with a leading `⚠` glyph** in mono caps. Outline-only or chipless warnings do not exist.
- **Every check row carries a boxed glyph** (`☑` blue for done, `☐` amber-ink for open) plus a dashed leader and item tag.
- **Every doc header closes with the double rule** (3px over 1px, 8px gap). Single rules never frame the document.

### Typography Principles

The voice contrast is **command ↔ explanation ↔ paperwork**. Archivo orders, Plex Sans clarifies, Plex Mono files. Italic is never used — emphasis comes from chips, boxes, and tags, never slant.

Headers should always feel **issued** — caps, left-aligned, followed by ruled content. Body should feel **legible under lamplight** — generous line-height (≥1.5), sentence case, no letterspacing. Mono should feel **stamped** — tracked caps for tags, plain for references.

### Defaults

- **Default size for a cover title**: `{typography.manual-title}` (92px) — steps down to 64px past ~45 characters.
- **Default size for a slide headline**: `{typography.section-head}` (44px).
- **Default size for body**: `{typography.body-compact}` (23px); covers use `{typography.body}` (30px) for the subtitle.
- **Default mono tag size**: `{typography.figure-tag}` (19px) with +0.14em tracking.
- **Default step label**: `{typography.step-label}` (26px) Plex Sans Medium uppercase.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. A document frame insets 32px from the stage edge with a 2px ink border; inside the frame, 56px padding holds the content. The doc-header strip sits at the top of the frame, the revision footer at the bottom, and the 60/40 split fills the middle with a 48px gutter.

The 8px baseline governs vertical rhythm: header heights, step rows, box padding, and chip heights all resolve to multiples of 8. The dotted grid (24px) is the visible manifestation of this discipline.

### Persistent Chrome

Three elements appear on every slide:

- **Document frame** — 2px ink border at 32px inset, with the doc-header strip and double rule at top.
- **Figure column** — the right 40%: exactly one bordered exhibit plus one note box, stitched with a dashed leader.
- **Revision footer** — `{components.revision-footer}`: 1px rule, document code left, page right.

The dotted-grid paper ground prints on every surface.

### Procedural Rhythm

The left column reads top-down as a procedure: chip → title → subtitle → steps → source line. The right column reads as evidence: figure → leader → note. Leaders always run from the structural element toward its tag — left-to-right in steps, top-to-bottom between figure and note.

## Depth and Elevation

### Flat Paper by Doctrine

Field Manual has **no depth system**. There are no shadows, no gradients, no translucency. Hierarchy comes from borders (2px frame, 1px boxes), rules (3px/1px), fills (white boxes on paper, amber chips), and the tag system.

### Boxes as Elevation

- **White figure/note boxes** (`{components.figure-box}`, `{components.note-box}`) punch forward from the dotted paper by fill contrast alone — no shadow, just a 1px border and white fill.
- **Amber chips** (`{components.warn-chip}`) are the highest-emphasis elements: the only fills outside white boxes.
- **Numeral squares** are 1px-bordered, paper-filled, 56px — they read as stamped, not raised.

### Paper Texture as Depth

The dotted grid gives the ground a material quality that flat color cannot. Boxes feel pinned to engineering paper because the dots stop at the box edge (boxes are opaque white). Never set boxes translucent.

## Shapes and Treatment

### Border Radius

Zero everywhere. Frames, boxes, chips, numeral squares, and checkboxes are all square. A rounded corner reads as consumer product, not controlled document.

### Border Weights

- **3px solid** — the heavy rule in the double-rule frame treatment only.
- **2px solid** — the outer document frame border.
- **1px solid** — figure boxes, note boxes, numeral squares, table rules, footer rule. The system's workhorse weight.
- **2px dashed** — leader lines in muted taupe. The only dashed element; never used for box borders.

Borders are always solid ink or blue (boxes), except leaders which are always dashed muted.

### Decorative Element Types

**Doc header** — Three-part mono strip (code / procedure / date) closed by the double rule. Opens every slide identically.

**Double rule** — 3px rule over 1px rule with an 8px gap. Frames the document top (and optionally bottom).

**Warning chip** — Amber-filled mono caps chip with a leading `⚠`. Used for cautions and pre-ship alerts.

**Step row** — Bordered numeral square + uppercase label + dashed leader + section tag. The procedural workhorse.

**Leader line** — 2px dashed muted stitching between elements and their tags.

**Figure box** — White 1px-bordered exhibit with a mono figure tag and check-row contents.

**Check row** — Boxed glyph + mono label + dashed leader + item tag. Qualitative exhibits, never fabricated numbers.

**Note box** — Blue 1px-bordered callout with a mono blue tag and a short finding.

**Approval strip** — Ruled mono block under the source line: prepared-by, date, and a dashed sign-off line. Closes the text column on cover slides.

**Revision footer** — 1px rule with mono document code and pagination.

**Ruled table** — On data slides: mono tracked header row, 1px ink top rule, dashed row dividers, mono reference column.

## Do's and Don'ts

### Do

- Number everything: steps, figures, notes, checks, and pages all carry visible reference codes.
- Keep the doc header + double rule + revision footer on every slide. The frame is the identity.
- Use Archivo caps for every header; Plex Sans for every sentence; Plex Mono for every tag.
- Stitch steps to tags and figures to notes with 2px dashed muted leaders.
- Fill warning chips amber — and fill nothing else except white boxes.
- Keep exhibits qualitative (check rows, gap lists) unless the data is genuinely sourced.
- Punch figure/note boxes white over the dotted paper; keep boxes opaque.
- Step the title down (92 → 64 → 44px) as titles lengthen past ~45 characters.
- Tag figures and notes with blue mono tags and square blue bullets.
- Let the dotted grid show through every paper region — never cover the ground fully.

### Don't

- Don't use sentence-case Archivo or caps Plex Sans body. Each face keeps its case discipline.
- Don't add shadows, gradients, or rounded corners anywhere.
- Don't use blue for body text or large fills. Blue is a tag and border color.
- Don't use amber outside warning chips and open-checkbox glyphs.
- Don't fabricate chart data. If numbers are not sourced, use check-row exhibits instead of bars.
- Don't remove the figure column to "make room." Compress steps instead.
- Don't use solid leaders or dotted leaders — leaders are always 2px dashed muted.
- Don't use italic for emphasis — use chips, boxes, and tags.
- Don't set boxes translucent. White boxes are opaque by doctrine.
- Don't center headers or body. Left-aligned, ruled, tagged — always.

## Responsive Behavior

Field Manual is a **fixed-stage system** built for 1920×1080 output. All sizes are absolute pixels; there are no breakpoints in the generated deck. The stage scales uniformly via a single transform (letterboxed, no reflow).

### Scaling Behavior

- The 32px frame inset, 2px frame border, and 56px inner padding are fixed at 1920×1080 and scale with the stage transform.
- The 60/40 split and 48px gutter are fixed proportions of the frame interior.
- Title sizes step by content length (92 → 64 → 44px), not by viewport.

### Component Breakpoints

None. The fixed-stage model has no viewport breakpoints. (Source-history note: a fluid ancestor stacked the figure column below the text under 900px; that behavior is superseded by the fixed-stage policy above.)

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`; reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Transitions are instant cuts — pages turn, they do not glide.

### Animation Triggers

None. This system has no animation: no entry transitions, no reveals, no check-draws. Static pages only.

### Print Behavior

The system prints 1:1 — paper ground (light enough for laser), ink type, blue notes, amber chips. The dotted grid prints cleanly. For static export, screenshots preserve frame, boxes, and leaders exactly.

## CJK & International Content

When using this system for Korean (or other CJK) content, swap the Latin stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Headers / step labels | Archivo 700 (caps) | Noto Sans KR 800 (no transform, no tracking) |
| Body / findings | IBM Plex Sans 400–500 | Noto Sans KR 400–500 |
| Tags / codes / chips / checks | IBM Plex Mono 400–500 | Noto Sans KR 500 with mono-styled Latin kept in Plex Mono for codes |

### Mixed-Content Strategy

**Strategy B** — split pairing. CJK prose (titles, body, findings) renders in Noto Sans KR; reference codes that are Latin-only (`FM-11`, `§2.1`, `FIG. 01`, `NOTE 01`, `A-3`) stay in IBM Plex Mono to preserve the stamped paperwork voice. Mixed lines keep an ASCII space between CJK and Latin runs. Hierarchy survives through weight plus the frame/box/chip system, which translates unchanged.

### Loading

Add to the slide `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15–20% from the Latin spec. Titles 1.2–1.25 (up from 1.05–1.1), body 1.7–1.8 (up from 1.5–1.55).
- **Letter-spacing**: set to 0 on every CJK run. Tracked mono tags (+0.1–0.14em) apply to Latin codes only, never to CJK text.
- **Text transform**: never apply `uppercase` to CJK text. Korean headers render in Noto Sans KR 800 at 0 tracking.
- **Punctuation**: use full-width CJK punctuation where the locale demands it; keep `·` and `▸` separators with spaces in mixed lines.
- **No trailing period on display headlines**: omit terminal punctuation on cover titles per CJK convention.
- **Space between CJK and Latin**: keep an ASCII space between Hangul/Hanja and adjacent Latin or digits.
- **One font per sentence**: Noto Sans KR handles CJK prose; Plex Mono handles Latin-only codes. Never let the browser fall back mid-run.

### Aesthetic Notes for This System

The frame carries the CJK build. Reference codes (`FM-11`, `FIG. 01`, `§2.1`) stay in Plex Mono — they are locale-neutral paperwork — while prose moves to Noto Sans KR. The double rule, dotted paper, boxes, leaders, and amber chips translate 1:1 and do more identity work in CJK builds than in Latin ones.

### Known CJK Gap

- **No Korean mono face with the Plex Mono paperwork voice.** Noto Sans KR 500 stands in for mono-styled Korean; only Latin codes keep true monospaced rhythm. Korean tags lose the typewriter-stamp signal.
- **Command voice softens.** Archivo caps have no Korean equivalent; Noto Sans KR 800 headers without caps or tracking feel informative rather than issued. The frame and chips must carry the authority.

## Iteration Guide

1. Any new slide keeps the document frame, doc header + double rule, figure column, and revision footer. Don't skip the paperwork.
2. Any new header uses Archivo 700 caps. Any new sentence uses Plex Sans. Any new code, tag, or check uses Plex Mono.
3. Any new step gets a bordered numeral square, a dashed leader, and a section tag — all three, no exceptions.
4. Any new exhibit goes in a bordered figure box with a mono figure tag; stitch it to its note with a dashed leader.
5. Any new note is a blue-bordered box with a blue mono tag and a one-to-two-sentence Plex Sans finding.
6. Any new warning is an amber chip with a leading `⚠` — never an outline, never plain text.
7. Any new measurement snaps to the 8px baseline. Dots are 24px; boxes pad at 24/28/32px.
8. If numbers are not genuinely sourced, exhibit with check rows, not bars or charts. Never fabricate data.
9. If a title exceeds ~45 characters, step it to 64px; past ~80, to 44px. Never compress below that — shorten the title.
10. New slides are static pages with no animation. Keep it that way.

## Known Gaps

- **Fonts**: Archivo / IBM Plex Sans / IBM Plex Mono via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif` / `ui-monospace, monospace`. No font files committed. Offline rendering falls back to system stacks and loses the command/paperwork contrast.
- **No chart system.** Bars, lines, and pies are unspecified by doctrine (no fabricated data); authors needing quantitative exhibits must source numbers first, then render minimal ink rules with mono labels.
- **No image treatment specified.** Photography and illustration are out of scope; exhibits are check rows and gap lists.
- **Figure column fits one exhibit plus one note.** Longer evidence must move to dedicated content slides.
- **Reference codes are manual.** `FIG. 01`, `NOTE 01`, `§2.1`, and pagination are hand-set per slide; there is no auto-numbering layer.
- **The dotted grid is cosmetic CSS.** It aligns with content by shared constants, not layout coupling — editing frame padding without checking the grid phase breaks the paper illusion silently.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in this system |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used — static pages only | full | N/A |
| 4 | Pixel / hard offset shadows | Not used — zero shadows by doctrine | full | N/A |
| 5 | Gradients | Not used | full | N/A |
| 6 | Grain / scanline / noise overlays | Dotted grid via `radial-gradient` dots | partial | Flatten dots into the background fill pattern |
| 7 | Transparency layers | Dot grid at 14% ink | partial | Solid #E4E0D6 dots in background pattern |
| 8 | Custom fonts | Archivo / Plex Sans / Plex Mono via Google Fonts CDN | partial | Embed licensed equivalents or substitute Arial / Calibri / Consolas |
| 9 | Absolute-positioned decor | Frame border, boxes, chips, leaders as positioned blocks | full | Grouped native rectangles and lines |
