import RawMaterial from "../models/rawMaterial.model.js";
import mongoose from "mongoose";
// Get all raw materials


// Create new raw material
export const createRawMaterial = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { materialName, quantity, unit } = req.body;

    if (!materialName || !quantity || !unit) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Check if the material already exists
    let existingMaterial = await RawMaterial.findOne({ materialName });

    if (existingMaterial) {
      // ✅ If material exists, update quantity
      existingMaterial.quantity += quantity;
      await existingMaterial.save();
      console.log(
        `✅ Updated existing material: ${materialName} (New Quantity: ${existingMaterial.quantity})`
      );
      return res.status(200).json(existingMaterial);
    }

    // ✅ If material does not exist, create a new one
    const newMaterial = new RawMaterial({
      materialName,
      quantity,
      unit,
    });

    await newMaterial.save();
    console.log(`✅ New material added: ${materialName}`);
    return res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const decrementRawMaterialStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    if (!id || !quantity) {
      return res.status(400).json({ error: "Missing id or quantity" });
    }

    // Fetch the raw material first
    const material = await RawMaterial.findById(id);
    if (!material) {
      return res.status(404).json({ error: "Raw material not found" });
    }

    // Prevent negative stock values
    if (material.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    // Decrement stock
    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      { $inc: { quantity: -quantity } },
      { new: true } // Return updated document
    );

    // Periodically send low stock notification every 5 seconds
    setInterval(async () => {
      try {
        const allMaterials = await RawMaterial.find(); // Fetch all materials
        allMaterials.forEach((material) => {
          if (material.quantity <= 5) {
            sendLowStockNotification(req.io, material); // Send notification if stock is low
          }
        });
      } catch (error) {
        console.error("❌ Error checking stock:", error);
      }
    }, 5000); 

    
    console.log(`✅ Raw material ${id} stock decremented successfully.`);
    res.json(updatedMaterial);
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// Delete raw material
export const deleteRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await RawMaterial.findByIdAndDelete(id);
    res.status(200).json({ message: "Raw material deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting raw material" });
  }
};


export const sendLowStockNotification = async (io, material) => {
  try {
    if (material.quantity <= 5) {
      console.log(
        `⚠️ LOW STOCK ALERT: Emitting WebSocket event for "${material.materialName}" (Only ${material.quantity} left).`
      );

      io.emit("lowStockNotification", {
        materialName: material.materialName,
        quantity: material.quantity,
        message: `Low stock alert: "${material.materialName}" has only ${material.quantity} left!`,
        timestamp: new Date().toISOString(),
      });

      console.log("✅ WebSocket Event Emitted: lowStockNotification");
    }
  } catch (error) {
    console.error("❌ Error sending low stock notification:", error);
  }
};


export const getRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find();

        setInterval(async () => {
          try {
            const allMaterials = await RawMaterial.find(); // Fetch all materials
            allMaterials.forEach((material) => {
              if (material.quantity <= 5) {
                sendLowStockNotification(req.io, material); // Send notification if stock is low
              }
            });
          } catch (error) {
            console.error("❌ Error checking stock:", error);
          }
        }, 5000); 

    res.status(200).json(rawMaterials);
  } catch (error) {
    res.status(500).json({ error: "Error fetching raw materials" });
  }
};

// Update material quantity if it exists
// ✅ Increment material quantity
export const incrementRawMaterialStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id || !quantity) {
      return res.status(400).json({ error: "Missing id or quantity" });
    }

    // ✅ Find material and update quantity
    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      { $inc: { quantity } },
      { new: true } // Return updated document
    );

    if (!updatedMaterial) {
      return res.status(404).json({ error: "Material not found" });
    }

    console.log(`✅ Material ${id} stock updated successfully.`);
    res.json(updatedMaterial);
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





