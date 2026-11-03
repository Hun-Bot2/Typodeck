# Typodeck Typography Audit — Part 2 (D10–D18)

Auditor: typography auditor (child). Scope: D10..D18 only.
Sources per design: full-res `evals/design-diversity/screenshots/Dxx.png` (1920x1080, viewed at full res)
plus `bold-template-pack/templates/<slug>/{preview.md,design.md}` (both read in full).
DID→slug map verified against `bold-template-pack/selection-index.json` and
`evals/design-diversity/design-matrix.csv`.

Per-design record: typography (as rendered vs spec) · ornament classes present ·
fitness · coherence · defects · leaning (Core / Specialized / Experimental / Rework / Reject).

Owner hypotheses addressed at the end (S13/S15 ornament-dependent; S14/S16/S17 specialized).

---

## D10 — signal-board (Signal Board)

- Typography (pixels): Inter 800 sentence-case headline "The Hidden Cost of / Rushing to Ship",
  tabular numerals ("11 / 11", "COVER 01"); IBM Plex Mono for command bar, kicker pills,
  context line, ticker rows, case-log rows, status pills, footer. Sans/mono boundary holds
  everywhere. Tracked mono chrome legible. Matches spec tokens.
- Ornament classes: slate command bar + green live dot + telemetry; solid blue kicker pill +
  ghost outline pill; KPI card (92px numeral, mono caption, COMPLETE pill, green top border);
  dark case-log panel (PM-01..PM-11 grouped rows, LOGGED / UNDER REVIEW pills, extraction
  rows, green seal bar + SEALED caption); ticker rows with ▲/▼ glyphs; blue context swatch;
  hairline footer with volume + page mark. All spec ornaments present.
- Fitness: strong for metrics reviews, ops readouts, research briefs, QBRs — anywhere counts
  and status signals carry the argument. Correctly excludes emotional/ceremonial decks.
- Coherence: excellent — semantic color discipline holds (blue identity, green complete,
  amber in-progress, red single fault glyph); flat, ruled, flush-left throughout.
