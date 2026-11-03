# Original-27 Forensic Matrix (Agent A, read-only audit)

Scope: CURRENT study only — `evals/hierarchy/study/cases.json` (study-v1, seed 20261103,
order S01–S27) + all 17 PNGs in `evals/hierarchy/results/screenshots/*.png`.
Human-study branch data untouched. User claims that S01–S06 / S12–S15 are mutually
distinct were treated as UNVERIFIED and judged independently below.
Mirror-risk note: PNGs render the HTML mirror, NOT PPTX (see README-NOT-PPTX.txt).

Legend: verdict DISTINCT = unique design identity (layout family x theme, language
ignored). DUPLICATE = shares its design identity with another case (twin, exact
re-render, or seeded-defect mutation of the same identity — see similar-to).
Render key: R=name of nearest PNG viewed; NONE = no dedicated PNG exists.

| case | fixture/system | layout | typography | palette (bg/ink/accent) | signature components | composition fingerprint | similar-to | verdict |
|---|---|---|---|---|---|---|---|---|
| S01 | F01/swiss | hero-number stack, full-width left | Helvetica Neue: kicker 35/700, number 231/700, title 57/700, caption 9/400 | #FFFFFF / #111111 / kicker #B00020 | red tracked kicker; clipped giant 94%; right caption | red-kicker/giant-number/bold-title/right-caption/45pct-empty-bottom; R=F01-swiss.png | C1 twin S07,S16; S19 defect child | DISTINCT |
| S02 | F02/swiss | 2-col split stats, kicker row | Inter: kicker 10/700, title 30/700, body 12/400, caption 9/400 | #F1F4F6 / #16232E / kicker #0B4F9C | blue kicker; 2R+1L stat cells; right caption | gray-ground/split-stats/right-caption/air-bottom; R=F02-swiss.png | C2: S23 exact; S08 theme-shift; S18/S22 defect children | DISTINCT |
| S03 | F03/editorial | chapter column x=1.0 | Georgia: kicker 11/500, title 46/700 serif, body 15/400, caption 10/400 | #FAF7F2 / #1A1A1A / kicker #7B2D26 | rust wide-tracked kicker; serif title w/ mid-glyph slice artifact; left caption | rust-kicker/serif-title/prose-block/left-caption; R=F03-editorial.png | C3 KO twin S09 | DISTINCT |
| S04 | F04/swiss | 2-col steps, no kicker | Courier New mono: title 30/700, body 12/400, caption 9/400 | #1E3A8A / #FFFFFF / caption #C3D2F5 | ONLY dark slide; mono everywhere; numbered steps 2R+1L | dark-mono/steps/right-caption; R=F04-swiss.png | C4: S24 exact; S20 geometry-swap child | DISTINCT |
| S05 | F05/document | doc column x=3.2, before/after list | Hiragino Mincho ProN: title 34/700, body 12.5/400, caption 9/400 | #F7F3E8 / #2B2B2B / caption #6E675C | parchment doc page; 4-line evidence list; right caption | parchment/doc-column/4-evidence/right-caption; R=F05-document.png | C5 KO twin S11 | DISTINCT |
| S06 | F06/document | doc column x=3.2, 5 findings | Trebuchet MS: title 34/700, body 12.5/400, caption 9/400 | #EDE6D6 / #292524 / caption #656054 | tan doc page; 5 wrapped findings; right caption | tan/doc-column/5-findings/right-caption; R=F06-document.png | theme sibling S15,S27; layout unique | DISTINCT |
| S07 | F07/swiss | IDENTICAL geometry to S01 | Helvetica Neue, same sizes/weights as S01 | #FFFFFF / #111111 / #B00020, same as S01 | same clipped-giant-number artifact; Korean text | pixel-twin of S01 modulo glyphs; R=F07-swiss.png | C1 twin S01 | DUPLICATE |
| S08 | F08/swiss | same geometry as S02 | Arial Narrow kicker+title / Arial body; same sizes as S02 | #FFFFFF / #111111 / kicker #1D4ED8 (bg+face+accent ALL differ vs S02) | brighter-blue kicker; white (not gray) ground; Korean text | white-ground/split-stats/right-caption; R=F08-swiss.png | C2 theme-shift sibling S02; S22 defect child | DISTINCT |
| S09 | F09/editorial | IDENTICAL geometry to S03 (caption y differs: shorter body) | Georgia, same sizes/weights as S03 | #FAF7F2 / #1A1A1A / #7B2D26, same as S03 | Korean serif title renders CLEAN (no slice artifact); Korean text | design-twin of S03; R=F09-editorial.png | C3 twin S03 | DUPLICATE |
| S10 | F10/document | doc column x=3.2, 3 steps | Arial title 34/700 + Courier New body/caption 12.5/9 | #F7F7F5 / #1A1A1A / caption #5F6B6B | near-white doc; mixed sans-title/mono-body; Korean text | graywhite-doc/mixed-faces/3-steps; R=F10-document.png | doc family; unique face mix | DISTINCT |
| S11 | F11/document | IDENTICAL geometry to S05 | Hiragino Mincho ProN, same sizes as S05 | #F7F3E8 / #2B2B2B / #6E675C, same as S05 | Korean text; else indistinguishable | pixel-twin of S05 modulo glyphs; R=F11-document.png | C5 twin S05 | DUPLICATE |
| S12 | F12/editorial | findings column x=1.0, no kicker | Palatino Linotype: title 46/700, body 15/400, caption 10/400 | #F5F2EA / #2B2B28 / caption #62625A | 5 Korean findings; left caption; ONLY Palatino slide | palatino-findings/left-caption/dense-top; R=F12-editorial.png | C8: S21 clip child | DISTINCT |
| S13 | F13/expressive | centered poster, 3 stacked blocks | Georgia 900: title 64/900, body 13/400, caption 10/500 | #FAF7F2 / #1A1A1A / caption #6B6259 | bottom-clipped LOUD title; centered body; centered poster caption | loud-center/centered-body/centered-caption; R=F13-expressive.png | C9: KO twin S14; S25 clip child | DISTINCT |
| S14 | F14/expressive | IDENTICAL geometry to S13 (body 14pt vs 13pt) | Georgia 900, same roles as S13 | #FAF7F2 / #1A1A1A / #6B6259, same as S13 | Korean poster; same title-clip artifact | design-twin of S13; R=F14-expressive.png | C9 twin S13 | DUPLICATE |
| S15 | F15/document | hero-rail: olive kicker + 60pt number left, title/body at doc col | Trebuchet MS: kicker 10/700, title 34/700, number 60/700, body 12.5/400 | #EDE6D6 / #292524 / kicker #5D6B1F olive | ONLY olive kicker; 2-zone hero rail; right caption | olive-rail/60pt-number/doc-title/right-caption; R=F15-document.png | theme sibling S06,S27; layout unique | DISTINCT |
| S16 | F15/swiss | IDENTICAL geometry to S01/S07 (hero-number stack) | Helvetica Neue, same sizes as S01 | #FFFFFF / #111111 / #B00020, same as S01 | same giant-number clip artifact; new Pantrylog content | third strike of C1 identity; R=F15-swiss.png | C1 twin S01,S07 | DUPLICATE |
| S17 | F16/editorial | minimal: serif title + left caption | Georgia: title 46/700, caption 10/400 | #FAF7F2 / #1A1A1A / caption #6B6259 | sparsest slide; title slice artifact; left caption | minimal-serif/left-caption/vast-void; R=F16-editorial.png | content triple S26,S27 (designs differ) | DISTINCT |
| S18 | F02/swiss | same boxes as S02 | title DEMOTED 30/700 -> 10/400 (smaller than 12pt body) | same as S02 | headline-prominence defect; rest identical | would render as S02 w/ tiny title; R=NONE (nearest F02) | C2 defect child of S02 | DUPLICATE |
| S19 | F15/swiss | same boxes as S16 | number 231/700 -> 87/900 (much smaller numeral) | same as S01/S16 | number-scale defect; rest identical | would render as S16 w/ small 32pct; R=NONE (nearest F15-swiss) | C1 defect child of S16 | DUPLICATE |
| S20 | F04/swiss | b0<->b1 RECT SWAP vs S04 (title in 5in right box, step1 in title box) | Courier New, same sizes as S04 | same as S04 | grouping-swap defect; 30pt title in 0.25in box will clip | broken twin of S04, same theme; R=NONE (nearest F04) | C4 defect child of S04 | DUPLICATE |
| S21 | F12/editorial | same boxes as S12 except b1 h x0.35 | Palatino, same as S12 | same as S12 | clip-support defect, ESTIMATE-ONLY (mirror may not clip) | near/exact twin of S12; R=NONE (nearest F12) | C8 defect child of S12 | DUPLICATE |
| S22 | F08/swiss | same boxes as S08 | kicker color #1D4ED8 -> #8ea7ec (50pct toward bg) | same as S08 | contrast-fail defect on kicker only | near-twin of S08; R=NONE (nearest F08) | C2 defect child of S08 | DUPLICATE |
| S23 | F02/swiss | IDENTICAL to S02 (narrative-only dangle-group) | identical to S02 | identical to S02 | status=excluded: renders identical to clean source | pixel-identical to S02; R=F02-swiss.png | C2 exact dup S02 | DUPLICATE |
| S24 | F04/swiss | IDENTICAL to S04 (narrative-only primary-on-caption) | identical to S04 | identical to S04 | status=excluded: renders identical to clean source | pixel-identical to S04; R=F04-swiss.png | C4 exact dup S04 | DUPLICATE |
| S25 | F13/expressive | same boxes as S13 except b1 h x0.35; origin=disputed | Georgia, same as S13 | same as S13 | clip-support defect, ESTIMATE-ONLY (mirror may not clip) | near/exact twin of S13; R=NONE (nearest F13) | C9 defect child of S13 | DUPLICATE |
| S26 | F16/swiss | swiss slots (title 0.6,2.35; caption right 6.8,6.3) — differs from S17 | Georgia 30/700 title + 9/400 caption (sizes differ vs S17) | #FAF7F2 / #1A1A1A / caption #6B6259 | same WORDS as S17, new geometry+sizes; hybrid swiss/editorial | unrendered; nearest R=F16-editorial.png for content only | content triple S17,S27 | DISTINCT |
| S27 | F16/document | doc slots (title 3.2,1; caption right 3.2,6.2) — differs from S17/S26 | Trebuchet MS 34/700 + 9/400 (face differs vs S17/S26) | #EDE6D6 / #292524 / caption #656054 | same WORDS as S17, doc theme; unrendered | unrendered; no near render | content triple S17,S26 | DISTINCT |

## Claim adjudication (independent)

- S01–S06 mutually distinct: CONFIRMED. Six different layout/theme identities, no twins.
- S12–S15 mutually distinct: PARTLY REJECTED. S12/S13/S15 are distinct; S14 is S13's
  Korean design-twin (identical geometry/theme/faces), not a distinct identity.
- Render coverage: 17 PNGs cover 17 case-render pairs; S18–S22/S25–S27 have NO
  dedicated PNG (6 defect/restyle cases unrendered); S23/S24 excluded but pixel-covered
  by F02/F04 PNGs.
- Mirror artifacts observed in PNGs (renderer, not design): giant-number bottom clip
  (F01/F07/F15-swiss), serif-title mid-glyph slice (F03/F16, absent in Korean F09/F12),
  expressive-title bottom clip (F13/F14).
