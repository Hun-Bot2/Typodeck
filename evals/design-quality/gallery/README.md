# Design-Quality Gallery

Owner review gallery for the 27 design-quality benchmark designs (D01–D27).

## Open

Serve root is `evals/design-quality/`. The page works over `file://` with
zero runtime fetch — all metadata is inlined at build time:

- `gallery/index.html` — card grid (filter with the control bar, click a card)
- `gallery/index.html?d=D01` — deep link into a detail view
- `gallery/index.html?d=D10&tab=deck` — deep link into the full-deck filmstrip
  (`tab` ∈ `cover|evidence|explanation|deck`)

Image paths are relative (`../specimens/<slug>/*.png`,
`../full-decks/<slug>/slides/*.png`, `../full-decks/<slug>/deck.html`), so the
`evals/design-quality/` directory stays relocatable.

## Rebuild

```sh
cd evals/design-quality/gallery
python3 build.py
```

`build.py` merges `../audit/classification.json` (DID/slug/leaning/rationale)
with `bold-template-pack/selection-index.json` (name/mood/density/best-for),
verifies every referenced PNG exists on disk (missing renders become visible
placeholders, never silent broken images), and writes `index.html`.

## Features

- **27 cards**: cover thumbnail, name, positioning (best-for + audit
  rationale), curated status, Core/Specialized category, render gate.
- **Detail view**: full-size Cover / Evidence / Explanation tabs, Prev/Next,
  keyboard (`←/→` designs, `↑/↓` deck slides, `Esc` close).
- **Full-deck tab** (6 designs): main canvas + 7-slide filmstrip + Prev/Next +
  link to `deck.html`.
- **Filters**: Category (Core/Specialized), mood, density, purpose (best-for
  text), review status, plus full-text search.
- **Owner review**: per-design verdict (Approve-Core / Specialized /
  Needs-refinement / Reject) + free-text notes, autosaved to `localStorage`
  (`typodeck-dq-reviews-v1`), shown as badges on cards, editable in the
  side-by-side compare view (select 2–4 cards).
- **Export / Import**: Export downloads a timestamped
  `typodeck-dq-reviews-<ts>.json` merge of all reviews. Import merges an
  exported file per design by `updatedAt` (newer wins) and reports every
  decision — nothing is ever silently overwritten.

## Verification

```sh
python3 -c "import re;open('/tmp/dq.js','w').write(re.search(r'<script>(.*)</script>',open('index.html').read(),re.S).group(1))"
node --check /tmp/dq.js
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-sandbox \
  --window-size=1600,1200 --virtual-time-budget=6000 \
  --screenshot=/tmp/dq.png "file://$PWD/index.html?d=D01"
```
