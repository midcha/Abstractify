import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RenderView = () => {
    const { fileName } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [code, setCode] = useState('<div><strong>Visual Abstract is Loading...</strong></div>');

    // Defining the scope for react-live to include Recharts components
    const scope = { 
        React, 
        BarChart, 
        Bar, 
        XAxis, 
        YAxis, 
        CartesianGrid, 
        Tooltip, 
        Legend 
    };

    useEffect(() => {
        const generateVisualAbstract = async () => {
            try {
                // Generate JSON from uploaded PDF
                const response = await axios.post('http://localhost:5000/api/toJson/generate-react-live', {
                    filePath: `./uploads/${fileName}`
                });
                
                // Update the code state with the received content if it's a string
                if (response.data && typeof response.data.content === 'string') {
                    console.log(response.data.content);
                    setCode(response.data.content);
                } else {
                    console.error("Unexpected response type, expected a string in `content`:", response.data);
                    setError("Received unexpected data format from the server.");
                }
            } catch (error) {
                console.error("Error generating Visual Abstract:", error);
                setError("Failed to generate Visual Abstract. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        

        generateVisualAbstract();
    }, [fileName]);

    return (
        <div className="p-4">
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <LiveProvider code={code} scope={scope}>
                    <LivePreview />
                </LiveProvider>
            )}
        </div>
    );
};

export default RenderView;
