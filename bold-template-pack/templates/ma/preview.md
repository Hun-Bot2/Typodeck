# Ma Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/ma/design.md`
- Preview card: `bold-template-pack/templates/ma/preview.md`

## Selection Metadata

- Slug: `ma`
- Tagline: Japanese zen minimalism — one text cluster, vast warm-white emptiness.
- Mood: quiet, contemplative, restrained, precise
- Tone: hushed, confident, editorial, wabi-sabi
- Formality: high
- Density: minimum
- Scheme: light
- Best for: Keynotes that want gravity without noise, research findings, design critiques, investor letters, memorial or retrospective talks — anywhere a single idea should land in silence.
- Avoid for: Dense data readouts, playful team updates, dashboards, or any deck that needs high-energy color and crowded supporting chrome.

## Visual Snapshot

Ma is a Japanese zen-minimal presentation system built around the concept of negative space as an active design material. Roughly seventy percent of every slide stays empty warm white (#F8F6F0); a single text cluster sits left, breathing downward, set in Shippori Mincho (a refined Mincho serif for display) with Zen Kaku Gothic New carrying body and tracked labels. Ink is sumi black (#2B2B2B), ornament is nearly absent: one hairline vertical rule, tiny stone-gray margin marks, a single oversized numeral, and one small shu-red (#A63D2F) seal block stamped like a hanko. There are no cards, no shadows, no gradients, no grids on display. The effect is a gallery wall with one object on it — the quietest system in the collection, asking the audience to slow down and read.

## Preview Ingredients

- Palette: warm-white #F8F6F0; sumi #2B2B2B; shu-red #A63D2F; stone #D8D2C4
- Typography: See full design doc after selection.
- Signature move: Seventy-percent emptiness — one text cluster anchored left, nothing competing anywhere else on the canvas.
- Signature move: Single 2px vertical sumi rule running full slide height, offset from the left edge, the only structural line on the slide.
- Signature move: One oversized numeral (01) in stone gray at display scale, passing behind the title's opening lines, counting without shouting.
- Signature move: One small shu-red seal block stamped like a hanko — the single saturated moment on the slide.
- Signature move: Tiny stone-gray margin registration marks at the corners, like printer crop marks, whispering craft.
- Signature move: Mincho serif display against Gothic tracked micro-labels — the classic Japanese editorial pairing, never reversed.

## International / CJK Preview Note

- CJK runs keep letter-spacing at 0, use looser line-height (display 1.3+, body 1.9+), and never take uppercase transforms.
- Korean builds pair Noto Serif KR (display) with Noto Sans KR (body/labels); Japanese builds stay in Shippori Mincho + Zen Kaku Gothic New.
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
- Keep seventy percent of the canvas empty; never fill the void with extra panels, icons, or filler rules.
