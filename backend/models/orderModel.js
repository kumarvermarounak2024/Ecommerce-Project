const mongoose = require("mongoose");

// Counter Schema for auto-increment invoice ID
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceId: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        hsnCode: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    image: {
      type: String,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"], // Fixed typo: "comfirmed" to "confirmed"
      default: "processing",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Function to get next invoice ID
async function getNextInvoiceId() {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "invoice_id" }, // Fixed: removed asterisks
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    // Format the invoice ID with leading zeros (e.g., 001, 002, 003)
    return counter.sequence_value.toString().padStart(3, "0");
  } catch (error) {
    throw new Error("Failed to generate invoice ID");
  }
}

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = { OrderModel, getNextInvoiceId, Counter };
