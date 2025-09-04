const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  updatePaymentStatus, // New import
  manageOrders,
  getOrderById,
  getUserOrders,
  deleteOrderById,
  dashboard,
} = require("../controllers/orderController");

router.post("/createOrder", createOrder);
router.patch("/updateOrder/:id", updateOrderStatus);
router.patch("/updatePaymentStatus/:id", updatePaymentStatus); // New route for payment status
router.get("/manageOrders", manageOrders);
router.get("/getOrder/:id", getOrderById);
router.get("/getUserOrders/:userId", getUserOrders);
router.delete("/deleteOrder/:id", deleteOrderById);
// Dashboard routes
router.get("/dashboard", dashboard);

module.exports = router;
