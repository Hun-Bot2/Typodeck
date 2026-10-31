#!/usr/bin/env python3
"""Full-field merge of Typodeck research agent files (A-E) into merged_registry.

Reads research/agent-{A,B,C,D,E}.full.jsonl (original agent records, never
modified) and writes:
  research/merged_registry.jsonl  (schema-valid, one record per line, id-sorted)
  research/merged_registry.json   (same records as a JSON array)
  research/merge_provenance.json  (per-id sidecar: every original field that the
                                   schema has no slot for, kept verbatim)

Mapping rules (also documented in research/merge_report.md):
  agent: file letter -> agent-A .. agent-E (records carry no agent field).
  visual_inspection_status: verified -> inspected-reproduction (web surrogate
    seen; no agent saw a physical artifact), unverified -> secondary-description
    (search-checked / metadata-only), inaccessible -> not-inspected.
  evidence_confidence: agent claim capped by inspection status: inspected keeps
    the claim; secondary-description caps at medium; not-inspected caps at low.
  slide_adaptability.rating: agents B-E use high/medium/low verbatim; agent A
    uses adaptable/partial/reference-only -> high/medium/low.
  category / source_type: per-agent mapping tables below + documented token
    overrides; originals preserved verbatim in the provenance sidecar.
  composition_analysis: summary + primitives carried verbatim (reading_order
    lists joined with ' -> '); hierarchy/grid/whitespace carried into the
    top-level hierarchy/grid_strategy/whitespace_strategy fields; text_treatment
    carried as the single typographic_techniques entry; alignment/rhythm/scale
    preserved verbatim in the sidecar (schema has no slot; not dropped).
  required_engine_capabilities: top-level list, else the nested
    composition_analysis list (agents A and D nest it).
  originality_notes: 'unknown' (no agent recorded it; never guessed).
  limitations: honest statement built from the agent's own reproducibility flag
    (reproducible_with_native_editable_text_only / yes/no/partial variants).
  dedup: canonical source_url (lowercase scheme/host, strip fragment + trailing
    slash, drop default ports). On collision the better-inspected record wins;
    ties break by file order A,B,C,D,E. Every collision is reported.

Stdlib-only. Fails loudly (exit 1) on any unmapped enum, blank required value,
or year out of range instead of silently dropping records.

Usage: python3 research/merge_full.py
"""
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent
AGENT_FILES = [("A", "agent-A"), ("B", "agent-B"), ("C", "agent-C"),
               ("D", "agent-D"), ("E", "agent-E")]

VIS_MAP = {"verified": "inspected-reproduction",
           "unverified": "secondary-description",
           "inaccessible": "not-inspected"}
VIS_RANK = {"inspected-reproduction": 2, "secondary-description": 1,
            "not-inspected": 0}
ADAPT_A = {"adaptable": "high", "partial": "medium", "reference-only": "low"}

# (agent_letter, agent_category) -> schema category; None = see token rules.
CATEGORY_MAP = {
    ("A", "poster"): "poster",
    ("A", "exhibition"): "exhibition",
    ("A", "typeface"): "type-specimen",
    ("A", "identity"): "environmental",  # SBB signage/wayfinding systems
    ("B", "typographic-posters"): "poster",
    ("B", "magazines"): "editorial",
    ("B", "books"): "editorial",
    ("B", "publishing"): "editorial",
    ("B", "newspapers"): "editorial",
    ("C", "postmodern-poster"): "poster",
    ("C", "expressive-poster"): "poster",
    ("C", "postmodern-editorial"): "editorial",
    ("C", "kinetic-motion"): "kinetic-type",
    ("D", "digital typography"): "web-type",
    ("D", "technical documentation"): "web-type",
    ("D", "developer-oriented design"): "web-type",
}
# Agent-A default: sources *about* Swiss/ITS works -> corpus topic category.
A_DEFAULT_CATEGORY = "swiss-international"


