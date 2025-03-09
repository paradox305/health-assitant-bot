import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const ChatWidget = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [response, setResponse] = useState('');
	const [file, setFile] = useState(null);
	const [query, setQuery] = useState('');
	const [uploading, setUploading] = useState(false);
	const [searching, setSearching] = useState(false);

	// Toggle widget open/close
	const toggleWidget = () => setIsOpen(!isOpen);

	// Handle file drop/selection
	const onDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0]);
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: '.pdf, .docx',
	});

	// File upload API call
	const handleFileUpload = async () => {
		if (!file) {
			alert("Please select a file first!");
			return;
		}
		setUploading(true);
		const formData = new FormData();
		formData.append('file', file);

		try {
			const { data } = await axios.post('http://127.0.0.1:8000/healthcare/upload-report', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			alert("File uploaded successfully!");
			console.log("Upload response:", data);
		} catch (error) {
			console.error('Error uploading file:', error);
		} finally {
			setUploading(false);
		}
	};

	// Query submission API call
	const handleQuerySubmit = async () => {
		if (!query) {
			alert("Please enter a query!");
			return;
		}
		setSearching(true);
		try {
			const { data } = await axios.get('http://127.0.0.1:8000/healthcare/search', {
				params: { query },
			});
			setResponse(data.result);
		} catch (error) {
			console.error('Error fetching response:', error);
		} finally {
			setSearching(false);
		}
	};

	return (
    <>
      {/* 
        Minimal Floating Button 
        (Visible only when widget is closed)
      */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            zIndex: 9999,
          }}
        >
          Bot
        </button>
      )}

      {/* 
        Minimal Chat Panel 
        (Visible only when widget is open)
      */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 9999,
          }}
        >
          {/* Header with Close Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Health Buddy</div>
            <button
              onClick={toggleWidget}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>

          {/* File Upload Section */}
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #aaa',
              padding: '10px',
              textAlign: 'center',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            <p style={{ margin: 0 }}>Drag & drop or click to select a file (PDF/DOCX)</p>
          </div>
          {file && (
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Selected: <strong>{file.name}</strong>
            </p>
          )}
          <button
            onClick={handleFileUpload}
            disabled={uploading}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>

          {/* Query Section */}
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a health-related question..."
            style={{
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
              border: '1px solid #ccc',
              resize: 'none',
            }}
          />
          <button
            onClick={handleQuerySubmit}
            disabled={searching}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              cursor: searching ? 'not-allowed' : 'pointer',
            }}
          >
            {searching ? 'Searching...' : 'Get Answer'}
          </button>

          {/* Response Display */}
          {response && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#eee',
                borderRadius: '4px',
                height: '150px',
                overflowY: 'auto',
		whiteSpace: 'pre-wrap',
              }}
            >
              <strong>Response:</strong>
              <p style={{ margin: '5px 0 0 0' }}>{response}</p>
            </div>
	  )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;

