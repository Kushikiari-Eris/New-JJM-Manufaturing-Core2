import mongoose from "mongoose";

const auditRawMaterialSchema = new mongoose.Schema({
  rawMaterial: [
    {
      itemName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
  ],
  sender: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  qualityCheck: {
    type: String,
    enum: ["Pending", "Passed", "Failed"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: ["Pending", "Received"],
    default: "Pending",
  },
});


const AuditRawMaterial = mongoose.model("AuditRawMaterial", auditRawMaterialSchema);

export default AuditRawMaterial;
