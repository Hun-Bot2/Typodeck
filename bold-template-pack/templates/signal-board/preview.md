# Signal Board Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/signal-board/design.md`
- Preview card: `bold-template-pack/templates/signal-board/preview.md`

## Selection Metadata

- Slug: `signal-board`
- Tagline: Live ops-dashboard cover with KPI cards, case log, and status pills.
- Mood: analytic, operational, precise, trustworthy
- Tone: factual, systems-minded, transparent, no-nonsense
- Formality: medium-high
- Density: high
- Scheme: light
- Best for: Research briefs, engineering reviews, postmortem readouts, data-heavy narratives, ops and platform teams, quarterly business reviews — anywhere the argument is carried by counts, tables, and status signals.
- Avoid for: Emotional brand storytelling, luxury or fashion narratives, ceremonial keynotes, or any deck where visible data chrome would cheapen the message.

## Visual Snapshot

Signal Board treats the title slide as a live systems console at the moment the numbers land. The ground is a cool mist gray-blue (#F6F8FA) ruled by hairline dividers, capped by a slate command bar (#0F172A) with a green live dot and mono telemetry. All prose runs in Inter with tabular numerals; every label, pill, and data row runs in IBM Plex Mono. The left column carries the argument — kicker pills, a heavyweight Inter headline, a mono context line with a blue signal swatch, and rule-separated data rows. The right column carries the evidence — flat KPI stat cards with 6px signal-color top borders and a dark case-log panel listing PM-01 through PM-11 with LOGGED / UNDER REVIEW status pills. Signal colors are strictly semantic: blue for identity, green for complete, amber/red for attention. There are no shadows, no gradients, no decoration that is not also a readout.

## Preview Ingredients

- Palette: mist #F6F8FA; slate #0F172A; signal-blue #2563EB; ok-green #16A34A; warn-amber #B45309; alert-red #DC2626; row-rule #CBD5E1; white #FFFFFF
- Typography: See full design doc after selection.
- Signature move: Slate command bar with live green dot and mono telemetry (series name, sample count) crowns every cover.
- Signature move: KPI stat cards pair a 92px tabular Inter numeral with a mono caption and a flat status pill, keyed by a 6px signal-color top border.
- Signature move: Dark case-log panel enumerates the evidence set (PM-01 … PM-11) as mono rows with LOGGED / UNDER REVIEW pills — the sample is always visible.
- Signature move: Rule-separated mono data rows with ▲/▼ direction glyphs sit under the headline like a ticker of findings.
- Signature move: Status pills (COMPLETE / UNDER REVIEW / LOGGED) are the only rounded shapes in the system — everything else is square and ruled.
- Signature move: Tabular numerals everywhere; columns of figures align digit-for-digit with zero layout jitter.

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
