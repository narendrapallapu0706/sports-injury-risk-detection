import os
from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.routes.auth import router as auth_router
from app.routes.health import router as health_router
from app.routes.users import router as users_router
from app.routes.videos import router as videos_router


app = FastAPI(
    title="Sports Injury Risk Detection API",
    version="1.0.0",
)


allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained ML model
MODEL_PATH = Path("/app/ml/injury_risk_binary_model.pkl")

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
    return {
        "message": "Sports Injury Risk Detection API is running"
    }


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
        "prediction": (
            "Injury Risk"
            if prediction == 1
            else "No Injury"
        ),
        "risk_probability": round(
            float(risk_probability) * 100,
            2,
        ),
    }


app.include_router(users_router)
app.include_router(auth_router)
app.include_router(health_router)
app.include_router(videos_router)