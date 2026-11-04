#!/usr/bin/env bash
# Example 08 — Typo Pack metadata shortlist -> experimental themed export.
# Real input: packages/core/fixtures/idea-f4.txt (offline, deterministic).
# Usage: examples/08-typo-pack.sh [OUT_DIR]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
cd "$ROOT"
mkdir -p "$OUT"

FIXTURE="packages/core/fixtures/idea-f4.txt"
suggest="$(npm run --silent deck -- --suggest --preset P04 --top 3 2>&1)"
echo "$suggest"
[ "$(printf '%s\n' "$suggest" | wc -l | tr -d ' ')" = "3" ] || {
  echo "FAIL 08: expected a three-row Typo Pack shortlist"
  exit 1
}
echo "$suggest" | grep -Eq '^[a-z0-9-]+ \[[a-z]+, base (editorial|swiss|expressive)\] score=[0-9]+ — ' || {
  echo "FAIL 08: shortlist rows lack slug, base system, score, and reasons"
  exit 1
}

slug="$(printf '%s\n' "$suggest" | head -n 1 | awk '{print $1}')"
[[ "$slug" =~ ^[a-z0-9-]+$ ]] || { echo "FAIL 08: invalid top slug '$slug'"; exit 1; }

out="$OUT/08-typo-pack-$slug.pptx"
log="$(npm run --silent deck -- --idea-file "$FIXTURE" --preset P04 --template "$slug" --out "$out" 2>&1)"
echo "$log" | grep -E '^(provider|claims|deck|template|validation):'
echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 08 ($slug): missing validation OK"; exit 1; }
echo "$log" | grep -q "^template: $slug (base system .*experimental)$" || {
  echo "FAIL 08 ($slug): themed receipt missing"
  exit 1
}
[ -f "$out" ] || { echo "FAIL 08 ($slug): $out not written"; exit 1; }
echo "PASS 08: Typo Pack shortlist -> $slug -> validation OK"
