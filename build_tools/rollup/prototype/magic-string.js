const MagicString = require('magic-string');

const s = new MagicString('export var answer = 1000')
console.log(s.snip(7).toString())

const bundle = new MagicString.Bundle()

bundle.addSource({
  filename: 'foo.js',
  content: new MagicString('var answer = 20')
});

bundle.addSource({
  filename: 'bar.js',
  content: new MagicString('console.log( answer )')
})

console.log(bundle.toString());
var map = bundle.generateMap({
  file: 'bundle.js',
  includeContent: true,
  hires: true,
});

console.log(map)