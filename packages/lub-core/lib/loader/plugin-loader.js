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

/*
  will return like:
  {
    'bar-dev': { clz: [Function: dev], config: undefined, task: [] },
    coincidance: { clz: [Function: dance], config: undefined, task: [] },
    start:
      {
        clz: [Function: start],
        config: { env: 'build' },
        task: [ [Object], [Object] ]
      },
    build:
    { clz: [Function: build], config: { env: 'build' }, task: [] }
  }
 */
function loadPlugin(pluginName, importerPath) {
  const InitCommand = require('../buildInCommand/InitCommand');
  const defaultPluginInfo = {
    init: {
      clz: InitCommand,
      config: undefined,
      task: [],
    },
  };

  const cwd = process.cwd();
  const isUpperProjectScene = !pluginName;
  let pluginPath = '';

  if (isUpperProjectScene) {
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

  let pluginInfo = isUpperProjectScene ? defaultPluginInfo : {};

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
          clz: extendedPluginInfo[command].clz,
          config: pluginConfig[current],
          task: task[command] || [],
        };
      }
      return prev;
    }, pluginInfo);
  }

  if (pluginName) {
    // load entry file's commands and overwrite commands from plugins
    const entry = importFresh(pluginPath);
    for (const command in entry) {
      pluginInfo[command] = {
        clz: entry[command],
        config: undefined,
        task: [],
      };
    }
  }

  return pluginInfo;
}

module.exports = loadPlugin;
