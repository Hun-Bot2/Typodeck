# Typodeck brand identity

Typography-led identity for Typodeck. Every asset is a self-contained SVG:
flat background + editable `<text>` only. No embedded fonts, no external
images, no gradients, no copied marks.

Branch: `brand/readme-redesign` (isolated; no other files touched).

## Files

| File | Size | Use |
|---|---|---|
| `typodeck-hero.svg` | 1280×480 | Primary README banner (final direction B) |
| `typodeck-wordmark.svg` | 640×160, transparent | Compact wordmark for light surfaces |
| `typodeck-wordmark-light.svg` | 640×160, paper bg | Wordmark on guaranteed-light background |
| `typodeck-wordmark-dark.svg` | 640×160, dark bg | One-colour wordmark for dark surfaces |
| `typodeck-social.svg` | 1280×640 | Social / link-preview card (GitHub 1280×640) |
| `direction-a-editorial.svg` | 1200×630 | Direction A exploration board |
| `direction-b-swiss.svg` | 1200×630 | Direction B exploration board (selected) |
| `direction-c-expressive.svg` | 1200×630 | Direction C exploration board |

## README snippet (light/dark aware, no external hosting)

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/typodeck-wordmark-dark.svg" />
  <img src="brand/typodeck-wordmark-light.svg" alt="Typodeck — typography-only pitch decks" width="640" />
</picture>
```

For the full banner, reference `brand/typodeck-hero.svg` at `width="100%"`.
GitHub caps README content at ~880 px; all assets scale losslessly.

## Final direction: B — Swiss grid grotesk

**Wordmark:** “Typodeck” in Inter Bold, tracking −0.02 em, with a single
rust period. Descriptor caps in semibold, tracked +0.22 em.

**Rationale.** The grotesk holds from 16 px UI type to hero scale (verified
at 320 px wide), while the serif hairlines of A fail below ~24 px and the
stacked lockup of C cannot sit inline. Conceptually the grid embodies the
product: a deterministic layout engine with evidence-graded claims and a
validator that refuses anything that is not text. B is also the neutral
choice — it sits above all three deck systems without favouring one, and
its rust/paper restraint bridges the existing Studio chrome
(`--accent #9A3B26`, serif headlines) rather than breaking from it.

**Why not A:** premium publishing voice and the closest match to current
Studio serif headlines, but high-contrast hairlines thin out at small
sizes and on low-density screens. Best reserved for deck covers, not the
master brand.

**Why not C:** highest impact and the most ownable silhouette, but the
stacked lockup fails inline contexts (nav, footer, CLI banners) and small
widths; the signal-yellow accent also fights the rust accent already in
the product.

## Direction specs

### A — Editorial (refined high-contrast)

- Typeface: Source Serif 4 (OFL) → Noto Serif KR → Georgia → serif.
- Treatment: “Typo” roman + “deck” italic, zero tracking; rust period.
- Baseline: 8-pt grid, generous leading; hairline strokes unmodified.
- Optical balance: italic half adds warmth; roman half keeps the stem
  rhythm stable. No manual kerning pairs — serif sidebearings untouched.
- Contrast: ink `#1A1A1A` on paper `#FAF7F2` (~16:1); rust reserved for
  the period only.
- Whitespace: low density — one idea per board, wide margins.
- Responsive: legible ≥ 24 px; not for small UI.

### B — Swiss (grid grotesk, selected)

- Typeface: Inter (OFL) → Archivo → system sans.
- Treatment: “Typodeck” 700, tracking −0.02 em; rust period; descriptor
  caps +0.22 em.
- Baseline: 8-pt grid, strict left alignment (boards) or optical centre
  (hero, via `text-anchor="middle"` so centring survives font fallback).
- Optical balance: tight tracking closes the grotesk apertures at large
  sizes; wide-tracked caps keep the small descriptor airy.
- Contrast: ink `#111111` on white (~19:1); secondary `#5C5C5C` (~7:1).
- Whitespace: medium density; alignment does the work, no rules or boxes.
- Responsive: legible 16 px → hero; mobile-verified at 320/375 px wide.

### C — Expressive (bold scale)

- Typeface: Archivo Black (OFL) → Space Grotesk 700 → system sans.
- Treatment: stacked “TYPO / DECK”, tracking −0.03 em, leading 0.92,
  hero:body ratio ≥ 4:1; signal period.
- Baseline: tight stacked rhythm; oversize caps carry the optical weight.
- Contrast: bone `#F5F2EA` on black `#0E0E0E` (~17:1); signal `#FFD400`
  for the period and ratio figure only.
- Whitespace: asymmetric — mass on the left, air on the right.
- Responsive: display sizes only; stacked form fails narrow columns.

## Tokens (final identity)

- `white #FFFFFF` — hero background
- `paper #FAF7F2` — light wordmark background
- `ink #111111` — wordmark, primary text on light
- `muted #5C5C5C` — descriptor / secondary on light
- `band #14120E` — dark surfaces (wordmark-dark, social)
- `band-ink #F2EEE4` — text on dark
- `rust #9A3B26` — the single accent: the period, light surfaces only

Dark surfaces use the **one-colour rule**: all bone, no rust, because rust
fails contrast on the band. Secondary text on dark uses bone at reduced
opacity instead of new tokens (flat fills only — never gradients).

Swiss-red `#E30613` belongs to the deck system palette, not the brand:
the brand stays rust so it never collides with deck content.

## Typeface licensing

All first-choice faces are SIL Open Font License: Inter, Source Serif 4,
Archivo Black (plus Archivo / Space Grotesk / Noto Serif KR / IBM Plex
Mono in supporting roles). No font files are committed and none are
fetched: SVGs declare open-licensed first choices with system fallbacks,
so they render correctly on GitHub, in checkouts, and offline. Install a
named face locally only to match proofs exactly.

## Editing

- Text is live `<text>` — edit copy, tracking (`letter-spacing`), or size
  in any text editor. Never convert to outlines.
- Keep the rust period: it is the only accent and the recognition device.
- Backgrounds stay flat; do not add rules, boxes, shadows, or imagery —
  the identity demonstrates the product constraint.
- After edits, re-render to check:
  `rsvg-convert -w 1200 brand/typodeck-hero.svg -o /tmp/check.png`.

## Verification (this branch)

- All 8 SVGs rasterised with `rsvg-convert` and visually inspected at
  full width — all pass.
- Mobile probes: wordmark at 320 px, hero at 375 px — wordmark dominant
  and legible; kicker/tagline/proof degrade gracefully.
- Self-containment grep: no `<image>`, gradients, base64, `@import`, or
  `http` fetches (only the SVG namespace URI).
