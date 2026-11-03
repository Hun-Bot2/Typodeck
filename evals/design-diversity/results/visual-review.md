# Typodeck Design-Diversity Visual Review (Blind, Pixels-Only)

- Reviewer: independent visual QA (did not create these designs).
- Sources viewed: `evals/design-diversity/screenshots/D01.png` … `D27.png` (all 27 viewed as images; every verdict below is from a viewed image).
- Blind protocol: no template docs, direction matrix, or selection index opened. Design IDs below are screenshot labels only.
- Required PRIMARY strings checked verbatim in every shot (case/small-caps styling accepted as the same words):
  - Title: `The Hidden Cost of Rushing to Ship`
  - Subtitle: `What 11 postmortems taught us about review discipline`
  - Context: `Typodeck Research · November 2026`
- No Korean-locale shots exist in the D01–D27 set; all 27 carry the English strings.

## (1) Per-design verdict table

| id | verdict | typography | hierarchy | readability | contrast | clipping | alignment |
|----|---------|------------|-----------|-------------|----------|----------|-----------|
| D01 | pass | Grotesk poster sans, strong weight steps, tracked micro-labels | Title > subtitle > meta rail is immediate | Fully legible at a glance | Black/red on white, excellent | None; full-bleed rules intact | Flush-left grid with aligned footer rule |
| D02 | pass | Monospace procedural doc with pill/badge accents | Title dominates; checklist rail is secondary | Dense but every line legible | Ink on dotted paper, tags pop | None | Left column + right rail align to shared rules |
| D03 | pass | Giant condensed caps, single accent word | Display-first; footer strip carries sub/context | Display + footer both legible | Cream/orange on black, strong | None; right void is intentional | Left-anchored stack, footer rule full width |
| D04 | pass | Centered old-style serif, red drop-cap deck | Eyebrow > title > ornament > deck > footer | Fully legible | Near-black/red on cream, good | None | Centered stack on hairline header/footer |
| D05 | pass | Flat grotesk banner + taped paper cards | Banner title > taped subtitle > sticker context | All three strings legible | Red/black on cream/teal, good | None; tape overlaps are collage idiom | Playful tilt is deliberate; footer sticker anchored |
| D06 | pass | Scholarly serif + italic deck + marginalia | Title > deck > footnote; margin notes tertiary | Legible; large calm whitespace | Ink on white, footnote gray still fine | None | Left text block, right margin notes aligned |
| D07 | pass | Bold geometric sans + tracked labels | Title left, stat tiles right, bars frame | Fully legible | Navy/amber on white, strong | None | Tile grid + top/bottom bars align cleanly |
| D08 | pass | Pixel/CRT mono, amber marquee, green display | Display title central; marquee is frame | Title + subtitle legible; marquee is texture | Green/amber on black, good | Marquee text crops at frame edges (ticker idiom; primary strings intact elsewhere) | Centered symmetric cabinet layout |
| D09 | pass | High-contrast serif, one-line centered title, gold italic accent | Eyebrow > title > sub > footer rule | Fully legible | White/gold on black, excellent | None | Strictly centered, footer rule balanced |
| D10 | pass | Sans display + mono data labels + status pills | Title > audit table left; case-log panel right | Dense but each row legible | Navy/white/green pills, good | None | Two-column split with aligned rows |
| D11 | pass | Small-caps inscriptional serif + italic deck | Card title central; ornaments frame | Fully legible | Ink on cream card, gold frame decor | None | Centered plaque, symmetric ornaments |
| D12 | pass | Black grotesk + italic accent words | Title > deck > context chip; art is backdrop | Title/deck legible over clean left zone | Black/magenta/cyan on white, strong | Art bleeds off right/bottom edges (intentional); no text cut | Left text column aligned; footer bar full width |
| D13 | pass | Quiet serif + tracked small caps + seal | Title > sub > context > seal | Fully legible | Ink on warm paper, faint ghost numeral decor | None; ghost "01" layers behind title by design | Left-aligned column off single vertical rule |
| D14 | pass | Lowercase geometric sans, primary-shape accents | Title > sub left; shape column right | Fully legible | Black on white, primaries decorative | None | Left text block; right shapes in clean column |
| D15 | REJECT (duplicate of D04) | Centered old-style serif + drop-cap deck | Same centered stack as D04 | Legible on its own merits | Green/bronze on cream, fine | None | Centered in arch frame |
| D16 | pass | Light editor mono with line numbers | Command > title > comment verdict > status bar | Fully legible | Ink/gray/red on grid paper, good | None | Code-line left rhythm; status bar full width |
| D17 | pass | Masthead serif + blackletter-ish headline + drop deck | Nameplate > kicker > headline > deck > footer | Fully legible | Ink/red on newsprint, good | None | Centered masthead; footer columns rule-aligned |
| D18 | pass | Chunky 3D display with cyan offset + pills | Title > zigzag > sub > context pill | Fully legible | Black/cyan/pink on cream, strong | None | Left-anchored playful scatter, grounded footer |
| D19 | pass | Lowercase text serif + pill tags + stat panel | Title > deck > tags left; "11" panel right | Fully legible | Slate on white/mint, soft but sufficient | None | Left column + right card share cap line |
| D20 | pass | Old-style serif + fully italic deck + heart ornament | Eyebrow > title > divider > deck | Fully legible | Ink on parchment, good | None | Centered inside double frame |
| D21 | pass | Bracketed serif title + tracked band labels | Band context > title band > timeline > deck | Fully legible; title/deck separated by design | Cream/teal/rust, good | Timeline dots bleed at canvas edges (intentional) | Centered bands, symmetric header/footer |
| D22 | pass | Serif article title + abstract box + data column | Title > abstract > keywords; figure/table right | Fully legible | Ink/blue on white, good | None | Two-column article grid with ruled header |
| D23 | pass | Uniform condensed caps block + tracked kicker | Kicker > display > paragraph sub > footer | Fully legible | White/gray/red on black, strong | None | Left-anchored block, hairline header/footer |
| D24 | pass | Slab serif + stamp + handwritten marginalia | Title > deck > tags left; stat card right | Fully legible | Forest/rust on tan paper, good | None | Left column + dashed divider + right card |
| D25 | pass | Rounded bold sans + highlight-word title + pills | Card title > deck > context footer | Fully legible | Navy/magenta/cyan on white card, good | Gradient frame bleeds at viewport (intentional) | Centered card; pills left-aligned inside |
| D26 | pass | Technical condensed caps + mono annotations | Display title > deck > title block | Fully legible | White on blueprint grid, strong | None; border + dimensions fully drawn | Left-anchored drafting sheet with title block |
| D27 | pass | High-contrast Didone + thin sans deck | Title > deck left; ghost numeral backdrop | Fully legible | White/gray on near-black, excellent | None; ghost "11" fully inside frame | Left column on hairline grid + footer rule |

