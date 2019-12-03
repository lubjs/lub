'use strict';

const coffee = require('coffee');
const path = require('path');

describe('lub-core/test/main.test.js', () => {
  const lubBin = require.resolve(path.join(__dirname, '../bin/lub.js'));
  const fixturePath = path.join(__dirname, 'fixtures/hello-lub');

  it('lub start', done => {
    coffee
      .fork(lubBin, [ 'start' ], { cwd: fixturePath })
      .expect('stdout', /this is before test/)
      .expect('stdout', /start config\[env] is build/)
      .expect('stdout', /this is after test/)
      .expect('stderr', /Error: this is error/)
      .expect('stdout', /this is async test/)
      .expect('code', 0)
      .end(done);
  });

  it('lub start -h', done => {
    coffee
      .fork(lubBin, [ 'start', '-h' ], { cwd: fixturePath })
      .expect('stdout', /this is before test/)
      .expect('stdout', /Usage: start command usage/)
      .expect('stdout', /Global Options:/)
      .expect('stdout', /.*Show help.*/)
      .expect('stdout', /.*Show version number.*/)
      .expect('stdout', /.*level to start.*/)
      .expect('code', 0)
      .end(done);
  });

  it('lub --help', done => {
    coffee
      .fork(lubBin, [ '--help' ], { cwd: fixturePath })
      .expect('stdout', /Usage: lub <subCommand>/)
      .expect('stdout', /Commands:/)
      .expect('stdout', /lub\.js bar-dev.*dev command/)
      .expect('stdout', /lub\.js coincidance.*concidance command/)
      .expect('stdout', /lub\.js start.*start command/)
      .expect('code', 0)
      .end(done);
  });

  it('lub -h', done => {
    coffee
      .fork(lubBin, [ '-h' ], { cwd: fixturePath })
      .expect('stdout', /Usage: lub <subCommand>/)
      .expect('stdout', /Commands:/)
      .expect('stdout', /lub\.js bar-dev.*dev command/)
      .expect('stdout', /lub\.js coincidance.*concidance command/)
      .expect('stdout', /lub\.js start.*start command/)
      .expect('stdout', /lub\.js build/)
      .expect('code', 0)
      .end(done);
  });

  it('lub -v', done => {
    coffee
      .fork(lubBin, [ '-v' ], { cwd: fixturePath })
      .expect('stdout', /\d.\d.\d/)
      .expect('code', 0)
      .end(done);
  });

  it('lub bar-dev', done => {
    coffee
      .fork(lubBin, [ 'bar-dev', '--from=test' ], { cwd: fixturePath })
      .expect('stdout', /\[ '--from=test' ]/)
      .expect('code', 0)
      .end(done);
  });

  it('lub notfound', done => {
    coffee
      .fork(lubBin, [ 'notfound' ], { cwd: fixturePath })
      .expect('stdout', /.*Can not find notfound from your lub config file.*/)
      .expect('code', 1)
      .end(done);
  });

  it('should throw when not found lub-command package', done => {
    coffee
      .fork(lubBin, [ 'start' ], { cwd: '/' })
      .debug()
      .expect(
        'stdout',
        /can not find lub-command module in current project, please install it first/
      )
      // .expect('stdout', /start config\[env] is build/)
      // .expect('stdout', /this is after test/)
      // .expect('stderr', /Error: this is error/)
      // .expect('stdout', /this is async test/)
      .expect('code', 1)
      .end(done);
  });
});
