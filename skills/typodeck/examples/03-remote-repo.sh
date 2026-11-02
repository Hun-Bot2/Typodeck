#!/usr/bin/env bash
# Example 03 — quota check -> LIVE public-repo deck (bounded, rate-limit aware).
# Real input: sindresorhus/is (tiny public repo). Prints SKIP (exit 0) when
# quota is exhausted or unreachable — never burns the last calls, never
# claims an artifact it did not produce.
# Usage: examples/03-remote-repo.sh [OUT_DIR]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
cd "$ROOT"
mkdir -p "$OUT"

probe="$(bash skills/typodeck/scripts/check-quota.sh)"
echo "$probe"
remaining="$(echo "$probe" | sed -n 's/.*quota_remaining=\([^ ]*\).*/\1/p')"
if [ "$remaining" = "0" ] || [ "$remaining" = "unknown" ]; then
  echo "SKIP 03: no GitHub quota ($probe)"
  exit 0
fi

out="$OUT/03-repo-editorial.pptx"
log="$(npm run --silent deck -- --repo sindresorhus/is --system editorial --out "$out" 2>&1)"
echo "$log" | grep -E '^(provider|claims|deck|validation|failed):'
if echo "$log" | grep -q 'rate-limited'; then
  echo "SKIP 03: GitHub quota hit mid-run (honest typed error, no artifact claimed)"
  exit 0
fi
echo "$log" | grep -q '^validation: OK$' || { echo "FAIL 03: missing validation OK"; exit 1; }
[ -f "$out" ] || { echo "FAIL 03: $out not written"; exit 1; }
echo "PASS 03: repo -> grounded deck, validation OK"
