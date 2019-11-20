'use strict';

const copyTplSync = require('../lib/copyTpl-sync');
const fs = require('fs-extra');
const asset = require('assert');

describe('lub-fs/test/copyTpl-sync.test.js', () => {
  const src = 'test/fixtures/src';
  const dest = 'test/fixtures/dest';
  afterEach(() => {
    fs.removeSync(dest);
  });

  it('should not do copy when option is not correct', () => {
    copyTplSync({});
    asset.equal(fs.existsSync(dest), false);

    copyTplSync({ src: 'aaa', dest });
    asset.equal(fs.existsSync(dest), false);

    copyTplSync({ src, dest, stringReplace: {} });
    asset.equal(fs.existsSync(dest), false);
  });

  it('should throw error when data is not correct', () => {
    asset.throws(() => {
      copyTplSync({
        src,
        dest,
      });
    });
  });

  it('should copy bar to dest when data is correct', () => {
    copyTplSync({
      src,
      dest,
      data: { name: 'lub-js' },
    });
    const content = fs.readFileSync(`${dest}/bar.js`, 'utf8');
    asset.equal(content, 'console.log("lub-js");\n');
  });

  it('should replace correct template when templateSettings option is passed', () => {
    copyTplSync({
      src,
      dest,
      data: { name: 'lub-js' },
      templateSettings: {
        interpolate: /\{\{(.+?)\}\}/g,
      },
    });
    const content = fs.readFileSync(`${dest}/mus.js`, 'utf8');
    asset.equal(content, 'console.log("lub-js");\n');
  });

  it('should not copy node_modules to dest', () => {
    copyTplSync({
      src,
      dest,
      data: { name: 'lub-js' },
    });
    const fileDirs = fs.readdirSync(dest);
    asset.equal(fileDirs.length, 3);
  });

  it('should replace string when pass stringReplace option', () => {
    copyTplSync({
      src,
      dest,
      data: { name: 'lub-js' },
      stringReplace: [[ /console\.log\("foo"\);/g, 'lub-js' ]],
    });
    const content = fs.readFileSync(`${dest}/foo.js`, 'utf8');
    asset.equal(content, 'lub-js\n');
  });
});
