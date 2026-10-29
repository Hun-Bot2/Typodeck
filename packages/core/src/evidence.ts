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

export const MAX_CLAIMS_PER_FILE = 12;
export const MAX_CLAIMS_TOTAL = 40;

/** Numeric tokens: 1,000 / 3.5 / 98% / v2 / 2kB. Copied, never computed. */
const NUMBER_RE = /\bv?\d[\d,]*(?:\.\d+)?(?:\s?(?:%|kB|KB|MB|ms|s|x))?/g;

const MIN_CLAIM_CHARS = 20;
const MAX_CLAIM_CHARS = 280;

function extractNumbers(text: string): string[] {
  return text.match(NUMBER_RE) ?? [];
}

function isCodePath(path: string): boolean {
  return /\.(js|mjs|cjs|ts|tsx|jsx|py|rb|go|rs|java|kt|swift|c|h|cc|cpp|hpp|cs|php)$/i.test(path);
}

function isIdeaPath(path: string): boolean {
  return path === 'idea.txt';
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
    } else if (/^[{}()[\];:=<>|&!?.+\-/*%@$]/.test(line) || /[{};]\s*$/.test(line)) {
      return null;
    } else if (/^(import|export|require|const|let|var|function|class|def|return|if|for|while)\b/.test(line)) {
      return null;
    }
  } else {
    if (/^#{1,6}\s/.test(line)) line = line.replace(/^#{1,6}\s+/, '');
    if (/^(\s*[-*+]|\d+[.)])\s+/.test(line)) line = line.replace(/^(\s*[-*+]|\d+[.)])\s+/, '');
    if (/^(!\[|https?:\/\/|```|<[a-z/!])/.test(line)) return null;
    if (/^(\||\s*:?-{2,}:?)(\s*\|)+/.test(line)) return null; // tables
    if (/^[\s|:-]+$/.test(line)) return null;
    // Markdown links -> link text.
    line = line.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    line = line.replace(/`([^`]*)`/g, '$1');
    if (/^(\[[^\]]*\]:\s*\S+)/.test(line)) return null; // ref defs
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
  let buf = '';
  let bufStart = 1;
  const flush = (endLine: number): void => {
    const cleaned = cleanLine(buf, code);
    if (cleaned) out.push({ text: cleaned, startLine: bufStart, endLine });
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
