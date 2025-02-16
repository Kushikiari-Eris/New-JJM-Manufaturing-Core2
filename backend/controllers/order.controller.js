import Order from "../models/order.model.js";

export const fetchAllOrder = async (req, res) => {
    try {
        const order = await Order.find()
          .populate("user", "email") // Fetch user and include only email
          .populate("products.product", "name image description");
          
        res.json(order)
    } catch (error) {
        console.log("Failed to fetch all orders", error.message)
        res.status(500).json({ message: "Server Error", error: error.message})
    }
}

export const fetchOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
          .populate("user", "email") // Fetch user and include only email
          .populate("products.product", "name image description");
        if(!order) {
            return res.status(404).json({ message: "Order not found"})
        }
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
