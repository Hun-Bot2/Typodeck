# Iron Press Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/iron-press/design.md`
- Preview card: `typo-pack/templates/iron-press/preview.md`

## Selection Metadata

- Slug: `iron-press`
- Tagline: Victorian letterpress gravity — centered serif formality inside a double-rule frame on aged paper.
- Mood: stately, antique, deliberate, solemn, crafted
- Tone: formal, literary, authoritative, old-press
- Formality: high
- Density: low-medium
- Scheme: light
- Best for: Annual reports with heritage, legal or policy addresses, historical subjects, formal lectures, commemorative decks — anything that should feel printed, bound, and permanent.
- Avoid for: Playful startups, fast-moving product launches, casual team updates, neon tech aesthetics, anything that needs to feel light, quick, or disposable.

## Visual Snapshot

A Victorian letterpress presentation system built on pressed-ink formality. Display type runs in IM Fell English (a weathered old-style serif with antique character) for headlines and small caps-flavored labels, paired with EB Garamond for body and italic accents. The palette sits on aged paper (#F1E9D6) with near-black ink (#1F1A14) and oxblood (#7B1E1E) reserved for rules, ornaments, and emphasis. Every slide is enclosed in a rigid double-rule border frame; depth comes only from the impression of ink on paper (tone contrast, never shadow). The effect is a title page from a 19th-century volume — centered, symmetrical, ornamented with pilcrows and fleurons.

Iron Press is a Victorian letterpress presentation system. Its foundational premise is the printed page as a fixed artifact: centered formal composition, symmetrical ornaments, double-rule frames, and small caps hierarchy. Layouts hold a single centered measure with generous top and bottom margins; curved or scattered arrangements do not exist. Hierarchy is expressed through size, caps, rules, and oxblood accents — weight contrast is minimal because the Fell faces ship a single weight.

## Preview Ingredients

- Palette: aged-paper #F1E9D6; ink #1F1A14; oxblood #7B1E1E; gray #4A4A4A; paper-deep #E4D9BE
- Typography: See full design doc after selection.
- Signature move: Double-rule border frame ({components.frame}) — outer 3px ink rule + inner 1px oxblood rule with a 12px gap, inset 40px from the stage edge on every slide.
- Signature move: Centered small-caps hierarchy ({typography.smallcaps}) — IM Fell English uppercase with 0.22em tracking for kickers, context lines, and section marks.
- Signature move: Pilcrow and fleuron ornaments ({components.ornament}) — ¶ and ❦ glyphs in oxblood marking section breaks and flanking the page mark.
- Signature move: Ornamental drop cap ({typography.dropcap}) — a 4-line IM Fell English initial in oxblood opening the body measure on text slides.
- Signature move: Pressed-ink flatness — zero shadows, zero rounded corners, zero gradients; emphasis comes from oxblood ink and rule weight alone.
- Signature move: Single-measure centered column — one centered text block at ~56ch with symmetrical hairline rules above and below the headline.

## International / CJK Preview Note

- If the preview uses Korean or other CJK text, keep CJK letter-spacing at 0 (the Fell small-caps tracking must not apply to CJK runs), loosen line-height, and avoid uppercase transforms on CJK runs.
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
