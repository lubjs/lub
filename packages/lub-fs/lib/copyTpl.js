'use strict';

const fs = require('fs-extra');
const log = require('lub-log')('lub-fs');
const path = require('path');
const minimatch = require('minimatch');
const u = require('universalify').fromCallback;
const _ = require('underscore');

const defaultTemplateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g,
};

/**
 *
 * @param {object} options - options for copyTplSync
 * @param {string} options.src - the source dir or file
 * @param {string} options.dest - the dest dir or file
 * @param {array} options.ignore - files or dir to ignore (in glob pattern)
 * @param {array} options.stringReplace - replace the regex with string
 * @param {object} options.data - data to replace the template pattern
 * @param {object} options.templateSettings - template pattern settings
 * @param {function} cb - callback
 */
function copyTpl(options, cb) {
  if (!options.src || !options.dest) {
    log.error('either options.src or options.dest is not defined');
    return cb();
  }

  if (!fs.existsSync(options.src)) {
    log.error(`${options.src} does not exists`);
    return cb();
  }

  if (options.stringReplace && !Array.isArray(options.stringReplace)) {
    log.error('options.stringReplace must be a array');
    return cb();
  }

  options.data = options.data || {};
  options.stringReplace = options.stringReplace || [];
  _.templateSettings = defaultTemplateSettings;
  if (options.templateSettings) {
    _.templateSettings = options.templateSettings;
  }
  options.ignore = options.ignore || [
    '**/node_modules',
    '**/.idea',
    '**/.DS_Store',
  ];

  function copyDir(from, to, cb) {
    fs.ensureDir(to, e => {
      if (e) return cb(e);
      fs.readdir(from, (e, items) => {
        if (e) return cb(e);
        return startCopy(from, to, items, cb);
      });
    });
  }

  function copyFile(from, to, cb) {
    fs.readFile(from, 'utf8', (e, content) => {
      if (e) {
        return cb(e);
      }
      try {
        let compiled = _.template(content)(options.data);
        options.stringReplace.forEach(([ reg, val ]) => {
          compiled = compiled.replace(reg, val);
        });
        fs.outputFile(to, compiled, e => {
          if (e) {
            return cb(e);
          }
          log.success(`file written successfully from ${from} to ${to}`);
          return cb();
        });
      } catch (e) {
        return cb(e);
      }
    });
  }

  function startCopy(from, to, items, cb) {
    const item = items.pop();
    if (!item) return cb();
    const src = path.join(from, item);
    const dest = path.join(to, item);
    copy(src, dest, e => {
      if (e) return cb(e);
      return startCopy(from, to, items, cb);
    });
  }

  function copy(from, to, cb) {
    const isIgnore = options.ignore.some(pattern => minimatch(from, pattern));
    if (isIgnore) return cb();

    fs.stat(from, (e, srcStat) => {
      if (e) return cb(e);
      if (srcStat.isDirectory()) {
        return copyDir(from, to, cb);
      }
      if (srcStat.isFile()) {
        return copyFile(from, to, cb);
      }
      return cb();
    });
  }

  copy(options.src, options.dest, cb);
}

module.exports = u(copyTpl);
