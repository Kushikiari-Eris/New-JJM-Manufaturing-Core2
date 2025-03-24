import mongoose from "mongoose";

const auditHr4RequestSchema = new mongoose.Schema(
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

const AuditRequestHr4 = mongoose.model("AuditRequestHr4", auditHr4RequestSchema);

export default AuditRequestHr4;
