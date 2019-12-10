# lub-command

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url] 
[![Test coverage][codecov-image]][codecov-url] 
[![npm download][download-image]][download-url]
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

[npm-image]: https://img.shields.io/npm/v/lub-command.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lub-command
[travis-image]: https://img.shields.io/travis/lubjs/lub.svg?style=flat-square
[travis-url]: https://travis-ci.org/lubjs/lub
[codecov-image]: https://codecov.io/gh/lubjs/lub/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/lubjs/lub
[download-image]: https://img.shields.io/npm/dm/lub-command.svg?style=flat-square
[download-url]: https://npmjs.org/package/lub-command

A base command class to help develop your lub-plugin based on [yargs](https://github.com/yargs/yargs).

It's quit convenient to define your bin's version, help info, description and option description by extending this command class.

---

## Install

```bash
npm install lub-command --save
```

## Usage

### Usage for developing lub-plugin

Make your subcommand's class extend `lub-command`, and export it in your plugin npm package's entry file. Do your biz logic in run method, support `async` and generator `* run`.

```javascript
// lib/clone.js

"use strict";

const Command = require("lub-command");

class GitClone extends Command {
  // here lub-core will pass raw arguments in the running cli and config from .lubrc
  constructor(rawArgv, config) {
    // don't forget this line
    super(rawArgv, config);

    // define your command's usage and description info
    this.usage = "lub clone <repository> [directory]";

    // pass your options to yargs
    this.options = {
      depth: {
        type: "number",
        description:
          "Create a shallow clone with a history truncated to the specified number of commits"
      }
    };
  }

  get description(){
    return "Clone a repository into a new directory";
  }

  // run method has to be defined to do your biz logic here
  // supports generator `* run()` and promise `async run()`
  // arguments context and config will be passed
  async run(context, config) {
    if (config.quiet) {
      console.log("set quiet mode");
    }
    const [repository, directory] = context.argv._;
    console.log(
      "git clone %s to %s with depth %d",
      repository,
      directory,
      argv.depth
    );
  }
}

module.exports = GitClone;
```

```javascript
// index.js => equals to package.main
'use strict';

const clone = require('./lib/clone')

module.exports = {
    clone
}
```

### Usage for independent module

The implementation of subcommand class is the of [For lub plugin developer](#usage-for-developing-lub-plugin).

But you need to run this subcommand by your self.
```javascript
// bin/git-clone.js
#!/usr/bin/env node

"use strict";

const Clone = require("../lib/clone");

const gitClone = new Clone(process.argv.slice(2), { quiet: true });
gitClone.start();

```

## API

### Command
**Method:**
- `start()` - start your program, only use once in your bin file.
- `run(context,config)`
  - should implement this to provide command handler
  - Support generator / async function / normal function which return promise.
  - `context` is `{ cwd, env, argv, rawArgv }`
    - `cwd` - `process.cwd()`
    - `env` - clone env object from `process.env`
    - `argv` - argv parse result by yargs, `{ _: [ 'start' ], '$0': '/usr/local/bin/lub', foo: 'bar'}`
    - `rawArgv` - the raw argv, `[ "--foo=bar" ]`
  - `config` is passed from `.lubrc.js` if used in lub-plugin
- `showHelp()` - print usage message to console.
- `options=` - a setter, shortcut for `yargs.options`
- `usage=` - a setter, shortcut for `yargs.usage`
- `version=` - a setter, set the version of you command

**Properties:**

- `description` - {String} a getter, shortcut for [yargs.command(cmd, desc, [module])](https://github.com/yargs/yargs/blob/99c2dc850e67c606644f8b0c0bca1a59c87dcbcd/docs/api.md#commandcmd-desc-module) only show this description when it's a sub command in help console
- `yargs` - {Object} yargs instance for advanced custom usage
- `helper` - {Object} helper instance exported from `const { helper } = require('lub-command');`

**tips:** `lub-command` will read version from your npm package's package.json

You can define options by set `this.options`

```js
this.options = {
  baseDir: {
    alias: 'b',
    demandOption: true,
    description: 'the target directory',
    coerce: str => path.resolve(prcess.cwd(), str),
  },
  depth: {
    description: 'level to clone',
    type: 'number',
    default: 1,
  },
  size: {
    description: 'choose a size',
    choices: ['xs', 's', 'm', 'l', 'xl']
  },
};
```

You can define version by set `this.version`

```javascript
this.version = 'v1.0.0';
```

You can define description by define `description` getter:

```javascript
get description(){
  return 'this is description';
}
```

### Helper

`lub-command` also provides some useful utils on `helper` when you develop your bin tool:

- `forkNode(modulePath, args, opt)` - fork child process, wrap with promise and gracefull exit
- `spawn(cmd, args, opt)` - spawn a new process, wrap with promise and gracefull exit
- `* callFn(fn, args, thisArg)` - call fn, support gernerator / async / normal function return promise

**how to require:**
```javascript
const { helper } = require('lub-command');
```