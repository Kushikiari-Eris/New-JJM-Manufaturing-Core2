import mongoose from "mongoose";

const auditLogistic2RequestSchema = new mongoose.Schema(
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

const AuditRequestLogistic2 = mongoose.model("AuditRequestLogistic2", auditLogistic2RequestSchema);

export default AuditRequestLogistic2;
