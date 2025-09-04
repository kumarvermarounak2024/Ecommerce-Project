const CategoryModel = require("../models/categoryModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !description || !status) {
      return res.status(400).json({ success: false, message: "Name, description, and status are required." });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "Category image is required." });
    }

    const image = req.files.image;

    const uploadedImage = await uploadImageToCloudinary(image, "categories", 600, 600);

    if (!uploadedImage || !uploadedImage.secure_url) {
      return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
    }

    const newCategory = new CategoryModel({
      name,
      description,
      status,
      image: uploadedImage.secure_url,
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update Category
exports.updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    // Update image if provided
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadedImage = await uploadImageToCloudinary(image, "categories", 600, 600);

      if (!uploadedImage || !uploadedImage.secure_url) {
        return res.status(500).json({ success: false, message: "Image upload failed." });
      }

      category.image = uploadedImage.secure_url;
    }

    // Update fields
    if (name) category.name = name;
    if (description) category.description = description;
    if (status) category.status = status;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (err) {
    console.error("Error in updateCategoryById:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get All Categories
exports.getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    console.error("Error in getAllCategory:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error("Error in getCategoryById:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Delete Category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CategoryModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (err) {
    console.error("Error in deleteCategoryById:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
