import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PdfUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResponse("");
        setError("");
        setUploadedFileName("");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF file to upload.");
            return;
        }
       
        setLoading(true);
        const formData = new FormData();
        formData.append('pdf', file);
        
        try {

            const res = await axios.post('http://localhost:5000/api/pdf/upload-pdf', formData, {
                headers: { 

                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            setResponse(res.data.message);
            setUploadedFileName(res.data.fileName);
            setError("");
            // Navigate to RenderView with uploaded file name
            navigate(`/render-view/${res.data.fileName}`);
        } catch (error) {
            console.error("Error uploading PDF:", error);
            setError(error.response?.data?.message || "Failed to upload PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Upload a PDF</h2>
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="application/pdf" 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <button 
                onClick={handleUpload}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={!file || loading}
            >
                {loading ? 'Uploading...' : 'Upload PDF'}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="upload-container">
            <h1>Upload a PDF</h1>
            <div className="upload-content">
                <div className="upload-row">
                    <input
                        type="file"    
                        onChange={handleFileChange}
                        accept="application/pdf"
                        className="file-input"
                    />
                    
                    {loading ? (
                        <p className="upload-loading">Uploading...</p>
                    ) : (
                        <button
                            onClick={handleUpload}
                            className="upload-button"
                            disabled={!file}
                        >
                            Upload PDF
                        </button>
                    )}
                </div>

                {error && (
                    <div className="upload-error">
                        {error}
                    </div>
                )}
                
                {response && (
                    <div className="upload-response">
                        <h3>Server Response:</h3>
                        <p>{response}</p>
                    </div>
                )}
            </div>
>>>>>>> main
        </div>
    );
};

export default PdfUpload;
