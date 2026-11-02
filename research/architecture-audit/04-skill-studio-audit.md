# A5 Audit: Agent Skill + Web Studio + CLI + Gate Parity

Scope: `plugins/typodeck/skills/typodeck/*`, `apps/web` routes/components,
`packages/core` engine entry points. All claims verified by reading bodies below.
Note: the historical path `skills/typodeck/` no longer exists; the skill moved to
`plugins/typodeck/skills/typodeck/` (`skills/README.md` is a redirect stub).

## (1) Skill workflow steps vs the 17-step target

VERDICT: **current = 11 steps, all present and documented. The 17-step target
document was NOT found anywhere in the repo** (searched `docs/`, `research/`,
whole tree for "17-step"/"17 step"/"seventeen" — zero hits), so a per-step
present/missing score against the target cannot be produced. What follows is the
actual 11-step workflow with backing evidence per step.

| # | Step (`SKILL.md`) | Status | Backing |
|---|---|---|---|
| 1 | Local repo analysis (agent-native bounded walk) | PRESENT | `SKILL.md:16-19`, `references/local-analysis.md` (full body read) |
| 2 | Remote GitHub analysis (quota check, typed degrades) | PRESENT | `SKILL.md:20-24`, `references/remote-analysis.md`, `scripts/check-quota.sh` |
| 3 | Evidence extraction (`extractClaims` caps) | PRESENT | `SKILL.md:25-27`, `references/evidence.md:8-18` |
| 4 | Claim verification (verbatim numbers, lifecycle tags) | PRESENT | `SKILL.md:28-30`, `references/evidence.md:20-32` |
| 5 | Purpose-aware narrative (`--preset P01..P10`, 16-dim) | PRESENT | `SKILL.md:31-34`, `references/purposes.md`, `references/density.md` |
| 6 | Engine invocation (CLI-first, programmatic, Studio API) | PRESENT | `SKILL.md:35-38`, `references/engine.md` (full body read) |
| 7 | Design selection (all-systems compare, pinned versions) | PRESENT | `SKILL.md:39-43`, `references/visual-systems.md`, `references/composition.md` |
| 8 | Render inspection incl. overflow detection | PRESENT | `SKILL.md:44-48`, `references/inspection.md`, `references/optical.md` |
| 9 | Revision/repair (bounded `reviseDeck`, provenance) | PRESENT | `SKILL.md:49-52`, `references/revision.md` |
| 10 | Editable PPTX export (+ immediate re-validation) | PRESENT | `SKILL.md:53-56`, `references/export.md:5-19` |
| 11 | Evidence report (every delivery ends with one) | PRESENT | `SKILL.md:57-60`, `references/export.md:21-42` |

Observed capability deltas (NOT a reconstructed target — gaps seen in code that a
larger step-list would plausibly add): no CLI flag or API endpoint runs the
critic/revise loop (manual programmatic only, see §3); no vision-model render
verdict (explicitly unmeasured, `critic.ts:209-216`); no persisted run receipts
on Studio (see §6); no Skill step for benchmark A/B execution beyond a pointer
(`SKILL.md:65`, `references/evaluation.md`); Studio export drops the
composition plan (see §5).

## (2) Skill file layout + install/activation mechanics

VERDICT: **conformant progressive-disclosure skill, single-authored, triple-harness.**

- `SKILL.md`: **121 lines, 6989 bytes**. Frontmatter `name: typodeck`,
  trigger `description` (pitch deck/slide deck/PPTX/Demo Day/investor materials),
  `version: 0.1.0` (`SKILL.md:1-5`). Orchestrator-only: 11 steps each naming its
  reference ("read on demand, never all at once", `SKILL.md:14`).
- `references/`: **13 files, 704 lines total**: composition 50, density 48,
  engine 74, evaluation 31, evidence 41, export 42, inspection 55,
  local-analysis 46, optical 32, purposes 64, remote-analysis 49,
  research-index 27, revision 61, visual-systems 114. All bodies read.
- Root shims: 8 three-line "Moved" stubs (composition/density/evaluation/optical/
  purposes/research-index/revision/visual-systems.md) pointing into `references/`.
- `examples/`: 6 runnable (`01-idea-deck.sh`, `02-local-analysis.sh`,
  `03-remote-repo.sh`, `04-evidence-report.mjs`, `05-improved-pipeline.mjs`,
  `06-eval-rerun.sh`) + `EXAMPLES.sh` harness (builds core once, runs all six,
  PASS/SKIP/FAIL, exit 1 on any FAIL; `EXAMPLES.sh:18-45`).
