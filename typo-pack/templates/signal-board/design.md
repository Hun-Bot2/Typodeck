---
version: alpha
name: Signal Board
description: An information-systems cover that reads as a live ops dashboard. Inter carries the argument with tabular numerals while IBM Plex Mono carries every label, pill, and data row. A slate command bar with a live green dot crowns a mist-gray ground ruled by hairlines; flat KPI stat cards and a dark case-log panel keep the evidence sample (PM-01 … PM-11) visible beside the headline. Signal colors are strictly semantic — blue identity, green complete, amber/red attention — with zero shadows and zero decoration that is not also a readout.

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
  kpi-hairline: "inset 0 0 0 1px #E2E8F0"
  topbar-edge: "inset 0 -1px 0 0 #1E293B"

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
  topbar-mono:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.14em
  pill-label:
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
  status-pill:
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
  pad-topbar-h: 64px
  pad-panel: 30px 34px
  kpi-numeral-gap: 26px
  row-pad-y: 13px
  content-max-width: 1776px

canvas:
  width: 1920px
  height: 1080px

components:
  topbar:
    background: "{colors.slate}"
    height: 64px
    padding: "0 72px"
    description: "Slate command bar: live green dot + series telemetry left, sample count right, mono 20px tracked."
  kicker-pill:
    background: "{colors.signal-blue}"
    color: "{colors.white}"
    padding: "10px 22px"
    borderRadius: 999px
    description: "Solid signal-blue mono pill for the series kicker; ghost variant is a 2px slate outline pill."
  kpi-card:
    background: "{colors.white}"
    border: "1px solid #E2E8F0"
    borderTop: "6px solid {colors.signal-blue}"
    padding: "30px 34px 28px 34px"
    description: "Flat stat card: 92px tabular numeral beside mono caption + status pill; top border color carries the signal."
  status-pill:
    borderRadius: 999px
    padding: "8px 18px"
    description: "Flat full/semi pill in ok-green, warn-amber, or alert-red; the only rounded shape in the system."
  case-log:
    background: "{colors.slate}"
    padding: "26px 30px 22px 30px"
    description: "Dark evidence panel: one mono case row per case (PM-01 … PM-11), separated by #334155 hairlines with LOGGED/UNDER REVIEW pills. No summary rows — the log is the summary."
  data-row:
    borderTop: "1px solid {colors.row-rule}"
    padding: "13px 2px"
    description: "Ticker-style finding row: dim mono key left, tabular value right. Direction glyphs (▲/▼) appear only beside genuine trend values, never as verdict decoration."
  context-line:
    swatch: "18px solid {colors.signal-blue}"
    gap: 14px
    description: "Mono context line led by a blue signal swatch instead of a bullet."
  seal-bar:
    track: "10px solid #334155 full-width"
    fill: "10px solid {colors.ok-green} at 100%"
    description: "Sample-integrity bar pinned to the case-log bottom via margin-top:auto: full green fill over a slate track with a mono SEALED caption."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and panel overlap.


## Overview

Signal Board is an **information-systems cover** — the title slide behaves like a live ops console at the moment the numbers land, not like a magazine spread. The left column carries the argument (kicker pills, heavyweight Inter headline, mono context line, ticker data rows) and the right column carries the evidence (KPI stat cards, dark case-log panel). A slate command bar with a green live dot and mono telemetry crowns every cover; a hairline footer with the volume mark and page number closes it.

The type contract is two faces with a hard boundary. **Inter** (400–800, always tabular numerals) carries headlines, subtitles, and KPI numerals. **IBM Plex Mono** (400–600) carries every label, pill, data row, case id, and footer mark. Mono is the system's "instrument" voice: if a string could appear on a dashboard — a count, a status, a key, a date — it is mono.

The palette is **semantic, not decorative**. Mist gray-blue (`{colors.mist}`) is the ground; slate (`{colors.slate}`) is the command color for the topbar, case log, and headline ink. Signal blue marks identity (kicker pill, KPI border, context swatch); ok-green means complete; warn-amber and alert-red mark attention and never appear as fill on large areas. Every color choice must be defensible as a readout state.

