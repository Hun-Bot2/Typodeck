# Typodeck — Landing-Page Copy Recommendations

Status: proposed copy + rationale for a future landing page. Every claim below
maps to inspected code or measured eval output; the claims ledger at the end
gives the evidence pointer. "Never claim" list is binding.

> Note (2026-10-31): the landing page now exists
> (`apps/web/app/landing/`, route `/landing`) with its own verified copy
> (`data.ts` header cites code refs). The hero/pillar copy below is
> partially superseded by the live page; the claims ledger and the
> never-claim list remain normative. See `docs/DOCS_AUDIT.md`.

## Hero

**Headline:** Decks that cite their sources.

**Subhead:** Paste a repo URL or an idea. Typodeck builds a typography-only
slide deck where every number traces to its source — exported as an editable
`.pptx`, never a flattened image.

**Primary CTA:** Generate a deck (idea mode, no signup)
**Secondary CTA:** Read the docs / See the evidence model

*Rationale: leads with the differentiated outcome (cited sources), names both
inputs in one line, and closes the top objection of the category (uneditable
AI output). No "AI-powered" — the model endpoint is unverified; see ledger.*

## Proof bar (directly under hero)

- 24/24 eval runs pass · 100% of text editable · 0 fabricated refs in idea mode
- Every claim on this page traces to `evals/summary.json` or the linked source file.

## Three pillars

1. **Grounded, or labeled.**
   Repo mode extracts claims with file-and-line evidence. Anything ungrounded
   is printed on the slide as `unverified` — hypotheticals can't masquerade
   as facts.
2. **Editable down to the last character.**
   Native PowerPoint text boxes only. No images, no locked layouts, no text
   baked into pixels. Open it and rewrite any line.
3. **Deterministic.**
   A seeded layout engine places every box — no LLM in the geometry path. The
   same input reproduces the same deck, so decks are reviewable artifacts,
   not one-off generations.

## How it works (3 steps)

1. **Bring a repo or an idea.** Public GitHub URL (bounded fetch: ≤20 files,
   ≤200 KB) or 100–20,000 characters of description.
2. **Pick a direction.** Editorial, Swiss, Expressive — same facts,
   materially different composition — plus experimental Document, in English or Korean.
3. **Preview, then export.** Review all four layouts from one narrative,
   download the `.pptx`, edit anything.

## Comparison strip

"Most AI deck tools generate slides. Typodeck builds checkable ones."

| | Typodeck | Typical AI deck tool |
|---|---|---|
| Sources on the slide | File + line refs in captions | None |
| Ungrounded text | Labeled, never silent | Presented as fact |
| Numbers | Copied verbatim, ref required | Often hallucinated |
| File you get | Editable `.pptx` | Flattened or locked |

## FAQ snippets (for the page; full text in `docs/FAQ.md`)

- **Is the PPTX really editable?** 100% of characters in native text boxes —
  measured across 24 eval runs, not asserted.
- **What if my repo is huge or rate-limited?** Bounded fetch with disclosed
  caps; quota failures are typed errors with a reset time, never silent gaps.
- **Why no images?** Images are where generated decks hide fabricated charts
  and uneditable pixels. Type, numbers, whitespace, color — enough for a pitch.

## Footer line

Typodeck — typography-native decks from repos and ideas. MIT-licensed.

---

## Claims ledger (each line must keep its pointer)

| Landing claim | Evidence |
|---|---|
| Every number traces to a source | `packages/core/src/evidence.ts` (verbatim numbers + refs); `narrative.ts` (number slides require refs) |
| Editable `.pptx`, 100% | `export.ts` (addText-only); `evals/summary.json` S5 min 100.00% |
| Ungrounded text labeled | `narrative.ts` `captionFor` (`unverified`/`illustrative`/`proposal`); S-notes 0 fabricated / 0 unlabeled over 6 idea runs |
| Deterministic layout | `ARCHITECTURE.md` §4; seeded `layoutDeck`; reruns byte-identical except timestamps |
| Bounded repo fetch | `ingestion.ts` constants (20 files / 200 KB / 5 code files / 30 s) |
| 24/24 eval | `evals/summary.json` (seed 42, provider fallback, 2026-10-30) |
| KO/EN | `narrative.ts` `normalizeLang` + label tables; matrix runs both |

## Never claim

- "AI-powered" / model-quality language — no live endpoint verified
  (`docs/MUSE_PROVIDER.md`); fallback output must be labeled as such.
- Submit→preview latency figures — S7 measured `planDeck` wall time only.
- Overflow-proof rendering beyond the engine's own fitting (no separate clip
  detector exists).
- Speaker notes, PDF export, private repos, collaboration — out of scope.
