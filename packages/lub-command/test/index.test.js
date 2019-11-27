'use strict';

const coffee = require('coffee');
const path = require('path');

describe('lub-command/test/index.test.js', () => {
  describe('fixtures/my-git', () => {
    const myBin = require.resolve('./fixtures/git-clone/bin/git-clone.js');
    const cwd = path.join(__dirname, 'fixtures/test-files');
    const repository = 'git@github.com:node-modules/lub-command';

    it('git-clone --help', done => {
      coffee
        .fork(myBin, [ '--help' ], { cwd })
        // .debug()
        .expect('stdout', /clone <repository> \[directory\]/)
        .expect('stdout', /Global Options:/)
        .expect('stdout', /-h, --help.*/)
        .expect('stdout', /--version.*/)
        .expect('code', 0)
        .end(done);
    });

    it('git-clone --version', done => {
      coffee
        .fork(myBin, [ '--version' ], { cwd })
        // .debug()
        .expect('stdout', /1\.0\.0/)
        .expect('code', 0)
        .end(done);
    });

    it('git-clone -h', done => {
      coffee
        .fork(myBin, [ '-h' ], { cwd })
        // .debug()
        .expect('stdout', /clone <repository> \[directory\]/)
        .expect('stdout', /Global Options:/)
        .expect('stdout', /-h, --help.*/)
        .expect('stdout', /--version.*/)
        .expect('code', 0)
        .end(done);
    });

    it('git-clone <repository>', done => {
      coffee
        .fork(myBin, [ repository, 'lub-command', '--depth=1' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stdout', /set quiet mode/)
        .expect('stdout', /Clone a repository into a new directory/)
        .expect(
          'stdout',
          /git clone .*node-modules\/lub-command to lub-command with depth 1/
        )
        .expect('code', 0)
        .end(done);
    });
  });

  describe('fixtures/git-promise-throw', () => {
    const myBin = require.resolve(
      './fixtures/git-promise-throw/bin/git-promise-throw.js'
    );
    const cwd = path.join(__dirname, 'fixtures/test-files');

    it('git-promise-throw', done => {
      coffee
        .fork(myBin, [], { cwd })
        // .debug()
        .expect('stdout', /.*Error: error from git-promise-throw.*/)
        .expect(
          'stdout',
          /Command Error, enable `DEBUG=lub-command` for detail/
        )
        .expect('code', 1)
        .end(done);
    });
  });
});
