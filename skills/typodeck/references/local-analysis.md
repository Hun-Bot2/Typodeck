# Typodeck Skill — Local Repo Analysis (read on demand)

Core has NO local-directory ingestion API (`fetchRepo` is GitHub-only,
`acceptIdea` takes text). Local analysis is agent-native: you read the
working tree with your own tools, distill what you learned into idea
text, and invoke Core in idea mode. The renderer stays shared — only
the input gathering differs.

## Bounded walk (mirror the remote bounds)

Apply the same budget Core enforces remotely
(`packages/core/src/ingestion.ts`: `MAX_FILES`, `MAX_TOTAL_BYTES`,
`MAX_CODE_FILES`):

1. Read at most 20 files, 200 KB total. Prefer in order: `README.md`,
   `package.json` (or equivalent manifest), `docs/*.md` overview,
   then at most 5 code files (entry points, core logic — skip
   vendored/generated code, lockfiles, binaries).
2. Cap any single file excerpt (10 KB is the remote per-code-file cap).
3. Skip secrets: never paste tokens, keys, or credentials into idea
   text or chat. If a file looks secret-bearing, skip it and note the
   skip.

## Distill to idea text

Write 100–20,000 chars (`MIN_IDEA_CHARS` / `MAX_IDEA_CHARS`) covering:
what the project does, who it serves, key capabilities with any
numbers copied verbatim from the sources, and known limitations. Name
the files each fact came from so the narrative keeps its refs honest.

Then run idea mode (`references/engine.md`):

```sh
npm run --silent deck -- --idea-file local-idea.txt --system swiss --out local-swiss.pptx
```

## Provenance honesty

Local-analysis decks are idea-mode decks: every claim is
`ungrounded` (idea text), even when you copied it from real source
files. `verified` requires the repo-mode pipeline
(`references/evidence.md`). Never relabel distilled claims as
code-confirmed — report the input as "local analysis via idea text"
plus the file list you read.

Executable example: `examples/02-local-analysis.sh`.