## (2) Pairwise duplicate hunt (all 27, pixels only)

Method: compared compositional grammar (layout architecture, type treatment, signature devices), not just palette or mood. Recolor-only or same-grammar pairs count as duplicates.

### Duplicate cluster found: { D04, D15 } — SAME GRAMMAR

- Shared identity: warm cream ground; centered old-style serif two-line title; subtitle opened by a giant drop-cap "W"; thin rule-and-ornament divider; small red/bronze accents; small-caps context line. The drop-cap-W deck plus centered serif stack IS the identity, and it appears in both.
- Differences (container-level only): D04 uses a chapter-page frame (hairline header/footer bands, "chapter" eyebrow, red accents, bottom numeral); D15 uses a double-line arch frame (bronze/rose rules, green ink, heart ornament, centered context). An arch-for-rules container swap does not create a new identity.
- Ruling: duplicates. Keep D04 (the stronger chapter archetype), reject D15.

### Lead-flagged pairs — deliberate verdicts (IDs only, still blind)

- D05 / D18: DIFFERENTIATED. D05 is a scrapbook/tape collage (flat banner, taped paper cards, round red badge, dotted ground, ghost word backdrop). D18 is Memphis 3D display type (extruded block letters, zigzag rules, outline numerals, geometric confetti, dark footer bar). Shared playful register only. Both kept.
- D06 / D22: DIFFERENTIATED. D06 is sparse marginalia minimalism (footnote apparatus, margin notes, vast whitespace). D22 is a full journal article (abstract box, keywords, bar figure, data table, footnotes). Same scholarly family, different grammars. Both kept.
- D07 / D14: DIFFERENTIATED. D07 is a tile/block grid deck (2×2 stat tiles, navy/amber blocks, top strip + bottom bar). D14 is a primary-shape composition (red bar, blue/yellow columns, triangle/circle/square, lowercase sans). Both kept.
- D08 / D16: DIFFERENTIATED. D08 is a dark arcade/CRT cabinet (pixel display type, amber marquee, neon frame). D16 is a light code-editor page (line numbers, grid paper, comment lines, status bar). Different grounds, type, and apparatus. Both kept.
- D09 / D27: DIFFERENTIATED (closest non-cluster call). Both are dark minimal serif covers, but D09 is a centered symmetric medallion (gold eyebrow, one-line centered title, single footer rule) while D27 is an asymmetric hairline grid (left-aligned two-line Didone, giant ghost "11", column rules, rotated margin rail). Compositional grammar differs. Both kept.
- D04 / D15 / D20: D04≡D15 DUPLICATES (see cluster above). D20 is DIFFERENTIATED from both: framed parchment plaque, no drop cap, fully italic centered deck, eyebrow context with flanking rules, heart ornament, darker tan ground. D20 kept; D15 rejected.
- D19 / D25: DIFFERENTIATED. D19 is muted minimal (lowercase text serif, quiet pill tags, mint stat panel, airy white). D25 is a saturated kawaii card (rounded bold sans, highlight-word title, star field, gradient frame, pill badges). Both kept.

