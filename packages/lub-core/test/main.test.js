'use strict';

const coffee = require('coffee');
const path = require('path');

describe('lub-core/test/main.test.js', () => {
  const lubBin = require.resolve(path.join(__dirname, '../bin/lub.js'));
  const fixturePath = path.join(__dirname, 'fixtures/hello-lub');

  it.only('lub start', done => {
    coffee
      .fork(lubBin, [ 'start' ], { cwd: fixturePath })
      .debug()
      .expect('stdout', /this is before test/)
      .expect('stdout', /start config\[env] is build/)
      .expect('stdout', /this is async test/)
      .expect('code', 0)
      .end(done);
  });
});
