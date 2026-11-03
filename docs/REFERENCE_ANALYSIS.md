# Reference analysis — public README relaunch

Companion research for the TypoPPT README relaunch. Five external
repositories were inspected directly (README bodies plus linked docs).
This file records what transfers to TypoPPT and what must not be copied.

Inspection date: 2026-11-03/04. Figures quoted as-fetched; counts and
release versions drift over time.

Naming note: the codebase, packages, CLI, plugin, and skill are all
`typodeck` today (zero `TypoPPT` strings in the tree). `TypoPPT` below
means the requested public-facing brand direction. Technical identifiers
stay `typodeck` until an explicit migration decision.

## A — frontend-slides

URL: <https://github.com/zarazhangrui/frontend-slides>

Relevant sections: walkthrough video (top) · What This Does / Key
Features · Installation (marketplace add+install, manual copy, other
agents with repo-link fallback) · Usage (create 5-step incl. 3 visual
previews, convert 4-step) · Included Styles (Dark/Light/Specialty,
12 named) · Bold Template Gallery (~35 named templates with
screenshots) · Architecture (progressive-disclosure file table) ·
Philosophy · Sharing (deploy script, PDF export) · Requirements.

What works well: video-first onboarding; show-don't-tell style
selection (generate 3 previews, user picks); a named-style gallery;
SKILL.md-as-map with an on-demand files table; three install paths;
deploy-to-URL plus PDF sharing scripts.

Why it works: it kills blank-page and choice paralysis for
non-designers; visual proof beats claims; the agent context stays lean;
non-Claude agents are covered.

Adapt for TypoPPT: a named deck-style gallery with screenshots; a
generate-previews-then-pick style flow; a SKILL.md workflow map with
per-step design files plus a scripts table; create/convert usage
playbooks; deploy-to-URL and export equivalents where they exist.

Do not copy: its single-HTML zero-dependency constraint (TypoPPT needs
native `.pptx` fidelity); its template names or screenshots; its
repo-specific SSH-vs-HTTPS caveat.

Evidence:

- <https://github.com/zarazhangrui/frontend-slides>
- <https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md>
- <https://www.youtube.com/watch?v=372Iksaz8b0>
- <https://github.com/zarazhangrui/beautiful-html-templates>

Inspection gap: only the gallery index headings were read, not each
template preview/design page.

## B — Impeccable

URL: <https://github.com/pbakaus/impeccable>

Relevant sections: one-line proposition with `npx` install plus init
command first · before/after table (same model, same brief) · case-study
link · Why (named slop-symptom list) · How it works · commands table ·
live mode · three detector run modes · Installation (npx, editor
plugins, submodule, manual per-tool path table) · project files and git
· telemetry/privacy disclosure · docs site with per-command pages.

What works well: install-first onboarding (two commands before any
prose); concrete before/after proof; a named enemy vocabulary backed by
deterministic rules; an auto-run design hook; frank limits, telemetry,
and privacy disclosure; credibility via case study.

Why it works: anti-generic positioning with receipts; onboarding in
seconds; meets users in the agent, CI, and browser.

Adapt for TypoPPT: a before/after deck pair (same brief, same model)
plus one case study; a named deck-slop vocabulary with deterministic
deck-lint rules (font soup, wall-of-text, chart junk); a two-command
install with an init step capturing audience and brand; a per-tool
install matrix; an honest limits section.

Do not copy: the long command sprawl; its PRODUCT.md/DESIGN.md
filenames; its live-overlay code-edit model (slides are artifacts, not
apps); its telemetry-funded catalog claim.

Evidence:

- <https://github.com/pbakaus/impeccable>
- <https://raw.githubusercontent.com/pbakaus/impeccable/main/README.md>
- <https://impeccable.style/docs>
- <https://impeccable.style/cases/neo-mirai>
- <https://impeccable.style/docs/new-work>

Inspection gap: only the docs index was read, not each per-command
page or the full detector rule text.

## C — Anthropic Agent Skills

URL: <https://github.com/anthropics/skills>

Standard: <https://agentskills.io/>

Relevant sections: repo README (About, demo-only disclaimer, skill
sets, Claude Code / Claude.ai / API install paths, minimal-frontmatter
skill creation, partner skills) · `skills/` directories including
source-available document skills · `pptx/SKILL.md` (trigger-rich
description, task-to-approach table, scripts table, library gotchas) ·
agentskills.io home (Discovery → Activation → Execution progressive
disclosure) · specification (SKILL.md format, metadata, tool
constraints) · quickstart · clients showcase.

What works well: a minimal contract (folder plus SKILL.md, only name
and description required); three-stage progressive disclosure;
per-surface install paths; a demo-not-guarantee disclaimer;
keyword-loaded descriptions for activation; gotcha-first authoring in
the pptx skill.

Why it works: trust through transparency; the lowest authoring bar;
the description is discoverability.

