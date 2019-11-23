/**
 *
 * {
  plugins: [ 'lub-plugin-git', 'lub-plugin-link', 'beidou' ],
  beidou: {},
  alias: {
    beidou: {
      dev: 'beidou-dev',
    },
  },
  task: {
    start: [
      'lub link',
      'lub git sync',
      {
        command: 'lub commit init',
        async: true,
        order: 'after',
      },
    ],
  },
};
 */

"use strict";
const path = require("path");
const importFresh = require("import-fresh");
const stripComments = require("strip-json-comments");
const log = require("lub-log")("lub-core:config-loader");
const fs = require("lub-fs");

function normalizeConfig({ plugins, alias, task, ...pluginConfigs }) {
  plugins = Array.isArray(plugins) ? plugins : [plugins];
  alias = alias || {};
  for (const key in task) {
    task[key] = Array.isArray(task[key]) ? task[key] : [task[key]];
  }
  return {
    plugins,
    alias,
    task,
    ...pluginConfigs
  };
}

function loadConfig(filePath) {
  const exist = fs.existsSync(filePath);
  if (!exist) {
    return null;
  }
  switch (path.extname(filePath)) {
    case ".js":
      try {
        return normalizeConfig(importFresh(filePath));
      } catch (e) {
        log.error(`Error reading Javascript file: ${filePath}`);
        throw e;
      }
    case ".json":
    default:
      try {
        const content = fs
          .readFileSync(filePath, "utf8")
          .replace(/^\ufeff/u, "");
        return normalizeConfig(JSON.parse(stripComments(content)));
      } catch (e) {
        log.error(`Error reading JSON file: ${filePath}`);
        throw e;
      }
  }
}

module.exports = loadConfig;
