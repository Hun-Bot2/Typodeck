# Modulo Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/modulo-grid/design.md`
- Preview card: `typo-pack/templates/modulo-grid/preview.md`

## Selection Metadata

- Slug: `modulo-grid`
- Tagline: Neutral modular tile system in deep navy, amber, and silver on white.
- Mood: systematic, confident, engineered, crisp
- Tone: rational, precise, architectural, calm
- Formality: medium-high
- Density: medium
- Scheme: light
- Best for: Product and platform decks that want visible structure — system overviews, roadmaps, quarterly reviews, API or infra explainers, portfolio case studies where each section should feel like a snapped-in module.
- Avoid for: Contexts that need warmth, ornament, or narrative softness — memoir keynotes, luxury brand stories, playful community updates, anything where a visible grid would feel cold.

## Visual Snapshot

Modulo is a neutral modular-geometric presentation system built on a 4×4 tile grid with uniform 16px gutters. Display type runs in Sora ExtraBold, tight and geometric, paired with Inter for quiet body copy and Sora SemiBold caps for labels. The palette is restrained and architectural: paper white ground, deep structural navy (#14213D), a single signal amber (#FCA311), and cool silver (#E5E5E5) for secondary modules. Every region snaps to the tile module — headers open with a geometric tile strip, content cards sit on flat color blocks, and bullets are drawn as solid amber squares and deep-navy circles rather than glyphs. There are no gradients, no shadows, no rounded corners: depth comes only from flat color-block adjacency. The effect is a building plan that learned typography — systematic, legible, and deliberately unemotional.

Modulo's foundational premise is the module: one square unit, repeated on a 4×4 grid, that governs every card, band, and bullet on the slide. Layouts feel assembled from a construction kit — tile strips, color-block bands, and geometric bullets lock together with uniform gutters, and the single amber accent always marks the most important thing in view.

## Preview Ingredients

- Palette: white #FFFFFF; deep #14213D; amber #FCA311; silver #E5E5E5
- Typography: See full design doc after selection.
- Signature move: Geometric tile-strip headers — a row of 48px solid squares (amber, deep, silver) that opens every major region like a construction-kit barcode.
- Signature move: Geometric bullets only — solid amber squares for primary points, deep-navy circles for secondary points; no glyph bullets anywhere.
- Signature move: Full-bleed color-block bands — deep-navy or amber horizontal bands that carry labels, stats, or footer content edge to edge.
- Signature move: 4×4 modular card grid — every card occupies whole modules with uniform 16px gutters; nothing floats off-grid or overlaps.
- Signature move: Single-amber discipline — amber marks exactly one emphasis per region (one numeral, one rule, one bullet); everything else stays deep, silver, or white.

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
