---
name: typodeck
description: Build typography-only pitch decks from a product idea, a local repo, or a public GitHub repo by orchestrating Typodeck Core (CLI, Studio API, validator) — never hand-drawn slides. Use when the user asks for a pitch deck, slide deck, PPTX, Demo Day or investor materials, or names Typodeck.
version: 0.1.0
---

# Typodeck Skill

You build typography-only pitch decks by ORCHESTRATING Typodeck Core.
You never lay out slides yourself, never emit PPTX XML, never invent numbers.

Announce first: "Following the Typodeck Skill: <idea|local|repo> mode, <systems>, provider <muse|fallback>, pipeline <baseline|improved>."

## Workflow (each step names its reference; read on demand, never all at once)

0. **Intent discovery** — inventory what you know, judge material
   ambiguity, ask at most one batched round (≤3 questions) only when
   needed, otherwise state assumptions and proceed. Never re-ask
   settled facts. Works in English and Korean. (`references/intent.md`)
1. **Local repo analysis** — agent-native bounded walk (≤20 files, ≤200 KB,
   ≤5 code files, secrets skipped) distilled to 100–20,000 chars of idea
   text. No local-ingestion API exists; the agent reads, Core renders
   in idea mode. (`references/local-analysis.md`)
2. **Remote public GitHub analysis** — `owner/repo` via Core's bounded
   fetch (same file/byte budget, 30 s, default branch, public only).
   Check quota first (`scripts/check-quota.sh`); at zero, SKIP honestly.
   CLI runs unauthenticated; tokens only via Studio env, `authToken`,
   or `journey --token-env`. (`references/remote-analysis.md`)
3. **Evidence extraction** — `extractClaims`: ≤24 claims/file, ≤60 total,
   280-char cap; repo claims start `suggestion`, idea claims
   `ungrounded`. (`references/evidence.md`)
4. **Claim verification** — numbers verbatim with `path:lines` refs;
   lifecycle tags from `displayStatus`; versions/years/hashes never
   heroes; deprecated never headlines. (`references/evidence.md`)
5. **Purpose-aware narrative** — `--preset P01..P10` (or legacy frozen
   `hackathon|competition|showcase`; `showcase` is NOT P04), 16-dim
   semantic model, integrity rules; author `intent:` lines for
   emphasis/grouping when the story needs them.
   (`references/purposes.md`, `references/density.md` for
   speaker-led vs reading-first, `references/semantic-hierarchy.md`)
6. **Engine invocation** — CLI-first (`npm run --silent deck -- …`);
   programmatic (`planDeck`/`planDecksAll`, `layoutDeck`, export,
   validate) for the improved pipeline and previews; Studio API is
   the same pipeline over HTTP. (`references/engine.md`)
7. **Design selection** — production registry systems
   (`editorial|swiss|expressive` 1.0.0; `document` 0.1.0 experimental,
   never the default). Generate once over all production systems from
   the SAME narrative, compare, export the chosen one; skip when
   already selected. Typo Pack's 27 entries are experimental themes,
   not systems: shortlist with `--suggest`, then apply one with
   `--template`, which re-themes its base system's geometry.
   (`references/visual-systems.md`, `references/composition.md`)
8. **Render inspection incl. overflow detection** — structural gates
   first (`validation: OK`), overflow via layout estimates + critic
   proxies (true PPTX wrapping is UNMEASURED — say so), then the
   adversarial eyes-on checklist; `--critique` appends the advisory
   receipt, findings read per the inspection guide.
   (`references/inspection.md`, `references/optical.md`,
   `references/visual-inspection.md`)
9. **Revision/repair** — bounded `reviseDeck` loop (`--revise[=N]`,
   ≤3 attempts, first error by class, content never rewritten for
   looks); provenance per attempt; residual findings +
   `visionUnmeasured` reported. (`references/revision.md`,
   `references/repair-policy.md`)
10. **Editable PPTX export** — Core export + immediate re-validation;
    native editable text, 0 forbidden objects, 16:9; notes to native
    PPTX notes; never patch a generated PPTX.
    (`references/export.md`)
