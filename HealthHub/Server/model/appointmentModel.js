const mongoose = require("mongoose");
const appointementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointementSchema);
module.exports = Appointment;
