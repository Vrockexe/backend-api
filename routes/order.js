const express = require("express");
const { auth } = require("../middleware/auth"); 
const Order = require("../models/order_model");

const orderRouter = express.Router();

// Create Order
orderRouter.post("/api/orders", auth, async (req, res) => {
  try {
    const data = req.body;
    console.log("Order Request Received:", data);

    const requiredFields = [
      "name", "email", "state", "city", "locality",
      "productName", "productPrice", "quantity",
      "category", "image", "buyerId", "vendorId",
      "paymentStatus", "paymentMethod"
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const validStatuses = ['pending', 'succeeded', 'failed'];
    const validMethods = ['cod', 'card'];

    if (!validStatuses.includes(data.paymentStatus)) {
      return res.status(400).json({ error: `Invalid paymentStatus: ${data.paymentStatus}` });
    }

    if (!validMethods.includes(data.paymentMethod)) {
      return res.status(400).json({ error: `Invalid paymentMethod: ${data.paymentMethod}` });
    }

    const order = new Order({ ...data });

    const savedOrder = await order.save();
    console.log("Order Saved:", savedOrder._id);

    res.status(201).json(savedOrder);
  } catch (e) {
    console.error("Order Creation Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});


// Get All Orders
orderRouter.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json([]);
    }
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete Order by ID
orderRouter.delete("/api/orders/:id", auth, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
orderRouter.get("/api/orders/vendors/:vendorId", auth, async (req, res) => {
  try {
    console.log("HIT: /api/orders/vendors/:vendorId");
    console.log("Vendor ID:", req.params.vendorId);

    const { vendorId } = req.params;
    const orders = await Order.find({ vendorId: vendorId.toString() });

    if (!orders || orders.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(orders);
  } catch (e) {
    console.error("ERROR fetching vendor orders:", e.message);
    res.status(500).json({ error: e.message });
  }
});
orderRouter.patch('/api/orders/:id/delivered', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        delivered: true,
        processing: false,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Delivery update error:", error.message);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});
module.exports = orderRouter;
