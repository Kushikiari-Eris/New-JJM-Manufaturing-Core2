import mongoose from "mongoose";

const auditLogistic1RequestSchema = new mongoose.Schema(
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

const AuditRequestLogistic1 = mongoose.model("AuditRequestLogistic1", auditLogistic1RequestSchema);

export default AuditRequestLogistic1;
