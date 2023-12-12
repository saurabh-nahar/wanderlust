const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.saveReviewController = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(req.params.id);
  let review = await new Review(req.body.review);
  review.author = req.user._id;

  listing.reviews.push(review);

  await review.save();
  await listing.save();
  req.flash("success", "Thanks for sharing your experience!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReviewcontroller = async (req, res) => {
  let { id, reviewId } = req.params;

  let result = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
