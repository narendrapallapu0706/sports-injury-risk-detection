from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Sports Injury Risk Detection API")

MODEL_PATH = "backend/ml/injury_risk_binary_model.pkl"
model = joblib.load(MODEL_PATH)


class AthleteData(BaseModel):
    speed_r: float
    age: float
    Height: float | None = None
    Weight: float | None = None
    Gender: str
    DominantLeg: str | None = None
    Activities: str | None = None
    Level: str | None = None
    YrsRunning: float | None = None
    RaceDistance: str | None = None
    YrPR: float | None = None
    NumRaces: float | None = None


@app.get("/")
def home():
    return {"message": "Sports Injury Risk Detection API is running"}


@app.post("/predict")
def predict(data: AthleteData):

    input_data = pd.DataFrame([data.model_dump()])

    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]

    classes = model.classes_
    probability_map = dict(zip(classes, probabilities))

    risk_probability = probability_map.get(1, 0.0)

    return {
        "injury_risk": int(prediction),
        "prediction": "Injury Risk" if prediction == 1 else "No Injury",
        "risk_probability": round(float(risk_probability) * 100, 2)
    }