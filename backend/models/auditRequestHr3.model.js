import mongoose from "mongoose";

const auditHr3RequestSchema = new mongoose.Schema(
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

const AuditRequestHr3 = mongoose.model("AuditRequestHr3", auditHr3RequestSchema);

export default AuditRequestHr3;
