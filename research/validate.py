#!/usr/bin/env python3
"""Validate Typodeck research records (JSON / JSONL) against research/schema.json.

Stdlib-only (no pip install needed). Mirrors the JSON Schema by hand and adds
corpus-level gates the schema cannot express:
  - no duplicate source_url across the corpus
  - no duplicate record id
  - no empty/whitespace-only strings (unknown stays "unknown"/null, never blank)
  - verified-vs-target report (--target N): inspected-primary count vs target

Usage:
  python3 research/validate.py <file.json|file.jsonl|dir> [more paths...] [--target N]
  Exit 0 = all records valid; exit 1 = any error.
"""
import json
import re
import sys
from pathlib import Path

SCHEMA_PATH = Path(__file__).with_name("schema.json")

CATEGORIES = {"poster", "editorial", "swiss-international", "brutalist",
              "kinetic-type", "book-cover", "exhibition", "environmental",
              "web-type", "type-specimen", "other"}
SOURCE_TYPES = {"book", "article", "archive", "museum", "portfolio", "specimen",
                "video", "talk", "secondary", "other"}
INSPECTION = {"inspected-primary", "inspected-reproduction",
              "secondary-description", "not-inspected"}
CONFIDENCE = {"high", "medium", "low", "limited", "lore"}
ADAPT = {"high", "medium", "low"}
REQUIRED = ["id", "agent", "category", "title", "designer", "year", "source_url",
            "source_type", "visual_inspection_status", "composition_analysis",
            "hierarchy", "grid_strategy", "whitespace_strategy",
            "typographic_techniques", "slide_adaptability",
            "required_engine_capabilities", "evidence_confidence",
            "originality_notes", "limitations"]
ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]*$")


def err(errors, where, msg):
    errors.append(f"{where}: {msg}")


def check_str(errors, where, rec, key, min_len=1):
    v = rec.get(key)
    if not isinstance(v, str):
        return err(errors, where, f"'{key}' must be a string")
    if len(v.strip()) < min_len:
        err(errors, where, f"'{key}' must not be blank (use 'unknown', never guess)")


def check_str_list(errors, where, rec, key):
    v = rec.get(key)
    if not isinstance(v, list) or not v:
        return err(errors, where, f"'{key}' must be a non-empty array of strings")
    for i, s in enumerate(v):
        if not isinstance(s, str) or not s.strip():
            err(errors, where, f"'{key}[{i}]' must be a non-empty string")


def validate_record(rec, where):
    errors = []
    if not isinstance(rec, dict):
        return [f"{where}: record must be an object"]
    for key in REQUIRED:
        if key not in rec:
            err(errors, where, f"missing required field '{key}'")
    extra = set(rec) - set(REQUIRED)
    if extra:
        err(errors, where, f"unknown fields: {sorted(extra)}")

    if "id" in rec and (not isinstance(rec["id"], str) or not ID_RE.match(rec["id"])):
        err(errors, where, "'id' must match ^[A-Za-z0-9][A-Za-z0-9_-]*$")
    for key in ("agent", "title", "designer", "hierarchy", "grid_strategy",
                "whitespace_strategy", "originality_notes", "limitations"):
        if key in rec:
            check_str(errors, where, rec, key)
    if "year" in rec:
        y = rec["year"]
        if y is not None and (not isinstance(y, bool) and not isinstance(y, int)
                              or isinstance(y, bool) or y is not None and not (1400 <= y <= 2100)):
            err(errors, where, "'year' must be an integer 1400-2100 or null")
    if "category" in rec and rec["category"] not in CATEGORIES:
        err(errors, where, f"'category' must be one of {sorted(CATEGORIES)}")
    if "source_type" in rec and rec["source_type"] not in SOURCE_TYPES:
        err(errors, where, f"'source_type' must be one of {sorted(SOURCE_TYPES)}")
    if "source_url" in rec:
        u = rec["source_url"]
        if not isinstance(u, str) or not u.startswith(("http://", "https://")):
            err(errors, where, "'source_url' must be a verifiable http(s) URL (required)")
    if "visual_inspection_status" in rec and rec["visual_inspection_status"] not in INSPECTION:
        err(errors, where, f"'visual_inspection_status' must be one of {sorted(INSPECTION)}")
    if "evidence_confidence" in rec and rec["evidence_confidence"] not in CONFIDENCE:
        err(errors, where, f"'evidence_confidence' must be one of {sorted(CONFIDENCE)}")

    ca = rec.get("composition_analysis")
    if "composition_analysis" in rec:
        if not isinstance(ca, dict):
            err(errors, where, "'composition_analysis' must be an object")
        else:
            if not isinstance(ca.get("summary"), str) or len(ca["summary"].strip()) < 20:
                err(errors, where, "'composition_analysis.summary' needs >= 20 chars")
            prims = ca.get("primitives")
            if not isinstance(prims, list) or not prims or any(
                    not isinstance(p, str) or not p.strip() for p in prims):
                err(errors, where, "'composition_analysis.primitives' must be a non-empty string array")
            if not isinstance(ca.get("reading_order"), str) or not ca["reading_order"].strip():
                err(errors, where, "'composition_analysis.reading_order' must be a non-empty string ('unknown' ok)")
            extra_ca = set(ca) - {"summary", "primitives", "reading_order"}
            if extra_ca:
                err(errors, where, f"composition_analysis unknown fields: {sorted(extra_ca)}")

    sa = rec.get("slide_adaptability")
    if "slide_adaptability" in rec:
        if not isinstance(sa, dict):
            err(errors, where, "'slide_adaptability' must be an object")
        else:
            if sa.get("rating") not in ADAPT:
                err(errors, where, f"'slide_adaptability.rating' must be one of {sorted(ADAPT)}")
            if not isinstance(sa.get("notes"), str) or not sa["notes"].strip():
                err(errors, where, "'slide_adaptability.notes' must be a non-empty string")
            extra_sa = set(sa) - {"rating", "notes"}
            if extra_sa:
                err(errors, where, f"slide_adaptability unknown fields: {sorted(extra_sa)}")

    for key in ("typographic_techniques", "required_engine_capabilities"):
        if key in rec:
            check_str_list(errors, where, rec, key)
    return errors


