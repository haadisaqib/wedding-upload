import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Keep for styles

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    if (selectedFiles.length > 20) {
      setMessage('You can only upload up to 20 photos at once.');
      return;
    }
  
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('photos', file));

    try {
      await axios.post('https://bdd5-2600-1700-4270-2e80-80e5-dc78-6fd2-3517.ngrok-free.app/upload', formData, {
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
      <h1>Share Your Memories</h1>
      <h2>Upload Your Wedding Photos 📸</h2>

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
