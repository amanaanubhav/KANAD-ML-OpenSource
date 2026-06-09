'use client';

import { useState, useRef } from 'react';
import { predictDisease } from '@/lib/api';

export default function DiseaseDetectPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await predictDisease(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-blue-600)'}}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
          Disease Detection
        </h1>
        <p className="page-subtitle">
          Upload a leaf image to identify diseases across 14 crop varieties. Our ResNet9 model provides instant diagnosis with treatment guidance.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {preview ? (
            <div>
              <img src={preview} alt="Preview" className="dropzone-preview" />
              <p className="dropzone-text" style={{ marginTop: '1rem' }}>
                {file?.name} • Click or drop to change
              </p>
            </div>
          ) : (
            <>
              <div className="dropzone-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <p className="dropzone-text">
                <strong>Drop a leaf image here</strong> or click to browse<br />
                <span style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                  Supports JPG, PNG, WebP
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {file && (
        <button onClick={handleSubmit} className="btn btn-primary btn-lg btn-full" disabled={loading}>
          {loading ? 'Analyzing Image...' : 'Detect Disease'}
        </button>
      )}

      {error && <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>Error: {error}</div>}

      {result && result.success && (
        <div className={`result-card ${result.is_healthy ? 'healthy' : 'diseased'}`} style={{ marginTop: '2rem' }}>
          <div className="result-title">
            {result.is_healthy ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-green-600)'}}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-red-600)'}}>
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{result.disease}</div>
              <span className={`result-badge ${result.is_healthy ? 'healthy' : 'danger'}`} style={{ marginTop: '0.25rem' }}>
                {result.crop} • {result.is_healthy ? 'Healthy' : 'Disease Detected'}
              </span>
            </div>
          </div>

          {!result.is_healthy && result.cause?.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Cause</h4>
              <ul className="result-list">
                {result.cause.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h4 className="section-title" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
              {result.is_healthy ? 'Tips for Maintenance' : 'Prevention & Cure'}
            </h4>
            <ul className="result-list">
              {result.prevention?.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
