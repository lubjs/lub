'use strict';

const spawn = require('cross-spawn');
const { helper } = require('lub-command');
const log = require('lub-log')('lub-npm');

exports.spawnNpmSync = function(npmClient, args) {
  const npmProcess = spawn.sync(npmClient, args, { stdio: 'inherit' });
  const error = npmProcess.error;
  if (error && error.code === 'ENOENT') {
    log.error(
      `Could not execute ${npmClient}, please check your package manager.`
    );
    throw error;
  }
};

exports.spawnNpm = function(npmClient, args, callback) {
  helper
    .spawn(npmClient, args, { stdio: 'inherit' })
    .then(() => callback())
    .catch(error => {
      if (error && error.code === 'ENOENT') {
        log.error(
          `Could not execute ${npmClient}, please check your package manager.`
        );
      }
      callback(error);
    });
};

exports.defaultInstallOption = {
  save: true,
  dev: false,
  global: false,
  production: false,
  registry: 'https://registry.npmjs.org',
  npmClient: 'npm',
};

exports.defaultUninstallOption = {
  save: false,
  dev: false,
  global: false,
  npmClient: 'npm',
};

exports.defaultLatestConfig = {
  registry: 'https://registry.npmjs.org',
  version: 'latest',
};
