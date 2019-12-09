'use strict';

const inquirer = require('inquirer');
const fs = require('lub-fs');
const lubNpm = require('lub-npm');
const loadPlugin = require('../loader/plugin-loader');
const getLocalLubCommandClass = require('../shared/getLocalLubCommandClass');
const log = require('lub-log')('lub-core');

const LubCommand = getLocalLubCommandClass();

class InitCommand extends LubCommand {
  constructor(rawArgv, config) {
    // don't forget this line
    super(rawArgv, config);

    // define your command's usage and description info
    this.usage = 'Usage: lub init <lub-plugin>';
    this.cwd = process.cwd();
    this.options = {
      registry: {
        alias: 'r',
        description: "set npm's registry",
        default: 'https://registry.npmjs.org',
        type: 'string',
      },
      client: {
        alias: 'c',
        description: 'npm client',
        default: 'npm',
        type: 'string',
      },
    };
  }

  get description() {
    return 'Install <lub-plugin> and exec its init function - useful to init your project';
  }

  async checkEmptyDir(pluginName) {
    const fileDirs = await fs.readdir(this.cwd);
    if (!fileDirs) {
      return true;
    }
    const answers = await inquirer.prompt([
      {
        name: 'init',
        type: 'confirm',
        message: `Current dir is not empty! Are you sure you want to exec lub init ${pluginName}`,
      },
    ]);
    return answers.init;
  }

  async run({ argv, rawArgv }) {
    const pluginName = argv._[0];
    const { registry, client: npmClient } = argv;
    const checkEmptyDir = await this.checkEmptyDir(pluginName);

    if (!checkEmptyDir) {
      process.exit(0);
      return;
    }

    await lubNpm.install(pluginName, {
      dev: true,
      registry,
      npmClient,
    });

    const initClz = loadPlugin(pluginName).init;

    if (!initClz) {
      log.error(`can not find init command on ${pluginName}`);
      process.exit(1);
    }

    const { clz } = initClz;
    rawArgv.splice(rawArgv.indexOf(pluginName), 1);
    await new clz(rawArgv).start();
  }
}

module.exports = InitCommand;
