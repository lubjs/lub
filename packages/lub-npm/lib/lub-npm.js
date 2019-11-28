'use strict';

const fs = require('lub-fs');
const path = require('path');
const u = require('universalify').fromCallback;

/**
 * Find the closest package.json file, starting at process.cwd (by default),
 * and working up to root.
 * @param  {string} [startDir=process.cwd()] Starting directory
 * @return {string}                          Absolute path to closest package.json file
 */
exports.findPackageJsonSync = function(startDir) {
  let dir = path.resolve(startDir || process.cwd());

  do {
    const pkgFile = path.join(dir, 'package.json');

    if (!fs.existsSync(pkgFile) || !fs.statSync(pkgFile).isFile()) {
      dir = path.join(dir, '..');
      continue;
    }
    return pkgFile;
  } while (dir !== path.resolve(dir, '..'));
  return null;
};

/**
 * Find the closest package.json file, starting at process.cwd (by default),
 * and working up to root.
 * @param {string}    [startDir=process.cwd()] - Starting directory
 * @param {function}  callback                 - callback with (error, package.json's path)
 */
function findPackageJson(startDir, callback) {
  // work around for universalify.fromCallback
  // https://github.com/RyanZim/universalify/issues/10
  if (typeof startDir === 'function') {
    callback = startDir;
    startDir = undefined;
  }
  function jumpAndCheckPath(dir, callback) {
    dir = path.join(dir, '..');
    if (dir !== path.resolve(dir, '..')) {
      findPackageJson(dir, callback);
      return;
    }
    callback(undefined, null);
  }
  const dir = path.resolve(startDir || process.cwd());

  const pkgFile = path.join(dir, 'package.json');

  fs.exists(pkgFile, exists => {
    if (!exists) {
      jumpAndCheckPath(dir, callback);
      return;
    }
    fs.stat(pkgFile, (e, stat) => {
      /* istanbul ignore next */
      if (e) callback(e);
      if (stat.isFile()) {
        callback(undefined, pkgFile);
        return;
      }
      jumpAndCheckPath(dir, callback);
    });
  });
}

exports.findPackageJson = u(findPackageJson);
