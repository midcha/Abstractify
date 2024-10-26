const express = require('express');
const router = express.Router();
const { Anthropic } = require("@anthropic-ai/sdk");
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define paths to save JSX and CSS in the frontend folder
const frontendFinalDir = path.join(__dirname, '../../frontend/src/finals');

// Ensure the frontend directories exist
if (!fs.existsSync(frontendFinalDir)) fs.mkdirSync(frontendFinalDir, { recursive: true });


// Helper function to interact with Claude
async function askClaude(prompt) {
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8192,
            temperature: 1.0,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        return message.content[0].text;
    } catch (error) {
        console.error('Error in askClaude:', error);
        throw error;
    }
}

// Route to convert JSON to JSX and CSS
router.post('/convert-to-jsx', async (req, res) => {
    try {
        // Read prompts from the files directly
        const initialPrompt = fs.readFileSync(path.join(__dirname, '../Outputs/result.json'), 'utf8');
        const jsonToReactPrompt = fs.readFileSync(path.join(__dirname, '../Prompts/JSONtoReact.txt'), 'utf8');
        const peerReviewPrompt = fs.readFileSync(path.join(__dirname, '../Prompts/peerReview.txt'), 'utf8');

        // First Claude interaction
        const firstPrompt = initialPrompt + jsonToReactPrompt;
        console.log('Getting first response from Claude...');
        const response1 = await askClaude(firstPrompt);
        fs.writeFileSync(path.join(__dirname, '../Outputs/output.txt'), response1, 'utf8');

        // Second Claude interaction
        const secondPrompt = response1 + peerReviewPrompt;
        console.log('Getting second response from Claude...');
        const response2 = await askClaude(secondPrompt);

        // Extract JSX and CSS from the response
        const jsxMatch = response2.match(/```jsx\n([\s\S]*?)\n```/);
        const cssMatch = response2.match(/```css\n([\s\S]*?)\n```/);

        let jsxContent, cssContent;

        if (jsxMatch && jsxMatch[1]) {
            jsxContent = jsxMatch[1].trim();
            fs.writeFileSync(path.join(frontendFinalDir, 'VisualAbstract.jsx'), jsxContent, 'utf8');
            console.log('Successfully saved VisualAbstract.jsx in frontend/src/Pages');
        } else {
            throw new Error('Could not find JSX content in the response');
        }

        if (cssMatch && cssMatch[1]) {
            cssContent = cssMatch[1].trim();
            fs.writeFileSync(path.join(frontendFinalDir, 'VisualAbstract.css'), cssContent, 'utf8');
            console.log('Successfully saved VisualAbstract.css in frontend/src/CSS Styles');
        } else {
            throw new Error('Could not find CSS content in the response');
        }

        // Send the response with JSX and CSS content
        res.json({
            message: 'Content generated successfully',
            jsxContent,
            cssContent
        });

    } catch (error) {
        console.error('Error generating Visual Abstract:', error);
        res.status(500).json({ message: 'Failed to generate Visual Abstract', error: error.message });
    }
});

module.exports = router;
