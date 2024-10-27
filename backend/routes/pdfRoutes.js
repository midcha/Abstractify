const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
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

// Route to handle PDF upload, process, and trigger getJSON and JSONtoReact
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded or incorrect format." });
        }

        const filePath = req.file.path;

        // Run getJSON.js after PDF upload
        exec(`node ./Conversion/getJSON.js ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error("Error running getJSON.js:", stderr);
                return res.status(500).json({ message: 'Failed to process PDF to JSON' });
            }

            // Proceed with JSONtoReact after getJSON.js completes
            exec('node ./Conversion/JSONtoReact.js', (error, stdout, stderr) => {
                if (error) {
                    console.error("Error running JSONtoReact.js:", stderr);
                    return res.status(500).json({ message: 'Failed to convert JSON to React' });
                }

                res.json({
                    message: "PDF processed and React files generated",
                    fileName: req.file.filename
                });
            });
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

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        fs.unlinkSync(filePath);
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: `Error deleting file: ${error.message}` });
    }
});

// Route to serve the generated JSX and CSS files
router.get('/fetch-visual-abstract', (req, res) => {
    try {
        const jsx = fs.readFileSync('./Outputs/Finals/VisualAbstract.jsx', 'utf8');
        const css = fs.readFileSync('./Outputs/Finals/VisualAbstract.css', 'utf8');
        res.json({ jsx, css });
    } catch (error) {
        console.error("Error fetching visual abstract files:", error);
        res.status(500).json({ message: 'Failed to fetch visual abstract' });
    }
});

module.exports = router;
