# Peer Review Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/peer-review/design.md`
- Preview card: `bold-template-pack/templates/peer-review/preview.md`

## Selection Metadata

- Slug: `peer-review`
- Tagline: Scientific-journal title page with abstract box, figures, and footnotes.
- Mood: scholarly, precise, credible, calm
- Tone: evidence-driven, formal, transparent, methodical
- Formality: high
- Density: medium
- Scheme: light
- Best for: Research findings, postmortem reports, data-backed arguments, lab or research-team readouts, policy briefs, and any deck that earns trust by showing its apparatus — abstracts, figures, tables, and citations.
- Avoid for: Playful brand storytelling, cinematic keynotes, or luxury and fashion contexts where journal chrome would feel bureaucratic rather than credible.

## Visual Snapshot

A scientific-journal title page rebuilt as a presentation slide. Titles set in STIX Two Text — a crisp transitional serif with real italics — over a clean white ground ruled by ink hairlines, with a single scholarly link-blue reserved for apparatus accents. Layout follows the two-column paper: a wide article column carrying the kicker, title, and a tinted abstract inset box, beside a narrower rail with a numbered figure (bar chart) and a ruled three-row table. Reference-style bracket footnotes anchor the foot of the page beneath a hairline, and a double-rule journal masthead carries the running head. The effect sits between a journal PDF and a conference poster — quiet, cited, and deliberately unflashy, so the evidence reads as the decoration.

Peer Review is a scientific-journal presentation system. Its foundational premise is the apparatus: every claim on the slide travels with its scholarly furniture — abstract label, keywords line, figure and table numbers, bracketed footnotes — so the page proves its rigor structurally instead of asserting it. The single accent color (link blue) appears only on apparatus elements, never on prose.

## Preview Ingredients

- Palette: white #FFFFFF; ink #1A1A1A; link-blue #0B5394; rule-gray #EAEAEA; abstract-tint #F3F5F8
- Typography: See full design doc after selection.
- Signature move: Tinted abstract inset box with a 6px link-blue left bar, an "Abstract" eyebrow, italic serif summary, and a ruled Keywords line.
- Signature move: Numbered figure rail — "Figure 1" bar chart with tabular-numeral values plus a "Table 1" three-row ruled table, each with a bold-lead caption.
- Signature move: Reference-style bracket footnotes ([1], [2]) with blue superscripts behind a foot hairline rule.
- Signature move: Journal double-rule masthead — 3px ink rule over a 1px rule — carrying a small-caps running head and page mark.
- Signature move: Link blue reserved strictly for apparatus accents (kicker, chart fills, footnote markers, abstract bar) — body prose stays ink-on-white.
- Signature move: Hairline tabular discipline — tabular numerals in figures and tables, uppercase tracked Inter labels against sentence-case serif prose.

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
