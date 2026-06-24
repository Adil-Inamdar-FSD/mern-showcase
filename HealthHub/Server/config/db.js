const mongoose = require("mongoose");
require("dotenv").config();
const Url = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    mongoose.connect(Url);
    console.log("Database connected");
  } catch (error) {
    console.log("Failed to connect DataBase", error);
  }
};

module.exports = connectDb;
