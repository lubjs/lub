'use strict';

const is = require('is-type-of');

exports.callFn = function* (fn, args = [], thisArg) {
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) {
    return yield fn.apply(thisArg, args);
  }
  const r = fn.apply(thisArg, args);
  if (is.promise(r)) {
    return yield r;
  }
  return r;
};
