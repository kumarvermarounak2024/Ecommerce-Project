const HeaderModel = require("../models/headerModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// CREATE Header
exports.createHeader = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.files?.image;

    if (!name || !description || !file) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const uploadResult = await uploadImageToCloudinary(file, "headerImages");

    const newHeader = await HeaderModel.create({
      name,
      description,
      image: uploadResult.secure_url,
    });

    res.status(201).json({ success: true, data: newHeader });
  } catch (error) {
    console.error("Header create error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET All
exports.getAllHeaders = async (req, res) => {
  try {
    const headers = await HeaderModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: headers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET by ID
exports.getHeaderById = async (req, res) => {
  try {
    const header = await HeaderModel.findById(req.params.id);
    if (!header) return res.status(404).json({ success: false, message: "Header not found" });
    res.status(200).json({ success: true, data: header });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
exports.updateHeaderById = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.files?.image;

    const header = await HeaderModel.findById(req.params.id);
    if (!header) return res.status(404).json({ success: false, message: "Header not found" });

    let imageUrl = header.image;
    if (file) {
      const uploadResult = await uploadImageToCloudinary(file, "headerImages");
      imageUrl = uploadResult.secure_url;
    }

    const updated = await HeaderModel.findByIdAndUpdate(
      req.params.id,
      { name, description, image: imageUrl },
      { new: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE
exports.deleteHeaderById = async (req, res) => {
  try {
    const deleted = await HeaderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Header not found" });

    res.status(200).json({ success: true, message: "Header deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
