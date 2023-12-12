const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Listing = require("./models/listing");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  } else {
    next();
  }
};

module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.valListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.valReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "Unauthorized request");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let listing = await Review.findById(reviewId);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "Unauthorized request");
    return res.redirect(`/listings/${reviewId}`);
  }
  next();
};
