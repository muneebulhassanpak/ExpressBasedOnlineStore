exports.routeProtection = (req, res, next) => {
  let loggedIn = req.session.loggedIn || false;
  if (loggedIn) {
    next();
  } else {
    res.redirect("/");
  }
};
