import React, { useState } from 'react';
import axios from 'axios';

const PdfUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

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
            const res = await axios.post('http://localhost:5000/api/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            setResponse(res.data.message);
            setUploadedFileName(res.data.fileName);
            setError("");
        } catch (error) {
            console.error("Error uploading PDF:", error);
            setError(error.response?.data?.message || "Failed to upload PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
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
        </div>
    );
};

export default PdfUpload;