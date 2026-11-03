# Seminar Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/seminar/design.md`
- Preview card: `bold-template-pack/templates/seminar/preview.md`

## Selection Metadata

- Slug: `seminar`
- Tagline: Quiet academic text-and-margin design — serif argument, sidenotes, footnote rule.
- Mood: scholarly, calm, precise, honest
- Tone: plain, careful, erudite, understated
- Formality: high
- Density: low-medium
- Scheme: light
- Best for: Research seminars, lectures, working papers, thesis defenses, policy briefs, and any deck whose authority comes from plain well-structured text rather than decoration.
- Avoid for: Product launches, neon or playful aesthetics, dashboards, contexts that need loud display type or cinematic surfaces.

## Visual Snapshot

Seminar is an academic text system built on a two-column page: a 66-character serif argument column beside a wide sidenote margin. Source Serif 4 sets the title and lede at left; the margin carries hanging citations and content sidenotes in small Inter type keyed by superscript markers; a single short footnote rule closes the argument with the source line. The palette is restrained — white ground (#FFFFFF), ink (#222222), navy (#1F3A5F) for markers and the section sign, gray (#8A8A8A) for quiet notes — on plain white with one rule and no shadows.

Nothing decorates and everything aligns: the § 1 section marker opens the page, the date sits opposite, sidenotes align to the title's cap height, and the page numeral closes the foot. Hierarchy comes from the margin apparatus itself — markers, hanging indents, and the footnote rule — the way a handout earns trust through structure rather than styling.

## Preview Ingredients

- Palette: white #FFFFFF; ink #222222; navy #1F3A5F; gray #8A8A8A; hairline #E3E3E3 (derived rule tint)
- Typography: See full design doc after selection.
- Signature move: Wide sidenote margin with hanging citations and content sidenotes in 17px Inter.
- Signature move: Single 160px footnote rule closing the argument, source line set with a superscript marker.
- Signature move: § section markers in navy Source Serif — § 1 opens the page, § keys margin notes.
- Signature move: Superscript cross-markers (navy) tying margin notes to the argument column.
- Signature move: 66-character serif measure at left, title 88px flush-left, lede in italic serif.
- Signature move: Plain white ground, one rule, quiet gray notes — zero shadows, zero fills, zero chrome.

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
- Keep margin notes drawn strictly from real content phrases and keep the single footnote rule intact.
- Do not read `template.html` for preview generation.
- Do not read other templates' `design.md` files.
- After the user picks this template for the full deck, read the full design doc before generating final slides.