def map_category(letter, record):
    cat = record.get("category")
    key = (letter, cat)
    if key in CATEGORY_MAP:
        return CATEGORY_MAP[key], f"table {cat!r}"
    title = (record.get("title") or "").lower()
    if letter == "A":
        return A_DEFAULT_CATEGORY, f"A-default ({cat!r} is a source-page kind)"
    if letter == "C" and cat == "digital-type":
        if "magazine" in title:
            return "editorial", "token 'magazine'"
        if any(t in title for t in ("font", "type specimen", "typeface",
                                    "dead history", "digital fonts")):
            return "type-specimen", "token font/specimen"
        return "other", "secondary commentary on digital type"
    if letter == "C":
        return "other", f"no experimental enum ({cat!r})"
    if letter == "D" and cat == "data typography":
        if record.get("source_type") in ("publisher", "archive"):
            return "editorial", "data book via publisher/archive"
        if "storytelling with data" in title:
            return "editorial", "token book title"
        return "other", "data project/about page"
    if letter == "D" and cat == "information design":
        return "other", "no information-design enum"
    if letter == "E":
        return "other", f"script/region category, no CJK enum ({cat!r})"
    raise ValueError(f"unmapped category {(letter, cat)}")


SOURCE_MAP = {
    "museum": "museum", "gallery": "museum", "archive": "archive",
    "library": "archive", "publisher": "book", "magazine": "article",
    "design-press": "article", "press": "article", "foundry": "specimen",
    "studio": "portfolio", "designer-studio": "portfolio",
    "designer": "portfolio", "university": "secondary",
    "platform": "secondary", "authoritative-platform": "secondary",
    "standards-body": "other", "open-source-project": "other",
    "association": "other", "festival": "other",
}
FONT_TOKENS = ("font", "typeface", "mono", "plex", "hyperlegible", "inter")


def map_source_type(record):
    st = record.get("source_type")
    if st == "company":
        title = (record.get("title") or "").lower()
        if any(t in title for t in FONT_TOKENS):
            return "specimen", "token font title"
        return "other", "company docs/system page"
    if st in SOURCE_MAP:
        return SOURCE_MAP[st], f"table {st!r}"
    raise ValueError(f"unmapped source_type {st!r}")


def canon_url(u):
    p = urlsplit(u.strip())
    scheme = p.scheme.lower()
    host = p.hostname.lower() if p.hostname else ""
    port = p.port
    if (scheme == "http" and port == 80) or (scheme == "https" and port == 443):
        port = None
    netloc = host + ((":" + str(port)) if port else "")
    path = p.path.rstrip("/") or ""
    return urlunsplit((scheme, netloc, path, p.query, ""))


def cap_confidence(status, claimed):
    if status == "inspected-reproduction":
        return claimed, False
    if status == "secondary-description" and claimed == "high":
        return "medium", True
    if status == "not-inspected" and claimed in ("high", "medium"):
        return "low", True
    return claimed, False


def reproducibility_limitations(record, caps):
    ca = record.get("composition_analysis", {})
    flag = record.get("reproducible_with_native_editable_text_only",
                      ca.get("reproducible_with_native_editable_text_only",
                             ca.get("reproducible_native_editable_text_only")))
    needs = "; ".join(caps)
    if flag is True or flag == "yes":
        return (flag, "Agent marks this design reproducible with native "
                f"editable text only; engine needs: {needs}.")
    if flag == "partial":
        return (flag, "Agent marks this design only partially reproducible "
                f"with native editable text only; engine needs/gaps: {needs}.")
    if flag is False or flag == "no":
        return (flag, "Agent marks this design NOT fully reproducible with "
                f"native editable text only; engine needs/gaps: {needs}.")
    return (flag, "unknown")


def clean_list(items):
    return [s.strip() for s in items
            if isinstance(s, str) and s.strip()]


