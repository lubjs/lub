'use strict';
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');
const debug = require('debug');
const defaultTypes = require('./types');

const { grey, underline } = chalk;
const defaultConfig = {
  displayDate: false,
  displayTimestamp: false,
  displayFilename: false,
  displayLabel: true,
  displayBadge: true,
  underlinePrefix: false,
  uppercaseLabel: false,
  underlineLabel: false,
  underlineMessage: false,
  underlineSuffix: false,
};

class LubLog {
  constructor(options = {}) {
    if (typeof options === 'string') {
      options = {
        scope: options,
      };
    }
    this._config = Object.assign({}, defaultConfig, options.config);
    this._scopeName = options.scope || '';
    this._types = defaultTypes;
    this._stream = process.stdout;
    this._longestLabel = this._getLongestLabel();
    this._debug = debug(this._formatDebugScopeName());
    Object.keys(this._types).forEach(type => {
      this[type] = this._logger.bind(this, type);
    });
  }

  get scopeName() {
    return this._scopeName;
  }

  get date() {
    const _ = new Date();
    return [ _.getFullYear(), _.getMonth() + 1, _.getDate() ].join('-');
  }

  get timestamp() {
    const _ = new Date();
    return [ _.getHours(), _.getMinutes(), _.getSeconds() ].join(':');
  }

  get filename() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const { stack } = new Error();
    Error.prepareStackTrace = _;

    const callers = stack.map(x => x.getFileName());

    const firstExternalFilePath = callers.find(x => {
      return x !== callers[0];
    });

    return path.basename(firstExternalFilePath);
  }

  get _longestUnderlinedLabel() {
    return underline(this._longestLabel);
  }

  set configuration(configObj) {
    this._config = Object.assign(this._config, configObj);
  }

  _arrayify(x) {
    return Array.isArray(x) ? x : [ x ];
  }

  _getLongestLabel() {
    const { _types } = this;
    const labels = Object.keys(_types).map(x => _types[x].label);
    return labels.reduce((x, y) => (x.length > y.length ? x : y));
  }

  _formatDate() {
    return `[${this.date}]`;
  }

  _formatFilename() {
    return `[${this.filename}]`;
  }

  _formatDebugScopeName() {
    if (Array.isArray(this._scopeName)) {
      const scopes = this._scopeName.filter(x => x.length !== 0);
      return `${scopes.map(x => `${x.trim()}`).join(' ')}`;
    }

    return `${this._scopeName}`;
  }

  _formatScopeName() {
    if (Array.isArray(this._scopeName)) {
      const scopes = this._scopeName.filter(x => x.length !== 0);
      return `${scopes.map(x => `[${x.trim()}]`).join(' ')}`;
    }

    return `[${this._scopeName}]`;
  }

  _formatTimestamp() {
    return `[${this.timestamp}]`;
  }

  _formatMessage(str) {
    return util.format(...this._arrayify(str));
  }

  _meta() {
    const meta = [];

    if (this._config.displayDate) {
      meta.push(this._formatDate());
    }

    if (this._config.displayTimestamp) {
      meta.push(this._formatTimestamp());
    }

    if (this._config.displayFilename) {
      meta.push(this._formatFilename());
    }

    if (this._scopeName.length !== 0) {
      meta.push(this._formatScopeName());
    }

    if (meta.length !== 0) {
      meta.push(`${figures.pointerSmall}`);
      return meta.map(item => grey(item));
    }

    return meta;
  }

  _hasAdditional({ suffix, prefix }, args) {
    return suffix || prefix ? '' : this._formatMessage(args);
  }

  _buildLublog(type, ...args) {
    let [ msg, additional ] = [{}, {}];

    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      if (args[0] instanceof Error) {
        [ msg ] = args;
      } else {
        const [{ prefix, message, suffix }] = args;
        additional = Object.assign({}, { suffix, prefix });
        msg = message
          ? this._formatMessage(message)
          : this._hasAdditional(additional, args);
      }
    } else {
      msg = this._formatMessage(args);
    }

    const lublog = this._meta();

    if (additional.prefix) {
      if (this._config.underlinePrefix) {
        lublog.push(underline(additional.prefix));
      } else {
        lublog.push(additional.prefix);
      }
    }

    if (this._config.displayBadge && type.badge) {
      lublog.push(
        chalk[type.color](this._padEnd(type.badge, type.badge.length + 1))
      );
    }

    if (this._config.displayLabel && type.label) {
      const label = this._config.uppercaseLabel
        ? type.label.toUpperCase()
        : type.label;
      if (this._config.underlineLabel) {
        lublog.push(
          chalk[type.color](
            this._padEnd(
              underline(label),
              this._longestUnderlinedLabel.length + 1
            )
          )
        );
      } else {
        lublog.push(
          chalk[type.color](this._padEnd(label, this._longestLabel.length + 1))
        );
      }
    }

    if (msg instanceof Error && msg.stack) {
      const [ name, ...rest ] = msg.stack.split('\n');
      if (this._config.underlineMessage) {
        lublog.push(underline(name));
      } else {
        lublog.push(name);
      }

      lublog.push(grey(rest.map(l => l.replace(/^/, '\n')).join('')));
      return lublog.join(' ');
    }

    if (this._config.underlineMessage) {
      lublog.push(underline(msg));
    } else {
      lublog.push(msg);
    }

    if (additional.suffix) {
      if (this._config.underlineSuffix) {
        lublog.push(underline(additional.suffix));
      } else {
        lublog.push(additional.suffix);
      }
    }

    return lublog.join(' ');
  }

  _write(stream, message) {
    stream.write(message + '\n');
  }

  _log(message) {
    this._write(this._stream, message);
  }

  _logger(type, ...messageObj) {
    const message = this._buildLublog(this._types[type], ...messageObj);
    this._log(message);
  }

  _padEnd(str, targetLength) {
    str = String(str);
    targetLength = parseInt(targetLength, 10);

    if (String.prototype.padEnd) {
      return str.padEnd(targetLength);
    }

    targetLength -= str.length;
    return str + ' '.repeat(targetLength);
  }

  debug(...messageObj) {
    return this._debug(...messageObj);
  }

  config(configObj) {
    this.configuration = configObj;
  }

  scope(...name) {
    if (name.length === 0) {
      throw new Error('No scope name was defined.');
    }

    this._scopeName = name;
    this._debug = debug(this._formatDebugScopeName());
  }

  unscope() {
    this._scopeName = '';
  }
}

module.exports = LubLog;
