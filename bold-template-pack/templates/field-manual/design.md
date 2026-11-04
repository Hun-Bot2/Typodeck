---
version: alpha
name: Field Manual
description: A technical-manual presentation system on warm paper. Archivo Bold caps issue headers, IBM Plex Sans carries body, and IBM Plex Mono tags every step, figure, and note with a visible reference code. A 60/40 text-plus-figure split with navy mono tags, text checkbox glyphs, and plain-type warning labels makes every slide read as one page of a larger controlled document. No borders, boxes, rules, leaders, chips, or dot grids — type and whitespace only.
colors:
  paper: "#FAF8F3"
  ink: "#1A1A1A"
  procedural-blue: "#182B49"
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
    description: "Three-part mono strip: document code left, procedure title center, date right. Whitespace below opens the page."
  double-rule:
    status: retired
    successor: "whitespace"
    description: "RETIRED in the typography-only vocabulary: the 3px-over-1px rules are removed. The header opens the page with whitespace."
  warn-chip:
    status: retired
    successor: "warn-label"
    description: "RETIRED as a filled chip in the typography-only vocabulary. Warnings set as plain mono caps ink labels with a leading warning glyph (no fill)."
  warn-label:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 19px
    color: "{colors.ink}"
    description: "Plain mono caps ink warning label with a leading warning glyph. No fill, no border."
  step-row:
    numeralSize: 52px
    numeralColor: "{colors.procedural-blue}"
    description: "Numbered step: plain navy mono numeral, uppercase Plex Sans label, mono section tag right. No squares, no leaders — whitespace gaps."
  leader-line:
    status: retired
    successor: "whitespace"
    description: "RETIRED in the typography-only vocabulary: dashed leaders are removed. Proximity and alignment stitch steps to tags."
  figure-box:
    status: retired
    successor: "figure-group"
    description: "RETIRED as a bordered box in the typography-only vocabulary. Exhibits set as figure groups: navy mono tag over check rows."
  figure-group:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 20px
    description: "Exhibit group: navy mono figure tag over check-row contents, whitespace-separated."
  note-box:
    status: retired
    successor: "note-group"
    description: "RETIRED as a bordered box in the typography-only vocabulary. Notes set as note groups: navy mono tag over a short finding."
  note-group:
    fontFamily: "'IBM Plex Sans', sans-serif"
    fontSize: 23px
    description: "Callout group: navy mono NOTE tag over a short Plex Sans finding, whitespace-separated."
  check-row:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 20px
    description: "Exhibit checklist row: text checkbox glyph (done navy / open deep-amber), mono label, mono item tag. No leaders."
  revision-footer:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: 19px
    description: "Footer pairing: document code left, page right, mono uppercase, no rule."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Field Manual is a **technical-manual presentation system**. Its foundational premise is the **numbered artifact**: every step, figure, note, and warning carries a visible reference code (`01`, `FIG. 01`, `NOTE 01`, `§2.1`), so each slide reads as one page of a larger controlled document rather than a standalone canvas. The page is a document: doc-header strip, whitespace-opened sections, revision footer pairing.

The type stack is three faces with procedural roles. **Archivo Bold caps** issues orders — titles, section heads, and step-adjacent heads, always uppercase, always left-aligned. **IBM Plex Sans** explains — body, subtitles, note findings, and step labels in sentence or uppercase depending on the component. **IBM Plex Mono** tags — document codes, figure tags, section references, check rows, chips, and footer. The mono voice is the system's paperwork: if it looks stamped, filed, or referenced, it is Plex Mono.

The palette is **warm paper and ink** with two functional accents. **Procedural navy** (`{colors.procedural-blue}` — locked `#182B49`, never royal) marks notes, figure tags, step numerals, and informational type — a deep filing-cabinet navy that stays distinct from ink at 19px tags without ever reading electric. **Caution amber** survives only as the open-checkbox text glyph in deep-amber; amber fills are retired. Navy never fills large areas; amber never appears outside open-checkbox glyphs. Muted taupe grays secondary text and item tags.

