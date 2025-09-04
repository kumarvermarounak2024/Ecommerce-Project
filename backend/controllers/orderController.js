const mongoose = require("mongoose");
const { OrderModel, getNextInvoiceId } = require("../models/orderModel");
const ProductModel = require("../models/productModel");
const UserModel = require("../models/userModel");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createOrder = async (req, res) => {
  try {
    let { userId, items, shippingAddress, paymentMethod } = req.body;

    // Parse if sent via form-data as stringified JSON
    if (typeof items === "string") items = JSON.parse(items);
    if (typeof shippingAddress === "string")
      shippingAddress = JSON.parse(shippingAddress);

    // Validate required fields
    if (
      !userId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format." });
    }

    // Check if user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Validate products and calculate total amount
    let totalAmount = 0;
    const validatedItems = [];

    for (let item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.product}`,
        });
      }

      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (!product.hsnCode) {
        return res.status(400).json({
          success: false,
          message: `HSN Code missing for product: ${item.product}`,
        });
      }

      const quantity = item.quantity || 1;
      const price = product.price;

      totalAmount += price * quantity;

      validatedItems.push({
        product: product._id,
        quantity,
        price,
        hsnCode: product.hsnCode,
      });
    }

    // Check for image in request
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Payment Screenshot image is required.",
      });
    }

    const image = req.files.image;

    // Optional: Validate image type and size
    if (!image.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image type." });
    }

    if (image.size > 2 * 1024 * 1024) {
      return res
        .status(400)
        .json({ success: false, message: "Image too large (max 2MB)." });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadImageToCloudinary(
      image,
      "order",
      600,
      600
    );
    if (!uploadedImage || !uploadedImage.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary.",
      });
    }

    // Generate invoice ID
    const invoiceId = await getNextInvoiceId();

    // Create new order
    const newOrder = new OrderModel({
      user: userId,
      invoiceId,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalAmount,
      image: uploadedImage.secure_url,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);

    // Handle duplicate invoice ID error (should be rare but good to handle)
    if (error.code === 11000 && error.keyPattern?.invoiceId) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique invoice ID. Please try again.",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// UPDATE ORDER STATUS - Modified to handle both order status and payment status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, isDelivered } = req.body;

    const order = await OrderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Update order status if provided
    if (orderStatus) order.orderStatus = orderStatus;
    
    // Update payment status if provided
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    // Update delivery status if provided
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) {
        order.deliveredAt = new Date();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// NEW ENDPOINT: Update Payment Status Only
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !["pending", "paid", "failed"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Valid payment status is required (pending, paid, failed).",
      });
    }

    const order = await OrderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET ALL ORDERS
exports.manageOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    // Count by status
    const totalOrders = orders.length;
    const inProcessOrders = orders.filter(
      (o) => o.status === "processing"
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;
    const disputeOrders = orders.filter(
      (o) => o.status === "dispute" || o.status === "disputed"
    ).length;

    res.status(200).json({
      success: true,
      totalOrders,
      inProcessOrders,
      completedOrders,
      disputeOrders,
      data: orders,
    });
  } catch (error) {
    console.error("Error in manageOrders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id.trim(); // Trim extra whitespace

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID format." });
    }

    const order = await OrderModel.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price hsnCode shippingPrice");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET ORDERS BY USER ID
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format." });
    }

    // Check if user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Find orders for the user
    const orders = await OrderModel.find({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    // Get order statistics for the user
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "pending"
    ).length;
    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === "delivered"
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.orderStatus === "cancelled"
    ).length;

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully.",
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      data: orders,
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// DELETE ORDER
exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await OrderModel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteOrderById:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenueData,
      pendingOrders,
      confirmedOrders,
      packagingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      failedDeliveries,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      UserModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      OrderModel.countDocuments({ orderStatus: "pending" }),
      OrderModel.countDocuments({ orderStatus: "confirmed" }),
      OrderModel.countDocuments({ orderStatus: "packaging" }),
      OrderModel.countDocuments({ orderStatus: "out_for_delivery" }),
      OrderModel.countDocuments({ orderStatus: "delivered" }),
      OrderModel.countDocuments({ orderStatus: "cancelled" }),
      OrderModel.countDocuments({ orderStatus: "returned" }),
      OrderModel.countDocuments({ orderStatus: "failed_delivery" }),
    ]);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalCustomers: totalUsers,
        totalRevenue,
        pendingOrders,
        confirmedOrders,
        packagingOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        failedDeliveries,
      },
    });
  } catch (error) {
    console.error("Error in dashboard:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
