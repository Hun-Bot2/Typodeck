#!/usr/bin/env bash
# Example 06 — eval matrix re-run (F4 fixture) + aggregate report.
# Contract: the F4 matrix re-runs green (8/8) and the aggregate report is
# produced; the OVERALL verdict is printed VERBATIM and recorded, never
# forced to PASS. A FAIL verdict reflects the eval baseline (e.g. the
# experimental 4th system vs the diversity gate), not this example.
# SELF-CLEANING: backs up evals/summary.json + evals/reports/F4-* before
# the run and restores them after (trap on EXIT), so the example never
# dirties the checkout — including on failure.
# Usage: examples/06-eval-rerun.sh [OUT_DIR]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
cd "$ROOT"
mkdir -p "$OUT"

has_eval="$(node -p "Boolean(require('./package.json').scripts.eval && require('./package.json').scripts['eval:report'])")"
if [ "$has_eval" != "true" ]; then
  echo "SKIP 06: eval scripts not present on this baseline"
  exit 0
fi

BACKUP="$OUT/06-evals-backup"
mkdir -p "$BACKUP/reports"
[ -f evals/summary.json ] && cp evals/summary.json "$BACKUP/summary.json" || touch "$BACKUP/summary.json.absent"
cp evals/reports/F4-* "$BACKUP/reports/" 2>/dev/null || true

cleanup() {
  if [ -f "$BACKUP/summary.json" ]; then cp "$BACKUP/summary.json" evals/summary.json; fi
  rm -f evals/reports/F4-*
  if ls "$BACKUP"/reports/* >/dev/null 2>&1; then cp "$BACKUP"/reports/* evals/reports/; fi
}
trap cleanup EXIT

matrix_log="$OUT/06-eval-matrix.log"
npm run --silent eval -- --fixture F4 >"$matrix_log" 2>&1 \
  || { tail -15 "$matrix_log"; echo "FAIL 06: eval run failed"; exit 1; }
tail -10 "$matrix_log"
grep -q '8/8 runs succeeded' "$matrix_log" || { echo "FAIL 06: matrix not 8/8"; exit 1; }

set +o pipefail
report="$(npm run --silent eval:report 2>&1 | tail -14)"
set -o pipefail
echo "$report"
verdict="$(echo "$report" | grep -E '^OVERALL: (PASS|FAIL)$' || true)"
[ -n "$verdict" ] || { echo "FAIL 06: no OVERALL verdict in report"; exit 1; }
[ -f "evals/summary.json" ] || { echo "FAIL 06: evals/summary.json missing"; exit 1; }
echo "report verdict (eval baseline, verbatim): $verdict"
echo "PASS 06: F4 matrix 8/8 green, verdict recorded (evals/ restored)"
