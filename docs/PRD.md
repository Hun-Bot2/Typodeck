# Typodeck — Product Requirements Document (Phase 0)

> Historical record (2026-10-30): MVP checkboxes predate
> implementation; "three design directions" predates the experimental
> 4th system; and §7's "no speaker notes" is superseded — notes now
> ride along to native PPTX notes (see `docs/engineering/decisions/ADR-0006-slide-markdown-ir.md`).
> Preserved as written — see `docs/DOCS_AUDIT.md`.

## 1. Product
Typodeck is an AI-powered typography-native presentation studio: paste a GitHub URL or an idea
description, pick a design direction, get an editable PPTX composed only of type, numbers,
whitespace, and color.

## 2. Users & Modes
- **Repository Mode.** Input: public GitHub repo URL (owner/repo or full URL). System fetches
  README/docs plus bounded code sample, extracts factual claims with file/line evidence.
- **Idea Mode.** Input: pasted free-text description (100–20,000 chars). No external retrieval;
  all claims labeled ungrounded.

## 3. Core Flow
1. Submit input (mode auto-detected: URL → Repository, text → Idea).
2. System proposes narrative outline (5–12 slides) with per-slide source evidence links.
3. User picks one of three design directions (Editorial / Swiss / Expressive) and language (KO/EN).
4. System renders slide previews; user edits text inline.
5. User exports `.pptx` with fully editable text boxes.

## 4. Minimum Behavior (MVP acceptance)
- [ ] Repo Mode: valid public URL yields ≥5 slides in ≤120 s, every factual bullet cites
  ≥1 evidence ref (file path + line range).
- [ ] Idea Mode: pasted text yields ≥5 slides; zero fabricated evidence refs
  (allowed: zero refs, all marked ungrounded).
- [ ] Design selection: three directions selectable; outputs differ per diversity metric
  (see EVALUATION.md §3).
- [ ] Export: PPTX opens in PowerPoint/LibreOffice; 100% of slide text editable
  (no rasterized text), 16:9.
- [ ] Forbidden objects: exported decks contain zero decorative shapes/lines/icons/images
  (see DESIGN_SYSTEM.md §2).

## 5. Success Criteria (measurable)
| # | Criterion | Target |
|---|-----------|--------|
| S1 | End-to-end success rate on eval fixtures | ≥ 90% (9/10 runs) |
| S2 | Slides with ≥1 valid evidence ref (Repo Mode) | ≥ 80% |
| S3 | Unsupported factual claims per deck (Repo Mode) | ≤ 1 |
| S4 | Forbidden-object count per deck | 0 |
| S5 | Text editability (editable chars / total chars) | 100% |
| S6 | Overflowing text boxes per deck (KO and EN) | 0 |
| S7 | P95 latency, submit → previews | ≤ 120 s |

## 6. Risks
- R1: LLM fabricates repo facts → mitigate: evidence-gated generation, unsupported-claim check.
- R2: PPTX text overflow (esp. KO line breaking) → mitigate: deterministic layout engine +
  overflow validation gate before export.
- R3: Model provider outage → mitigate: deterministic template fallback (clearly labeled).
- R4: GitHub rate limits / huge repos → mitigate: bounded retrieval limits, graceful degrade.

## 7. Out of Scope (explicit)
No database, no user auth/accounts, no cloud deployment, no microservices, no collaboration/
sharing, no slide animations/transitions, no speaker notes, no PDF export, no private-repo
access, no raster/image generation.
