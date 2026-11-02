// Stage-4 hierarchy eval: metric aggregation.
// Reports each metric separately. There is intentionally NO single combined
// score: a combined number would hide the modality gaps this suite exists
// to measure (09-HCI §4 A/B/C/D design).

import { hitsCategory } from './arms';
import type { ArmFinding, DefectCategory, PRPoint, ScoredItem } from './types';

export const CATEGORIES: DefectCategory[] = [
  'headline-prominence',
  'number-scale',
  'grouping',
  'clip',
  'contrast',
];

/**
 * Per-category, per-arm precision/recall.
 * Positives for category k = items with a planted seed of category k.
 * Negatives = clean items (no seeds). Cross-category items are excluded
 * from k's negatives so one defect cannot count as another's false alarm.
 */
export function precisionRecall(
  items: ScoredItem[],
  category: DefectCategory,
  arm: 'A' | 'C',
): PRPoint & { positives: number; negatives: number } {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let positives = 0;
  let negatives = 0;
  for (const it of items) {
    const findings: ArmFinding[] = arm === 'A' ? it.findingsA : it.findingsC;
    const planted = it.seeds.some((s) => s.category === category);
    if (planted) {
      positives++;
      if (hitsCategory(findings, category)) tp++;
      else fn++;
    } else if (it.seeds.length === 0) {
      negatives++;
      if (hitsCategory(findings, category)) fp++;
    }
  }
  return {
    tp,
    fp,
    fn,
    positives,
    negatives,
    precision: tp + fp === 0 ? null : tp / (tp + fp),
    recall: tp + fn === 0 ? null : tp / (tp + fn),
  };
}

export interface Summary {
  n: number;
  mean: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  sd: number | null;
  /** Values excluded (null rho) and why. */
  excluded: number;
}

/** Mean/median/min/max/sd over non-null values. */
export function summarize(values: (number | null)[]): Summary {
  const xs = values.filter((v): v is number => v !== null);
  if (xs.length === 0) {
    return {
      n: 0,
      mean: null,
      median: null,
      min: null,
      max: null,
      sd: null,
      excluded: values.length,
    };
  }
  const sorted = [...xs].sort((a, b) => a - b);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  const variance =
    xs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / xs.length;
  return {
    n: xs.length,
    mean,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    sd: Math.sqrt(variance),
    excluded: values.length - xs.length,
  };
}

export function fmt(n: number | null, digits = 3): string {
  if (n === null || !Number.isFinite(n)) return 'n/a';
  return n.toFixed(digits);
}
