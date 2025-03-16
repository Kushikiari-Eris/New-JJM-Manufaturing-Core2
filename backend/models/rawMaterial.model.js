import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema(
  {
    materialName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { timestamps: true }
);


const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);

export default RawMaterial;
