import mongoose from "mongoose";

const finishProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String },
  status: {
    type: String,
    enum: ["In Development", "Available", "Discontinued"],
    default: "In Development",
  },
  createdAt: { type: Date, default: Date.now },
});


const FinishProduct = mongoose.model("FinishProduct", finishProductSchema);

export default FinishProduct