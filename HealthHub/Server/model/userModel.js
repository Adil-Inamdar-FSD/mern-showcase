const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },

    image: String,

    // ✅ add these
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    memberSince: { type: String, default: "" },
    joined: { type: String, default: Date.now().toString() },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
