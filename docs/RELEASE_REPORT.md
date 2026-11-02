# Typodeck Release Engineering Report (RC line)

- RC branch: `integrate/release-candidate` (this commit + NOTICE; see log tail)
- Baseline: `integrate/release-readiness` @ `b09865c` (strictly ahead of stale `main` @ `ff68b70`)
- Lead: multi-agent orchestration, 8 workstream agents, all integrated with zero merge conflicts
- Date: 2026-10-31. All commands below were observed on the RC worktree unless noted.

## A. Product status

Implemented: purpose-aware narratives (idea + local/remote repo modes), GitHub evidence
inspection with bounded retrieval, claim verification statuses, Slide Markdown + versioned
Slide IR, 4 registry systems (swiss/editorial/expressive + experimental `document`),
composition engine with G1 monumental-numeral + G3 explainer-columns candidates and a
candidate index, rendered overflow gate (headless-Chrome scroll/client per block),
HTML preview, native editable PPTX export, Studio workspace (Create→Review→Studio→Export),
showcase gallery with honest labels, installable Agent Skill (11-step orchestrator +
14 references + 6 runnable examples), CI workflow, Dockerfile, DEPLOYMENT/ENV/DISTRIBUTION docs.
Experimental: `document` system (never default; diversity gap vs swiss, see §D).
Missing: inbound rate limiting, security headers, `/api/health`, public hosting,
marketplace publication, blind A/B superiority study.
Known limitations: PPTX *rendering* unverified (no Office automation; parity is
structural + validator); Codex/Claude live skill loads not executed (documented only);
G4 grammar blocked by 400pt cap; O1–O5 unpromoted by design.

## B. Agent workstream results

| Agent | Branch @ SHA | Scope/files | Tests/results |
|---|---|---|---|
| A clean-code | `agent/a-core-clean` @ `8e8a3ad` (4 commits) | core ingestion/evidence/narrative/purposes/semantics + purposes.test (+58/−36) | 272/272; legacy 36-case freeze green; dependency map; deferred legacy-planner merge |
| B skill | `agent/b-skill` @ `76a9570` (5 commits) | `skills/typodeck/**` only, 32 files: SKILL.md orchestrator, 14 references, 6 examples, check-quota.sh, EXAMPLES.sh, INSTALL.md | EXAMPLES.sh exit 0, 6/6 incl. live repo (56 claims, 47 verified); compat: Muse VERIFIED, Codex/Claude DOCUMENTED |
| C engine | `agent/c-composition` @ `d0c5166` (3 commits) | critic/composition/layout + overflow-gate + grammar-g1g3 tests + output/agent-c decks | 347/347; overflow gate + G1/G3 + candidateIndex(); before/after decks with measurements |
| D studio | `agent/d-studio` @ `9887bc1` (3 commits) | `apps/web/**`: step workspace, inspector, showcase page + assets + generator scripts | 270/270 (branch-local), tsc clean, web build clean, 20/20 CDP interaction suite, screenshots |
| E docs | `agent/e-docs` @ `1025e62` (4 commits) | README rewrite, DOCS_AUDIT, 9 RECONSTRUCTED ADRs, core README | every documented command re-run (npm ci, tsc, 270/270, deck CLI incl. live repo 56/47, eval F4 8/8, EXAMPLES.sh, web build) |
| F hosting | `agent/f-hosting` @ `8d76201` (3 commits) | ci.yml, Dockerfile, .dockerignore, DEPLOYMENT.md, ENV.md | npm ci, 270/270, tsc, web build, next-start probes incl. generate→export 54KB pptx; full docker build unverified (no daemon) |
| G benchmark | `agent/g-benchmark` @ `032fae2` | 68 new files under `evals/product-benchmark/` | A/B MIXED verdict (see §D); reproduced OVERALL FAIL + font-quoting bug |
| H distribution | `agent/h-distribution` @ `a4ea60c` (1 commit) | `docs/DISTRIBUTION.md` (+452) | live: muse validate/install/discovery/marketplace, skills.sh detection, npm/GitHub name checks; license flag → research/NOTICE.md |

Integrator fixes on RC: (1) critic.ts font-stack quote escaping + 3 regression tests;
(2) tabular digit width for R1 (removed narrow-'1'); (3) research/NOTICE.md (this report).
No agent touched another's area; research/gallery read-only except integrator NOTICE + merge.

## C. Architecture and code quality

- Map (Agent A): web→core one-directional, no cycles; narrative is the hub (9 imports);
mild smell: slide-ir imports narrative (formatRef) + composition (classifySlide).
- Rendering duplication found, not yet consolidated: inch→% templates in SlideView +
preview-experimental + visual-benchmark; canvas constants re-declared; fontFor vs
fontFaceFor. Recommended follow-up behind one core HTML-preview helper.
- Shared engine verified: Studio calls API routes + @typodeck/core only (D);
Skill invokes Core CLI/APIs only, zero rendering duplication (B, H-verified).
- Debt: legacy vs preset planner duplication (~200 lines, frozen path — coordinated pass
needed); E's landing MAX_CLAIMS comment/code mismatch (40 vs 60) needs code owner.

## D. Typography quality

