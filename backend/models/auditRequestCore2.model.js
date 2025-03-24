import mongoose from "mongoose";

const auditCore2RequestSchema = new mongoose.Schema(
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

const AuditRequestCore2 = mongoose.model("AuditRequestCore2", auditCore2RequestSchema);

export default AuditRequestCore2;
