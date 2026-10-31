# Typodeck — Architecture (Phase 0)

> Historical record (2026-10-30): this spec predates the 4th system
> (`document`, experimental), the 5-route Studio API, purpose presets,
> and Slide Markdown/IR. For current behavior see
> `packages/core/README.md` and `docs/engineering/decisions/`.
> Preserved as written — see `docs/DOCS_AUDIT.md`.

## 1. Stack
TypeScript-first Next.js monolith (App Router). Server Actions / route handlers for pipeline;
client components for outline review, direction picker, slide preview/edit. No DB, no auth.

## 2. Module Pipeline
```
ingestion → evidence → narrative → design → render → export → validation
skills ───────────────────────────────────────────────────────── (cross-cutting)
```
| Module | Responsibility |
|--------|----------------|
| `ingestion` | Fetch GitHub URL (README/docs/tree, bounded code sample) or accept pasted idea text. |
| `evidence` | Extract atomic claims; attach source refs (repo: path+lines; idea: none/ungrounded). |
| `narrative` | Order claims into 5–12 slide outline; one thesis per slide. |
| `design` | Map outline → typed layout ops for chosen direction (Editorial/Swiss/Expressive). |
| `render` | Deterministic typography layout engine: text measure → box fit → shrink/wrap/overflow flag. |
| `export` | Emit editable PPTX (one text box per text element; zero shapes/lines/images). |
| `validation` | Gates: forbidden-object scan, overflow scan, evidence-coverage, unsupported-claim scan. |
| `skills` | Shared prompt/skill packs (narrative, typographic QA) versioned beside code. |

## 3. Shared Presentation Schema (conceptual)
`Deck { meta, direction, lang, slides[] }` →
`Slide { id, thesis, blocks[] }` →
`Block { kind: kicker|headline|body|stat|quote|caption, text, evidenceRefs[] }` →
`LayoutOp { blockId, x, y, w, h, font, size, weight, tracking, leading, align, color }`.
Validation consumes `LayoutOp[]`; export consumes `LayoutOp[]` + theme tokens.

## 4. Layout Engine (deterministic)
Pure function `layout(slide, direction, lang) → LayoutOp[] + overflowFlags`.
Uses measured glyph metrics (canvas measure at build/test time, fixed tables at runtime);
no LLM in geometry path. Same input → byte-identical geometry. Overflow never silently
clipped: flagged → auto-remedy (size step-down, wrap) → re-flag until clean or error.

## 5. Model-Provider Abstraction
`ModelProvider { complete(prompt, schema) }` with `MetaMuseProvider` (primary) and
`DeterministicFallback` (template-based outline/layout; output labeled
`"generated_by": "fallback"` in metadata and UI badge). Fallback guarantees pipeline
completes offline; quality bar lower, never silent.

## 6. Bounded GitHub Retrieval
Per repo: ≤ 20 files, ≤ 200 KB total, README/docs first, code sample capped at 5 files /
10 KB each, default branch only, 1 tree call + N blob calls (N ≤ 20), 30 s timeout,
unauthenticated rate-limit aware (back off on 403/429 → degrade to README-only or error).
Private repos rejected with explicit message.
