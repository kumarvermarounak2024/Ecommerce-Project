const mongoose = require("mongoose");

const FooterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const FooterModel = mongoose.model("Footer", FooterSchema);
module.exports = FooterModel;