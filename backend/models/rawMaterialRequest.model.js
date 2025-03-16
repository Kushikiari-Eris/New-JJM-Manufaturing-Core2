import mongoose from "mongoose";

const rawMaterialRequestSchema = new mongoose.Schema({
  rawmaterialNumber: { type: String },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  requestStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  requestedBy: {
    type: String,
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  approvalDate: {
    type: Date,
    default: null,
  },
  department: { type: String, required: true },
  approvalId: { type: String },
  material: [
    {
      materialName: String,
      materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
      quantity: Number,
      unit: String,
    },
  ],
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  notes: {
    type: String,
    trim: true,
  },
  coreId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  createdAt: { type: Date, default: Date.now },
});

const RawMaterialRequest = mongoose.model(
  "RawMaterialRequest",
  rawMaterialRequestSchema
);

export default RawMaterialRequest;