Adapt for TypoPPT: a SKILL.md description loaded with triggers (deck,
slides, presentation, `.pptx`); a task-to-approach table
(create/edit/read/convert); a scripts table plus a footgun list; a
supported-versus-unsupported matrix. Having SKILL.md does not imply
marketplace registration — ship explicit marketplace/plugin install
plus skills-listing steps.

Do not copy: proprietary-license document skill content; any "already
on paid plans" availability assumption; the partner-highlight pattern.

Evidence:

- <https://github.com/anthropics/skills>
- <https://raw.githubusercontent.com/anthropics/skills/main/README.md>
- <https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md>
- <https://agentskills.io/>
- <https://agentskills.io/specification.md>
- <https://agentskills.io/skill-creation/quickstart.md>
- <https://agentskills.io/clients.md>

Inspection gap: the clients list page is JS-rendered; only sort
controls were fetched.

## D — Vercel Agent Skills and skills installer (distinct repos)

URLs: <https://github.com/vercel-labs/agent-skills> (collection),
<https://github.com/vercel-labs/skills> (installer CLI).

Relevant sections (collection): Available Skills with per-skill
Use-when triggers · one-command installation · usage with example
prompts · discovery index (immutable release per change) · skill
structure (SKILL.md/scripts/references). Relevant sections (CLI):
install-a-skill flags · other-commands table · use-without-installing
· supported-agents matrix (75+) · creating skills with discovery
directories and marketplace-manifest compatibility. Related directory:
<https://www.skills.sh/> (packs, topics, audits, per-agent pages).

What works well: content/tool separation; per-skill Use-when
triggers; one-command install plus zero-install trial; a wide agent
compatibility matrix; an immutable-release discovery index; a
directory with packs, topics, and audits.

Why it works: discovery-to-install friction near zero; transparent
compatibility; reproducible installs.

Adapt for TypoPPT: ship as an installable collection with Use-when
triggers per skill; publish on skills.sh; immutable releases plus a
discovery index; a per-agent path table; a zero-install trial path.

Do not copy: Vercel-specific skill content; experimental sync/install
previews presented as stable; implying installer adoption alone equals
marketplace registration.

Evidence:

- <https://github.com/vercel-labs/agent-skills>
- <https://raw.githubusercontent.com/vercel-labs/agent-skills/main/README.md>
- <https://github.com/vercel-labs/skills>
- <https://raw.githubusercontent.com/vercel-labs/skills/main/README.md>
- <https://raw.githubusercontent.com/vercel-labs/skills/main/docs/agents.md>
- <https://raw.githubusercontent.com/vercel-labs/skills/main/docs/creating-skills.md>
- <https://www.skills.sh/>

Inspection gap: the directory homepage fetch truncated; full
packs/topics/audits listings uninspected.

## E — UI/UX Pro Max

URL: <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>

Relevant sections: multilingual README links · quantified badges ·
hero screenshot · What's New · Features (searchable styles, palettes,
font pairings, charts, stacks, guidelines, rules) · style taxonomy
table (Active/Supplemental/Deprecated with ranking behavior) · edition
comparison · Installation (marketplace commands, per-tool CLI matrix)
· Prerequisites · Usage (auto-activate versus slash-command per-agent
tables, example prompts, copy-paste retheme prompt, supported stacks)
· before/after examples with an illustrative-not-benchmark disclaimer ·
advanced design-system command · architecture and contributing ·
troubleshooting · compatible agents.

What works well: quantified catalogs with provenance plus a status
taxonomy; dual-mode onboarding matched to agent capability; a
copy-paste retheme prompt; illustrative-example disclaimers; deep
self-serve troubleshooting.

Why it works: scale communicated credibly; meets every tool where it
is; unblocks users without maintainer contact.

Adapt for TypoPPT: a quantified style/palette/font/chart catalog with
an Active/Supplemental/Deprecated taxonomy; an auto-activate versus
slash-command mode table; a copy-paste "retheme my deck" prompt with
contrast and focus verification; brand master-plus-overrides files;
troubleshooting for pptx/extract/export failures.

Do not copy: badge or count inflation without provenance; an
upsell block inside the open README; a wide per-tool CLI matrix
before core quality exists; cross-promo banners.

Evidence:

- <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>
- <https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/README.md>
- <https://uupm.cc>

Inspection gap: only the README was inspected; the SKILL.md body,
data sources, and the companion site body were not fetched.

## What the relaunch takes from each

1. Proof before prose: real gallery and receipts above the fold
   (A, B).
2. Install first, in two commands, with a per-tool matrix (B, D).
3. SKILL.md as an orchestrator map with on-demand references (A, C).
4. Named systems with Use-when triggers and a status taxonomy
   (A, D, E).
5. Honest limits and illustrative-example disclaimers (B, E).
6. Copy-paste playbooks for create and retheme flows (A, E).

## What the relaunch refuses from each

- HTML-only output constraints (A) — TypoPPT ships native `.pptx`.
- Borrowed template names, screenshots, or marketing wording (all).
- Command or matrix sprawl ahead of verified quality (B, E).
- Implying SKILL.md presence equals marketplace registration (C, D).
- Unprovenanced counts or benchmark claims (B, E).
