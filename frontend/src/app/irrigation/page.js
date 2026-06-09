'use client';

import { useState, useEffect } from 'react';
import { predictIrrigation, getIrrigationHistory, getIrrigationSummary, getSchedules, createSchedule, deleteSchedule } from '@/lib/api';
import { CROP_LIST } from '@/lib/constants';

function Gauge({ value, max, label, color, unit }) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="gauge-container">
      <svg className="gauge-svg" width="160" height="160" viewBox="0 0 160 160">
        <circle className="gauge-track" cx="80" cy="80" r={radius} />
        <circle
          className="gauge-fill"
          cx="80" cy="80" r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-value">
        <span className="gauge-number" style={{ color }}>{typeof value === 'number' ? value.toFixed(1) : value}</span>
        <span className="gauge-label">{unit}</span>
        <span className="gauge-label" style={{ marginTop: '2px', fontSize: '0.65rem' }}>{label}</span>
      </div>
    </div>
  );
}

export default function IrrigationPage() {
  const [summary, setSummary] = useState(null);
  const [schedules, setSchedulesList] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predLoading, setPredLoading] = useState(false);
  const [error, setError] = useState('');

  // Prediction form
  const [predForm, setPredForm] = useState({
    soil_moisture: 45, temperature: 28, humidity: 65,
    crop_type: 'rice', rainfall: 20, recent_water_usage: 3,
  });

  // Schedule form
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedForm, setSchedForm] = useState({
    crop_type: 'rice', zone: 'Zone 1', start_time: '06:00',
    duration_minutes: 30, repeat: 'daily', water_liters: 5,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryData, schedData, histData] = await Promise.all([
        getIrrigationSummary(7).catch(() => null),
        getSchedules().catch(() => ({ schedules: [] })),
        getIrrigationHistory(7).catch(() => ({ data: [] })),
      ]);
      if (summaryData) setSummary(summaryData);
      setSchedulesList(schedData.schedules || []);
      setHistory((histData.data || []).slice(-50));
    } catch (err) {
      // Non-critical, dashboard still shows forms
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredLoading(true);
    setError('');
    try {
      const data = await predictIrrigation(predForm);
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPredLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await createSchedule(schedForm);
      setShowScheduleForm(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const latestReading = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">💧 Smart Irrigation Dashboard</h1>
        <p className="page-subtitle">
          LSTM-powered irrigation predictions with IoT sensor monitoring, automated scheduling, and water usage tracking.
        </p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Real-time gauges */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon green">💧</div>
          <div>
            <div className="stat-value">{summary?.total_water_used_liters?.toFixed(1) || '0'}</div>
            <div className="stat-label">Total water used (L) — 7 days</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🌡️</div>
          <div>
            <div className="stat-value">{summary?.avg_temperature?.toFixed(1) || '—'}°C</div>
            <div className="stat-label">Avg temperature</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">💦</div>
          <div>
            <div className="stat-value">{summary?.avg_soil_moisture?.toFixed(1) || '—'}%</div>
            <div className="stat-label">Avg soil moisture</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">📊</div>
          <div>
            <div className="stat-value">{summary?.readings_count || 0}</div>
            <div className="stat-label">Sensor readings</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left: Prediction Panel */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="section-title">🧠 LSTM Irrigation Prediction</h3>
            <form onSubmit={handlePredict}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Soil Moisture (%)</label>
                  <input type="number" className="form-input" min="0" max="100"
                    value={predForm.soil_moisture}
                    onChange={(e) => setPredForm(p => ({ ...p, soil_moisture: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Temperature (°C)</label>
                  <input type="number" className="form-input"
                    value={predForm.temperature}
                    onChange={(e) => setPredForm(p => ({ ...p, temperature: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Humidity (%)</label>
                  <input type="number" className="form-input" min="0" max="100"
                    value={predForm.humidity}
                    onChange={(e) => setPredForm(p => ({ ...p, humidity: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rainfall (mm)</label>
                  <input type="number" className="form-input" min="0"
                    value={predForm.rainfall}
                    onChange={(e) => setPredForm(p => ({ ...p, rainfall: Number(e.target.value) }))} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Crop Type</label>
                  <select className="form-select" value={predForm.crop_type}
                    onChange={(e) => setPredForm(p => ({ ...p, crop_type: e.target.value }))}>
                    {CROP_LIST.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }} disabled={predLoading}>
                {predLoading ? 'Predicting...' : '🔮 Predict Irrigation'}
              </button>
            </form>
          </div>

          {/* Prediction Result */}
          {prediction && prediction.success && (
            <div className="result-card animate-slide-up" style={{ marginTop: 0 }}>
              <div className="gauge-grid">
                <Gauge value={prediction.water_needed_liters} max={15} label="Water Needed" color="var(--color-blue-400)" unit="Liters" />
                <Gauge value={prediction.duration_minutes} max={120} label="Duration" color="var(--color-amber-400)" unit="Minutes" />
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34,232,122,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-green-400)', marginBottom: '0.5rem' }}>
                  📋 {prediction.schedule_suggestion}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Soil Status: <strong>{prediction.soil_moisture_status}</strong> •
                  Baseline: {prediction.crop_baseline_liters}L/day
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Schedules */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>📅 Irrigation Schedules</h3>
              <button className="btn btn-secondary" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                {showScheduleForm ? 'Cancel' : '+ New'}
              </button>
            </div>

            {showScheduleForm && (
              <form onSubmit={handleCreateSchedule} className="animate-slide-up" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Crop</label>
                    <select className="form-select" value={schedForm.crop_type}
                      onChange={(e) => setSchedForm(p => ({ ...p, crop_type: e.target.value }))}>
                      {CROP_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Zone</label>
                    <select className="form-select" value={schedForm.zone}
                      onChange={(e) => setSchedForm(p => ({ ...p, zone: e.target.value }))}>
                      {['Zone 1', 'Zone 2', 'Zone 3'].map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Start Time</label>
                    <input type="time" className="form-input" value={schedForm.start_time}
                      onChange={(e) => setSchedForm(p => ({ ...p, start_time: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Duration (min)</label>
                    <input type="number" className="form-input" value={schedForm.duration_minutes}
                      onChange={(e) => setSchedForm(p => ({ ...p, duration_minutes: Number(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Repeat</label>
                    <select className="form-select" value={schedForm.repeat}
                      onChange={(e) => setSchedForm(p => ({ ...p, repeat: e.target.value }))}>
                      {['once', 'daily', 'weekly'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Water (L)</label>
                    <input type="number" className="form-input" value={schedForm.water_liters}
                      onChange={(e) => setSchedForm(p => ({ ...p, water_liters: Number(e.target.value) }))} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.75rem' }}>
                  Create Schedule
                </button>
              </form>
            )}

            {schedules.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <p className="empty-state-text">No irrigation schedules yet. Create one to get started.</p>
              </div>
            ) : (
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Zone</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s.id}>
                      <td style={{ textTransform: 'capitalize' }}>{s.crop_type}</td>
                      <td>{s.zone}</td>
                      <td>{s.start_time}</td>
                      <td>{s.duration_minutes}m</td>
                      <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteSchedule(s.id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Sensor Data */}
          {history.length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 className="section-title">📡 Recent Sensor Data</h3>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Moisture</th>
                      <th>Temp</th>
                      <th>Water (L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(-20).reverse().map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '0.8rem' }}>
                          {new Date(r.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>{r.soil_moisture}%</td>
                        <td>{r.temperature}°C</td>
                        <td>{r.water_flow_liters > 0 ? r.water_flow_liters.toFixed(1) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
