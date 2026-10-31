# Typodeck — Typography Research Report (Phase C, 2026-10-30)

Source-grounded study for the Typodeck Typography Skill. Every claim below
carries its provenance and access level. Nothing here reproduces copyrighted
chapters; findings are concise original summaries plus short attributed
phrases. Full texts that are not legally accessible are recorded as
bibliographic-only and contribute no derived rules.

Access levels: FULL = read in full at the cited URL. EXCERPT = legal sample
chapter or partial page read. SECONDARY = known via attributed quotation in
an accessed source, or via publisher/bookseller description. BIBLIO = identity
verified, contents not accessed.

## 1. Sources

| ID | Author / Work | Publisher / Context | Access | URL / Identifier |
|----|---------------|---------------------|--------|------------------|
| S1 | Matthew Butterick, Practical Typography (2nd ed., web book) | Self-published web book; author is a type designer (MB Fonts) | FULL (chapters listed in §2) | https://practicaltypography.com/ |
| S2 | Richard Rutter, The Elements of Typographic Style Applied to the Web | CC BY-NC 4.0 site by Rutter (clagnut.com) | FULL (guidelines listed in §2) | https://webtypography.net/ |
| S3 | Richard Rutter, Web Typography (book, 2017) | Self-published (Clagnut), ISBN 9780995664203, 334pp | EXCERPT (legal sample chapter "Numerals and tables" PDF, ch.3 §"Numerals and Tables") + FULL (book page with TOC) | https://book.webtypography.net/ |
| S4 | Robert Bringhurst, The Elements of Typographic Style (4th ed. 2012, v4.1 2015) | Hartley & Marks, ISBN 9780881792126 | SECONDARY (attributed quotations inside S2) + BIBLIO (edition history verified via Open Library / booksellers) | ISBN 9780881792126 |
| S5 | Josef Müller-Brockmann, Grid Systems in Graphic Design (1981, bilingual DE/EN) | Niggli, ISBN 978-3-7212-0145-1 | SECONDARY (Rutter bibliography endorsement; bookseller descriptions of 8–32 field grids) + BIBLIO | ISBN 978-3-7212-0145-1 |
| S6 | Emil Ruder, Typography: A Manual of Design (1967, trilingual) | Niggli, ISBN 978-3-7212-0043-0, 274pp, 550 illus. | BIBLIO (publisher page read 2026-10-30; no legal excerpt found) | https://niggli.ch/en/products/typographie |
| S7 | Ellen Lupton, Thinking with Type (2nd ed. 2010; 3rd ed. 2024) | Princeton Architectural Press (2nd, ISBN 9781568989693); Chronicle Books (3rd) | BIBLIO (edition/publisher verified via booksellers; thinkingwithtype.com unreachable, timed out) | ISBN 9781568989693 |
| S8 | IBM Design Language, type scale | IBM | INACCESSIBLE (page fetches as 38 chars of JS shell; recorded, not used) | https://www.ibm.com/design/language/typography/type-scale/ |
| S9 | IBM Carbon Design System, Typography overview | IBM, ©2026, documents the IBM type scale + formula | FULL | https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview |
| S10 | W3C, Requirements for Hangul Text Layout and Typography (klreq, Group Note Draft 2026-03-21) | W3C i18n WG, ed. Richard Ishida; based on Korean experts' standard proposal | FULL (§7 line/paragraph layout read in full) | https://www.w3.org/TR/klreq/ |
| S11 | Material Design 3 type scale (via Android Developers docs) | Google | FULL (type-scale table) — m3.material.io and m2.material.io are JS shells via fetch | https://developer.android.com/develop/ui/compose/designsystems/material3 |
| S12 | Pretendard (font + docs) by Kil Hyung-jin | orioncactus/pretendard, SIL OFL 1.1; Latin from Inter, Hangul from Source Han Sans KR, kana from M PLUS 1p; 9 weights + variable | FULL (README, LICENSE, designer blog post) | https://github.com/orioncactus/pretendard, https://cactus.tistory.com/306 |
| S13 | W3C WCAG 2.2, Understanding SC 1.4.3 Contrast (Minimum) | W3C/WAI (normative understanding doc) | SECONDARY (multiple consistent citations; success criterion text: 4.5:1 normal, 3:1 large ≥18pt/14pt-bold) | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html |
| S14 | Philip B. Meggs, History of Graphic Design, ch.18 (International Typographic Style) | Wiley textbook; Basel (Hofmann, Ruder) + Zurich (Müller-Brockmann) schools | SECONDARY (characterization consistent across 6+ independent mirrors/descriptions; textbook not directly accessed) | searched 2026-10-30; no authoritative full text online |

