# Gilded Line Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/gilded-line/design.md`
- Preview card: `bold-template-pack/templates/gilded-line/preview.md`

## Selection Metadata

- Slug: `gilded-line`
- Tagline: Symmetrical art-deco cover in black lacquer, champagne, and gold.
- Mood: glamorous, ceremonial, poised, timeless
- Tone: refined, confident, celebratory, measured
- Formality: high
- Density: low-medium
- Scheme: dark
- Best for: Annual reports, award announcements, heritage-brand stories, gala and launch evenings, executive summaries, investor letters — anywhere symmetry and ornament signal that the occasion matters.
- Avoid for: Dense technical documentation, developer tooling, casual team updates, or any deck where ornament would read as friction rather than ceremony.

## Visual Snapshot

Gilded Line stages the title slide as a 1920s title card: a black-lacquer ground (#0F0E0C) carrying a centered champagne panel (#F5EFE0) inside double gold rules, with mirrored diamond-and-hairline ornaments flanking both sides. Display type is Cinzel in tracked capitals — a classical Roman inscriptional face — while Jost carries an italic subtitle with quiet warmth. A rising fan of teal rays crowns the panel, diamond glyphs (◆ ◇) punctuate every divider, and the footer stamps the issue mark (№ 11 · ANNO MMXXVI) like a printer's colophon. Teal (#1F4E5F) appears only in small ceremonial roles — fan rays, kicker, context line — so the gold-on-black glamour never cools. Every element is centered and mirrored; asymmetry does not exist in this system.

## Preview Ingredients

- Palette: lacquer-black #0F0E0C; champagne #F5EFE0; gold #D4AF37; deep-gold #8C6D2B; deco-teal #1F4E5F; warm-gray #3D3830
- Typography: See full design doc after selection.
- Signature move: Double-rule gold frames at two scales — outer lacquer frame with rotated-diamond corners plus champagne panel with outline-offset inner rule.
- Signature move: Fan-line header of seven rising rays (six teal, one central gold) crowns every cover like a sunrise crest.
- Signature move: Diamond glyph dividers (◆ ◇) split gold hairlines instead of dots, dashes, or bullets.
- Signature move: Strict bilateral symmetry — mirrored side ornaments, centered type, mirrored rules; nothing sits off-axis.
- Signature move: Footer colophon stamps the issue mark (№ 11 · ANNO MMXXVI) as tracked Cinzel capitals.
- Signature move: Champagne panel inverts the ground so the headline reads as an illuminated inscription on dark lacquer.

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
