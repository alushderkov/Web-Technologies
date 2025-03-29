const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

http.createServer( (req, res) => {
  const url = req.url;
  console.log(url);

  res.setHeader("Content-Type", "text/html; charset=utf-8;");

  switch (url) {
    case '/':
      console.log("main page");
      res.write("<h1>Main</h1>");

      break;
    case "/contact":
      console.log("contact page");
      const data =  fs.readFileSync(
        path.join(__dirname, "contact.html"), {encoding: "utf8", flag: "r"}
      )
      res.write(data);

      break;
    default:
      console.log('404');
      res.write('404');
  }
  res.end();

}).listen(PORT);