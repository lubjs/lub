'use strict';
const path = require('path');
const importFresh = require('import-fresh');
const stripComments = require('strip-json-comments');
const log = require('lub-log')('lub-core:config-loader');
const fs = require('lub-fs');

function normalizeConfig({
  plugins = [],
  alias = {},
  task = {},
  ...pluginConfigs
}) {
  plugins = Array.isArray(plugins) ? plugins : [ plugins ];
  for (const key in task) {
    task[key] = Array.isArray(task[key]) ? task[key] : [ task[key] ];
    task[key] = task[key].map(taskInfo => {
      if (typeof taskInfo === 'string') {
        return {
          command: taskInfo,
          async: false,
          order: 'before',
        };
      }
      const { command, async = false, order = 'before' } = taskInfo;
      if (typeof command !== 'string' || !command) {
        const message = `the type of command  in ${key} needs to be string`;
        const e = new Error(message);
        log.error(e);
        throw e;
      }
      return { command, async, order };
    });
  }
  return {
    plugins,
    alias,
    task,
    ...pluginConfigs,
  };
}

function loadConfig(filePath) {
  const exist = fs.existsSync(filePath);
  if (!exist) {
    return null;
  }
  switch (path.extname(filePath)) {
    case '.js':
      try {
        return normalizeConfig(importFresh(filePath));
      } catch (e) {
        log.error(`Error reading Javascript file: ${filePath}`);
        throw e;
      }
    case '.json':
    default:
      try {
        const content = fs
          .readFileSync(filePath, 'utf8')
          .replace(/^\ufeff/u, '');
        return normalizeConfig(JSON.parse(stripComments(content)));
      } catch (e) {
        log.error(`Error reading JSON file: ${filePath}`);
        throw e;
      }
  }
}

module.exports = loadConfig;
