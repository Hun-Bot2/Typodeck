# Gridline Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/gridline-swiss/design.md`
- Preview card: `bold-template-pack/templates/gridline-swiss/preview.md`

## Selection Metadata

- Slug: `gridline-swiss`
- Tagline: Asymmetric Swiss grid with a red rule and a giant index numeral.
- Mood: precise, confident, editorial, rational
- Tone: clear, direct, unsentimental, institutional
- Formality: high
- Density: medium
- Scheme: light
- Best for: Research briefings, strategy reviews, quarterly readouts, policy decks, and any talk where the argument should feel engineered rather than performed. Works for data-led keynotes, board updates, and technical postmortems that want clarity without decoration.
- Avoid for: Contexts where warmth or playfulness carries the message — children's content, lifestyle branding, celebratory keynotes, or anything that needs organic, handmade texture.

## Visual Snapshot

Gridline is an asymmetric Swiss presentation system built on a visible 12-column grid with flush-left, ragged-right typography. Display type runs in Archivo ExtraBold, set large and tight against the left margin, paired with Inter for body and captions and Archivo SemiBold caps for kickers and labels. The palette is strict matte white and near-black ink with a single signal red reserved for rules, kickers, and the index numeral's baseline. A faint hairline column grid shows through the white ground, content occupies columns 1–8, and a light-gray rail on columns 9–12 carries a giant issue numeral. Depth is flat: hairline black rules and one 6px red rule do all the structural work; shadows, gradients, and rounded corners do not exist. The effect sits between a Müller-Brockmann poster and a printed research annual — rational, airy, and deliberately unadorned.

Gridline's foundational premise is the exposed grid: the 12-column hairline scaffold stays visible on every surface, so alignment reads as content rather than decoration. Layouts feel typeset, not designed — a ragged-right headline block, a red rule, a gray index rail, and a hairline footer are the entire vocabulary, repeated with discipline.

## Preview Ingredients

- Palette: white #FFFFFF; ink #111111; signal-red #E30613; rail-gray #F2F2F2; muted #6B6B6B
- Typography: See full design doc after selection.
- Signature move: Exposed 12-column hairline grid printed faintly on the white ground — alignment as visible content.
- Signature move: Giant index numeral (Archivo 800, ~380px) parked in the gray rail, fully contained with ~40px insets.
- Signature move: One 6px signal-red rule per slide — never more, never thinner — under the kicker or title block.
- Signature move: Flush-left ragged-right headlines in Archivo 800 with tight -0.01em tracking; centering is forbidden.
- Signature move: Red kicker line (Archivo 600 caps, +0.18em tracking) paired with an 18px solid red square bullet.
- Signature move: Hairline 2px black footer rule with small-caps context left and a paginated index right (`01 / 24`).

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
