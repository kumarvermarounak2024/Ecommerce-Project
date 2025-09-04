const OfferPercentageModel = require("../models/offerModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// CREATE
exports.createOffer = async (req, res) => {
  try {
    const { name, description, offerPercentage } = req.body;
    const file = req.files?.image;

    if (!name || !description || !offerPercentage || !file) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const uploadResult = await uploadImageToCloudinary(file, "offerImages");
    
    const newOffer = await OfferPercentageModel.create({
      name,
      description,
      offerPercentage,
      image: uploadResult.secure_url,
    });

    return res.status(201).json({ success: true, data: newOffer });
  } catch (err) {
    console.error("Create Offer Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ALL
exports.getAllOffer = async (req, res) => {
  try {
    const offers = await OfferPercentageModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// READ ONE
exports.getOfferById = async (req, res) => {
  try {
    const offer = await OfferPercentageModel.findById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });

    res.status(200).json({ success: true, data: offer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
exports.updateOfferById = async (req, res) => {
  try {
    const { name, description, offerPercentage } = req.body;
    const file = req.files?.image;

    const existingOffer = await OfferPercentageModel.findById(req.params.id);
    if (!existingOffer) return res.status(404).json({ success: false, message: "Offer not found" });

    let imageUrl = existingOffer.image;
    if (file) {
      const uploadResult = await uploadImageToCloudinary(file, "offerImages");
      imageUrl = uploadResult.secure_url;
    }

    const updatedOffer = await OfferPercentageModel.findByIdAndUpdate(
      req.params.id,
      { name, description, offerPercentage, image: imageUrl },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedOffer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE
exports.deleteOfferById = async (req, res) => {
  try {
    const deleted = await OfferPercentageModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Offer not found" });

    res.status(200).json({ success: true, message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
