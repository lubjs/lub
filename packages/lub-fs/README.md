# lub-fs

This package provides you with several useful file-system functions to help create your boilerplate.

It wraps [fs-extra](https://github.com/jprichardson/node-fs-extra) and its own functions and [fs-extra](https://github.com/jprichardson/node-fs-extra) wraps node's fs lib.

---

## Install
```bash
npm install lub-fs --save
```

## Usage

### Sync vs Async vs Async/Await

Most methods are async by default. All async methods will return a promise if the callback isn't passed.

Sync methods on the other hand will throw if an error occurs.

Also Async/Await will throw an error if one occurs.

Example:

```js
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

## fs-extra wrapped
You can use any method [fs-extra](https://github.com/jprichardson/node-fs-extra) support.
```javascript
const fs = require('fs-extra);

const data = { name: 'lub-js' };

fs.writeJsonSync('packgage.json',data);

```

## Methods

### Async

- [copyTpl](docs/copyTpl.md)

### Sync

- [copyTplSync](docs/copyTpl-sync.md)

## PR Welcome

PRs are welcomed if you have useful file-system function when creating your boilerplate