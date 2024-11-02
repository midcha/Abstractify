// /src/app/api/toJson/research-papers/route.js

import ResearchPaper from '@/models/ResearchPaper';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const papers = await ResearchPaper.find().sort({ dateAccessed: -1 });
        return NextResponse.json(papers);
    } catch (error) {
        console.error("Error fetching research papers:", error);
        return NextResponse.json({ message: "Failed to fetch research papers", error: error.message }, { status: 500 });
    }
}
