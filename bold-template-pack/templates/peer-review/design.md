---
version: alpha
name: Peer Review
description: A scientific-journal presentation system that sets STIX Two Text serif titles over a clean white ground. An abstract block, a numbered figure/table rail with tabular numerals, reference-style bracket footnotes, and a small-caps journal runhead prove rigor structurally, while a single scholarly link-blue accents only the apparatus — never the prose. Typography-only register: no rules, boxes, bars, tracks, or tints exist — hierarchy is carried by the two type roles, scale, and whitespace alone.

colors:
  white: "#FFFFFF"
  ink: "#1A1A1A"
  link-blue: "#0B5394"
  rule-gray: "#EAEAEA"
  abstract-tint: "#F3F5F8"
  muted: "#5A6470"
  bar-track: "#EDF0F4"
  keyword-rule: "#D8DEE5"

shadows:
  none-flat: "none"
  abstract-edge: "inset 0 0 0 1px rgba(11, 83, 148, 0.08)"
  figure-lift: "0 1px 0 rgba(26, 26, 26, 0.06)"

typography:
  article-title:
    fontFamily: "'STIX Two Text', Georgia, serif"
    fontSize: 90px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.005em
  section-head:
    fontFamily: "'STIX Two Text', Georgia, serif"
    fontSize: 54px
    fontWeight: 700
    lineHeight: 1.12
  body-serif:
    fontFamily: "'STIX Two Text', Georgia, serif"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.55
  abstract-text:
    fontFamily: "'STIX Two Text', Georgia, serif"
    fontSize: 35px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.42
  kicker:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.24em
    textTransform: uppercase
  runhead:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.22em
    textTransform: uppercase
  figure-label:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.2em
    textTransform: uppercase
  figure-title:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.5
  table-head:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.12em
    textTransform: uppercase
  table-cell:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 21px
    fontWeight: 500
    lineHeight: 1.35
  footnote:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.6
  keywords:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 21px
    fontWeight: 500
    lineHeight: 1.4

spacing:
  slide-pad-y: 56px
  slide-pad-x: 88px
  col-gap: 72px
  rail-pad-left: 60px
  title-margin-top: 26px
  abstract-pad: "28px 34px 30px"
  abstract-bar: 6px
  masthead-gap: 18px
  foot-gap: 40px

canvas:
  width: 1920px
  height: 1080px

components:
  runhead:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 600
    letterSpacing: 0.22em
    textTransform: uppercase
    description: "Small-caps journal running head: context left, page mark right, standing bare with whitespace below."
  kicker:
    color: "{colors.link-blue}"
    fontSize: 22px
    fontWeight: 700
    letterSpacing: 0.24em
    textTransform: uppercase
    fontFamily: "'Inter', system-ui, sans-serif"
    description: "Blue apparatus kicker above the title: article type plus subject, never a sentence."
  abstract-block:
    padding: "28px 34px 30px"
    description: "Typographic abstract carrying the Abstract eyebrow, an italic serif summary, and a Keywords line. No tint, no bar, no rules."
  figure-list:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 21px
    description: "Typographic figure: Inter tabular category codes and values as aligned type rows under a Figure label and title. No bars, no tracks."
  data-list:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 21px
    description: "Unruled scholarly data list: name/value rows with right-aligned tabular numerals. No head rules, no row dividers, no outer borders."
  caption:
    fontSize: 21px
    color: "{colors.muted}"
    description: "Figure/Table caption with a bold ink lead ('Figure 1.', 'Table 1.')."
  footnote-row:
    fontSize: 20px
    color: "{colors.muted}"
    description: "Foot row carrying bracketed reference notes with blue superscript markers, separated by whitespace only."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and column collisions.

## Overview

Peer Review is a **scientific-journal presentation system**. Its foundational premise is the **apparatus**: every claim travels with its scholarly furniture — running head, abstract label, keywords, figure and table numbers, bracketed footnotes — so the page proves its rigor structurally instead of asserting it with decoration.

The type stack is two faces with a strict division of labor. **STIX Two Text** is the prose face — a crisp transitional serif with genuine italics that carries titles, abstract summaries, and body copy. **Inter** is the apparatus face — used for every label the journal machinery needs: runheads, kickers, figure labels, table cells, captions, keywords, and footnotes. Serif never labels; sans never argues.

The palette is paper-white restraint: **white ground, ink prose**, and exactly one accent — a scholarly **link blue** reserved for apparatus elements (kicker, footnote markers). Blue never touches body prose. The surface rhythm is two-column and cited: a bare runhead opens the page, an abstract block carries the summary, a wide gutter separates the apparatus rail from the article column, and a footnote row grounds the references.

