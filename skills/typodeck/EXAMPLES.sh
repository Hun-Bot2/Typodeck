#!/usr/bin/env bash
# Typodeck Skill — executable transcript of the SKILL.md worked examples.
# Usage: skills/typodeck/EXAMPLES.sh [OUT_DIR]   (default OUT_DIR=/tmp/typodeck-skill)
# Exit 0 with PASS when every runnable example produces its stated artifacts.
# Prints SKIP (still exit 0) only when an external precondition is missing
# (GitHub quota exhausted, or Phase 4 eval scripts absent). Any FAIL exits 1.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
SKILL="$ROOT/skills/typodeck"

pass=0
skip=0
cd "$ROOT"
mkdir -p "$OUT"

echo "--- build: @typodeck/core (once) ---"
npm run build -w @typodeck/core 2>&1 | tail -2

run_example() {
  local label="$1"; shift
  echo "--- $label ---"
  local log
  if log="$("$@" 2>&1)"; then
    echo "$log" | tail -15
    if echo "$log" | grep -q '^SKIP'; then skip=$((skip + 1)); else pass=$((pass + 1)); fi
  else
    local code=$?
    echo "$log" | tail -25
    echo "FAIL $label (exit $code)"
    exit 1
  fi
}

run_example "Ex1: $SKILL/examples/01-idea-deck.sh" bash "$SKILL/examples/01-idea-deck.sh" "$OUT"
run_example "Ex2: $SKILL/examples/02-local-analysis.sh" bash "$SKILL/examples/02-local-analysis.sh" "$OUT"
run_example "Ex3: $SKILL/examples/03-remote-repo.sh" bash "$SKILL/examples/03-remote-repo.sh" "$OUT"
run_example "Ex4: $SKILL/examples/04-evidence-report.mjs" node "$SKILL/examples/04-evidence-report.mjs" "$OUT"
run_example "Ex5: $SKILL/examples/05-improved-pipeline.mjs" node "$SKILL/examples/05-improved-pipeline.mjs" "$OUT"
run_example "Ex6: $SKILL/examples/06-eval-rerun.sh" bash "$SKILL/examples/06-eval-rerun.sh" "$OUT"

echo "--- artifacts ---"
ls -la "$OUT" | grep -v 'evals-backup' || true
echo "PASS examples=$pass skipped=$skip out=$OUT"