def merge_record(letter, agent, record, violations):
    rid = record.get("id", "?")
    ca = record.get("composition_analysis")
    if not isinstance(ca, dict):
        violations.append(f"{rid}: composition_analysis missing/not an object")
        return None, None

    vis_raw = record.get("visual_inspection_status")
    if vis_raw not in VIS_MAP:
        violations.append(f"{rid}: bad visual_inspection_status {vis_raw!r}")
        return None, None
    status = VIS_MAP[vis_raw]

    claimed = record.get("confidence")
    if claimed not in ("high", "medium", "low"):
        violations.append(f"{rid}: bad confidence {claimed!r}")
        return None, None
    confidence, capped = cap_confidence(status, claimed)

    sa = record.get("slide_adaptability")
    if not isinstance(sa, dict):
        violations.append(f"{rid}: slide_adaptability missing/not an object")
        return None, None
    rating_raw = sa.get("rating")
    if letter == "A":
        if rating_raw not in ADAPT_A:
            violations.append(f"{rid}: bad A adaptability {rating_raw!r}")
            return None, None
        rating = ADAPT_A[rating_raw]
    elif rating_raw not in ("high", "medium", "low"):
        violations.append(f"{rid}: bad adaptability {rating_raw!r}")
        return None, None
    else:
        rating = rating_raw
    notes = (sa.get("notes") or "").strip()
    if not notes:
        violations.append(f"{rid}: blank slide_adaptability.notes")
        return None, None

    try:
        category, cat_why = map_category(letter, record)
        source_type, st_why = map_source_type(record)
    except ValueError as e:
        violations.append(f"{rid}: {e}")
        return None, None

    summary = (ca.get("summary") or "").strip()
    reconstructed = False
    if len(summary) < 20:
        parts = [("Agent composition without separate summary "
                  f"({rid}, agent-status {vis_raw!r}):")]
        for k in ("hierarchy", "alignment", "grid"):
            v = (ca.get(k) or "").strip()
            if v:
                parts.append(v)
        summary = " / ".join(parts)
        reconstructed = True
        if len(summary) < 20:
            violations.append(f"{rid}: summary unrecoverable (<20 chars)")
            return None, None

    primitives = clean_list(ca.get("primitives") or [])
    if not primitives:
        violations.append(f"{rid}: empty primitives")
        return None, None

    ro = ca.get("reading_order")
    if isinstance(ro, list):
        reading_order = " -> ".join(clean_list(ro)) or "unknown"
    elif isinstance(ro, str) and ro.strip():
        reading_order = ro.strip()
    else:
        reading_order = "unknown"

    def sub(key):
        v = (ca.get(key) or "").strip()
        return v if v else "unknown"

    tt = (ca.get("text_treatment") or "").strip()
    techniques = [tt] if tt else ["unknown"]

    caps = clean_list(record.get("required_engine_capabilities") or []) or \
        clean_list(ca.get("required_engine_capabilities") or [])
    if not caps:
        violations.append(f"{rid}: empty required_engine_capabilities")
        return None, None

    year = record.get("year")
    if year is not None and (isinstance(year, bool) or not isinstance(year, int)
                             or not 1400 <= year <= 2100):
        violations.append(f"{rid}: bad year {year!r}")
        return None, None
    for k in ("title", "designer"):
        if not (record.get(k) or "").strip():
            violations.append(f"{rid}: blank {k}")
            return None, None
    url = record.get("source_url", "")
    if not isinstance(url, str) or not url.startswith(("http://", "https://")):
        violations.append(f"{rid}: bad source_url {url!r}")
        return None, None

    flag, limitations = reproducibility_limitations(record, caps)

    merged = {
        "id": record["id"],
        "agent": agent,
        "category": category,
        "title": record["title"].strip(),
        "designer": record["designer"].strip(),
        "year": year,
        "source_url": url,
        "source_type": source_type,
        "visual_inspection_status": status,
        "composition_analysis": {
            "summary": summary,
            "primitives": primitives,
            "reading_order": reading_order,
        },
        "hierarchy": sub("hierarchy"),
        "grid_strategy": sub("grid"),
        "whitespace_strategy": sub("whitespace"),
        "typographic_techniques": techniques,
        "slide_adaptability": {"rating": rating, "notes": notes},
        "required_engine_capabilities": caps,
        "evidence_confidence": confidence,
        "originality_notes": "unknown",
        "limitations": limitations,
    }
    provenance = {
        "agent_file": f"research/agent-{letter}.full.jsonl",
        "agent_status": vis_raw,
        "inspection_detail": record.get("inspection_detail"),
        "check_method": record.get("check_method"),
        "verification_method": record.get("verification_method"),
        "visual_notes": record.get("visual_notes"),
        "notes": record.get("notes"),
        "context": record.get("context"),
        "publication": record.get("publication"),
        "original_category": record.get("category"),
        "original_source_type": record.get("source_type"),
        "confidence_claimed": claimed,
        "confidence_capped": capped,
        "adaptability_claimed": rating_raw,
        "reproducible_flag": flag,
        "summary_reconstructed": reconstructed,
        "category_mapping": cat_why,
        "source_type_mapping": st_why,
        "composition_verbatim": {
            k: ca.get(k) for k in ("alignment", "grid", "hierarchy",
                                   "reading_order", "rhythm", "scale",
                                   "summary", "text_treatment", "whitespace")
            if k in ca
        },
    }
    return merged, provenance


