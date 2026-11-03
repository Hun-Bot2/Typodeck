// Bounded repair: map failing checks to builder adjustments.
// Max REPAIR_ROUNDS render cycles per slide; each round applies at most one
// strategy per failing dimension. Repairs only shrink/rebalance within the
// spec (title ladder, body size, numeral size, table size) — never restructure.

export const REPAIR_ROUNDS = 3;

const TITLE_STEPS = [118, 104, 96, 72, 56, 48, 40];

function stepDown(current, min = 40) {
  // TITLE_STEPS is descending: first entry below current is the next rung.
  const next = TITLE_STEPS.find((s) => s < current - 1);
  return Math.max(next ?? current * 0.85, min);
}

/**
 * Propose adjustments for the next render round.
 * Returns null when no applicable strategy remains (repair exhausted).
 */
export function proposeRepair({ failures, adjust, slide, role }) {
  const next = { ...adjust };
  const applied = [];
  const overflowKeys = failures.overflow?.items ?? [];
  const clipKeys = failures.clip?.items ?? [];
  const mentions = (items, ...words) => items.some((i) => words.some((w) => i.includes(w)));

  if (overflowKeys.length > 0 || clipKeys.length > 0) {
    const all = [...overflowKeys, ...clipKeys];
    if (mentions(all, 'title', 'statement', 'document')) {
      const cur = next.titlePx ?? guessTitle(role, slide);
      const down = stepDown(cur);
      if (down < cur - 0.5) {
        next.titlePx = Math.round(down);
        applied.push(`titlePx ${cur}->${next.titlePx}`);
      }
    }
    if (mentions(all, 'sub', 'statlab', 'zone-', 'findings', 'cap', 'tfoot', 'table')) {
      const cur = next.tablePx ?? 21;
      if (role === 'dense' && cur > 16) {
        next.tablePx = cur - 2;
        applied.push(`tablePx ${cur}->${next.tablePx}`);
      } else if (role === 'evidence' && (next.statsPx ?? 150) > 96) {
        next.statsPx = (next.statsPx ?? 150) - 18;
        applied.push(`statsPx ->${next.statsPx}`);
      } else if (!next.bodyTight) {
        next.bodyTight = true;
        applied.push('bodyTight (noted: tighten copy)');
      }
    }
    if (mentions(all, 'numeral')) {
      const cur = next.numeralPx ?? (role === 'dense' ? 300 : 400);
      if (cur > 220) {
        next.numeralPx = cur - 40;
        applied.push(`numeralPx ${cur}->${next.numeralPx}`);
      }
    }
    if (mentions(all, 'meta', 'rail')) {
      if (!next.railTrim) {
        next.railTrim = true;
        applied.push('railTrim (drop empty meta rows)');
      }
    }
  }

  // Verbatim failures are content bugs, not layout bugs: no auto-repair.
  if (applied.length === 0) return null;
  return { adjust: next, applied };
}

function guessTitle(role, slide) {
  const len = (slide.title ?? slide.statement ?? '').length;
  if (role === 'cover' || role === 'closing') return len <= 45 ? 118 : len <= 80 ? 72 : 48;
  if (role === 'divider') return 72;
  if (role === 'statement') return len <= 60 ? 104 : 72;
  if (role === 'comparison') return 56;
  return 48;
}
