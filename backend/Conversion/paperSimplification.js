const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();
const fs = require('fs');



const { PDFDocument } = require('pdf-lib');

async function parseImagesFromPDF() {
    const outputImages = await convert(`./TestPapers/humanmicroplasticbood.pdf`);
    const imagePaths = outputImages.map((image, i) => {
    const path = "output" + i + ".png";
    fs.writeFileSync(path, image);
    return path;
    });
    console.write(imagePaths)
}

async function parseImagesFromPDF(filePath) {
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
 
    const imgIndex = 0;
    const pages = pdfDoc.getPages();


    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const imgs = page.getImages();
        for (let j = 0; j < imgs.length; j++) {
            const img = imgs[j];
            const { imageBytes, mimeType } = await pdfDoc.embedImage(img);
            const imageDataUrl = await imageBytes;

            // Save image to disk
            const base64Data = imageDataUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const imageFileName = `extracted-image-${imgIndex + 1}.${mimeType.split('/')[1]}`;
            fs.writeFileSync(`./Outputs/images/${imageFileName, buffer}`);
            console.log(`Saved image: ${imageFileName}`);

            imgIndex++;
        }
    }
}
async function generateSimplification() {
    console.log("using categorize");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);
    


    const uploadResponse = await fileManager.uploadFile("./TestPapers/humanmicroplasticbood.pdf", {
        mimeType: "application/pdf",
        displayName: "ResearchPaperPDF",
    });

    const schema = {
        description: "Sections of the research paper",
        type: "array", // Assuming SchemaType.ARRAY resolves to "array"
        items: {
          type: "object",
          properties: {
            sectionType: {
              type: "string",
              description: "Type of the section",
              enum: ["overview", "context", "methodology", "results", "discussion", "conclusion"],
              nullable: false,
            },
            content: {
              type: "string",
              description: "Content of the section",
              nullable: false,
            },
            images: {
              type: "array",
              description: "Number of images in the section", // Clarified description
              items: {
                type: "integer",  // "integer" is generally more appropriate for image counts
                nullable: true,
              },
            },
          },
          required: ["sectionType", "content"],
        },
      };
      
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro",         
        
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
            
        },
    });
    const prompt = fs.readFileSync('./backend/Prompts/getSummary.txt', 'utf8');
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: prompt }
    ]);
    
    // Write the result to a JSON file
    console.log(result.response.text());
    //fs.writeFileSync('./Outputs/summaryResult.json', JSON.stringify(result.response.text(), null, 2));
    console.log(result.response.text());
   
    const responseText = result.response.text();
    const outputPath = `./backend/Outputs/summaryResult.json`
    // Attempt to parse the response as JSON
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(responseText);
    } catch (e) {
        jsonResponse = { rawText: responseText };
        console.warn('Warning: Response was not valid JSON, saving raw text');
    }

    fs.writeFileSync(outputPath, JSON.stringify(jsonResponse, null, 2));
    console.log(`Results saved to: ${outputPath}`);
    await fileManager.deleteFile(uploadResponse.file.name);
}

generateSimplification();


