#!/usr/bin/env bash
# Typodeck Skill helper — probe GitHub core quota WITHOUT spending budget.
# Usage: scripts/check-quota.sh
# Prints: quota_remaining=<N|unknown> quota_reset=<ISO|unknown>
# Exit 0 always (a probe never fails the caller); callers decide SKIP vs run.
set -uo pipefail

resp="$(curl -s -m 10 https://api.github.com/rate_limit 2>/dev/null || true)"
if [ -z "$resp" ]; then
  echo "quota_remaining=unknown quota_reset=unknown"
  exit 0
fi
echo "$resp" | node -e "
let s='';
process.stdin.on('data',d=>s+=d).on('end',()=>{
  try {
    const j=JSON.parse(s), c=j.resources.core;
    const reset=c.reset?new Date(c.reset*1000).toISOString():'unknown';
    console.log('quota_remaining='+c.remaining+' quota_reset='+reset);
  } catch { console.log('quota_remaining=unknown quota_reset=unknown'); }
});"
