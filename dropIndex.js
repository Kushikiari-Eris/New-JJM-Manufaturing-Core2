import mongoose from "mongoose";
import Order from "./backend/models/order.model.js"; // Adjust the path if needed
import dotenv from "dotenv";
dotenv.config();


const dropIndex = async () => {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_CONN); // Update if using a remote database
    console.log("✅ Connected to MongoDB!");

    console.log("📌 Listing current indexes...");
    const indexes = await Order.collection.getIndexes();
    console.log("Existing Indexes:", indexes);

    console.log("🔍 Dropping index 'stripeSessionId_1'...");
    await Order.collection.dropIndex("stripeSessionId_1");

    console.log("✅ Index dropped successfully!");
  } catch (error) {
    console.error("❌ Error dropping index:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB.");
  }
};

dropIndex();
