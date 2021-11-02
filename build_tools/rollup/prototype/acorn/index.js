const acorn =  require('acorn');

const walk = require('./walk');

const code = `
  import { a } from './foo';
  console.log("Hello" + a);
  console.log("World");
  export const b = 1;
`

let ast = acorn.parse(code, {
  locations: true,
  ranges: true,
  sourceType: 'module',
  ecmaVersion: 7,
});


// 提供代码访问者
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      if (node.type) {
        console.log(padding() + node.type + ' enter');
        indent += 2;
      }
    },
    leave(node) {
      if (node.type) {
        indent -= 2;
        console.log(padding() + node.type+ ' leave');
      }
    },
  });
});