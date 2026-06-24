const express = require("express");
const {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const router = express.Router();
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);


module.exports = router;
