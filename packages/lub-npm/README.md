# lub-npm

This package provides you with several useful utils to help operate npm bin.

---

## Install

```bash
npm install lub-npm --save
```

## Methods

### Sync vs Async vs Async/Await

Most methods are async by default. All async methods will return a promise if the callback isn't passed.

Sync methods on the other hand will throw if an error occurs.

Also Async/Await will throw an error if one occurs.


### Sync

- [findPackageJsonSync](#findpackagejsonsyncstartdir--string)
- [installSync](#installsyncpkgsoption)
- [uninstallSync](#uninstallsyncpkgsoption)

### Async

- [findPackageJson](#findpackagejsonstartdircallback)
- [install](#installpkgsoptioncallback)
- [uninstall](#uninstallpkgsoptioncallback)
- [latest](#latestpkgoption)

## API

### findPackageJsonSync(startDir) => string

>  Find the closest package.json file, starting at process.cwd (by default) and working up to root.

- `startDir` `{string}` Starting directory
- return `{string}` Absolute path to closest package.json file

### findPackageJson(startDir,callback)

>  (Async) Find the closest package.json file, starting at process.cwd (by default) and working up to root.

- `startDir` `{string}` Starting directory
- `callback` `{function}` callback with (error, package.json's path)

### installSync(pkgs,option)

>  install specific packages to pkg.json or install all dependencies from pkg.json

- `pkgs` `{string | array<string>}` (optional) packages to install , if null will equals `npm install`
- `option` `{Object}` optional
- `option.save` default: true, equals to `--save`
- `option.dev` default: false, equals to `--save-dev`
- `option.global` default: false, equals to `-g`
- `option.production` default: false, equals to `--production`
- `option.registry` default: "https://registry.npmjs.org", set npm registry
- `option.npmClient` default: "npm", support 'yarn' and you can use your custom client such as cnpm, tnpm

### install(pkgs,option,callback)

>  (async) install specific packages to pkg.json or install all dependencies from pkg.json

- `pkgs` `{string | array<string>}` (optional) packages to install , if null will equals `npm install`
- `option` `{Object}` optional
- `option.save` default: true, equals to `--save`
- `option.dev` default: false, equals to `--save-dev`
- `option.global` default: false, equals to `-g`
- `option.production` default: false, equals to `--production`
- `option.registry` default: "https://registry.npmjs.org", set npm registry
- `option.npmClient` default: "npm", support 'yarn' and you can use your custom client such as cnpm, tnpm
- `callback` {function} callback with error argv

### uninstallSync(pkgs,option)

> uninstall specific packages

- `pkgs` `{string | array<string>}` (required) packages to uninstall
- `option` `{Object}` optional
- `option.save` default: true, equals to `--save`
- `option.dev` default: false, equals to `--save-dev`
- `option.global` default: false, equals to `-g`
- `option.npmClient` default: "npm", support 'yarn' and you can use your custom client such as cnpm, tnpm

### uninstall(pkgs,option,callback)

> (async) uninstall specific packages

- `pkgs` `{string | array<string>}` (required) packages to uninstall
- `option` `{Object}` optional
- `option.save` default: false, equals to `--save`
- `option.dev` default: false, equals to `--save-dev`
- `option.global` default: false, equals to `-g`
- `option.npmClient` default: "npm", support 'yarn' and you can use your custom client such as cnpm, tnpm
- `callback` {function} callback with error argv

### latest(pkg,option)

> get the specific (default: latest) version pkg.json info of the package

- `pkgs` `{string}` (required) the package to fetch latest info
- `option` `{Object}` optional
- `option.version` {string} default: "latest" the version of the package
- `option.registry` {string} default: "https://registry.npmjs.org" registry of your npm client
- `callback` {function} callback with error and pkgInfo argvs

## PR Welcome

PRs are welcomed if you have useful utils on npm bin when creating your boilerplate.