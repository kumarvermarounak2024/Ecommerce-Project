const express = require("express");
const {
    createFooter,
    updateFooterById,
    getAllFooters,
    getFooterById,
    deleteFooterById,
} = require("../controllers/footerController");

const router = express.Router();

router.post("/createFooter", createFooter);
router.patch("/updateFooterById/:id", updateFooterById);
router.get("/getAllFooters", getAllFooters);
router.get("/getFooterById/:id", getFooterById);
router.delete("/deleteFooterById/:id", deleteFooterById);

module.exports = router;