**Density philosophy: medium, columnar, cited.** A typical slide carries one article column (kicker + title + abstract or body) beside one apparatus rail (a figure, a data list, or both), with footnotes closing the page. Nothing floats free: every module is numbered, captioned, or footnoted. Whitespace is the margin of a journal page — generous at the edges, disciplined between modules.

**Key Characteristics:**
- Typographic abstract block with an Abstract eyebrow, italic serif summary, and Keywords line — no tint, no bar, no rules.
- Numbered apparatus rail: typographic figures plus unruled data lists, each with a bold-lead caption.
- Reference-style bracket footnotes with blue superscript markers in a whitespace-separated foot row.
- Bare journal runhead: small-caps running head and page mark with whitespace below; no rules.
- Link blue reserved strictly for apparatus accents — prose stays ink-on-white.
- Tabular-numeral discipline in every figure and data list; tracked uppercase Inter labels against sentence-case serif prose.

## Colors

### Palette

- **White** (`{colors.white}` — `#FFFFFF`): The only slide ground. Every surface is white; no tints, no fills.
- **Ink** (`{colors.ink}` — `#1A1A1A`): Prose, titles, and caption leads.
- **Link Blue** (`{colors.link-blue}` — `#0B5394`): The apparatus accent — kicker and footnote superscript markers. Never body text.
- **Rule Gray** (`{colors.rule-gray}` — `#EAEAEA`): Retained token; no visible role in the typography-only register.
- **Abstract Tint** (`{colors.abstract-tint}` — `#F3F5F8`): Retained token; no visible role in the typography-only register.
- **Muted** (`{colors.muted}` — `#5A6470`): Captions, keywords, footnotes, category codes, page mark — the quiet metadata voice.
- **Bar Track** (`{colors.bar-track}` — `#EDF0F4`): Retained token; no visible role in the typography-only register.

### Defaults

- **Default surface background**: `{colors.white}`. No wallpaper, no texture, no vignette.
- **Default headline color**: `{colors.ink}` at weight 700.
- **Default body color**: `{colors.ink}`; metadata (captions, footnotes, keywords) in `{colors.muted}`.
- **Default accent**: `{colors.link-blue}`, restricted to the kicker and footnote markers.
- **Default separator**: none — whitespace rhythm separates modules; rules do not exist.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**STIX Two Text** is the prose face — a transitional serif designed for scientific publishing, with true italics and sturdy numerals. Used for article titles, section heads, abstract summaries (italic), and body copy. Its even color at large sizes keeps long titles readable without shouting.

**Inter** is the apparatus face — a neutral grotesque used for every piece of journal machinery: runheads, kickers, figure labels and titles, data-list rows, captions, keywords, and footnotes. Inter appears in two registers: tracked uppercase for labels, sentence case for captions and data prose.