Layout follows a **60/40 split**: numbered steps on the left, a figure column with exhibit groups and note groups on the right, stitched together by alignment and proximity. The ground is solid warm paper — flat, unprinted.

**Density philosophy: dense but tagged.** These slides carry more elements than an editorial system allows — header, title, steps, figure, note, footer — but every element carries a visible tag with whitespace around it, so density reads as thoroughness rather than clutter. When content grows, the title steps down (92 → 64 → 44px) and steps compress; the figure column keeps exactly one exhibit plus one note.

**Key Characteristics:**
- Doc header strip with mono document code, centered procedure title, and date — opened by whitespace.
- Numbered steps with plain navy mono numerals and mono section tags (`§2.1`), whitespace-gapped.
- Figure groups (`FIG. 01`) with check-row exhibits stitched to notes by proximity.
- `NOTE` callout groups pairing a navy mono tag with a short Plex Sans finding.
- Plain-type warning labels with a leading `⚠` — no fills anywhere in the system.
- Solid warm-paper ground with an 8px baseline and tagged sections throughout.
- Three-face discipline: Archivo caps issue, Plex Sans explain, Plex Mono tag.
- Zero boxes, zero borders, zero rules, zero leaders, zero shadows, zero gradients, zero border-radius.

## Colors

### Palette

- **Paper** (`{colors.paper}` — `#FAF8F3`): The warm ground, solid and unprinted. Reads as aged but clean stock.
- **Ink** (`{colors.ink}` — `#1A1A1A`): All type. Warm near-black.
- **Procedural Navy** (`{colors.procedural-blue}` — `#182B49`): Note groups, figure tags, step numerals, informational markers, checked-box glyphs. A deep sophisticated navy (13.4:1 on paper); never large fills, never body text. Locked — never regress to royal blue.
- **Caution Amber** (`{colors.caution-amber}` — `#FFB000`): Retained palette token; fills retired. Open-checkbox glyphs set in deep-amber text. The system's alert color.
- **Muted** (`{colors.muted}` — `#6E6A5E`): Secondary text, item tags, and caption lines. Warm gray-taupe.
- **Dot Grid** (`{colors.dot-grid}` — `rgba(26,26,26,0.14)`): Retained token; the printed dot texture is retired — the ground is solid paper.
- **Box Fill** (`{colors.box-fill}` — `#FFFFFF`): Retained token; box interiors retired — no white cards in the typography-only vocabulary.

### Defaults

- **Default surface background**: `{colors.paper}`, flat and unprinted.
- **Default headline color**: `{colors.ink}`, always caps, always Archivo 700.
- **Default body text color**: `{colors.ink}`; secondary lines in `{colors.muted}`.
- **Default tag color**: `{colors.ink}` for structural tags; `{colors.procedural-blue}` for note/figure tags and step numerals.
- **Default warning treatment**: plain mono caps ink label with a leading `⚠` glyph (`{components.warn-label}`). No fills.
- **Default separation**: whitespace and alignment only — no boxes, no leaders, no rules.

### Pastel & Tint Policy

This system carries no pastel tints and no fills: paper is a near-white that always takes ink or navy text, and amber survives only as open-checkbox text glyphs. If a tint is ever introduced, it must carry a deliberate contrast role (ground for dark text, or fill behind dark text) — never pastel-on-pale text, never tint-on-tint type. See `evals/typo-only/color.md` for the shared rule and measurements.

## Typography

### Font Family

The system runs three faces, each locked to its role.

**Archivo** is the command face — Bold (700), always caps, used for titles, section heads, and subheads. Archivo issues; it never explains at length and never appears in sentence case.

**IBM Plex Sans** is the explanation face — Regular (400) for body and subtitles, Medium (500) uppercase for step labels. It carries every sentence-length run in the system.

