# Typodeck Korean Typography Research Note (ko-typography)

Owner: Korean typography owner. Scope: Korean is NOT translated English — every
rule below changes layout decisions, not just glyphs.

Sources are cited inline as [S1]–[S8]. No font files are committed to this repo;
all Korean faces load from CDN at render time with system fallbacks.

## 1. Normative basis: W3C KLREQ

[S1] W3C Group Note Draft, "Requirements for Hangul Text Layout and Typography
(한국어 텍스트 레이아웃 및 타이포그래피를 위한 요구사항)",
https://www.w3.org/TR/klreq/ (fetched 2026-11-04, draft dated 2026-03-21).
KLREQ is based on the Korean national project for an international standard on
Korean text layout; the English text is authoritative. Key sections used:

- §7.1 Line breaking & hyphenation (글자 vs 어절 breaking, line head/end
  restrictions, word-break restrictions for number/symbol runs)
- §7.2 Text alignment & justification (even-space/양끝 alignment default,
  line-adjustment cases for mixed writing)
- §7.3 Text spacing (zero inter-character space for Hangul default; mixed-script
  spacing rules; parenthesis/middle-dot spacing; math-symbol spacing)
- §7.4 Baselines, line height (proportional vs fixed vs minimum line spacing)
- §6.1 Punctuation (horizontal writing uses half-width `,`/`.` U+002C/U+002E;
  vertical uses ideographic marks; bracket sets differ by direction)
- §3.1 Mixed Hangul/Latin writing (proportional Latin + full Hangul syllables)

[S2] CSS Text Module Level 3 (W3C), `word-break` definition, which normatively
names the two Korean line-breaking styles: between any two syllables
(`word-break: normal`) or mainly at spaces like English (`word-break: keep-all`).
https://www.w3.org/TR/css-text-3/ (rules follow KLREQ guidelines).

## 2. Line breaking: keep-all vs char (어절 vs 글자)

KLREQ §7.1.1: when a line ends in Hangul, breaking is done on a character
(글자) or word-phrase (어절) basis, chosen per paragraph or per document.
CSS mapping [S2]: `word-break: keep-all` = 어절 breaking (breaks mainly at
spaces/U+0020); `word-break: normal` (+ `overflow-wrap`) = 글자 breaking.

Typodeck Korean rule:

- Body, captions, evidence text: `word-break: keep-all; overflow-wrap: break-word`.
  Rationale: 어절 breaking preserves phrase integrity and reads calmer at slide
  sizes; it matches modern Korean editorial/web practice (Naver, Toss, Pretendard
  demo sites all use keep-all).
- Display titles: `word-break: keep-all` + manual `<br>` phrasing + `text-wrap:
  balance`. Never let a display line strand a particle (은/는/이/가/을/를/에/의)
  or break a mixed-script technical token (see §4).
- Dense/data slides and narrow rails: `overflow-wrap: anywhere` on
  code/URL/identifier runs ONLY (a scoped class), never `break-all` on prose —
  `break-all` breaks mid-어절 and damages readability [S2 copyprogramming
  survey mirrors this consensus].
- Line head/end restrictions [S1 §7.1.2–7.1.3]: never start a line with a closing
  bracket, middle dot, or `.`/`,`; never end a line with an opening bracket.
  In HTML this is approximated with `line-break: strict`-like behavior and by
  keeping bracketed spans unbroken (`white-space: nowrap` on short parenthetical
  tokens, `word-break: keep-all` doing most of the work).
- Number/symbol runs stay unbroken [S1 §7.1.4]: Arabic numeral sequences,
  prefix/suffix symbol + numeral pairs (±, %, ₩, °), base+super/subscript, and
  footnote markers never split across lines. Implementation: wrap in nowrap
  spans at generation time (e.g. `40%`, `₩12,000`, `PM-01`, `v2.3.1`).

## 3. Mixed-script (Hangul/Latin) spacing

KLREQ §3.1.3/§7.3.2: mixed writing (섞어짜기) sets proportional Latin and
full-width Hangul syllables side by side. Latin words followed by Korean
particles take NO space between them (e.g. `Shipgate는`, not `Shipgate 는`)
[S1 §5.x note]. Practical rules:

- Insert a thin visual gap between Hangul and adjacent Latin/figures ONLY via
  the font's own side bearings — never author a literal space inside a token
  (`main 브랜치` has a real word space; `Shipgate는` has none).
- Hanging technical strings (identifiers, versions, codes: `main`, `PM-01`,
  `idea.txt:4`) keep Latin face and metrics; do not letterspace them to match
  Hangul rhythm.
