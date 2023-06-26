const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const routeProtection = require("../utils/routeProtection").routeProtection;

router.get("/add-product", routeProtection, (req, res) => {
  let loggedIn = req.session.loggedIn || false;
  res.render("Add-Product", {
    pageTitle: "Add Product Page",
    editing: false,
    loggedIn: loggedIn,
  });
});

router.get("/edit-products", routeProtection, (req, res) => {
  let loggedIn = req.session.loggedIn || false;
  Product.allProducts().then((products) => {
    res.render("shop", {
      pageTitle: "Shop",
      products: products,
      editing: true,
      loggedIn: loggedIn,
    });
  });
});

router.get("/edit-product/:productId", routeProtection, (req, res) => {
  const productId = req.params.productId;
  let loggedIn = req.session.loggedIn || false;
  Product.findOneProduct(productId).then((product) => {
    res.render("Add-Product", {
      pageTitle: "Product Edit Page",
      product: product,
      editing: true,
      loggedIn: loggedIn,
    });
  });
});

router.get("/delete-product/:productId", routeProtection, (req, res) => {
  const productId = req.params.productId;
  Product.deleteOneProduct(productId).then(() => {
    res.redirect("/");
  });
});

router.post("/edit-product/:productId", routeProtection, (req, res) => {
  const productId = req.params.productId;
  const { title, description, price, imgUrl } = req.body;
  Product.updateOneProduct(productId, title, description, price, imgUrl).then(
    () => {
      res.redirect("/");
    }
  );
});

router.post("/add-product", routeProtection, (req, res) => {
  const { title, description, price, imgUrl } = req.body;
  const p = new Product(title, description, price, imgUrl);
  p.save();
  res.redirect("/");
});

module.exports = router;
