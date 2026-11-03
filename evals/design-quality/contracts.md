# Design-Quality Contracts (paths, render, gallery)

Storage, render, and gallery-read contracts for the design-quality
benchmark. Fixture copy lives in `fixtures.json` / `fixtures.md`;
this file pins where rendered artifacts land and how tooling finds them.

## Specimen storage

Per-design single-slide specimens, three per design:

```
evals/design-quality/specimens/<slug>/cover.html
evals/design-quality/specimens/<slug>/cover.png
evals/design-quality/specimens/<slug>/evidence.html
evals/design-quality/specimens/<slug>/evidence.png
evals/design-quality/specimens/<slug>/explanation.html
evals/design-quality/specimens/<slug>/explanation.png
```

- `<slug>` is the lowercase-hyphen template slug
  (`bold-template-pack/templates/<slug>/`).
- `cover` renders the benchmark-deck slide 1 beats; `evidence` the
  Slide-B block; `explanation` the Slide-C block. Copy verbatim from
  fixtures; see `fixtures.md` usage rules.
- Each `.html` is a standalone 1920x1080 slide document; each `.png`
  is its verified capture. Never commit a `.png` without its `.html`.

## Full-deck storage

Per-design seven-slide benchmark runs:

```
evals/design-quality/full-decks/<slug>/slides/slide-01-cover.html
evals/design-quality/full-decks/<slug>/slides/slide-02-divider.html
evals/design-quality/full-decks/<slug>/slides/slide-03-statement.html
evals/design-quality/full-decks/<slug>/slides/slide-04-evidence.html
evals/design-quality/full-decks/<slug>/slides/slide-05-comparison.html
evals/design-quality/full-decks/<slug>/slides/slide-06-dense.html
evals/design-quality/full-decks/<slug>/slides/slide-07-closing.html
evals/design-quality/full-decks/<slug>/deck.html
evals/design-quality/full-decks/<slug>/report.json
```

- `slides/slide-NN-<kind>.html` renders one deck slide each, in outline
  order, with the outline's beats verbatim.
- `deck.html` concatenates the seven slides for review (navigation
  chrome allowed outside the slide frames only).
- `report.json` records the run: `{ "slug": str, "slides": [per-slide
  `{ "kind": str, "html": relpath, "validator": "PASS" }], "render":
  `{ "width": 1920, "height": 1080, "verify": "PASS" } }`.

## Render rules

- Stage: exactly 1920x1080, fixed-stage model inherited from the
  diversity harness (`scaffold.html` embed; letterbox scaler, no reflow).
- Capture flags mirror
  `evals/design-diversity/harness/screenshot.mjs`: headless Chrome with
  `--window-size=1920,1080` plus a virtual-time font-settling budget
  (`--budget=8000` default); verify PNG IHDR dimensions are exactly
  1920x1080 and print `VERIFY: PASS (1920x1080)`.
- Validator gate: the design-quality validator must print
  `RESULT: PASS` for **each** rendered slide (3 specimens + 7 deck
  slides). A single FAIL blocks that design's gallery entry.
- No font binaries committed; Google-Fonts-CDN loading with the
  disclosed fallback policy from the diversity harness `fonts.md`.

## Gallery data contract

The gallery reads specimens with paths relative to
`evals/design-quality/`, so the benchmark directory stays relocatable:

- Images: `specimens/<slug>/cover.png`, `specimens/<slug>/evidence.png`,
  `specimens/<slug>/explanation.png` (relative, never absolute).
- Classification: `specimens/<slug>/classification.json` per design:

```json
{
  "slug": "gridline-swiss",
  "did": "D01",
  "specimens": {
    "cover": { "html": "cover.html", "png": "cover.png", "validator": "PASS" },
    "evidence": { "html": "evidence.html", "png": "evidence.png", "validator": "PASS" },
    "explanation": { "html": "explanation.html", "png": "explanation.png", "validator": "PASS" }
  },
  "full_deck": "../../full-decks/<slug>/deck.html",
  "render": { "width": 1920, "height": 1080, "verify": "PASS" },
  "tags": ["swiss", "editorial"],
  "notes": "free-text curator note"
}
```

- `validator` and `render.verify` must both read `PASS` or the gallery
  omits the design with a visible placeholder (no silent broken images).
- `tags` is a free curator vocabulary; `notes` is optional.
