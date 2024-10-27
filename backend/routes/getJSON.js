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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", temperature: 0.4 });
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

        const prompt = `Extract the exact DOI and main title from this academic paper PDF. Follow these precise rules:

1. For DOI:
   - Look for "DOI:", "doi:", or "https://doi.org/" in the text
   - Extract ONLY the numbers and periods (format: XX.XXXX/XXXXX)
   - If multiple DOIs found, use the first one
   - If no DOI found, return "NO_DOI"

2. For TITLE, look for these specific indicators:
   - The title is usually the largest or most prominent text on the first page
   - It appears BEFORE the author names and abstract
   - It appears AFTER any journal headers or running headers
   - It is typically longer than 3 words
   - It must be a complete, grammatical phrase/sentence
   - It CANNOT be:
     * Running headers
     * Journal names
     * Author names or affiliations
     * Random strings of numbers/letters
     * Section headings
     * File identifiers or document numbers
     * Conference names
     * Page numbers or dates
     * ISSN/ISBN numbers

3. Return format:
   - Exactly this format: <DOI>/<TITLE>
   - Example: 10.1234/5678/Understanding Neural Networks in Deep Learning

4. Validation for title:
   - Must be a coherent phrase that describes the paper's content
   - Must make grammatical sense when read aloud
   - Must not be less than 3 words or more than 50 words
   - Must not contain file paths, URLs, or random alphanumeric strings
   - If you cannot find a title matching these criteria, return "NO_TITLE"

Parse this PDF and return ONLY the DOI and title in the specified format. Do not include any additional text or explanations in your response.`;
        
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
        const existingPaper = await ResearchPaper.findOne({ title });
        
        if (existingPaper) {
            return res.json({ 
                message: "Paper with this DOI and title already exists", 
                content: existingPaper.outputString,
                isExisting: true,
                paper: existingPaper
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
