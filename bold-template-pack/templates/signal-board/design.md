---
version: alpha
name: Signal Board
description: An information-systems cover that reads as a live ops dashboard. Inter carries the argument with tabular numerals while IBM Plex Mono carries every label, kicker, and data row. A mono masthead line with a live green glyph crowns a mist-gray ground ruled by hairlines; an open KPI stat block and a ruled case log keep the evidence sample (PM-01 … PM-11) visible beside the headline. Signal colors are strictly semantic — blue identity, green complete, amber/red attention — with zero boxes, zero shadows, and zero decoration that is not also a readout. Typography-only: no cards, panels, pills, or filled bands.

colors:
  mist: "#F6F8FA"
  slate: "#0F172A"
  signal-blue: "#2563EB"
  ok-green: "#16A34A"
  warn-amber: "#B45309"
  alert-red: "#DC2626"
  row-rule: "#CBD5E1"
  muted: "#64748B"
  white: "#FFFFFF"

shadows:
  none-flat: "none"

rules:
  row-rule: "1px solid #CBD5E1"
  masthead-rule: "1px solid #CBD5E1"
  footer-rule: "1px solid #CBD5E1"

typography:
  dashboard-hero:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 96px
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: -0.015em
  deck-subtitle:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.45
  kpi-numeral:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 92px
    fontWeight: 800
    lineHeight: 1
  masthead-mono:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.14em
  kicker-label:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 19px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em
  context-mono:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.06em
  data-row:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
  data-key:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.1em
  case-row:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.4
  status-word:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em
  footer-mono:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.12em

spacing:
  grid-columns: 12
  grid-gutter: 12px
  pad-page-x: 72px
  pad-masthead-y: 26px 22px
  kpi-numeral-gap: 26px
  row-pad-y: 13px
  content-max-width: 1776px

canvas:
  width: 1920px
  height: 1080px

components:
  masthead:
    rule: "1px solid {colors.row-rule} below"
    padding: "26px 0 22px 0"
    description: "Mono masthead line on mist: green ● glyph + series telemetry left, sample count right, mono 20px tracked, closed by a hairline."
  kicker-line:
    color: "{colors.signal-blue} for series tag, {colors.slate} for date"
    separator: "dim /"
    description: "Two-part mono kicker above the headline: signal-blue series tag, dim slash, slate date. No fills, no outlines."
  kpi-block:
    rule: "1px solid {colors.row-rule} below"
    padding: "6px 0 26px 0"
    description: "Open stat block: 92px tabular numeral beside mono caption + status word; a hairline below separates it from the case log."
  status-word:
    marker: "● glyph in signal color + slate word"
    description: "Status as type: a ● glyph in ok-green / warn-amber / alert-red followed by a slate mono word (COMPLETE, LOGGED, UNDER REVIEW). Amber words may set directly in warn-amber."
  case-log:
    rule: "1px solid {colors.row-rule} between rows"
    heading: "{colors.signal-blue} mono 18px tracked"
    description: "Ruled evidence log on mist: one mono case row per case (PM-01 … PM-11) separated by hairlines with trailing status words. No summary rows — the log is the summary."
  data-row:
    borderTop: "1px solid {colors.row-rule}"
    padding: "13px 2px"
    description: "Ticker-style finding row: dim mono key left, tabular value right. Direction glyphs (▲/▼) appear only beside genuine trend values, never as verdict decoration."
  context-line:
    marker: "▸ in {colors.signal-blue}"
    gap: 14px
    description: "Mono context line led by a blue ▸ glyph instead of a bullet."
  seal-line:
    pinned: "margin-top:auto at case-log bottom"
    description: "Sample-integrity caption pinned to the case-log bottom: mono SEALED line (e.g. SAMPLE SEALED · 11 / 11). No bars."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and rule overlap.


## Overview

Signal Board is an **information-systems cover** — the title slide behaves like a live ops console at the moment the numbers land, not like a magazine spread. The left column carries the argument (kicker line, heavyweight Inter headline, mono context line, ticker data rows) and the right column carries the evidence (open KPI stat block, ruled case log). A mono masthead line with a green live glyph and telemetry crowns every cover; a hairline footer with the volume mark and page number closes it.

