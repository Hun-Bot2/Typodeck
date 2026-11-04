# New Wave Static Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/new-wave-static/design.md`
- Preview card: `typo-pack/templates/new-wave-static/preview.md`

## Selection Metadata

- Slug: `new-wave-static`
- Tagline: Swiss-punk cover slashed with neon diagonals and cropped giants.
- Mood: loud, kinetic, irreverent, electric
- Tone: brash, confrontational, playful, urgent
- Formality: low
- Density: medium-high
- Scheme: light
- Best for: Launch announcements, culture decks, music and media stories, provocative research findings, student showcases, rally-the-team memos — anywhere the headline should land like a poster on a construction wall.
- Avoid for: Solemn institutional disclosures, healthcare or finance compliance, memorial or ceremonial material, or any audience that needs calm before signal.

## Visual Snapshot

New Wave Static is a Swiss grid that got vandalized on purpose. A white ground carries a flush-left Archivo headline at poster scale, slashed by magenta and cyan diagonal bars at a fixed 24 degrees; a black masthead bar and a black footer band clamp the composition top and bottom. One headline word flips into Newsreader italic magenta for a deliberate high/low clash, while a giant outline numeral (11) and a 45-degree rotated kicker chip crowd the right margin like wheat-pasted extras. Slash dividers — black bar into skewed magenta and cyan tails — separate headline from subtitle, and the context line sits as a reversed black chip with a cyan signal dot. Nothing is centered, nothing is rounded, nothing whispers: the system runs on hard crops, clashing scale jumps, and neon-on-black voltage.

## Preview Ingredients

- Palette: paper-white #FFFFFF; signal-black #000000; static-magenta #FF00A8; wave-cyan #00C2FF
- Typography: See full design doc after selection.
- Signature move: Fixed 24-degree neon slash bars (magenta 46px, cyan 26px, black 12px) cut the white ground on every cover.
- Signature move: One headline word flips to Newsreader italic magenta — a serif intruder inside the grotesque shout.
- Signature move: 45-degree rotated kicker chip in reversed black/cyan crowds the margin like a pasted sticker.
- Signature move: Giant cropped outline numeral (5px magenta stroke, half off-canvas) anchors the composition at 560px.
- Signature move: Skewed slash-divider (black bar + magenta + cyan tails) separates headline from subtitle.
- Signature move: Black masthead and footer bands clamp the poster; the footer pairs a magenta numeral with a cyan page chip.

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
