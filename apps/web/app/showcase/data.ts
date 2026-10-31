/**
 * Showcase page data — every figure below is copied from the committed
 * evidence: `showcase/decks/*.provenance.json` for the verified decks
 * (see `showcase/manifest.md`), and
 * `apps/web/public/showcase/harborlight-document.provenance.json`
 * (regenerable via `apps/web/scripts/showcase-experimental.js`) for the
 * experimental deck. Labels are binding: verified / experimental / research.
 */

export const GITHUB_URL = 'https://github.com/Hun-Bot2/Typodeck';

export type DeckLabel = 'verified' | 'experimental';

export interface ShowcaseDeck {
  slug: string;
  label: DeckLabel;
  title: string;
  source: string;
  sourceUrl: string | null;
  sha: string;
  branch: string;
  system: string;
  systemStatus: string;
  seed: number;
  purpose: string;
  files: string;
  claims: { total: number; verified: number; suggestion: number; ungrounded: number };
  slides: number;
  boxes: number;
  editableChars: number;
  filmstrip: string;
  filmstripAlt: string;
  pptx: string;
  pptxBytes: number;
  deckJson: string;
  provenanceJson: string;
  extraFiles: Array<{ href: string; label: string }>;
  repro: string;
  note: string;
}

export const VERIFIED_DECKS: ShowcaseDeck[] = [
  {
    slug: 'is-swiss',
    label: 'verified',
    title: 'sindresorhus/is → Swiss',
    source: 'sindresorhus/is',
    sourceUrl: 'https://github.com/sindresorhus/is',
    sha: 'e9c026c611c1160eaad50da00be4e676b626018f',
    branch: 'main',
    system: 'swiss',
    systemStatus: 'production',
    seed: 1143001754,
    purpose: 'Tool showcase: is',
    files: '7 files · 31,963 bytes',
    claims: { total: 38, verified: 29, suggestion: 9, ungrounded: 0 },
    slides: 12,
    boxes: 46,
    editableChars: 1332,
    filmstrip: '/landing/is-swiss.filmstrip.png',
    filmstripAlt: 'All 12 slides of the sindresorhus/is swiss deck',
    pptx: '/showcase/is-swiss.pptx',
    pptxBytes: 134653,
    deckJson: '/showcase/is-swiss.json',
    provenanceJson: '/showcase/is-swiss.provenance.json',
    extraFiles: [],
    repro:
      'node showcase/run-deck.js --repo sindresorhus/is --system swiss \\\n  --purpose "Tool showcase: is" --lang en \\\n  --out showcase/decks/is-swiss.pptx --json showcase/decks/is-swiss.json',
    note: 'Small dev tool; 29 of 38 claims code-verified. The strongest grounding of the three.',
  },
  {
    slug: 'dayjs-editorial',
    label: 'verified',
    title: 'iamkun/dayjs → Editorial',
    source: 'iamkun/dayjs',
    sourceUrl: 'https://github.com/iamkun/dayjs',
    sha: '436bde0bcded312781cbe45dc2b0ef079a36d8e3',
    branch: 'dev',
    system: 'editorial',
    systemStatus: 'production',
    seed: 1713200736,
    purpose: 'Adoption case for Day.js',
    files: '20 files · 30,275 bytes · cap reached, disclosed in warnings',
    claims: { total: 40, verified: 3, suggestion: 37, ungrounded: 0 },
    slides: 12,
    boxes: 46,
    editableChars: 1987,
    filmstrip: '/landing/dayjs-editorial.filmstrip.png',
    filmstripAlt: 'All 12 slides of the iamkun/dayjs editorial deck',
    pptx: '/showcase/dayjs-editorial.pptx',
    pptxBytes: 136351,
    deckJson: '/showcase/dayjs-editorial.json',
    provenanceJson: '/showcase/dayjs-editorial.provenance.json',
    extraFiles: [],
    repro:
      'node showcase/run-deck.js --repo iamkun/dayjs --system editorial \\\n  --purpose "Adoption case for Day.js" --lang en \\\n  --out showcase/decks/dayjs-editorial.pptx --json showcase/decks/dayjs-editorial.json',
    note: 'Substantial OSS library; mostly docs-sourced claims, honestly captioned unverified.',
  },
  {
    slug: 'handbook-expressive',
    label: 'verified',
    title: 'TypeScript-Handbook → Expressive',
    source: 'microsoft/TypeScript-Handbook',
    sourceUrl: 'https://github.com/microsoft/TypeScript-Handbook',
    sha: '543d2dff18ef2a081fba88753931142ffe887a1e',
    branch: 'master',
    system: 'expressive',
    systemStatus: 'production',
    seed: 33113867,
    purpose: 'Docs guide: TypeScript Handbook',
    files: '20 files · 167,837 bytes · cap reached, disclosed in warnings',
    claims: { total: 40, verified: 0, suggestion: 40, ungrounded: 0 },
    slides: 12,
    boxes: 46,
    editableChars: 1909,
    filmstrip: '/landing/handbook-expressive.filmstrip.png',
    filmstripAlt: 'All 12 slides of the TypeScript-Handbook expressive deck',
    pptx: '/showcase/handbook-expressive.pptx',
    pptxBytes: 136338,
    deckJson: '/showcase/handbook-expressive.json',
    provenanceJson: '/showcase/handbook-expressive.provenance.json',
    extraFiles: [],
    repro:
      'node showcase/run-deck.js --repo microsoft/TypeScript-Handbook --system expressive \\\n  --purpose "Docs guide: TypeScript Handbook" --lang en \\\n  --out showcase/decks/handbook-expressive.pptx --json showcase/decks/handbook-expressive.json',
    note: 'Docs-heavy repo with no confirming code terms: 0 verified claims, every caption says unverified.',
  },
];

export const EXPERIMENTAL_DECKS: ShowcaseDeck[] = [
  {
    slug: 'harborlight-document',
    label: 'experimental',
    title: 'Harborlight (original idea) → Document',
    source: 'original idea text',
    sourceUrl: null,
    sha: 'n/a (idea mode)',
    branch: 'n/a',
    system: 'document',
    systemStatus: 'experimental',
    seed: 1526367637,
    purpose: 'P01',
    files: 'idea.txt · 630 characters',
    claims: { total: 6, verified: 0, suggestion: 0, ungrounded: 6 },
    slides: 6,
    boxes: 24,
    editableChars: 1267,
    filmstrip: '/showcase/harborlight-document.filmstrip.png',
    filmstripAlt: 'All 6 slides of the Harborlight document deck',
    pptx: '/showcase/harborlight-document.pptx',
    pptxBytes: 88721,
    deckJson: '/showcase/harborlight-document.json',
    provenanceJson: '/showcase/harborlight-document.provenance.json',
    extraFiles: [{ href: '/showcase/harborlight-document.idea.txt', label: 'idea.txt (source)' }],
    repro: 'npm run build -w @typodeck/core && node apps/web/scripts/showcase-experimental.js',
    note: 'Labeled experimental because the document system is non-production — not because the run is weaker: same validator, same honesty labels.',
  },
];