The type contract is two faces with a hard boundary. **Inter** (400–800, always tabular numerals) carries headlines, subtitles, and KPI numerals. **IBM Plex Mono** (400–600) carries every label, kicker, data row, case id, and footer mark. Mono is the system's "instrument" voice: if a string could appear on a dashboard — a count, a status, a key, a date — it is mono.

The palette is **semantic, not decorative**. Mist gray-blue (`{colors.mist}`) is the ground; slate (`{colors.slate}`) is the ink for headlines, values, and kickers. Signal blue marks identity (kicker tag, log headings, context marker); ok-green means complete; warn-amber and alert-red mark attention as glyphs and words, never as fills. Every color choice must be defensible as a readout state.

**Density philosophy: dense but ruled.** The system packs a headline, one KPI block, a five-row case log, and three ticker rows onto one cover — but every cluster is separated by hairlines or 12px gutters, so density reads as instrumentation rather than clutter. Whitespace is structural (grid gutters, row padding), never atmospheric.

**Key Characteristics:**
- Mono masthead line with live glyph and telemetry (series name, sample count) crowns every cover, closed by a hairline.
- Open KPI stat blocks pair a 92px tabular Inter numeral with a mono caption and a status word, separated by a hairline.
- Ruled case log enumerates the evidence set (PM-01 … PM-11) as mono rows with LOGGED / UNDER REVIEW status words.
- Rule-separated mono data rows (key left, value right, no verdict glyphs) sit under the headline like a ticker of findings.
- Status is carried by ●/▲/▼ glyphs plus words — there are no pills, cards, or panels anywhere in the system.
- Tabular numerals everywhere; columns of figures align digit-for-digit with zero layout jitter.
- Zero boxes, zero shadows, zero gradients, zero blur — structure comes only from hairlines, tracking, and scale contrast.
- Every color is a readout state: blue identity, green complete, amber/red attention.

## Colors

### Palette

- **Mist** (`{colors.mist}` — `#F6F8FA`): The ground. Cool gray-blue light enough for slate text at full contrast, blue enough to read as instrument glass rather than paper.
- **Slate** (`{colors.slate}` — `#0F172A`): The ink — headlines, values, kickers, status words. The darkest value on the slide.
- **Signal Blue** (`{colors.signal-blue}` — `#2563EB`): Identity color — kicker tag text, case-log headings, context marker. A text color on mist (4.85:1, AA pass).
- **OK Green** (`{colors.ok-green}` — `#16A34A`): Complete state — live glyph, ● markers, ▲ glyphs. Never used for prose.
- **Warn Amber** (`{colors.warn-amber}` — `#B45309`): Attention state — UNDER REVIEW words (darkened for contrast), series name in the masthead. Never a fill.
- **Alert Red** (`{colors.alert-red}` — `#DC2626`): Fault state — ▼ glyphs, fault words. Used sparingly: at most one red accent per cover.
- **Row Rule** (`{colors.row-rule}` — `#CBD5E1`): Hairline dividers between ticker rows, under the masthead, and above the footer.
- **Muted** (`{colors.muted}` — `#64748B`): Dim mono keys, footer text, subtitle support. Never for headlines.
- **White** (`{colors.white}` — `#FFFFFF`): Reserved token, unused in the typography-only system. Never the slide ground.

### Defaults

- **Default surface background**: `{colors.mist}` flat, no texture, no grid wallpaper.
- **Default headline color**: `{colors.slate}` at Inter 800.
- **Default body/subtitle color**: `#475569` (slate at 70%) — softer than ink, darker than muted.
- **Default mono label color on mist**: `{colors.muted}` for keys, `{colors.slate}` for values.
- **Default status word**: slate word led by a ● glyph in the signal color (green complete, amber in-progress, red fault); series/identity tags set in signal blue.
- **Default rule color on mist**: `{colors.row-rule}`.

New accent needs should first try the existing semantic assignment (is it identity, complete, attention, or fault?) before introducing any new hue — and the answer is almost always one of the four.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Inter** is the argument face — used for the cover headline (800), subtitle (400), and KPI numerals (800, tabular). Its neutral grotesque character keeps dense data covers legible; the tight -0.015em tracking on headlines compensates for Inter's wide default spacing at display sizes.