**Density philosophy: dense but ruled.** The system packs a headline, one KPI card, a five-row case log, and three ticker rows onto one cover — but every cluster is separated by hairlines, 12px gutters, or the 6px KPI signal border, so density reads as instrumentation rather than clutter. Whitespace is structural (grid gutters, panel padding), never atmospheric.

**Key Characteristics:**
- Slate command bar with live green dot and mono telemetry (series name, sample count) crowns every cover.
- KPI stat cards pair a 92px tabular Inter numeral with a mono caption and a flat status pill, keyed by a 6px signal-color top border.
- Dark case-log panel enumerates the evidence set (PM-01 … PM-11) as mono rows with LOGGED / UNDER REVIEW pills.
- Rule-separated mono data rows (key left, value right, no verdict glyphs) sit under the headline like a ticker of findings.
- Status pills are the only rounded shapes in the system — everything else is square and ruled.
- Tabular numerals everywhere; columns of figures align digit-for-digit with zero layout jitter.
- Zero shadows, zero gradients, zero blur — depth comes only from the slate/mist inversion and the 6px signal borders.
- Every color is a readout state: blue identity, green complete, amber/red attention.

## Colors

### Palette

- **Mist** (`{colors.mist}` — `#F6F8FA`): The ground. Cool gray-blue light enough for slate text at full contrast, blue enough to read as instrument glass rather than paper.
- **Slate** (`{colors.slate}` — `#0F172A`): The command color — topbar, case-log panel, headline ink, ghost-pill outline. The darkest value on the slide.
- **Signal Blue** (`{colors.signal-blue}` — `#2563EB`): Identity color — kicker pill fill, KPI top border, context swatch, case-log heading tint. Never a text color on mist except in the pill (reversed white on blue).
- **OK Green** (`{colors.ok-green}` — `#16A34A`): Complete state — live dot, COMPLETE/LOGGED pills, ▲ glyphs. Never used for prose.
- **Warn Amber** (`{colors.warn-amber}` — `#B45309`): Attention state — UNDER REVIEW pills on light grounds (darkened for contrast), series name in the topbar. Never a large fill.
- **Alert Red** (`{colors.alert-red}` — `#DC2626`): Fault state — ▼ glyphs, the red KPI top border, fault pills. Used sparingly: at most one red accent per cover.
- **Row Rule** (`{colors.row-rule}` — `#CBD5E1`): Hairline dividers between ticker rows and above the footer.
- **Muted** (`{colors.muted}` — `#64748B`): Dim mono keys, footer text, subtitle support. Never for headlines.
- **White** (`{colors.white}` — `#FFFFFF`): KPI card fill and reversed text on slate/blue/green/red. Never the slide ground.

### Defaults

- **Default surface background**: `{colors.mist}` flat, no texture, no grid wallpaper.
- **Default headline color**: `{colors.slate}` at Inter 800.
- **Default body/subtitle color**: `#475569` (slate at 70%) — softer than ink, darker than muted.
- **Default mono label color on mist**: `{colors.muted}` for keys, `{colors.slate}` for values.
- **Default mono text on slate**: `#E2E8F0` with `#94A3B8` dims and `#93C5FD` section headings.
- **Default pill assignment**: blue = series/identity, green = complete, amber = in-progress, red = fault.
- **Default rule color on mist**: `{colors.row-rule}`; on slate: `#334155`.

New accent needs should first try the existing semantic assignment (is it identity, complete, attention, or fault?) before introducing any new hue — and the answer is almost always one of the four.

## Typography

### Font Family

The system runs two faces, each locked to its role.

**Inter** is the argument face — used for the cover headline (800), subtitle (400), and KPI numerals (800, tabular). Its neutral grotesque character keeps dense data covers legible; the tight -0.015em tracking on headlines compensates for Inter's wide default spacing at display sizes.

**IBM Plex Mono** is the instrument face — used for the topbar, kicker pills, context line, data rows, case log, status pills, and footer. Plex Mono's squared, technical rhythm is what makes the cover read as a console rather than an article. It always carries letter-spacing (+0.06em to +0.16em) except inside dense case rows.

