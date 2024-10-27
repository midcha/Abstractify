// models/ResearchPaper.js
const mongoose = require('mongoose');

const researchPaperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    doi: { type: String, required: true, unique: true },
    dateAccessed: { type: Date, default: Date.now },
    outputString: { type: String, required: true } // React-live compatible code
});

module.exports = mongoose.model('ResearchPaper', researchPaperSchema);
