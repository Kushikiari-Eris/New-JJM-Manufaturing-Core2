import mongoose from "mongoose";

const FinishedProductTransferSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    transferDate: { type: Date, default: Date.now },
    status: {
      type: String,
      default: "Pending",
    },
    receiverWarehouse: {
      type: String,
      enum: ["Logistic 2 Warehouse"],
      default: "Logistic 2 Warehouse",
    },
    receivedBy: {
      type: String, 
    },
    receivedDate: { type: Date, },
    rejectionReason: {
      type: String,
    },
    coreId: {
      type: String, 
    },
  },
  { timestamps: true }
);

const FinishedProductTransfer = mongoose.model(
  "FinishedProductTransfer",
  FinishedProductTransferSchema
);

export default FinishedProductTransfer;
