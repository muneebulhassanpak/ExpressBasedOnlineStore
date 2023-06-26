const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const routeProtection = require("../utils/routeProtection").routeProtection;

const mailTransporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key:
        "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",
    },
  })
);

let emailAddress = "";
router.get("/signup", (req, res) => {
  const status = req.query.status;
  const loggedIn = req.session.loggedIn || false;
  res.render("Signup", {
    pageTitle: "Signup page",
    status: status,
    loggedIn: loggedIn,
    errorMessage: false,
  });
});

router.post("/signup", (req, res) => {
  const { fullname, username, email, password } = req.body;
  const u = new User(fullname, username, email, password);
  u.save().then(() => {
    mailTransporter.sendMail({
      to: email,
      from: "muneebulhassan122@gmail.com",
      subject: "Sucessful signup",
      html: " <h1>Sign up successful</h1>",
    });
    res.redirect("/user/login/?status=in");
  });
});

router.get("/login", (req, res) => {
  const status = req.query.status;
  const loggedIn = req.session.loggedIn || false;
  res.render("Signup", {
    pageTitle: "Login page",
    status: status,
    loggedIn: loggedIn,
    errorMessage: req.flash("error"),
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOneUser(email, password).then((result) => {
    if (result) {
      const userId = result._id;
      req.session.loggedIn = true;
      req.session.uid = userId;
      res.redirect("/");
    } else {
      req.flash("error", "Invalid username or password");
      res.redirect("/user/login/?status=in");
    }
  });
});

router.get("/password-reset/newpass", (req, res) => {
  const status = req.query.status || "np"; // Set default status value if not provided
  const loggedIn = req.session.loggedIn || false;
  res.render("Signup", {
    pageTitle: "New Password",
    status: status,
    loggedIn: loggedIn,
  });
});

router.post("/password-reset/newpass", (req, res) => {
  const { password } = req.body;
  User.updateUserPassword(emailAddress, password)
    .then(() => {
      res.redirect("/user/login/?status=in");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/password-reset", (req, res) => {
  //1
  const status = req.query.status;
  const loggedIn = req.session.loggedIn || false;
  res.render("Signup", {
    pageTitle: "Login page",
    status: status,
    loggedIn: loggedIn,
  });
});

router.post("/password-reset", (req, res) => {
  const { email } = req.body;
  emailAddress = email;
  User.findUserByEmail(email).then((result) => {
    if (result) {
      res.redirect("/user/password-reset/newpass/?status=np");
    } else {
      res.redirect("/user/login/?status=in");
    }
  });
});

router.get("/cart/add/:productId", routeProtection, (req, res) => {
  const id = req.session.uid;
  const prodId = req.params.productId;
  const status = req.query.status;
  User.findById(id).then((result) => {
    if (result) {
      const allCart = result.cart.items;
      const existingItem = allCart.find((item) =>
        item._id.equals(new ObjectId(prodId))
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        allCart.push({ _id: new ObjectId(prodId), quantity: 1 });
      }

      const newCart = {
        items: allCart,
      };

      User.updateCart(id, newCart).then(() => {
        if (!status) {
          res.redirect("/");
        } else {
          res.redirect("/user/cart");
        }
      });
    } else {
      req.flash("error", "Please sign up first");
      res.redirect("/user/signup/?status=up");
    }
  });
});

router.get("/cart/remove/:productId", routeProtection, (req, res) => {
  const id = req.session.uid;
  const prodId = req.params.productId;
  const status = req.query.status;

  User.findById(id).then((result) => {
    if (result) {
      const allCart = result.cart.items;
      const existingItem = allCart.find((item) =>
        item._id.equals(new ObjectId(prodId))
      );

      if (existingItem) {
        existingItem.quantity -= 1;

        // Remove the item from the cart if the quantity becomes zero
        if (existingItem.quantity === 0) {
          const itemIndex = allCart.indexOf(existingItem);
          allCart.splice(itemIndex, 1);
        }
      }

      const newCart = {
        items: allCart,
      };

      User.updateCart(id, newCart).then(() => {
        if (!status) {
          res.redirect("/");
        } else {
          res.redirect("/user/cart");
        }
      });
    } else {
      res.redirect("/user/signup/?status=up");
    }
  });
});

router.get("/cart", routeProtection, async (req, res) => {
  const id = req.session.uid || 100;
  const loggedIn = req.session.loggedIn || false;
  try {
    const user = await User.findById(id);
    if (user) {
      const products = user.cart.items || [];
      const newProducts = [];
      const promises = products.map((item) => Product.findOneProduct(item._id));
      const resolvedProducts = await Promise.all(promises);
      let totalPrice = 0;
      resolvedProducts.forEach((product, index) => {
        newProducts.push({
          _id: products[index]._id,
          title: product.title,
          quantity: products[index].quantity,
          price: product.price,
        });
        totalPrice = totalPrice + products[index].quantity * product.price;
      });

      res.render("Cart", {
        pageTitle: "Cart Page",
        products: newProducts,
        total: totalPrice,
        loggedIn: loggedIn,
      });
    } else {
      res.redirect("/user/login/?status=in");
    }
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    res.redirect("/"); // Redirect to an error page or handle the error as needed
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
