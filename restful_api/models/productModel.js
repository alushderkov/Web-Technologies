const path = require("path");
let products = require( path.join("..", "data", "products.json") );
const { v4 : uuid4 } = require("uuid");
const File = require( path.join("..", "WriteDataToFile.js") );

function findAllProducts() {
  return new Promise(function (resolve, reject) {
      resolve(products);
    });
}

function findById(id) {
  return new Promise(function (resolve, reject) {
      resolve(
        products.find( product => product.id === id )
      );
    });
}

function createProd(product) {
  return new Promise(function (resolve, reject) {
    const newProduct = {id : uuid4(), ...product};

    products.push(newProduct);
    File.writeDataToFile( path.join(__dirname, "..", "data", "products.json"), products );

    resolve(newProduct);
  });
}

module.exports = { findAllProducts, findById, createProd };