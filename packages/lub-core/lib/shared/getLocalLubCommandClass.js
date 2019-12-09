'use strict';

const log = require('lub-log')('lub-core');
const path = require('path');
const resolver = require('./relative-module-resolver');

function getLocalLubCommandClass() {
  try {
    const LocalLubCommandModulePath = resolver.resolve(
      'lub-command',
      path.join(process.cwd(), '__placeholder__.js')
    );
    return require(LocalLubCommandModulePath);
  } catch (e /* istanbul ignore next */) {
    log.error(
      'can not find lub-command module in current project, please install it first'
    );
    process.exit(1);
  }
}

module.exports = getLocalLubCommandClass;
