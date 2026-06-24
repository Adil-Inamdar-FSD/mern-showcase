
const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    matchedMedicines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],

    status: {
      type: String,
      enum: ["pending", "reviewed", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);