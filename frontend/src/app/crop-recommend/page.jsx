'use client';

import { useState } from 'react';
import { predictCrop } from '@/lib/api';

export default function CropRecommendPage() {
  const [form, setForm] = useState({
    nitrogen: 50, phosphorous: 50, potassium: 50,
    ph: 6.5, rainfall: 150, city: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await predictCrop(form);
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
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-green-600)'}}>
            <path d="M11 20A7 7 0 0 1 4 13V8h2a7 7 0 0 1 7 7v5z"></path>
            <path d="M11 20a7 7 0 0 0 7-7v-5h-2a7 7 0 0 0-7 7v5z"></path>
            <path d="M11 20v4"></path>
          </svg>
          Crop Recommendation
        </h1>
        <p className="page-subtitle">
          Enter your soil parameters and location to get AI-powered crop suggestions tailored to your conditions.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-title">Soil Parameters</h3>
          <div className="form-grid">
            {[
              { key: 'nitrogen', label: 'Nitrogen (N)', min: 0, max: 140 },
              { key: 'phosphorous', label: 'Phosphorous (P)', min: 0, max: 145 },
              { key: 'potassium', label: 'Potassium (K)', min: 0, max: 205 },
            ].map(({ key, label, min, max }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <div className="form-slider-container">
                  <span className="form-slider-value">{form[key]}</span>
                  <input
                    type="range"
                    className="form-slider"
                    min={min}
                    max={max}
                    value={form[key]}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                  />
                </div>
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Soil pH</label>
              <input
                type="number"
                className="form-input"
                step="0.1"
                min="0"
                max="14"
                value={form.ph}
                onChange={(e) => handleChange('ph', Number(e.target.value))}
                placeholder="6.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rainfall (mm)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                max="500"
                value={form.rainfall}
                onChange={(e) => handleChange('rainfall', Number(e.target.value))}
                placeholder="150"
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city for weather data"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
          {loading ? 'Analyzing...' : 'Get Crop Recommendation'}
        </button>
      </form>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
          Error: {error}
        </div>
      )}

      {result && result.success && (
        <div className="result-card healthy" style={{ marginTop: '2rem' }}>
          <div className="result-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-green-600)'}}>
              <path d="M12 2v20"></path>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'capitalize' }}>
                {result.crop}
              </div>
              <span className="result-badge healthy">Recommended Crop</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', boxShadow: 'none', background: 'var(--color-bg-primary)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Temperature</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-amber-600)' }}>
                {result.temperature}°C
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', boxShadow: 'none', background: 'var(--color-bg-primary)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Humidity</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-blue-600)' }}>
                {result.humidity}%
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', boxShadow: 'none', background: 'var(--color-bg-primary)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>City</div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                {result.city || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
