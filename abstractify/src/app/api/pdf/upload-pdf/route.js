// /src/app/api/pdf/upload-pdf/route.js

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disable default Next.js body parser
export const config = {
    api: { bodyParser: false }
};

export async function POST(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({
            uploadDir: uploadsDir,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10 MB
            filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error("Error during file upload:", err);
                return resolve(NextResponse.json({ message: `Error processing PDF: ${err.message}` }, { status: 500 }));
            }

            const file = files.pdf;
            if (!file || file.mimetype !== 'application/pdf') {
                return resolve(NextResponse.json({ message: "No PDF file uploaded or incorrect format." }, { status: 400 }));
            }

            console.log("Uploaded file path:", file.filepath);
            resolve(NextResponse.json({
                message: "File uploaded successfully",
                filePath: file.filepath,
                fileName: file.newFilename,
                content: "Your PDF has been processed"
            }));
        });
    });
}
