const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, valListing, isOwner } = require("../middleware.js");
const {
  deleteListing,
  getEditListing,
  editListing,
  getAllListings,
  createListing,
  getListing,
} = require("../controller/listing");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//New Listing Route
router
  .route("/new")
  .get(isLoggedIn, (req, res) => {
    res.render("listings/new");
  })
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    valListing,
    wrapAsync(createListing)
  );

//Edit Listing Routes
router
  .route("/:id/edit")
  .get(isOwner, isLoggedIn, wrapAsync(getEditListing))
  .put(
    isOwner,
    isLoggedIn,
    upload.single("listing[image]"),
    valListing,
    wrapAsync(editListing)
  );

//Delete Listing Routes
router
  .route("/:id")
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing))
  .get(wrapAsync(getListing));

//Get All Listings
router.get("/", wrapAsync(getAllListings));

module.exports = router;
