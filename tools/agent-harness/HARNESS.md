# Agent Harness — frozen interface contract (v0.1.0)

Local, executable, no-paid-API harness. Reads a template's `design.md`,
plans semantic roles from slide intent, composes per-slide HTML/CSS from the
spec (a spec-driven builder — not one generic layout), renders at 1920x1080
in headless Chrome, runs deterministic checks, repairs boundedly, and writes
validated output.

Engine (`packages/`, `bold-template-pack/`, `gallery/`) is **read-only** to
this harness. Everything the harness owns lives in `tools/agent-harness/`.

## CLI (frozen)

```
node tools/agent-harness/generate.mjs \
  --design <slug> --lang en|ko --content <json> --out <dir> \
  [--port <n>] [--no-repair]
```

| Flag | Required | Meaning |
|---|---|---|
| `--design` | yes | Slug under `bold-template-pack/templates/<slug>/design.md` |
| `--lang` | yes | `en` or `ko`. `ko` applies the design's CJK section; when `locales/ko.md` (or `locales/ko/design.md`) exists under the template dir its tokens override |
| `--content` | yes | Path to content JSON (schema below) |
| `--out` | yes | Output dir (created). Receives `slides/NN.{html,png}` + `report.json` |
| `--port` | no | CDP port for headless Chrome (default `9333`) |
| `--no-repair` | no | Single render per slide; skips the bounded repair loop |
| `--help` | no | Print usage |

Exit code: `0` when every slide passes all checks, `1` when any slide fails
(outputs are still written), `2` on usage/input errors.

Runtime needs: Node >= 20, a Chrome/Chromium binary (macOS app path, the
`ms-playwright` cache, or `CHROME_PATH`), and network access to Google Fonts
at render time (offline renders fall back to system stacks per design.md).

## Content JSON (frozen input schema)

```jsonc
{
  "deck": { "title": "...", "context": "...", "date": "...", "author": "..." },
  "slides": [
    {
      "intent": "compare rushed versus reviewed response styles", // required
      "role": "comparison",   // optional explicit role; validated, else planned
      "kicker": "...", "title": "...", "lede": "...", "orienting": "...",
      "statement": "...", "source": "...", "message": "...", "caption": "...",
      "recap": "...",
      "stats": [{ "value": "63%", "label": "..." }],
      "findings": [{ "head": "...", "body": "..." }],  // max 4 rendered
      "zones": { "a": { "label": "...", "rows": [{ "text": "...", "flag": true }] },
                 "b": { "label": "...", "rows": ["..."] } },
      "table": { "columns": ["..."], "rows": [["..."]],
                 "flags": [true], "footnote": "..." },
      "meta": [{ "label": "...", "value": "..." }],    // rail rows (default 3)
      "fixture": true,                 // illustrative content? default false
      "fixtureNote": "stats are illustrative"
    }
  ]
}
```

Max 24 slides. Unknown `role` values fall back to `evidence` with a recorded
reason (never a crash). Table `flags[i]` highlights the row's column-2 cell.

## Roles (frozen vocabulary)

`cover | divider | statement | evidence | comparison | dense | closing`

Planner: explicit `role` wins; otherwise deterministic intent-keyword scoring
plus content-shape votes (`zones` → comparison, `table` → dense,
`stats`/`findings` → evidence). Ties break to `cover` (first slide),
`closing` (last), else `evidence`. Every decision records `roleReason`.

## Checks (frozen, deterministic)

Each slide records all six checks as `{ ok, detail }`:

| Check | Rule |
|---|---|
| `dims` | PNG decodes (IHDR) to exactly 1920x1080 |
| `overflow` | No horizontal scroll anywhere; no vertical scroll escaping the content zone (past footer top) or really clipped (`overflow != visible`). In-zone vertical glyph extent from sub-1em display line-heights is excused — containment is enforced by `clip` |
| `clip` | Index numeral rect inside rail rect; every measured text rect inside the 1920x1080 stage |
| `verbatim` | Every content string present in rendered `innerText` (whitespace-normalized, case-insensitive — the spec mandates uppercase transforms, which `innerText` returns rendered) |
| `fixture` | `fixture: true` slides render ≥1 `[data-fixture]` marker (`· FIXTURE`); non-fixture slides render none |
| `spec` | Exactly one content red rule; grid + rail + footer present; no centered/justified headline; zero rounded corners |

## Repair (frozen bounds)

At most **3 repair rounds** per slide (4 renders max). Strategies only shrink
within the spec: title ladder `118→104→96→72→56→48→40`, stat size, dense
table size, rail numeral size. Verbatim/spec-structure failures are content
or builder bugs — no auto-repair is attempted; the slide reports `FAIL` with
details. Every applied adjustment is recorded in `repairs[]` and the final
adjustments in `compositionNote`.

## report.json (frozen output schema)

```jsonc
{
  "harness": "0.1.0",
  "design": "gridline-swiss",
  "lang": "en",
  "localeNote": "which locale source applied",
  "createdAt": "ISO-8601",
  "status": "PASS | FAIL",
  "summary": { "pass": 7, "fail": 0, "total": 7 },
  "slides": [
    {
      "index": 1,
      "file": "slides/01.html",
      "png": "slides/01.png",
      "role": "cover",
      "roleReason": "intent+shape match (score 39)",
      "compositionNote": "cover composition: display 118px + lede",
      "repairs": ["round 1: numeralPx 300->260"],
      "rounds": 2,
      "checks": { "dims": {...}, "overflow": {...}, "clip": {...},
                  "verbatim": {...}, "fixture": {...}, "spec": {...} },
      "status": "PASS | FAIL"
    }
  ]
}
```

Downstream agents may rely on: flag names, `slides/NN.{html,png}`
numbering (`NN` = 2-digit, 1-based), and every `report.json` field above.
Any change to these requires a harness minor-version bump and a note here.

## Module map

- `generate.mjs` — CLI orchestration (load → plan → build → render → check → repair → report)
- `lib/content.mjs` — content-JSON validation + verbatim string collection
- `lib/spec.mjs` — `design.md` front-matter parser, `{ref}` resolution, CJK section extraction
- `lib/roles.mjs` — semantic role planner
- `lib/builder.mjs` — per-role HTML/CSS composer (all constants from spec tokens)
- `lib/render.mjs` — zero-dependency CDP renderer (headless Chrome) + PNG dim reader
- `lib/checks.mjs` — six deterministic checks (pure, unit-tested)
- `lib/repair.mjs` — bounded repair proposals
- `tests/` — `node --test tests/` (spec-parse + role-plan + checks + repair)

## Proof pointer

`evals/hackathon/harness-proof/gridline-swiss-en/` — EN 7-slide deck,
`report.json` PASS 7/7, all 7 PNGs human-viewed; two viewed defects
(fixture-marker wrap, multi-column table flags) fixed in the builder and
re-verified. Input: `evals/hackathon/harness-proof/proof-content.en.json`.
