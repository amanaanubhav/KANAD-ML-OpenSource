import os
from dotenv import load_dotenv

load_dotenv()

weather_api_key = os.environ.get("WEATHER_API_KEY", "")
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
port = int(os.environ.get("PORT", 5000))
