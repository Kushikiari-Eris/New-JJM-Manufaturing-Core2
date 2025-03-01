import mongoose from "mongoose";

const FinishedProductTransferSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    transferDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Received"],
      default: "Pending",
    },
    sender: {
      type: String,
      required: true,
    },
    receiverWarehouse: {
      type: String,
      enum: ["Logistic 2 Warehouse"],
      default: "Logistic 2 Warehouse",
    },
    receivedBy: {
      type: String,
      default: null,
    },
    receivedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const FinishedProductTransfer = mongoose.model(
  "FinishedProductTransfer",
  FinishedProductTransferSchema
);

export default FinishedProductTransfer;
