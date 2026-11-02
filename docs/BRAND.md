# Typodeck brand — short spec

Typography-led identity. Every asset is a self-contained SVG: flat background + editable `<text>` only. No embedded fonts, no external images, no gradients, no copied marks.

Full asset docs: [brand/README.md](../brand/README.md).

## Selected direction: B — Swiss grid grotesk

- **Wordmark:** "Typodeck" in Inter Bold (OFL), tracking −0.02 em, with a single rust period. Descriptor caps tracked +0.22 em.
- **Why B:** legible from 16 px UI type to hero scale (mobile-verified at 320/375 px); the grid embodies the deterministic layout engine; neutral above all three deck systems; rust/paper restraint bridges the existing Studio chrome (`--accent #9A3B26`).
- **Why not A (Editorial serif):** premium voice, but high-contrast hairlines fail below ~24 px. Reserved for deck covers, not the master brand.
- **Why not C (Expressive stacked):** highest impact, but the stacked lockup fails inline contexts and small widths; signal-yellow fights the product's rust accent.

## Tokens

| Token | Value | Use |
|---|---|---|
| `white` | `#FFFFFF` | Hero background |
| `paper` | `#FAF7F2` | Light wordmark background |
| `ink` | `#111111` | Wordmark, primary text on light |
| `muted` | `#5C5C5C` | Descriptor / secondary on light |
| `band` | `#14120E` | Dark surfaces |
| `band-ink` | `#F2EEE4` | Text on dark |
| `rust` | `#9A3B26` | The single accent: the period, light surfaces only |

Dark surfaces use the **one-colour rule**: all bone, no rust (rust fails contrast on the band). Swiss-red `#E30613` belongs to the deck system palette, not the brand.

## Assets

| File | Size | Use |
|---|---|---|
| `brand/typodeck-hero.svg` | 1280×480 | Full banner (white background) |
| `brand/typodeck-wordmark.svg` | 640×160, transparent | Compact wordmark for light surfaces |
| `brand/typodeck-wordmark-light.svg` | 640×160, paper bg | Wordmark on guaranteed-light background |
| `brand/typodeck-wordmark-dark.svg` | 640×160, dark bg | One-colour wordmark for dark surfaces |
| `brand/typodeck-social.svg` | 1280×640 | Social / link-preview card |
| `brand/direction-a-editorial.svg` | 1200×630 | Direction A exploration board |
| `brand/direction-b-swiss.svg` | 1200×630 | Direction B exploration board (selected) |
| `brand/direction-c-expressive.svg` | 1200×630 | Direction C exploration board |

## Usage

Light/dark-aware README snippet (no external hosting; GitHub caps content at ~880 px, all assets scale losslessly):

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/typodeck-wordmark-dark.svg" />
  <img src="brand/typodeck-wordmark-light.svg" alt="Typodeck — typography-only pitch decks" width="640" />
</picture>
```

Rules:

- Keep the rust period — it is the only accent and the recognition device.
- Backgrounds stay flat; no rules, boxes, shadows, or imagery — the identity demonstrates the product constraint.
- Text is live `<text>` — edit in any text editor, never convert to outlines.
- All first-choice faces are SIL Open Font License (Inter, Source Serif 4, Archivo Black) with system fallbacks; no font files are committed or fetched, so SVGs render on GitHub, in checkouts, and offline.

## Engine output vs brand illustration

- `brand/` = **hand-made identity illustrations**. They show the visual identity, not engine output.
- `docs/showcase/` = **real engine output** (CLI-produced `.pptx`, deck JSON, provenance, PNG renders of real PPTX bytes). Do not mix the two when captioning README images.
