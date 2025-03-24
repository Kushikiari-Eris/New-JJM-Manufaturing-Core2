import mongoose from "mongoose";

const auditFinanceRequestSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    task: { type: [String], required: true },
  },
  { timestamps: true }
);

const AuditRequestFinance = mongoose.model("AuditRequestFinance", auditFinanceRequestSchema);

export default AuditRequestFinance;
