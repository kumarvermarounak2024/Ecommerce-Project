const express = require("express");
const { createCategory, updateCategoryById, getAllCategory, getCategoryById, deleteCategoryById } = require("../controllers/categoryController");
const router = express.Router();

router.post("/createCategory", createCategory);
router.patch("/updateCategoryById/:id", updateCategoryById);
router.get('/getAllCategory', getAllCategory);
router.get("/getCategoryById/:id", getCategoryById);
router.delete("/deleteCategoryById/:id", deleteCategoryById);

module.exports = router;