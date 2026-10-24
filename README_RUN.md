# 🔥 Forest Fire Prediction and Risk Mapping System

An AI/ML-based web application that visualizes forest fire observations and provides fire-risk classifications through an interactive dashboard and map.

## 🚀 Features

* 🗺️ **Fire Hotspot Mapping:** Visualizes observed fire locations on an interactive map.
* 🤖 **Machine Learning:** Uses a Random Forest classifier for fire-risk classification.
* 📊 **Interactive Dashboard:** Displays fire-related data and analytics.
* 🌦️ **Weather Integration:** Includes an API endpoint for weather-related information.
* ⚡ **REST API:** Uses FastAPI to connect the frontend and backend.

## 🛠️ Tech Stack

* **Frontend:** React, Vite
* **Backend:** Python, FastAPI
* **Machine Learning:** Scikit-learn, Random Forest
* **Data Processing:** Pandas, NumPy
* **Model Storage:** Joblib

## 📂 Project Structure

```text
Forest-Fire-Prediction/
├── data/
│   └── fires.csv
├── frontend/
├── model/
│   ├── backend/
│   │   ├── main.py
│   │   └── train_model.py
│   └── fire_model.pkl
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/chitturitarunkumar/Forest-Fire-Prediction.git
cd Forest-Fire-Prediction
```

### 2. Start the backend

```powershell
cd model/backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install fastapi uvicorn joblib numpy pandas requests scikit-learn
python -m uvicorn main:app --reload
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🤖 Machine Learning

The project uses a Random Forest classifier trained with fire-related measurements, including brightness, brightness temperature, and fire radiative power (FRP).

**Note:** Current training labels are derived from brightness thresholds. The model demonstrates risk classification and is not a validated forecast of future fire occurrence or spread.

## 🔮 Future Improvements

* Integrate updated satellite observations.
* Incorporate weather data into risk analysis.
* Improve model validation and prediction accuracy.
* Add historical fire analysis and advanced map filters.

## 👨‍💻 Author

**Tarun Kumar**

GitHub: https://github.com/chitturitarunkumar
