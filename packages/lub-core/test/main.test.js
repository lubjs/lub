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
      .expect(
        'stdout',
        /Install <lub-plugin> and exec its init function - useful to init your project/
      )
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

  it('lub --version', done => {
    coffee
      .fork(lubBin, [ '--version' ], { cwd: '/' })
      .expect('stdout', /\d.\d.\d/)
      .expect('code', 0)
      .end(done);
  });

  it('lub -v', done => {
    coffee
      .fork(lubBin, [ '-v' ], { cwd: '/' })
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

  it('lub init', done => {
    const cwd = path.join(__dirname, 'fixtures/lub-init');
    coffee
      .fork(lubBin, [ 'init' ], { cwd })
      .expect('stderr', /Usage: lub init <lub-plugin>/)
      .expect('code', 0)
      .end(done);
  });

  it('lub init -h', done => {
    const cwd = path.join(__dirname, 'fixtures/lub-init');
    coffee
      .fork(lubBin, [ 'init', '-h' ], { cwd })
      .expect('stdout', /Usage: lub init <lub-plugin>/)
      .expect('code', 0)
      .end(done);
  });

  it('lub init lub-plugin-foo', done => {
    const cwd = path.join(__dirname, 'fixtures/lub-init');
    coffee
      .fork(lubBin, [ 'init', 'lub-plugin-foo' ], { cwd })
      .beforeScript(path.join(__dirname, 'mock/index.js'))
      .expect('stdout', /lub-plugin-foo/)
      .expect('stdout', /https:\/\/registry\.npmjs\.org/)
      .expect('stdout', /npm/)
      .expect('stdout', /this is init command/)
      .expect('stdout', /Init lub-plugin-foo successfully!/)
      .expect('code', 0)
      .end(done);
  });

  it('lub init lub-plugin-bar', done => {
    const cwd = path.join(__dirname, 'fixtures/lub-init');
    coffee
      .fork(lubBin, [ 'init', 'lub-plugin-bar' ], { cwd })
      .beforeScript(path.join(__dirname, 'mock/index.js'))
      .expect('stdout', /can not find init command in lub-plugin-bar/)
      .expect('code', 1)
      .end(done);
  });
});