- Production grammars: G1 `opening-monumental-numeral` + G3 `evidence-explainer-columns`
(R1–R3 responsive rules), matrix-tested short/med/long × swiss/editorial × EN/KO —
every cell validates, renders clip-free, exports editable PPTX (59/59).
- Research-only: G2 unprobed, G4 blocked, O1–O5 single-instance (asserted unpromoted).
- Overflow: rendered gate catches validator-silent clips (G reproduced 4 expressive
clips on the product path that only the gate caught); static overflow-risk companion;
layout retries smaller scales. Font-quoting fix included (mirror previously measured
in fallback fonts for quoted stacks).
- A/B benchmark (G, run 4, n=2 synthetic fixtures): MIXED — B wins contrast (0 vs 18
fails), diversity, traceability precision, PPTX; A wins raw accuracy (1.0 vs 0.889/0.931,
driven by one "8000" idea-header leak, labeled unverified with intact ref chain) and
zero-overflow uniformity. Superiority NOT established; blind study pending (n=0).
- Pre-existing eval FAIL carried honestly: `design-diversity FAIL on 2/30 pairs
(F4 document~swiss EN+KO)`, OVERALL FAIL exit 1 — also fails on pristine b09865c.

## E. Documentation

- README rewritten (15 sections) from verified runs; DOCS_AUDIT classifies all docs
(4 current, 3 fixed, 7 historical, 1 partial-superseded, 0 duplicates/obsolete).
- 9 ADRs reconstructed with code evidence, all marked RECONSTRUCTED (prior ADRs exist
only on unrelated `docs/launch-readme@aecb800`; numbering reconciliation deferred).
- DEPLOYMENT/ENV/DISTRIBUTION new; IMPLEMENTATION_LOG appended; internal links fixed
by E. This report + research/NOTICE.md added by integrator.

## F. Agent Skill

- Install: `skills/typodeck/INSTALL.md` (per-harness paths, evidence levels).
- Compat: Muse Code VERIFIED live (project/user/symlink discovery, negatives,
marketplace via local git); Codex DOCUMENTED (binary strings v0.165.0, official docs);
Claude Code DOCUMENTED (official docs; `claude doctor` hung); skills.sh VERIFIED
detection, DOCUMENTED add (needs public repo).
- E2E: EXAMPLES.sh 6/6 on RC (idea→3 systems, local analysis, live repo, evidence
report, improved pipeline with critic+revise, eval rerun), artifacts in /tmp.
- Registration readiness: metadata valid; names clear (npm `typodeck` free; github
`typodeck/*` org taken, unrelated); blockers: no public repo, no live Codex/Claude
sessions, skill LICENSE + version tags requested (H §7, not yet applied).

## G. Hosting

- Recommendation (F): container host (Render/Railway/Fly.io) + provided Dockerfile
(Node server, maxDuration=120 rules out Vercel Hobby 60s; Vercel Pro ≈$20/mo
zero-ops alternative; VPS cheapest, most ops). Zero state; secrets server-side only
(no NEXT_PUBLIC_*); outbound only api.github.com.
- CI: ci.yml (test + type-check + prod build) committed, YAML-parsed; not yet run on
GitHub (no remote push performed).
- Env: TYPOdeck_MUSE_{ENDPOINT,API_KEY,MODEL}, GITHUB_TOKEN/GH_TOKEN, PORT, NODE_ENV —
full table in docs/ENV.md. `.env` git-ignored (ad4c3db); no secrets in tree.
- Public-deploy blockers: B1 no inbound rate limiting, B2 confirm 120s timeout on host,
B3 full docker build with daemon, B4 security headers. NO public deployment performed
(no authorization, as instructed).
- Review server (this session, managed process — ends with session; macOS has no
setsid for detachment): production `next start` from RC worktree on :3211 —
root/showcase/catalog 200; round-trip idea→5 slides→4 decks→78KB PK-valid PPTX with
native text. Restart: `cd <rc-worktree>/apps/web && PORT=3211 npm run start -- --port 3211`.

## H. Hackathon demonstration

1. Real repo: `sindresorhus/is` (E: 56 claims/47 verified) or offline FX fixtures (G).
2. Agent with Typodeck Skill: `bash skills/typodeck/EXAMPLES.sh /tmp/out` (exit 0).
3. Inspect: `04-evidence-report.md` + Review step (exclude/reframe, sha guard).
4. Generate: Studio Create→Review→Studio→Export, or `deck` CLI; G1/G3 compositions.
5. Quality: overflow gate clean on showcase decks; editable PPTX (validatePptxBytes).
6. Compare: `evals/product-benchmark/reports/ab-report.md` (honest MIXED + method).
7. Same deck in Studio + `/showcase` labeled gallery.

## I. Readiness verdict: CONDITIONAL

GO for: local showcase, hackathon demo (skill-led), reviewer testing, private pilot.
Conditions before any public launch: (1) inbound rate limiting (abuse → GitHub quota
+ 120s renders); (2) human PPTX visual spot-check (structural parity only so far);
(3) full docker build + security headers; (4) keep research/ redistribution restricted
per NOTICE (447 corpus unlicensed; CC captures attribution-bound); (5) do not claim
A/B superiority (MIXED, n=2, blind pending) or Codex/Claude live compatibility.
NOT READY for: public deployment, marketplace publication, package publishing —
all withheld pending owner approval as instructed. RC evidence: 352/352 tests,
tsc clean, prod build clean, EXAMPLES 6/6, web round-trip verified, UI screenshotted.
