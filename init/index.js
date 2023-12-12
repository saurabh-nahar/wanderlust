const mongoose = require("mongoose");

let initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((d) => ({
    ...d,
    owner: "656b944cee81796d101fe82d",
  }));
  await Listing.insertMany(initData.data);
};

initDb();
