import Order from '../models/order.model.js'
import OrderTracker from '../models/orderTracker.model.js'

export const createOrderTracker = async (req, res) => {
  try {
    const { orderId } = req.body;
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newTracker = new OrderTracker({ orderId });
    await newTracker.save();

    res.status(201).json(newTracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    const tracker = await OrderTracker.findOne({ orderId });

    if (!tracker) {
      return res.status(404).json({ message: "Order tracker not found" });
    }

    tracker.orderStatus = orderStatus;
    tracker.history.push({ orderStatus });
    tracker.updatedAt = Date.now();
    await tracker.save();

    res.status(200).json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const tracker = await OrderTracker.findOne({ orderId }).populate("orderId");

    if (!tracker) {
      return res.status(404).json({ message: "Order tracker not found" });
    }

    res.status(200).json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};