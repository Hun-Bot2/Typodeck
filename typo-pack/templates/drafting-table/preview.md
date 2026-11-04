# Drafting Table Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/drafting-table/design.md`
- Preview card: `typo-pack/templates/drafting-table/preview.md`

## Selection Metadata

- Slug: `drafting-table`
- Tagline: Blueprint engineering sheets — white dimension lines on deep blueprint blue.
- Mood: precise, technical, industrial, confident
- Tone: engineering, procedural, exact, no-nonsense
- Formality: high
- Density: medium-high
- Scheme: dark
- Best for: Engineering reviews, architecture and infrastructure proposals, manufacturing specs, technical roadmaps, or any deck that wants every claim to feel measured, toleranced, and issued for review.
- Avoid for: Emotional storytelling, lifestyle branding, playful consumer launches, or luxury contexts where industrial drafting chrome would feel cold and bureaucratic.

## Visual Snapshot

A blueprint-drafting presentation system drawn in white linework on deep blueprint blue (#0F3D7A). Display type runs in Barlow Condensed caps — tall, exact, title-block lettering — over a fine white survey grid, while IBM Plex Sans carries body copy and IBM Plex Mono handles every dimension, tag, and revision mark. Dimension lines with tick ends measure the headlines, amber (#FFD166) flags the revision-critical marks, and a revision-block table anchors the footer like an issued drawing. The effect sits between a machine shop and a plan room — unmistakably technical, deliberately exact, and engineered to feel as if every slide passed inspection.

Drafting Table is a blueprint-drafting presentation system. Its foundational premise is the issued sheet: every slide is a drawing with a border frame, a measurement grid, dimension lines with tick ends, mono drawing tags, and a revision block. Layouts feel surveyed and toleranced — white linework, amber flags, and registration crosses keep the whole deck calibrated.

## Preview Ingredients

- Palette: blueprint #0F3D7A; line-white #FFFFFF; amber #FFD166; light-line #7FB3E8; pale-blue text #D6E6FA
- Typography: See full design doc after selection.
- Signature move: Condensed white caps headlines (Barlow Condensed 600) measured by dimension lines with tick ends and mono measurement tags.
- Signature move: Dual-density white survey grid on blueprint blue — 24px fine lines under 120px major lines.
- Signature move: Revision-block table footer on every slide — REV / DATE / SHEET cells in mono with amber revision letter.
- Signature move: Amber reserved strictly for revision-critical marks — the stamp, the revision letter, the accent rule, the tag squares.
- Signature move: Registration crosses (+) at the sheet corners and a full white border frame on every slide.
- Signature move: Rotated outline stamp chips (e.g. issued-for-review marks) breaking the grid at a slight angle.

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
