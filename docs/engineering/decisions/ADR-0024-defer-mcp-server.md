# ADR-0024: Defer MCP server (Skill + CLI + Studio cover the workflows)

Status: Accepted (2026-11-04)
Context: TypoPPT ships three interfaces over one engine — Agent Skill
(portable SKILL.md), CLI (`make-deck`, `--template`, receipts), and Web
Studio (evidence inspector, SSE progress, preview, export). Pre-release
question: does an MCP server add user value worth its cost?

## Evaluation

Candidate MCP value, tested against current interfaces:

1. **Agentic invocation.** The Skill already orchestrates generation
   inside Claude Code, Codex, and Muse via shell + HTTP with zero
   install beyond a directory copy. MCP would add a server lifecycle
   (stdio transport, capability negotiation, versioning) for the same
   outcome.
2. **Repository analysis.** Bounded fetch + local walk run inside the
   agent session today, inheriting the session's credentials and
   sandbox. An MCP server would need its own auth story (GitHub token
   handling, secret scoping) with no new capability.
3. **Studio embedding.** The Studio is a Next.js app with typed REST
   routes. MCP's tool model fits chat-attached actions, not the
   Studio's document workflow; bridging adds maintenance without users.
4. **Distribution.** Every new interface multiplies install docs,
   version skew, and support surface. The Skill is one directory;
   MCP is a running process with transport quirks per host.

No evaluation surfaced a problem that only MCP solves. The Skill's
verified transcript (7/7 PASS), the CLI receipts, and the Studio smoke
tests cover invocation, evidence, and export.

## Decision

Do not implement an MCP server for this release. Revisit only if a
concrete trigger appears:

- A host environment that supports MCP tools but cannot run the
  Skill's shell + HTTP workflow.
- A multi-turn tool interaction (e.g. slide-level edit ops) that
  proves awkward over the CLI/REST shape.
- Sustained user requests citing a specific MCP-only workflow.

Smallest useful capability if revisited: a single `generate_deck`
tool reusing `planDeck` + `exportToPptxBuffer` + `validatePptxBytes`
with no new pipeline code, stdio transport, no credentials of its own.

## Consequences

- Release scope stays on README, install, quality, and Skill UX.
- No MCP maintenance, auth, or versioning burden.
- This ADR is the decision record; no code changes.
