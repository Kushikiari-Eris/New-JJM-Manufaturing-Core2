import Order from "../models/order.model.js";

export const fetchAllOrder = async (req, res) => {
  try {
    // Ensure req.user exists (you need authentication middleware)
    const userId = req.user?._id;
    const userRole = req.user?.role; // Assuming role is stored in user object

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let orders;
    if (userRole === "admin" || userRole === "superadmin") {
      // Admin can fetch all orders
      orders = await Order.find()
        .populate("user", "email name")
        .populate("products.product", "name image description");
    } else {
      // Regular users can only fetch their own orders
      orders = await Order.find({ user: userId })
        .populate("user", "email")
        .populate("products.product", "name image description");
    }

    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const fetchOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
          .populate("user", "email name") // Fetch user and include only email
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
      "Canceled",
      "Refunded"
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
