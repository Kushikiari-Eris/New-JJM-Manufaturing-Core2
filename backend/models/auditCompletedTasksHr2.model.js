import mongoose from "mongoose";

const auditCompletedTasksHr2Schema = new mongoose.Schema({
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

const CompletedTasksHR2 = mongoose.model("CompletedTasksHR2", auditCompletedTasksHr2Schema);
export default CompletedTasksHR2;