**IBM Plex Mono** is the paperwork face — Medium (500) for tags, codes, warnings, check rows, and footer; Regular (400) for section references. If an element looks stamped, filed, or cross-referenced, it is Plex Mono.

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
| `{typography.warn-chip}` | 19px | Plex Mono | 500 | Warning label text (plain type, no fill) |
| `{typography.section-tag}` | 19px | Plex Mono | 400 | Section references (`§2.1`, `A-3`) |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every Archivo header is uppercase.** Sentence-case Archivo does not exist in this system.
- **Every step carries a plain navy mono numeral** and a mono section tag, whitespace-gapped. A step without its tag reads as an unordered bullet and breaks the procedural voice.
- **Every figure group opens with a tracked navy mono tag** (`FIG. 01 — …`). Untagged groups read as generic text.
- **Every note group pairs a navy mono tag** (`NOTE 01`) with a short Plex Sans finding. Tag without finding (or reverse) is incomplete.
- **Every warning is a plain mono caps ink label with a leading `⚠` glyph**. Filled or boxed warnings do not exist.
- **Every check row carries a text checkbox glyph** (`☑` navy for done, `☐` deep-amber for open) plus an item tag. No leaders.
- **Every doc header opens the page with whitespace below.** Rules never frame the document.

### Typography Principles

The voice contrast is **command ↔ explanation ↔ paperwork**. Archivo orders, Plex Sans clarifies, Plex Mono files. Italic is never used — emphasis comes from tags, scale, and warnings, never slant.

Headers should always feel **issued** — caps, left-aligned, followed by tagged content. Body should feel **legible under lamplight** — generous line-height (≥1.5), sentence case, no letterspacing. Mono should feel **stamped** — tracked caps for tags, plain for references.

### Defaults

- **Default size for a cover title**: `{typography.manual-title}` (92px) — steps down to 64px past ~45 characters.
- **Default size for a slide headline**: `{typography.section-head}` (44px).
- **Default size for body**: `{typography.body-compact}` (23px); covers use `{typography.body}` (30px) for the subtitle.
- **Default mono tag size**: `{typography.figure-tag}` (19px) with +0.14em tracking.
- **Default step label**: `{typography.step-label}` (26px) Plex Sans Medium uppercase.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. A document page insets 32px from the stage edge; inside, 56px padding holds the content. The doc-header strip sits at the top of the page, the revision footer pairing at the bottom, and the 60/40 split fills the middle with a 48px gutter.

The 8px baseline governs vertical rhythm: header heights, step rows, and group gaps all resolve to multiples of 8.

### Persistent Chrome

Three elements appear on every slide:

- **Page inset** — 32px inset with 56px inner padding, doc-header strip at top.
- **Figure column** — the right 40%: exactly one exhibit group plus one note group, stitched by proximity.
- **Revision footer** — `{components.revision-footer}`: document code left, page right, no rule.

The solid warm-paper ground fills every surface.

### Procedural Rhythm

The left column reads top-down as a procedure: warning → title → subtitle → steps → source line. The right column reads as evidence: figure group → note group. Alignment stitches elements to their tags — steps left-align with tags right, groups stack tag-over-content.

## Depth and Elevation

### Flat Paper by Doctrine

Field Manual has **no depth system**. There are no shadows, no gradients, no translucency, no boxes, no rules, no fills. Hierarchy comes from the tag system, scale, weight, navy accents, and whitespace.

### Type as Elevation

- **Figure/note groups** (`{components.figure-group}`, `{components.note-group}`) advance by navy tags and whitespace — no borders, no fills.
- **Warning labels** (`{components.warn-label}`) are the highest-emphasis elements: plain mono caps ink with a leading `⚠`.
- **Step numerals** are plain navy mono — they read as stamped, not raised.

### Paper Ground

The solid warm paper is the only ground. Groups sit directly on it, separated by whitespace. Never add texture, fills, or panels.

## Shapes and Treatment

### Border Radius

Zero everywhere, trivially — there are no boxes, borders, chips, or squares to round. A rounded corner reads as consumer product, not controlled document.

### Border Weights

