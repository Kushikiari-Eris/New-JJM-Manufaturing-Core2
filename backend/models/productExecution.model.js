import mongoose from "mongoose";

const productExecutionSchema = new mongoose.Schema({
  workOrderId: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
  productName: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  material: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const ProductExecution = mongoose.model(
  "ProductExecution",
  productExecutionSchema
);

export default ProductExecution;
