import assert from 'node:assert/strict';
import { suite, test } from 'node:test';
import {
  hasCommentSearchCriteria,
  isCommentSearchRangeInvalid,
  toCommentSearchFilter,
} from './commentSearchFilter.ts';

suite('toCommentSearchFilter', () => {
  test('keeps a preset and the contains flags', () => {
    const filter = toCommentSearchFilter({
      q: 'raster',
      user: 'user-1',
      channel: 'channel-1',
      type: 'post',
      range: '30d',
      from: '2020-01-01',
      to: '2020-02-01',
      attachment: true,
      link: true,
    });

    assert.deepEqual(filter, {
      q: 'raster',
      user: 'user-1',
      channel: 'channel-1',
      type: 'post',
      range: '30d',
      attachment: true,
      link: true,
    });
  });

  test('turns a custom day into a local midnight window', () => {
    const filter = toCommentSearchFilter({
      range: 'custom',
      from: '2026-01-15',
      to: '2026-01-15',
    });
    const from = new Date(filter.from ?? '');
    const to = new Date(filter.to ?? '');

    assert.equal(from.getFullYear(), 2026);
    assert.equal(from.getMonth(), 0);
    assert.equal(from.getDate(), 15);
    assert.equal(from.getHours(), 0);
    assert.equal(from.getMinutes(), 0);
    assert.equal(to.getFullYear(), 2026);
    assert.equal(to.getMonth(), 0);
    assert.equal(to.getDate(), 16);
    assert.equal(to.getHours(), 0);
    assert.equal(filter.range, undefined);
  });
});

suite('hasCommentSearchCriteria', () => {
  test('attachment or link alone is a search', () => {
    assert.equal(hasCommentSearchCriteria({ attachment: true }), true);
    assert.equal(hasCommentSearchCriteria({ link: true }), true);
    assert.equal(hasCommentSearchCriteria({ range: 'custom' }), false);
    assert.equal(hasCommentSearchCriteria({ q: 'raster' }), true);
    assert.equal(hasCommentSearchCriteria({ range: '6m' }), true);
  });
});

suite('isCommentSearchRangeInvalid', () => {
  test('rejects a start after the end', () => {
    assert.equal(
      isCommentSearchRangeInvalid({ from: '2026-02-02', to: '2026-02-01' }),
      true,
    );
    assert.equal(
      isCommentSearchRangeInvalid({ from: '2026-02-01', to: '2026-02-01' }),
      false,
    );
  });
});
