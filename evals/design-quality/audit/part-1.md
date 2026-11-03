# Typography Audit — Part 1 (D01–D09)

Auditor: typography auditor (read-only except this report). All verdicts grounded in
full-res 1920×1080 screenshots (`evals/design-diversity/screenshots/D0X.png`) plus each
template's `preview.md` + `design.md`. Ornament classes: essential / structural /
semantic / controlled / unnecessary.

---

## D01 — Gridline (gridline-swiss)

**Typography verdict.** Roles clean: red Archivo 600 caps kicker (+square bullet, y≈75) →
6px red rule (y≈133, content cols only) → Archivo 800 flush-left ragged headline
2 lines → Inter 34px single-line subtitle (y≈565). Rail: 400px Archivo 800 "01"
(x≈1190–1710, y≈140–480) over red baseline (y≈570) + 3 caps meta rows with hairline
dividers. Footer: 2px rule, caps context left, "01 / 24" right. Scale ladder
400/118/34/20/19 disciplined; alignment flush-left + rail; wrapping balanced.
No defects in type itself.

**Ornaments.** Kicker square: essential. 6px red rule: structural. Rail panel:
structural. Index numeral: semantic (issue identity). Meta dividers: controlled.
Exposed 12-col grid: essential. Footer rule: structural. Nothing unnecessary.

**Content-fitness / coherence.** Excellent for a research-postmortem title; system
renders exactly as specified. High coherence.

**Defects (pixel evidence).**
1. Numeral not cropped by rail edge (spec: "cropped by the rail's inner edge") —
   fully contained with ~40px insets. Minor spec deviation, no visual harm.
2. Dead zones: left white field y≈620–1030 (~400px tall) and rail bottom below
   "NOVEMBER 2026" (~90px gray) are empty. Acceptable Swiss air, but rail meta
   ends early enough that the rail reads bottom-light.

**Owner hypothesis S01 ("number overwhelms"): REFUTED.** The "01" is the largest
glyph mass but sits in a bounded ~27%-width rail; the headline + red rule own the
left ~60% and win first fixation. Hierarchy intact.

**Leaning: Core.** Canonical Swiss discipline, broadly reusable, no rework needed.

---

## D02 — Field Manual (field-manual)

**Typography verdict.** Three-voice discipline holds: Archivo 700 caps title (2 lines,
92px) + Plex Sans 30px subtitle + Plex Mono for all tags (doc header, `§2.1`,
`A-1..3`, `FIG. 01`, `NOTE 01`, footer). Step rows (bordered numeral square +
uppercase label + dashed leader + tag) align left on a ruled rhythm. Right column:
figure box with check rows, blue NOTE box, amber chips. Scale/alignment/wrapping
all correct per spec.

**Ornaments.** Doc frame + double rule: structural. Amber chips (×2): semantic.
Numeral squares / leaders / check rows: structural. Figure + NOTE boxes:
structural. Dotted-grid paper: essential. Approval strip (PREPARED/DATE/SIGN):
semantic — slightly theatrical on a title slide but on-fiction; controlled.

**Content-fitness / coherence.** Strong procedural voice for a postmortem-as-manual.
High coherence; composition balance is the weak point (below).

**Defects (pixel evidence).**
1. Right column collapses halfway: NOTE box ends y≈550, lone "UNREVIEWED CHANGES"
   chip at y≈585, then ~360px of empty dotted paper to the footer. Chip has no
   attached content — a warning pointing at nothing.
2. Left column void: approval strip ends y≈745, then ~200px empty paper before
   the footer rule (y≈940). A "dense" system showing two large voids.
3. Check-row leader lengths vary row to row (ragged tag column near x≈1690);
   cosmetic only.

**Leaning: Specialized.** Superb for runbooks/SOPs/audits; wrong register outside
procedural contexts. Consider filling or trimming the right-column void.

---

## D03 — Monolith (monolith)

**Typography verdict.** Shout/whisper split executed: Anton tracked-caps strip
(orange square + label, y≈40) → Anton mega wall ~240px 3 lines
("THE HIDDEN COST / OF RUSHING / TO SHIP", "RUSHING" orange strike) →
slab-black band with 8px orange rule, Inter 32px subtitle left, Anton tracked
context + dim count right. Alignment flush-left/right; no center anywhere. Good.

**Ornaments.** Title wall: essential. Orange strike word: semantic. Band + 8px
rule: structural. Top strip + square bullet: structural. Dim case count:
controlled. Orange budget (wall word + band rule + strip bullet) matches spec.

