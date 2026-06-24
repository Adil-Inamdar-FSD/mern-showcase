const Product = require("../model/product");

const createProduct = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.category ||
      !req.body.brand ||
      !req.body.price ||
      !req.body.stock
    ) {
      return res.status(400).send({
        message: "All required fields must be filled",
      });
    }
    const product = new Product(req.body);
    const newProduct = await product.save();
    res
      .status(201)
      .send({ message: "Product added successfully", data: newProduct });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while creating product", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
