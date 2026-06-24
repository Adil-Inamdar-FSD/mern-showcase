const express = require("express");
const { placeOrder, getOrders } = require("../controller/orderController");

const router = express.Router();

router.post("/create-order", placeOrder);
router.get("/get-order", getOrders);

module.exports = router;
