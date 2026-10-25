import assert from 'node:assert/strict';
import { suite, test } from 'node:test';
import { validatePostSearch } from './postSearchParams.ts';

suite('calendar dates', () => {
  test('drops a day that does not exist', () => {
    const search = validatePostSearch({ from: '2026-02-31' });
    assert.equal(search.from, undefined);
  });

  test('keeps a real calendar day', () => {
    const search = validatePostSearch({
      from: '2024-02-29',
      to: '2026-01-01',
    });
    assert.equal(search.from, '2024-02-29');
    assert.equal(search.to, '2026-01-01');
  });
});

suite('range', () => {
  test('a preset drops the explicit dates', () => {
    const search = validatePostSearch({
      range: '30d',
      from: '2020-01-01',
      to: '2020-02-01',
    });
    assert.equal(search.range, '30d');
    assert.equal(search.from, undefined);
    assert.equal(search.to, undefined);
  });

  test('custom keeps the explicit dates', () => {
    const search = validatePostSearch({ range: 'custom', from: '2020-01-01' });
    assert.equal(search.range, 'custom');
    assert.equal(search.from, '2020-01-01');
  });
});
