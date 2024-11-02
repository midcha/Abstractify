// /src/app/api/toJson/generate-react-live/route.js

import { generateContent, generateResponseFromText } from '@/lib/generateAIContent';
import fs from 'fs';
import path from 'path';
import ResearchPaper from '@/models/ResearchPaper';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { filePath, title, doi } = await req.json();

    if (!filePath || !title || !doi) {
        return NextResponse.json({ message: "File path, title, and DOI are required" }, { status: 400 });
    }

    try {
        // Check for existing paper with the same DOI
        const existingPaper = await ResearchPaper.findOne({ title });

        if (existingPaper) {
            return NextResponse.json({
                message: "Paper with this DOI and title already exists",
                content: existingPaper.outputString,
                isExisting: true,
                paper: existingPaper
            });
        }

        // If no duplicate found, proceed with generation and saving
        const resultJSON = await generateContent(filePath);
        const JSONtoReact = fs.readFileSync(path.join(process.cwd(), 'Prompts/JSONtoReact.txt'), 'utf8');
        let resultdraft = await generateResponseFromText(resultJSON + JSONtoReact);

        resultdraft = resultdraft.replace(/^```javascript\s*/, '').replace(/\s*```$/, '');

        // Save to MongoDB only if it's a new paper
        const paper = new ResearchPaper({
            title,
            doi,
            outputString: resultdraft
        });
        await paper.save();

        return NextResponse.json({
            message: "JSON generated and saved successfully",
            content: resultdraft,
            isExisting: false,
            paper
        });
    } catch (error) {
        console.error("Error generating or saving content:", error);
        return NextResponse.json({ message: "Failed to generate or save content", error: error.message }, { status: 500 });
    }
}
