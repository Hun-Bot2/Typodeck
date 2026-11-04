# Fonts Policy (design-diversity harness)

All designs load fonts from the Google Fonts CDN at render time.
**No font binaries are committed to the repo** — no `.woff`, `.woff2`,
`.ttf`, or `.otf` files anywhere under `typo-pack/` or `evals/`.

## Required loading pattern

Every `preview.html` puts this in `<head>` (families/weights per design):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Display-Face:wght@700;900&family=Body-Face:wght@400;500&family=Mono-Face:wght@400;700&display=swap" rel="stylesheet">
```

Rules:

- `display=swap` always, so first paint never blocks on fonts.
- Request only the weights the design actually uses.
- CJK designs add the CJK family (e.g. Noto Sans SC) as a separate
  `family=` entry; see each design's `design.md` CJK section.

## Disclosed fallback policy

Every `preview.html` font stack MUST end in a generic family, and every
`design.md` MUST disclose its per-role fallbacks in Known Gaps (or the CJK
section for CJK builds). Standard fallbacks by role:

| Role    | Fallback tail after the webfont              |
|---------|----------------------------------------------|
| Display | `, "Arial Black", sans-serif`                |
| Body    | `, system-ui, sans-serif`                    |
| Mono    | `, ui-monospace, monospace`                  |
| CJK     | `, "PingFang SC", "Microsoft YaHei", sans-serif` |

If Google Fonts is unreachable (offline, restricted network), the slide
still renders with these fallbacks; the harness screenshot is then a
fallback rendering and must be re-captured online before judging.

## Screenshot interplay

`screenshot.mjs` passes `--virtual-time-budget` to headless Chrome so
webfonts settle before the capture. If a capture shows fallback fonts,
re-run with a larger `--budget` (e.g. `--budget=15000`) on a live network.

## Per-design disclosure (copy into design.md Known Gaps)

```md
- **Fonts**: <Display> / <Body> / <Mono> via Google Fonts CDN
  (`display=swap`); fallbacks <display-fallback> / <body-fallback> /
  <mono-fallback>. No font files committed. Offline rendering falls back
  to system stacks and loses the display voice.
```
