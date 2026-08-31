\# 🏃 Sports Injury Risk Detection



An AI-powered sports injury risk detection platform that combines

\*\*Machine Learning, Computer Vision, Pose Estimation, Biomechanical Analysis,

FastAPI, PostgreSQL, Docker, and React\*\* to analyze athlete information and

movement videos.



\---



\## 🎯 Project Overview



Sports injuries can occur because of abnormal movement patterns,

joint asymmetry, excessive movement, or training-related factors.



This project provides a platform that:



\- Analyzes athlete running and demographic information

\- Predicts potential injury risk using Machine Learning

\- Accepts athlete movement videos

\- Extracts human body landmarks using MediaPipe Pose Landmarker

\- Performs biomechanical movement analysis

\- Calculates joint angles, range of motion, asymmetry, and movement dynamics

\- Provides an interactive web dashboard for athletes and users



> \*\*Note:\*\* This project is an AI prototype for injury-risk assessment and

> movement analysis. It is not a medical diagnosis system.



\---



\# ✨ Key Features



\### 🤖 Machine Learning



\- Binary injury-risk classification

\- Random Forest classifier

\- Athlete metadata-based prediction

\- Injury-risk probability

\- Model evaluation using accuracy, precision, recall, and F1-score



\### 🎥 Computer Vision



\- Athlete video upload

\- MediaPipe Pose Landmarker

\- Human body landmark extraction

\- Frame-by-frame movement analysis



\### 📐 Biomechanical Analysis



The system extracts:



\- Knee joint angles

\- Hip joint angles

\- Elbow joint angles

\- Knee range of motion

\- Hip range of motion

\- Elbow range of motion

\- Left/right movement asymmetry

\- Angular velocity

\- Angular acceleration



\### 🌐 Full-Stack Application



\- React frontend

\- FastAPI backend

\- PostgreSQL database

\- JWT authentication

\- Docker containerization

\- REST APIs



\---



\# 🧠 Machine Learning



\## Dataset



The project uses a running/injury metadata dataset containing:



\- \*\*1,832 records\*\*

\- \*\*26 columns\*\*



The primary target column is:



InjDefn



For the final model, the problem was converted into binary classification:



No injury

&#x20;       ↓

No Injury



Injury-related categories

&#x20;       ↓

Injury Risk





📊 Machine Learning Features



The model uses athlete demographic and running-related information such as:



Feature	Description

speed\_r	Running speed

age	Athlete age

Height	Athlete height

Weight	Athlete weight

Gender	Athlete gender

DominantLeg	Dominant leg

Activities	Athlete activities

Level	Running level

YrsRunning	Years of running experience

RaceDistance	Race distance

YrPR	Previous race-performance year

NumRaces	Number of races



📈 Model Performance



The final binary Random Forest classifier achieved:



81.77% Test Accuracy

Classification Report

Class	Precision	Recall	F1-score

No Injury	0.83	0.64	0.73

Injury Risk	0.81	0.92	0.86

Overall Accuracy			0.82



The 92% recall for Injury Risk is particularly useful for this

prototype because identifying most potentially risky cases is important.



The model is not clinically validated and the reported performance is

based on the available dataset and held-out test set.





🎥 Video Analysis Pipeline



The video analysis pipeline works independently from the metadata-based

Random Forest prediction.



Athlete Video

&#x20;     │

&#x20;     ▼

OpenCV Video Processing

&#x20;     │

&#x20;     ▼

MediaPipe Pose Landmarker

&#x20;     │

&#x20;     ▼

Body Landmarks

&#x20;     │

&#x20;     ▼

Biomechanical Feature Extraction

&#x20;     │

&#x20;     ├── Joint Angles

&#x20;     ├── Range of Motion

&#x20;     ├── Left/Right Asymmetry

&#x20;     ├── Angular Velocity

&#x20;     └── Angular Acceleration

&#x20;     │

&#x20;     ▼

Video Analysis Results



🏗️ System Architecture

&#x20;                  ┌──────────────────────┐

&#x20;                  │    React Frontend    │

&#x20;                  │      Port 5173       │

&#x20;                  └──────────┬───────────┘

&#x20;                             │

&#x20;                             │ REST API

&#x20;                             ▼

&#x20;                  ┌──────────────────────┐

