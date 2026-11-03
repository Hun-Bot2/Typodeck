# New Wave Static — Korean Typography Override

Parent: `../design.md` (owns static-noise texture, poster-shout scale,
band-caps strips, rotated chips, ghost numerals — ALL unchanged). Research:
`evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/static-texture/chips inherit verbatim. Locale wins on type
roles + Korean-run tracking/transforms/leading only.

## Font map (identity: punk-poster shout + intruder italic + caps bands)

| Parent role | Parent face | Korean face |
|---|---|---|
| poster-shout / deck-sub / band-caps / kicker-caps / rotated-chip / context-chip / footer-giant / ghost-numeral (Archivo/Black) | Archivo | Pretendard **800–900** per parent weight; ghost numerals stay Latin |
| intruder-italic (Newsreader italic) | Newsreader | Noto Serif KR **600 upright** (intrusion via serif contrast + rotation, not slant) |

Latin shout fragments (`NOIZE`, `LIVE`) keep Archivo Black. Korean: 0 tracking,
no transform, keep-all; shout leading +0.08.

## Role overrides

- poster-shout: +0.08 leading; keep-all + balance; rotation/collision layout kept.
- band-caps/kicker-caps: 0 tracking, no transform, 700–800, +1px.
- rotated-chip/context-chip: keep rotation; Korean nowrap-or-keep-all inside
  chip bounds; chips widen, never shrink type.
- intruder: serif-contrast intrusion at 600 upright; keep parent angle.
- footer-giant/ghost-numeral: Latin devices unchanged.

## Breaking, spacing, density

- Colliding type blocks: Korean blocks collide at the same angles — verify no
  particle-orphan collisions in render.
- Static texture overlays Korean display identically (script-agnostic noise).
- Setlist/data lines: Latin tokens nowrap; Korean wraps keep-all.

## Identity preserved

Xeroxed punk flyers: shouting Black Korean type, tilted chips, serif
intruders, static snow. Volume is weight + tilt + texture — fully portable.
