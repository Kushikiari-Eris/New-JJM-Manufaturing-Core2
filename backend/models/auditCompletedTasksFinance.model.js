import mongoose from "mongoose";

const auditCompletedTasksFinanceSchema = new mongoose.Schema({
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

const CompletedTasksFinance = mongoose.model("CompletedTasksFinance", auditCompletedTasksFinanceSchema);
export default CompletedTasksFinance;
