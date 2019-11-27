'use strict';

const loadConfig = require('../../lib/loader/config-loader');
const assert = require('power-assert');
const path = require('path');

describe('lub-core/test/loader/config-loader.test.js', () => {
  const fixtureDir = path.join(__dirname, '..', 'fixtures', 'config-loader');
  const expected = {
    plugins: [ 'lub-plugin-foo', 'lub-plugin-bar' ],
    'lub-plugin-bar': {
      env: 'build',
    },
    alias: {
      'lub-plugin-bar': {
        dev: 'bar-dev',
      },
    },
    task: {
      start: [
        {
          command: 'lub run bar',
          async: false,
          order: 'before',
        },
        {
          command: 'lub commit init',
          async: true,
          order: 'after',
        },
      ],
    },
  };

  it('should return null when config file not exists successfully', () => {
    const configPath = path.join(fixtureDir, '.lubrc_not_exists');
    const result = loadConfig(configPath);
    assert.equal(result, null);
  });

  it('should should throw err when load not js language', () => {
    const configPath = path.join(fixtureDir, 'not_js_file.js');
    assert.throws(() => {
      loadConfig(configPath);
    });
  });

  it('should should throw err when load not json language', () => {
    const configPath = path.join(fixtureDir, 'not_json_file');
    assert.throws(() => {
      loadConfig(configPath);
    });
  });

  it('should return normalized config when load unnormal config file', () => {
    const configPath = path.join(fixtureDir, 'toNormalize.json');
    const result = loadConfig(configPath);
    assert.ok(Array.isArray(result.plugins));
    assert.ok(result.alias);
    assert.ok(Array.isArray(result.task.start));
  });

  it('should load .lubrc successfully', () => {
    const configPath = path.join(fixtureDir, '.lubrc');
    const result = loadConfig(configPath);
    assert.deepEqual(result, expected);
  });

  it('should load .lubrc.json successfully', () => {
    const configPath = path.join(fixtureDir, '.lubrc.json');
    const result = loadConfig(configPath);
    assert.deepEqual(result, expected);
  });

  it('should load .lubrc.js successfully', () => {
    const configPath = path.join(fixtureDir, '.lubrc.js');
    const result = loadConfig(configPath);
    assert.deepEqual(result, expected);
  });

  it('should throws when task.command is not of string type', () => {
    const configPath = path.join(fixtureDir, 'normalize_task.json');
    assert.throws(() => {
      loadConfig(configPath);
    });
  });

  it('should return correct when loads empty config', () => {
    const configPath = path.join(fixtureDir, 'empty.json');
    const result = loadConfig(configPath);
    assert.deepEqual(result, {
      plugins: [],
      task: {},
      alias: {},
    });
  });
});