def main():
    violations = []
    recovered = {}
    candidates = []  # (canonical_url, rank, order, merged, provenance)
    order = 0
    for letter, agent in AGENT_FILES:
        path = ROOT / f"agent-{letter}.full.jsonl"
        lines = [ln for ln in path.read_text(encoding="utf-8").splitlines()
                 if ln.strip()]
        recovered[letter] = len(lines)
        for i, line in enumerate(lines, 1):
            try:
                record = json.loads(line)
            except json.JSONDecodeError as e:
                violations.append(f"{path}:{i}: invalid JSON ({e})")
                continue
            merged, prov = merge_record(letter, agent, record, violations)
            if merged is None:
                continue
            rank = VIS_RANK[merged["visual_inspection_status"]]
            candidates.append((canon_url(merged["source_url"]), rank,
                               order, merged, prov))
            order += 1

    # Dedup by canonical URL; conflicts resolved explicitly, never silently.
    by_url = {}
    conflicts = []
    for curl, rank, ord_, merged, prov in sorted(
            candidates, key=lambda t: (t[0], -t[1], t[2])):
        if curl not in by_url:
            by_url[curl] = (rank, ord_, merged, prov)
        else:
            kept = by_url[curl]
            conflicts.append({
                "canonical_url": curl,
                "kept_id": kept[2]["id"],
                "kept_status": kept[2]["visual_inspection_status"],
                "dropped_id": merged["id"],
                "dropped_status": merged["visual_inspection_status"],
                "reason": ("better-inspected record kept"
                           if rank != kept[0]
                           else "tie: earlier file order (A,B,C,D,E) kept"),
            })

    if violations:
        print(f"{len(violations)} violation(s), nothing written:",
              file=sys.stderr)
        for v in violations:
            print(f"  - {v}", file=sys.stderr)
        return 1

    accepted = sorted((v[2] for v in by_url.values()),
                      key=lambda r: r["id"])
    prov_map = {v[2]["id"]: v[3] for v in by_url.values()}
    (ROOT / "merged_registry.jsonl").write_text(
        "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in accepted),
        encoding="utf-8")
    (ROOT / "merged_registry.json").write_text(
        json.dumps(accepted, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    (ROOT / "merge_provenance.json").write_text(
        json.dumps(prov_map, ensure_ascii=False, indent=2, sort_keys=True)
        + "\n", encoding="utf-8")

    by_status, by_cat, capped_ids, recon_ids = {}, {}, [], []
    for r in accepted:
        by_status[r["visual_inspection_status"]] = \
            by_status.get(r["visual_inspection_status"], 0) + 1
        by_cat[r["category"]] = by_cat.get(r["category"], 0) + 1
        if prov_map[r["id"]]["confidence_capped"]:
            capped_ids.append(r["id"])
        if prov_map[r["id"]]["summary_reconstructed"]:
            recon_ids.append(r["id"])

    total = sum(recovered.values())
    print(f"recovered: {total} "
          f"({', '.join(f'{k}={v}' for k, v in sorted(recovered.items()))})")
    print(f"accepted: {len(accepted)}")
    print(f"deduplicated (dropped): {len(conflicts)}")
    print(f"rejected (violations): 0")
    print("by visual_inspection_status: "
          + ", ".join(f"{k}={v}" for k, v in sorted(by_status.items())))
    print("by category: " + ", ".join(f"{k}={v}"
                                      for k, v in sorted(by_cat.items())))
    print(f"confidence capped: {len(capped_ids)}"
          + (f" ({', '.join(sorted(capped_ids))})" if capped_ids else ""))
    print(f"summaries reconstructed from own fields: {len(recon_ids)}"
          + (f" ({', '.join(sorted(recon_ids))})" if recon_ids else ""))
    if conflicts:
        print(f"\n{len(conflicts)} merge conflict(s):")
        for c in conflicts:
            print(f"  - {c['canonical_url']}: kept {c['kept_id']} "
                  f"({c['kept_status']}), dropped {c['dropped_id']} "
                  f"({c['dropped_status']}) — {c['reason']}")
    else:
        print("merge conflicts: 0 (all canonical source URLs unique)")
    print("wrote research/merged_registry.jsonl, research/merged_registry.json,"
          " research/merge_provenance.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())