const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();
const fs = require('fs');

async function generateContent(filePath) {
    console.log("Using Google Generative AI to categorize content.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType: "application/pdf",
        displayName: "ResearchPaperPDF",
    });

    const prompt = fs.readFileSync('./Prompts/getJSON.txt', 'utf8');
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: prompt },
    ]);

    // Return the generated content
    return result.response.text();
}

async function generateResponseFromText(promptText) {
    console.log("Generating response using Google Generative AI.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate content based on the provided prompt text
    const result = await model.generateContent([
        { text: promptText }
    ]);

    // Return the generated response
    return result.response.text();
}


// Route to generate react-live from uploaded PDF
router.post('/generate-react-live', async (req, res) => {
    const { filePath } = req.body; // Expecting filePath in the request body

    try {
        if (!filePath) {
            return res.status(400).json({ message: "File path is required" });
        }

        const resultJSON = await generateContent(filePath);
        const JSONtoReact = fs.readFileSync(path.join(__dirname, '../Prompts/JSONtoReact.txt'), 'utf8');
        const resultdraft = await generateResponseFromText(resultJSON + JSONtoReact);

        res.json({ message: "JSON generated successfully", content: resultdraft });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
});

module.exports = router;