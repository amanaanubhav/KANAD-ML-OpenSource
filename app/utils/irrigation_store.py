"""
File-based data store for irrigation sensor data and schedules.
Uses JSON files to avoid database dependencies for deployment simplicity.
"""

import json
import os
import uuid
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
SENSOR_FILE = os.path.join(DATA_DIR, 'sensor_data.json')
SCHEDULE_FILE = os.path.join(DATA_DIR, 'schedules.json')


def _ensure_data_dir():
    """Create data directory if it doesn't exist."""
    os.makedirs(DATA_DIR, exist_ok=True)


def _read_json(filepath):
    """Read JSON file, return empty list if not found."""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def _write_json(filepath, data):
    """Write data to JSON file."""
    _ensure_data_dir()
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, default=str)


# ─── Sensor Data ────────────────────────────────────────────────────────────────

def record_sensor_data(device_id, soil_moisture, water_flow_liters,
                       temperature=None, humidity=None, crop_type=None):
    """
    Record a sensor reading from IoT device.

    Args:
        device_id: identifier for the sensor/zone
        soil_moisture: soil moisture percentage (0-100)
        water_flow_liters: water flow reading in liters
        temperature: optional temperature reading
        humidity: optional humidity reading
        crop_type: optional crop type for this zone

    Returns:
        dict with the recorded entry
    """
    data = _read_json(SENSOR_FILE)

    entry = {
        "id": str(uuid.uuid4())[:8],
        "device_id": device_id,
        "timestamp": datetime.utcnow().isoformat(),
        "soil_moisture": round(float(soil_moisture), 2),
        "water_flow_liters": round(float(water_flow_liters), 3),
        "temperature": round(float(temperature), 1) if temperature is not None else None,
        "humidity": round(float(humidity), 1) if humidity is not None else None,
        "crop_type": crop_type
    }

    data.append(entry)

    # Keep only last 5000 entries to prevent file from growing indefinitely
    if len(data) > 5000:
        data = data[-5000:]

    _write_json(SENSOR_FILE, data)
    return entry


def get_sensor_history(days=7, device_id=None):
    """
    Get sensor readings from the last N days.

    Args:
        days: number of days to look back
        device_id: optional filter by device

    Returns:
        list of sensor readings
    """
    data = _read_json(SENSOR_FILE)
    cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()

    filtered = [
        entry for entry in data
        if entry.get("timestamp", "") >= cutoff
        and (device_id is None or entry.get("device_id") == device_id)
    ]

    return filtered


def get_sensor_summary(days=7):
    """
    Get aggregate stats from sensor data.

    Returns:
        dict with total_water_used, avg_soil_moisture, readings_count, etc.
    """
    history = get_sensor_history(days=days)

    if not history:
        return {
            "total_water_used_liters": 0,
            "avg_soil_moisture": 0,
            "avg_temperature": 0,
            "avg_humidity": 0,
            "readings_count": 0,
            "period_days": days
        }

    total_water = sum(e.get("water_flow_liters", 0) for e in history)
    moistures = [e["soil_moisture"] for e in history if e.get("soil_moisture") is not None]
    temps = [e["temperature"] for e in history if e.get("temperature") is not None]
    humids = [e["humidity"] for e in history if e.get("humidity") is not None]

    return {
        "total_water_used_liters": round(total_water, 2),
        "avg_soil_moisture": round(sum(moistures) / len(moistures), 1) if moistures else 0,
        "avg_temperature": round(sum(temps) / len(temps), 1) if temps else 0,
        "avg_humidity": round(sum(humids) / len(humids), 1) if humids else 0,
        "readings_count": len(history),
        "period_days": days
    }


# ─── Irrigation Schedules ───────────────────────────────────────────────────────

def create_schedule(crop_type, zone, start_time, duration_minutes,
                    repeat="daily", water_liters=None):
    """
    Create an irrigation schedule.

    Args:
        crop_type: type of crop in this zone
        zone: zone identifier (e.g., "Zone 1")
        start_time: when to start irrigation (ISO time string)
        duration_minutes: how long to irrigate
        repeat: "once", "daily", "weekly", "custom"
        water_liters: estimated water volume

    Returns:
        dict with the created schedule
    """
    schedules = _read_json(SCHEDULE_FILE)

    schedule = {
        "id": str(uuid.uuid4())[:8],
        "crop_type": crop_type,
        "zone": zone,
        "start_time": start_time,
        "duration_minutes": int(duration_minutes),
        "repeat": repeat,
        "water_liters": round(float(water_liters), 2) if water_liters else None,
        "status": "active",
        "created_at": datetime.utcnow().isoformat(),
        "last_executed": None,
        "execution_count": 0
    }

    schedules.append(schedule)
    _write_json(SCHEDULE_FILE, schedules)
    return schedule


