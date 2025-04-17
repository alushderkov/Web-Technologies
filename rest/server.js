const http = require("http");
const path = require("path");
const productController = require( path.join(__dirname, "controllers", "productController") );

const PORT = process.env.PORT || 5500;

function serverLogic(req, res) {

  if (req.url === "/api/products" && req.method === "GET") {
    productController.getAllProducts(req, res);
  } else

    if( req.url.match(/\/api\/products\/([0-9]+)/) &&
      req.method === "GET" ) {
      const id = req.url.split('/')[3];

      productController.getProduct(req, res, id);

  } else

    if(req.url === "/api/products" && req.method === "POST") {
      productController.createProduct(req, res);
    }

    else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>404</h1>");
    res.end();
  }
}

function isListening() {
  return `The server starting on the port ${PORT}`;
}

const server = http
  .createServer(serverLogic)
  .listen(PORT, isListening);
