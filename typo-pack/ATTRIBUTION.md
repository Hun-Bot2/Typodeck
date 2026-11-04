# Typo Pack — attribution and provenance

Typo Pack is TypoPPT's design-knowledge subsystem: 27 original visual
identities (selection metadata, design specs, previews, Korean locale
overlays) plus the deterministic selector that maps purpose and content
to candidates. The engine consumes each entry as a base-system geometry
plus a font/color theme; see `packages/core/src/template-pack.ts`.

## Derivation (honest record)

Typo Pack descends from `bold-template-pack` in
[zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides)
(MIT, © 2025 Zara Zhang) and its companion
[beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates)
(MIT, © 2026 Zara Zhang):

- **Imported, then removed.** `templates/8-bit-orbit/{preview.md,design.md}`
  were byte-identical upstream copies (sha256 `1730889b…` / `367fe311…`,
  recorded in `SOURCE.md`), kept unindexed as a specification model. They
  were removed from the shipped pack during the Typo Pack migration
  because the engine never reads them; the checksums above preserve the
  record. The user-supplied archive they arrived in
  (`typodeck-design-reference.zip`, sha256 `da329259…`) stays untracked
  and unpublished.
- **Adapted with new content.** The two-document shape (preview card +
  full design spec), the design.md YAML front-matter schema
  (`colors/shadows/typography/spacing`), the selection-index semantics
  (slug/mood/tone/formality/density/scheme), and a shared 11-rule Preview
  Rules core now embedded in each `preview.md` (six entries add one local
  12th rule) originate upstream. The 27 visual identities, the camelCase
  index, `preview.html`
  renders, and `locales/ko/` overlays are TypoPPT-original.
- **Independent.** The TypoPPT engine integration (base-system mapping,
  theme resolution, KO-aware faces, deterministic selector), the Studio
  picker, and the CLI surface are original and touch no upstream code.

Both upstream MIT licenses permit this reuse provided the copyright and
permission notices ship with the pack — see [LICENSE](LICENSE). Do not
remove this file or that one.

## Name history

- `bold-template-pack/` — legacy directory name, inherited upstream.
- `typo-pack/` — canonical name since the Typo Pack migration.
- A `bold-template-pack` symlink → `typo-pack` ships for one release
  cycle so older harnesses and eval scripts keep resolving. It is
  deprecated: new code must use `typo-pack/`. Removal milestone: the
  release after next minor. Canonical consumers already resolve
  `typo-pack/` first with legacy fallback.

## License summary

- Upstream-derived structure/boilerplate: MIT (Zara Zhang notices above).
- 27 TypoPPT design identities, selector, and integration: MIT (this
  repo's [LICENSE](../LICENSE)).
- No share-alike applies. Redistribution is permitted with notices kept.
