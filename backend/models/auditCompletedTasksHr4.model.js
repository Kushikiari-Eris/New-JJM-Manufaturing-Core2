import mongoose from "mongoose";

const auditCompletedTasksHr4Schema = new mongoose.Schema({
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

const CompletedTasksHR4 = mongoose.model("CompletedTasksHR4", auditCompletedTasksHr4Schema);
export default CompletedTasksHR4;
