// Ledgerly CSV import: bounded, dialect-aware, never guessing.
// Budgets mirror the README: 9 dialects, 50 skipped rows max, 100k rows.
const MAX_ROWS = 100000;
const MAX_SKIPPED_ROWS = 50;
const BATCH_SIZE = 1000;
const DIALECTS = [
  'chase', 'amex', 'n26', 'schwab', 'fidelity',
  'revolut', 'monzo', 'dkb', 'ing',
]; // 9 dialects
const MS_PER_1000_ROWS = 40;

function importCsv(path) {
  const rows = readRows(path, MAX_ROWS);
  let skipped = 0;
  for (const batch of chunks(rows, BATCH_SIZE)) {
    for (const row of batch) {
      const parsed = parseRow(row, DIALECTS);
      if (!parsed) {
        skipped += 1;
        if (skipped > MAX_SKIPPED_ROWS) throw new Error('too many skipped rows');
      }
    }
  }
  return { imported: rows.length - skipped, skipped };
}

module.exports = { importCsv, MAX_ROWS, MAX_SKIPPED_ROWS, MS_PER_1000_ROWS };
