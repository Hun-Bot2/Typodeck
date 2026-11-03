# Full-Deck Smoke Test (deck-smoke.md)

- Tester: independent smoke test (hand-authored slides, pixels verified).
- Designs (3 maximally different, all validated PASS + visual-review pass):
  - Swiss/grid: `gridline-swiss` (D01)
  - Editorial/serif: `chapter-verse` (D04)
  - Dark/display: `night-reel` (D23)
- Full `design.md` read for all three before authoring; slides follow ONLY that
  design.md plus shared harness stage conventions (fixed 1920×1080 stage,
  uniform scaler). No stock art; typography-first throughout.
- Slide types per design: 01 title / 02 section divider / 03 text-heavy /
  04 numerical evidence / 05 comparison / 06 closing.
- Artifacts: `evals/design-diversity/deck-smoke/` — 18 `.html` + 18 `.png`
  + `capture.mjs`.
- Capture: same render procedure as `harness/screenshot.mjs` (headless Chrome,
  `--window-size=1920,1080`, `--virtual-time-budget=8000`, IHDR verified
  1920×1080). A local `capture.mjs` was used instead of calling the harness
  directly because the harness writes only to the fixed `screenshots/<DID>.png`
  slots (27 total, holding official artifacts — must not be overwritten).
  Harness/templates/engine/gallery untouched. Result: `VERIFY: PASS (all 1920x1080)`.
- All 18 PNGs viewed as images. No forbidden text on any slide (no preview /
  template / preset / option / path labels); all chrome is in-fiction deck
  content (section labels, scene counts, folios, rail meta).

## 1. Gridline (gridline-swiss) — COHERENT

Same visual language across all 6: exposed 12-col grid, red kicker + square +
single 6px rule, flush-left Archivo, populated index rail with cropped giant
numeral, hairline footer with `NN / 06`. Any slide is unmistakably Gridline.

| Slide | Verdict | Note |
|-------|---------|------|
| 01 title | pass | Canonical cover: kicker, rule, 118px title, lede, rail 01 |
| 02 divider | pass | 72px display opener + short lede; rail 02 |
| 03 text-heavy | pass | 3 numbered findings (Archivo numeral + section-head + body), 1px row dividers |
| 04 numerical | pass | Stat-row device exactly as specified (76px numerals, caps labels, vertical dividers); red square flags the 73% cell |
| 05 comparison | pass | Iteration-guide #9 two-zone split (cols 1–5 + 6–8, 1px divider); red squares mark rushed-side failures, ink squares the disciplined side |
| 06 closing | pass | 72px display + lede; rail 06 |

Design.md gaps found:
- G-GRID-1 (missing): no numbered-list pattern. Findings lists (numeral style,
  head/body pairing, dividers) had to be composed from adjacent rules (section
  tokens + Swiss-table dividers). Worked, but there is no canonical form.
- G-GRID-2 (ambiguous): comparison encoding. Red squares are specified only as
  "flags" for bad cells; using red-vs-ink squares to distinguish two sides is
  an inference. A two-sided comparison rule (which side gets red, or neither)
  is missing.

## 2. Chapter & Verse (chapter-verse) — COHERENT

Same book language across all 6: running head, oxblood chapter kicker with
flanks, centered Newsreader title, ◆ divider, folio with fleuron + page mark.
Oxblood budget (≤4 marks/slide) held everywhere.

| Slide | Verdict | Note |
|-------|---------|------|
| 01 title | pass | Reference cover grammar reproduced |
| 02 divider | pass | 64px section title + drop-cap lede |
| 03 text-heavy | pass | Three 24px/1.7 paragraphs, drop cap on first only |
| 04 numerical | pass* | Stacked serif figures (68px Newsreader 600, ink) + smoke tracked-caps labels, tan hairlines between — reads on-brand but the figure treatment is invented (see G-CV-1) |
| 05 comparison | pass* | Sequential stanzas (no multi-column allowed): smoke caps stanza heads + hairline separator; drop cap on first stanza only (see G-CV-2) |
| 06 closing | pass | Envoi kicker + 64px title + drop-cap lede |

