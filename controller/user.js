const User = require("../models/user");

module.exports.signupController = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const registeredUser = await User.register({ email, username }, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", `${username} Welcome to Wanderlust`);
        res.redirect("/listings");
      }
    });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginController = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirect = res.locals.redirectUrl || "/listings";
  res.redirect(redirect);
};

module.exports.logoutController = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Logged out successfully");
      res.redirect("/listings");
    }
  });
};
