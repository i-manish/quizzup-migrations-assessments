const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// to handle collection.ensureIndex is deprecated
mongoose.set("useCreateIndex", true);

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);

// Use the following to debug Mongoose queries.
if (process.env.NODE_ENV == "development") mongoose.set("debug", true);

const connectToDb = (connectedCallback) => {
  // Database Connection checking
  mongoose
    .connect(process.env.LEARNOMETER_MONGO_DB_CONNECTION_URL, options)
    .then(connectedCallback, (err) => {
      logger.error("Can not connect to the database " + err);
    });
};

module.exports = { connectToDb };
