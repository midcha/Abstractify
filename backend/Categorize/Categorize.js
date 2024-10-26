const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function generateContent() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = "Hello";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  }
generateContent();