No borders exist in this system. The retired weights (3px/2px/1px rules, 1px box borders, 2px dashed leaders) are documented for history only: every separation they performed is now whitespace, tags, and alignment.

### Decorative Element Types

**Doc header** — Three-part mono strip (code / procedure / date) with whitespace below. Opens every slide identically.

**Warning label** — Plain mono caps ink label with a leading `⚠`. Used for cautions and pre-ship alerts.

**Step row** — Navy mono numeral + uppercase label + section tag, whitespace-gapped. The procedural workhorse.

**Figure group** — Navy mono figure tag over check-row contents.

**Check row** — Text checkbox glyph + mono label + item tag. Qualitative exhibits, never fabricated numbers.

**Note group** — Navy mono tag over a short finding.

**Approval strip** — Mono block under the source line: prepared-by, date, sign-off. Closes the text column on cover slides.

**Revision footer** — Mono document code and pagination pairing, no rule.

**Mono ledger** — On data slides: mono tracked header row over aligned columns with a mono reference column. No rules, no dividers.

## Do's and Don'ts

### Do

- Number everything: steps, figures, notes, checks, and pages all carry visible reference codes.
- Keep the doc header + revision footer on every slide. The page and its tags are the identity.
- Use Archivo caps for every header; Plex Sans for every sentence; Plex Mono for every tag.
- Stitch steps to tags and figures to notes with alignment and proximity — never leaders.
- Set warnings as plain mono caps ink labels with `⚠` — and fill nothing, ever.
- Pin every warning flush to the note or figure it warns about — a warning pointing at empty paper ships confusion.
- Keep exhibits qualitative (check rows, gap lists) unless the data is genuinely sourced.
- Set figure/note groups directly on the paper with whitespace around; never box them.
- Step the title down (92 → 64 → 44px) as titles lengthen past ~45 characters.
- Tag figures, notes, and steps with navy (`#182B49`) mono tags — never royal, never bullets.
- Keep the ground solid warm paper — never texture, never fills, never panels.

### Don't

- Don't use sentence-case Archivo or caps Plex Sans body. Each face keeps its case discipline.
- Don't add boxes, borders, rules, leaders, fills, shadows, gradients, or rounded corners anywhere.
- Don't use navy for body text or large fills. Navy is a tag, numeral, and marker color — and never royal `#0B5FFF`.
- Don't use amber outside open-checkbox text glyphs. Amber fills do not exist.
- Don't fabricate chart data. If numbers are not sourced, use check-row exhibits instead of bars.
- Don't remove the figure column to "make room." Compress steps instead.
- Don't use leaders of any dash, dot, or weight — stitching is alignment and proximity.
- Don't use italic for emphasis — use warning labels, scale, and tags.
- Don't add panels, cards, or textures. Type on solid paper only.
- Don't center headers or body. Left-aligned, tagged — always.

## Responsive Behavior

Field Manual is a **fixed-stage system** built for 1920×1080 output. All sizes are absolute pixels; there are no breakpoints in the generated deck. The stage scales uniformly via a single transform (letterboxed, no reflow).

### Scaling Behavior

- The 32px page inset and 56px inner padding are fixed at 1920×1080 and scale with the stage transform.
- The 60/40 split and 48px gutter are fixed proportions of the page interior.
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

The system prints 1:1 — paper ground (light enough for laser), ink type, navy tags. For static export, screenshots preserve tags, glyphs, and groups exactly.

## CJK & International Content

When using this system for Korean (or other CJK) content, swap the Latin stack for an equivalent Korean pairing and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Headers / step labels | Archivo 700 (caps) | Noto Sans KR 800 (no transform, no tracking) |
| Body / findings | IBM Plex Sans 400–500 | Noto Sans KR 400–500 |
| Tags / codes / warnings / checks | IBM Plex Mono 400–500 | Noto Sans KR 500 with mono-styled Latin kept in Plex Mono for codes |

### Mixed-Content Strategy

