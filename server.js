const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const csrfProtection = csrf();
const flash = require("connect-flash");
const store = new MongoStore({
  uri: "mongodb://127.0.0.1:27017/shop",
  collection: "sessions",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(csrfProtection);
const { mongoConnect } = require("./utils/database");
const AdminRoutes = require("./routes/Admin");
const ShopRoutes = require("./routes/Shop");
const UserRoutes = require("./routes/User");

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());

//////////////////////////////////////////////
app.use("/admin", AdminRoutes);
app.use("/user", UserRoutes);
app.use("/", ShopRoutes);

mongoConnect(() => {
  app.listen(3001);
});
