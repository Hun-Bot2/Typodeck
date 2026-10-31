# Grammar candidates (evidence-backed, with verdicts)

Source: 5 Tier-B reconstructions + 8 fixed-geometry generalization probes
(all validate OK + export OK; verdicts are VISUAL, from headless-Chrome
screenshots). Probe strips: `comparisons/gen-g1.png`, `comparisons/gen-g3.png`.
Probe generator: `tools/gen-probe.py`. Probe cases: `cases/gen-*` (deck +
recon outputs committed with each case).

Fixed geometry was deliberate: clipping under swapped content is a finding
(grammar needs a responsive rule), not a setup error. The schema validator
catches none of these failures — `overflow: hidden` clips silently.

## G1 MONUMENTAL-NUMERAL-COVER — CONDITIONAL PASS

Evidence: gapminder-tq2-p1 Tier B (PASS). Parameters: left edge x, kicker
(tracked caps) → numeral (~30% canvas height) → title (~1/4 numeral size) →
caption, footer triad.
Probes (`comparisons/gen-g1.png`): short-en PASS; med-ko PASS; long-en FAIL (title wraps, 2nd line
clipped; 2-digit "12" clipped to "1" — numeral box w3.0 fits one digit);
metric FAIL ("98%" clipped to "9").
Verdict: the compositional relationship generalizes across language and
purpose, but fixed geometry does not. Shippable only with responsive rules:
R1 numeral box width ∝ digit count (or measured text width); R2 title wrap
rule (grow box or step size down at >1 line).
Proposed representation: new composition candidate + planner path (`opening`
type already exists; planner lacks monumental-scale branch — cf. Tier-A twin
which set the numeral at body scale). NOT a Skill text trick: needs engine
geometry.

## G2 CENTERED-KEYNOTE-STACK — UNTESTED (Tier-B PASS, probes deferred)

Evidence: wk-p1 Tier B (PASS). Parameters: centered title/sub/attr stack,
tracked-caps subtitle, corner captions, dark field.
No probes run (budget). Expected risks, stated upfront: long titles wrap to 2
lines (Tier-A twin showed this); corner captions collide with stack on dense
content. Do not promote above "candidate" without probes.

## G3 STARRED-EXPLAINER-COLUMNS — CONDITIONAL PASS

Evidence: gapminder-tle-p5 Tier B (PASS). Parameters: full-width
runhead/headline/lede, grouped 2-column starred subheads (★ = U+2605 native
text), footer triad.
Probes (`comparisons/gen-g3.png`): short-en PASS (airy but intentional); med-ko PASS; faq PASS
(purpose-swap reads as intentional FAQ); long-en PARTIAL (body1 loses its last
line to clipping — "...collapsed in exactly" shown, final clause cut).
Verdict: robust across languages/purposes at or below source density; needs
R3 body reflow rule (shrink or spill) above it.
Proposed representation: new composition candidate for `evidence`/`insight`
dense types + planner column-grouping; ★ bullet as documented text-glyph
convention (no new primitive — it is a character, not a shape).

## G4 MONUMENTAL-GLYPH — BLOCKED (engine cap)

Evidence: fosdem-p14 Tier B (PARTIAL). Single glyph ≥50% canvas height.
Blocked by 400pt `fontSize` cap (424→400 clamp measured) and by weight
mismatch (system © vs custom vector mark). Grammar is expressible but the
engine cannot render its defining instance. Promote only after cap review
(see `implementation-gaps.md` F1).

## Cross-cutting rules (all candidates)

- Q1 OVERFLOW-MUST-BE-VISIBLE: no grammar ships on fixed boxes without a
render-measure check. All 3 probe failures were silent clips that validation
accepted. Proposed: headless render measuring scrollHeight vs clientHeight per
block as a critic gate (tooling exists: recon.html + Chrome).
- Q2 MEASURE-DEPENDS-ON-SCRIPT: Korean wrapped cleanly at Latin-derived
measures in these probes, but CJK has no spaces — line-breaking behaves
differently. Any wrap rule must be tested in KO, not assumed from EN.
- Q3 SUBSTITUTIONS-ARE-PART-OF-THE-GRAMMAR: pattern→solid, logo→text-caption,
serif-italic→sans, ornament→★/© glyphs. Each substitution must name its
fidelity cost (done per-case in analysis + findings), never silently applied.
