'use strict';

const path = require('path');
const coffee = require('coffee');

describe('lub-command/test/lib/helper.test.js', () => {
  const cwd = path.join(__dirname, '../fixtures/test-files');
  describe('helper#callFn', () => {
    const myBin = require.resolve('../fixtures/my-helper/bin/callFn.js');
    it('should `helper.callFn`', done => {
      coffee
        .fork(myBin, [ 'call' ], { cwd })
        .expect('stdout', /undefined, promise, generator, normal/)
        .expect('code', 0)
        .end(done);
    });
  });

  describe('helper#forkNode', () => {
    const myBin = require.resolve('../fixtures/my-helper/bin/fork.js');
    it('should `helper.forkNode`', done => {
      coffee
        .fork(myBin, [ '--target=test_script' ], { cwd })
        .expect('stdout', /process.argv: \[]/)
        .expect('code', 0)
        .end(done);
    });

    it('should `helper.forkNode` with error', done => {
      coffee
        .fork(myBin, [ '--target=error_script' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /this is an error/)
        .expect('stdout', /Command Error/)
        .expect('code', 1)
        .end(done);
    });

    it('should kill child process', done => {
      const app = coffee.fork(myBin, [ '--target=loop_script' ], {
        cwd,
        env: process.env,
      });
      app
        .expect('stdout', /\[child] echo \d+ 1/)
        .expect('stdout', /\[child] echo \d+ 2/);

      if (process.platform !== 'win32') {
        app
          .expect('stdout', /\[child] exit with code 0/)
          .expect('stdout', /recieve singal SIGINT/)
          .expect('code', 0);
      }

      app.end(done);

      setTimeout(() => {
        app.proc.kill('SIGINT');
      }, 10000);
    });
  });

  describe('helper#spawn', () => {
    const myBin = require.resolve('../fixtures/my-helper/bin/spawn.js');
    it('should `helper.spawn`', done => {
      coffee
        .fork(myBin, [ '--target=test_script' ], { cwd })
        .expect('stdout', /process.argv: \[]/)
        .expect('code', 0)
        .end(done);
    });

    it('should `helper.spawn` with error', done => {
      coffee
        .fork(myBin, [ '--target=error_script' ], { cwd })
        // .debug()
        // .coverage(false)
        .expect('stderr', /this is an error/)
        .expect('stdout', /Command Error/)
        .expect('code', 1)
        .end(done);
    });

    it('should `helper.spawn` with empty', done => {
      coffee
        .fork(myBin, [], { cwd })
        .expect('stdout', /\n/)
        .expect('code', 0)
        .end(done);
    });

    it('should kill child process', done => {
      const app = coffee.fork(myBin, [ '--target=loop_script' ], {
        cwd,
        env: process.env,
      });
      app
        .expect('stdout', /\[child] echo \d+ 1/)
        .expect('stdout', /\[child] echo \d+ 2/);

      if (process.platform !== 'win32') {
        app
          .expect('stdout', /\[child] exit with code 0/)
          .expect('stdout', /recieve singal SIGINT/)
          .expect('code', 0);
      }

      app.end(done);

      setTimeout(() => {
        app.proc.kill('SIGINT');
      }, 10000);
    });
  });
});
