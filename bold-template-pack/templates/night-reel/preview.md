# Night Reel Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/night-reel/design.md`
- Preview card: `bold-template-pack/templates/night-reel/preview.md`

## Selection Metadata

- Slug: `night-reel`
- Tagline: Noir cinematic title card with letterbox bars and one red moment.
- Mood: cinematic, nocturnal, tense, restrained
- Tone: dramatic, confident, minimal, suggestive
- Formality: medium
- Density: low
- Scheme: dark
- Best for: Keynotes, premieres, launches, case-study reveals, and founder or brand stories that want a film-opening hush — one giant title fading up out of black with a single deliberate accent.
- Avoid for: Dense data decks, procedural manuals, playful or pastel stories, and contexts where low-density black surfaces would read as empty rather than dramatic.

## Visual Snapshot

A noir film title card held inside CinemaScope letterbox bars. Titles set in Bebas Neue — a tall condensed sans that reads like credits on black — sit low in the frame over a near-black spotlight that vignettes to pure black at the edges, with body lines in featherweight Inter. The composition is a low third: a single blood-red rule, a widely tracked kicker, the towering caps title, and one quiet subtitle, framed top and bottom by letterbox bars carrying only the research brand and a scene count. Nothing else competes — the red rule is the only saturated pixel on the slide. The effect is a held breath before the feature starts: high contrast, vast darkness, and exactly one accent.

Night Reel is a noir cinematic presentation system. Its foundational premise is the frame: every slide is a shot composed inside letterbox bars, and every element obeys credit-sequence hierarchy — condensed caps for display, light grotesque for dialogue, smoke gray for metadata. The single red accent is budgeted like a plot beat: one per slide, never more.

## Preview Ingredients

- Palette: black #000000; white #F5F5F5; blood-red #C1121F; smoke #8A8A8A; bar-line #2A2A2A
- Typography: See full design doc after selection.
- Signature move: CinemaScope letterbox bars top and bottom with hairline inner rules, carrying only brand metadata and a scene count.
- Signature move: Low-third title block — red rule, tracked kicker, towering Bebas caps title, single light-weight subtitle — anchored to the bottom of the frame.
- Signature move: Exactly one blood-red accent per slide (the title rule); everything else stays black, white, or smoke.
- Signature move: Spotlight vignette ground — a radial near-black glow that fades to pure black — plus a faint scanline-grade shimmer at 1% opacity.
- Signature move: Credit-sequence type hierarchy — condensed caps display, Inter light body, near-invisible dark-gray reel metadata in the bars.
- Signature move: Generous negative space above the title — at least half the frame stays empty black so the title lands like an opening credit.

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
