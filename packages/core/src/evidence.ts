// Typodeck Phase 2 — evidence extraction.
// Pure, deterministic claim extraction over ingested files. No LLM in the
// extraction path: claims are sentence-like units sliced from source text
// with file/line refs. Numbers are only ever copied from the source text.
//
// Claim kinds:
// - repo code files                     -> 'verified'
// - repo README/docs                    -> 'suggestion' (unverified until a
//                                          code file confirms a distinctive
//                                          term -> upgraded to 'verified')
// - idea text                           -> 'ungrounded' (refs point at the
//                                          user's own idea.txt lines — honest
//                                          pointers, not external evidence)

import type { Ingested, IngestedFile } from './ingestion';
import type { ModelProvider } from './provider';

export type ClaimKind = 'verified' | 'suggestion' | 'ungrounded';

export interface ClaimRef {
  path: string;
  lines?: [number, number];
}

export interface Claim {
  id: string;
  text: string;
  kind: ClaimKind;
  refs: ClaimRef[];
  /** Every numeric token in text, copied verbatim from the source. */
  numbers: string[];
}

export const MAX_CLAIMS_PER_FILE = 24;
export const MAX_CLAIMS_TOTAL = 60;

/**
 * Numeric tokens, copied verbatim from the source — never computed.
 * Captures compact units (98%, 120ms, 2kB), hyphenated units (90-second,
 * 30-day), one following unit word optionally scaled (40 percent,
 * 50 million downloads), and directly-attached Korean counters (20분, 3만원).
 * Guarded on both ends: no fabricated units from following words
 * ("12 storage" stays "12", never "12 s"), and no digit prefixes of
 * hashes/identifiers ("436bde0…" and "utf8" yield nothing).
 * Versions (v2.1, 3.2) and date fragments are still copied — hero-metric
 * eligibility is decided later by the semantics module, not here.
 */
const NUMBER_UNIT_WORD =
  'percent|dollars?|cents?|seconds?|minutes?|hours?|days?|weeks?|months?|years?' +
  '|times|fold|people|households?|users?|teams?|members?|customers?|downloads?' +
  '|products?|items?|orders?|tickets?|phases?|steps?|zones?|services?|stores?' +
  '|chains?|panels?|functions?|palettes?|plugins?|endpoints?|requests?|models?|experiments?|lines?';
const NUMBER_SCALE_WORD = 'thousand|million|billion';
const NUMBER_HYPHEN_UNIT =
  'second|minute|hour|day|week|month|year|dollar|percent|fold|time|star';
// Korean counter units attach directly: 20분, 3만원, 5000개, 30초, 2주.
// Deliberately no 월 (month names are date fragments, rejected downstream).
const NUMBER_KO_UNIT = '시간|개월|만?원|초|분|주|년|명|개|번|회|배|일';
const NUMBER_RE = new RegExp(
  // Tokens must end with a digit: ".add(1, 'day')" yields "1", never "1,".
  '\\bv?\\d(?:[\\d,]*\\d)?(?:\\.\\d+)?' +
    `(?:\\s?(?:%|kB|KB|MB|ms|s|x)|(?:${NUMBER_KO_UNIT}))?` +
    `(?:-(?:${NUMBER_HYPHEN_UNIT})s?)?` +
    '(?![0-9a-zA-Z_])' +
    `(?:\\s(?:${NUMBER_SCALE_WORD})(?:\\s(?:${NUMBER_UNIT_WORD}))?|\\s(?:${NUMBER_UNIT_WORD}))?` +
    '(?![a-zA-Z])',
  'g',
);

const MIN_CLAIM_CHARS = 20;
/** Upper bound for claim text; user reframes are held to the same limit. */
export const MAX_CLAIM_CHARS = 280;

/** Relocation notices are repo metadata, not project content. */
const RELOCATION_NOTICE = /this repos?(itory)? has moved|please file (issues|bugs|tickets|prs)/i;

function isRelocationNotice(line: string): boolean {
  return RELOCATION_NOTICE.test(line);
}

function isLicenseBoilerplate(line: string): boolean {
  const lowered = line.toLowerCase();
  return LICENSE_BOILERPLATE.some((p) => lowered.includes(p));
}

/** License boilerplate carries no narrative content; never let it headline a slide. */
const LICENSE_BOILERPLATE = [
  'permission is hereby granted',
  'without warranty',
  'express or implied',
  'including but not limited to',
  'furnished to do so',
  'in no event shall',
  'copies or substantial portions',
  'the above copyright notice',
  'all rights reserved',
  'redistribution and use',
  'licensed under the apache',
  'you may not use this file except',
  'deal in the software',
  // Wrapped MIT/BSD fragments (single lines of wrapped headers).
  'copyright',
  'without limitation the rights',
  'a copy of this software',
  'associated documentation files',
  'liable for any',
  'damages or other liability',
  'other dealings in the',
  'fitness for a particular purpose',
  'merchantability',
  'the software is provided',
];

