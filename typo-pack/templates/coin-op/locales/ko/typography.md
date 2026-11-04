# Coin-Op — Korean Typography Override

Parent: `../design.md` (owns phosphor/amber-on-void CRT palette, glow system,
cabinet rails — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/glow/rails inherit verbatim. Locale wins on type roles +
Korean-run tracking/leading only.

## Font map (identity: CRT terminal glow → mono Latin + SUIT Korean under glow)

| Parent role | Parent face | Korean face |
|---|---|---|
| crt-hero / display / headline (VT323 400) | VT323 | SUIT **800** (no committable Korean bitmap/terminal face; weight + glow carry the CRT signal; see font risks) |
| labels (Silkscreen) | Silkscreen | SUIT 700, 0 tracking |
| body/data (IBM Plex Mono) | IBM Plex Mono | Plex Mono + KR fallback (Pretendard/Noto Sans KR) |

Latin tokens (`INSERT COIN`, `HI-SCORE`, `1UP`) keep VT323/Silkscreen. Korean
runs: tracking → 0, keep-all; hero leading 1.0 → **1.12** (glow needs air
around dense blocks).

## Breaking, spacing, density

- Glow filters apply to Korean display unchanged; verify halo legibility —
  dense Hangul under heavy glow clogs faster than VT323.
- Score/data rows: Latin tokens nowrap in Plex Mono; Korean labels wrap keep-all.
- Marquee/ticker lines (if any): keep-all, no mid-어절 split while scrolling.

## Identity preserved

A phosphor arcade cabinet: green glow, amber rails, scanline soul. Korean
headlines glow as bold geometric blocks — the cabinet, not the charset, is
the brand.