Never use Inter for chrome/labels and never use Plex Mono for the headline or subtitle. The sans/mono boundary is the typographic structure.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.dashboard-hero}` | 96px | Inter | 800 | Cover headline |
| `{typography.deck-subtitle}` | 32px | Inter | 400 | Cover subtitle / lede |
| `{typography.kpi-numeral}` | 92px | Inter | 800 | KPI stat numeral, tabular |
| `{typography.topbar-mono}` | 20px | Plex Mono | 500 | Command-bar telemetry |
| `{typography.pill-label}` | 19px | Plex Mono | 600 | Kicker pill text |
| `{typography.context-mono}` | 22px | Plex Mono | 500 | Context line under subtitle |
| `{typography.data-row}` | 20px | Plex Mono | 500 | Ticker row values |
| `{typography.data-key}` | 18px | Plex Mono | 400 | Ticker row keys (dim) |
| `{typography.case-row}` | 19px | Plex Mono | 500 | Case-log row ids |
| `{typography.status-pill}` | 17px | Plex Mono | 600 | Status pill text |
| `{typography.footer-mono}` | 18px | Plex Mono | 400 | Footer volume/page marks |

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every Inter numeral is tabular.** Set `font-variant-numeric: tabular-nums` on headlines, KPI numerals, and any figure so digit columns align.
- **Every Plex Mono label carries letter-spacing** — +0.06em minimum on context lines, up to +0.16em on topbar telemetry and case-log headings. Untracked mono reads as code, not instrumentation.
- **Every KPI numeral pairs with a mono caption and a status pill.** A bare giant number without its caption/pill is an unfinished KPI card.
- **Every case-log heading is blue-tinted mono** (`#93C5FD`, 0.16em tracking) — the only blue text in the dark panel.
- **Every ticker row separates key (dim) from value (bright)** with the value right-aligned. ▲/▼ glyphs are reserved for rows whose value is a genuine trend; verdict words (COMPLETE/CONFIRMED/LIVE) never close a ticker row.
- **Every cover headline keeps tight tracking** (-0.015em) at 96px — Inter at display size without negative tracking reads loose and editorial.

### Defaults

- **Default size for a cover title**: `{typography.dashboard-hero}` (96px Inter 800, 1.04 line-height).
- **Default size for a cover subtitle**: `{typography.deck-subtitle}` (32px Inter 400, 1.45 line-height, max 20em).
- **Default size for a KPI numeral**: `{typography.kpi-numeral}` (92px Inter 800, line-height 1).
- **Default size for mono chrome**: 17–22px Plex Mono depending on element (pills 17–19px, rows 18–20px, context 22px).
- **Default headline color**: slate; default subtitle color: `#475569`; default mono value color on mist: slate.
- **Default numeral treatment**: tabular everywhere, no exceptions.

When unsure which face to reach for, ask whether the string could appear on a dashboard readout — counts, keys, statuses, dates are mono; arguments and explanations are Inter.

### Typography Principles

The voice contrast is **argument ↔ instrument**: Inter persuades, Plex Mono reports. Mixing them (mono headlines, sans data rows) flattens the console illusion immediately. Uppercase is reserved for mono chrome and kicker pills; Inter headlines are always sentence case, and Inter subtitles never take letter-spacing. Italic does not exist in this system — emphasis is carried by weight, color state, or the ▲/▼ glyphs.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage**. The cover is a vertical stack: 64px slate command bar, a flexible 12-column content grid (72px page margins, 12px gutters), and a 60px hairline footer. The left evidence column spans 7 tracks (argument), the right spans 5 tracks (KPI cards + case log).

Content never touches the viewport edge: the topbar and footer span full bleed, but all grid content holds the 72px page margin. The stage background is mist; letterbox bars outside the stage are black.

### Grid Unit

Every measurement resolves to the **12px gutter rhythm**: grid gutters 12px, panel gaps 12px, ticker row padding 13px (≈1 unit), pill padding 10/22px. Page margins are 72px (6 units), topbar height 64px, KPI numeral gap 26px. Borders are 1px hairlines except the 6px KPI signal border and 2px ghost-pill outline. This discipline is what makes the density feel engineered rather than crowded.

### Persistent Chrome

Three elements appear on every cover:

