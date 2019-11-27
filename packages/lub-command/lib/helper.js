'use strict';

const is = require('is-type-of');
const cp = require('child_process');

// only hook once and only when ever start any child.
const childs = new Set();
let hadHook = false;
function gracefull(proc) {
  // save child ref
  childs.add(proc);

  // only hook once
  /* istanbul ignore else */
  if (!hadHook) {
    hadHook = true;
    let signal;
    [ 'SIGINT', 'SIGQUIT', 'SIGTERM' ].forEach(event => {
      process.once(event, () => {
        signal = event;
        process.exit(0);
      });
    });

    process.once('exit', () => {
      for (const child of childs) {
        child.kill(signal);
      }
    });
  }
}

/**
 * call fn
 * @function helper#callFn
 * @param {Function} fn - support generator / async / normal function return promise
 * @param {Array} [args] - fn args
 * @param {Object} [thisArg] - this
 * @return {Object} result
 */
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

/**
 * fork child process, wrap with promise and gracefull exit
 * @function helper#forkNode
 * @param {String} modulePath - bin path
 * @param {Array} [args] - arguments
 * @param {Object} [options] - options
 * @return {Promise} err or undefined
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
 */
exports.forkNode = (modulePath, args = [], options = {}) => {
  options.stdio = options.stdio || 'inherit';
  const proc = cp.fork(modulePath, args, options);
  gracefull(proc);

  return new Promise((resolve, reject) => {
    proc.once('exit', code => {
      childs.delete(proc);
      if (code !== 0) {
        const err = new Error(
          modulePath + ' ' + args + ' exit with code ' + code
        );
        err.code = code;
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * spawn a new process, wrap with promise and gracefull exit
 * @function helper#forkNode
 * @param {String} cmd - command
 * @param {Array} [args] - arguments
 * @param {Object} [options] - options
 * @return {Promise} err or undefined
 * @see https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
 */
exports.spawn = (cmd, args = [], options = {}) => {
  options.stdio = options.stdio || 'inherit';

  return new Promise((resolve, reject) => {
    const proc = cp.spawn(cmd, args, options);
    gracefull(proc);
    proc.once(
      'error',
      /* istanbul ignore next */
      err => {
        reject(err);
      }
    );
    proc.once('exit', code => {
      childs.delete(proc);

      if (code !== 0) {
        return reject(
          new Error(`spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`)
        );
      }
      resolve();
    });
  });
};
