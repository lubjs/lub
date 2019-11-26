'use strict';

const assert = require('assert');
const { helper } = require('../../index');

describe('lub-command/test/lib/helper.test.js', () => {
  it('should not execute when not function', () => {
    const g = helper.callFn({});
    assert.equal(g.next().value, undefined);
  });

  it('should correctly return when execute normal function', () => {
    const g = helper.callFn(() => 1);
    assert.equal(g.next().value, 1);
  });

  it('should correctly return when normal function return promise', () => {
    const g = helper.callFn(
      () =>
        new Promise(resolve => {
          resolve(1);
        })
    );
    assert.ok(g.next().value instanceof Promise);
  });
});