- **Command bar** — 64px slate strip: green live dot + series telemetry left, `SAMPLE N = 11` right. Always mono 20px tracked.
- **Case log** — dark slate evidence panel in the right column enumerating the sample (PM-01 … PM-11) with status pills.
- **Footer rule** — 1px row-rule hairline with brief mark left (`RESEARCH BRIEF · NOV 2026`) and page mark right (`P. 01`), mono 18px.

### Atmospheric Restraint

Signal Board has no atmospheric layer — no grain, no vignette, no grid wallpaper, no ambient animation. The "atmosphere" is the instrumentation itself: the live dot, the telemetry, the ticker rows. Adding decorative texture would read as noise on a console. The one permitted ambient cue is the green live dot, which may pulse once on entry and then hold steady.

## Depth and Elevation

### Flat Signal Borders (Signature)

Depth in this system is **chromatic, not spatial**. KPI cards lift off the mist ground through a white fill + 1px hairline + 6px signal-color top border — no box-shadow, no blur, no offset. The 6px border is the elevation signal: blue for identity metrics, green for complete, red for faults. Removing the border flattens the card into the ground; adding a shadow breaks the flat-console contract.

### Slate Inversion as Depth

The two dark elements (command bar, case log) create depth by **value inversion** against the mist ground. They are the "recessed console wells" of the composition — content inside them is mono-on-slate, content outside is sans-on-mist. No other element may use a slate fill; over-inversion destroys the figure/ground read.

### Pills as Floating State

Status pills and kicker pills are the only elements allowed to feel "raised," and they do it through **saturated flat fill** (blue/green/amber/red) rather than shadow. On the dark case log, pills use translucent fills (green 22%, amber 20%) so they glow against slate without blur.

### No-Shadow Rule

`box-shadow` is effectively banned. The single exception is the inset hairline tokens (`{shadows.kpi-hairline}`, `{shadows.topbar-edge}`), which are 1px structural edges, not depth cues. Any blurred or offset drop shadow fails review.

## Shapes and Treatment

### Border Radius

Near-zero. KPI cards, panels, bars, swatches, and chips are square (0px). The **only** rounded shapes are pills — kicker pills, status pills, case-status pills — at full 999px radius — plus the 14px live dot (a true circle). A rounded card or rounded panel would read as consumer-soft against the instrument aesthetic.

### Border Weights

- **1px solid** — KPI card outlines (`#E2E8F0`), ticker row rules (`{colors.row-rule}`), case-log hairlines (`#334155`), footer rule.
- **2px solid** — ghost kicker-pill outline (slate on mist).
- **6px solid** — KPI card top signal border (blue/green/red). The heaviest stroke in the system and the primary elevation cue.
- **14px dot** — live indicator, solid green circle, no ring.

Borders are always solid and always horizontal rules or panel edges — never vertical dividers inside text columns, never dashed or dotted.

### Decorative Element Types

**Command bar** — 64px slate strip with live dot + mono telemetry. The system's masthead; appears on every cover.

**Kicker pill** — Solid blue (identity) or ghost-outline mono pill at 19px/0.12em. Sits above the headline as the series tag.

**KPI card** — White flat card with 6px signal top border: 92px tabular numeral + mono caption + status pill. The system's hero statistic module.

**Status pill** — Flat 999px-radius mono pill in a semantic color: COMPLETE (green), UNDER REVIEW (amber), LOGGED (translucent green on slate), fault states (red). Never used for non-status text.

**Case log** — Dark slate panel of mono evidence rows with hairline separators and trailing status pills. Makes the sample visible.

**Ticker data row** — Rule-separated mono row: dim key left, tabular value right. Sits under the headline as a findings strip; glyphs only for genuine trends.

**Context line** — Mono context string led by an 18px blue signal swatch. The swatch replaces bullets everywhere in this system.

**Live dot** — 14px solid green circle opening the command bar. The only circular element; signals "this console is on."

**Seal bar** — Full-width integrity meter pinned to the case-log bottom: 10px green fill at 100% over a slate track with a `SAMPLE SEALED · 11 / 11` mono caption. Closes the evidence panel the way a progress bar closes a task.

## Do's and Don'ts

### Do

