import Schedule from "../models/schedule.model.js";
import { generateSchedule } from "../middleware/geminiservice.js";

export const createSchedule = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // ✅ Debugging step

    const { userId, taskName, deadline, priority } = req.body;

    let { scheduledTime, reasoning } = await generateSchedule(
      taskName,
      deadline,
      priority
    );

    console.log("AI Suggested Time (Raw):", scheduledTime); // Debugging

    // Ensure scheduledTime is in the correct time zone
    scheduledTime = new Date(scheduledTime).toISOString(); // Convert to UTC ISO format

    console.log("Converted Scheduled Time:", scheduledTime); // Debugging

    // Ensure AI's scheduled time does not exceed the deadline
    if (new Date(scheduledTime) > new Date(deadline)) {
      console.warn("AI-generated time exceeds deadline. Adjusting.");
      scheduledTime = new Date(deadline).toISOString();
      reasoning += " Adjusted to meet the exact deadline.";
    }

    const newSchedule = new Schedule({
      userId,
      taskName,
      deadline,
      priority,
      scheduledTime,
      reasoning,
    });

    await newSchedule.save();
    console.log("Saved to Database:", newSchedule); // ✅ Debugging step
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ error: "Failed to schedule task" });
  }
};


export const fetchAll = async (req, res) => {
  try {
    const schedules = await Schedule.find(); // Renamed variable to `schedules`

    res.status(200).json(schedules); // Send the fetched data
  } catch (error) {
    res.status(404).json({ message: "Cannot get Data", error: error.message });
  }
};

export const generateAiSchedule = async (req, res) => {
  try {
    const { taskName, deadline, priority } = req.body;

    const { scheduledTime, reasoning } = await generateSchedule(
      taskName,
      deadline,
      priority
    );

    // Ensure AI's scheduled time does not exceed the deadline
    if (new Date(scheduledTime) > new Date(deadline)) {
      return res.status(400).json({
        error: "AI-generated schedule exceeds the deadline",
      });
    }

    // Return AI's suggested schedule (without saving)
    res.status(200).json({
      taskName,
      deadline,
      priority,
      scheduledTime,
      reasoning,
    });
  } catch (error) {
    console.error("Error generating AI schedule:", error);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
};


