# copyTplSync(options)

Copy a file or directory and replace the data or string in it (based on [underscore's template](https://underscorejs.org/#template)). The directory can have contents. Like cp -r.

- `options` `<Object>`
  - `src` `<String>` Note that if `src` is a directory it will copy everything inside of this directory, not the entire directory.
  - `dest` `<String>` Note that if `src` is a file, `dest` cannot be a directory.
  - `data` `<Object>` Data to replace the [underscore](https://underscorejs.org/#template)'s template pattern
  - `ignore` `<Array<String>>` files or dir to ignore (in glob pattern)
  - `stringReplace` `<Array<{ Regex, String }[]>>` replace the regex with string
  - `templateSettings` `<Object>` Pass your custom `interpolate`, `escape` and `evaluate` config into  [underscore's template](https://underscorejs.org/#template)

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

// Sync:
try {
  fs.copyTplSync({
    src: 'src',
    dest: 'dest',
    data: { name: 'lub-fs' },
  })
  console.log('success!')
} catch (err) {
  console.error(err)
}
```
