'use strict';

const path = require('path');
const fs = require('lub-fs');
const assert = require('power-assert');
const mm = require('mm');
const spawn = require('cross-spawn');
const lubCommand = require('lub-command');
const lubNpm = require('../index');

describe('lub-npm/test/index.test.js', () => {
  describe('findPackageJsonSync', () => {
    it('should return correct pkg.json path', () => {
      const fixturePath = path.join(
        __dirname,
        'fixtures',
        'find-package-json',
        'no-pkg'
      );
      const pkg = lubNpm.findPackageJsonSync(fixturePath);
      const actual = fs.readJSONSync(pkg);
      assert.deepEqual(actual, {
        name: 'foo',
        version: '1.0.0',
      });
    });

    it('should return cwd pkg.json path', () => {
      const cwd = process.cwd();
      const fixturePath = path.join(__dirname, 'fixtures', 'find-package-json');
      process.chdir(fixturePath);

      const pkg = lubNpm.findPackageJsonSync();
      const actual = fs.readJSONSync(pkg);
      assert.deepEqual(actual, {
        name: 'foo',
        version: '1.0.0',
      });

      process.chdir(cwd);
    });

    it('should return cwd pkg.json path with', () => {
      const pkg = lubNpm.findPackageJsonSync('/');
      assert.equal(pkg, null);
    });
  });

  describe('findPackageJson', () => {
    it('should return correct pkg.json path', async () => {
      const fixturePath = path.join(
        __dirname,
        'fixtures',
        'find-package-json',
        'no-pkg'
      );
      const pkg = await lubNpm.findPackageJson(fixturePath);
      const actual = fs.readJSONSync(pkg);
      assert.deepEqual(actual, {
        name: 'foo',
        version: '1.0.0',
      });
    });

    it('should return cwd pkg.json path', async () => {
      const cwd = process.cwd();
      const fixturePath = path.join(__dirname, 'fixtures', 'find-package-json');
      process.chdir(fixturePath);

      const pkg = await lubNpm.findPackageJson();
      const actual = fs.readJSONSync(pkg);
      assert.deepEqual(actual, {
        name: 'foo',
        version: '1.0.0',
      });

      process.chdir(cwd);
    });

    it('should return cwd pkg.json path with', async () => {
      const pkg = await lubNpm.findPackageJson('/');
      assert.equal(pkg, null);
    });
  });

  describe('installSync', () => {
    let commandString = '';
    beforeEach(() => {
      mm(spawn, 'sync', (command, args) => {
        commandString = `${command} ${args.join(' ')}`;
        return {};
      });
    });

    afterEach(() => {
      mm.restore();
      commandString = '';
    });

    it('npm install --registry=https://registry.npmjs.org', () => {
      lubNpm.installSync();
      assert.equal(
        commandString,
        'npm install --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install --registry=http://registry.npm.alibaba-inc.com', () => {
      lubNpm.installSync({
        npmClient: 'tnpm',
        registry: 'http://registry.npm.alibaba-inc.com',
      });
      assert.equal(
        commandString,
        'tnpm install --registry=http://registry.npm.alibaba-inc.com'
      );
    });

    it('npm install --registry=https://registry.npmjs.org when global true', () => {
      lubNpm.installSync({
        global: true,
      });
      assert.equal(
        commandString,
        'npm install --registry=https://registry.npmjs.org'
      );
    });

    it('yarn install --registry=https://registry.yarnpkg.com', () => {
      lubNpm.installSync({
        npmClient: 'yarn',
      });
      assert.equal(
        commandString,
        'yarn install --registry=https://registry.yarnpkg.com'
      );
    });

    it('yarn install --production --registry=https://registry.yarnpkg.com', () => {
      lubNpm.installSync({
        npmClient: 'yarn',
        production: true,
      });
      assert.equal(
        commandString,
        'yarn install --production --registry=https://registry.yarnpkg.com'
      );
    });

    it('npm install lub -D --registry=https://registry.npmjs.org', () => {
      lubNpm.installSync('lub', {
        dev: true,
      });
      assert.equal(
        commandString,
        'npm install lub -D --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install lub -D --registry=https://registry.npmjs.org', () => {
      lubNpm.installSync('lub', {
        npmClient: 'tnpm',
        dev: true,
      });
      assert.equal(
        commandString,
        'tnpm install lub -D --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install lub --save --registry=https://registry.npmjs.org', () => {
      lubNpm.installSync('lub', {
        npmClient: 'tnpm',
        save: true,
      });
      assert.equal(
        commandString,
        'tnpm install lub --save --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install', () => {
      lubNpm.installSync({
        npmClient: 'tnpm',
        registry: '',
      });
      assert.equal(commandString, 'tnpm install');
    });

    it('npm install lub -g', () => {
      lubNpm.installSync('lub', {
        global: true,
        registry: '',
      });
      assert.equal(commandString, 'npm install lub -g');
    });

    it('yarn global add lub --registry=https://registry.yarnpkg.com', () => {
      lubNpm.installSync('lub', {
        npmClient: 'yarn',
        global: true,
      });
      assert.equal(
        commandString,
        'yarn global add lub --registry=https://registry.yarnpkg.com'
      );
    });

    it('should throw error', () => {
      mm(spawn, 'sync', () => {
        return {
          error: { code: 'ENOENT' },
        };
      });
      assert.throws(lubNpm.installSync);
    });
  });

  describe('install', () => {
    let commandString = '';
    beforeEach(() => {
      mm(lubCommand.helper, 'spawn', (command, args) => {
        commandString = `${command} ${args.join(' ')}`;
        return new Promise(resolve => {
          resolve('ok');
        });
      });
    });

    afterEach(() => {
      mm.restore();
      commandString = '';
    });

    it('npm install --registry=https://registry.npmjs.org', async () => {
      await lubNpm.install();
      assert.equal(
        commandString,
        'npm install --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install --registry=http://registry.npm.alibaba-inc.com', async () => {
      await lubNpm.install({
        npmClient: 'tnpm',
        registry: 'http://registry.npm.alibaba-inc.com',
      });
      assert.equal(
        commandString,
        'tnpm install --registry=http://registry.npm.alibaba-inc.com'
      );
    });

    it('npm install --registry=https://registry.npmjs.org when global true', async () => {
      await lubNpm.install({
        global: true,
      });
      assert.equal(
        commandString,
        'npm install --registry=https://registry.npmjs.org'
      );
    });

    it('yarn install --registry=https://registry.yarnpkg.com', async () => {
      await lubNpm.install({
        npmClient: 'yarn',
      });
      assert.equal(
        commandString,
        'yarn install --registry=https://registry.yarnpkg.com'
      );
    });

    it('yarn install --production --registry=https://registry.yarnpkg.com', async () => {
      await lubNpm.install({
        npmClient: 'yarn',
        production: true,
      });
      assert.equal(
        commandString,
        'yarn install --production --registry=https://registry.yarnpkg.com'
      );
    });

    it('npm install lub -D --registry=https://registry.npmjs.org', async () => {
      await lubNpm.install('lub', {
        dev: true,
      });
      assert.equal(
        commandString,
        'npm install lub -D --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install lub -D --registry=https://registry.npmjs.org', async () => {
      await lubNpm.install('lub', {
        npmClient: 'tnpm',
        dev: true,
      });
      assert.equal(
        commandString,
        'tnpm install lub -D --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install lub --save --registry=https://registry.npmjs.org', async () => {
      await lubNpm.install('lub', {
        npmClient: 'tnpm',
        save: true,
      });
      assert.equal(
        commandString,
        'tnpm install lub --save --registry=https://registry.npmjs.org'
      );
    });

    it('tnpm install', async () => {
      await lubNpm.install({
        npmClient: 'tnpm',
        registry: '',
      });
      assert.equal(commandString, 'tnpm install');
    });

    it('npm install lub -g', async () => {
      await lubNpm.install('lub', {
        global: true,
        registry: '',
      });
      assert.equal(commandString, 'npm install lub -g');
    });

    it('yarn global add lub --registry=https://registry.yarnpkg.com', async () => {
      await lubNpm.install('lub', {
        npmClient: 'yarn',
        global: true,
      });
      assert.equal(
        commandString,
        'yarn global add lub --registry=https://registry.yarnpkg.com'
      );
    });

    it('should throw error', done => {
      mm(lubCommand.helper, 'spawn', () => {
        return new Promise((_, reject) => {
          const error = new Error('this is error');
          error.code = 'ENOENT';
          reject(error);
        });
      });
      lubNpm.install().catch(e => {
        assert.equal(e.code, 'ENOENT');
        done();
      });
    });

    it('should throw normal error', done => {
      mm(lubCommand.helper, 'spawn', () => {
        return new Promise((_, reject) => {
          const error = new Error('this is error');
          reject(error);
        });
      });
      lubNpm.install().catch(() => {
        done();
      });
    });
  });
});