def load_records(path):
    """Yield (where, record) from a .json (object or array) or .jsonl file."""
    text = Path(path).read_text(encoding="utf-8")
    if path.suffix == ".jsonl":
        for i, line in enumerate(text.splitlines(), 1):
            if line.strip():
                yield f"{path}:{i}", json.loads(line)
    else:
        data = json.loads(text)
        if isinstance(data, list):
            for i, rec in enumerate(data):
                yield f"{path}#[{i}]", rec
        else:
            yield str(path), data


def collect_files(paths):
    files = []
    for p in paths:
        p = Path(p)
        if p.is_dir():
            files += sorted(p.rglob("*.json")) + sorted(p.rglob("*.jsonl"))
            files = [f for f in files if f.name != "schema.json"]
        elif p.is_file():
            files.append(p)
        else:
            print(f"missing path: {p}", file=sys.stderr)
    return files


def main(argv):
    target = None
    paths = []
    it = iter(argv[1:])
    for a in it:
        if a == "--target":
            target = int(next(it))
        else:
            paths.append(Path(a))
    if not paths:
        print(__doc__.strip().splitlines()[-3], file=sys.stderr)
        return 2
    files = collect_files(paths)
    if not files:
        print("no .json/.jsonl records found", file=sys.stderr)
        return 2

    errors, records = [], []
    for f in files:
        try:
            for where, rec in load_records(f):
                records.append((where, rec))
                errors += validate_record(rec, where)
        except (json.JSONDecodeError, OSError) as e:
            errors.append(f"{f}: cannot load ({e})")

    # Corpus-level gates.
    seen_url, seen_id = {}, {}
    for where, rec in records:
        if not isinstance(rec, dict):
            continue
        u = rec.get("source_url")
        if isinstance(u, str):
            if u in seen_url:
                errors.append(f"{where}: duplicate source_url (also at {seen_url[u]})")
            else:
                seen_url[u] = where
        rid = rec.get("id")
        if isinstance(rid, str):
            if rid in seen_id:
                errors.append(f"{where}: duplicate id (also at {seen_id[rid]})")
            else:
                seen_id[rid] = where

    # Verified-vs-target report.
    by_insp = {}
    for _, rec in records:
        if isinstance(rec, dict):
            s = rec.get("visual_inspection_status")
            by_insp[s] = by_insp.get(s, 0) + 1
    verified = by_insp.get("inspected-primary", 0) + by_insp.get("inspected-reproduction", 0)
    print(f"records: {len(records)} across {len(files)} file(s)")
    print("by visual_inspection_status: " + (", ".join(
        f"{k}={v}" for k, v in sorted(by_insp.items(), key=str)) or "none"))
    if target is not None:
        print(f"verified (inspected-*): {verified}/{target} "
              f"({'MET' if verified >= target else 'SHORT by ' + str(target - verified)})")
    else:
        print(f"verified (inspected-*): {verified}")

    if errors:
        print(f"\n{len(errors)} error(s):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1
    print("OK: all records valid")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
