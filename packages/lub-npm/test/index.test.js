'use strict';

const path = require('path');
const fs = require('lub-fs');
const assert = require('power-assert');
const lubNpm = require('../index');

describe('lub-npm/test/index.test.js', () => {
  describe('findPackageJson', () => {
    it('should return correct pkg.json path', () => {
      const fixturePath = path.join(
        __dirname,
        'fixtures',
        'find-package-json',
        'no-pkg'
      );
      const pkg = lubNpm.findPackageJson(fixturePath);
      const actual = fs.readJSONSync(pkg);
      assert.deepEqual(actual, {
        name: 'foo',
        version: '1.0.0',
      });
    });

    it('should return cwd pkg.json path with', () => {
      const cwd = process.cwd();
      const fixturePath = path.join(__dirname, 'fixtures', 'find-package-json');
      process.chdir(fixturePath);

      const pkg = lubNpm.findPackageJson();
      const actual = fs.readJSONSync(pkg);
      assert.deepEqual(actual, {
        name: 'foo',
        version: '1.0.0',
      });

      process.chdir(cwd);
    });

    it('should return cwd pkg.json path with', () => {
      const pkg = lubNpm.findPackageJson('/');
      assert.equal(pkg, null);
    });
  });
});