def get_schedules(status=None):
    """
    Get all irrigation schedules.

    Args:
        status: optional filter ("active", "paused", "completed")

    Returns:
        list of schedule objects
    """
    schedules = _read_json(SCHEDULE_FILE)

    if status:
        schedules = [s for s in schedules if s.get("status") == status]

    return schedules


def update_schedule(schedule_id, updates):
    """
    Update an existing schedule.

    Args:
        schedule_id: the schedule ID to update
        updates: dict of fields to update

    Returns:
        updated schedule or None if not found
    """
    schedules = _read_json(SCHEDULE_FILE)

    for i, s in enumerate(schedules):
        if s.get("id") == schedule_id:
            allowed_fields = {"status", "start_time", "duration_minutes", "repeat",
                              "water_liters", "last_executed", "execution_count"}
            for key, value in updates.items():
                if key in allowed_fields:
                    schedules[i][key] = value
            _write_json(SCHEDULE_FILE, schedules)
            return schedules[i]

    return None


def delete_schedule(schedule_id):
    """
    Delete a schedule by ID.

    Returns:
        True if deleted, False if not found
    """
    schedules = _read_json(SCHEDULE_FILE)
    original_len = len(schedules)

    schedules = [s for s in schedules if s.get("id") != schedule_id]

    if len(schedules) < original_len:
        _write_json(SCHEDULE_FILE, schedules)
        return True
    return False


# ─── Demo Data Generation ───────────────────────────────────────────────────────

def generate_demo_sensor_data(days=14, readings_per_day=24):
    """
    Generate realistic synthetic sensor data for demo purposes.
    Simulates a rice paddy with moisture sensor and water flow sensor.
    """
    import random

    data = []
    base_time = datetime.utcnow() - timedelta(days=days)
    soil_moisture = 65.0  # Starting moisture

    for day in range(days):
        for hour in range(readings_per_day):
            timestamp = base_time + timedelta(days=day, hours=hour)

            # Temperature follows daily cycle (cooler at night, warmer midday)
            base_temp = 22 + 8 * abs((hour - 14) / 14.0 - 1)  # Peak at 2pm
            temperature = base_temp + random.gauss(0, 1.5)

            # Humidity inversely correlates with temperature
            humidity = max(30, min(95, 85 - (temperature - 22) * 1.5 + random.gauss(0, 3)))

            # Soil moisture decreases over time (evapotranspiration)
            evaporation = 0.3 + 0.1 * max(0, temperature - 20) / 10
            soil_moisture -= evaporation + random.gauss(0, 0.2)

            # Simulate rainfall occasionally (20% chance per day, once per day at random hour)
            water_flow = 0.0
            rainfall = random.random() < 0.01  # ~24% per day
            if rainfall:
                rain_amount = random.uniform(5, 30)
                soil_moisture += rain_amount * 0.3

            # Simulate irrigation when soil moisture drops below threshold
            if soil_moisture < 35 and hour in [6, 7, 18, 19]:  # Irrigate morning/evening
                water_flow = random.uniform(2.0, 6.0)
                soil_moisture += water_flow * 3.5  # Each liter raises moisture ~3.5%

            soil_moisture = max(10, min(95, soil_moisture))

            entry = {
                "id": str(uuid.uuid4())[:8],
                "device_id": "esp8266-zone1",
                "timestamp": timestamp.isoformat(),
                "soil_moisture": round(soil_moisture, 1),
                "water_flow_liters": round(water_flow, 3),
                "temperature": round(temperature, 1),
                "humidity": round(humidity, 1),
                "crop_type": "rice"
            }
            data.append(entry)

    _ensure_data_dir()
    _write_json(SENSOR_FILE, data)
    print(f"Generated {len(data)} demo sensor readings over {days} days")
    return data
