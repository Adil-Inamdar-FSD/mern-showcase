const orderModel = require("../model/orderModel");
const placeOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      city,
      address,
      pincode,
      paymentMethod,
      items,
      subtotal,
      tax,
      totalAmount,
    } = req.body;

    if (!name || !phone || !email || !address) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const order = new orderModel({
      name,
      phone,
      email,
      city,
      address,
      pincode,
      paymentMethod,
      items,
      subtotal,
      tax,
      totalAmount,
    });

    const saveOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: saveOrder,
    });
  } catch (error) {
    console.log("Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    return res.status(200).json({
      success: true,
      message: "Orders get successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get order error",
      error: error.message,
    });
  }
};

module.exports = { placeOrder, getOrders };