**IBM Plex Mono** is the instrument face — used for the masthead, kicker line, context line, data rows, case log, status words, and footer. Plex Mono's squared, technical rhythm is what makes the cover read as a console rather than an article. It always carries letter-spacing (+0.06em to +0.16em) except inside dense case rows.

Never use Inter for chrome/labels and never use Plex Mono for the headline or subtitle. The sans/mono boundary is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.dashboard-hero}` | 96px | Inter | 800 | Cover headline |
| `{typography.deck-subtitle}` | 32px | Inter | 400 | Cover subtitle / lede |
| `{typography.kpi-numeral}` | 92px | Inter | 800 | KPI stat numeral, tabular |
| `{typography.masthead-mono}` | 20px | Plex Mono | 500 | Masthead telemetry |
| `{typography.kicker-label}` | 19px | Plex Mono | 600 | Kicker line text |
| `{typography.context-mono}` | 22px | Plex Mono | 500 | Context line under subtitle |
| `{typography.data-row}` | 20px | Plex Mono | 500 | Ticker row values |
| `{typography.data-key}` | 18px | Plex Mono | 400 | Ticker row keys (dim) |
| `{typography.case-row}` | 19px | Plex Mono | 500 | Case-log row ids |
| `{typography.status-word}` | 17px | Plex Mono | 600 | Status word text |
| `{typography.footer-mono}` | 18px | Plex Mono | 400 | Footer volume/page marks |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every Inter numeral is tabular.** Set `font-variant-numeric: tabular-nums` on headlines, KPI numerals, and any figure so digit columns align.
- **Every Plex Mono label carries letter-spacing** — +0.06em minimum on context lines, up to +0.16em on masthead telemetry and case-log headings. Untracked mono reads as code, not instrumentation.
- **Every KPI numeral pairs with a mono caption and a status word.** A bare giant number without its caption/word is an unfinished KPI block.
- **Every case-log heading is signal-blue mono** (`{colors.signal-blue}`, 0.16em tracking) — the identity voice of the log.
- **Every ticker row separates key (dim) from value (bright)** with the value right-aligned. ▲/▼ glyphs are reserved for rows whose value is a genuine trend; verdict words (COMPLETE/CONFIRMED/LIVE) never close a ticker row.
- **Every cover headline keeps tight tracking** (-0.015em) at 96px — Inter at display size without negative tracking reads loose and editorial.

### Defaults

- **Default size for a cover title**: `{typography.dashboard-hero}` (96px Inter 800, 1.04 line-height).
- **Default size for a cover subtitle**: `{typography.deck-subtitle}` (32px Inter 400, 1.45 line-height, max 20em).
- **Default size for a KPI numeral**: `{typography.kpi-numeral}` (92px Inter 800, line-height 1).
- **Default size for mono chrome**: 17–22px Plex Mono depending on element (status words 17–19px, rows 18–20px, context 22px).
- **Default headline color**: slate; default subtitle color: `#475569`; default mono value color on mist: slate.
- **Default numeral treatment**: tabular everywhere, no exceptions.

When unsure which face to reach for, ask whether the string could appear on a dashboard readout — counts, keys, statuses, dates are mono; arguments and explanations are Inter.

### Typography Principles

The voice contrast is **argument ↔ instrument**: Inter persuades, Plex Mono reports. Mixing them (mono headlines, sans data rows) flattens the console illusion immediately. Uppercase is reserved for mono chrome and kicker lines; Inter headlines are always sentence case, and Inter subtitles never take letter-spacing. Italic does not exist in this system — emphasis is carried by weight, color state, or the ▲/▼/● glyphs.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The cover is a vertical stack: mono masthead line closed by a hairline, a flexible 12-column content grid (72px page margins, 12px gutters), and a 60px hairline footer. The left evidence column spans 7 tracks (argument), the right spans 5 tracks (KPI block + case log).

