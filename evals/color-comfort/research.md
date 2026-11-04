# Color & Perceptual Comfort — Research Note

- Repo: `/Users/jeonghun/Typodeck` (`pwd` verified)
- Branch: `audit/color-comfort` (`git branch --show-current` verified; stayed on it, no checkout)
- Base commit: `f0aed77` ("typo-only: closure, F1/F2 fixed, verdict READY", `git rev-parse --short HEAD` verified)
- Date: 2026-11-04 (all live fetches below accessed this date unless noted)
- Scope: research only. This file makes **no visual claims**: no PNGs were viewed for it,
  no contrast ratios were measured, nothing is marked PASS. Any future design change must
  still view full-res 1920×1080 renders itself.
- Read before writing, per task: `evals/typo-only/FINAL-REPORT-KO.md` (verdict READY,
  F1/F2 closure, box-removal evidence) and `evals/typo-only/color.md` (typo-only color
  sources, pastel policy, token diffs). Both are prior-initiative evidence and were
  treated read-only. Constraints inherited from them are listed in §6 so later work
  does not regress F1/F2, the pastel policy, or box removal.

## 1. What the project's existing research already says (with file paths)

### 1.1 Paper survey: almost no color-comfort content

`research/paper-survey/00-INDEX.md` indexes 7 papers (PPTBench 2025, UMSI, SlideCoder,
PPTAgent, LecSlides/SlideParser, ColPali, PPTBench 2026). None of the 7 studies color,
luminance comfort, or dark mode; color appears only incidentally. A case-insensitive
search over `research/paper-survey/` for color/luminance/contrast/palette/dark confirmed
this — the only usable passages are:

