# Typodeck Human Review Gallery

Local, static review UI for the product owner. No build step, no backend —
decisions live in the browser until exported. **Nothing here auto-selects
finals**; every verdict is a human decision captured on export. Start human
review at [REVIEW-GUIDE.md](REVIEW-GUIDE.md) (comparisons matrix, per-candidate
evidence, unsupported list, decision backup procedure).

## Open it

Option A — just open the file (works offline):

- Open `gallery/index.html` in a browser (double-click or `open gallery/index.html`).

All data is bundled in `gallery/data.js`, and slide renders are inlined, so
`file://` works for every view. Links to full-size HTML previews, PPTX files,
and synthesis docs are relative paths and also work from `file://`.

Option B — serve the repo root (needed only if your browser blocks local files):

```sh
cd <repo-root>
python3 -m http.server 8080
# then open http://localhost:8080/gallery/
```

## Review flow

1. **References** — browse the 447 research records from
   `research/merged_registry.json` (full-field rebuild from agents A–E) by
   category, agent, verification status, or free-text search. Verification
   status is shown first on every card and never blurred:
   **VISUALLY INSPECTED** (235, page/surrogate seen) vs **SEARCH-CHECKED**
   (190, metadata/description only) vs **NOT INSPECTED** (22,
   inaccessible). Each card carries the agent's composition observations
   plus provenance (original category, verification method/notes); capped
   confidences and reassembled summaries are badged. Each card links to its
   source URL. These are the evidence behind the interpretations.
2. **Interpretations** — inspect each generated Typodeck system (`document`
   experimental + `editorial` / `swiss` / `expressive` production baselines):
   validation/parity badges, per-slide renders with the selected composition
   candidate id, and links to the full HTML and PPTX in `previews/`.
3. **Compare** — pick one slide index (x0–x5) and see the SAME narrative
   content rendered in every system side by side, with each system's
   candidate id shown.
4. **Decisions** — mark each candidate KEEP / REVISE / MERGE / REJECT and add
   comments. Verdict widgets on the Interpretations and Compare tabs stay in
   sync with this table. Enter a reviewer name, then **Export JSON** (full
   record incl. narrative sha + seed) or **Export CSV** (spreadsheet).
   Use **Import JSON** to resume a previous session.

Decisions persist in `localStorage` (key `typodeck-gallery-decisions-v1`);
exported files are named `typodeck-review-decisions.{json,csv}`.

## Missing artifacts

If a source file was absent when `data.js` was built, the gallery shows an
explicit red **MISSING** / **NO PREVIEW** badge — it never fakes a render.
Known honest gaps in the current data:

- `document:manual-opening` and `document:manual-section` are composition
  candidates with no rendered preview slide (the 6-slide narrative did not
  select them). They appear under Interpretations → document as NO PREVIEW
  and are still reviewable.

## Refreshing the data

After regenerating previews or the registry, rebuild the bundle:

```sh
node gallery/build-data.js   # rewrites gallery/data.js from real files
```

`build-data.js` reads `previews/manifest.json`, `previews/html/*.html`,
`previews/pptx/*.pptx` (existence), `research/merged_registry.json`, and the
synthesis docs. It prints missing-file warnings; the gallery surfaces them
as badges plus a banner. `gallery/data.js` is generated — do not hand-edit.
