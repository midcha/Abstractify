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

// Route to generate JSON from uploaded PDF
router.post('/generate-json', async (req, res) => {
    const { filePath } = req.body; // Expecting filePath in the request body

    try {
        if (!filePath) {
            return res.status(400).json({ message: "File path is required" });
        }

        const resultText = await generateContent(filePath);

        // Optionally, write the result to a file
        fs.writeFileSync('./Outputs/result.json', JSON.stringify(resultText, null, 2));
        console.log("Result has been exported to result.json");

        res.json({ message: "Content generated successfully", content: resultText });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
});

module.exports = router;
