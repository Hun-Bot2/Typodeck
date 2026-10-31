# Typodeck FAQ

## Is this AI-powered?

Partially — and we label exactly which part. Typodeck has a `ModelProvider`
interface with an env-gated Meta Muse provider, but **no live model endpoint
has been verified** (details: `docs/MUSE_PROVIDER.md`). Today every deck is
planned by the deterministic fallback and labeled `generated_by=fallback` in
its receipt and metadata. Claim extraction itself is deliberately model-free:
pure deterministic code, so grounding can never be a stochastic accident.

## How is this different from other AI deck generators?

Three mechanics, all enforced in code rather than promised in prose:

1. **Evidence gating** — factual claims carry file path + line refs; ungrounded
   text is labeled `unverified`/`illustrative`/`proposal` on the slide.
2. **Typography-only output** — the exporter emits native text boxes only; a
   structural validator scans every PPTX for forbidden objects.
3. **Deterministic layout** — seeded geometry; the same input reproduces the
   same deck (reruns differ only in file timestamps).

## Is the `.pptx` really editable?

Yes. 100% of visible characters live in native editable text nodes — measured
at min 100.00% across the 24-run eval matrix (`evals/summary.json`, S5). Open a
deck in PowerPoint or LibreOffice and edit any text box inline.

## What about text overflow? Slides always break somewhere.

The layout engine measures every box against the 16:9 canvas and remediates
(step-down, wrap) before export; overflow is a release gate (S6: 0 across the
matrix). Caveat, stated honestly: the harness counts "boxes exceeding bounds"
and there is no separate clipped-text detector beyond the engine's own fitting.

## Which languages? Why do Korean decks work?

KO and EN. Korean uses character-level break rules and KR-capable font chains
(Pretendard / Noto Sans KR; Noto Serif KR for Editorial headings); English uses
word-level rules with Inter/system fallbacks. Every fixture runs in both
languages in the eval matrix.

## Which repos can I use?

Public `owner/repo` (or full `github.com` URL) on the default branch — or a
pinned branch for evals. Private repos are rejected with a typed
`private-repo` error. Retrieval is bounded: ≤20 files, ≤200 KB total, ≤5 code
files at ≤10 KB each, 30 s timeout. Hitting a bound degrades gracefully with a
recorded warning instead of failing silently.

## What happens when GitHub rate-limits me?

Unauthenticated calls share hourly quota. Typodeck retries once after back-off,
then either degrades to README-only (labeled `degraded`, warning recorded) or
fails honestly with `rate-limited`. The Phase 4 eval hit quota 0 mid-matrix and
recorded 5 honest failures before the rerun went 24/24.

## Why no images, charts, or icons?

Deliberate constraint, not a missing feature. Decorative visuals are where
generated decks smuggle in fabricated content (fake charts, stock metaphors)
and uneditable pixels. Typodeck's thesis: type, numbers, whitespace, and color
are enough for a pitch — and everything stays editable and checkable.

## Can I use the model provider with my own endpoint?

Yes. Set both `TYPOdeck_MUSE_ENDPOINT` (OpenAI-compatible chat-completions
URL) and `TYPOdeck_MUSE_API_KEY`. The key travels as a Bearer [REDACTED] and never
appears in metadata, logs, or errors. With either variable missing, the
fallback plans every deck and says so.

## Can I use Typodeck commercially?

The code is MIT-licensed. One caveat: font-embedding/redistribution licenses
for the deck font chains are not yet verified — confirm before redistributing
decks commercially.

## What does Typodeck explicitly not do?

No database, auth, cloud hosting, collaboration, animations/transitions,
PDF export, private-repo access, or image generation. (Speaker notes do ship:
they ride along to native PPTX notes, never rendered on slides.) See
`docs/PRD.md` §7.

## `HEAD` doesn't build — is the repo broken?

`main` at `ff68b70` intentionally commits code fragments — its message states
"this snapshot does not build standalone." This branch
(`integrate/release-readiness`) restores the full context and verifies it
from a clean checkout (270/270 tests, web build OK); run the README
quick-start here.

## How do I re-run the evaluation?

```sh
npm run eval:fixtures   # re-verify pins against live GitHub
npm run eval            # full 4×2×4 matrix, 32 runs (needs GitHub quota for F1–F3)
npm run eval -- --fixture F4   # offline-only subset, no network needed
npm run eval:report     # → evals/summary.json, OVERALL PASS/FAIL + S1–S7
```

## Where do I start as a contributor?

`CONTRIBUTING.md`, then `docs/ARCHITECTURE.md`. Run `npm test` before every
push; ship `.pptx` changes only with `validation: OK`.
