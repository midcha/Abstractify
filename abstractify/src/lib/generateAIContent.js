// /src/lib/generateAIContent.js

import { GoogleGenerativeAI, GoogleAIFileManager } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function generateContent(filePath) {
    console.log("Using Google Generative AI to categorize content.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType: "application/pdf",
        displayName: "ResearchPaperPDF",
    });

    const prompt = fs.readFileSync(path.join(process.cwd(), 'Prompts/getJSON.txt'), 'utf8');
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

export async function generateResponseFromText(promptText) {
    console.log("Generating response using Google Generative AI.");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", temperature: 0.4 });
    const result = await model.generateContent([{ text: promptText }]);
    return result.response.text();
}
