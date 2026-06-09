# 🌿 KANAD — Smart Agriculture Intelligence Platform

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-green.svg)](https://python.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-orange.svg)](https://pytorch.org)

**KANAD** is a full-stack AI-powered agricultural platform that combines machine learning, deep learning, and IoT sensor integration to help farmers optimize crop selection, detect plant diseases, manage fertilization, and automate irrigation.

> Built collaboratively by **Aman Anubhav**, **Ansh Tiwari**, **Arshroop Saini**, **Jiho Lee**, and **Riya Kathpalia**.

---

## 🎯 Core Features

| Feature | Model / Technology | Description |
|---------|-------------------|-------------|
| 🌾 **Crop Recommendation** | Random Forest (scikit-learn) | Predicts optimal crop based on soil NPK, pH, rainfall, and weather |
| 🧪 **Fertilizer Recommendation** | Rule-based + NPK analysis | Identifies nutrient deficiencies and provides correction strategies |
| 🔬 **Disease Detection** | ResNet9 (PyTorch) — 38 classes | Upload a leaf image → identifies disease with cause & treatment |
| 💧 **Smart Irrigation** | LSTM (PyTorch) + IoT sensors | Predicts water needs, manages schedules, tracks usage via sensors |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│            VERCEL (Frontend)                 │
│     Next.js 14 (App Router + React)          │
│                                              │
│  /                    → Landing Dashboard    │
│  /crop-recommend      → Crop Predictor       │
│  /fertilizer          → Fertilizer Advisor   │
│  /disease-detect      → Disease AI           │
│  /irrigation          → Smart Irrigation     │
└───────────────┬──────────────────────────────┘
                │ HTTPS REST API (JSON)
                ▼
┌──────────────────────────────────────────────┐
│            RENDER (Backend)                  │
│      Flask + Gunicorn + CORS                 │
│                                              │
│  POST /api/crop-predict      (Random Forest) │
│  POST /api/fertilizer-predict                │
│  POST /api/disease-predict   (ResNet9 CNN)   │
│  POST /api/irrigation/predict (LSTM)         │
│  POST /api/irrigation/sensor-data (IoT in)   │
│  GET  /api/irrigation/history                │
│  POST /api/irrigation/schedule               │
│  GET  /api/health                            │
└──────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
KANAD-ML-OpenSource/
├── app/                          # Backend (Flask API)
│   ├── app.py                    # Main Flask REST API
│   ├── config.py                 # Environment-based config
│   ├── requirements.txt          # Python dependencies
│   ├── Procfile                  # Render start command
│   ├── train_irrigation.py       # LSTM training script
│   ├── models/
│   │   ├── RandomForest.pkl      # Crop recommendation model
│   │   ├── plant_disease_model.pth  # ResNet9 disease model
│   │   └── irrigation_lstm.pth   # LSTM irrigation model
│   ├── utils/
│   │   ├── model.py              # ResNet9 architecture
│   │   ├── disease.py            # Disease info database
│   │   ├── fertilizer.py         # Fertilizer recommendations
│   │   ├── irrigation_model.py   # LSTM model + inference
│   │   └── irrigation_store.py   # Sensor data & schedule store
│   └── Data/
│       └── fertilizer.csv        # Crop NPK requirements
│
├── frontend/                     # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js         # Root layout + sidebar
│   │   │   ├── page.js           # Landing page
│   │   │   ├── globals.css       # Design system
│   │   │   ├── crop-recommend/   # Crop recommendation
│   │   │   ├── fertilizer/       # Fertilizer advisor
│   │   │   ├── disease-detect/   # Disease detection
│   │   │   └── irrigation/       # Smart irrigation dashboard
│   │   ├── components/
│   │   │   └── Sidebar.js        # Navigation sidebar
│   │   └── lib/
│   │       ├── api.js            # API client
│   │       └── constants.js      # App constants
│   ├── package.json
│   └── vercel.json
│
├── Data-processed/               # Training datasets
├── render.yaml                   # Render deployment blueprint
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
cd app

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key

# Train LSTM irrigation model (first time only)
python train_irrigation.py

# Start the API server
python app.py
```

Backend runs at `http://localhost:5000`. Verify with:
```bash
curl http://localhost:5000/api/health
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## 🌐 Deployment

### Backend → Render

1. Push to GitHub
2. Connect repo on [Render](https://render.com)
3. Select **Blueprint** deployment (uses `render.yaml`)
4. Set `WEATHER_API_KEY` in Render dashboard

### Frontend → Vercel

1. Import `frontend/` directory on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
   ```

---

## 🤖 ML Models

### Crop Recommendation — Random Forest
- **Framework**: scikit-learn
- **Features**: N, P, K, temperature, humidity, pH, rainfall
- **Classes**: 22 crop types
- **Data**: 2,200 samples from `crop_recommendation.csv`

### Disease Detection — ResNet9 CNN
- **Framework**: PyTorch
- **Architecture**: 9-layer ResNet with residual blocks
- **Classes**: 38 (across 14 crop varieties)
- **Input**: 256×256 RGB leaf images
- **Accuracy**: 99.2% on test set

### Irrigation Prediction — LSTM
- **Framework**: PyTorch
- **Architecture**: 2-layer LSTM, 64 hidden units
- **Input**: Sequence of 24 readings (soil moisture, temp, humidity, crop, water usage, rainfall)
- **Output**: Water volume (liters) + irrigation duration (minutes)
- **Training**: Synthetic data based on crop-specific water baselines

---

## 📡 IoT Integration

The irrigation system accepts sensor data via REST API, designed for ESP8266/ESP32 + sensors:

| Sensor | Endpoint | Data |
|--------|----------|------|
| Capacitive soil moisture | `POST /api/irrigation/sensor-data` | `soil_moisture: 0-100%` |
| Water flow meter | `POST /api/irrigation/sensor-data` | `water_flow_liters: float` |
| DHT11/22 (temp/humidity) | `POST /api/irrigation/sensor-data` | `temperature`, `humidity` |

**Arduino/ESP8266 example:**
```cpp
HTTPClient http;
http.begin("https://your-api.onrender.com/api/irrigation/sensor-data");
http.addHeader("Content-Type", "application/json");
http.POST("{\"device_id\":\"esp-01\",\"soil_moisture\":42.5,\"water_flow_liters\":1.2}");
```

---

## 🧪 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + model status |
| `POST` | `/api/crop-predict` | Crop recommendation |
| `POST` | `/api/fertilizer-predict` | Fertilizer recommendation |
| `POST` | `/api/disease-predict` | Disease detection (image upload) |
| `POST` | `/api/irrigation/predict` | LSTM irrigation prediction |
| `POST` | `/api/irrigation/sensor-data` | Record IoT sensor reading |
| `GET` | `/api/irrigation/history?days=7` | Sensor data history |
| `GET` | `/api/irrigation/summary?days=7` | Aggregate statistics |
| `POST` | `/api/irrigation/schedule` | Create irrigation schedule |
| `GET` | `/api/irrigation/schedules` | List schedules |
| `DELETE` | `/api/irrigation/schedule/:id` | Delete schedule |
| `GET` | `/api/crops` | List supported crops |

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** — see [LICENSE](LICENSE) for details.

---

## 👥 Team

| Member | Role |
|--------|------|
| **Aman Anubhav** | Project Lead, AI/ML |
| **Arshroop Saini** | AI/ML & IoT Integration |
| **Ansh Tiwari** | AI/ML Development |
| **Jiho Lee** | Backend & API |
| **Riya Kathpalia** | Frontend & UI |