&#x20;                  │    FastAPI Backend   │

&#x20;                  │      Port 8000       │

&#x20;                  └───────┬───────┬──────┘

&#x20;                          │       │

&#x20;             ┌────────────┘       └─────────────┐

&#x20;             ▼                                  ▼

&#x20;      ┌───────────────┐                 ┌─────────────────┐

&#x20;      │ PostgreSQL DB │                 │ ML / CV Layer  │

&#x20;      │    Port 5433  │                 │                 │

&#x20;      └───────────────┘                 │ Random Forest  │

&#x20;                                        │ MediaPipe      │

&#x20;                                        │ OpenCV         │

&#x20;        

&#x20;       

&#x20;                       └─────────────────┘

🗄️ Database ER Diagram



The current application uses a user-to-video relationship.



Relationship

Users

&#x20; │

&#x20; │ 1

&#x20; │

&#x20; │

&#x20; │ N

Videos



One user can upload multiple videos.



Each video belongs to exactly one authenticated user.





🔄 Video Database Workflow

User Login

&#x20;   │

&#x20;   ▼

JWT Authentication

&#x20;   │

&#x20;   ▼

Upload Athlete Video

&#x20;   │

&#x20;   ▼

Video Record Created

&#x20;   │

&#x20;   ▼

status = uploaded

&#x20;   │

&#x20;   ▼

Analyze Video

&#x20;   │

&#x20;   ▼

MediaPipe Processing

&#x20;   │

&#x20;   ▼

Biomechanical Analysis

&#x20;   │

&#x20;   ▼

status = completed





🔐 Authentication



The application uses JWT-based authentication.



User

&#x20;│

&#x20;▼

Login

&#x20;│

&#x20;▼

FastAPI Authentication

&#x20;│

&#x20;▼

JWT Access Token

&#x20;│

&#x20;▼

React localStorage

&#x20;│

&#x20;▼

Authenticated API Requests



Protected video endpoints require:



Authorization: Bearer <access\_token>





🔌 Main API Endpoints

Method	Endpoint	Purpose

GET	/	API health/message

POST	/predict	Predict injury risk

POST	/videos/upload	Upload athlete video

GET	/videos/	List user's videos

GET	/videos/{video\_id}	Get video details

POST	/videos/{video\_id}/analyze	Analyze athlete video



FastAPI interactive documentation:

http://localhost:8000/docs





🛠️ Technology Stack



Frontend

React

Vite

JavaScript

CSS

Backend

Python

FastAPI

Uvicorn

SQLAlchemy

Alembic

JWT Authentication

Machine Learning

Pandas

NumPy

Scikit-learn

Random Forest

Computer Vision

OpenCV

MediaPipe Pose Landmarker

Database

PostgreSQL

DevOps

Docker

Docker Compose

Git

GitHub



🔮 Future Improvements



Train a model directly on biomechanical video features

Combine athlete metadata and video-derived features

Add temporal deep-learning models such as LSTM/Transformer architectures

Add risk-level visualization

Add movement-quality charts

Add athlete history and progress tracking

Add automated PDF reports

Add cloud deployment

Improve model validation with larger datasets

Perform clinical validation before real-world medical use



📁 Project Structure

sports-injury-risk-detection/

│

├── backend/

│   ├── app/

│   │   ├── database/

│   │   ├── models/

│   │   ├── routes/

│   │   ├── schemas/

│   │   └── services/

│   │

│   ├── dataset/

│   │   └── features.csv

│   │

│   ├── ml/

│   │   ├── api.py

│   │   ├── train\_model.py

│   │   ├── train\_binary\_model.py

│   │   ├── injury\_risk\_model.pkl

│   │   └── injury\_risk\_binary\_model.pkl

│   │

│   ├── models/

│   │   └── pose\_landmarker\_lite.task

│   │

│   ├── scripts/

│   ├── Dockerfile

│   └── requirements.txt

│

├── frontend/

│   └── src/

│       ├── components/

│       │   ├── Dashboard.jsx

│       │   ├── Login.jsx

│       │   └── RiskAssessment.jsx

│       ├── App.jsx

│       └── App.css

│

├── docs/

│   ├── api.md

│   ├── database.md

│   ├── project-overview.md

│   └── workflow.md

│

├── docker-compose.yml

├── README.md

└── .gitignore





