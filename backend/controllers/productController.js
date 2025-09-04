const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../models/subCategoryModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      hsnCode,
      category,
      subCategory,
      stock,
      status,
      shippingPrice,
    } = req.body;

    // Validation
    if (
      !name ||
      !description ||
      !price ||
      !shippingPrice ||
      !hsnCode ||
      !category ||
      !subCategory
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Check category and subcategory existence
    const categoryExists = await CategoryModel.findById(category);
    const subCategoryExists = await SubCategoryModel.findById(subCategory);
    if (!categoryExists || !subCategoryExists) {
      return res.status(404).json({ success: false, message: "Invalid category or subcategory." });
    }

    // Check image(s)
    if (!req.files || !req.files.images) {
      return res.status(400).json({ success: false, message: "At least one product image is required." });
    }

    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const imageUrls = [];

    for (let img of images) {
      const uploaded = await uploadImageToCloudinary(img, "products", 800, 800);
      if (uploaded?.secure_url) imageUrls.push(uploaded.secure_url);
    }

    const product = new ProductModel({
      name,
      description,
      price,
      shippingPrice,
      hsnCode,
      category,
      subCategory,
      stock: stock || 0,
      status: status || "active",
      images: imageUrls,
    });

    await product.save();

    res.status(201).json({ success: true, message: "Product created successfully.", data: product });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update Product
exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price,shippingPrice, hsnCode, category, subCategory, stock, status } = req.body;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Optional updates
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (shippingPrice) product.shippingPrice = shippingPrice;
    if (hsnCode) product.hsnCode = hsnCode;
    if (category) {
      const catExists = await CategoryModel.findById(category);
      if (!catExists) return res.status(400).json({ message: "Invalid category ID" });
      product.category = category;
    }
    if (subCategory) {
      const subExists = await SubCategoryModel.findById(subCategory);
      if (!subExists) return res.status(400).json({ message: "Invalid subcategory ID" });
      product.subCategory = subCategory;
    }
    if (stock) product.stock = stock;
    if (status) product.status = status;

    // Handle new images
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const uploadedImages = [];

      for (let img of images) {
        const uploaded = await uploadImageToCloudinary(img, "products", 800, 800);
        if (uploaded?.secure_url) uploadedImages.push(uploaded.secure_url);
      }

      product.images = uploadedImages;
    }

    await product.save();
    res.status(200).json({ success: true, message: "Product updated successfully.", data: product });
  } catch (error) {
    console.error("Error in updateProductById:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get All Products
exports.getAllProduct = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error("Error in getAllProduct:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Delete Product
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error in deleteProductById:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
