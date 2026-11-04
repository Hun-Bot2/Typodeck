# Ma — Korean Typography Override

Parent: `../design.md` (owns ma/negative-space composition, seal device,
zen palette — ALL unchanged). Research: `evals/hackathon/ko-typography.md`.

## Inheritance contract

Composition/palette/seal inherit verbatim. Locale wins on type roles +
Korean-run tracking/leading only. (Parent already stacks Noto Serif KR / Noto
Sans KR as fallbacks — this locale promotes them to primary for `ko` and
drops the Japanese-first faces to Latin/ornament duty.)

## Font map (identity: zen minimalism — already CJK-aware)

| Parent role | Parent face | Korean face |
|---|---|---|
| zen-display / zen-numeral / zen-seal (Shippori Mincho) | Shippori Mincho | Noto Serif KR **600** (primary; Shippori kept for Latin/kanji ornament only) |
| zen-subtitle / zen-context / zen-body (Zen Kaku Gothic New) | Zen Kaku | Pretendard 400/500 (primary; Zen Kaku kept for Latin runs) |

Chains: `'Noto Serif KR', 'Shippori Mincho', serif` and `'Pretendard Variable',
Pretendard, 'Zen Kaku Gothic New', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif`.

## Role overrides

- zen-display: leading +0.08; keep-all + balance; vast whitespace unchanged —
  Korean blocks need the same ma, not more.
- zen-seal: Korean seal text (`여백`, edition marks) in Noto Serif KR 700,
  0 tracking; seal square geometry unchanged.
- zen-body: floor 1.7 (meditative measure), keep-all.
- zen-numeral: numerals stay Latin; Korean counters nowrap with numeral.

## Breaking, spacing, density

- Ma is sacred: Korean leading growth NEVER eats the void — shorten copy
  instead of tightening space.
- One idea per slide; centered compositions recenter under the Korean block.
- Vertical-text devices (if any) stay Latin/Japanese-only — Korean renders
  horizontal (research §1; slides are horizontal writing).

## Identity preserved

Zen void with a single deliberate mark. Korean Ma is the most faithful
translation of all: the design was already CJK-aware, so only primacy flips.
