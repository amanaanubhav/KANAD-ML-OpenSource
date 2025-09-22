
# 🌿 KANAD - Smart Agriculture Intelligence Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-red.svg)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.10+-FF6F00.svg)](https://tensorflow.org)
[![IoT Ready](https://img.shields.io/badge/IoT-Ready-green.svg)](https://github.com/Arshroop-Saini/Kanad-Integrating-ML-and-IoT/tree/Kanad-IoT-Arduino)

**AI-Powered Agricultural Assistant for Crop Optimization, Disease Detection & Smart Irrigation**

[Demo Video](#demo) • [IoT Implementation](https://github.com/Arshroop-Saini/Kanad-Integrating-ML-and-IoT/tree/Kanad-IoT-Arduino) • [Live Demo](https://kanad.onrender.com/) • [Presentation](#presentation)

</div>

---

## 🚀 Overview

KANAD addresses critical agricultural challenges through the **Nexus of Food, Water, and Energy**, leveraging machine learning and IoT technologies to optimize farming practices. Our platform tackles the massive inefficiencies in global agriculture where 2 quadrillion gallons of water are wasted annually, 2.2 quadrillion KJ of energy is consumed, and 1.2 billion tonnes of food is lost before leaving the farm.

### 🎯 Mission Statement
*"One Step Closer to Energy Efficient Agriculture"*

Transforming traditional farming through AI-driven insights that enable farmers to maximize yield while minimizing resource waste and environmental impact.

---

## 📊 Global Impact Scale

| **Problem** | **Current Scale** | **Potential Savings** |
|-------------|-------------------|----------------------|
| 💧 **Water Waste** | 2 Quadrillion gallons/year | 10,800 m³ per acre/year |
| ⚡ **Energy Usage** | 2.2 Quadrillion KJ/year | 2.2 Quadrillion KJ/year |
| 🍃 **Food Loss** | 1.2 billion tonnes/year | Feeds US for 3.64 years |
| 💰 **Economic Impact** | $30 billion/year | Significant cost reduction |

*Sources: FAO-UN, USDA, OECD*

---

## ✨ Core Features

### 🌾 **Crop Recommendation System**
- **Smart Analysis**: Input soil NPK levels, pH, rainfall, and location
- **Weather Integration**: Real-time weather data from OpenWeatherMap API
- **ML Prediction**: Random Forest algorithm for optimal crop selection
- **Location-Aware**: State and city-based recommendations

### 🧪 **Fertilizer Recommendation Engine**
- **Soil Analysis**: NPK ratio analysis and deficiency detection
- **Intelligent Suggestions**: Personalized fertilizer recommendations
- **Cost Optimization**: Suggests most cost-effective fertilizer solutions
- **Organic Options**: Promotes sustainable farming practices

### 🔬 **Plant Disease Detection**
- **Image Recognition**: ResNet50-based CNN for disease identification
- **Multi-Crop Support**: 14 different crop varieties supported
- **Instant Results**: Real-time disease diagnosis from leaf images
- **Treatment Guidance**: Comprehensive cure and prevention suggestions

### 💧 **Smart Irrigation System** (IoT)
- **Automated Scheduling**: Time-based and sensor-driven irrigation
- **Real-time Monitoring**: Live soil moisture and environmental tracking
- **Zone Management**: Multi-zone irrigation control
- **Historical Analytics**: Irrigation performance tracking and optimization

---

## 🏗️ System Architecture

### Core Components
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   ML Engine      │    │   IoT Network   │
│   React.js      │◄──►│   TensorFlow     │◄──►│   ESP8266       │
│   Bootstrap     │    │   scikit-learn   │    │   Sensors       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Backend API   │    │   Data Pipeline  │    │   Database      │
│   Flask/Node.js │    │   Data Processing│    │   MongoDB       │
│   RESTful APIs  │    │   Model Training │    │   Redis Cache   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 💻 Tech Stack

### 🎨 **Frontend**
- **React.js 18** - Modern UI framework with component-based architecture
- **Bootstrap 5** - Responsive design and UI components
- **JavaScript ES6+** - Enhanced user interactions
- **HTML5/CSS3** - Semantic markup and styling

### ⚙️ **Backend & APIs**
- **Flask 2.0+** - Lightweight Python web framework
- **Node.js** - JavaScript runtime for API services
- **RESTful APIs** - Standardized data communication
- **JWT Authentication** - Secure user authentication

### 🧠 **AI/ML Stack**
- **TensorFlow 2.10+** - Deep learning framework
- **ResNet50** - Pre-trained CNN for image classification
- **scikit-learn** - Traditional ML algorithms (Random Forest)
- **OpenCV** - Computer vision and image processing
- **NumPy & Pandas** - Data manipulation and analysis
- **Matplotlib** - Data visualization

### 🌐 **IoT & Hardware**
- **ESP8266/NodeMCU** - WiFi-enabled microcontroller
- **Raspberry Pi** - Edge computing and data processing
- **Capacitive Soil Sensors** - Moisture level monitoring
- **Relay Modules** - Automated irrigation control
- **Water Pumps** - Precise irrigation delivery

### 🗄️ **Data & Infrastructure**
- **MongoDB** - Document-based database
- **Redis** - In-memory caching
- **Render** - Cloud deployment platform
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB 4.4+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kanad-smart-agriculture.git
   cd kanad-smart-agriculture
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Set environment variables
   export WEATHER_API_KEY="your_openweathermap_key"
   export MONGO_URI="your_mongodb_connection_string"
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Run the Application**
   ```bash
   # Backend
   python app.py

   # Frontend (separate terminal)
   cd frontend && npm start
   ```

5. **Access the Platform**
   - Local: http://localhost:5000
   - Production: https://kanad.onrender.com

---

## 📱 Usage Guide

### 🌾 Crop Recommendation
1. **Input Soil Parameters**
   - Nitrogen (N), Phosphorus (P), Potassium (K) levels
   - Soil pH value (0-14 scale)
   - Average rainfall in mm

2. **Location Details**
   - Select your state and city
   - System fetches real-time weather data

3. **Get Recommendations**
   - AI analyzes all parameters
   - Suggests optimal crop for your conditions
   - Provides yield predictions

### 🧪 Fertilizer Analysis
1. **Soil Testing Input**
   - Current NPK levels in your soil
   - Target crop selection

2. **Deficiency Detection**
   - System identifies nutrient excess/deficiency
   - Calculates optimal fertilizer ratios

3. **Purchase Guidance**
   - Specific fertilizer recommendations
   - Application rates and timing
   - Cost-effective alternatives

### 🔬 Disease Detection
1. **Image Upload**
   - Capture clear leaf images
   - Upload through web interface

2. **AI Analysis**
   - ResNet50 model processes image
   - Identifies crop type and disease

3. **Treatment Plan**
   - Disease information and symptoms
   - Step-by-step cure instructions
   - Prevention strategies

---

## 🌐 IoT Integration

### Smart Irrigation Features
- **Automated Scheduling**: Program irrigation based on crop needs
- **Sensor Integration**: Real-time soil moisture monitoring
- **Remote Control**: Mobile-friendly dashboard for farm management
- **Data Analytics**: Historical irrigation patterns and optimization

### Hardware Components
```
Raspberry Pi Zero ──┬── NodeMCU ESP8266 (Zone 1)
                   ├── NodeMCU ESP8266 (Zone 2)
                   ├── NodeMCU ESP8266 (Zone 3)
                   └── Relay Control Module
                        │
                        ├── Water Pump 1
                        ├── Water Pump 2
                        └── Water Pump 3
```

**For IoT Implementation**: [Visit IoT Branch](https://github.com/Arshroop-Saini/Kanad-Integrating-ML-and-IoT/tree/Kanad-IoT-Arduino)

---

## 📊 Supported Crops

<details>
<summary>14 Crop Varieties Supported for Disease Detection</summary>

- 🍎 **Apple** - Common diseases: Apple Scab, Black Rot, Cedar Apple Rust
- 🫐 **Blueberry** - Healthy monitoring and disease detection
- 🍒 **Cherry** - Powdery Mildew and other common diseases
- 🌽 **Corn** - Gray Leaf Spot, Common Rust, Northern Blight
- 🍇 **Grape** - Black Measles, Leaf Blight, Isariopsis Leaf Spot
- 🌶️ **Pepper** - Bacterial Spot detection and analysis
- 🍊 **Orange** - Citrus Greening and bacterial canker
- 🍑 **Peach** - Bacterial Spot identification
- 🥔 **Potato** - Early Blight, Late Blight detection
- 🌱 **Soybean** - Various leaf diseases
- 🍓 **Strawberry** - Leaf Scorch and other conditions
- 🍅 **Tomato** - Multiple disease detection capabilities
- 🥒 **Squash** - Powdery Mildew detection
- 🫐 **Raspberry** - Disease monitoring and identification

</details>

---

## 📈 Model Performance

### Disease Detection Model (ResNet50)
- **Training Accuracy**: 99.61%
- **Validation Accuracy**: 95%+ 
- **Model Improvement**: 51% increase in accuracy
- **Loss Reduction**: 95% improvement in validation loss

### Crop Recommendation Model (Random Forest)
- **Feature Importance**: NPK levels, pH, rainfall, temperature
- **Weather Integration**: Real-time API data incorporation
- **Location Accuracy**: State and city-specific recommendations
- **Prediction Confidence**: High accuracy for Indian agricultural conditions

---

## 👥 Team

| Role | Contributor | Expertise | Contact |
|------|-------------|-----------|---------|
| 🧠 **AI/ML** | **Ansh** | Machine Learning & Data Science | - |
| 🤖 **AI/ML** | **Aman** | Deep Learning & Computer Vision | [LinkedIn](https://linkedin.com/in/aman-anubhav-5055b6220) |
| ⚙️ **Backend/API** | **Jiho Lee** | API Development & System Integration | - |
| 🎨 **Frontend/UI** | **Riya** | User Interface & User Experience | - |

---

## 📊 Data Sources

### Training Datasets
- **[Crop Recommendation Dataset](https://www.kaggle.com/atharvaingle/crop-recommendation-dataset)** - Custom agricultural dataset
- **[Fertilizer Suggestion Dataset](https://github.com/Gladiator07/Harvestify/blob/master/Data-processed/fertilizer.csv)** - Nutrient recommendation data
- **[Plant Disease Dataset](https://www.kaggle.com/vipoooool/new-plant-diseases-dataset)** - Comprehensive disease image collection

### External APIs
- **OpenWeatherMap API** - Real-time weather and climate data
- **Agricultural databases** - Soil and crop information
- **Government agricultural portals** - Regional farming data

---

## 📚 Research & Publications

### Kaggle Notebooks
- **[Crop Recommendation Analysis](https://www.kaggle.com/atharvaingle/what-crop-to-grow)** - ML approach to crop selection
- **[Disease Detection Research](https://www.kaggle.com/atharvaingle/plant-disease-classification-resnet-99-2)** - ResNet50 implementation

### Technical Approach
- **LSTM Networks**: Long Short-Term Memory for time-series crop analysis
- **Transfer Learning**: Pre-trained ResNet50 fine-tuning for agriculture
- **Feature Engineering**: Soil parameter optimization and weather correlation

---

## 🌟 Awards & Recognition

<div align="center">

### 🏆 Recognized By

**The New York Academy of Sciences** | **Rhodes Trust** | **Schmidt Futures**

*KANAD has been acknowledged for its innovative approach to sustainable agriculture and its potential for global impact.*

</div>

---

## 🚀 Demo

### 📺 Video Demonstration
[**Watch Our Demo Video**](https://drive.google.com/file/d/1Pb0S1yN6LG_mGJiVa-TJgYKtI8q4bfLc/view?usp=share_link)

### 📄 Presentation
[**View Complete Presentation**](https://drive.google.com/file/d/17iW1kPEimReZEi07QKlSh2A28EP6KyXH/view?usp=sharing)

### 🌐 Live Platform
**Experience KANAD**: [kanad.onrender.com](https://kanad.onrender.com/)

*Note: Initial loading may take 20 seconds as the server spins up from hibernate state*

---

## 🛠️ Development Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/Arshroop-Saini/Kanad-Integrating-ML-and-IoT.git

# For deployment-ready code
git checkout deploy

# Install dependencies
pip install -r requirements.txt
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URLs

# Run development servers
python app.py          # Backend on port 5000
npm run dev           # Frontend on port 3000
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build

# Access the application
open http://localhost:5000
```

---

## 🤝 Contributing

We welcome contributions to make KANAD even better for the global farming community!

### How to Contribute
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Install development dependencies** (`pip install -r requirements-dev.txt`)
4. **Make your changes** and add comprehensive tests
5. **Run the test suite** (`python -m pytest`)
6. **Commit your changes** (`git commit -m 'Add AmazingFeature'`)
7. **Push to the branch** (`git push origin feature/AmazingFeature`)
8. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript formatting
- Add unit tests for new features
- Update documentation for API changes
- Test IoT components thoroughly

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

**Project Lead**: [Aman Anubhav](https://linkedin.com/in/aman-anubhav-5055b6220)  
**Email**: kanad.agriculture@gmail.com  
**Website**: [kanad.onrender.com](https://kanad.onrender.com)  
**GitHub**: [KANAD Repository](https://github.com/Arshroop-Saini/Kanad-Integrating-ML-and-IoT)

---

## 🙏 Acknowledgments

- **FAO-UN** for global agricultural statistics and research data
- **USDA** for crop and soil datasets
- **OECD** for agricultural development insights
- **Kaggle Community** for dataset contributions and research notebooks
- **Open Source Community** for foundational technologies and frameworks

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- Core ML models for crop recommendation and disease detection
- Web platform development and deployment
- Basic IoT integration for smart irrigation

### Phase 2 (In Progress) 🚧
- Advanced LSTM models for time-series prediction
- Mobile application development
- Enhanced IoT sensor network expansion
- Multilingual support for global farmers

### Phase 3 (Planned) 📋
- Blockchain integration for supply chain tracking
- Satellite imagery analysis for large-scale farming
- AI-powered market price prediction
- Global partnership with agricultural organizations

---

<div align="center">

**🌿 Cultivating the Future of Agriculture 🌿**

*Making farming smarter, more sustainable, and more profitable through AI and IoT innovation*

**Made with ❤️ for farmers worldwide**

</div>