**Content-fitness / coherence.** Powerful provocation register for an uncompromising
postmortem. Coherent; monumentality under-delivers (below).

**Defects (pixel evidence).**
1. Wall fills only x≈5–1000 (~52% width); region x≈1000–1900, y≈150–850 is
   unbroken black void. Spec demands "viewport-filling" + hard edge-crop; no
   crop occurs and the wall reads large, not monumental. Step size up until a
   hard crop bites.
2. "OF" (bone, ~1 glyph wide) strands at the head of line 2 ahead of the orange
   "RUSHING" — preposition orphaned across the color boundary. Tolerable, but a
   "COST OF / RUSHING TO / SHIP" break would keep the strike word clean.

**Leaning: Specialized.** Single-register impact machine; unusable for dense or
nuanced content, unmatched for manifestos.

---

## D04 — Chapter & Verse (chapter-verse)

**Typography verdict.** Book contract honored: 14px tracked smoke running head over
tan hairline → oxblood kicker + 120px flanks → Newsreader 600 100px centered
2-line title → ◆ divider → Newsreader 31px/1.7 lede, left-aligned in centered
780px measure, oxblood 3.1em floated "W" → folio (tan rule, source left, ❦
center renders correctly, oxblood "1" right). Serif-read / sans-navigate roles
never cross. Four-oxblood-mark budget respected.

**Ornaments.** Running head + folio: structural. Kicker + flanks: essential.
Ornament divider: controlled (sanctioned title→lede bridge). Drop cap: semantic
(book voice) verging on controlled here (see hypothesis). Fleuron + page mark:
controlled/semantic. Nothing unnecessary.

**Content-fitness / coherence.** Lovely essayistic postmortem cover; no data
capacity. Very high coherence.

**Defects (pixel evidence).**
1. Drop cap splits "What" into "W"+"hat" with a ~14px gap across a 2-line lede;
   the cap's height (~95px) rivals the whole lede block (~110px). Mechanically
   correct, proportionally loud for a subtitle-length text.