Serif never labels and sans never argues: a caption set in STIX or a paragraph set in Inter both break the journal contract.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.article-title}` | 90px | STIX Two Text | 700 | Cover and section article title |
| `{typography.section-head}` | 54px | STIX Two Text | 700 | Inner-section head |
| `{typography.body-serif}` | 30px | STIX Two Text | 400 | Paragraph body |
| `{typography.abstract-text}` | 35px | STIX Two Text | 400 italic | Abstract summary in the abstract block |
| `{typography.kicker}` | 22px | Inter | 700 | Blue apparatus kicker above titles |
| `{typography.runhead}` | 20px | Inter | 600 | Masthead running head + page mark |
| `{typography.figure-label}` | 20px | Inter | 700 | "Figure N" / "Table N" eyebrow |
| `{typography.figure-title}` | 24px | Inter | 600 | Figure title |
| `{typography.caption}` | 21px | Inter | 400 | Figure/Table captions with bold lead |
| `{typography.table-head}` | 18px | Inter | 700 | Data-list head labels |
| `{typography.table-cell}` | 21px | Inter | 500 | Data-list row text |
| `{typography.footnote}` | 20px | Inter | 400 | Foot reference notes |
| `{typography.keywords}` | 21px | Inter | 500 | Abstract keywords line |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every article title is STIX Two Text 700 at 90px with 1.05 line-height.** Long titles wrap; a fit routine shrinks the size in 2px steps to a 40px floor so the title box never overflows.
- **Every abstract summary is STIX italic at 35px in the abstract block.** The Abstract eyebrow and Keywords line are Inter; the summary itself is always italic serif.
- **Every apparatus label is Inter uppercase with wide tracking** — 0.24em kickers, 0.22em runheads, 0.2em figure labels, 0.12em data-list heads. Sentence-case Inter labels do not exist.
- **Every figure and data-list numeral uses tabular figures** (`font-variant-numeric: tabular-nums`) so values align in columns.
- **Every caption opens with a bold ink lead** — "Figure 1." or "Table 1." — followed by muted sentence-case description.
- **Every footnote marker is a blue superscript bracket** (`[1]`, `[2]`) ahead of muted note text.
- **Every keyword line leads with a bold ink "Keywords"** followed by an em dash and middle-dot-separated terms.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The title slide is a journal title page: runhead line, a two-column paper region (article column ≈ 62%, apparatus rail ≈ 38% across a wide gutter), and a footnote row closing the page.

Default slide padding is `56px 88px 48px`. The article column and rail are separated by a wide whitespace gutter with 60px rail inset. The rail stacks figure over data list with 44px gaps. The footnote row sits at the foot with 40px whitespace separation from the columns.

### Persistent Chrome

Two quiet elements persist across the deck:

- **Runhead** — context-derived running head left, page mark (`p. 01` style) right, with whitespace below. Present on every slide; the running head never changes mid-deck.
- **Footnote row** — one to three bracketed reference notes. Present wherever claims need grounding; on the cover it cites the corpus and scope.

There is no navigation chrome, no progress indicator, no logo lockup — the journal page is the chrome.

## Depth and Elevation

Peer Review is a **flat print system**: hierarchy is expressed through the two type roles, scale, and whitespace — never through shadow, rules, boxes, or tints. The abstract block reads as a summary via its eyebrow, italic, and Keywords line. Figures sit directly on white; their structure comes from tabular alignment alone.

The shadow tokens are retained but unrendered. Any blurred or offset shadow on text or chrome breaks the print contract — if a module needs emphasis, number it, caption it, or footnote it.

## Shapes and Treatment

### Border Radius

There is nothing to round: no boxes, bars, tracks, tables, or rules exist in the typography-only register. Rounded corners read as product UI and are forbidden — the only permitted curve is the slight ink spread of serif letterforms themselves.

### Border Weights

Borders do not exist. There are no masthead rules, table borders, row dividers, foot hairlines, edge bars, or keyword separators; dashed, dotted, diagonal, and solid lines alike do not exist in this system. Separation is whitespace or tabular alignment, never a line.

### Decorative Element Types

**Runhead** — Bare small-caps running head with page mark. The system's most recognizable mark; appears on every slide.

**Abstract block** — Abstract eyebrow, italic serif summary, and Keywords line set directly on white. Used once per title/section slide for the summary statement.

**Figure list** — Figure label, title, aligned tabular category/value type rows, and a bold-lead caption. The standard visual-evidence module.

**Data list** — Unruled name/value rows with a right-aligned tabular numeral column and a bold-lead caption. The standard tabular-evidence module.

**Footnote row** — Bracketed blue-superscript reference notes in muted Inter, whitespace-separated at the foot. Grounds corpus, scope, and method claims.

**Kicker** — Blue tracked-uppercase article-type line above titles. Never a sentence, never more than a few words.

## Do's and Don'ts

### Do

- Keep every slide on flat white with no tints, fills, or boxes of any kind.
- Set all prose in STIX Two Text and all apparatus labels in Inter — never cross the two roles.
- Number every figure and data list and give each a bold-lead caption; unnumbered visuals do not exist here.
- Use tabular numerals in every figure value, data row, and category code.
- Restrict link blue to the kicker and footnote markers.
- Open every slide with the bare runhead and close the page with the footnote row.
- Lead the abstract block with the Abstract eyebrow and close it with the Keywords line.

### Don't

- Don't introduce a second accent color — no red, green, or amber alerts; emphasis comes from numbering and captions.
- Don't round any corner or blur any shadow; the system is square-cut and flat.
- Don't set body prose in Inter or labels in STIX — each face has exactly one role.
- Don't place blue on prose or captions; blue is apparatus-only.
- Don't omit captions on figures or data lists, and don't caption without the bold "Figure N." / "Table N." lead.
- Don't add rules, boxes, bars, tints, textures, vignettes, or watermarks — the white page is the surface.
- Don't stack more than two evidence modules in the rail; a third module belongs on the next slide.

## Responsive Behavior

Peer Review is a **fixed-stage system**: all sizes above are 1920×1080 stage coordinates scaled uniformly by one transform. There are no breakpoints and no viewport-fluid rules in generated output.

Long titles are handled by the title fit routine (shrink 90px toward a 40px floor in 2px steps until the title box stops overflowing), not by reflowing the columns — the article/rail split never changes. The abstract block grows downward within the article column; if abstract plus title exceed the column, the title shrinks first.

For source-history reference only: the proportions derive from a two-column journal page and would stack to a single column below 900px in a fluid web context, but generated decks never reflow — they letterbox.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for an equivalent Chinese pairing and apply universal CJK adjustments. All recommended Chinese fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Prose / titles / abstract | STIX Two Text 400–700 + italic | 思源宋体 Noto Serif SC 400–900 |
| Apparatus / labels / tables / footnotes | Inter 400–700 | 思源黑体 Noto Sans SC 400–700 |

### Mixed-Content Strategy

**Strategy A** — two CJK families preserving the prose/apparatus split. Set serif-role elements to `'Noto Serif SC', serif` and apparatus-role elements to `'Noto Sans SC', sans-serif`. The serif/sans contrast is the system's core signal, so keep both families rather than collapsing to one. Latin runs inside CJK sentences (numerals, "Figure 1" leads) stay in the role's Latin face via the font stack order.

### Loading

Add to the slide `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.7–1.8, display 1.2–1.3. CJK glyphs are square and crowd vertically.
- **Letter-spacing**: set to 0 on every CJK run. The 0.12–0.24em apparatus tracking looks broken on square glyphs; keep tracking only on Latin-only runs.
- **Text transform**: don't apply `uppercase` to Chinese text. Render CJK runheads and kickers without transform, slightly smaller (18px) to preserve the band's silhouette.
- **Punctuation**: use full-width Chinese punctuation （，。：；！？「」（））.
- **No period on display headlines**: omit trailing 。 on display-scale headlines.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin or digits.
- **Italic**: CJK has no italic — render the abstract summary in Noto Serif SC 600 upright, keeping the eyebrow and Keywords line as the abstract signal.

