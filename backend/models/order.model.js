import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
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
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    subTotal: {
      type: String,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0, // Default discount to 0 if no coupon is used
      min: 0,
    },
    stripeSessionId: {
      type: String,
      default: null, // Allow it to be null
      sparse: true, // Prevents uniqueness issues with multiple null values
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    shippingMethod: {
      type: String,
    },
    shippingAddress: {
      name: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Canceled", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