- `scripts/`: exactly one file, `check-quota.sh` (probes
  `api.github.com/rate_limit`, always exit 0, `check-quota.sh:1-8`).
- Activation: harness skill discovery on frontmatter `description`; agent must
  announce `"Following the Typodeck Skill: <mode, systems, provider, pipeline>"`
  first (`SKILL.md:12`). Portable: "shell + HTTP only, no harness-specific calls"
  (`SKILL.md:119-121`).
- Install (`INSTALL.md`, plugin manifest `plugins/typodeck/.claude-plugin/
  plugin.json` with `"skills": "./skills/"`, marketplace
  `.claude-plugin/marketplace.json` → `./plugins/typodeck`): Muse Code =
  VERIFIED live (`muse skills validate` → valid; project `.agents/skills/
  typodeck/` trusted-ws; personal via `muse skills install`); Codex =
  DOCUMENTED (binary strings + docs, live load not executed); Claude Code =
  DOCUMENTED (official skills docs; `~/.claude/skills` absent on machine).
  Repo-root `skills/` is confirmed NOT auto-discovered (`INSTALL.md:28-29`).

## (3) Can the Skill drive iterative regeneration today?

VERDICT: **yes programmatically, no via CLI/API — the loop exists in Core but no
surface wires it end-to-end; the agent must hand-orchestrate.**

- Loop primitive exists: `reviseDeck(narrative, systemId, {maxAttempts=3})` →
  `{deck, plan, reports, provenance, attempts}` (`critic.ts:238-298`). Each
  attempt: `layoutDeck` → `applyOpticalCorrections` → `validateDeck` →
  `critiqueDeck`; stops on zero errors, no-alternate, or max attempts; fixes the
  FIRST error only (semantic demote to `metric-anchored`, else alternate
  same-type candidate); content never rewritten (`critic.ts:249-293`).
- Receipts exist: per-attempt provenance lines (`critic.ts:257,261,268,276,289,291`),
  full `CriticReport[]` history, `CriticScores` (typographicFit, opticalQuality,
  compositionVariety, contrastAA; `critic.ts:34-50`), `visionUnmeasured[5]`
  always populated (`critic.ts:209-216`).
- Validation status exists: `validateDeck` (in-memory) + `validatePptx*` →
  `{ok, errors, stats}` (`validate.ts:130-190`).
- Rendered-overflow gate exists but needs Chrome: `renderMeasureHtml` +
  `measureHtmlWithChrome` (needs `$TYPODECK_CHROME` or well-known binary;
  throws → caller reports unmeasured, `critic.ts:555-598`); pure detection
  `detectRenderedOverflow` + `critiqueRenderedOverflow` (`critic.ts:366-444`).
- THE GAP: `make-deck.ts` never calls `critiqueDeck`/`reviseDeck` (chain is
  `planDeck` → `exportToPptx` → `validatePptx`, `make-deck.ts:63-86`). Studio
  `/api/generate` and `/api/export` never call them either (grep over
  `apps/web/app` + `components/studio`: zero critic imports; only a TODO comment
  reserving the Proof-tab mount point, `WorkspaceStep.tsx:16-17`). The ONLY
  wired loop is the worked example `05-improved-pipeline.mjs:47-78`
  (compose → art-direct → layout → optical → critique → revise → export →
  validate). So iterative regeneration today = agent writes/runs ad-hoc node
  against `@typodeck/core` exports (`index.ts:1-23` re-exports `critic`).

## (4) Actionable repair feedback to the agent?

VERDICT: **yes — typed finding schema with per-finding fix strings.**

- `CriticFinding {slideId, failureClass, check, severity, detail, suggestedFix}`
  (`critic.ts:25-32`). 4 failure classes (`semantic|structural|typographic|
  perceptual`, `critic.ts:23`). EVERY finding site carries a concrete
  `suggestedFix` (e.g. bounds → "re-layout at smaller scale…", `critic.ts:77`;
  overflow-risk → "…confirm with critiqueRenderedOverflow", `critic.ts:91`;
  unsupported-metric → "demote to metric-anchored", `critic.ts:165`;
  overflow-visible → "grow the box…or explicitly opt in", `critic.ts:433`).
- `QualityIssue {code, severity, slide?, detail}` (`quality.ts:20-25`); top 8
  issues are folded into `provenance.warnings` as
  `"quality <severity> [<code>] on <slide>: <detail>"` (`narrative.ts:859-867`).
- `PptxValidationResult {ok, errors: string[], stats}` with counts
  (`validate.ts:13-23`); CLI prints each as `validation error: …` and exits 1
  (`make-deck.ts:82-85`); Studio export returns `export-validation-failed` + errors
  array (`export/route.ts:91-95`).