## 2. Findings by research dimension

Classification: U = universal principle. C = context-specific (transfer to
slides needs adaptation). P = designer preference (adopt deliberately or not).
H = project-derived heuristic (ours to validate).

### D1. Hierarchy and visual attention

- F1.1 (S1 maxims, FULL): decide body text first (size/length/leading/font);
  divide page into foreground/background; background must never upstage
  foreground; available distinctions are position, size, font, sometimes
  color. [U; directly adopted: kicker/title/body/caption roles map to
  foreground levels, captions stay background]
- F1.2 (S1 headings, FULL): max 2–3 heading levels; emphasize with space
  above/below first (subtle + effective), bold over italic, size up only by
  the smallest visible increment. [C; slides invert the size advice — see F3.3]
- F1.3 (S9, FULL): weight/size pairings must balance — a much larger light
  weight can outrank a smaller bold; semibold for section headers, never for
  long text. [U; adopted for kicker/title/body weights]
- F1.4 (S9, FULL): productive (dense, task) vs expressive (dramatic,
  editorial) type sets for different contexts. [C; supports distinct
  Swiss/productive vs Expressive grammars]
- F1.5 (S1 bold-or-italic, FULL): bold OR italic, never both, as little as
  possible; with sans faces use bold for emphasis (sans italics barely
  differ); black/ultra weights belong at headline sizes, never body. [U;
  adopted: titles bold, bodies roman, no italics anywhere in the engine]