Content never touches the viewport edge: the masthead rule and footer rule span margin to margin, and all grid content holds the 72px page margin. The stage background is mist; letterbox bars outside the stage are black.

### Grid Unit

Every measurement resolves to the **12px gutter rhythm**: grid gutters 12px, column gaps 12px, ticker row padding 13px (≈1 unit). Page margins are 72px (6 units), KPI numeral gap 26px. Rules are 1px hairlines throughout. This discipline is what makes the density feel engineered rather than crowded.

### Persistent Chrome

Three elements appear on every cover:

- **Masthead** — mono line on mist: green ● glyph + series telemetry left, `SAMPLE N = 11` right, closed by a hairline. Always mono 20px tracked.
- **Case log** — ruled evidence log in the right column enumerating the sample (PM-01 … PM-11) with status words.
- **Footer rule** — 1px row-rule hairline with brief mark left (`RESEARCH BRIEF · NOV 2026`) and page mark right (`P. 01`), mono 18px.

### Atmospheric Restraint

Signal Board has no atmospheric layer — no grain, no vignette, no grid wallpaper, no ambient animation. The "atmosphere" is the instrumentation itself: the live glyph, the telemetry, the ticker rows. Adding decorative texture would read as noise on a console. The one permitted ambient cue is the green live glyph, which may pulse once on entry and then hold steady.

## Depth and Elevation

### Hairlines as Structure (Signature)

Structure in this system is **ruled, not spatial**. The KPI block separates from the case log through a 1px hairline; ticker rows and case rows separate the same way — no fills, no box-shadow, no blur, no offset. Removing a rule merges two clusters; adding a fill breaks the typography-only contract.

### Weight and Scale as Depth

Hierarchy comes from **weight and scale contrast**: 92px tabular numerals against 17–19px tracked mono, 800-weight Inter against 400-weight rows. No element uses a slate fill; the figure/ground read is ink-on-mist throughout.

### Glyphs as State

Status words and kicker tags carry state through **colored glyphs plus words** (●/▲/▼ in blue/green/amber/red beside slate mono words) rather than fills. The glyph is the signal; the word is the record.

### No-Shadow, No-Box Rule

`box-shadow` is banned, and so are boxes: no cards, no panels, no pills, no filled bands, no swatches, no meter bars. The only structural strokes are the 1px hairline tokens (`{rules.row-rule}`, `{rules.masthead-rule}`, `{rules.footer-rule}`). Any blurred or offset drop shadow fails review.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no cards, panels, pills, chips, bands, or swatches. Curves appear only inside glyphs (the ●/▲/▼ markers and the tabular numerals themselves).

### Border Weights

- **1px solid** — ticker row rules, case-log row rules (`{colors.row-rule}`), masthead rule, footer rule. The only stroke in the system.
- **● glyph** — live indicator and status marker, a text character in the signal color, never a drawn circle.

Rules are always solid and always horizontal — never vertical dividers inside text columns, never dashed or dotted, never box edges.

### Decorative Element Types

**Masthead** — Mono line on mist with live glyph + telemetry, closed by a hairline. The system's masthead; appears on every cover.

**Kicker line** — Signal-blue series tag + dim slash + slate date in mono 19px/0.12em. Sits above the headline as the series tag.

**KPI block** — Open stat block: 92px tabular numeral + mono caption + status word, separated by a hairline. The system's hero statistic module.

**Status word** — Slate mono word led by a ● glyph in the semantic color: COMPLETE (green), UNDER REVIEW (amber), LOGGED (green), fault states (red). Never used for non-status text.

**Case log** — Ruled log of mono evidence rows with hairline separators and trailing status words. Makes the sample visible.

**Ticker data row** — Rule-separated mono row: dim key left, tabular value right. Sits under the headline as a findings strip; glyphs only for genuine trends.

**Context line** — Mono context string led by a blue ▸ glyph. The marker replaces bullets everywhere in this system.

**Live glyph** — Green ● text character opening the masthead. Signals "this console is on."

**Seal line** — Integrity caption pinned to the case-log bottom: `SAMPLE SEALED · 11 / 11` mono caption. Closes the evidence log the way a colophon closes a document.

## Do's and Don'ts

### Do

