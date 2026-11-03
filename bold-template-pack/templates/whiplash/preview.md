# Whiplash Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/whiplash/design.md`
- Preview card: `bold-template-pack/templates/whiplash/preview.md`

## Selection Metadata

- Slug: `whiplash`
- Tagline: Art-nouveau organic elegance — arched frames, bronze flourishes, serif grace.
- Mood: romantic, organic, refined, lyrical
- Tone: poetic, cultivated, warm, expressive
- Formality: high
- Density: low-medium
- Scheme: light
- Best for: Cultural keynotes, editorial launches, wine-and-ideas salons, humanities lectures, brand stories with heritage — anywhere the message wants to unfurl rather than punch.
- Avoid for: Developer tooling, dashboards, legal disclosure, or any deck where ornament would read as frivolity rather than craft.

## Visual Snapshot

Whiplash is an art-nouveau organic presentation system that sets a top-anchored left-aligned column inside an offset arch alcove on warm parchment (#F3EDE0). Display type runs in Marcellus (a classical inscriptional serif with quiet flare) at large left-aligned sizes over EB Garamond italic deck prose, with Marcellus caps carrying tracked labels; deep green (#2F3E33) is the ink, bronze (#8C6A3C) draws every flourish, and rose (#B76E79) warms accents and the inner arch line. The stack reads context first, then the large left-aligned title, then an asymmetric fleuron-and-hairline divider, then a plain italic subtitle with no drop cap. A separate right-side ornament field holds a rose halo ring, a large translucent fleuron bloom, and bronze curls — the arch alcove and the ornament field form an asymmetric pair. Curves rule: arches, halos, curls, and hairline flourishes replace every straight modernist edge except the baseline grid.

## Preview Ingredients

- Palette: parchment #F3EDE0; deep-green #2F3E33; bronze #8C6A3C; rose #B76E79
- Typography: See full design doc after selection.
- Signature move: Offset arch alcove in double hairline (bronze outer, rose echo) anchoring the left two-thirds, carrying a top-anchored left-aligned stack.
- Signature move: Context-first stack — tracked caps context line with a short bronze overline, then the large left-aligned title.
- Signature move: Asymmetric fleuron divider (❦ plus one 320px hairline and a rose dot) left-anchored between title and subtitle.
- Signature move: Plain italic deck subtitle with no drop cap — EB Garamond italic at text scale, left-aligned.
- Signature move: Right ornament field — rose halo ring, translucent bronze fleuron bloom, and three bronze curls on empty parchment.
- Signature move: Marcellus inscriptional display over Garamond prose — classical voice, never geometric or grotesque.

## International / CJK Preview Note

- CJK runs keep letter-spacing at 0, use looser line-height, and never take uppercase transforms; there is no drop cap in any script.
- Korean builds pair Noto Serif KR (display) with Noto Serif KR (deck) and Noto Sans KR (labels); see the full design doc.
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
- Keep every frame curved and every ornament botanical; never introduce straight-edged modernist boxes or bars.
