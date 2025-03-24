import mongoose from "mongoose";

const auditCompletedTasksCore1Schema = new mongoose.Schema({
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

const CompletedTasksCore1 = mongoose.model("CompletedTasksCore1", auditCompletedTasksCore1Schema);
export default CompletedTasksCore1;
