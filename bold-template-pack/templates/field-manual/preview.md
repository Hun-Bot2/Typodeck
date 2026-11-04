# Field Manual Preview Card

Use this small file for title-slide previews only. For final deck generation, read the full design doc listed below.

## Files

- Full design doc: `bold-template-pack/templates/field-manual/design.md`
- Preview card: `bold-template-pack/templates/field-manual/preview.md`

## Selection Metadata

- Slug: `field-manual`
- Tagline: Ruled technical-manual cover with numbered steps and figure callouts.
- Mood: procedural, exacting, practical, no-nonsense
- Tone: instructive, dry, authoritative, checklist-driven
- Formality: high
- Density: high
- Scheme: light
- Best for: Process rollouts, compliance briefings, engineering runbooks, onboarding decks, safety reviews, and any talk that should feel like opening a well-kept binder. Strong for postmortems, audits, and operational readouts with numbered findings.
- Avoid for: Contexts where emotion or atmosphere carries the message — brand stories, celebratory keynotes, fundraising narratives, or anything that needs whitespace luxury or expressive type.

## Visual Snapshot

Field Manual is a technical-manual presentation system set on warm paper with a fine dotted grid. Headers run in Archivo Bold caps, body in IBM Plex Sans, and every callout, tag, and figure label in IBM Plex Mono. The palette is paper and ink with a deep procedural navy for notes and figure chrome and a caution amber reserved for warning chips. Layouts follow a 60/40 split: ruled text with numbered steps on the left, a bordered figure column with exhibits and callout boxes on the right, stitched together with dashed leader lines. Depth is flat: 1px bordered boxes, double rules, and dotted-grid paper do all the work; shadows and gradients do not exist. The effect sits between a military field guide and a well-run engineering wiki — every element numbered, every claim tagged, nothing left floating.

Field Manual's foundational premise is the numbered artifact: every step, figure, note, and warning carries a visible reference code, so the slide reads as one page of a larger controlled document. Layouts feel issued, not designed — a doc header, a double rule, ruled sections, and a revision footer are the entire vocabulary.

## Preview Ingredients

- Palette: paper #FAF8F3; ink #1A1A1A; procedural-blue #182B49 (deep navy); caution-amber #FFB000; muted #6E6A5E
- Typography: See full design doc after selection.
- Signature move: Doc header strip with mono document code, centered procedure title, and date — closed by a 3px + 1px double rule.
- Signature move: Numbered steps with bordered numeral squares, dashed leader lines, and mono section tags (`§2.1`).
- Signature move: Bordered figure boxes (`FIG. 01`) with check-row exhibits and dashed leaders to callout notes.
- Signature move: Blue-bordered `NOTE` callout boxes pairing a mono tag with a short Plex Sans finding.
- Signature move: Caution-amber warning chips (`⚠ READ BEFORE SHIP`) — the only filled elements in the system.
- Signature move: Fine dotted-grid paper ground with an 8px baseline and ruled sections throughout.

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
