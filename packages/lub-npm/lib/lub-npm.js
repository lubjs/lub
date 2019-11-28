'use strict';

const fs = require('lub-fs');
const path = require('path');

/**
 * Find the closest package.json file, starting at process.cwd (by default),
 * and working up to root.
 * @param   {string} [startDir=process.cwd()] Starting directory
 * @return {string}                          Absolute path to closest package.json file
 */
exports.findPackageJson = function(startDir) {
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
