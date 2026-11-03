# Coin-Op Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/coin-op/design.md`
- Preview card: `bold-template-pack/templates/coin-op/preview.md`

## Selection Metadata

- Slug: `coin-op`
- Tagline: Green-phosphor CRT arcade cabinet glowing in a near-black void.
- Mood: retro-tech, nocturnal, electric, playful
- Tone: arcade, underground, demoscene, lo-fi
- Formality: low
- Density: medium
- Scheme: dark
- Best for: Talks that want a playable after-hours energy — game dev postmortems, retro computing, hardware hacking, CTF writeups, indie tool launches, demo nights where the deck should feel like a cabinet that takes quarters.
- Avoid for: Contexts that need daylight legibility or institutional calm — board finance reviews, healthcare guidance, legal disclosures, luxury or editorial storytelling where glow and scanlines would fight the message.

## Visual Snapshot

Coin-Op is a green-phosphor arcade presentation system built around a centered cabinet frame on a near-black void (#060A06). Display type runs in VT323 — a tall terminal face with authentic CRT rhythm — glowing phosphor green (#33FF66) through layered blurred text-shadows, paired with IBM Plex Mono for body copy and Silkscreen pixel caps for labels. A single amber (#FFB000) carries the cabinet frame, marquee ticker, and coin-slot rules against bone (#E8E4D8) secondary text. Depth comes only from soft glow: blurred phosphor halos, a scanline overlay, and a vignette — never hard offset shadows. The effect is a lone arcade cabinet humming in a dark room — attract-mode typography, patiently glowing.

Coin-Op's foundational premise is the cabinet: one centered frame, one glowing screen, one marquee. Layouts feel like attract-mode screens — a scrolling context ticker up top, a huge glowing headline in the well, coin-slot rules down the rails, and a blinking block cursor waiting for input below.

## Preview Ingredients

- Palette: void #060A06; phosphor #33FF66; amber #FFB000; bone #E8E4D8
- Typography: See full design doc after selection.
- Signature move: Phosphor glow display — VT323 headlines in #33FF66 with triple-layer blurred halos (8px / 32px / 90px), never hard shadows.
- Signature move: Arcade-cabinet frame — 4px amber outer rail plus 2px phosphor inner rail with corner screws, centering a 66ch text well.
- Signature move: Marquee context ticker — amber band scrolling the deck context endlessly across the top of the cabinet.
- Signature move: Coin-slot rules — vertical amber slot glyphs running down both cabinet rails as the system's divider language.
- Signature move: Scanline + vignette CRT stack — a repeating horizontal scanline overlay and radial vignette on every surface, plus a blinking block cursor.

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