11. **Evidence report** — every delivery ends with one: provider,
    claim counts + per-claim table, quality verdict, deck/system,
    warnings verbatim, validation + critic outcome, honest-skip
    block. (`references/export.md`)

Driving conversationally? Follow `references/intent.md`: inventory
known facts, ask one batched round (≤3 questions) only for material
gaps, otherwise proceed on stated assumptions — never interrogate
step by step, never re-ask settled facts.
Benchmark/A-B work: `references/evaluation.md`. Research citations:
`references/research-index.md` (cite IDs, never paste the corpus).

## Absolute constraints — typography only (DESIGN_SYSTEM.md)

Allow: editable text/numbers; family/size/weight; tracking; leading; left/center/right
alignment; whitespace; solid text + slide colors; editorial text-box composition.
Forbid: rectangles/cards/panels, borders, rules/arrows, icons/emoji, images,
rasterized/outlined text, gradients/shadows/textures. Theme tokens only (no ad-hoc
colors), body contrast ≥ 4.5:1, 16:9 canvas, margins ≥ 0.5 in.
If asked for a forbidden element: refuse that element, offer the typographic equivalent.

## Provider and fallback labeling (provider.ts)

- `muse` iff BOTH `TYPOdeck_MUSE_ENDPOINT` and `TYPOdeck_MUSE_API_KEY` are set
  (key sent as Bearer [REDACTED] never logged). Otherwise deterministic `fallback`.
- Always report provider + claim counts + warnings. Never present fallback output as model inference.

## Errors — surface the typed code plus the fix, never retry blindly

- CLI exit 2: usage. `idea-length` · `private-repo` / `not-found` ·
  `rate-limited` (wait for `resetAt`/retry once; else README-only degrade) ·
  `timeout` / `network` · `too-large` · `invalid-input` · `invalid-system` ·
  `invalid-narrative` · `body-too-large` · `layout-failed` ·
  `export-validation-failed` (do not ship; report the errors).
- API status map: `not-found`→404, `private-repo`→403, `rate-limited`→429,
  `too-large`/`body-too-large`→413, `network`→502, `timeout`→504, `invalid-*`→400,
  `internal`/`layout-failed`/`export-validation-failed`→500.

## Worked examples (runnable: `plugins/typodeck/skills/typodeck/EXAMPLES.sh [OUT]`)

- `examples/01-idea-deck.sh` — real idea fixture → 3 production systems → export.
- `examples/02-local-analysis.sh` — bounded local walk → idea text → deck (offline).
- `examples/03-remote-repo.sh` — quota check → live repo deck (SKIPs honestly at zero quota).
- `examples/04-evidence-report.mjs` — offline evidence report from real Core APIs.
- `examples/05-improved-pipeline.mjs` — offline improved pipeline → critic → validated PPTX bytes.
- `examples/06-eval-rerun.sh` — eval matrix + report when Phase 4 scripts exist.
- `examples/07-revise-loop.sh` — `--critique` receipt + `--revise[=N]` end-to-end.
- `examples/08-typo-pack.sh` — Typo Pack `--suggest` shortlist → experimental `--template` → validated export.
- `scripts/check-quota.sh` — GitHub quota probe (remaining + reset).

Each example asserts its own artifacts and prints PASS/SKIP/FAIL; the Skill
ships nothing without `validation: OK` (exit 0).

## Health checks

- `npm run --silent test` — whole core suite green.
- Honest-skip rule: any QA layer that cannot run must report
  `SKIPPED: <layer> (<reason>)` — never silent green, never a
  guessed pass.
- Every `.pptx` ships only with `validation: OK`: 0 forbidden objects, all boxes in-bounds, 16:9.
- Report uncertainty: unmeasured items (font substitution, real wrap, clipping,
  vision scores) are named in critic output — never claim them as verified.

## Portability

`SKILL.md` + `references/` + `examples/` + `scripts/` + `EXAMPLES.sh`;
shell + HTTP only, no harness-specific calls. Install paths per harness
(Muse Code, Codex, Claude Code) with verification evidence: `INSTALL.md`.
