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

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-blue-500)'}}>
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
          </svg>
          Smart Irrigation Dashboard
        </h1>
        <p className="page-subtitle">
          LSTM-powered irrigation predictions with IoT sensor monitoring, automated scheduling, and water usage tracking.
        </p>
      </div>

      {error && <div className="alert alert-error">Error: {error}</div>}

      {/* Real-time gauges */}
      <div className="stat-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
            </svg>
          </div>
          <div>
            <div className="stat-value">{summary?.total_water_used_liters?.toFixed(1) || '0'}</div>
            <div className="stat-label">Total water used (L) — 7 days</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
            </svg>
          </div>
          <div>
            <div className="stat-value">{summary?.avg_temperature?.toFixed(1) || '—'}°C</div>
            <div className="stat-label">Avg temperature</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div>
            <div className="stat-value">{summary?.avg_soil_moisture?.toFixed(1) || '—'}%</div>
            <div className="stat-label">Avg soil moisture</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
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
            <h3 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              LSTM Irrigation Prediction
            </h3>
            <form onSubmit={handlePredict}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
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
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }} disabled={predLoading}>
                {predLoading ? 'Predicting...' : 'Predict Irrigation Needs'}
              </button>
            </form>
          </div>

          {/* Prediction Result */}
          {prediction && prediction.success && (
            <div className="result-card" style={{ marginTop: 0 }}>
              <div className="gauge-grid">
                <Gauge value={prediction.water_needed_liters} max={15} label="Water Needed" color="var(--color-blue-500)" unit="Liters" />
                <Gauge value={prediction.duration_minutes} max={120} label="Duration" color="var(--color-amber-500)" unit="Minutes" />
              </div>

              <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-green-600)'}}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  {prediction.schedule_suggestion}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Irrigation Schedules
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowScheduleForm(!showScheduleForm)}>
                {showScheduleForm ? 'Cancel' : 'New Schedule'}
              </button>
            </div>

            {showScheduleForm && (
              <form onSubmit={handleCreateSchedule} className="fade-in" style={{ marginBottom: '2rem', padding: '1.25rem', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Crop</label>
                    <select className="form-select" value={schedForm.crop_type}
                      onChange={(e) => setSchedForm(p => ({ ...p, crop_type: e.target.value }))}>
                      {CROP_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Zone</label>
                    <select className="form-select" value={schedForm.zone}
                      onChange={(e) => setSchedForm(p => ({ ...p, zone: e.target.value }))}>
                      {['Zone 1', 'Zone 2', 'Zone 3'].map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Start Time</label>
                    <input type="time" className="form-input" value={schedForm.start_time}
                      onChange={(e) => setSchedForm(p => ({ ...p, start_time: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Duration (min)</label>
                    <input type="number" className="form-input" value={schedForm.duration_minutes}
                      onChange={(e) => setSchedForm(p => ({ ...p, duration_minutes: Number(e.target.value) }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Repeat</label>
                    <select className="form-select" value={schedForm.repeat}
                      onChange={(e) => setSchedForm(p => ({ ...p, repeat: e.target.value }))}>
                      {['once', 'daily', 'weekly'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Water (L)</label>
                    <input type="number" className="form-input" value={schedForm.water_liters}
                      onChange={(e) => setSchedForm(p => ({ ...p, water_liters: Number(e.target.value) }))} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                  Create Schedule
                </button>
              </form>
            )}

            {schedules.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
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
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'transparent' }}
                          onClick={() => handleDeleteSchedule(s.id)}>Delete</button>
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
              <h3 className="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
                </svg>
                Recent Sensor Data
              </h3>
              <div style={{ maxHeight: '300px', overflow: 'auto', marginTop: '1rem' }}>
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
                        <td style={{ fontSize: '0.85rem' }}>
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
