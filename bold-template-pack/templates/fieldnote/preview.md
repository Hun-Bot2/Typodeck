# Fieldnote Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/fieldnote/design.md`
- Preview card: `bold-template-pack/templates/fieldnote/preview.md`

## Selection Metadata

- Slug: `fieldnote`
- Tagline: Eco kraft field journal with stamped badges and hand annotations.
- Mood: earthy, curious, warm, handmade
- Tone: observant, friendly, honest, grounded
- Formality: low
- Density: medium
- Scheme: light
- Best for: Field research, sustainability stories, community projects, workshops, ethnographic findings, and maker or classroom decks that want to feel gathered by hand rather than generated — kraft, stamps, and margin notes included.
- Avoid for: Formal finance, legal, luxury, or cinematic contexts where handwriting and kraft texture would read as unserious rather than warm.

## Visual Snapshot

An ecologist's field journal opened to its title page. Titles set in Zilla Slab — a sturdy humanist slab with typewriter roots — sit loose and left-aligned on warm kraft, with Karla carrying body text and Caveat handwriting annotating the margins in clay and leaf green. A rotated stamp badge marks the study number, a hand-drawn clay rule underscores the title, CSS leaf-glyph bullets dot the keyword row, and a dashed margin column holds a tally card counting the postmortems. The texture is fibrous kraft with a soft top-light wash — no gradients-as-color, no chrome, nothing glossy. The effect sits between a nature notebook and a community zine: gathered, stamped, and underlined by a human hand.

Fieldnote is an eco kraft presentation system. Its foundational premise is the gathered page: every slide behaves like a journal spread where printed structure (slab title, grotesque body, stamped badges) meets handwritten response (margin notes, arrows, tallies) on fibrous kraft. Rotation is measured in single degrees — enough to feel placed by hand, never enough to feel scattered.

## Preview Ingredients

- Palette: kraft #E9DCC8; kraft-deep #DCCDAF; moss-ink #2E3B2E; leaf #5A7A4E; clay #B4552D
- Typography: See full design doc after selection.
- Signature move: Rotated stamp-style bordered badges — double-rule clay outlines at -3deg marking study numbers and verdicts.
- Signature move: Caveat hand-annotation margins — clay observations, curved SVG arrows, and checkmarked takeaways in a dashed margin column.
- Signature move: CSS leaf-glyph bullets — two-corner rounded squares in leaf green — dotting keyword and finding rows.
- Signature move: Hand-drawn clay underscore beneath the title — a thick rounded rule tilted half a degree off level.
- Signature move: Tally-card margin modules — bordered leaf cards with oversized slab numerals counting corpus items.
- Signature move: Fibrous kraft ground — hairline fiber striping plus a soft top-light wash, with dashed ink separators instead of solid rules.

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
