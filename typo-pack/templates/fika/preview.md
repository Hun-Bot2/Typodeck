# Fika Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `typo-pack/templates/fika/design.md`
- Preview card: `typo-pack/templates/fika/preview.md`

## Selection Metadata

- Slug: `fika`
- Tagline: Soft Scandinavian calm — lowercase headlines on warm off-white with muted pastel panels.
- Mood: calm, warm, friendly, unhurried, functional
- Tone: gentle, plain-spoken, welcoming, quietly confident
- Formality: low-medium
- Density: low
- Scheme: light
- Best for: Team retros, culture decks, research readouts, onboarding, education, nonprofit storytelling — anything that should feel like a calm conversation over coffee rather than a performance.
- Avoid for: Contexts that need urgency, spectacle, or hard authority — crisis comms, aggressive sales pushes, cinematic launches, dense technical specifications.

## Visual Snapshot

A Scandinavian soft-functional presentation system built on warmth and restraint. Display type runs in Fraunces (a soft, wonky serif with old-style friendliness) set lowercase for headlines, paired with Nunito Sans for body and small caps-flavored labels. The palette stays on warm off-white (#FAFAF7) with slate text (#3D4A54) and three muted pastels — sage, blush, and dusty blue — used as flat panel fills and chips, never as text. Depth is nearly absent: matte surfaces, soft 16px+ corner radii, and at most a whisper of a warm-gray shadow. The effect is a quiet kitchen table, not a stage — everything rounded, everything legible, nothing shouting.

Fika is a Scandinavian soft-functional presentation system. Its foundational premise is friendliness through geometry: every container is rounded (16px panels, 999px chips), every headline is lowercase, every color is muted to a pastel register. Layouts breathe through huge gutters and an airy two-column rhythm — text on the left, one soft tinted panel on the right — and whitespace does the structuring work that rules and grids do in harder systems.

## Preview Ingredients

- Palette: off-white #FAFAF7; slate #31404B; sage #A8C3B9; blush #E8B4A0; dusty-blue #7FA6C9; white #FFFFFF
- Typography: See full design doc after selection.
- Signature move: Lowercase Fraunces headlines ({typography.headline}) — sentence meaning set entirely in lowercase, weight 500, tight but never cramped.
- Signature move: Soft rounded panels ({components.soft-panel}) — 16–24px radii, flat pastel fills (sage/blush/dusty-blue at full tint or 35% wash), zero borders.
- Signature move: Muted pastel chips ({components.chip}) — 999px pills in alternating pastels with slate text, carrying new labels (section tags, dates) and never headline echoes.
- Signature move: Airy two-column rhythm — text column left at ~58% width, one tinted companion panel right, gutters ≥ 96px, nothing touching the viewport edge.
- Signature move: Matte surface discipline — no gradients, no gloss, no hard shadows; at most one 0 8px 24px rgba(61,74,84,0.08) lift shadow per slide.
- Signature move: Fraunces old-style numerals for data moments — figures set large in the display serif inside a pastel panel, never in a geometric sans.

## International / CJK Preview Note

- If the preview uses Korean or other CJK text, keep CJK letter-spacing at 0, loosen line-height, and skip the lowercase transform on CJK runs (CJK has no case; the friendly voice carries through the pastel panels and round geometry instead).
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
