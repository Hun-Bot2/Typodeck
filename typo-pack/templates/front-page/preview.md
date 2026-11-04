# Front Page Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/front-page/design.md`
- Preview card: `typo-pack/templates/front-page/preview.md`

## Selection Metadata

- Slug: `front-page`
- Tagline: A broadsheet front page set the morning the findings broke.
- Mood: sober, authoritative, classic, deliberate
- Tone: journalistic, factual, measured, confident
- Formality: high
- Density: high
- Scheme: light
- Best for: Research readouts, annual reviews, investigative findings, policy briefings, nonprofit impact reports, or any deck that earns trust by looking like the morning paper. Excellent when the speaker wants the audience to feel the news is already history.
- Avoid for: Playful product launches, neon nightlife brands, informal team retros, or any context where broadsheet gravity would feel pompous or slow next to the message.

## Visual Snapshot

Front Page is a newspaper broadsheet compressed into a title slide. A centered nameplate in Playfair Display caps sits under a double rule, flanked by a dateline drawn from the deck's real context line; the title lands as a full-width multi-column headline in Playfair 900; the subtitle runs as a justified standfirst deck with a red drop cap; and the lower third resolves into three ruled columns carrying content-derived folio cells (report count, lesson line, section mark). The ground is warm newsprint (#F7F4EC) with faint column keylines; ink is soft black (#141414); dark red (#8B0000) is rationed to the kicker, the drop cap, and one rule. Everything is rectilinear, ruled, and justified — the page holds its rectangles the way a locked chase holds type.

Front Page treats the slide as tomorrow's front page filed tonight. Headlines span all columns like real broadsheet wood type, decks justify edge to edge, column rules separate the lower strip, and a thin folio line closes the foot with page and section marks. Depth is entirely flat: no shadows, no blur, no rounded corners — authority comes from rules, measure, and restraint.

## Preview Ingredients

- Palette: newsprint #F7F4EC; ink #141414; dark red #8B0000; gray #6B6B6B; keyline #D9D2C2
- Typography: See full design doc after selection.
- Signature move: Nameplate masthead — centered Playfair caps plate under a double rule, with the real context line as the dateline.
- Signature move: Full-width wood-type headline — the title spans all three columns at 92px Playfair 900, centered, two lines with a balanced break.
- Signature move: Justified standfirst deck — the subtitle justifies edge to edge in Lora with a dark-red Playfair drop cap on the first letter.
- Signature move: Three ruled columns — the lower strip splits into three cells separated by 1px column rules, each cell derived from real deck content.
- Signature move: Double-rule frame lines — 3px+1px rule pairs open the masthead and close the folio, the pressman's signature.
- Signature move: Dark-red rationing — red appears exactly three times: kicker, drop cap, one rule accent.
- Signature move: Folio foot line — page mark, section mark, and dateline in tracked Libre Franklin caps close the page.

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
