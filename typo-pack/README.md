# Typo Pack

Typo Pack is TypoPPT's experimental design-candidate library: 27 visual
identities plus a deterministic selector that shortlists candidates from
purpose and content metadata.

It is not 27 production layout engines. Each entry supplies:

- selection metadata in `selection-index.json`
- an agent-facing selection card in `templates/<slug>/preview.md`
- a full design specification in `templates/<slug>/design.md`
- a Korean locale overlay in `templates/<slug>/locales/ko/`
- a design-reference render in `templates/<slug>/preview.html`

The production engine consumes only two machine-effectful parts: the index
entry's density/formality/content metadata and the design document's YAML
front-matter palette and font stacks. It maps every entry to one of the
existing base systems (`editorial`, `swiss`, or `expressive`) and applies the
template's fonts/colors through that system's geometry. Themed PPTX output is
therefore base-system geometry, not the HTML specimen.

## Use the smallest context

1. Shortlist from metadata:
   `npm run --silent deck -- --suggest --preset P05 --top 3`
2. Read only the shortlisted `preview.md` files.
3. Apply one candidate:
   `npm run --silent deck -- --idea-file idea.txt --template peer-review --out deck.pptx`
4. Ship only on `validation: OK`.

Explicit `--density`, `--formality`, `--content-types`, and `--mood` filters
override purpose-preset hints. Scores rank metadata fit, not visual quality.
Unknown presets and filters fail loudly.

`--suggest --preset` only guides retrieval. A generation command's `--preset`
chooses the narrative arc.

## Status and compatibility

- All 27 entries are experimental re-themes. They are never a substitute for
  the production `editorial`, `swiss`, and `expressive` systems.
- `document` remains a separate experimental base system; no Typo Pack entry
  maps to it.
- Canonical directory: `typo-pack/`. The repository retains a deprecated
  `bold-template-pack` symlink and canonical-first/legacy-fallback lookup for
  one release cycle; new code must use `typo-pack/`.
- Provenance and redistribution terms: `ATTRIBUTION.md`, `LICENSE`.
  `SOURCE.md` and `SOURCE-README.md` preserve the internal source record.
