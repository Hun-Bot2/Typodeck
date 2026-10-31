#!/usr/bin/env bash
# Product benchmark full run (protocol.md). No cherry-picking: every deck is
# generated and measured; failures stay in the denominator (exit 3 = skip).
# Env: TD_CORE_DIST=/tmp/td-g/packages/core/dist  OUT=/tmp/td-g-out
# Reads: fixtures + prompts + arms (this branch). Writes: ONLY $OUT.
set -uo pipefail

HB="$(cd "$(dirname "$0")" && pwd)"
: "${TD_CORE_DIST:?set TD_CORE_DIST to the throwaway core dist}"
: "${OUT:?set OUT to a scratch dir (NOT the branch)}"
TD_ROOT="${TD_CORE_DIST%/packages/core/dist}"
mkdir -p "$OUT/metrics"
: > "$OUT/timings.jsonl"

now_ms() { echo $(( $(date +%s%N) / 1000000 )); }

# Quota note: /rate_limit is a free (non-consuming) call; the head-to-head
# itself makes ZERO GitHub calls (local fixtures only).
QUOTA="$(curl -qs -m 10 https://api.github.com/rate_limit | tr -d '\n' | cut -c1-200 || echo CURL-FAILED)"
echo "quota_probe: ${QUOTA:-CURL-FAILED}"

for FX in FX1-ledgerly FX2-pipecheck; do
  SHORT="${FX%%-*}"
  echo "=== $FX ==="
  # Arm A
  t0=$(now_ms)
  node "$HB/arms/baseline-a.mjs" "$HB/fixtures/repos/$FX" "$OUT/${SHORT}-a.html"
  echo "{\"fx\":\"$SHORT\",\"arm\":\"a\",\"sys\":\"-\",\"gen_ms\":$(( $(now_ms) - t0 ))}" >> "$OUT/timings.jsonl"
  # Arm B
  bash "$HB/run-b/idea.sh" "$HB/fixtures/repos/$FX" "$OUT/${SHORT}-idea.txt"
  (cd "$TD_ROOT" && bash "$HB/run-b/deck.sh" "$OUT/${SHORT}-idea.txt" "$OUT" "$SHORT")
  TD_CORE_DIST="$TD_CORE_DIST" node "$HB/run-b/html.mjs" "$OUT/${SHORT}-idea.txt" "$SHORT" "$OUT"
  # O5 overflow (exit 3 = honestly skipped, kept in denominator)
  for deck in "$OUT/${SHORT}-a.html" "$OUT/${SHORT}-b-swiss.html" "$OUT/${SHORT}-b-editorial.html" "$OUT/${SHORT}-b-expressive.html"; do
    base="$(basename "$deck" .html)"
    set +e
    TD_CORE_DIST="$TD_CORE_DIST" node "$HB/measure/chrome-overflow.mjs" "$deck" "$OUT/metrics/${base}.overflow.json"
    code=$?
    set -e
    [ $code -eq 0 ] || echo "NOTE: O5 skipped for $base (exit $code)"
  done
  # O1-O4,O6-O9
  node "$HB/measure/text-metrics.mjs" "$FX" a - "$OUT/${SHORT}-a.html" "$HB/fixtures/repos/$FX" "$HB/fixtures/numbers.json" "$OUT/metrics/${SHORT}-a.metrics.json" --overflow "$OUT/metrics/${SHORT}-a.overflow.json"
  for sys in swiss editorial expressive; do
    node "$HB/measure/text-metrics.mjs" "$FX" b "$sys" "$OUT/${SHORT}-b-${sys}.html" "$HB/fixtures/repos/$FX" "$HB/fixtures/numbers.json" "$OUT/metrics/${SHORT}-b-${sys}.metrics.json" --pptx "$OUT/${SHORT}-b-${sys}.pptx" --sidecar "$OUT/${SHORT}-b-${sys}.sidecar.json" --overflow "$OUT/metrics/${SHORT}-b-${sys}.overflow.json"
  done
done

TD_CORE_DIST="$TD_CORE_DIST" node "$HB/measure/aggregate.mjs" "$OUT" "$HB/fixtures/numbers.json" "$QUOTA"
echo "DONE: $OUT/results.json"
