// /src/app/api/toJson/fetch-metadata/route.js

import { generateContent } from '@/lib/generateAIContent';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { filePath } = await req.json();

    if (!filePath) {
        return NextResponse.json({ message: "File path is required" }, { status: 400 });
    }

    try {
        const resolvedFilePath = path.resolve(filePath);
        const content = await generateContent(resolvedFilePath);

        // Process content to extract DOI and title based on custom logic
        const [doi, title] = content.split('/').map(item => item.trim());

        return NextResponse.json({
            doi: doi || "DOI not found",
            title: title || "Title not found"
        });
    } catch (error) {
        console.error("Error extracting metadata:", error.message || error);
        return NextResponse.json({ message: "Failed to extract metadata", error: error.message }, { status: 500 });
    }
}
