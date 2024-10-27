const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ResearchPaper = require('../models/ResearchPaper');

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

    return result.response.text();
}

async function generateResponseFromText(promptText) {
    console.log("Generating response using Google Generative AI.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([
        { text: promptText }
    ]);
    return result.response.text();
}

router.post('/fetch-metadata', async (req, res) => {
    const { filePath } = req.body;
    console.log("Attempting to find metadata.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);

    try {
        if (!filePath) {
            return res.status(400).json({ message: "File path is required" });
        }

        const resolvedFilePath = path.resolve(filePath);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const uploadResponse = await fileManager.uploadFile(resolvedFilePath, {
            mimeType: "application/pdf",
            displayName: "ResearchPaperPDF",
        });

        const prompt = "You must extract the DOI and title from this research article. Ensure the DOI is composed only of numbers and periods. Return them in this simple format: <DOI>/<title>. Do not add any extra output.";
        
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: prompt }
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("Response text:", text);

        const [doi, title] = text.split('/').map(item => item.trim());

        res.json({ 
            doi: doi || "DOI not found", 
            title: title || "Title not found" 
        });
    } catch (error) {
        console.error("Error extracting metadata:", error.message || error);
        res.status(500).json({ message: "Failed to extract metadata", error: error.message });
    }
});

// Modified generate-react-live route with duplicate DOI and title check
router.post('/generate-react-live', async (req, res) => {
    const { filePath, title, doi } = req.body;

    try {
        if (!filePath || !title || !doi) {
            return res.status(400).json({ message: "File path, title, and DOI are required" });
        }

        // Check for existing paper with the same DOI
        const existingPaper = await ResearchPaper.findOne({ doi });
        
        if (existingPaper) {
            // If DOI matches, check if the title also matches
            if (existingPaper.title === title) {
                // If both DOI and title match, return the existing data
                return res.json({ 
                    message: "Paper with this DOI and title already exists", 
                    content: existingPaper.outputString,
                    isExisting: true,
                    paper: existingPaper
                });
            }
            // If only DOI matches but title doesn't, indicate a conflict
            return res.status(409).json({
                message: "DOI already exists with a different title",
                existingTitle: existingPaper.title
            });
        }

        // If no duplicate found, proceed with generation and saving
        const resultJSON = await generateContent(filePath);
        const JSONtoReact = fs.readFileSync(path.join(__dirname, '../Prompts/JSONtoReact.txt'), 'utf8');
        let resultdraft = await generateResponseFromText(resultJSON + JSONtoReact);

        resultdraft = resultdraft.replace(/^```javascript\s*/, '').replace(/\s*```$/, '');

        // Save to MongoDB only if it's a new paper
        const paper = new ResearchPaper({
            title,
            doi,
            outputString: resultdraft
        });
        await paper.save();

        res.json({ 
            message: "JSON generated and saved successfully", 
            content: resultdraft,
            isExisting: false,
            paper
        });
    } catch (error) {
        console.error("Error generating or saving content:", error);
        res.status(500).json({ message: "Failed to generate or save content", error: error.message });
    }
});

router.get('/research-papers', async (req, res) => {
    try {
        const papers = await ResearchPaper.find().sort({ dateAccessed: -1 });
        res.json(papers);
    } catch (error) {
        console.error("Error fetching research papers:", error);
        res.status(500).json({ message: "Failed to fetch research papers", error: error.message });
    }
});

module.exports = router;
