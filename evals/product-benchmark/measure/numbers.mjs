// Shared number-token definition for the product benchmark (protocol §6a).
// One regex in one file; manifest oracle and slide audit use the same one.
export const NUMBER_RE = /(?:v|\$)?\d[\d,]*(?:\.\d+)?%?/g;

// Structural exclusions: tokens that are presentation chrome, not claims.
// Applied ONLY to slide visible text, never to the source oracle.
const EXCLUDE_RE = [
  /^\d{1,2}\s*\/\s*\d{1,2}$/, // slide counters "3 / 8"
  /^16:9$/, // aspect tokens
  /^16\/9$/,
];

export function extractNumbers(text) {
  return (text.match(NUMBER_RE) ?? []).map((t) => t.trim()).filter(Boolean);
}

export function isStructural(token, context = '') {
  if (EXCLUDE_RE.some((re) => re.test(token))) return true;
  // Caption line refs ("src/import.js:12", "README.md:4-9", "idea.txt:5")
  // are the traceability mechanism itself (metric O2), not claims.
  if (/[A-Za-z0-9_./-]+\.(md|js|json|txt|ya?ml)\s*:\s*\d/.test(context)) return true;
  return false;
}

// Normalize for verbatim matching: strip commas ("1,200" vs "1200").
export function normNum(token) {
  return token.replace(/,/g, '');
}
