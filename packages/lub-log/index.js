'use strict';
const Log = require('./lib/lub-log');

module.exports = function(scopeOrconfig) {
  return new Log(scopeOrconfig);
};
