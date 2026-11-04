// Sweep honesty: stale reports must never mask a current-run crash.
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyEntry } from '../sweep.mjs';

const passReport = {
  status: 'PASS', builder: 'generic',
  slides: [{ status: 'PASS', file: 'slides/01.html' }],
};
const failReport = {
  status: 'FAIL', builder: 'generic',
  slides: [
    { status: 'PASS', file: 'slides/01.html' },
    { status: 'FAIL', file: 'slides/02.html' },
  ],
};

test('exit 0 + PASS report classifies PASS', () => {
  const e = classifyEntry({ status: 0, stderr: '', report: passReport });
  assert.equal(e.status, 'PASS');
  assert.equal(e.exit, 0);
});

test('exit 1 + FAIL report classifies PARTIAL with failing slides', () => {
  const e = classifyEntry({ status: 1, stderr: '', report: failReport });
  assert.equal(e.status, 'PARTIAL');
  assert.deepEqual(e.failing, ['slides/02.html']);
});

test('exit 2 + stale PASS report classifies ERROR, not PASS', () => {
  const e = classifyEntry({ status: 2, stderr: 'SpecError: boom', report: passReport });
  assert.equal(e.status, 'ERROR');
  assert.equal(e.exit, 2);
  assert.match(e.tail, /boom/);
});

test('killed run (null status) + stale report classifies ERROR', () => {
  const e = classifyEntry({ status: null, stderr: '', report: passReport });
  assert.equal(e.status, 'ERROR');
  assert.equal(e.exit, null);
});

test('missing report classifies ERROR 0/7', () => {
  const e = classifyEntry({ status: 2, stderr: 'error: nope', report: null });
  assert.equal(e.status, 'ERROR');
  assert.equal(e.pass, '0/7');
});
