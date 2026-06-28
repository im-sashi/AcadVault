const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  // ✅ CHANGED: Replaced "books" array with "items"
  // Each item stores book + quantity
  items: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true,
      },

      // ✅ NEW: Quantity support
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  status: {
    type: String,
    default: "Order Placed",
    enum: [
      "Order Placed",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
  },

  // ✅ NEW: Tracking ID
  trackingId: {
    type: String,
    default: () => `TRK-${Date.now()}`,
  },

  // ✅ NEW: Estimated Delivery
  estimatedDelivery: {
    type: Date,
  },
});

module.exports = mongoose.model("order", orderSchema);