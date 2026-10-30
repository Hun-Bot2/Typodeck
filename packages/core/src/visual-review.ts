/**
 * Workflow tokens that must never appear in rendered slide content.
 * Previews must read as real slides, never as diagnostic cards
 * (frontend-slides "preview authenticity rules"; slide-wright Step 2).
 * Matching is case-insensitive substring over the full HTML document.
 */
export const WORKFLOW_TOKENS: readonly string[] = [
  'preview.md',
  'design.md',
  'selection-index',
  'option a',
  'option b',
  'option c',
  'style option',
  'safe option',
  'bold option',
  'wildcard',
  'generated from',
  'template slug',
];

/** Return the workflow tokens found in rendered HTML (empty = authentic). */
export function findWorkflowTokens(html: string): string[] {
  const lower = html.toLowerCase();
  return WORKFLOW_TOKENS.filter((t) => lower.includes(t));
}
