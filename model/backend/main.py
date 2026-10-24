from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Resolve files from the project structure, not from the terminal's current directory.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "data" / "fires.csv"
MODEL_FILE = PROJECT_ROOT / "model" / "fire_model.pkl"

app = FastAPI(title="Forest Fire API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LAT = 20.5937
LON = 78.9629


def load_fires() -> pd.DataFrame:
    """Load and validate the CSV dataset used by the dashboard and map."""
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Fire dataset not found at: {DATA_FILE}",
        )

    df = pd.read_csv(DATA_FILE)
    required = {"latitude", "longitude", "brightness"}
    missing = required - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=500,
            detail=f"CSV is missing required columns: {sorted(missing)}",
        )

    # Remove rows that cannot be plotted on a map.
    df = df.dropna(subset=["latitude", "longitude", "brightness"]).copy()
    return df


def load_model():
    if not MODEL_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail=(
                f"Trained model not found at: {MODEL_FILE}. "
                "Run train_model.py to create it."
            ),
        )
    return joblib.load(MODEL_FILE)


def risk_from_brightness(brightness: float) -> str:
    if brightness > 340:
        return "High"
    if brightness > 330:
        return "Medium"
    return "Low"


def state_from_coordinates(latitude: float, longitude: float) -> str:
    # Approximate bounding boxes for a display label only; not a geospatial boundary service.
    checks = [
        ("Odisha", 19, 22, 84, 87),
        ("Chhattisgarh", 20, 24, 80, 84),
        ("Jharkhand", 22, 25, 84, 87),
        ("Telangana", 16, 19, 78, 81),
        ("Andhra Pradesh", 13, 18, 79, 85),
        ("Maharashtra", 16, 22, 72, 80),
        ("Madhya Pradesh", 21, 26, 74, 82),
        ("Karnataka", 11, 18, 74, 78),
        ("Kerala", 8, 13, 75, 77),
        ("Tamil Nadu", 8, 13, 77, 80),
        ("Gujarat", 20, 24, 68, 74),
        ("Rajasthan", 24, 30, 70, 77),
        ("Uttar Pradesh", 24, 30, 77, 84),
        ("Uttarakhand", 29, 31, 77, 81),
        ("Assam", 24, 28, 90, 96),
        ("Arunachal Pradesh", 27, 30, 91, 97),
        ("Nagaland", 25, 27, 93, 95),
        ("Mizoram", 22, 24, 92, 94),
        ("Manipur", 24, 26, 93, 95),
        ("Tripura", 23, 25, 91, 92),
        ("West Bengal", 21, 27, 86, 90),
    ]
    for name, lat_min, lat_max, lon_min, lon_max in checks:
        if lat_min <= latitude <= lat_max and lon_min <= longitude <= lon_max:
            return name
    return "Unknown"


@app.get("/")
def home():
    return {"message": "Forest Fire Risk Mapping API Running"}


@app.get("/api/dashboard")
def dashboard():
    df = load_fires()
    high_risk = int((df["brightness"] > 340).sum())
    medium_risk = int(
        ((df["brightness"] > 330) & (df["brightness"] <= 340)).sum()
    )
    return {
        "active_fires": int(len(df)),
        "high_risk_zones": high_risk,
        # This is a configured display figure, not a count derived from the CSV.
        "weather_stations": 37,
        "alerts_sent": high_risk + medium_risk,
    }


@app.get("/api/weather")
def weather():
    url = (
        "https://api.open-meteo.com/v1/forecast?"
        f"latitude={LAT}&longitude={LON}"
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        "&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max"
        "&timezone=auto&forecast_days=2"
    )
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
        current = data["current"]
        daily = data["daily"]
    except (requests.RequestException, KeyError, IndexError, ValueError) as exc:
        raise HTTPException(status_code=502, detail=f"Weather service unavailable: {exc}")

    temperature = float(current["temperature_2m"])
    humidity = float(current["relative_humidity_2m"])
    wind = float(current["wind_speed_10m"])

    def score_weather(temp, humid, wind_speed):
        score = 0
        score += 40 if temp > 35 else 25 if temp > 30 else 0
        score += 30 if humid < 30 else 15 if humid < 50 else 0
        score += 30 if wind_speed > 20 else 15 if wind_speed > 10 else 0
        level = "HIGH" if score >= 70 else "MEDIUM" if score >= 40 else "LOW"
        return score, level

    today_score, today_risk = score_weather(temperature, humidity, wind)
    tomorrow_temp = float(daily["temperature_2m_max"][1])
    tomorrow_wind = float(daily["wind_speed_10m_max"][1])
    # Humidity forecast is not supplied by the requested API fields; this is an estimate.
    tomorrow_humidity = max(20, humidity - 5)
    tomorrow_score, tomorrow_risk = score_weather(
        tomorrow_temp, tomorrow_humidity, tomorrow_wind
    )

    return {
        "temperature": temperature,
        "humidity": humidity,
        "wind": wind,
        "risk_score": today_score,
        "risk_level": today_risk,
        "tomorrow_temperature": tomorrow_temp,
        "tomorrow_humidity": tomorrow_humidity,
        "tomorrow_wind": tomorrow_wind,
        "tomorrow_score": tomorrow_score,
        "tomorrow_risk": tomorrow_risk,
    }


@app.get("/api/hotspots")
def hotspots():
    df = load_fires()

    # If a date column exists, show the most recent records first.
    if "acq_date" in df.columns:
        df["_sort_date"] = pd.to_datetime(df["acq_date"], errors="coerce")
        df = df.sort_values("_sort_date", ascending=False, na_position="last")

    # Return real observed coordinates from the CSV. Do not fabricate future locations.
    result = []
    for _, row in df.head(1000).iterrows():
        lat = float(row["latitude"])
        lon = float(row["longitude"])
        brightness = float(row["brightness"])
        item = {
            "name": "Observed Fire Detection",
            "lat": lat,
            "lng": lon,
            "risk": risk_from_brightness(brightness),
            "brightness": brightness,
            "state": state_from_coordinates(lat, lon),
        }
        for col in ("frp", "bright_t31", "acq_date", "acq_time", "satellite", "confidence"):
            if col in df.columns and pd.notna(row.get(col)):
                value = row[col]
                if isinstance(value, (np.integer,)):
                    value = int(value)
                elif isinstance(value, (np.floating,)):
                    value = float(value)
                else:
                    value = str(value)
                item[col] = value
        result.append(item)
    return result


@app.get("/api/ml_prediction")
def ml_prediction():
    df = load_fires()
    needed = {"brightness", "bright_t31", "frp"}
    missing = needed - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=500,
            detail=f"CSV is missing model features: {sorted(missing)}",
        )

    usable = df.dropna(subset=["brightness", "bright_t31", "frp"])
    if usable.empty:
        raise HTTPException(status_code=500, detail="No complete rows available for prediction.")

    latest = usable.iloc[0]
    features = np.array([[
        float(latest["brightness"]),
        float(latest["bright_t31"]),
        float(latest["frp"]),
    ]])

    model = load_model()
    prediction = int(model.predict(features)[0])
    risk = {2: "High", 1: "Medium", 0: "Low"}.get(prediction, "Unknown")

    return {
        "risk": risk,
        "brightness": float(latest["brightness"]),
        "surface_temperature": float(latest["bright_t31"]),
        "frp": float(latest["frp"]),
    }
