const Koa = require('koa')
const fs = require('fs')
const app =  new Koa()
const path = require('path');
const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');

app.use(async ctx => {
  const { url, query} = ctx.request
  // console.log("url:" + url, "query type", query.type);
  if (url === '/') { // 首页
    ctx.type = 'text/html'
    let content = fs.readFileSync('./index.html', 'utf-8');
    content = content.replace(`<script`, `
      <script>
        window.process = {env:{ NODE_ENV:'dev'}}
      </script>
      <script 
    `);
    ctx.body = content;
    // 所有以.js结尾的文件
  } else if (url.endsWith('.js')) {
    const p = path.resolve(__dirname, url.slice(1))
    ctx.type = 'application/javascript';
    let content = fs.readFileSync(p, 'utf-8')
    content = rewriteImport(content);
    ctx.body = content;
  } 
  else if (url.startsWith('/@modules/')) {
    // 拼接第三方库的路径， es入口
    // /@modules/vue 
    const prefix = path.resolve(
      __dirname,
      'node_modules',
      url.replace('/@modules/', '')
    )
    const module = require(prefix + '/package.json').module
    const p = path.resolve(prefix, module)
    const ret =  fs.readFileSync(p, 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(ret);
  } 
  else if (url.endsWith(".css")) {
    const p = path.resolve(__dirname, url.slice(1));
    const file = fs.readFileSync(p, "utf-8");
    const content = `
    const css = "${file.replace(/\n/g, "")}"
    let link = document.createElement('style')
    link.setAttribute('type', 'text/css')
    document.head.appendChild(link)
    link.innerHTML = css
    export default css
    `;
    ctx.type = "application/javascript";
    ctx.body = content;
  } else if (url.indexOf(".vue") > -1) {
    // vue单文件组件
    const p = path.resolve(__dirname, url.split("?")[0].slice(1));
    const { descriptor } = compilerSfc.parse(fs.readFileSync(p, "utf-8"));
    if (!query.type) {
      ctx.type = "application/javascript";
      // 借用vue自导的compile框架 解析单文件组件，其实相当于vue-loader做的事情
      ctx.body = `
    ${rewriteImport(descriptor.script.content.replace("export default ", "const __script = "))}
    import { render as __render } from "${url}?type=template"
    import "${url}?type=style"
    __script.render = __render
    export default __script
        `;
      } else if (query.type === "template") {
        // 模板内容
        const template = descriptor.template;
        // 要在server端吧compiler做了
        const render = compilerDom.compile(template.content, { mode: "module" })
          .code;
        ctx.type = "application/javascript";

        ctx.body = rewriteImport(render);
      } else if (query.type === "style") {
        let str = '';
        descriptor.styles.forEach(item => {
          str += item.content;
        });
        const content = `
        const css = "${str.replace(/\n/g, "")}"
        let link = document.createElement('style')
        link.setAttribute('type', 'text/css')
        document.head.appendChild(link)
        link.innerHTML = css
        export default css`
        ctx.type = "application/javascript";
        ctx.body = content;
      }
    }
  })

app.listen(3000, () => {
  console.log('Vite Start at 3000')
});

function rewriteImport(content) {
  // import xx from 'xxx' 把 'xxx' 变成 './'
  return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
    console.log("s", s0, s1);
    // . ../ /开头的，都是相对路径
    if (s1[0] !== "." && s1[1] !== "/") {
      return ` from '/@modules/${s1}'`;
    } else {
      return s0;
    }
  });
}