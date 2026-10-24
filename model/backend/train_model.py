from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "data" / "fires.csv"
MODEL_FILE = PROJECT_ROOT / "model" / "fire_model.pkl"

if not DATA_FILE.exists():
    raise FileNotFoundError(f"Dataset not found: {DATA_FILE}")

df = pd.read_csv(DATA_FILE)
required = ["brightness", "bright_t31", "frp"]
missing = [column for column in required if column not in df.columns]
if missing:
    raise ValueError(f"CSV is missing required columns: {missing}")

df = df[required].apply(pd.to_numeric, errors="coerce").dropna()
if len(df) < 5:
    raise ValueError("Not enough complete rows to train a model (need at least 5).")

def create_label(brightness):
    if brightness >= 340:
        return 2  # High
    if brightness >= 330:
        return 1  # Medium
    return 0      # Low

df["risk"] = df["brightness"].apply(create_label)
X = df[required]
y = df["risk"]

# The model is trained on labels derived from brightness thresholds.
# Its predictions reproduce those labels; they are not a validated forecast of future fire spread.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model accuracy against threshold-derived labels: {accuracy * 100:.2f}%")

MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL_FILE)
print(f"Model saved to: {MODEL_FILE}")
