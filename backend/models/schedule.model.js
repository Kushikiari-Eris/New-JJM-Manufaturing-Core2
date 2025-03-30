import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  taskName: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  reasoning: { type: String,},
  scheduledTime: { type: Date }, // AI will generate this
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);

export default Schedule
