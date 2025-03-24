import mongoose from "mongoose";

const auditHr2RequestSchema = new mongoose.Schema(
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

const AuditRequestHr2 = mongoose.model("AuditRequestHr2", auditHr2RequestSchema);

export default AuditRequestHr2;
