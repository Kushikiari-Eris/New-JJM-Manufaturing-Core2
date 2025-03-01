import mongoose from "mongoose";

const rawMaterialRequestSchema = new mongoose.Schema({
  requestedBy: {
    type: String,
    required: true,
  },
  materials: [
    {
      rawMaterialName: {
        type: String,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const RawMaterialRequest = mongoose.model(
  "RawMaterialRequest",
  rawMaterialRequestSchema
);

export default RawMaterialRequest;
