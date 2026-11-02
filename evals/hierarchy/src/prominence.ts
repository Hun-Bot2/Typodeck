// Stage-4 hierarchy eval: frozen C4 prominence proxy, re-implemented verbatim.
// Formula: P = fontSize * (1 + (fontWeight - 400) / 400 * 0.25).
// Purely typographic (size x weight); roles excluded. The runner asserts
// bit-equality against core critic.prominenceProxy on every measured block
// (gate: prominence-parity); any drift fails the run.

/** C4 frozen prominence proxy. */
export function prominenceProxy(fontSize: number, fontWeight: number): number {
  return fontSize * (1 + ((fontWeight - 400) / 400) * 0.25);
}

/** Intent rank for Spearman: primary > secondary > supporting > absent-last. */
export function intentRank(emphasis: string | undefined): number {
  if (emphasis === 'primary') return 0;
  if (emphasis === 'secondary') return 1;
  if (emphasis === 'supporting') return 2;
  return 3;
}

/**
 * Ranks with averaged ties (1-based). E.g. values [5,5,1] -> [1.5,1.5,3]
 * when ranking descending, [2.5,2.5,1] ascending.
 */
export function averagedRanks(values: number[], descending: boolean): number[] {
  const order = values
    .map((v, i) => ({ v, i }))
    .sort((a, b) => (descending ? b.v - a.v : a.v - b.v));
  const ranks = new Array<number>(values.length);
  let r = 1;
  let k = 0;
  while (k < order.length) {
    let j = k;
    while (j + 1 < order.length && order[j + 1].v === order[k].v) j++;
    const avg = (r + (r + (j - k))) / 2;
    for (let t = k; t <= j; t++) ranks[order[t].i] = avg;
    r += j - k + 1;
    k = j + 1;
  }
  return ranks;
}

/**
 * Spearman rho via Pearson on averaged ranks.
 * Returns null when either side has zero variance (undefined rho).
 */
export function spearman(x: number[], y: number[]): number | null {
  if (x.length !== y.length || x.length < 2) return null;
  const rx = averagedRanks(x, false);
  const ry = averagedRanks(y, false);
  const n = x.length;
  const mx = rx.reduce((a, b) => a + b, 0) / n;
  const my = ry.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < n; i++) {
    cov += (rx[i] - mx) * (ry[i] - my);
    vx += (rx[i] - mx) * (rx[i] - mx);
    vy += (ry[i] - my) * (ry[i] - my);
  }
  if (vx === 0 || vy === 0) return null;
  return cov / Math.sqrt(vx * vy);
}