### Other near-miss pairs examined and cleared

- D03 / D23 (black condensed display): different line architecture — D03 staggers three lines with a mid-title accent word + full orange footer rule; D23 uses a tracked kicker + uniform two-line block + paragraph subtitle + hairline footer. Kept both.
- D03 / D26 (condensed caps): D26 is a blueprint drafting sheet (grid, dimensions, stamp, title block) — wholly different grammar. Kept both.
- D04 / D17 / D15 (drop-cap "W" motif): the red/green "W" device recurs in D04, D15, and D17. D17 is nevertheless a newspaper (nameplate, dateline strip, kicker, column footer), so it is not in the duplicate cluster — but the motif repetition is flagged below as an advisory.
- D11 / D20 (framed classical plaque): D11 is a black-and-gold deco frame with small-caps inscriptional title; D20 is a tan parchment double frame with italic deck. Different frames, palettes, and title treatments. Kept both.
- D12 / D18 / D05 / D25 (playful cluster): four distinct grammars — neon diagonal punk (D12), Memphis 3D (D18), tape scrapbook (D05), kawaii SaaS card (D25). All kept.
- D02 / D10 / D16 / D22 / D26 (document/technical family): field manual vs ops dashboard vs code editor vs journal article vs blueprint — five distinct grammars. All kept.
- D01 / D07 / D14 (grid/geometric family): Swiss poster rail vs tile deck vs primary shapes — distinct. All kept.
- D06 / D13 / D19 (quiet minimal family): marginalia vs wabi-seal vs pastel pills — distinct. All kept.

## (3) Reject list

### REJECT — D15: same-grammar duplicate of D04
- Visual reason: repeats D04's full typographic identity pixel-for-pixel in grammar — centered old-style serif title on cream, giant drop-cap "W" opening the subtitle, rule-and-ornament divider, small-caps context. The arch frame and green/bronze recolor are container-level swaps, not a new identity. In a diversity set, D04 and D15 read as the same template with a different border.
- Required fix direction (no edits made by reviewer): change the signature devices, not the palette — remove the drop-cap "W" deck device (e.g., set the subtitle as a centered italic deck or a left-aligned column), alter the title treatment (different serif cut, size contrast, or alignment), and let the arch frame carry a genuinely different stack (e.g., asymmetric or top-anchored composition). Alternatively retire D15 and keep D04 as the sole classical-chapter archetype.

### Advisory (not rejects)
- Motif repetition: the giant drop-cap "W" opening the subtitle appears in D04, D15, and D17. Since D15 is rejected, D04 and D17 still share the device across different grammars (chapter vs newspaper) — acceptable, but a future pass could vary one.
- Intentional edge crops (passed, noted): D08 marquee ticker ends, D12 art bleed, D21 timeline dots, D25 gradient frame. All are bleed idioms; no PRIMARY text is cut in any shot.
- Case-styled titles (passed, noted): D02/D03/D11/D23/D26 render the title in caps/small-caps and D14/D19 in lowercase. Words are verbatim; case is a style transformation. No action.

## (4) Forbidden-text + verbatim check

- Forbidden text (design IDs, template names/slugs, option labels, harness text, lorem ipsum, internal notes): NONE visible in any of the 27 shots. All visible microcopy is in-fiction editorial chrome (issue numbers, section labels, figure/table captions, status pills, drafting annotations, stamps, badges). The single CJK seal character on D13 is a decorative research seal, not template text.
- PRIMARY verbatim per shot (title / subtitle / context all present; T=title-case, C=caps/small-caps styling, L=lowercase styling):
  - D01 T/T/T-punct verbatim. D02 C/T/T verbatim. D03 C/T/T verbatim. D04 T/T/T verbatim. D05 T/T/T verbatim. D06 T/T/T verbatim. D07 T/T/T verbatim. D08 T/T/T verbatim (context also in marquee + footer). D09 T/T/T verbatim. D10 T/T/T verbatim. D11 C(small-caps)/T/T verbatim. D12 T/T/T verbatim. D13 T/T/T verbatim. D14 L/T/T verbatim. D15 T/T/T verbatim. D16 T/T-as-comment/T verbatim. D17 T/T/T verbatim. D18 T/T/T verbatim. D19 L/T/T verbatim. D20 T/T/T verbatim. D21 T/T/T verbatim. D22 T/T/T verbatim. D23 C/T/T verbatim. D24 T/T/T verbatim. D25 T/T/T verbatim. D26 C/T/T verbatim. D27 T/T/T verbatim.
- Result: 27/27 shots show the full PRIMARY content with no forbidden text.

## (5) Verdict

**REJECT WITH 1 REJECT** (D15 — same-grammar duplicate of D04; fix direction in section 3).
