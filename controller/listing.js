const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};

module.exports.getEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById({ _id: id });
  if (!listing) {
    req.flash("error", "listing you requested for doesn't exist!");
    res.redirect("/listings");
  }
  let replacedUrl = listing.image.url;
  replacedUrl = replacedUrl.replace("/upload", "/upload/h_250,w_250,c_fill");

  res.render("listings/edit", { listing, replacedUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.path.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing edited and saved successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.getAllListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.path.filename;
  let { title, description, image, price, location, country } =
    req.body.listing;
  const cordinates = await geocodingClient
    .forwardGeocode({
      query: `${location}, ${country}`,
      limit: 1,
    })
    .send();
  let newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = cordinates.body.features[0].geometry;
  const savedListing = await newListing.save();
  req.flash("success", "Listing saved successfully");
  res.redirect("/listings");
};

module.exports.getListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById({ _id: id })
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you requested for doesn't exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};
