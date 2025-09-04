const SubCategoryModel = require("../models/subCategoryModel");
const CategoryModel = require("../models/categoryModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// CREATE
exports.createSubCategory = async (req, res) => {
    try {
        const { name, description, status, categoryId } = req.body;

        // Validate input
        if (!name || !categoryId) {
            return res.status(400).json({ success: false, message: "Name and categoryId are required." });
        }

        // Check if Category exists
        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        // Check image
        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: "Subcategory image is required." });
        }

        const image = req.files.image;
        const uploadedImage = await uploadImageToCloudinary(image, "subcategories", 600, 600);

        if (!uploadedImage || !uploadedImage.secure_url) {
            return res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
        }

        const subCategory = new SubCategoryModel({
            name,
            description,
            status,
            image: uploadedImage.secure_url,
            category: categoryId,
        });

        await subCategory.save();

        res.status(201).json({ success: true, message: "Subcategory created successfully.", data: subCategory });
    } catch (err) {
        console.error("Error in createSubCategory:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE
exports.updateSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status, categoryId } = req.body;

        const subCategory = await SubCategoryModel.findById(id);
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found." });
        }

        // Optional category update
        if (categoryId) {
            const categoryExists = await CategoryModel.findById(categoryId);
            if (!categoryExists) {
                return res.status(404).json({ success: false, message: "Category not found." });
            }
            subCategory.category = categoryId;
        }

        if (name) subCategory.name = name;
        if (description) subCategory.description = description;
        if (status) subCategory.status = status;

        // Optional image update
        if (req.files && req.files.image) {
            const uploadedImage = await uploadImageToCloudinary(req.files.image, "subcategories", 600, 600);
            if (!uploadedImage || !uploadedImage.secure_url) {
                return res.status(500).json({ success: false, message: "Image upload failed." });
            }
            subCategory.image = uploadedImage.secure_url;
        }

        await subCategory.save();

        res.status(200).json({ success: true, message: "Subcategory updated successfully.", data: subCategory });
    } catch (err) {
        console.error("Error in updateSubCategoryById:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ALL
exports.getAllSubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategoryModel.find()
            .populate("category", "name")
            .sort({ createdAt: -1 });

        const formattedSubCategories = subCategories.map((sub) => ({
            _id: sub._id,
            name: sub.name,
            description: sub.description,
            image: sub.image,
            status: sub.status,
            category: sub.category?._id || null,
            categoryName: sub.category?.name || "Category Deleted",
            createdAt: sub.createdAt,
            updatedAt: sub.updatedAt,
        }));

        res.status(200).json({
            success: true,
            count: formattedSubCategories.length,
            data: formattedSubCategories,
        });
    } catch (err) {
        console.error("Error in getAllSubCategory:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET BY ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SubCategoryModel.findById(id).populate("category", "name");
        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found." });
        }

        res.status(200).json({ success: true, data: subCategory });
    } catch (err) {
        console.error("Error in getSubCategoryById:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE
exports.deleteSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await SubCategoryModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Subcategory not found." });
        }

        res.status(200).json({ success: true, message: "Subcategory deleted successfully." });
    } catch (err) {
        console.error("Error in deleteSubCategoryById:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
