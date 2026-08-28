const mongoose = require("mongoose");

const conn = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to Database");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = conn;
