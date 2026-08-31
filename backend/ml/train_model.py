import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib


# Load dataset
DATA_PATH = r"C:\Users\NARENDRA PALLAPU\Downloads\run_data_meta.csv"

df = pd.read_csv(DATA_PATH)

# Remove rows without a target
df = df.dropna(subset=["InjDefn"]).copy()

# Remove unrealistic values
df.loc[(df["age"] < 18) | (df["age"] > 100), "age"] = np.nan
df.loc[(df["Height"] <= 0) | (df["Height"] > 250), "Height"] = np.nan
df.loc[(df["Weight"] <= 0) | (df["Weight"] > 250), "Weight"] = np.nan
df.loc[(df["YrsRunning"] < 0) | (df["YrsRunning"] > 80), "YrsRunning"] = np.nan

# Features available before/independent of injury outcome
features = [
    "speed_r",
    "age",
    "Height",
    "Weight",
    "Gender",
    "DominantLeg",
    "Activities",
    "Level",
    "YrsRunning",
    "RaceDistance",
    "YrPR",
    "NumRaces"
]

X = df[features]
y = df["InjDefn"]

# Identify feature types
numeric_features = [
    "speed_r",
    "age",
    "Height",
    "Weight",
    "YrsRunning",
    "YrPR",
    "NumRaces"
]

categorical_features = [
    "Gender",
    "DominantLeg",
    "Activities",
    "Level",
    "RaceDistance"
]

# Numeric preprocessing
numeric_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]
)

# Categorical preprocessing
categorical_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ]
)

# Combine preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)

# Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save model
MODEL_PATH = "backend/ml/injury_risk_model.pkl"
joblib.dump(pipeline, MODEL_PATH)

print(f"\nModel saved to: {MODEL_PATH}")