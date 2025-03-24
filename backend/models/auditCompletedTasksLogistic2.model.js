import mongoose from "mongoose";

const auditCompletedTasksLogistic2Schema = new mongoose.Schema({
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

const CompletedTasksLogistic2 = mongoose.model("CompletedTasksLogistic2", auditCompletedTasksLogistic2Schema);
export default CompletedTasksLogistic2;
