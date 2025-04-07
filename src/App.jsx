import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    setAnimateText(true);
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 20) {
      setMessage('You can only upload up to 20 photos at once.');
      e.target.value = null; // Clear the input
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
      await axios.post('https://wedding.ngrok.app/upload', formData, {
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
      <h1 className={`animated-text ${animateText ? 'fadeIn' : ''}`}>Share Your Memories</h1>
      <h2 className={`animated-text ${animateText ? 'fadeInDelay' : ''}`}>Upload Your Wedding Photos 📸</h2>

      {/* Custom styled input */}
      <label className="custom-file-upload">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
        />
        Select Photos
      </label>

      <button onClick={handleUpload} disabled={files.length === 0}>Upload</button>

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
