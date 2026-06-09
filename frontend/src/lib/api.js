const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Generic API fetch wrapper with error handling.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      ...(options.headers || {}),
    },
    ...options,
  };

  // Don't set Content-Type for FormData (let browser set boundary)
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to KANAD API server. Please ensure the backend is running.');
    }
    throw error;
  }
}

// ─── Crop Recommendation ────────────────────────────────────────────────────

export async function predictCrop({ nitrogen, phosphorous, potassium, ph, rainfall, city, temperature, humidity }) {
  return apiFetch('/api/crop-predict', {
    method: 'POST',
    body: JSON.stringify({ nitrogen, phosphorous, potassium, ph, rainfall, city, temperature, humidity }),
  });
}

// ─── Fertilizer Recommendation ──────────────────────────────────────────────

export async function predictFertilizer({ cropname, nitrogen, phosphorous, potassium }) {
  return apiFetch('/api/fertilizer-predict', {
    method: 'POST',
    body: JSON.stringify({ cropname, nitrogen, phosphorous, potassium }),
  });
}

// ─── Disease Detection ──────────────────────────────────────────────────────

export async function predictDisease(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  return apiFetch('/api/disease-predict', {
    method: 'POST',
    body: formData,
  });
}

// ─── Irrigation ─────────────────────────────────────────────────────────────

export async function predictIrrigation({ soil_moisture, temperature, humidity, crop_type, recent_water_usage, rainfall }) {
  return apiFetch('/api/irrigation/predict', {
    method: 'POST',
    body: JSON.stringify({ soil_moisture, temperature, humidity, crop_type, recent_water_usage, rainfall }),
  });
}

export async function postSensorData({ device_id, soil_moisture, water_flow_liters, temperature, humidity, crop_type }) {
  return apiFetch('/api/irrigation/sensor-data', {
    method: 'POST',
    body: JSON.stringify({ device_id, soil_moisture, water_flow_liters, temperature, humidity, crop_type }),
  });
}

export async function getIrrigationHistory(days = 7) {
  return apiFetch(`/api/irrigation/history?days=${days}`);
}

export async function getIrrigationSummary(days = 7) {
  return apiFetch(`/api/irrigation/summary?days=${days}`);
}

export async function createSchedule({ crop_type, zone, start_time, duration_minutes, repeat, water_liters }) {
  return apiFetch('/api/irrigation/schedule', {
    method: 'POST',
    body: JSON.stringify({ crop_type, zone, start_time, duration_minutes, repeat, water_liters }),
  });
}

export async function getSchedules(status) {
  const query = status ? `?status=${status}` : '';
  return apiFetch(`/api/irrigation/schedules${query}`);
}

export async function deleteSchedule(scheduleId) {
  return apiFetch(`/api/irrigation/schedule/${scheduleId}`, {
    method: 'DELETE',
  });
}

export async function getCropList() {
  return apiFetch('/api/crops');
}

export async function healthCheck() {
  return apiFetch('/api/health');
}