- Keep the mono masthead on every cover with the live glyph, series telemetry, and sample count — it is the system's masthead.
- Use Inter for argument (headline, subtitle, KPI numerals) and Plex Mono for instrumentation (labels, rows, status words, footer) — exclusively.
- Set tabular numerals on every figure so digit columns align across KPI blocks and ticker rows.
- Lead every status word with its ● glyph in the correct semantic color (blue identity, green complete, amber/red attention).
- Enumerate the evidence sample in the ruled case log with LOGGED / UNDER REVIEW status words so the cover's claims stay auditable.
- Separate the masthead, ticker rows, KPI block, and footer with 1px hairlines; keep gutters on the 12px rhythm.
- Carry status strictly through glyphs + words — there are no pills, cards, or panels to fall back on.
- Use ▲/▼ direction glyphs in green/red only where the row value is a genuine trend; never as verdict decoration.

### Don't

- Don't add boxes, box-shadows, blurs, gradients, or textures — structure is hairlines, tracking, and scale contrast only.
- Don't add cards, panels, pills, bands, or swatches — status lives in glyphs + words.
- Don't use green/amber/red as decoration — every signal color must read as a status state.
- Don't place mono headlines or sans data rows — the Inter/Plex boundary is structural.
- Don't use proportional numerals for figures — tabular alignment is non-negotiable.
- Don't add a third typeface, a fourth signal hue, or decorative illustration — the console vocabulary is closed.
- Don't let content touch the viewport edge — the 72px page margin holds on all grid content.
- Don't center the headline or the KPI stack — this system is flush-left and grid-ruled throughout.
- Don't invent statistics the deck does not support — ticker rows and KPI numerals must trace to real sample counts.
- Don't omit the case log on data covers — a Signal Board without visible evidence is just a gray slide.

## Responsive Behavior

Signal Board is a **fixed-stage system** built for 1920×1080 with absolute pixel sizing — 96px headlines, 92px KPI numerals, 20px masthead line. There are no breakpoints and no fluid type; the stage scaler handles all viewport adaptation with a uniform transform.

### Scaling Behavior

- The whole stage scales uniformly via `__typodeckFitStage`; no element reflows or wraps differently at any viewport.
- At phone widths the stage letterboxes — small but proportionally exact, preserving tabular alignment.
- The 12px gutter rhythm and 1px hairlines scale with the stage (they are inside it), so the engineered density holds at every size.

### Component Breakpoints

None. The 12-column grid, KPI stack, and case log are fixed-span. If a future multi-slide extension needs narrower layouts, it must define new grid spans explicitly rather than collapsing these.

### Presenter Behavior

- Covers are static readouts: no slide-to-slide animation is specified beyond the standard stage transition.
- The live glyph may pulse once (green 100% → 40% → 100% over 600ms) on cover entry, then hold steady; `prefers-reduced-motion` disables even this.
- Ticker rows and KPI numerals render at final values immediately — no count-up animation on the cover.

### Animation Triggers

None required. Any future count-up or row-reveal animation must respect `prefers-reduced-motion` and must complete within 800ms so screenshots capture end state.

### Print Behavior

The system prints as a flat static frame: ink-on-mist throughout, hairlines hold at 1px, and status glyphs print as solid color. No `@media print` overrides are defined; export captures the stage at 1920×1080.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for Noto Sans SC with Plex-compatible mono fallback, and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Headline / subtitle / KPI numerals | Inter 400–800 | Noto Sans SC 500–900 |
| Chrome / rows / status words / footer | IBM Plex Mono 400–600 | Noto Sans SC 400–500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin coverage. Set text elements to `font-family: 'Noto Sans SC', sans-serif` so mixed strings like `11 个复盘` render in one face. Hierarchy survives through weight (900/700/500/400) plus the system's signals: status glyphs, hairline rules, scale contrast. Keep tabular-nums on for digit runs.

### Loading

