#!/usr/bin/env bash
# Example 01 — idea fixture -> 3 production systems -> validated export.
# Real input: packages/core/fixtures/idea-f4.txt (offline, deterministic).
# Usage: examples/01-idea-deck.sh [OUT_DIR]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
cd "$ROOT"
mkdir -p "$OUT"

FIXTURE="packages/core/fixtures/idea-f4.txt"
chars="$(wc -c < "$FIXTURE" | tr -d ' ')"
echo "fixture=$FIXTURE chars=$chars (bound 100-20000)"

for system in editorial swiss expressive; do
  out="$OUT/01-idea-$system.pptx"
  log="$(npm run --silent deck -- --idea-file "$FIXTURE" --system "$system" --out "$out" 2>&1)"
  echo "$log" | grep -E '^(provider|claims|deck|validation):'
  echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 01 ($system): missing validation OK"; exit 1; }
  [ -f "$out" ] || { echo "FAIL 01 ($system): $out not written"; exit 1; }
done
echo "PASS 01: idea -> 3 systems, all validation OK"
