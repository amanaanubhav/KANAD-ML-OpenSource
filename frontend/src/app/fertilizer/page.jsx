'use client';

import { useState } from 'react';
import { predictFertilizer } from '@/lib/api';
import { FERTILIZER_CROPS } from '@/lib/constants';

export default function FertilizerPage() {
  const [form, setForm] = useState({
    cropname: 'rice', nitrogen: 50, phosphorous: 50, potassium: 50,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await predictFertilizer(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const maxNPK = 140;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-amber-600)'}}>
            <path d="M10 2v7.31"></path>
            <path d="M14 9.3V1.99"></path>
            <path d="M8.5 2h7"></path>
            <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
            <path d="M5.52 16h12.96"></path>
          </svg>
          Fertilizer Recommendation
        </h1>
        <p className="page-subtitle">
          Analyze your soil nutrients and get personalized fertilizer suggestions to optimize crop yield.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="section-title">Soil & Crop Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Select Crop</label>
              <select
                className="form-select"
                value={form.cropname}
                onChange={(e) => setForm(prev => ({ ...prev, cropname: e.target.value }))}
              >
                {FERTILIZER_CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</option>
                ))}
              </select>
            </div>

            {[
              { key: 'nitrogen', label: 'Nitrogen (N)' },
              { key: 'phosphorous', label: 'Phosphorous (P)' },
              { key: 'potassium', label: 'Potassium (K)' },
            ].map(({ key, label }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="200"
                  value={form[key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Soil & Recommend'}
        </button>
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>Error: {error}</div>}

      {result && result.success && (
        <div className="result-card" style={{ marginTop: '2rem' }}>
          {/* NPK Chart */}
          <h3 className="section-title">NPK Analysis</h3>
          <div className="npk-chart">
            {['nitrogen', 'phosphorous', 'potassium'].map((key) => {
              const analysis = result.analysis[key];
              const currentH = Math.max(4, (analysis.current / maxNPK) * 150);
              const requiredH = Math.max(4, (analysis.required / maxNPK) * 150);
              return (
                <div className="npk-bar-group" key={key}>
                  <div className="npk-bars">
                    <div className="npk-bar current" style={{ height: `${currentH}px` }} title={`Current: ${analysis.current}`} />
                    <div className="npk-bar required" style={{ height: `${requiredH}px` }} title={`Required: ${analysis.required}`} />
                  </div>
                  <span className="npk-bar-label">{key.charAt(0).toUpperCase()}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ display: 'inline-block', width: 14, height: 14, background: 'var(--color-green-500)', borderRadius: 2 }}></span>Current</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ display: 'inline-block', width: 14, height: 14, background: 'var(--color-amber-400)', borderRadius: 2 }}></span>Required</span>
          </div>

          {/* Recommendation */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <div className="result-title">
              <span className={`result-badge ${result.recommendation?.status === 'high' ? 'warning' : 'danger'}`}>
                {result.recommendation?.nutrient} — {result.recommendation?.status?.toUpperCase()}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
              {result.recommendation?.message}
            </p>

            <h4 className="section-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Suggestions</h4>
            <ul className="result-list">
              {result.recommendation?.suggestions?.map((s, i) => (
                <li key={i}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{s.title}</strong>
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>{s.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
