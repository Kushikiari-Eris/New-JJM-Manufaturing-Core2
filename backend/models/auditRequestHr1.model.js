import mongoose from "mongoose";

const auditHr1RequestSchema = new mongoose.Schema(
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

const AuditRequestHr1 = mongoose.model("AuditRequestHr1", auditHr1RequestSchema);

export default AuditRequestHr1;
