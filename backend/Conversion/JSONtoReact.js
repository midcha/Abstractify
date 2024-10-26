const { Anthropic } = require("@anthropic-ai/sdk");
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function askClaude(prompt) {
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8192,
            temperature: 0,
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

async function main() {
    try {
        // Create Outputs directory if it doesn't exist
        const outputsDir = './Outputs';
        if (!fs.existsSync(outputsDir)){
            fs.mkdirSync(outputsDir, { recursive: true });
        }

        // First Claude interaction
        console.log('Reading initial prompts...');
        const prompt1 = fs.readFileSync('./Outputs/result.json', 'utf8');
        const prompt2 = fs.readFileSync('./Prompts/JSONtoReact.txt', 'utf8');
        const prompt = prompt1 + prompt2;

        console.log('Getting first response from Claude...');
        const response1 = await askClaude(prompt);
        fs.writeFileSync(path.join(outputsDir, 'output.txt'), response1, 'utf8');
        console.log('Saved first response');

        // Second Claude interaction
        console.log('Reading peer review prompts...');
        const newPrompt1 = fs.readFileSync(path.join(outputsDir, 'output.txt'), 'utf8');
        const newPrompt2 = fs.readFileSync('./Prompts/peerReview.txt', 'utf8');
        const newPrompt = newPrompt1 + newPrompt2;

        console.log('Getting second response from Claude...');
        const response2 = await askClaude(newPrompt);

        // Create Finals directory
        const finalsDir = path.join(outputsDir, 'Finals');
        if (!fs.existsSync(finalsDir)){
            fs.mkdirSync(finalsDir, { recursive: true });
        }

        // Extract and save JSX and CSS content with more flexible regex
        const jsxMatch = response2.match(/```jsx\n([\s\S]*?)\n```/);
        const cssMatch = response2.match(/```css\n([\s\S]*?)\n```/);

        if (jsxMatch && jsxMatch[1]) {
            const jsxContent = jsxMatch[1].trim();
            fs.writeFileSync(
                path.join(finalsDir, 'VisualAbstract.jsx'),
                jsxContent,
                'utf8'
            );
            console.log('Successfully saved VisualAbstract.jsx');
        } else {
            throw new Error('Could not find JSX content in the response');
        }

        if (cssMatch && cssMatch[1]) {
            const cssContent = cssMatch[1].trim();
            fs.writeFileSync(
                path.join(finalsDir, 'VisualAbstract.css'),
                cssContent,
                'utf8'
            );
            console.log('Successfully saved VisualAbstract.css');
        } else {
            throw new Error('Could not find CSS content in the response');
        }

    } catch (error) {
        console.error('Error in main:', error);
        process.exit(1);
    }
}

main();