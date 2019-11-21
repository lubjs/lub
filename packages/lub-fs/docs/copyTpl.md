# copyTplSync(options, [, callback])

Copy a file or directory and replace the data or string in it (based on [underscore's template](https://underscorejs.org/#template)). The directory can have contents. Like cp -r.

- `options` `<Object>`
  - `src` `<String>` Note that if `src` is a directory it will copy everything inside of this directory, not the entire directory.
  - `dest` `<String>` Note that if `src` is a file, `dest` cannot be a directory.
  - `data` `<Object>` Data to replace the [underscore](https://underscorejs.org/#template)'s template pattern
  - `ignore` `<Array<String>>` files or dir to ignore (in glob pattern)
  - `stringReplace` `<Array<{ Regex, String }[]>>` replace the regex with string
  - `templateSettings` `<Object>` Pass your custom `interpolate`, `escape` and `evaluate` config into  [underscore's template](https://underscorejs.org/#template)
- `callback` `<Function>` Callback function (if error throws it will pass the error param)
**Note: default templateSettings is:**
```javascript
const defaultTemplateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g,
};
```

## Example:

```javascript
const fs = require('lub-fs')

// Async with promises:
  fs.copyTpl({
    src: 'src',
    dest: 'dest',
    data: { name: 'lub-fs' },
  })
  .then(() => console.log('success!'))
  .catch(err => console.error(err))

// Async with callbacks:
fs.copyTpl({
    src: 'src',
    dest: 'dest',
    data: { name: 'lub-fs' },
}, err => {
  if (err) return console.error(err)
  console.log('success!')
})

// Async/Await:
async function copyTpl () {
  try {
    await fs.copyTpl({
        src: 'src',
        dest: 'dest',
        data: { name: 'lub-fs' },
    })
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

copyTpl()
```
