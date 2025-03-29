const http = require('http');

function processor(req, res) {
  console.log(req.url);
  console.log(req.method);
  console.log("server work");

  // Отдача сервера в соответствии с заголовками: есть в таблице
  // Можно указать несколько заголовков: если одинаковые, то просто перезапишется
  res.setHeader("Content-Type", "text/html; charset=utf-8;");

  // Так как задан тип html, то при работе сервера будет заполняться html документ
  // Записывает в response
  res.write("<h1>Hello, world</h1>");
  res.write("<p>Hello, world!</p>")

  // Отсылает информацию в response
  res.end();
}

http.createServer(processor)
  .listen(3700);