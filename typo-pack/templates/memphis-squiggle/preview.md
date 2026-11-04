# Squiggle Club Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/memphis-squiggle/design.md`
- Preview card: `typo-pack/templates/memphis-squiggle/preview.md`

## Selection Metadata

- Slug: `memphis-squiggle`
- Tagline: A confetti-throwing postmodern party on warm cream.
- Mood: playful, loud, joyful, irreverent
- Tone: cheeky, bold, friendly, high-energy
- Formality: low
- Density: medium-high
- Scheme: light
- Best for: Creative-team kickoffs, design-culture talks, playful product launches, festival and workshop decks, or any talk that wants the room grinning before the first sentence. Perfect when the speaker's energy is the message.
- Avoid for: Solemn financial disclosures, healthcare guidance, legal briefings, or any context where confetti and clashing pastels would read as unserious rather than joyful.

## Visual Snapshot

Squiggle Club is Memphis postmodernism at full volume: a warm cream ground (#FFF6E9) scattered with thick-outlined confetti chips, zigzag rules, dots, and squiggle ribbons in pink, teal, yellow, and purple. Display type is Archivo Black — huge, tight, ink-black — floating in scattered blocks over the confetti; body runs in round friendly Nunito; labels stamp in tracked Archivo 700 caps on tilted chips. A giant hollow outline numeral (drawn from the deck's real count) anchors one corner, and a hand-drawn-feeling zigzag SVG rule underscores the title. Everything has a thick ink outline or a hard offset shadow; nothing is hairline, nothing is muted, nothing sits on a grid for long.

Squiggle Club treats the slide as a party table after the poppers went off. Blocks tilt ±3 degrees, chips overlap type edges, confetti drifts behind and in front of content, and color clashes are deliberate — pink against purple, teal against yellow. Depth is flat sticker-book: hard offset shadows in solid ink, zero blur, outlines 4–6px everywhere.

## Preview Ingredients

- Palette: cream #FFF6E9; ink #111111; pink #FF6B9D; teal #4ECDC4; yellow #FFE66D; purple #6C5CE7
- Typography: See full design doc after selection.
- Signature move: Archivo Black display blocks — massive tight ink headlines with a hard 6px offset shadow, never stroked, never gradient.
- Signature move: Zigzag glyph rules — hand-drawn-feeling SVG zigzag dividers in alternating pink/teal/purple under titles and above footers.
- Signature move: Bold outline numerals — giant hollow count numerals (text-stroke ink, transparent fill) anchoring corners, drawn from real deck numbers.
- Signature move: Clashing pastel-neon chips — tilted pill and square chips in pink/teal/yellow/purple with 4px ink outlines carrying labels and context.
- Signature move: Confetti scatter field — absolutely positioned dots, triangles, bars, and rings in all four accents, behind and around content.
- Signature move: ±3deg playful tilts — chips, badges, and rules rotate slightly; body text never tilts, display blocks tilt at most 2deg.
- Signature move: Thick-outline sticker depth — every shape carries a 4–6px ink outline plus a hard 6px ink offset shadow, zero blur.

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
