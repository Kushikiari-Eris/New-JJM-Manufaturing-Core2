import mongoose from "mongoose";

const orderTrackerSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  updatedAt: { type: Date, default: Date.now },
  history: [
    {
      orderStatus: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});


const OrderTracker = mongoose.model("OrderTracker", orderTrackerSchema);

export default OrderTracker;
