'use strict';

const log = require('lub-log')('lub-core:plugin-loader');
const importFresh = require('import-fresh');
const path = require('path');
const resolver = require('../shared/relative-module-resolver');
const loadConfig = require('./config-loader');

const CONFIG_NAME_PREFIX = '.lubrc';

function loadPluginConfig(pluginPath) {
  const pluginConfigJS = path.join(pluginPath, `${CONFIG_NAME_PREFIX}.js`);
  const pluginConfigJSON = path.join(pluginPath, `${CONFIG_NAME_PREFIX}.json`);
  const pluginConfigRc = path.join(pluginPath, `${CONFIG_NAME_PREFIX}`);

  const pluginConfig =
    loadConfig(pluginConfigJS) ||
    loadConfig(pluginConfigJSON) ||
    loadConfig(pluginConfigRc);

  return pluginConfig;
}

function loadPlugin(pluginName, importerPath) {
  const cwd = process.cwd();
  let pluginPath = '';
  if (!pluginName) {
    // in a upper application scene
    pluginPath = cwd;
  } else {
    try {
      pluginPath = path.dirname(
        resolver.resolve(
          pluginName,
          importerPath || path.join(cwd, '__placeholder__.js')
        )
      );
    } catch (e) {
      log.error(`can not find ${pluginName}, maybe you need install it first`);
      throw e;
    }
  }

  let pluginInfo = {};

  const pluginConfig = loadPluginConfig(pluginPath);

  if (pluginConfig) {
    const extendedPlugins = pluginConfig.plugins;

    // load commands from extended plugins
    pluginInfo = extendedPlugins.reduce((prev, current) => {
      const extendedPluginInfo = loadPlugin(current);
      const { alias, task } = pluginConfig;
      for (const command in extendedPluginInfo) {
        const aliasCommand =
          (alias[current] && alias[current][command]) || command;
        prev[aliasCommand] = {
          func: extendedPluginInfo[command].func,
          config: extendedPluginInfo[command].fromEntry
            ? pluginConfig[current]
            : undefined,
          task: task[command] || [],
        };
      }
      return prev;
    }, {});
  }

  if (pluginName) {
    // load entry file's commands and overwrite commands from plugins
    const entry = importFresh(pluginPath);
    for (const command in entry) {
      pluginInfo[command] = {
        func: entry[command],
        config: undefined,
        task: [],
        fromEntry: true,
      };
    }
  }

  return pluginInfo;
}

module.exports = loadPlugin;
