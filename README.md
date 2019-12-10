# lub

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url] 
[![Test coverage][codecov-image]][codecov-url] 
[![npm download][download-image]][download-url]
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

[npm-image]: https://img.shields.io/npm/v/lub.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lub
[travis-image]: https://img.shields.io/travis/lubjs/lub.svg?style=flat-square
[travis-url]: https://travis-ci.org/lubjs/lub
[codecov-image]: https://codecov.io/gh/lubjs/lub/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/lubjs/lub
[download-image]: https://img.shields.io/npm/dm/lub.svg?style=flat-square
[download-url]: https://npmjs.org/package/lub

---

## Origin of the name

The name of `lubjs` comes from [Lu Ban](https://en.wikipedia.org/wiki/Lu_Ban), a Chinese structural engineer, inventor, and carpenter during the Zhou Dynasty, also revered as the Chinese god (patron) of builders and contractors.

## Features
- **simple config , out of the box** - by creating `.lubrc`, `.lubrc.json` or `.lubrc.js` in your project and declare plugins, you can use others' cli command as well as boilerplate
- **OO Design, develop your own plugin quickly** - Define your command class by appointment and export it, you just make it.
- **abundant async/async function utils** - `lubjs` provides you with many [useful utils](https://github.com/lubjs/lub/tree/master/packages/lub-api) which you can use when developing your plugins.
- **integratable and extendable** - by declare multiple plugins you just integrate these commands if these plugins alse requires other plugins in config file, the project also own them.
- **support promise (async/await) and generator**

## Install

```bash
npm install lub --save

# use:
npx lub <subcommand>
```

or

```bash
npm install lub -g

# use: 
lub <subcommand>
```

## Usage

### Config

The order `lubjs` read from your project is: `.lubrc.js` > `.lubrc.json` > `.lubrc`

A typical `lubrc` config looks like this:

```javascript
// .lubrc or .lubrc.json
{
  "plugins": [
    "lub-plugin-publish" // plugin - npm package name
  ],
  "lub-plugin-publish":{ // config will passed to plugin
    "foo": "bar"
  },
  // it will change lub-plugin-publish plugin's subcommand `dev` to `bar-dev`
  // in case of two plugins have the same subcommand name
  // after set alias just use `lub bar-dev`
  "alias": {
    "lub-plugin-bar": {
      "dev": "bar-dev"
    }
  },
  // if you want do some tasks before or after some subcommand, you can define your tasks
  "task": {
    // `publish` subcommand from `lub-plugin-publish` plugin,
    "publish": [
      {
        "command": "sh ./scripts/deploy.sh", // the command to exec
        "order": "after", // exec the command after `lub publish`
        "async": true  // exec the command asyncly
      }
    ]
  }
}
```

You can also export your config in `.lubrc.js`.

```javascript
// .lubrc.js
module.exports = {
  "plugins": [
    "lub-plugin-publish" // plugin - npm package name
  ],
  "lub-plugin-publish":{ // config will passed to plugin
    "foo": "bar"
  },
  // it will change lub-plugin-publish plugin's subcommand `dev` to `bar-dev`
  // in case of two plugins have the same subcommand name
  // after set alias just use `lub bar-dev`
  "alias": {
    "lub-plugin-bar": {
      "dev": "bar-dev"
    }
  },
  // if you want do some tasks before or after some subcommand, you can define your tasks
  "task": {
    // `publish` subcommand from `lub-plugin-publish` plugin,
    "publish": [
      {
        "command": "sh ./scripts/deploy.sh", // the command to exec
        "order": "after", // exec the command after `lub publish`
        "async": true  // exec the command asyncly
      }
    ]
  }
}
```

### `lub init <pluginName>`

When in a empty project, it's quit useful to exec `lub init <pluginName>`.
It will:
1. run `npm install <pluginName> --save-dev` install the plugin
2. exec the init command of that plugin

**Also supports extra optional argvs**
- --client, -c: replace npm client with yours like: tnpm, yarn, cnpm
  - default: 'npm'
- --registry, -r: replace the npm registry
  - default: 'https://registry.npmjs.org'

### --version / --help

Want to know the version of `lubjs`? `lub -v`

```bash
0.1.3
```

Want to know plugin subcommand's version like `publish`? `lub publish -v`

> Notice: If subcommand doesn't set its version ,  lub will use `lub-core` version.

Want to know current project supports what subcomands？ just use `lub -h` `lub --help`.

```bash
Usage: lub <subCommand>

Commands:
  lub publish  Generate changelog, publish to npm and push to git

Global Options:
  -h, --help     Show help                                            [boolean]
  -v, --version  Show version number                                  [boolean]
```

Want to know the usage of `lub publish`? try `lub publish -h`.
```bash
Usage: lub publish [major | minor | patch | version]

Global Options:
  -h, --help     Show help                                                                                     [boolean]
  -v, --version  Show version number                                                                           [boolean]

Options:
  --registry, -r  set npm's registry                       [string] [default: "https://registry.npmjs.org"]
  --filename, -f  changelog file name                      [string] [default: "CHANGELOG"]
  --client, -c    npm client                               [string] [default: "npm"]
  --npm, -n       whether to publish to npm                [boolean] [default: true]
```

### Exec subcommand

After list subcommands by `lub -h`, use `lub <subCommand>` to exec subcommands

> Notice: If tasks are defined in config file, they will also be executed.

## How to develop my own plugin? 

Benefit from `lub-command` package's [OO Design Pattern](https://en.wikipedia.org/wiki/Object-oriented_design), it's quite simple and quick to develop your own plugin and subcommands, see [here](https://github.com/lubjs/lub/tree/master/packages/lub-command).

And a real world example: [lub-plugin-publish](https://github.com/lubjs/lub-plugin-publish)

## PR Welcome

If your have some wondeful plugins and utils, pull requests are welcomed in this [github group](https://github.com/lubjs).


## License

[MIT](LICENSE)
