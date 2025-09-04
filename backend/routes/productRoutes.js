const express = require("express");
const { createProduct, updateProductById, getAllProduct, getProductById, deleteProductById } = require("../controllers/productController");
const router = express.Router();

router.post("/createProduct", createProduct);
router.patch("/updateProductById/:id", updateProductById);
router.get('/getAllProduct', getAllProduct);
router.get("/getProductById/:id", getProductById);
router.delete("/deleteProductById/:id", deleteProductById);

module.exports = router;