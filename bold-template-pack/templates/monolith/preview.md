# Monolith Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/monolith/design.md`
- Preview card: `bold-template-pack/templates/monolith/preview.md`

## Selection Metadata

- Slug: `monolith`
- Tagline: Full-bleed brutalist caps on raw black with a signal-orange strike.
- Mood: massive, confrontational, stark, uncompromising
- Tone: loud, blunt, declarative, physical
- Formality: low
- Density: low
- Scheme: dark
- Best for: Provocative keynotes, launch announcements, culture decks with a point of view, design-crit presentations, and any talk where the title should hit like a headline on a wall. Strong for postmortems that refuse to soften the finding.
- Avoid for: Contexts where nuance or care carries the message — healthcare, finance disclosures, memorial content, or anything that needs small type, dense tables, or a gentle register.

## Visual Snapshot

Monolith is a brutalist monumental presentation system: viewport-filling Anton caps cropped hard by the stage edge, bone-white on raw black, with one signal-orange strike per slide. Display type runs in Anton at 200–250px with tight 0.94 leading; body is small Inter; labels are tracked Anton caps. The palette is three flats — black ground, bone type, orange accent — with zero decoration: no rules, no grids, no shadows, no gradients, no rounded corners. A black footer band split from the ground by an 8px orange rule stacks the subtitle and context as raw blocks. The effect sits between a protest poster and a quarry wall — loud, cropped, physical, and engineered to be read from across the room.

Monolith's foundational premise is mass: the title is not placed on the slide, it is the slide. Layouts feel carved, not composed — a top strip, a wall of caps, and a banded footer are the entire vocabulary, repeated at maximum volume.

## Preview Ingredients

- Palette: black #0E0E0E; slab-black #000000; bone #F5F0E6; signal-orange #FF4D00; dim #8A8578
- Typography: See full design doc after selection.
- Signature move: Viewport-filling Anton caps at ~240px with 0.94 leading, hard-cropped by the stage edge.
- Signature move: One orange strike per slide — a single word, rule, or block in signal orange, never more.
- Signature move: Black footer band on slab black, split from the ground by an 8px orange rule.
- Signature move: Tight 24px stage margins — content runs edge to edge with almost no frame.
- Signature move: Raw stacked blocks — subtitle, context, and case count piled without dividers or chrome.
- Signature move: Tracked Anton caps labels (24px, +0.25em) for the top strip and footer context.

## International / CJK Preview Note

- If the preview uses Chinese or other CJK text, keep CJK letter-spacing at 0, loosen line-height, and avoid uppercase transforms on CJK runs.
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
