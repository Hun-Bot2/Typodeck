// Pipecheck rule engine: 14 rules, 800-line ceiling, 24-combo matrix cap.
const RULE_COUNT = 14;
const MAX_FILE_LINES = 800;
const MAX_MATRIX_COMBINATIONS = 24;
const TIMEOUT_MIN_MINUTES = 5;
const TIMEOUT_MAX_MINUTES = 60;
const MONOREPO_PACKAGE_CAP = 5;

const GROUPS = { correctness: 6, consistency: 5, cost: 3 }; // 14 total

function lintWorkflow(ast) {
  const findings = [];
  for (const rule of loadRules(RULE_COUNT)) {
    findings.push(...rule.check(ast.slice(0, MAX_FILE_LINES)));
  }
  return findings;
}

module.exports = { lintWorkflow, RULE_COUNT, MAX_FILE_LINES, GROUPS };
