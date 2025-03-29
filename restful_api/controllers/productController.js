const path = require("path");
const Product = require( path.join("..", "models", "productModel.js") );
const PostData = require( path.join("..", "getPostData.js") );

function getAllProducts(req, res) {
  let products;
  const promiseOfProducts  = Product.findAllProducts();

  promiseOfProducts.then(
    result => {
      products = result;

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write( JSON.stringify(products) );
      res.end();
    },
    error => console.log(error)
  );
}

function getProduct(req, res, id) {
  let product;
  const promiseCertainProduct  = Product.findById(id);

  promiseCertainProduct.then(
    result => {

      if (result) {
        product = result;

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write( JSON.stringify(product) );
        res.end();

      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.write( JSON.stringify({ message : "The product was not found"}) );
        res.end();
      }
    },
    error => console.log(error)
  );
}

function createProduct(req, res) {
  PostData.getPostData(req)
    .then(body => {
      try {
        const { type, title, desc, color, price } = JSON.parse(body);
        const product = { type, title, desc, color, price };

        const newProduct = Product.createProd(product);

        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(newProduct));
      } catch (parseError) {
        console.log(parseError);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Invalid JSON data" }));
      }
    })
    .catch(error => {
      console.log(error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Error reading request data" }));
    });
}

module.exports = { getAllProducts, getProduct, createProduct };