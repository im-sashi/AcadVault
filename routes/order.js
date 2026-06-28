const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const book = require("../models/book");
const Order = require("../models/order");

// place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    // ✅ NEW: Convert cart books into items array
    const items = order.map((item) => ({
      book: item._id,
      quantity: item.quantity || 1,
    }));

    // ✅ CHANGED: Create ONE order containing multiple books
    const newOrder = await Order.create({
      user: id,
      items,
    });

    await User.findByIdAndUpdate(id, {
      $push: { orders: newOrder._id },

      // ✅ CHANGED: Remove all ordered books from cart at once
      $pull: {
        cart: {
          $in: order.map((item) => item._id),
        },
      },
    });

    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
} catch (error) {
  console.log("PLACE ORDER ERROR:");
  console.log(error);

  return res.status(500).json({
    message: error.message,
  });
}
});

// get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id).populate({
      path: "orders",

      // ✅ CHANGED: Populate items.book instead of book
      populate: {
        path: "items.book",
      },

      // ✅ NEW: Latest orders first
      options: {
        sort: { createdAt: -1 },
      },
    });

    return res.json({
      status: "Success",
      data: userData.orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//get all orders --admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find()

      // ✅ CHANGED: Populate user details
      .populate("user")

      // ✅ CHANGED: Populate books from items array
      .populate("items.book")

      // ✅ NEW: Show newest orders first
      .sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// update order --admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndUpdate(id, {
      status: req.body.status,
    });

    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
