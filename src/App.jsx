import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Keep this for styles

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('photos', file));

    try {
      await axios.post('http://172.124.187.171:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setMessage('Upload successful! 🎉');
      setFiles([]);
      setProgress(0);
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Upload Your Wedding Photos 📸</h1>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      <button onClick={handleUpload}>Upload</button>

      {progress > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;

