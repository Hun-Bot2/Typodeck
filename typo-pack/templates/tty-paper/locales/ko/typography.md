# Paper TTY (tty-paper) — Korean Typography Override

Parent: `../design.md` (owns paper-terminal palette, prompt/gutter/status-bar
devices, table grid — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Geometry/palette/terminal devices inherit verbatim. Locale wins on type roles
+ Korean-run tracking/leading only. This design is ALL mono — the fallback
chain below is the entire adaptation.

## Font map (identity: paper terminal — Plex Mono everywhere + KR fallback)

| Parent role | Parent face | Korean face |
|---|---|---|
| ALL roles (session-title / section-head / subhead / body / prompt-line / comment-line / gutter-number / status-bar / label-dim / table-cell / counter) | IBM Plex Mono | IBM Plex Mono + KR fallback: `'IBM Plex Mono', 'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Apple SD Gothic Neo', monospace` |

No Korean mono committed (research §10): Hangul renders in Pretendard at the
role's size/weight; every Latin token keeps true Plex Mono metrics. Gutter
numbers and prompts (`$`, `>`, `#`) stay Latin — column alignment of CODE is
preserved; Korean prose columns align left, not on grid (documented
deviation: CJK-wide + Latin-narrow cannot share a monospace grid).

## Role overrides

- session-title/section-head: leading +0.08; keep-all (+ balance on title).
- body/table-cell: floor 1.6, keep-all.
- prompt-line: prompt char + Latin command nowrap; Korean comments wrap keep-all.
- status-bar/label-dim: 0 tracking for Korean; 400 → **500** under 20px.
- comment-line: Korean comments in Pretendard fallback at role size; `#`/`//`
  markers Latin.

## Breaking, spacing, density

- Code blocks: Latin code never wraps mid-token (`overflow-wrap: anywhere`
  only inside code spans as last resort); Korean comments wrap keep-all.
- Table cells: fixed grid widths kept; Korean cells may take +1 line.
- Gutter numbers right-aligned Latin, unchanged.

## Identity preserved

A printed terminal session: paper, prompts, gutters, status bar. Korean
operators read the same session log — machine text untouched, human words in
Pretendard at terminal size. The honest limit (no mono grid for prose) is
documented, not hidden.