- Lists of Latin-led tokens in Korean sentences (refs, statuses) are separated
  by normal word spaces and may wrap only at those spaces.
- Never apply `letter-spacing` to make Latin "match" Hangul width; it breaks
  token scanning.

## 4. Mixed Hangul/Latin technical strings (fixture policy)

All Korean specimens include at least one of each: a Latin product token with a
Korean particle (`Shipgate는`), a branch/path token (`main 브랜치`), an
identifier range (`PM-01 … PM-11`), a version (`v2.3.1`), and a
`file:line` ref (`idea.txt:4`). Generation rules:

- One typeface run per script where the design is mono-dominant: Latin token in
  the design's Latin mono/sans, particle in the Korean face — sized/aligned to a
  shared baseline (see §6).
- Code spans keep `white-space: nowrap` and the Latin mono; surrounding prose
  keeps `keep-all`.

## 5. Punctuation

Per [S1 §6.1], horizontal Korean uses half-width comma/period (U+002C/U+002E),
CJK brackets U+3008–U+300F as default, and Latin-style quotes
U+2018/2019/201C/201D in horizontal writing:

- Slides are horizontal writing: use `,` `.` `·` `—` `…` with the Latin face's
  punctuation; never substitute U+3001/U+3002 (vertical-writing marks).
- Quotes: `“…”` / `‘…’` (U+201C/201D), matching the Latin face.
- Brackets: half-width `()` `[]` in technical/data contexts; full-width `（）`
  only when the design is display-serif and the bracket wraps Korean prose.
- Em dash/ellipsis runs never split [S1 §7.1.4]: `——`, `……` stay on one line.
- Guards: no line starts with `)`, `]`, `,`, `.`, `·`, `…`; no line ends with
  `(` (see §2 implementation).

## 6. Line height and baseline

Korean syllable blocks are visually dense: a full em square is inked, unlike
Latin's x-height/air ratio. Consequences:

- Body line-height floor for Korean: **1.6** (KLREQ §7.4 proportional spacing;
  body faces Pretendard/SUIT/Noto Sans KR all ship generous Hangul leading).
  Latin body at 1.45–1.55 in the same design must be raised to ≥1.6 for `ko`.
- Display line-height: raise tight Latin display values by +0.06–0.10
  (e.g. 1.02 → 1.10) so stacked Hangul blocks do not touch; keep the design's
  compact intent, never exceed 1.25 on display.
- Baseline alignment in mixed runs: Latin faces sit on the alphabetic baseline
  while Hangul blocks are vertically centered in the em; at 800-weight display
  sizes prefer `vertical-align: baseline` default and verify visually — do NOT
  nudge with manual offsets unless a specimen shows a visible step.
- Rail/meta micro-type (≤22px): line-height ≥1.5; tracked caps treatments are
  Latin-only (see §9) so Korean meta uses weight contrast instead.

## 7. Weight perception

Hangul strokes at small sizes clog faster than Latin: a 400 Hangul glyph reads
lighter AND denser than 400 Latin. Rules:

- Body Korean minimum: 400 is acceptable only at ≥24px with 1.6 leading; below
  24px prefer 500.
- Display Korean maps one step heavier than the Latin brief where the design
  allows (Archivo 800 → Pretendard 800 holds; Fraunces 500 → Noto Serif KR 600;
  thin/light Latin display faces must NOT map to Korean Thin/Light — floor is
  500 for display, 400 for large body).
- Never use faux bold (`font-synthesis` off for Korean stacks) — synthetic
  emboldening clogs Hangul counters. Load real weights.

## 8. Display title wrapping

- `text-wrap: balance; word-break: keep-all;` on all Korean display titles.
- Author explicit line breaks at phrase boundaries (before particles is
  forbidden: break AFTER `은/는/을/를/에/의/와/과`, never before).
- Two-line Korean titles should be within ±15% line length of each other;
  single-어절 orphans (esp. lone particles) on line 2 are a specimen failure.
- Tight negative tracking on Latin display (`-0.01em`) is dropped to 0 for
  Korean runs (see §9).

## 9. Justification, alignment, tracking, transforms

- KLREQ §7.2 default is even-space (양끝) justification for print, but slides
  are short-line display: Typodeck Korean keeps each design's EN alignment
  (flush-left, centered, etc.) and does NOT force `text-align: justify`
  (justified short lines open rivers between 어절).
- `letter-spacing: 0` on ALL Korean runs. Latin tracked treatments (kick
...[truncated 5813 chars]