# Paper TTY Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/tty-paper/design.md`
- Preview card: `typo-pack/templates/tty-paper/preview.md`

## Selection Metadata

- Slug: `tty-paper`
- Tagline: A sunlit terminal session printed on warm paper.
- Mood: precise, nerdy, calm, methodical
- Tone: dry, technical, honest, understated
- Formality: medium-low
- Density: medium
- Scheme: light
- Best for: Engineering postmortems, incident reviews, CLI tool launches, research readouts, documentation-adjacent talks, or any deck where the speaker wants terminal credibility without a dark hacker cliché. Great for teams that live in the shell and want slides that feel like their own notes.
- Avoid for: Luxury brand storytelling, emotional keynotes, fashion or lifestyle pitches, or any context where monospace-everywhere would read as cold or unpolished rather than precise.

## Visual Snapshot

Paper TTY is a light-mode terminal console rendered as a printed page. Every glyph on the slide is IBM Plex Mono — there is no second face — so hierarchy is built entirely from weight (400 vs 700), dimming (full ink vs 55% gray), amber selection-highlight spans, and spacing. The ground is warm paper (#F4F1EA) with a faint fixed character grid; a dimmed line-number gutter runs down the left edge; ASCII rules (`===`, `---`) separate regions instead of drawn borders. Content reads as one typed session: a `$` prompt line, the title as large bold command output, the subtitle as a dimmed `#` comment, and a solid block cursor parked after the last line. Green (#007A33) marks success states and the prompt glyph; red (#B00020) is reserved for the single failure keyword in any run. The effect is a calm lab notebook crossed with a well-kept dotfiles repo — technical, quiet, and exact.

Paper TTY treats the slide as an 80-column terminal frozen mid-session. The text measure never exceeds 66 characters, line numbers tick in the gutter in 8px steps, and every rule is a typed character rather than a CSS border. Depth is nearly flat: the only elevations are the amber highlight span behind key phrases and a single 2px ink underline under the session header.

## Preview Ingredients

- Palette: paper #F4F1EA; ink #111111; dim #6B675E; green #007A33; red #B00020; amber-hi #FFE9A8
- Typography: See full design doc after selection.
- Signature move: Single-face mono system — IBM Plex Mono 400/700 carries display, body, and labels; hierarchy comes from weight, dimming, and highlight spans, never from a second family.
- Signature move: Dollar-prompt session framing — every slide opens with a `$` command line in green, so the title reads as the output of a typed command.
- Signature move: Block-cursor terminator — a solid static-visible 0.6em ink block parked after the final line marks where the session is still live.
- Signature move: ASCII rules instead of borders — `===` double rules and `---` single rules typed in dim ink separate header, body, and status regions.
- Signature move: Amber selection-highlight spans — key phrases sit on #FFE9A8 rounded-2px spans as if the presenter just selected them with a mouse.
- Signature move: Line-number gutter — dimmed right-aligned numerals every line at 55% ink, fixed 72px column, 8px baseline rhythm.
- Signature move: Red single-failure keyword — exactly one red token per slide (the cost, the error, the count) so the eye lands on what broke.

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
