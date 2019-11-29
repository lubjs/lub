'use strict';

const fs = require('lub-fs');
const urllib = require('urllib');
const path = require('path');
const log = require('lub-log')('lub-npm');
const u = require('universalify').fromCallback;
const {
  spawnNpm,
  spawnNpmSync,
  defaultInstallOption,
  defaultLatestConfig,
  defaultUninstallOption,
} = require('./utils');

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

/**
 * install packages or dependencies from pkg.json
 * @param {string | array} [pkgs] - packages to install
 * @param {Object} [option] - option for install
 * @param {boolean} option.save  - save to pkg[dependencies]
 * @param {boolean} option.dev  - save to pkg[devDependencies]
 * @param {boolean} option.global - install to global scope (npm install xx -g)
 * @param {boolean} option.production - install all dependencies except for pkg[devDependencies]
 * @param {string} option.registry - set npm registry
 * @param {string} option.npmClient - support npm | yarn | or your custom npm client like cnpm, tnpm
 */
exports.installSync = function(pkgs, option) {
  if (pkgs && !Array.isArray(pkgs) && typeof pkgs !== 'string') {
    // only pass option in the first place;

    // set yarn registry default to 'https://registry.yarnpkg.com'
    if (pkgs.npmClient === 'yarn' && !pkgs.registry) {
      pkgs.registry = 'https://registry.yarnpkg.com';
    }
    option = Object.assign({}, defaultInstallOption, pkgs);
    pkgs = [];
  } else {
    pkgs = pkgs || [];
    pkgs = Array.isArray(pkgs) ? pkgs : [ pkgs ];
    if (option && option.npmClient === 'yarn' && !option.registry) {
      option.registry = 'https://registry.yarnpkg.com';
    }
    option = Object.assign({}, defaultInstallOption, option);
  }

  const { npmClient, registry, production, global, save, dev } = option;
  let args = [];
  if (!pkgs.length) {
    // npm install or yarn install
    args = [ 'install' ];
    if (production) {
      args.push('--production');
    }
    if (registry) {
      args.push(`--registry=${registry}`);
    }
  } else {
    // npm install package or yarn add
    if (npmClient === 'yarn' && global) {
      args.push('global');
    }

    if (npmClient === 'yarn') {
      args.push('add');
    } else {
      args.push('install');
    }

    args = args.concat(pkgs);

    if (save && npmClient !== 'yarn' && !dev && !global) {
      // yarn always add dep to pkg
      // https://github.com/yarnpkg/yarn/issues/1743#issuecomment-259428370
      args.push('--save');
    }

    if (dev && !global) {
      args.push('-D');
    }

    if (global && npmClient !== 'yarn') {
      args.push('-g');
    }

    if (registry) {
      args.push(`--registry=${registry}`);
    }
  }

  spawnNpmSync(npmClient, args);
};

/**
 * install packages or dependencies from pkg.json
 * @param {string | array} [pkgs] - packages to install
 * @param {Object} [option] - option for install
 * @param {boolean} option.save  - save to pkg[dependencies]
 * @param {boolean} option.dev  - save to pkg[devDependencies]
 * @param {boolean} option.global - install to global scope (npm install xx -g)
 * @param {boolean} option.production - install all dependencies except for pkg[devDependencies]
 * @param {string} option.registry - set npm registry
 * @param {string} option.npmClient - support npm | yarn | or your custom npm client like cnpm, tnpm
 * @param {function} callback - callback with error argv
 */
exports.install = u(function(pkgs, option, callback) {
  // work around for universalify.fromCallback
  // https://github.com/RyanZim/universalify/issues/10
  if (typeof pkgs === 'function') {
    callback = pkgs;
    pkgs = [];
    option = {};
  }

  if (typeof option === 'function') {
    callback = option;
    option = pkgs;
  }

  if (pkgs && !Array.isArray(pkgs) && typeof pkgs !== 'string') {
    // only pass option in the first place;

    // set yarn registry default to 'https://registry.yarnpkg.com'
    if (pkgs.npmClient === 'yarn' && !pkgs.registry) {
      pkgs.registry = 'https://registry.yarnpkg.com';
    }
    option = Object.assign({}, defaultInstallOption, pkgs);
    pkgs = [];
  } else {
    pkgs = Array.isArray(pkgs) ? pkgs : [ pkgs ];
    if (option && option.npmClient === 'yarn' && !option.registry) {
      option.registry = 'https://registry.yarnpkg.com';
    }
    option = Object.assign({}, defaultInstallOption, option);
  }

  const { npmClient, registry, production, global, save, dev } = option;
  let args = [];
  if (!pkgs.length) {
    // npm install or yarn install
    args = [ 'install' ];
    if (production) {
      args.push('--production');
    }
    if (registry) {
      args.push(`--registry=${registry}`);
    }
  } else {
    // npm install package or yarn add
    if (npmClient === 'yarn' && global) {
      args.push('global');
    }

    if (npmClient === 'yarn') {
      args.push('add');
    } else {
      args.push('install');
    }

    args = args.concat(pkgs);

    if (save && npmClient !== 'yarn' && !dev && !global) {
      // yarn always add dep to pkg
      // https://github.com/yarnpkg/yarn/issues/1743#issuecomment-259428370
      args.push('--save');
    }

    if (dev && !global) {
      args.push('-D');
    }

    if (global && npmClient !== 'yarn') {
      args.push('-g');
    }

    if (registry) {
      args.push(`--registry=${registry}`);
    }
  }

  spawnNpm(npmClient, args, callback);
});