- Defects: minor. (1) Ticker row "SHARED FINDING — REVIEW DISCIPLINE ▼ SKIPPED" is
  semantically odd (the deck's own finding marked skipped/fault-red) — content choice, not a
  system break. (2) Large quiet zone mid-left-column between context line and ticker strip;
  reads as instrument spacing, acceptable.
- Leaning: **Core**. Fully pixel-faithful, broad business-deck applicability, no niche lock-in.

## D11 — gilded-line (Gilded Line)

- Typography (pixels): Cinzel tracked caps for kicker, two-line headline, context line,
  colophon ("№ 11 ◆ ANNO MMXXVI"); single Jost italic subtitle sentence. Inscription/utterance
  boundary holds; tracked capitals optically centered. Matches spec.
- Ornament classes: double gold lacquer frame + rotated-diamond corners; champagne panel with
  3px border + offset outline; seven-ray fan crest (teal + central gold); full + thin diamond
  rules (◆/◇); mirrored side ornaments; teal diamond-guarded kicker; colophon. All present.
- Fitness: strong for galas, awards, heritage brands, annual reports, investor letters —
  occasions where symmetry signals ceremony. Correctly excludes dense technical docs.
- Coherence: excellent — strict bilateral symmetry verified visually; teal confined to
  micro-roles; champagne inversion reads as illuminated inscription.
- Defects: minor. Kicker ("TYPODECK RESEARCH") and context line ("Typodeck Research ·
  November 2026") repeat the same source string — content redundancy, mildly dilutes the
  stack. No system violation.
- Leaning: **Specialized**. Ceremonial deco register is deliberately narrow; flawless inside it.

## D12 — new-wave-static (New Wave Static)

- Typography (pixels): Archivo 800 mixed-case shout; exactly one Newsreader italic magenta
  intruder ("Cost"); one cyan grotesque payoff word ("Ship"); tracked caps masthead/kicker/
  chips/footer; `///` magenta subtitle slashes. One-word intruder monopoly holds. Matches spec.
- Ornament classes: black masthead band (magenta chip + cyan telemetry); 24° slash trio
  (magenta/cyan/black); 560px cropped magenta outline ghost "11"; 45° rotated black/cyan
  imperative chip; skewed slash divider; reversed context chip with cyan dot; footer clamp
  with magenta giant + cyan page chip. All present.
- Fitness: strong for launches, culture decks, provocations, student showcases. Correctly
  excludes solemn/compliance/ceremonial material.
- Coherence: strong — four-flat-color discipline holds; flush-left rail vs right static zone
  respected; no text crosses the slash trio.
- Defects: minor. Rotated chip ("READ THE FAILURE LOG ▸") runs to the right canvas edge with
  the ▸ glyph near crop — reads as intentional wheat-paste bleed, but verify LONG-title
  variants for headline/chip collision per the design doc's own known gap.
- Leaning: **Specialized**. Loud punk register is audience-gated by design; fully coherent.

## D13 — ma (Ma)

- Typography (pixels): Shippori Mincho 600 display title (two lines, sumi); Zen Kaku Gothic
  body subtitle; tracked 0.32em uppercase micro-label context line; stone Mincho ghost "01";
  Mincho seal glyph (研). Serif-display/sans-text separation holds; no emphasis abuse.
  Matches spec.
- Ornament classes: full-height 2px sumi rule; four stone corner margin marks; stone ghost
  numeral behind title open; 56px shu-red hanko seal (sole saturated moment); 64px context
  hairline. All present; ~70% void defended.
- Fitness: strong for single-idea keynotes, findings, retrospectives — gravity without noise.
  System declines charts/tables/images, so data-heavy decks must go elsewhere.
- Coherence: excellent — the void/rule/cluster/seal composition is exactly the spec plate;
  left asymmetry holds; nothing centers.
- Defects: none observed at pixel level. Stone ghost numeral is faint by design (projector
  washout is a documented accepted risk, decorative-only element).
- Leaning: **Specialized**. Extreme restraint + no data apparatus = narrow but masterful slot.
- Hypothesis note: ornament/composition-dependent CONFIRMED — the Mincho/Gothic pairing is
  generic Japanese editorial; the identity is carried by the void ratio, rule, ghost numeral,
  and seal (all non-typographic). Without them the type alone would not identify the system.

## D14 — dessau (Dessau)

- Typography (pixels): Jost 600 lowercase-only two-line display; Jost 400 sentence-case
  subtitle; Jost 600 tracked caps top-bar context; Jost 600 white numeral "01" bottom-right.
  Single-family doctrine holds; no second face. Matches spec.
- Ornament classes: 96px top + 72px bottom black bars; tricolor strip sign-off; red key bar
  fronting title column; blue/yellow divider pair; red triangle / blue circle / yellow
  (black-edged) square glyph stack. Shape-color assignments correct throughout.
- Fitness: strong for design-system launches, workshops, education, manifestos. Lowercase
  doctrine + primaries exclude funerary/luxury/finance contexts (correctly).
- Coherence: strong — five-spot-ink discipline holds (no grays, no secondaries, no tints);
  flat masses, hard edges, left/grid-keyed alignment.
- Defects: minor. (1) No red display accent word used (spec permits at most one — optional,
  so compliant, but the headline misses the signature red lift). (2) Large empty field below
  the subtitle in the title zone; acceptable at medium density but the title slide leans airy
  for a "gridded" system.
- Leaning: **Specialized**. Lowercase dogma + primary-only palette gate it to
  design/workshop/maker contexts; flawless inside that gate. Owner hypothesis CONFIRMED.

## D15 — whiplash (Whiplash)

- Typography (pixels): Marcellus 400 left-aligned display (two lines, deep green);
  EB Garamond italic deck, no drop cap; tracked Marcellus caps context with bronze overline.
  Inscriptional/lyrical boundary holds. Matches spec.
- Ornament classes: offset bronze arch + rose inner echo; context overline; asymmetric
  fleuron divider (❦ + hairline + rose dot); right ornament field (rose halo ring,
  translucent fleuron bloom, three bronze curls); base tendril. All present.
- Fitness: strong for cultural keynotes, humanities lectures, heritage brand stories.
  No chart/table apparatus and arch composition resist data decks (correctly excluded).
- Coherence: strong — curves-only discipline holds (no straight-edged boxes/bars); left
  alignment on the alcove edge; rose rationed to echo/halo/dot.
- Defects: minor. (1) The 300px bloom glyph renders as a heart-ish fleuron — consistent with
  Garamond's ornament cut fallback, acceptable, but verify ❦ (U+2766) coverage on target
  machines per the doc's known gap. (2) No swash accent used (max one — optional, compliant).
- Leaning: **Specialized**. Nouveau register + no data apparatus = narrow cultural slot.
- Hypothesis note: ornament-dependent CONFIRMED — Marcellus-over-Garamond is pleasant but
  generic classical; the arch alcove + ornament field do the recognition work. Removing them
  would collapse the system into an unmarked editorial slide.

## D16 — tty-paper (Paper TTY)

- Typography (pixels): IBM Plex Mono exclusively — 700 session title as command output,
  400 body/comments, green 700 `$` prompt glyph, dim `#` comment subtitle, dim gutter
  numerals 01–12, inverted status bar, red 700 single failure keyword (NEEDS-REVIEW).
  Zero letter-spacing on reading sizes; single-voice discipline holds. Matches spec.
- Ornament classes: `$ read-postmortems --all` prompt + amber highlight span + 2px header
  underline; `===` / `---` ASCII rules; line-number gutter; block cursor after final line;
  status bar (`findings.txt · … · 01 / 01`); faint 8px character grid. All present.
- Fitness: strong for engineering postmortems, incident reviews, CLI launches, research
  readouts for technical teams. Correctly excludes luxury/emotional/fashion contexts.
- Coherence: strong — terminal-session fiction is complete and consistent; green/red/amber
  rationing holds (one red token, one amber span).
- Defects: minor. Lower ~45% of the canvas is empty paper below the `---` rule — the gutter
  stops at 12 and the session ends early. The spec's "generously leaded single session"
  permits this, but at 1920x1080 the void is large enough to read sparse rather than calm;
  inner-slide content (table/callout) would fill it — on a title-only render it is a leanness
  to note, not a violation.
- Leaning: **Specialized**. Mono-everywhere terminal fiction is audience-gated to technical
  teams by design. Owner hypothesis CONFIRMED.

## D17 — front-page (Front Page)

- Typography (pixels): Playfair Display 900 nameplate caps ("THE REVIEW") + full-width
  centered 92px wood headline; Lora standfirst with dark-red Playfair drop-cap "W";
  Libre Franklin 600 tracked caps for dateline row, kicker, folio heads, folio line.
  Three-role separation holds. Matches spec.
- Ornament classes: double-rule masthead frame + three-part dateline row; dark-red tracked
  kicker; red accent bar; three ruled folio cells with keyline dividers; double-rule folio
  close. Red rationed to exactly three appearances (kicker, drop cap, accent). All present.
- Fitness: strong for research readouts, annual reviews, policy briefings, impact reports —
  trust-through-newsprint. Correctly excludes playful/neon/informal contexts.
- Coherence: good — locked-chase rectilinear discipline holds; flat, sharp, ruled.
- Defects: moderate, content-driven. The middle ~40% of the page between the one-line
  standfirst and the column strip is empty newsprint — the spec promises "a full front,
  calmly locked" at high density, and thin content leaves a hole the system does not fill.
  Folio cells are also thin ("11 postmortems" / "Review discipline" / "Rushing to ship").
  Justification quality cannot be judged (no multi-line justified run renders). Recommend
  denser content-derived cells/decks as the fix, not a system change.
- Leaning: **Specialized**. Broadsheet gravity is use-case-gated; coherent but this render
  exposes thin-content fragility. Owner hypothesis CONFIRMED.

## D18 — memphis-squiggle (Squiggle Club)

- Typography (pixels): Archivo Black two-line title with two-layer teal-then-ink slap
  shadow; Nunito 400 deck; Archivo 700 tracked caps on yellow context pill, pink/teal chips,
  and ticker. Shout/round/stamp separation holds; no italics; no colored body text.
  Matches spec.
- Ornament classes: hollow outline "11" with purple echo (corner-anchored, clear of type);
  alternating-accent zigzag rules (under title, above ticker); tilted outlined chips
  ("11 REPORTS", "ONE LESSON"); −2° yellow context pill; confetti scatter (dots, rings,
  bars); full-bleed ink ticker with section mark + counter. All present.
- Fitness: strong for creative kickoffs, design-culture talks, playful launches, festival
  decks. Correctly excludes solemn/finance/legal/healthcare contexts.
- Coherence: strong — sticker-book depth (4–6px outlines, hard offsets, zero blur) holds;
  deliberate pink/purple and teal/yellow clashes; confetti keeps clear of type bounding
  boxes (nearest piece is the left-edge pink dot, clear of the title).
- Defects: negligible. Center-field confetti is sparser than the 10–14-piece front register
  suggests, leaving a calm middle — type sovereignty is preserved, so this reads as
  restraint, not a miss.
- Leaning: **Specialized**. Memphis party register is audience-gated; fully coherent inside it.

---

## Owner-hypothesis verdicts (from pixels, all confirmed)

- S13 (Ma / D13) ornament-dependent: CONFIRMED — void/rule/seal composition carries identity.
- S15 (Whiplash / D15) ornament-dependent: CONFIRMED — arch + ornament field carry identity.
- S14 (Dessau / D14) specialized: CONFIRMED — lowercase + primary dogma gates context.
- S16 (Paper TTY / D16) specialized: CONFIRMED — mono terminal fiction gates audience.
- S17 (Front Page / D17) specialized: CONFIRMED — broadsheet gravity gates use case.

## Tally (this part)

- Core: D10 (1)
- Specialized: D11, D12, D13, D14, D15, D16, D17, D18 (8)
- Experimental: none (0)
- Rework: none (0) — D17's thin-content void is a content-density caveat, not a system defect.
- Reject: none (0)

Coverage: 9/9 designs pixel-grounded (full-res PNG viewed + preview.md + design.md read each).
