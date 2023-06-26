const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/products/:productId", (req, res) => {
  let loggedIn = req.session.loggedIn || false;
  let productId = req.params.productId;
  Product.findOneProduct(productId).then((product) => {
    res.render("Product-Details", {
      pageTitle: "Product Details Page",
      product: product,
      loggedIn: loggedIn,
    });
  });
});

router.get("/", (req, res) => {
  let loggedIn = req.session.loggedIn || false;
  Product.allProducts().then((products) => {
    res.render("shop", {
      pageTitle: "Shop",
      products: products,
      editing: false,
      loggedIn: loggedIn,
    });
  });
});

module.exports = router;
