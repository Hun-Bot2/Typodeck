#!/usr/bin/env bash
# Arm B step 2 — CLI deck per production system (Skill references/engine.md).
# Usage: deck.sh <ideaTxt> <outDir> <fxId>   (run inside the throwaway tree)
# Ships only on `validation: OK` (exit 0); receipts appended to receipts.log.
set -euo pipefail

IDEA="$1"
OUT="$2"
FX="$3"
mkdir -p "$OUT"
: > "$OUT/receipts-${FX}.log"

# Build once, outside timing (Skill: "Build once"). Per-system timing invokes
# the built CLI directly so tsc rebuilds don't pollute O10; receipts identical.
npm run --silent build -w @typodeck/core >/dev/null 2>&1
CLI="packages/core/dist/scripts/make-deck.js"

for sys in swiss editorial expressive; do
  pptx="$OUT/${FX}-b-${sys}.pptx"
  log="$OUT/${FX}-b-${sys}.cli.log"
  t0=$(date +%s%N)
  node "$CLI" --idea-file "$IDEA" --system "$sys" --out "$pptx" >"$log" 2>&1
  code=$?
  t1=$(date +%s%N)
  echo "[$sys] exit=$code gen_ms=$(( (t1 - t0) / 1000000 ))"
  cat "$log"
  {
    echo "=== $FX $sys exit=$code gen_ms=$(( (t1 - t0) / 1000000 )) ==="
    cat "$log"
  } >> "$OUT/receipts-${FX}.log"
  [ $code -eq 0 ] || { echo "FAIL deck: $sys exit $code"; exit 1; }
  grep -q '^validation: OK$' "$log" || { echo "FAIL deck: $sys missing validation OK"; exit 1; }
  [ -f "$pptx" ] || { echo "FAIL deck: $pptx not written"; exit 1; }
done
echo "PASS deck: 3 systems, validation OK"
