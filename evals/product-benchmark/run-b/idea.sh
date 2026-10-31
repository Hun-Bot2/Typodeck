#!/usr/bin/env bash
# Arm B step 1 — mechanical idea distillation (mirrors Skill 02-local-analysis).
# Usage: idea.sh <fixtureDir> <outIdeaTxt>
# Budget: <=20 files, <=200 KB total, <=10 KB per code file, secrets skipped.
set -euo pipefail

FX="$1"
OUT="$2"
files=0
bytes=0

{
  echo "Local analysis (bounded mechanical excerpts; Skill references/local-analysis.md)."
  echo "Fixture: $(basename "$FX"). Files read listed inline."
  echo
  echo "--- README.md (first 8000 bytes) ---"
  head -c 8000 "$FX/README.md"
  echo
  echo "--- package.json ---"
  cat "$FX/package.json"
  for code in "$FX"/src/*.js; do
    [ -f "$code" ] || continue
    echo
    echo "--- ${code#"$FX"/} (first 10000 bytes) ---"
    head -c 10000 "$code"
  done
} > "$OUT"

files=$(find "$FX" -type f | wc -l | tr -d ' ')
bytes=$(wc -c < "$OUT" | tr -d ' ')
echo "idea=$OUT chars=$bytes files=$files (bounds: files<=20, idea 100-20000 chars)"
[ "$files" -le 20 ] || { echo "FAIL idea: too many files"; exit 1; }
[ "$bytes" -ge 100 ] && [ "$bytes" -le 20000 ] || { echo "FAIL idea: out of bounds"; exit 1; }
# Secrets tripwire: fixtures must not contain secret VALUES (assignments or
# known token prefixes). Prose mentions ("secret-name typos") are legitimate.
if grep -riE "(api[_-]?key|passwd|password)\s*[:=]|sk-[a-z0-9]{8}|ghp_[a-z0-9]{8}|xox[a-z]-[a-z0-9-]{8,}|bearer [a-z0-9_.~+/-]{12}" "$FX" >/dev/null; then
  echo "FAIL idea: secret-like value in fixture"; exit 1;
fi
echo "PASS idea: bounds ok, no secrets"