- Caveat: feedback reaches the agent ONLY on surfaces that invoke the critic
  (programmatic/Skill-manual today); CLI/Studio runs surface quality warnings +
  validator errors but never critic findings (see §5).

## (5) Web Studio vs Skill vs CLI: same engine? same gates?

VERDICT: **same engine family (`runToNarrative` + layout + export + validate), but
NOT the same entry points and NOT the same gates. Critic/revise run nowhere in
CLI or Studio; Studio export re-lays-out and drops the composition plan; the
char-floor gate differs.**

Call chains (quoted):

- CLI (`packages/core/scripts/make-deck.ts:63-86`):
  `planDeck(input, {system, purpose?, preset?, lang?})` → `exportToPptx(deck, out)`
  → `validatePptx(out, expectedChars=SUM(block.content.length))` → receipts
  (`provider:/claims:/quality:/deck:/warning:/validation:`) → exit 2 usage /
  exit 1 typed failure / exit 0 + `validation: OK`. No token flag
  (unauthenticated quota). No `--preset` default handling beyond passthrough.
- Studio generate (`apps/web/app/api/generate/route.ts:203-242`):
  `planDecksAll(input, {purpose, lang, timeoutMs:60s, authToken: githubToken(),
  cache, selection, variant, durationMin, emphasis}, onStage→SSE)` — lays out ALL
  `SYSTEM_IDS` from the SAME narrative (`narrative.ts:966-999`) → response
  `{narrative, decks, provenance, slideMarkdown, source}`. 64 KB body cap, 115 s
  race timeout (`generate/route.ts:21-23`). Claims/raw files stay server-side.
