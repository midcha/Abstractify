import React, { useState } from 'react';
import axios from 'axios';

const PdfUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResponse(""); // Clear previous response
        setError(""); // Clear previous error
        setUploadedFileName(""); // Clear previous filename
    };

    // Handle file upload
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

    // Handle file deletion
    const handleDelete = async () => {
        if (!uploadedFileName) return;

        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/delete-pdf/${uploadedFileName}`, {
                withCredentials: true
            });
            setUploadedFileName("");
            setFile(null);
            setResponse("File deleted successfully");
            // Reset the file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Error deleting file:", error);
            setError(error.response?.data?.message || "Failed to delete file. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Upload a PDF</h2>
            <div className="space-y-4">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="application/pdf" 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                
                <div className="flex space-x-4">
                    {loading ? (
                        <p className="text-blue-600">Uploading...</p>
                    ) : (
                        <button 
                            onClick={handleUpload}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={!file}
                        >
                            Upload PDF
                        </button>
                    )}

                    {uploadedFileName && (
                        <button 
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete File'}
                        </button>
                    )}
                </div>
                
                {error && (
                    <div className="text-red-500 mt-2">
                        {error}
                    </div>
                )}

                {uploadedFileName && (
                    <div className="mt-2 text-sm text-gray-600">
                        Current file: {uploadedFileName}
                    </div>
                )}

                {response && (
                    <div className="mt-4">
                        <h3 className="font-bold">Server Response:</h3>
                        <pre className="bg-gray-100 p-4 rounded mt-2">{response}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfUpload;