const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser') // AST语法树
const traverse = require('@babel/traverse').default // 
const babel = require('@babel/core')

// 分析单个模块
function getModuleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, 'utf-8')
  // 转换为抽象语法树AST
  const ast = parser.parse(body, {
    sourceType: 'module'
  })
  //console.log('ast', ast)

  //收集依赖
  const deps = {}
  traverse(ast, {
    // visitor
    ImportDeclaration({node}) {
      const dirname = path.dirname(file)
      const abspath = './' + path.join(dirname, node.source.value)
      deps[node.source.value] = abspath;
    }
  })

  // es6转换为es5
  const {code} = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"] 
  })

  const moduleInfo = {
    file,
    deps,
    code
  }

  return moduleInfo
}

function parseModules(file) { //解析依赖 
  const entry = getModuleInfo(file);
  const temp = [entry];
  const depsGraph = {};

  getDeps(temp, entry);

  temp.forEach(info => {
    depsGraph[info.file] = {
      deps: info.deps,
      code: info.code
    }
  });
  return depsGraph;
}


function getDeps(temp, {deps}) { // 遍历所有依赖
  Object.keys(deps).forEach(key => {
    const child = getModuleInfo(deps[key])
    temp.push(child)
    getDeps(temp, child)
  })
}

function bundle(file) {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
          function require(file) {
            function absRequire(relPath) {
              return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function  (require, exports, code) {
              eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
          }
          require('${file}')
  })(${depsGraph})`;
}

const content = bundle('./src/index.js')
!fs.existsSync('./dist') && fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js', content); 