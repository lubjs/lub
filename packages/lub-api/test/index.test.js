'use strict';

const assert = require('assert');
const lubApi = require('../index');

describe('lub-api/test/index.test.js', () => {
  it('should export collection of lub packages', () => {
    assert.ok(lubApi.log('hello').scope);
  });
});