2. Title enjambment strands lowercase "of" at the start of line 2 ("The Hidden
   Cost / of Rushing to Ship"). Common in centered titles; mildly awkward.
3. Voids y≈100–280 and y≈730–960 are doctrine (low density), correctly
   proportioned — not defects, recorded for the whitespace comparison with D06.

**Owner hypothesis S04 ("drop cap"): CONFIRMED WITH NUANCE.** The cap is
well-set (float, color, alignment all correct), but on a two-line lede it
dominates rather than opens — the device wants a paragraph. Recommend keeping
the cap but only where the lede runs ≥3 lines, else set the lede plain.

**Leaning: Specialized.** Superb narrow book voice; needs the long-form content
it was built for.

---

## D05 — Cut & Paste (cut-paste)

**Typography verdict.** Three voices correct: Archivo Black two-tone shout (red
line 1 on paper band, ink below on teal slab at −1.2°) → Libre Franklin 500
subtitle on bordered/taped/red-offset scrap (+1.6°) → Caveat 600 source line on
tilted yellow sticky. Badge "11" (real content numeral) in ink-ringed red disc
at 8°. Text tilts within ±3° (badge/ghost excepted); legibility preserved.

**Ornaments.** Teal slab + red swash: structural. Scrap border/tape/offset:
essential. Sticky + tape: essential. Badge: semantic. Ghost word "SHIP"
(genuine title word): controlled. Plus confetti: controlled (spec-sanctioned,
pure decor). Dot grid: essential ground. Nothing unnecessary per doctrine.

**Content-fitness / coherence.** High coherence to collage doctrine; fit depends
on tone — right for a scrappy retro, wrong for a solemn finding.

**Defects (pixel evidence).**
1. Ghost "SHIP" (~400px outline, −6°) is ~70% occluded by slab/scrap; visible
   fragments (notably the "S" curve around x≈840–1100, y≈340–570) read as
   smudge behind the scrap rather than depth. Shift right or scale up so at
   least one full letterform clears the layers.
2. Left tape strip (x≈200–290, y≈350–450) kisses the top of the scrap text;
   translucency saves it, but clearance is ~0px.
3. Composition top-heavy: everything textual sits y<550 except the sticky
   note; bottom-left quadrant (x<1100, y>550) is empty paper. One more
   paste-on low-left would balance the wall.

**Leaning: Specialized.** Disciplined chaos with a real genre (zines, retros,
creative reviews). Not Experimental — the render is controlled.

---

## D06 — Seminar (seminar)

**Typography verdict.** Argument/apparatus split correct: navy § 1 marker +
gray date → Source Serif 700 88px flush-left 2-line title → italic 78%-ink
lede with sup ¹ → 160px footnote rule + 17px footnote → gray page numeral.
Margin: two Inter 17px notes ("¹ Typodeck Research…" + "§ 11 postmortems…")
with hanging indents, top-aligned to title cap height. Roles/scale/alignment
exemplary.

**Ornaments.** § markers: semantic. Sidenotes + hanging citation: essential.
Sup markers: structural. Footnote rule + footnote: structural/essential. Page
numeral: structural. Nothing unnecessary — the sparsest ornament set in the batch.

**Content-fitness / coherence.** Ideal lecture/thesis register. High coherence
except the keying defect below.

**Defects (pixel evidence).**
1. Duplicate apparatus: margin note "¹ Typodeck Research, November 2026" and
   footnote "¹ Typodeck Research · November 2026" share marker ¹ with near-
   identical text — two referents, one key, zero added information. The margin
   citation and footnote must be distinct notes.
2. Content ends at y≈555 (footnote); margin ends y≈265; everything below is
   blank white to the numeral at y≈1010 — ~500px of void, over half the slide.

**Owner hypothesis S06 ("whitespace"): CONFIRMED AS RISK, DOCTRINAL BY DESIGN.**
The void is the system working as specified ("sparse but apparatus-rich"), but
on a projected title slide ~55% blank white risks reading as unfinished. The
apparatus is too thin to earn the air here — fixing defect 1 (a genuinely
informative second margin note) would help justify it.

**Leaning: Specialized.** Academic niche excellence; not a general-purpose cover.

---

## D07 — Modulo (modulo-grid)

**Typography verdict.** Roles correct: 6-tile strip + Sora caps kicker with 12px
amber chip → Sora 800 ~96px flush-left 2-line hero → Inter deep-soft subtitle
with amber square bullet → 2×2 module grid (amber stat "11 POSTMORTEMS", deep
"REVIEW/DISCIPLINE", silver "RUSHING/TO SHIP", white date module) → deep footer
band with 6px amber rule, amber "01 / 01" left, white context right. Faint 240px
silver module grid on white. Scale/alignment clean.

**Ornaments.** Tile strips (header + white-module echo): essential / controlled.
Kicker chip + bullets: structural. Amber stat module: semantic (only informative
module). Deep/silver/white modules: structural as grid proof, content
unnecessary (see defect 1). Footer band + rule: structural. Module grid:
essential.

**Content-fitness / coherence.** Good bones for system/product decks; the cover
composition wastes its signature element on repetition. Medium-high coherence.

**Defects (pixel evidence).**
1. Verbatim repetition inside the grid: silver module "RUSHING / TO SHIP" =
   headline line 2 word-for-word; deep module "REVIEW / DISCIPLINE" = subtitle
   tail. Two of four modules carry zero new information; the grid decorates
   instead of structuring. Modules must carry stats/labels not already on slide.
2. Single-amber discipline strained: amber appears in 2 strip tiles + kicker
   chip + subtitle bullet + full amber module + 2 deep-module bullets + footer
   rule — the grid region alone holds three amber moments (module + 2 bullets).
3. Deep-module bullets render as amber circles — a pragmatic hybrid (spec's
   deep-navy circle would vanish on deep ground; module-card-deep's "amber
   bullet" pairing covers it). Accept; consider speccing explicitly.
4. Hero enjambment strands lowercase "of" at line 2 start (same as D04).

**Owner hypothesis S07 ("blocks"): CONFIRMED.** The 2×2 blocks are the slide's
weakest element — compositionally fine (right ~30% balances the hero) but
content-free, restating headline/subtitle words. Fix is editorial (real module
content), not geometric.

**Leaning: Core.** Neutral modular system with broad reuse; fix module content
rules and it can serve as a default.

---

## D08 — Coin-Op (coin-op)

**Typography verdict.** Three mono voices correct and uncrossed: Silkscreen caps
amber marquee (scrolling context) → slot-flanked "11 POSTMORTEMS" label →
VT323 phosphor hero ~110px centered 2 lines with triple halo → dim "+ + +"
ticks → Plex Mono bone subtitle → phosphor-dim micro footer with blinking
block cursor. Cabinet frame (4px amber outer + 2px phosphor inner, 16px void
gap), 4 corner screws, 3 slots per rail, scanlines + vignette all present.
Centered attract-mode rhythm throughout.

**Ornaments.** Phosphor glow: essential. Cabinet frame + screws: essential /
controlled. Marquee: semantic. Coin slots: structural (the divider language).
Scanlines + vignette: essential. Cursor: semantic. Divider ticks: structural.
Nothing unnecessary.

**Content-fitness / coherence.** Perfect for retro/game-dev postmortems; absurd
anywhere needing daylight legibility. Very high coherence.

**Defects (pixel evidence).**
1. Marquee frozen mid-scroll: left edge reads "YPODECK RESEARCH" (clipped "T",
   x≈78). Animation artifact in a static capture — but static export ships
   exactly this; freeze state must show a clean first frame per spec's own
   reduced-motion rule.
2. "11 postmortems" triple-told: slot label "11 POSTMORTEMS" + subtitle "What
   11 postmortems taught us…" (+ marquee context adjacent). Demote the slot
   label to a non-count eyebrow (e.g. "CASE FILES").
3. Hero bloom slightly softens "Rushing" bowls at full-res; readable, no action
   — recorded as the known VT323/scanline tradeoff.

**Leaning: Specialized.** Fully coherent narrow niche (retro/tech after-hours).
Keep exactly one such slot in the lineup.

---

## D09 — Maison (maison)

**Typography verdict.** Restraint register executed: gold Inter caps +0.3em
context label → 120px gold display rule → Cormorant 500 ~80px centered
single-line hero with exactly one italic gold accent ("Hidden") → Inter Light
24px subtitle → full-measure 55% closing rule → folio ("N° 11 · REVIEW
DISCIPLINE" left, "01 / 01" right). Roles/leading/tracking all per spec;
accent-word choice ("Hidden") is the right editorial pick.

**Ornaments.** Context label + display rule: structural. Accent word: semantic
(the system's signature). Closing rule + folio + counter: structural /
controlled. No other ornament exists. Nothing unnecessary.

**Content-fitness / coherence.** Ideal luxury/private-briefing register; thin
vessel for substantive postmortem content. High coherence.

**Defects (pixel evidence).**
1. Shallow hierarchy + lower void: content occupies y≈220–550; the lower
   ~400px (y≈550–950) is unbroken black. Combined with single-line 80px hero,
   thin Cormorant strokes, and a quiet gold accent, first fixation is weak —
   the slide is calm to the point of flat at projection distance.
2. "Review discipline" doubled: subtitle tail ("…about review discipline") +
   folio ("REVIEW DISCIPLINE"). Rephrase the folio to a non-echoing content
   phrase.
3. Folio spread (far-left + far-right at y≈985) vs spec's centered folio with
   counter at its right end — acceptable interpretation, no action.

**Owner hypothesis S09 ("weak focus"): CONFIRMED WITH NUANCE.** Focus is weak
relative to the batch, but it is the system's stated trade (restraint as
luxury), not a rendering failure. The hero's single line, centered symmetry,
and modest gold-on-black contrast give the eye no strong landing point. For a
title slide this is borderline; do not dim further, and consider one size-step
larger hero.

**Leaning: Specialized.** Luxury niche, disciplined; keep for private/exclusive
registers only.

---

## Batch summary

| DID | Slug | Leaning | One-line reason |
|-----|------|---------|-----------------|
| D01 | gridline-swiss | Core | Disciplined Swiss cover; numeral balances, doesn't overwhelm |
| D02 | field-manual | Specialized | Superb procedural voice; right column empties halfway |
| D03 | monolith | Specialized | Impact register works; wall under-fills, no hard crop |
| D04 | chapter-verse | Specialized | Book voice lovely; drop cap too loud for a 2-line lede |
| D05 | cut-paste | Specialized | Controlled collage; ghost word over-occluded |
| D06 | seminar | Specialized | Exemplary apparatus; duplicate ¹ key + 55% void |
| D07 | modulo-grid | Core | Neutral reusable grid; modules repeat headline words |
| D08 | coin-op | Specialized | Coherent retro niche; marquee freeze clips "T" |
| D09 | maison | Specialized | Disciplined luxury; hierarchy shallow, lower void |

Hypotheses: S01 refuted; S04/S06/S07/S09 confirmed with nuance (all four are
doctrine-or-editorial issues, none are rendering failures). No design needs
Rework (structural overhaul) or Reject; the two Core leanings (D01, D07) are
the batch's general-purpose candidates.
