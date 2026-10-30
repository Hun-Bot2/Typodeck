#!/usr/bin/env bash
# Typodeck Skill — executable transcript of the SKILL.md worked examples.
# Usage: skills/typodeck/EXAMPLES.sh [OUT_DIR]   (default OUT_DIR=/tmp/typodeck-skill)
# Exit 0 with PASS when every runnable example produces its stated artifacts.
# Prints SKIP (still exit 0) only when an external precondition is missing:
#   - GitHub quota exhausted (Ex2), or Phase 4 eval scripts absent (Ex3).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="${1:-/tmp/typodeck-skill}"
IDEA="A neighborhood tool library: members borrow power tools, camping gear, and kitchen equipment for a small monthly fee instead of buying. Each branch stocks 400 items, tracks loans with QR tags, and runs weekend repair workshops. Revenue comes from memberships, late fees, and workshop tickets. The goal is 2,000 members per branch within 18 months while keeping utilization above 60 percent."

pass=0
skip=0
cd "$ROOT"
mkdir -p "$OUT"
printf '%s' "$IDEA" > "$OUT/idea.txt"
echo "idea.txt chars: $(wc -c < "$OUT/idea.txt" | tr -d ' ') (bound 100-20000)"

echo "--- Ex1: idea -> 3 systems -> export ---"
for system in editorial swiss expressive; do
  out="$OUT/idea-$system.pptx"
  log="$(npm run --silent deck -- --idea-file "$OUT/idea.txt" --system "$system" --out "$out" 2>&1)"
  echo "$log" | grep -E '^(provider|claims|deck|validation):'
  echo "$log" | grep -q '^validation: OK$' || { echo "FAIL: $system missing validation OK"; exit 1; }
  [ -f "$out" ] || { echo "FAIL: $out not written"; exit 1; }
  pass=$((pass + 1))
done

echo "--- Ex2: repo -> grounded deck ---"
quota="$(curl -s -m 10 https://api.github.com/rate_limit | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(JSON.parse(s).resources.core.remaining)}catch{console.log('unknown')}})")"
echo "github core quota remaining: $quota"
if [ "$quota" = "0" ] || [ "$quota" = "unknown" ]; then
  echo "SKIP Ex2: no GitHub quota (quota=$quota)"
  skip=$((skip + 1))
else
  out="$OUT/repo-editorial.pptx"
  log="$(npm run --silent deck -- --repo sindresorhus/is --system editorial --out "$out" 2>&1)"
  echo "$log" | grep -E '^(provider|claims|deck|validation|failed):'
  if echo "$log" | grep -q 'rate-limited'; then
    echo "SKIP Ex2: GitHub quota hit mid-run (honest typed error, no artifact claimed)"
    skip=$((skip + 1))
  else
    echo "$log" | grep -q '^validation: OK$' || { echo "FAIL: repo deck missing validation OK"; exit 1; }
    [ -f "$out" ] || { echo "FAIL: $out not written"; exit 1; }
    pass=$((pass + 1))
  fi
fi

echo "--- Ex3: eval re-run (Phase 4 scripts; spec docs/EVALUATION.md section 4) ---"
has_eval="$(node -p "Boolean(require('./package.json').scripts.eval && require('./package.json').scripts['eval:report'])")"
if [ "$has_eval" != "true" ]; then
  echo "SKIP Ex3: eval scripts not present on this baseline"
  skip=$((skip + 1))
else
  npm run --silent eval -- --fixture F4 2>&1 | tail -8
  report="$(npm run --silent eval:report 2>&1 | tail -12)"
  echo "$report"
  echo "$report" | grep -q '^OVERALL: PASS$' || { echo "FAIL: eval report not OVERALL PASS"; exit 1; }
  [ -f "evals/summary.json" ] || { echo "FAIL: evals/summary.json missing"; exit 1; }
  pass=$((pass + 1))
fi

echo "--- artifacts ---"
ls -la "$OUT"
echo "PASS examples=$pass skipped=$skip out=$OUT"
