import mongoose from "mongoose";

const productExecutionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    dueDate: { type: Date, required: true },
    productName: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    assignedTo: {
      type: String,
      enum: ["Machine A", "Machine B", "Machine C", "Machine D"],
      required: true,
    },
    materials: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RawMaterial", // ✅ Now references the RawMaterial collection
          required: true,
        },
        materialName: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const ProductExecution = mongoose.model(
  "ProductExecution",
  productExecutionSchema
);

export default ProductExecution;