### Aesthetic Notes for This System

The journal voice survives translation well because it lives in structure, not letterforms: the runhead, abstract block, numbered captions, and footnotes carry full recognition even when both faces change. Compensate for the lost STIX italic by weighting the CJK abstract summary one step heavier (600) and keeping the Keywords line. Keep figure/table numbering in Latin ("Figure 1", "Table 1", "[1]") — the Latin apparatus markers read as citation codes and preserve the tabular rhythm.

### Known CJK Gap

- **No CJK italic.** The abstract summary's italic signal has no Chinese equivalent; weight 600 upright plus the eyebrow is the documented substitute.
- **Apparatus tracking collapses.** The 0.2em+ label tracking that voices the Latin apparatus must be zeroed on CJK runs; the uppercase silhouette survives only on Latin fragments.

## Iteration Guide

1. Any new slide keeps the flat white ground and the bare runhead. Don't restyle the runhead per slide.
2. Any new prose element uses STIX Two Text; any new label, caption, row, or note uses Inter. Never cross the roles.
3. Any new summary statement goes in the abstract block with the Abstract eyebrow and Keywords line — don't invent a second summary treatment.
4. Any new visual evidence becomes a numbered Figure or data list with a bold-lead caption in the rail. Don't float unnumbered charts.
5. Any new numeral in figures or data lists uses tabular figures; any new apparatus label uses tracked uppercase Inter.
6. Any new accent is link blue on the kicker and footnote markers only. Don't accent prose, and don't introduce a second accent.
7. Any new separation uses whitespace rhythm — rules of any weight are forbidden.
8. Any new claim that needs grounding gets a bracketed footnote in the foot row with a blue superscript marker.
9. If the rail needs more than two modules, paginate — start a second evidence slide rather than shrinking modules.
10. Long titles shrink via the fit routine toward the 40px floor; never narrow the columns or reflow to one column.
11. A statement slide may carry a single centered sentence as an intentional pause slide — document it as a pause, not a thin error.

## Known Gaps

- **Fonts**: STIX Two Text / Inter via Google Fonts CDN (`display=swap`); fallbacks Georgia, serif / system-ui, sans-serif. No font files committed. Offline rendering falls back to system stacks and loses the serif/apparatus contrast.
- **Title fit needs JS.** The shrink-to-fit routine runs on DOMContentLoaded, font-ready, and load plus delayed passes at 800/2000ms for late `display=swap` swaps; without JS, very long titles can overflow the title box. Static export must bake the fitted size.
- **Tabular numerals depend on Inter.** Fallback sans fonts may substitute proportional figures, loosening figure/data-list column alignment.
- **No rules, boxes, bars, or tints.** The typography-only register renders none of the retained rule/tint/track tokens; decks must not reintroduce them as structure.

### PPTX Fidelity Disclosure

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in this design |
| 2 | Blend modes | None used | full | N/A — no blend modes |
| 3 | Animation / keyframes | None used | full | N/A — static print surface |
| 4 | Pixel / hard offset shadows | None used (flat print) | full | N/A — no shadows |
| 5 | Gradients | None used (flat fills only) | full | N/A — solid fills export 1:1 |
| 6 | Grain / scanline / noise overlays | None used | full | N/A |
| 7 | Transparency layers | None used (all fills opaque) | full | N/A |
| 8 | Custom fonts | STIX Two Text + Inter via Google Fonts CDN | partial | Embed both faces if licensed; else Georgia + Calibri substitution |
| 9 | Absolute-positioned decor | In-flow flexbox layout (no absolute decor) | full | Native shapes / text boxes 1:1 |