- Keep the slate command bar on every cover with the live dot, series telemetry, and sample count — it is the system's masthead.
- Use Inter for argument (headline, subtitle, KPI numerals) and Plex Mono for instrumentation (labels, rows, pills, footer) — exclusively.
- Set tabular numerals on every figure so digit columns align across KPI cards and ticker rows.
- Key every KPI card with its 6px signal-color top border in the correct semantic color (blue identity, green complete, red fault).
- Enumerate the evidence sample in the dark case log with LOGGED / UNDER REVIEW pills so the cover's claims stay auditable.
- Separate ticker rows and footer with 1px hairlines; keep gutters on the 12px rhythm.
- Reserve pills (999px radius) strictly for status and series tags — they are the only round shapes.
- Use ▲/▼ direction glyphs in green/red only where the row value is a genuine trend; never as verdict decoration.

### Don't

- Don't add box-shadows, blurs, gradients, or textures — depth is flat signal borders and slate inversion only.
- Don't round cards, panels, or chips — pills and the live dot are the only curves.
- Don't use green/amber/red as decoration — every signal color must read as a status state.
- Don't place mono headlines or sans data rows — the Inter/Plex boundary is structural.
- Don't use proportional numerals for figures — tabular alignment is non-negotiable.
- Don't add a third typeface, a fourth signal hue, or decorative illustration — the console vocabulary is closed.
- Don't let content touch the viewport edge — the 72px page margin holds on all grid content.
- Don't center the headline or the KPI stack — this system is flush-left and grid-ruled throughout.
- Don't invent statistics the deck does not support — ticker rows and KPI numerals must trace to real sample counts.
- Don't omit the case log on data covers — a Signal Board without visible evidence is just a gray slide.

## Responsive Behavior

Signal Board is a **fixed-stage system** built for 1920×1080 with absolute pixel sizing — 96px headlines, 92px KPI numerals, 64px command bar. There are no breakpoints and no fluid type; the stage scaler handles all viewport adaptation with a uniform transform.

### Scaling Behavior

- The whole stage scales uniformly via `__typodeckFitStage`; no element reflows or wraps differently at any viewport.
- At phone widths the stage letterboxes — small but proportionally exact, preserving tabular alignment.
- The 12px gutter rhythm, 1px hairlines, and 6px KPI borders scale with the stage (they are inside it), so the engineered density holds at every size.

### Component Breakpoints

None. The 12-column grid, KPI stack, and case log are fixed-span. If a future multi-slide extension needs narrower layouts, it must define new grid spans explicitly rather than collapsing these.

### Presenter Behavior

- Covers are static readouts: no slide-to-slide animation is specified beyond the standard stage transition.
- The live dot may pulse once (green 100% → 40% → 100% over 600ms) on cover entry, then hold steady; `prefers-reduced-motion` disables even this.
- Ticker rows and KPI numerals render at final values immediately — no count-up animation on the cover.

### Animation Triggers

None required. Any future count-up or row-reveal animation must respect `prefers-reduced-motion` and must complete within 800ms so screenshots capture end state.

### Print Behavior

The system prints as a flat static frame: slate command bar and case log print as solid fills (no ink-saving inversion), hairlines hold at 1px, and pills print as flat color. No `@media print` overrides are defined; export captures the stage at 1920×1080.

## CJK & International Content

