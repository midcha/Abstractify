// /src/app/api/pdf/delete-pdf/[filename]/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

export async function DELETE(req, { params }) {
    const { filename } = params;
    const filePath = path.join(uploadsDir, filename);

    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ message: "File not found" }, { status: 404 });
        }

        // Delete the file
        fs.unlinkSync(filePath);
        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ message: `Error deleting file: ${error.message}` }, { status: 500 });
    }
}
