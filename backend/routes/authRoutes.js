const express = require("express");
const { register, verifyOtp, login, logout, forgotPassword, resetPassword, manageCustomer, getCustomerById, updateCustomerById, deleteCustomerById } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post('/login', login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Customer Route
router.get("/manageCustomer", manageCustomer);
router.get("/getCustomerById/:id", getCustomerById);
router.patch("/updateCustomerById/:id", updateCustomerById);
router.delete("/deleteCustomerById/:id", deleteCustomerById);

module.exports = router;