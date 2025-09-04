const mongoose = require("mongoose");

const OfferPercentageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    offerPercentage:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const OfferPercentageModel = mongoose.model("OfferPercentage", OfferPercentageSchema);
module.exports = OfferPercentageModel;