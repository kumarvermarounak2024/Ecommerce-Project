const express = require("express");
const { createOffer, updateOfferById, getAllOffer, getOfferById, deleteOfferById } = require("../controllers/offerController");
const router = express.Router();

router.post("/createOffer", createOffer);
router.patch("/updateOfferById/:id", updateOfferById);
router.get('/getAllOffers', getAllOffer);
router.get("/getOfferById/:id", getOfferById);
router.delete("/deleteOfferById/:id", deleteOfferById);

module.exports = router;