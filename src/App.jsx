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

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 20) {
      setMessage('You can only upload up to 20 files at once.');
      e.target.value = null;
      return;
    }

    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      await handleUpload(selectedFiles);
    }
  };

  const handleUpload = async (selectedFiles) => {
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => formData.append('photos', file));

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

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="container">
      <h1 className={`animated-text ${animateText ? 'fadeIn' : ''}`}>Share your memories with Hafsa & Haris</h1>

      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button onClick={handleClick}>Select & Upload Files</button>

      <p className="note">Maximum 20 files at once*</p>

      {progress > 0 && (
        <>
          <div className="progress-container">
            <span className="progress-text">{progress}%</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
