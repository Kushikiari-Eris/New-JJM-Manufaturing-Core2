import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema(
  {
    materialName: { type: String },
    quantity: { type: Number },
    unit: { type: String},
  },
  { timestamps: true }
);


const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);

export default RawMaterial;
