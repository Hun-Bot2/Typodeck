# Design-Diversity Gallery (D01–D27)

Static gallery over `evals/design-diversity/screenshots/D01..D27.png`.

## Files

| File | Role |
|------|------|
| `index.html` | Single-file gallery. All metadata inlined at build time — no `fetch`, works over `file://`. |
| `contact.html` | Contact-sheet source: 3-col × 9-row grid of 640×360 thumbs. |
| `contact-sheet.png` | Rendered contact sheet, 1920×3600. |
| `build.py` | Generator: reads `typo-pack/selection-index.json`, inlines data into `index.html`, emits `contact.html`. |
| `README.md` | This file. |

## Gallery features

- Card per design: preview image, name/ID/slug, mood + tone chips, density/formality/scheme, Best-for, validation badge, design.md/preview.md repo paths as plain text.
- Filters: free-text search, mood (76 values), density, formality, scheme. Live `n / 27 shown` count.
- Comparison mode: tick 2–4 cards → "Compare side-by-side" overlay.

## Contact-sheet method

No PIL/sharp/canvas available, so: `contact.html` (plain HTML grid referencing
`../screenshots/*.png` relatively) rendered with headless Chrome:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --no-sandbox --hide-scrollbars --window-size=1920,3600 \
  --virtual-time-budget=8000 --screenshot=./contact-sheet.png \
  "file://$REPO/evals/design-diversity/gallery/contact.html"
```

Regenerate with `python3 build.py` + the command above.

## Verification

- `build.py` asserts 27 templates; `validate-design.mjs <slug>` returned
  `RESULT: PASS` for all 27 slugs at build time (shown as the ✓ PASS badge).
- `index.html` screenshotted headlessly at 1600×4600 over `file://` and
  visually inspected: all 27 cards render with images, "27 / 27 shown".
- `contact-sheet.png` (1920×3600) visually inspected: all 27 thumbs labeled D01–D27.
