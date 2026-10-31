/**
 * Landing page data — every factual claim below was verified against repo code
 * or the showcase evidence package. See PROVENANCE.md in
 * `apps/web/public/landing/` for image origins.
 *
 * Code refs (all read-only; nothing here modifies core or the renderer):
 * - caps: packages/core/src/ingestion.ts (MAX_FILES=20, MAX_TOTAL_BYTES=200KB,
 *   MIN/MAX_IDEA_CHARS=100/20000)
 * - claims: packages/core/src/evidence.ts (verified/suggestion/ungrounded,
 *   numbers copied never computed, MAX_CLAIMS_TOTAL=40)
 * - narrative: packages/core/src/narrative.ts (5-12 slides, captionFor refs)
 * - export: packages/core/src/export.ts (exportToPptx* only — PPTX, no
 *   Markdown/HTML export), apps/web/app/api/export/route.ts (PPTX + validate)
 * - generate: apps/web/app/api/generate/route.ts (idea|repo, SSE stages)
 * - validate: packages/core/src/validate.ts (16:9, text shapes, editable chars)
 */

export const GITHUB_URL = 'https://github.com/Hun-Bot2/Typodeck';

export const SYSTEMS = [
  {
    id: 'editorial',
    blurb:
      'Asymmetric single column, serif titles, generous whitespace. One large idea per slide.',
  },
  {
    id: 'swiss',
    blurb:
      'Four-column grid, tight leading, high density. Title left, supporting text right.',
  },
  {
    id: 'expressive',
    blurb:
      'Centered hero composition with dramatic scale contrast on alternating ink/paper.',
  },
  {
    id: 'document',
    blurb:
      'Dense reference hierarchy in a technical-manual voice. Experimental.',
  },
] as const;

export type SystemId = (typeof SYSTEMS)[number]['id'];

export interface DemoDeck {
  slug: string;
  repo: string;
  repoUrl: string;
  sha: string;
  branch: string;
  system: SystemId;
  seed: number;
  purpose: string;
  files: number;
  bytes: number;
  filesNote: string;
  claims: { total: number; verified: number; suggestion: number; ungrounded: number };
  slides: number;
  boxes: number;
  editableChars: number;
  cover: string;
  filmstrip: string;
}

export const DEMO_DECKS: DemoDeck[] = [
  {
    slug: 'is-swiss',
    repo: 'sindresorhus/is',
    repoUrl: 'https://github.com/sindresorhus/is',
    sha: 'e9c026c',
    branch: 'main',
    system: 'swiss',
    seed: 1143001754,
    purpose: 'Tool showcase: is',
    files: 7,
    bytes: 31963,
    filesNote: 'readme.md (925 lines), source/types.ts, license, AGENTS.md, …',
    claims: { total: 38, verified: 29, suggestion: 9, ungrounded: 0 },
    slides: 12,
    boxes: 46,
    editableChars: 1332,
    cover: '/landing/is-swiss.slide1.png',
    filmstrip: '/landing/is-swiss.filmstrip.png',
  },
  {
    slug: 'dayjs-editorial',
    repo: 'iamkun/dayjs',
    repoUrl: 'https://github.com/iamkun/dayjs',
    sha: '436bde0',
    branch: 'dev',
    system: 'editorial',
    seed: 1713200736,
    purpose: 'Adoption case for Day.js',
    files: 20,
    bytes: 30275,
    filesNote: '20-file cap reached; further files skipped (disclosed in warnings)',
    claims: { total: 40, verified: 3, suggestion: 37, ungrounded: 0 },
    slides: 12,
    boxes: 46,
    editableChars: 1987,
    cover: '/landing/dayjs-editorial.slide1.png',
    filmstrip: '/landing/dayjs-editorial.filmstrip.png',
  },
  {
    slug: 'handbook-expressive',
    repo: 'microsoft/TypeScript-Handbook',
    repoUrl: 'https://github.com/microsoft/TypeScript-Handbook',
    sha: '543d2df',
    branch: 'master',
    system: 'expressive',
    seed: 33113867,
    purpose: 'Docs guide: TypeScript Handbook',
    files: 20,
    bytes: 167837,
    filesNote: '20-file cap reached; further files skipped (disclosed in warnings)',
    claims: { total: 40, verified: 0, suggestion: 40, ungrounded: 0 },
    slides: 12,
    boxes: 46,
    editableChars: 1909,
    cover: '/landing/handbook-expressive.slide1.png',
    filmstrip: '/landing/handbook-expressive.filmstrip.png',
  },
];

/** Real evidence → slide chain from the is-swiss deck JSON (slide n5-point). */
export const EVIDENCE_EXAMPLE = {
  claim: 'Extensive use of type guards',
  caption: 'Source: readme.md:12',
  slide: 'swiss slide 5 · kicker + title + body + caption, laid out on the 4-column grid',
};
