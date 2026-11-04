# Modulo — Korean Preview Card (`ko`)

Parent preview: `../preview.md` (selection metadata, palette, 4×4 tile grid —
all apply). Korean override: `typography.md` in this folder.

## Korean preview rules

- Build exactly one title slide at 1920×1080, `lang="ko"`, fixed-stage model.
- Hero in SUIT 800 at parent clamp size, 1.12 leading, keep-all + balance.
- Tile-strip labels: SUIT 700, 0 tracking, no caps; strips never cross gutters.
- Stat numerals stay Sora tabular Latin; Korean unit suffix nowrap.
- Body in SUIT 400/500, keep-all; micro-type floors per `typography.md`.
- Load: SUIT Variable (jsDelivr) + parent Sora/Inter for Latin runs.
- Never place workflow text, slug, or template name on the slide.
