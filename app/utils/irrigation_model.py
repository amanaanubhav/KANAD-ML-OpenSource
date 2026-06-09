"""
LSTM-based Irrigation Prediction Model for KANAD.

Predicts optimal irrigation duration and water volume based on:
- Soil moisture (from capacitive sensor)
- Temperature, humidity (from weather API / DHT sensor)
- Crop type
- Recent water usage history
- Rainfall
"""

import torch
import torch.nn as nn
import numpy as np
import os

# Crop type encoding (maps crop names to integer IDs)
CROP_TYPES = {
    "rice": 0, "maize": 1, "chickpea": 2, "kidneybeans": 3,
    "pigeonpeas": 4, "mothbeans": 5, "mungbean": 6, "blackgram": 7,
    "lentil": 8, "pomegranate": 9, "banana": 10, "mango": 11,
    "grapes": 12, "watermelon": 13, "muskmelon": 14, "apple": 15,
    "orange": 16, "papaya": 17, "coconut": 18, "cotton": 19,
    "jute": 20, "coffee": 21, "tomato": 22, "potato": 23,
    "corn": 24, "wheat": 25, "sugarcane": 26, "soybean": 27,
}

NUM_CROP_TYPES = len(CROP_TYPES)

# Water needs per crop (liters per m² per day at 50% soil moisture, 25°C)
CROP_WATER_BASELINE = {
    "rice": 8.0, "maize": 5.5, "chickpea": 3.0, "kidneybeans": 4.0,
    "pigeonpeas": 3.5, "mothbeans": 2.5, "mungbean": 3.0, "blackgram": 3.5,
    "lentil": 2.5, "pomegranate": 4.5, "banana": 6.0, "mango": 5.0,
    "grapes": 4.0, "watermelon": 6.5, "muskmelon": 5.5, "apple": 4.5,
    "orange": 5.0, "papaya": 5.5, "coconut": 6.0, "cotton": 5.0,
    "jute": 6.5, "coffee": 4.0, "tomato": 4.5, "potato": 4.0,
    "corn": 5.5, "wheat": 3.5, "sugarcane": 7.0, "soybean": 4.0,
}

# Input features: soil_moisture, temperature, humidity, crop_type_encoded (one-hot placeholder scalar),
#                 recent_water_usage, rainfall
INPUT_SIZE = 6
HIDDEN_SIZE = 64
NUM_LAYERS = 2
OUTPUT_SIZE = 2  # [water_needed_liters, duration_minutes]
SEQUENCE_LENGTH = 24  # Last 24 readings


class IrrigationLSTM(nn.Module):
    """LSTM network for irrigation prediction."""

    def __init__(self, input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE,
                 num_layers=NUM_LAYERS, output_size=OUTPUT_SIZE):
        super(IrrigationLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2 if num_layers > 1 else 0.0
        )

        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(32, output_size),
            nn.ReLU()  # Outputs must be positive
        )

    def forward(self, x):
        # x shape: (batch, seq_len, input_size)
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)

        out, _ = self.lstm(x, (h0, c0))
        # Take the output from the last time step
        out = out[:, -1, :]
        out = self.fc(out)
        return out


def load_irrigation_model(model_path=None):
    """Load the trained LSTM model."""
    if model_path is None:
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'irrigation_lstm.pth')

    model = IrrigationLSTM()

    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        model.eval()
        return model
    else:
        print(f"Warning: LSTM model not found at {model_path}. Using untrained model.")
        model.eval()
        return model


def predict_irrigation(model, soil_moisture, temperature, humidity,
                       crop_type, recent_water_usage=0.0, rainfall=0.0):
    """
    Predict irrigation needs using the LSTM model.

    Args:
        model: trained IrrigationLSTM
        soil_moisture: current soil moisture % (0-100)
        temperature: current temperature in °C
        humidity: current humidity % (0-100)
        crop_type: crop name string
        recent_water_usage: liters used in last irrigation
        rainfall: recent rainfall in mm

    Returns:
        dict with water_needed_liters, duration_minutes, schedule_suggestion
    """
    # Normalize inputs to 0-1 range
    sm_norm = soil_moisture / 100.0
    temp_norm = temperature / 50.0  # Assuming max 50°C
    hum_norm = humidity / 100.0
    crop_norm = CROP_TYPES.get(crop_type.lower(), 0) / NUM_CROP_TYPES
    water_norm = min(recent_water_usage / 20.0, 1.0)
    rain_norm = min(rainfall / 300.0, 1.0)

    # Create a sequence (replicate current reading to fill sequence length)
    # In production, this would use actual historical sensor data
    features = [sm_norm, temp_norm, hum_norm, crop_norm, water_norm, rain_norm]
    sequence = np.array([features] * SEQUENCE_LENGTH, dtype=np.float32)

    # Add some variation to simulate a time series
    for i in range(SEQUENCE_LENGTH):
        noise = np.random.normal(0, 0.02, len(features))
        sequence[i] = np.clip(sequence[i] + noise, 0, 1)

    # Inference
    input_tensor = torch.FloatTensor(sequence).unsqueeze(0)  # (1, seq_len, features)

    with torch.no_grad():
        output = model(input_tensor)

    water_needed = float(output[0][0].item())
    duration = float(output[0][1].item())

    # Apply crop-specific baseline adjustments
    baseline = CROP_WATER_BASELINE.get(crop_type.lower(), 4.0)

    # Heuristic adjustment: if soil moisture is high, reduce water
    moisture_factor = max(0.1, 1.0 - (soil_moisture / 100.0))
    # Rainfall reduces need
    rain_factor = max(0.1, 1.0 - (rainfall / 200.0))
    # Temperature increases need
    temp_factor = 1.0 + max(0, (temperature - 25) * 0.03)

    adjusted_water = max(0.5, baseline * moisture_factor * rain_factor * temp_factor + water_needed)
    adjusted_duration = max(5, int(adjusted_water * 8 + duration))  # ~8 min per liter

    # Schedule suggestion
    if soil_moisture < 30:
        urgency = "Immediate irrigation recommended"
    elif soil_moisture < 50:
        urgency = "Schedule irrigation within 2-4 hours"
    elif soil_moisture < 70:
        urgency = "Irrigation can be scheduled for tomorrow morning"
    else:
        urgency = "Soil moisture is adequate, no immediate irrigation needed"

    return {
        "water_needed_liters": round(adjusted_water, 2),
        "duration_minutes": adjusted_duration,
        "schedule_suggestion": urgency,
        "soil_moisture_status": "Low" if soil_moisture < 30 else "Moderate" if soil_moisture < 60 else "Adequate",
        "crop_baseline_liters": baseline,
        "factors": {
            "moisture_factor": round(moisture_factor, 3),
            "rain_factor": round(rain_factor, 3),
            "temperature_factor": round(temp_factor, 3)
        }
    }
