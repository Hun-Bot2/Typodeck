---
version: alpha
name: Paper TTY
description: A light-mode terminal console rendered as a printed page. IBM Plex Mono is the only face — hierarchy comes from weight, dimming, and green command tokens. Warm paper ground (#F4F1EA), flat with no grid wash, a dimmed line-number gutter, ASCII rules instead of borders, green dollar prompts, one red failure keyword per slide, and a ▌ glyph cursor parked after the final line. Calm lab-notebook precision crossed with a well-kept dotfiles repo. Typography-only: no highlight boxes, no status band, no chips, no grids.
colors:
  paper: "#F4F1EA"
  ink: "#111111"
  dim: "#6B675E"
  faint-line: "#E2DCCC"
  green: "#007A33"
  red: "#B00020"
  amber-hi: "#FFE9A8"
  white: "#FFFFFF"
shadows:
  none-flat: "none"
rules:
  header-underline: "2px solid {colors.ink}"
  status-rule: "2px solid {colors.ink}"
typography:
  session-title:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "76px"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: 0
  section-head:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  subhead:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0
  body:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  prompt-line:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  comment-line:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  gutter-number:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  status-line:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.04em
  label-dim:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.08em
    textTransform: uppercase
  table-cell:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  counter:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.1em
spacing:
  char-unit: 8px
  pad-slide-y: 72px
  pad-slide-x: 96px
  gutter-width: 72px
  gutter-gap: 40px
  measure-max: 66ch
  gap-rule-title: 32px
  gap-title-sub: 24px
  gap-section: 48px
  content-max-width: 1560px
canvas:
  width: 1920px
  height: 1080px
components:
  session-header:
    borderBottom: "2px solid {colors.ink}"
    padding: "0 0 16px 0"
    description: "Top line of the slide: green $ prompt + typed command in ink + dimmed trailing comment. Anchors the terminal-session fiction."
  ascii-rule-double:
    color: "{colors.dim}"
    fontSize: 24px
    letterSpacing: 0
    description: "A full-measure row of = characters in dim ink. Separates the header session line from the title output block."
  ascii-rule-single:
    color: "{colors.dim}"
    fontSize: 24px
    letterSpacing: 0
    description: "A full-measure row of - characters in dim ink. Separates body regions and sits above the status line."
  command-token:
    color: "{colors.green}"
    fontWeight: 700
    description: "The typed command set in bold green, marking the phrase the presenter invoked. Max two green runs per slide; never nested."
  glyph-cursor:
    glyph: "▌"
    color: "{colors.ink}"
    description: "Block glyph parked after the final line of output. Static-visible (no blink) so captures are deterministic. The session-is-live mark."
  gutter:
    width: 72px
    color: "{colors.dim}"
    fontSize: 20px
    description: "Right-aligned dimmed line-number column at 55% ink, fixed 72px wide with a 40px gap to the text well."
  prompt-glyph:
    color: "{colors.green}"
    fontWeight: 700
    description: "The $ character opening every command line. Always green weight 700; the only green on most slides besides ok-tokens."
  status-line:
    rule: "2px solid {colors.ink} above"
    color: "{colors.ink}"
    padding: "20px 0"
    fontSize: 22px
    description: "Ruled bottom line: filename + section + line/col readout in ink with dim separators. Fixed to the slide foot."
  callout-block:
    leader: "# !"
    color: "{colors.ink}"
    description: "Warning or key figure set as plain text lines led by # leaders. Holds warnings and key figures on inner slides; never boxed."
  warn-token:
    color: "{colors.red}"
    fontSize: 20px
    fontWeight: 700
    description: "Bold red inline token for the single failure keyword (FAIL, count of errors). One per slide maximum."
  ok-token:
    color: "{colors.green}"
    fontWeight: 700
    description: "Inline green [ok] marker for passing checks and healthy stats."
  data-table:
    borderCollapse: collapse
    description: "Pipe-and-dash ASCII table: header row, --- separator row, zebra none, tabular numerals, dim grid pipes."
  progress-meter:
    glyphs: "[####----]"
    description: "Typed meter on inner slides: # fills and - empties between [ ] brackets. Never a drawn bar."
---

## Frontend Slides Fixed-Stage Policy

When this design system is used by the `frontend-slides` skill, generate the final deck as a **fixed 1920×1080 stage** that scales uniformly to the browser viewport. The deck should preserve a 16:9 slide canvas on every screen, including phones; it may letterbox or pillarbox, but it should not reflow slide content for mobile.

This policy has higher priority than any source-template responsive behavior described later in this file. If a later section says the original template is viewport-fluid, treat that as source history only, not as the target generation model for `frontend-slides`.

This policy applies even if the source template was originally implemented with viewport-fluid CSS such as `100vw`, `100vh`, `vw`, `vh`, or `clamp()`. Treat those values as design proportions to translate into 1920×1080 stage coordinates, not as live responsive rules in the generated deck.

Use `deck-stage.js` or an equivalent inline stage scaler for final output: render each slide at 1920×1080, scale the whole stage with one transform, and verify rendered screenshots for both text overflow and gutter alignment.


## Overview

Paper TTY is a **light-mode terminal console rendered as a printed page**. Its foundational premise is the **single-face mono system**: IBM Plex Mono at 400 and 700 carries display, body, labels, tables, and chrome. Hierarchy never comes from a second family — it comes from weight contrast (700 vs 400), ink dimming (full #111111 vs 55% #6B675E), green command tokens, and vertical spacing on an 8px baseline.

The slide reads as one typed session frozen mid-run. A green `$` prompt line opens the surface, the title lands as large bold command output, the subtitle sits as a dimmed `#` comment, ASCII rules separate regions, and a ▌ glyph cursor parks after the final line. The text measure never exceeds 66 characters on flat paper, and a dimmed line-number gutter ticks down the left edge. Green marks the prompt, commands, and `[ok]` tokens; red is rationed to exactly one failure keyword per slide so the eye lands on what broke.

Depth is flat. There are no blurred shadows, no gradients, no glass, no boxes. The only structure is the 2px ink underline under the session header and the 2px rule above the status line at the foot. The paper ground (#F4F1EA) does the atmospheric work that dark terminals do with glow.

**Density philosophy: one session, generously leaded.** Every slide carries a single command-output moment — a prompt, a title block, a short comment, a rule, a status line — with 24–48px gaps between regions. Inner slides may add a callout block or an ASCII table, but the text well stays a calm 66ch column. A typical title slide holds the session header, a 2–3 line title, a one-line comment, and the footer status line, with the gutter numbering every row.

**Key Characteristics:**
- Single-face mono system: IBM Plex Mono 400/700 for everything — display, body, labels, tables, chrome.
- Dollar-prompt session framing: every slide opens with a green `$` command line; titles read as command output.
- Glyph-cursor terminator: a static-visible ▌ glyph after the final line marks the live session.
- ASCII rules instead of borders: full-measure `===` and `---` rows in dim ink separate regions.
- Green command tokens: invoked commands set in bold green, max two green runs per slide.
- Line-number gutter: dimmed right-aligned numerals, fixed 72px column, 8px baseline rhythm.
- Red single-failure keyword: exactly one red token per slide — the cost, the error, the count.
- Ruled status line: ink footer line under a 2px rule with filename, section, and line/col readout.
- Flat paper depth: no blur, no gradients, no boxes; structure comes only from the header and status rules.

## Colors

### Palette

- **Paper** (`{colors.paper}` — `#F4F1EA`): The slide ground. Warm, slightly dimmed white that reads as printed stock rather than screen glare.
- **Ink** (`{colors.ink}` — `#111111`): Primary text, rules, the glyph cursor, and status text. Near-black with no blue bias.
- **Dim** (`{colors.dim}` — `#6B675E`): Secondary text at 55% — gutter numerals, comments, ASCII rules, table pipes, footnotes, status separators.
- **Faint Line** (`{colors.faint-line}` — `#E2DCCC`): Reserved token from the grid-wash era, unused in the typography-only system.
- **Green** (`{colors.green}` — `#007A33`): The prompt glyph, command tokens, and `[ok]` tokens. Deep terminal green, dark enough for text on paper.
- **Red** (`{colors.red}` — `#B00020`): The single failure keyword per slide. Dark enough to hold weight-700 emphasis on paper.
- **Amber Hi** (`{colors.amber-hi}` — `#FFE9A8`): Reserved token from the highlight era, unused in the typography-only system.
- **White** (`{colors.white}` — `#FFFFFF`): Reserved token, unused in the typography-only system. Never a slide background.

### Defaults

- **Default surface background**: `{colors.paper}` flat.
- **Default headline color**: `{colors.ink}` at weight 700 — display type is always full ink, never dimmed or colored.
- **Default body text color**: `{colors.ink}` at weight 400; secondary runs use `{colors.dim}`.
- **Default comment color**: `{colors.dim}` — subtitle and aside lines read as `#` comments.
- **Default prompt glyph color**: `{colors.green}` at weight 700.
- **Default rule color**: `{colors.dim}` for ASCII rules; `{colors.ink}` for the header and status rules.
- **Default accent for key phrases**: `{colors.green}` bold command tokens, max two per slide.
- **Default failure token**: `{colors.red}` at weight 700, exactly one per slide.
- **Default status line**: `{colors.ink}` text with `{colors.dim}` separators under a 2px rule.

When a slide needs to feel warmer, widen the green command token to a full clause; when it needs to feel sterner, drop the token and let the red keyword carry the emphasis alone.

## Typography

### Font Family

The system runs **one face**: **IBM Plex Mono** at weights 400 and 700. It carries the session title, section heads, body, prompt lines, comments, gutter numerals, status line, tables, and counters. There is no display serif, no humanist sans, no second mono — the single-voice discipline is the entire typographic identity.

Weight 700 is the display voice: titles, heads, the prompt glyph, commands, the red keyword, ok-tokens, and status-line text. Weight 400 is the reading voice: body, comments, gutter, table cells. No other weights are loaded. Italic is never used — emphasis is a green token or a weight change, never a slant.

Never introduce a second family for any role. A proportional sans for body or a serif for display would collapse the terminal fiction instantly.

### Typography Scale

| Token | Size | Family | Weight | Use |
|---|---|---|---|---|
| `{typography.session-title}` | 76px | IBM Plex Mono | 700 | Title-slide display title as command output |
| `{typography.section-head}` | 40px | IBM Plex Mono | 700 | Inner-slide section headline |
| `{typography.subhead}` | 26px | IBM Plex Mono | 700 | Region subheading, callout title, table caption |
| `{typography.body}` | 24px | IBM Plex Mono | 400 | Paragraph body and list items |
| `{typography.prompt-line}` | 26px | IBM Plex Mono | 400 | `$` command line (glyph itself is 700 green) |
| `{typography.comment-line}` | 24px | IBM Plex Mono | 400 | `#` comment lines: subtitles, asides |
| `{typography.gutter-number}` | 20px | IBM Plex Mono | 400 | Line-number gutter numerals |
| `{typography.status-line}` | 22px | IBM Plex Mono | 700 | Footer status line text |
| `{typography.label-dim}` | 20px | IBM Plex Mono | 400 | Uppercase tracked micro-labels |
| `{typography.table-cell}` | 22px | IBM Plex Mono | 400 | ASCII table cells |
| `{typography.counter}` | 20px | IBM Plex Mono | 400 | Slide counter `03 / 12` |

### Defaults

- **Default size for a title-slide title**: `{typography.session-title}` (76px) — always weight 700, full ink.
- **Default size for an inner-slide headline**: `{typography.section-head}` (40px) — weight 700.
- **Default size for paragraph body**: `{typography.body}` (24px) — weight 400, line-height 1.7.
- **Default size for the prompt line**: `{typography.prompt-line}` (26px) — green 700 `$`, ink 400 command.
- **Default size for subtitles**: `{typography.comment-line}` (24px) — dim ink with a `#` leader.
- **Default tracking**: 0 everywhere except micro-labels (0.08em) and the counter (0.1em). Mono glyphs are pre-spaced; added tracking breaks the grid.
- **Default body weight**: 400; **default display weight**: 700.

When unsure which token to reach for, default to `{typography.body}` — it is the session-output workhorse. Reserve `{typography.session-title}` for the title slide and major section dividers.

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every slide opens with a prompt line.** Green 700 `$`, ink 400 command, optional dim trailing comment. A slide without a prompt reads as a document, not a session.
- **Every slide carries its prompt command in bold green.** The token marks the command the presenter invoked; the title itself stays clean full-ink so it remains one contiguous output block.
- **Every final output line ends with the ▌ glyph cursor.** Static-visible ink glyph. No cursor means the session ended.
- **Every comment line opens with `#`.** The hash is part of the voice — subtitles and asides without it read as captions.
- **Every gutter numeral is right-aligned dim 20px.** Left-aligned or full-ink numerals break the margin instrument.
- **Every red keyword is weight 700 and unique per slide.** A second red token splits the eye; dim or weight-400 red reads as body.
- **Every status line sits under its 2px rule.** An unruled footer reads as another body line, not chrome.

### Typography Principles

The voice contrast is **bold output ↔ dim comment ↔ green prompt**, all in one face. Weight and tone do the work that families do in other systems. The title is the loudest thing on the slide because it is the biggest and boldest, not because it is a different face.

All text is left-aligned in the 66ch well. Centering is never used — terminals do not center. Line-height stays generous (1.6–1.7 for reading sizes) so the paper feels airy despite the mono grid.

## Layout

### Canvas System

The system targets a fixed **1920×1080 stage** per slide. Slides render one at a time at full stage size and scale uniformly to the viewport through the shared scaler — no reflow, no breakpoints on the stage itself.

Default slide padding is `72px 96px`. The inner text well caps at `max-width: 1560px`, left-aligned after the 72px gutter plus a 40px gap. Reading lines (body, comments, flags) hold a `66ch` measure inside the well, while the display title spans the full well width so long titles wrap to three lines instead of nine. On the 1920 stage this yields a calm left-weighted column — the session breathes without drowning in its own measure.

### Spacing Unit and Baseline

Every measurement snaps to an **8px unit** (the character cell). Gutter width 72px, gutter gap 40px, slide padding 72/96, section gaps 24/32/48 — all multiples of 8. The 8px discipline reinforces the terminal-cell fiction without any drawn grid.

### Persistent Chrome

Three elements appear on every slide:
- **Line-number gutter** — right-aligned dim numerals, fixed at the left inside the padding zone, numbering each text row from 01.
- **Status line** — ink footer line under a 2px rule fixed at `bottom: 0`, carrying `filename · section · ln,col` and the slide counter at right.
- **Session header** — the `$` prompt line with a 2px ink underline, fixed at the top of the content well.

There is no dot rail, no floating nav, no crosshair cursor. The cursor is `text` over the well — the slide should feel selectable, like a real buffer.

### Atmospheric Layer Stack

Every slide carries (in z-order):
1. Paper ground `{colors.paper}`, flat.
2. Gutter numerals and ASCII rules in dim ink.
3. Content well: prompt, title, comments, green tokens, cursor.
4. Status line pinned to the foot, above all paper layers.

This stack is deliberately shallow. A slide with glass, blur, or glow stops being Paper TTY.

## Depth and Elevation

### Flat Paper (Signature)

The system uses **no cast shadows**. Depth is expressed through **ink coverage**: full ink on paper for the foreground, dim ink for the middle ground. The restraint is the signature — a blurred drop shadow anywhere breaks the printed-page fiction.

### Rules as Structure

The session header's 2px ink underline (`{rules.header-underline}`) separates chrome from output the way a window title bar separates from its buffer. The status line's 2px rule (`{rules.status-rule}`) closes the session at the foot. They are rules, not shadows — the only drawn strokes in the system.

### No-Box Rule

Boxes are banned: no highlight spans, no status band, no callout boxes, no chips, no meter bars, no grid washes. Emphasis lives in green tokens, red keywords, and weight contrast; structure lives in typed ASCII rules and the two ink rules.

## Shapes and Treatment

### Border Radius

Not applicable. There are no boxes to round: no highlight spans, callouts, chips, or meter bars. Rounded cards, pill buttons, or circular badges break the terminal-cell aesthetic immediately.

### Border Weights

- **2px solid ink** — the session-header underline and the status rule. The only drawn strokes in the system.
- **Typed ASCII rules** — `===` double and `---` single rows in dim ink replace drawn `<hr>` dividers everywhere else.
- **Typed table pipes** — `|` characters in dim ink inside ASCII tables; the only vertical strokes, and they are glyphs.

Rules are always solid ink, never dashed, never colored, never box edges. Dashed or dotted CSS borders read as vector chrome; this system types its dividers as characters.

### Decorative Element Types

**Session header** — Green 700 `$` + ink 400 command + optional dim trailing comment, with a 2px ink underline. Opens every slide; the typed command names the slide's topic.

**ASCII rule (double)** — Full-measure `=` row in dim ink separating the header from the title output block.

**ASCII rule (single)** — Full-measure `-` row in dim ink separating body regions and sitting above the status line.

**Command token** — Bold green command marking the invoked phrase. Max two green runs per slide; never nested; never on dim text.

**Glyph cursor** — Static-visible ▌ ink glyph after the final line. The session-is-live mark.

**Gutter** — 72px fixed column of right-aligned dim 20px numerals, one per text row, starting at 01.

**Prompt glyph** — The `$` character, always green 700. Green appears only in the prompt, commands, and `[ok]` tokens.

**Status line** — Ruled foot line: `filename · section · ln,col` left, `NN / NN` counter right, ink 22px 700 with dim separators.

**Callout block** — Warning or key figure set as plain text lines with `#` leaders on inner slides. Never boxed.

**Warn token** — Bold red inline token for the single failure keyword. One per slide maximum.

**Ok-token** — Inline green 700 `[ok]` marking passing checks and healthy stats.

**Data table** — Pipe-and-dash ASCII table: ink header row, `---` separator, dim pipes, no zebra, tabular numerals.

**Progress meter** — Typed `[####----]` meter: `#` fills and `-` empties between brackets. Never a drawn bar.

## Do's and Don'ts

### Do

- Open every slide with the green `$` prompt line and its 2px ink underline. The session fiction starts there.
- Set all type in IBM Plex Mono 400/700 with zero letter-spacing (except tracked micro-labels). The single voice is the identity.
- Set the prompt command in bold green. The token is the presenter's annotation; titles stay clean output.
- Park the ▌ glyph cursor after the final output line on every slide. It marks the session as live.
- Number every text row in the dimmed right-aligned gutter starting at 01.
- Ration red to one weight-700 keyword per slide so the failure lands with full force.
- Separate header, body, and footer regions with typed ASCII rules in dim ink, not CSS borders.
- Pin the ruled ink status line to the foot with filename, section, and counter.
- Keep the text well at 66ch maximum with 24–48px gaps between regions.
- Use `[ok]` green tokens and pipe-and-dash tables for data on inner slides.

### Don't

- Don't introduce a second typeface for any role. A proportional body face or display serif collapses the terminal fiction.
- Don't center any text. Terminals are left-aligned; centered mono reads as a concrete poem, not a session.
- Don't blur any shadow or add gradients, glass, or glow. Paper TTY is flat printed stock — dark-terminal phosphor glow belongs to a different design.
- Don't use dark backgrounds. The paper ground is the differentiator; a navy or black TTY slide is a different system entirely.
- Don't add letter-spacing to reading sizes. Mono glyphs are pre-spaced; tracking breaks the mono rhythm.
- Don't place more than two green runs or more than one red token on a slide. Rationing is what makes them land.
- Don't draw CSS `<hr>` dividers or dashed vector borders. Dividers are typed `=` and `-` characters.
- Don't add boxes: no highlight spans, callout boxes, chips, meter bars, or grid washes.
- Don't italicize. Emphasis is a green token or a weight change, never a slant.
- Don't omit the gutter, the prompt, or the status line on any slide. The trio is the persistent chrome.

## Responsive Behavior

Paper TTY is a **fixed-stage system**: every slide renders at 1920×1080 and scales uniformly to the viewport with one transform. There is no responsive reflow — phones letterbox the stage rather than restacking it.

### Scaling Behavior

- Title holds 76px on the stage; the scaler shrinks the whole canvas on small viewports.
- Body holds 24px, gutter 20px, status line 22px — all stage-absolute.
- The 8px rhythm, ASCII rules, and gutter column are fixed geometry; they scale only via the uniform stage transform.
- The 66ch measure is a character count, so it stays proportional under uniform scaling by construction.

### Component Breakpoints

No component breakpoints exist. The stage never reflows: the gutter, well, and status line keep their stage coordinates at every viewport size.

### Presenter Behavior

- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- The glyph cursor is static-visible regardless of slide focus; it is ambient, not interactive.
- No auto-advance, no scroll hijack, no touch-specific chrome.

### Animation Triggers

No animation exists in this system — the cursor is static-visible so every capture renders identically. No typed-text effect, no staggered reveals; the session is frozen mid-run, not performed live. `prefers-reduced-motion` has nothing to disable.

### Print Behavior

The system is print-native by design: paper ground, ink text, flat fills. Printing yields the active slide cleanly at 16:9. The cursor prints in its visible state and the status line prints as ruled ink text.

## CJK & International Content

When using this template for Korean (or other CJK) content, pair the mono Latin stack with a Korean face that preserves the fixed-pitch rhythm and apply universal CJK adjustments. All recommended fonts load via CDN — no install required.

### Recommended Korean Pairing

| Role | Latin (default) | Korean counterpart |
|---|---|---|
| Display / title / heads | IBM Plex Mono 700 | D2Coding Bold (or Noto Sans KR 700 where D2Coding is unavailable) |
| Body / comments / tables | IBM Plex Mono 400 | D2Coding Regular (or Noto Sans KR 400) |
| Gutter / status / labels | IBM Plex Mono 400–700 | D2Coding (no transform, no tracking) |

### Mixed-Content Strategy

**Strategy A** — D2Coding-first with Plex Mono for ASCII. Set text elements to `font-family: 'D2Coding', 'IBM Plex Mono', monospace`. D2Coding is a Korean coding font with true fixed-pitch Hangul cells, so `$`, `#`, ASCII rules, and gutter numerals keep their grid alignment next to Korean syllables. Latin command words render in D2Coding's Latin set, which is harmonious with Plex Mono at small sizes; large display titles keep Plex Mono's Latin where mixed words appear. This preserves the terminal fiction better than any proportional Korean face.

### Loading

Add to the template's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-subset.css" rel="stylesheet">
```

If the D2Coding CDN is unreachable, fall back to Strategy B: `Noto Sans KR` 400/700 from Google Fonts. The grid alignment loosens (proportional Hangul), so widen the gutter to 88px and treat alignment behind Korean runs as approximate.

### Universal CJK Adjustments

- **Line-height**: increase by ~15–20% from the Latin spec. Body 1.85–1.95 (up from 1.7), display 1.3–1.4 (up from 1.18). Square syllable blocks crowd vertically more than Latin.
- **Letter-spacing**: set to 0 on every CJK run, including micro-labels and the counter — the 0.08–0.1em Latin tracking looks broken on pre-spaced syllables.
- **Text transform**: don't apply `uppercase` to Korean text — Hangul has no case. Micro-labels render without transform in CJK builds.
- **Punctuation**: use Korean punctuation conventions (。, 、「」 where quoted); keep ASCII `$`, `#`, `[`, `]` as typed chrome.
- **No period on display headlines**: Korean display convention omits trailing 。 on large titles.
- **Space between CJK and Latin**: insert an ASCII space between Hangul and adjacent Latin/digits. Write `11 개 포스트모템` with breathing room around numerals.
- **One grid per line**: keep `$`, `#`, and ASCII rules in the mono Latin face even in Korean lines so the gutter and rules stay aligned.

### Aesthetic Notes for This System

The system's identity rests on one voice — fixed-pitch mono — and a Korean build preserves it better than most CJK adaptations because D2Coding is genuinely fixed-pitch. Lean harder on the signature elements regardless: the green prompt and tokens, ASCII rules, gutter, and glyph cursor carry the terminal fiction even when the face changes.

The green command token translates perfectly — colored command text is universal. Keep tokens on Korean phrases at weight 700; Hangul blocks run wider than Latin words, so hold commands to short clauses.

### Known CJK Gap

- **No Google-Fonts-hosted Korean fixed-pitch face.** D2Coding loads from jsDelivr, not the Google Fonts CDN, so builds behind strict font allowlists fall back to proportional Noto Sans KR and lose grid alignment. The ASCII rules and gutter must then be treated as approximate rather than exact.
- **D2Coding display weight tops out below Plex Mono 700's presence.** Korean 76px titles feel lighter than their Latin counterparts; compensate with the green token and keep titles to two lines maximum.

## Iteration Guide

1. Any new slide opens with the green `$` prompt line and its 2px ink underline. Don't skip the session header.
2. Any new display element uses IBM Plex Mono 700; any new reading element uses IBM Plex Mono 400. Never cross into a second family.
3. Any new title gets full ink at 76px (title slide) or 40px (section head) as one contiguous output block; the green token lives on the prompt command.
4. Any new subtitle or aside uses the `#` comment treatment — dim ink, weight 400, hash leader.
5. Any new region boundary uses a typed ASCII rule (`===` for major, `---` for minor) in dim ink — never a CSS border.
6. Any new measurement snaps to the 8px character unit. Gutter 72px, gaps 24/32/48, padding 72/96.
7. Any new emphasis is a green token (max two per slide) or the single red 700 keyword — never italic, never a color wash, never a box.
8. Any new data uses pipe-and-dash ASCII tables with dim pipes and `[ok]` green tokens for healthy values.
9. Any new slide parks the ▌ glyph cursor after its final output line and pins the ruled status line to the foot.
10. No motion is ever added. The session is frozen, not performed.

## Known Gaps

- **Fonts**: IBM Plex Mono via Google Fonts CDN (`display=swap`); fallback `, ui-monospace, monospace`. No font files committed. Offline rendering falls back to system mono and loses the Plex voice. Korean builds add D2Coding via jsDelivr with fallback `, "Noto Sans KR", sans-serif`.
- **The cursor is deliberately static** (no blink keyframe) so headless captures render it deterministically. A blink was prototyped and removed after captures froze it mid-cycle.
- **ASCII rules are literal typed characters**, not drawn lines — changing the measure requires retyping the rule length. There is no auto-fill rule component.
- **Gutter numerals are hand-placed** per slide. There is no automatic line counting; adding a text row requires adding a numeral.
- **There is no drawn character grid** — the 8px unit is a spacing discipline only; glyphs suggest alignment without a wash behind them.
- **Status-line filename and line/col readouts are static text** per slide. There is no live buffer model behind them.
- **No syntax highlighting engine exists.** Green/red/dim coloring is hand-applied per token; pasting unmarked code renders all-ink until annotated.
- PPTX fidelity disclosure for this design:

| # | Effect | Preview implementation | Fidelity | Fallback on export |
|---|---|---|---|---|
| 1 | Blur (backdrop / filter) | Not used — system is fully flat | full | N/A (nothing to export) |
| 2 | Blend modes | Not used | full | N/A (nothing to export) |
| 3 | Animation / keyframes | Not used — cursor is static | full | N/A (nothing to export) |
| 4 | Pixel / hard offset shadows | Not used — system is fully flat | full | N/A (nothing to export) |
| 5 | Gradients | Not used — paper ground is a solid fill | full | N/A (nothing to export) |
| 6 | Grain / scanline / noise overlays | Not used | full | N/A (nothing to export) |
| 7 | Transparency layers | Dim ink at 55% for gutter/comments | full | Solid dim color equivalent |
| 8 | Custom fonts | IBM Plex Mono via Google Fonts CDN | partial | Embedded mono or Courier fallback |
| 9 | Absolute-positioned decor | Gutter numerals, status line, cursor glyph | full | Grouped native text boxes |