- F1.6 (S1 rules-and-borders, FULL): prefer space over rules ("see the
  data, not the lines"; Tufte's chartjunk); never fake rules from
  repeated characters (─, _, parentheses). [U; adopted: zero rules,
  and an explicit ban on character-faked rules in generated text]

### D2. Typeface anatomy and font pairing

- F2.1 (S1 mixing-fonts, FULL): mixing is optional, never required; ≤2 fonts
  for most documents ("consider all your slides part of one document");
  each font needs a consistent role; one font per paragraph; pair fonts by
  the same designer as a reliable method. [U/C; adopted: heading/body role
  split, ≤2 families per system]
- F2.2 (S1 free-fonts, FULL): OFL families worth using include IBM Plex
  (sans+serif+mono), Source Serif, Charter. [P+C; supports OFL stack choices]
- F2.3 (S3 excerpt): Helvetica-class grotesques ship lining-only numerals,
  a weakness in body text. [C; adopted: numerals policy in D9]
- F2.4 (S12, FULL): Pretendard fuses Inter (Latin) + Source Han Sans KR
  (Hangul) + M PLUS 1p, OFL 1.1, 9 weights + variable — explicitly built so
  mixed Korean-Latin setting needs no extra correction. [C; adopted as the
  Korean-Latin workhorse; OFL also resolves embedding]

### D3. Type scales, weight, tracking, kerning, leading

- F3.1 (S2 §3.1.1 + S4 quote, FULL site): compose from a modest scale of
  distinct, related intervals (Bringhurst: the inherited series or your own).
  [U; adopted: per-system role scales]
- F3.2 (S9, FULL): IBM scale from y0=12px by Xn = Xn−1 + {INT[(n−2)/4]+1}×2
  (12…92px); larger steps grow faster. [C; reference for scale rhythm, not
  copied numerically into slides]
- F3.3 (S11, FULL): M3 scale 11–57px with leading ratios tightening as size
  grows (display 57/64 ≈ 1.12 … body 16/24 = 1.5). [C; adopted as the
  leading rule: heroes ≈1.0–1.15, titles ≈1.1–1.3, body ≈1.4–1.6]
- F3.4 (S1 line-spacing, FULL): body leading 120–145% of size. [C; body-text
  context; slides use the top of the range for small bodies]
- F3.5 (S1 letterspacing, FULL): +5–12% tracking on all-caps/small-caps,
  never on lowercase (except <9pt); tight headline lowercase may track
  slightly negative. [U; adopted for kickers]
- F3.6 (S2 §2.1.6 + S4 quote, FULL): letterspace caps/small-caps at 5–10%
  and long digit strings (serials, phone numbers, dates). [U; adopted]
- F3.7 (S1 metrics-vs-optical, FULL): trust the font's own spacing metrics;
  algorithmic re-spacing mangles even color. [U; adopted: tracking stays
  small and role-based, never cosmetic re-spacing]
- F3.8 (S1, FULL, anti-modular-scale stance): mathematical ratios don't
  guarantee good layout; eyes judge. [P; noted — our rules stay testable
  ranges, not golden-ratio mysticism]
- F3.9 (S1 point-size, FULL): same nominal size renders differently per
  font; judge by eye; emphasis needs only small increments. [U; adopted:
  per-system size calibration + visual QA]

### D4. Grids, alignment, rhythm, proportional systems

- F4.1 (S1 grids, FULL): grids guide position/size/alignment of visible AND
  invisible elements (margins, paragraph space); coarser grids → more
  consistency; grids need not be rigid/symmetric; eyes beat calculators;
  baseline grids pay off only in wide multi-column settings. [U; adopted:
  coarse per-system grids, no baseline grid for single-column slides]
- F4.2 (S2 §2.2.2 topic, FULL): add/delete vertical space in measured
  intervals (rhythm unit). [U; adopted: rhythm step per system]
- F4.3 (S5, SECONDARY): Müller-Brockmann's 8–32 field construction grids
  for print pages. [C; NOT transferred numerically — slides need coarser
  grids (F4.1); cited as the Swiss-grid lineage only]
- F4.4 (S1 maxims, FULL): relate each new element to existing ones; keep
  it simple. [U; adopted: alignment anchors per system]

### D5. Negative space and visual balance

- F5.1 (S1 maxims, FULL): don't fear white space; design outward from the
  text, not inward from page edges; if the text looks good the space takes
  care of itself. [U; adopted: content-first placement, generous margins]
- F5.2 (S1 presentations, FULL): confine slide layout to less than full
  screen width; be consistent across slides. [U; adopted: max text-block
  widths per system]

### D6. Editorial composition and asymmetric layouts

- F6.1 (S1 centered-text, FULL): asymmetry is nothing to fear; centered
  blocks are hard to read (both edges ragged) and hard to align; center
  only short phrases/titles. [U; adopted: Editorial left-ragged; Expressive
  centering restricted to hero-length lines — validated by comparison]
- F6.2 (S1 headings, FULL): don't center headings (with narrow exceptions).
  [C; document context — slides treat hero titles as the exception]

### D7. Swiss / International Typographic Style

- F7.1 (S5/S6, BIBLIO/SECONDARY): grid-based, asymmetric, sans-serif,
  objective composition (Müller-Brockmann 1981; Ruder 1967, "clear
  principles of structure, grid, and readability" per publisher). [C;
  adopted as the Swiss system's grammar: strict columns, left alignment,
  tight leading, high density — distinguished from document grids per F4.3]
- F7.2 (S14, SECONDARY): the style's canonical markers — asymmetric
  organization on a mathematical grid, flush-left ragged-right sans
  setting, objective factual copy; refined at Basel (Hofmann, Ruder) and
  Zurich (Müller-Brockmann) from Bauhaus / Tschichold roots. [C; adopted
  as the Swiss grammar checklist: grid + asymmetry + ragged-right sans]
- F7.3 No legal full text of S5/S6/S7/S14 was accessible; no rule claims
  their authority beyond the cited descriptions and S2's endorsement
  ("the definitive word on grid systems"). [provenance note, not a rule]

### D8. Expressive and experimental typography

- F8.1 (S9 expressive set, FULL): large dramatic graphic type for editorial
  contexts; distracting in task/product contexts. [C; adopted: Expressive
  system = display voice, alternating ink/paper stages]
- F8.2 (S1, FULL): Type itself is the medium — scale contrast and weight
  carry expression without added ornament. [U; consistent with the
  typography-only constraint]

### D9. Numbers, numerals, quantitative emphasis

- F9.1 (S3 excerpt, FULL): old-style numerals in running text; lining
  numerals with caps/headings; when numbers are the star (scanning,
  comparison), lining numerals' evenness wins. [U; adopted: hero numerals
  set large in lining-capable faces]
