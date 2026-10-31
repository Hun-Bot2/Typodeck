# Development

Prerequisite: Node.js ≥ 20.9 (`engines` in root `package.json`).
All commands run from the repo root. Verified on `e610736` (2026-10-31).

```sh
npm ci                                   # 53 packages, ~3 s
npm run build -w @typodeck/core          # tsc, exit 0
node --test packages/core/dist/tests/    # 270/270, 72 suites
npm run build -w @typodeck/web           # next build, exit 0
npm run dev --workspace @typodeck/web    # Studio at http://localhost:3000
```

## CLI

```sh
npm run deck -- --idea-file idea.txt --system swiss --out deck.pptx
npm run deck -- --repo sindresorhus/is --system swiss --out is.pptx
npm run samples        # one deck per production system → output/
npm run eval           # 24-case matrix → evals/reports/ + summary
npm run benchmark-90   # 64-run baseline/improved matrix (no human phase)
npm run previews:experimental  # comparable 4-system preview set
bash skills/typodeck/EXAMPLES.sh /tmp/out   # skill transcript, exit 0
```

`make-deck` flags: exactly one of `--repo owner/repo | --idea text |
--idea-file path`, plus `--system editorial|swiss|expressive`,
`--out file.pptx`, optional `--purpose`, `--preset P01..P10`,
`--lang ko|en` (default `en`). No `--seed` flag: layout seeds derive
from a narrative content hash.

## Conventions (enforced by tests + validator)

- No invented numbers: numeric claims carry references or are labeled
  illustrative; idea-mode numbers are `ungrounded` by construction.
- No silent fallbacks: degraded fetches set `degraded:true` + warning;
  fallback provider labels every artifact.
- Typography-only output: validator rejects any non-text shape.
- Generated bundles (`gallery/data.js`, `review/data.js`) are rebuilt via
  their `build-*.js` scripts, never hand-edited.
- Research originals (`research/agent-*.full.jsonl`) are immutable inputs.

## Environment

Optional provider: `TYPOdeck_MUSE_ENDPOINT` + `TYPOdeck_MUSE_API_KEY`
(see `.env.example`). Without both, everything runs on the deterministic
fallback. Never commit `.env` files (gitignored).