Add to the cover's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
```

### Universal CJK Adjustments

- **Line-height**: increase ~15–20% from the Latin spec. Headline 1.2–1.25 (up from 1.04), subtitle 1.6–1.7 (up from 1.45), mono rows 1.6 (up from 1.4).
- **Letter-spacing**: set to 0 on every CJK run. The 0.06–0.16em mono tracking and -0.015em headline tracking look broken on square CJK glyphs.
- **Text transform**: never apply `uppercase` to CJK runs (no case exists); keep kicker/status-word text CJK as-is.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: omit the period on cover-scale CJK titles.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin/digits, e.g. `PM-01 复盘`.
- **One font per sentence**: let Noto Sans SC handle mixed runs; do not let Inter or Plex Mono intrude mid-sentence.

### Aesthetic Notes for This System

The console illusion survives CJK well because it rests on **structural** signals: the masthead line, status glyphs, hairline rules, and tabular numerals all carry the instrument voice when the faces go generic. The biggest loss is the mono rhythm of telemetry — compensate by keeping the ●/▲/▼ glyphs and the live glyph prominent. KPI numerals stay Latin digits (tabular) even in CJK builds.

### Known CJK Gap

- **No CJK monospace with Plex character.** Noto Sans SC at 400–500 replaces the instrument voice but loses the squared technical rhythm; status glyphs and rules must carry recognition.
- **Tracked kicker text collapses.** The 0.12em kicker tracking that makes Latin kickers feel engineered must drop to 0 for CJK; keep kickers compact instead.

## Iteration Guide

1. Any new cover keeps the mono masthead with live glyph, series telemetry, and sample count — it is the masthead, not optional chrome.
2. Any new headline uses Inter 800 at 96px with tabular numerals and -0.015em tracking; any new subtitle uses Inter 400 at 32px.
3. Any new label, kicker, row, or footer mark uses IBM Plex Mono with the token's specified tracking — never Inter, never untracked.
4. Any new statistic gets a full KPI block (numeral + mono caption + status word + separating hairline), not a bare number.
5. Any new evidence set gets a ruled case log enumerating its rows with hairlines and status words.
6. Any new finding strip uses ticker data rows: dim key left, tabular value right, 1px rules between. Glyphs only for genuine trends.
7. Any new measurement follows the 12px gutter rhythm; page margins stay 72px; rules stay 1px hairlines.
8. Any new color assignment must map to the semantic states (blue identity, green complete, amber attention, red fault) — no decorative hues.
9. New covers stay flat and box-free: no cards, panels, pills, fills, shadows, gradients, blur, or texture — structure is hairlines, tracking, and scale contrast only.
10. CJK builds swap to Noto Sans SC per the CJK section, zero tracking on CJK runs, Latin tabular digits preserved.
11. Long titles auto-fit: the `__sbFitTitle` script shrinks the 96px headline in 2px steps (floor 56px) only while the left well exceeds 900px — PRIMARY covers never trigger it.

## Known Gaps

- **Fonts**: Inter / IBM Plex Mono via Google Fonts CDN (`display=swap`); fallbacks `system-ui, sans-serif` / `ui-monospace, monospace`. No font files committed. Offline rendering falls back to system stacks and loses the console voice.
- **Live-glyph pulse is CSS-only** with no JS state behind it — the "live" signal is decorative, not bound to any data feed.
- **KPI numerals and ticker values are hardcoded strings**, not bound to a data source — updating figures means editing markup.
- **Case-log rows are static markup** — there is no pagination or data-binding layer for samples larger than the visible rows.
- **Tabular alignment assumes Inter/Plex tabular figures** — fallback fonts may use proportional digits and break digit-column alignment.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in system |
| 2 | Blend modes | None used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional one-shot live-dot pulse | none | Static green dot |
| 4 | Pixel / hard offset shadows | None used (hairlines only) | full | N/A — rules export natively |
| 5 | Gradients | None used | full | N/A — all fills solid |
| 6 | Grain / scanline / noise overlays | None used | full | N/A — no overlays |
| 7 | Transparency layers | None used | full | N/A — no translucent fills in system |
| 8 | Custom fonts | Inter + IBM Plex Mono via CDN | partial | Embedded fonts or Calibri/Consolas substitution |
| 9 | Absolute-positioned decor | Live glyph and markers are text runs (no absolute decor) | full | N/A — type only |
