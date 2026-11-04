# Atelier Noir Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/atelier-noir/design.md`
- Preview card: `typo-pack/templates/atelier-noir/preview.md`

## Selection Metadata

- Slug: `atelier-noir`
- Tagline: High-fashion runway drama — porcelain serif on black with a giant issue numeral.
- Mood: dramatic, elegant, editorial, nocturnal
- Tone: couture, confident, restrained, gallery-grade
- Formality: high
- Density: low
- Scheme: dark
- Best for: Fashion and design portfolios, gallery exhibitions, luxury brand stories, award submissions, or any deck that wants the runway treatment — vast margins, giant numerals, and whisper-quiet chrome.
- Avoid for: Dense data reports, procedural manuals, playful community decks, or engineering reviews where vast empty margins would read as missing content.

## Visual Snapshot

A high-fashion editorial presentation system set in porcelain on near-black (#111111). Display type runs in Italiana — a tall hairline roman — with one italic accent word per headline, while Montserrat Light carries body copy and widely tracked Montserrat caps handle the quiet chrome. A giant cropped issue numeral looms behind the content at whisper opacity, hairline vertical dividers structure the full-bleed rhythm, and a single deep-wine (#4A0E18) bar provides the only color event. The effect sits between a runway show program and a gallery wall text — unmistakably couture, deliberately sparse, and engineered to feel as if every slide was art-directed at 2am in Paris.

Atelier Noir is a high-fashion editorial presentation system. Its foundational premise is the spread: every slide is a full-bleed magazine spread with oversized margins, one porcelain serif statement, a looming issue numeral, and hairline dividers doing all the structural work. Layouts feel tailored and nocturnal — vast black margins, a single wine accent, and tracked-out caps keep the whole deck on the runway.

## Preview Ingredients

- Palette: noir #111111; porcelain #FAF8F5; gallery-gray #999999; soft-line #C9C9C9; wine #4A0E18
- Typography: See full design doc after selection.
- Signature move: Giant cropped issue numeral (Italiana, ~780px) looming at 13% opacity behind the content, bled off the right edge.
- Signature move: Porcelain Italiana headlines with exactly one italic accent word per statement — never more, never none.
- Signature move: Hairline vertical dividers structuring the full-bleed spread instead of boxes, cards, or panels.
- Signature move: Oversized runway margins — 150px+ gutters with a rotated margin note running down the left edge.
- Signature move: A single deep-wine bar as the only color event per slide — beside the kicker, never repeated.
- Signature move: Widely tracked Montserrat caps (+0.3em) for all chrome, set in gallery gray against the black.

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
- After the user picks this template for the full deck, read the full design doc before generating final slides.
- Never place user requirement notes such as desired vibe, audience, or internal-use labels on the slide unless the user explicitly wants those exact words in the deck.
- Use only real deck content for visible chrome: deck title, real section title, date, author, company, page number, or genuine content phrases from the user material.
- Do not read `template.html` for preview generation.
- Do not read other templates' `design.md` files.
