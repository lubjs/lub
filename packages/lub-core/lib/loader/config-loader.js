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

'use strict';
const path = require('path');
const importFresh = require('import-fresh');
const fs = require('lub-fs');
const stripComments = require('strip-json-comments');
const log = require('lub-log')('lub-core:config-loader');

function loadConfig(filePath) {
  const exist = fs.existsSync(filePath);
  if (!exist) {
    return null;
  }
  switch (path.extname(filePath)) {
    case '.js':
      try {
        return importFresh(filePath);
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
        return JSON.parse(stripComments(content));
      } catch (e) {
        log.error(`Error reading JSON file: ${filePath}`);
        throw e;
      }
  }
}

module.exports = loadConfig;