/**
 * get the package info on npm remote (support promise and callback)
 * @param {string} name - package's name
 * @param {Object} [option] - option for latest
 * @param {string} option.registry - registry of your npm client
 * @param {string} option.version - version of your npm package
 * @param {function} callback - callback with (error,info<json>)
 */
exports.latest = u(function(name, option, callback) {
  if (typeof option === 'function') {
    callback = option;
    option = {};
  }
  if (!name || typeof name !== 'string') {
    callback(
      new Error(
        `typeof name should be string and should not be empty, but latest function received type: ${typeof name}`
      )
    );
    return;
  }
  option = Object.assign({}, defaultLatestConfig, option);
  if (option.registry[option.registry.length - 1] !== '/') {
    option.registry = `${option.registry}/`;
  }
  const url = `${option.registry}${encodeURIComponent(name)}/${option.version}`;
  urllib.request(url, { dataType: 'json' }, function(err, data) {
    if (err) {
      callback(err);
    }
    callback(null, data);
  });
});

/**
 * uninstall specific packages
 * @param {string | array} pkgs - packages to uninstall
 * @param {Object} [option] - option for uninstall
 * @param {boolean} option.save  - save to pkg[dependencies]
 * @param {boolean} option.dev  - save to pkg[devDependencies]
 * @param {boolean} option.global - uninstall to global scope (npm uninstall xx -g)
 * @param {string} option.npmClient - support npm | yarn | or your custom npm client like cnpm, tnpm
 */
exports.uninstallSync = function(pkgs, option) {
  if (
    !pkgs ||
    (typeof pkgs !== 'string' && !Array.isArray(pkgs)) ||
    !pkgs.length
  ) {
    log.error('pkgs has to be array or string and truthy');
    return;
  }
  pkgs = Array.isArray(pkgs) ? pkgs : [ pkgs ];
  option = Object.assign({}, defaultUninstallOption, option);
  const { npmClient, global, save, dev } = option;
  let args = [];
  if (npmClient === 'yarn') {
    if (global) {
      args = [ 'global', 'remove', ...pkgs ];
    } else {
      args = [ 'remove', ...pkgs ];
    }
  } else {
    args = [ 'uninstall', ...pkgs ];
    if (save && !dev && !global) {
      args.push('--save');
    }
    if (dev && !global) {
      args.push('--save-dev');
    }
    if (global) {
      args.push('-g');
    }
  }

  spawnNpmSync(npmClient, args);
};

/**
 * uninstall packages or dependencies from pkg.json
 * @param {string | array} pkgs - packages to uninstall
 * @param {Object} [option] - option for uninstall
 * @param {boolean} option.save  - save to pkg[dependencies]
 * @param {boolean} option.dev  - save to pkg[devDependencies]
 * @param {boolean} option.global - uninstall to global scope (npm uninstall xx -g)
 * @param {string} option.npmClient - support npm | yarn | or your custom npm client like cnpm, tnpm
 *@param {function} callback - callback with (error)
 */
exports.uninstall = u(function(pkgs, option, callback) {
  if (typeof pkgs === 'function') {
    callback = pkgs;
    pkgs = [];
  }
  if (typeof option === 'function') {
    callback = option;
    option = {};
  }
  if (
    !pkgs ||
    (typeof pkgs !== 'string' && !Array.isArray(pkgs)) ||
    !pkgs.length
  ) {
    log.error('pkgs has to be array or string and truthy');
    callback();
    return;
  }
  pkgs = Array.isArray(pkgs) ? pkgs : [ pkgs ];
  option = Object.assign({}, defaultUninstallOption, option);
  const { npmClient, global, save, dev } = option;
  let args = [];
  if (npmClient === 'yarn') {
    if (global) {
      args = [ 'global', 'remove', ...pkgs ];
    } else {
      args = [ 'remove', ...pkgs ];
    }
  } else {
    args = [ 'uninstall', ...pkgs ];
    if (save && !dev && !global) {
      args.push('--save');
    }
    if (dev && !global) {
      args.push('--save-dev');
    }
    if (global) {
      args.push('-g');
    }
  }

  spawnNpm(npmClient, args, callback);
});
