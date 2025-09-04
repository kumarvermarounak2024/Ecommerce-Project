const FooterModel = require("../models/footerModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// CREATE Footer
exports.createFooter = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.files?.image;

    if (!name || !description || !file) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const uploadResult = await uploadImageToCloudinary(file, "footerImages");

    const newFooter = await FooterModel.create({
      name,
      description,
      image: uploadResult.secure_url,
    });

    res.status(201).json({ success: true, data: newFooter });
  } catch (error) {
    console.error("Footer create error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET All
exports.getAllFooters = async (req, res) => {
  try {
    const footers = await FooterModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: footers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET by ID
exports.getFooterById = async (req, res) => {
  try {
    const footer = await FooterModel.findById(req.params.id);
    if (!footer) return res.status(404).json({ success: false, message: "Footer not found" });
    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
exports.updateFooterById = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.files?.image;

    const footer = await FooterModel.findById(req.params.id);
    if (!footer) return res.status(404).json({ success: false, message: "Footer not found" });

    let imageUrl = footer.image;
    if (file) {
      const uploadResult = await uploadImageToCloudinary(file, "footerImages");
      imageUrl = uploadResult.secure_url;
    }

    const updated = await FooterModel.findByIdAndUpdate(
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
exports.deleteFooterById = async (req, res) => {
  try {
    const deleted = await FooterModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Footer not found" });

    res.status(200).json({ success: true, message: "Footer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
