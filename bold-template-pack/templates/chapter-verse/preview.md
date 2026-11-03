# Chapter & Verse Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/chapter-verse/design.md`
- Preview card: `bold-template-pack/templates/chapter-verse/preview.md`

## Selection Metadata

- Slug: `chapter-verse`
- Tagline: Quiet editorial book craft — serif measure, drop cap, and folio rules on cream.
- Mood: literary, calm, deliberate, scholarly
- Tone: measured, warm, authoritative, unhurried
- Formality: high
- Density: low
- Scheme: light
- Best for: Research readouts, essays-as-decks, literary or academic talks, annual letters, strategy narratives, and any deck that should read like a well-set book chapter rather than a dashboard.
- Avoid for: Loud product launches, arcade or neon aesthetics, dense dashboards, contexts demanding high-energy display type or dark cinematic surfaces.

## Visual Snapshot

Chapter & Verse is a book-first presentation system: every slide behaves like a page from a finely printed volume. Titles set in Newsreader SemiBold sit on a centered 34em measure with generous 1.7 leading; a letterspaced oxblood chapter kicker opens each spread, and a hairline folio rule with a page mark closes it. The palette is paper and ink — cream ground (#FBF7EF), near-black warm ink (#1C1A17), oxblood accent (#7A2E2E), and tan hairlines (#B9A88F) — with no shadows, no gradients, and no decoration beyond rules, ornaments, and one drop cap.

Its rhythm is borrowed from book typography rather than web layouts: a running head names the work and date across the top, the title hangs in generous whitespace, the lede paragraph opens with an oxblood Newsreader drop cap, and the folio below carries the source line left and the page numeral right. Ornaments are restrained — a single diamond divider, a fleuron in the folio — and every rule is a 1px hairline. The effect is closer to opening a chapter than advancing a slide.

## Preview Ingredients

- Palette: cream #FBF7EF; ink #1C1A17; oxblood #7A2E2E; tan #B9A88F; smoke #6B6257 (derived muted ink for running heads)
- Typography: See full design doc after selection.
- Signature move: Newsreader drop cap in oxblood opens the lede paragraph — 3.1em, floated, never on headlines.
- Signature move: Letterspaced oxblood chapter kicker (`CHAPTER ONE` style) flanked by 120px hairline rules.
- Signature move: Folio footer — 1px tan rule, source line left, fleuron center, page numeral right.
- Signature move: Running head across the top — work left, date right, 14px tracked caps over a hairline.
- Signature move: Diamond ornament divider (hairline — ◆ — hairline) between title and lede, oxblood glyph on tan rules.
- Signature move: Centered 34em measure with 1.7 lede leading; matte paper, zero shadows, hairlines only.

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
- Set the lede with its oxblood drop cap and keep the chapter kicker, ornament divider, and folio intact.
- Do not read `template.html` for preview generation.
- Do not read other templates' `design.md` files.
- After the user picks this template for the full deck, read the full design doc before generating final slides.
