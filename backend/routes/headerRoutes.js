const express = require("express");
const {
  createHeader,
  updateHeaderById,
  getAllHeaders,
  getHeaderById,
  deleteHeaderById,
} = require("../controllers/headerController");

const router = express.Router();

router.post("/createHeader", createHeader);
router.patch("/updateHeaderById/:id", updateHeaderById);
router.get("/getAllHeaders", getAllHeaders);
router.get("/getHeaderById/:id", getHeaderById);
router.delete("/deleteHeaderById/:id", deleteHeaderById);

module.exports = router;
