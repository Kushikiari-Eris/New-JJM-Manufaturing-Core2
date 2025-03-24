import mongoose from "mongoose";

const auditCore1RequestSchema = new mongoose.Schema(
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

const AuditRequestCore1 = mongoose.model("AuditRequestCore1", auditCore1RequestSchema);

export default AuditRequestCore1;
