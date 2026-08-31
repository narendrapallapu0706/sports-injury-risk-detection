import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score


DATA_PATH = r"C:\Users\NARENDRA PALLAPU\Downloads\run_data_meta.csv"

df = pd.read_csv(DATA_PATH)

# Keep only rows with known injury status
df = df.dropna(subset=["InjDefn"]).copy()

# Binary target
df["injury_risk"] = (df["InjDefn"] != "No injury").astype(int)

# Clean unrealistic values
df.loc[(df["age"] < 18) | (df["age"] > 100), "age"] = np.nan
df.loc[(df["Height"] <= 0) | (df["Height"] > 250), "Height"] = np.nan
df.loc[(df["Weight"] <= 0) | (df["Weight"] > 250), "Weight"] = np.nan
df.loc[(df["YrsRunning"] < 0) | (df["YrsRunning"] > 80), "YrsRunning"] = np.nan

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
y = df["injury_risk"]

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

numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median"))
])

categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced"
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["No Injury", "Injury Risk"]
))

joblib.dump(
    pipeline,
    "backend/ml/injury_risk_binary_model.pkl"
)

print("\nModel saved to: backend/ml/injury_risk_binary_model.pkl")