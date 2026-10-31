#!/usr/bin/env bash
# Example 02 — bounded LOCAL analysis -> idea text -> deck (fully offline).
# Target: this repo (Typodeck itself). Reads 2 files / ~10 KB, far inside
# the remote-mirroring budget (<=20 files, <=200 KB): README.md (capped
# at 8 KB) + package.json. No secrets: both files are public docs.
#
# NOTE: this runnable variant assembles bounded excerpts mechanically.
# Conversational skill use DISTILLS instead (references/local-analysis.md).
# Either way the deck is idea-mode: claims stay `ungrounded`, never
# relabeled as verified.
# Usage: examples/02-local-analysis.sh [OUT_DIR]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
cd "$ROOT"
mkdir -p "$OUT"

IDEA="$OUT/02-local-idea.txt"
{
  echo "Local analysis of the Typodeck repository (bounded excerpts; see references/local-analysis.md)."
  echo
  echo "--- README.md (first 8000 bytes) ---"
  head -c 8000 README.md
  echo
  echo "--- package.json ---"
  cat package.json
} > "$IDEA"
chars="$(wc -c < "$IDEA" | tr -d ' ')"
echo "idea=$IDEA chars=$chars (bound 100-20000) files=2 bytes~$chars"
[ "$chars" -ge 100 ] && [ "$chars" -le 20000 ] || { echo "FAIL 02: idea out of bounds"; exit 1; }

out="$OUT/02-local-swiss.pptx"
log="$(npm run --silent deck -- --idea-file "$IDEA" --system swiss --out "$out" 2>&1)"
echo "$log" | grep -E '^(provider|claims|deck|validation):'
echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 02: missing validation OK"; exit 1; }
echo "$log" | grep -q 'ungrounded=[1-9]' || { echo "FAIL 02: expected ungrounded idea claims"; exit 1; }
[ -f "$out" ] || { echo "FAIL 02: $out not written"; exit 1; }
echo "PASS 02: local analysis -> idea-mode deck, validation OK"
