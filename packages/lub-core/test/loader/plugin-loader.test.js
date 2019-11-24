'use strict';

const path = require('path');
const assert = require('assert');
const loadPlugin = require('../../lib/loader/plugin-loader');

describe('lub-core/test/loader/plugin-loader.test.js', () => {
  const fixturePath = path.join(__dirname, '..', 'fixtures', 'plugin-loader');
  const cwd = process.cwd();

  afterEach(() => {
    process.chdir(cwd);
  });

  it('should return correct plugin info from .lubrc', () => {
    process.chdir(fixturePath);
    const actual = loadPlugin(undefined, fixturePath);
    assert.ok(actual['bar-dev']);
    assert.ok(actual.coincidance);
    assert.ok(actual.start);
    assert.ok(actual.build);
    assert.deepEqual(actual.start.config, { env: 'build' });
    assert.deepEqual(actual.build.config, { env: 'build' });
  });

  it('should throw error when can not find plugin', () => {
    assert.throws(() => {
      loadPlugin('not-exists-module');
    });
  });
});
