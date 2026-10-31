# Typodeck showcase — three decks from real repos

Every asset below was produced by the actual Typodeck pipeline
(`planDeck` → `exportToPptx` → `validatePptx`) against live public repos.
Full pins, seeds, commands, and verification live in [manifest.md](manifest.md).

| Deck | Repo | System | Slides | Preview |
|------|------|--------|--------|---------|
| Tool showcase: `is` | [sindresorhus/is](https://github.com/sindresorhus/is) @ `e9c026c` | swiss | 12 | [filmstrip](previews/is-swiss.filmstrip.png) · [cover](previews/is-swiss.slide1.png) · [pptx](decks/is-swiss.pptx) |
| Adoption case for Day.js | [iamkun/dayjs](https://github.com/iamkun/dayjs) @ `436bde0` | editorial | 12 | [filmstrip](previews/dayjs-editorial.filmstrip.png) · [cover](previews/dayjs-editorial.slide1.png) · [pptx](decks/dayjs-editorial.pptx) |
| Docs guide: TypeScript Handbook | [microsoft/TypeScript-Handbook](https://github.com/microsoft/TypeScript-Handbook) @ `543d2df` | expressive | 12 | [filmstrip](previews/handbook-expressive.filmstrip.png) · [cover](previews/handbook-expressive.slide1.png) · [pptx](decks/handbook-expressive.pptx) |

Guarantees verified per deck: 16:9, text-boxes-only PPTX, all text in editable
`<a:t>` nodes, zero forbidden elements, every number traceable to a source ref.
Previews are HTML-geometry renders of the real deck JSON (see manifest §6, §8).
