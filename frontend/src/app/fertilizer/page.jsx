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
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">🧪 Fertilizer Recommendation</h1>
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
          {loading ? 'Analyzing...' : '🧪 Analyze Soil & Recommend'}
        </button>
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>⚠️ {error}</div>}

      {result && result.success && (
        <div className="result-card animate-slide-up" style={{ marginTop: '1.5rem' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--color-green-500)', borderRadius: 2, marginRight: 6, opacity: 0.7 }}></span>Current</span>
            <span><span style={{ display: 'inline-block', width: 12, height: 12, background: 'var(--color-amber-400)', borderRadius: 2, marginRight: 6 }}></span>Required</span>
          </div>

          {/* Recommendation */}
          <div style={{ marginTop: '1rem' }}>
            <div className="result-title">
              <span className={`result-badge ${result.recommendation?.status === 'high' ? 'warning' : 'danger'}`}>
                {result.recommendation?.nutrient} — {result.recommendation?.status?.toUpperCase()}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {result.recommendation?.message}
            </p>

            <h4 className="section-title" style={{ fontSize: '0.9rem' }}>Suggestions</h4>
            <ul className="result-list">
              {result.recommendation?.suggestions?.map((s, i) => (
                <li key={i}>
                  <strong style={{ color: 'var(--color-green-400)' }}>{s.title}</strong>
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
