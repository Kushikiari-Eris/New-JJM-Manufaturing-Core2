import mongoose from "mongoose";

// Schema for individual data points
const DataPointSchema = new mongoose.Schema(
  {
    features: {
      type: [Number],
      required: true,
    },
    label: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Schema for trained models
const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    coefficients: [Number],
    intercept: Number,
    featureCount: Number,
    accuracy: Number,
    predictionType: { type: String },
    featureConfig: { type: Object },
  },
  { timestamps: true } // handles createdAt and updatedAt automatically
);

// Define models
const DataPoint = mongoose.model("DataPoint", DataPointSchema);
const Model = mongoose.model("Model", ModelSchema); 

// Named exports preferred
export { DataPoint, Model };
