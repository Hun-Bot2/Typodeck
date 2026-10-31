# Density Policies — Speaker-Led vs Reading-First

How much text a slide may carry. Adapted from `frontend-slides`
("Content Density Modes") and `presentation-skill` ("Readable
defaults"); Typodeck keeps both policies typography-only.

Record the chosen policy in Slide IR metadata (`densityPolicy`).
Metadata only: it guides planning and QA, never rewrites content.

## The two policies

**speaker-led** (talks, keynotes, pitches, live explanation):

- One idea per slide; large type; generous negative space.
- Short phrases over sentences; 1–3 bullets max when bullets exist.
- Prefer more slides over denser slides; section beats and
  statement slides carry pacing.

**reading-first** (reports, handouts, async review, decision docs):

- Self-contained slides: the point survives without a presenter.
- Structured typographic density: short blocks, comparison pairs,
  captions, source lines. Still typography only — no tables-as-
  shapes, no cards; use alignment and scale contrast instead.
- Tighter but intentional spacing; hierarchy must stay obvious.

Mixed needs snap to the closer mode: live persuasion →
speaker-led; async circulation or detailed review → reading-first.
Never invent a middle mode per slide; the policy is per deck.

## Defaults by preset and duration

- P01/P04/P10 (pitch, story-led) default speaker-led.
- P05/P06/P07/P09 (evidence-led) default reading-first.
- Short durations (≤10 min) bias speaker-led; long or
  read-in-advance decks bias reading-first.
- Explicit user choice always wins. State the assumption when
  inferring ("assuming speaker-led for a 5-minute pitch").

## Readable floors (both policies)

- Title ≤ 2 lines; body lines ≤ ~60 characters (existing critic
  proxies, now policy).
- Never shrink type to fit: shorten, split the slide, or convert
  prose into tighter evidence blocks first.
- No text below comfortable reading size at projection distance;
  captions/sources stay legible, never decorative microtype.
- Overflow always splits the slide — in both policies.
