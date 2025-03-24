import mongoose from "mongoose";

const auditAdminRequestSchema = new mongoose.Schema(
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

const AuditRequestAdmin = mongoose.model("AuditRequestAdmin", auditAdminRequestSchema);

export default AuditRequestAdmin;
