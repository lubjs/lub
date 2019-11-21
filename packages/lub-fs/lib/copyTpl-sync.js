'use strict';

const fs = require('fs-extra');
const log = require('lub-log')('lub-fs');
const path = require('path');
const minimatch = require('minimatch');
const _ = require('underscore');

/**
 *
 * @param {object} options - options for copyTplSync
 * @param {string} options.src - the source dir or file
 * @param {string} options.dest - the dest dir or file
 * @param {array} options.ignore - files or dir to ignore (in glob pattern)
 * @param {array} options.stringReplace - replace the regex with string
 * @param {object} options.data - data to replace the template pattern
 * @param {object} options.templateSettings - template pattern settings
 */
function copyTplSync(options) {
  if (!options.src || !options.dest) {
    log.error('either options.src or options.dest is not defined');
    return;
  }

  if (!fs.existsSync(options.src)) {
    log.error(`${options.src} does not exists`);
    return;
  }

  if (options.stringReplace && !Array.isArray(options.stringReplace)) {
    log.error('options.stringReplace must be a array');
    return;
  }

  options.data = options.data || {};
  options.stringReplace = options.stringReplace || [];
  if (options.templateSettings) {
    _.templateSettings = options.templateSettings;
  }
  options.ignore = options.ignore || [
    '**/node_modules',
    '**/.idea',
    '**/.DS_Store',
  ];

  function recursiveCopy(from, to) {
    const isIgnore = options.ignore.some(pattern => minimatch(from, pattern));
    if (isIgnore) return;
    const srcStat = fs.statSync(from);
    if (srcStat.isDirectory()) {
      fs.ensureDirSync(to);
      fs.readdirSync(from).forEach(name => {
        recursiveCopy(path.join(from, name), path.join(to, name));
      });
    }
    if (srcStat.isFile()) {
      try {
        const content = fs.readFileSync(from, 'utf8');
        let compiled = _.template(content)(options.data);
        options.stringReplace.forEach(([ reg, val ]) => {
          compiled = compiled.replace(reg, val);
        });

        fs.outputFileSync(to, compiled);
        log.success(`file written successfully from ${from} to ${to}`);
      } catch (e) {
        log.error(e);
        throw e;
      }
    }
  }

  recursiveCopy(options.src, options.dest);
}

module.exports = copyTplSync;
