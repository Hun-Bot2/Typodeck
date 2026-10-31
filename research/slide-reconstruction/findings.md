# Pilot fidelity findings (Tier B ×5, Tier A ×2)

Method: source captures at 150dpi (licensed only); recon screenshots via headless
Chrome at 1280×720 from `recon.html` (production `SlideView` + `globals.css`
slide-renderer block). Side-by-side panels equalized by height. Pixel-difference
image only for wk-p1 (both sides natively 16:9); 4:3→16:9 cases are compared
structurally, never stretched. FOSDEM cases are link-only paraphrases: no stored
source pixels; geometry from analyst observation (EST). PPTX parity verified
structurally (every `<a:t>` run concatenated vs `deck.json`; 7/7 MATCH, see §5).
No PowerPoint/Keynote automation exists on this machine, so PPTX *rendering* is
unverified — text content, box count/geometry, and validator acceptance are
verified instead. That limitation is explicit, not hidden.

Sampled colors (PIL region-dominant, not eyedropper guesses): mustard `#FDC933`
(`#FFCA34` variant), slate `#53819F`, body slate `#364A50`, navy `#0B1159`, teal
`#4FAB96`, runhead `#BDD0DD`, glyph black `#000000`, footer gray `#7F7F7F`.
Font sizes derived from measured cap-height fractions assuming cap ≈ 0.7em (EST).

## 1. gapminder-tq2-p1 (CC-BY 4.0) — Tier B PASS

SBS: `comparisons/sbs-gapminder-tq2-p1.png`. 7 blocks, 145 chars, validation OK.

1. Composition: left-column stack (kicker → numeral → title → URL → footer) preserved. ✓
2. Hierarchy: numeral dominates, title secondary, kicker/URL tertiary. ✓
3. Placement: left x and vertical fractions carried from 4:3; right side extends into whitespace (accepted migration). ✓
4. Scale: numeral 231pt vs title 57pt ≈ 4:1, matching source ratio (EST). ✓
5. Line breaks: all single-line blocks; no breaks to mismatch. ✓
6. Whitespace: extra right-field whitespace is the honest 16:9 consequence. Accepted.
7. Alignment/grid: single left edge at x=0.6in; footer triad left/center/right. ✓
8. Color/contrast: sampled palette; mustard-on-white kicker is low-contrast in the SOURCE too — preserved, not "fixed". ✓
9. Clipping: none (numeral box widened after first-pass clip risk). ✓
10. HTML→PPTX: 7 boxes, 145/145 chars MATCH. Rendering unverified (see above).

Known gaps: vector checkmark badge + GAPMINDER wordmark omitted (no shapes in
engine — correct omission, recorded in analysis); source condensed grotesque vs
Inter (width substitution, recorded).

## 2. wk-p1 (CC BY-SA 4.0) — Tier B PASS

SBS: `comparisons/sbs-wk-p1.png`; diff: `comparisons/diff-wk-p1.png`. 8 blocks,
204 chars, validation OK. Expressive system: Archivo Black title is a strong
match for the source's heavy grotesque.

1.–4. Centered-stack composition, hierarchy, placement, scale all match within
visual tolerance; title 66pt single-line, subtitle 30pt tracked caps. ✓
5. Line breaks: subtitle/attribution split into per-line blocks so HTML
(pre-wrap) and PPTX (one box per line) agree exactly. Forced breaks preserved. ✓
6.–7. Symmetric stack on navy; corner captions both present. ✓
8. Navy `#0B1159` sampled; white text. ✓
9. No clipping. ✓
10. 8 boxes, 204/204 chars MATCH. Rendering unverified.

Known gaps: vector lightning pattern → solid navy (recorded substitution);
corner logo badges → plain-text captions (recorded). Diff image is dominated by
the missing background pattern, not by text misplacement — text rows align.

## 3. fosdem-p4 (UNVERIFIED, link-only) — Tier B PASS (paraphrase)

Recon: `comparisons/recon-only-fosdem-p4.png`. 3 blocks, 49 chars, OK.
Clean centered title card on sampled teal. Talk title set in SANS 400: the
source's serif-italic is unrepresentable (no italic flag, no serif face in
swiss) — recorded as implementation gap, not silently approximated. No SBS by
policy (no stored source pixels).

## 4. fosdem-p14 (UNVERIFIED, link-only) — Tier B PARTIAL (paraphrase)

Recon: `comparisons/recon-only-fosdem-p14.png`. 1 block, 1 char, OK.
Monumental centered © on white reproduces the compositional idea, but two
engine limits bite: (a) `fontSize` cap 400pt forced a 424→400 clamp (~6%
smaller than measured); (b) system `©` glyph stroke is far lighter than the
source's custom ultra-bold vector mark. Both recorded in `implementation-gaps.md`.
No SBS by policy.

## 5. gapminder-tle-p5 (CC-BY 4.0) — Tier B PASS (revised)

SBS: `comparisons/sbs-gapminder-tle-p5.png`. 17 blocks, 1926 chars, OK.
First pass was single-column; revised to grouped two-column after SBS review
showed the column structure is a major visual relationship. Mustard ★ bullets
are native text glyphs (U+2605), full source text preserved including closing
paragraph and URLs (with wrapping mid-URL, as in source).

1.–2. Runhead → headline → lede → starred subheads → footer hierarchy preserved. ✓
3.–4. Two-column body grouping adapts the source's flowed columns (source flows
all three subheads left with overflow right; recon groups sub1+2 left,
sub3+closing right for 16:9 balance). Recorded adaptation, visually intentional. ~
5. Lede wraps 3 lines vs source 4 (wider 16:9 measure). Accepted.
6.–9. Whitespace, alignment, color all sampled/matched; no clipping in any of
17 boxes (verified visually). ✓
10. 17 boxes, 1926/1926 chars MATCH. Rendering unverified.

Known gaps: column rule omitted (no rules in engine — gap); star glyph shape
differs from source ornament (same role/color/position).

## 6. Tier-A twins (engine unassisted) — STRUCTURE OK, DRAMA ABSENT

`comparisons/tierA-twins.png`. Both slides: validation OK, export OK, engine
picked `opening-statement` for both.

- tq2-TierA: correct role order (kicker/number/title/caption) but numeral is
body-scale (~48pt EST), system-default red/black palette, no monumental scale.
The planner has no giant-numeral-cover path.
- wk-TierA: black default bg (not navy), title wraps to 2 lines, subtitle wraps
with a "DATA?" orphan, attribution small. Readable but unrefined vs Tier B.

Tier A proves the pipeline is reliable; Tier B proves the renderer ceiling is
high. The gap between them is engine selection + planner repertoire, not
rendering capability. That gap is the input to `grammar-candidates.md.

## 7. Failure / limitation log (honest)

- F1: 400pt fontSize cap (fosdem-p14 clamp). Engine limit, hit on real content.
- F2: no italic, no per-block serif in swiss (fosdem-p4 substitution).
- F3: no rules/dividers (tle-p5 column rule omitted).
- F4: no condensed grotesque (Gapminder width mismatch).
- F5: Tier-A planners cannot produce monumental scale or corner captions.
- F6: PPTX visual rendering unverified (no Office automation); parity is
structural (content/box-count/geometry byte checks) plus validator acceptance.
- F7: FOSDEM license UNVERIFIED → paraphrase-only, weaker evidence than licensed SBS.
