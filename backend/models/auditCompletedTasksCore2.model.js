import mongoose from "mongoose";

const auditCompletedTasksCore2Schema = new mongoose.Schema({
  department: String,
  description: String,
  task: [String],
  responses: [
    {
      text: String,
      image: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  scheduledDate: Date,
  completedAt: { type: Date, default: Date.now },
});

const CompletedTasksCore2 = mongoose.model("CompletedTasksCore2", auditCompletedTasksCore2Schema);
export default CompletedTasksCore2;
