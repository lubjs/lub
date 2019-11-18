'use strict';
const Log = require('./lib/lub-log');

module.exports = function(config) {
  return new Log(config);
};
