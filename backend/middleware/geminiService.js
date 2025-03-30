// import { GoogleGenerativeAI } from "@google/generative-ai";


// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateResponse = async (prompt) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Error generating response:", error);
//     return "Sorry, I couldn't process your request.";
//   }
// };

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Correct model
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    

    // Check for valid response
    if (!result || !result.response) throw new Error("Invalid API response");

    return result.response.text(); // Correct output
  } catch (error) {
    console.error("❌ Error generating AI response:", error.message);
    return "AI response failed."; // Prevent invalid JSON
  }
};

export const generateSchedule = async (taskName, deadline, priority) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Schedule a task named "${taskName}" with priority "${priority}". 
    The deadline is ${deadline}. The task must be scheduled **at least 3 day before** the deadline, 
    but AI should consider scheduling it up to 5 days earlier if feasible. 
    Ensure the time is between 09:00 and 18:00 for optimal productivity.
    Provide the scheduled time in "YYYY-MM-DD HH:mm" format and reasoning. 
    Example: "2025-04-05 14:30 - Reasoning here."`;


    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text(); // Extract AI response

    console.log("AI Response:", aiResponse); // Debugging log

    // Extract date using regex
    // Extract the AI-generated date using regex
    // Extract the AI-generated date using regex
    const match = aiResponse.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
    let aiGeneratedTime = match
      ? new Date(match[0].replace(" ", "T") + ":00.000Z")
      : null;

    // Ensure correct timezone conversion (Philippines Time)
    const timezoneOffset = 8 * 60 * 60 * 1000; // GMT+8 offset in milliseconds
    if (aiGeneratedTime) {
      aiGeneratedTime = new Date(aiGeneratedTime.getTime() + timezoneOffset);
    }

    // Extract AI reasoning
    const reasoning = match
      ? aiResponse.replace(match[0], "").trim()
      : "No reasoning provided.";

    if (!aiGeneratedTime || isNaN(aiGeneratedTime.getTime())) {
      throw new Error("Invalid AI-generated date format");
    }

    // Ensure AI-scheduled time does not exceed deadline
    const deadlineDate = new Date(deadline);
    if (aiGeneratedTime > deadlineDate) {
      console.warn(
        `AI-generated time (${aiGeneratedTime}) exceeds the deadline (${deadline}). Adjusting.`
      );
      aiGeneratedTime = new Date(deadlineDate.getTime() - timezoneOffset); // Adjust back to deadline
    }

    return { scheduledTime: aiGeneratedTime, reasoning };
  } catch (error) {
    console.error("Error generating AI schedule:", error);
    throw new Error("Failed to generate schedule using AI");
  }
};







