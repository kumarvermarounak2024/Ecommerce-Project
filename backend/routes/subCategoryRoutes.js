const express = require("express");
const { createSubCategory, updateSubCategoryById, getAllSubCategory, getSubCategoryById, deleteSubCategoryById } = require("../controllers/subCategoryController");
const router = express.Router();

router.post("/createSubCategory", createSubCategory);
router.patch("/updateSubCategoryById/:id", updateSubCategoryById);
router.get('/getAllSubCategory', getAllSubCategory);
router.get("/getSubCategoryById/:id", getSubCategoryById);
router.delete("/deleteSubCategoryById/:id", deleteSubCategoryById);

module.exports = router;