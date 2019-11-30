# lub-api

An api collection of lub packages to export.

---

## Install
```bash
npm install lub-api --save
```

## Usage
`lub-api` export a object with all utils of lubjs.
```javascript
const { log, npm } = require('lub-api');

const logger = log('scope');
logger.info('hello, world');

npm.installSync();
```

## API
[lub-api](https://github.com/lubjs/lub/tree/master/packages/lub-api)

- [command](https://github.com/lubjs/lub/tree/master/packages/lub-command) - A base command class to help develop your lub-plugin
    - [helper](https://github.com/lubjs/lub/tree/master/packages/lub-command#helper) - contains some utils under lub-command
- [fs](https://github.com/lubjs/lub/tree/master/packages/lub-fs) - contains several useful file-system functions to help create your plugin
    - [copyTplSync(options)](https://github.com/lubjs/lub/blob/master/packages/lub-fs/docs/copyTpl-sync.md) - copy dir or file and in the meantime replace template string (sync version)
    - [copyTpl(options, [, callback])](https://github.com/lubjs/lub/blob/master/packages/lub-fs/docs/copyTpl.md)- copy dir or file and in the meantime replace template string (async version)
- [log](https://github.com/lubjs/lub/tree/master/packages/lub-log) - A log util to format your log outputs
    - [debug](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - debug log
    - [info](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - info log
    - [warn](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - warn log
    - [error](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - error log
    - [success](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - success log
    - [wait](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - wait log
    - [start](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - start log
    - [watch](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#api) - watch log
    - [scope(name[, name])](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#lublogscopename-name) - defines the scope name of the logger
    - [unscope](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#lublogunscope) - Clear the scope name of the logger
    - [config(setting)](https://github.com/lubjs/lub/blob/master/packages/lub-log/README.md#lublogconfigsetting) - defines the setting config of the logger
- [npm](https://github.com/lubjs/lub/tree/master/packages/lub-npm) - several useful utils to help operate npm bin
    - [findPackageJsonSync(startDir) => string](https://github.com/lubjs/lub/tree/master/packages/lub-npm#findpackagejsonsyncstartdir--string) - Find the closest package.json file, starting at process.cwd (by default) and working up to root.
    - [findPackageJson(startDir,callback)](https://github.com/lubjs/lub/tree/master/packages/lub-npm#findpackagejsonstartdircallback) - async version of findPackageJsonSync
    - [installSync(pkgs,option)](https://github.com/lubjs/lub/tree/master/packages/lub-npm#installsyncpkgsoption) - install specific packages to pkg.json or install all dependencies from pkg.json
    - [install(pkgs,option,callback)](https://github.com/lubjs/lub/tree/master/packages/lub-npm#installpkgsoptioncallback) - async version of installSync
    - [uninstallSync(pkgs,option)](https://github.com/lubjs/lub/tree/master/packages/lub-npm#uninstallsyncpkgsoption) - uninstall specific packages
    - [uninstall(pkgs,option,callback)](https://github.com/lubjs/lub/tree/master/packages/lub-npm#uninstallpkgsoptioncallback) - async version of uninstall
    - [latest(pkg,option)](https://github.com/lubjs/lub/tree/master/packages/lub-npm#latestpkgoption) - get the specific (default: latest) version pkg.json info of the package

## PR Welcome
PRs are welcomed if you have useful utils during creating plugins.