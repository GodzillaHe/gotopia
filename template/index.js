module.exports.compile = (template) => {
  let code = template;
  code = code.replace(/\{\{([^}]+)\}\}/g, function () {
    let key = arguments[1].trim();
    return "${" + key + "}";
  });
  let head = `let str = '';\r\n with(obj){\r\n`;
  head += "str+=`"
  code = code.replace(/<%([^%>]+)?%>/g, function() {
    return "`\r\n" + arguments[1] + "\r\nstr+=`\r\n";
  });

  let tail = "`}\r\n return str;";
  console.log(`==========render============`);
  console.log(head + code + tail);
  return new Function('obj', head + code + tail); //构造一个匿名函数，将字符串转化为函数
}