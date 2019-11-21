'use strict';

const { copyTpl } = require('../index');
const fs = require('fs-extra');
const asset = require('assert');
const mm = require('mm');

describe('lub-fs/test/copyTpl.test.js', () => {
  const src = 'test/fixtures/src';
  const dest = 'test/fixtures/dest';
  afterEach(() => {
    fs.removeSync(dest);
  });

  it('should not do copy when option is not correct', done => {
    copyTpl({}, e => {
      if (e) return done(e);
      asset.equal(fs.existsSync(dest), false);
      copyTpl({ src: 'aaa', dest }, e => {
        if (e) return done(e);
        asset.equal(fs.existsSync(dest), false);
        copyTpl({ src, dest, stringReplace: {} }, e => {
          if (e) return done(e);
          asset.equal(fs.existsSync(dest), false);
          done();
        });
      });
    });
  });

  it('should throw error when data is not correct', done => {
    copyTpl(
      {
        src,
        dest,
      },
      e => {
        asset.ok(e instanceof Error);
        done();
      }
    );
  });

  it('should copy bar to dest when data is correct', done => {
    copyTpl(
      {
        src,
        dest,
        data: { name: 'lub-js' },
      },
      e => {
        if (e) done(e);
        const content = fs.readFileSync(`${dest}/bar.js`, 'utf8');
        asset.strictEqual(content, 'console.log("lub-js");\n');
        done();
      }
    );
  });

  it('should replace correct template when templateSettings option is passed', done => {
    copyTpl(
      {
        src,
        dest,
        data: { name: 'lub-js' },
        templateSettings: {
          interpolate: /\{\{(.+?)\}\}/g,
        },
      },
      e => {
        if (e) done(e);
        const content = fs.readFileSync(`${dest}/mus.js`, 'utf8');
        asset.equal(content, 'console.log("lub-js");\n');
        done();
      }
    );
  });

  it('should not copy node_modules to dest', done => {
    copyTpl(
      {
        src,
        dest,
        data: { name: 'lub-js' },
      },
      e => {
        if (e) done(e);
        const fileDirs = fs.readdirSync(dest);
        asset.equal(fileDirs.length, 3);
        done();
      }
    );
  });

  it('should replace string when pass stringReplace option', done => {
    copyTpl(
      {
        src,
        dest,
        data: { name: 'lub-js' },
        stringReplace: [[ /console\.log\("foo"\);/g, 'lub-js' ]],
      },
      e => {
        if (e) done(e);
        const content = fs.readFileSync(`${dest}/foo.js`, 'utf8');
        asset.equal(content, 'lub-js\n');
        done();
      }
    );
  });

  it('should support copy single file', done => {
    copyTpl({ src: src + '/foo.js', dest: dest + '/foo_copy.js' }, e => {
      if (e) done(e);
      asset.ok(fs.existsSync(dest + '/foo_copy.js'));
      done();
    });
  });

  it('should support copy single file as promise', () => {
    return copyTpl({ src: src + '/foo.js', dest: dest + '/foo_copy.js' }).then(
      () => {
        asset.ok(fs.existsSync(dest + '/foo_copy.js'));
      }
    );
  });

  it('should throw err when fs.stat throws error', () => {
    mm(fs, 'stat', (_, cb) => {
      cb(new Error('mock Error'));
    });

    return copyTpl({ src: src + '/foo.js', dest: dest + '/foo_copy.js' }).catch(
      e => {
        asset.ok(e instanceof Error);
        mm.restore();
      }
    );
  });

  it('should throw err when fs.readFile throws error', () => {
    mm(fs, 'readFile', (_, option, cb) => {
      cb(new Error('mock Error'));
    });

    return copyTpl({
      src,
      dest,
      data: { name: 'lub-js' },
    }).catch(e => {
      asset.ok(e instanceof Error);
      mm.restore();
    });
  });

  it('should throw err when fs.outputFile throws error', () => {
    mm(fs, 'outputFile', (_, option, cb) => {
      cb(new Error('mock Error'));
    });

    return copyTpl({
      src,
      dest,
      data: { name: 'lub-js' },
    }).catch(e => {
      asset.ok(e instanceof Error);
      mm.restore();
    });
  });

  it('should throw err when fs.ensureDir throws error', () => {
    mm(fs, 'ensureDir', (_, cb) => {
      cb(new Error('mock Error'));
    });

    return copyTpl({
      src,
      dest,
      data: { name: 'lub-js' },
    }).catch(e => {
      asset.ok(e instanceof Error);
      mm.restore();
    });
  });

  it('should throw err when fs.readdir throws error', () => {
    mm(fs, 'readdir', (_, cb) => {
      cb(new Error('mock Error'));
    });

    return copyTpl({
      src,
      dest,
      data: { name: 'lub-js' },
    }).catch(e => {
      asset.ok(e instanceof Error);
      mm.restore();
    });
  });

  it('should run smoothly when is not file', () => {
    mm(fs, 'stat', (_, cb) => {
      cb(undefined, {
        isDirectory() {
          return false;
        },
        isFile() {
          return false;
        },
      });
    });

    return copyTpl({
      src,
      dest,
      data: { name: 'lub-js' },
    });
  });
});