- Studio export (`apps/web/app/api/export/route.ts:62-95`):
  `resolveVisualSystem(system)` → `layoutDeck(postedNarrative, system)` (SERVER
  RE-LAYOUTS; client geometry never trusted; **no `compositionPlan` passed, so an
  improved-pipeline plan is silently dropped back to baseline layout**) →
  `exportToPptxBuffer` → `validatePptxBytes(buffer, 100)` (**fixed 100-char floor
  vs CLI's exact expectedChars**). Client posts `{narrative, system,
  generatedBy?, provenance?}` from `page.tsx:287-331` (`exportDeck`).
- Studio markdown re-render (`apps/web/app/api/markdown/route.ts:42-75`):
  `parseSlideMarkdown` → `slideIRToNarrative` → per-system `layoutDeck` +
  `validateDeck`; unrenderable systems skipped honestly.
- Studio evidence (`apps/web/app/api/evidence/route.ts:96-146`):
  `fetchRepo`/`acceptIdea` → `extractClaims` → per-claim `{id,text,kind,status,
  refs,numbers,url}` + counts/warnings/degraded/requests. Inspector edits flow
  back as strictly validated `EvidenceSelection` (`generate/route.ts:70-114`,
  `page.tsx:212-221`).
- Skill CLI-first path = the CLI chain above (`references/engine.md:7-26`).
  Skill programmatic path = `planDeck`/`planDecksAll` + `planCompositions`/
  `planArtDirection` → `layoutDeck({compositionPlan})` →
  `applyOpticalCorrections` → `critiqueDeck`/`reviseDeck` → export → validate
  (`references/engine.md:28-57`; worked code `05-improved-pipeline.mjs`).

Gate matrix:

| Gate | CLI | Studio | Skill-programmatic | Eval/benchmark |
|---|---|---|---|---|
| `validateDeck` (in-memory) | YES (via `labelDeck`, `narrative.ts:885`) | YES (generate via `labelDeck`; markdown `markdown/route.ts:66`) | YES (`05:55`) | n/a |
| `validatePptx*` (ship gate) | YES, exact chars (`make-deck.ts:69`) | YES, floor=100 (`export/route.ts:90`) | YES, exact (`05:77`) | YES (`journey.ts:187`) |
| `evaluateNarrative` quality | advisory warnings only (`narrative.ts:859-867`; "never throws, never fails a build", `quality.ts:1-5`) | same (counts not even shown; `Provenance` type lacks quality, `types.ts:52-58`) | same | metrics |
| `critiqueDeck` | NO | NO | YES (`05:59`) | YES (`benchmark-90.ts:128`) |
| `reviseDeck` | NO | NO | YES (`05:68`) | NO (critique-only) |
| rendered overflow (`measureHtmlWithChrome`) | NO | NO | available, needs Chrome + agent wiring | test-covered (`overflow-gate.test.ts`) |

## (6) Evidence/provenance artifacts per surface

VERDICT: **uniform in-memory provenance shape; unevenly surfaced; nothing
persisted per-run except the PPTX (and showcase sidecars).**

- Core shape (all surfaces): `provenance {provider, generatedBy, claims{total,
  verified,suggestion,ungrounded}, warnings[], quality{pass,overall,errors,
  warnings}, requests?{api,blobs,cached}}` (`narrative.ts:917-930,990-997`).
  `deck.meta.generatedBy` (`fallback` vs `typodeck:<id>`, `narrative.ts:879-887`)
  + `deck.meta.provenance {repo,branch,sha}` for repo mode.
- CLI: stdout receipts only (`provider:/claims:/quality:/deck:/warning:/
  validation:`, `make-deck.ts:71-86`). No file artifact besides the PPTX.
- Studio: `ProvenancePanel` shows provider/generatedBy/requests/source/claims/
  warnings (`ProvenancePanel.tsx:6-67`) — but NOT quality scores (dropped from
  the client `Provenance` type, `types.ts:52-58`) and NOT critic output (mount
  point reserved, `WorkspaceStep.tsx:16-17`). `EvidenceResult` (files/claims/
  counts/warnings/degraded/requests) powers Review (`evidence/route.ts:130-146`,
  `ReviewStep.tsx`). Export response headers only `X-Typodeck-Slides`
  (`export/route.ts:97-104`). No downloadable report.
- Skill: evidence-report recipe (`references/export.md:21-42`, 7 receipt items
  incl. honest-skip block) with offline generator `04-evidence-report.mjs`
  (writes `04-evidence-report.md`: per-claim table id/kind/status/numbers/refs/
  text + captions, `04:32-57`). Revision provenance lines + critic reports +
  `visionUnmeasured` complete the loop receipts (`05:61-70`).
- Sidecars: `docs/showcase/*.provenance.json` (static showcase only); eval
  `summary.json`/`decisions.json`; no per-run receipt writer in CLI/Studio.

## (7) Exact surface for the Skill workflow upgrade (minimal disruption)

VERDICT: **all upgrade targets are additive; the engine API is already exported.
Smallest coherent change-set:**

1. `packages/core/scripts/make-deck.ts` (after `planDeck`, before export): add
   opt-in flags `--critic --revise [--max-attempts N]` invoking the already-
   exported `critiqueDeck`/`reviseDeck` (`index.ts:23`), printing
   `critic:`/`revise:`/`provenance:` receipt lines in the existing receipt style
   (`make-deck.ts:71-86`). Default OFF → baseline determinism + existing tests
   untouched. Closes the "Skill prescribes a loop the CLI cannot run" gap (§3).
2. `apps/web/app/api/`: add `POST /api/critique {narrative|deck, system}` →
   `{findings, scores, visionUnmeasured}` reusing `critiqueDeck` (+ optional
   `critiqueRenderedOverflow` over posted measurements); mount results in the
   Proof tab at the reserved point (`WorkspaceStep.tsx:16-17`). No generate/
   export contract change.
3. `apps/web/app/api/export/route.ts:74` (+ `page.tsx:287-331`): accept and
   forward an optional validated `compositionPlan` to `layoutDeck`, and raise
   the char floor from fixed `100` (`export/route.ts:90`) to the CLI rule
   (exact expectedChars) — removes the two silent gate divergences in §5.
4. `plugins/typodeck/skills/typodeck/SKILL.md` steps 8–9 + `references/
   revision.md` + `references/engine.md`: document the new flags/endpoint as the
   canonical loop (replacing "write ad-hoc node"); add `examples/07-critic-
   loop.sh` asserting `critic:` + `validation: OK`; extend `EXAMPLES.sh`
   (`EXAMPLES.sh:36-41` pattern). No harness/install change (`INSTALL.md`
   untouched).
5. Optional parity hardening (deferrable): surface `quality` summary in Studio
   `Provenance` type (`types.ts:52-58`) and `ProvenancePanel`; add a `--receipt-
   out` JSON writer shared by CLI/Studio for per-run artifacts (§6 gap).

## File:line evidence index

Key bodies read (all): `SKILL.md` (121 lines), `INSTALL.md`, `EXAMPLES.sh`,
`references/*.md` (13 files), `examples/01,04,05,06`, `scripts/check-quota.sh`,
`make-deck.ts`, `critic.ts` (608 lines), `narrative.ts:800-999`, `quality.ts:1-60`,
`validate.ts:1-190`, `index.ts`, `generate/route.ts`, `export/route.ts`,
`evidence/route.ts`, `markdown/route.ts`, `page.tsx`, `api.ts`, `types.ts`,
`steps.ts`, `ProvenancePanel.tsx`, `WorkspaceStep.tsx:1-40`.