Design.md gaps found:
- G-CV-1 (missing): no numeral/stat treatment at all — no figure size, voice,
  label style, or separator rule for evidence slides. The 04 figures are pure
  invention inside the token palette.
- G-CV-2 (ambiguous): no body subhead device. Stanza heads ("THE RUSHED TEAM")
  borrow the Inter tracked-caps furniture voice for *content* structure, but
  design.md states Inter "never sets headlines or paragraphs" — so subheads sit
  in a gray zone between forbidden and necessary. A serif subhead (or explicit
  permission for caps subheads) is needed.
- G-CV-3 (missing): multi-paragraph rules. Drop-cap-on-first-only and
  whitespace-only paragraph separation are reasonable book conventions but
  unstated; a second ◆ divider is forbidden, leaving hairlines as the only
  in-text separator without guidance on when to use them.

## 3. Night Reel (night-reel) — COHERENT (with 3 minor flags)

Same cinematic language across all 6: letterbox bars with dim reel metadata,
spotlight vignette, bottom-anchored low third, exactly one red rule per slide,
Bebas caps + Inter light. The flags below are *budget* violations the system
itself forbids, not visual breaks — every slide still reads as Night Reel.

| Slide | Verdict | Note |
|-------|---------|------|
| 01 title | pass | Canonical credit frame |
| 02 divider | pass | 120px section title + dialogue line; 4 elements |
| 03 text-heavy | flag (minor) | 6 low-third elements (rule+kicker+title+3 cue lines) vs the 4-element cap; design.md says extra content paginates, but a fixed 6-slide deck cannot paginate — renders cleanly anyway |
| 04 numerical | flag (minor) | No stat device specified (Bebas figures + Inter labels invented); also a title-less low third (kicker + stats), a pattern the manual never addresses |
| 05 comparison | flag (minor) | 6 elements (rule+kicker+title+2 takes); sides distinguished by smoke Bebas sub-kickers + spacing only — no divider or second accent permitted |
| 06 closing | pass | 120px title + two-line dialogue; 4 elements |

Design.md gaps found:
- G-NR-1 (missing): no list/cue device. The Bebas `01/02/03` cue labels on 03
  are invented; the manual specifies kickers (0.5em) and bar metadata but
  nothing for in-frame list markers.
- G-NR-2 (missing): no stat/figure device. Figure size, figure/label pairing,
  and stacking rules for evidence slides are absent (04 uses 104px Bebas +
  32px Inter rows by analogy).
- G-NR-3 (missing): no comparison device. With no panels, no in-frame
  dividers, and a single-red budget, two-sided content has no sanctioned
  encoding; 05 relies on spacing + smoke labels.
- G-NR-4 (conflict): the paginate rule ("extra content paginates to the next
  shot") conflicts with a fixed-N-slide deck structure. Text-heavy and
  comparison slides cannot both satisfy the 4-element cap and the deck
  outline. The manual needs a dense-slide escape hatch (e.g., max stacked
  dialogue lines, permitted title shrink steps — the 104px used on 03/05 is
  within the fit routine's 56px floor, but the floor exists for overflow, not
  as a designed dense-slide size).
- G-NR-5 (ambiguous): is a title mandatory in every low third? 04 works as
  kicker + stats with no title line, but every documented low third contains a
  title. Unspecified.

## Cross-design observations

- All three manuals specify the *cover* precisely and thin out toward evidence
  and comparison slides. Gridline degrades most gracefully (stat row + Swiss
  table + two-zone split cover 04/05); Chapter & Verse and Night Reel leave
  figures, subheads, and comparisons to author invention.
- Single-accent budgets (Gridline red, CV oxblood-4, NR one-red) all survived
  6 slides without strain — the budgets are deck-scalable.
- No slide in any design needed imagery, panels (outside Gridline's specified
  rail), or animation to feel complete; the typography-first constraint held.

## Verdict

**18/18 screenshots exist, all 1920×1080, all viewed. 15 pass, 3 minor flags
(all Night Reel density-budget overflows that still render on-brand).**
Per-design coherence: COHERENT × 3. Gaps: 2 Gridline (1 missing, 1 ambiguous),
3 Chapter & Verse (2 missing, 1 ambiguous), 5 Night Reel (3 missing, 1 ambiguous,
1 conflict).
