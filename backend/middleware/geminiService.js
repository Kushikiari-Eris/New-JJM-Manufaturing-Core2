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






