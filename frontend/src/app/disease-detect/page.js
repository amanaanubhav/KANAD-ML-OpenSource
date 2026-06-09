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
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">🔬 Disease Detection</h1>
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
              <div className="dropzone-icon">📷</div>
              <p className="dropzone-text">
                <strong>Drop a leaf image here</strong> or click to browse<br />
                <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                  Supports JPG, PNG, WebP
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {file && (
        <button onClick={handleSubmit} className="btn btn-primary btn-lg btn-full" disabled={loading}>
          {loading ? '🔍 Analyzing...' : '🔬 Detect Disease'}
        </button>
      )}

      {error && <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>⚠️ {error}</div>}

      {result && result.success && (
        <div className={`result-card ${result.is_healthy ? 'healthy' : 'diseased'} animate-slide-up`}>
          <div className="result-title">
            <span style={{ fontSize: '2rem' }}>{result.is_healthy ? '✅' : '⚠️'}</span>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{result.disease}</div>
              <span className={`result-badge ${result.is_healthy ? 'healthy' : 'danger'}`}>
                {result.crop} • {result.is_healthy ? 'Healthy' : 'Disease Detected'}
              </span>
            </div>
          </div>

          {!result.is_healthy && result.cause?.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 className="section-title" style={{ fontSize: '0.9rem' }}>Cause</h4>
              <ul className="result-list">
                {result.cause.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <h4 className="section-title" style={{ fontSize: '0.9rem' }}>
              {result.is_healthy ? 'Tips' : 'Prevention & Cure'}
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
