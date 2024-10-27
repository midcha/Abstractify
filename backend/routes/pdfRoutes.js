const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Route to handle PDF upload
router.post('/upload-pdf', upload.single('pdf'), (req, res) => {
    try {
        if (!req.file) {
            console.error("No file uploaded or incorrect format.");
            return res.status(400).json({ message: "No file uploaded or incorrect format." });
        }

        console.log("Uploaded file path:", req.file.path);
        res.json({ 
            message: "File uploaded successfully", 
            filePath: req.file.path,
            fileName: req.file.filename,
            content: "Your PDF has been processed"
        });
    } catch (error) {
        console.error("Error during PDF upload:", error);
        res.status(500).json({ message: `Error processing PDF: ${error.message}` });
    }
});

// Route to handle file deletion
router.delete('/delete-pdf/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        // Delete the file
        fs.unlinkSync(filePath);
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: `Error deleting file: ${error.message}` });
    }
});

module.exports = router;