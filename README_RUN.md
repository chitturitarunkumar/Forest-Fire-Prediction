# Forest Fire Prediction Dashboard (fixed paths)

## Folder structure
- `data/fires.csv`: fire detection dataset
- `model/fire_model.pkl`: saved model (included if present in the original project)
- `model/backend/main.py`: FastAPI backend
- `model/backend/train_model.py`: model training script
- `frontend/`: React + Vite UI

## Run the backend (Windows PowerShell)

Open VS Code in the `python_project` folder, then open a terminal:

```powershell
cd model/backend
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

If there is no `venv` folder in the extracted copy, create one and install dependencies:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn joblib numpy pandas requests scikit-learn
```

Backend test pages:
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/api/dashboard`
- `http://127.0.0.1:8000/api/hotspots`
- `http://127.0.0.1:8000/api/ml_prediction`

If the saved model file is missing, train it from the backend folder:

```powershell
python train_model.py
```

## Run the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`).

Keep both terminals running.

## Important model note
The current training labels are generated from brightness thresholds. The resulting model classifies risk using those labels; it is not a validated forecast of future fire spread. The map now plots observed coordinates from the CSV instead of drawing fabricated predicted coordinates.
