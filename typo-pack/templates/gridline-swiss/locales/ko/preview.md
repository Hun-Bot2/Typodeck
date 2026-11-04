# Gridline — Korean Preview Card (`ko`)

Parent preview: `../preview.md` (selection metadata, palette, signature moves —
all apply). Korean override: `typography.md` in this folder.

## Korean preview rules

- Build exactly one title slide at 1920×1080, `lang="ko"`, fixed-stage model.
- Title in Pretendard 800 (fallback chain per `typography.md`), keep-all +
  `text-wrap: balance`, authored `<br>` at phrase boundaries.
- Kicker: Pretendard 700, 21px, red, NO caps/tracking on Korean; red square
  bullet unchanged.
- Rail numeral stays Archivo 800 Latin; footer `01 / 24` unchanged.
- Subtitle: Pretendard 400, 34px, 1.65 leading, keep-all.
- Load: Pretendard Variable (jsDelivr) + parent Archivo/Inter for Latin runs.
- Never place workflow text, slug, or template name on the slide.
