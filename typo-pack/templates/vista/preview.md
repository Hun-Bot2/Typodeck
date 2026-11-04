# Vista Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/vista/design.md`
- Preview card: `typo-pack/templates/vista/preview.md`

## Selection Metadata

- Slug: `vista`
- Tagline: Mid-century travel-poster optimism — stacked flat bands, ticket perforations, and a sunburst numeral badge.
- Mood: optimistic, adventurous, retro-modern, cheerful, kinetic
- Tone: inviting, bold, poster-like, mid-century
- Formality: low-medium
- Density: medium
- Scheme: mixed (deep teal bands against warm sand)
- Best for: Kickoffs, launches, roadmaps, journeys and progress narratives, education openers, city or place storytelling — anything that should feel like setting off somewhere.
- Avoid for: Somber disclosures, formal legal or financial reporting, minimalist luxury, dark cinematic drama, anything that needs quiet restraint.

## Visual Snapshot

A mid-century travel-poster presentation system built on stacked horizontal bands. Display type runs in DM Serif Display (a high-contrast modern serif with poster warmth) for headlines, paired with Outfit for body and widely tracked caps labels. The palette stacks deep teal (#0E3B43) sky bands against warm sand (#F6E7C1) with burnt orange (#E4572E) for the sunburst badge and key rules, plus a leaf green (#A8C686) for secondary fills. Bands are separated by dashed ticket-perforation rules; a circular sunburst numeral badge anchors the composition. Depth is flat poster space — solid fills, dashed rules, no shadows. The effect is a vintage railway poster crossed with a boarding pass.

Vista is a mid-century travel-poster presentation system. Its foundational premise is the band stack: every slide reads as sky band / headline band / rule / body band, each a flat solid fill with full-bleed edges. Layouts move top to bottom like a journey — teal sky, sand headline field, ticket dash, body ground — with a sunburst badge carrying the slide's key numeral. Corners are square, fills are opaque, and ornament is limited to perforations, badges, and thin keylines.

## Preview Ingredients

- Palette: deep-teal #0E3B43; sand #F6E7C1; burnt-orange #E4572E; leaf #A8C686; cream-white #FFFDF6
- Typography: See full design doc after selection.
- Signature move: Stacked band layout ({components.band}) — full-bleed flat bands in teal/sky, sand, and cream reading top-to-bottom like a poster horizon.
- Signature move: Ticket-stub dashed rules ({components.ticket-rule}) — 3px dashed perforation lines in burnt orange separating bands, with circular notch cutouts at the band edges.
- Signature move: Sunburst numeral badge ({components.sunburst}) — a burnt-orange circle with radiating dashed ring carrying the slide's key figure (e.g. an old-style serif numeral).
- Signature move: Poster-serif headlines ({typography.headline}) — DM Serif Display at large sizes, teal on sand or sand on teal, never letterspaced.
- Signature move: Tracked Outfit caps labels ({typography.label}) — 0.2em tracked uppercase kickers and context lines sitting on thin keyline rules.
- Signature move: Flat opaque fills only — zero shadows, zero gradients, zero blur; band contrast does all the separation work.

## International / CJK Preview Note

- If the preview uses Korean or other CJK text, keep CJK letter-spacing at 0, loosen line-height, and avoid uppercase transforms on CJK runs; tracked-caps labels switch to untracked CJK with the keyline rule carrying the label signal.
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
