const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { valReview, isLoggedIn, isOwner } = require("../middleware.js");
const {
  saveReviewController,
  deleteReviewcontroller,
} = require("../controller/review");

// Review route
router.post("/", isLoggedIn, valReview, wrapAsync(saveReviewController));

//Delete Review Route
router.delete("/:reviewId", isOwner, wrapAsync(deleteReviewcontroller));

module.exports = router;
