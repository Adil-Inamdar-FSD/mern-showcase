const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["upi", "card"],
      required: true,
    },

    upiId: {
      type: String,
    },

    cardName: {
      type: String,
    },

    cardNumber: {
      type: String,
    },

    expiry: {
      type: String,
    },

    cvv: {
      type: String,
    },
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    name: {
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
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: paymentMethodSchema,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    subtotal: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
