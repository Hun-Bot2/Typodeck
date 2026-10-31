# Implementation gaps (ranked by evidence)

Each gap names the case that hit it, the honest cost, and the smallest fix.
"Smallest" is scoped to this research branch's reading of the engine; the
integration workstream decides real priority.

1. SILENT TEXT OVERFLOW (G1/G3 probes: 3 clipped instances, all validation-OK).
Cost: engine ships slides with cut-off sentences and no signal. Smallest fix:
render-measure critic gate — headless-Chrome scrollHeight vs clientHeight per
`.slide-block` on recon.html; fail or warn on overflow. No schema change.
2. NUMERAL BOX WIDTH (gen-g1-long/metric: "12"→"1", "98%"→"9"). Cost: any
multi-character display numeral clips. Smallest fix: planner sizes numeral
boxes from digit count (chars × 0.55em EST) or measured width; candidate rule.
3. TITLE WRAP RULE (gen-g1-long-en 2nd line clipped; wk-TierA orphan "DATA?").
Cost: long titles clip or orphan. Smallest fix: planner branch — single-line
display size vs two-line stepped-down size; widows/orphans check in critic.
4. FONTSIZE CAP 400pt (fosdem-p14: 424→400 clamp, ~6% smaller than measured).
Cost: monumental glyph scale unrepresentable. Smallest fix: review cap against
real content; raise or justify (PPTX/HTML render fine above 400 — cap looks
arbitrary, but changing it is the engine owner's call).
5. NO ITALIC / NO PER-BLOCK SERIF IN SWISS (fosdem-p4: serif-italic → SANS 400).
Cost: talk-title register mismatch. Smallest fix: none proposed here — style
flags expand the schema; record as expressive ceiling, revisit if a second
case needs it.
6. NO RULES/DIVIDERS (tle-p5 column rule omitted). Cost: column separation
relies on gap alone (worked visually here). Smallest fix: none — typography-only
constraint forbids rules; document gap-as-separator as the sanctioned pattern.
7. NO CONDENSED GROTESQUE (Gapminder width mismatch). Cost: ~10-15% width
difference (EST) vs source. Smallest fix: font-stack addition (licensing
review required); no engine change.
8. TIER-A PLANNER REPERTOIRE (Tier-A twins: correct roles, no drama; numeral
at body scale, default palettes, no corner captions). Cost: engine output is
reliable but unremarkable. Smallest fix: G1/G3 as new candidates + planner
paths (grammar-candidates.md), not prompt tweaks.
9. PPTX RENDERING UNVERIFIED (all cases). Cost: parity claims are structural
(byte-identical `<a:t>` runs, box counts) + validator acceptance, not visual.
Smallest fix: Office-automation or LibreOffice render step in benchmark
tooling (environment change, not engine change).
10. FOSDEM LICENSE UNVERIFIED. Cost: 2 of 12 cases are paraphrase-only, weaker
evidence. Smallest fix: rights-holder confirmation or replacement with a
licensed monumental-glyph source.
11. NO UNDERLINE STYLE (tlit-p5, foster-p15 links). Cost: links keep color
only. Smallest fix: none proposed — single-style-per-block is a schema
property; record as expressive ceiling with #5.
12. NO SLAB-SERIF FACE (Foster titles). Cost: Archivo Black substitution is
credible but letterform-different. Smallest fix: font-stack addition
(licensing review), same class as #7.
13. NO BADGE/CIRCLE SHAPES (tlit-p2 letters, Gapminder checkmarks). Cost:
bare-glyph reduction loses the badge register. Smallest fix: none —
typography-only constraint; bare glyph is the sanctioned fallback.