- `research/paper-survey/02-umsi-visual-importance.md` (UMSI / visual importance):
  - §2: the model predicts **viewer-identified** importance, explicitly not
    designer-specified importance and not aesthetics or design heuristics. For Typodeck
    this puts any UMSI-class model on the *perceived* side only.
  - §5.2: the model detects "high-contrast elements" — contrast is an importance cue,
    but the paper gives no comfort or palette guidance.
  - §6.2 Discussion: reflow modifies **only element size and position**; "colors,
    fonts, and other features affecting visual importance" are explicitly **future
    work**. So UMSI offers no evidence for color-driven hierarchy repair.
  - §6.2 compiler note 4: element scores are mask-averaged means that ignore
    within-element distribution, **inter-element contrast**, and reading order.
  - §3.2: annotators distinguish at most **~7 important elements** per design —
    a usable ceiling argument against many-accents-per-slide.
  - §5.2 / §7.1.7: text-bias limitation — on text-dense slides a naive importance
    model heats all text, so color must not be trusted to separate what type already
    fails to separate.
  - §6.2 expert quote ("the hierarchy of elements, making sure we read the most
    important thing first") justifies hierarchy-first design, consistent with the
    principles in §3.
  - §6.2 compiler note 1 / §7.3: **slides are unvalidated** — no training class
    includes presentation slides. Any transfer to slides must state this limit.
- `research/paper-survey/09-HCI-reinterpretation.md`:
  - §3.1: "Reading order is not top-left → bottom-right. **Size, color, position,
    and grouping change gaze priority** (MIT Comm Lab guide)." Color is named as a
    gaze-priority channel, but no palette, polarity, or comfort rule follows.
  - §3.2: attention ≠ reading order ≠ comprehension; hierarchy metrics are scoped to
    "perceived hierarchy on a static render", never equated with comprehension.
    Comfort claims need the same scoping (see §5).
  - §3.4: accessible reading order is a **separate axis**; passing one axis is never
    claimed as passing the other. Same discipline applies here: WCAG pass ≠ comfort.
- `research/paper-survey/08-ADR-mapping.md`:
  - §1 (02→ADR-0012): typography-first hierarchy realized through "size · contrast ·
    position", grounded in UMSI's relative-importance preservation. Contrast here is a
    hierarchy means, not a comfort finding.
- `research/paper-survey/04-pptagent-ppteval.md`:
  - App. C / Table 3: good design needs color schemes with "clear contrast to
    highlight content while maintaining harmony" — harmony-plus-contrast, but at
    rubric granularity, not actionable values.
  - §7.2: move/resize/align/**contrast adjustment** listed as Typodeck-side extension
    ops absent from PPTAgent's five — contrast repair is acknowledged Typodeck
    territory, with no source behind it yet. This note is that source's start.
- `research/paper-survey/01-pptbench-2025.md`, `03-slidecoder.md`,
  `05-lecslides-slideparser.md`, `06-colpali.md`, `07-pptbench-2026.md`: no
  color-comfort content. Mentions found are mechanical only (font-color APIs,
  color-gradient segmentation, solid-color masking, color-segmentation judge scripts,
  `text_color`/`node_fill` issue types) and support no principle.

### 1.2 Typo-only color work (read-only inputs, must not regress)

- `evals/typo-only/color.md` §§1–2: already consulted Tableau Blueprint Visual Best
  Practices, Tableau Accessible Views, ColorBrewer 2.0, and the RColorBrewer reference
  (all re-fetched live for this note in §2 — same documents, same claims, no
  conflict). Its applied reading stands: **pastels are grounds, never signals** —
  pastel-vs-pale must never carry meaning alone, and every pastel text pairing must be
  measured to AA. That policy is inherited, not re-litigated.
- `evals/typo-only/color.md` §§3–5 + `evals/typo-only/FINAL-REPORT-KO.md` §§4–6:
  D02 navy (`#182B49` on paper 13.36:1), D19 fjord chip text (7.55/7.75/5.54),
  D18 white-on-purple labels (4.86:1). Thin-pass precedents that later comfort work
  must treat as fragile, not headroom: signal-board red FAULT 4.54:1, fika caption
  slate@72% 4.58:1, D21 sand-on-orange exactly 3.00:1 at 72px.
- `evals/typo-only/FINAL-REPORT-KO.md` §§12/15/Closure: F1 (harness fika accent →
  fjord, 2.45→13.56:1) and F2 (stale "Red squares" captions removed) are closed at
  `f0aed77`; D12 cyan-on-white 2.07:1 and D15 rose-swash 3.26:1-in-body remain
  **owner-decision gaps**, not утверждены norms — later work must not cite them as
  justification for new low-contrast text.

## 2. Primary sources consulted live (URLs + access date)

Access date for every fetch below: **2026-11-04**. Claims are quoted or closely
paraphrased from the fetched originals; anything the original did not say is labeled
interpretation in §3.

| # | Source | URL | Status |
|---|--------|-----|--------|
| S1 | Tableau Blueprint — Visual Best Practices | https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm | 200, full text read |
| S2 | Tableau — Best Practices for Designing Accessible Views | https://help.tableau.com/current/pro/desktop/en-us/accessibility_best_practice.htm | 200, full text read |
| S3 | Tableau — Author Views for Accessibility | https://help.tableau.com/current/pro/desktop/en-us/accessibility_create_view.htm | 200, full text read |
| S4 | W3C WCAG 2.1 Understanding 1.4.3 Contrast (Minimum) | https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html | 200, full text read |
| S5 | W3C WCAG 2.1 Understanding 1.4.1 Use of Color | https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html | 200, full text read |
| S6 | W3C WCAG 2.1 Understanding 1.4.11 Non-text Contrast | https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html | 200, full text read |
| S7 | ColorBrewer 2.0 | https://colorbrewer2.org/ | 200, app page read |
| S8 | RColorBrewer reference manual v1.1-3 (2022-04-03), CRAN | https://cran.r-project.org/web/packages/RColorBrewer/RColorBrewer.pdf | 200, PDF text extracted |
| S9 | Budiu (NN/g, 2020-02-02), "Dark Mode vs. Light Mode: Which Is Better?" — **secondary synthesis, not a study** | https://www.nngroup.com/articles/dark-mode/ | 200, full text read |
| S10 | Aleman, Wang & Schaeffel (2018), "Reading and Myopia: Contrast Polarity Matters", *Scientific Reports* 8:10840 — **peer-reviewed primary** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6052140/ (PMCID PMC6052140; DOI 10.1038/s41598-018-28904-x) | 200, full text read |

NOT RUN (honest record, with reasons):

- Piepenbrock, Mayr, Mund & Buchner (2013), "Positive display polarity is
  advantageous for both younger and older adults", *Ergonomics* 56(7):1116–1124 —
  primary NOT RUN: publisher page HTTP 403, PubMed page cookie-walled (203 +
  "Cookies must be enabled"), Unbound Medicine mirror HTTP 401. Findings below are
  cited **only via S9's secondary summary**, explicitly labeled.
- Dobres, Chahine & Reimer (2017), *Applied Ergonomics* (glanceable reading,
  polarity × ambient light) — primary NOT RUN (paywalled journal; not attempted
  after S9's summary sufficed for a research note). Cited **only via S9**.
- Legge et al. (1985, low vision / cloudy ocular media) and Papadopoulos &
  Goudiras (2005, low-vision text accessibility) — primaries NOT RUN; cited **only
  via S9**.
- Publisher (nature.com) version of S10 — NOT RUN (redirected to an auth wall);
  the identical paper was verified instead through its PMC full text (PMCID
  PMC6052140, same DOI).

### 2.1 Verified findings per source (no invented findings)

**S1 (Tableau Blueprint).** Managing color choices: "The primary color(s) that make
up most of your design should be a neutral color. Using techniques like grayscale,
you maximize the possibility for contrast and visibility of your data driven points.
Your extended colors — accents, emphasis, and alerts — should reflect the brand. Any
extended color should be used sparingly to draw attention to key messages within the
data." Color types: "Understand when to use sequential, diverging, categorical,
highlighting, or alerting color motifs." Consistency: "Double-check your
visualizations to make sure a color (e.g. red) doesn't mean three different things."
Accessibility: "Remember to account for color blindness in the design process."

**S2 (Tableau accessible views).** "Color alone doesn't always provide enough of a
distinction. Too many colors is especially hard when there are many marks in a
view." Tableau provides a color-blind palette; "for any color palette … provide
enough contrast and assign colors that differ from each other on the light-dark
spectrum." For line marks add shape/size/labels. "Use contrast analyzer tools …
Make sure that color contrast for text is strong and meets the contrast ratio
standards of 4.5:1 (3:1 for large text)."

**S3 (Tableau authoring for accessibility).** "The main difference in creating
accessible views is that you should always provide other types of mark encoding
when you use color in the view." Hard cap: "don't use more than 10 colors and
shapes in one view so that users can distinguish each color and shape." Palette
guidance: dimensions → Color Blind palette; measures → Blue or Orange-Blue
Diverging stepped (≈5 steps); monochromacy fallbacks (Seattle Grays / Gray stepped).
Text: 4.5:1 (large text 3:1); "Tableau's default color formatting follows these
prescribed contrast ratios." Restated as a must: "When you use color in the view,
you must also provide other types of encoding for marks, such as labels, size,
shape, and position. Don't rely on color alone."

**S4 (WCAG 1.4.3).** Normative: text 4.5:1; large-scale text 3:1, where large means
18pt (≈24px) or 14pt bold (≈18.5px). Rationale for the numbers: 3:1 is the ANSI/ISO
minimum for normal observers; 4.5 = 3 × 1.5 compensates the contrast-sensitivity
loss of ~20/40 vision ("typical visual acuity of elders at roughly age 80");
7:1 (level AAA, SC 1.4.6) compensates ~20/80. Contrast is computed from **relative
luminance**, deliberately hue-independent, so it holds across color-vision
deficiencies (with a noted protanopia caution for long-wavelength reds on black).
Two caveats the document states itself: (a) thin/unusual fonts with anti-aliasing
"may be rendered … with a much fainter color than the actual text color", so a
nominal pass can fail in practice — exceed the minimum or strengthen strokes;
(b) "Some people with cognitive disabilities require color combinations or hues
that have low contrast" — the standard explicitly contemplates low-contrast needs
via adjustable presentation. Computed ratios must not be rounded (4.499 ≠ 4.5).

**S5 (WCAG 1.4.1).** "Color is not used as the only visual means of conveying
information, indicating an action, prompting a response, or distinguishing a visual
element." A lightness difference counts as an additional visual distinction **only**
if the pair reaches 3:1 ("a light green and a dark red … would pass if the
contrast ratio is at least 3:1"). But where the user must *identify a specific
color* (e.g. green outline = valid), an extra indicator is required **regardless**
of ratio.

**S6 (WCAG 1.4.11).** UI components and meaningful graphics need 3:1 against
adjacent colors; decorative parts are exempt. Same thin-line anti-aliasing warning
as S4: hairline rules and glyphs that nominally pass can render far fainter —
avoid particularly thin strokes or exceed the minimum. Directly relevant to
hairline rules and glyph ornaments in box-free slide designs.

**S7 (ColorBrewer 2.0**, © Cynthia Brewer, Mark Harrower, Penn State). Schemes are
organized by **nature of the data** — sequential / diverging / qualitative — with
3–12 data classes and three independent safety filters: **colorblind safe, print
friendly, photocopy safe**. The filter design itself is the lesson: a scheme that
works on screen is not assumed to survive color-vision deficiency, print, or
photocopy — each channel is checked separately.

**S8 (RColorBrewer reference).** The three families, verbatim in substance:
1. "Sequential palettes are suited to ordered data that progress from low to high.
   Lightness steps dominate … light colors for low data values to dark colors for
   high data values" (3–9 classes).
2. "Diverging palettes put equal emphasis on mid-range critical values and extremes
   at both ends … emphasized with light colors [middle] and low and high extremes
   … with dark colors that have contrasting hues" (3–11 classes).
3. "Qualitative palettes do not imply magnitude differences between legend classes,
   and hues are used to create the primary visual differences … best suited to
   representing nominal or categorical data" (max 8–12 classes depending on
   palette: Accent 8, Dark2 8, Paired 12, Pastel1 9, Pastel2 8, Set1 9, Set2 8,
   Set3 12). Note the interaction with S3's ≤10 cap and UMSI's ~7-element ceiling
   (§1.1): distinguishable categories top out in the high single digits.

**S9 (NN/g synthesis — secondary, read critically).** Mechanism: more ambient/display
light contracts the pupil, reducing spherical aberration and increasing depth of
field, so focusing costs less effort. Reported study results (all second-hand here):
Piepenbrock et al. 2013 — positive polarity (dark on light) won on Landolt-C acuity
**and** proofreading in **both** young (18–33) and older (60–85) normal-vision
adults (polarity was between-subjects); Piepenbrock, Mayr & Buchner 2014 (Human
Factors) — advantage "particularly for small character sizes" (title only; body
not verified). Dobres et al. 2017 (MIT AgeLab) — light mode beat dark mode at
simulated night, **no polarity effect under bright simulated daylight**, and small
fonts suffered most in dark mode at night. Legge et al. 1985 — all 7 participants
with cloudy ocular media (cataract) read faster in dark mode; central-vision-loss
participants unaffected; caveat noted that CRT flicker may have biased against
light mode. Aleman et al. 2018 — choroid thinning under light mode, thickening
under dark mode (verified directly in S10; S9's "7 participants / one hour" matches
the primary). S9's takeaways: default to light mode for general audiences, **offer**
dark mode as a choice (low-vision users, possible long-term effects, preference) —
especially for long-form reading apps. S9 states plainly it did no original
research ("NN/g has not done its own research on dark mode").

**S10 (Aleman, Wang & Schaeffel 2018 — peer-reviewed primary, full text verified).**
Methods: n=7 young human subjects; brightness-matched reading targets (~35 cd/m²
both polarities, Minolta LS-100); 65″ 4K TV at 3.2 m; 1 hour of reading per
condition; subfoveal choroidal thickness by spectral-domain OCT, morning sessions
only (diurnal swing controlled), repeated measurements (SD 5–10 µm), inter-observer
R 0.764–0.991. Results: black-on-white thinned the choroid −16.13 ± 4.54 µm
(pooled p = 8.3×10⁻⁵); white-on-black thickened it +9.96 ± 6.51 µm (p = 0.0067);
thinning correlated with existing myopia (R = 0.71). Controls: empty screens at
three luminances produced no change; accommodation/pupil-size differences excluded
by infrared photorefraction at 30 cm. Authors' own limits: choroidal thickness is a
*precursor* signal for eye growth, not myopia itself; stress unmeasured; and "it
is clear that an epidemiological study needs to be done in children in the future
to confirm the validity of the proposed strategy." The authors' "may not be
advisable to read black text on white background" is framed as a hypothesis needing
epidemiology — **it is not a design prescription**, and this note forbids citing it
as one (§4).

## 3. Presentation-specific principles (sourced, with limits)

Each principle states the source chain: what the source actually says → the
presentation translation (labeled interpretation) → its limit.

### P1 — Ground / ink / accent hierarchy

- Source chain: S1 (neutral primaries, grayscale maximizes contrast for data points;
  accents sparse, single-meaning, brand-reflecting) + S3 (emphasize only the most
  relevant data; reduce marks to prevent cognitive overload) + UMSI §3.2 (~7
  distinguishable important elements).
- Interpretation for slides: the ground should be effectively neutral (paper, ink
  black, or a brand-neutral wash — neutrality is about *role*, not a specific
  hue); running text rides on one ink with a large light-dark gap to the ground;
  **one accent per slide carries one meaning** (signal, emphasis, or alert — never
  all three, per S1's "doesn't mean three different things"). Pastels stay grounds
  behind dark text (inherited typo-only policy, §1.2), consistent with S8's
  sequential family where light = low emphasis.
- Limit: S1/S3 address dashboards, where "marks" are data points. A slide's
  "marks" are rhetorical (kicker, headline, evidence, caption), so the ≤10/≤7 caps
  transfer as direction ("few"), not as literal budgets. The one-accent rule is
  posited, not sourced — validate per design with full-res viewing.

### P2 — Categorical vs sequential color (never confuse the two)

- Source chain: S8's three families + S1's five motifs
  (sequential/diverging/categorical/highlighting/alerting) + S7's per-channel safety
  filters.
- Interpretation for slides:
  - **Categories** (speaker tracks, pro/con sides, named series): hue differences
    with no lightness-implied ranking (S8 qualitative); keep to a handful of
    classes (S3 ≤10, S8 maxima 8–12, UMSI ~7 all point the same way); every pair
    separated on the light-dark spectrum too when color carries the distinction
    (S2/S3), and never the sole carrier (P5).
  - **Ordered magnitude** (scores, ranks, progressions): lightness steps, light =
    low, dark = high (S8 sequential). A pastel-to-saturated ramp is this family —
    which is exactly why pastel-vs-pale text distinctions fail: the light end of a
    sequential scheme has no signal strength.
  - **Deviation from a midpoint** (over/under, before/after, delta): light neutral
    middle with dark contrasting-hue extremes (S8 diverging; S3's Orange-Blue
    stepped example).
  - **Highlighting vs alerting** are distinct motifs (S1): an emphasis accent and
    an error/alert accent must not share a hue, or one color means two things.
- Limit: S7/S8 were built for cartography; "data classes" map onto slide rhetoric
  only by analogy. The families' *structure* (hue≠magnitude, lightness=order) is
  what transfers — never specific palettes without per-design measurement.

### P3 — Dark-ground accent restraint

- Source chain: S9's polarity synthesis (positive-polarity advantage for
  normal-vision acuity/proofreading, small text worst in dark mode at night, no
  polarity effect in bright daylight) + S4's luminance-first contrast model + S6's
  thin-stroke warning.
- Interpretation for slides: dark grounds are legitimate (dividers, closings, full
  bands — the typo-only report already scopes them as grounds, not boxes), but
  three restraints follow: (1) **small text pays the highest polarity price** —
  keep captions, kickers, and footnotes large and high-contrast on dark grounds,
  never thin-small-neon; (2) **accents on dark grounds need less saturation, not
  more** — a hue that is calm on paper glares on black at the same ratio, so
  re-verify every accent pairing per ground rather than transplanting it; (3)
  **projectors and bright rooms are the Dobres daylight case** — polarity effects
  shrink as ambient light rises, while absolute legibility falls for everyone, so
  dark-ground decks need a bright-room legibility check, not a polarity debate.
- Limit: the polarity studies used reading/proofreading/lexical tasks, not
  slide comprehension; sample sizes are small (S10 n=7); CRT-era low-vision
  results carry a flicker caveat (S9). Nothing here supports flipping any design's
  default polarity — see §4.

### P4 — WCAG pass ≠ comfort

- Source chain: S4's own rationale and caveats + S9/S10 + S6.
- Why a passing ratio is necessary but not sufficient for comfort:
  1. The ratios are **legibility floors for impaired vision** (20/40 → 4.5, 20/80
     → 7:1), not comfort optima for normal vision. A 4.5:1 pair and a 13:1 pair
     both "pass" but feel nothing alike.
  2. Ratios are computed from **flat declared colors**, while S4/S6 themselves warn
     that thin strokes + anti-aliasing render far fainter than declared. Thin-pass
     pairs (typo-only precedents: 4.54, 4.58, exactly-3.00) are therefore fragile
     by the standard's own account — comfort work should treat <5:1 body text as
     suspect even when it passes.
  3. Ratios ignore **polarity, ambient light, and exposure time**. S9's synthesis
     shows the same ratio can perform differently by polarity (small text, night)
     and ambient (daylight erases the polarity gap); S10 suggests even the
     long-term physiology may differ by polarity — an open question, not a rule.
  4. S4 explicitly notes some cognitive-disability users **need low contrast**,
     with adjustable presentation as the sanctioned answer. Comfort is a range
     with occupants at both ends — no single threshold, high or low, is
     comfortable for everyone.
- Interpretation for slides: keep AA as the floor (4.5:1 body, 3:1 large-only per
  S4's 18pt/14pt-bold definition), budget real headroom above it for body text and
  hairlines, and judge comfort by full-res viewing in the deck's actual ground
  contexts — never by the ratio number alone.

### P5 — Redundant encoding: color is never the only channel

- Source chain: S5 (normative: color never the sole means; lightness ≥3:1 counts as
  a second channel, but color-*identification* tasks always need an indicator) +
  S2/S3 (labels, size, shape, position alongside color) + UMSI §2 (viewers, not
  designers, decide what looks important — redundancy is what survives that gap).
- Interpretation for slides: every color-carried distinction gets a non-color twin
  — a label, a glyph, a size/position difference, or a ≥3:1 lightness gap (S5's
  explicit bar). Status words, fault markers, and series identities that today rely
  on hue alone (typo-only A1 precedent: signal-board orange/red carried by
  color+position+glyph) keep that redundancy in any comfort restyle. Prose that
  names a color ("the red line") is a color-identification task under S5 and needs
  the referent labeled even at high ratios.

## 4. Explicitly forbidden: universal prescriptions

No finding in §2 supports a context-free color rule. The following are **forbidden
as global prescriptions** in later color-comfort work; each ban states its reason:

1. **No "always replace black with X"** (or white/paper with anything). S1 requires
   neutral *roles*, not specific neutrals; S4/S6 are pair-relative thresholds with
   no preferred endpoint; S9's takeaway keeps light mode as default *with dark mode
   offered as choice*. A universal ink/ground swap has no source and would regress
   per-design measured pairs (§1.2).
2. **No global dark-mode default flip.** S9's normal-vision evidence favors positive
   polarity for acuity/proofreading; S10's myopia signal is an n=7 acute-precursor
   finding whose authors demand epidemiology before any recommendation. Neither
   direction has a mandate — polarity stays a per-design, per-context decision.
3. **No single mandated accent hue or palette.** S1 ties accents to brand and
   meaning-per-design; S7/S8 palettes are data-shaped, not brand-shaped; typo-only
   navy `#182B49` was chosen against four candidates **on real components**
   (color.md §3) — transplanting it, or any token, to another design without
   re-measurement and full-res viewing is forbidden.
4. **No ratio-only restyle.** By P4 and S4/S6's own caveats, a ratio number cannot
   bless a pairing; every changed pair must be viewed on its real ground at
   1920×1080, in all its roles (body, chip, kicker, glyph), before any claim.
5. **No myopia-based polarity argument.** Citing S10 to prefer dark grounds (or S9's
   acuity results to forbid them) misrepresents both: S10's authors call their own
   result hypothesis-grade, and acuity ≠ comfort ≠ long-term effect. The three
   outcome classes must never be conflated.
6. **No new low-contrast text justified by the D12/D15 gaps.** Those are open owner
   decisions on identity-critical display type (FINAL-REPORT-KO §12/§15), not
   precedents. D12 cyan 2.07:1 fails even the 3:1 large floor; nothing in §2
   rehabilitates sub-floor text.

## 5. Limits of this note (read before using it)

1. **No renders viewed, no ratios measured, no PASS given.** This note is a
   literature distillation; every "interpretation for slides" line is a hypothesis
   awaiting per-design measurement and full-res viewing.
2. **Domain transfer is flagged, not hidden.** S1–S3 address dashboards, S7–S8
   maps, S4–S6 web content, S9–S10 reading tasks. Slides share the visual system
   but differ in viewing distance, ambient (projectors, bright rooms), exposure
   time, and speaker accompaniment. Where transfer is analogical (§3 limits), later
   work must validate rather than assume.
3. **Comfort has no validated slide metric.** Ratios are legibility floors (P4);
   polarity studies measure acuity/proofreading/choroidal response, not comfort;
   UMSI predicts perceived importance, not ease. A comfort claim needs its own
   defined measure (e.g. blind pairwise preference at full res) — this note
   provides none.
4. **Secondary citations are labeled.** Piepenbrock 2013, Dobres 2017, Legge 1985,
   and Papadopoulos 2005 appear here only through S9's synthesis because their
   primaries were unreachable or unattempted (§2 NOT RUN). Later work that leans on
   any of them should fetch the primary first.
5. **UMSI transfer caveat inherited**: any future use of importance models for
   hierarchy validation must state "validated on ads, posters, infographics, web,
   and mobile UIs; slides unvalidated" (02-umsi §6.2.1, 09-HCI §5).

## 6. Handoff constraints (typo-only READY must not regress)

Later color-comfort design work inherits these invariants from `f0aed77`:

- **F1 stays fixed**: harness fika accent is fjord navy (13.56:1 on off-white);
  dusty-blue ≈2.45:1 accent text must never return (FINAL-REPORT-KO Closure).
- **F2 stays fixed**: "Red squares" captions are gone (27 decks); captions must
  describe what the slide actually shows (Closure).
- **Box removal stays complete**: slide CSS keeps 0 border/box-shadow/gradient/
  border-radius/table/svg/canvas/pseudo-elements (FINAL-REPORT-KO §7); the two
  documented exceptions (D08 glyph text-shadow, D07 amber-on-deep 7.89:1) are
  identity/ground cases, not openings.
- **Pastel policy stays**: ground-or-fill-only, measured AA pairings, no
  pastel-vs-pale meaning (color.md §2; FINAL-REPORT-KO §6).
- **Measured pairs stay**: D02 navy 13.36/14.18, D19 fjord 7.55/7.75/5.54, D18
  white-on-purple 4.86 — any comfort-motivated change re-measures its pairs and
  re-views its renders; thin passes (4.54/4.58/3.00-exact) get headroom, not
  company.
- **D12/D15 stay owner decisions**: no new sub-floor or body-small low-contrast
  text may cite them as precedent (§4.6).
- **Prohibited paths and actions** from the task still bind later work: no writes
  outside the initiative's owned files, no commits/pushes, no touching
  `evals/typo-only/**` (read-only evidence), node_modules, tsbuildinfo, hierarchy
  annotations, paper-survey-tmp, or 8-bit-orbit.
