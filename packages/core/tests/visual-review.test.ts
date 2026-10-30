  findWorkflowTokens,
describe('findWorkflowTokens', () => {
  it('finds leaked process labels case-insensitively', () => {
    assert.deepEqual(findWorkflowTokens('<div>Shipgate keeps main green</div>'), []);
    assert.deepEqual(findWorkflowTokens('<div>Style Option A: Swiss</div>').sort(), ['option a', 'style option']);
    assert.deepEqual(findWorkflowTokens('<p>see preview.md for details</p>'), ['preview.md']);
  });
});
