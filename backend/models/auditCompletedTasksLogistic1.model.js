import mongoose from "mongoose";

const auditCompletedTasksLogistic1Schema = new mongoose.Schema({
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

const CompletedTasksLogistic1 = mongoose.model("CompletedTasksLogistic1", auditCompletedTasksLogistic1Schema);
export default CompletedTasksLogistic1;
