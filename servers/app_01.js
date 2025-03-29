const http = require('http'); // нет типов данных - http работает со строками

// localhost:3000 Всё, что в браузере будет введено сюда, попадёт в req
// request, response
http.createServer((req, res) => {
  console.log('server work');
  res.end('1'); // Сервер заканчивает обработку запроса и отсылает что-то в ответ
}).listen(3500);