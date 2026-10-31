# Public-release readiness

Branch: `docs/launch-readme` (= `integrate/release-readiness:b09865c` plus
the accepted 447-reference research overlay from
`research/review-assets-2026-10-31:20cbcd2`). No code changes in this branch
beyond docs, research overlay, and one gallery path scrub.

## Recommended GitHub About metadata

- **Description:** Typography-only pitch decks from an idea or GitHub repo —
  editable PPTX with evidence-graded claims. (139 chars)
- **Topics:** `pptx`, `presentations`, `typography`, `pitch-deck`,
  `github`, `developer-tools`, `typescript`, `nextjs`, `agent-skills`,
  `korean` (drop any that feel forced; `pptx`, `typography`, `pitch-deck`
  are the core three).
- **Website:** none — no public deployment exists. Do not link localhost.
- **License display:** MIT (root `LICENSE`, holder Nam Jeong Hun).

## Ready

- README rewritten from observed behavior; every claim traces to
  `docs/EVIDENCE_TRACEABILITY.md`.
- Clean install (`npm ci`, 53 packages), core build (`tsc` exit 0), web
  build (exit 0), and 270/270 tests observed on this branch.
- Quick Start verified for idea mode (offline) and repo mode (live GitHub,
  56 claims / 47 verified), Studio `/` + `/api/generate` probed live,
  skill transcript `EXAMPLES.sh` exit 0.
- PPTX editability verified on a fresh deck (5 slides, 17 shapes,
  845 editable chars, 16:9, no media).
- Secrets sweep: no keys, tokens, or emails in tracked or shipped content;
  `.env` files ignored; provider key env-only and excluded from logs.
- Redistribution: no fonts, images, or binaries in the tracked tree except
  genuine Typodeck-generated `.pptx`/`.png` showcase and preview artifacts;
  direct dependencies are MIT-compatible (JSZip dual-licensed, used under
  MIT — keep its notice).

## Blockers and accepted risks

1. **History email:** commits `ad4c3db`/`899439b` are authored
   `Hun-Bot2 <surtrcode@gmail.com>`. Scrubbing requires history rewrite
   (declined); accept exposure or delay public launch.
2. **Stale showcase receipt:** `showcase/manifest.md` Deck 1 figures
   (7/38/29) disagree with two live runs (56/47). Re-run the showcase
   script before citing deck-1 numbers; README cites neither.
3. **Outdated specs:** `DESIGN_SYSTEM.md` (3 systems; tree ships experimental
   4th), `ARCHITECTURE.md` (8-module), `EVALUATION.md` (24-run),
   `NARRATIVE_AUDIT.md` (75/75 baseline) predate this branch. Refresh before
   presenting `docs/` as current architecture literature.
4. **Broken doc refs:** `STUDIO-AUDIT.md` cites `audit/` (renamed
   `audit-studio/`); `PROVENANCE.md` cites absolute `/tmp` paths;
   benchmark docs cite gitignored `output/`. Fix or drop before launch.
5. **Transitive licenses unaudited** (direct deps checked only).
6. **`core.xml` author fields** in generated PPTX unverified (`app.xml`
   clean: Company=PptxGenJS).
7. **Human evidence absent by design:** benchmark-90 protocol unexecuted,
   zero ballots/verdicts. No quality-win claims until executed.
8. **Skill distribution:** project skill only — no installer, marketplace,
   or registry listing. Document as checkout-and-point only.

## Before flipping to Public

- Decide blockers 1–4 (accept or fix).
- Re-run this checklist from a fresh clone (this report was verified from a
  clean worktree + `npm ci`, not a fresh machine).
- Do not publish packages, marketplace listings, or releases without
  explicit approval.
