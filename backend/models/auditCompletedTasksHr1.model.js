import mongoose from "mongoose";

const auditCompletedTasksHr1Schema = new mongoose.Schema({
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

const CompletedTasksHR1 = mongoose.model("CompletedTasksHR1", auditCompletedTasksHr1Schema);
export default CompletedTasksHR1;
