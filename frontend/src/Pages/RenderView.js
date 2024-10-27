import React, { useState, useEffect } from 'react';
import { LiveProvider, LivePreview } from 'react-live';
import { useParams, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import '../CSS files/RenderView.css';

const RenderView = () => {
    const location = useLocation();
    const { fileName } = useParams();
    const [isLoading, setIsLoading] = useState(!location.state?.outputString);
    const [error, setError] = useState("");
    const [code, setCode] = useState(location.state?.outputString || '<div><strong>Visual Abstract is Loading...</strong></div>');
    const [metadata, setMetadata] = useState({
        title: location.state?.title || "Loading title...",
        doi: location.state?.doi || "Loading DOI...",
        dateAccessed: location.state?.dateAccessed || new Date().toLocaleDateString()
    });

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
        // Only fetch metadata and generate code if outputString is not provided
        if (!location.state?.outputString) {
            const fetchMetadataAndGenerate = async () => {
                try {
                    const metadataResponse = await axios.post('http://localhost:5000/api/toJson/fetch-metadata', {
                        filePath: `./uploads/${fileName}`
                    });

                    const { doi, title } = metadataResponse.data;

                    setMetadata(prev => ({
                        ...prev,
                        doi: doi || "DOI not found",
                        title: title || "Title not found"
                    }));

                    const response = await axios.post(
                        'http://localhost:5000/api/toJson/generate-react-live',
                        {
                            filePath: `./uploads/${fileName}`,
                            title,
                            doi
                        }
                    );

                    if (response.data && typeof response.data.content === 'string') {
                        setCode(response.data.content);
                    } else {
                        console.error("Unexpected response format:", response.data);
                        setError("Received unexpected data format from the server.");
                    }
                } catch (error) {
                    console.error("Error details:", error);
                    setError(`Failed to generate Visual Abstract: ${error.message}`);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchMetadataAndGenerate();
        } else {
            setIsLoading(false);
        }
    }, [fileName, location.state?.outputString]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h2>Generating Visual Abstract</h2>
                    <p>Please wait while we process your request...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <LiveProvider code={code} scope={scope}>
                        <LivePreview />
                    </LiveProvider>
                </>
            )}
        </div>
    );
};

export default RenderView;