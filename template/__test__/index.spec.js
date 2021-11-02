const { compile } = require('../index');
describe('模版引擎', () => {
  it('{{}} 表达式', () => {
    const output = compile("<b>{{ name }}</b>")({ name: 'tom'});
    expect(output).toBe('<b>tom</b>');
  });

  it('{{}} toUpperCase 表达式', () => {
    const output = compile("<b>{{ name.toUpperCase() }}</b><b>{{ name1.toUpperCase() }}</b>")({ name: 'tom', name1: 'jack' });
    expect(output).toBe('<b>TOM</b><b>JACK</b>');
  });

  it('{{}} 连接符', () => {
    const output = compile("<b>{{ '[' + name + ']' }}</b>")({ name: 'tom' });
    expect(output).toBe('<b>[tom]</b>');
  })

  it('{{}} forEach遍历', () => {
    const output = compile(`<% arr.forEach(function(item) { %>
    <li>{{item}}</li>
<% }) %>`)({arr: ['aaa', 'bbb']});
    expect(output).toBe(
`

    <li>aaa</li>


    <li>bbb</li>

`)
  })

  it("if 表达式", () => {
    const output = compile(`<% if(isShow) { %> <b>{{ name }}</b> <% } %>`)({ isShow:true ,name: "tom" });
    expect(output).toBe(`
 <b>tom</b> 
`);
  });
})

