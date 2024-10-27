const React = require('react');
const { useState } = React;
const axios = require('axios');
const RenderVisualAbstract = require('./RenderVisualAbstract'); // Adjust if necessary

const PdfUpload = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [visualAbstract, setVisualAbstract] = useState({ jsx: '', css: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResponse("");
        setError("");
        setVisualAbstract({ jsx: '', css: '' });
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
            const uploadResponse = await axios.post('http://localhost:5000/api/upload-pdf', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            setResponse("Processing PDF...");
            console.log("Upload response:", uploadResponse.data);
            setTimeout(fetchVisualAbstract, 10000);  // Wait for processing
        } catch (error) {
            console.error("Error uploading PDF:", error);
            setError(error.response?.data?.message || "Failed to upload PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVisualAbstract = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/fetch-visual-abstract', {
                withCredentials: true
            });
            setVisualAbstract(res.data);
            setResponse("Visual abstract generated successfully!");
            console.log("Visual Abstract Data:", res.data);
        } catch (error) {
            console.error("Error fetching visual abstract:", error);
            setError("Failed to retrieve visual abstract. Please try again later.");
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

                <button 
                    onClick={handleUpload}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading || !file}
                >
                    {loading ? 'Uploading...' : 'Upload PDF'}
                </button>

                {error && <div className="text-red-500 mt-2">{error}</div>}
                {response && <div className="text-green-500 mt-2">{response}</div>}

                {visualAbstract.jsx && (
                    <div className="mt-6">
                        <h3 className="font-bold">Generated Visual Abstract</h3>
                        <RenderVisualAbstract jsx={visualAbstract.jsx} css={visualAbstract.css} />
                    </div>
                )}
            </div>
        </div>
    );
};

module.exports = PdfUpload; // Ensure you have this export
