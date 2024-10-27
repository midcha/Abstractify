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
                const ReactString = await axios.post('http://localhost:5000/api/toJson/generate-react-live', {
                    filePath: `./uploads/${fileName}`
                });

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
