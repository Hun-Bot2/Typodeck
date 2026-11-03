# Maison Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/maison/design.md`
- Preview card: `bold-template-pack/templates/maison/preview.md`

## Selection Metadata

- Slug: `maison`
- Tagline: Restrained black-and-ivory luxury with hairline gold and a single italic accent.
- Mood: refined, quiet, exclusive, timeless
- Tone: elegant, understated, confident, editorial
- Formality: very high
- Density: low
- Scheme: dark
- Best for: Moments that should feel expensive through restraint — investor letters, brand keynotes, private-client reviews, gallery or atelier presentations, annual reflections where vast margins signal confidence.
- Avoid for: Contexts that need density, urgency, or playfulness — dashboards, technical deep-dives, hackathon demos, community updates, anything where information must arrive fast and loud.

## Visual Snapshot

Maison is a minimal-luxury presentation system built on a centered single column with vast gutters and a 20vh top margin. Display type runs in Cormorant Garamond — a light, high-contrast serif — in ivory on matte black (#0B0B0C), paired with Inter Light for quiet body copy and widely tracked Inter caps (+0.3em) for labels. A single muted gold (#C6A664) carries hairline rules, the context label, and exactly one italic accent word per display moment. Depth is nearly absent: matte alternating grounds, 1px hairline dividers, and generous line-height (1.3 display, 1.8 body) do all the work — no shadows, no blur, no ornament beyond the hairline. The effect is a private viewing room — one idea at a time, lit like couture.

Maison's foundational premise is restraint: one column, one accent word, one hairline at a time. Layouts feel curated rather than composed — the context label floats above a gold hairline, the headline breathes at oversized leading with a single italic word in gold, and the subtitle follows at a whisper before the closing rule.

## Preview Ingredients

- Palette: black #0B0B0C; ivory #F7F3EC; gold #C6A664; gray #6E6E6E
- Typography: See full design doc after selection.
- Signature move: Single italic accent word — exactly one word per display headline in Cormorant italic gold; everything else stays roman ivory.
- Signature move: Hairline gold rules — 1px centered rules (120px display rule, full-measure closing rule) as the only dividers in the system.
- Signature move: Oversized leading — display at 1.3 and body at 1.8 line-height, so whitespace glows between the lines.
- Signature move: Vast-margin centered column — 20vh top margin, 60ch measure, nothing outside the column except alternating matte grounds.
- Signature move: Tracked caps labels in gold — Inter Medium caps at +0.3em for context, kickers, and folio lines; the quiet hardware of the system.

## International / CJK Preview Note

- If the preview uses Korean or other CJK text, keep CJK letter-spacing at 0, loosen line-height, and avoid uppercase transforms on CJK runs.
- Use the full `design.md` CJK section after selection for exact font pairings and script-specific adjustments.

## Preview Rules

- Build exactly one title slide at 1920x1080 inside the fixed-stage model.
- Preserve the palette, type roles, surface rhythm, and decorative vocabulary described above.
- Use the user's real title/subtitle/context; do not copy demo slide content.
- The rendered preview must look like a real first slide, not a template-selection card.
- Never place internal workflow text on the slide: no `preview`, `generated from`, `preview.md`, `template`, `preset`, `style option`, `Option A/B/C`, file names, paths, or source-doc labels.
- Never place the template name or slug on the slide itself; mention it only in the chat message.
- Never place user requirement notes such as desired vibe, audience, or internal-use labels on the slide unless the user explicitly wants those exact words in the deck.
- Use only real deck content for visible chrome: deck title, real section title, date, author, company, page number, or genuine content phrases from the user material.
- Do not read `template.html` for preview generation.
- Do not read other templates' `design.md` files.
- After the user picks this template for the full deck, read the full design doc before generating final slides.
