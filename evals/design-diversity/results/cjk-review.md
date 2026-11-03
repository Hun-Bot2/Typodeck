# CJK / Robustness Review — D01–D27 Korean Variant (pixels-only, blind)

Method: for each design slot D01–D27, the corresponding `preview.html` was copied to
`/tmp`, the three PRIMARY strings were mechanically replaced (replace-all, no other
edits), the copy was screenshotted with the harness Chrome flags
(`--headless=new --disable-gpu --hide-scrollbars --window-size=1920,1080
--virtual-time-budget=8000`), the PNG was viewed, and the temp files were deleted.
DID-to-file correspondence was established by pixel-diff matching of fresh English
renders against `screenshots/D01..D27.png` (all 27 best-matches at ~0.00 mean-abs
diff with a wide margin to second-best). No template docs, direction matrix, or
`selection-index.json` were opened; verdicts below are DID-only.

Exact swap strings used (verbatim, replace-all):

- title: `The Hidden Cost of Rushing to Ship` → `서두른 출시의 숨은 비용`
- subtitle: `What 11 postmortems taught us about review discipline` → `11개 포스트모템이 가르쳐준 리뷰 원칙`
- context: `Typodeck Research · November 2026` → `Typodeck Research · 2026년 11월`

Title/subtitle/context each occurred once per file, except one design whose context
string occurred 4× (ticker repetition — all four replaced).

## Per-design verdicts (all 27 Korean renders viewed)

| id | verdict | Korean shaping / line-break / overflow / contrast / drop-cap-or-ornament |
|----|---------|-----------------------------------------------------------------------------|
| D01 | pass | Bold sans shapes cleanly; title+subtitle single-line, no overflow; footer context fits; contrast strong; "01" ornament intact |
| D02 | pass | Serif title one line, no clip; subtitle one line; source-line context fits; checklist/note panels unaffected; contrast good |
| D03 | REJECT | Visible title stays ENGLISH (only subtitle/context swapped) — see reject list |
| D04 | pass | Centered title one line; drop-cap "1" + "1개…" correctly reconstitutes "11개"; footer context fits; ornament rules intact |
| D05 | pass | Title strip and subtitle strip contain Korean with no overflow; tape context fits; background "SHIP" outline is decor only; contrast good |
| D06 | pass | Title one line; italic subtitle applies synthetic oblique to Hangul but stays legible; footnote context fits; no overflow |
| D07 | pass | Title/subtitle single-line left column; header context fits; grid cards/ornaments unaffected; contrast good |
| D08 | pass | Neon-green title one line, glow intact; subtitle fits; amber ticker repeats Korean context legibly; contrast good on black |
| D09 | pass | Serif title one line centered; eyebrow context fits; subtitle fits; cream-on-black contrast strong |
| D10 | pass | Title one line; slate subtitle legible; context line fits; dashboard panels/figure unaffected; no overflow |
| D11 | pass | Framed title one line; italic subtitle fits inside frame; context fits; gilt ornaments intact; contrast good |
| D12 | REJECT | Visible title stays ENGLISH (only subtitle/context swapped) — see reject list |
| D13 | pass | Myeongjo-style title one line; "01" watermark overlaps title start by design but text stays legible; seal ornament fine |
| D14 | pass | Bold title one line; subtitle fits; header context fits; Bauhaus shapes unaffected; contrast strong |
| D15 | pass | Serif title one line in arch; drop-cap "1" + "1개…" correctly reconstitutes "11개"; context fits |
| D16 | pass | Mono-style title one line; "# …" subtitle fits; footer context fits; terminal chrome intact; contrast good |
| D17 | pass | Masthead context fits; bold title one line; drop-cap "1" + "1개…" correctly reconstitutes "11개"; footer grid intact |
| D18 | pass | Layered-shadow title one line, effect renders on Hangul; subtitle fits; context pill contains Korean; contrast good |
| D19 | pass | Header context fits; title one line; subtitle fits above pills; "11" card/pills unaffected; contrast good |
| D20 | pass | Eyebrow context fits; serif title one line; italic subtitle legible; fleuron/rule ornaments intact |
| D21 | pass | Header context fits; title one line; centered subtitle fits; "11" badge ornament intact; contrast good |
| D22 | pass | Header context fits; title one line; italic abstract subtitle fits in box; figure/table ornaments unaffected |
| D23 | REJECT | Title mid-word break orphans final syllable "용" alone on line 2 — see reject list |
| D24 | REJECT | Title mid-word break orphans final syllable "용" alone on line 2 — see reject list |
| D25 | pass | Per-word JS highlight correctly colors 2nd Korean word; title one line; subtitle/context fit; card chrome intact |
| D26 | pass | Blueprint title one line; subtitle fits; title-block context fits; dimension/stamp ornaments intact |
| D27 | pass | Title wraps cleanly at word boundary ("…숨은" / "비용", no orphan); subtitle/context fit; "11" ornament intact |

Result: 23 pass, 4 reject.

## Reject list with fix directions

- D03 — Visible title hardcoded as English per-line/per-word spans; the verbatim
  PRIMARY string exists only in `aria-label`, so the mechanical swap changed nothing
  visible. Fix: render the visible title from a single content string (one text
  source; do line-splitting and the accent-word highlight in CSS/JS at render time
  from token positions, not hardcoded English words); add `word-break: keep-all`
  and drop Latin-only `text-transform: uppercase` dependence for CJK.
- D12 — Same failure class: visible title hardcoded English with per-word accent
  spans ("Cost"/"Ship"); only `aria-label` carried the verbatim string. Fix: same
  as D03 — single-source title with runtime word-token styling; verify the accent
  spans land on the intended Korean tokens; add `word-break: keep-all`.
- D23 — Oversized display title breaks mid-word, leaving the lone syllable "용" on
  line 2 (splits the word "비용"). Fix: `word-break: keep-all; overflow-wrap:
  normal` on the title so breaks fall only at spaces, plus `text-wrap: balance`
  (or a max-width allowing "…숨은 비용" to wrap as D27 does); re-check size so two
  balanced lines clear the subtitle.
- D24 — Same symptom: title breaks mid-word with lone "용" on line 2. Fix: same
  as D23 — `word-break: keep-all` + balanced two-line wrap; widen or retune the
  title column so the Korean two-liner keeps clear of the rule and subtitle.

Positive notes for authors: D04/D15/D17 drop-caps consume exactly the first
character and reconstitute "11개" correctly; D25's runtime word-highlight survives
the CJK swap; D27 is the reference Korean wrap (clean word-boundary break).
