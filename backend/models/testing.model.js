import mongoose from "mongoose";

const testingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  priority: { type: Number, default: 1 }, // 1 = High, 2 = Medium, 3 = Low
  assignedTo: { type: String, required: false }, // Worker ID
  createdAt: { type: Date, default: Date.now },
});


const Testing = mongoose.model("Testing", testingSchema);

export default Testing