function extractNumbers(text: string): string[] {
  return text.match(NUMBER_RE) ?? [];
}

function isCodePath(path: string): boolean {
  return /\.(js|mjs|cjs|ts|tsx|jsx|py|rb|go|rs|java|kt|swift|c|h|cc|cpp|hpp|cs|php)$/i.test(path);
}

function isIdeaPath(path: string): boolean {
  return path === 'idea.txt';
}

/**
 * Conservative inline-markup strip for kept code lines (comments, TSDoc
 * bodies). Links are unwrapped only when URL-targeted, so `a[i](x)`-style
 * code can never be mangled into prose.
 */
function stripCodeMarkup(line: string): string {
  return line
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]*)\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/<\/?[a-zA-Z][^<>]*>/g, '')
    .trim();
}

/** Strip markdown/code noise; returns null for lines that carry no claims. */
function cleanLine(raw: string, code: boolean): string | null {
  let line = raw.trim();
  if (line.length === 0) return null;
  if (code) {
    // Keep comment text; drop pure code lines (braces, imports, etc.).
    const comment = line.match(/^(?:\/\/|#|;|\*|<!--|\/\*)\s?(.*)$/);
    if (comment) {
      line = comment[1].replace(/(\*\/|-->)\s*$/, '').trim();
      if (isLicenseBoilerplate(line) || isRelocationNotice(line)) return null;
      if (/eslint-disable\b/i.test(line)) return null; // linter directives are tooling, not narrative
      if (/extracted from https?:\/\//i.test(line)) return null; // URL attributions carry no project meaning
      line = stripCodeMarkup(line);
    } else if (/^[{}()[\];:=<>|&!?.+\-/*%@$]/.test(line) || /[{};]\s*$/.test(line)) {
      return null;
    } else if (/(&&|\|\||===|==|!=|=>|->|\+\+|--|<<|>>)/.test(line)) {
      return null; // boolean/comparison/bitwise logic is code, never narrative
    } else if (/^(defined\?|(import|export|require|const|let|var|function|class|def|return|if|for|while)\b)/.test(line)) {
      return null;
    } else {
      line = stripCodeMarkup(line); // TSDoc bodies keep markdown links/spans
    }
  } else {
    line = line.replace(/^(\s*>)+\s*/, ''); // blockquote prefixes
    if (/^#{1,6}\s/.test(line)) line = line.replace(/^#{1,6}\s+/, '');
    if (/^(\s*[-*+]|\d+[.)])\s+/.test(line)) line = line.replace(/^(\s*[-*+]|\d+[.)])\s+/, '');
    if (/^(!\[|https?:\/\/|```|<[a-z/!])/.test(line)) return null;
    if (/^(\||\s*:?-{2,}:?)(\s*\|)+/.test(line)) return null; // tables
    if (/^\|.*\|$/.test(line)) return null; // full-pipe table rows
    if (/^[\s|:-]+$/.test(line)) return null;
    // Badge images -> nothing; links -> link text; then any bare HTML tags.
    line = line.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    line = line.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    line = line.replace(/\[\]\([^)]*\)/g, '');
    line = line.replace(/`([^`]*)`/g, '$1');
    line = line.replace(/\*\*([^*]+)\*\*/g, '$1');
    line = line.replace(/<\/?[a-zA-Z][^<>]*>/g, '');
    line = line.trim();
    if (/^\w+="[^"]*"\s*\/?>?$/.test(line)) return null; // wrapped-tag attribute residue
    if (/^(\[[^\]]*\]:\s*\S+)/.test(line)) return null; // ref defs
    if (isLicenseBoilerplate(line) || isRelocationNotice(line)) return null;
  }
  line = line.replace(/\s+/g, ' ').trim();
  if (line.length < MIN_CLAIM_CHARS || line.length > MAX_CLAIM_CHARS) return null;
  if (!/[a-zA-Z\uAC00-\uD7A3\u3040-\u30FF\u4E00-\u9FFF]/.test(line)) return null;
  return line;
}

interface Candidate {
  text: string;
  startLine: number;
  endLine: number;
}

/** Split a file into sentence-like claim candidates with line spans. */
function candidatesFor(file: IngestedFile): Candidate[] {
  const code = isCodePath(file.path);
  const lines = file.text.split('\n');
  const out: Candidate[] = [];
  // License/copyright headers cluster at the top of code files; wrapped
  // legalese lines read as fragments, so comment claims from a marker-dense
  // head are dropped wholesale (narrative rarely lives in headers).
  const headText = code ? lines.slice(0, 30).join('\n').toLowerCase() : '';
  const headMarkers = ['copyright', 'license', 'permission', 'warranty', 'merchantability', 'liability', 'furnished', 'redistribution']
    .filter((m) => headText.includes(m)).length;
  const inLicenseHead = headMarkers >= 2;
  let buf = '';
  let bufStart = 1;
  const flush = (endLine: number): void => {
    const cleaned = cleanLine(buf, code);
    if (cleaned && !(inLicenseHead && endLine <= 30)) out.push({ text: cleaned, startLine: bufStart, endLine });
    buf = '';
  };
  lines.forEach((raw, i) => {
    const lineNo = i + 1;
    const trimmed = raw.trim();
    if (trimmed === '' || trimmed === '```') {
      if (buf !== '') flush(lineNo - 1);
      bufStart = lineNo + 1;
      return;
    }
    if (buf === '') bufStart = lineNo;
    // Sentence boundary inside the line: split eagerly for atomicity.
    const parts = raw.split(/(?<=[.!?])\s+(?=[A-Z\uAC00-\uD7A3"“])/);
    parts.forEach((part, j) => {
      if (j > 0 && buf !== '') {
        flush(lineNo);
        bufStart = lineNo;
      }
      buf = buf === '' ? part : `${buf} ${part}`;
      if (j < parts.length - 1) {
        flush(lineNo);
        bufStart = lineNo;
      }
    });
    // Markdown/code lines are atomic: flush at end of line.
    if (buf !== '') {
      flush(lineNo);
      bufStart = lineNo + 1;
    }
  });
  if (buf !== '') flush(lines.length);
  return out.slice(0, MAX_CLAIMS_PER_FILE);
}

const STOPWORDS = new Set(
  'the,and,for,with,that,this,from,have,has,are,was,were,will,would,can,should,into,your,you,our,their,they,them,then,than,when,what,which,who,how,all,any,each,more,most,other,such,only,also,use,used,using,its,including,provides,supports,based'.split(','),
);

/** Distinctive lowercase terms (length ≥ 6, not stopwords). */
function distinctiveTerms(text: string): Set<string> {
  const terms = new Set<string>();
  for (const word of text.toLowerCase().match(/[a-z][a-z0-9_-]{5,}/g) ?? []) {
    if (!STOPWORDS.has(word)) terms.add(word);
  }
  return terms;
}

/**
 * Extract atomic claims from ingested input. Deterministic: same ingested
 * bytes -> same claims. README/docs claims start as 'suggestion' and are
 * upgraded to 'verified' only when a code file contains a distinctive term
 * from the claim (code confirmation).
 */
export function extractClaims(ingested: Ingested): Claim[] {
  const claims: Claim[] = [];
  let seq = 0;

  // Code-file term index for confirmation upgrades.
  const codeTerms = new Set<string>();
  if (ingested.kind === 'repo') {
    for (const f of ingested.files) {
      if (isCodePath(f.path)) {
        for (const t of distinctiveTerms(f.text)) codeTerms.add(t);
      }
    }
  }

  for (const file of ingested.files) {
    for (const cand of candidatesFor(file)) {
      if (claims.length >= MAX_CLAIMS_TOTAL) break;
      seq += 1;
      const ref: ClaimRef = { path: file.path, lines: [cand.startLine, cand.endLine] };
      let kind: ClaimKind;
      if (ingested.kind === 'idea' || isIdeaPath(file.path)) {
        kind = 'ungrounded';
      } else if (isCodePath(file.path)) {
        kind = 'verified';
      } else {
        kind = 'suggestion';
        for (const t of distinctiveTerms(cand.text)) {
          if (codeTerms.has(t)) {
            kind = 'verified';
            break;
          }
        }
      }
      claims.push({
        id: `c${seq}`,
        text: cand.text,
        kind,
        refs: [ref],
        numbers: extractNumbers(cand.text),
      });
    }
  }
  return claims;
}

/**
 * Optional provider-backed phrasing pass. Refs are always preserved: the
 * rephrased text replaces the original ONLY when every numeric token from
 * the original still appears verbatim (no invented/altered numbers).
 * Default path never calls this (no LLM in extraction).
 */
export async function rephraseClaims(claims: Claim[], provider: ModelProvider): Promise<Claim[]> {
  const out: Claim[] = [];
  for (const claim of claims) {
    try {
      const res = await provider.complete(
        `Rephrase this slide bullet concisely, preserving every number exactly: "${claim.text}"`,
      );
      const text = res.text.replace(/\s+/g, ' ').trim().slice(0, MAX_CLAIM_CHARS);
      const preserved = claim.numbers.every((n) => text.includes(n));
      out.push({ ...claim, text: preserved && text.length >= 10 ? text : claim.text });
    } catch {
      out.push(claim);
    }
  }
  return out;
}
