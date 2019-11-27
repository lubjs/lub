'use strict';

const co = require('co');
const log = require('lub-log')('lub-command');
const yargs = require('yargs');
const helper = require('./helper');

const DISPATCH = Symbol.for('LubCommand#dispatch');
const DESCRIPTION = Symbol('LubCommand#description');
const PARSE = Symbol.for('LubCommand#parse');
const VERSION = Symbol('LubCommand#version');

class LubCommand {
  /**
   * base class help to create plugin
   * @param {array} rawArgv - raw arguments of [lub subCommand]
   * @param {any} config - config of lub-plugins defined in .lubrc.js
   */
  constructor(rawArgv, config) {
    this.rawArgv = rawArgv || process.argv.slice(2);
    this.config = config;
    this.helper = helper;
    log.debug(
      '[%s] origin argument `%s`',
      this.constructor.name,
      this.rawArgv.join(' ')
    );
    this.yargs = yargs(this.rawArgv);
  }

  showHelp() {
    this.yargs.showHelp();
  }

  /**
   * set command's version
   * @param {string} ver - version of your command
   */
  set version(ver) {
    this[VERSION] = ver;
  }

  /**
   * get command's version
   * @return {string} ver - version of your command
   */
  get version() {
    return this[VERSION];
  }

  /**
   * shortcut for yargs.options
   * @param  {Object} opt - an object set to `yargs.options`
   */
  set options(opt) {
    this.yargs.option(opt);
  }

  /**
   * shortcut for yargs.usage
   * @param  {String} usage - usage info
   */
  set usage(usage) {
    this.yargs.usage(usage);
  }

  get description() {
    return this[DESCRIPTION];
  }

  /**
   * shortcut for yargs.cammand's description argv
   * @param  {String} des - des info
   */
  set description(des) {
    this[DESCRIPTION] = des;
  }

  get context() {
    const argv = this.yargs.argv;
    const context = {
      argv,
      cwd: process.cwd(),
      env: Object.assign({}, process.env),
      rawArgv: this.rawArgv,
    };

    argv.help = undefined;
    argv.h = undefined;
    argv.version = undefined;
    argv.v = undefined;

    return context;
  }

  [PARSE](rawArgv) {
    return new Promise((resolve, reject) => {
      this.yargs.parse(rawArgv, (err, argv) => {
        /* istanbul ignore next */
        if (err) return reject(err);
        resolve(argv);
      });
    });
  }

  * [DISPATCH](config) {
    // define --help and --version by default
    this.yargs
      .help()
      .version()
      .wrap(120)
      .alias('h', 'help')
      .alias('v', 'version')
      .group([ 'help', 'version' ], 'Global Options:');

    // get parsed argument without handling helper and version
    const parsed = yield this[PARSE](this.rawArgv);

    if (parsed.version && this.version) {
      console.log(this.version);
      /* istanbul ignore next */
      return;
    }
    if (parsed.help) {
      this.showHelp();
      /* istanbul ignore next */
      return;
    }

    const context = this.context;

    yield this.helper.callFn(this.run, [ context, config ], this);
  }

  /**
   * default error hander
   * @param {Error} err - error object
   * @protected
   */
  errorHandler(err) {
    log.error(err);
    log.error('Command Error, enable `DEBUG=lub-command` for detail');
    log.debug('args %s', process.argv.slice(3));
    process.exit(1);
  }

  start() {
    return co(
      function* () {
        yield this[DISPATCH](this.config);
      }.bind(this)
    ).catch(this.errorHandler);
  }
}

module.exports = LubCommand;
