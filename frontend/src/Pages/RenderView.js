import React, { useState, useEffect } from 'react';
import { LiveProvider, LivePreview } from 'react-live';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RenderView = () => {
    const { fileName } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [code, setCode] = useState('<div><strong>Visual Abstract is Loading...</strong></div>');
    const [metadata, setMetadata] = useState({
        title: "Loading title...",
        doi: "Loading DOI...",
        dateAccessed: new Date().toLocaleDateString()
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
        let isMounted = true;
        let controller = new AbortController();

        const fetchMetadataAndGenerate = async () => {
            try {
                if (!fileName) return;

                // Fetch metadata
                console.log("Fetching metadata for file:", fileName);
                const metadataResponse = await axios.post('http://localhost:5000/api/toJson/fetch-metadata', 
                    {
                        filePath: `./uploads/${fileName}`
                    },
                    {
                        signal: controller.signal
                    }
                );

                if (!isMounted) return;

                if (metadataResponse.data) {
                    try {
                        const { doi, title } = metadataResponse.data;
                        
                        if (isMounted) {
                            setMetadata(prev => ({
                                ...prev,
                                doi: doi || "DOI not found",
                                title: title || "Title not found"
                            }));
                        }

                        // Visual Abstract generation
                        const visualAbstractRequest = {
                            filePath: `./uploads/${fileName}`,
                            title: title,
                            doi: doi
                        };
                        
                        const response = await axios.post(
                            'http://localhost:5000/api/toJson/generate-react-live',
                            visualAbstractRequest,
                            {
                                signal: controller.signal
                            }
                        );

                        if (!isMounted) return;

                        if (response.data && typeof response.data.content === 'string') {
                            setCode(response.data.content);
                        } else {
                            console.error("Unexpected response format:", response.data);
                            setError("Received unexpected data format from the server.");
                        }
                    } catch (metadataError) {
                        if (!isMounted) return;
                        console.error("Error processing metadata:", metadataError);
                        setMetadata(prev => ({
                            ...prev,
                            doi: "Error processing DOI",
                            title: "Error processing title"
                        }));
                    }
                }
            } catch (error) {
                if (!isMounted) return;
                if (axios.isCancel(error)) {
                    console.log('Request cancelled');
                    return;
                }
                console.error("Error details:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                setError(`Failed to generate Visual Abstract: ${error.message}`);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchMetadataAndGenerate();

        // Cleanup function
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [fileName]); // Only dependency is fileName

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4">
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    <div className="metadata mb-4 p-4 bg-gray-100 rounded">
                        <h2 className="text-xl font-bold mb-2">{metadata.title}</h2>
                        <p className="mb-1"><strong>DOI:</strong> {metadata.doi}</p>
                        <p><strong>Date Accessed:</strong> {metadata.dateAccessed}</p>
                    </div>

                    <LiveProvider code={code} scope={scope}>
                        <LivePreview />
                    </LiveProvider>
                </>
            )}
        </div>
    );
};

export default RenderView;