# Dessau Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/dessau/design.md`
- Preview card: `typo-pack/templates/dessau/preview.md`

## Selection Metadata

- Slug: `dessau`
- Tagline: Bauhaus primary-color dogma — black bars, flat primaries, lowercase display.
- Mood: bold, rational, constructivist, playful-strict
- Tone: declarative, systematic, optimistic, modernist
- Formality: medium
- Density: medium
- Scheme: light
- Best for: Design-system launches, architecture and urbanism talks, education decks, workshop openers, manifestos — anywhere clarity should feel joyful and structural at once.
- Avoid for: Funerary or memorial tones, luxury softness, dense financial disclosure, or any context where primary colors would read as childish rather than principled.

## Visual Snapshot

Dessau is a Bauhaus-primary presentation system built on the Dessau school's visual grammar: white ground, heavy black bars, and the three primaries — red (#E30613), blue (#0066B3), yellow (#FFCC00) — deployed as flat unmodulated blocks. Display type is Jost (a Futura-descended geometric sans) set lowercase at all display sizes, a direct nod to the Bauhaus universal-lowercase experiments; body and wide-tracked caps labels stay in the same family for total typographic unity. Composition runs on a strict three-column grid with primary color bars keying each column, while triangle, circle, and square glyph ornaments punctuate headers and bullets. Everything is flat, everything aligns, nothing decorates without a structural job.

## Preview Ingredients

- Palette: white #FFFFFF; black #000000; red #E30613; blue #0066B3; yellow #FFCC00
- Typography: See full design doc after selection.
- Signature move: Lowercase-only display type in Jost 600 — headlines refuse capital letters on principle.
- Signature move: Heavy black bars (96px+) framing top and bottom of the slide like a poster press sheet.
- Signature move: Three vertical primary bars (red / blue / yellow) — red fronts the title column, blue/yellow pair into the glyph zone.
- Signature move: Triangle / circle / square glyph ornaments as bullets, header marks, and compositional anchors.
- Signature move: Single-family typography — Jost carries display, body, and labels; contrast comes from case, size, and color only.
- Signature move: Flat unmodulated color — no gradients, no shadows, no transparency; primaries hit at full saturation.

## International / CJK Preview Note

- CJK runs keep letter-spacing at 0 and never take uppercase transforms; the lowercase-display rule applies to Latin script only.
- Korean builds use Noto Sans KR across all roles (weights 400/600/700 carry the hierarchy); see the full design doc.
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
- Keep display type lowercase and primaries flat; never introduce gradients, shadows, or a second typeface.
