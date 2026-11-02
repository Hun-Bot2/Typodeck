#!/usr/bin/env bash
# Example 07 — critique receipt + bounded revise via CLI flags, end to end.
# Real input: packages/core/fixtures/idea-f4.txt (offline, deterministic).
# Usage: examples/07-revise-loop.sh [OUT_DIR]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
cd "$ROOT"
mkdir -p "$OUT"

FIXTURE="packages/core/fixtures/idea-f4.txt"
chars="$(wc -c < "$FIXTURE" | tr -d ' ')"
echo "fixture=$FIXTURE chars=$chars (bound 100-20000)"

# --critique: advisory receipt appended, exit code unchanged.
log="$(npm run --silent deck -- --idea-file "$FIXTURE" --system swiss --out "$OUT/07-critique-swiss.pptx" --critique 2>&1)"
echo "$log" | grep -E '^(provider|deck|critique|validation):'
echo "$log" | grep -q '^critique: attempts=1 errors=[0-9]* warnings=[0-9]* checks=' \
  || { echo "FAIL 07 (--critique): missing critique receipt"; exit 1; }
echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 07 (--critique): missing validation OK"; exit 1; }

# --revise: bounded loop (default max 3), revised deck exported.
log="$(npm run --silent deck -- --idea-file "$FIXTURE" --system swiss --out "$OUT/07-revised-swiss.pptx" --revise 2>&1)"
echo "$log" | grep -E '^(deck|revise|critique|validation):'
echo "$log" | grep -q '^critique: attempts=[1-3] errors=[0-9]* warnings=[0-9]* checks=' \
  || { echo "FAIL 07 (--revise): missing critique receipt"; exit 1; }
echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 07 (--revise): missing validation OK"; exit 1; }
[ -f "$OUT/07-revised-swiss.pptx" ] || { echo "FAIL 07 (--revise): pptx not written"; exit 1; }

# --revise=1: explicit attempt budget of one.
log="$(npm run --silent deck -- --idea-file "$FIXTURE" --system swiss --out "$OUT/07-revised1-swiss.pptx" --revise=1 2>&1)"
echo "$log" | grep -E '^(critique|validation):'
echo "$log" | grep -q '^critique: attempts=1 ' \
  || { echo "FAIL 07 (--revise=1): attempts != 1"; exit 1; }
echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 07 (--revise=1): missing validation OK"; exit 1; }

# --revise=0: invalid budget rejected with usage (exit 2).
if npm run --silent deck -- --idea-file "$FIXTURE" --system swiss --out "$OUT/07-bad.pptx" --revise=0 >/dev/null 2>&1; then
  echo "FAIL 07 (--revise=0): expected non-zero exit"
  exit 1
fi

echo "PASS 07: --critique receipt + --revise loop end to end, all validation OK"
