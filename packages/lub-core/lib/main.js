'use strict';

const Command = require('lub-command');
// const log = require('lub-log')('lub-core');
const loadPlugin = require('./loader/plugin-loader');

class MainCommand extends Command {
  constructor(rawArgs) {
    super(rawArgs);
    this.usage = 'Usage: lfx <subCommand>';
    // init command from lub-plugins;
    this.commandInfo = loadPlugin();
    for (const commandName in this.commandInfo) {
      const Command = this.commandInfo[commandName].clz;
      this.yargs.command(commandName, Command.prototype.description || '');
    }
  }

  //   runTask(commandName, rawArgv) {
  //     // const { clz, config, task } = this.commandInfo[commandName];
  //   }

  //   run({ cwd, env, argv, rawArgv }) {
  //     const [ commandName ] = argv._[0];
  //     if (!this.commandInfo[commandName]) {
  //       log.error(`Can not find ${commandName} from your lub config file, please use \`lub --help
  //         \` to check`);
  //       return;
  //     }
  //     rawArgv.splice(rawArgv.indexOf(commandName), 1);
  //     this.runTask(commandName, rawArgv);
  //   }
}

module.exports = MainCommand;
