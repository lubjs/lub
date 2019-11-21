'use strict';

const lubFs = require('../index');
const assert = require('assert');

describe('lub-fs/test/index.test.js', () => {
  it('should export other methods on fs-extra', () => {
    assert.ok(lubFs.readJson);
  });
});
