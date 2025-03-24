import mongoose from "mongoose";

const auditCompletedTasksHr3Schema = new mongoose.Schema({
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

const CompletedTasksHR3 = mongoose.model("CompletedTasksHR3", auditCompletedTasksHr3Schema);
export default CompletedTasksHR3;
