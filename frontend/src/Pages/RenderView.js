import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RenderView = () => {
    const { fileName } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [VisualAbstract, setVisualAbstract] = useState(null);

    useEffect(() => {
        const generateVisualAbstract = async () => {
            try {
                // Step 1: Generate JSON from uploaded PDF
                const resultResponse = await axios.post('http://localhost:5000/api/toJson/generate-json', {
                    filePath: `./uploads/${fileName}`
                });
                
                // Step 2: Convert JSON to React component via Claude
                await axios.post('http://localhost:5000/api/toJSX/convert-to-jsx');

                // Step 3: Dynamically check for and import generated VisualAbstract.jsx
                const checkFileExists = async () => {
                    try {
                        // Attempt to dynamically import VisualAbstract.jsx if it exists in the frontend directory
                        const { default: VisualAbstractComponent } = await import(`../finals/VisualAbstract`);
                        setVisualAbstract(() => VisualAbstractComponent); // Set as a functional component
                        setIsLoading(false);
                    } catch (err) {
                        // Retry after 1 second if the file doesn't exist yet
                        console.log("VisualAbstract.jsx not found. Retrying...");
                        setTimeout(checkFileExists, 1000);
                    }
                };

                checkFileExists();

            } catch (error) {
                console.error("Error generating Visual Abstract:", error);
                setError("Failed to generate Visual Abstract. Please try again.");
                setIsLoading(false);
            }
        };

        generateVisualAbstract();
    }, [fileName]);

    return (
        <div className="p-4">
            {isLoading ? (
                <p>Loading Visual Abstract...</p>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                VisualAbstract && <VisualAbstract />
            )}
        </div>
    );
};

export default RenderView;