- F9.2 (S3 excerpt, FULL): tables are catalogues to read, not pictures;
  align to the decimal point; avoid row/column borders unless alignment
  and spacing already fail. [C; adopted in spirit: no rules/borders,
  alignment carries structure]
- F9.3 (S2 §3.2.1 topic, FULL): titling figures with full caps, text
  figures elsewhere. [U; consistent with F9.1]
- F9.4 (S3 excerpt, FULL): professional faces ship both numeral sets as
  OpenType features; system/bundled cuts often ship one. [C; noted as a
  font-selection criterion, not a render-time rule — PPTX can't switch
  figure styles per run in our exporter]

### D10. Optical alignment and perceived balance

- F10.1 (S1, FULL): judge spacing by eye (F3.7/F3.9); overshoot/outline
  compensation lives in the font's metrics — don't second-guess it
  algorithmically. [U; adopted: no synthetic optical fiddling in geometry]
- F10.2 (S1 presentations, FULL): simultaneous contrast — pale gray reads
  as white when projected. [U; adopted: paper tones, never pure-white
  fields under projection assumptions]

### D11. Contrast and readability in projected presentations

- F11.1 (S1 presentations, FULL): dark room → black background, thin sans,
  gray (not pure white) type brightened to legibility; light room → never
  pure black on pure white (light-gray field or dark-gray type). [U;
  adopted per system: paper/ink pairs avoid #000-on-#FFF]
- F11.2 (S1 presentations, FULL): turn off auto-resize-to-fit; pick one
  base size fitting 12–15 lines and hold it across slides. [C; adapted —
  our engine must fit arbitrary text, so: fit by wrapping first, shrink
  second, and keep role sizes stable deck-wide (no per-slide hero drift)]
- F11.3 (S13, SECONDARY): WCAG AA demands 4.5:1 for normal text, 3:1 for
  large (≥18pt / ≥14pt bold). [U; already enforced by contrast tests]

### D12. Korean and Latin typography, mixed-language composition

- F12.1 (S10 §7.1.1, FULL): Hangul breaks on character OR word (eojeol)
  basis at the author's choice; Latin on word basis or with hyphens. [U;
  adopted: our CJK-char / Latin-word wrap matches the standard's options]
- F12.2 (S10 §7.3.1, FULL): Hangul/Hanja/Kana default inter-character
  space is zero; widening/narrowing are explicit settings. [U; adopted:
  no synthetic Hangul tracking]
- F12.3 (S10 §7.3.2, FULL): mixed writing (Latin, numerals, symbols inside
  Hangul sentences) is the named norm (soejeotgi), not an edge case. [U;
  adopted: mixed-script test coverage]
- F12.4 (S12 designer blog, FULL, translated): Noto Sans KR's Hangul runs
  large next to Latin, forcing per-project size compensation; Pretendard
  corrects the balance so mixed setting needs no extra work. [C; adopted:
  Pretendard-first for mixed bodies, Noto as fallback]
- F12.5 (S12, FULL): OFL 1.1 explicitly permits embedding and bundling.
  [U; resolves the Phase 1 embedding-license gap for Pretendard]

### D13. Line breaking, punctuation, text density

- F13.1 (S1 line-length, FULL): 45–90 characters/line incl. spaces
  (2–3 alphabets). [C; print-document context — slides use far shorter
  lines; adopted as: bodies ≤ ~60 chars/line, titles ≤ ~2 lines]
- F13.2 (S2 §2.1.2 + S4 quote, FULL): 45–75 chars ideal for single-column
  serif text, 66 ideal; 40–50 for multi-column. [C; same adaptation as F13.1]
- F13.3 (S2 §2.1.3 + S4 quote, FULL): narrow measures → ragged, never
  justified without hyphenation; many sans faces best ragged at any
  measure. [U; adopted: no justification anywhere in the engine]
- F13.4 (S1 key rules, FULL): curly quotes, one sentence space, proper
  ellipses/dashes/apostrophes. [U; adopted as text-hygiene rules where the
  renderer controls punctuation — narrative quotes stay verbatim]

### D14. Composition diversity without decorative shapes

- F14.1 (S1 mixing-fonts, FULL): all slides are one document — ≤2 fonts
  deck-wide. [U; adopted: system font pairs fixed per deck]
- F14.2 (S4 via S2, SECONDARY): modest set of distinct related intervals.
  [U; adopted: fixed role scales per system]
- F14.3 (S9 productive/expressive, FULL): context-calibrated type sets
  beat one-size styling. [C; adopted: three grammars, see D4/D6/D7/D8]

### D15. Accessibility and visual clarity

- F15.1 (S13, SECONDARY): 4.5:1 / 3:1 thresholds (F11.3). [U; enforced]
- F15.2 (S9 type color, FULL): keep running text neutral; color is not
  decoration. [U; adopted: theme-token colors, accent reserved for kickers]
- F15.3 (S1, FULL): small caps need real smcp (never faux), letterspaced.
  [C; noted — PowerPoint synthesis varies by font; kickers use spaced
  full-caps instead, verified in F3.5/F3.6]

## 3. What was NOT used, and why

- S5/S6/S7 full contents: not legally accessible; contribute lineage and
  bibliographic identity only. Any "Swiss says X" rule below the Skill
  would need excerpt-level verification first.
- S8 IBM page: technically inaccessible (JS shell); S9 documents the same
  scale and is the cited source instead.
- thinkingwithtype.com: unreachable (timeout); S7 stays bibliographic.
- Print measurements (points-for-print, 66-char ideals, 8–32 field grids)
  are never copied numerically into slide geometry; §2 marks each transfer
  (slides: shorter lines, coarser grids, tighter display leading).
- Butterick's anti-modular-scale and baseline-grid skepticism (P) are
  recorded as preferences, not rules; our scales are fixed role tables
  with testable ranges instead.

## 4. Unresolved research questions

1. Real small-caps availability across our stack (Inter smcp? Noto Sans
   KR? Pretendard?) for PowerPoint rendering — needs a font-capability
   probe, not more reading.
2. Optimal Hangul display leading at hero sizes (klreq covers text, not
   display) — needs rendered comparison, not citation.
3. Whether Expressive centered bodies cost measurable readability vs
   centered heroes + left bodies — needs the before/after comparison.
4. Ruder/Müller-Brockmann/Lupton excerpt-level verification if the Skill
   ever needs to cite them for a specific rule.
