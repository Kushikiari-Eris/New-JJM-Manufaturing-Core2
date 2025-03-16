import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    equipmentName: { type: String, required: true },
    maintenanceType: {
      type: String,
      enum: ["Preventive", "Corrective", "Predictive", "Routine", "Emergency"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Overdue"],
      default: "Scheduled",
    },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    technician: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;