**Strategy B** — split pairing. CJK prose (titles, body, findings) renders in Noto Sans KR; reference codes that are Latin-only (`FM-11`, `§2.1`, `FIG. 01`, `NOTE 01`, `A-3`) stay in IBM Plex Mono to preserve the stamped paperwork voice. Mixed lines keep an ASCII space between CJK and Latin runs. Hierarchy survives through weight plus the tag/group system, which translates unchanged.

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

The tag system carries the CJK build. Reference codes (`FM-11`, `FIG. 01`, `§2.1`) stay in Plex Mono — they are locale-neutral paperwork — while prose moves to Noto Sans KR. The tags, checkbox glyphs, and warning labels translate 1:1 and do more identity work in CJK builds than in Latin ones.

### Known CJK Gap

- **No Korean mono face with the Plex Mono paperwork voice.** Noto Sans KR 500 stands in for mono-styled Korean; only Latin codes keep true monospaced rhythm. Korean tags lose the typewriter-stamp signal.
- **Command voice softens.** Archivo caps have no Korean equivalent; Noto Sans KR 800 headers without caps or tracking feel informative rather than issued. The tags and warning labels must carry the authority.

## Iteration Guide

1. Any new slide keeps the page inset, doc header, figure column, and revision footer. Don't skip the paperwork.
2. Any new header uses Archivo 700 caps. Any new sentence uses Plex Sans. Any new code, tag, or check uses Plex Mono.
3. Any new step gets a navy mono numeral, an uppercase label, and a section tag — all three, whitespace-gapped, no exceptions.
4. Any new exhibit is a figure group with a navy mono figure tag; stitch it to its note by proximity.
5. Any new note is a note group with a navy mono tag and a one-to-two-sentence Plex Sans finding.
6. Any new warning is a plain mono caps ink label with a leading `⚠` — never a fill, never a box.
7. Any new measurement snaps to the 8px baseline. Groups gap at 24/32px.
8. If numbers are not genuinely sourced, exhibit with check rows, not bars or charts. Never fabricate data.
9. If a title exceeds ~45 characters, step it to 64px; past ~80, to 44px. Never compress below that — shorten the title.
10. New slides are static pages with no animation. Keep it that way.

## Known Gaps

- **Fonts**: Archivo / IBM Plex Sans / IBM Plex Mono via Google Fonts CDN (`display=swap`); fallbacks `"Arial Black", sans-serif` / `system-ui, sans-serif` / `ui-monospace, monospace`. No font files committed. Offline rendering falls back to system stacks and loses the command/paperwork contrast.
- **No chart system.** Bars, lines, and pies are unspecified by doctrine (no fabricated data); authors needing quantitative exhibits must source numbers first, then render minimal mono ledgers with reference tags.
- **No image treatment specified.** Photography and illustration are out of scope; exhibits are check rows and gap lists.
- **Figure column fits one exhibit plus one note.** Longer evidence must move to dedicated content slides.
- **Reference codes are manual.** `FIG. 01`, `NOTE 01`, `§2.1`, and pagination are hand-set per slide; there is no auto-numbering layer.
- **Dot grid retired (typography-only rebuild).** The ground is solid paper; the old grid-phase coupling gap is gone with the texture.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used | full | N/A — no blur in this system |
| 2 | Blend modes | Not used | full | N/A |
| 3 | Animation / keyframes | Not used — static pages only | full | N/A |
| 4 | Pixel / hard offset shadows | Not used — zero shadows by doctrine | full | N/A |
| 5 | Gradients | Not used | full | N/A |
| 6 | Grain / scanline / noise overlays | Not used (dot grid retired) | full | N/A |
| 7 | Transparency layers | Not used | full | N/A |
| 8 | Custom fonts | Archivo / Plex Sans / Plex Mono via Google Fonts CDN | partial | Embed licensed equivalents or substitute Arial / Calibri / Consolas |
| 9 | Absolute-positioned decor | Retired — tags, glyphs, and groups are plain text boxes | full | Native text boxes |
