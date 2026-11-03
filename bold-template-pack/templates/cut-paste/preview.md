# Cut & Paste Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/cut-paste/design.md`
- Preview card: `bold-template-pack/templates/cut-paste/preview.md`

## Selection Metadata

- Slug: `cut-paste`
- Tagline: Handmade typographic collage — shouting display type, taped scraps, tilted badges.
- Mood: handmade, loud, playful, irreverent
- Tone: zine-like, scrappy, warm, bold
- Formality: low
- Density: medium-high
- Scheme: light
- Best for: Postmortems with personality, creative reviews, zine-flavored talks, team retros, indie launches, and any deck that should feel assembled by hand on a studio table rather than exported from a dashboard.
- Avoid for: Formal financial disclosure, quiet luxury, institutional solemnity, contexts where rotated scraps and shouting type would undermine trust.

## Visual Snapshot

Cut & Paste is a typographic collage system built from paper scraps, tape strips, and shouting display type. Archivo Black headlines crash across the page in ink with a red first line, backed by solid teal offset blocks; the subtitle sits on a bordered white scrap with taped corners and a red offset shadow; the source line lands on a tilted yellow sticky note in Caveat hand. A red disc badge carrying the content numeral tilts over a giant outlined ghost word, and plus-mark confetti scatters across a faint dot grid. The palette is paper (#F4F1EA) with ink (#141414), red (#D7263D), teal (#1B9AAA), and yellow (#F4D35E).

Nothing aligns to a master grid — layers overlap at ±3 degrees, tape holds corners down, and offset color blocks fake torn edges. Yet the hierarchy never wobbles: shout first, scrap second, sticky third, badge as punctuation. The effect is a well-composed mess, closer to a pinned-up studio wall than a slide master.

## Preview Ingredients

- Palette: paper #F4F1EA; ink #141414; red #D7263D; teal #1B9AAA; yellow #F4D35E; scrap white #FFFFFF
- Typography: See full design doc after selection.
- Signature move: Two-tone shout — Archivo Black title with red first line over ink, backed by a rotated teal offset block.
- Signature move: Bordered white subtitle scrap with taped corners and a red offset block faking a torn edge.
- Signature move: Tilted yellow sticky note in Caveat hand carrying the source line, taped at the top.
- Signature move: Red disc badge with the content numeral, ink-ringed, tilted 8 degrees over the layout.
- Signature move: Giant outlined ghost word (a real title word) rotated behind everything at 14% ink.
- Signature move: Translucent tape strips pinning scrap corners, plus teal/red plus-mark confetti on a dot grid.

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
- Keep every rotation within ±3 degrees for text-bearing scraps (badge excepted) so collage never harms legibility.
- Do not read `template.html` for preview generation.
- Do not read other templates' `design.md` files.
- After the user picks this template for the full deck, read the full design doc before generating final slides.
