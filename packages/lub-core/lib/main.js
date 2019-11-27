'use strict';

const Command = require('lub-command');
const assert = require('assert');
const log = require('lub-log')('lub-core');
const loadPlugin = require('./loader/plugin-loader');

class MainCommand extends Command {
  constructor(rawArgs) {
    super(rawArgs);
    this.usage = 'Usage: lfx <subCommand>';
    // init command from lub-plugins;
    this.commandInfo = loadPlugin();
    for (const commandName in this.commandInfo) {
      const Command = this.commandInfo[commandName].clz;
      this.checkCommand(Command, commandName);
      this.yargs.command(commandName, Command.prototype.description || '');
    }
  }

  /**
   * run the task list from lub config file support async and sync
   * @param {array} taskList - the before or after task list
   */
  async runList(taskList) {
    for (let i = 0; i < taskList.length; i++) {
      let { command, async } = taskList[i];
      // trim
      command = command.replace(/^\s+|\s+$/gm, '');
      // remove multiple spaces
      command = command.replace(/\s+/g, ' ');
      const [ cmd, ...args ] = command.split(' ');
      if (async) {
        this.helper.spawn(cmd, args).catch(e => {
          log.error(e);
        });
      } else {
        await this.helper.spawn(cmd, args);
      }
    }
  }

  /**
   * check if the sub comman class instance of  lub-command
   * @param {Command} clz - sub command class (instance of lub-command)
   * @param {string} commandName - sub command name
   */
  checkCommand(clz, commandName) {
    assert(
      clz.prototype instanceof Command,
      `${commandName} class should be sub class of lub-command`
    );
  }

  /**
   * run the task list before or after the sub command adn sub command itself
   * @param {string} commandName - the sub command name of lub plugin
   * @param {array} rawArgv - raw args from bin excluding sub command name
   */
  async runTask(commandName, rawArgv) {
    const { clz, config, task } = this.commandInfo[commandName];

    const beforeTasks = task.filter(({ order }) => {
      return !order || order === 'before';
    });
    const afterTasks = task.filter(({ order }) => {
      return !order || order === 'after';
    });

    await this.runList(beforeTasks);

    await new clz(rawArgv, config).start();

    await this.runList(afterTasks);
  }

  async run({ argv, rawArgv }) {
    const [ commandName ] = argv._;
    if (!this.commandInfo[commandName]) {
      const error = new Error(`Can not find ${commandName} from your lub config file, please use \`lub --help
        \` to check`);
      throw error;
    }
    rawArgv.splice(rawArgv.indexOf(commandName), 1);
    await this.runTask(commandName, rawArgv);
  }
}

module.exports = MainCommand;