When using this system for Chinese (or other CJK) content, swap the Latin stack for Noto Sans SC with Plex-compatible mono fallback, and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Headline / subtitle / KPI numerals | Inter 400–800 | Noto Sans SC 500–900 |
| Chrome / rows / pills / footer | IBM Plex Mono 400–600 | Noto Sans SC 400–500 (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin coverage. Set text elements to `font-family: 'Noto Sans SC', sans-serif` so mixed strings like `11 个复盘` render in one face. Hierarchy survives through weight (900/700/500/400) plus the system's non-typographic signals: 6px KPI borders, pill fills, hairline rules. Keep tabular-nums on for digit runs.

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
- **Text transform**: never apply `uppercase` to CJK runs (no case exists); keep pill text CJK as-is.
- **Punctuation**: use full-width CJK punctuation （，。：；！？「」（））.
- **No trailing 。 on display headlines**: omit the period on cover-scale CJK titles.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between CJK and adjacent Latin/digits, e.g. `PM-01 复盘`.
- **One font per sentence**: let Noto Sans SC handle mixed runs; do not let Inter or Plex Mono intrude mid-sentence.

### Aesthetic Notes for This System

The console illusion survives CJK well because it rests on **non-typographic** signals: the slate command bar, KPI signal borders, status pills, and hairline rules all carry the instrument voice when the faces go generic. The biggest loss is the mono rhythm of telemetry — compensate by keeping pill fills, the live dot, and the ▲/▼ glyphs prominent. KPI numerals stay Latin digits (tabular) even in CJK builds.

### Known CJK Gap

- **No CJK monospace with Plex character.** Noto Sans SC at 400–500 replaces the instrument voice but loses the squared technical rhythm; pill fills and rules must carry recognition.
- **Tracked pill text collapses.** The 0.12em pill tracking that makes Latin pills feel engineered must drop to 0 for CJK; keep pills compact with tighter padding instead.

## Iteration Guide

1. Any new cover keeps the 64px slate command bar with live dot, series telemetry, and sample count — it is the masthead, not optional chrome.
2. Any new headline uses Inter 800 at 96px with tabular numerals and -0.015em tracking; any new subtitle uses Inter 400 at 32px.
3. Any new label, pill, row, or footer mark uses IBM Plex Mono with the token's specified tracking — never Inter, never untracked.
4. Any new statistic gets a full KPI card (numeral + mono caption + status pill + 6px signal border in the correct semantic color), not a bare number.
5. Any new evidence set gets a dark case-log panel enumerating its rows with hairlines and status pills.
6. Any new finding strip uses ticker data rows: dim key left, tabular value right, 1px rules between. Glyphs only for genuine trends.
7. Any new measurement follows the 12px gutter rhythm; page margins stay 72px; only pills (999px) and the live dot may be round.
8. Any new color assignment must map to the semantic states (blue identity, green complete, amber attention, red fault) — no decorative hues.
9. New covers stay flat: no shadows, no gradients, no blur, no texture — depth is signal borders and slate inversion only.
10. CJK builds swap to Noto Sans SC per the CJK section, zero tracking on CJK runs, Latin tabular digits preserved.
11. Long titles auto-fit: the `__sbFitTitle` script shrinks the 96px headline in 2px steps (floor 56px) only while the left well exceeds 900px — PRIMARY covers never trigger it.

## Known Gaps

- **Fonts**: Inter / IBM Plex Mono via Google Fonts CDN (`display=swap`); fallbacks `system-ui, sans-serif` / `ui-monospace, monospace`. No font files committed. Offline rendering falls back to system stacks and loses the console voice.
- **Live-dot pulse is CSS-only** with no JS state behind it — the "live" signal is decorative, not bound to any data feed.
- **KPI numerals and ticker values are hardcoded strings**, not bound to a data source — updating figures means editing markup.
- **Case-log rows are static markup** — there is no pagination or data-binding layer for samples larger than the visible rows.
- **Tabular alignment assumes Inter/Plex tabular figures** — fallback fonts may use proportional digits and break digit-column alignment.
- **PPTX fidelity disclosure:**

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|--------|------------------------|----------|--------------------|
| 1 | Blur (backdrop / filter) | None used | full | N/A — no blur in system |
| 2 | Blend modes | None used | full | N/A — no blends in system |
| 3 | Animation / keyframes | Optional one-shot live-dot pulse | none | Static green dot |
| 4 | Pixel / hard offset shadows | None used (flat borders only) | full | N/A — borders export natively |
| 5 | Gradients | None used | full | N/A — all fills solid |
| 6 | Grain / scanline / noise overlays | None used | full | N/A — no overlays |
| 7 | Transparency layers | Translucent pill fills on slate (rgba 20–22%) | partial | Opaque pill fills at nearest solid |
| 8 | Custom fonts | Inter + IBM Plex Mono via CDN | partial | Embedded fonts or Calibri/Consolas substitution |
| 9 | Absolute-positioned decor | Live dot, swatches, pills as flex children (no absolute decor) | full | Native shapes in place |
