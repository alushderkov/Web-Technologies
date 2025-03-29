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
      res.end();

      break;
    case "/contact":
      console.log("contact page");
      const data =  fs.readFileSync(
        path.join(__dirname, 'public', "contact.html"), {encoding: "utf8", flag: "r"}
      )
      res.write(data);
      res.end();

      break;
    default:
      if ( url.includes('/images') ) {

        fs.readFile(
          path.join(__dirname, 'public', url),
          {/*флаги или опции*/},
          (error, data) => {

            if (error) {

            }

            console.log("====== get ======");
            res.setHeader("Content-Type", "image/png");
            res.write(data);
            res.end();
          }
        );

      } else {
        console.log('404');
        res.write('404');
        res.end();
      }
  }

}).listen(PORT);