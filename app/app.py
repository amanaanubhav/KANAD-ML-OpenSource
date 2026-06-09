"""
KANAD Backend API — Flask REST API for Smart Agriculture Platform.

Endpoints:
  POST /api/crop-predict         — Crop recommendation (Random Forest)
  POST /api/fertilizer-predict   — Fertilizer recommendation
  POST /api/disease-predict      — Plant disease detection (ResNet9)
  POST /api/irrigation/predict   — LSTM irrigation prediction
  POST /api/irrigation/sensor-data — Record IoT sensor data
  GET  /api/irrigation/history   — Sensor data history
  GET  /api/irrigation/summary   — Aggregate stats
  POST /api/irrigation/schedule  — Create irrigation schedule
  GET  /api/irrigation/schedules — List schedules
  DELETE /api/irrigation/schedule/<id> — Delete schedule
  GET  /api/health               — Health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from utils.disease import disease_dic
from utils.fertilizer import fertilizer_dic
import requests
import config
import pickle
import io
import os
import torch
from torchvision import transforms
from PIL import Image
from utils.model import ResNet9
from utils.irrigation_model import (
    load_irrigation_model, predict_irrigation, CROP_TYPES, CROP_WATER_BASELINE
)
from utils.irrigation_store import (
    record_sensor_data, get_sensor_history, get_sensor_summary,
    create_schedule, get_schedules, update_schedule, delete_schedule
)

# ═══════════════════════════════════════════════════════════════════════════════
# MODEL LOADING
# ═══════════════════════════════════════════════════════════════════════════════

# Disease detection classes
disease_classes = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust',
    'Apple___healthy', 'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
    'Peach___healthy', 'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy',
    'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight',
    'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# Load disease detection model (ResNet9 / PyTorch)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
disease_model_path = os.path.join(BASE_DIR, '..', 'models', 'plant_disease_model.pth')
disease_model = ResNet9(3, len(disease_classes))
disease_model.load_state_dict(
    torch.load(disease_model_path, map_location=torch.device('cpu'))
)
disease_model.eval()

# Load crop recommendation model (Random Forest / scikit-learn)
crop_model_path = os.path.join(BASE_DIR, '..', 'models', 'RandomForest.pkl')
crop_recommendation_model = pickle.load(open(crop_model_path, 'rb'))

# Load LSTM irrigation model
irrigation_model = load_irrigation_model()


# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def weather_fetch(city_name):
    """Fetch temperature and humidity for a city from OpenWeatherMap."""
    api_key = config.weather_api_key
    if not api_key:
        return None

    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    complete_url = f"{base_url}appid={api_key}&q={city_name}"

    try:
        response = requests.get(complete_url, timeout=10)
        data = response.json()

        if data.get("cod") != 404 and "main" in data:
            main = data["main"]
            temperature = round(main["temp"] - 273.15, 2)
            humidity = main["humidity"]
            return {"temperature": temperature, "humidity": humidity}
        return None
    except requests.RequestException:
        return None


def predict_disease_image(img_bytes):
    """Run disease detection on an uploaded image."""
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.ToTensor(),
    ])
    image = Image.open(io.BytesIO(img_bytes))
    img_t = transform(image)
    img_u = torch.unsqueeze(img_t, 0)

    with torch.no_grad():
        yb = disease_model(img_u)
    _, preds = torch.max(yb, dim=1)
    prediction_key = disease_classes[preds[0].item()]

    return prediction_key


# ═══════════════════════════════════════════════════════════════════════════════
# FLASK APP
# ═══════════════════════════════════════════════════════════════════════════════

app = Flask(__name__)
CORS(app, origins=config.cors_origins, supports_credentials=True)


# ─── Health Check ────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "models_loaded": {
            "disease_detection": disease_model is not None,
            "crop_recommendation": crop_recommendation_model is not None,
            "irrigation_lstm": irrigation_model is not None
        },
        "version": "2.0.0"
    })


# ─── Crop Recommendation ────────────────────────────────────────────────────

@app.route('/api/crop-predict', methods=['POST'])
def crop_prediction():
    try:
        data = request.get_json()

        N = int(data['nitrogen'])
        P = int(data['phosphorous'])
        K = int(data['potassium'])
        ph = float(data['ph'])
        rainfall = float(data['rainfall'])
        city = data.get('city', '')

        weather = weather_fetch(city) if city else None

        if weather is None:
            # Use provided values or defaults
            temperature = float(data.get('temperature', 25))
            humidity = float(data.get('humidity', 70))
        else:
            temperature = weather['temperature']
            humidity = weather['humidity']

        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        prediction = crop_recommendation_model.predict(features)
        crop = prediction[0]

        return jsonify({
            "success": True,
            "crop": crop,
            "temperature": temperature,
            "humidity": humidity,
            "city": city,
            "input_features": {
                "nitrogen": N,
                "phosphorous": P,
                "potassium": K,
                "ph": ph,
                "rainfall": rainfall
            }
        })

    except KeyError as e:
        return jsonify({"success": False, "error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Fertilizer Recommendation ──────────────────────────────────────────────

@app.route('/api/fertilizer-predict', methods=['POST'])
def fertilizer_prediction():
    try:
        data = request.get_json()

        crop_name = str(data['cropname'])
        N = int(data['nitrogen'])
        P = int(data['phosphorous'])
        K = int(data['potassium'])

        df = pd.read_csv(os.path.join('Data', 'fertilizer.csv'))

        crop_data = df[df['Crop'] == crop_name]
        if crop_data.empty:
            return jsonify({
                "success": False,
                "error": f"Crop '{crop_name}' not found in database",
                "available_crops": df['Crop'].tolist()
            }), 404

        nr = int(crop_data['N'].iloc[0])
        pr = int(crop_data['P'].iloc[0])
        kr = int(crop_data['K'].iloc[0])

        n_diff = nr - N
        p_diff = pr - P
        k_diff = kr - K

        temp = {abs(n_diff): "N", abs(p_diff): "P", abs(k_diff): "K"}
        max_value = temp[max(temp.keys())]

        if max_value == "N":
            key = 'NHigh' if n_diff < 0 else 'Nlow'
        elif max_value == "P":
            key = 'PHigh' if p_diff < 0 else 'Plow'
        else:
            key = 'KHigh' if k_diff < 0 else 'Klow'

        recommendation = fertilizer_dic.get(key, {})

        return jsonify({
            "success": True,
            "key": key,
            "recommendation": recommendation,
            "analysis": {
                "nitrogen": {"current": N, "required": nr, "diff": n_diff},
                "phosphorous": {"current": P, "required": pr, "diff": p_diff},
                "potassium": {"current": K, "required": kr, "diff": k_diff},
                "most_deficient": max_value
            }
        })

    except KeyError as e:
        return jsonify({"success": False, "error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Disease Detection ──────────────────────────────────────────────────────

@app.route('/api/disease-predict', methods=['POST'])
def disease_detection():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({"success": False, "error": "Empty file"}), 400

        img_bytes = file.read()
        prediction_key = predict_disease_image(img_bytes)

        # Get structured disease info
        disease_info = disease_dic.get(prediction_key, {
            "crop": "Unknown",
            "disease": "Unknown",
            "is_healthy": False,
            "cause": [],
            "prevention": []
        })

        return jsonify({
            "success": True,
            "prediction_key": prediction_key,
            "crop": disease_info.get("crop", "Unknown"),
            "disease": disease_info.get("disease", "Unknown"),
            "is_healthy": disease_info.get("is_healthy", False),
            "cause": disease_info.get("cause", []),
            "prevention": disease_info.get("prevention", [])
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Irrigation Prediction ──────────────────────────────────────────────────

@app.route('/api/irrigation/predict', methods=['POST'])
def irrigation_prediction():
    try:
        data = request.get_json()

        soil_moisture = float(data['soil_moisture'])
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 60))
        crop_type = str(data.get('crop_type', 'rice'))
        recent_water = float(data.get('recent_water_usage', 0))
        rainfall = float(data.get('rainfall', 0))

        result = predict_irrigation(
            model=irrigation_model,
            soil_moisture=soil_moisture,
            temperature=temperature,
            humidity=humidity,
            crop_type=crop_type,
            recent_water_usage=recent_water,
            rainfall=rainfall
        )

        result["success"] = True
        return jsonify(result)

    except KeyError as e:
        return jsonify({"success": False, "error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── IoT Sensor Data ────────────────────────────────────────────────────────

@app.route('/api/irrigation/sensor-data', methods=['POST'])
def sensor_data_endpoint():
    try:
        data = request.get_json()

        entry = record_sensor_data(
            device_id=data.get('device_id', 'unknown'),
            soil_moisture=data['soil_moisture'],
            water_flow_liters=data.get('water_flow_liters', 0),
            temperature=data.get('temperature'),
            humidity=data.get('humidity'),
            crop_type=data.get('crop_type')
        )

        return jsonify({"success": True, "recorded": entry})

    except KeyError as e:
        return jsonify({"success": False, "error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/irrigation/history', methods=['GET'])
def sensor_history_endpoint():
    try:
        days = int(request.args.get('days', 7))
        device_id = request.args.get('device_id')

        history = get_sensor_history(days=days, device_id=device_id)

        return jsonify({
            "success": True,
            "data": history,
            "count": len(history),
            "period_days": days
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/irrigation/summary', methods=['GET'])
def sensor_summary_endpoint():
    try:
        days = int(request.args.get('days', 7))
        summary = get_sensor_summary(days=days)

        return jsonify({"success": True, **summary})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Irrigation Schedules ───────────────────────────────────────────────────

@app.route('/api/irrigation/schedule', methods=['POST'])
def create_schedule_endpoint():
    try:
        data = request.get_json()

        schedule = create_schedule(
            crop_type=data.get('crop_type', 'rice'),
            zone=data.get('zone', 'Zone 1'),
            start_time=data['start_time'],
            duration_minutes=data['duration_minutes'],
            repeat=data.get('repeat', 'daily'),
            water_liters=data.get('water_liters')
        )

        return jsonify({"success": True, "schedule": schedule}), 201

    except KeyError as e:
        return jsonify({"success": False, "error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/irrigation/schedules', methods=['GET'])
def list_schedules_endpoint():
    try:
        status = request.args.get('status')
        schedules = get_schedules(status=status)

        return jsonify({
            "success": True,
            "schedules": schedules,
            "count": len(schedules)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/irrigation/schedule/<schedule_id>', methods=['DELETE'])
def delete_schedule_endpoint(schedule_id):
    try:
        deleted = delete_schedule(schedule_id)

        if deleted:
            return jsonify({"success": True, "message": "Schedule deleted"})
        return jsonify({"success": False, "error": "Schedule not found"}), 404

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Utility Endpoints ──────────────────────────────────────────────────────

@app.route('/api/crops', methods=['GET'])
def list_crops():
    """List all supported crops for irrigation prediction."""
    return jsonify({
        "success": True,
        "crops": list(CROP_TYPES.keys()),
        "water_baselines": CROP_WATER_BASELINE
    })


@app.route('/api/diseases', methods=['GET'])
def list_diseases():
    """List all detectable diseases."""
    diseases = []
    for key, info in disease_dic.items():
        diseases.append({
            "key": key,
            "crop": info.get("crop", ""),
            "disease": info.get("disease", ""),
            "is_healthy": info.get("is_healthy", False)
        })
    return jsonify({"success": True, "diseases": diseases, "count": len(diseases)})


# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.port, debug=False)
